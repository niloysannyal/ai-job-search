from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/profile", tags=["Profile"])

CLAUDE_MD = Path("CLAUDE.md")
CANDIDATE_PROFILE = Path(".claude/skills/job-application-assistant/01-candidate-profile.md")
SEARCH_QUERIES = Path(".claude/skills/job-scraper/search-queries.md")

class UpdateMarkdownRequest(BaseModel):
    content: str

@router.get("")
def get_profile():
    if not CLAUDE_MD.exists():
        raise HTTPException(status_code=404, detail="CLAUDE.md not found")
    with open(CLAUDE_MD, "r", encoding="utf-8") as f:
        claude_content = f.read()
        
    candidate_content = ""
    if CANDIDATE_PROFILE.exists():
        with open(CANDIDATE_PROFILE, "r", encoding="utf-8") as f:
            candidate_content = f.read()
            
    return {
        "claude_md": claude_content,
        "candidate_profile": candidate_content
    }

@router.put("")
def update_profile(req: UpdateMarkdownRequest):
    with open(CLAUDE_MD, "w", encoding="utf-8") as f:
        f.write(req.content)
    return {"status": "success", "file": "CLAUDE.md"}

@router.get("/queries")
def get_queries():
    if not SEARCH_QUERIES.exists():
        raise HTTPException(status_code=404, detail="search-queries.md not found")
    with open(SEARCH_QUERIES, "r", encoding="utf-8") as f:
        return {"content": f.read()}

@router.put("/queries")
def update_queries(req: UpdateMarkdownRequest):
    with open(SEARCH_QUERIES, "w", encoding="utf-8") as f:
        f.write(req.content)
    return {"status": "success", "file": "search-queries.md"}
