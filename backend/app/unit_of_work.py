"""
Unit of Work pattern for atomic transactions.
"""
from typing import Any, AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.database import get_db


class UnitOfWork:
    """Unit of Work for managing database transactions."""

    def __init__(self, session: AsyncSession):
        self._session = session

    async def __aenter__(self) -> "UnitOfWork":
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is not None:
            await self.rollback()
        else:
            await self.commit()

    async def commit(self) -> None:
        """Commit the transaction."""
        await self._session.commit()

    async def rollback(self) -> None:
        """Rollback the transaction."""
        await self._session.rollback()

    @property
    def session(self) -> AsyncSession:
        """Get the session."""
        return self._session


async def get_unit_of_work(session: AsyncSession = Depends(get_db)) -> AsyncGenerator[UnitOfWork, None]:
    """FastAPI dependency for Unit of Work."""
    async with UnitOfWork(session) as uow:
        yield uow