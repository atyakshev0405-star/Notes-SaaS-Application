from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class NoteBase(BaseModel):
    title: str
    content: str
    visibility: str = "private"
    is_draft: bool = False
    tags: Optional[str] = None


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    visibility: Optional[str] = None
    is_draft: Optional[bool] = None
    tags: Optional[str] = None


class Note(NoteBase):
    id: int
    author_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NoteList(BaseModel):
    notes: List[Note]
    total: int
