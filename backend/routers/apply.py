import json
import os
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/apply", tags=["Application Studio"])

PYTHON_EXE = os.path.abspath(".venv/Scripts/python.exe")
if not os.path.exists(PYTHON_EXE):
    PYTHON_EXE = "python"

POSTING_GUARD = Path("tools/posting_guard.py")
VERIFY_PDF = Path("tools/verify_pdf.py")
VERIFY_LAYOUT = Path("tools/verify_layout.py")

class GuardRequest(BaseModel):
    text: str

class FitEvaluationRequest(BaseModel):
    posting_text: str
    company_name: str
    role_title: str

@router.post("/guard")
def run_posting_guard(req: GuardRequest):
    """
    Runs tools/posting_guard.py to sanitize posting and detect prompt injections or hidden text.
    """
    cmd = [PYTHON_EXE, str(POSTING_GUARD), "--text", "--json"]
    try:
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8"
        )
        stdout, stderr = proc.communicate(input=req.text)
        
        # Parse stdout: verdict line, findings JSON block, cleaned text
        verdict = "clean"
        findings = {}
        cleaned_text = req.text
        
        lines = stdout.splitlines()
        if lines:
            verdict = lines[0].strip()
            
        if "--- findings ---" in stdout and "--- text ---" in stdout:
            parts = stdout.split("--- findings ---")
            subparts = parts[1].split("--- text ---")
            findings_json = subparts[0].strip()
            cleaned_text = subparts[1].strip()
            try:
                findings = json.loads(findings_json)
            except Exception:
                findings = {"raw": findings_json}
                
        return {
            "verdict": verdict,
            "is_clean": "clean" in verdict.lower(),
            "findings": findings,
            "cleaned_text": cleaned_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Posting guard error: {e}")

@router.post("/evaluate")
def evaluate_job_fit(req: FitEvaluationRequest):
    """
    Evaluates job fit against candidate profile dimensions.
    """
    text = req.posting_text.lower()
    
    # 1. Technical Skills Match
    core_skills = ["python", "ai", "llm", "rag", "fastapi", "docker", "qdrant", "redis", "machine learning"]
    matched_skills = [s for s in core_skills if s in text]
    tech_score = min(100, int((len(matched_skills) / max(1, len(core_skills) * 0.6)) * 100))
    
    # 2. Location / Logistics
    location_pass = True
    location_notes = "Remote or Local Eligible"
    if "must relocate" in text or "on-site only" in text and "dhaka" not in text:
        location_pass = False
        location_notes = "Requires on-site relocation outside Bangladesh without explicit sponsorship"
        
    # 3. Language Gate
    language_gate = "PASS"
    language_notes = "English / Bengali requirements aligned"
    if "fluent german" in text or "fluent french" in text or "fluent japanese" in text:
        language_gate = "FAIL"
        language_notes = "Posting requires an undeclared language as a mandatory condition"
        
    overall_score = int(tech_score * 0.6 + (90 if location_pass else 20) * 0.4)
    
    return {
        "company": req.company_name,
        "role": req.role_title,
        "overall_score": overall_score,
        "dimensions": {
            "technical_skills": {
                "score": tech_score,
                "matched": matched_skills,
                "notes": f"Matched {len(matched_skills)} core technical competencies"
            },
            "location_logistics": {
                "verdict": "PASS" if location_pass else "FAIL",
                "notes": location_notes
            },
            "language_gate": {
                "verdict": language_gate,
                "notes": language_notes
            }
        },
        "recommendation": "Strong Fit" if overall_score >= 80 else ("Moderate Fit" if overall_score >= 60 else "Low Fit")
    }
