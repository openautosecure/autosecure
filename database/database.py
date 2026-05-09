import sqlite3

class DBConnection:
    def __init__(self) -> None:
        self.conn = sqlite3.connect("database/database.db", check_same_thread=False)
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self
    
    def __exit__(self, *args) -> None:
        self.conn.close()

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

    # Claims
    def isAccountClaimed(self, username: str) -> bool:
        result = self.cursor.execute("""
            SELECT 1 FROM `claimed_accounts`
            WHERE LOWER(username) = LOWER(?)
        """, (username,)).fetchone()
        
        return result is not None

    def claimAccount(self, username: str, user_id: int) -> None:
        self.cursor.execute("""
            INSERT INTO `claimed_accounts` (username, claimed_by)
            VALUES (?, ?)
        """, (username, user_id))
        self.conn.commit()
