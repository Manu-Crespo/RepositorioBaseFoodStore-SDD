## ADDED Requirements

### Requirement: User Registration
The system SHALL allow new users to register with email and password.

#### Scenario: Successful registration
- **WHEN** user submits valid email and password (min 8 chars)
- **THEN** user is created in database with hashed password
- **AND** returns 201 with user data (excluding password)

#### Scenario: Duplicate email registration
- **WHEN** user attempts to register with existing email
- **THEN** returns 409 with error "email already registered"

#### Scenario: Invalid password format
- **WHEN** user submits password shorter than 8 characters
- **THEN** returns 422 with validation error on password field

### Requirement: User Login
The system SHALL authenticate users with email and password.

#### Scenario: Successful login
- **WHEN** user provides valid credentials
- **THEN** returns access_token and refresh_token
- **AND** tokens include user_id and role

#### Scenario: Invalid credentials
- **WHEN** user provides wrong password
- **THEN** returns 401 with error "invalid credentials"
- **AND** does not reveal if email exists

#### Scenario: Rate limited login attempts
- **WHEN** more than 5 failed attempts from same IP in 1 minute
- **THEN** returns 429 with "too many requests"
- **AND** enforces 60 second cooldown

### Requirement: JWT Access Token
The system SHALL issue JWT access tokens for API authentication.

#### Scenario: Valid access token
- **WHEN** request includes valid access token
- **THEN** grants access to protected endpoint
- **AND** extracts user_id and role from token

#### Scenario: Expired access token
- **WHEN** access token has expired
- **THEN** returns 401 with error "token expired"
- **AND** suggests using refresh token

#### Scenario: Invalid access token
- **WHEN** access token is malformed or tampered
- **THEN** returns 401 with error "invalid token"

### Requirement: JWT Refresh Token
The system SHALL issue refresh tokens for session maintenance.

#### Scenario: Refresh access token
- **WHEN** user submits valid refresh token
- **THEN** issues new access_token and new refresh_token
- **AND** invalidates old refresh token (rotation)

#### Scenario: Expired refresh token
- **WHEN** refresh token has expired
- **THEN** returns 401 with error "session expired"
- **AND** user must re-login

#### Scenario: Refresh token reuse
- **WHEN** refresh token was already used (stolen)
- **THEN** invalidates entire token family
- **AND** forces re-login (security measure)

### Requirement: User Logout
The system SHALL allow users to logout by invalidating tokens.

#### Scenario: User logout
- **WHEN** user requests logout
- **AND** provides valid refresh token
- **THEN** invalidates refresh token
- **AND** returns 204 No Content