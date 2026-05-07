"""User models with authentication and RBAC support."""
import enum

from datetime import datetime, timezone

from sqlalchemy import Boolean, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserRole(enum.Enum):
    """User roles for RBAC."""

    ADMIN = "admin"
    STOCK = "stock"
    PEDIDOS = "pedidos"
    CUSTOMER = "customer"
    GUEST = "guest"


class User(Base):
    """User entity with authentication."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=True,
    )
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    # Audit fields
    created_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[str | None] = mapped_column(String(36), nullable=True)