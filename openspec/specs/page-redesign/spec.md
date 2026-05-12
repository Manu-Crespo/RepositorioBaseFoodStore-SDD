## ADDED Requirements

### Requirement: LoginPage rediseñada con card centrada y animación
La página de login DEBE mostrar un formulario centrado en una card con glassmorphism, animación de entrada, y feedback visual en tiempo real.

#### Scenario: Login con card glassmorphism
- **WHEN** el usuario carga /login
- **THEN** ve una card con fondo `bg-slate-800/80` con backdrop-blur, borde sutil, centrada en pantalla con fade-in + translateY(20px→0) en 400ms

#### Scenario: Campos con validación inline
- **WHEN** el usuario escribe en un campo de login
- **THEN** la validación ocurre onBlur con icon check/error animado y mensaje de error debajo del campo

#### Scenario: Botón submit con loading state
- **WHEN** el usuario envía el formulario
- **THEN** el botón muestra spinner + "Ingresando..." con el form deshabilitado durante la petición

### Requirement: RegisterPage con diseño consistente
La página de registro DEBE mantener el mismo diseño que LoginPage con card glassmorphism, multi-step si aplica, y validación completa.

#### Scenario: Register con password strength indicator
- **WHEN** el usuario escribe una contraseña
- **THEN** se muestra una barra de fortaleza animada (rojo→ámbar→verde) debajo del campo

### Requirement: Página de Inicio (Home) con hero section
La página Home DEBE mostrar un hero section visual con CTA, sección de categorías destacadas, y productos populares con animaciones de entrada.

#### Scenario: Hero con gradiente y CTA
- **WHEN** el usuario visita /
- **THEN** ve un hero section con gradiente slate-to-amber, título de display, subtítulo, y botón CTA "Ver Catálogo" con hover glow effect

#### Scenario: Categorías destacadas en grid
- **WHEN** el usuario scrollea debajo del hero
- **THEN** ve un grid de cards de categorías con iconos, stagger entrance animation (30-50ms delay entre cada card)

### Requirement: Catálogo con layout refinado y micro-interacciones
La página de catálogo DEBE mostrar productos en grid responsive con filtros animados, paginación, y transiciones de resultados.

#### Scenario: Grid de productos con stagger entrance
- **WHEN** los productos se cargan en el catálogo
- **THEN** aparecen con fade-in + translateY secuencial (30ms stagger) en 300ms total

#### Scenario: Filtros con slide-out en mobile
- **WHEN** el viewport es < 768px
- **THEN** los filtros son un panel slide-in desde la izquierda con overlay backdrop, activado por botón "Filtros"

#### Scenario: Transición de resultados al filtrar
- **WHEN** el usuario aplica un filtro
- **THEN** los productos existentes hacen fade-out, los nuevos hacen fade-in, con duración total de 250ms

### Requirement: ProductDetailPage con galería y layout asimétrico
La página de detalle de producto DEBE mostrar una galería de imágenes, info del producto, y acciones con layout asimétrico moderno.

#### Scenario: Galería con imagen principal y thumbnails
- **WHEN** el usuario ve un producto
- **THEN** ve una imagen principal grande con thumbnails debajo, y al hacer clic en thumbnail la imagen principal cambia con crossfade de 200ms

#### Scenario: Info del producto con precio destacado
- **WHEN** el usuario scrollea la info del producto
- **THEN** el precio se muestra grande y destacado en ámbar, los ingredientes como badges, y botón "Agregar al Carrito" con animación de feedback

### Requirement: Admin Dashboard con cards de métricas y gráficos
El dashboard admin DEBE mostrar cards de métricas clave (productos, pedidos, usuarios) con iconos, valores animados, y layout de grid responsive.

#### Scenario: Cards de métricas con iconos
- **WHEN** el admin ve el dashboard
- **THEN** ve un grid de 4 cards con icono, label, valor numérico grande, y variación porcentual con color (verde↑ / rojo↓)

#### Scenario: Animación de conteo en métricas
- **WHEN** las cards de métricas se montan
- **THEN** los números hacen count-up animation desde 0 hasta su valor final en 500ms

### Requirement: Páginas admin con layout de datatables consistente
Las páginas de gestión (Categorías, Ingredientes, Productos, Usuarios) DEBEN compartir un layout consistente: header con título + botón "Nuevo", tabla con datos, y modal/form inline para CRUD.

#### Scenario: Tabla con header consistente
- **WHEN** el admin navega a cualquier página de gestión
- **THEN** ve un header con título de página y botón "Nuevo +" alineado a la derecha, seguido de una tabla con datos

#### Scenario: Modal de creación/edición con animación
- **WHEN** el admin hace clic en "Nuevo" o "Editar"
- **THEN** se abre un modal con el formulario correspondiente, animación de entrada, y focus en el primer campo

### Requirement: Páginas de perfil y carrito con diseño funcional
ProfilePage y CartPage DEBEN tener un diseño limpio con cards informativas, estados vacíos ilustrativos, y acciones claras.

#### Scenario: Carrito vacío con ilustración
- **WHEN** el usuario visita /cart sin productos
- **THEN** ve un estado vacío con icono decorativo grande, mensaje "Tu carrito está vacío", y botón CTA "Ver Catálogo"

#### Scenario: Profile con layout de dos columnas
- **WHEN** el usuario ve su perfil en desktop
- **THEN** ve un layout de dos columnas: info personal en columna izquierda, historial/actividad en columna derecha

### Requirement: AccessDeniedPage con diseño informativo
La página de acceso denegado DEBE mostrar un mensaje claro con icono ilustrativo, explicación, y acciones de navegación.

#### Scenario: Access denied con acción de volver
- **WHEN** el usuario no tiene permisos
- **THEN** ve un icono grande de advertencia, mensaje "No tienes permisos", explicación breve, y botones "Volver al inicio" y "Contactar soporte"
