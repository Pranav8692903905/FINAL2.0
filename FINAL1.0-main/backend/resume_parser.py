import PyPDF2
import re
from typing import Dict, List, Optional
import logging
from PIL import Image
import io

logger = logging.getLogger(__name__)

# Try to import multiple PDF libraries
try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False
    logger.warning("PyMuPDF not available")

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False
    logger.warning("pdfplumber not available")

try:
    import pytesseract
    from pdf2image import convert_from_path
    HAS_OCR = True
except ImportError:
    HAS_OCR = False
    logger.warning("OCR not available")

class ResumeParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.nlp = None
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace but preserve line breaks
        text = re.sub(r'[ \t]+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n', text)
        return text.strip()
    
    def extract_text_from_pdf(self) -> str:
        """Extract text from PDF file - MULTI-METHOD EXTRACTION"""
        text = ""
        
        # Method 1: Try pdfplumber first (best for complex layouts)
        if HAS_PDFPLUMBER:
            try:
                with pdfplumber.open(self.file_path) as pdf:
                    num_pages = len(pdf.pages)
                    logger.info(f"PDF has {num_pages} pages (trying pdfplumber)")
                    
                    for page_num, page in enumerate(pdf.pages):
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                            logger.info(f"pdfplumber: Extracted {len(page_text)} chars from page {page_num + 1}")
                    
                    if len(text.strip()) > 100:  # Good extraction
                        logger.info(f"✅ pdfplumber extracted: {len(text)} characters")
                        return text
                    else:
                        logger.warning("pdfplumber extraction insufficient")
            except Exception as e:
                logger.warning(f"pdfplumber failed: {e}")
        
        # Method 2: Try PyMuPDF
        if HAS_PYMUPDF:
            try:
                doc = fitz.open(self.file_path)
                num_pages = len(doc)
                logger.info(f"Trying PyMuPDF on {num_pages} pages")
                
                text = ""
                for page_num in range(num_pages):
                    page = doc[page_num]
                    # Try different extraction methods
                    page_text = page.get_text("text")
                    if not page_text or len(page_text) < 50:
                        page_text = page.get_text("blocks")
                        if isinstance(page_text, list):
                            page_text = " ".join([block[4] for block in page_text if len(block) > 4])
                    
                    if page_text:
                        text += str(page_text) + "\n"
                        logger.info(f"PyMuPDF: Extracted {len(str(page_text))} chars from page {page_num + 1}")
                
                doc.close()
                
                if len(text.strip()) > 50:
                    logger.info(f"✅ PyMuPDF extracted: {len(text)} characters")
                    return text
                else:
                    logger.warning("PyMuPDF extraction insufficient")
            except Exception as e:
                logger.warning(f"PyMuPDF failed: {e}")
        
        # Method 3: Fallback to PyPDF2
        try:
            with open(self.file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)
                logger.info(f"Trying PyPDF2 on {num_pages} pages")
                
                text = ""
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                        logger.info(f"PyPDF2: Extracted {len(page_text)} chars from page {page_num + 1}")
                
                if len(text.strip()) > 50:
                    logger.info(f"✅ PyPDF2 extracted: {len(text)} characters")
                    return text
        except Exception as e:
            logger.error(f"PyPDF2 failed: {e}")
        
        # If all methods failed
        if len(text.strip()) < 10:
            logger.error("❌ ALL PDF extraction methods failed - PDF might be image-based or corrupted")
            logger.error(f"Only extracted: {len(text)} characters")
            
            # Try OCR as last resort
            if HAS_OCR and HAS_PYMUPDF:
                logger.info("🔍 Attempting OCR extraction (image-based PDF detected)...")
                text = self.extract_text_with_ocr()
                if len(text.strip()) > 100:
                    logger.info(f"✅ OCR extracted: {len(text)} characters")
                    return text
        
        return text
    
    def extract_text_with_ocr(self) -> str:
        """Extract text from image-based PDF using OCR"""
        try:
            # Method 1: Use PyMuPDF to extract images and OCR them
            if HAS_PYMUPDF:
                doc = fitz.open(self.file_path)
                text = ""
                
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    
                    # Get page as image
                    pix = page.get_pixmap(dpi=300)  # High DPI for better OCR
                    img_data = pix.tobytes("png")
                    img = Image.open(io.BytesIO(img_data))
                    
                    # Run OCR
                    page_text = pytesseract.image_to_string(img, lang='eng')
                    text += page_text + "\n"
                    logger.info(f"OCR page {page_num + 1}: {len(page_text)} chars")
                
                doc.close()
                return text
            
            # Method 2: Use pdf2image
            logger.info("Using pdf2image for OCR...")
            images = convert_from_path(self.file_path, dpi=300, first_page=1, last_page=5)
            text = ""
            
            for i, image in enumerate(images):
                page_text = pytesseract.image_to_string(image, lang='eng')
                text += page_text + "\n"
                logger.info(f"OCR page {i + 1}: {len(page_text)} chars")
            
            return text
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return ""
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text - MULTIPLE PATTERNS"""
        # Clean text first
        text = text.replace('\n', ' ').replace('\r', ' ')
        
        email_patterns = [
            r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'[\w\.-]+@[\w\.-]+\.\w{2,}',
            r'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}',
        ]
        
        for pattern in email_patterns:
            try:
                emails = re.findall(pattern, text, re.IGNORECASE)
                if emails:
                    # Filter out invalid emails
                    valid_emails = [e for e in emails if '@' in e and '.' in e.split('@')[1]]
                    if valid_emails:
                        result = valid_emails[0].strip().lower()
                        logger.info(f"Found email: {result}")
                        return result
            except Exception as e:
                logger.warning(f"Email pattern failed: {e}")
        
        logger.warning("No email found")
        return None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text - COMPREHENSIVE PATTERNS"""
        # Clean text
        text = text.replace('\n', ' ').replace('\r', ' ')
        
        phone_patterns = [
            r'\+?1?\s*\(?[0-9]{3}\)?\s*[-.\s]?[0-9]{3}\s*[-.\s]?[0-9]{4}',  # US formats
            r'\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}',  # International
            r'\b\d{10}\b',  # 10 digits
            r'\+\d{1,3}[-.\s]?\d{4,14}',  # International with +
            r'(?:\+91|0)?[\s-]?[6-9]\d{9}',  # Indian mobile
            r'\(\d{3}\)\s*\d{3}[-.\s]?\d{4}',  # (123) 456-7890
            r'\d{3}[-.\s]\d{3}[-.\s]\d{4}',  # 123-456-7890
            r'\d{5}[\s]\d{5}',  # 12345 67890 format
        ]
        
        found_phones = []
        for pattern in phone_patterns:
            try:
                phones = re.findall(pattern, text)
                for phone in phones:
                    # Extract only digits
                    digits = re.sub(r'\D', '', phone)
                    # Valid if 10-15 digits
                    if 10 <= len(digits) <= 15:
                        found_phones.append(phone.strip())
            except Exception as e:
                logger.warning(f"Phone pattern failed: {e}")
        
        if found_phones:
            result = found_phones[0]
            logger.info(f"Found phone: {result}")
            return result
        
        logger.warning("No phone found")
        return None
    
    def extract_name(self, text: str) -> str:
        """Extract name from text - ROBUST HEURISTIC"""
        lines = text.split('\n')
        
        # Common headers to skip
        skip_headers = [
            'resume', 'cv', 'curriculum vitae', 'contact', 'contact information',
            'email', 'phone', 'location', 'address', 'summary', 'objective',
            'professional summary', 'experience', 'work experience', 'education',
            'skills', 'technical skills', 'certifications', 'languages', 'projects',
            'personal details', 'profile', 'about me', 'references'
        ]
        
        # Try first 30 lines
        for line in lines[:30]:
            line = line.strip()
            
            # Skip empty or very short
            if not line or len(line) < 2:
                continue
            
            # Skip if too long (probably paragraph)
            if len(line) > 100:
                continue
            
            # Skip headers
            if line.lower() in skip_headers:
                continue
            
            # Skip if contains common resume keywords
            if any(kw in line.lower() for kw in ['experience:', 'skills:', 'education:', 'summary:', 'objective:']):
                continue
            
            # Skip if has email or phone
            if '@' in line or re.search(r'\d{3}[-.\s]?\d{3}', line):
                continue
            
            # Skip if has URLs
            if 'http' in line.lower() or 'www.' in line.lower() or '.com' in line.lower():
                continue
            
            words = line.split()
            
            # Name should be 1-5 words
            if not (1 <= len(words) <= 5):
                continue
            
            # Skip if has numbers or special chars (except hyphen, apostrophe)
            if re.search(r'[0-9#$%^&*+=<>{}[\]\\|]', line):
                continue
            
            # Check if words start with capital letter (likely a name)
            capital_count = sum(1 for w in words if w and w[0].isupper())
            
            # At least 50% words should be capitalized
            if capital_count >= len(words) * 0.5:
                # Additional validation: not all uppercase (likely heading)
                if not line.isupper():
                    logger.info(f"Found name: {line}")
                    return line
        
        logger.warning("No name found")
        return "Unknown"
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text - COMPREHENSIVE SKILL DETECTION"""
        text_lower = text.lower()
        
        # Expanded skill dictionary with more variations
        all_skills = {
            # Programming Languages
            'Python': ['python', 'python3', 'python2', 'py'],
            'JavaScript': ['javascript', 'js', 'ecmascript', 'es6', 'es5'],
            'TypeScript': ['typescript', 'ts'],
            'Java': ['java', 'java8', 'java11', 'java17'],
            'C++': ['c++', 'cpp', 'cplusplus', 'c plus plus'],
            'C#': ['c#', 'csharp', 'c sharp', 'c-sharp'],
            'C': ['\\bc\\b', 'c language', 'ansi c'],
            'PHP': ['php', 'php7', 'php8'],
            'Ruby': ['ruby', 'ruby on rails', 'ror'],
            'Go': ['golang', '\\bgo\\b', 'go lang'],
            'Rust': ['rust', 'rust lang'],
            'Swift': ['swift', 'swift ui', 'swiftui'],
            'Kotlin': ['kotlin'],
            'R': ['\\br\\b', 'r programming', 'r language'],
            'Scala': ['scala'],
            'Perl': ['perl'],
            'Shell': ['shell', 'bash', 'shell script', 'bash script'],
            
            # Web Technologies
            'HTML': ['html', 'html5', 'html 5'],
            'CSS': ['\\bcss\\b', 'css3', 'css 3'],
            'SCSS': ['scss', 'sass'],
            'Bootstrap': ['bootstrap', 'bootstrap4', 'bootstrap5'],
            'Tailwind': ['tailwind', 'tailwind css', 'tailwindcss'],
            'jQuery': ['jquery', 'jquery ui'],
            
            # Frontend Frameworks
            'React': ['react', 'reactjs', 'react.js', 'react js'],
            'Angular': ['angular', 'angularjs', 'angular2'],
            'Vue': ['vue', 'vuejs', 'vue.js', 'vue js'],
            'Next.js': ['next.js', 'nextjs', 'next js', 'next'],
            'Nuxt': ['nuxt', 'nuxtjs'],
            'Svelte': ['svelte'],
            
            # Backend Frameworks
            'Node.js': ['node.js', 'nodejs', 'node js', 'node'],
            'Express': ['express', 'expressjs', 'express.js'],
            'Django': ['django', 'django rest'],
            'Flask': ['flask'],
            'FastAPI': ['fastapi', 'fast api'],
            'Spring': ['spring', 'spring boot', 'springboot'],
            'ASP.NET': ['asp.net', 'asp net', '.net', 'dotnet'],
            'Laravel': ['laravel'],
            'Rails': ['rails', 'ruby on rails'],
            
            # Databases
            'SQL': ['\\bsql\\b', 'sql server'],
            'MySQL': ['mysql'],
            'PostgreSQL': ['postgresql', 'postgres', 'psql'],
            'MongoDB': ['mongodb', 'mongo'],
            'Firebase': ['firebase'],
            'Redis': ['redis'],
            'Elasticsearch': ['elasticsearch', 'elastic'],
            'Oracle': ['oracle', 'oracle db'],
            'SQLite': ['sqlite'],
            'Cassandra': ['cassandra'],
            'DynamoDB': ['dynamodb'],
            
            # Cloud & DevOps
            'Docker': ['docker', 'dockerfile'],
            'Kubernetes': ['kubernetes', 'k8s'],
            'AWS': ['aws', 'amazon web services'],
            'Azure': ['azure', 'microsoft azure'],
            'GCP': ['gcp', 'google cloud', 'google cloud platform'],
            'CI/CD': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
            'Jenkins': ['jenkins'],
            'GitLab CI': ['gitlab ci', 'gitlab'],
            'GitHub Actions': ['github actions'],
            'Terraform': ['terraform'],
            'Ansible': ['ansible'],
            
            # Version Control
            'Git': ['git', 'github', 'gitlab', 'bitbucket'],
            'SVN': ['svn', 'subversion'],
            
            # Mobile Development
            'iOS': ['ios', 'ios development'],
            'Android': ['android', 'android development'],
            'Flutter': ['flutter'],
            'React Native': ['react native', 'react-native', 'reactnative'],
            'Xamarin': ['xamarin'],
            
            # Data Science & ML
            'Machine Learning': ['machine learning', 'ml', 'ml engineering'],
            'Deep Learning': ['deep learning', 'dl'],
            'TensorFlow': ['tensorflow', 'tf'],
            'PyTorch': ['pytorch'],
            'Keras': ['keras'],
            'Pandas': ['pandas'],
            'NumPy': ['numpy'],
            'Scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
            'Data Analysis': ['data analysis', 'data analytics'],
            'Data Science': ['data science'],
            'Computer Vision': ['computer vision', 'cv', 'opencv'],
            'NLP': ['nlp', 'natural language processing'],
            'Matplotlib': ['matplotlib'],
            'Seaborn': ['seaborn'],
            'Tableau': ['tableau'],
            'Power BI': ['power bi', 'powerbi'],
            
            # Testing
            'Testing': ['testing', 'test automation', 'unit testing', 'qa'],
            'Jest': ['jest'],
            'Pytest': ['pytest'],
            'Selenium': ['selenium', 'selenium webdriver'],
            'Cypress': ['cypress'],
            'JUnit': ['junit'],
            'Mocha': ['mocha'],
            'Chai': ['chai'],
            
            # Design
            'Figma': ['figma'],
            'Adobe XD': ['adobe xd', 'xd'],
            'Sketch': ['sketch'],
            'Photoshop': ['photoshop', 'adobe photoshop'],
            'Illustrator': ['illustrator', 'adobe illustrator'],
            'UI/UX': ['ui/ux', 'ui', 'ux', 'user interface', 'user experience'],
            
            # Methodologies
            'Agile': ['agile', 'agile methodology'],
            'Scrum': ['scrum', 'scrum master'],
            'Kanban': ['kanban'],
            'Jira': ['jira'],
            'Waterfall': ['waterfall'],
            
            # Other Technologies
            'REST API': ['rest api', 'restful', 'rest', 'rest apis'],
            'GraphQL': ['graphql'],
            'API': ['api', 'apis', 'api development'],
            'Microservices': ['microservices', 'micro services'],
            'Webpack': ['webpack'],
            'Babel': ['babel'],
            'Redux': ['redux', 'redux toolkit'],
            'Vuex': ['vuex'],
            'Linux': ['linux', 'unix'],
            'Windows': ['windows'],
            'macOS': ['macos', 'mac os'],
            'Nginx': ['nginx'],
            'Apache': ['apache'],
            'OOP': ['oop', 'object oriented', 'object-oriented'],
            'Design Patterns': ['design patterns'],
            'System Design': ['system design'],
            'Data Structures': ['data structures', 'algorithms'],
            'Problem Solving': ['problem solving', 'problem-solving'],
        }
        
        found_skills = []
        
        for skill_name, patterns in all_skills.items():
            for pattern in patterns:
                try:
                    # Use word boundary for better matching
                    if re.search(r'\b' + re.escape(pattern) + r'\b', text_lower):
                        if skill_name not in found_skills:
                            found_skills.append(skill_name)
                        break
                except:
                    # Fallback to simple search if regex fails
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
        """Extract all data from resume - COMPREHENSIVE ANALYSIS"""
        text = self.extract_text_from_pdf()
        
        # Clean text for better processing
        cleaned_text = self.clean_text(text)
        
        # Extract all information
        name = self.extract_name(text)
        email = self.extract_email(text) or 'N/A'
        phone = self.extract_phone(text) or 'N/A'
        skills = self.extract_skills(text)
        pages = self.get_page_count()
        experience = self.extract_experience(text)
        education = self.extract_education(text)
        
        # Additional analysis
        word_count = len(text.split())
        char_count = len(text)
        
        result = {
            'name': name,
            'email': email,
            'phone': phone,
            'skills': skills,
            'pages': pages,
            'experience': experience,
            'education': education,
            'word_count': word_count,
            'char_count': char_count
        }
        
        logger.info(f"Extraction complete:")
        logger.info(f"  Name: {name}")
        logger.info(f"  Email: {email}")
        logger.info(f"  Phone: {phone}")
        logger.info(f"  Skills: {len(skills)} found")
        logger.info(f"  Experience: {experience}")
        logger.info(f"  Education: {education}")
        logger.info(f"  Content: {word_count} words, {char_count} chars")
        
        return result
    
    def extract_experience(self, text: str) -> str:
        """Extract experience level - COMPREHENSIVE"""
        text_lower = text.lower()
        
        # Check for years of experience
        years_match = re.search(r'(\d+)[\s+]*(?:years?|yrs?)', text_lower)
        if years_match:
            years = int(years_match.group(1))
            if years >= 8:
                return 'Experienced'
            elif years >= 3:
                return 'Intermediate'
            else:
                return 'Fresher'
        
        # Senior level keywords
        senior_keywords = [
            'senior', 'sr.', 'lead', 'principal', 'director', 'architect',
            'head of', 'managing director', 'chief', 'vp', 'vice president',
            '10+ years', '10 years', '8+ years', '8 years', '9 years',
            'senior engineer', 'senior developer', 'tech lead', 'engineering manager'
        ]
        if any(keyword in text_lower for keyword in senior_keywords):
            return 'Experienced'
        
        # Mid-level keywords
        mid_keywords = [
            'mid-level', 'intermediate', '3-5 years', '3 years', '4 years',
            '5 years', '6 years', '7 years', 'team lead', 'jr. team lead'
        ]
        if any(keyword in text_lower for keyword in mid_keywords):
            return 'Intermediate'
        
        # Fresher keywords
        fresher_keywords = [
            'fresher', 'entry level', 'entry-level', 'intern', 'internship',
            'junior', 'graduate', 'recent graduate', '1 year', '2 years'
        ]
        if any(keyword in text_lower for keyword in fresher_keywords):
            return 'Fresher'
        
        # Default based on content complexity
        return 'Fresher'
    
    def extract_education(self, text: str) -> List[str]:
        """Extract education information - COMPREHENSIVE"""
        education = []
        text_lower = text.lower()
        
        # Comprehensive degree patterns
        degrees = {
            'PhD': ['phd', 'ph.d', 'ph. d', 'doctorate', 'doctoral', 'doctor of philosophy'],
            'Master': ['master', 'masters', 'm.tech', 'm tech', 'mtech', 'mca', 'mba', 
                      'm.sc', 'msc', 'm.s', 'ms', 'm.a', 'ma', 'm.e', 'me',
                      'master of science', 'master of arts', 'master of technology',
                      'master of business', 'post graduate', 'postgraduate', 'pg'],
            'Bachelor': ['bachelor', 'bachelors', 'b.tech', 'b tech', 'btech', 'bca',
                        'b.sc', 'bsc', 'b.s', 'bs', 'b.a', 'ba', 'b.e', 'be',
                        'bachelor of science', 'bachelor of arts', 'bachelor of technology',
                        'bachelor of engineering', 'undergraduate', 'ug', 'graduate'],
            'Diploma': ['diploma', 'polytechnic', 'advanced diploma'],
            'Certificate': ['certificate', 'certification', 'certified'],
            'Associate': ['associate', 'associates degree'],
        }
        
        for degree, patterns in degrees.items():
            for pattern in patterns:
                try:
                    if re.search(r'\b' + re.escape(pattern) + r'\b', text_lower):
                        if degree not in education:
                            education.append(degree)
                        break
                except:
                    if pattern in text_lower:
                        if degree not in education:
                            education.append(degree)
                        break
        
        logger.info(f"Found education: {education}")
        return education if education else ['Not specified']
    
    def analyze_skills(self, skills: List[str]) -> Dict:
        """Analyze skills and recommend field - DETAILED ANALYSIS"""
        if not skills:
            return {
                'field': 'General IT',
                'level': 'Fresher',
                'recommended_skills': ['Technical Skills', 'Communication', 'Problem Solving']
            }
        
        skills_text = ' '.join(skills).lower()
        
        # Comprehensive field keywords with weights
        field_keywords = {
            'Data Science': {
                'keywords': ['tensorflow', 'keras', 'pytorch', 'machine learning', 'pandas', 'numpy', 
                           'scikit', 'data analysis', 'deep learning', 'data science', 'nlp', 
                           'computer vision', 'tableau', 'power bi'],
                'recommendations': ['Deep Learning', 'Neural Networks', 'Data Visualization']
            },
            'Web Development': {
                'keywords': ['react', 'angular', 'django', 'flask', 'node.js', 'javascript', 'html', 
                           'css', 'express', 'vue', 'next.js', 'fastapi', 'typescript', 'bootstrap', 
                           'tailwind', 'webpack'],
                'recommendations': ['Advanced React Patterns', 'Web Performance', 'SEO']
            },
            'Mobile Development': {
                'keywords': ['android', 'ios', 'kotlin', 'swift', 'flutter', 'react native', 'xamarin',
                           'mobile development'],
                'recommendations': ['Mobile UI/UX', 'App Store Optimization', 'Push Notifications']
            },
            'DevOps': {
                'keywords': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 
                           'linux', 'terraform', 'ansible', 'gitlab ci'],
                'recommendations': ['Container Orchestration', 'Infrastructure as Code', 'Monitoring']
            },
            'UI/UX Design': {
                'keywords': ['figma', 'adobe xd', 'sketch', 'ui/ux', 'ui', 'ux', 'design', 
                           'photoshop', 'illustrator'],
                'recommendations': ['User Research', 'Prototyping', 'Accessibility']
            },
            'Backend Development': {
                'keywords': ['java', 'python', 'django', 'fastapi', 'spring', 'asp.net', 'rest api',
                           'graphql', 'microservices', 'api'],
                'recommendations': ['API Design', 'Microservices Architecture', 'Database Optimization']
            },
            'Database Engineering': {
                'keywords': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
                           'database', 'oracle', 'cassandra'],
                'recommendations': ['Query Optimization', 'Database Design', 'Replication']
            },
            'Cloud Engineering': {
                'keywords': ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda'],
                'recommendations': ['Cloud Architecture', 'Cost Optimization', 'Security']
            }
        }
        
        field_scores = {}
        field_recommendations = {}
        
        for field, data in field_keywords.items():
            score = sum(1 for kw in data['keywords'] if kw in skills_text)
            field_scores[field] = score
            field_recommendations[field] = data['recommendations']
        
        # Find field with highest score
        max_score = max(field_scores.values()) if field_scores else 0
        if max_score > 0:
            field = max(field_scores, key=field_scores.get)
            recommended = field_recommendations[field]
        else:
            field = 'General IT'
            recommended = ['Programming Fundamentals', 'Version Control', 'Communication']
        
        # Determine level based on skill count and diversity
        skill_count = len(skills)
        fields_with_skills = sum(1 for score in field_scores.values() if score > 0)
        
        if skill_count < 5:
            level = 'Fresher'
        elif skill_count < 10:
            level = 'Intermediate'
        elif skill_count >= 15 and fields_with_skills >= 3:
            level = 'Expert'
        else:
            level = 'Experienced'
        
        logger.info(f"Skill analysis: field={field}, level={level}, score={max_score}")
        
        return {
            'field': field,
            'level': level,
            'recommended_skills': recommended,
            'skill_diversity': fields_with_skills
        }
    
    def calculate_score(self, resume_data: Dict, analysis: Dict) -> int:
        """Calculate resume score out of 100 - COMPREHENSIVE SCORING"""
        score = 0
        details = []
        
        # Contact Information (20 points)
        if resume_data.get('email') and resume_data['email'] != 'N/A':
            score += 10
            details.append("Email: +10")
        
        if resume_data.get('phone') and resume_data['phone'] != 'N/A':
            score += 10
            details.append("Phone: +10")
        
        # Skills Assessment (40 points)
        skill_count = len(resume_data.get('skills', []))
        if skill_count >= 15:
            score += 40
            details.append(f"Skills ({skill_count}): +40 (Excellent)")
        elif skill_count >= 10:
            score += 35
            details.append(f"Skills ({skill_count}): +35 (Very Good)")
        elif skill_count >= 6:
            score += 25
            details.append(f"Skills ({skill_count}): +25 (Good)")
        elif skill_count >= 3:
            score += 15
            details.append(f"Skills ({skill_count}): +15 (Fair)")
        elif skill_count > 0:
            score += 8
            details.append(f"Skills ({skill_count}): +8 (Basic)")
        
        # Resume Length (10 points)
        pages = resume_data.get('pages', 1)
        if 1 <= pages <= 2:
            score += 10
            details.append(f"Pages ({pages}): +10 (Optimal)")
        elif pages == 3:
            score += 7
            details.append(f"Pages ({pages}): +7 (Good)")
        elif pages > 3:
            score += 3
            details.append(f"Pages ({pages}): +3 (Too long)")
        
        # Education (15 points)
        education = resume_data.get('education', [])
        if education and education[0] != 'Not specified':
            if 'PhD' in education:
                score += 15
                details.append("Education (PhD): +15")
            elif 'Master' in education:
                score += 12
                details.append("Education (Master): +12")
            elif 'Bachelor' in education:
                score += 10
                details.append("Education (Bachelor): +10")
            else:
                score += 7
                details.append(f"Education ({education[0]}): +7")
        
        # Experience Level (10 points)
        level = analysis.get('level', 'Fresher')
        if level == 'Expert':
            score += 10
            details.append("Level (Expert): +10")
        elif level == 'Experienced':
            score += 8
            details.append("Level (Experienced): +8")
        elif level == 'Intermediate':
            score += 6
            details.append("Level (Intermediate): +6")
        else:
            score += 3
            details.append("Level (Fresher): +3")
        
        # Name Present (5 points)
        name = resume_data.get('name', 'Unknown')
        if name and name != 'Unknown':
            score += 5
            details.append("Name: +5")
        
        # Bonus for skill diversity
        skill_diversity = analysis.get('skill_diversity', 0)
        if skill_diversity >= 3:
            bonus = min(5, skill_diversity)
            score += bonus
            details.append(f"Skill Diversity: +{bonus}")
        
        final_score = min(100, max(0, score))
        
        logger.info(f"Score breakdown: {', '.join(details)}")
        logger.info(f"Final score: {final_score}/100")
        
        return final_score
