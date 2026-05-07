## ADDED Requirements

### Requirement: Catálogo público de productos
El sistema SHALL permite a clientes (sin autenticación) listar productos disponibles con filtros, búsqueda y paginación.

#### Scenario: Listar productos del catálogo público
- **WHEN** cliente envía GET /api/catalogue/products
- **THEN** sistema retorna 200 con lista de productos donde cada uno incluye `{ "id", "name", "description", "price", "image", "categories", "ingredients" }`

#### Scenario: Catálogo con paginación
- **WHEN** cliente envía GET /api/catalogue/products?page=1&limit=12
- **THEN** sistema retorna `{ "data": [...], "pagination": { "page": 1, "limit": 12, "total": 100, "total_pages": 9 } }`

#### Scenario: Productos eliminados no aparecen
- **WHEN** cliente envía GET /api/catalogue/products
- **THEN** sistema retorna solo productos donde `deleted_at` es null

#### Scenario: Productos sin stock no aparecen en catálogo público
- **WHEN** cliente envía GET /api/catalogue/products
- **THEN** sistema retorna solo productos donde `stock > 0` (configurable, por defecto excluye sin stock)

### Requirement: Filtrar productos por categoría
El sistema SHALL permite a clientes filtrar el catálogo por una categoría específica.

#### Scenario: Filtrar por categoría
- **WHEN** cliente envía GET /api/catalogue/products?category_id=<cat-id>
- **THEN** sistema retorna solo productos asociados a esa categoría

#### Scenario: Filtrar por categoría con subcategorías
- **WHEN** cliente envía GET /api/catalogue/products?category_id=<cat-id>&include_children=true
- **THEN** sistema retorna productos de la categoría y todas sus subcategorías (basado en el path jerárquico)

### Requirement: Filtrar productos por alérgenos
El sistema SHALL permite a clientes excluir productos que contengan ciertos alérgenos.

#### Scenario: Filtrar excluir alérgenos
- **WHEN** cliente envía GET /api/catalogue/products?exclude_allergens=lacteos,gluten
- **THEN** sistema retorna solo productos que NO contienen ningún de los alérgenos especificados

#### Scenario: Filtrar por alérgeno específico
- **WHEN** cliente envía GET /api/catalogue/products?allergens=vegetariano
- **THEN** sistema retorna solo productos que contienen el alérgeno/atributo especificado

### Requirement: Filtrar productos por rango de precio
El sistema SHALL permite a clientes filtrar productos por rango de precio.

#### Scenario: Filtrar por rango de precio
- **WHEN** cliente envía GET /api/catalogue/products?min_price=500&max_price=2000
- **THEN** sistema retorna solo productos con precio entre 500 y 2000

#### Scenario: Filtrar precio mínimo
- **WHEN** cliente envía GET /api/catalogue/products?min_price=1000
- **THEN** sistema retorna solo productos con precio mayor o igual a 1000

### Requirement: Buscar productos por nombre
El sistema SHALL permite a clientes buscar productos por nombre (búsqueda parcial, case-insensitive).

#### Scenario: Búsqueda por nombre
- **WHEN** cliente envía GET /api/catalogue/products?search=pizza
- **THEN** sistema retorna productos donde el nombre contiene "pizza" (case-insensitive)

#### Scenario: Búsqueda con múltiples términos
- **WHEN** cliente envía GET /api/catalogue/products?search=pizza+jamón
- **THEN** sistema retorna productos que contienen ambos términos "pizza" y "jamón"

### Requirement: Ver detalle de producto
El sistema SHALL permite a clientes ver la información completa de un producto específico.

#### Scenario: Obtener detalle de producto
- **WHEN** cliente envía GET /api/catalogue/products/{id}
- **THEN** sistema retorna 200 con el producto completo incluyendo todos los campos, categorías, e ingredientes

#### Scenario: Producto no existe
- **WHEN** cliente envía GET /api/catalogue/products/99999
- **THEN** sistema retorna 404 Not Found

#### Scenario: Producto eliminado
- **WHEN** cliente envía GET /api/catalogue/products/{id} de producto con `deleted_at` no nulo
- **THEN** sistema retorna 404 Not Found

### Requirement: Listar categorías del catálogo público
El sistema SHALL permite a clientes obtener la lista de categorías disponibles para navegar.

#### Scenario: Obtener categorías públicas
- **WHEN** cliente envía GET /api/catalogue/categories
- **THEN** sistema retorna lista de categorías (formato árbol o plano) solo con `deleted_at` null

### Requirement: Ordenamiento del catálogo
El sistema SHALL permite a clientes definir el orden de los productos en el catálogo.

#### Scenario: Ordenar por precio ascendente
- **WHEN** cliente envía GET /api/catalogue/products?sort=price_asc
- **THEN** sistema retorna productos ordenados por precio menor a mayor

#### Scenario: Ordenar por precio descendente
- **WHEN** cliente envía GET /api/catalogue/products?sort=price_desc
- **THEN** sistema retorna productos ordenados por precio mayor a menor

#### Scenario: Ordenar por nombre
- **WHEN** cliente envía GET /api/catalogue/products?sort=name_asc
- **THEN** sistema retorna productos ordenados alfabéticamente por nombre

#### Scenario: Ordenar por más recientes
- **WHEN** cliente envía GET /api/catalogue/products?sort=newest
- **THEN** sistema retorna productos ordenados por `created_at` descendente

### Requirement: Productos relacionados
El sistema SHALL sugiere productos relacionados en el detalle de producto (misma categoría).

#### Scenario: Obtener productos relacionados
- **WHEN** cliente envía GET /api/catalogue/products/{id}/related?limit=4
- **THEN** sistema retorna hasta 4 productos de la misma categoría, excluyendo el producto actual

### Requirement: Disponibilidad de producto
El sistema SHALL indica en el detalle del producto si está disponible para compra (tiene stock).

#### Scenario: Producto disponible
- **WHEN** cliente envía GET /api/catalogue/products/{id} donde stock > 0
- **THEN** respuesta incluye `"availability": "in_stock"` y `"stock": <cantidad>`

#### Scenario: Producto sin stock
- **WHEN** cliente envía GET /api/catalogue/products/{id} donde stock = 0
- **THEN** respuesta incluye `"availability": "out_of_stock"` y `"stock": 0`