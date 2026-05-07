## MODIFIED Requirements

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

#### Scenario: Create entity with audit user
- **WHEN** repository.create(data, current_user_id=123) is called
- **THEN** created_by is set to 123
- **AND** updated_by is set to 123

#### Scenario: Update entity with audit user
- **WHEN** repository.update(id, data, current_user_id=123) is called
- **AND** updated_by is set to 123