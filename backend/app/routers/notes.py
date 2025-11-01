from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Note, User, AuditLog
from .auth import get_current_user
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

class NoteCreate(BaseModel):
    title: str
    content: str
    access_level: str = "private"

class NoteUpdate(BaseModel):
    title: str
    content: str
    access_level: str

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    access_level: str
    owner_id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

def log_action(db: Session, user_id: int, action: str, details: str = None):
    audit_log = AuditLog(user_id=user_id, action=action, details=details)
    db.add(audit_log)
    db.commit()

@router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_note = Note(**note.dict(), owner_id=current_user.id, updated_at=datetime.utcnow())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    log_action(db, current_user.id, "create_note", f"Note ID: {db_note.id}")
    return db_note

@router.get("/", response_model=List[NoteResponse])
def read_notes(skip: int = 0, limit: int = 10, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Public notes: all users can see
    # Private: only owner
    # Shared: owner and specific users (simplified, assume shared means public for now)
    notes = db.query(Note).filter(
        (Note.access_level == "public") |
        ((Note.access_level == "private") & (Note.owner_id == current_user.id)) |
        ((Note.access_level == "shared") & (Note.owner_id == current_user.id))  # Simplified
    ).offset(skip).limit(limit).all()
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
def read_note(note_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    # Check access
    if note.access_level == "private" and note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if note.access_level == "shared" and note.owner_id != current_user.id:
        # Simplified: assume shared means public for now
        pass
    return note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_update: NoteUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id, Note.owner_id == current_user.id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, value in note_update.dict().items():
        setattr(note, key, value)
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    log_action(db, current_user.id, "update_note", f"Note ID: {note_id}")
    return note

@router.delete("/{note_id}")
def delete_note(note_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id, Note.owner_id == current_user.id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    log_action(db, current_user.id, "delete_note", f"Note ID: {note_id}")
    return {"message": "Note deleted"}

# Add access level logic if needed
