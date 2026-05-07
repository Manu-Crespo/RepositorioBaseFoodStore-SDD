## Why

El sistema actual tiene los route guards pero carece de una navegación visual adaptada por rol, un layout consistente y un tema visual profesional. El diseño actual usa colores genéricos de Tailwind sin cohesión. Necesitamos un tema oscuro e intuitivo que no fatigued la vista y proporcione una experiencia de usuario consistente en todas las páginas.

## What Changes

- **Layout base**: Componente Layout con navegación adaptada por rol de usuario
- **Sidebar/Menú**: Navigation component con menú dinámico según permisos del usuario autenticado
- **Route Guards**: Integración de los guards existentes con feedback visual de acceso denegado
- **Navegación del catálogo**: Mejoras en filtros, búsqueda y paginación del catálogo público
- **Manejo de sesión visual**: Indicador visual del usuario logueado en la barra de navegación
- **Tema visual oscuro completo**: Sistema de diseño oscuro unificado con colores, tipografía, spacing, sombras y componentes reutilizables

## Capabilities

### New Capabilities

- `visual-theme`: Sistema completo de diseño oscuro - paleta de colores, tipografía, spacing, sombras, componentes base (botones, inputs, tarjetas, badges)
- `navigation-layout`: Layout base con navegación adaptada por rol - sidebar/menú dinámico según permisos, indicador de usuario logueado, integración de route guards con feedback visual
- `catalogue-ux-refinement`: Mejoras en la experiencia del catálogo público - filtros intuitivos, feedback de carga, manejo de estados vacíos

### Modified Capabilities

- `catalogue` (de product-management): Refinamientos en la interfaz de catálogo público sin cambios en requisitos del backend

## Impact

- Frontend: Nuevos componentes en `components/layout/`, `components/ui/`, actualización de Tailwind config
- CSS: Nueva capa de estilos base con tema oscuro
- Rutas: Protección por rol integrada con el layout

### Stores

**authStore enhancements requeridos:**

| Campo Nuevo | Tipo | Propósito |
|-------------|------|-----------|
| `navigationItems` | `NavigationItem[]` | Cache de items de navegación generados (evita recomputar en cada render) |
| `sidebarOpen` | `boolean` | Estado del sidebar (open/collapsed) para persistencia |
| `lastRoleChecked` | `string` | Track del último rol para detectar cambios y regenerar menú |

**Nuevos métodos necesarios:**

- `getNavigationItems(): NavigationItem[]` - Genera items según rol actual ( delegar a hook useNavigationItems internamente)
- `toggleSidebar(): void` - Toggle del estado sidebar
- `resetNavigation(): void` - Limpia cache cuando cambia el rol

**Contrato de NavigationItem:**
```typescript
interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles: ('admin' | 'stock' | 'customer')[];
  children?: NavigationItem[]; // Para menús anidados
}
```