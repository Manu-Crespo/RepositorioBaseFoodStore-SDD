"""Product model with category and ingredient associations."""
import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import String, Text, Numeric, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.ingredient import Ingredient
    from app.models.associations import ProductCategory, ProductIngredient


class Product(Base, TimestampMixin, SoftDeleteMixin):
    """Product entity with many-to-many relationships to categories and ingredients."""

    __tablename__ = "products"

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
    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    stock: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    # Relationships
    categories: Mapped[list["Category"]] = relationship(
        "Category",
        secondary="products_categories",
        back_populates="products",
    )
    ingredients: Mapped[list["Ingredient"]] = relationship(
        "Ingredient",
        secondary="products_ingredients",
        back_populates="products",
    )

    # Association relationships (for extra fields)
    product_categories: Mapped[list["ProductCategory"]] = relationship(
        "ProductCategory", back_populates="product", viewonly=True
    )
    product_ingredients: Mapped[list["ProductIngredient"]] = relationship(
        "ProductIngredient", back_populates="product", viewonly=True
    )

    @property
    def is_in_stock(self) -> bool:
        """Check if product is in stock."""
        return self.stock > 0

    @property
    def availability(self) -> str:
        """Get availability status."""
        return "in_stock" if self.is_in_stock else "out_of_stock"


