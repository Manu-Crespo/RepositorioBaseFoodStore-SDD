"""Tests for CategoryRepository."""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.repositories.category import CategoryRepository


@pytest.mark.asyncio
async def test_create_category_root(db_session: AsyncSession):
    """Test creating a root category."""
    repo = CategoryRepository(db_session)

    category = await repo.create_with_path("Bebidas")

    assert category.id is not None
    assert category.name == "Bebidas"
    assert category.parent_id is None
    assert category.path == "/"


@pytest.mark.asyncio
async def test_create_category_child(db_session: AsyncSession):
    """Test creating a child category."""
    repo = CategoryRepository(db_session)

    # Create parent
    parent = await repo.create_with_path("Bebidas")
    await db_session.commit()

    # Create child
    child = await repo.create_with_path("Refrescos", parent.id)
    await db_session.commit()

    assert child.parent_id == parent.id
    assert child.path == f"/{parent.id}/"


@pytest.mark.asyncio
async def test_get_all_flat(db_session: AsyncSession):
    """Test getting all categories as flat list."""
    repo = CategoryRepository(db_session)

    cat1 = await repo.create_with_path("Category 1")
    cat2 = await repo.create_with_path("Category 2")

    await db_session.commit()

    categories = await repo.get_all_flat()

    assert len(categories) == 2


@pytest.mark.asyncio
async def test_get_children(db_session: AsyncSession):
    """Test getting direct children of a category."""
    repo = CategoryRepository(db_session)

    parent = await repo.create_with_path("Parent")
    child1 = await repo.create_with_path("Child 1", parent.id)
    child2 = await repo.create_with_path("Child 2", parent.id)

    await db_session.commit()

    children = await repo.get_children(parent.id)

    assert len(children) == 2


@pytest.mark.asyncio
async def test_move_category(db_session: AsyncSession):
    """Test moving a category to a new parent."""
    repo = CategoryRepository(db_session)

    cat1 = await repo.create_with_path("Category 1")
    cat2 = await repo.create_with_path("Category 2")

    await db_session.commit()

    # Move cat2 to be child of cat1
    moved = await repo.move(cat2.id, cat1.id)

    assert moved.parent_id == cat1.id
    assert moved.path == f"/{cat1.id}/"


@pytest.mark.asyncio
async def test_soft_delete(db_session: AsyncSession):
    """Test soft delete of a category."""
    repo = CategoryRepository(db_session)

    category = await repo.create_with_path("To Delete")
    await db_session.commit()

    await repo.delete(category.id)
    await db_session.commit()

    # Verify it's not in active list
    categories = await repo.get_all_flat()
    assert len(categories) == 0


@pytest.mark.asyncio
async def test_get_tree(db_session: AsyncSession):
    """Test getting categories as tree."""
    repo = CategoryRepository(db_session)

    root = await repo.create_with_path("Root")
    child = await repo.create_with_path("Child", root.id)

    await db_session.commit()

    tree = await repo.get_tree()

    assert len(tree) == 1
    assert tree[0].name == "Root"
    assert len(tree[0].children) == 1