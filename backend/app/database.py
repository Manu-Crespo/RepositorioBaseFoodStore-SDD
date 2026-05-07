"""
Database configuration and session management.
"""
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    """SQLAlchemy declarative base."""

    pass


# Create async engine
engine: AsyncEngine | None = None

# Session factory
async_session_factory: async_sessionmaker[AsyncSession] | None = None


def get_database_url() -> str:
    """Get database URL from environment."""
    return settings.DATABASE_URL


def create_engine_and_session() -> tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    """Create engine and session factory."""
    global engine, async_session_factory

    database_url = get_database_url()
    if not database_url:
        raise ValueError("DATABASE_URL not configured")

    engine = create_async_engine(
        database_url,
        echo=settings.DEBUG,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
    )

    async_session_factory = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    return engine, async_session_factory


def get_engine() -> AsyncEngine:
    """Get the async engine."""
    global engine
    if engine is None:
        create_engine_and_session()
    return engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Get the async session factory."""
    global async_session_factory
    if async_session_factory is None:
        create_engine_and_session()
    return async_session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for database session."""
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database connection on startup."""
    engine = get_engine()
    async with engine.begin() as conn:
        # Test connection
        await conn.execute(text("SELECT 1"))


async def close_db() -> None:
    """Close database connection on shutdown."""
    global engine
    if engine:
        await engine.dispose()
        engine = None