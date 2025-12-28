import sqlite3
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

import mysql.connector
from mysql.connector import Error as MySQLError

@dataclass
class ResumeData:
    name: str
    email: str
    resume_score: int
    timestamp: str
    page_no: int
    predicted_field: str
    user_level: str
    actual_skills: str
    recommended_skills: str
    recommended_courses: str

class Database:
    def __init__(self, sqlite_path: str = "resume_analyzer.db", mysql_config: Optional[Dict] = None):
        self.sqlite_path = sqlite_path
        self.mysql_config = mysql_config
        self.use_mysql = mysql_config is not None
        self.connection = None
    
    def get_connection(self):
        """Get database connection"""
        if self.connection:
            return self.connection

        if self.use_mysql:
            try:
                self.connection = mysql.connector.connect(**self.mysql_config)
            except MySQLError as exc:  # surface clear error for misconfig
                raise RuntimeError(f"MySQL connection failed: {exc}")
        else:
            self.connection = sqlite3.connect(self.sqlite_path, check_same_thread=False)
            self.connection.row_factory = sqlite3.Row
        return self.connection
    
    def create_tables(self):
        """Create database tables"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True) if self.use_mysql else conn.cursor()

        if self.use_mysql:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_data (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    resume_score INT NOT NULL,
                    timestamp VARCHAR(50) NOT NULL,
                    page_no INT NOT NULL,
                    predicted_field VARCHAR(100) NOT NULL,
                    user_level VARCHAR(50) NOT NULL,
                    actual_skills TEXT NOT NULL,
                    recommended_skills TEXT NOT NULL,
                    recommended_courses TEXT NOT NULL,
                    PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
        else:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    resume_score INTEGER NOT NULL,
                    timestamp TEXT NOT NULL,
                    page_no INTEGER NOT NULL,
                    predicted_field TEXT NOT NULL,
                    user_level TEXT NOT NULL,
                    actual_skills TEXT NOT NULL,
                    recommended_skills TEXT NOT NULL,
                    recommended_courses TEXT NOT NULL
                )
            """)

        conn.commit()
    
    def insert_resume_data(self, data: ResumeData):
        """Insert resume data into database"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True) if self.use_mysql else conn.cursor()

        placeholder = "%s" if self.use_mysql else "?"
        values_placeholders = ", ".join([placeholder] * 10)
        cursor.execute(f"""
            INSERT INTO user_data (
                name, email, resume_score, timestamp, page_no,
                predicted_field, user_level, actual_skills,
                recommended_skills, recommended_courses
            ) VALUES ({values_placeholders})
        """, (
            data.name, data.email, data.resume_score, data.timestamp,
            data.page_no, data.predicted_field, data.user_level,
            data.actual_skills, data.recommended_skills, data.recommended_courses
        ))

        conn.commit()
        return cursor.lastrowid
    
    def get_all_resumes(self) -> List[Dict]:
        """Get all resume records"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True) if self.use_mysql else conn.cursor()

        cursor.execute("SELECT * FROM user_data ORDER BY timestamp DESC")
        rows = cursor.fetchall()

        if self.use_mysql:
            return rows
        return [dict(row) for row in rows]
    
    def get_statistics(self) -> Dict:
        """Get statistics for admin dashboard"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True) if self.use_mysql else conn.cursor()

        # Total resumes
        cursor.execute("SELECT COUNT(*) as total FROM user_data")
        total_row = cursor.fetchone()
        total = total_row['total']

        # Average score
        cursor.execute("SELECT AVG(resume_score) as avg_score FROM user_data")
        avg_row = cursor.fetchone()
        avg_score = (avg_row['avg_score']) or 0

        # Field distribution
        cursor.execute("""
            SELECT predicted_field, COUNT(*) as count 
            FROM user_data 
            GROUP BY predicted_field
        """)
        field_dist = {row['predicted_field']: row['count'] for row in cursor.fetchall()}

        # Level distribution
        cursor.execute("""
            SELECT user_level, COUNT(*) as count 
            FROM user_data 
            GROUP BY user_level
        """)
        level_dist = {row['user_level']: row['count'] for row in cursor.fetchall()}

        return {
            'total_resumes': total,
            'average_score': round(float(avg_score), 2),
            'field_distribution': field_dist,
            'level_distribution': level_dist
        }
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            self.connection = None
