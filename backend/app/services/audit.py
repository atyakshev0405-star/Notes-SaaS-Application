from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogCreate
from typing import Optional


def log_action(
    db: Session,
    action: str,
    actor_id: Optional[int] = None,
    target_type: Optional[str] = None,
    target_id: Optional[int] = None,
    ip: Optional[str] = None,
    user_agent: Optional[str] = None,
    payload: Optional[dict] = None
):
    audit_log = AuditLog(
        actor_id=actor_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        ip=ip,
        user_agent=user_agent,
        payload=payload
    )
    db.add(audit_log)
    db.commit()


def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AuditLog).offset(skip).limit(limit).all()


def get_audit_logs_count(db: Session):
    return db.query(AuditLog).count()
