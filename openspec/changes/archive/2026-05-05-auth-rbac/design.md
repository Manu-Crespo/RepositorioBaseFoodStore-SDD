## Context

El proyecto Food Store actualmente tiene un scaffold de backend (FastAPI + SQLAlchemy async) y frontend (React + Vite + Zustand) pero sin ningún mecanismo de autenticación. Todos los endpoints están abiertos y no hay forma de identificar usuarios.

**Estado actual:**
- Backend con modelo base de usuarios (sin auth)
- Frontend con stores de Zustand (sin auth store)
- Endpoints de productos, categorías, clientes abiertos

**_restricciones:**
- JWT secrets deben estar en variables de entorno, no hardcodeados
- Sistema debe soportar múltiples instancias del backend
- Refresh tokens necesitan rotación por seguridad

## Goals / Non-Goals

**Goals:**
- Sistema JWT con access token (15 min) y refresh token (7 días)
- Login/registro con email + password hasheada con bcrypt
- RBAC con 3 roles: admin (gestión total), customer (compras), guest (solo lectura)
- Middleware FastAPI que protege endpoints por rol
- Frontend store de Zustand para sesión
- Protección de rutas en frontend según rol

**Non-Goals:**
- OAuth externo (Google, Facebook) - queda para después
- Email verification - fuera de scope
- Password reset flow - fuera de scope
- Two-factor authentication - fuera de scope

## Decisions

### 1. JWT Strategy: JWS con RS256 vs HS256

**Decision:** HS256 con secreto en variable de entorno.

**Rationale:** Simpler para deployment, no requiere gestión de certificados. El secreto es único por ambiente.

**Alternatives considered:** RS256 (asymmetric) - más seguro pero overkill para e-commerce pequeño.

### 2. Password Hashing: bcrypt

**Decision:** passlib con bcrypt.

**Rationale:** Estándar de industria, slow hash para prevenir brute force.

**Alternatives considered:** argon2 - más seguro pero passlib no tiene mejor soporte.

### 3. Token Storage: localStorage vs httpOnly cookies

**Decision:** Access tokens en memory (Zustand), refresh token en httpOnly cookie.

**Rationale:** XSS no roba access token si está en memoria. Refresh token en cookie survived attacks.

**Alternatives considered:** Todo en localStorage - más vulnerable a XSS.

### 4. RBAC Implementation: Role enum vs Permission matrix

**Decision:** Role enum simple + dependency injection de permisos.

**Rationale:** Más simple de mantener, no requiere tabla de permisos para empezar.

**Alternatives considered:** Permission matrix en DB - más flexible pero más complejo.

### 5. Error Responses: RFC 7807 extendido

**Decision:** RFC 7807 con códigos de error adicionales.

**Rationale:** Extiende el sistema existente de error-handling del Change 1.

## Risks / Trade-offs

- **[Risk]** Refresh token theft → **[Mitigation]** Implementar refresh token rotation (invalidar old token al usar refresh)
- **[Risk]** JWT tokens no se pueden invalidar → **[Mitigation]** Short access token (15 min) + blacklist opcional para logout forzado
- **[Risk]** Password brute force → **[Mitigation]** Rate limiting en endpoint de login (5 intentos por minuto)
- **[Risk]** XSS roba access token → **[Mitigation]** Access token solo en memoria, nunca en localStorage
- **[Risk]** Breaking changes en APIs existentes → **[Mitigation]** Documentar que /auth/login es el único endpoint público