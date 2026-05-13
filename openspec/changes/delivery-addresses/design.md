## Context

El Change 7 implementa la gestión de direcciones de entrega para clientes. Este change depende de:
- **auth-rbac (Change 3)**: Autenticación JWT y modelo de usuario
- **customer-profile (Change 6)**: Endpoints de perfil y frontend de perfil

El código existente tiene:
- Backend: FastAPI con SQLAlchemy async, patrón Repository, Unit of Work
- Frontend: React con Zustand stores, Axios, componentes UI existentes

## Goals / Non-Goals

**Goals:**
- CRUD completo de direcciones de entrega (crear, listar, editar, eliminar)
- Establecer una dirección como predeterminada
- Validación de campos de dirección
- Integración con el perfil del cliente

**Non-Goals:**
- geocodificación o mapas
- validación de dirección contra servicio externo
- límite de direcciones por usuario (queda abierto)
- gestión de pedidos con direcciones (eso es Change 9)

## Decisions

### 1. Modelo de datos: Dirección como tabla relacionada

**Decisión**: Crear una tabla `delivery_addresses` relacionada con `users` (relación uno a muchos).

**Alternativas consideradas**:
- Almacenar direcciones como JSON en columna de users: ❌ No permite queries eficientes ni soft-delete
- Embedder en modelo User: ❌ Violación de primera forma normal

**Justificación**: Mantiene consistencia con el patrón Repository existente y permite soft-delete de direcciones.

### 2. Endpoints RESTful con prefijos de auth

**Decisión**: Endpoints en `/api/v1/auth/addresses` (igual que profile).

**Alternativas consideradas**:
- `/api/v1/addresses`: ❌ No indica claramente que son del usuario autenticado
- `/api/v1/users/me/addresses`: ✅ Más RESTful pero más largo

**Justificación**: Consistencia con `customer-profile` y prefijos claros.

### 3.Soft-delete para direcciones

**Decisión**: Las direcciones usan soft-delete (is_deleted flag).

**Alternativas consideradas**:
- Hard delete: ❌ Peligroso, pérdida de historial de pedidos
- Archivado: ✅ Mejor pero más complejo

**Justificación**: Los pedidos antiguos pueden referencia direcciones que el usuario eliminó. Mantener la referencia intacta es crítico.

### 4. Frontend: Página dedicada vs sección en perfil

**Decisión**: Página dedicada `/addresses` accesible desde el perfil.

**Alternativas consideradas**:
- Sección en ProfilePage: ❌Ya会很拥挤
- Modal para crear/editar: ✅ Mejor UX

**Justificación**: CRUD de direcciones requiere suficiente espacio para表单. Página dedicada permite mejor UX.

## Risks / Trade-offs

- **Soft-delete con pedidos**: [Riesgo] Un pedido referencia una dirección que después se elimina → [Mitigation] Al eliminar, no borrar la fila, solo marcar `is_deleted=True`. Los pedidos guardan snapshot de la dirección.

- **Dirección predeterminada**: [Riesgo] Race condition si el usuario configura múltiples como predeterminadas rápidamente → [Mitigation] Transacción atómica: UPDATE todas las del usuario a false, luego INSERT/UPDATE la nueva.

- **Validación de campos**: [Riesgo] Diferentes países tienen formatos de dirección muy distintos → [Mitigation] Validación flexible (campos opcionales) con longitud mínima.

- **Límite de direcciones**: [Trade-off] No implementar límite por ahora. Usuario puede crear muchas direcciones. Esto puede agregarse después si hay problema de rendimiento.

## Migration Plan

1. Nueva migración Alembic creando tabla `delivery_addresses`
2. Deploy de backend con nuevos endpoints
3. Frontend: agregar página y actualizar navegación
4. No hay datos existentes que migrar (tabla nueva)

Rollback: Eliminar migración o hacer downgrade de Alembic.

## Open Questions

- ¿Cuántas direcciones máximo por usuario? (pendiente)
- ¿El admin puede ver/editar direcciones de usuarios? (pendiente, fuera de scope inicial)
- ¿Se permite múltiples "predeterminadas"? (no, solo una a la vez)