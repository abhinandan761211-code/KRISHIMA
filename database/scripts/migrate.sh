#!/usr/bin/env bash
# Run Alembic against the MIGRATION database (database/.env), with backend on PYTHONPATH.
# Usage: database/scripts/migrate.sh [upgrade|downgrade|current|history|check] [args...]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT="$(cd "$DB_DIR/.." && pwd)"

export PYTHONPATH="$ROOT/backend${PYTHONPATH:+:$PYTHONPATH}"
cd "$DB_DIR"

CMD="${1:-upgrade}"
shift || true

case "$CMD" in
  upgrade)   exec alembic upgrade "${1:-head}" ;;
  downgrade) exec alembic downgrade "${1:?target revision required}" ;;
  current)   exec alembic current ;;
  history)   exec alembic history ;;
  check)     exec alembic check ;;
  *)         exec alembic "$CMD" "$@" ;;
esac
