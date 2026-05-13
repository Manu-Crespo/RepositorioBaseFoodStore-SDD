"""Tests for customer profile endpoints."""
import pytest
import pytest_asyncio
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient
from jose import jwt

from app.models.user import User
from app.config import settings


# === GET /api/v1/auth/profile tests ===

@pytest.mark.asyncio
async def test_get_profile_success(client: AsyncClient, auth_headers: dict):
    """Test getting profile with valid token."""
    response = await client.get(
        "/api/v1/auth/profile",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"


@pytest.mark.asyncio
async def test_get_profile_unauthorized(client: AsyncClient):
    """Test getting profile without token."""
    response = await client.get("/api/v1/auth/profile")
    assert response.status_code == 401


# === PUT /api/v1/auth/profile tests ===

@pytest.mark.asyncio
async def test_update_profile_success(client: AsyncClient, auth_headers: dict):
    """Test updating profile with valid data."""
    response = await client.put(
        "/api/v1/auth/profile",
        headers=auth_headers,
        json={
            "first_name": "Admin",
            "last_name": "User",
            "phone": "+5491187654321"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Admin"
    assert data["last_name"] == "User"
    assert data["phone"] == "+5491187654321"


@pytest.mark.asyncio
async def test_update_profile_partial(client: AsyncClient, auth_headers: dict):
    """Test updating only some fields."""
    response = await client.put(
        "/api/v1/auth/profile",
        headers=auth_headers,
        json={"first_name": "NewName"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "NewName"


@pytest.mark.asyncio
async def test_update_profile_invalid_phone(client: AsyncClient, auth_headers: dict):
    """Test updating profile with invalid phone."""
    response = await client.put(
        "/api/v1/auth/profile",
        headers=auth_headers,
        json={"phone": "invalid"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_profile_unauthorized(client: AsyncClient):
    """Test updating profile without token."""
    response = await client.put(
        "/api/v1/auth/profile",
        json={"first_name": "Jane"}
    )
    assert response.status_code == 401


# === PUT /api/v1/auth/profile/password tests ===

@pytest.mark.asyncio
async def test_change_password_success(client: AsyncClient, auth_headers: dict, admin_user: User):
    """Test changing password with correct current password."""
    response = await client.put(
        "/api/v1/auth/profile/password",
        headers=auth_headers,
        json={
            "current_password": "admin123",
            "new_password": "newpass123"
        }
    )
    assert response.status_code == 200
    assert "Password changed successfully" in response.json()["message"]


@pytest.mark.asyncio
async def test_change_password_wrong_current(client: AsyncClient, auth_headers: dict):
    """Test changing password with wrong current password."""
    response = await client.put(
        "/api/v1/auth/profile/password",
        headers=auth_headers,
        json={
            "current_password": "wrongpassword",
            "new_password": "newpass123"
        }
    )
    assert response.status_code == 400
    assert "Current password is incorrect" in response.json()["detail"]["message"]


@pytest.mark.asyncio
async def test_change_password_same_as_current(client: AsyncClient, auth_headers: dict):
    """Test changing password to same as current."""
    response = await client.put(
        "/api/v1/auth/profile/password",
        headers=auth_headers,
        json={
            "current_password": "admin123",
            "new_password": "admin123"
        }
    )
    assert response.status_code == 400
    assert "different from current password" in response.json()["detail"]["message"]


@pytest.mark.asyncio
async def test_change_password_weak(client: AsyncClient, auth_headers: dict):
    """Test changing password with weak password."""
    response = await client.put(
        "/api/v1/auth/profile/password",
        headers=auth_headers,
        json={
            "current_password": "admin123",
            "new_password": "weak"
        }
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_change_password_unauthorized(client: AsyncClient):
    """Test changing password without token."""
    response = await client.put(
        "/api/v1/auth/profile/password",
        json={
            "current_password": "admin123",
            "new_password": "newpass123"
        }
    )
    assert response.status_code == 401