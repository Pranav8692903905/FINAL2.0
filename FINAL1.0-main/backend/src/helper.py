import fitz  # PyMuPDF
import pdfplumber
import PyPDF2
from pdf2image import convert_from_bytes
import pytesseract
from PIL import Image
from collections import Counter
import json
import os
import re
from typing import List, Tuple
import io

import requests


STOPWORDS = {
    "and", "or", "the", "a", "an", "to", "of", "in", "on", "for", "with", "by", "from",
    "at", "as", "is", "are", "was", "were", "be", "this", "that", "it", "its", "your",
    "you", "we", "they", "their", "our", "have", "has", "had", "will", "can", "may",
    "pdf", "page", "pages"
}

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-haiku-20240307")
OPENROUTER_SITE = os.getenv("OPENROUTER_SITE_URL", "http://localhost")
OPENROUTER_APP = os.getenv("OPENROUTER_APP_NAME", "job-recommender")


def extract_text_from_pdf(uploaded_file):
    """Extract text from a PDF upload using multiple methods with OCR fallback."""
    pdf_bytes = uploaded_file.read()
    text = ""
    
    # Method 1: Try pdfplumber (best for text-based PDFs)
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if text.strip():
            return text
    except Exception as e:
        print(f"pdfplumber extraction failed: {e}")
    
    # Method 2: Try PyMuPDF
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "".join(page.get_text() for page in doc)
        if text.strip():
            return text
    except Exception as e:
        print(f"PyMuPDF extraction failed: {e}")
    
    # Method 3: Try PyPDF2
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        if text.strip():
            return text
    except Exception as e:
        print(f"PyPDF2 extraction failed: {e}")
    
    # Method 4: OCR fallback for image-based PDFs
    print("Text extraction failed, attempting OCR...")
    try:
        images = convert_from_bytes(pdf_bytes, dpi=300)
        text = ""
        for i, image in enumerate(images):
            print(f"Processing page {i+1} with OCR...")
            page_text = pytesseract.image_to_string(image, lang='eng')
            text += page_text + "\n"
        if text.strip():
            return text
    except Exception as e:
        print(f"OCR extraction failed: {e}")
    
    return text


def _sentences(text: str) -> List[str]:
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


def summarize_resume(text: str, max_sentences: int = 5) -> str:
    """Create a better summary focusing on skills, experience, and education"""
    sentences = _sentences(text)
    if not sentences:
        return "No readable text found in resume."
    
    # Try to find key sections
    text_lower = text.lower()
    summary_parts = []
    
    # Look for professional summary or objective
    for i, sent in enumerate(sentences):
        sent_lower = sent.lower()
        if any(keyword in sent_lower for keyword in ['summary', 'objective', 'professional', 'about', 'profile']):
            # Get next few sentences after the header
            summary_parts.extend(sentences[i:i+3])
            break
    
    # If no summary section found, look for experience or skills
    if not summary_parts:
        for i, sent in enumerate(sentences):
            sent_lower = sent.lower()
            if any(keyword in sent_lower for keyword in ['experience', 'skills', 'work', 'developer', 'engineer']):
                summary_parts.extend(sentences[i:i+3])
                break
    
    # Fallback to first few sentences
    if not summary_parts:
        summary_parts = sentences[:max_sentences]
    
    # Clean and join
    summary = " ".join(summary_parts[:max_sentences])
    
    # If summary is too short, add more context
    if len(summary) < 100 and len(sentences) > max_sentences:
        summary = " ".join(sentences[:max_sentences * 2])
    
    return summary[:500]  # Limit to reasonable length


def extract_keywords(text: str, limit: int = 10) -> Tuple[str, List[str]]:
    """Extract keywords with better skill detection, prioritizing technical skills"""
    # Common technical skills and keywords
    skill_patterns = [
        'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
        'node', 'nodejs', 'express', 'django', 'flask', 'fastapi', 
        'mongodb', 'mongo', 'mysql', 'postgresql', 'sql', 'nosql', 'redis',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
        'html', 'css', 'tailwind', 'bootstrap', 'sass',
        'rest', 'api', 'graphql', 'microservices',
        'machine learning', 'ml', 'ai', 'data science', 'nlp',
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
        'ci/cd', 'jenkins', 'github', 'gitlab', 'devops',
        'agile', 'scrum', 'jira', 'testing', 'jest', 'pytest',
        'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
        'frontend', 'backend', 'fullstack', 'full stack', 'full-stack',
        'developer', 'engineer', 'software', 'web', 'mobile',
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    # First, look for specific skills (with whole word matching)
    for skill in skill_patterns:
        # Use word boundaries for whole words, or substring match for compound terms
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower) or skill in text_lower:
            # Normalize skill names
            if skill == 'nodejs' or skill == 'node':
                if 'node' not in found_skills and 'nodejs' not in found_skills:
                    found_skills.append('nodejs')
            elif skill == 'mongo':
                if 'mongodb' not in found_skills:
                    found_skills.append('mongodb')
            elif skill not in found_skills:
                found_skills.append(skill)
    
    # Extract role-related keywords
    role_keywords = []
    if any(word in text_lower for word in ['frontend', 'front-end', 'front end', 'react', 'vue', 'angular']):
        role_keywords.append('frontend developer')
    if any(word in text_lower for word in ['backend', 'back-end', 'back end', 'node', 'django', 'flask']):
        role_keywords.append('backend developer')
    if any(word in text_lower for word in ['fullstack', 'full-stack', 'full stack']) or (
        any(word in text_lower for word in ['react', 'vue', 'angular']) and 
        any(word in text_lower for word in ['node', 'django', 'flask', 'express'])
    ):
        role_keywords.append('fullstack developer')
    if any(word in text_lower for word in ['web developer', 'web development']):
        role_keywords.append('web developer')
    
    # Combine: prioritize found technical skills, then role keywords
    keywords = []
    seen = set()
    
    # Add role keywords first (most important for job search)
    for kw in role_keywords:
        if kw not in seen:
            keywords.append(kw)
            seen.add(kw)
    
    # Add found technical skills
    for skill in found_skills:
        if skill not in seen and len(keywords) < limit * 2:
            keywords.append(skill)
            seen.add(skill)
    
    # If we don't have enough keywords, extract general tokens
    if len(keywords) < limit:
        tokens = re.findall(r"[A-Za-z][A-Za-z0-9_+#/.-]{2,}", text_lower)
        tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 2]
        counts = Counter(tokens)
        
        for token, _ in counts.most_common(limit * 2):
            if token not in seen and len(keywords) < limit * 2:
                keywords.append(token)
                seen.add(token)
    
    return ", ".join(keywords[:limit]), keywords[:limit]


def detect_skill_gaps(tokens: List[str]) -> str:
    """Detect skill gaps across various tech domains"""
    buckets = {
        "frontend": {"react", "vue", "angular", "html", "css", "javascript", "typescript"},
        "backend": {"node", "nodejs", "express", "django", "flask", "fastapi", "spring"},
        "database": {"sql", "mongodb", "postgresql", "mysql", "redis", "nosql"},
        "cloud": {"aws", "azure", "gcp", "docker", "kubernetes"},
        "mlops": {"mlops", "kubeflow", "mlflow", "airflow", "prefect"},
        "llm": {"llm", "rag", "langchain", "llamaindex", "openai"},
        "devops": {"ci/cd", "jenkins", "github", "gitlab", "devops", "git"},
        "testing": {"testing", "jest", "pytest", "selenium", "cypress"},
    }

    missing = []
    token_set = set(tokens)
    
    for label, keywords in buckets.items():
        if token_set.isdisjoint(keywords):
            missing.append(label)

    if not missing:
        return "Strong technical profile with good coverage across key areas."
    
    if len(missing) > 5:
        return "Consider building broader technical skills across frontend, backend, and DevOps."

    readable = {
        "frontend": "Frontend frameworks (React/Vue/Angular)",
        "backend": "Backend frameworks (Node/Django/FastAPI)",
        "database": "Database technologies (SQL/MongoDB)",
        "cloud": "Cloud platforms (AWS/Azure/Docker)",
        "mlops": "MLOps tooling (Kubeflow/MLflow/Airflow)",
        "llm": "LLM development (RAG/LangChain)",
        "devops": "DevOps and CI/CD (Git/Jenkins/GitHub Actions)",
        "testing": "Testing frameworks (Jest/Pytest/Cypress)",
    }
    parts = [readable[m] for m in missing if m in readable]
    return "Skills to consider adding: " + "; ".join(parts[:3])  # Limit to top 3


def build_roadmap(tokens: List[str]) -> str:
    """Build a personalized learning roadmap"""
    roadmap_items = []
    token_set = set(tokens)
    
    # Detect current strengths and suggest next steps
    has_frontend = not token_set.isdisjoint({"react", "vue", "angular", "html", "css", "javascript"})
    has_backend = not token_set.isdisjoint({"node", "nodejs", "express", "django", "flask", "fastapi", "python"})
    has_database = not token_set.isdisjoint({"sql", "mongodb", "postgresql", "mysql"})
    has_cloud = not token_set.isdisjoint({"aws", "azure", "gcp", "docker", "kubernetes"})
    has_testing = not token_set.isdisjoint({"testing", "jest", "pytest", "selenium", "cypress"})
    
    # Build personalized roadmap
    if has_frontend and not has_backend:
        roadmap_items.append("Learn backend development: Build a REST API with Node.js/Express or Python/FastAPI")
    
    if has_backend and not has_frontend:
        roadmap_items.append("Learn modern frontend: Build a responsive web app with React or Vue.js")
    
    if (has_frontend or has_backend) and not has_database:
        roadmap_items.append("Master databases: Learn SQL basics and build a project with MongoDB or PostgreSQL")
    
    if has_frontend and has_backend and not has_cloud:
        roadmap_items.append("Deploy to cloud: Host your full-stack app on AWS/Azure/GCP or containerize with Docker")
    
    if not has_testing:
        roadmap_items.append("Add testing skills: Write unit tests with Jest/Pytest and integration tests")
    
    if token_set.isdisjoint({"git", "github", "gitlab"}):
        roadmap_items.append("Master Git: Contribute to open source projects and build your GitHub profile")
    
    if token_set.isdisjoint({"typescript"}):
        roadmap_items.append("Learn TypeScript: Upgrade your JavaScript projects for better type safety")
    
    # Advanced recommendations for experienced developers
    if has_frontend and has_backend and has_database and has_cloud:
        roadmap_items.append("Build microservices architecture or explore serverless computing")
        roadmap_items.append("Learn system design patterns and contribute to open source projects")
    
    # Generic recommendations if no specific gaps found
    if not roadmap_items:
        roadmap_items.extend([
            "Build a portfolio of 3-5 substantial projects demonstrating your skills",
            "Contribute to open source projects to gain real-world experience",
            "Write technical blog posts or create coding tutorials to share your knowledge",
        ])

    return "\n".join(f"- {item}" for item in roadmap_items[:5])  # Limit to 5 items


def ask_openrouter(prompt: str, max_tokens: int = 500) -> str:
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": OPENROUTER_SITE,
        "X-Title": OPENROUTER_APP,
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a concise resume analyst."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": 0.4,
    }

    resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=40)
    if resp.status_code >= 400:
        raise RuntimeError(f"OpenRouter error {resp.status_code}: {resp.text}")
    data = resp.json()
    return data["choices"][0]["message"]["content"].strip()


def _analyze_with_openrouter(text: str) -> Tuple[str, str, str]:
    prompt = (
        "Analyze this resume text and reply as JSON with keys summary, gaps, roadmap. "
        "Summary should be 3 sentences. Gaps should list missing skills or areas. "
        "Roadmap should be 3 bullet points. Resume text:\n\n" + text
    )
    content = ask_openrouter(prompt, max_tokens=420)
    try:
        parsed = json.loads(content)
        return parsed.get("summary", ""), parsed.get("gaps", ""), parsed.get("roadmap", "")
    except Exception:
        # If not valid JSON, fall back to simple splitting
        parts = content.split("\n")
        summary = parts[0] if parts else content
        gaps = "; ".join(parts[1:3]) if len(parts) > 1 else ""
        roadmap = "\n".join(parts[3:]) if len(parts) > 3 else ""
        return summary, gaps, roadmap


def analyze_resume(text: str) -> Tuple[str, str, str]:
    """Analyze resume and return summary, gaps, and roadmap"""
    text = text.strip()
    if not text:
        return "No readable text found in resume.", "", ""

    if OPENROUTER_API_KEY:
        try:
            return _analyze_with_openrouter(text)
        except Exception:
            pass  # fall back to heuristic path

    # For job matching, we use the full text for keyword extraction
    # but create a readable summary for display
    summary = summarize_resume(text)
    
    # Extract keywords from FULL text, not just summary
    _, tokens = extract_keywords(text, limit=30)
    gaps = detect_skill_gaps(tokens)
    roadmap = build_roadmap(tokens)
    
    return summary, gaps, roadmap


