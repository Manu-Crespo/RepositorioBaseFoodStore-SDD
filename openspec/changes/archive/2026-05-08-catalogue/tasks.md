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

---

## Resumen de Prioridades

| Prioridad | Cantidad | Descripción |
|-----------|----------|-------------|
| @critical | 19 | Prerequisitos, infraestructura base |
| @required | 70 | Funcionalidad core del change |
| @optional | 18 | Nice-to-have |
| @testing | 11 | Verificación y QA |

**Total: 118 tareas** (107 originales + 11 modificaciones)