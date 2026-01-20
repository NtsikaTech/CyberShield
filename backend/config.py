"""
Configuration settings for CyberShield Backend
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    API_TITLE: str = "CyberShield Security API"
    API_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "cybershield-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Google Gemini AI (for log analysis)
    GEMINI_API_KEY: str = ""
    
    # CORS Origins (frontend URL)
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # Demo Users (in production, use a proper database)
    DEMO_USERS: dict = {
        "Analyst": {
            "username": "Analyst",
            "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4k5i0ggFg2zHpNWe",  # cyber-demo-2024
            "role": "Level 4 Analyst"
        },
        "admin": {
            "username": "admin",
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # password123
            "role": "Administrator"
        }
    }

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cache and return settings instance"""
    return Settings()

