## Context

El Change 6 (customer-profile) implementa la gestión del perfil del cliente según las historias de usuario US-061, US-062, US-063 del documento de cambios.

**Estado actual:**
- El sistema ya tiene autenticación JWT implementada (Change 3: auth-rbac)
- Los usuarios pueden iniciar sesión y tienen un token de acceso
- No existe actualmente forma de ver o editar el perfil

**Restricciones:**
- Requiere que el usuario esté autenticado
- El cambio de contraseña debe verificar la contraseña actual
- Debe mantener consistencia con el esquema de usuario existente

## Goals / Non-Goals

**Goals:**
- Permitir al usuario ver sus datos personales (nombre, email, teléfono)
- Permitir editar los datos personales con validación
- Permitir cambiar la contraseña con verificación de la actual
- Mantener seguridad: invalidar refresh tokens al cambiar contraseña

**Non-Goals:**
- No incluye gestión de direcciones (ese es Change 7: delivery-addresses)
- No incluye historial de pedidos (ese es Change 11: order-fsm)
- No incluye avatar/foto de perfil
- No incluye verificación de email (por ahora)

## Decisions

### 1. Endpoints en el mismo router de auth

**Decisión:** Crear los endpoints de perfil bajo `/api/v1/auth/` en lugar de un nuevo router.

**Alternativas consideradas:**
- Nuevo router `/api/v1/profile/` — rejected porque el perfil está relacionado con auth
- Extender `/api/v1/auth/me` — rejected porque mezcla GET con PUT/PATCH

**Rationale:** Mantiene coherencia con la arquitectura existente donde authRouter maneja todo lo relacionado a la cuenta del usuario.

### 2. Schemas separados para perfil y contraseña

**Decisión:** Crear `ProfileUpdate` y `PasswordChange` como schemas separados.

**Alternativas consideradas:**
- Un solo schema con campos opcionales — rejected porque son flujos distintos con validación diferente

**Rationale:** Separación clara de responsabilidades, validación independiente.

### 3. Invalidar todos los refresh tokens al cambiar contraseña

**Decisión:** Al cambiar contraseña, invalidar todos los refresh tokens del usuario.

**Alternativas consideradas:**
- Solo invalidar el token actual — rejected porque si alguienrobó la contraseña, los otros tokens también son un riesgo
- No invalidar — rejected por razones de seguridad

**Rationale:** Seguridad máxima: si alguien cambió su contraseña, assume compromiso y cierra todas las sesiones.

### 4. Perfil en frontend como página dedicada

**Decisión:** Crear una `/profile` route con componente ProfilePage.

**Alternativas consideradas:**
- Modal de edición en el Header — rejected por la complejidad del cambio de contraseña
- Sección en la página de cuenta existente — rejected porque no existe tal página aún

**Rationale:** Page dedicada permite más espacio para el formulario de cambio de contraseña y futuras expansiones.

## Risks / Trade-offs

- [Risk] El usuario cambia contraseña desde otro dispositivo y pierde sesión en el actual
  → [Mitigation] Mostrar mensaje claro "Tu contraseña fue cambiada, volvé a iniciar sesión"

- [Risk] Validación de email al editar podría generar conflictos con usuarios existentes
  → [Mitigation] Validar que el nuevo email no exista ya en la base de datos

- [Risk] UI del perfil podría no coincidir con el diseño visual del resto de la app
  → [Mitigation] Usar los mismos componentes UI (Card, Input, Button) del sistema de diseño existente