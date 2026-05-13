## ADDED Requirements

### Requirement: User can set a default delivery address
The system SHALL allow authenticated users to designate one of their addresses as the default for checkout.

#### Scenario: User sets a default address
- **WHEN** authenticated user makes POST request to `/api/v1/auth/addresses/{address_id}/default`
- **THEN** system sets that address as default and returns status 200 with updated address

#### Scenario: Setting default replaces previous default
- **WHEN** user has an existing default address and sets a new one as default
- **THEN** previous default is cleared and new address becomes default

#### Scenario: User attempts to set default on non-existent address
- **WHEN** authenticated user makes POST request to `/api/v1/auth/addresses/{non_existent_id}/default`
- **THEN** system returns 404 Not Found

#### Scenario: User attempts to set default on another user's address
- **WHEN** authenticated user makes POST request to `/api/v1/auth/addresses/{other_user_address_id}/default`
- **THEN** system returns 404 Not Found (do not reveal ownership)

#### Scenario: Unauthenticated user attempts to set default
- **WHEN** unauthenticated user makes POST request to `/api/v1/auth/addresses/{address_id}/default`
- **THEN** system returns 401 Unauthorized

### Requirement: Default address is returned in user profile
The system SHALL include the default delivery address in the user's profile response.

#### Scenario: User with default address requests profile
- **WHEN** authenticated user has a default address and makes GET request to `/api/v1/auth/profile`
- **THEN** response includes the default_address field with address details

#### Scenario: User without default address requests profile
- **WHEN** authenticated user has no default address and makes GET request to `/api/v1/auth/profile`
- **THEN** response includes default_address as null

#### Scenario: Default address is deleted
- **WHEN** user's default address is deleted
- **THEN** user's default_address becomes null automatically