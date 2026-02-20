#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm не найден. Установите Node.js и npm."
  exit 1
fi

if [[ ! -f "$BACKEND_DIR/package.json" ]]; then
  echo "Не найден backend/package.json"
  exit 1
fi

if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
  echo "Не найден frontend/package.json"
  exit 1
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  trap - INT TERM EXIT

  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  wait "$BACKEND_PID" 2>/dev/null || true
  wait "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Запускаю backend: npm run start:dev"
(cd "$BACKEND_DIR" && npm run start:dev) &
BACKEND_PID=$!

echo "Запускаю frontend: npm run dev"
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

echo "Оба сервиса запущены. Нажмите Ctrl+C для остановки."

while true; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Backend завершился."
    exit 1
  fi

  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "Frontend завершился."
    exit 1
  fi

  sleep 1
done
