from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from backend.routers import tracker, scraper, apply, profile

app = FastAPI(
    title="AI Job Search Engine Gateway",
    description="Backend API Gateway bridging the ai-job-search agentic engine to modern frontend",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tracker.router)
app.include_router(scraper.router)
app.include_router(apply.router)
app.include_router(profile.router)

# Mount documents and cv directories for serving compiled PDFs
cv_dir = Path("cv")
if cv_dir.exists():
    app.mount("/static/cv", StaticFiles(directory="cv"), name="cv")

cover_dir = Path("cover_letters")
if cover_dir.exists():
    app.mount("/static/cover_letters", StaticFiles(directory="cover_letters"), name="cover_letters")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "ai-job-search",
        "candidate": "Niloy Sannyal"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
