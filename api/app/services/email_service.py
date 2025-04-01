import os
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

# SMTP configuration values loaded from environment
SMTP_SERVER = os.getenv("EMAIL_SERVICE")
SMTP_PORT = int(os.getenv("EMAIL_PORT"))
SMTP_USER = os.getenv("EMAIL_USER")
SMTP_PASS = os.getenv("EMAIL_PASS")
SMTP_FROM = os.getenv("SMTP_FROM")

template_env = Environment(loader=FileSystemLoader("app/templates")) # Set up Jinja2 environment to load email templates

# Send an HTML email using a Jinja2 template and aiosmtplib
async def send_email(to_email: str, subject: str, template_name: str, context: dict): 
    try:
        template = template_env.get_template(f"{template_name}_template.html")
        html_content = template.render(context)

        msg = MIMEMultipart()
        msg["From"] = SMTP_FROM
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_content, "html"))

        await aiosmtplib.send(
            msg,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASS,
            use_tls=False,
            start_tls=True
        )
        print(f"Email sent to: {to_email}")
    except Exception as e:
        print(f"Failed to send email to: {e}")
