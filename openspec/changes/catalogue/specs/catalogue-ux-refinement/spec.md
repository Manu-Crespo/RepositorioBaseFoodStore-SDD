## REQUISITOS AGREGADOS

### Requisito: La página del catálogo muestra estado de carga durante la obtención de datos
El sistema DEBE mostrar un indicador de carga mientras obtiene los datos del catálogo desde la API.

#### Escenario: Cargando productos desde la API
- **CUANDO** el usuario navega a "/catalogo" y la solicitud API está en progreso
- **ENTONCES** el sistema muestra un spinner de carga o componentes esqueleto dentro de **< 100ms** de iniciado el request

#### Escenario: La carga se completa exitosamente
- **CUANDO** la API retorna la lista de productos exitosamente
- **ENTONCES** el indicador de carga desaparece y se muestra la grilla de productos dentro de **< 200ms** de recibida la respuesta

#### Escenario: La carga falla por error de red
- **CUANDO** la solicitud API falla por timeout o error de red (> 10s)
- **ENTONCES** el sistema muestra mensaje de error con botón de reintento

### Requisito: La página del catálogo muestra estado vacío cuando no hay productos disponibles
El sistema DEBE mostrar un mensaje amigable cuando el catálogo retorna sin productos.

#### Escenario: Respuesta de catálogo vacía
- **CUANDO** la API retorna un array vacío para productos
- **ENTONCES** el sistema muestra "No hay productos disponibles en el catálogo" con ilustración o icono

### Requisito: Los filtros del catálogo persisten durante la sesión
El sistema DEBE mantener el estado de los filtros durante la sesión de navegación del usuario.

#### Escenario: Usuario selecciona filtro de categoría
- **CUANDO** el usuario selecciona el filtro de categoría "Bebidas"
- **ENTONCES** el filtro permanece activo mientras el usuario navega a detalles del producto y vuelve al catálogo

### Requisito: Los filtros de productos proporcionan feedback inmediato
El sistema DEBE actualizar la visualización de productos inmediatamente cuando el usuario cambia las opciones de filtro.

#### Escenario: Usuario aplica filtro de alérgenos
- **CUANDO** el usuario marca el filtro de alérgenos "Sin TACC"
- **ENTONCES** la grilla de productos se actualiza dentro de **≤ 300ms** para mostrar solo productos sin alérgenos de gluten

#### Escenario: Feedback optimista en cambio de filtros
- **CUANDO** el usuario cambia cualquier filtro (categoría, búsqueda, ordenamiento)
- **ENTONCES** la UI muestra un indicador de loading sutil (skeleton) mientras recarga la grilla con los nuevos filtros aplicados

#### Escenario: Persistencia de filtros en navegación
- **CUANDO** el usuario tiene filtros activos y navega a un detalle de producto y vuelve
- **ENTONCES** los filtros permanecen exactamente como estaban (estado + valores) dentro del tiempo de sesión del usuario