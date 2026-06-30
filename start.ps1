$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$WEB = Join-Path $ROOT "web"

foreach ($port in @(8000, 3000, 25)) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Push-Location $WEB
npm run build
Pop-Location
Start-Process python "-m uvicorn app:app --host 127.0.0.1 --port 8000 --app-dir `"$WEB`"" -NoNewWindow
Start-Process node "`"$WEB\.output\server\index.mjs`"" -NoNewWindow
Start-Process cloudflared "tunnel --config `"$ROOT\cloudflared.yml`" run" -NoNewWindow
Start-Process python "`"$ROOT\bot.py`"" -NoNewWindow -Wait