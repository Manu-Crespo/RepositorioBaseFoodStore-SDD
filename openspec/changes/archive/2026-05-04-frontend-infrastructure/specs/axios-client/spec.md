## ADDED Requirements

### Requirement: Axios Instance
The system SHALL provide a pre-configured Axios instance.

#### Scenario: Create Axios instance
- **WHEN** axios client is instantiated
- **THEN** baseURL is set from environment
- **AND** timeout is configured

#### Scenario: Instance is exported
- **WHEN** other modules need HTTP client
- **THEN** they import the pre-configured instance

### Requirement: Request Interceptor
The system SHALL add JWT token to requests automatically.

#### Scenario: Add auth header
- **WHEN** request is made with logged-in user
- **THEN** Authorization header is added with Bearer token

#### Scenario: No token
- **WHEN** user is not logged in
- **THEN** request is made without auth header

### Requirement: Response Interceptor
The system SHALL handle 401 responses globally.

#### Scenario: 401 response received
- **WHEN** response returns 401
- **THEN** user is redirected to login
- **AND** cart is cleared

#### Scenario: Network error
- **WHEN** request fails with network error
- **THEN** error is transformed to user-friendly message

### Requirement: API Endpoints
The system SHALL provide typed API methods.

#### Scenario: GET request
- **WHEN** app fetches data
- **THEN** returns typed response

#### Scenario: POST request
- **WHEN** app sends data
- **THEN** request body is typed