## ADDED Requirements

### Requirement: Crear ingrediente
El sistema SHALL permite a usuarios con rol STOCK o ADMIN crear un ingrediente especificando nombre y lista de alérgenos.

#### Scenario: Crear ingrediente exitoso
- **WHEN** usuario con rol STOCK envía POST /api/admin/ingredients con `{ "name": "Leche", "allergens": ["lacteos"] }`
- **THEN** sistema retorna 201 con el ingrediente creado incluyendo `id`, `name`, `allergens`, `created_at`

#### Scenario: Crear ingrediente sin alérgenos
- **WHEN** usuario con rol STOCK envía POST /api/admin/ingredients con `{ "name": "Arroz" }` (sin campo allergens)
- **THEN** sistema retorna 201 con el ingrediente donde `allergens` es array vacío `[]`

#### Scenario: Crear ingrediente con nombre duplicado
- **WHEN** usuario con rol STOCK envía POST /api/admin/ingredients con nombre que ya existe y no está eliminado
- **THEN** sistema retorna 409 Conflict con mensaje de nombre duplicado

#### Scenario: Crear ingrediente con alérgeno inválido
- **WHEN** usuario con rol STOCK envía POST /api/admin/ingredients con `{ "name": "Test", "allergens": ["alergenodesconocido"] }`
- **THEN** sistema retorna 422 con error de validación indicando que el alérgeno no está en la lista permitida

### Requirement: Listar ingredientes
El sistema SHALL permite listar todos los ingredientes con paginación y filtros.

#### Scenario: Listar ingredientes con paginación
- **WHEN** usuario con rol STOCK envía GET /api/admin/ingredients?page=1&limit=20
- **THEN** sistema retorna 200 con `{ "data": [...], "total": 50, "page": 1, "limit": 20 }`

#### Scenario: Filtrar ingredientes por alérgeno
- **WHEN** usuario con rol STOCK envía GET /api/admin/ingredients?allergen=lacteos
- **THEN** sistema retorna solo ingredientes que contienen "lacteos" en su array de allergens

#### Scenario: Listar solo ingredientes activos
- **WHEN** usuario con rol STOCK envía GET /api/admin/ingredients?include_deleted=false
- **THEN** sistema retorna solo ingredientes donde `deleted_at` es null

### Requirement: Obtener ingrediente por ID
El sistema SHALL permite obtener los detalles de un ingrediente específico.

#### Scenario: Obtener ingrediente existente
- **WHEN** usuario con rol STOCK envía GET /api/admin/ingredients/{id}
- **THEN** sistema retorna 200 con el ingrediente incluyendo todos los campos

#### Scenario: Obtener ingrediente eliminado
- **WHEN** usuario con rol STOCK envía GET /api/admin/ingredients/{id} de ingrediente con `deleted_at` no nulo
- **THEN** sistema retorna 404 Not Found (ingredientes eliminados no son accesibles)

### Requirement: Editar ingrediente
El sistema SHALL permite a usuarios con rol STOCK o ADMIN modificar el nombre y alérgenos de un ingrediente.

#### Scenario: Editar nombre de ingrediente
- **WHEN** usuario con rol STOCK envía PUT /api/admin/ingredients/{id} con `{ "name": "Leche Entera" }`
- **THEN** sistema retorna 200 con el ingrediente actualizado

#### Scenario: Editar alérgenos de ingrediente
- **WHEN** usuario con rol STOCK envía PUT /api/admin/ingredients/{id} con `{ "allergens": ["lacteos", "proteina"] }`
- **THEN** sistema retorna 200 con el ingrediente con los nuevos alérgenos

### Requirement: Eliminar ingrediente (soft delete)
El sistema SHALL permite a usuarios con rol ADMIN eliminar un ingrediente lógicamente.

#### Scenario: Eliminar ingrediente sin productos asociados
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/ingredients/{id}
- **THEN** sistema retorna 204 y el ingrediente queda con `deleted_at` con timestamp

#### Scenario: Eliminar ingrediente con productos asociados
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/ingredients/{id} que está asociado a productos activos
- **THEN** sistema retorna 409 Conflict con mensaje indicando productos asociados

### Requirement: Catálogo público de alérgenos
El sistema SHALL permite a clientes obtener la lista de alérgenos disponibles en el sistema.

#### Scenario: Obtener lista de alérgenos
- **WHEN** cliente envía GET /api/catalogue/allergens
- **THEN** sistema retorna 200 con array de alérgenos predefinidos en el sistema

### Requirement: Ingredientes en respuesta de producto
El sistema SHALL incluir la lista de ingredientes con su información de alérgenos en las respuestas de producto del catálogo público.

#### Scenario: Producto incluye ingredientes en respuesta pública
- **WHEN** cliente envía GET /api/catalogue/products/{id}
- **THEN** respuesta incluye array `ingredients` donde cada elemento tiene `{ "id", "name", "is_allergen" }`