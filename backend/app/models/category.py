"""Category model with hierarchical (materialized path) support."""
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Self

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.product import Product


class Category(Base, TimestampMixin, SoftDeleteMixin):
    """Category entity with hierarchical structure using materialized path."""

    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    parent_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("categories.id"),
        nullable=True,
    )
    path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        default="/",
    )
    order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    # Timestamps - set defaults in model since columns are NOT NULL
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

    # Relationships
    parent: Mapped["Category | None"] = relationship(
        "Category",
        remote_side=[id],
        back_populates="children",
    )
    children: Mapped[list["Category"]] = relationship(
        "Category",
        back_populates="parent",
    )
    products: Mapped[list["Product"]] = relationship(
        "Product",
        secondary="products_categories",
        back_populates="categories",
    )

    def get_breadcrumbs(self) -> list[dict]:
        """Build breadcrumbs from path."""
        if not self.path or self.path == "/":
            return [{"id": self.id, "name": self.name}]

        parts = self.path.strip("/").split("/")
        breadcrumbs = []
        for part in parts:
            if part:
                breadcrumbs.append({"id": part, "name": ""})
        breadcrumbs.append({"id": self.id, "name": self.name})
        return breadcrumbs

    def get_depth(self) -> int:
        """Get depth level in the tree."""
        if not self.path or self.path == "/":
            return 0
        return len(self.path.strip("/").split("/"))