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