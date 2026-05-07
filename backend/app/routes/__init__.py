"""Routes package."""
from app.routes.auth import router as auth_router
from app.routes.health import router as health_router
from app.routes.admin.categories import router as admin_categories_router
from app.routes.admin.ingredients import router as admin_ingredients_router
from app.routes.admin.products import router as admin_products_router
from app.routes.catalogue import router as catalogue_router

__all__ = [
    "health_router",
    "auth_router",
    "admin_categories_router",
    "admin_ingredients_router",
    "admin_products_router",
    "catalogue_router",
]