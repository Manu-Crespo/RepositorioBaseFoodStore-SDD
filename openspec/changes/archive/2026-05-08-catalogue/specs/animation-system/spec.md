## ADDED Requirements

### Requirement: Sistema de animaciones unificado con tokens
El sistema DEBE definir tokens de animación globales (duración, easing, delay) usados consistentemente en todos los componentes.

#### Scenario: Tokens de duración definidos
- **WHEN** cualquier componente usa una animación
- **THEN** usa duraciones del sistema: micro 150ms, standard 250ms, complex 400ms, enter 300ms, exit 200ms

#### Scenario: Tokens de easing definidos
- **WHEN** cualquier componente usa una animación
- **THEN** usa easings del sistema: ease-out para entradas, ease-in para salidas, spring-physics para interacciones naturales

### Requirement: Transiciones de página con fade-direction
El sistema DEBE aplicar transiciones suaves entre páginas usando fade + directional slide según la navegación (forward/back).

#### Scenario: Transición forward con slide-up
- **WHEN** el usuario navega hacia adelante (de catálogo a detalle de producto)
- **THEN** la nueva página entra con fade-in + translateY(20px→0) en 300ms, la página anterior hace fade-out

#### Scenario: prefers-reduced-motion respetado
- **WHEN** el usuario tiene prefers-reduced-motion: reduce activado
- **THEN** todas las animaciones se deshabilitan, las transiciones son instantáneas

### Requirement: Micro-interacciones en hover y active states
Los elementos interactivos DEBEN tener micro-interacciones sutiles en hover, active, y focus con transform/opacity.

#### Scenario: Card hover con elevación
- **WHEN** el usuario pasa el cursor sobre una tarjeta interactiva
- **THEN** la tarjeta se eleva con translateY(-2px) y shadow aumentado en 200ms ease-out

#### Scenario: Button press con scale feedback
- **WHEN** el usuario presiona un botón
- **THEN** el botón escala a 0.97 en 80ms y vuelve a 1.0 en 150ms al soltar

### Requirement: Stagger entrance para listas y grids
Los elementos en listas/grids DEBEN aparecer con stagger entrance animation para una sensación fluida y natural.

#### Scenario: Grid de productos con stagger
- **WHEN** se carga un grid de productos
- **THEN** cada card aparece con fade-in + translateY(15px→0) con 50ms de delay entre cada una, máximo 500ms total

### Requirement: Skeleton loading con shimmer
Los estados de carga DEBEN usar skeleton screens con animación shimmer en lugar de spinners genéricos.

#### Scenario: Shimmer animation en skeletons
- **WHEN** un skeleton está visible
- **THEN** muestra un gradiente animado que se desplaza de izquierda a derecha en 1.5s loop, creando efecto de shimmer

### Requirement: Toast y notificaciones con slide-in
Las notificaciones toast DEBEN aparecer con slide-in desde la derecha y desaparecer con fade-out.

#### Scenario: Toast slide-in
- **WHEN** se muestra un toast
- **THEN** entra deslizándose desde la derecha (translateX(100%→0)) con fade-in en 250ms ease-out

### Requirement: Reduced-motion support global
El sistema DEBE respetar `prefers-reduced-motion` a nivel global, desactivando todas las animaciones no esenciales.

#### Scenario: Sin animaciones con reduced-motion
- **WHEN** `prefers-reduced-motion: reduce` está activo
- **THEN** todas las animaciones de UI se desactivan (duración 0ms), las transiciones de estado son instantáneas pero funcionales
