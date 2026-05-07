"""
Base SQLAlchemy models with common mixins.
"""
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column


class Base(DeclarativeBase):
    """Base class for all models."""

    pass


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class SoftDeleteMixin:
    """Mixin for soft delete."""

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )


class UUIDMixin:
    """Mixin for UUID primary key."""

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        nullable=False,
    )