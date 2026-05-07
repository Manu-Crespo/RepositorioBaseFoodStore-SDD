"""Pagination schemas for product-management change."""
from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Common pagination parameters."""

    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(20, ge=1, le=100, description="Items per page")

    @property
    def skip(self) -> int:
        """Calculate skip value."""
        return (self.page - 1) * self.limit


class SortParams(BaseModel):
    """Common sort parameters."""

    sort: str | None = Field(None, description="Sort field")
    order: str = Field("asc", pattern="^(asc|desc)$")

    @property
    def sort_column(self) -> str:
        """Map sort parameter to column name."""
        sort_mapping = {
            "price_asc": "price",
            "price_desc": "price",
            "name_asc": "name",
            "name_desc": "name",
            "newest": "created_at",
        }
        return sort_mapping.get(self.sort, "created_at")

    @property
    def is_descending(self) -> bool:
        """Check if sort is descending."""
        return self.order == "desc" or self.sort in ("price_desc", "name_desc")


class CatalogueFilters(BaseModel):
    """Filters for catalogue queries."""

    category_id: str | None = None
    include_children: bool = False
    exclude_allergens: list[str] = Field(default_factory=list)
    min_price: float | None = None
    max_price: float | None = None
    search: str | None = None
    in_stock_only: bool = True


class AdminProductFilters(BaseModel):
    """Filters for admin product queries."""

    category_id: str | None = None
    ingredient_id: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    search: str | None = None
    low_stock: bool | None = None


class CategoryFilters(BaseModel):
    """Filters for category queries."""

    format: str = Field("flat", pattern="^(flat|tree)$")
    parent_id: str | None = None


class IngredientFilters(BaseModel):
    """Filters for ingredient queries."""

    allergen: str | None = None
    include_deleted: bool = False