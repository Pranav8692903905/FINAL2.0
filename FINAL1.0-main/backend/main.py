from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import os
import shutil
import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
import mysql.connector

from resume_parser import ResumeParser
from database import Database, ResumeData
from courses import get_courses_by_field
from src.helper import extract_text_from_pdf, extract_keywords as local_extract_keywords, analyze_resume as run_analysis
from src.job_api import fetch_rss_jobs
from pydantic import BaseModel

load_dotenv()

BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploaded_resumes"
DB_PATH = BASE_DIR / "resume_analyzer.db"


def get_mysql_config() -> Optional[dict]:
    host = os.getenv("MYSQL_HOST")
    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD", "")
    database = os.getenv("MYSQL_DB") or os.getenv("MYSQL_DATABASE")
    port = int(os.getenv("MYSQL_PORT", "3306"))
    if host and user and database:
        return {
            "host": host,
            "user": user,
            "password": password,
            "database": database,
            "port": port,
        }
    return None


mysql_cfg = get_mysql_config()


def ensure_mysql_database(cfg: Optional[dict]):
    """Ensure MySQL database exists before connecting"""
    if not cfg:
        return
    db_name = cfg.get("database")
    base_cfg = {k: v for k, v in cfg.items() if k != "database"}
    try:
        conn = mysql.connector.connect(**base_cfg)
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` DEFAULT CHARACTER SET utf8mb4")
        conn.commit()
    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass


ensure_mysql_database(mysql_cfg)

# Initialize database (MySQL if configured, else SQLite)
db = Database(str(DB_PATH), mysql_config=mysql_cfg)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan manager to init and cleanup resources"""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    db.create_tables()
    yield
    db.close()


app = FastAPI(title="Smart Resume Analyzer API", lifespan=lifespan)

logger = logging.getLogger("resume_analyzer")
logging.basicConfig(level=logging.INFO)

# Enable CORS
# CORS: allow all origins so forwarded URLs (Codespaces/preview) work
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Smart Resume Analyzer API", "status": "running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze resume"""
    try:
        # Validate file type (case-insensitive)
        ext = Path(file.filename).suffix.lower()
        if ext != '.pdf':
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse resume
        parser = ResumeParser(str(file_path))
        try:
            resume_data = parser.extract_data()
        except Exception as parse_err:
            logger.exception("Failed to parse resume")
            raise HTTPException(status_code=400, detail="Could not read the PDF. Ensure it is not password-protected or corrupted.") from parse_err
        
        # Analyze skills and recommend field
        analysis = parser.analyze_skills(resume_data['skills'])
        
        # Calculate resume score
        score = parser.calculate_score(resume_data, analysis)
        
        # Get recommended courses
        courses = get_courses_by_field(analysis['field'])
        
        # Prepare response
        response_data = {
            "name": resume_data['name'],
            "email": resume_data['email'],
            "phone": resume_data['phone'],
            "pages": resume_data['pages'],
            "skills": resume_data['skills'],
            "experience": resume_data['experience'],
            "education": resume_data['education'],
            "score": score,
            "level": analysis['level'],
            "field": analysis['field'],
            "recommended_skills": analysis['recommended_skills'],
            "courses": courses[:5],
            "filename": file.filename
        }
        
        # Save to database
        try:
            db.insert_resume_data(ResumeData(
                name=resume_data['name'],
                email=resume_data['email'],
                resume_score=score,
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                page_no=resume_data['pages'],
                predicted_field=analysis['field'],
                user_level=analysis['level'],
                actual_skills=", ".join(resume_data['skills']),
                recommended_skills=", ".join(analysis['recommended_skills']),
                recommended_courses=", ".join([c['name'] for c in courses[:5]])
            ))
        except Exception as db_err:
            logger.exception("Database insert failed")
            raise HTTPException(status_code=500, detail="Database error while saving analysis. Please try again.") from db_err
        
        return JSONResponse(content=response_data)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unhandled error while analyzing resume")
        raise HTTPException(status_code=500, detail="Internal error while analyzing the resume") from e

@app.get("/admin/stats")
async def get_stats():
    """Get admin statistics"""
    try:
        stats = db.get_statistics()
        return JSONResponse(content=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/resumes")
async def get_all_resumes():
    """Get all resume data for admin"""
    try:
        resumes = db.get_all_resumes()
        return JSONResponse(content={"resumes": resumes})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/courses/{field}")
async def get_courses(field: str):
    """Get courses for a specific field"""
    try:
        courses = get_courses_by_field(field)
        return JSONResponse(content={"courses": courses})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Job Recommendation Endpoints
class KeywordsIn(BaseModel):
    summary: str

class Job(BaseModel):
    title: str
    companyName: str
    location: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None

class AnalysisOut(BaseModel):
    summary: str
    gaps: str
    roadmap: str

class JobsOut(BaseModel):
    jobs: List[Job]

@app.post("/api/analyze/resume", response_model=AnalysisOut)
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    """Analyze resume for job matching"""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    data = await file.read()

    class _U:
        def __init__(self, b: bytes):
            self._b = b
        def read(self):
            return self._b

    resume_text = extract_text_from_pdf(_U(data))
    summary, gaps, roadmap = run_analysis(resume_text)
    return AnalysisOut(summary=summary, gaps=gaps, roadmap=roadmap)

@app.post("/api/keywords")
async def extract_keywords(body: KeywordsIn):
    """Extract keywords from resume summary"""
    keywords, _ = local_extract_keywords(body.summary, limit=12)
    return {"keywords": keywords}

@app.get("/api/jobs", response_model=JobsOut)
async def get_jobs(keywords: str, rows: int = 60):
    """Get job recommendations based on keywords"""
    try:
        jobs = fetch_rss_jobs(keywords, rows=rows)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job search failed: {e}")

    def map_job(j: dict) -> Job:
        return Job(
            title=j.get("title", ""),
            companyName=j.get("companyName", ""),
            location=j.get("location") or j.get("place") or j.get("city"),
            url=j.get("url") or j.get("link"),
            source=j.get("source"),
        )

    return JobsOut(jobs=[map_job(j) for j in jobs])

@app.get("/api/health")
async def health():
    """Health check for job recommendation service"""
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
