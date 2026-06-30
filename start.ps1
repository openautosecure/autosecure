$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$WEB = Join-Path $ROOT "web"

Push-Location $WEB
npm run build
Pop-Location

Start-Process "$ROOT\.venv\Scripts\python.exe" "-m uvicorn app:app --host 127.0.0.1 --port 8000 --app-dir `"$WEB`"" -NoNewWindow
Start-Process node "`"$WEB\.output\server\index.mjs`"" -NoNewWindow
Start-Process cloudflared "tunnel --config `"$ROOT\cloudflared.yml`" run" -NoNewWindow
Start-Process "$ROOT\.venv\Scripts\python.exe" "`"$ROOT\bot.py`"" -NoNewWindow -Wait
