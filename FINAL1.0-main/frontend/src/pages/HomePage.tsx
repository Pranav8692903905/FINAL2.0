import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { uploadResume } from '../api/resumeApi';
import type { ResumeAnalysis } from '../api/resumeApi';
import ResultsDisplay from '../components/ResultsDisplay';

function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await uploadResume(file);
      setResults(data);
    } catch (err: any) {
      console.error('Full error:', err);
      const errorMsg = 
        err.response?.data?.detail || 
        err.message || 
        'Failed to analyze resume. Please check the browser console for details.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>📄 Smart Resume Analyzer</h1>

      <div className="card">
        <div className="upload-section">
          <Upload className="upload-icon" size={64} />
          <h2>Upload Your Resume</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Upload your resume in PDF format for instant analysis
          </p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <div className="btn btn-primary" style={{ display: 'inline-block' }}>
              <FileText size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Choose PDF File
            </div>
          </label>

          {file && (
            <div style={{ marginTop: '1rem', color: '#667eea', fontWeight: '600' }}>
              Selected: {file.name}
            </div>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {file && !loading && !results && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleUpload}>
              Analyze Resume
            </button>
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>🔍 Analyzing your resume...</p>
          </div>
        )}
      </div>

      {results && <ResultsDisplay results={results} />}
    </div>
  );
}

export default HomePage;
