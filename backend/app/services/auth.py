from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.schemas.auth import Token
from app.services.email import send_verification_email, send_password_reset_email
from app.core.config import settings
import secrets
import redis
import json


redis_client = redis.from_url(settings.redis_url)


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, email: str, password: str) -> User:
    hashed_password = get_password_hash(password)
    verification_token = secrets.token_urlsafe(32)
    user = User(
        email=email,
        hashed_password=hashed_password,
        is_verified=False,
        verification_token=verification_token
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    send_verification_email(user.email, verification_token)
    return user


def verify_email(db: Session, token: str) -> bool:
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        return False
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return True


def create_password_reset_token(db: Session, email: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    reset_token = secrets.token_urlsafe(32)
    redis_client.setex(f"password_reset:{reset_token}", 3600, user.id)  # 1 hour
    send_password_reset_email(user.email, reset_token)
    return True


def reset_password(db: Session, token: str, new_password: str) -> bool:
    user_id = redis_client.get(f"password_reset:{token}")
    if not user_id:
        return False
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return False
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    redis_client.delete(f"password_reset:{token}")
    return True


def create_tokens(user: User) -> Token:
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    # Store refresh token in Redis
    redis_client.setex(f"refresh:{user.id}", settings.refresh_token_expire_days * 24 * 3600, refresh_token)
    return Token(access_token=access_token, refresh_token=refresh_token)


def refresh_access_token(user_id: int, refresh_token: str) -> Token | None:
    stored_token = redis_client.get(f"refresh:{user_id}")
    if not stored_token or stored_token.decode() != refresh_token:
        return None
    # Rotate refresh token
    new_access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)
    redis_client.setex(f"refresh:{user_id}", settings.refresh_token_expire_days * 24 * 3600, new_refresh_token)
    return Token(access_token=new_access_token, refresh_token=new_refresh_token)


def logout(user_id: int):
    redis_client.delete(f"refresh:{user_id}")
