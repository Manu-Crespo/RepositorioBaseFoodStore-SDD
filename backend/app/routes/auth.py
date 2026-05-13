"""Authentication routes for auth-rbac change."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.service import create_token_pair, create_user, verify_password, verify_token
from app.unit_of_work import UnitOfWork, get_unit_of_work
from app.config import settings
from app.errors.codes import ErrorCode
from app.models.user import User, UserRole
from app.rate_limit import limiter
from app.database import get_db
from app.schemas.auth import (
    LoginRequest,
    LogoutRequest,
    PasswordChange,
    ProfileUpdate,
    RefreshRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("10/minute")
async def register(
    request: Request,
    user_data: UserCreate,
    uow: UnitOfWork = Depends(get_unit_of_work),
):
    """Register a new user."""
    # Check if email already exists
    result = await uow.session.execute(
        select(User).where(User.email == user_data.email.lower().strip())
    )
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": ErrorCode.EMAIL_EXISTS,
                "message": "Email already registered",
            },
        )

    # Create new user using factory function
    new_user = create_user(
        email=user_data.email,
        password=user_data.password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
    )
    uow.session.add(new_user)
    await uow.session.flush()
    # Commit handled by UoW dependency

    return new_user


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Login with email and password (supports JSON and Swagger Form)."""
    # Try to get data from Form (Swagger) or JSON (Frontend)
    content_type = request.headers.get("content-type", "")
    
    if "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        form_data = await request.form()
        email = form_data.get("username")
        password = form_data.get("password")
    else:
        try:
            json_data = await request.json()
            email = json_data.get("email")
            password = json_data.get("password")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid request format. Expected JSON or Form-Data"
            )

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email and password are required"
        )

    # Find user by email
    print(f"DEBUG: Login attempt for email: '{email}'")
    result = await db.execute(
        select(User).where(User.email == email.lower().strip())
    )
    user = result.scalar_one_or_none()
    print(f"DEBUG: User found: {user.email if user else 'None'}")

    # Verify password (same error message whether user exists or not)
    if user:
        is_pw_valid = verify_password(password, user.password_hash)
        print(f"DEBUG: Password valid: {is_pw_valid}")
    
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.INVALID_CREDENTIALS,
                "message": "Invalid credentials",
            },
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.INACTIVE_USER,
                "message": "User account is inactive",
            },
        )

    # Create token pair
    access_token, refresh_token = create_token_pair(user)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    refresh_data: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """Refresh access token using refresh token."""
    # Use cookie if no token provided
    token = refresh_data.refresh_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.MISSING_TOKEN,
                "message": "Refresh token required",
            },
        )

    # Verify token
    try:
        payload = verify_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.INVALID_TOKEN,
                "message": "Invalid or expired token",
            },
        )

    # Check token type
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.INVALID_TOKEN,
                "message": "Invalid token type",
            },
        )

    # Get user
    user_id = payload.get("sub")
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.USER_NOT_FOUND,
                "message": "User not found or inactive",
            },
        )

    # Check if password was changed after token was issued (token invalidation)
    if user.password_changed_at:
        token_iat = payload.get("iat")
        if token_iat and token_iat < int(user.password_changed_at.timestamp()):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "code": "PASSWORD_CHANGED",
                    "message": "Password was changed, please login again",
                },
            )

    # Create new token pair (rotation)
    access_token, new_refresh = create_token_pair(user)

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    logout_data: LogoutRequest,
    response: Response,
):
    """Logout and invalidate refresh token."""
    # Blacklist the refresh token if provided
    if logout_data.refresh_token:
        from app.auth.service import blacklist_token
        blacklist_token(logout_data.refresh_token)
    
    response.delete_cookie("refresh_token")
    return None


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current authenticated user."""
    return current_user


# === Profile Endpoints ===

@router.get("/profile", response_model=UserResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the current user's profile."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's profile data."""
    # Update only provided fields
    if profile_data.first_name is not None:
        current_user.first_name = profile_data.first_name.strip()
    if profile_data.last_name is not None:
        current_user.last_name = profile_data.last_name.strip()
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone.strip() if profile_data.phone else None

    # Commit handled by UoW

    return current_user


@router.put("/profile/password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: PasswordChange,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(get_current_user),
):
    """Change the current user's password."""
    from datetime import datetime, timezone
    from app.auth.service import hash_password

    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_CURRENT_PASSWORD",
                "message": "Current password is incorrect",
            },
        )

    # Check new password is different from current
    if verify_password(password_data.new_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "SAME_PASSWORD",
                "message": "New password must be different from current password",
            },
        )

    # Update password and set password_changed_at
    current_user.password_hash = hash_password(password_data.new_password)
    current_user.password_changed_at = datetime.now(timezone.utc)

    # Commit handled by UoW

    return {"message": "Password changed successfully, please login again"}