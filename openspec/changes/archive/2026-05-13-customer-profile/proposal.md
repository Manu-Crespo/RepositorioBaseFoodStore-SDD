## Why

Los clientes necesitan gestionar su información personal de forma autónoma. Actualmente no existe una forma de ver o editar los datos del perfil ni de cambiar la contraseña. Esto es fundamental para la confianza del usuario y la seguridad de la cuenta.

## What Changes

- **Backend**: Nuevos endpoints para obtener perfil, actualizar datos personales, y cambiar contraseña con verificación de contraseña actual
- **Frontend**: Nueva página de perfil con visualización de datos, formulario de edición inline, y modal de cambio de contraseña
- **API**: Endpoints protegidos bajo `/api/v1/auth/profile` y `/api/v1/auth/profile/password`
- **Seguridad**: El cambio de contraseña requiere contraseña actual, usa bcrypt para hashear la nueva, e invalida refresh tokens existentes

## Capabilities

### New Capabilities
- `customer-profile-view`: Ver datos personales del usuario autenticado (nombre, email, teléfono)
- `customer-profile-edit`: Editar datos personales del usuario autenticado
- `customer-password-change`: Cambiar contraseña con verificación de la actual

### Modified Capabilities
- `session-management`: Se modifica para incluir endpoint de logout e invalidación de tokens al cambiar contraseña
- `auth-middleware`: Se extiende para soportar los nuevos endpoints de perfil

## Impact

- **Backend**: Nuevos archivos en `routes/auth.py`, Schemas en `schemas/auth.py`
- **Frontend**: Nueva página `ProfilePage.tsx`, integración con authStore existente
- **Dependencias**: Requiere que `auth-rbac` (Change 3) esté implementado - usa JWT para autenticar