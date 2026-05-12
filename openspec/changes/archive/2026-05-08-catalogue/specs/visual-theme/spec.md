## REQUISITOS AGREGADOS

### Requisito: Paleta de colores de tema oscuro
El sistema DEBE implementar una paleta de colores oscura cohesiva que reduzca la fatiga visual y proporcione una jerarquía visual consistente.

#### Escenario: Fondo oscuro en toda la aplicación
- **CUANDO** el usuario carga cualquier página
- **ENTONCES** el fondo usa tonos oscuros de slate/gray (`bg-slate-900` base) en lugar de fondos claros

#### Escenario: Color de acento primario para CTAs
- **CUANDO** se necesitan acciones primarias (botones, enlaces)
- **ENTONCES** el sistema usa un color de acento cálido (ámbar/naranja) que contrasta bien con fondos oscuros

#### Escenario: Jerarquía de texto con contraste adecuado
- **CUANDO** se muestra contenido de texto
- **ENTONCES** los encabezados usan blanco/brillo gris, el texto del cuerpo usa gris muffled (#94a3b8) para legibilidad sin contraste agresivo

### Requisito: Sistema de tipografía
El sistema DEBE implementar un sistema de tipografía consistente con pesos y tamaños adecuados para tema oscuro.

#### Escenario: Encabezados de display
- **CUANDO** se muestran encabezados h1, h2, h3
- **ENTONCES** el sistema usa fuente Poppins con peso bold/600 y color claro (#f8fafc)

#### Escenario: Texto de cuerpo
- **CUANDO** se muestra texto de párrafos
- **ENTONCES** el sistema usa fuente Inter con peso regular/400 y color gris muffled (#94a3b8) para reducir fatiga visual

#### Escenario: Código y etiquetas
- **CUANDO** se muestran etiquetas, badges o metadatos
- **ENTONCES** el sistema usa tamaño de fuente más pequeño (text-xs/sm) con mayúsculas y letter-spacing

### Requisito: Componente Card para tema oscuro
El sistema DEBE proporcionar un componente Card reutilizable estilizado para fondos oscuros.

#### Escenario: Card con fondo oscuro
- **CUANDO** se muestra contenido en un contenedor de tarjeta
- **ENTONCES** la tarjeta usa fondo `bg-slate-800` con borde sutil (`border-slate-700`) y esquinas redondeadas

#### Escenario: Efecto hover en Card
- **CUANDO** el usuario pasa el cursor sobre tarjetas interactivas
- **ENTONCES** la tarjeta muestra un efecto de elevación sutil (shadow-lg) y destaque de borde

### Requisito: Variantes del componente Botón
El sistema DEBE proporcionar estilos de botones consistentes para variantes primaria, secundaria y ghost.

#### Escenario: Botón primario
- **CUANDO** se muestra una llamada a acción primaria
- **ENTONCES** el botón usa fondo ámbar/naranja (`bg-amber-500`) con texto oscuro, esquinas redondeadas, brillo sutil en hover

#### Escenario: Botón secundario
- **CUANDO** se muestran acciones secundarias
- **ENTONCES** el botón usa estilo outline con `border-slate-600` y fondo transparente

#### Escenario: Botón ghost
- **CUANDO** se muestran acciones terciarias o en barra de herramientas
- **ENTONCES** el botón usa sin fondo, solo texto con efecto hover de subrayado

### Requisito: Inputs de formulario para tema oscuro
El sistema DEBE estilizar los inputs de formulario para coincidir con el tema oscuro sin contraste agresivo.

#### Escenario: Campos de texto input
- **CUANDO** se muestran inputs de texto, select o textarea
- **ENTONCES** el input usa fondo `bg-slate-800`, borde `border-slate-600` y color de texto muffled

#### Escenario: Estado focus del input
- **CUANDO** el usuario enfoca un campo de input
- **ENTONCES** el input muestra anillo ámbar (`ring-amber-500`) para indicación clara de focus

### Requisito: Estilizado del Sidebar para tema oscuro
El sistema DEBE estilizar la navegación del sidebar para coincidir con el tema oscuro con jerarquía visual clara.

#### Escenario: Fondo del Sidebar
- **CUANDO** se muestra la navegación del sidebar
- **ENTONCES** el sidebar usa fondo ligeramente más oscuro (`bg-slate-950`) que el contenido principal para crear profundidad

#### Escenario: Item activo del Sidebar
- **CUANDO** se muestra un item de navegación activo
- **ENTONCES** el item muestra acento ámbar en fondo/borde y texto más brillante para indicar ubicación actual

### Requisito: Estados de carga para tema oscuro
El sistema DEBE proporcionar indicadores de carga que funcionen bien sobre fondos oscuros.

#### Escenario: Spinner sobre fondo oscuro
- **CUANDO** se muestra un spinner de carga
- **ENTONCES** el spinner usa color ámbar que destaca contra el fondo oscuro

### Requisito: Estados vacíos para tema oscuro
El sistema DEBE proporcionar componentes de estado vacío que coincidan con la estética del tema oscuro.

#### Escenario: Display de estado vacío
- **CUANDO** se muestra sin datos o resultados vacíos
- **ENTONCES** el componente usa icono muted, texto descriptivo en gris, y botón CTA opcional

---

## MEJORAS POSTERIORES (merged from frontend-redesign, 2026-05-12)

### Requisito: Glassmorphism para overlays y modales
El sistema DEBE aplicar efectos glassmorphism (blur + transparencia) en modales, dropdowns, y paneles superpuestos.

#### Escenario: Modal con glass effect
- **CUANDO** se abre un modal
- **ENTONCES** el contenido usa fondo `bg-slate-800/80` con `backdrop-blur-md` para efecto glass

### Requisito: Animaciones de transición en todos los elementos interactivos
El sistema DEBE agregar transiciones suaves (150-300ms) en hover, focus, active de todos los elementos interactivos.

#### Escenario: Transiciones en botones
- **CUANDO** un botón cambia de estado (hover/active/disabled)
- **ENTONCES** todas las propiedades visuales usan `transition-all duration-200 ease-out` para cambios suaves

### Requisito: Focus rings consistentes con animación
El sistema DEBE aplicar focus rings visibles con animación suave en todos los elementos interactivos.

#### Escenario: Focus ring animado en inputs
- **CUANDO** un input recibe foco
- **ENTONCES** el anillo ámbar aparece con `transition-all duration-150` en lugar de instantáneo

### Requisito: Nuevos tokens de color para superficies
El sistema DEBE agregar tokens semánticos para superficies elevadas (dropdown, modal, tooltip) con jerarquía de profundidad.

#### Escenario: Token para superficie elevated
- **CUANDO** se renderiza un dropdown, modal o tooltip
- **ENTONCES** usa `bg-slate-800` con border `border-slate-600` y shadow `shadow-xl` para diferenciarse de superficies base

### Requisito: Scrollbar personalizado más estilizado
El scrollbar personalizado DEBE refinarse con bordes redondeados y hover state para mejor experiencia visual.

#### Escenario: Scrollbar thumb con hover
- **CUANDO** el usuario pasa el cursor sobre el scrollbar
- **ENTONCES** el thumb cambia de `bg-slate-600` a `bg-slate-500` con transición de 150ms

### Requisito: Estados de carga con skeleton shimmer
Los estados de carga DEBEN usar skeleton screens con shimmer animation en lugar de spinners genéricos.

#### Escenario: Skeleton loading en cards
- **CUANDO** contenido tipo card está cargando
- **ENTONCES** se muestra skeleton con shimmer animation instead of spinner

### Requisito: Estados vacíos con icono decorativo
Los estados vacíos DEBEN incluir iconos decorativos SVG grandes, mensaje claro, y CTA opcional.

#### Escenario: Estado vacío decorativo
- **CUANDO** se muestra sin datos o resultados vacíos
- **ENTONCES** el componente usa icono SVG decorativo grande, texto descriptivo en gris, y botón CTA opcional