"""
Application configuration loaded from environment.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # Application
    APP_NAME: str = "Food Store API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = ""

    # Security
    SECRET_KEY: str | None = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    # API
    API_V1_PREFIX: str = "/api/v1"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    settings = Settings()

    # Require SECRET_KEY in production
    if settings.ENVIRONMENT == "production" and not settings.SECRET_KEY:
        raise ValueError("SECRET_KEY must be set in production environment")

    # Generate a default key for development if not set
    if not settings.SECRET_KEY:
        import secrets
        settings.SECRET_KEY = secrets.token_hex(32)

    return settings


# Global settings instance
settings = get_settings()