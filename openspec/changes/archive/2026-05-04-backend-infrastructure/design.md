# Design: Backend Infrastructure

## Context

**Estado actual**: No existe código de backend. El proyecto tiene una estructura vacía en `backend/` con solo un `.env.example`.

**Requerimientos del change**:
- Scaffold de FastAPI con arquitectura en capas
- PostgreSQL como base de datos principal
- SQLAlchemy 2.0 con modo async
- Alembic para migraciones
- Patrones de infraestructura reutilizables

**Restricciones**:
- Python 3.11+ (async/await nativo)
- PostgreSQL (no MySQL ni SQLite en producción)
- Tipo de proyecto: API REST (no GraphQL en esta iteración)
- Debt técnico aceptable: máximo 6 meses de mantenimiento

## Goals / Non-Goals

**Goals:**
- Establecer la estructura de capas del backend (routes → schemas → services → repositories → models)
- Implementar BaseRepository genérico que reduzca boilerplate en CRUDs futuros
- Implementar Unit of Work para transacciones atómicasacross repositories
- Configurar Alembic para migraciones con hot reload durante desarrollo
- Estandarizar manejo de errores con formato RFC 7807
- Configurar conexión a PostgreSQL con connection pooling

**Non-Goals:**
- Autenticación (Change 3 - auth-rbac)
- any specific API endpoints de negocio
- Deploy a producción o contenedores
- Tests unitarios (se agregan en cada change según necesidad)

## Decisions

### D1: SQLAlchemy async vs sync

**Decisión**: SQLAlchemy en modo async con `asyncpg`.

**Rationale**:
- FastAPI es async-native; usar sync SQLAlchemy bloquea el event loop
- PostgreSQL soporta queries asincrónicas natively
- Mejor rendimiento bajo concurrencia (múltiples usuarios simultáneos)

**Alternativas consideradas**:
- Sync con `run_in_executor`: 节 bloquea workers, más complejo en producción
- ORM con sync pero endpoints use `anyio`: 节 introduce complejidad sin beneficio real

### D2: Estructura de capas

**Decisión**: `routes / schemas / services / repositories / models` como capas explícitas.

**Rationale**:
- Separa responsabilidades: routes = HTTP, services = lógica de negocio, repositories = acceso a datos
- Facilita testing: cada capa se puede mockear independientemente
- Convenciones familiares en la comunidad FastAPI

**Alternativas Considered**:
- Controller-Service-DAO: menos específico para FastAPI
- Hexagonal ports/adapters: sobres diseno para este proyecto

### D3: BaseRepository

**Decisión**: Generic `BaseRepository[T]` con métodos CRUD base.

**Rationale**:
- Elimina boilerplate en cada change (7+ cambios usan CRUD)
- Mantiene consistencia entre entidades
- Permite agregar log común (timestamps, soft delete) en un solo lugar

**Métodos base**:
- `get(id)`: Retrieve by PK
- `get_all(skip, limit)`: List with pagination
- `create(data)`: Insert single
- `create_many(data)`: Bulk insert
- `update(id, data)`: Update single
- `delete(id)`: Soft delete por defecto

### D4: Error Handling (RFC 7807)

**Decisión**: Exception handlers centralizados que retornan `ProblemDetails`.

**Rationale**:
- Formato estándar para APIs HTTP (IETF RFC 7807)
- Consistente para clientes (siempre saben qué esperar)
- Facilita debugging (trace_id para logs)

**Estructura del response**:
```json
{
  "type": "https://api.foodstore.com/errors/VALIDATION_ERROR",
  "title": "Validation Error",
  "status": 422,
  "detail": "Email already registered",
  "instance": "/api/v1/auth/register"
}
```

### D5: Migration Strategy

**Decisión**: Alembic con auto-generate + revisión manual.

**Rationale**:
- Auto-generate acelera desarrollo inicial
- Revisión manual evita errores ( foreign keys, renamed columns)
- En desarrollo: `alembic revision --autogenerate`

**Workflow**:
1. Definir modelo en `models/`
2. `alembic revision --autogenerate -m "add users table"`
3. Revisar migration antes de aplicar
4. `alembic upgrade head`

## Risks / Trade-offs

### R1: Circular imports entre capas

**Riesgo**: Services importan Repositories, y viceversa.

**Mitigación**:
- Usar `TYPE_CHECKING` para imports de tipo
- Dependency Injection via FastAPI `Depends()` en lugar de importar directamente

### R2: SQLAlchemy async requiere cuidado con transacciones

**Riesgo**: Transacciones no se commitean si no se hace flush/explicit commit.

**Mitigación**:
- Unit of Work con context manager que hace commit al salir
- Always use `async with` pattern

### R3: Alembic en entorno equipo

**Riesgo**: Conflictos si dos personas generan migrations simultáneas.

**Mitigación**:
- Nombrar migrations con nombre descriptivo (`add_user_role_enum`)
- Revisión obligatoria antes de commit

## Migration Plan

1. **Setup inicial**:
   - Instalar dependencias (`pip install -r requirements.txt`)
   - Crear `.env` desde `.env.example`
   - Correr `alembic upgrade head` (tablas base)

2. **Modelo base**:
   - Crear `models/base.py` con SQLAlchemy Base
   - Configurar `database.py` (engine, sessionmaker)
   - Probar conexión con query simple

3. **Seed data** (opcional):
   - `scripts/seed.py` con datos iniciales mínimos
   - Roles básicos para RBAC

## Open Questions

- **[Q1]**: ¿Usar paginación basada en cursor o offset?
  - **Pendiente**: Depende de si hay requisitos de real-time (c cursor es mejor para append-only logs)
- **[Q2]**: ¿Logging a stderr, file, o ambos?
  - **Pendiente**: Definir en Change 1 o postergar a deployment
- **[Q3]**: ¿Rate limiting a nivel de aplicación o gateway?
  - **Pendiente**: Postergar a Change 3 (auth-rbac) donde se implementa