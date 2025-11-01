import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base

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

def test_create_note():
    # Register and login first
    client.post("/auth/register", json={"email": "test@example.com", "password": "password"})
    client.get("/auth/confirm/some_token")  # Confirm email
    login_response = client.post("/auth/login", json={"email": "test@example.com", "password": "password"})
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/notes/", json={"title": "Test Note", "content": "Test content"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Note"

def test_read_notes():
    # Assuming a note exists from previous test
    client.get("/auth/confirm/some_token")  # Confirm email
    login_response = client.post("/auth/login", json={"email": "test@example.com", "password": "password"})
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/notes/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_access_levels():
    # Register and login user1
    client.post("/auth/register", json={"email": "user1@example.com", "password": "password"})
    client.get("/auth/confirm/some_token")
    login_response = client.post("/auth/login", json={"email": "user1@example.com", "password": "password"})
    assert login_response.status_code == 200
    token1 = login_response.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Create private note
    response = client.post("/notes/", json={"title": "Private Note", "content": "Private", "access_level": "private"}, headers=headers1)
    private_id = response.json()["id"]

    # Create public note
    response = client.post("/notes/", json={"title": "Public Note", "content": "Public", "access_level": "public"}, headers=headers1)
    public_id = response.json()["id"]

    # Register and login user2
    client.post("/auth/register", json={"email": "user2@example.com", "password": "password"})
    client.get("/auth/confirm/some_token")
    login_response = client.post("/auth/login", json={"email": "user2@example.com", "password": "password"})
    assert login_response.status_code == 200
    token2 = login_response.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # User2 should see public note but not private
    response = client.get("/notes/", headers=headers2)
    notes = response.json()
    public_notes = [n for n in notes if n["access_level"] == "public"]
    assert len(public_notes) == 1
    assert public_notes[0]["title"] == "Public Note"

    # User2 cannot access private note
    response = client.get(f"/notes/{private_id}", headers=headers2)
    assert response.status_code == 403

    # User1 can access both
    response = client.get("/notes/", headers=headers1)
    assert len(response.json()) == 2
