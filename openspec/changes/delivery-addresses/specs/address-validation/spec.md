## ADDED Requirements

### Requirement: Address fields are validated
The system SHALL validate all address fields according to defined rules.

#### Scenario: Street field validation
- **WHEN** user provides street with more than 200 characters
- **THEN** system returns 422 Validation Error with detail about maximum length

#### Scenario: Street field accepts special characters
- **WHEN** user provides street with valid special characters (e.g., "Av. Libertador 1234")
- **THEN** system accepts the address

#### Scenario: Postal code validation
- **WHEN** user provides postal code that doesn't match allowed format
- **THEN** system returns 422 Validation Error with detail about format

#### Scenario: City field is required
- **WHEN** user omits city field
- **THEN** system returns 422 Validation Error with detail about required field

#### Scenario: State field is required
- **WHEN** user omits state field
- **THEN** system returns 422 Validation Error with detail about required field

#### Scenario: Country field defaults to Argentina
- **WHEN** user provides address without country
- **THEN** system defaults country to "Argentina"

#### Scenario: Notes field has maximum length
- **WHEN** user provides notes with more than 500 characters
- **THEN** system returns 422 Validation Error with detail about maximum length

#### Scenario: Latitude and longitude are optional
- **WHEN** user provides address without coordinates
- **THEN** system accepts the address (coordinates are optional for future geocoding)