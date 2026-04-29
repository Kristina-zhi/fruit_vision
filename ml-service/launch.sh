#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

if [ -d ".venv" ]; then
  source .venv/bin/activate
fi

echo "Starting Fruit Vision ML Service..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
