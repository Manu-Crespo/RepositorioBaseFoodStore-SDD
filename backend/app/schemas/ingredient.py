"""Ingredient schemas for product-management change."""
from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.models.ingredient import ALLOWED_ALLERGENS


class IngredientCreate(BaseModel):
    """Schema for creating an ingredient."""

    name: str = Field(..., min_length=1, max_length=255)
    allergens: list[str] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()

    @field_validator("allergens")
    @classmethod
    def validate_allergens(cls, v: list[str]) -> list[str]:
        for allergen in v:
            if allergen not in ALLOWED_ALLERGENS:
                raise ValueError(
                    f"Invalid allergen '{allergen}'. Allowed: {ALLOWED_ALLERGENS}"
                )
        return v


class IngredientUpdate(BaseModel):
    """Schema for updating an ingredient."""

    name: str | None = Field(None, min_length=1, max_length=255)
    allergens: list[str] | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip() if v else v

    @field_validator("allergens")
    @classmethod
    def validate_allergens(cls, v: list[str] | None) -> list[str] | None:
        if v is not None:
            for allergen in v:
                if allergen not in ALLOWED_ALLERGENS:
                    raise ValueError(
                        f"Invalid allergen '{allergen}'. Allowed: {ALLOWED_ALLERGENS}"
                    )
        return v


class IngredientResponse(BaseModel):
    """Schema for ingredient response."""

    id: str
    name: str
    allergens: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IngredientListResponse(BaseModel):
    """Schema for paginated ingredient list."""

    data: list[IngredientResponse]
    total: int
    page: int
    limit: int


class AllergenListResponse(BaseModel):
    """Schema for list of available allergens."""

    allergens: list[str]