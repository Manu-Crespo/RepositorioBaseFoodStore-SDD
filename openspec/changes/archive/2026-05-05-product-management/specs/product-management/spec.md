## ADDED Requirements

### Requirement: Crear producto
El sistema SHALL permite a usuarios con rol STOCK o ADMIN crear un producto especificando nombre, descripción, precio, stock, categorías, e ingredientes.

#### Scenario: Crear producto exitoso
- **WHEN** usuario con rol STOCK envía POST /api/admin/products con `{ "name": "Pizza Margarita", "description": "Pizza clásica", "price": 1200, "stock": 50, "category_ids": ["<cat-id>"], "ingredient_ids": ["<ing-id-1>", "<ing-id-2>"] }`
- **THEN** sistema retorna 201 con el producto creado incluyendo `id`, `name`, `price`, `stock`, `categories`, `ingredients`, `created_at`

#### Scenario: Crear producto con precio negativo
- **WHEN** usuario con rol STOCK envía POST /api/admin/products con `{ "name": "Test", "price": -100 }`
- **THEN** sistema retorna 422 con error de validación indicando que price debe ser positivo

#### Scenario: Crear producto con stock negativo
- **WHEN** usuario con rol STOCK envía POST /api/admin/products con `{ "name": "Test", "stock": -5 }`
- **THEN** sistema retorna 422 con error de validación indicando que stock no puede ser negativo

#### Scenario: Crear producto sin categorías
- **WHEN** usuario con rol STOCK envía POST /api/admin/products sin campo category_ids
- **THEN** sistema retorna 201 con el producto donde `categories` es array vacío

#### Scenario: Crear producto con categoría eliminada
- **WHEN** usuario con rol STOCK envía POST /api/admin/products con `category_ids` conteniendo ID de categoría eliminada
- **THEN** sistema retorna 422 con error indicando que la categoría no existe o está eliminada

### Requirement: Listar productos (admin)
El sistema SHALL permite a usuarios con rol STOCK o ADMIN listar productos con filtros avanzados y paginación.

#### Scenario: Listar productos con paginación
- **WHEN** usuario con rol STOCK envía GET /api/admin/products?page=1&limit=20
- **THEN** sistema retorna `{ "data": [...], "total": 100, "page": 1, "limit": 20 }`

#### Scenario: Filtrar productos por categoría
- **WHEN** usuario con rol STOCK envía GET /api/admin/products?category_id=<cat-id>
- **THEN** sistema retorna solo productos asociados a esa categoría

#### Scenario: Filtrar productos por ingrediente
- **WHEN** usuario con rol STOCK envía GET /api/admin/products?ingredient_id=<ing-id>
- **THEN** sistema retorna solo productos que contienen ese ingrediente

#### Scenario: Filtrar productos por rango de precio
- **WHEN** usuario con rol STOCK envía GET /api/admin/products?min_price=500&max_price=2000
- **THEN** sistema retorna solo productos con precio entre 500 y 2000

#### Scenario: Buscar productos por nombre
- **WHEN** usuario con rol STOCK envía GET /api/admin/products?search=pizza
- **THEN** sistema retorna productos donde nombre contiene "pizza" (case-insensitive)

#### Scenario: Filtrar productos por stock bajo
- **WHEN** usuario con rol STOCK envía GET /api/admin/products?low_stock=true
- **THEN** sistema retorna solo productos con stock menor a 10 unidades

### Requirement: Obtener producto por ID (admin)
El sistema SHALL permite obtener detalles completos de un producto incluyendo todas las relaciones.

#### Scenario: Obtener producto con todas las relaciones
- **WHEN** usuario con rol STOCK envía GET /api/admin/products/{id}
- **THEN** sistema retorna 200 con producto incluyendo arrays `categories` y `ingredients` con detalles completos

### Requirement: Editar producto
El sistema SHALL permite a usuarios con rol STOCK o ADMIN modificar cualquier campo del producto.

#### Scenario: Actualizar precio y stock
- **WHEN** usuario con rol STOCK envía PUT /api/admin/products/{id} con `{ "price": 1500, "stock": 100 }`
- **THEN** sistema retorna 200 con producto actualizado

#### Scenario: Actualizar categorías del producto
- **WHEN** usuario con rol STOCK envía PUT /api/admin/products/{id} con `{ "category_ids": ["<nueva-cat-id>"] }`
- **THEN** sistema retorna 200 donde las categorías anteriores fueron reemplazadas por las nuevas

#### Scenario: Agregar ingredientes al producto
- **WHEN** usuario con rol STOCK envía PUT /api/admin/products/{id} con `{ "ingredient_ids": ["<ing-id>"] }`
- **THEN** sistema retorna 200 con los nuevos ingredientes agregados a la lista existente

#### Scenario: Editar producto que no existe
- **WHEN** usuario con rol STOCK envía PUT /api/admin/products/99999
- **THEN** sistema retorna 404 Not Found

### Requirement: Gestionar stock de producto
El sistema SHALL permite a usuarios con rol STOCK ajustar el stock de un producto (incrementar o decrementar).

#### Scenario: Incrementar stock
- **WHEN** usuario con rol STOCK envía PATCH /api/admin/products/{id}/stock con `{ "operation": "add", "quantity": 50 }`
- **THEN** sistema retorna 200 con el nuevo stock incrementado

#### Scenario: Decrementar stock
- **WHEN** usuario con rol STOCK envía PATCH /api/admin/products/{id}/stock con `{ "operation": "remove", "quantity": 10 }`
- **THEN** sistema retorna 200 con el nuevo stock decrementado

#### Scenario: Decrementar stock resultando en negativo
- **WHEN** usuario con rol STOCK envía PATCH /api/admin/products/{id}/stock con `{ "operation": "remove", "quantity": 1000 }` donde stock actual es 50
- **THEN** sistema retorna 400 con error indicando que no hay suficiente stock

### Requirement: Eliminar producto (soft delete)
El sistema SHALL permite a usuarios con rol ADMIN eliminar un producto lógicamente.

#### Scenario: Eliminar producto
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/products/{id}
- **THEN** sistema retorna 204 y el producto queda con `deleted_at` con timestamp

#### Scenario: Eliminar producto con pedidos activos
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/products/{id} que tiene pedidos en estado PENDIENTE o CONFIRMADO
- **THEN** sistema retorna 409 Conflict con mensaje indicando pedidos activos

### Requirement: Productos eliminados excluidos del catálogo público
El sistema SHALL excluye productos con `deleted_at` no nulo de todas las respuestas públicas del catálogo.

#### Scenario: Producto eliminado no aparece en catálogo
- **WHEN** cliente envía GET /api/catalogue/products
- **THEN** sistema retorna solo productos donde `deleted_at` es null