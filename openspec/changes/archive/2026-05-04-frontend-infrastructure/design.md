# Design: Frontend Infrastructure

## Context

**Estado actual**: No existe código de frontend. El proyecto tiene una estructura vacía en `frontend/` con solo un `.env.example`.

**Requerimientos del change**:
- React 18 + TypeScript con Vite
- Tailwind CSS para estilos
- Feature-Sliced Design (FSD) para arquitectura
- Zustand para state management
- Axios para HTTP client

**Restricciones**:
- React 18 (no pre-Ract 18)
- TypeScript strict mode
- Vite para build/dev
- Tailwind CSS v3 (no v4 en beta)

## Goals / Non-Goals

**Goals:**
- Establecer estructura de proyecto React + TypeScript + Vite
- Configurar Tailwind CSS con theme de Food Store
- Implementar estructura FSD (features, pages, widgets, entities)
- Crear Axios instance con interceptors
- Crear stores de Zustand (authStore, cartStore, paymentStore, uiStore)

**Non-Goals:**
- Autenticación (Change 3 - auth-rbac)
- UI components específicos (se crean en cambios posteriores)
- Tests unitarios (se agregan según necesidad)
- Deploy a producción

## Decisions

### D1: Vite vs Create React App

**Decisión**: Vite.

**Rationale**:
- MUCH faster dev server (ESM nativo)
- Hot Module Replacement mejor que webpack
- Build más rápido
- Configuración mínima

**Alternativas Consideradas**:
- Create React App: Deprecated, bundler lento, config compleja

### D2: Estructura de carpetas

**Decisión**: Feature-Sliced Design (FSD).

**Rationale**:
- Estandar para proyectos grandes en React
- Separa features de código compartido
- Escalable para equipos grandes
- Convenciones claras

**Estructura**:
```
src/
├── app/           # Configuración global, providers
├── pages/         # Páginas completas
├── widgets/      # Componentes compuestos
├── features/    # Features de negocio
├── entities/     # Modelos de datos y utilities
└── shared/      # UI kit, utilities compartidas
```

### D3: Tailwind CSS

**Decisión**: Tailwind CSS con configuración custom.

**Rationale**:
- Desarrollo más rápido que CSS modules
- Theme centralizado
- JIT compiler por defecto en v3
- Peso menor que Styled Components

**Alternativas Consideradas**:
- CSS Modules: más código repetido
- Styled Components: runtime overhead

### D4: Zustand stores

**Decisión**: Zustand para todos los stores.

**Rationale**:
- API más simple que Redux
- No provider wrapper necesario
- TypeScript friendly
- Persist middleware para localStorage

**Stores**:
- `useAuthStore`: JWT tokens, user data, login/logout
- `useCartStore`: Items del cart, quantities
- `usePaymentStore`: Estado de payment, order ID
- `useUIStore`: Toast notifications, modals, theme

### D5: Axios Instance

**Decisión**: Axios con interceptors.

**Rationale**:
-Interceptores para auth headers
- Transform request/response
- Error handling centralizado
- Mejor que fetch para API REST

**Configuración**:
- Base URL desde environment
- Interceptor de request (JWT header)
- Interceptor de response (401 handling)

## Risks / Trade-offs

### R1: FSD puede ser overkill

**Riesgo**: Proyecto muy grande para la estructura FSD.

**Mitigación**:
- empezar simple, expanddir según necesidad
- No crear carpetas vacías

### R2: Tailwind CSS class names largos

**Riesgo**: HTML con clases muy largas.

**Mitigación**:
- Usar clsx o cn utility
- Componentes compostos en vez de markup inline

### R3: Zustand + TypeScript

**Riesgo**: Types complexity con generics.

**Mitigación**:
- Templates básicos para stores
- Documentar patrón

## Migration Plan

1. **Setup inicial**:
   - `npm create vite@latest` con template TypeScript
   - Instalar Tailwind CSS
   - Instalar Zustand, Axios

2. **Estructura**:
   - Crear carpetas FSD
   - Configurar alias en tsconfig

3. **Stores**:
   - Crear stores vacíos
   - Agregar persist middleware

4. **Axios**:
   - Crear instance
   - Agregar interceptors

## Open Questions

- **[Q1]**: ¿Usar React Router v6 o v7?
  - **Pendiente**: v7 está en beta, usar v6 estable
- **[Q2]**: ¿Testing con Vitest o Jest?
  - **Pendiente**: Vitest (más rápido,similar a Vite)
- **[Q3]**: ¿Componentes UI propios o shadcn/ui?
  - **Pendiente**: shadcn/ui si hay tiempo