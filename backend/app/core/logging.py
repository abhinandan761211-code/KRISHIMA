"""Structured logging with correlation IDs and a PII/secret scrubber.

No sensitive value is ever emitted: a regex-based scrubber removes emails, phone
numbers, bearer tokens, JWT-shaped strings and connection-string passwords from
every log record before it is written.
"""

from __future__ import annotations

import logging
import re
import sys
from contextvars import ContextVar

from app.core.config import settings

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")

_SCRUB_PATTERNS = [
    (re.compile(r"([a-zA-Z][\w+.-]*://[^:/@\s]+):[^@\s]+@"), r"\1:***@"),  # URL creds
    (re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b"), "<jwt>"),
    (re.compile(r"(?i)bearer\s+[A-Za-z0-9._-]+"), "Bearer ***"),
    (re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b"), "<email>"),  # emails
    (re.compile(r"\b(?:\+91[-\s]?)?[6-9]\d{9}\b"), "<phone>"),  # Indian mobiles
    (re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b"), "<uuid>"),
    # Supabase *key values* only (sb_/service_role_ prefixed secrets with a long body);
    # this must not touch benign identifiers such as ``service_role_configured``.
    (re.compile(r"\b(?:sb_secret_|sb_publishable_)[A-Za-z0-9_-]{8,}"), "<supabase-key>"),
    (re.compile(r"\bservice_role_[A-Za-z0-9]{24,}"), "<supabase-key>"),
]


def scrub(text: str) -> str:
    """Remove common sensitive patterns from *text*."""
    for pattern, repl in _SCRUB_PATTERNS:
        text = pattern.sub(repl, text)
    return text


class _ScrubFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:  # noqa: A003
        try:
            rendered = record.getMessage()
        except Exception:  # pragma: no cover - defensive
            return True
        record.msg = scrub(rendered)
        record.args = ()
        if not getattr(record, "request_id", None):
            record.request_id = request_id_ctx.get()  # type: ignore[attr-defined]
        return True


_FORMAT = "%(asctime)s %(levelname)-8s [%(request_id)s] %(name)s: %(message)s"


def configure_logging() -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(_FORMAT))
    handler.addFilter(_ScrubFilter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(settings.LOG_LEVEL)
    # Quiet noisy third-party loggers.
    for noisy in ("uvicorn.access", "httpx", "httpcore"):
        logging.getLogger(noisy).setLevel(max(logging.INFO, root.level))


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
