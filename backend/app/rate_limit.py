"""Rate limiting middleware."""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Rate limiter - 5 requests per minute per IP
limiter = Limiter(key_func=get_remote_address)

# Rate limit key - can be customized per endpoint
def get_rate_limit_key() -> str:
    """Get rate limit key based on IP."""
    return get_remote_address