## Why

El sistema necesita permitir a los administradores gestionar el catálogo de productos (crear, editar, eliminar categorías, ingredientes y productos) y a los clientes navegar el catálogo público con filtros, búsqueda y paginación. Sin esta funcionalidad, no existe forma de mostrar ni administrar el inventario de la tienda.

## What Changes

- **Backend**: Nuevos endpoints REST para gestión de categorías, ingredientes y productos con autenticación RBAC (roles STOCK, ADMIN). Catálogo público sin autenticación con filtros, búsqueda y paginación.
- **Frontend**: Pages admin para CRUD de categorías, ingredientes, productos. Catálogo público con filtros, búsqueda, paginación, y detail view de producto.
- **Base de datos**: Nuevas tablas Category (jerárquica), Ingredient (con alérgenos), Product (con relaciones a categorías e ingredientes), ProductIngredient (asociación Many-to-Many).
- **Dependencias nuevas**: Ninguna — usa infraestructura existente (BaseRepository, UoW, manejo de errores RFC 7807).

## Capabilities

### New Capabilities
- `product-categories`: CRUD de categorías jerárquicas con profundidad ilimitada, soft delete, endpoints GET/POST/PUT/DELETE.
- `product-ingredients`: CRUD de ingredientes con información de alérgenos, soft delete, endpoints GET/POST/PUT/DELETE.
- `product-management`: CRUD completo de productos con asociaciones a categorías (Many-to-Many) e ingredientes (Many-to-Many), gestión de stock, pricing, soft delete.
- `public-catalogue`: Catálogo público con filtros (categoría, alérgenos, precio), búsqueda por nombre, paginación, y detalle de producto.

### Modified Capabilities
- (ninguna — no hay cambios en specs existentes)

## Impact

- **Backend**: Nuevos módulos en `backend/app/` — `categories/`, `ingredients/`, `products/`, `catalogue/` con sus respectivos routers, services, repositories, schemas.
- **Frontend**: Nuevas pages en `frontend/src/pages/` — CategoriesPage, IngredientsPage, ProductsPage, CataloguePage, ProductDetailPage. Componentes para filtros, cards de producto, paginación.
- **Base de datos**: Tablas `categories`, `ingredients`, `products`, `products_ingredients` con migraciones Alembic.
- **API**: Endpoints `/api/categories`, `/api/ingredients`, `/api/products`, `/api/catalogue` — permisos diferenciados (público vs admin).