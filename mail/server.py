import logging
from email import message_from_bytes                                                                                                                                                                                                          
from aiosmtpd.controller import Controller
from database.database import DBConnection

log = logging.getLogger(__name__)

class MailHandler:
    async def handle_RCPT(self, server, session, envelope, address, rcpt_options):
        envelope.rcpt_tos.append(address)
        return "250 OK"

    async def handle_DATA(self, server, session, envelope):
        msg = message_from_bytes(envelope.content)
        subject = msg.get("subject", "")
        body = _extract_body(msg)

        with DBConnection() as db:
            for recipient in envelope.rcpt_tos:
                db.add_email(
                    to_address=recipient.lower(),
                    from_address=envelope.mail_from,
                    subject=subject,
                    body=body,
                )

        log.info(f"Mail received: {envelope.mail_from} -> {', '.join(envelope.rcpt_tos)} | {subject}")
        return "250"


def _extract_body(msg) -> str:
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain" and "attachment" not in part.get("Content-Disposition", ""):
                return part.get_payload(decode=True).decode("utf-8", errors="replace")
        for part in msg.walk():
            if part.get_content_type() == "text/html" and "attachment" not in part.get("Content-Disposition", ""):
                return part.get_payload(decode=True).decode("utf-8", errors="replace")
    payload = msg.get_payload(decode=True)
    if payload:
        return payload.decode("utf-8", errors="replace")
    return ""


def startServer() -> Controller:
    controller = Controller(MailHandler(), hostname="0.0.0.0", port=25)
    controller.start()
    log.info("SMTP server listening on 0.0.0.0:25")
    return controller