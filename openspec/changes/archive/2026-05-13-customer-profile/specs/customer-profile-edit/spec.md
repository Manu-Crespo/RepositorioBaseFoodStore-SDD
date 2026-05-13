## ADDED Requirements

### Requirement: User can edit their profile data
The system SHALL allow authenticated users to update their personal profile data including first_name, last_name, and phone.

#### Scenario: User successfully updates profile
- **WHEN** authenticated user makes PUT request to `/api/v1/auth/profile` with valid data (first_name, last_name, phone)
- **THEN** system updates the user's profile and returns status 200 with updated data

#### Scenario: User provides invalid email change
- **WHEN** authenticated user attempts to change email via PUT request
- **THEN** system ignores the email field (email cannot be changed via this endpoint)

#### Scenario: User provides empty first_name
- **WHEN** authenticated user makes PUT request with empty first_name
- **THEN** system returns 422 Validation Error with detail about required field

#### Scenario: User provides invalid phone format
- **WHEN** authenticated user makes PUT request with invalid phone format
- **THEN** system returns 422 Validation Error with detail about phone format

#### Scenario: User sends no fields to update
- **WHEN** authenticated user makes PUT request with empty body
- **THEN** system returns 200 with current profile data (no changes made)

#### Scenario: Unauthenticated user attempts to edit profile
- **WHEN** unauthenticated user makes PUT request to `/api/v1/auth/profile`
- **THEN** system returns 401 Unauthorized