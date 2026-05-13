"""Admin products router for product-management change."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.unit_of_work import UnitOfWork, get_unit_of_work
from app.models.user import User
from app.auth.rbac import require_stock_or_admin, require_admin_only
from app.services.product import ProductService
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ProductStockUpdate,
)
from app.schemas.pagination import PaginationParams, AdminProductFilters

router = APIRouter(prefix="/products", tags=["admin-products"])


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    product_data: ProductCreate,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Create a new product."""
    service = ProductService(uow.session)
    try:
        return await service.create(product_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.get("", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category_id: str | None = None,
    ingredient_id: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    search: str | None = None,
    low_stock: bool | None = None,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(require_stock_or_admin()),
):
    """List all products with filters."""
    service = ProductService(uow.session)
    params = PaginationParams(page=page, limit=limit)
    products, total = await service.get_all(
        params,
        category_id=category_id,
        ingredient_id=ingredient_id,
        min_price=min_price,
        max_price=max_price,
        search=search,
        low_stock=low_stock,
    )
    return ProductListResponse(
        data=products,
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Get a specific product."""
    service = ProductService(uow.session)
    product = await service.get(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Update a product."""
    service = ProductService(uow.session)
    product = await service.update(product_id, product_data)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


@router.patch("/{product_id}/stock", response_model=ProductResponse)
async def update_stock(
    product_id: str,
    stock_data: ProductStockUpdate,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(require_stock_or_admin()),
):
    """Update product stock."""
    service = ProductService(uow.session)
    try:
        product = await service.update_stock(
            product_id, stock_data.operation, stock_data.quantity
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    uow: UnitOfWork = Depends(get_unit_of_work),
    current_user: User = Depends(require_admin_only()),
):
    """Delete a product (soft delete)."""
    service = ProductService(uow.session)
    try:
        deleted = await service.delete(product_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))