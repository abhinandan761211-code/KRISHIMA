"""Storage foundation: bucket policy helpers (no bucket creation in this phase).

Buckets are declared as SQL in ``database/storage/buckets`` (version-controlled,
applied via the migration flow) so their visibility and size limits are reviewed
like any other schema change. This module only *describes* the expected buckets and
validates upload constraints; it does not mutate the remote storage.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.core.config import settings


@dataclass(frozen=True, slots=True)
class BucketPolicy:
    name: str
    public: bool
    max_upload_bytes: int
    allowed_mime: tuple[str, ...]


PUBLIC_ASSETS = BucketPolicy(
    name=settings.SUPABASE_STORAGE_PUBLIC_BUCKET,
    public=True,
    max_upload_bytes=settings.MAX_UPLOAD_BYTES,
    allowed_mime=("image/jpeg", "image/png", "image/webp"),
)

PRIVATE_DOCUMENTS = BucketPolicy(
    name=settings.SUPABASE_STORAGE_PRIVATE_BUCKET,
    public=False,
    max_upload_bytes=settings.MAX_UPLOAD_BYTES,
    allowed_mime=("application/pdf", "image/jpeg", "image/png"),
)


def expected_buckets() -> list[BucketPolicy]:
    return [PUBLIC_ASSETS, PRIVATE_DOCUMENTS]


def validate_upload(bucket: BucketPolicy, *, content_type: str, size_bytes: int) -> None:
    """Raise ``ValueError`` if an upload violates the bucket policy."""
    if size_bytes <= 0 or size_bytes > bucket.max_upload_bytes:
        raise ValueError(f"Upload size must be between 1 and {bucket.max_upload_bytes} bytes.")
    if content_type not in bucket.allowed_mime:
        raise ValueError(
            f"Content type {content_type!r} is not allowed for bucket {bucket.name!r}."
        )
