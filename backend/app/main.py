from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth_router, notes_router, admin_router

app = FastAPI(
    title="Notes App API",
    description="A production-ready SaaS Notes application with authentication and RBAC",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(notes_router, prefix="/notes", tags=["Notes"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Notes App API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
