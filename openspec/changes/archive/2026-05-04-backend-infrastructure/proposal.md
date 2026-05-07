# Proposal: Backend Infrastructure

## Why

El backend no existe aún. Sin una base sólida de FastAPI con PostgreSQL, ORM (SQLAlchemy + Alembic), patrones de infraestructura (BaseRepository, Unit of Work), y manejo de errores estandarizado — ningún otro change del backend puede implementarse. Este change es la fundación sobre la que se construye todo el sistema.

## What Changes

- **Scaffolding**: Estructura de proyecto FastAPI con división en capas (routes, schemas, services, repositories, models)
- **Configuración de base de datos**: PostgreSQL con SQLAlchemy 2.0, Alembic para migraciones, y seed data inicial
- **Patrones de infraestructura**: BaseRepository genérico, Unit of Work transaccional, Inyección de dependencias via FastAPI Depends
- **Manejo de errores**: Response model RFC 7807 (Problem Details), exception handlers centralizados
- **Validación de inputs**: Pydantic models con validación robusta, sanitización de strings

## Capabilities

### New Capabilities

- `database-postgresql`: Configuración de PostgreSQL con SQLAlchemy 2.0 async, Alembic migrations, connection pooling
- `repository-pattern`: BaseRepository genérico con CRUD base, Unit of Work para transacciones atómicas
- `error-handling`: Exception handlers con RFC 7807, logging centralizado, manejo de validation errors
- `input-validation`: Pydantic v2 schemas, sanitización, custom validators

### Modified Capabilities

Ninguna — es el primer change, no hay specs previas.

## Impact

- **Código nuevo**: `backend/app/`, `backend/alembic/`, `backend/scripts/`
- **Dependencias**: FastAPI, SQLAlchemy (async), Alembic, Pydantic v2, python-jose, passlib, psycopg-binary
- **APIs**: Ninguna expuesta aún (este change es infraestructura, no negocio)
- **Scripts**: Migration runner, seed data script