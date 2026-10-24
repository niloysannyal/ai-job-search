import json
import os
import subprocess
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api/scraper", tags=["Scraper"])

BUN_PATH = os.path.expanduser("~\\.bun\\bin\\bun.exe")
if not os.path.exists(BUN_PATH):
    BUN_PATH = "bun"

LINKEDIN_CLI = Path(".agents/skills/linkedin-search/cli/src/cli.ts")
FREEHIRE_CLI = Path(".agents/skills/freehire-search/cli/src/cli.ts")

class ScrapeRequest(BaseModel):
    query: str = "AI Engineer"
    location: str = "Remote"
    portal: str = "linkedin"  # 'linkedin' or 'freehire'
    limit: int = 15

class ScrapedJob(BaseModel):
    id: str
    title: str
    company: str
    location: str
    date: Optional[str] = ""
    url: str
    portal: str

def execute_cli(cmd: List[str]) -> str:
    env = os.environ.copy()
    bun_dir = os.path.expanduser("~\\.bun\\bin")
    if bun_dir not in env.get("PATH", ""):
        env["PATH"] = f"{bun_dir};{env.get('PATH', '')}"
        
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
            cwd=str(Path.cwd()),
            env=env
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500,
            detail=f"CLI failed with exit code {e.returncode}: {e.stderr}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search", response_model=List[ScrapedJob])
def search_jobs(req: ScrapeRequest):
    jobs = []
    if req.portal.lower() == "linkedin":
        cmd = [
            BUN_PATH, "run", str(LINKEDIN_CLI),
            "search",
            "-q", req.query,
            "-l", req.location,
            "--limit", str(req.limit),
            "--format", "json"
        ]
        out = execute_cli(cmd)
        try:
            data = json.loads(out)
            results = data.get("results", [])
            for r in results:
                jobs.append(ScrapedJob(
                    id=str(r.get("id", "")),
                    title=r.get("title", ""),
                    company=r.get("company", ""),
                    location=r.get("location", ""),
                    date=r.get("date", ""),
                    url=r.get("url", ""),
                    portal="linkedin"
                ))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse LinkedIn results: {e}")

    elif req.portal.lower() == "freehire":
        cmd = [
            BUN_PATH, "run", str(FREEHIRE_CLI),
            "search",
            "--query", req.query,
            "--limit", str(req.limit),
            "--format", "json"
        ]
        if "remote" in req.location.lower():
            cmd.append("--remote")
            
        out = execute_cli(cmd)
        try:
            data = json.loads(out)
            results = data.get("results", [])
            for r in results:
                jobs.append(ScrapedJob(
                    id=str(r.get("slug", r.get("id", ""))),
                    title=r.get("title", ""),
                    company=r.get("company", ""),
                    location=r.get("location", ""),
                    date=r.get("date", ""),
                    url=r.get("url", ""),
                    portal="freehire"
                ))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse FreeHire results: {e}")
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported portal: {req.portal}")

    return jobs

@router.get("/detail")
def get_job_detail(url: str = Query(..., description="Job posting URL"), portal: str = Query("linkedin")):
    if portal.lower() == "linkedin":
        cmd = [
            BUN_PATH, "run", str(LINKEDIN_CLI),
            "detail", url,
            "--format", "json"
        ]
        out = execute_cli(cmd)
        try:
            return json.loads(out)
        except Exception:
            return {"raw": out}
    elif portal.lower() == "freehire":
        cmd = [
            BUN_PATH, "run", str(FREEHIRE_CLI),
            "detail", url,
            "--format", "json"
        ]
        out = execute_cli(cmd)
        try:
            return json.loads(out)
        except Exception:
            return {"raw": out}
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported portal: {portal}")
