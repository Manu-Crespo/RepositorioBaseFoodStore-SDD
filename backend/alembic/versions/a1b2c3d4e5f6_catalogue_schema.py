"""catalogue schema - categories, ingredients, products

Revision ID: a1b2c3d4e5f6
Revises: cd374040e57a
Create Date: 2026-05-05 03:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'cd374040e57a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Tabla de categorías (jerárquicas con materialized path)
    op.create_table(
        'categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('parent_id', sa.String(36), nullable=True),
        sa.Column('path', sa.String(500), nullable=False, server_default='/'),
        sa.Column('order', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['categories.id']),
    )
    op.create_index('ix_categories_parent_id', 'categories', ['parent_id'])
    op.create_index('ix_categories_path', 'categories', ['path'])
    op.create_index('ix_categories_deleted_at', 'categories', ['deleted_at'])

    # Tabla de ingredientes
    op.create_table(
        'ingredients',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('allergens', sa.ARRAY(sa.String), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_ingredients_name', 'ingredients', ['name'])
    op.create_index('ix_ingredients_deleted_at', 'ingredients', ['deleted_at'])

    # Tabla de productos
    op.create_table(
        'products',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('stock', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_products_name', 'products', ['name'])
    op.create_index('ix_products_price', 'products', ['price'])
    op.create_index('ix_products_deleted_at', 'products', ['deleted_at'])

    # Tabla de asociación productos-categorías (Many-to-Many)
    op.create_table(
        'products_categories',
        sa.Column('product_id', sa.String(36), nullable=False),
        sa.Column('category_id', sa.String(36), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('product_id', 'category_id'),
    )
    op.create_index('ix_products_categories_product_id', 'products_categories', ['product_id'])
    op.create_index('ix_products_categories_category_id', 'products_categories', ['category_id'])

    # Tabla de asociación productos-ingredientes (Many-to-Many)
    op.create_table(
        'products_ingredients',
        sa.Column('product_id', sa.String(36), nullable=False),
        sa.Column('ingredient_id', sa.String(36), nullable=False),
        sa.Column('is_allergen', sa.Boolean, nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['ingredient_id'], ['ingredients.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('product_id', 'ingredient_id'),
    )
    op.create_index('ix_products_ingredients_product_id', 'products_ingredients', ['product_id'])
    op.create_index('ix_products_ingredients_ingredient_id', 'products_ingredients', ['ingredient_id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('products_ingredients')
    op.drop_table('products_categories')
    op.drop_table('products')
    op.drop_table('ingredients')
    op.drop_table('categories')