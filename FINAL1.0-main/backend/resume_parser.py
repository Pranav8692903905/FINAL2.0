import PyPDF2
import re
from typing import Dict, List, Optional
import spacy

class ResumeParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            self.nlp = None
    
    def extract_text_from_pdf(self) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(self.file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
        except Exception as e:
            print(f"Error extracting text: {e}")
        return text
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text"""
        phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        phones = re.findall(phone_pattern, text)
        return phones[0] if phones else None
    
    def extract_name(self, text: str) -> str:
        """Extract name from text using NLP"""
        if self.nlp:
            doc = self.nlp(text[:500])
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    return ent.text
        
        # Fallback: get first line
        lines = text.split('\n')
        for line in lines[:5]:
            line = line.strip()
            if line and len(line.split()) <= 4:
                return line
        return "Unknown"
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        text_lower = text.lower()
        
        # Common skills to look for
        all_skills = [
            # Programming Languages
            'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'typescript', 'r', 'matlab', 'scala', 'perl',
            
            # Web Development
            'html', 'css', 'react', 'angular', 'vue', 'node.js', 'django', 'flask',
            'express', 'fastapi', 'spring', 'asp.net', 'laravel', 'wordpress',
            'jquery', 'bootstrap', 'tailwind', 'sass', 'webpack',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
            'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'opencv',
            'nlp', 'computer vision', 'neural networks', 'data analysis', 'statistics',
            
            # Mobile Development
            'android', 'ios', 'flutter', 'react native', 'xamarin', 'ionic',
            
            # Databases
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'cassandra',
            'dynamodb', 'sqlite', 'firebase',
            
            # DevOps & Cloud
            'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'git', 'ci/cd',
            'terraform', 'ansible', 'linux', 'nginx', 'apache',
            
            # UI/UX
            'figma', 'adobe xd', 'sketch', 'photoshop', 'illustrator', 'ui design',
            'ux design', 'wireframing', 'prototyping',
            
            # Other
            'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'jira',
            'testing', 'junit', 'selenium', 'jest', 'cypress'
        ]
        
        found_skills = []
        for skill in all_skills:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))
    
    def get_page_count(self) -> int:
        """Get number of pages in PDF"""
        try:
            with open(self.file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                return len(pdf_reader.pages)
        except:
            return 1
    
    def extract_data(self) -> Dict:
        """Extract all data from resume"""
        text = self.extract_text_from_pdf()
        
        return {
            'name': self.extract_name(text),
            'email': self.extract_email(text) or 'N/A',
            'phone': self.extract_phone(text) or 'N/A',
            'skills': self.extract_skills(text),
            'pages': self.get_page_count(),
            'experience': self.extract_experience(text),
            'education': self.extract_education(text)
        }
    
    def extract_experience(self, text: str) -> str:
        """Extract experience level"""
        text_lower = text.lower()
        if any(word in text_lower for word in ['senior', 'lead', 'architect', '10+ years', '8+ years']):
            return 'Senior'
        elif any(word in text_lower for word in ['mid-level', '3-5 years', '5 years', '4 years']):
            return 'Mid-level'
        else:
            return 'Junior'
    
    def extract_education(self, text: str) -> List[str]:
        """Extract education information"""
        education = []
        text_lower = text.lower()
        
        degrees = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'mba', 'bca', 'mca', 'b.sc', 'm.sc']
        for degree in degrees:
            if degree in text_lower:
                education.append(degree.title())
        
        return list(set(education)) if education else ['Not specified']
    
    def analyze_skills(self, skills: List[str]) -> Dict:
        """Analyze skills and recommend field"""
        skills_lower = [s.lower() for s in skills]
        
        # Define skill categories
        ds_keywords = ['tensorflow', 'keras', 'pytorch', 'machine learning', 'deep learning', 
                       'pandas', 'numpy', 'scikit-learn', 'data analysis', 'statistics']
        web_keywords = ['react', 'angular', 'vue', 'django', 'flask', 'node.js', 'javascript', 
                        'html', 'css', 'php', 'laravel']
        android_keywords = ['android', 'kotlin', 'flutter', 'react native', 'mobile']
        ios_keywords = ['ios', 'swift', 'xcode', 'objective-c']
        uiux_keywords = ['figma', 'adobe xd', 'sketch', 'ui design', 'ux design', 
                         'wireframing', 'prototyping']
        
        # Count matches
        ds_count = sum(1 for s in skills_lower if any(k in s for k in ds_keywords))
        web_count = sum(1 for s in skills_lower if any(k in s for k in web_keywords))
        android_count = sum(1 for s in skills_lower if any(k in s for k in android_keywords))
        ios_count = sum(1 for s in skills_lower if any(k in s for k in ios_keywords))
        uiux_count = sum(1 for s in skills_lower if any(k in s for k in uiux_keywords))
        
        # Determine field
        counts = {
            'Data Science': (ds_count, ['Data Visualization', 'Statistical Modeling', 'Machine Learning', 
                                        'Deep Learning', 'Python', 'R', 'SQL']),
            'Web Development': (web_count, ['React', 'Node.js', 'TypeScript', 'REST APIs', 
                                           'Database Design', 'Git', 'Testing']),
            'Android Development': (android_count, ['Kotlin', 'Android SDK', 'Material Design', 
                                                   'Firebase', 'REST APIs', 'Git']),
            'iOS Development': (ios_count, ['Swift', 'SwiftUI', 'Xcode', 'Core Data', 'REST APIs']),
            'UI/UX Design': (uiux_count, ['User Research', 'Wireframing', 'Prototyping', 
                                         'Visual Design', 'Interaction Design'])
        }
        
        field = max(counts.keys(), key=lambda k: counts[k][0])
        if counts[field][0] == 0:
            field = 'General IT'
            recommended = ['Communication', 'Problem Solving', 'Teamwork', 'Time Management']
        else:
            recommended = counts[field][1]
        
        # Determine level based on skill count
        skill_count = len(skills)
        if skill_count < 5:
            level = 'Fresher'
        elif skill_count < 10:
            level = 'Intermediate'
        else:
            level = 'Experienced'
        
        return {
            'field': field,
            'level': level,
            'recommended_skills': recommended
        }
    
    def calculate_score(self, resume_data: Dict, analysis: Dict) -> int:
        """Calculate resume score out of 100"""
        score = 0
        
        # Basic info completeness (20 points)
        if resume_data['email'] != 'N/A':
            score += 10
        if resume_data['phone'] != 'N/A':
            score += 10
        
        # Skills (40 points)
        skill_count = len(resume_data['skills'])
        score += min(40, skill_count * 4)
        
        # Page count (10 points)
        pages = resume_data['pages']
        if pages >= 1:
            score += min(10, pages * 5)
        
        # Education (15 points)
        if resume_data['education'] and resume_data['education'][0] != 'Not specified':
            score += 15
        
        # Experience (15 points)
        if analysis['level'] == 'Experienced':
            score += 15
        elif analysis['level'] == 'Intermediate':
            score += 10
        else:
            score += 5
        
        return min(100, score)
