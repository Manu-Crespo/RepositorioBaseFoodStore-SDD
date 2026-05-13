"""Ingredient repository with allergen filtering."""
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ingredient import Ingredient
from app.repositories.base import BaseRepository


class IngredientRepository(BaseRepository[Ingredient]):
    """Repository for Ingredient with allergen filtering."""

    def __init__(self, session: AsyncSession):
        super().__init__(Ingredient, session)

    async def get_with_products(self, id: str) -> Ingredient | None:
        """Get ingredient with its products loaded."""
        from sqlalchemy.orm import selectinload
        query = (
            select(Ingredient)
            .where(Ingredient.id == id)
            .options(selectinload(Ingredient.products))
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Ingredient | None:
        """Get ingredient by exact name (case-insensitive)."""
        query = select(Ingredient).where(
            Ingredient.name.ilike(name),
            Ingredient.deleted_at.is_(None) if hasattr(Ingredient, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_names(self, names: list[str]) -> list[Ingredient]:
        """Get ingredients by list of names."""
        query = select(Ingredient).where(
            or_(*[Ingredient.name.ilike(name) for name in names]),
            Ingredient.deleted_at.is_(None) if hasattr(Ingredient, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def filter_by_allergen(self, allergen: str) -> list[Ingredient]:
        """Filter ingredients that contain a specific allergen."""
        query = select(Ingredient).where(
            Ingredient.allergens.contains([allergen]),
            Ingredient.deleted_at.is_(None) if hasattr(Ingredient, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def filter_by_allergens(self, allergens: list[str]) -> list[Ingredient]:
        """Filter ingredients that contain ANY of the specified allergens."""
        query = select(Ingredient)
        if hasattr(Ingredient, "deleted_at"):
            query = query.where(Ingredient.deleted_at.is_(None))

        # PostgreSQL: check if array overlaps (ANY of the allergens)
        if allergens:
            query = query.where(Ingredient.allergens.overlaps(allergens))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def exclude_allergens(self, allergens: list[str]) -> list[Ingredient]:
        """Get ingredients that do NOT contain any of the specified allergens."""
        query = select(Ingredient)
        if hasattr(Ingredient, "deleted_at"):
            query = query.where(Ingredient.deleted_at.is_(None))

        # Exclude ingredients containing ANY of the allergens
        if allergens:
            query = query.where(~Ingredient.allergens.overlaps(allergens))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def get_by_ids(self, ids: list[str]) -> list[Ingredient]:
        """Get multiple ingredients by IDs."""
        query = select(Ingredient).where(Ingredient.id.in_(ids))
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def search(self, query: str, limit: int = 20) -> list[Ingredient]:
        """Search ingredients by name."""
        stmt = (
            select(Ingredient)
            .where(Ingredient.name.ilike(f"%{query}%"))
            .limit(limit)
        )
        if hasattr(Ingredient, "deleted_at"):
            stmt = stmt.where(Ingredient.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def name_exists(self, name: str, exclude_id: str | None = None) -> bool:
        """Check if ingredient name already exists."""
        query = select(Ingredient).where(Ingredient.name.ilike(name))
        if hasattr(Ingredient, "deleted_at"):
            query = query.where(Ingredient.deleted_at.is_(None))
        if exclude_id:
            query = query.where(Ingredient.id != exclude_id)

        result = await self._session.execute(query)
        return result.scalar_one_or_none() is not None

    async def get_filtered(
        self,
        allergen: str | None = None,
        search: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Ingredient], int]:
        """Get ingredients with filters applied in SQL with pagination."""
        base_conditions = []
        if hasattr(Ingredient, "deleted_at"):
            base_conditions.append(Ingredient.deleted_at.is_(None))

        query = select(Ingredient).where(*base_conditions)

        # Allergen filter
        if allergen:
            query = query.where(Ingredient.allergens.overlaps([allergen]))

        # Search filter
        if search:
            query = query.where(Ingredient.name.ilike(f"%{search}%"))

        # Get total count
        from sqlalchemy import func
        count_stmt = select(func.count()).select_from(query.subquery())
        count_result = await self._session.execute(count_stmt)
        total = count_result.scalar() or 0

        # Sort and paginate
        query = query.order_by(Ingredient.name.asc()).offset(skip).limit(limit)

        result = await self._session.execute(query)
        ingredients = list(result.scalars().all())

        return ingredients, total