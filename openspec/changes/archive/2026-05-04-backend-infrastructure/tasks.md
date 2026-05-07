# Tasks: Backend Infrastructure

## 1. Project Setup

- [x] 1.1 Create FastAPI application entry point (`main.py` with app factory)
- [x] 1.2 Create requirements.txt with all dependencies (FastAPI, SQLAlchemy async, Alembic, Pydantic v2, python-jose, passlib, psycopg-binary, python-dotenv, uvicorn)
- [x] 1.3 Configure Python path and project structure
- [x] 1.4 Create .env from .env.example with DATABASE_URL placeholder

## 2. Database Configuration

- [x] 2.1 Create `database.py` with async engine, sessionmaker, and connection pool config
- [x] 2.2 Create `models/base.py` with SQLAlchemy Base and timestamp mixin
- [x] 2.3 Configure Alembic (`alembic.ini` and `env.py`)
- [x] 2.4 Create initial migration script
- [x] 2.5 Test database connection on startup

## 3. BaseRepository Pattern

- [x] 3.1 Create `repositories/base.py` with generic BaseRepository class
- [x] 3.2 Implement `get(id)` method
- [x] 3.3 Implement `get_all(skip, limit)` with total count
- [x] 3.4 Implement `create(data)` single insert
- [x] 3.5 Implement `create_many(data)` bulk insert
- [x] 3.6 Implement `update(id, data)` with timestamp
- [x] 3.7 Implement `delete(id)` with soft delete by default
- [x] 3.8 Add hard delete option

## 4. Unit of Work

- [x] 4.1 Create `unit_of_work.py` with async context manager
- [x] 4.2 Implement commit on successful exit
- [x] 4.3 Implement rollback on exception
- [x] 4.4 Add session management for multiple repositories

## 5. Dependency Injection

- [x] 5.1 Create FastAPI dependencies for session (`get_db`)
- [x] 5.2 Create dependency for repositories
- [x] 5.3 Add request-scoped lifecycle management

## 6. Error Handling

- [x] 6.1 Create RFC 7807 Problem Details model
- [x] 6.2 Create custom exception classes
- [x] 6.3 Register exception handlers in main.py
- [x] 6.4 Implement request logging with correlation ID
- [x] 6.5 Add global exception handler for 500 errors

## 7. Input Validation

- [x] 7.1 Configure Pydantic settings (str strip, normalize unicode)
- [x] 7.2 Create custom validators for email
- [x] 7.3 Create custom validators for password strength
- [x] 7.4 Create custom validators for future dates
- [x] 7.5 Implement enum validation utilities

## 8. Utilities & Configuration

- [x] 8.1 Create config loader from environment
- [x] 8.2 Add logging configuration
- [x] 8.3 Create seed script for initial data (optional)

## 9. Verification

- [x] 9.1 Run `alembic upgrade head` successfully
- [x] 9.2 Start uvicorn and verify no errors
- [x] 9.3 Test health endpoint returns 200
- [x] 9.4 Verify error responses follow RFC 7807