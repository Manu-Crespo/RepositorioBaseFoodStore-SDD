## ADDED Requirements

### Requirement: Authentication Middleware
The system SHALL provide FastAPI middleware for JWT validation.

#### Scenario: Valid JWT in request
- **WHEN** request includes Authorization: Bearer <token>
- **THEN** middleware validates token
- **AND** attaches current_user to request state

#### Scenario: No Authorization header
- **WHEN** request has no Authorization header
- **THEN** middleware allows (endpoint decides if required)
- **AND** request.state.current_user is None

#### Scenario: Invalid JWT format
- **WHEN** Authorization header is not Bearer format
- **THEN** returns 401 with error "invalid authorization header"

### Requirement: RoleRequired Dependency
The system SHALL provide FastAPI dependency for role-based protection.

#### Scenario: Admin required on endpoint
- **WHEN** endpoint has role_required=["admin"]
- **AND** current user has admin role
- **THEN** request proceeds

#### Scenario: Role requirement fails
- **WHEN** endpoint has role_required=["admin"]
- **AND** current user has customer role
- **THEN** returns 403 with error "insufficient permissions"

### Requirement: Optional Authentication
The system SHALL support optional auth for public endpoints with user context.

#### Scenario: Authenticated request to public endpoint
- **WHEN** user calls public endpoint with valid token
- **AND** includes role_required={}
- **THEN** proceeds with current_user available

#### Scenario: Unauthenticated request to public endpoint
- **WHEN** user calls public endpoint without token
- **AND** includes role_required={}
- **THEN** proceeds with current_user=None