"""add user profile fields

Revision ID: e2f3a4b5c6d7
Revises: d1e2f3a4b5c6
Create Date: 2026-05-05 22:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2f3a4b5c6d7'
down_revision: Union[str, Sequence[str], None] = 'd1e2f3a4b5c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('first_name', sa.String(100), nullable=False, server_default=''))
    op.add_column('users', sa.Column('last_name', sa.String(100), nullable=False, server_default=''))
    op.add_column('users', sa.Column('phone', sa.String(20), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'phone')
    op.drop_column('users', 'last_name')
    op.drop_column('users', 'first_name')