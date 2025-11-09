from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.session import Base


class Visibility(enum.Enum):
    private = "private"
    public = "public"
    unlisted = "unlisted"


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    visibility = Column(Enum(Visibility), default=Visibility.private)
    is_draft = Column(Boolean, default=False)
    tags = Column(String)  # Comma-separated tags
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User")
