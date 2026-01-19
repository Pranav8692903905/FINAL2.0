"""
Enhanced Resume Parser with OCR support
Handles PDF text extraction using multiple methods including OCR
"""

import PyPDF2
import re
from typing import Dict, List, Optional, Tuple
import logging
from pathlib import Path
import json

# PDF and Image processing
try:
    import fitz
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False
    
try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

try:
    import pytesseract
    from pdf2image import convert_from_path
    HAS_OCR = True
except ImportError:
    HAS_OCR = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

import io

logger = logging.getLogger(__name__)

class ResumeParserEnhanced:
    """Enhanced resume parser with OCR and multi-method text extraction"""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.text = None
        self.metadata = {}
        
    def extract_data(self) -> Dict:
        """Extract all resume data"""
        logger.info(f"Extracting data from: {self.file_path}")
        
        # Extract text
        self.text = self.extract_text()
        if not self.text or len(self.text.strip()) < 20:
            raise ValueError("Could not extract text from PDF")
        
        logger.info(f"✅ Extracted {len(self.text)} characters from PDF")
        
        # Parse structured data
        data = {
            'name': self.extract_name(self.text),
            'email': self.extract_email(self.text),
            'phone': self.extract_phone(self.text),
            'skills': self.extract_skills(self.text),
            'education': self.extract_education(self.text),
            'experience': self.extract_experience_level(self.text),
            'pages': self.count_pdf_pages(),
            'text': self.text[:2000]  # First 2000 chars for analysis
        }
        
        logger.info(f"Extracted data: Name={data['name']}, Email={data['email']}, Skills count={len(data['skills'])}")
        return data
    
    def count_pdf_pages(self) -> int:
        """Count pages in PDF"""
        try:
            if HAS_PYMUPDF:
                doc = fitz.open(self.file_path)
                pages = len(doc)
                doc.close()
                return pages
        except Exception as e:
            logger.warning(f"Could not count pages: {e}")
        
        try:
            with open(self.file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                return len(reader.pages)
        except Exception as e:
            logger.warning(f"PyPDF2 page count failed: {e}")
        
        return 1
    
    def extract_text(self) -> str:
        """Extract text from PDF with multiple fallback methods"""
        text = ""
        
        # Method 1: pdfplumber (best for structured content)
        if HAS_PDFPLUMBER:
            try:
                logger.info("Trying pdfplumber extraction...")
                with pdfplumber.open(self.file_path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                            logger.info(f"pdfplumber page {i+1}: {len(page_text)} chars")
                
                if len(text.strip()) > 100:
                    logger.info(f"✅ pdfplumber: {len(text)} chars extracted")
                    return text
            except Exception as e:
                logger.warning(f"pdfplumber failed: {e}")
                text = ""
        
        # Method 2: PyMuPDF (fitz)
        if HAS_PYMUPDF:
            try:
                logger.info("Trying PyMuPDF extraction...")
                doc = fitz.open(self.file_path)
                for i in range(len(doc)):
                    page = doc[i]
                    page_text = page.get_text("text")
                    if page_text:
                        text += page_text + "\n"
                        logger.info(f"PyMuPDF page {i+1}: {len(page_text)} chars")
                
                doc.close()
                if len(text.strip()) > 100:
                    logger.info(f"✅ PyMuPDF: {len(text)} chars extracted")
                    return text
            except Exception as e:
                logger.warning(f"PyMuPDF failed: {e}")
                text = ""
        
        # Method 3: PyPDF2 (fallback)
        try:
            logger.info("Trying PyPDF2 extraction...")
            with open(self.file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                        logger.info(f"PyPDF2 page {i+1}: {len(page_text)} chars")
            
            if len(text.strip()) > 100:
                logger.info(f"✅ PyPDF2: {len(text)} chars extracted")
                return text
        except Exception as e:
            logger.warning(f"PyPDF2 failed: {e}")
        
        # Method 4: OCR as last resort
        if len(text.strip()) < 50 and HAS_OCR and HAS_PYMUPDF:
            logger.warning("Text extraction failed, attempting OCR...")
            return self.extract_text_ocr()
        
        return text
    
    def extract_text_ocr(self) -> str:
        """Extract text using OCR for image-based PDFs"""
        try:
            logger.info("🔍 Starting OCR extraction...")
            
            if HAS_PYMUPDF:
                doc = fitz.open(self.file_path)
                text = ""
                
                for page_num in range(len(doc)):
                    try:
                        page = doc[page_num]
                        # Convert page to high-resolution image
                        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                        img_data = pix.tobytes("png")
                        img = Image.open(io.BytesIO(img_data))
                        
                        # OCR
                        page_text = pytesseract.image_to_string(img, lang='eng')
                        text += page_text + "\n"
                        logger.info(f"OCR page {page_num+1}: {len(page_text)} chars")
                    except Exception as page_err:
                        logger.warning(f"OCR page {page_num+1} failed: {page_err}")
                
                doc.close()
                
                if len(text.strip()) > 50:
                    logger.info(f"✅ OCR: {len(text)} chars extracted")
                    return text
            
            # Alternative: pdf2image
            elif HAS_OCR:
                logger.info("Using pdf2image for OCR...")
                images = convert_from_path(self.file_path, dpi=300)
                text = ""
                
                for i, image in enumerate(images[:5]):  # Limit to first 5 pages
                    page_text = pytesseract.image_to_string(image, lang='eng')
                    text += page_text + "\n"
                    logger.info(f"OCR page {i+1}: {len(page_text)} chars")
                
                if len(text.strip()) > 50:
                    logger.info(f"✅ OCR: {len(text)} chars extracted")
                    return text
        
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
        
        return ""
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email address"""
        text_clean = text.replace('\n', ' ').replace('\r', ' ')
        
        patterns = [
            r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_clean, re.IGNORECASE)
            if matches:
                email = matches[0].strip().lower()
                logger.info(f"Found email: {email}")
                return email
        
        logger.info("No email found")
        return None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number"""
        text_clean = text.replace('\n', ' ').replace('\r', ' ')
        
        patterns = [
            r'\+?1?\s*\(?[0-9]{3}\)?\s*[-.\s]?[0-9]{3}\s*[-.\s]?[0-9]{4}',
            r'\+?\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}',
            r'\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}',
            r'\+\d{1,3}\s?\d{9,}',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_clean)
            if matches:
                phone = matches[0].strip()
                logger.info(f"Found phone: {phone}")
                return phone
        
        logger.info("No phone found")
        return None
    
    def extract_name(self, text: str) -> str:
        """Extract name from resume - Enhanced to handle various formats"""
        lines = text.split('\n')
        
        skip_words = {
            'resume', 'cv', 'curriculum', 'contact', 'email', 'phone',
            'summary', 'objective', 'experience', 'education', 'skills',
            'technical', 'certifications', 'projects', 'references', 'profile',
            'github', 'linkedin', 'website', 'portfolio', 'professional summary',
            'work experience', 'personal details', 'about me'
        }
        
        for line in lines[:25]:
            line = line.strip()
            
            # Skip empty lines
            if not line or len(line) < 2 or len(line) > 80:
                continue
            
            # Skip if contains emails, URLs, phone numbers
            if '@' in line or 'http' in line.lower() or '.com' in line.lower():
                continue
            
            # Skip if contains numbers (likely not a name)
            if re.search(r'\d', line):
                continue
            
            # Skip if contains social media
            if 'github' in line.lower() or 'linkedin' in line.lower() or 'portfolio' in line.lower():
                continue
            
            words = line.split()
            
            # Name should have 1-4 words
            if not (1 <= len(words) <= 4):
                continue
            
            # Skip if contains special characters (except hyphens, apostrophes, spaces)
            if re.search(r'[#$%^&*+=<>{}[\]\\|:;,.]', line):
                continue
            
            # Skip common headers
            if line.lower() in skip_words or any(skip in line.lower() for skip in ['summary', 'objective', 'experience', 'work experience']):
                continue
            
            # Check if all words are alphabetic (allowing hyphens)
            if not all(word.replace('-', '').replace("'", "").isalpha() for word in words):
                continue
            
            # Special handling for all-caps names (common in resumes)
            if line.isupper():
                # Check if it looks like a name (2-4 words, all letters)
                if 2 <= len(words) <= 4:
                    # Convert to title case for better display
                    formatted_name = ' '.join(word.capitalize() for word in words)
                    logger.info(f"Found name (all-caps): {formatted_name}")
                    return formatted_name
                continue
            
            # Handle names with first letter capitalized (common format)
            # E.g., "Pranav vishwakarama" or "John doe"
            if any(word[0].isupper() for word in words if word):
                # Format properly: Title Case
                formatted_name = ' '.join(word.capitalize() for word in words)
                logger.info(f"Found name (mixed case): {formatted_name}")
                return formatted_name
        
        logger.info("Name not found, using default")
        return "Professional"
    
    def extract_education(self, text: str) -> List[str]:
        """Extract education qualifications"""
        education = []
        
        degrees = {
            'phd': r'(?:phd|p\.h\.d|doctor(?:al|ate)?)',
            'masters': r'(?:masters?|m\.(?:tech|tech|s|ba|sc)|mtech)',
            'bachelors': r'(?:bachelor(?:s)?|b\.(?:tech|a|sc)|btech|b\.s|b\.a)',
            'diploma': r'(?:diploma|dip)',
        }
        
        text_lower = text.lower()
        
        for degree, pattern in degrees.items():
            if re.search(pattern, text_lower):
                education.append(degree.capitalize())
        
        if not education:
            education = ['Graduate']
        
        logger.info(f"Found education: {education}")
        return education
    
    def extract_experience_level(self, text: str) -> str:
        """Determine experience level"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['fresher', 'entry level', 'entry-level', 'junior', 'trainee']):
            return "Fresher"
        elif any(word in text_lower for word in ['senior', 'lead', 'principal', '10+ years', '8+ years', '7+ years']):
            return "Senior"
        elif any(word in text_lower for word in ['mid-level', 'mid level', 'intermediate', '4+ years', '5+ years', '6+ years']):
            return "Mid-Level"
        else:
            return "Intermediate"
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from resume"""
        text_lower = text.lower()
        
        # Comprehensive skill list
        skills_dict = {
            'Python': ['python', 'py', 'python3'],
            'JavaScript': ['javascript', 'js', 'es6', 'node.js', 'nodejs'],
            'TypeScript': ['typescript', 'ts'],
            'Java': ['java', 'j2ee', 'java8', 'jdk'],
            'C++': ['c\\+\\+', 'cpp', 'c plus plus'],
            'C#': ['c#', 'csharp'],
            'React': ['react', 'reactjs', 'react.js', 'jsx'],
            'Angular': ['angular', 'angularjs'],
            'Vue': ['vue', 'vuejs'],
            'Next.js': ['next.js', 'nextjs'],
            'Node.js': ['node.js', 'nodejs', 'npm'],
            'Django': ['django', 'django rest'],
            'Flask': ['flask'],
            'FastAPI': ['fastapi'],
            'Spring': ['spring', 'spring boot'],
            'SQL': ['sql', 'mysql', 'postgresql', 'oracle'],
            'MongoDB': ['mongodb', 'mongo'],
            'PostgreSQL': ['postgresql', 'postgres', 'psql'],
            'Docker': ['docker'],
            'Kubernetes': ['kubernetes', 'k8s'],
            'AWS': ['aws', 'amazon web services'],
            'Azure': ['azure'],
            'GCP': ['gcp', 'google cloud'],
            'Git': ['git', 'github', 'gitlab'],
            'Machine Learning': ['machine learning', 'ml', 'tensorflow', 'pytorch', 'keras'],
            'Data Science': ['data science', 'pandas', 'numpy', 'scipy'],
            'REST API': ['rest', 'restful', 'api', 'graphql'],
            'HTML': ['html', 'html5'],
            'CSS': ['css', 'css3', 'scss'],
            'Tableau': ['tableau'],
            'Power BI': ['power bi', 'powerbi'],
            'Agile': ['agile', 'scrum', 'kanban'],
            'Linux': ['linux', 'ubuntu', 'centos'],
            'Windows': ['windows'],
            'iOS': ['ios', 'swift'],
            'Android': ['android', 'kotlin'],
        }
        
        found_skills = []
        
        for skill, patterns in skills_dict.items():
            for pattern in patterns:
                if re.search(r'\b' + pattern + r'\b', text_lower):
                    found_skills.append(skill)
                    break
        
        # Remove duplicates while preserving order
        found_skills = list(dict.fromkeys(found_skills))
        
        logger.info(f"Found {len(found_skills)} skills: {found_skills}")
        return found_skills
    
    def analyze_skills(self, skills: List[str]) -> Dict:
        """Analyze skills and recommend field"""
        skill_set = set(s.lower() for s in skills)
        
        categories = {
            'Web Development': {'javascript', 'react', 'angular', 'vue', 'node.js', 'html', 'css'},
            'Backend Development': {'python', 'java', 'c#', 'django', 'flask', 'spring'},
            'Data Science': {'python', 'machine learning', 'data science', 'pandas', 'numpy'},
            'DevOps': {'docker', 'kubernetes', 'aws', 'linux', 'git'},
            'Mobile Development': {'ios', 'android', 'swift', 'kotlin'},
            'Full Stack': {'javascript', 'python', 'react', 'node.js', 'sql'},
        }
        
        field = "General IT"
        max_matches = 0
        
        for category, category_skills in categories.items():
            matches = len(skill_set & category_skills)
            if matches > max_matches:
                max_matches = matches
                field = category
        
        # Determine level
        if len(skills) >= 15:
            level = "Senior"
        elif len(skills) >= 8:
            level = "Intermediate"
        else:
            level = "Fresher"
        
        recommended = []
        if 'docker' not in skill_set:
            recommended.append('Docker')
        if 'git' not in skill_set:
            recommended.append('Git')
        if 'sql' not in skill_set:
            recommended.append('SQL')
        
        logger.info(f"Analysis: field={field}, level={level}, recommended={recommended}")
        
        return {
            'field': field,
            'level': level,
            'recommended_skills': recommended
        }
    
    def calculate_score(self, resume_data: Dict, analysis: Dict) -> int:
        """Calculate resume score out of 100"""
        score = 50  # Base score
        
        # Contact info points
        if resume_data.get('email'):
            score += 10
        if resume_data.get('phone'):
            score += 10
        
        # Skills points
        skills_count = len(resume_data.get('skills', []))
        if skills_count >= 10:
            score += 20
        elif skills_count >= 5:
            score += 15
        elif skills_count > 0:
            score += 10
        
        # Education points
        if resume_data.get('education'):
            score += 10
        
        # Experience level
        level = analysis.get('level', 'Fresher')
        if level == 'Senior':
            score += 5
        elif level == 'Mid-Level':
            score += 3
        
        # Cap at 100
        return min(score, 100)


# Keep backward compatibility
ResumeParser = ResumeParserEnhanced
