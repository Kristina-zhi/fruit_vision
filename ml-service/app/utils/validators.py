from app.core.exceptions import ServiceError

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
}


def validate_content_type(content_type: str | None) -> None:
    if not content_type or not content_type.startswith("image/"):
        raise ServiceError("File must be an image", 400)
    if content_type.lower() not in ALLOWED_CONTENT_TYPES:
        raise ServiceError(f"Unsupported image format: {content_type}", 400)
