import pytest
from sqlalchemy.orm import Session
from app.models.note import Note, Visibility
from app.models.user import User


def test_create_note(db: Session):
    user = User(email="noteuser@example.com", hashed_password="hashed", is_verified=True)
    db.add(user)
    db.commit()
    
    note = Note(title="Test Note", content="Test content", author_id=user.id)
    db.add(note)
    db.commit()
    db.refresh(note)
    
    assert note.title == "Test Note"
    assert note.author_id == user.id
    assert note.visibility == Visibility.private


def test_note_visibility(db: Session):
    user1 = User(email="user1@example.com", hashed_password="hashed", is_verified=True)
    user2 = User(email="user2@example.com", hashed_password="hashed", is_verified=True)
    db.add(user1)
    db.add(user2)
    db.commit()
    
    private_note = Note(title="Private", content="Private content", author_id=user1.id, visibility=Visibility.private)
    public_note = Note(title="Public", content="Public content", author_id=user1.id, visibility=Visibility.public)
    db.add(private_note)
    db.add(public_note)
    db.commit()
    
    # User1 should see both notes
    user1_notes = db.query(Note).filter(
        (Note.author_id == user1.id) | (Note.visibility == Visibility.public)
    ).all()
    assert len(user1_notes) == 2
    
    # User2 should only see public note
    user2_notes = db.query(Note).filter(
        (Note.author_id == user2.id) | (Note.visibility == Visibility.public)
    ).all()
    assert len(user2_notes) == 1
    assert user2_notes[0].title == "Public"
