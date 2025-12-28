import axios from 'axios';

// Use same-origin path so Vite proxy handles routing
const API_URL = '/api';

export interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  pages: number;
  skills: string[];
  experience: string;
  education: string[];
  score: number;
  level: string;
  field: string;
  recommended_skills: string[];
  courses: Course[];
  filename: string;
}

export interface Course {
  name: string;
  link: string;
}

export interface AdminStats {
  total_resumes: number;
  average_score: number;
  field_distribution: Record<string, number>;
  level_distribution: Record<string, number>;
}

export interface ResumeRecord {
  id: number;
  name: string;
  email: string;
  resume_score: number;
  timestamp: string;
  page_no: number;
  predicted_field: string;
  user_level: string;
  actual_skills: string;
  recommended_skills: string;
  recommended_courses: string;
}

const api = axios.create({
  baseURL: API_URL,
});

export const uploadResume = async (file: File): Promise<ResumeAnalysis> => {
  const formData = new FormData();
  formData.append('file', file);

  console.log('Uploading to:', `${API_URL}/upload-resume`);
  try {
    const response = await api.post('/upload-resume', formData);
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    throw error;
  }
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllResumes = async (): Promise<ResumeRecord[]> => {
  const response = await api.get('/admin/resumes');
  return response.data.resumes;
};

export const getCoursesByField = async (field: string): Promise<Course[]> => {
  const response = await api.get(`/courses/${field}`);
  return response.data.courses;
};
