"""Product repository with advanced filtering and search."""
from typing import Sequence
from decimal import Decimal

from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.product import Product
from app.models.associations import ProductCategory, ProductIngredient
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    """Repository for Product with advanced filtering."""

    def __init__(self, session: AsyncSession):
        super().__init__(Product, session)

    async def get_with_relations(self, id: str) -> Product | None:
        """Get product with categories and ingredients loaded."""
        query = (
            select(Product)
            .where(Product.id == id)
            .options(
                selectinload(Product.categories),
                selectinload(Product.ingredients),
                selectinload(Product.product_ingredients).selectinload(ProductIngredient.ingredient),
            )
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def filter_by_category(
        self, category_id: str, include_children: bool = False
    ) -> list[Product]:
        """Filter products by category."""
        if include_children:
            # Get all descendant category IDs
            from app.models.category import Category

            # Get category and its descendants
            category_query = select(Category).where(
                Category.id == category_id,
                Category.deleted_at.is_(None) if hasattr(Category, "deleted_at") else True,
            )
            category_result = await self._session.execute(category_query)
            category = category_result.scalar_one_or_none()

            if not category:
                return []

            # Get all descendant IDs
            descendant_query = select(Category).where(
                Category.path.like(f"{category.path}{category.id}/%"),
                Category.deleted_at.is_(None) if hasattr(Category, "deleted_at") else True,
            )
            descendant_result = await self._session.execute(descendant_query)
            descendants = list(descendant_result.scalars().all())

            category_ids = [category_id] + [d.id for d in descendants]
        else:
            category_ids = [category_id]

        # Get products in these categories
        query = (
            select(Product)
            .join(ProductCategory)
            .where(ProductCategory.category_id.in_(category_ids))
        )
        if hasattr(Product, "deleted_at"):
            query = query.where(Product.deleted_at.is_(None))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def filter_by_ingredient(self, ingredient_id: str) -> list[Product]:
        """Filter products that contain a specific ingredient."""
        query = (
            select(Product)
            .join(ProductIngredient)
            .where(ProductIngredient.ingredient_id == ingredient_id)
        )
        if hasattr(Product, "deleted_at"):
            query = query.where(Product.deleted_at.is_(None))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def filter_by_price_range(
        self, min_price: Decimal | None = None, max_price: Decimal | None = None
    ) -> list[Product]:
        """Filter products by price range."""
        query = select(Product)
        if hasattr(Product, "deleted_at"):
            query = query.where(Product.deleted_at.is_(None))

        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def filter_by_allergens(
        self, exclude_allergens: list[str]
    ) -> list[Product]:
        """Filter products that do NOT contain specified allergens."""
        if not exclude_allergens:
            return []

        # Get ingredients that have any of the allergens
        from app.models.ingredient import Ingredient

        allergen_ingredients_query = select(Ingredient.id).where(
            Ingredient.allergens.overlaps(exclude_allergens),
            Ingredient.deleted_at.is_(None) if hasattr(Ingredient, "deleted_at") else True,
        )
        allergen_result = await self._session.execute(allergen_ingredients_query)
        allergen_ingredient_ids = [row[0] for row in allergen_result.fetchall()]

        if not allergen_ingredient_ids:
            return []

        # Get products that DON'T use any of those ingredients
        # Exclude products that have ANY of the allergen ingredients
        subquery = (
            select(ProductIngredient.product_id)
            .where(ProductIngredient.ingredient_id.in_(allergen_ingredient_ids))
        )

        query = (
            select(Product)
            .where(Product.id.not_in(subquery))
        )
        if hasattr(Product, "deleted_at"):
            query = query.where(Product.deleted_at.is_(None))

        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def search(self, query: str, limit: int = 20) -> list[Product]:
        """Search products by name (case-insensitive)."""
        stmt = (
            select(Product)
            .where(Product.name.ilike(f"%{query}%"))
            .limit(limit)
        )
        if hasattr(Product, "deleted_at"):
            stmt = stmt.where(Product.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_low_stock(self, threshold: int = 10) -> list[Product]:
        """Get products with stock below threshold."""
        query = select(Product).where(
            Product.stock < threshold,
            Product.deleted_at.is_(None) if hasattr(Product, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def get_in_stock_only(self) -> list[Product]:
        """Get only products with stock > 0."""
        query = select(Product).where(
            Product.stock > 0,
            Product.deleted_at.is_(None) if hasattr(Product, "deleted_at") else True,
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def get_catalogue_filtered(
        self,
        category_id: str | None = None,
        include_children: bool = False,
        exclude_allergens: list[str] | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
        search: str | None = None,
        sort: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Product], int]:
        """Get products for catalogue with all filters applied in SQL."""
        from app.models.category import Category
        from app.models.ingredient import Ingredient

        base_conditions = []
        if hasattr(Product, "deleted_at"):
            base_conditions.append(Product.deleted_at.is_(None))
        base_conditions.append(Product.stock > 0)

        # Category filter
        category_ids = [category_id] if category_id else []
        if category_id and include_children:
            children_query = select(Category.id).where(Category.parent_id == category_id)
            result = await self._session.execute(children_query)
            category_ids.extend([row[0] for row in result.fetchall()])

        # Build query with filters and load relations to avoid lazy loading errors
        query = select(Product).where(*base_conditions).options(
            selectinload(Product.categories),
            selectinload(Product.product_ingredients).selectinload(ProductIngredient.ingredient)
        )

        if category_ids:
            subquery = (
                select(ProductCategory.product_id)
                .where(ProductCategory.category_id.in_(category_ids))
            )
            query = query.where(Product.id.in_(subquery))

        # Allergens filter
        if exclude_allergens:
            allergen_query = select(Ingredient.id).where(
                Ingredient.allergens.overlaps(exclude_allergens),
            )
            result = await self._session.execute(allergen_query)
            allergen_ids = [row[0] for row in result.fetchall()]

            if allergen_ids:
                allergen_subquery = (
                    select(ProductIngredient.product_id)
                    .where(ProductIngredient.ingredient_id.in_(allergen_ids))
                )
                query = query.where(Product.id.not_in(allergen_subquery))

        # Price filter
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)

        # Search filter
        if search:
            query = query.where(Product.name.ilike(f"%{search}%"))

        # Get total count before pagination
        count_stmt = select(func.count()).select_from(query.order_by(None).subquery())
        count_result = await self._session.execute(count_stmt)
        total = count_result.scalar() or 0

        # Sort
        if sort == "price_asc":
            query = query.order_by(Product.price.asc())
        elif sort == "price_desc":
            query = query.order_by(Product.price.desc())
        elif sort == "name_asc":
            query = query.order_by(Product.name.asc())
        elif sort == "newest":
            query = query.order_by(Product.created_at.desc())
        else:
            query = query.order_by(Product.name.asc())

        # Pagination
        query = query.offset(skip).limit(limit)

        result = await self._session.execute(query)
        products = list(result.scalars().all())

        return products, total

    async def get_admin_filtered(
        self,
        category_id: str | None = None,
        ingredient_id: str | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
        search: str | None = None,
        low_stock: bool = False,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Product], int]:
        """Get products for admin with all filters applied in SQL."""
        from sqlalchemy import func
        from app.models.category import Category

        base_conditions = []
        if hasattr(Product, "deleted_at"):
            base_conditions.append(Product.deleted_at.is_(None))

        query = select(Product).where(*base_conditions).options(
            selectinload(Product.categories),
            selectinload(Product.product_ingredients).selectinload(ProductIngredient.ingredient)
        )

        # Category filter
        if category_id:
            subquery = (
                select(ProductCategory.product_id)
                .where(ProductCategory.category_id == category_id)
            )
            query = query.where(Product.id.in_(subquery))

        # Ingredient filter
        if ingredient_id:
            subquery = (
                select(ProductIngredient.product_id)
                .where(ProductIngredient.ingredient_id == ingredient_id)
            )
            query = query.where(Product.id.in_(subquery))

        # Price filter
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)

        # Search filter
        if search:
            query = query.where(Product.name.ilike(f"%{search}%"))

        # Low stock filter
        if low_stock:
            query = query.where(Product.stock < 10)

        # Get total count before pagination
        count_stmt = select(func.count()).select_from(query.order_by(None).subquery())
        count_result = await self._session.execute(count_stmt)
        total = count_result.scalar() or 0

        # Default sort
        query = query.order_by(Product.name.asc())

        # Pagination
        query = query.offset(skip).limit(limit)

        result = await self._session.execute(query)
        products = list(result.scalars().all())

        return products, total

    async def update_stock(
        self, product_id: str, quantity: int, operation: str = "add"
    ) -> Product | None:
        """Update product stock (add or remove)."""
        product = await self.get(product_id)
        if not product:
            return None

        if operation == "add":
            product.stock += quantity
        elif operation == "remove":
            if product.stock < quantity:
                raise ValueError("Insufficient stock")
            product.stock -= quantity

        await self._session.flush()
        await self._session.refresh(product)
        return product

    async def add_category(
        self, product_id: str, category_id: str
    ) -> Product | None:
        """Add category to product."""
        product = await self.get(product_id)
        if not product:
            return None

        from app.models.category import Category

        category = await self._session.get(Category, category_id)
        if category and category not in product.categories:
            product.categories.append(category)
            await self._session.flush()
            await self._session.refresh(product)
        return product

    async def remove_category(
        self, product_id: str, category_id: str
    ) -> Product | None:
        """Remove category from product."""
        product = await self.get(product_id)
        if not product:
            return None

        product.categories = [c for c in product.categories if c.id != category_id]
        await self._session.flush()
        await self._session.refresh(product)
        return product

    async def add_ingredient(
        self, product_id: str, ingredient_id: str, is_allergen: bool = False
    ) -> Product | None:
        """Add ingredient to product."""
        product = await self.get(product_id)
        if not product:
            return None

        from app.models.ingredient import Ingredient

        ingredient = await self._session.get(Ingredient, ingredient_id)
        if ingredient and ingredient not in product.ingredients:
            product.ingredients.append(ingredient)
            await self._session.flush()
            await self._session.refresh(product)
        return product

    async def remove_ingredient(
        self, product_id: str, ingredient_id: str
    ) -> Product | None:
        """Remove ingredient from product."""
        product = await self.get(product_id)
        if not product:
            return None

        product.ingredients = [i for i in product.ingredients if i.id != ingredient_id]
        await self._session.flush()
        await self._session.refresh(product)
        return product

    async def set_categories(
        self, product_id: str, category_ids: list[str]
    ) -> Product | None:
        """Replace all categories of a product using association table directly."""
        from sqlalchemy import delete, insert, Table
        from app.models.product import Product

        product = await self.get(product_id)
        if not product:
            return None

        # Get association table from relationship's secondary
        association_table = Product.categories.property.secondary

        # Delete existing associations
        await self._session.execute(
            delete(association_table).where(
                association_table.c.product_id == product_id
            )
        )

        # Insert new associations
        if category_ids:
            await self._session.execute(
                insert(association_table),
                [
                    {"product_id": product_id, "category_id": cat_id}
                    for cat_id in category_ids
                ],
            )

        await self._session.flush()
        await self._session.refresh(product)
        return product

    async def set_ingredients(
        self, product_id: str, ingredient_ids: list[str]
    ) -> Product | None:
        """Replace all ingredients of a product and detect allergens."""
        from sqlalchemy import delete, insert
        from app.models.product import Product
        from app.models.ingredient import Ingredient

        product = await self.get(product_id)
        if not product:
            return None

        # Get association table from relationship's secondary
        association_table = Product.ingredients.property.secondary

        # Delete existing associations
        await self._session.execute(
            delete(association_table).where(
                association_table.c.product_id == product_id
            )
        )

        # Fetch ingredients to check for allergens automatically
        if ingredient_ids:
            ing_stmt = select(Ingredient).where(Ingredient.id.in_(ingredient_ids))
            ing_res = await self._session.execute(ing_stmt)
            ingredients = list(ing_res.scalars().all())

            if ingredients:
                await self._session.execute(
                    insert(association_table),
                    [
                        {
                            "product_id": product_id, 
                            "ingredient_id": ing.id,
                            "is_allergen": len(ing.allergens) > 0
                        }
                        for ing in ingredients
                    ],
                )

        await self._session.flush()
        await self._session.refresh(product)
        return product

    async def has_active_orders(self, product_id: str) -> bool:
        """Check if product has active orders (PENDIENTE or CONFIRMADO)."""
        # TODO: Implement when order models exist
        # Returns False for now - needs implementation when orders are added
        return False