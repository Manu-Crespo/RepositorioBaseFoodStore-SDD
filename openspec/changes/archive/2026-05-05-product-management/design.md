## Context

Este change implementa la gestión del catálogo de productos después de que el sistema de autenticación y RBAC (Change 3) está operativo. El catálogo es el núcleo del e-commerce — sin él, no hay productos que comprar, ni carrito, ni pedidos.

**Estado actual del sistema:**
- Backend con FastAPI, SQLAlchemy async, PostgreSQL (Change 1)
- Frontend con React + Vite + Zustand (Change 2)
- Autenticación JWT con RBAC de 4 roles: CUSTOMER, STOCK, PEDIDOS, ADMIN (Change 3)
- Repositorios base, Unit of Work, manejo de errores RFC 7807

**Stakeholders:**
- Administradores ( STOCK, ADMIN): gestionan categorías, ingredientes, productos
- Clientes (CUSTOMER): navegan catálogo público, ven detalles de producto
- Desarrolladores: mantienen el código del catálogo

## Goals / Non-Goals

**Goals:**
- CRUD completo de categorías jerárquicas con profundidad ilimitada (estructura de árbol)
- CRUD de ingredientes con información de alérgenos
- CRUD de productos con asociaciones Many-to-Many a categorías e ingredientes
- Catálogo público con filtros (categoría, alérgenos, rango de precio), búsqueda por nombre, y paginación
- Soft delete en todas las entidades (no eliminación física)
- Control de acceso: roles STOCK/ADMIN para gestión, público para catálogo

**Non-Goals:**
- No incluye gestión de imágenes de productos (futuro change)
- No incluye variantes de producto (tamaños, colores) — producto simple único
- No incluye recomendaciones personalization (futuro change)
- No integra con carrito ni pedidos — eso es Change 8 y 9

## Decisions

### 1. Estructura de categorías jerárquicas

**Decisión:** Usar **materialized path** (path como string de IDs) en lugar de adjacent list (parent_id) o recursive CTE.

**Alternativas consideradas:**
- `parent_id` (adjacent list): Simple pero require recursive queries para tree traversal
- Recursive CTE: Flexible pero más complejo en SQLAlchemy
- Materialized path (`path: "1/5/12/"`): queries simples, fácil construir breadcrumbs

**Rationale:** El materialized path permite:
- Obtener todos los descendientes con `SELECT * FROM categories WHERE path LIKE '1/5/%'`
- Obtener breadcrumbs con split del path
- Mover subárboles actualizando el prefijo del path
- Queries simples sin CTE complejos

### 2. Modelo de datos: Ingredient con alérgenos

**Decisión:** Campo `allergens` como ARRAY de strings (PostgreSQL) con valores predefinidos.

**Alternativas:**
- Tabla separada `allergens` + Many-to-Many: Más normalization pero más complejo
- Enum fijo: Limitado, no permite agregar nuevos fácil

**Rationale:** ARRAY de strings es simple, permite filtros `allergens && array['gluten', 'lacteos']` directo en PostgreSQL, y los alérgenos comunes se validan en aplicación.

### 3. Asociación Productos-Ingredientes

**Decisión:** Tabla explícita `products_ingredients` con columna adicional `is_allergen`.

**Alternativas:**
- Solo Many-to-Mary en Product: No distingue si el ingrediente es alérgeno
- Sin tabla: Ingredient embebido en Product como JSON — pierdes queries

**Rationale:** Permite filtrar productos por alérgenos: `SELECT p.* FROM products p JOIN products_ingredients pi ON p.id = pi.product_id WHERE pi.is_allergen = true AND pi.ingredient_id IN (allergen_ids)`. Además permite validar que producto no contenga ciertos alérgenos al crear pedido.

### 4. Paginación del catálogo público

**Decisión:** Paginación basada en cursor (cursor-based) en lugar de offset.

**Alternativas:**
- Offset: `OFFSET 100 LIMIT 20` — Problemas con datos que cambian mientras el usuario pagina
- Cursor: `WHERE id < last_seen_id` — Más estable, mejor performance en grandes datasets

**Rationale:** Para e-commerce con alta rotación de productos, cursor es más predecible. Además, el filtro de "products después del último visto" es más rápido que offset en tablas grandes.

### 5. Control de acceso en endpoints

**Decisión:** Endpoints de gestión en `/api/admin/categories`, `/api/admin/ingredients`, `/api/admin/products`. Endpoints públicos en `/api/catalogue`.

**Alternativas:**
- Mismo path con permisos: `/api/categories` con diferentes permisos
- Prefijo diferenciado: Más claro qué es admin vs público

**Rationale:** Separación clara por path. El prefijo `/api/admin/` indica claramente qué requiere rol especial.

## Risks / Trade-offs

### Risk: Productos huérfanos cuando se elimina categoría
**Mitigation:** Soft delete solo — el producto queda pero sin categoría activa. Query de catálogo filtra `category_id IN (SELECT id FROM categories WHERE deleted_at IS NULL)`.

### Risk: Categoría con productos no puede eliminarse
**Mitigation:** Endpoint de eliminar retorna 409 Conflict si existen productos activos asociados. Usuario debe reasignar o eliminar productos primero.

### Risk: Alérgenos no actualizados cuando se modifica ingrediente
**Mitigation:** Productos guardan referencia a ingredient_id — cuando ingrediente cambia (ej. nuevo alérgeno), el producto automáticamente lo refleja. En creación de pedido se consulta ingredient actual, no snapshot.

### Risk: Catálogo lento con muchos productos
**Mitigation:** Índices en `products(name)` para búsqueda, `products(category_id)` para filtro, `products(deleted_at)` con partial index solo activos. Cache del catálogo en Redis (futuro).

### Trade-off: Profundidad de categorías limitada por longitud del path
**Mitigation:** Campo `path` limitado a 500 chars (aproximadamente 50 niveles de profundidad — suficiente para e-commerce). Advertencia en UI cuando se alcanza límite.

## Migration Plan

1. **Crear tablas** con migraciones Alembic: categories, ingredients, products, products_ingredients
2. **Crear modelos SQLAlchemy** en `backend/app/models/`
3. **Crear repositories** (CategoryRepository, IngredientRepository, ProductRepository) extendiendo BaseRepository
4. **Crear schemas** Pydantic para request/response validation
5. **Crear routers** FastAPI con endpoints de gestión y públicos
6. **Frontend**: Crear páginas y componentes del catálogo
7. **Verificar** que soft delete funciona correctamente
8. **Deploy**: Sin downtime — solo migración de tablas nuevas

No hay datos existentes que migrar — es un change greenfield para estas entidades.

## Open Questions

1. **¿Cuántas imágenes por producto?** Por ahora none — MVP simple. Cuando se agregue, ¿珠江图片, S3, CDN?
2. **¿Precios con moneda?** Por ahora solo un campo `price` numérico. ¿Soporte para múltiples monedas en futuro?
3. **¿Stock negativo permitido?** Por ahora no — `stock >= 0`. En checkout se valida disponibilidad.
4. **¿Búsqueda por descripción además de nombre?** MVP solo nombre. Descripción en futuro.