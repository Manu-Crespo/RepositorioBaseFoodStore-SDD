## ADDED Requirements

### Requirement: Database Connection Configuration
The system SHALL establish connections to PostgreSQL using SQLAlchemy 2.0 async engine with connection pooling.

#### Scenario: Connection pool initialization
- **WHEN** application starts
- **THEN** SQLAlchemy async engine is created with configured pool size
- **AND** connection pool maintains min/max connections per config

#### Scenario: Connection string from environment
- **WHEN** DATABASE_URL environment variable is set
- **THEN** engine uses the provided connection string
- **AND** validates connectivity on startup

#### Scenario: Connection failure handling
- **WHEN** database is unreachable during startup
- **THEN** application raises StartupError with clear message
- **AND** exits with code 1

### Requirement: Async Session Management
The system SHALL provide async session factory for database operations.

#### Scenario: Session creation
- **WHEN** a request requires database access
- **THEN** async session is created from session factory
- **AND** committed or rolled back on completion

#### Scenario: Session cleanup on shutdown
- **WHEN** application shuts down
- **THEN** all sessions are closed gracefully
- **AND** pool connections are disposed

### Requirement: Database Migrations
The system SHALL support database migrations via Alembic with auto-generate capability.

#### Scenario: Initial migration creation
- **WHEN** developer runs `alembic revision --autogenerate`
- **THEN** migration file is created in `alembic/versions/`
- **AND** includes all defined models

#### Scenario: Migration execution
- **WHEN** developer runs `alembic upgrade head`
- **THEN** all pending migrations are applied in order
- **AND** alembic_version table is updated

#### Scenario: Migration rollback
- **WHEN** developer runs `alembic downgrade -1`
- **THEN** most recent migration is reverted
- **AND** alembic_version table is updated

### Requirement: Base Model Timestamps
The system SHALL include created_at and updated_at timestamps on all tables.

#### Scenario: Automatic created_at
- **WHEN** new record is inserted
- **THEN** created_at is set to current UTC timestamp automatically

#### Scenario: Automatic updated_at
- **WHEN** existing record is modified
- **THEN** updated_at is set to current UTC timestamp automatically