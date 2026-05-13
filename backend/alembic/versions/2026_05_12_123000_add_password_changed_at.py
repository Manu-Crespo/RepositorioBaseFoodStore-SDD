"""Add password_changed_at column to users

Revision ID: add_password_changed_at
Revises: e2f3a4b5c6d7
Create Date: 2026-05-12 12:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_password_changed_at'
down_revision: Union[str, Sequence[str], None] = 'e2f3a4b5c6d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add password_changed_at column to users table."""
    op.add_column(
        'users',
        sa.Column('password_changed_at', sa.DateTime(timezone=True), nullable=True)
    )


def downgrade() -> None:
    """Remove password_changed_at column from users table."""
    op.drop_column('users', 'password_changed_at')