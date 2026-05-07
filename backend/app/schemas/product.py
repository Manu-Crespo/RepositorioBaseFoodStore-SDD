"""Product schemas for product-management change."""
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator, computed_field

from app.schemas.category import CategoryResponse
from app.schemas.ingredient import IngredientResponse


class ProductCreate(BaseModel):
    """Schema for creating a product."""

    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    price: Decimal = Field(..., gt=0, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    category_ids: list[str] = Field(default_factory=list)
    ingredient_ids: list[str] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()

    @field_validator("stock")
    @classmethod
    def validate_stock(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock cannot be negative")
        return v


class ProductUpdate(BaseModel):
    """Schema for updating a product."""

    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    price: Decimal | None = Field(None, gt=0, decimal_places=2)
    stock: int | None = Field(None, ge=0)
    category_ids: list[str] | None = None
    ingredient_ids: list[str] | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip() if v else v


class ProductStockUpdate(BaseModel):
    """Schema for updating product stock."""

    operation: str = Field(..., pattern="^(add|remove)$")
    quantity: int = Field(..., gt=0)


class CategorySummary(BaseModel):
    """Summary of category for product response."""

    id: str
    name: str

    model_config = {"from_attributes": True}


class IngredientSummary(BaseModel):
    """Summary of ingredient for product response."""

    id: str
    name: str
    is_allergen: bool = False

    model_config = {"from_attributes": True}


class ProductResponse(BaseModel):
    """Schema for product response."""

    id: str
    name: str
    description: str | None
    price: float
    stock: int
    categories: list[CategorySummary]
    ingredients: list[IngredientSummary]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @computed_field
    @property
    def availability(self) -> str:
        """Get availability status."""
        return "in_stock" if self.stock > 0 else "out_of_stock"


class ProductListResponse(BaseModel):
    """Schema for paginated product list."""

    data: list[ProductResponse]
    total: int
    page: int
    limit: int


# Catalogue-specific schemas (public)
class CatalogueProductResponse(BaseModel):
    """Schema for product in catalogue (public)."""

    id: str
    name: str
    description: str | None
    price: float
    stock: int
    categories: list[CategorySummary]
    ingredients: list[IngredientSummary]
    availability: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CatalogueProductListResponse(BaseModel):
    """Schema for paginated catalogue product list."""

    data: list[CatalogueProductResponse]
    pagination: dict[str, int]


class ProductDetailResponse(BaseModel):
    """Schema for product detail in catalogue."""

    id: str
    name: str
    description: str | None
    price: float
    stock: int
    categories: list[CategorySummary]
    ingredients: list[IngredientSummary]
    availability: str
    created_at: datetime

    model_config = {"from_attributes": True}


class RelatedProductsResponse(BaseModel):
    """Schema for related products."""

    data: list[CatalogueProductResponse]