"""Pytest configuration and fixtures for backend tests."""
import asyncio
import os
from typing import AsyncGenerator, Generator
from datetime import datetime, timezone, timedelta

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from httpx import AsyncClient, ASGITransport
from jose import jwt

from app.models.base import Base
from app.models.user import User, UserRole
from app.database import get_db
from app.main import app
from app.config import settings

# Test database URL
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://postgres:root@localhost:5432/foodstoreSDD"
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    engine = create_async_engine(
        TEST_DATABASE_URL, 
        echo=False,
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=0,
        connect_args={"timeout": 30}
    )

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session

    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create a test client."""

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def admin_user(db_session: AsyncSession) -> User:
    """Create an admin user."""
    from app.auth.service import hash_password

    user = User(
        id="admin-uuid-123",
        email="admin@test.com",
        password_hash=hash_password("admin123"),
        role=UserRole.ADMIN,
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def stock_user(db_session: AsyncSession) -> User:
    """Create a stock user."""
    from app.auth.service import hash_password

    user = User(
        id="stock-uuid-456",
        email="stock@test.com",
        password_hash=hash_password("stock123"),
        role=UserRole.STOCK,
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
def admin_token(admin_user: User) -> str:
    """Create a JWT token for admin user."""
    payload = {
        "sub": admin_user.id,
        "role": admin_user.role.value,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


@pytest.fixture
def stock_token(stock_user: User) -> str:
    """Create a JWT token for stock user."""
    payload = {
        "sub": stock_user.id,
        "role": stock_user.role.value,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


@pytest.fixture
def auth_headers(admin_token: str) -> dict:
    """Create authorization headers."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def stock_auth_headers(stock_token: str) -> dict:
    """Create authorization headers for stock user."""
    return {"Authorization": f"Bearer {stock_token}"}