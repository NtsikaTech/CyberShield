"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


# ============ Authentication Models ============

class LoginRequest(BaseModel):
    """Login request payload"""
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """JWT token response"""
    success: bool
    access_token: str
    token_type: str = "bearer"
    user: dict


class LoginError(BaseModel):
    """Login error response"""
    success: bool = False
    detail: str


# ============ Password Analysis Models ============

class PasswordAnalysisRequest(BaseModel):
    """Password analysis request"""
    password: str = Field(..., min_length=0, max_length=500)


class PasswordStrengthResponse(BaseModel):
    """Full password strength analysis response"""
    score: int = Field(..., ge=0, le=5)
    label: Literal['Very Weak', 'Weak', 'Medium', 'Strong', 'Excellent']
    color: str
    suggestions: list[str]
    entropy: float
    compliance_rating: Literal['Non-Compliant', 'Partially Compliant', 'NIST-Standard']
    risk_profile: Literal['Critical', 'Elevated', 'Secure']
    crack_time: str
    popia_warning: Optional[str] = None


# ============ Log Analysis Models ============

class LogAnalysisRequest(BaseModel):
    """Log analysis request payload"""
    log_data: str = Field(..., min_length=1, max_length=100000)
    analysis_depth: Literal['quick', 'standard', 'deep'] = 'standard'


class SuspiciousEvent(BaseModel):
    """A detected suspicious event"""
    event: str
    risk_level: Literal['Low', 'Medium', 'High']
    explanation: str


class AnalysisResult(BaseModel):
    """Complete log analysis result"""
    summary: str
    suspicious_events: list[SuspiciousEvent]
    recommendations: list[str]
    analysis_id: str
    timestamp: str


class LogAnalysisError(BaseModel):
    """Log analysis error response"""
    success: bool = False
    detail: str


# ============ Health Check ============

class HealthResponse(BaseModel):
    """API health check response"""
    status: str = "healthy"
    version: str
    service: str = "CyberShield API"

