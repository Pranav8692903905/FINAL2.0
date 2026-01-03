import PyPDF2
import re
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class ResumeParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.nlp = None
    
    def extract_text_from_pdf(self) -> str:
        """Extract text from PDF file - IMPROVED"""
        text = ""
        try:
            with open(self.file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)
                logger.info(f"PDF has {num_pages} pages")
                
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                    logger.info(f"Extracted {len(page_text) if page_text else 0} chars from page {page_num + 1}")
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
        
        logger.info(f"Total extracted: {len(text)} characters")
        return text
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text - IMPROVED with multiple patterns"""
        email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',
            r'\b[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
        ]
        
        for pattern in email_patterns:
            try:
                emails = re.findall(pattern, text)
                if emails:
                    result = emails[0].strip()
                    logger.info(f"Found email: {result}")
                    return result
            except:
                pass
        
        logger.warning("No email found")
        return None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text - IMPROVED"""
        phone_patterns = [
            r'(?:\+?1[-.]?)?(?:\(?[0-9]{3}\)?[-.]?)?[0-9]{3}[-.]?[0-9]{4}',  # US
            r'\b\d{10}\b',  # 10 digits
            r'\+\d{1,3}[-.\s]?\d{1,14}',  # International
            r'(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}',  # Parentheses format
            r'\+?\d{1,3}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}',  # Flexible international
        ]
        
        for pattern in phone_patterns:
            try:
                phones = re.findall(pattern, text)
                if phones:
                    result = phones[0].strip()
                    # Filter out too short matches
                    if len(re.sub(r'\D', '', result)) >= 10:
                        logger.info(f"Found phone: {result}")
                        return result
            except:
                pass
        
        logger.warning("No phone found")
        return None
    
    def extract_name(self, text: str) -> str:
        """Extract name from text - IMPROVED without NLP"""
        lines = text.split('\n')
        
        # Smart heuristic extraction
        for line in lines[:20]:
            line = line.strip()
            if not line or len(line) < 2:
                continue
            
            # Skip headers and common sections
            if line.lower() in ['resume', 'cv', 'curriculum vitae', 'contact', 'email', 'phone', 'location', 'summary', 'objective', 'professional', 'experience', 'education', 'skills', 'certifications', 'languages', 'projects']:
                continue
            
            # Skip lines that are too long (likely content, not name)
            if len(line) > 80:
                continue
            
            # Skip if contains email or phone patterns
            if '@' in line or re.search(r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}', line):
                continue
            
            words = line.split()
            
            # Must have 1-4 words
            if len(words) < 1 or len(words) > 4:
                continue
            
            # Skip if contains digits or special chars (except hyphens/apostrophes in names)
            if any(char.isdigit() for char in line):
                continue
            
            # Check if looks like a name: starts with capital letter
            if words[0] and words[0][0].isupper():
                # Check if most words start with capital
                capital_words = sum(1 for w in words if w and w[0].isupper())
                if capital_words >= len(words) - 1:  # Allow 1 lowercase word
                    logger.info(f"Found name via heuristic: {line}")
                    return line
        
        logger.warning("No name found")
        return "Unknown"
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text - IMPROVED with better dictionary"""
        text_lower = text.lower()
        
        all_skills = {
            'Python': ['python', 'py', 'python3'],
            'JavaScript': ['javascript', 'js', 'nodejs', 'node.js', 'node'],
            'TypeScript': ['typescript', 'ts'],
            'Java': ['java'],
            'C++': ['c++', 'cpp', 'c plus plus'],
            'C#': ['c#', 'csharp', 'c sharp'],
            'C': ['\\bc\\b'],
            'PHP': ['php'],
            'Ruby': ['ruby'],
            'Go': ['golang', '\\bgo\\b'],
            'Rust': ['rust'],
            'Swift': ['swift'],
            'Kotlin': ['kotlin'],
            'HTML': ['html', 'html5'],
            'CSS': ['\\bcss\\b', 'css3'],
            'SCSS': ['scss', 'sass'],
            'React': ['react', 'reactjs', 'react.js'],
            'Angular': ['angular', 'angularjs'],
            'Vue': ['vue', 'vuejs', 'vue.js'],
            'Next.js': ['next.js', 'nextjs', 'next'],
            'Express': ['express', 'expressjs'],
            'Django': ['django'],
            'Flask': ['flask'],
            'FastAPI': ['fastapi'],
            'Spring': ['spring', 'spring boot'],
            'ASP.NET': ['asp.net', 'asp net', '.net'],
            'Laravel': ['laravel'],
            'REST API': ['rest api', 'restful', 'rest'],
            'GraphQL': ['graphql'],
            'SQL': ['\\bsql\\b'],
            'MySQL': ['mysql'],
            'PostgreSQL': ['postgresql', 'postgres'],
            'MongoDB': ['mongodb'],
            'Firebase': ['firebase'],
            'Redis': ['redis'],
            'Elasticsearch': ['elasticsearch'],
            'Docker': ['docker'],
            'Kubernetes': ['kubernetes', 'k8s'],
            'AWS': ['aws', 'amazon web services'],
            'Azure': ['azure', 'microsoft azure'],
            'GCP': ['gcp', 'google cloud'],
            'Git': ['git', 'github', 'gitlab', 'bitbucket'],
            'Jenkins': ['jenkins'],
            'Linux': ['linux'],
            'Windows': ['windows'],
            'Machine Learning': ['machine learning', 'ml'],
            'Deep Learning': ['deep learning'],
            'TensorFlow': ['tensorflow'],
            'PyTorch': ['pytorch'],
            'Keras': ['keras'],
            'Pandas': ['pandas'],
            'NumPy': ['numpy'],
            'Scikit-learn': ['scikit-learn', 'sklearn'],
            'Data Analysis': ['data analysis', 'data analytics'],
            'Data Science': ['data science'],
            'Figma': ['figma'],
            'Adobe XD': ['adobe xd', 'xd'],
            'Sketch': ['sketch'],
            'Agile': ['agile'],
            'Scrum': ['scrum'],
            'Jira': ['jira'],
            'Testing': ['testing', 'test automation', 'unit testing'],
            'Jest': ['jest'],
            'Pytest': ['pytest'],
            'Selenium': ['selenium'],
            'Mobile Development': ['mobile development'],
            'iOS': ['ios'],
            'Android': ['android'],
            'Flutter': ['flutter'],
            'React Native': ['react native', 'react-native'],
            'API Design': ['api design'],
            'Microservices': ['microservices'],
            'Design Patterns': ['design patterns'],
            'OOP': ['oop', 'object-oriented'],
            'SOLID': ['solid principles'],
            'System Design': ['system design'],
            'Database Design': ['database design'],
            'DevOps': ['devops'],
            'CI/CD': ['ci/cd', 'cicd', 'continuous integration'],
            'Version Control': ['version control', 'git'],
            'Npm': ['npm', 'node package manager'],
            'Webpack': ['webpack'],
            'Babel': ['babel'],
            'TypeScript': ['typescript'],
            'Redux': ['redux'],
            'Vuex': ['vuex'],
            'State Management': ['state management'],
            'Networking': ['networking'],
            'HTTP': ['http', 'https'],
            'JSON': ['json'],
            'XML': ['xml'],
            'YAML': ['yaml'],
            'Communication': ['communication', 'presentation', 'leadership'],
            'Problem Solving': ['problem solving', 'problem-solving'],
            'Project Management': ['project management'],
        }
        
        found_skills = []
        for skill_name, patterns in all_skills.items():
            for pattern in patterns:
                # Use word boundary matching for proper pattern matching
                try:
                    if re.search(r'\b' + re.escape(pattern) + r'\b', text_lower):
                        if skill_name not in found_skills:
                            found_skills.append(skill_name)
                        break
                except:
                    if pattern in text_lower:
                        if skill_name not in found_skills:
                            found_skills.append(skill_name)
                        break
        
        logger.info(f"Found {len(found_skills)} skills: {found_skills}")
        return found_skills
    
    def get_page_count(self) -> int:
        """Get number of pages in PDF"""
        try:
            with open(self.file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                count = len(pdf_reader.pages)
                logger.info(f"PDF page count: {count}")
                return count
        except:
            return 1
    
    def extract_data(self) -> Dict:
        """Extract all data from resume"""
        text = self.extract_text_from_pdf()
        
        result = {
            'name': self.extract_name(text),
            'email': self.extract_email(text) or 'N/A',
            'phone': self.extract_phone(text) or 'N/A',
            'skills': self.extract_skills(text),
            'pages': self.get_page_count(),
            'experience': self.extract_experience(text),
            'education': self.extract_education(text)
        }
        
        logger.info(f"Extraction complete: {result}")
        return result
    
    def extract_experience(self, text: str) -> str:
        """Extract experience level"""
        text_lower = text.lower()
        
        senior_keywords = [
            'senior', 'lead', 'principal', 'director', 'architect', 
            '10+ years', '8+ years', 'head of', 'managing director',
        ]
        if any(word in text_lower for word in senior_keywords):
            return 'Experienced'
        
        mid_keywords = [
            'mid-level', 'intermediate', '3-5 years', '4 years', '5 years',
            'senior developer', 'team lead'
        ]
        if any(word in text_lower for word in mid_keywords):
            return 'Intermediate'
        
        return 'Fresher'
    
    def extract_education(self, text: str) -> List[str]:
        """Extract education information"""
        education = []
        text_lower = text.lower()
        
        degrees = {
            'Bachelor': ['bachelor', 'b.tech', 'b tech', 'bca', 'b.sc', 'bs', 'b.a', 'ba', 'bsc', 'b.e', 'be', 'btech'],
            'Master': ['master', 'm.tech', 'm tech', 'mca', 'mba', 'm.sc', 'ms', 'm.a', 'ma', 'mtech'],
            'PhD': ['phd', 'ph.d', 'doctorate', 'doctoral'],
            'Diploma': ['diploma', 'polytechnic'],
            'Certificate': ['certificate', 'certified'],
        }
        
        for degree, patterns in degrees.items():
            for pattern in patterns:
                if re.search(r'\b' + re.escape(pattern) + r'\b', text_lower):
                    if degree not in education:
                        education.append(degree)
                    break
        
        logger.info(f"Found education: {education}")
        return education if education else ['Not specified']
    
    def analyze_skills(self, skills: List[str]) -> Dict:
        """Analyze skills and recommend field"""
        if not skills:
            return {
                'field': 'General IT',
                'level': 'Fresher',
                'recommended_skills': ['Technical Skills', 'Communication']
            }
        
        skills_text = ' '.join(skills).lower()
        
        # Define field keywords
        field_keywords = {
            'Data Science': ['tensorflow', 'keras', 'pytorch', 'machine learning', 'pandas', 'numpy', 'scikit', 'data analysis', 'deep learning'],
            'Web Development': ['react', 'angular', 'django', 'flask', 'node.js', 'javascript', 'html', 'css', 'express', 'vue', 'next.js', 'fastapi'],
            'Mobile Development': ['android', 'ios', 'kotlin', 'swift', 'flutter', 'react native'],
            'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'linux'],
            'UI/UX Design': ['figma', 'adobe xd', 'sketch', 'ui', 'ux', 'design'],
            'Backend Development': ['java', 'python', 'django', 'fastapi', 'spring', 'asp.net', 'rest api'],
            'Database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch'],
        }
        
        field_scores = {}
        for field, keywords in field_keywords.items():
            score = sum(1 for kw in keywords if kw in skills_text)
            field_scores[field] = score
        
        # Find field with highest score
        max_score = max(field_scores.values()) if field_scores else 0
        if max_score > 0:
            field = max(field_scores, key=field_scores.get)
        else:
            field = 'General IT'
        
        # Determine level based on skill count
        skill_count = len(skills)
        if skill_count < 5:
            level = 'Fresher'
            recommended = ['Problem Solving', 'Communication', 'Git']
        elif skill_count < 10:
            level = 'Intermediate'
            recommended = ['System Design', 'Project Management', 'Code Review']
        else:
            level = 'Experienced'
            recommended = ['System Architecture', 'Leadership', 'Technical Mentoring']
        
        logger.info(f"Skill analysis: field={field}, level={level}")
        
        return {
            'field': field,
            'level': level,
            'recommended_skills': recommended
        }
    
    def calculate_score(self, resume_data: Dict, analysis: Dict) -> int:
        """Calculate resume score out of 100"""
        score = 0
        
        if resume_data.get('email') and resume_data['email'] != 'N/A':
            score += 10
        
        if resume_data.get('phone') and resume_data['phone'] != 'N/A':
            score += 10
        
        skill_count = len(resume_data.get('skills', []))
        if skill_count >= 10:
            score += 35
        elif skill_count >= 6:
            score += 25
        elif skill_count >= 3:
            score += 15
        elif skill_count > 0:
            score += 8
        
        pages = resume_data.get('pages', 1)
        if 1 <= pages <= 2:
            score += 10
        elif pages > 2:
            score += 5
        
        education = resume_data.get('education', [])
        if education and education[0] != 'Not specified':
            score += 15
        
        level = analysis.get('level', 'Fresher')
        if level == 'Experienced':
            score += 10
        elif level == 'Intermediate':
            score += 7
        
        name = resume_data.get('name', 'Unknown')
        if name and name != 'Unknown':
            score += 5
        
        return min(100, max(0, score))
