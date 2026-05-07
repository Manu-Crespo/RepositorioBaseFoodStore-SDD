"""Main FastAPI application entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import close_db, init_db
from app.errors.handlers import register_exception_handlers
from app.logging import setup_logging
from app.rate_limit import limiter
from app.routes import (
    health_router,
    auth_router,
    admin_categories_router,
    admin_ingredients_router,
    admin_products_router,
    catalogue_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    setup_logging()
    await init_db()
    yield
    # Shutdown
    await close_db()


def create_app() -> FastAPI:
    """Application factory."""
    app = FastAPI(
        title="Food Store API",
        description="Backend API for Food Store E-Commerce",
        version="0.1.0",
        lifespan=lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes
    app.include_router(auth_router, prefix="/api/v1", tags=["authentication"])
    app.include_router(health_router, tags=["Health"])

    # Admin routes (require STOCK or ADMIN role)
    app.include_router(admin_categories_router, prefix="/api/admin")
    app.include_router(admin_ingredients_router, prefix="/api/admin")
    app.include_router(admin_products_router, prefix="/api/admin")

    # Public catalogue routes (no auth required)
    app.include_router(catalogue_router, prefix="/api")

    # Register exception handlers
    register_exception_handlers(app)

    return app


app = create_app()