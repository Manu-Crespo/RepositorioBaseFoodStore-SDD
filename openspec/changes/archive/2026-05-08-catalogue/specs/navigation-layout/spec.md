## REQUISITOS AGREGADOS

### Requisito: El componente Layout adapta la navegación según el rol del usuario
El sistema DEBE proporcionar un componente Layout que renderice diferentes estructuras de navegación según el rol del usuario autenticado.

#### Escenario: Usuario no autenticado visualiza layout público
- **CUANDO** el usuario no está autenticado y visita cualquier ruta pública
- **ENTONCES** el sistema renderiza Layout SIN sidebar y con navegación pública (Home, Catálogo, Login, Register)

#### Escenario: Cliente autenticado visualiza layout de cliente
- **CUANDO** el usuario está autenticado con rol "customer"
- **ENTONCES** el sistema renderiza Layout SIN sidebar y con navegación de cliente (Home, Catálogo, Carrito, Pedidos, Perfil, Mi cuenta)

#### Escenario: Gestor de stock autenticado visualiza layout de stock
- **CUANDO** el usuario está autenticado con rol "stock"
- **ENTONCES** el sistema renderiza Layout CON sidebar contendo: Dashboard, Categorías, Ingredientes, Productos y header con info del usuario

#### Escenario: Administrador autenticado visualiza layout de admin
- **CUANDO** el usuario está autenticado con rol "admin"
- **ENTONCES** el sistema renderiza Layout CON sidebar contendo: Dashboard, Pedidos, Categorías, Ingredientes, Productos, Usuarios y header con info del usuario

### Requisito: El Sidebar muestra items de navegación para roles restringidos
El sistema DEBE mostrar un componente Sidebar para usuarios con rol "stock" o "admin" conteniendo enlaces de navegación apropiados para el rol.

#### Escenario: Rol stock ve menú de stock
- **CUANDO** el usuario tiene rol "stock"
- **ENTONCES** el sidebar muestra: Dashboard, Gestión > (Categorías, Ingredientes, Productos) dentro de **< 100ms** de renderizado el Layout

#### Escenario: Rol admin ve menú completo
- **CUANDO** el usuario tiene rol "admin"
- **ENTONCES** el sidebar muestra: Dashboard, Pedidos, Gestión > (Categorías, Ingredientes, Productos), Usuarios dentro de **< 100ms** de renderizado el Layout

#### Escenario: Sidebar destaca la ruta activa
- **CUANDO** el usuario navega a una ruta que coincide con un enlace del sidebar
- **ENTONCES** ese enlace DEBE estar visualmente destacado (fondo/borde diferente) dentro de **< 50ms** del cambio de ruta

#### Escenario: Menú responsive en mobile
- **CUANDO** el viewport es < 768px (mobile)
- **ENTONCES** el sidebar se oculta y muestra menú hamburguesa que despliega en **< 200ms** con animación slide-in

### Requisito: El Header muestra información del usuario autenticado
El sistema DEBE mostrar el nombre y rol del usuario logueado en la barra de navegación del header.

#### Escenario: Usuario autenticado ve su nombre en el header
- **CUANDO** el usuario está autenticado con first_name "Juan" y last_name "Pérez"
- **ENTONCES** el header muestra "Juan Pérez" como identificador del usuario

#### Escenario: Header muestra botón de logout para usuarios autenticados
- **CUANDO** el usuario está autenticado
- **ENTONCES** el header muestra un botón Logout que activa el flow de logout

### Requisito: Los route guards proporcionan feedback de acceso denegado
El sistema DEBE mostrar una página clara de "Acceso Denegado" cuando el usuario no tiene permisos para una ruta protegida.

#### Escenario: Cliente intenta acceder a ruta de admin
- **CUANDO** el usuario con rol "customer" navega a "/admin"
- **ENTONCES** el sistema muestra AccessDeniedPage con mensaje "No tienes permisos para acceder a esta página"

#### Escenario: Usuario no autenticado intenta acceder a ruta protegida
- **CUANDO** usuario no autenticado navega a "/cart"
- **ENTONCES** el sistema redirige a "/login" con parámetro returnUrl

### Requisito: Los items de navegación se generan desde permisos del rol
El sistema DEBE generar los items de navegación dinámicamente según los permisos del rol del usuario usando un hook useNavigationItems.

#### Escenario: Items de navegación generados para cada rol
- **CUANDO** se llama al hook useNavigationItems con rol "stock"
- **ENTONCES** devuelve un array de items de navegación con etiquetas, iconos y paths apropiados para el rol stock

---

## MEJORAS POSTERIORES (merged from frontend-redesign, 2026-05-12)

### Requisito: Transiciones suaves en navegación
El sistema DEBE aplicar transiciones suaves al cambiar entre rutas, con indicación visual de la transición.

#### Escenario: Transición entre páginas admin
- **CUANDO** el usuario navega entre páginas admin (ej: Categorías → Productos)
- **ENTONCES** el contenido principal hace fade-out/fade-in en 200ms con skeleton loading como fallback

### Requisito: Breadcrumbs en páginas admin
El sistema DEBE mostrar breadcrumbs en todas las páginas admin para orientación del usuario.

#### Escenario: Breadcrumb en gestión de productos
- **CUANDO** el admin está en /admin/productos
- **ENTONCES** ve breadcrumb: Inicio > Administración > Productos con el último item como texto plano (no link)

### Requisito: Sidebar colapsable en desktop
El sidebar DEBE permitir colapsarse a iconos solamente en desktop para dar más espacio al contenido.

#### Escenario: Sidebar colapsado
- **CUANDO** el usuario hace clic en el botón colapsar del sidebar
- **ENTONCES** el sidebar se reduce a `w-16` mostrando solo iconos, con animación de 200ms, los tooltips aparecen en hover sobre iconos

### Requisito: Header con scroll-aware behavior
El header DEBE cambiar su estilo al scrollear hacia abajo (más compacto, con sombra) para mejor aprovechamiento del espacio.

#### Escenario: Header compacto al scrollear
- **CUANDO** el usuario scrollea hacia abajo > 50px
- **ENTONCES** el header reduce su padding, agrega `shadow-md` y fondo más opaco con transición de 200ms