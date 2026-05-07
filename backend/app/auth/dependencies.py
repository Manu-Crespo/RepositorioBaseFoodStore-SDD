"""Authentication dependencies and middleware."""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.service import verify_token
from app.errors.codes import ErrorCode
from app.models.user import User
from app.database import get_db

from app.config import settings

# OAuth2 security scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False
)


async def get_current_user_optional(
    request: Request,
    token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Get current user from JWT token (optional - returns None if not authenticated)."""
    if not token:
        return None
    
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user or not user.is_active:
            return None
        
        # Attach user to request state for downstream use
        request.state.current_user = user
        
        return user
    except ValueError:
        return None


async def get_current_user(
    request: Request,
    token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current authenticated user (required - raises 401 if not authenticated)."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.UNAUTHORIZED,
                "message": "Authentication required",
            },
        )
    
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "code": ErrorCode.INVALID_TOKEN,
                    "message": "Invalid token",
                },
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.INVALID_TOKEN,
                "message": "Invalid or expired token",
            },
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.USER_NOT_FOUND,
                "message": "User not found",
            },
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": ErrorCode.INACTIVE_USER,
                "message": "User account is inactive",
            },
        )
    
    # Attach user to request state
    request.state.current_user = user
    
    return user