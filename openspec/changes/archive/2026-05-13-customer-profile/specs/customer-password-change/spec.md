## ADDED Requirements

### Requirement: User can change their password
The system SHALL allow authenticated users to change their password by providing their current password and a new password.

#### Scenario: User successfully changes password
- **WHEN** authenticated user makes PUT request to `/api/v1/auth/profile/password` with correct current_password and valid new_password
- **THEN** system updates the user's password, returns status 200 with success message

#### Scenario: User provides wrong current password
- **WHEN** authenticated user makes PUT request with incorrect current_password
- **THEN** system returns 400 Bad Request with error "Current password is incorrect"

#### Scenario: User provides weak new password
- **WHEN** authenticated user makes PUT request with new_password that doesn't meet requirements
- **THEN** system returns 422 Validation Error with detail about password requirements

#### Scenario: User provides same new password as current
- **WHEN** authenticated user makes PUT request with new_password equal to current_password
- **THEN** system returns 400 Bad Request with error "New password must be different from current password"

#### Scenario: Unauthenticated user attempts to change password
- **WHEN** unauthenticated user makes PUT request to `/api/v1/auth/profile/password`
- **THEN** system returns 401 Unauthorized

### Requirement: Password change invalidates all refresh tokens
The system MUST invalidate all existing refresh tokens for the user after a successful password change.

#### Scenario: Password change logs out other sessions
- **WHEN** authenticated user successfully changes their password
- **THEN** all existing refresh tokens for that user are invalidated

#### Scenario: Password change forces re-login on other devices
- **WHEN** user A changes password while user B has an active refresh token for user A
- **THEN** user B's refresh token is now invalid and must re-login