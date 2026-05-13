## ADDED Requirements

### Requirement: Auth Store stores default delivery address
The system SHALL store the default delivery address in the auth store for quick access during checkout.

#### Scenario: User has default address on login
- **WHEN** user logs in and has a default delivery address
- **THEN** authStore includes defaultAddress object

#### Scenario: User has no default address
- **WHEN** user logs in and has no default delivery address
- **THEN** authStore defaultAddress is null

#### Scenario: Default address updates
- **WHEN** user changes their default address via API
- **THEN** authStore updates defaultAddress on next profile fetch

#### Scenario: Default address deleted
- **WHEN** user's default address is deleted
- **THEN** authStore defaultAddress becomes null on next profile fetch


## MODIFIED Requirements

### Requirement: User profile includes default address
**Original:** Profile response includes user data: id, email, first_name, last_name, phone, role, created_at.

**Updated:** Profile response includes user data plus default delivery address: id, email, first_name, last_name, phone, role, created_at, default_address (object or null).

**Rationale for Change:** Delivery addresses are now available in the system, and the default address is needed for quick checkout flow.