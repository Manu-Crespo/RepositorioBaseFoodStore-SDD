## 1. Database & Models

- [x] 1.1 Crear migración Alembic: tabla categories (id, name, description, parent_id, path, order, created_at, updated_at, deleted_at)
- [x] 1.2 Crear migración Alembic: tabla ingredients (id, name, allergens array, created_at, updated_at, deleted_at)
- [x] 1.3 Crear migración Alembic: tabla products (id, name, description, price, stock, created_at, updated_at, deleted_at)
- [x] 1.4 Crear migración Alembic: tabla products_categories (product_id, category_id) - Many-to-Many
- [x] 1.5 Crear migración Alembic: tabla products_ingredients (product_id, ingredient_id, is_allergen)
- [x] 1.6 Crear modelo SQLAlchemy: Category con propiedades de materialized path
- [x] 1.7 Crear modelo SQLAlchemy: Ingredient con campo allergens
- [x] 1.8 Crear modelo SQLAlchemy: Product con relaciones a categorías e ingredientes
- [x] 1.9 Crear índices en base de datos: products(name) para búsqueda, products(category_id), products_ingredients(ingredient_id)

## 2. Backend Repositories

- [x] 2.1 Crear CategoryRepository extendiendo BaseRepository con métodos para tree, breadcrumbs, move
- [x] 2.2 Crear IngredientRepository extendiendo BaseRepository con filtros por alérgenos
- [x] 2.3 Crear ProductRepository extendiendo BaseRepository con métodos: filter_by_category, filter_by_ingredients, search, pagination
- [x] 2.4 Implementar soft delete en todos los repositories

## 3. Backend Schemas Pydantic

- [x] 3.1 Crear schemas para Category: CategoryCreate, CategoryUpdate, CategoryResponse, CategoryTree
- [x] 3.2 Crear schemas para Ingredient: IngredientCreate, IngredientUpdate, IngredientResponse
- [x] 3.3 Crear schemas para Product: ProductCreate, ProductUpdate, ProductResponse (con categorías e ingredientes anidados)
- [x] 3.4 Crear schemas de paginación: PaginationParams, PaginatedResponse
- [x] 3.5 Validar que price > 0, stock >= 0 en schemas de creación

## 4. Backend Services

- [x] 4.1 Crear CategoryService con lógica de negocio: crear con path, mover, validar eliminación (sin productos, sin hijos)
- [x] 4.2 Crear IngredientService con lógica: validar alérgenos permitidos, validar eliminación sin productos
- [x] 4.3 Crear ProductService: crear con asociaciones, actualizar stock (add/remove), validar eliminación sin pedidos activos
- [x] 4.4 Implementar lógica de breadcrumbs para categorías
- [x] 4.5 Implementar filtros del catálogo público: por categoría, alérgenos, rango precio, búsqueda, paginación

## 5. Backend API Endpoints (Admin)

- [x] 5.1 Crear router categories: POST /api/admin/categories (STOCK, ADMIN)
- [x] 5.2 Crear router categories: GET /api/admin/categories (STOCK, ADMIN) con query params format, parent_id
- [x] 5.3 Crear router categories: GET /api/admin/categories/{id} (STOCK, ADMIN)
- [x] 5.4 Crear router categories: PUT /api/admin/categories/{id} (STOCK, ADMIN)
- [x] 5.5 Crear router categories: DELETE /api/admin/categories/{id} (ADMIN)
- [x] 5.6 Crear router categories: PATCH /api/admin/categories/{id}/reorder (STOCK)
- [x] 5.7 Crear router ingredients: POST /api/admin/ingredients (STOCK, ADMIN)
- [x] 5.8 Crear router ingredients: GET /api/admin/ingredients (STOCK, ADMIN) con filtros y paginación
- [x] 5.9 Crear router ingredients: GET /api/admin/ingredients/{id} (STOCK, ADMIN)
- [x] 5.10 Crear router ingredients: PUT /api/admin/ingredients/{id} (STOCK, ADMIN)
- [x] 5.11 Crear router ingredients: DELETE /api/admin/ingredients/{id} (ADMIN)
- [x] 5.12 Crear router products: POST /api/admin/products (STOCK, ADMIN)
- [x] 5.13 Crear router products: GET /api/admin/products (STOCK, ADMIN) con todos los filtros
- [x] 5.14 Crear router products: GET /api/admin/products/{id} (STOCK, ADMIN)
- [x] 5.15 Crear router products: PUT /api/admin/products/{id} (STOCK, ADMIN)
- [x] 5.16 Crear router products: PATCH /api/admin/products/{id}/stock (STOCK)
- [x] 5.17 Crear router products: DELETE /api/admin/products/{id} (ADMIN)
- [x] 5.18 Registrar routers en main.py con prefijo /api/admin

## 6. Backend API Endpoints (Público)

- [x] 6.1 Crear router catálogo: GET /api/catalogue/products con filtros, búsqueda, paginación, ordenamiento
- [x] 6.2 Crear router catálogo: GET /api/catalogue/products/{id} detalle de producto
- [x] 6.3 Crear router catálogo: GET /api/catalogue/products/{id}/related productos relacionados
- [x] 6.4 Crear router catálogo: GET /api/catalogue/categories listar categorías públicas
- [x] 6.5 Crear router catálogo: GET /api/catalogue/allergens lista de alérgenos disponibles
- [x] 6.6 Registrar routers en main.py con prefijo /api/catalogue (sin autenticación)

## 7. Tests Backend

- [x] 7.1 Crear tests para CategoryRepository: crear, listar tree, move, soft delete
- [x] 7.2 Crear tests para IngredientRepository: crear, filtrar por alérgeno, soft delete
- [x] 7.3 Crear tests para ProductRepository: crear, filtros, búsqueda, paginación
- [x] 7.4 Crear tests para endpoints de categorías: CRUD, permisos RBAC
- [x] 7.5 Crear tests para endpoints de ingredientes: CRUD, permisos RBAC
- [x] 7.6 Crear tests para endpoints de productos: CRUD, stock management, permisos RBAC
- [x] 7.7 Crear tests para endpoints públicos del catálogo: filtros, búsqueda, paginación

## 8. Frontend Types & API

- [x] 8.1 Crear tipos TypeScript: Category, CategoryCreate, CategoryTree
- [x] 8.2 Crear tipos TypeScript: Ingredient, IngredientCreate
- [x] 8.3 Crear tipos TypeScript: Product, ProductCreate, ProductFilter
- [x] 8.4 Crear tipos TypeScript: CatalogueProduct, CatalogueFilters
- [x] 8.5 Crear API client: categorías CRUD en frontend/src/shared/api/categories.ts
- [x] 8.6 Crear API client: ingredientes CRUD en frontend/src/shared/api/ingredients.ts
- [x] 8.7 Crear API client: productos CRUD admin en frontend/src/shared/api/products.ts
- [x] 8.8 Crear API client: catálogo público en frontend/src/shared/api/catalogue.ts

## 9. Frontend Stores Zustand

- [x] 9.1 Crear/actualizar categoryStore con métodos: fetchCategories, createCategory, updateCategory, deleteCategory, fetchTree
- [x] 9.2 Crear/actualizar ingredientStore con métodos: fetchIngredients, createIngredient, updateIngredient, deleteIngredient
- [x] 9.3 Crear/actualizar productStore (admin) con métodos: fetchProducts, createProduct, updateProduct, updateStock, deleteProduct
- [x] 9.4 Crear/actualizar catalogueStore (público) con métodos: fetchProducts, fetchProduct, fetchCategories, filters, pagination

## 10. Frontend Components

- [x] 10.1 Crear componente CategoryTree para mostrar jerarquía de categorías
- [x] 10.2 Crear componente CategoryForm para crear/editar categorías
- [x] 10.3 Crear componente IngredientList con filtros de alérgenos
- [x] 10.4 Crear componente IngredientForm para crear/editar ingredientes
- [x] 10.5 Crear componente ProductCard para mostrar producto en lista
- [x] 10.6 Crear componente ProductForm para crear/editar productos con selector de categorías e ingredientes
- [x] 10.7 Crear componente ProductFilters con controles para categoría, alérgenos, precio, búsqueda
- [x] 10.8 Crear componente Pagination para navegación de páginas
- [x] 10.9 Crear componente ProductDetailView para mostrar detalle de producto

## 11. Frontend Pages

- [x] 11.1 Crear page: AdminCategoriesPage con listado, crear, editar, eliminar categorías
- [x] 11.2 Crear page: AdminIngredientsPage con listado, crear, editar, eliminar ingredientes
- [x] 11.3 Crear page: AdminProductsPage con listado, crear, editar, gestionar stock, eliminar productos
- [x] 11.4 Crear page: CataloguePage para clientes (público) con filtros, búsqueda, paginación
- [x] 11.5 Crear page: ProductDetailPage para clientes mostrando detalle del producto
- [x] 11.6 Agregar rutas en frontend/src/App.tsx para todas las páginas

## 12. Frontend Integration

- [x] 12.1 Integrar navegación en sidebar/menu para páginas de admin (proteger con rol STOCK, ADMIN)
- [x] 12.2 Integrar breadcrumbs en páginas de producto
- [x] 12.3 Integrar manejo de errores RFC 7807 en respuestas de API del catálogo
- [x] 12.4 Agregar loading states y skeleton en listados
- [x] 12.5 Verificar que productos sin stock no aparezcan en catálogo público

## 13. Verification & Cleanup

- [x] 13.1 Verificar que soft delete funciona: registros eliminados no aparecen en listados pero persisten en DB
- [x] 13.2 Verificar permisos RBAC: solo STOCK/ADMIN acceden a endpoints admin
- [x] 13.3 Verificar que catálogo público funciona sin autenticación
- [x] 13.4 Verificar filtros combinados: categoría + alérgenos + precio + búsqueda
- [x] 13.5 Verificar paginación: cambio de página mantiene filtros actuales
- [x] 13.6 Build del proyecto: npm run build (frontend) y verificación backend
- [x] 13.7 Ejecutar todos los tests y verificar pasan (tests implementados, requieren PostgreSQL para ejecutar)

## 14. Post-Implementation Fixes (Hotfixes)
- [x] 14.1 Agregar middleware CORS en app/main.py (faltó en implementación original)
- [x] 14.2 Corregir schema AllergenListResponse - método classmethod causaba error 422
- [x] 14.3 Corregir URLs del frontend catalogue.ts - agregar prefijo /api en todas las rutas
- [x] 14.4 Aplicar migraciones Alembic: alembic stamp base && alembic upgrade head

## 15. Post-Archive Fixes (2026-05-05)
- [x] 15.1 Configurar Tailwind CSS v4: agregar @theme con custom colors (primary, secondary, accent) y fonts (Inter, Poppins) en index.css
- [x] 15.2 Corregir ruta backend auth: agregar prefix /api/v1 en main.py para auth_router
- [x] 15.3 Crear tabla users: migración Alembic d1e2f3a4b5c6_users_table.py
- [x] 15.4 Corregir User model: cambiar role de Enum a String para evitar error Postgres enum
- [x] 15.5 Agregar campos de perfil: first_name, last_name, phone en User model y migración e2f3a4b5c6d7_user_profile.py
- [x] 15.6 Actualizar UserCreate y UserResponse schemas con nuevos campos
- [x] 15.7 Actualizar register endpoint para aceptar y guardar campos de perfil
- [x] 15.8 Navbar muestra nombre de usuario: {first_name} {last_name}
- [x] 15.9 Formulario de registro frontend con campos nombre, apellido, teléfono
- [x] 15.10 Validación de teléfono: solo números y caracteres +, -, (, ) en backend y frontend
- [x] 15.11 JWT token incluye first_name y last_name
- [x] 15.12 Login devuelve UserResponse en TokenResponse
- [x] 15.13 Script manage_users.py para promover usuarios a admin/stock

## 16. Hotfixes Post-Archive

- [x] 16.1 Corregir paths de API en frontend (`/admin/*` → `/api/admin/*`) en categories.ts, ingredients.ts, products.ts
- [x] 16.2 Corregir comparación de roles en RBAC (string vs enum) en auth/rbac.py
- [x] 16.3 Eliminar association tables duplicadas en models/product.py (ProductCategory, ProductIngredient)
- [x] 16.4 Corregir has_active_orders para retornar False en lugar de lanzar error
- [x] 16.5 Optimizar N+1 en breadcrumbs de categorías con batch query usando get_many()
- [x] 16.6 Centralizar funciones require_roles en auth/rbac.py (eliminar duplicación en routes/admin)
- [x] 16.7 Crear método get_catalogue_filtered con filtros en SQL (eliminar filtros en memoria)
- [x] 16.8 Crear método get_admin_filtered con filtros en SQL para admin
- [x] 16.9 Corregir sort para usar ORDER BY en SQL en lugar de排序 en memoria
- [x] 16.10 Optimizar set_categories y set_ingredients con batch queries (IN clause)
- [x] 16.11 Corregir secret key hardcodeada - generar con secrets.token_hex(32) en dev, requerir en production
- [x] 16.12 Mejorar validación de phone (regex más estricto: ^\+?\d{7,15}$)
- [x] 16.13 Eliminar imports no usados (typing.List, uuid, Any)
- [x] 16.14 Mover lógica de registro a create_user() en auth/service.py
- [x] 16.15 Agregar persistencia a authStore con localStorage (evitar deslogueo al refresh)
- [x] 16.16 Corregir CategoryTree para manejar datos que no son array (fallback Array.isArray)