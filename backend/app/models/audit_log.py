from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.db.session import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, nullable=True)  # User who performed the action
    action = Column(String, nullable=False)  # e.g., "login", "create_note", "delete_note"
    target_type = Column(String, nullable=True)  # e.g., "user", "note"
    target_id = Column(Integer, nullable=True)  # ID of the target
    ip = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    payload = Column(JSON, nullable=True)  # Additional data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
