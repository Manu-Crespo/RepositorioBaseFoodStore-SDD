"""Category schemas for product-management change."""
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class CategoryCreate(BaseModel):
    """Schema for creating a category."""

    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    parent_id: str | None = None
    order: int = 0

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""

    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    parent_id: str | None = None
    order: int | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip() if v else v


class CategoryBreadcrumb(BaseModel):
    """Schema for category breadcrumb."""

    id: str
    name: str


class CategoryResponse(BaseModel):
    """Schema for category response."""

    id: str
    name: str
    description: str | None
    parent_id: str | None
    path: str
    order: int
    depth: int = 0
    breadcrumbs: list[CategoryBreadcrumb] = []
    children: list["CategoryResponse"] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CategoryTree(BaseModel):
    """Schema for category tree node."""

    id: str
    name: str
    parent_id: str | None
    order: int
    children: list["CategoryTree"] = []

    model_config = {"from_attributes": True}


# Enable forward references
CategoryResponse.model_rebuild()
CategoryTree.model_rebuild()


class CategoryListResponse(BaseModel):
    """Schema for paginated flat category list."""

    data: list[CategoryResponse]
    total: int
    page: int
    limit: int


class CategoryTreeListResponse(BaseModel):
    """Schema for paginated tree category list."""

    data: list[CategoryTree]
    total: int
    page: int
    limit: int


class CategoryReorderRequest(BaseModel):
    """Schema for reordering a category."""

    order: int = Field(..., ge=0)