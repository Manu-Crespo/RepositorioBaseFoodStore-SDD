## Why

El cliente necesita gestionar sus direcciones de entrega para completar el flujo de compra. Sin esta funcionalidad, el usuario no puede especificar dónde recibir sus pedidos, bloqueando la creación de órdenes (Change 9). Esta funcionalidad es prerequisito para `order-creation`.

## What Changes

- **Nuevo**: Endpoint CRUD para direcciones de entrega (`/api/v1/auth/addresses`)
- **Nuevo**: Modelo de datos `DeliveryAddress` con asociaciones a usuario
- **Nuevo**: Frontend - página de gestión de direcciones en el perfil del cliente
- **Nuevo**: Establecer dirección predeterminada para checkout rápido

## Capabilities

### New Capabilities

- `delivery-address-crud`: CRUD completo de direcciones de entrega (crear, listar, editar, eliminar)
- `address-default`: Capacidad de establecer una dirección como predeterminada
- `address-validation`: Validación de campos de dirección (formato de calle, código postal, etc.)

### Modified Capabilities

- `customer-profile-view`: Se agrega acceso a gestión de direcciones desde el perfil
- `session-management`: El auth store debe poder almacenar la dirección predeterminada del usuario

## Impact

**Backend**:
- Nuevo modelo `DeliveryAddress` en `app/models/`
- Nuevos endpoints en `app/routes/addresses.py`
- Schemas en `app/schemas/address.py`
- Repository y servicio para direcciones

**Frontend**:
- Nueva página `AddressesPage.tsx`
- Componente `AddressCard.tsx` para mostrar direcciones
- Actualizar `authStore` para incluir dirección predeterminada
- Actualizar navegación para incluir "Mis Direcciones" en el perfil

**Dependencias**:
- Requiere `auth-rbac` (Change 3) - autenticación y usuario
- Requiere `customer-profile` (Change 6) - para asociar direcciones al perfil del cliente