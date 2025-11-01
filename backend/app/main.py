from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, notes, admin
from app.database import engine
from app.models import Base

# Create tables (for development; in production use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes SaaS API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Notes SaaS API"}
