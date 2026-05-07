## ADDED Requirements

### Requirement: Tailwind Configuration
The system SHALL be configured with custom Tailwind CSS theme.

#### Scenario: Tailwind config exists
- **WHEN** project is configured
- **THEN** tailwind.config.js exists with Food Store theme

#### Scenario: Custom colors
- **WHEN** Tailwind classes use colors
- **THEN** custom palette is available (primary, secondary, accent)

#### Scenario: Custom fonts
- **WHEN** text styles are applied
- **THEN** custom font families are used

### Requirement: JIT Mode
The system SHALL use Tailwind CSS in JIT mode.

#### Scenario: JIT compilation
- **WHEN** dev server runs
- **THEN** all Tailwind classes are compiled on-demand
- **AND** unused styles are purged in production

### Requirement: Responsive Design
The system SHALL support responsive design with Tailwind breakpoints.

#### Scenario: Mobile-first
- **WHEN** components are styled
- **THEN** mobile styles are default
- **AND** md/lg/xl breakpoints override

### Requirement: Custom Utilities
The system SHALL provide custom utility classes.

#### Scenario: cn utility
- **WHEN** combining class names
- **THEN** cn() utility merges classes
- **AND** handles conditional classes

### Requirement: Base Styles
The system SHALL provide base styles for common elements.

#### Scenario: Reset styles
- **WHEN** app loads
- **THEN** base reset styles are applied
- **AND** typography defaults are set