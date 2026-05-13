## ADDED Requirements

### Requirement: User can view their own profile data
The system SHALL allow authenticated users to view their personal profile data including name, email, and phone number.

#### Scenario: Authenticated user requests their profile
- **WHEN** authenticated user makes GET request to `/api/v1/auth/profile`
- **THEN** system returns the user's profile data with status 200

#### Scenario: Unauthenticated user requests profile
- **WHEN** unauthenticated user makes GET request to `/api/v1/auth/profile`
- **THEN** system returns 401 Unauthorized

### Requirement: Profile response includes required fields
The system MUST return the user's profile with the following fields: id, email, first_name, last_name, phone, role, created_at.

#### Scenario: Profile response contains all required fields
- **WHEN** authenticated user requests their profile
- **THEN** response includes id, email, first_name, last_name, phone, role, created_at

#### Scenario: Profile fields handle null values
- **WHEN** authenticated user has no phone number set
- **THEN** response includes phone field with null value