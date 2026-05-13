"""Category repository with hierarchical support."""
from typing import Sequence
from uuid import uuid4

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.category import Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    """Repository for Category with hierarchical operations."""

    def __init__(self, session: AsyncSession):
        super().__init__(Category, session)

    async def get_with_children(self, id: str) -> Category | None:
        """Get category with its children loaded."""
        query = (
            select(Category)
            .where(Category.id == id)
            .options(selectinload(Category.children))
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_with_products(self, id: str) -> Category | None:
        """Get category with its products loaded."""
        query = (
            select(Category)
            .where(Category.id == id)
            .options(selectinload(Category.products))
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_tree(self, parent_id: str | None = None) -> list[Category]:
        """Get categories in tree structure."""
        query = select(Category).order_by(Category.order, Category.name)
        if parent_id is None:
            query = query.where(Category.parent_id.is_(None))
        else:
            query = query.where(Category.parent_id == parent_id)

        # Include soft delete check from base
        if hasattr(Category, "deleted_at"):
            query = query.where(Category.deleted_at.is_(None))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def get_all_flat(self, include_deleted: bool = False) -> list[Category]:
        """Get all categories as flat list with depth."""
        query = select(Category).order_by(Category.path, Category.order)
        if not include_deleted and hasattr(Category, "deleted_at"):
            query = query.where(Category.deleted_at.is_(None))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def get_children(self, parent_id: str) -> list[Category]:
        """Get direct children of a category."""
        query = (
            select(Category)
            .where(Category.parent_id == parent_id)
            .order_by(Category.order, Category.name)
        )
        if hasattr(Category, "deleted_at"):
            query = query.where(Category.deleted_at.is_(None))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def get_descendants(self, category_id: str) -> list[Category]:
        """Get all descendants of a category using materialized path."""
        category = await self.get(category_id)
        if not category:
            return []

        query = select(Category).where(
            Category.path.like(f"{category.path}{category.id}/%"),
            Category.deleted_at.is_(None) if hasattr(Category, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def has_children(self, category_id: str) -> bool:
        """Check if category has children."""
        query = select(Category).where(
            Category.parent_id == category_id,
            Category.deleted_at.is_(None) if hasattr(Category, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none() is not None

    async def move(self, category_id: str, new_parent_id: str | None) -> Category | None:
        """Move category to a new parent, updating path."""
        category = await self.get(category_id)
        if not category:
            return None

        # Validate: cannot move to itself
        if new_parent_id == category_id:
            raise ValueError("Category cannot be its own parent")

        # Validate: cannot move to a descendant
        if new_parent_id:
            descendants = await self.get_descendants(new_parent_id)
            if any(d.id == category_id for d in descendants):
                raise ValueError("Cannot move to a descendant category")

        # Update parent
        category.parent_id = new_parent_id

        # Update path
        if new_parent_id:
            parent = await self.get(new_parent_id)
            if parent:
                category.path = f"{parent.path}{parent.id}/"
        else:
            category.path = "/"

        await self._session.flush()
        await self._session.refresh(category)
        return category

    async def create_with_path(self, name: str, parent_id: str | None = None) -> Category:
        """Create category and automatically set path."""
        data = {
            "name": name,
            "parent_id": parent_id,
            "path": "/",
        }

        if parent_id:
            parent = await self.get(parent_id)
            if parent:
                data["path"] = f"{parent.path}{parent.id}/"

        return await self.create(data)

    async def search(self, query: str, limit: int = 20) -> list[Category]:
        """Search categories by name."""
        stmt = (
            select(Category)
            .where(Category.name.ilike(f"%{query}%"))
            .limit(limit)
        )
        if hasattr(Category, "deleted_at"):
            stmt = stmt.where(Category.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_many(self, ids: list[str]) -> list[Category]:
        """Get multiple categories by their IDs in a single query."""
        stmt = select(Category).where(Category.id.in_(ids))
        if hasattr(Category, "deleted_at"):
            stmt = stmt.where(Category.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return list(result.scalars().all())