## ADDED Requirements

### Requirement: User Roles
The system SHALL define roles for access control.

#### Scenario: Admin role
- **WHEN** user has admin role
- **THEN** can access all endpoints
- **AND** can manage products, categories, customers, orders

#### Scenario: Customer role
- **WHEN** user has customer role
- **THEN** can browse products and categories
- **AND** can manage own cart, orders, favorites

#### Scenario: Guest role
- **WHEN** user has no auth (guest)
- **THEN** can only browse products/categories
- **AND** cannot place orders or access personal data

### Requirement: Role-Based Access Control
The system SHALL enforce access control based on user roles.

#### Scenario: Admin accesses admin endpoint
- **WHEN** admin user calls product management endpoint
- **THEN** returns 200 with data

#### Scenario: Customer accesses admin endpoint
- **WHEN** customer user calls product management endpoint
- **THEN** returns 403 with error "forbidden"

#### Scenario: Guest accesses protected endpoint
- **WHEN** unauthenticated user calls protected endpoint
- **THEN** returns 401 with error "authentication required"

#### Scenario: Customer accesses own data
- **WHEN** customer user calls /me endpoint
- **THEN** returns their own user data

#### Scenario: Customer accesses other user data
- **WHEN** customer user calls /users/{id} for different user
- **THEN** returns 403 with error "forbidden"