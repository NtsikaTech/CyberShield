# CyberShield Backend API

FastAPI backend for the CyberShield Security Platform providing authentication, password analysis, and AI-powered log analysis.

## 🚀 Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment (Optional)

Create a `.env` file for custom configuration:

```env
# Security - Change in production!
SECRET_KEY=your-super-secret-key-change-me

# Google Gemini API Key for AI-powered log analysis
# Get your key at: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key

# JWT token expiration (minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## 📖 API Documentation

Once the server is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Authentication

### Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `Analyst` | `cyber-demo-2024` | Level 4 Analyst |
| `admin` | `password123` | Administrator |

### Login Endpoint

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "Analyst",
  "password": "cyber-demo-2024"
}
```

Response:
```json
{
  "success": true,
  "access_token": "eyJ0...",
  "token_type": "bearer",
  "user": {
    "username": "Analyst",
    "role": "Level 4 Analyst"
  }
}
```

## 🔑 Password Analysis

Analyze password strength without authentication:

```bash
POST /api/v1/analyze/password
Content-Type: application/json

{
  "password": "MySecureP@ssw0rd!"
}
```

Response includes:
- Entropy calculation
- NIST 800-63B compliance rating
- POPIA (South African) privacy check
- Brute-force crack time estimate
- Improvement suggestions

## 🔍 Log Analysis

### AI-Powered Analysis (Requires Auth)

```bash
POST /api/v1/analyze/logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "log_data": "Oct 12 14:02:01 server sshd[1234]: Failed password for root...",
  "analysis_depth": "standard"
}
```

### Quick Analysis (No Auth)

```bash
POST /api/v1/analyze/logs/quick
Content-Type: application/json

{
  "log_data": "Your log data here..."
}
```

## 🏗️ Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration and settings
├── auth.py              # JWT authentication utilities
├── models.py            # Pydantic request/response models
├── requirements.txt     # Python dependencies
└── services/
    ├── __init__.py
    ├── password_analyzer.py  # Password strength analysis
    └── log_analyzer.py       # AI-powered log analysis
```

## 🤖 AI Integration

The log analyzer uses Google Gemini AI for intelligent threat detection. Without an API key, it falls back to rule-based pattern matching which still detects:

- Brute force attacks
- SQL injection attempts
- XSS payloads
- Path traversal attacks
- Privilege escalation
- Port scanning

To enable AI analysis:
1. Get a Gemini API key from https://makersuite.google.com/app/apikey
2. Set `GEMINI_API_KEY` in your `.env` file

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Use HTTPS in production
- Store credentials in a proper database (demo uses hardcoded values)
- Implement rate limiting for production use

