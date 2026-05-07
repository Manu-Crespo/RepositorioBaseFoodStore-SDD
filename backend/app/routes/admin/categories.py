"""Admin categories router for product-management change."""
import logging
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.auth.rbac import require_stock_or_admin, require_admin_only
from app.services.category import CategoryService
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListResponse,
    CategoryTreeListResponse,
    CategoryReorderRequest,
    CategoryTree,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/categories", tags=["admin-categories"])


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    category_data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Create a new category."""
    logger.info(f"Creating category: {category_data.name}")
    service = CategoryService(db)
    try:
        return await service.create(category_data)
    except ValueError as e:
        logger.error(f"ValueError creating category: {e}")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("")
async def list_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
    format: str | None = None,
    parent_id: str | None = None,
) -> Union[CategoryListResponse, CategoryTreeListResponse]:
    """List all categories with optional format (flat/tree) and parent filter."""
    service = CategoryService(db)
    format_value = format or "flat"
    categories = await service.get_all(format=format_value, parent_id=parent_id)

    if format_value == "tree":
        return CategoryTreeListResponse(
            data=categories,
            total=len(categories),
            page=1,
            limit=20,
        )
    else:
        return CategoryListResponse(
            data=categories,
            total=len(categories),
            page=1,
            limit=20,
        )


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Get a specific category."""
    service = CategoryService(db)
    category = await service.get(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Update a category."""
    service = CategoryService(db)
    try:
        category = await service.update(category_id, category_data)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        return category
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin_only()),
):
    """Delete a category (soft delete)."""
    service = CategoryService(db)
    try:
        deleted = await service.delete(category_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.patch("/{category_id}/reorder", response_model=CategoryResponse)
async def reorder_category(
    category_id: str,
    reorder_data: CategoryReorderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Reorder a category."""
    service = CategoryService(db)
    category = await service.reorder(category_id, reorder_data.order)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category
