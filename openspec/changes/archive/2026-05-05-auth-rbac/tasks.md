## 1. Backend - Dependencies

- [x] 1.1 Install python-jose[bcrypt] for JWT
- [x] 1.2 Install passlib[bcrypt] for password hashing
- [x] 1.3 Add python-multipart for form data
- [x] 1.4 Add slowapi for rate limiting

## 2. Backend - User Model

- [x] 2.1 Add password_hash field to User model
- [x] 2.2 Add role field with enum (admin, customer, guest)
- [x] 2.3 Add is_active field
- [x] 2.4 Add created_at, updated_at timestamps
- [x] 2.5 Create UserRole enum

## 3. Backend - Auth Schemas

- [x] 3.1 Create UserCreate schema (email, password)
- [x] 3.2 Create UserResponse schema (excludes password)
- [x] 3.3 Create LoginRequest schema
- [x] 3.4 Create TokenResponse schema (access + refresh tokens)
- [x] 3.5 Create TokenData schema (payload with user_id, role)
- [x] 3.6 Add validation for email format and password strength

## 4. Backend - Auth Service

- [x] 4.1 Create hash_password function (bcrypt)
- [x] 4.2 Create verify_password function
- [x] 4.3 Create create_access_token function (JWT, 15 min)
- [x] 4.4 Create create_refresh_token function (JWT, 7 days)
- [x] 4.5 Create verify_token function
- [x] 4.6 Create get_password_hash dependency

## 5. Backend - Auth Endpoints

- [x] 5.1 POST /auth/register - User registration
- [x] 5.2 POST /auth/login - User login (returns tokens)
- [x] 5.3 POST /auth/refresh - Refresh access token
- [x] 5.4 POST /auth/logout - Invalidate refresh token
- [x] 5.5 GET /auth/me - Get current user (protected)

## 6. Backend - Auth Middleware

- [x] 6.1 Create JWTBearer dependency (extracts token from header)
- [x] 6.2 Create get_current_user dependency (validates token)
- [x] 6.3 Attach current_user to request.state
- [x] 6.4 Add rate limiting (5 attempts/minute per IP)

## 8. Backend - Repository Audit

- [x] 8.1 Update create() to accept current_user_id param
- [x] 8.2 Update update() to accept current_user_id param
- [x] 8.3 Add created_by and updated_by fields to entities
- [x] 8.4 Auto-set audit fields in repository

## 9. Backend - Error Handlers (Extended)

- [x] 9.1 Add 401 Unauthorized handler
- [x] 9.2 Add 403 Forbidden handler
- [x] 9.3 Add authentication error types
- [x] 9.4 Extend RFC 7807 responses

## 10. Frontend - Dependencies

- [x] 10.1 Install jwt-decode package
- [x] 10.2 Install react-router-dom (if not present)

## 11. Frontend - Auth Store

- [x] 11.1 Create authStore in stores/ (Zustand)
- [x] 11.2 Add isAuthenticated state
- [x] 11.3 Add currentUser state
- [x] 11.4 Add accessToken in memory (not localStorage)
- [x] 11.5 Add login action
- [x] 11.6 Add logout action
- [x] 11.7 Add refreshToken action
- [x] 11.8 Add setAccessToken action
- [x] 11.9 Persist refresh token in httpOnly cookie

## 12. Frontend - Auth API Client

- [x] 12.1 Create authApi in shared/api/ (axios instance)
- [x] 12.2 Add POST /auth/register
- [x] 12.3 Add POST /auth/login
- [x] 12.4 Add POST /auth/refresh
- [x] 12.5 Add POST /auth/logout
- [x] 12.6 Add GET /auth/me
- [x] 12.7 Configure withCredentials: true for cookies

## 13. Frontend - Protected Routes

- [x] 13.1 Create ProtectedRoute component
- [x] 13.2 Support role-based access
- [x] 13.3 Create PublicOnlyRoute (redirect if logged in)
- [x] 13.4 Add admin guard component

## 14. Frontend - Login/Register Pages

- [x] 14.1 Create LoginPage
- [x] 14.2 Create RegisterPage
- [x] 14.3 Add form validation
- [x] 14.4 Add error display
- [x] 14.5 Add loading states
- [x] 14.6 Add "remember me" option
- [x] 14.7 Add navigation between login/register

## 15. Frontend - Auth Integration

- [x] 15.1 Add auth to App.tsx routes
- [x] 15.2 Protect admin routes (/admin/*)
- [x] 15.3 Protect customer routes (/cart, /orders)
- [x] 15.4 Add logout option in header
- [x] 15.5 Show user info in header when logged in

## 16. Integration & Testing

- [x] 16.1 Update existing endpoints to require auth
- [x] 16.2 Test registration flow end-to-end
- [x] 16.3 Test login flow end-to-end
- [x] 16.4 Test token refresh flow
- [x] 16.5 Test RBAC (admin vs customer vs guest)
- [x] 16.6 Test 401/403 error handling
- [x] 16.7 Run full test suite