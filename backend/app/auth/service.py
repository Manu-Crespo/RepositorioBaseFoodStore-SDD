"""Authentication service for JWT and password management."""
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.config import settings
from app.models.user import User, UserRole

# Token blacklist (in-memory for single instance, use Redis for multi-instance)
# Format: {token_jti: expiration_datetime}
_blacklisted_tokens: dict[str, datetime] = {}


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token."""
    import uuid
    
    to_encode = data.copy()
    to_encode["jti"] = str(uuid.uuid4())  # Unique token ID
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(data: dict[str, Any]) -> str:
    """Create a JWT refresh token (7 days)."""
    import uuid
    
    to_encode = data.copy()
    to_encode["jti"] = str(uuid.uuid4())  # Unique token ID
    
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc), "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str, check_blacklist: bool = True) -> dict[str, Any]:
    """Verify and decode a JWT token."""
    # Check blacklist first
    if check_blacklist:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"verify_exp": False}
            )
            jti = payload.get("jti")
            if jti and jti in _blacklisted_tokens:
                raise ValueError("Token has been revoked")
        except JWTError:
            pass
    
    # Decode and verify
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}")


def blacklist_token(token: str) -> bool:
    """Add a token to the blacklist."""
    try:
        # Decode without expiry check to get the expiration
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"verify_exp": False}
        )
        jti = payload.get("jti")
        exp = payload.get("exp")
        
        if jti and exp:
            exp_time = datetime.fromtimestamp(exp, tz=timezone.utc)
            _blacklisted_tokens[jti] = exp_time
            # Cleanup expired entries
            _cleanup_blacklist()
            return True
    except JWTError:
        pass
    return False


def _cleanup_blacklist():
    """Remove expired tokens from blacklist."""
    now = datetime.now(timezone.utc)
    expired = [jti for jti, exp in _blacklisted_tokens.items() if exp < now]
    for jti in expired:
        del _blacklisted_tokens[jti]


def is_token_blacklisted(token: str) -> bool:
    """Check if a token is blacklisted."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"verify_exp": False}
        )
        jti = payload.get("jti")
        return jti in _blacklisted_tokens
    except JWTError:
        return False


def create_token_pair(user: User) -> tuple[str, str]:
    """Create access and refresh token pair for a user."""
    role = user.role
    first_name = user.first_name
    last_name = user.last_name

    access_data = {
        "sub": user.id,
        "role": role,
        "first_name": first_name,
        "last_name": last_name,
    }
    refresh_data = {
        "sub": user.id,
        "role": role,
        "first_name": first_name,
        "last_name": last_name,
    }

    access_token = create_access_token(access_data)
    refresh_token = create_refresh_token(refresh_data)

    return access_token, refresh_token


def create_user(email: str, password: str, first_name: str, last_name: str, phone: str | None = None, role: str = "customer") -> User:
    """Create a new user with hashed password (factory function, not DB operation)."""
    from uuid import uuid4

    return User(
        id=str(uuid4()),
        email=email.lower().strip(),
        password_hash=hash_password(password),
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        phone=phone,
        role=role,
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )