## ADDED Requirements

### Requirement: BaseRepository Generic CRUD
The system SHALL provide a generic BaseRepository class with standard CRUD operations for all entities.

#### Scenario: Retrieve entity by ID
- **WHEN** repository.get(id) is called
- **THEN** returns entity from database or None if not found

#### Scenario: List entities with pagination
- **WHEN** repository.get_all(skip=0, limit=10) is called
- **THEN** returns list of entities with pagination metadata
- **AND** total count for pagination UI

#### Scenario: Create single entity
- **WHEN** repository.create(data) is called
- **THEN** entity is inserted and returned with generated ID

#### Scenario: Create multiple entities
- **WHEN** repository.create_many([data1, data2]) is called
- **THEN** all entities are inserted in single transaction
- **AND** returns list with generated IDs

#### Scenario: Update entity
- **WHEN** repository.update(id, data) is called
- **THEN** entity is updated and returned
- **AND** updated_at timestamp is modified

#### Scenario: Soft delete entity
- **WHEN** repository.delete(id) is called
- **THEN** entity is soft deleted (deleted_at set)
- **AND** entity is excluded from queries by default

#### Scenario: Hard delete entity
- **WHEN** repository.delete(id, hard=True) is called
- **THEN** entity is permanently removed from database

### Requirement: Unit of Work Pattern
The system SHALL provide Unit of Work for atomic transactions across multiple repositories.

#### Scenario: Successful transaction
- **WHEN** unit_of_work.__aenter__() is used with operations
- **AND** all operations complete without error
- **THEN** transaction is committed automatically

#### Scenario: Failed transaction
- **WHEN** exception is raised inside unit_of_work context
- **THEN** all changes are rolled back automatically
- **AND** original exception is re-raised

#### Scenario: Multiple repositories share session
- **WHEN** user_repository and order_repository use same unit_of_work
- **THEN** both share the same async session
- **AND** commit happens once at the end

### Requirement: Repository Dependency Injection
The system SHALL enable repository instantiation via FastAPI dependency injection.

#### Scenario: Request-scoped repository
- **WHEN** endpoint declares repository as dependency
- **THEN** new repository instance is created per request
- **AND** session is managed by dependency

#### Scenario: Repository with custom queries
- **WHEN** custom query method is added to repository
- **THEN** it has access to same session as base methods