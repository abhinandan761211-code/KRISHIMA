#!/usr/bin/env python3
"""Create the KRISHIMA storage buckets declared in database/storage/buckets/buckets.json.

Idempotent: existing buckets are left untouched. Uses the SERVICE ROLE key (server
side) — never run this from a browser context.

Run:
    python3 database/scripts/create_storage_buckets.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "backend" / ".env")

url = os.getenv("SUPABASE_URL", "").rstrip("/")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
if not url or not key or "REPLACE_WITH" in key:
    print("NOT CONFIGURED: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in backend/.env")
    raise SystemExit(2)

spec = json.loads(
    (ROOT / "database" / "storage" / "buckets" / "buckets.json").read_text(encoding="utf-8")
)
headers = {"apikey": key, "Authorization": f"Bearer {key}"}

existing = httpx.get(f"{url}/storage/v1/bucket", headers=headers, timeout=15)
existing.raise_for_status()
names = {b.get("name") for b in existing.json()}

created = 0
for name, cfg in spec.items():
    if name in names:
        print(f"exists   {name}")
        continue
    resp = httpx.post(
        f"{url}/storage/v1/bucket",
        headers={**headers, "Content-Type": "application/json"},
        json={
            "id": name,
            "name": name,
            "public": cfg["public"],
            "allowed_mime_types": cfg["allowed_mime_types"],
            "file_size_limit": cfg["file_size_limit"],
        },
        timeout=15,
    )
    if resp.status_code in (200, 201):
        print(f"created  {name} (public={cfg['public']})")
        created += 1
    else:
        print(f"FAILED   {name}: HTTP {resp.status_code} {resp.text[:120]}")
        sys.exit(1)

print(f"done: {created} created, {len(spec) - created} already present")
