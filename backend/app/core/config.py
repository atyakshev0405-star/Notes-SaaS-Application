from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost/notes_db"

    # JWT
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Email
    smtp_server: str = "localhost"
    smtp_port: int = 1025
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    email_from: str = "noreply@notesapp.com"

    # App
    app_name: str = "Notes App"
    debug: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
