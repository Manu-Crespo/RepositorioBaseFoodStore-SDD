"""Tests for admin products endpoints."""
import pytest
from decimal import Decimal


@pytest.mark.asyncio
async def test_create_product_as_admin(client: AsyncClient, auth_headers: dict):
    """Test creating a product as admin."""
    response = await client.post(
        "/api/admin/products",
        json={
            "name": "Pizza Margarita",
            "description": "Delicious pizza",
            "price": "12.99",
            "stock": 50
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Pizza Margarita"
    assert data["price"] == "12.99"
    assert data["stock"] == 50


@pytest.mark.asyncio
async def test_create_product_as_stock(client: AsyncClient, stock_auth_headers: dict):
    """Test creating a product as stock user."""
    response = await client.post(
        "/api/admin/products",
        json={
            "name": "Test Product",
            "price": "10.00",
            "stock": 20
        },
        headers=stock_auth_headers
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_create_product_unauthorized(client: AsyncClient):
    """Test creating a product without auth."""
    response = await client.post(
        "/api/admin/products",
        json={
            "name": "Test Product",
            "price": "10.00",
            "stock": 10
        }
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_product_invalid_price(client: AsyncClient, auth_headers: dict):
    """Test creating product with invalid price."""
    response = await client.post(
        "/api/admin/products",
        json={
            "name": "Invalid Price Product",
            "price": "-10.00",
            "stock": 10
        },
        headers=auth_headers
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_products(client: AsyncClient, auth_headers: dict):
    """Test listing products."""
    # Create first
    await client.post(
        "/api/admin/products",
        json={"name": "Test Product", "price": "10.00", "stock": 10},
        headers=auth_headers
    )

    response = await client.get(
        "/api/admin/products",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) >= 1


@pytest.mark.asyncio
async def test_list_products_with_search(client: AsyncClient, auth_headers: dict):
    """Test listing products with search filter."""
    await client.post(
        "/api/admin/products",
        json={"name": "Pizza Margarita", "price": "12.00", "stock": 10},
        headers=auth_headers
    )
    await client.post(
        "/api/admin/products",
        json={"name": "Pasta Carbonara", "price": "15.00", "stock": 10},
        headers=auth_headers
    )

    response = await client.get(
        "/api/admin/products?search=pizza",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Pizza Margarita"


@pytest.mark.asyncio
async def test_list_products_with_price_range(client: AsyncClient, auth_headers: dict):
    """Test listing products with price range filter."""
    await client.post(
        "/api/admin/products",
        json={"name": "Cheap Product", "price": "5.00", "stock": 10},
        headers=auth_headers
    )
    await client.post(
        "/api/admin/products",
        json={"name": "Mid Product", "price": "15.00", "stock": 10},
        headers=auth_headers
    )
    await client.post(
        "/api/admin/products",
        json={"name": "Expensive Product", "price": "25.00", "stock": 10},
        headers=auth_headers
    )

    response = await client.get(
        "/api/admin/products?min_price=10&max_price=20",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Mid Product"


@pytest.mark.asyncio
async def test_list_products_with_pagination(client: AsyncClient, auth_headers: dict):
    """Test listing products with pagination."""
    # Create multiple products
    for i in range(15):
        await client.post(
            f"/api/admin/products",
            json={"name": f"Product {i}", "price": "10.00", "stock": 10},
            headers=auth_headers
        )

    response = await client.get(
        "/api/admin/products?page=1&limit=10",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 10
    assert data["pagination"]["total"] >= 15
    assert data["pagination"]["total_pages"] >= 2


@pytest.mark.asyncio
async def test_get_product(client: AsyncClient, auth_headers: dict):
    """Test getting a specific product."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "Test Product", "price": "10.00", "stock": 10},
        headers=auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.get(
        f"/api/admin/products/{product_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Product"


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient, auth_headers: dict):
    """Test getting non-existent product."""
    response = await client.get(
        "/api/admin/products/nonexistent-id",
        headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_product(client: AsyncClient, auth_headers: dict):
    """Test updating a product."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "Original", "price": "10.00", "stock": 10},
        headers=auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.put(
        f"/api/admin/products/{product_id}",
        json={"name": "Updated", "price": "15.00"},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"
    assert response.json()["price"] == "15.00"


@pytest.mark.asyncio
async def test_update_product_stock_add(client: AsyncClient, auth_headers: dict):
    """Test adding stock to a product."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "Test Product", "price": "10.00", "stock": 10},
        headers=auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/admin/products/{product_id}/stock",
        json={"operation": "add", "quantity": 5},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["stock"] == 15


@pytest.mark.asyncio
async def test_update_product_stock_remove(client: AsyncClient, auth_headers: dict):
    """Test removing stock from a product."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "Test Product", "price": "10.00", "stock": 10},
        headers=auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/admin/products/{product_id}/stock",
        json={"operation": "remove", "quantity": 3},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["stock"] == 7


@pytest.mark.asyncio
async def test_update_product_stock_insufficient(client: AsyncClient, auth_headers: dict):
    """Test removing more stock than available raises error."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "Test Product", "price": "10.00", "stock": 5},
        headers=auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/admin/products/{product_id}/stock",
        json={"operation": "remove", "quantity": 10},
        headers=auth_headers
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_delete_product_as_admin(client: AsyncClient, auth_headers: dict):
    """Test deleting a product as admin."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "To Delete", "price": "10.00", "stock": 10},
        headers=auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/admin/products/{product_id}",
        headers=auth_headers
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_product_as_stock_forbidden(client: AsyncClient, stock_auth_headers: dict):
    """Test stock user cannot delete product."""
    # Create first
    create_resp = await client.post(
        "/api/admin/products",
        json={"name": "To Delete", "price": "10.00", "stock": 10},
        headers=stock_auth_headers
    )
    product_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/admin/products/{product_id}",
        headers=stock_auth_headers
    )
    assert response.status_code == 403