"""Tests for public catalogue endpoints."""
import pytest
from httpx import AsyncClient

from app.models.category import Category
from app.models.product import Product
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_list_catalogue_products_empty(client: AsyncClient):
    """Test listing catalogue products when empty."""
    response = await client.get("/api/catalogue/products")
    assert response.status_code == 200
    data = response.json()
    assert data["data"] == []


@pytest.mark.asyncio
async def test_list_catalogue_products_with_products(client: AsyncClient, db_session: AsyncSession):
    """Test listing catalogue products with some products."""
    # Create a product
    product = Product(
        id="prod-123",
        name="Test Product",
        price=10.99,
        stock=5
    )
    db_session.add(product)
    await db_session.commit()

    response = await client.get("/api/catalogue/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) >= 1
    assert data["data"][0]["name"] == "Test Product"


@pytest.mark.asyncio
async def test_catalogue_excludes_out_of_stock(client: AsyncClient, db_session: AsyncSession):
    """Test catalogue excludes products without stock."""
    # Create product with stock
    in_stock = Product(id="in-stock", name="In Stock", price=10.00, stock=5)
    # Create product without stock
    out_of_stock = Product(id="out-stock", name="Out of Stock", price=20.00, stock=0)

    db_session.add(in_stock)
    db_session.add(out_of_stock)
    await db_session.commit()

    response = await client.get("/api/catalogue/products")
    data = response.json()

    product_names = [p["name"] for p in data["data"]]
    assert "In Stock" in product_names
    assert "Out of Stock" not in product_names


@pytest.mark.asyncio
async def test_catalogue_pagination(client: AsyncClient, db_session: AsyncSession):
    """Test catalogue pagination."""
    # Create multiple products
    for i in range(15):
        product = Product(
            id=f"prod-{i}",
            name=f"Product {i}",
            price=10.00,
            stock=5
        )
        db_session.add(product)
    await db_session.commit()

    response = await client.get("/api/catalogue/products?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()

    assert len(data["data"]) == 10
    assert data["pagination"]["total"] == 15
    assert data["pagination"]["total_pages"] == 2


@pytest.mark.asyncio
async def test_catalogue_search(client: AsyncClient, db_session: AsyncSession):
    """Test catalogue search."""
    product = Product(id="pizza-1", name="Pizza Margarita", price=12.00, stock=5)
    product2 = Product(id="pasta-1", name="Pasta Carbonara", price=15.00, stock=5)

    db_session.add(product)
    db_session.add(product2)
    await db_session.commit()

    response = await client.get("/api/catalogue/products?search=pizza")
    data = response.json()

    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Pizza Margarita"


@pytest.mark.asyncio
async def test_catalogue_sort_price_asc(client: AsyncClient, db_session: AsyncSession):
    """Test catalogue sorting by price ascending."""
    p1 = Product(id="p1", name="Cheap", price=5.00, stock=5)
    p2 = Product(id="p2", name="Expensive", price=20.00, stock=5)

    db_session.add(p1)
    db_session.add(p2)
    await db_session.commit()

    response = await client.get("/api/catalogue/products?sort=price_asc")
    data = response.json()

    assert data["data"][0]["price"] == "5.00"
    assert data["data"][1]["price"] == "20.00"


@pytest.mark.asyncio
async def test_get_product_detail(client: AsyncClient, db_session: AsyncSession):
    """Test getting product detail."""
    product = Product(
        id="detail-prod",
        name="Test Product",
        description="Test description",
        price=15.99,
        stock=10
    )
    db_session.add(product)
    await db_session.commit()

    response = await client.get("/api/catalogue/products/detail-prod")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["availability"] == "in_stock"


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    """Test getting non-existent product."""
    response = await client.get("/api/catalogue/products/nonexistent")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_allergens(client: AsyncClient):
    """Test listing available allergens."""
    response = await client.get("/api/catalogue/allergens")
    assert response.status_code == 200
    data = response.json()
    assert "allergens" in data
    assert "gluten" in data["allergens"]
    assert "lacteos" in data["allergens"]