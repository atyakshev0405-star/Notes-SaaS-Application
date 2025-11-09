from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.note import Note, Visibility
from app.schemas.note import Note as NoteSchema, NoteCreate, NoteUpdate, NoteList
from app.api.deps import get_current_verified_user, get_current_admin_user
from app.services.audit import log_action

router = APIRouter()


@router.post("/", response_model=NoteSchema)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_verified_user)
):
    db_note = Note(**note.dict(), author_id=current_user.id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    log_action(db, "create_note", actor_id=current_user.id, target_type="note", target_id=db_note.id)
    return db_note


@router.get("/public", response_model=List[NoteSchema])
def get_public_notes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all public notes (no authentication required)"""
    notes = db.query(Note).filter(
        Note.visibility == Visibility.public,
        Note.is_draft == False
    ).order_by(Note.created_at.desc()).offset(skip).limit(limit).all()
    return notes


@router.get("/", response_model=List[NoteSchema])
def get_notes(
    skip: int = 0,
    limit: int = 100,
    visibility: str = Query(None, description="Filter by visibility: my, public, all"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_verified_user)
):
    """Get notes based on filter"""
    query = db.query(Note)
    
    if visibility == "my":
        # Only user's own notes
        query = query.filter(Note.author_id == current_user.id)
    elif visibility == "public":
        # Only public notes from all users
        query = query.filter(
            Note.visibility == Visibility.public,
            Note.is_draft == False
        )
    elif current_user.role == "admin":
        # Admin sees all notes
        pass
    else:
        # Regular users see their own notes + public notes
        query = query.filter(
            (Note.author_id == current_user.id) |
            ((Note.visibility == Visibility.public) & (Note.is_draft == False))
        )
    
    notes = query.order_by(Note.created_at.desc()).offset(skip).limit(limit).all()
    return notes


@router.get("/{note_id}", response_model=NoteSchema)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_verified_user)
):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.author_id != current_user.id and note.visibility != Visibility.public and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this note")
    return note


@router.put("/{note_id}", response_model=NoteSchema)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_verified_user)
):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this note")
    
    for field, value in note_update.dict(exclude_unset=True).items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    log_action(db, "update_note", actor_id=current_user.id, target_type="note", target_id=note.id)
    return note


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_verified_user)
):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this note")
    
    db.delete(note)
    db.commit()
    log_action(db, "delete_note", actor_id=current_user.id, target_type="note", target_id=note_id)
    return {"message": "Note deleted successfully"}
