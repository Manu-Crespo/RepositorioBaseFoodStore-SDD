"""Public catalogue router for product-management change."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.product import ProductService
from app.services.category import CategoryService
from app.services.ingredient import IngredientService
from app.schemas.product import (
    CatalogueProductListResponse,
    ProductDetailResponse,
    RelatedProductsResponse,
)
from app.schemas.category import CategoryResponse, CategoryListResponse
from app.schemas.ingredient import AllergenListResponse
from app.schemas.pagination import PaginationParams

router = APIRouter(prefix="/catalogue", tags=["catalogue"])


@router.get("/products", response_model=CatalogueProductListResponse)
async def list_catalogue_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    category_id: str | None = None,
    include_children: bool = False,
    exclude_allergens: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    search: str | None = None,
    sort: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List products in the public catalogue."""
    service = ProductService(db)
    params = PaginationParams(page=page, limit=limit)

    # Parse exclude_allergens
    allergens_list = exclude_allergens.split(",") if exclude_allergens else []

    products, total = await service.get_catalogue(
        params,
        category_id=category_id,
        include_children=include_children,
        exclude_allergens=allergens_list,
        min_price=min_price,
        max_price=max_price,
        search=search,
        sort=sort,
    )

    total_pages = (total + limit - 1) // limit

    return CatalogueProductListResponse(
        data=products,
        pagination={
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
        },
    )


@router.get("/products/{product_id}", response_model=ProductDetailResponse)
async def get_catalogue_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a product detail in the catalogue."""
    service = ProductService(db)
    product = await service.get_catalogue_product(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


@router.get("/products/{product_id}/related", response_model=RelatedProductsResponse)
async def get_related_products(
    product_id: str,
    limit: int = Query(4, ge=1, le=10),
    db: AsyncSession = Depends(get_db),
):
    """Get related products."""
    service = ProductService(db)
    products = await service.get_related(product_id, limit)
    return RelatedProductsResponse(data=products)


@router.get("/categories", response_model=CategoryListResponse)
async def list_catalogue_categories(
    db: AsyncSession = Depends(get_db),
):
    """List categories for the catalogue."""
    service = CategoryService(db)
    categories = await service.get_all(format="flat")

    return CategoryListResponse(
        data=categories,
        total=len(categories),
        page=1,
        limit=len(categories),
    )


@router.get("/allergens", response_model=AllergenListResponse)
async def list_allergens(
    db: AsyncSession = Depends(get_db),
):
    """List available allergens."""
    from app.models.ingredient import ALLOWED_ALLERGENS
    return AllergenListResponse(allergens=list(ALLOWED_ALLERGENS))