from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.category import Category
    from app.models.ingredient import Ingredient


class ProductCategory(Base):
    """Association table for products-categories (Many-to-Many)."""

    __tablename__ = "products_categories"

    product_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("products.id", ondelete="CASCADE"),
        primary_key=True,
    )
    category_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("categories.id", ondelete="CASCADE"),
        primary_key=True,
    )

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="product_categories")
    category: Mapped["Category"] = relationship("Category")


class ProductIngredient(Base):
    """Association table for products-ingredients (Many-to-Many)."""

    __tablename__ = "products_ingredients"

    product_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("products.id", ondelete="CASCADE"),
        primary_key=True,
    )
    ingredient_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("ingredients.id", ondelete="CASCADE"),
        primary_key=True,
    )
    is_allergen: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="product_ingredients")
    ingredient: Mapped["Ingredient"] = relationship("Ingredient")