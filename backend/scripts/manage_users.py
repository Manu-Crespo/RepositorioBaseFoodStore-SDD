"""Script to manage user roles."""
import asyncio
import sys

from sqlalchemy import update
from app.database import get_engine
from app.models.user import User
from app.models.base import Base


async def list_users():
    """List all users."""
    from sqlalchemy import select
    from app.database import get_session_factory
    
    factory = get_session_factory()
    async with factory() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        print("\n=== Users ===")
        for u in users:
            print(f"ID: {u.id}")
            print(f"  Email: {u.email}")
            print(f"  Role: {u.role}")
            print(f"  Active: {u.is_active}")
            print()


async def promote_to_role(email: str, role: str):
    """Promote user to a role."""
    from app.database import get_engine
    
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.execute(
            update(User)
            .where(User.email == email)
            .values(role=role)
        )
    print(f"[OK] User {email} promoted to {role}")


async def create_admin(email: str):
    """Create admin user or promote existing."""
    await promote_to_role(email, "admin")


async def create_stock(email: str):
    """Create stock user or promote existing."""
    await promote_to_role(email, "stock")


async def main():
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.manage_users <command> [args]")
        print("")
        print("Commands:")
        print("  list                           - List all users")
        print("  create-admin <email>          - Create or promote to admin")
        print("  create-stock <email>           - Create or promote to stock")
        return
    
    command = sys.argv[1]
    
    if command == "list":
        await list_users()
    elif command == "create-admin" and len(sys.argv) == 3:
        await create_admin(sys.argv[2])
    elif command == "create-stock" and len(sys.argv) == 3:
        await create_stock(sys.argv[2])
    else:
        print("Unknown command")


if __name__ == "__main__":
    asyncio.run(main())