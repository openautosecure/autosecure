import sqlite3

class DBConnection:
    def __init__(self) -> None:
        self.conn = sqlite3.connect("database/database.db")
        self.cursor = self.conn.cursor()

    def __enter__(self):
        return self
    
    def __exit__(self, *args) -> None:
        self.conn.close()

    def addEmail(self, email: str, pwd: str) -> None:

        self.cursor.execute("""
            INSERT INTO `security_emails` (email, password)
            VALUES (?, ?)
        """, (email, pwd)
        )

        self.conn.commit()

    def getEmailPassword(self, email: str) -> str | None:

        password: str = self.cursor.execute("""
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


