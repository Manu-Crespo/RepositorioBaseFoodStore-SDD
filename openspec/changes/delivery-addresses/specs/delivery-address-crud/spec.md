## ADDED Requirements

### Requirement: User can create a delivery address
The system SHALL allow authenticated users to create a new delivery address with street, number, city, state, postal code, country, and optional notes.

#### Scenario: User creates a new address successfully
- **WHEN** authenticated user makes POST request to `/api/v1/auth/addresses` with valid address data
- **THEN** system creates the address and returns status 201 with the created address

#### Scenario: User provides invalid address data
- **WHEN** authenticated user makes POST request with missing required fields
- **THEN** system returns 422 Validation Error with detail about missing fields

#### Scenario: Unauthenticated user attempts to create address
- **WHEN** unauthenticated user makes POST request to `/api/v1/auth/addresses`
- **THEN** system returns 401 Unauthorized

### Requirement: User can list their delivery addresses
The system SHALL return all non-deleted addresses belonging to the authenticated user.

#### Scenario: User lists their addresses
- **WHEN** authenticated user makes GET request to `/api/v1/auth/addresses`
- **THEN** system returns list of all addresses for that user (excluding deleted)

#### Scenario: User has no addresses
- **WHEN** authenticated user has no addresses and makes GET request
- **THEN** system returns empty array []

#### Scenario: Unauthenticated user attempts to list addresses
- **WHEN** unauthenticated user makes GET request to `/api/v1/auth/addresses`
- **THEN** system returns 401 Unauthorized

### Requirement: User can update a delivery address
The system SHALL allow authenticated users to update any of their own addresses.

#### Scenario: User updates an address successfully
- **WHEN** authenticated user makes PUT request to `/api/v1/auth/addresses/{address_id}` with valid data
- **THEN** system updates the address and returns status 200 with updated address

#### Scenario: User updates address belonging to another user
- **WHEN** authenticated user makes PUT request to `/api/v1/auth/addresses/{address_id}` where address belongs to another user
- **THEN** system returns 404 Not Found (do not reveal ownership)

#### Scenario: User provides invalid data on update
- **WHEN** authenticated user makes PUT request with invalid postal code format
- **THEN** system returns 422 Validation Error with detail about format

#### Scenario: Unauthenticated user attempts to update address
- **WHEN** unauthenticated user makes PUT request to `/api/v1/auth/addresses/{address_id}`
- **THEN** system returns 401 Unauthorized

### Requirement: User can delete a delivery address
The system SHALL perform soft-delete on addresses (marking them as deleted without removing the record).

#### Scenario: User deletes an address
- **WHEN** authenticated user makes DELETE request to `/api/v1/auth/addresses/{address_id}`
- **THEN** system marks address as deleted and returns status 204 No Content

#### Scenario: User tries to delete address belonging to another user
- **WHEN** authenticated user makes DELETE request to `/api/v1/auth/addresses/{address_id}` where address belongs to another user
- **THEN** system returns 404 Not Found

#### Scenario: Deleted address is excluded from list
- **WHEN** authenticated user has a deleted address and makes GET request to list addresses
- **THEN** deleted address is not included in the response

#### Scenario: Unauthenticated user attempts to delete address
- **WHEN** unauthenticated user makes DELETE request to `/api/v1/auth/addresses/{address_id}`
- **THEN** system returns 401 Unauthorized

### Requirement: User can get a single address detail
The system SHALL return details of a specific address by ID.

#### Scenario: User requests address detail
- **WHEN** authenticated user makes GET request to `/api/v1/auth/addresses/{address_id}`
- **THEN** system returns the address details

#### Scenario: User requests address that doesn't exist
- **WHEN** authenticated user makes GET request to `/api/v1/auth/addresses/{non_existent_id}`
- **THEN** system returns 404 Not Found

#### Scenario: Unauthenticated user requests address detail
- **WHEN** unauthenticated user makes GET request to `/api/v1/auth/addresses/{address_id}`
- **THEN** system returns 401 Unauthorized