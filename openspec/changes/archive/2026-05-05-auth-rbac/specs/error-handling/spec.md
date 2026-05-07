## MODIFIED Requirements

### Requirement: RFC 7807 Problem Details Response

The system SHALL return error responses in RFC 7807 Problem Details format.

#### Scenario: Validation error response
- **WHEN** request fails validation
- **THEN** returns 422 with problem details including field errors
- **AND** includes "type", "title", "status", "detail", "instance"

#### Scenario: Not found error response
- **WHEN** resource is not found
- **THEN** returns 404 with problem details
- **AND** type points to specific error type

#### Scenario: Internal server error response
- **WHEN** unhandled exception occurs
- **THEN** returns 500 with generic message
- **AND** logs detailed error with trace_id (not exposed to client)

#### Scenario: Authentication error (401)
- **WHEN** request lacks valid authentication
- **THEN** returns 401 with problem details
- **AND** type is "https://api.foodstore.com/errors/unauthorized"
- **AND** detail explains "authentication required" or "invalid credentials"

#### Scenario: Forbidden error (403)
- **WHEN** authenticated user lacks permission
- **THEN** returns 403 with problem details
- **AND** type is "https://api.foodstore.com/errors/forbidden"
- **AND** detail explains "insufficient permissions"