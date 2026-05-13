## ADDED Requirements

### Requirement: Auth Store (Zustand)
The system SHALL provide a Zustand store for authentication state.

#### Scenario: User not authenticated
- **WHEN** app loads and no token in storage
- **THEN** isAuthenticated is false
- **AND** currentUser is null

#### Scenario: User login success
- **WHEN** login API returns tokens
- **THEN** store updates isAuthenticated=true
- **AND** currentUser is populated
- **AND** access_token stored in memory (not localStorage)

#### Scenario: User logout
- **WHEN** user calls logout action
- **THEN** tokens are cleared
- **AND** isAuthenticated becomes false
- **AND** currentUser becomes null

#### Scenario: Token refresh
- **WHEN** access token expires
- **AND** refresh token is valid
- **THEN** store updates access_token
- **AND** user stays authenticated

#### Scenario: Session expired
- **WHEN** refresh token expires
- **THEN** store clears auth state
- **AND** redirects to login


## MODIFIED Requirements

### Requirement: User logout
**Original:** When user calls logout action, tokens are cleared and isAuthenticated becomes false.

**Updated:** When user calls logout action, tokens are cleared, isAuthenticated becomes false, and currentUser becomes null.

**Rationale for Change:** The logout endpoint now calls the backend to blacklist the refresh token, ensuring complete session termination.

### Requirement: Password change terminates all sessions
The system MUST invalidate all existing refresh tokens for the user after a successful password change.

#### Scenario: Password change logs out other sessions
- **WHEN** authenticated user successfully changes their password
- **THEN** all existing refresh tokens for that user are invalidated

#### Scenario: Password change forces re-login on other devices
- **WHEN** user A changes password while user B has an active refresh token for user A
- **THEN** user B's refresh token is now invalid and must re-login

#### Scenario: Auth store handles logout after password change
- **WHEN** password change is successful
- **THEN** authStore logout action is called automatically
- **AND** user is redirected to login page
- **AND** message "Password changed successfully, please login again" is shown