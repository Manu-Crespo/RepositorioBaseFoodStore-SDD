"""
Exception handlers for RFC 7807 Problem Details.
"""
import logging
import traceback
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.errors.models import ProblemDetails

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers."""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle Pydantic validation errors."""
        errors = []
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"])
            errors.append({"field": field, "message": error["msg"], "type": error["type"]})

        problem = ProblemDetails(
            type="https://api.foodstore.com/errors/VALIDATION_ERROR",
            title="Validation Error",
            status=422,
            detail="Request validation failed",
            errors=errors,
        )
        return JSONResponse(
            status_code=422,
            content=problem.model_dump(exclude_none=True),
        )

    @app.exception_handler(ValidationError)
    async def pydantic_validation_error_handler(
        request: Request, exc: ValidationError
    ) -> JSONResponse:
        """Handle Pydantic model validation errors."""
        errors = []
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"])
            errors.append({"field": field, "message": error["msg"], "type": error["type"]})

        problem = ProblemDetails(
            type="https://api.foodstore.com/errors/VALIDATION_ERROR",
            title="Validation Error",
            status=422,
            detail="Data validation failed",
            errors=errors,
        )
        return JSONResponse(
            status_code=422,
            content=problem.model_dump(exclude_none=True),
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(
        request: Request, exc: SQLAlchemyError
    ) -> JSONResponse:
        """Handle database errors."""
        logger.exception("Database error: %s", exc)
        problem = ProblemDetails(
            type="https://api.foodstore.com/errors/DATABASE_ERROR",
            title="Database Error",
            status=503,
            detail="Database operation failed. Please try again later.",
        )
        return JSONResponse(
            status_code=503,
            content=problem.model_dump(exclude_none=True),
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Handle unhandled exceptions."""
        logger.exception("Unhandled exception: %s\n%s", exc, traceback.format_exc())
        trace_id = id(exc)  # Simple trace ID for logging
        problem = ProblemDetails(
            type="https://api.foodstore.com/errors/INTERNAL_ERROR",
            title="Internal Server Error",
            status=500,
            detail="An internal error occurred.",
            trace_id=str(trace_id),
        )
        return JSONResponse(
            status_code=500,
            content=problem.model_dump(exclude_none=True),
        )