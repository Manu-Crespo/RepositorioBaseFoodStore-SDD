## 1. Backend - Modelo y Schemas

- [ ] 1.1 Crear modelo `DeliveryAddress` en `backend/app/models/address.py` con campos: id, user_id, street, number, city, state, postal_code, country, notes, is_default, is_deleted, created_at, updated_at
- [ ] 1.2 Agregar relación One-to-Many entre User y DeliveryAddress en `backend/app/models/user.py`
- [ ] 1.3 Crear `AddressCreate`, `AddressUpdate`, `AddressResponse` schemas en `backend/app/schemas/address.py`
- [ ] 1.4 Agregar validación de campos según spec address-validation (longitudes, formatos)
- [ ] 1.5 Crear migración Alembic para tabla `delivery_addresses`

## 2. Backend - Repository y Servicio

- [ ] 2.1 Crear `AddressRepository` en `backend/app/repositories/address.py` con métodos: create, get_by_id, get_by_user, update, delete (soft-delete), set_default
- [ ] 2.2 Crear `AddressService` en `backend/app/services/address.py` con lógica de negocio: creación, actualización, establecer default (transaccional)
- [ ] 2.3 Registrar el repository en Unit of Work (`backend/app/unit_of_work.py`)

## 3. Backend - Endpoints

- [ ] 3.1 Crear router `addresses.py` en `backend/app/routes/` con endpoints:
  - POST /addresses (create)
  - GET /addresses (list)
  - GET /addresses/{id} (get one)
  - PUT /addresses/{id} (update)
  - DELETE /addresses/{id} (delete)
  - POST /addresses/{id}/default (set default)
- [ ] 3.2 Proteger todos los endpoints con autenticación JWT (get_current_user)
- [ ] 3.3 Agregar validación de ownership (solo propio usuario)
- [ ] 3.4 Actualizar endpoint GET /profile para incluir default_address

## 4. Backend - Testing

- [ ] 4.1 Crear tests para AddressRepository
- [ ] 4.2 Crear tests para endpoints (success, unauthorized, not found, validation errors)
- [ ] 4.3 Test de integración: set default replace previous default

## 5. Frontend - API y Types

- [ ] 5.1 Crear tipo `DeliveryAddress` en `frontend/src/shared/types/`
- [ ] 5.2 Actualizar tipo `User` para incluir default_address?: DeliveryAddress | null
- [ ] 5.3 Crear API client functions en `frontend/src/shared/api/addresses.ts`:
  - getAddresses()
  - getAddress(id)
  - createAddress(data)
  - updateAddress(id, data)
  - deleteAddress(id)
  - setDefaultAddress(id)

## 6. Frontend - Componentes

- [ ] 6.1 Crear componente `AddressCard.tsx` para mostrar dirección con opciones de editar/eliminar/default
- [ ] 6.2 Crear componente `AddressForm.tsx` para crear/editar dirección (modal o página)
- [ ] 6.3 Crear componente `EmptyAddresses.tsx` para cuando no hay direcciones

## 7. Frontend - Páginas y Routing

- [ ] 7.1 Crear página `AddressesPage.tsx` que lista todas las direcciones del usuario
- [ ] 7.2 Agregar ruta /addresses en App.tsx con ProtectedRoute
- [ ] 7.3 Agregar botón/enlace "Mis Direcciones" en el Header o menú de perfil
- [ ] 7.4 Actualizar ProfilePage para mostrar link a direcciones

## 8. Frontend - Testing

- [ ] 8.1 Test de componente AddressCard
- [ ] 8.2 Test de integración AddressesPage
- [ ] 8.3 Verificar que los tests de integración con la API pasen