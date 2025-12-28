import { useEffect, useState } from 'react';
import { BarChart3, Users, TrendingUp } from 'lucide-react';
import { getAdminStats, getAllResumes } from '../api/resumeApi';
import type { AdminStats, ResumeRecord } from '../api/resumeApi';

function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, resumesData] = await Promise.all([
        getAdminStats(),
        getAllResumes()
      ]);
      setStats(statsData);
      setResumes(resumesData);
    } catch (err: any) {
      setError('Failed to load admin data');
      console.error('Admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading admin data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>📊 Admin Dashboard</h1>

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <Users size={48} color="#667eea" />
              <div className="stat-value">{stats.total_resumes}</div>
              <div className="stat-label">Total Resumes</div>
            </div>

            <div className="stat-card">
              <TrendingUp size={48} color="#667eea" />
              <div className="stat-value">{stats.average_score}</div>
              <div className="stat-label">Average Score</div>
            </div>

            <div className="stat-card">
              <BarChart3 size={48} color="#667eea" />
              <div className="stat-value">
                {Object.keys(stats.field_distribution).length}
              </div>
              <div className="stat-label">Fields</div>
            </div>
          </div>

          <div className="card">
            <h2>Field Distribution</h2>
            <div className="info-grid">
              {Object.entries(stats.field_distribution).map(([field, count]) => (
                <div key={field} className="info-item">
                  <div className="info-label">{field}</div>
                  <div className="info-value">{count} resumes</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Level Distribution</h2>
            <div className="info-grid">
              {Object.entries(stats.level_distribution).map(([level, count]) => (
                <div key={level} className="info-item">
                  <div className="info-label">{level}</div>
                  <div className="info-value">{count} candidates</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card">
        <h2>All Resumes</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Field</th>
                <th>Level</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.name}</td>
                  <td>{resume.email}</td>
                  <td>{resume.resume_score}</td>
                  <td>{resume.predicted_field}</td>
                  <td>{resume.user_level}</td>
                  <td>{new Date(resume.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
