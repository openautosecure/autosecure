import sqlite3

class DBConnection:
    def __init__(self) -> None:
        self.conn = sqlite3.connect("database/database.db")
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self
    
    def __exit__(self, *args) -> None:
        self.conn.close()

    # Security Emails
    def addEmail(self, email: str, pwd: str) -> None:
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

        self.conn.commit()

        return password
    
    def getEmails(self) -> tuple:
        emails = self.cursor.execute("""
            SELECT email FROM `security_emails`
        """).fetchall()

        return emails

    # Blacklisting
    def getBlacklistedUsers(self) -> list:
        users = self.cursor.execute("""
            SELECT id FROM `blacklisted_users`
        """).fetchall()

        return [user_id for (user_id,) in users]
    
    def addBlacklistedUser(self, id: int) -> None:
        existing_user = self.cursor.execute("""
            SELECT 1 FROM `blacklisted_users`
            WHERE id = ?
        """, (id,)).fetchone()

        if existing_user is None:
            self.cursor.execute("""
                INSERT INTO `blacklisted_users` (id)
                VALUES (?)
            """, (id,))
        self.conn.commit()

    def removeBlacklistedUser(self, id: int) -> None:
        self.cursor.execute("""
            DELETE FROM `blacklisted_users`
            WHERE id = ?
        """, (id,))
        self.conn.commit()




