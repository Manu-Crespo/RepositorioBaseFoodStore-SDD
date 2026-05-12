## ADDED Requirements

### Requirement: Páginas inline migradas a archivos individuales
Las páginas actualmente definidas inline en App.tsx (HomePage, CartPage, OrdersPage, ProfilePage, AdminPage, AdminDashboard) DEBEN migrarse a archivos individuales en `pages/`.

#### Scenario: HomePage como archivo propio
- **WHEN** se renderiza la ruta "/"
- **THEN** el componente se importa desde `pages/HomePage.tsx` en lugar de estar definido inline en App.tsx

#### Scenario: Todas las páginas como archivos
- **WHEN** se navega a cualquier ruta
- **THEN** el componente correspondiente se importa desde su archivo en `pages/` con lazy loading (`React.lazy` + Suspense)

### Requirement: Capa entities con modelos de dominio
El directorio `entities/` DEBE contener modelos de dominio con types, validaciones, y transformadores para cada entidad del negocio.

#### Scenario: Entity User con tipos y helpers
- **WHEN** se necesita trabajar con datos de usuario
- **THEN** se importan desde `entities/user/` con types, funciones de validación (email, rol) y helpers de display (nombre completo, iniciales)

#### Scenario: Entity Product con tipos y formateo
- **WHEN** se necesita trabajar con datos de producto
- **THEN** se importan desde `entities/product/` con types, formateo de precio, validación de stock, y helpers de imagen

#### Scenario: Entity Category con tipos y helpers
- **WHEN** se necesita trabajar con categorías
- **THEN** se importan desde `entities/category/` con types, helpers de árbol (children, parent), y breadcrumb

### Requirement: Capa features con lógica reutilizable
El directorio `features/` DEBE contener piezas de funcionalidad reutilizables que combinan UI + lógica de negocio.

#### Scenario: Feature auth con login/register components
- **WHEN** se necesita login o register en cualquier página
- **THEN** se usa desde `features/auth/` con componentes LoginForm, RegisterForm, y hooks useLogin, useRegister

#### Scenario: Feature product-crud con componentes admin
- **WHEN** se necesita gestión de productos
- **THEN** se usa desde `features/product-crud/` con ProductForm, ProductTable, ProductsFilters componentes autocontenidos

### Requirement: Capa widgets con composiciones complejas
El directorio `widgets/` DEBE contener composiciones de UI complejas que combinan multiples componentes y features.

#### Scenario: Widget ProductGrid
- **WHEN** se necesita mostrar un grid de productos con filtros
- **THEN** se usa desde `widgets/product-grid/` que compone ProductCard, Pagination, y Filters internamente

#### Scenario: Widget AdminStatsCards
- **WHEN** se necesita mostrar métricas del dashboard
- **THEN** se usa desde `widgets/admin-stats/` que compone Cards con iconos, valores, y animación de conteo

### Requirement: Lazy loading por ruta con Suspense
Todas las páginas DEBEN cargarse con lazy loading usando `React.lazy` y `Suspense` con fallback skeleton.

#### Scenario: Página con lazy loading
- **WHEN** un usuario navega a una ruta
- **THEN** el componente se carga con React.lazy, mostrando un Skeleton como fallback mientras carga
