# Mapa de Changes — Food Store E-Commerce

> Generado a partir de `docs/Descripcion.txt`, `docs/Historias_de_usuario.txt`, `docs/Integrador.txt`
> Total: **77 historias de usuario** (US-000 a US-076) → **12 changes** + **1 opcional**

---

## Change 1: `backend-infrastructure`

**Funcionalidad**: Scaffolding del backend con FastAPI, PostgreSQL, Alembic, patrones base y manejo de errores. Es la fundación sobre la que se construye todo el sistema.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-000 | Inicialización del repositorio y estructura del proyecto |
| US-000a | Configuración del entorno backend (FastAPI + dependencias) |
| US-000b | Configuración de PostgreSQL, migraciones y seed data |
| US-000d | Patrones de infraestructura del backend (BaseRepository, UoW, dependencias) |
| US-068 | Manejo de errores estandarizado en backend (RFC 7807) |
| US-074 | Validación y sanitización de inputs |

**Dependencias**: Ninguna — es el primer change.

**Por qué viene primero**: Sin base de datos, sin ORM, sin Unit of Work, sin manejo de errores — no existe nada más. Todos los demás changes del backend dependen de esto.

---

## Change 2: `frontend-infrastructure`

**Funcionalidad**: Scaffolding del frontend con React + TypeScript + Vite, configuración de Tailwind CSS, estructura FSD, Axios instance, y stores de Zustand.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-000c | Configuración del entorno frontend (React + Vite + dependencias) |
| US-000e | Stores de Zustand (authStore, cartStore, paymentStore, uiStore) |

**Dependencias**: Ninguna directa del backend (solo necesita que el backend exista como concepto para configurar la base URL de Axios).

**Por qué viene segundo**: Puede desarrollarse en paralelo con el backend, pero se ordena después porque el interceptor de Axios necesita la estructura de auth del backend (Change 1) para configurarse correctamente.

---

## Change 3: `auth-rbac`

**Funcionalidad**: Sistema completo de autenticación JWT con doble token, registro, login, refresh con rotación, logout, RBAC con 4 roles, rate limiting, y protección de rutas en frontend.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-001 | Registro de cliente |
| US-002 | Login de usuario |
| US-003 | Refresh de token |
| US-004 | Logout |
| US-005 | Gestión de roles (RBAC) |
| US-006 | Protección de rutas por rol |
| US-066 | Manejo de token expirado en frontend (interceptor 401) |
| US-067 | Manejo de errores global en frontend |
| US-073 | Rate limiting en endpoints sensibles |

**Dependencias**: `backend-infrastructure`, `frontend-infrastructure`

**Por qué depende**: Necesita BaseRepository para la tabla RefreshToken, UoW para las transacciones de auth, manejo de errores RFC 7807 (Change 1), y los stores de Zustand + Axios instance (Change 2) para almacenar tokens e interceptar respuestas.

---

## Change 4: `navigation-layout`

**Funcionalidad**: Layout base de la aplicación, navegación adaptada por rol (sidebar/menu), route guards en frontend para autenticación y rol, y manejo de sesión visual.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-075 | Navegación por rol (menú adaptado) |
| US-076 | Protección de rutas en frontend (guards) |

**Dependencias**: `auth-rbac`

**Por qué depende**: La navegación por rol necesita que los roles existan y estén asignados (Change 3). Los guards necesitan el authStore funcional y el interceptor de refresh.

---

## Change 5: `catalogue`

**Funcionalidad**: Gestión completa del catálogo de productos — categorías jerárquicas, ingredientes con alérgenos, CRUD de productos con asociaciones, catálogo público con filtros, búsqueda y paginación.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-007 | Crear categoría |
| US-008 | Listar categorías jerárquicas |
| US-009 | Editar categoría |
| US-010 | Eliminar categoría (soft delete) |
| US-011 | Crear ingrediente |
| US-012 | Listar ingredientes |
| US-013 | Editar ingrediente |
| US-014 | Eliminar ingrediente (soft delete) |
| US-015 | Crear producto |
| US-016 | Asociar producto a categorías |
| US-017 | Asociar ingredientes a producto |
| US-018 | Listar productos del catálogo (público) |
| US-019 | Ver detalle de producto |
| US-020 | Editar producto |
| US-021 | Gestionar stock de producto |
| US-022 | Eliminar producto (soft delete) |
| US-023 | Filtrar productos por alérgenos |
| US-064 | Gestión completa de catálogo (Admin) |

**Dependencias**: `auth-rbac`

**Por qué depende**: Los endpoints de gestión (crear, editar, eliminar) requieren autenticación y roles (STOCK, ADMIN). El catálogo público no requiere auth, pero necesita la infraestructura de errores y paginación del Change 1.

---

## Change 6: `customer-profile`

**Funcionalidad**: Gestión del perfil del cliente — visualización de datos personales, edición de perfil, cambio de contraseña.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-061 | Ver perfil propio |
| US-062 | Editar perfil propio |
| US-063 | Cambiar contraseña |

**Dependencias**: `auth-rbac`

**Por qué depende**: Requiere que el usuario esté autenticado (JWT) para extraer el userId. El cambio de contraseña necesita invalidar refresh tokens (tabla de Change 3).

---

## Change 7: `delivery-addresses`

**Funcionalidad**: CRUD completo de direcciones de entrega del cliente — crear, listar, editar, eliminar, establecer dirección predeterminada.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-024 | Crear dirección de entrega |
| US-025 | Listar direcciones del cliente |
| US-026 | Editar dirección de entrega |
| US-027 | Eliminar dirección de entrega |
| US-028 | Establecer dirección predeterminada |

**Dependencias**: `auth-rbac`, `customer-profile`

**Por qué depende**: Las direcciones pertenecen a un usuario autenticado (Change 3). Se ordena después del perfil porque conceptualmente las direcciones son parte del perfil del cliente, y el cliente necesita tener su cuenta funcional antes de gestionar direcciones.

---

## Change 8: `shopping-cart`

**Funcionalidad**: Carrito de compras client-side con Zustand + localStorage — agregar productos, personalizar (excluir ingredientes), modificar cantidades, eliminar items, vaciar carrito, resumen visual.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-029 | Agregar producto al carrito |
| US-030 | Personalizar producto (exclusión de ingredientes) |
| US-031 | Modificar cantidad de item en el carrito |
| US-032 | Eliminar item del carrito |
| US-033 | Ver resumen del carrito |
| US-034 | Vaciar carrito |

**Dependencias**: `catalogue`

**Por qué depende**: Para agregar un producto al carrito, el producto debe existir y el usuario debe poder ver el catálogo (Change 5). La personalización necesita los ingredientes asociados al producto. El cartStore ya existe (Change 2) pero necesita la lógica de negocio que se implementa aquí.

---

## Change 9: `order-creation`

**Funcionalidad**: Creación atómica de pedidos desde el carrito — validación pre-checkout (stock + precios), snapshots de precio y dirección, Unit of Work transaccional, registro en historial de estados.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-035 | Crear pedido desde el carrito |
| US-036 | Validación de stock al crear pedido |
| US-037 | Snapshot de precios en el pedido |
| US-038 | Snapshot de dirección en el pedido |
| US-069 | Validar disponibilidad al hacer checkout |
| US-070 | Verificar precios actualizados al hacer checkout |
| US-071 | Confirmación de pedido creado (feedback UX) |

**Dependencias**: `shopping-cart`, `delivery-addresses`, `catalogue`

**Por qué depende**: Necesita el carrito con items (Change 8), una dirección de entrega seleccionada (Change 7), y productos válidos con stock verificable (Change 5). Usa el UoW del Change 1 y requiere autenticación (Change 3).

---

## Change 10: `payments-mercadopago`

**Funcionalidad**: Integración con MercadoPago — creación de orden de pago, tokenización de tarjetas, webhook IPN, consulta de estado de pago, reintento de pago rechazado, retorno al sitio con feedback visual.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-045 | Iniciar proceso de pago |
| US-046 | Procesar webhook de pago (IPN) |
| US-047 | Consultar estado de pago |
| US-048 | Reintentar pago rechazado |
| US-072 | Feedback de estado de pago (retorno de MP) |

**Dependencias**: `order-creation`

**Por qué depende**: Solo se puede pagar un pedido que ya fue creado (Change 9). El webhook necesita la tabla Pago y la relación con Pedido. El paymentStore existe (Change 2) pero necesita la integración real con MP.

---

## Change 11: `order-fsm`

**Funcionalidad**: Máquina de estados de pedidos — transiciones PENDIENTE→CONFIRMADO→EN_PREPARACIÓN→EN_CAMINO→ENTREGADO, cancelación con restauración de stock, historial de estados (audit trail append-only), visualización de pedidos para cliente y gestores.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-039 | Transición PENDIENTE → CONFIRMADO (automática por pago) |
| US-040 | Transición CONFIRMADO → EN_PREPARACIÓN |
| US-041 | Transición EN_PREPARACIÓN → EN_CAMINO |
| US-042 | Transición EN_CAMINO → ENTREGADO |
| US-043 | Cancelar pedido |
| US-044 | Auditoría de cambios de estado |
| US-049 | Ver mis pedidos (Cliente) |
| US-050 | Ver detalle de mi pedido (Cliente) |
| US-051 | Ver todos los pedidos (Gestor de Pedidos) |
| US-052 | Ver detalle de cualquier pedido (Gestor/Admin) |
| US-065 | Gestión completa de pedidos (Admin) |

**Dependencias**: `payments-mercadopago`, `order-creation`

**Por qué depende**: La transición automática PENDIENTE→CONFIRMADO se dispara por el webhook de pago (Change 10). La cancelación necesita restaurar stock (lógica de Change 9). Los roles PEDIDOS y ADMIN deben existir (Change 3). Las vistas de pedidos necesitan que los pedidos existan (Change 9).

---

## Change 12: `admin-dashboard`

**Funcionalidad**: Panel de administración completo — gestión de usuarios (listar, editar, desactivar), dashboard de métricas con recharts (ventas, ranking de productos, distribución por estado), y configuración del sistema.

**Historias de usuario**:
| ID | Título |
|----|--------|
| US-053 | Listar usuarios del sistema |
| US-054 | Editar usuario (Admin) |
| US-055 | Desactivar usuario |
| US-056 | Dashboard de métricas generales |
| US-057 | Gráfico de ventas por periodo |
| US-058 | Top productos más vendidos |
| US-059 | Métricas de pedidos por estado |
| US-060 | Configuración del sistema |

**Dependencias**: `order-fsm`, `catalogue`, `auth-rbac`

**Por qué depende**: Las métricas necesitan datos de pedidos (Change 11) y productos (Change 5). La gestión de usuarios necesita RBAC (Change 3). Los gráficos necesitan pedidos con estados completos para tener datos significativos.

---

## Change 13 (opcional): `deployment`

**Funcionalidad**: Deploy del sistema completo en plataforma cloud (Railway, Render, o Fly.io) con URL accesible, variables de entorno configuradas, y documentación de deploy.

**Historias de usuario**: Ninguna específica — es bonus de la rúbrica (+10 pts).

**Dependencias**: `admin-dashboard` (todos los changes anteriores)

**Por qué depende**: Necesita que todo el sistema funcione localmente antes de deployar. Incluye: Docker Compose o configuración de producción, CORS para dominio real, base de datos PostgreSQL en cloud, y webhook de MercadoPago con URL pública (ngrok o similar para pruebas).

---

## Diagrama de Dependencias

```
backend-infrastructure ──► auth-rbac ──► navigation-layout
       │                       │
       │                       ├──► catalogue ──► shopping-cart ──► order-creation ──► payments-mercadopago
       │                       │                       │                                     │
       │                       │                       └─────────────────────────────► order-fsm
       │                       │                                                             │
       │                       ├──► customer-profile ──► delivery-addresses ──► order-creation
       │                       │                                                             │
       │                       │                                                             ├──► admin-dashboard
       │                       └─────────────────────────────────────────────────────────────┘
       │
frontend-infrastructure ──► auth-rbac (interceptor + stores)
```

**Orden de ejecución recomendado** (secuencial):

| # | Change | Sprint estimado | Complejidad |
|---|--------|----------------|-------------|
| 1 | `backend-infrastructure` | Sprint 0 | Media |
| 2 | `frontend-infrastructure` | Sprint 0 | Media |
| 3 | `auth-rbac` | Sprint 1 | Alta |
| 4 | `navigation-layout` | Sprint 1 | Baja |
| 5 | `catalogue` | Sprint 2 | Alta |
| 6 | `customer-profile` | Sprint 2-3 | Baja |
| 7 | `delivery-addresses` | Sprint 3 | Media |
| 8 | `shopping-cart` | Sprint 3-4 | Media |
| 9 | `order-creation` | Sprint 4 | Alta |
| 10 | `payments-mercadopago` | Sprint 5 | Alta |
| 11 | `order-fsm` | Sprint 5-6 | Alta |
| 12 | `admin-dashboard` | Sprint 6-7 | Media |
| 13 | `deployment` (opcional) | Sprint 8 | Baja |

---

## Decisiones de Diseño del Mapa

### ¿Por qué 12 changes y no 19 épicas?

Las épicas del documento original son unidades de **negocio**, no de **implementación**. Un change debe ser:
- **Independiente**: se puede implementar y archivar sin bloquear otros
- **Cohesivo**: todo lo que incluye tiene una relación funcional fuerte
- **Trazable**: cada historia de usuario tiene un change claro

Agrupé épicas pequeñas (Categorías + Ingredientes + Productos → `catalogue`) y separé épicas grandes (Pedidos → `order-creation`, `payments-mercadopago`, `order-fsm`) porque son demasiado complejas para un solo change.

### ¿Por qué `order-creation` y `order-fsm` separados?

La creación de pedidos es compleja por sí sola (UoW transaccional, snapshots, validación de stock). La máquina de estados agrega otra capa de complejidad (FSM, audit trail, cancelación con restauración de stock). Separarlos permite:
1. Tener pedidos creados y pagados antes de implementar la FSM completa
2. Probar la integración con MercadoPago sin necesidad de la FSM
3. Mantener cada change en un tamaño manejable

### ¿Por qué `customer-profile` antes que `delivery-addresses`?

Conceptualmente, las direcciones son parte del perfil del cliente. Además, el perfil es más simple (CRUD básico sobre Usuario) y sirve como "calentamiento" para el patrón CRUD que se usa en direcciones.

### ¿Por qué `navigation-layout` es un change separado?

La navegación y los guards son puramente frontend y no requieren backend nuevo (solo consumen auth existente). Tenerlo como change separado permite validar que el sistema de auth funciona antes de construir el catálogo encima.
