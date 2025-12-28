import type { ResumeAnalysis } from '../api/resumeApi';
import { Award, Briefcase, GraduationCap, Mail, Phone, FileText } from 'lucide-react';

interface Props {
  results: ResumeAnalysis;
}

function ResultsDisplay({ results }: Props) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'fresher':
        return '#3b82f6';
      case 'intermediate':
        return '#f59e0b';
      case 'experienced':
        return '#10b981';
      default:
        return '#667eea';
    }
  };

  return (
    <div className="results-section">
      <div className="card">
        <h2>🎉 Hello, {results.name}!</h2>
        <h3>Resume Analysis Complete</h3>

        <div className="score-circle" style={{ background: `conic-gradient(#667eea ${results.score}%, #ddd 0)` }}>
          <div style={{ 
            background: 'white', 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#667eea'
          }}>
            {results.score}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3>Your Resume Score</h3>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <Mail size={20} color="#667eea" />
            <div className="info-label">Email</div>
            <div className="info-value">{results.email}</div>
          </div>

          <div className="info-item">
            <Phone size={20} color="#667eea" />
            <div className="info-label">Phone</div>
            <div className="info-value">{results.phone}</div>
          </div>

          <div className="info-item">
            <FileText size={20} color="#667eea" />
            <div className="info-label">Pages</div>
            <div className="info-value">{results.pages}</div>
          </div>

          <div className="info-item" style={{ borderLeftColor: getLevelColor(results.level) }}>
            <Award size={20} color={getLevelColor(results.level)} />
            <div className="info-label">Level</div>
            <div className="info-value">{results.level}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>
          <Briefcase size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Predicted Field
        </h3>
        <div style={{ 
          padding: '1rem', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {results.field}
        </div>
      </div>

      <div className="card">
        <h3>Your Skills</h3>
        <div className="skills-container">
          {results.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>💡 Recommended Skills to Add</h3>
        <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '1rem' }}>
          Adding these skills will boost your chances of getting hired!
        </p>
        <div className="skills-container">
          {results.recommended_skills.map((skill, index) => (
            <span key={index} className="skill-tag" style={{ background: '#10b981' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>
          <GraduationCap size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Education
        </h3>
        <div className="skills-container">
          {results.education.map((edu, index) => (
            <span key={index} className="skill-tag" style={{ background: '#f59e0b' }}>
              {edu}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>🎓 Recommended Courses</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Enhance your skills with these curated courses for {results.field}
        </p>
        <ul className="courses-list">
          {results.courses.map((course, index) => (
            <li key={index} className="course-item">
              <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                {index + 1}.
              </span>
              <a 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="course-link"
              >
                {course.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResultsDisplay;
