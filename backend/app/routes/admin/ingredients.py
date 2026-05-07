"""Admin ingredients router for product-management change."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.auth.rbac import require_stock_or_admin, require_admin_only
from app.services.ingredient import IngredientService
from app.schemas.ingredient import (
    IngredientCreate,
    IngredientUpdate,
    IngredientResponse,
    IngredientListResponse,
)
from app.schemas.pagination import PaginationParams

router = APIRouter(prefix="/ingredients", tags=["admin-ingredients"])


@router.post(
    "",
    response_model=IngredientResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_ingredient(
    ingredient_data: IngredientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Create a new ingredient."""
    service = IngredientService(db)
    try:
        return await service.create(ingredient_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("", response_model=IngredientListResponse)
async def list_ingredients(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    allergen: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """List all ingredients with pagination."""
    service = IngredientService(db)
    params = PaginationParams(page=page, limit=limit)
    ingredients, total = await service.get_all(params, allergen)
    return IngredientListResponse(
        data=ingredients,
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{ingredient_id}", response_model=IngredientResponse)
async def get_ingredient(
    ingredient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Get a specific ingredient."""
    service = IngredientService(db)
    ingredient = await service.get(ingredient_id)
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    return ingredient


@router.put("/{ingredient_id}", response_model=IngredientResponse)
async def update_ingredient(
    ingredient_id: str,
    ingredient_data: IngredientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Update an ingredient."""
    service = IngredientService(db)
    try:
        ingredient = await service.update(ingredient_id, ingredient_data)
        if not ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ingredient not found",
            )
        return ingredient
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ingredient(
    ingredient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin_only()),
):
    """Delete an ingredient (soft delete)."""
    service = IngredientService(db)
    try:
        deleted = await service.delete(ingredient_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ingredient not found",
            )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))