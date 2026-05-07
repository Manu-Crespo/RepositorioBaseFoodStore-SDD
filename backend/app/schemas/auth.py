"""Authentication schemas for auth-rbac change."""
import re
from datetime import datetime
from typing import Any

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
)


class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: str | None = Field(None, max_length=20)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        """Validate phone format (international format supported)."""
        if v is None:
            return v
        # Remove common separators for validation
        cleaned = re.sub(r"[\s\-\(\)]", "", v)
        # Must start with + or digit, contain only digits after that
        if not re.match(r"^\+?\d{7,15}$", cleaned):
            raise ValueError("Invalid phone format. Use: +XX XXX XXXX or XXXX XXXX")
        return v

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password has letters and numbers."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain letters")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain numbers")
        return v


class UserResponse(BaseModel):
    """Schema for user response (excludes password)."""

    id: str
    email: str
    first_name: str
    last_name: str
    phone: str | None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    """Schema for login request."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse | None = None


class TokenData(BaseModel):
    """Schema for JWT token payload."""

    sub: str  # user_id
    role: str
    exp: int
    iat: int


class RefreshRequest(BaseModel):
    """Schema for refresh token request."""

    refresh_token: str | None = None


class LogoutRequest(BaseModel):
    """Schema for logout request."""

    refresh_token: str | None = None