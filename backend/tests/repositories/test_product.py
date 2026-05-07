"""Tests for ProductRepository."""
import pytest
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.models.category import Category
from app.models.ingredient import Ingredient
from app.repositories.product import ProductRepository


@pytest.mark.asyncio
async def test_create_product(db_session: AsyncSession):
    """Test creating a product."""
    repo = ProductRepository(db_session)

    product = await repo.create({
        "name": "Pizza Margarita",
        "description": "Delicious pizza",
        "price": Decimal("12.99"),
        "stock": 50
    })

    assert product.id is not None
    assert product.name == "Pizza Margarita"
    assert product.price == Decimal("12.99")


@pytest.mark.asyncio
async def test_search(db_session: AsyncSession):
    """Test searching products by name."""
    repo = ProductRepository(db_session)

    await repo.create({"name": "Pizza Margarita", "price": Decimal("12.99"), "stock": 10})
    await repo.create({"name": "Pizza Napolitana", "price": Decimal("14.99"), "stock": 10})
    await db_session.commit()

    results = await repo.search("pizza")

    assert len(results) == 2


@pytest.mark.asyncio
async def test_filter_by_category(db_session: AsyncSession):
    """Test filtering products by category."""
    product_repo = ProductRepository(db_session)
    category_repo = Category(db_session)

    # Create category
    category = await category_repo.create_with_path("Pizzas")

    # Create product and associate
    product = await product_repo.create({
        "name": "Pizza Margarita",
        "price": Decimal("12.99"),
        "stock": 10
    })
    product.categories.append(category)

    await db_session.commit()

    products = await product_repo.filter_by_category(category.id)

    assert len(products) == 1
    assert products[0].name == "Pizza Margarita"


@pytest.mark.asyncio
async def test_filter_by_price_range(db_session: AsyncSession):
    """Test filtering products by price range."""
    repo = ProductRepository(db_session)

    await repo.create({"name": "Cheap Product", "price": Decimal("5.00"), "stock": 10})
    await repo.create({"name": "Mid Product", "price": Decimal("15.00"), "stock": 10})
    await repo.create({"name": "Expensive Product", "price": Decimal("25.00"), "stock": 10})
    await db_session.commit()

    products = await repo.filter_by_price_range(
        min_price=Decimal("10.00"),
        max_price=Decimal("20.00")
    )

    assert len(products) == 1
    assert products[0].name == "Mid Product"


@pytest.mark.asyncio
async def test_update_stock_add(db_session: AsyncSession):
    """Test adding stock to a product."""
    repo = ProductRepository(db_session)

    product = await repo.create({
        "name": "Test Product",
        "price": Decimal("10.00"),
        "stock": 10
    })
    await db_session.commit()

    updated = await repo.update_stock(product.id, 5, "add")

    assert updated.stock == 15


@pytest.mark.asyncio
async def test_update_stock_remove(db_session: AsyncSession):
    """Test removing stock from a product."""
    repo = ProductRepository(db_session)

    product = await repo.create({
        "name": "Test Product",
        "price": Decimal("10.00"),
        "stock": 10
    })
    await db_session.commit()

    updated = await repo.update_stock(product.id, 3, "remove")

    assert updated.stock == 7


@pytest.mark.asyncio
async def test_update_stock_insufficient(db_session: AsyncSession):
    """Test removing more stock than available raises error."""
    repo = ProductRepository(db_session)

    product = await repo.create({
        "name": "Test Product",
        "price": Decimal("10.00"),
        "stock": 5
    })
    await db_session.commit()

    with pytest.raises(ValueError, match="Insufficient stock"):
        await repo.update_stock(product.id, 10, "remove")


@pytest.mark.asyncio
async def test_get_in_stock_only(db_session: AsyncSession):
    """Test getting only products with stock."""
    repo = ProductRepository(db_session)

    await repo.create({"name": "In Stock", "price": Decimal("10.00"), "stock": 5})
    await repo.create({"name": "Out of Stock", "price": Decimal("10.00"), "stock": 0})
    await db_session.commit()

    products = await repo.get_in_stock_only()

    assert len(products) == 1
    assert products[0].name == "In Stock"


@pytest.mark.asyncio
async def test_get_low_stock(db_session: AsyncSession):
    """Test getting products with low stock."""
    repo = ProductRepository(db_session)

    await repo.create({"name": "Low Stock", "price": Decimal("10.00"), "stock": 5})
    await repo.create({"name": "Normal Stock", "price": Decimal("10.00"), "stock": 20})
    await db_session.commit()

    products = await repo.get_low_stock(threshold=10)

    assert len(products) == 1
    assert products[0].name == "Low Stock"