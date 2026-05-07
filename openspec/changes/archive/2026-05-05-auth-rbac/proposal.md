## Why

El proyecto Food Store necesita un sistema completo de autenticación y control de acceso basado en roles (RBAC) para proteger las funcionalidades del e-commerce. Actualmente no existe ningún mecanismo de auth, y todas las operaciones son abiertas. Sin auth no se puede:
-Persistir carritos de usuarios específicos
-Controlar acceso a funcionalidades de admin (gestión de productos, pedidos, clientes)
-Manejar información personalizada por cliente
El proyecto está en la fase donde necesita cerrar el ciclo de usuario para avanzar a features como pedidos, seguimiento, y gestión personalizada.

## What Changes

- **Nuevo sistema de autenticación JWT** con access tokens y refresh tokens
- **Registro y login de usuarios** con email/password
- **Sistema de roles y permisos (RBAC)** con roles: admin, customer, guest
- **Protección de endpoints** según rol del usuario
- **Middleware de auth** en FastAPI para proteger rutas
- **Store de auth en frontend** (Zustand) para estado de sesión
- ** protecciones de acceso en frontend** según rol

### **BREAKING** Cambios en APIs existentes:
- Todos los endpoints de gestión (productos, categorías, clientes, pedidos) pasan a requerir-auth
- Formato de respuesta de errores cambiar a incluir código de error

## Capabilities

### New Capabilities
- `user-auth`: Sistema de autenticación JWT con login, registro, refresh tokens
- `user-roles`: Definición de roles (admin, customer, guest) y permisos
- `auth-middleware`: Middleware FastAPI para protección de rutas
- `session-management`: Manejo de sesión activa en frontend

### Modified Capabilities
- `error-handling`: Se extiende para incluir códigos de error HTTP 401, 403
- `repository-pattern`: Los repositorios reciben user_id para auditoría

## Impact

- **Backend**: Nuevos endpoints /auth/*, middleware de protección, extensión de modelos de usuario
- **Frontend**: Nuevo store de auth (Zustand), protección de rutas, páginas de login/register
- **Base de datos**: Nueva tabla users, user_roles, role_permissions
- **Dependencias**: python-jose, passlib[bcrypt], python-multipart (frontend)
- **Seguridad**: JWT secrets en config, rate limiting en login