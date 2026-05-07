"""Tests for admin categories endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_category_as_admin(client: AsyncClient, auth_headers: dict):
    """Test creating a category as admin."""
    response = await client.post(
        "/api/admin/categories",
        json={"name": "Bebidas", "description": "Bebidas frías"},
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Bebidas"


@pytest.mark.asyncio
async def test_create_category_as_stock(client: AsyncClient, stock_auth_headers: dict):
    """Test creating a category as stock user."""
    response = await client.post(
        "/api/admin/categories",
        json={"name": "Comida"},
        headers=stock_auth_headers
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_create_category_unauthorized(client: AsyncClient):
    """Test creating a category without auth."""
    response = await client.post(
        "/api/admin/categories",
        json={"name": "Test"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_categories(client: AsyncClient, auth_headers: dict):
    """Test listing categories."""
    # Create first
    await client.post(
        "/api/admin/categories",
        json={"name": "Bebidas"},
        headers=auth_headers
    )

    response = await client.get(
        "/api/admin/categories",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) >= 1


@pytest.mark.asyncio
async def test_get_category(client: AsyncClient, auth_headers: dict):
    """Test getting a specific category."""
    # Create first
    create_resp = await client.post(
        "/api/admin/categories",
        json={"name": "Test Category"},
        headers=auth_headers
    )
    category_id = create_resp.json()["id"]

    response = await client.get(
        f"/api/admin/categories/{category_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Category"


@pytest.mark.asyncio
async def test_update_category(client: AsyncClient, auth_headers: dict):
    """Test updating a category."""
    # Create first
    create_resp = await client.post(
        "/api/admin/categories",
        json={"name": "Original"},
        headers=auth_headers
    )
    category_id = create_resp.json()["id"]

    response = await client.put(
        f"/api/admin/categories/{category_id}",
        json={"name": "Updated"},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"


@pytest.mark.asyncio
async def test_delete_category_as_admin(client: AsyncClient, auth_headers: dict):
    """Test deleting a category as admin."""
    # Create first
    create_resp = await client.post(
        "/api/admin/categories",
        json={"name": "To Delete"},
        headers=auth_headers
    )
    category_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/admin/categories/{category_id}",
        headers=auth_headers
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_category_as_stock_forbidden(client: AsyncClient, stock_auth_headers: dict):
    """Test stock user cannot delete category."""
    # Create first
    create_resp = await client.post(
        "/api/admin/categories",
        json={"name": "To Delete"},
        headers=stock_auth_headers
    )
    category_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/admin/categories/{category_id}",
        headers=stock_auth_headers
    )
    assert response.status_code == 403