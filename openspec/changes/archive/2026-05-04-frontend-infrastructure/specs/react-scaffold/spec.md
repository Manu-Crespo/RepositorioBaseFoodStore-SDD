## ADDED Requirements

### Requirement: Vite Development Server
The system SHALL provide a Vite development server for local development.

#### Scenario: Start dev server
- **WHEN** developer runs `npm run dev`
- **THEN** Vite starts on port 5173 (default)
- **AND** hot module replacement is enabled

#### Scenario: Dev server with proxy
- **WHEN** Vite config includes API proxy
- **THEN** requests to /api/* are proxied to backend

### Requirement: TypeScript Configuration
The system SHALL use TypeScript with strict mode enabled.

#### Scenario: TypeScript strict mode
- **WHEN** TypeScript compiles
- **THEN** strict type checking is enforced
- **AND** noImplicitAny is enabled

#### Scenario: Path aliases
- **WHEN** imports use @ alias
- **THEN** TypeScript resolves to correct path
- **AND** Vite resolves the same paths

### Requirement: FSD Folder Structure
The system SHALL organize code using Feature-Sliced Design (FSD) structure.

#### Scenario: FSD directories exist
- **WHEN** project is scaffolded
- **THEN** directories app/, pages/, widgets/, features/, entities/, shared/ exist

#### Scenario: Clean imports
- **WHEN** importing from another layer
- **THEN** imports use explicit relative paths or aliases

### Requirement: Build Configuration
The system SHALL produce optimized production builds.

#### Scenario: Production build
- **WHEN** developer runs `npm run build`
- **THEN** optimized bundle is created in dist/
- **AND** source maps are available

#### Scenario: Bundle analysis
- **WHEN** build completes
- **THEN** bundle size is reported
- **AND** chunks are code-split