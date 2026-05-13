## 1. Backend - Schemas

- [x] 1.1 Agregar `ProfileUpdate` schema en `backend/app/schemas/auth.py` (first_name, last_name, phone opcionales)
- [x] 1.2 Agregar `PasswordChange` schema en `backend/app/schemas/auth.py` (current_password, new_password)

## 2. Backend - Endpoints de Perfil

- [x] 2.1 Crear endpoint GET `/api/v1/auth/profile` que retorna datos del usuario autenticado
- [x] 2.2 Crear endpoint PUT `/api/v1/auth/profile` para actualizar datos personales
- [x] 2.3 Crear endpoint PUT `/api/v1/auth/profile/password` para cambiar contraseña

## 3. Backend - Seguridad

- [x] 3.1 Implementar verificación de contraseña actual con bcrypt en endpoint de cambio de contraseña
- [x] 3.2 Implementar invalidación de todos los refresh tokens del usuario al cambiar contraseña

## 4. Frontend - ProfilePage

- [x] 4.1 Crear componente `frontend/src/pages/ProfilePage.tsx` con vista de datos personales
- [x] 4.2 Agregar formulario de edición inline para first_name, last_name, phone
- [x] 4.3 Agregar sección de cambio de contraseña con verificación de contraseña actual
- [x] 4.4 Implementar integración con API de perfil (llamadas a endpoints)

## 5. Frontend - Routing y Navegación

- [x] 5.1 Agregar ruta `/profile` en `frontend/src/App.tsx` con ProtectedRoute
- [x] 5.2 Agregar enlace "Mi Perfil" en el Header para usuarios autenticados
- [x] 5.3 Agregar manejo de error y feedback visual (mensaje de éxito/error)

## 6. Testing

- [x] 6.1 Crear tests para endpoint GET /profile (success, unauthorized)
- [x] 6.2 Crear tests para endpoint PUT /profile (success, validation errors)
- [x] 6.3 Crear tests para endpoint PUT /profile/password (success, wrong password, validation)