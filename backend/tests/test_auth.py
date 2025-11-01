import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
from app.config import SECRET_KEY, ALGORITHM

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_register():
    response = client.post("/auth/register", json={"email": "test@example.com", "password": "password"})
    assert response.status_code == 200
    assert "message" in response.json()

def test_login():
    # First register
    client.post("/auth/register", json={"email": "test2@example.com", "password": "password"})
    # Confirm email
    client.get("/auth/confirm/some_token")
    # Then login
    response = client.post("/auth/login", json={"email": "test2@example.com", "password": "password"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_confirm_email():
    client.post("/auth/register", json={"email": "test3@example.com", "password": "password"})
    response = client.get("/auth/confirm/some_token")
    assert response.status_code == 200
    assert "confirmed" in response.json()["message"]

def test_forgot_password():
    client.post("/auth/register", json={"email": "test4@example.com", "password": "password"})
    response = client.post("/auth/forgot-password", json={"email": "test4@example.com"})
    assert response.status_code == 200

def test_reset_password():
    response = client.post("/auth/reset-password", json={"token": "some_token", "new_password": "newpass"})
    assert response.status_code == 200
