from app.core.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg['From'] = settings.email_from
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(settings.smtp_server, settings.smtp_port)
        server.sendmail(settings.email_from, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_verification_email(email: str, token: str):
    subject = "Verify your email"
    body = f"""
    <h2>Welcome to Notes App!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="http://localhost:3000/verify-email?token={token}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
    """
    send_email(email, subject, body)


def send_password_reset_email(email: str, token: str):
    subject = "Reset your password"
    body = f"""
    <h2>Password Reset</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="http://localhost:3000/reset-password?token={token}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    """
    send_email(email, subject, body)
