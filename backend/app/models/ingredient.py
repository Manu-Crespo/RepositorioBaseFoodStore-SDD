"""Ingredient model with allergens support."""
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Self

from sqlalchemy import String, DateTime, ARRAY, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.product import Product


# Lista de alérgenos permitidos
ALLOWED_ALLERGENS = [
    "gluten",
    "lacteos",
    "huevos",
    "pescado",
    "mariscos",
    "frutos_secos",
    "cacahuetes",
    "soja",
    "sesamo",
    "mostaza",
    "apio",
    "sulfitos",
    "altramuces",
    "moluscos",
    "vegetariano",
    "vegano",
]


class Ingredient(Base, TimestampMixin, SoftDeleteMixin):
    """Ingredient entity with allergens information."""

    __tablename__ = "ingredients"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    allergens: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        nullable=False,
        default=list,
    )

    # Relationships
    products: Mapped[list["Product"]] = relationship(
        "Product",
        secondary="products_ingredients",
        back_populates="ingredients",
    )

    @classmethod
    def validate_allergens(cls, allergens: list[str]) -> bool:
        """Validate that all allergens are in the allowed list."""
        return all(a in ALLOWED_ALLERGENS for a in allergens)