import pytest
from sqlalchemy.orm import Session
from app.services.auth import authenticate_user, create_user
from app.models.user import User


def test_create_user(db: Session):
    user = create_user(db, "test@example.com", "password123")
    assert user.email == "test@example.com"
    assert not user.is_verified
    assert user.role == "user"


def test_authenticate_user(db: Session):
    create_user(db, "auth@example.com", "password123")
    user = authenticate_user(db, "auth@example.com", "password123")
    assert user is not None
    assert user.email == "auth@example.com"


def test_authenticate_user_wrong_password(db: Session):
    create_user(db, "wrong@example.com", "password123")
    user = authenticate_user(db, "wrong@example.com", "wrongpassword")
    assert user is None
