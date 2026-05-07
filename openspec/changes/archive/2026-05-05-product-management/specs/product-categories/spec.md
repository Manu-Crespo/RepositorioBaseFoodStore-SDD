## ADDED Requirements

### Requirement: Crear categoría
El sistema SHALL permite a usuarios con rol STOCK o ADMIN crear una nueva categoría especificando nombre, descripción opcional, y opcionalmente una categoría padre (para jerarquía).

#### Scenario: Crear categoría raíz exitosa
- **WHEN** usuario con rol STOCK envía POST /api/admin/categories con `{ "name": "Bebidas", "description": "Bebidas frías y calientes" }`
- **THEN** sistema retorna 201 con la categoría creada incluyendo `id`, `name`, `description`, `parent_id: null`, `path: "<id>/"`

#### Scenario: Crear categoría hija exitosa
- **WHEN** usuario con rol STOCK envía POST /api/admin/categories con `{ "name": "Refrescos", "parent_id": "<id-categoria-bebidas>" }`
- **THEN** sistema retorna 201 con la categoría creada donde `path` incluye el path del padre concatenado

#### Scenario: Crear categoría sin nombre
- **WHEN** usuario con rol STOCK envía POST /api/admin/categories con `{ "name": "" }`
- **THEN** sistema retorna 422 con error de validación indicando que `name` es requerido

#### Scenario: Crear categoría con nombre duplicado en mismo nivel
- **WHEN** usuario con rol STOCK envía POST /api/admin/categories con nombre que ya existe en el mismo `parent_id`
- **THEN** sistema retorna 409 Conflict con mensaje de nombre duplicado

### Requirement: Listar categorías
El sistema SHALL permite listar todas las categorías con soporte para estructura jerárquica (tree) o lista plana.

#### Scenario: Listar categorías como árbol
- **WHEN** usuario con rol ADMIN envía GET /api/admin/categories?format=tree
- **THEN** sistema retorna 200 con estructura JSON anidada donde cada categoría incluye `children: []` con sus subcategorías

#### Scenario: Listar categorías planas con profundidad
- **WHEN** usuario con rol ADMIN envía GET /api/admin/categories?format=flat
- **THEN** sistema retorna 200 con lista plana de categorías, cada una con campo `depth` indicando nivel en la jerarquía

#### Scenario: Listar solo categorías raíz
- **WHEN** usuario con rol ADMIN envía GET /api/admin/categories?parent_id=null
- **THEN** sistema retorna solo categorías sin padre (raíz)

### Requirement: Obtener categoría por ID
El sistema SHALL permite obtener los detalles de una categoría específica incluyendo su jerarquía (padre, hijos).

#### Scenario: Obtener categoría existente
- **WHEN** usuario con rol ADMIN envía GET /api/admin/categories/{id}
- **THEN** sistema retorna 200 con la categoría incluyendo `parent_id`, `path`, `breadcrumbs` (array de nombres desde raíz)

#### Scenario: Obtener categoría no existente
- **WHEN** usuario con rol ADMIN envía GET /api/admin/categories/99999
- **THEN** sistema retorna 404 Not Found con error "Categoría no encontrada"

### Requirement: Editar categoría
El sistema SHALL permite a usuarios con rol STOCK o ADMIN modificar el nombre, descripción, o padre de una categoría.

#### Scenario: Editar nombre de categoría
- **WHEN** usuario con rol STOCK envía PUT /api/admin/categories/{id} con `{ "name": "Bebidas Actualizado" }`
- **THEN** sistema retorna 200 con la categoría actualizada

#### Scenario: Mover categoría a otro padre
- **WHEN** usuario con rol ADMIN envía PUT /api/admin/categories/{id} con `{ "parent_id": "<nuevo-padre-id>" }`
- **THEN** sistema retorna 200 con la categoría donde `path` fue actualizado automáticamente

#### Scenario: Mover categoría a sí misma como padre
- **WHEN** usuario con rol ADMIN envía PUT /api/admin/categories/{id} con `{ "parent_id": "<mismo-id>" }`
- **THEN** sistema retorna 422 con error indicando que una categoría no puede ser su propio padre

### Requirement: Eliminar categoría (soft delete)
El sistema SHALL permite a usuarios con rol ADMIN eliminar una categoría lógicamente (soft delete), marcándola como eliminada sin borrar datos.

#### Scenario: Eliminar categoría sin productos asociados
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/categories/{id}
- **THEN** sistema retorna 204 No Content y la categoría queda con `deleted_at` con timestamp

#### Scenario: Eliminar categoría con productos asociados
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/categories/{id} que tiene productos activos asociados
- **THEN** sistema retorna 409 Conflict con mensaje indicando que existen productos asociados

#### Scenario: Eliminar categoría con subcategorías
- **WHEN** usuario con rol ADMIN envía DELETE /api/admin/categories/{id} que tiene subcategorías
- **THEN** sistema retorna 409 Conflict con mensaje indicando que existen subcategorías

### Requirement: Reordenar categorías
El sistema SHALL permite a usuarios con rol STOCK definir un orden de visualización para las categorías同级.

#### Scenario: Actualizar orden de categorías
- **WHEN** usuario con rol STOCK envía PATCH /api/admin/categories/{id}/reorder con `{ "order": 5 }`
- **THEN** sistema retorna 200 con la categoría actualizada incluyendo el nuevo valor de `order`

### Requirement: Categorías eliminadas no aparecen en catálogo público
El sistema SHALL excluye las categorías con `deleted_at` no nulo de las respuestas del catálogo público.

#### Scenario: Categoría eliminada no aparece en listados públicos
- **WHEN** cliente envía GET /api/catalogue/categories
- **THEN** sistema retorna solo categorías donde `deleted_at` es null