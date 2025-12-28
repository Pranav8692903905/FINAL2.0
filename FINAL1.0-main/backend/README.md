# Smart Resume Analyzer - Backend

FastAPI backend for Smart Resume Analyzer application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

2. (Optional) Configure MySQL via environment variables (otherwise SQLite is used):
```
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=yourpassword
export MYSQL_DB=resume_db
```

3. Run the server:
```bash
python main.py
```

The API will be available at http://localhost:8000

## API Endpoints

- `POST /api/upload-resume` - Upload and analyze resume
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/resumes` - Get all resumes
- `GET /api/courses/{field}` - Get courses by field
