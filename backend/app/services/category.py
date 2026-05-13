"""Category service with business logic."""
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.repositories.category import CategoryRepository
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryTree as CategoryTreeSchema,
)
from app.schemas.category import CategoryBreadcrumb


class CategoryService:
    """Service for category business logic."""

    def __init__(self, session: AsyncSession):
        self._repo = CategoryRepository(session)

    async def create(self, data: CategoryCreate) -> CategoryResponse:
        """Create a new category."""
        # Check for duplicate name at same level
        existing = await self._repo.get_all_flat(include_deleted=False)
        same_parent = [c for c in existing if c.parent_id == data.parent_id]
        if any(c.name.lower() == data.name.lower() for c in same_parent):
            raise ValueError("Category with this name already exists at this level")

        category = await self._repo.create_with_path(data.name, data.parent_id)
        if data.description:
            category.description = data.description
        if data.order:
            category.order = data.order

        await self._repo.session.commit()
        await self._repo.session.refresh(category)

        return await self._to_response(category)

    async def get(self, category_id: str) -> CategoryResponse | None:
        """Get category by ID."""
        category = await self._repo.get_with_children(category_id)
        if not category:
            return None
        return await self._to_response(category)

    async def get_tree(self) -> list[CategoryTreeSchema]:
        """Get all categories as tree."""
        flat = await self._repo.get_all_flat(include_deleted=False)
        return self._build_tree(flat)

    async def get_all(
        self, format: str = "flat", parent_id: str | None = None
    ) -> list[CategoryResponse] | list[CategoryTreeSchema]:
        """Get all categories."""
        if format == "tree":
            tree = await self.get_tree()
            return tree
        else:
            categories = await self._repo.get_all_flat(include_deleted=False)
            if parent_id is not None:
                categories = [c for c in categories if c.parent_id == parent_id]
            return [await self._to_response(c) for c in categories]

    async def update(
        self, category_id: str, data: CategoryUpdate
    ) -> CategoryResponse | None:
        """Update a category."""
        category = await self._repo.get(category_id)
        if not category:
            return None

        # Check for duplicate name at same level
        if data.name and data.name.lower() != category.name.lower():
            existing = await self._repo.get_all_flat(include_deleted=False)
            same_parent = [c for c in existing if c.parent_id == category.parent_id]
            if any(c.name.lower() == data.name.lower() for c in same_parent):
                raise ValueError("Category with this name already exists at this level")

        if data.name:
            category.name = data.name
        if data.description is not None:
            category.description = data.description
        if data.order is not None:
            category.order = data.order
        if data.parent_id is not None:
            await self._repo.move(category_id, data.parent_id)

        await self._repo.session.commit()
        await self._repo.session.refresh(category)

        return await self._to_response(category)

    async def delete(self, category_id: str) -> bool:
        """Delete a category (soft delete)."""
        category = await self._repo.get_with_products(category_id)
        if not category:
            return False

        # Check for products
        if category.products:
            raise ValueError("Cannot delete category with associated products")

        # Check for children
        if await self._repo.has_children(category_id):
            raise ValueError("Cannot delete category with subcategories")

        await self._repo.delete(category_id)
        await self._repo.session.commit()
        return True

    async def reorder(self, category_id: str, order: int) -> CategoryResponse | None:
        """Reorder a category."""
        category = await self._repo.get(category_id)
        if not category:
            return None

        category.order = order
        await self._repo.session.commit()
        await self._repo.session.refresh(category)

        return await self._to_response(category)

    async def _to_response(self, category: Category) -> CategoryResponse:
        """Convert category model to response schema."""
        # Get parent path for breadcrumbs - batch query to avoid N+1
        breadcrumbs = []
        if category.parent_id and category.path:
            path_str = category.path.strip("/")
            path_parts = path_str.split("/") if path_str else []
            if path_parts:
                # Fetch all ancestors in a single query
                parents = await self._repo.get_many(path_parts)
                breadcrumbs = [
                    CategoryBreadcrumb(id=p.id, name=p.name)
                    for p in parents
                    if p
                ]

        # Get children
        children = await self._repo.get_children(category.id)
        children_responses = []
        for child in children:
            children_responses.append(
                CategoryResponse(
                    id=child.id,
                    name=child.name,
                    description=child.description,
                    parent_id=child.parent_id,
                    path=child.path,
                    order=child.order,
                    depth=category.get_depth() + 1,
                    breadcrumbs=[],
                    children=[],
                    created_at=child.created_at,
                    updated_at=child.updated_at,
                )
            )

        return CategoryResponse(
            id=category.id,
            name=category.name,
            description=category.description,
            parent_id=category.parent_id,
            path=category.path,
            order=category.order,
            depth=category.get_depth(),
            breadcrumbs=breadcrumbs,
            children=children_responses,
            created_at=category.created_at,
            updated_at=category.updated_at,
        )

    def _build_tree(
        self, flat_categories: list[Category]
    ) -> list[CategoryTreeSchema]:
        """Build tree structure from flat list."""
        category_map = {c.id: c for c in flat_categories}
        roots = []

        for category in flat_categories:
            if category.parent_id is None:
                roots.append(category)

        def build_node(category: Category) -> CategoryTreeSchema:
            children = [
                build_node(c)
                for c in flat_categories
                if c.parent_id == category.id
            ]
            return CategoryTreeSchema(
                id=category.id,
                name=category.name,
                parent_id=category.parent_id,
                order=category.order,
                children=children,
            )

        return [build_node(root) for root in roots]