"""
Pydantic settings and custom validators.
"""
import re
from datetime import date, datetime
from typing import Any

from pydantic import (
    AfterValidator,
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)
from pydantic.functional_validators import AfterValidator


# Pydantic settings for string normalization
class NormalizedStr(str):
    """String that is normalized (stripped, collapsing spaces, NFC Unicode)."""

    @classmethod
    def __get_pydantics__(
        cls,
    ) -> AfterValidator:
        @field_validator(v1=cls, mode="before")
        @classmethod
        def normalize(cls, v: Any) -> str:
            if not isinstance(v, str):
                return v
            # Strip, collapse multiple spaces, normalize unicode
            v = v.strip()
            v = re.sub(r"\s+", " ", v)
            import unicodedata

            v = unicodedata.normalize("NFC", v)
            return v

        return normalize


def validate_future_date(v: Any) -> date:
    """Validator for future dates."""
    if isinstance(v, str):
        v = datetime.fromisoformat(v).date()
    if isinstance(v, date) and v <= date.today():
        raise ValueError("Date must be in the future")
    return v


class FutureDateField(date):
    """Pydantic field for dates in the future."""

    @classmethod
    def __get_pydantics__(
        cls,
    ) -> AfterValidator:
        @field_validator(v1=cls, mode="before")
        @classmethod
        def validate(cls, v: Any) -> date:
            return validate_future_date(v)

        return validate


# Password strength validator
def validate_password_strength(password: str) -> str:
    """Validate password strength."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not re.search(r"[A-Za-z]", password):
        raise ValueError("Password must contain letters")
    if not re.search(r"[0-9]", password):
        raise ValueError("Password must contain numbers")
    return password


def validate_email_format(email: str) -> str:
    """Validate email format."""
    # Basic email validation (EmailStr handles most cases)
    if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email):
        raise ValueError("Invalid email format")
    return email


def validate_enum_value(enum_class: type) -> AfterValidator:
    """Create validator for enum values."""

    def validator(v: Any) -> Any:
        if isinstance(v, str):
            try:
                return enum_class(v)
            except ValueError:
                valid_values = [e.value for e in enum_class]
                raise ValueError(f"Must be one of: {valid_values}")
        return v

    return field_validator(mode="before")(validator)