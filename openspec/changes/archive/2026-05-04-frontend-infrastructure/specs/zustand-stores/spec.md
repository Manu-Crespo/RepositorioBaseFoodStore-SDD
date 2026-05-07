## ADDED Requirements

### Requirement: Auth Store
The system SHALL provide a Zustand store for authentication state.

#### Scenario: Store contains tokens
- **WHEN** user logs in successfully
- **THEN** authStore contains accessToken and refreshToken

#### Scenario: Store persists to localStorage
- **WHEN** authStore is created
- **THEN** persist middleware saves to localStorage
- **AND** tokens survive page refresh

#### Scenario: Clear auth state
- **WHEN** user logs out
- **THEN** tokens are removed from store
- **AND** localStorage is cleared

### Requirement: Cart Store
The system SHALL provide a Zustand store for shopping cart items.

#### Scenario: Add item to cart
- **WHEN** user adds product to cart
- **THEN** cartStore.items includes the product

#### Scenario: Update item quantity
- **WHEN** user changes item quantity
- **THEN** cartStore.items is updated

#### Scenario: Remove item from cart
- **WHEN** user removes item
- **THEN** item is removed from cartStore.items

#### Scenario: Calculate cart total
- **WHEN** cart display is needed
- **THEN** cartStore computes total price

### Requirement: UI Store
The system SHALL provide a Zustand store for UI state.

#### Scenario: Show toast notification
- **WHEN** app triggers toast
- **THEN** uiStore.toasts includes the notification

#### Scenario: Open modal
- **WHEN** app opens modal
- **THEN** uiStore.activeModal is set

#### Scenario: Theme toggle
- **WHEN** user toggles theme
- **THEN** uiStore.theme is updated
- **AND** persists to localStorage

### Requirement: Payment Store
The system SHALL provide a Zustand store for payment state.

#### Scenario: Set payment pending
- **WHEN** checkout is initiated
- **THEN** paymentStore.status is 'pending'

#### Scenario: Payment success
- **WHEN** payment webhook succeeds
- **THEN** paymentStore.status is 'success'
- **AND** orderId is stored