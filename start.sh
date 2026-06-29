#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
WEB="$ROOT/web"

# Kill anything already on these ports
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true

echo "[*] Building frontend..."
cd "$WEB" && npm run build
cd "$ROOT"

echo "[*] Starting FastAPI..."
"$ROOT/.venv/bin/python" -m uvicorn app:app --host 127.0.0.1 --port 8000 --app-dir "$WEB" &
UVICORN_PID=$!

echo "[*] Starting frontend (Nitro)..."
node "$WEB/.output/server/index.mjs" &
NITRO_PID=$!

echo "[*] Starting Cloudflare Tunnel..."
cloudflared tunnel --config "$ROOT/cloudflared.yml" run &
CF_PID=$!

echo "[*] Starting Discord bot..."
"$ROOT/.venv/bin/python" "$ROOT/bot.py" &
BOT_PID=$!

echo ""
echo "[+] All services running. Press Ctrl+C to stop."

cleanup() {
    echo ""
    echo "[*] Shutting down..."
    kill $BOT_PID $CF_PID $NITRO_PID $UVICORN_PID 2>/dev/null
    wait 2>/dev/null
    echo "[+] Done."
}
trap cleanup SIGINT SIGTERM

wait $BOT_PID
