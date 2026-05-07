"""Tests for admin ingredients endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_ingredient_as_admin(client: AsyncClient, auth_headers: dict):
    """Test creating an ingredient as admin."""
    response = await client.post(
        "/api/admin/ingredients",
        json={"name": "Leche", "allergens": ["lacteos"]},
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Leche"
    assert "lacteos" in data["allergens"]


@pytest.mark.asyncio
async def test_create_ingredient_as_stock(client: AsyncClient, stock_auth_headers: dict):
    """Test creating an ingredient as stock user."""
    response = await client.post(
        "/api/admin/ingredients",
        json={"name": "Harina", "allergens": ["gluten"]},
        headers=stock_auth_headers
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_create_ingredient_unauthorized(client: AsyncClient):
    """Test creating an ingredient without auth."""
    response = await client.post(
        "/api/admin/ingredients",
        json={"name": "Test Ingredient"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_ingredients(client: AsyncClient, auth_headers: dict):
    """Test listing ingredients."""
    # Create first
    await client.post(
        "/api/admin/ingredients",
        json={"name": "Leche", "allergens": ["lacteos"]},
        headers=auth_headers
    )

    response = await client.get(
        "/api/admin/ingredients",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) >= 1


@pytest.mark.asyncio
async def test_list_ingredients_with_allergen_filter(client: AsyncClient, auth_headers: dict):
    """Test listing ingredients with allergen filter."""
    # Create ingredients
    await client.post(
        "/api/admin/ingredients",
        json={"name": "Leche", "allergens": ["lacteos"]},
        headers=auth_headers
    )
    await client.post(
        "/api/admin/ingredients",
        json={"name": "Pan", "allergens": ["gluten"]},
        headers=auth_headers
    )

    response = await client.get(
        "/api/admin/ingredients?allergen=lacteos",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Leche"


@pytest.mark.asyncio
async def test_get_ingredient(client: AsyncClient, auth_headers: dict):
    """Test getting a specific ingredient."""
    # Create first
    create_resp = await client.post(
        "/api/admin/ingredients",
        json={"name": "Test Ingredient"},
        headers=auth_headers
    )
    ingredient_id = create_resp.json()["id"]

    response = await client.get(
        f"/api/admin/ingredients/{ingredient_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Ingredient"


@pytest.mark.asyncio
async def test_get_ingredient_not_found(client: AsyncClient, auth_headers: dict):
    """Test getting non-existent ingredient."""
    response = await client.get(
        "/api/admin/ingredients/nonexistent-id",
        headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_ingredient(client: AsyncClient, auth_headers: dict):
    """Test updating an ingredient."""
    # Create first
    create_resp = await client.post(
        "/api/admin/ingredients",
        json={"name": "Original"},
        headers=auth_headers
    )
    ingredient_id = create_resp.json()["id"]

    response = await client.put(
        f"/api/admin/ingredients/{ingredient_id}",
        json={"name": "Updated", "allergens": ["frutos_secos"]},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"


@pytest.mark.asyncio
async def test_delete_ingredient_as_admin(client: AsyncClient, auth_headers: dict):
    """Test deleting an ingredient as admin."""
    # Create first
    create_resp = await client.post(
        "/api/admin/ingredients",
        json={"name": "To Delete"},
        headers=auth_headers
    )
    ingredient_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/admin/ingredients/{ingredient_id}",
        headers=auth_headers
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_ingredient_as_stock_forbidden(client: AsyncClient, stock_auth_headers: dict):
    """Test stock user cannot delete ingredient."""
    # Create first
    create_resp = await client.post(
        "/api/admin/ingredients",
        json={"name": "To Delete"},
        headers=stock_auth_headers
    )
    ingredient_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/admin/ingredients/{ingredient_id}",
        headers=stock_auth_headers
    )
    assert response.status_code == 403