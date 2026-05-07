"""RBAC (Role-Based Access Control) dependencies."""
from fastapi import Depends, HTTPException, status
from functools import wraps

from app.auth.dependencies import get_current_user
from app.models.user import User, UserRole


def require_roles(allowed_roles: list[UserRole]):
    """Factory to create a dependency that requires specific roles."""
    
    # Convert enum values to strings for comparison
    allowed_role_strings = [role.value for role in allowed_roles]
    
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_role_strings:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "FORBIDDEN",
                    "message": "Insufficient permissions",
                },
            )
        return current_user
    
    return role_checker


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that requires admin role."""
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "FORBIDDEN",
                "message": "Admin access required",
            },
        )
    return current_user


async def require_customer(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that requires customer role or above."""
    if current_user.role not in [UserRole.ADMIN.value, UserRole.CUSTOMER.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "FORBIDDEN",
                "message": "Customer access required",
            },
        )
    return current_user


def require_stock_or_admin():
    """Dependency requiring STOCK or ADMIN role."""
    return require_roles([UserRole.STOCK, UserRole.ADMIN])


def require_admin_only():
    """Dependency requiring ADMIN role only."""
    return require_roles([UserRole.ADMIN])