"""
CyberShield Security API
FastAPI backend for cybersecurity analysis tools

Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta

from config import get_settings
from models import (
    LoginRequest,
    TokenResponse,
    LoginError,
    PasswordAnalysisRequest,
    PasswordStrengthResponse,
    LogAnalysisRequest,
    AnalysisResult,
    HealthResponse
)
from auth import (
    authenticate_user,
    create_access_token,
    get_current_user
)
from services import password_analyzer, log_analyzer

settings = get_settings()

# Initialize FastAPI application
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Enterprise-grade cybersecurity analysis API with AI-powered threat detection",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Health Check ============

@app.get("/", response_model=HealthResponse, tags=["Health"])
async def root():
    """API health check endpoint"""
    return HealthResponse(
        status="healthy",
        version=settings.API_VERSION
    )


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Detailed health check"""
    return HealthResponse(
        status="healthy",
        version=settings.API_VERSION
    )


# ============ Authentication Endpoints ============

@app.post(
    "/api/v1/auth/login",
    response_model=TokenResponse,
    responses={401: {"model": LoginError}},
    tags=["Authentication"]
)
async def login(request: LoginRequest):
    """
    Authenticate user and return JWT token.
    
    Demo credentials:
    - Username: `Analyst` | Password: `cyber-demo-2024`
    - Username: `admin` | Password: `password123`
    """
    user = authenticate_user(request.username, request.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check username and password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        success=True,
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@app.get("/api/v1/auth/me", tags=["Authentication"])
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information"""
    return {
        "success": True,
        "user": current_user
    }


# ============ Password Analysis Endpoints ============

@app.post(
    "/api/v1/analyze/password",
    response_model=PasswordStrengthResponse,
    tags=["Password Analysis"]
)
async def analyze_password(request: PasswordAnalysisRequest):
    """
    Analyze password strength with:
    - Shannon entropy calculation
    - NIST 800-63B compliance checking
    - POPIA (South African) privacy validation
    - Brute-force crack time estimation
    
    No authentication required - public endpoint for credential auditing.
    """
    return password_analyzer.analyze(request.password)


# ============ Log Analysis Endpoints ============

@app.post(
    "/api/v1/analyze/logs",
    response_model=AnalysisResult,
    tags=["Log Analysis"]
)
async def analyze_logs(
    request: LogAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-powered security log analysis.
    
    Detects:
    - Brute force attacks
    - SQL injection attempts
    - XSS payloads
    - Privilege escalation
    - Port scanning
    - Malicious IP activity
    
    Requires authentication.
    """
    result = await log_analyzer.analyze(
        log_data=request.log_data,
        depth=request.analysis_depth
    )
    return result


@app.post(
    "/api/v1/analyze/logs/quick",
    response_model=AnalysisResult,
    tags=["Log Analysis"]
)
async def analyze_logs_quick(request: LogAnalysisRequest):
    """
    Quick log analysis without AI (rule-based only).
    Public endpoint for demo purposes.
    """
    result = await log_analyzer.analyze(
        log_data=request.log_data,
        depth="quick"
    )
    return result


# ============ Startup/Shutdown Events ============

@app.on_event("startup")
async def startup_event():
    """Application startup tasks"""
    print(f"\n{'='*50}")
    print(f"  CyberShield API v{settings.API_VERSION}")
    print(f"  Docs: http://localhost:8000/docs")
    print(f"  AI Analysis: {'Enabled' if log_analyzer.ai_available else 'Disabled (no API key)'}")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

