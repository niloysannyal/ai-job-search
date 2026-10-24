import csv
import os
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/tracker", tags=["Tracker"])

TRACKER_FILE = Path("job_search_tracker.csv")
FIELDNAMES = [
    "date", "company", "sector", "role", "role_type", "channel",
    "status", "contact_person", "fit_rating", "notes",
    "cv_file", "cover_letter_file", "source", "deadline"
]

class TrackerItem(BaseModel):
    id: Optional[str] = None
    date: str = ""
    company: str
    sector: Optional[str] = ""
    role: str
    role_type: Optional[str] = ""
    channel: Optional[str] = ""
    status: str = "drafted"
    contact_person: Optional[str] = ""
    fit_rating: Optional[str] = ""
    notes: Optional[str] = ""
    cv_file: Optional[str] = ""
    cover_letter_file: Optional[str] = ""
    source: Optional[str] = ""
    deadline: Optional[str] = ""

class UpdateTrackerItem(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    deadline: Optional[str] = None
    fit_rating: Optional[str] = None

def ensure_tracker_file():
    if not TRACKER_FILE.exists():
        with open(TRACKER_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()

def read_all_rows() -> List[dict]:
    ensure_tracker_file()
    rows = []
    with open(TRACKER_FILE, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            row_dict = dict(row)
            row_dict["id"] = f"{row_dict.get('company', '')}_{row_dict.get('role', '')}_{idx}"
            rows.append(row_dict)
    return rows

def write_all_rows(rows: List[dict]):
    clean_rows = []
    for r in rows:
        clean = {k: r.get(k, "") for k in FIELDNAMES}
        clean_rows.append(clean)
    with open(TRACKER_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(clean_rows)

@router.get("", response_model=List[TrackerItem])
def get_tracker_items():
    rows = read_all_rows()
    return rows

@router.post("", response_model=TrackerItem)
def create_tracker_item(item: TrackerItem):
    rows = read_all_rows()
    item_dict = item.model_dump()
    item_dict.pop("id", None)
    rows.append(item_dict)
    write_all_rows(rows)
    item_dict["id"] = f"{item_dict.get('company')}_{item_dict.get('role')}_{len(rows)-1}"
    return item_dict

@router.patch("/{item_id}")
def update_tracker_item(item_id: str, updates: UpdateTrackerItem):
    rows = read_all_rows()
    found = False
    for r in rows:
        if r.get("id") == item_id:
            found = True
            update_data = updates.model_dump(exclude_unset=True)
            for k, v in update_data.items():
                if v is not None:
                    r[k] = str(v)
            break
    if not found:
        raise HTTPException(status_code=404, detail="Tracker item not found")
    write_all_rows(rows)
    return {"status": "success", "id": item_id}

@router.get("/stats")
def get_tracker_stats():
    rows = read_all_rows()
    total = len(rows)
    status_counts = {}
    channel_counts = {}
    scores = []
    
    for r in rows:
        st = r.get("status", "drafted").lower()
        status_counts[st] = status_counts.get(st, 0) + 1
        ch = r.get("channel", "unknown") or "unknown"
        channel_counts[ch] = channel_counts.get(ch, 0) + 1
        fit = r.get("fit_rating", "")
        if fit and fit.isdigit():
            scores.append(int(fit))
            
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    interviews = status_counts.get("interview", 0) + status_counts.get("screening", 0)
    offers = status_counts.get("offer", 0) + status_counts.get("hired", 0)
    
    return {
        "total_applications": total,
        "interviews_count": interviews,
        "offers_count": offers,
        "average_fit_score": avg_score,
        "status_breakdown": status_counts,
        "channel_breakdown": channel_counts
    }
