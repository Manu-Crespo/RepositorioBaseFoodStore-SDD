"""
Logging configuration for the application.
"""
import logging
import sys
from typing import Any

from app.config import settings


def setup_logging() -> None:
    """Configure application logging."""
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stderr),
        ],
    )

    # Set third-party loggers to WARNING
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("alembic").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Get a logger for a module."""
    return logging.getLogger(name)