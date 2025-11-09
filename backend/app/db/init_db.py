from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings


def init_db():
    db = SessionLocal()
    try:
        # Create admin user
        admin_email = "admin@example.com"
        admin_password = "AdminPass123!"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                is_active=True,
                is_verified=True,
                role="admin"
            )
            db.add(admin_user)

        # Create regular user
        user_email = "user@example.com"
        user_password = "UserPass123!"
        regular_user = db.query(User).filter(User.email == user_email).first()
        if not regular_user:
            regular_user = User(
                email=user_email,
                hashed_password=get_password_hash(user_password),
                is_active=True,
                is_verified=True,
                role="user"
            )
            db.add(regular_user)

        db.commit()
    finally:
        db.close()
