# Proposal: Frontend Infrastructure

## Why

El frontend no existe aún. Sin React con TypeScript, Vite, Tailwind CSS, estructura FSD, Axios instance configurado, y stores de Zustand — no se puede construir ninguna UI. Este change es la fundación sobre la que se construye todo el sistema.

## What Changes

- **Scaffolding**: React 18 + TypeScript + Vite con estructura de carpetas profesional
- **Estilado**: Tailwind CSS configurado con theme de Food Store
- **Arquitectura**: Feature-Sliced Design (FSD) para organización de código
- **HTTP Client**: Axios instance con base URL configurable e interceptores
- **State Management**: Stores de Zustand (authStore, cartStore, paymentStore, uiStore)

## Capabilities

### New Capabilities

- `react-scaffold`: React + TypeScript + Vite con estructura FSD y configuración completa
- `zustand-stores`: Stores de Zustand para auth, cart, payment, y UI state
- `axios-client`: Axios instance con interceptors y base URL
- `tailwind-config`: Tailwind CSS con theme personalizado

### Modified Capabilities

Ninguna — es el segundo change, Change 1 es backend.

## Impact

- **Código nuevo**: `frontend/src/`, `frontend/vite.config.ts`, `frontend/tailwind.config.js`
- **Dependencias**: React, TypeScript, Vite, Tailwind CSS, Zustand, Axios
- **APIs**: Ninguna expuesta aún (consume Change 1 backend)
- **Scripts**: Vite dev/build scripts