## Context

El proyecto actual tiene una navegación básica en el Header de App.tsx que muestra links según auth y rol, pero carece de:
- Un Layout component que envuelva las rutas
- Sidebar para roles admin/stock
- Un tema visual consistente
- Feedback visual claro para rutas protegidas

El catálogo público ya existe (CataloguePage, ProductDetailPage) con filtros básicos pero necesita refinamientos UX y un diseño profesional.

## Goals / Non-Goals

**Goals:**
- Crear sistema de diseño oscuro unificado (tema visual)
- Crear Layout component con navegación adaptada por rol
- Implementar Sidebar para roles STOCK y ADMIN con menú dinámico
- Mantener Header existente para navegación pública
- Integrar route guards con página de "acceso denegado"
- Mejorar UX del catálogo público (loading states, empty states)
- Aplicar tema oscuro a todas las páginas existentes

**Non-Goals:**
- No implementar nueva lógica de autenticación (ya existe en Change 3)
- No crear nuevas páginas de admin (ya existen)
- No modificar el backend de catálogo (ya está implementado)

## Decisions

1. **Paleta de colores oscura**: Usar slate-900 como base, con acentos en amber para CTAs
   - Background principal: slate-900 (#0f172a)
   - Cards/Containers: slate-800 (#1e293b)
   - Sidebar: slate-950 (#020617)
   - Acento primary: amber-500 (#f59e0b)
   - Texto headings: slate-100 (#f1f5f9)
   - Texto body: slate-400 (#94a3b8)

2. **Tipografía**: Poppins para headings (display), Inter para body (sans)
   - Headings: font-display (Poppins), font-semibold, text-slate-100
   - Body: font-sans (Inter), text-slate-400

3. **Layout con Sidebar vs solo Header**: Layout con Sidebar para roles admin/stock, Header solo para públicos/clientes.

4. **Sidebar como componente separado**: `components/layout/Sidebar.tsx` integrado según el rol.

5. **Propuesta de Layout**:
   ```
   - PublicLayout (sin sidebar): Home, Catálogo, Login, Register
   - AuthLayout (con sidebar): Dashboard, Admin pages
   ```

6. **UX Catalogue**: Usar Zustand store existente y agregar estados de loading/empty.

7. **UI Components**: Crear en `components/ui/` para reutilización:
   - Button (variants: primary, secondary, ghost)
   - Input (dark styled)
   - Card (con hover effects)
   - Badge (para labels)
   - LoadingSpinner, EmptyState

## Risks / Trade-offs

- [Risk] Migrar todas las rutas al nuevo Layout podría romper rutas existentes → Mitigation: Mantener compatibilidad hacia atrás, hacer la migración gradual
- [Risk] El Sidebar podría ocultar contenido en mobile → Mitigation: Usar responsive design con menú hamburguesa en mobile
- [Risk] Duplicar lógica de roles en Sidebar y Header → Mitigation: Crear hook useNavigationItems que ambos componentes consuman

## Migration Plan

1. Extender Tailwind config con colores oscuros
2. Crear componentes UI base (Button, Input, Card, Badge)
3. Actualizar index.css con tema oscuro
4. Crear componentes: Layout, Sidebar, useNavigationItems hook
5. Actualizar App.tsx para usar Layout condicional
6. Agregar página de AccessDenied
7. Aplicar tema a páginas existentes (Login, Register, Catalogue, etc.)
8. Refinar CataloguePage con loading/empty states
9. Testing de navegación con todos los roles

## Arquitectura

### Estructura de Archivos

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx           # Componente contenedor principal
│   │   ├── AuthLayout.tsx        # Layout con sidebar (admin/stock)
│   │   ├── PublicLayout.tsx     # Layout sin sidebar (público)
│   │   ├── Sidebar.tsx          # Navegación lateral
│   │   ├── Header.tsx           # Barra de navegación superior
│   │   └── index.ts            # Exports
│   │
│   ├── ui/
│   │   ├── Button.tsx           # Botón con variantes
│   │   ├── Input.tsx            # Input estilizado oscuro
│   │   ├── Card.tsx             # Tarjeta con hover
│   │   ├── Badge.tsx            # Etiquetas/roles
│   │   ├── LoadingSpinner.tsx  # Spinner de carga
│   │   ├── EmptyState.tsx       # Estado vacío
│   │   └── index.ts
│   │
│   └── index.ts
│
├── hooks/
│   ├── useNavigationItems.ts    # Genera items según rol
│   └── index.ts
│
├── pages/
│   └── AccessDeniedPage.tsx    # Página de acceso denegado
│
└── App.tsx                     # Router con Layout condicional
```

### Flujo de Datos - Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│                         App.tsx                                     │
│  ┌─────────────┐    ┌─────────────────────────────────────────┐   │
│  │   Routes    │───▶│ ProtectedRoute / AdminGuard / StockGuard│   │
│  └─────────────┘    └──────────────────┬────────────────────────┘   │
│                                         │                          │
│                                         ▼                          │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                       Layout (condicional)                     ││
│  │                                                                  ││
│  │  ┌──────────────┐  ┌─────────────────────────────────────┐   ││
│  │  │   Sidebar    │  │           Outlet (page content)       │   ││
│  │  │              │  │                                         │   ││
│  │  │ useNavItems  │  │  ┌─────────────────────────────┐     │   ││
│  │  │    ─────     │  │  │    CataloguePage             │     │   ││
│  │  │ authStore    │  │  │    - Loading states          │     │   ││
│  │  │ .role        │  │  │    - Empty states             │     │   ││
│  │  │ .user        │  │  │    - Filters                  │     │   ││
│  │  └──────────────┘  │  └─────────────────────────────┘     │   ││
│  │                    └─────────────────────────────────────┘   ││
│  └──────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Flujo de Renderizado

1. **Usuario visita ruta** → App.tsx determina qué Layout usar
2. **Layout renderiza** → Según authStore.role, decide PublicLayout vs AuthLayout
3. **AuthLayout incluye Sidebar** → Llama useNavigationItems(role) para obtener items
4. **useNavigationItems** → Lee authStore.user + role, retorna array de NavigationItem[]
5. **Sidebar renderiza** → Itera items, marca activo según location.pathname
6. **Outlet carga página** → CataloguePage usa catalogueStore, muestra estados

### Integración con Stores Existentes

| Store | Rol en esta change |
|-------|-------------------|
| `authStore` | Leer `.role` y `.user` para generar navegación; agregar `.sidebarOpen` |
| `catalogueStore` | Leer estado para mostrar loading/empty en CataloguePage |
| `cartStore` | Ninguno (no afecta esta change) |

### Decisiones de Composición

- **Layout como HOC**: El Layout envuelve todas las páginas, no las páginas(envuelven a Layout)
- **useNavigationItems como hook puro**: No modifica stores, solo computa返回值
- **Sidebar dentro de Layout**: No es una ruta, es parte del Layout
- **Route guards protegen Outlet**: Los guards decides si renderizar Outlet, no Layout

---

## Frontend Redesign — Complemento de Diseño (mergeado 2026-05-12)

### Decisions Adicionales

#### D1: Mantener Tailwind CSS v4 + clsx (no agregar framework UI)
**Rationale**: El proyecto ya tiene Tailwind v4 con tema custom. Agregar shadcn/ui o Chakra implicaría migración de componentes existentes. Mejor crear componentes UI internos siguiendo guías ui-ux-pro-max.

#### D2: CSS animations + Tailwind (sin framer-motion inicialmente)
**Rationale**: Las animaciones necesarias (fade, slide, scale, shimmer) son alcanzables con Tailwind transition + keyframes en index.css. Evita agregar dependencia de 30KB+. framer-motion se deja como opción futura.

#### D3: Tokens de animación en index.css con custom properties
**Rationale**: `--duration-fast: 150ms`, `--duration-normal: 250ms`, easings como `--ease-out: cubic-bezier(...)` en index.css permiten consistencia global.

#### D4: Componentes UI con forwardRef + displayName + tipos completos
**Rationale**: Para accesibilidad y composición, todos los componentes UI debe forwardear refs (tooltips, modales, focus management) y tener displayName para debugging.

#### D5: lazy loading por ruta con Suspense + skeleton fallback
**Rationale**: Mejora rendimiento percibido. Cada página se importa con React.lazy() + un Skeleton como fallback que refleja la estructura de la página.

#### D6: Arquitectura FSD — entidades puras, features = lógica + UI
**Rationale**: Separación clara: entities/ (types, validators, formatters sin imports de stores), features/ (componentes + hooks que combinan entities + stores), widgets/ (composiciones complejas).

#### D7: Sistema de animaciones basado en clases utilitarias
**Rationale**: Clases reutilizables como `.animate-fade-in`, `.animate-slide-up`, `.animate-shimmer` con stagger via `animation-delay` inline.

### Risks / Trade-offs Adicionales

- **[Rendimiento] Múltiples animaciones simultáneas** → Usar transform y opacity solamente (no animar width/height/top/left)
- **[Accesibilidad] Animaciones pueden causar molestias** → prefers-reduced-motion: reduce con animation-duration: 0ms
- **[Complejidad] Refactor de componentes existentes** → Cambios aditivos, no sustractivos. No romper interfaces existentes.
- **[Bundle size] Skeleton y animaciones** → Componentes ligeros sin dependencias externas, animaciones CSS nativo.