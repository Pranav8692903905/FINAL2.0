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

# Use the enhanced parser
from resume_parser_enhanced import ResumeParser, ResumeParserEnhanced
from database import Database, ResumeData
from courses import get_courses_by_field, get_personalized_courses
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
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Validate file type (case-insensitive)
        if not file.filename:
            raise HTTPException(status_code=400, detail="Invalid filename")
        
        ext = Path(file.filename).suffix.lower()
        if ext != '.pdf':
            raise HTTPException(status_code=400, detail="Only PDF files are supported. Please upload a .pdf file.")
        
        # Validate file size (max 10MB)
        file_content = await file.read()
        file_size = len(file_content)
        if file_size == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        if file_size > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
        
        # Save uploaded file
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = UPLOAD_DIR / f"{timestamp}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        logger.info(f"File saved: {file_path}")
        
        # Parse resume
        parser = ResumeParser(str(file_path))
        try:
            resume_data = parser.extract_data()
            logger.info(f"Resume parsed successfully: {resume_data['name']}")
        except Exception as parse_err:
            logger.exception("Failed to parse resume")
            raise HTTPException(status_code=400, detail=f"Could not read the PDF: {str(parse_err)}") from parse_err
        
        # Analyze skills and recommend field
        try:
            analysis = parser.analyze_skills(resume_data['skills'])
            logger.info(f"Skills analysis complete: {analysis['field']}")
        except Exception as analysis_err:
            logger.exception("Failed to analyze skills")
            analysis = {'field': 'General IT', 'level': 'Intermediate', 'recommended_skills': []}
        
        # Calculate resume score
        try:
            score = parser.calculate_score(resume_data, analysis)
        except Exception as score_err:
            logger.exception("Failed to calculate score")
            score = 50
        
        # Get personalized course recommendations based on missing skills
        try:
            courses = get_personalized_courses(
                user_skills=resume_data.get('skills', []),
                field=analysis['field'],
                recommended_skills=analysis.get('recommended_skills', []),
                max_courses=8
            )
            logger.info(f"Generated {len(courses)} personalized course recommendations")
        except Exception as course_err:
            logger.exception("Failed to get personalized courses, falling back to field courses")
            courses = get_courses_by_field(analysis['field'])
        
        # Prepare response
        # Basic field validations
        def _is_valid_email(email: str) -> bool:
            if not email or not isinstance(email, str):
                return False
            import re
            return re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email) is not None

        def _is_valid_phone(phone: str) -> bool:
            if not phone or not isinstance(phone, str):
                return False
            digits = "".join(ch for ch in phone if ch.isdigit())
            # Consider valid if 10-14 digits
            return 10 <= len(digits) <= 14

        def _is_valid_name(name: str) -> bool:
            if not name or not isinstance(name, str):
                return False
            import re
            if name.strip().lower() in {"unknown", "professional", "n/a"}:
                return False
            if any(ch.isdigit() for ch in name):
                return False
            # Must contain letters and at least one space or be 3+ letters
            letters = re.sub(r"[^A-Za-z\s]", "", name).strip()
            return bool(letters) and (" " in letters or len(letters) >= 3)

        validations = {
            "name": _is_valid_name(resume_data.get('name')),
            "email": _is_valid_email(resume_data.get('email')),
            "phone": _is_valid_phone(resume_data.get('phone')),
        }

        response_data = {
            "name": resume_data.get('name', 'Unknown'),
            "email": resume_data.get('email', 'N/A'),
            "phone": resume_data.get('phone', 'N/A'),
            "pages": resume_data.get('pages', 1),
            "skills": resume_data.get('skills', []),
            "experience": resume_data.get('experience', 'Fresher'),
            "education": resume_data.get('education', []),
            "score": score,
            "level": analysis.get('level', 'Fresher'),
            "field": analysis.get('field', 'General IT'),
            "recommended_skills": analysis.get('recommended_skills', []),
            "courses": courses[:8] if courses else [],  # Up to 8 personalized courses
            "filename": file.filename,
            "validations": validations,
        }
        
        # Save to database (non-blocking)
        try:
            db.insert_resume_data(ResumeData(
                name=response_data['name'],
                email=response_data['email'],
                resume_score=score,
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                page_no=response_data['pages'],
                predicted_field=response_data['field'],
                user_level=response_data['level'],
                actual_skills=", ".join(response_data['skills']) if response_data['skills'] else "",
                recommended_skills=", ".join(response_data['recommended_skills']) if response_data['recommended_skills'] else "",
                recommended_courses=", ".join([c['name'] for c in courses[:5]]) if courses else ""
            ))
            logger.info(f"Resume data saved to database: {response_data['name']}")
        except Exception as db_err:
            logger.warning(f"Database insert failed (non-critical): {str(db_err)}")
        
        return JSONResponse(content=response_data, status_code=200)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unhandled error while analyzing resume")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e

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
async def extract_keywords_endpoint(body: KeywordsIn):
    """Extract keywords from resume summary"""
    keywords, _ = local_extract_keywords(body.summary, limit=12)
    return {"keywords": keywords}

@app.post("/api/extract-skills")
async def extract_skills_from_resume(file: UploadFile = File(...)):
    """Extract skills and keywords directly from resume file"""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    data = await file.read()

    class _U:
        def __init__(self, b: bytes):
            self._b = b
        def read(self):
            return self._b

    resume_text = extract_text_from_pdf(_U(data))
    keywords, keyword_list = local_extract_keywords(resume_text, limit=12)
    return {"keywords": keywords, "keyword_list": keyword_list}

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
