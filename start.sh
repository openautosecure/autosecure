set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
WEB="$ROOT/web"

fuser -k 3000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true

echo "[*] Building frontend..."
cd "$WEB" && npm run build
cd "$ROOT"

echo "[*] Starting FastAPI..."
"$ROOT/.venv/bin/python" -m uvicorn app:app --host 127.0.0.1 --port 8000 --app-dir "$WEB" &

echo "[*] Starting frontend (Nitro)..."
node "$WEB/.output/server/index.mjs" &

echo "[*] Starting Cloudflare Tunnel..."
cloudflared tunnel --config "$ROOT/cloudflared.yml" run &

echo "[*] Starting Discord bot..."
"$ROOT/.venv/bin/python" "$ROOT/bot.py" &
