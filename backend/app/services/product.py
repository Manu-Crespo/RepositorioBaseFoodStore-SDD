"""Product service with business logic."""
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    CatalogueProductResponse,
    ProductDetailResponse,
    RelatedProductsResponse,
    CategorySummary,
    IngredientSummary,
)
from app.schemas.pagination import PaginationParams


class ProductService:
    """Service for product business logic."""

    def __init__(self, session: AsyncSession):
        self._repo = ProductRepository(session)

    async def create(self, data: ProductCreate) -> ProductResponse:
        """Create a new product."""
        # Exclude relationship IDs - they're set separately
        product_data = data.model_dump(exclude={"category_ids", "ingredient_ids"})
        product = await self._repo.create(product_data)

        # Set categories
        if data.category_ids:
            await self._repo.set_categories(product.id, data.category_ids)

        # Set ingredients
        if data.ingredient_ids:
            await self._repo.set_ingredients(product.id, data.ingredient_ids)

        await self._repo.session.commit()
        product = await self._repo.get_with_relations(product.id)

        return await self._to_response(product)

    async def get(self, product_id: str) -> ProductResponse | None:
        """Get product by ID."""
        product = await self._repo.get_with_relations(product_id)
        if not product:
            return None
        return await self._to_response(product)

    async def get_all(
        self,
        params: PaginationParams,
        category_id: str | None = None,
        ingredient_id: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        search: str | None = None,
        low_stock: bool | None = None,
    ) -> tuple[list[ProductResponse], int]:
        """Get all products with filters applied in SQL."""
        min_dec = Decimal(str(min_price)) if min_price else None
        max_dec = Decimal(str(max_price)) if max_price else None

        products, total = await self._repo.get_admin_filtered(
            category_id=category_id,
            ingredient_id=ingredient_id,
            min_price=min_dec,
            max_price=max_dec,
            search=search,
            low_stock=bool(low_stock),
            skip=params.skip,
            limit=params.limit,
        )

        return [await self._to_response(p) for p in products], total

    async def update(
        self, product_id: str, data: ProductUpdate
    ) -> ProductResponse | None:
        """Update a product."""
        product = await self._repo.get(product_id)
        if not product:
            return None

        update_data = data.model_dump(exclude_unset=True, exclude={"category_ids", "ingredient_ids"})
        await self._repo.update(product_id, update_data)

        # Update categories
        if data.category_ids is not None:
            await self._repo.set_categories(product_id, data.category_ids)

        # Update ingredients
        if data.ingredient_ids is not None:
            await self._repo.set_ingredients(product_id, data.ingredient_ids)

        await self._repo.session.commit()
        product = await self._repo.get_with_relations(product_id)
        return await self._to_response(product)

    async def update_stock(
        self, product_id: str, operation: str, quantity: int
    ) -> ProductResponse | None:
        """Update product stock."""
        try:
            product = await self._repo.update_stock(product_id, quantity, operation)
            await self._repo.session.commit()
            if not product:
                return None
            
            # Reload with relations for the response
            product = await self._repo.get_with_relations(product_id)
            return await self._to_response(product)
        except ValueError as e:
            raise ValueError(str(e))

    async def delete(self, product_id: str) -> bool:
        """Delete a product (soft delete)."""
        product = await self._repo.get(product_id)
        if not product:
            return False

        if await self._repo.has_active_orders(product_id):
            raise ValueError("Cannot delete product with active orders")

        await self._repo.delete(product_id)
        await self._repo.session.commit()
        return True

    # Catalogue (public) methods
    async def get_catalogue(
        self,
        params: PaginationParams,
        category_id: str | None = None,
        include_children: bool = False,
        exclude_allergens: list[str] | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        search: str | None = None,
        sort: str | None = None,
    ) -> tuple[list[CatalogueProductResponse], int]:
        """Get products for public catalogue with filters applied in SQL."""
        min_dec = Decimal(str(min_price)) if min_price else None
        max_dec = Decimal(str(max_price)) if max_price else None

        products, total = await self._repo.get_catalogue_filtered(
            category_id=category_id,
            include_children=include_children,
            exclude_allergens=exclude_allergens,
            min_price=min_dec,
            max_price=max_dec,
            search=search,
            sort=sort,
            skip=params.skip,
            limit=params.limit,
        )

        return [await self._to_catalogue_response(p) for p in products], total

    async def get_catalogue_product(self, product_id: str) -> ProductDetailResponse | None:
        """Get single product for catalogue."""
        product = await self._repo.get_with_relations(product_id)
        if not product or product.deleted_at or product.stock <= 0:
            return None
        return await self._to_detail_response(product)

    async def get_related(
        self, product_id: str, limit: int = 4
    ) -> list[CatalogueProductResponse]:
        """Get related products (same category)."""
        product = await self._repo.get_with_relations(product_id)
        if not product or not product.categories:
            return []

        # Get products from same categories
        category_id = product.categories[0].id
        related = await self._repo.filter_by_category(category_id)

        # Exclude current product and limit
        related = [p for p in related if p.id != product_id][:limit]

        return [await self._to_catalogue_response(p) for p in related]

    async def _to_response(self, product: Product) -> ProductResponse:
        """Convert product to admin response."""
        # Assume relationships are already loaded via get_with_relations
        categories = [
            CategorySummary(id=c.id, name=c.name) for c in product.categories
        ]
        # Get allergens info from association table
        ingredients = []
        for pi in product.product_ingredients:
            ingredients.append(
                IngredientSummary(
                    id=pi.ingredient.id, 
                    name=pi.ingredient.name, 
                    is_allergen=pi.is_allergen
                )
            )

        return ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            categories=categories,
            ingredients=ingredients,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )

    async def _to_catalogue_response(self, product: Product) -> CatalogueProductResponse:
        """Convert product to catalogue response."""
        # Assume relationships are loaded via get_with_relations
        categories = [
            CategorySummary(id=c.id, name=c.name) for c in product.categories
        ]
        ingredients = []
        for pi in product.product_ingredients:
            ingredients.append(
                IngredientSummary(
                    id=pi.ingredient.id, 
                    name=pi.ingredient.name, 
                    is_allergen=pi.is_allergen
                )
            )

        return CatalogueProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            categories=categories,
            ingredients=ingredients,
            availability="in_stock" if product.stock > 0 else "out_of_stock",
            created_at=product.created_at,
        )

    async def _to_detail_response(self, product: Product) -> ProductDetailResponse:
        """Convert product to detail response."""
        # Assume relationships are loaded via get_with_relations
        categories = [
            CategorySummary(id=c.id, name=c.name) for c in product.categories
        ]
        ingredients = []
        for pi in product.product_ingredients:
            ingredients.append(
                IngredientSummary(
                    id=pi.ingredient.id, 
                    name=pi.ingredient.name, 
                    is_allergen=pi.is_allergen
                )
            )

        return ProductDetailResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            categories=categories,
            ingredients=ingredients,
            availability="in_stock" if product.stock > 0 else "out_of_stock",
            created_at=product.created_at,
        )