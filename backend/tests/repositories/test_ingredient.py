"""Tests for IngredientRepository."""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ingredient import Ingredient
from app.repositories.ingredient import IngredientRepository


@pytest.mark.asyncio
async def test_create_ingredient(db_session: AsyncSession):
    """Test creating an ingredient."""
    repo = IngredientRepository(db_session)

    ingredient = await repo.create({
        "name": "Leche",
        "allergens": ["lacteos"]
    })

    assert ingredient.id is not None
    assert ingredient.name == "Leche"
    assert "lacteos" in ingredient.allergens


@pytest.mark.asyncio
async def test_get_by_name(db_session: AsyncSession):
    """Test getting ingredient by name."""
    repo = IngredientRepository(db_session)

    await repo.create({"name": "Leche", "allergens": ["lacteos"]})
    await db_session.commit()

    ingredient = await repo.get_by_name("Leche")

    assert ingredient is not None
    assert ingredient.name == "Leche"


@pytest.mark.asyncio
async def test_filter_by_allergen(db_session: AsyncSession):
    """Test filtering ingredients by allergen."""
    repo = IngredientRepository(db_session)

    await repo.create({"name": "Leche", "allergens": ["lacteos"]})
    await repo.create({"name": "Pan", "allergens": ["gluten"]})
    await db_session.commit()

    ingredients = await repo.filter_by_allergen("lacteos")

    assert len(ingredients) == 1
    assert ingredients[0].name == "Leche"


@pytest.mark.asyncio
async def test_exclude_allergens(db_session: AsyncSession):
    """Test excluding ingredients with certain allergens."""
    repo = IngredientRepository(db_session)

    await repo.create({"name": "Leche", "allergens": ["lacteos"]})
    await repo.create({"name": "Arroz", "allergens": []})
    await repo.create({"name": "Pan", "allergens": ["gluten"]})
    await db_session.commit()

    ingredients = await repo.exclude_allergens(["lacteos", "gluten"])

    assert len(ingredients) == 1
    assert ingredients[0].name == "Arroz"


@pytest.mark.asyncio
async def test_search(db_session: AsyncSession):
    """Test searching ingredients by name."""
    repo = IngredientRepository(db_session)

    await repo.create({"name": "Leche Entera", "allergens": []})
    await repo.create({"name": "Leche Descremada", "allergens": []})
    await repo.create({"name": "Agua", "allergens": []})
    await db_session.commit()

    results = await repo.search("leche")

    assert len(results) == 2


@pytest.mark.asyncio
async def test_name_exists(db_session: AsyncSession):
    """Test checking if ingredient name exists."""
    repo = IngredientRepository(db_session)

    await repo.create({"name": "Leche", "allergens": []})
    await db_session.commit()

    assert await repo.name_exists("Leche") is True
    assert await repo.name_exists("Agua") is False