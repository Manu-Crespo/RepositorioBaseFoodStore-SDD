"""Ingredient service with business logic."""
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ingredient import Ingredient, ALLOWED_ALLERGENS
from app.repositories.ingredient import IngredientRepository
from app.schemas.ingredient import (
    IngredientCreate,
    IngredientUpdate,
    IngredientResponse,
)
from app.schemas.pagination import PaginationParams


class IngredientService:
    """Service for ingredient business logic."""

    def __init__(self, session: AsyncSession):
        self._repo = IngredientRepository(session)

    async def create(self, data: IngredientCreate) -> IngredientResponse:
        """Create a new ingredient."""
        # Check for duplicate name
        if await self._repo.name_exists(data.name):
            raise ValueError("Ingredient with this name already exists")

        ingredient = await self._repo.create(data.model_dump())
        await self._repo.session.commit()
        await self._repo.session.refresh(ingredient)

        return self._to_response(ingredient)

    async def get(self, ingredient_id: str) -> IngredientResponse | None:
        """Get ingredient by ID."""
        ingredient = await self._repo.get(ingredient_id)
        if not ingredient:
            return None
        return self._to_response(ingredient)

    async def get_all(
        self, params: PaginationParams, allergen: str | None = None
    ) -> tuple[list[IngredientResponse], int]:
        """Get all ingredients with pagination and SQL filtering."""
        ingredients, total = await self._repo.get_filtered(
            allergen=allergen,
            skip=params.skip,
            limit=params.limit,
        )

        return [self._to_response(i) for i in ingredients], total

    async def update(
        self, ingredient_id: str, data: IngredientUpdate
    ) -> IngredientResponse | None:
        """Update an ingredient."""
        ingredient = await self._repo.get(ingredient_id)
        if not ingredient:
            return None

        # Check for duplicate name
        if data.name and data.name.lower() != ingredient.name.lower():
            if await self._repo.name_exists(data.name, exclude_id=ingredient_id):
                raise ValueError("Ingredient with this name already exists")

        update_data = data.model_dump(exclude_unset=True)
        ingredient = await self._repo.update(ingredient_id, update_data)
        await self._repo.session.commit()
        await self._repo.session.refresh(ingredient)

        return self._to_response(ingredient)

    async def delete(self, ingredient_id: str) -> bool:
        """Delete an ingredient (soft delete)."""
        ingredient = await self._repo.get(ingredient_id)
        if not ingredient:
            return False

        # Check for products
        if ingredient.products:
            raise ValueError("Cannot delete ingredient with associated products")

        await self._repo.delete(ingredient_id)
        await self._repo.session.commit()
        return True

    async def get_allergens(self) -> list[str]:
        """Get list of allowed allergens."""
        return ALLOWED_ALLERGENS

    def _to_response(self, ingredient: Ingredient) -> IngredientResponse:
        """Convert ingredient model to response schema."""
        return IngredientResponse(
            id=ingredient.id,
            name=ingredient.name,
            allergens=ingredient.allergens,
            created_at=ingredient.created_at,
            updated_at=ingredient.updated_at,
        )