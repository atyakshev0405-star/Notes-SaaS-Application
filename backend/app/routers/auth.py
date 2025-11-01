from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, AuditLog
from ..config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
import secrets

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str = None

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

def send_email(to_email: str, subject: str, body: str):
    # Placeholder for email sending - disabled for demo
    print(f"Email to {to_email}: {subject} - {body}")
    pass

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    confirmation_token = secrets.token_urlsafe(32)
    db_user = User(email=user.email, hashed_password=hashed_password, is_active=True)  # Set to True for demo
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # Send confirmation email
    confirmation_url = f"http://localhost:8000/auth/confirm/{confirmation_token}"
    send_email(user.email, "Confirm your email", f"Click here to confirm: {confirmation_url}")
    return {"message": "Registration successful. Account is active for demo."}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not db_user.is_active:
        raise HTTPException(status_code=400, detail="Email not confirmed")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    # Log login action
    audit_log = AuditLog(user_id=db_user.id, action="login", details="User logged in")
    db.add(audit_log)
    db.commit()
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/confirm/{token}")
def confirm_email(token: str, db: Session = Depends(get_db)):
    # For demo, just activate the first inactive user (simplified)
    user = db.query(User).filter(User.is_active == False).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")
    user.is_active = True
    db.commit()
    return {"message": "Email confirmed successfully"}

@router.post("/forgot-password")
def forgot_password(request: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        return {"message": "If the email exists, a reset link has been sent."}
    reset_token = secrets.token_urlsafe(32)
    # In real app, store token in DB with expiry
    reset_url = f"http://localhost:8000/auth/reset-password/{reset_token}"
    send_email(user.email, "Reset your password", f"Click here to reset: {reset_url}")
    return {"message": "If the email exists, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    # Simplified: assume token is valid for first user
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password reset successfully"}
