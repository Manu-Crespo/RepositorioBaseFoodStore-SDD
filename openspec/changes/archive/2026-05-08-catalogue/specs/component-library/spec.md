## ADDED Requirements

### Requirement: Component Button con estados completos
El sistema DEBE proporcionar un componente Button con variantes (primary, secondary, ghost, danger), tamaños (sm, md, lg), y estados completos (default, hover, active, disabled, loading) con animaciones suaves.

#### Scenario: Botón primary con loading state
- **WHEN** el usuario hace clic en un botón primary y la acción es async
- **THEN** el botón se deshabilita, muestra un spinner animado y cambia su opacidad a 0.7 dentro de **< 50ms**

#### Scenario: Botón danger con confirmación visual
- **WHEN** el usuario pasa el cursor sobre un botón danger
- **THEN** el botón cambia a un tono rojo más intenso con transición de 200ms y escala 1.02

#### Scenario: Botón con icono y texto
- **WHEN** se renderiza un botón con icono SVG y texto
- **THEN** el icono se alinea verticalmente con el texto con gap de 8px y el botón mantiene padding consistente

### Requirement: Component Card con animaciones y jerarquía visual
El sistema DEBE proporcionar un componente Card con variantes (default, interactive, elevated, bordered) y animaciones de hover/entrada.

#### Scenario: Card interactiva con hover elevado
- **WHEN** el usuario pasa el cursor sobre una Card interactiva
- **THEN** la Card se eleva con `shadow-lg` a `shadow-xl`, escala 1.02, y borde más brillante con transición de 200ms y ease-out

#### Scenario: Card con entrada animada
- **WHEN** una Card se monta en el DOM con prop `animated`
- **THEN** la Card hace fade-in + translateY(20px → 0) en 300ms con ease-out

#### Scenario: Card con header, body y footer
- **WHEN** se usa la Card con slots header, body y footer
- **THEN** header usa `text-lg font-semibold` con padding top, body usa padding simétrico, footer usa `border-t` sutil y padding

### Requirement: Component Modal con animación y foco
El sistema DEBE proporcionar un componente Modal accesible con animación de entrada/salida, trampa de foco, y cierre con Escape/click outside.

#### Scenario: Modal abre con animación
- **WHEN** se abre un modal
- **THEN** el backdrop hace fade-in en 200ms y el contenido escala de 0.95→1 con fade-in en 250ms

#### Scenario: Modal cierra con Escape
- **WHEN** el usuario presiona Escape mientras el modal está abierto
- **THEN** el modal se cierra con animación inversa en 150ms

#### Scenario: Modal mantiene foco interno
- **WHEN** el modal está abierto
- **THEN** el foco se atrapa dentro del modal, el primer elemento focusable recibe foco automático

### Requirement: Component Skeleton para loading states
El sistema DEBE proporcionar un componente Skeleton con variantes (text, card, circle, table-row) y animación shimmer.

#### Scenario: Skeleton text en carga
- **WHEN** un contenido de texto está cargando
- **THEN** se muestra un Skeleton de ancho variable con shimmer animation que recorre de izquierda a derecha en 1.5s

#### Scenario: Skeleton card en grid de productos
- **WHEN** el catálogo de productos está cargando
- **THEN** se muestra un grid de Skeleton cards con la misma estructura que ProductCard pero sin contenido

### Requirement: Component Toast para notificaciones
El sistema DEBE proporcionar un sistema de Toast para notificaciones con variantes (success, error, warning, info), auto-dismiss y Stack vertical.

#### Scenario: Toast success con auto-dismiss
- **WHEN** una operación se completa exitosamente
- **THEN** se muestra un toast success en la esquina superior derecha con icon check verde, fade-in slide-in, y auto-dismiss en 4s

#### Scenario: Toast error con acción de retry
- **WHEN** una operación falla
- **THEN** se muestra un toast error con icon X rojo, mensaje claro, y botón "Reintentar" que no se cierra automáticamente

### Requirement: Component Tooltip informativo
El sistema DEBE proporcionar un componente Tooltip que aparezca en hover/focus con posiciones configurables (top, bottom, left, right).

#### Scenario: Tooltip en hover con delay
- **WHEN** el usuario mantiene el cursor sobre un elemento con tooltip por 300ms
- **THEN** el tooltip aparece con fade-in de 150ms, texto informativo, y fondo oscuro `bg-slate-800`

### Requirement: Component Dropdown menu
El sistema DEBE proporcionar un componente Dropdown con items, separadores, iconos, y animación de apertura/cierre.

#### Scenario: Dropdown abre con animación
- **WHEN** el usuario hace clic en un trigger de dropdown
- **THEN** el menú se despliega con fade-in + translateY(-4px→0) en 150ms

### Requirement: Component Tabs con animación de indicador
El sistema DEBE proporcionar un componente Tabs con indicador animado que se deslice entre pestañas.

#### Scenario: Tabs cambian con indicador animado
- **WHEN** el usuario hace clic en una pestaña diferente
- **THEN** el contenido cambia con fade transition en 200ms y el indicador inferior se desliza a la nueva posición

### Requirement: Component Table con sorting y estados
El sistema DEBE proporcionar un componente Table con soporte para sorting visual, filas con hover, y estados empty/loading.

#### Scenario: Table con filas hover
- **WHEN** el usuario pasa el cursor sobre una fila de tabla
- **THEN** la fila cambia a fondo `bg-slate-800/50` con transición de 150ms

#### Scenario: Table empty state
- **WHEN** no hay datos para mostrar en la tabla
- **THEN** se muestra un mensaje "No hay datos" con icon y opción de acción CTA

### Requirement: Componentes accesibles WCAG AA
Todos los componentes UI DEBEN cumplir con WCAG AA: contraste 4.5:1, focus rings visibles, roles ARIA, labels descriptivos, soporte de teclado.

#### Scenario: Focus ring visible en todos los interactivos
- **WHEN** el usuario navega con teclado (Tab) a cualquier componente interactivo
- **THEN** se muestra un focus ring de 2px color ámbar (`ring-amber-500`) alrededor del elemento

#### Scenario: Roles ARIA en componentes semánticos
- **WHEN** se renderiza un Modal, Dropdown o Tabs
- **THEN** los componentes tienen roles ARIA apropiados (dialog, menu, tablist), aria-expanded, aria-selected, etc.
