"""
Generic BaseRepository with CRUD operations.
"""
from typing import Any, Generic, TypeVar, Sequence
from uuid import uuid4

from sqlalchemy import Select, delete, select, update, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeMeta

from app.models.base import Base, SoftDeleteMixin, TimestampMixin

# Generic type for model
ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic BaseRepository with CRUD operations."""

    def __init__(self, model: type[ModelType], session: AsyncSession):
        self._model = model
        self._session = session

    @property
    def session(self) -> AsyncSession:
        """Get the session."""
        return self._session

    def _base_query(self) -> Select:
        """Base query with soft delete filter."""
        query = select(self._model)
        # If model has deleted_at, filter out soft deleted
        if hasattr(self._model, "deleted_at"):
            query = query.where(self._model.deleted_at.is_(None))
        return query

    async def get(self, id: str) -> ModelType | None:
        """Get entity by ID."""
        query = self._base_query().where(self._model.id == id)
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> tuple[Sequence[ModelType], int]:
        """Get all entities with pagination."""
        # Get total count
        count_query = select(func.count()).select_from(self._model)
        if hasattr(self._model, "deleted_at"):
            count_query = count_query.where(self._model.deleted_at.is_(None))
        total_result = await self._session.execute(count_query)
        total = total_result.scalar()

        # Get paginated results
        query = self._base_query().offset(skip).limit(limit)
        result = await self._session.execute(query)
        items = result.scalars().all()

        return items, total

    async def create(
        self, data: dict[str, Any], current_user_id: str | None = None
    ) -> ModelType:
        """Create a new entity."""
        # Add default ID if not provided
        if "id" not in data and hasattr(self._model, "id"):
            data["id"] = str(uuid4())

        # Set audit fields
        if current_user_id:
            if hasattr(self._model, "created_by"):
                data["created_by"] = current_user_id
            if hasattr(self._model, "updated_by"):
                data["updated_by"] = current_user_id

        entity = self._model(**data)
        self._session.add(entity)
        await self._session.flush()
        await self._session.refresh(entity)
        return entity

    async def create_many(self, data_list: list[dict[str, Any]]) -> list[ModelType]:
        """Create multiple entities in bulk."""
        entities = []
        for data in data_list:
            if "id" not in data and hasattr(self._model, "id"):
                data["id"] = str(uuid4())
            entity = self._model(**data)
            entities.append(entity)

        self._session.add_all(entities)
        await self._session.flush()
        for entity in entities:
            await self._session.refresh(entity)
        return entities

    async def update(
        self, id: str, data: dict[str, Any], current_user_id: str | None = None
    ) -> ModelType | None:
        """Update an entity."""
        entity = await self.get(id)
        if entity is None:
            return None

        for key, value in data.items():
            if hasattr(entity, key):
                setattr(entity, key, value)

        # Set audit field
        if current_user_id and hasattr(entity, "updated_by"):
            entity.updated_by = current_user_id

        await self._session.flush()
        await self._session.refresh(entity)
        return entity

    async def delete(self, id: str, hard: bool = False) -> bool:
        """Delete an entity (soft by default)."""
        entity = await self.get(id)
        if entity is None:
            return False

        if hard:
            await self._session.delete(entity)
        else:
            # Soft delete
            if hasattr(entity, "deleted_at"):
                from datetime import datetime, timezone

                entity.deleted_at = datetime.now(timezone.utc)
                await self._session.flush()
            else:
                # If no soft delete, do hard delete
                await self._session.delete(entity)

        return True


# Type alias for repository
Repository = BaseRepository[ModelType]