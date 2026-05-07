"""
RFC 7807 Problem Details model.
"""
from typing import Any

from pydantic import BaseModel, Field


class ProblemDetails(BaseModel):
    """RFC 7807 Problem Details response model."""

    type: str = Field(
        description="A URI reference that identifies the problem type"
    )
    title: str = Field(description="A short, human-readable summary of the problem")
    status: int = Field(description="The HTTP status code")
    detail: str = Field(
        description="A human-readable explanation specific to this occurrence of the problem"
    )
    instance: str | None = Field(
        default=None,
        description="A URI reference that identifies the specific occurrence of the problem",
    )
    trace_id: str | None = Field(
        default=None,
        description="Internal trace ID for debugging (not exposed to client in production)",
    )
    errors: list[dict[str, Any]] | None = Field(
        default=None,
        description="Detailed field-level errors",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "type": "https://api.foodstore.com/errors/VALIDATION_ERROR",
                "title": "Validation Error",
                "status": 422,
                "detail": "Email already registered",
                "instance": "/api/v1/auth/register",
            }
        }