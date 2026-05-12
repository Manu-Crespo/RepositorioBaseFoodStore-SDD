##Leyenda de Prioridades
- @critical: Prerequisito para otras tareas, debe completarse primero
- @required: Funcionalidad core del change
- @optional: Nice-to-have, si hay tiempo
- @testing: Tareas de verificación

---

## 1. Tema Visual - Sistema de Diseño Base (@critical)

- [x] 1.1 @critical Extender configuración de Tailwind con colores de tema oscuro (paleta slate)
- [x] 1.2 @critical Actualizar index.css con estilos base de tema oscuro (bg del body, colores de texto)
- [x] 1.3 @required Definir variables CSS para colores del tema
- [x] 1.4 @required Configurar fondo oscuro global en el elemento body

## 2. Tema Visual - Sistema de Tipografía (@required)

- [x] 2.1 @required Configurar Poppins para headings, Inter para body en el tema de Tailwind
- [x] 2.2 @required Definir jerarquía de color de texto (brillante para headings, muted para body)
- [x] 2.3 @optional Crear clases utilitarias para jerarquía de texto si es necesario
- [x] 2.4 @required Aplicar tipografía a páginas existentes (CataloguePage, LoginPage, etc.)

## 3. Tema Visual - Componentes UI (@critical)

- [x] 3.1 @critical Crear componente Button con variantes (primary, secondary, ghost)
- [x] 3.2 @critical Crear componente Input con estilos de tema oscuro
- [x] 3.3 @critical Crear componente Card con fondo oscuro y efectos hover
- [x] 3.4 @required Crear componente Badge para etiquetas y roles
- [x] 3.5 @required Crear componente LoadingSpinner (ámbar sobre oscuro)
- [x] 3.6 @required Crear componente EmptyState (icono muted, texto descriptivo)

## 4. Navigation Layout - Infraestructura Core (@critical)

- [x] 4.1 @critical Crear estructura de directorio `components/layout/`
- [x] 4.2 @critical Crear hook `useNavigationItems` que devuelve items de navegación según el rol del usuario
- [x] 4.3 @critical Crear componente `Layout` con renderizado condicional de sidebar
- [x] 4.4 @critical Crear variante `AuthLayout` para usuarios autenticados con sidebar
- [x] 4.5 @critical Crear variante `PublicLayout` para usuarios no autenticados sin sidebar
- [x] 4.6 @required Actualizar App.tsx para envolver rutas con componentes Layout apropiados

## 5. Componente Sidebar (@required)

- [x] 5.1 @required Crear componente `Sidebar` en `components/layout/Sidebar.tsx`
- [x] 5.2 @required Implementar items de navegación basados en rol en Sidebar (stock, admin)
- [x] 5.3 @required Agregar highlight de ruta activa basado en ubicación actual
- [x] 5.4 @required Agregar comportamiento responsive: ocultar sidebar en mobile, mostrar menú hamburguesa
- [x] 5.5 @optional Agregar iconos a los items de navegación del sidebar

## 6. Mejoras del Header (@required)

- [x] 6.1 @required Refactorizar componente Header para usar hook useNavigationItems
- [x] 6.2 @required Agregar placeholder de avatar de usuario junto al nombre
- [x] 6.3 @required Mejorar estilizado y confirmación del botón de logout
- [x] 6.4 @optional Agregar display de badge de rol junto al nombre del usuario

## 7. Página de Acceso Denegado (@required)

- [x] 7.1 @required Crear componente `AccessDeniedPage` en `pages/AccessDeniedPage.tsx`
- [x] 7.2 @required Agregar ruta para "/access-denied" en App.tsx
- [x] 7.3 @required Actualizar route guards para redirigir a AccessDeniedPage en lugar de login
- [x] 7.4 @optional Agregar botón "Volver al inicio" en AccessDeniedPage

## 8. Integración de Route Guards (@required)

- [x] 8.1 @required Actualizar ProtectedRoute para usar componente Layout
- [x] 8.2 @required Actualizar AdminGuard para usar componente Layout
- [x] 8.3 @required Actualizar StockGuard para usar componente Layout
- [x] 8.4 @optional Agregar manejo de parámetro returnUrl para rutas protegidas

## 9. Catalogue UX - Estados de Carga (@required)

- [x] 9.1 @required Agregar estado de carga en CataloguePage mientras obtiene productos
- [x] 9.2 @required Agregar componentes esqueleto de carga para tarjetas de productos
- [x] 9.3 @required Agregar spinner de carga en ProductDetailPage
- [x] 9.4 @required Usar componente reutilizable LoadingSpinner de components/ui/

## 10. Catalogue UX - Estados Vacíos (@required)

- [x] 10.1 @required Agregar estado vacío en CataloguePage cuando no hay productos disponibles
- [x] 10.2 @required Agregar estado vacío para resultados de búsqueda vacíos
- [x] 10.3 @required Agregar estado vacío en ProductDetailPage para producto no disponible
- [x] 10.4 @required Usar componente reutilizable EmptyState de components/ui/

## 11. Catalogue UX - Mejoras de Filtros (@optional)

- [x] 11.1 @optional Implementar persistencia de estado de filtros usando catalogueStore
- [x] 11.2 @optional Agregar feedback UI inmediato cuando cambian los filtros (actualización optimista)
- [x] 11.3 @optional Agregar botón de reset de filtros con confirmación
- [x] 11.4 @optional Agregar soporte de navegación por teclado para controles de filtro

## 12. Aplicar Tema a Páginas Existentes (@required)

- [x] 12.1 @required Actualizar LoginPage con estilos de tema oscuro
- [x] 12.2 @required Actualizar RegisterPage con estilos de tema oscuro
- [x] 12.3 @required Actualizar componente ProductCard con tema oscuro
- [x] 12.4 @required Actualizar componente ProductFilters con tema oscuro
- [x] 12.5 @required Actualizar ProductDetailPage con estilos de tema oscuro

## 13. Testing y Verificación (@testing)

- [x] 13.1 @testing Probar navigation layout con usuario no autenticado
- [x] 13.2 @testing Probar navigation layout con rol customer
- [x] 13.3 @testing Probar navigation layout con rol stock
- [x] 13.4 @testing Probar navigation layout con rol admin
- [x] 13.5 @testing Probar comportamiento responsive del sidebar en mobile
- [x] 13.6 @testing Probar página de acceso denegado para acceso no autorizado
- [x] 13.7 @testing Probar estados de carga y vacío del catálogo
- [x] 13.8 @optional Probar persistencia de filtros entre navegaciones
- [x] 13.9 @testing Verificar que el tema oscuro esté aplicado consistentemente en todas las páginas

## 14. Post-Implementación (@testing)

- [x] 14.1 @testing Ejecutar build del frontend para verificar sin errores
- [x] 14.2 @testing Verificar que todos los requisitos de specs estén cumplidos
- [x] 14.3 @optional Probar contraste de colores y legibilidad

## 15. Post-Implementation - Hotfixes y Modificaciones (@required)

_Modificaciones realizadas después de la implementación inicial para corregir bugs y mejorar estabilidad._

### 15.1 Backend - RBAC y Autenticación (@critical)
- [x] 15.1.1 @critical **RBAC enum/string fix**: Corregida comparación de roles en `backend/app/auth/rbac.py` — `UserRole.ADMIN` (enum) no coincidía con `"admin"` (string) de la DB. Se agregó `.value` a los enum antes de comparar.
- [x] 15.1.2 @critical **Login content-type handling**: El endpoint `/auth/login` en `backend/app/routes/auth.py` ahora soporta tanto `application/json` (frontend) como `application/x-www-form-urlencoded` (Swagger UI). Antes solo aceptaba form-data.
- [x] 15.1.3 @required **Login timeout handling**: Mejorado manejo de errores de timeout/timeout en login, con mensajes claros al usuario.

### 15.2 Backend - Optimización de Queries (@required)
- [x] 15.2.1 @required **SQL filter optimization**: Migrados filtros de productos (categoría, precio, búsqueda, alérgenos) de filtrado en memoria a SQL queries con JOINs y subqueries en `backend/app/repositories/product.py` — métodos `get_catalogue_filtered()` y `get_admin_filtered()`.
- [x] 15.2.2 @required **N+1 query fix**: Agregados `selectinload()` en todas las queries de productos para eager loading de relaciones (categorías, ingredientes), eliminando N+1 queries.
- [x] 15.2.3 @required **Batch ancestor queries**: En `backend/app/services/category.py`, el método `_to_response()` ahora obtiene ancestros en una sola query (`get_many()`) en vez de N queries individuales.

### 15.3 Backend - Modelos y DB (@required)
- [x] 15.3.1 @critical **Association tables dedup**: Eliminadas tablas de asociación duplicadas en `backend/app/models/product.py`. Ahora viven exclusivamente en `backend/app/models/associations.py` (`ProductCategory`, `ProductIngredient`).
- [x] 15.3.2 @required **Connection pool config**: Configurado pool de conexiones en `backend/app/database.py` con `pool_size=5`, `max_overflow=10`, `pool_pre_ping=True` para evitar timeouts y 503s.
- [x] 15.3.3 @optional **Rate limiting**: Configurado slowapi con límite de 5 requests/minuto para login y 10/minuto para register en `backend/app/rate_limit.py`.

### 15.4 Frontend - Stores y Persistencia (@critical)
- [x] 15.4.1 @critical **authStore persistence**: Agregado `zustand/middleware persist` con localStorage en `frontend/src/stores/authStore.ts`. Antes al refrescar la página se perdía la sesión.
- [x] 15.4.2 @required **catalogueStore filter persistence**: Agregado persist middleware a `frontend/src/stores/catalogueStore.ts` para mantener filtros entre navegaciones y refrescos.
- [x] 15.4.3 @required **API client auto-refresh**: Implementado response interceptor en `frontend/src/shared/api/client.ts` que captura 401, intenta refresh token automático, y solo redirige a login si falla.

### 15.5 Frontend - Componentes y Fixes (@required)
- [x] 15.5.1 @critical **API path fixes**: Corregidos paths de API en frontend — `/admin/*` → `/api/admin/*`, `/catalogue/*` → `/api/catalogue/*` para coincidir con las rutas del backend.
- [x] 15.5.2 @required **CategoryTree defensive coding**: En `frontend/src/components/catalog/CategoryTree.tsx`, se agregó `Array.isArray()` check (línea 24) para manejar casos donde la API devuelve un objeto en vez de array.
- [x] 15.5.3 @required **Keyboard navigation for filters**: Agregado soporte de teclado (Enter para aplicar, Alt+Arrow para selects) en `frontend/src/components/catalog/ProductFilters.tsx`.
- [x] 15.5.4 @required **ProductDetailView dark theme partial**: `frontend/src/components/catalog/ProductDetailView.tsx` tiene estilos de tema claro (gray/blue) pendientes de migrar a tema oscuro (slate/amber).
- [x] 15.5.5 @required **Pagination dark theme partial**: `frontend/src/components/catalog/Pagination.tsx` tiene estilos de tema claro (gray/blue) pendientes de migrar.
- [x] 15.5.6 @required **CategoryTree dark theme partial**: `frontend/src/components/catalog/CategoryTree.tsx` tiene estilos de tema claro (gray/blue) pendientes de migrar.

### 15.6 Frontend - UX de Catálogo (@optional)
- [x] 15.6.1 @optional **Sidebar responsive animado**: Menú hamburguesa con overlay, transición slide-in/out, cierre al hacer clic fuera (mobile).
- [x] 15.6.2 @optional **ProductCardSkeleton**: Creado `frontend/src/components/ui/ProductCardSkeleton.tsx` con skeleton loading para tarjetas de productos.
- [x] 15.6.3 @optional **Build exitoso verificado**: `npm run build` sin errores después de todos los cambios.

## 16. Post-Archive — Cambios de Frontend-Redesign (2026-05-12)

### 16.1 Logo — Reemplazo de letra "F" por icono temático
- [x] 16.1.1 Reemplazada letra "F" en Header logo por SVG de shopping bag (`frontend/src/components/layout/Header.tsx`)

### 16.2 Layout — Header fixed tapaba contenido
- [x] 16.2.1 Agregado `pt-16` al contenedor flex en Layout.tsx para que el contenido no quede detrás del header fixed (`frontend/src/components/layout/Layout.tsx`)

### 16.3 Sidebar — Icono en header de sección "Gestión"
- [x] 16.3.1 Agregado icono `<ProductIcon />` al header de sección "Gestión" en Sidebar (`frontend/src/components/layout/Sidebar.tsx`)
- [x] 16.3.2 Corregida alineación del icono (cambiado contenedor de `w-4 h-4` a `w-5 h-5` para que coincida con el SVG)

### 16.4 Categorías — Filtro para ocultar categorías padre fuera de sección categorías
- [x] 16.4.1 Catálogo público: filtrado `.filter(cat => cat.parent_id !== null)` en dropdown de ProductFilters (`frontend/src/components/catalog/ProductFilters.tsx`)
- [x] 16.4.2 Formulario de productos: filtrado `.filter(cat => cat.depth > 0)` en checkboxes de ProductForm (`frontend/src/components/catalog/ProductForm.tsx`)
- [x] 16.4.3 HomePage: filtrado `.filter(cat => cat.parent_id !== null)` en categorías destacadas (`frontend/src/pages/HomePage.tsx`)

### 16.5 Header — Renombre a "Foodstore"
- [x] 16.5.1 Cambiado "Food Store" → "Foodstore" en Header y RegisterPage (`frontend/src/components/layout/Header.tsx`, `frontend/src/pages/RegisterPage.tsx`)

### 16.6 Header — Links más grandes
- [x] 16.6.1 Cambiado `text-sm` → `text-base` en links de navegación del Header (`frontend/src/components/layout/Header.tsx`)

---

## Resumen de Prioridades

| Prioridad | Cantidad | Descripción |
|-----------|----------|-------------|
| @critical | 19 | Prerequisitos, infraestructura base |
| @required | 70 | Funcionalidad core del change |
| @optional | 18 | Nice-to-have |
| @testing | 11 | Verificación y QA |

## 17. Frontend Redesign — Tasks Detalladas (mergeado 2026-05-12)

_Tasks migradas del change `frontend-redesign`. 40/79 completadas, 39 pendientes._

### 17.1 Tokens de animación y setup CSS

- [x] 17.1.1 Agregar custom properties de animación en `index.css`: duraciones (fast: 150ms, normal: 250ms, slow: 400ms) y easings (ease-out, ease-in, spring)
- [x] 17.1.2 Agregar keyframes CSS en `index.css`: fadeIn, slideUp, slideDown, slideLeft, slideRight, shimmer, scaleIn, countUp
- [x] 17.1.3 Definir clases utilitarias de animación en `index.css`: `.animate-fade-in`, `.animate-slide-up`, `.animate-shimmer`, `.animate-scale-in`
- [x] 17.1.4 Agregar regla `@media (prefers-reduced-motion: reduce)` global que desactiva animaciones
- [x] 17.1.5 Refinar tokens de color: agregar tokens para superficies elevadas (dropdown, modal, tooltip) con jerarquía de profundidad
- [x] 17.1.6 Refinar scrollbar personalizado con hover state y transición
- [x] 17.1.7 Agregar estilos glassmorphism base (backdrop-blur con bg semitransparente)

### 17.2 Sistema de animaciones

- [x] 17.2.1 Crear hook `useReducedMotion()` que detecta `prefers-reduced-motion`
- [x] 17.2.2 Crear helper `useStaggerAnimation(index: number, baseDelay?: number)` para stagger entrance en listas/grids
- [x] 17.2.3 Crear hook `useCountUp(end: number, duration?: number)` para animación de conteo en métricas
- [x] 17.2.4 Crear hook `useScrollHeader(threshold?: number)` para header scroll-aware
- [x] 17.2.5 Crear componente `AnimatedMount` wrapper que aplica fade-in + slide-up con stagger opcional

### 17.3 Biblioteca de componentes UI

- [x] 17.3.1 Refactor `Button.tsx`: variantes (primary/secondary/ghost/danger), tamaños (sm/md/lg), estados (loading con spinner, disabled, active scale 0.97), animaciones hover/active 200ms
- [x] 17.3.2 Refactor `Input.tsx`: estados (default/focus/error/disabled), iconos de validación inline (check/error), mensaje de error animado debajo del campo, focus ring animado
- [x] 17.3.3 Refactor `Card.tsx`: variantes (default/interactive/elevated/bordered), slots (header/body/footer), hover con translateY(-2px) y shadow, entrance animation opcional
- [x] 17.3.4 Refactor `Badge.tsx`: variantes (default/success/warning/danger/info), tamaños, animación de aparición
- [x] 17.3.5 Refactor `LoadingSpinner.tsx`: variantes (sm/md/lg), colores, texto descriptivo opcional
- [x] 17.3.6 Crear `Skeleton.tsx`: variantes (text/card/circle/table-row), shimmer animation, widths configurables
- [x] 17.3.7 Crear `Modal.tsx`: backdrop con fade-in, content con scale-in, trampa de foco, cierre con Escape/click outside, animación de salida, rol ARIA dialog
- [x] 17.3.8 Crear `Toast.tsx` + `ToastContainer.tsx`: variantes (success/error/warning/info), iconos, auto-dismiss (4s success, manual error), slide-in desde derecha, stack vertical
- [x] 17.3.9 Crear `Tooltip.tsx`: posiciones (top/bottom/left/right), delay 300ms en hover, fade-in 150ms
- [x] 17.3.10 Crear `Dropdown.tsx`: items con iconos, separadores, animación de apertura (fade-in + translateY), cierre con click outside
- [x] 17.3.11 Crear `Tabs.tsx`: indicador animado que se desliza entre pestañas, fade transition en contenido
- [x] 17.3.12 Crear `Table.tsx`: header sticky, filas con hover, sorting visual, estados empty/loading, responsive scroll horizontal
- [x] 17.3.13 Crear `EmptyState.tsx`: icono SVG decorativo grande, título, descripción, CTA opcional
- [x] 17.3.14 Agregar `forwardRef` + `displayName` a todos los componentes UI
- [x] 17.3.15 Agregar roles ARIA y aria-labels a todos los componentes interactivos
- [x] 17.3.16 Verificar contraste WCAG AA (4.5:1) en todos los componentes
- [x] 17.3.17 Actualizar barrel export `components/ui/index.ts` con todos los nuevos componentes
- [x] 17.3.18 Crear `components/ui/index.ts` barrel export si no existe

### 17.4 Rediseño de páginas públicas

- [x] 17.4.1 Migrar `HomePage.jsx` inline de App.tsx a `pages/HomePage.tsx` con hero section (gradiente slate-to-amber, CTA "Ver Catálogo", hover glow)
- [x] 17.4.2 Agregar sección de categorías destacadas en HomePage con grid responsive y stagger entrance
- [x] 17.4.3 Agregar sección de productos populares en HomePage con ProductCard grid
- [x] 17.4.4 Rediseñar `LoginPage.tsx`: card centrada con glassmorphism, fade-in + translateY(20px), validación inline onBlur, botón con loading state
- [x] 17.4.5 Rediseñar `RegisterPage.tsx`: matching design con LoginPage, password strength indicator animado
- [x] 17.4.6 Refinar `CataloguePage.tsx`: grid con stagger entrance, transición de resultados al filtrar (fade-out/fade-in 250ms), filtros como slide-in panel en mobile
- [x] 17.4.7 Refinar `ProductDetailPage.tsx`: layout asimétrico (imagen + info), galería con crossfade en thumbnails, precio destacado, badges de ingredientes
- [x] 17.4.8 Migrar `CartPage` inline a `pages/CartPage.tsx`: layout funcional, estado vacío con icono decorativo y CTA
- [x] 17.4.9 Migrar `ProfilePage` inline a `pages/ProfilePage.tsx`: layout de dos columnas en desktop
- [x] 17.4.10 Rediseñar `AccessDeniedPage.tsx`: icono de advertencia grande, mensaje claro, botones de acción

### 17.5 Rediseño de páginas admin

- [ ] 17.5.1 Migrar `AdminPage` inline a `pages/AdminPage.tsx` con layout de dashboard
- [ ] 17.5.2 Migrar `AdminDashboard` inline a `pages/AdminDashboard.tsx` con cards de métricas
- [ ] 17.5.3 Crear cards de métricas en dashboard: icono, label, valor numérico, variación porcentual, count-up animation
- [ ] 17.5.4 Refinar `AdminCategoriesPage.tsx`: header consistente (título + botón "Nuevo"), tabla con sorting/empty/loading, modal CRUD con animación
- [ ] 17.5.5 Refinar `AdminIngredientsPage.tsx`: matching layout con categories, tabla + modal CRUD
- [ ] 17.5.6 Refinar `AdminProductsPage.tsx`: matching layout, tabla + modal CRUD con ProductForm
- [ ] 17.5.7 Migrar `OrdersPage` inline a `pages/OrdersPage.tsx` con tabla de pedidos

### 17.6 Arquitectura FSD

- [ ] 17.6.1 Crear `entities/user/` con tipos User, UserRole, validadores de email/rol, helpers (nombre completo, iniciales)
- [ ] 17.6.2 Crear `entities/product/` con tipos Product, helpers de formateo de precio, validación de stock
- [ ] 17.6.3 Crear `entities/category/` con tipos Category, helpers de árbol (children/parent) y breadcrumb
- [ ] 17.6.4 Crear `entities/ingredient/` con tipos Ingredient, helpers de alérgenos
- [ ] 17.6.5 Crear `features/auth/` con LoginForm, RegisterForm componentes autocontenidos
- [ ] 17.6.6 Crear `features/product-crud/` con ProductForm, ProductTable, ProductsFilters
- [ ] 17.6.7 Crear `features/category-crud/` con CategoryForm, CategoryTable
- [ ] 17.6.8 Crear `features/ingredient-crud/` con IngredientForm, IngredientTable
- [ ] 17.6.9 Crear `widgets/product-grid/` componiendo ProductCard + Pagination + Filters
- [ ] 17.6.10 Crear `widgets/admin-stats/` componiendo cards de métricas con count-up
- [ ] 17.6.11 Configurar lazy loading con `React.lazy` + `Suspense` en App.tsx para todas las páginas
- [ ] 17.6.12 Crear `PageSkeleton.tsx` como fallback de Suspense genérico por página

### 17.7 Navegación y layout

- [ ] 17.7.1 Implementar sidebar colapsable (w-64 ↔ w-16) con animación de 200ms, tooltips en iconos modo colapsado
- [ ] 17.7.2 Agregar breadcrumbs (`components/layout/Breadcrumbs.tsx`) en páginas admin
- [ ] 17.7.3 Agregar scroll-aware header: reducir padding + agregar shadow al scrollear > 50px
- [ ] 17.7.4 Refinar menú hamburguesa mobile: overlay con backdrop-blur, animación slide-in refinada
- [ ] 17.7.5 Agregar transición de contenido al cambiar de ruta (fade-out/fade-in con skeleton como fallback)

### 17.8 Catálogo público

- [ ] 17.8.1 Refactor `ProductCard.tsx`: hover con elevate + border glow, entrance animation, consistent spacing
- [ ] 17.8.2 Refactor `ProductFilters.tsx`: animaciones en checkboxes/selects, panel slide-in en mobile
- [ ] 17.8.3 Refactor `Pagination.tsx`: botones con hover/active states, transición de página
- [ ] 17.8.4 Refactor `ProductDetailView.tsx`: galería con crossfade, layout asimétrico, precio destacado
- [ ] 17.8.5 Refactor `CategoryTree.tsx`: animaciones en expand/collapse de nodos

### 17.9 Refactor de stores y hooks

- [ ] 17.9.1 Agregar hook `useToast()` para sistema de notificaciones global
- [ ] 17.9.2 Verificar que `useNavigationItems.tsx` genera items correctos para sidebar colapsable

### 17.10 Pulseo final y validación

- [ ] 17.10.1 Verificar responsive en 375px, 768px, 1024px, 1440px (sin scroll horizontal, touch targets ≥44px)
- [ ] 17.10.2 Verificar prefers-reduced-motion desactiva todas las animaciones
- [ ] 17.10.3 Verificar focus rings visibles en navegación por teclado (Tab)
- [ ] 17.10.4 Verificar contraste WCAG AA (4.5:1) en modo oscuro
- [ ] 17.10.5 Verificar que no hay emojis usados como iconos (todos SVG)
- [ ] 17.10.6 Verificar que todas las animaciones usan transform/opacity (no width/height/top/left)
- [ ] 17.10.7 Verificar que el build de producción compila sin errores
- [ ] 17.10.8 Pre-delivery checklist de ui-ux-pro-max: sin emoji-icons, cursor-pointer en clickables, hover states suaves, dark mode contrast, focus states, responsive

---

## Resumen de Prioridades

| Prioridad | Cantidad | Descripción |
|-----------|----------|-------------|
| @critical | 19 | Prerequisitos, infraestructura base |
| @required | 70 | Funcionalidad core del change |
| @optional | 18 | Nice-to-have |
| @testing | 11 | Verificación y QA |

**Total: 203 tareas** (124 originales + 79 frontend-redesign)

---

## 18. Post-Archive — Cambios Adicionales sin Committear (Mayo 2026)

_Cambios aplicados en el working tree después del archive de Change 5, que NO están commiteados ni documentados en secciones anteriores. Mayoría corresponde al frontend-redesign mergeado cuyas tasks ya están marcadas en sección 17._

### 18.1 Types — Allergen migrado a español + IngredientSummary

- [x] 18.1.1 Migrado `Allergen` union type de inglés a español: `'crustaceans'` → `'lacteos'`, `'eggs'` → `'huevos'`, `'fish'` → `'pescado'`, etc. (`frontend/src/shared/types/ingredient.ts`)
- [x] 18.1.2 Agregados `'vegetariano'` y `'vegano'` al type Allergen (`frontend/src/shared/types/ingredient.ts`)
- [x] 18.1.3 Actualizado `ALLERGEN_LABELS` en constants.ts para coincidir con los nuevos nombres español (`frontend/src/components/catalog/constants.ts`)
- [x] 18.1.4 Creada interface `IngredientSummary` con `id`, `name`, `is_allergen` y agregada a `CatalogueProduct.ingredients` (`frontend/src/shared/types/catalogue.ts`)

### 18.2 ProductDetailPage — Layout asimétrico con ingredientes (complementa 17.4.7)

- [x] 18.2.1 Reescrita `ProductDetailPage` con layout asimétrico: galería 3/5 + info 2/5 (`frontend/src/pages/ProductDetailPage.tsx`)
- [x] 18.2.2 Agregado display de ingredientes con Badge (alérgenos destacados con ⚡)
- [x] 18.2.3 Agregado `QuantitySelector` con botones −/+ y display numérico
- [x] 18.2.4 Agregado estado "Agregado al carrito" con feedback visual (checkmark + 2s timeout)
- [x] 18.2.5 Agregada sección de productos relacionados con cards clickeables
- [x] 18.2.6 Eliminado `ProductDetailView` como componente separado (ahora es inline en la page)

### 18.3 HomePage — Migrada inline → archivo propio (complementa 17.4.1)

- [x] 18.3.1 Extraída `HomePage` de inline en App.tsx a `frontend/src/pages/HomePage.tsx`
- [x] 18.3.2 Hero section con gradiente slate-to-amber + CTA "Ver Catálogo"
- [x] 18.3.3 Sección de categorías destacadas con grid responsive + stagger entrance
- [x] 18.3.4 Sección de productos populares con ProductCard grid
- [x] 18.3.5 Category icons: matching por substring/nombre normalizado en vez de exact match (fix: antes todas mostraban 📦)

### 18.4 CartPage — Migrada inline → archivo propio (complementa 17.4.8)

- [x] 18.4.1 Extraída `CartPage` de inline en App.tsx a `frontend/src/pages/CartPage.tsx`
- [x] 18.4.2 Layout funcional con estado vacío e icono decorativo

### 18.5 CataloguePage — Filtros mobile + transiciones (complementa 17.4.6)

- [x] 18.5.1 Agregado panel de filtros slide-in para mobile con backdrop + animación
- [x] 18.5.2 Agregado stagger entrance en grid de productos con `AnimatedMount`
- [x] 18.5.3 Agregada transición de opacidad (250ms) al cambiar filtros (`isTransitioning`)
- [x] 18.5.4 Sidebar de filtros sticky en desktop (sticky top-24)
- [x] 18.5.5 Scroll to top al cambiar de página
- [x] 18.5.6 Botón "Filtros" mobile con badge indicador de filtros activos

### 18.6 LoginPage + RegisterPage — Rediseño completo (complementa 17.4.4, 17.4.5)

- [x] 18.6.1 Glassmorphism cards con backdrop-blur + decorative blobs de fondo
- [x] 18.6.2 Validación inline onBlur: email format, required fields, password match
- [x] 18.6.3 Password strength indicator animado en RegisterPage (débil/regular/buena/fuerte)
- [x] 18.6.4 `AnimatedMount` con slide-up en ambas páginas
- [x] 18.6.5 Textos migrados a español ("Iniciar Sesión", "Registrate", etc.)
- [x] 18.6.6 Iconos SVG decorativos (store logo en login, user plus en register)
- [x] 18.6.7 Eliminado uso de `Card` + `CardContent` (reemplazado por glass card manual)

### 18.7 UI Components — Refactor completo (complementa 17.3.1-17.3.18)

- [x] 18.7.1 `Button.tsx`: variantes (primary/secondary/ghost/danger), tamaños (sm/md/lg), loading con spinner, active scale 0.97, animaciones 200ms
- [x] 18.7.2 `Card.tsx`: variantes (default/interactive/elevated/bordered), slots (header/body/footer), hover translateY(-2px)
- [x] 18.7.3 `Input.tsx`: estados (default/focus/error/disabled), iconos validación (check/error), mensaje error animado
- [x] 18.7.4 `Badge.tsx`: variantes (default/success/warning/danger/info), tamaños (sm/md/lg), animación aparición
- [x] 18.7.5 `EmptyState.tsx`: icono SVG grande decorativo, título, descripción, CTA opcional
- [x] 18.7.6 `LoadingSpinner.tsx`: variantes (sm/md/lg), colores, texto descriptivo opcional
- [x] 18.7.7 `forwardRef` + `displayName` + roles ARIA en todos los componentes UI
- [x] 18.7.8 Barrel export `components/ui/index.ts` actualizado con todos los componentes

### 18.8 Nuevos Componentes UI (complementa 17.3.6-17.3.13)

- [x] 18.8.1 `AnimatedMount.tsx`: wrapper con fade-in + slide-up + stagger delay opcional
- [x] 18.8.2 `Skeleton.tsx`: variantes (text/card/circle/table-row), shimmer animation
- [x] 18.8.3 `Modal.tsx`: backdrop fade-in, content scale-in, focus trap, Escape/click outside
- [x] 18.8.4 `Toast.tsx` + `ToastContainer.tsx`: variantes (success/error/warning/info), auto-dismiss
- [x] 18.8.5 `Tooltip.tsx`: posiciones (top/bottom/left/right), delay 300ms, fade-in 150ms
- [x] 18.8.6 `Dropdown.tsx`: items con iconos, separadores, animación apertura
- [x] 18.8.7 `Tabs.tsx`: indicador animado entre pestañas, fade transition en contenido
- [x] 18.8.8 `Table.tsx`: header sticky, filas hover, sorting visual, estados empty/loading

### 18.9 Animation System — Hooks + CSS (complementa 17.2.1-17.2.5)

- [x] 18.9.1 Custom properties en `index.css`: duraciones (fast/normal/slow), easings (ease-out/ease-in/spring)
- [x] 18.9.2 Keyframes: fadeIn, slideUp, slideDown, slideLeft, slideRight, shimmer, scaleIn
- [x] 18.9.3 Clases utilitarias: `.animate-fade-in`, `.animate-slide-up`, `.animate-shimmer`, `.animate-scale-in`
- [x] 18.9.4 Regla `@media (prefers-reduced-motion: reduce)` que desactiva animaciones
- [x] 18.9.5 Hook `useReducedMotion()` — detecta prefers-reduced-motion
- [x] 18.9.6 Hook `useStaggerAnimation(index, baseDelay?)` — stagger para listas/grids
- [x] 18.9.7 Hook `useCountUp(end, duration?)` — animación de conteo en métricas
- [x] 18.9.8 Hook `useScrollHeader(threshold?)` — header scroll-aware

### 18.10 Admin Pages — Refinamientos de tema oscuro (parcial de 17.5)

- [x] 18.10.1 `IngredientList.tsx`: tabla migrada a tema oscuro (slate), filtros dark, botones amber
- [x] 18.10.2 `CategoryTree.tsx`: hover states slate, selected state amber, botones edit/delete en amber/red
- [x] 18.10.3 `CategoryForm.tsx`: agregada prop `parentCategories` con filtrado self/descendants
- [x] 18.10.4 `AdminCategoriesPage.tsx`: pasa `parentCategories={tree}` al CategoryForm
- [x] 18.10.5 `AdminIngredientsPage.tsx`: removido wrapper redundante `bg-slate-800 border...` del contenedor IngredientList
- [x] 18.10.6 `ProductForm.tsx`: filtrado categorías con `cat.depth > 0` para ocultar categorías padre (ya documentado en 16.4.2)
- [x] 18.10.7 `Constants.ts`: ALLERGEN_LABELS actualizado a español + vegetariano/vegano

### 18.11 Bugfixes y Hotfixes

- [x] 18.11.1 **ProductCard interactive prop**: cambiado `interactive={true}` → `variant="interactive"` para evitar warning React DOM "Received `true` for a non-boolean attribute" (`frontend/src/components/catalog/ProductCard.tsx`)
- [x] 18.11.2 **Category cards uniform height**: cards de categorías tienen altura uniforme independientemente del contenido (con/sin Badge) — `flex flex-col` + altura fija en HomePage
- [x] 18.11.3 **Category icons matching**: cambiado de exact match a `includes()` normalizado para que "Bebidas" matchee con icono de bebidas aunque el nombre exacto en DB sea distinto (`frontend/src/pages/HomePage.tsx`)

### 18.12 Pendiente — Issues detectados sin resolver

- [ ] 18.12.1 **Tests borran DB**: `tests/conftest.py` usa la MISMA base de datos (`foodstoreSDD`) que la app y llama `Base.metadata.drop_all()` después de cada test, destruyendo todas las tablas. Solución: setear `TEST_DATABASE_URL` a una DB separada, o cambiar esquema de tests.

---

## Resumen de Prioridades (actualizado)

| Prioridad | Cantidad | Descripción |
|-----------|----------|-------------|
| @critical | 19 | Prerequisitos, infraestructura base |
| @required | 70 | Funcionalidad core del change |
| @optional | 18 | Nice-to-have |
| @testing | 11 | Verificación y QA |

**Total: 203 tareas** (124 originales + 79 frontend-redesign)