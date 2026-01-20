<div align="center">

# 🛡️ CyberShield ### Recruitment & Workflow Dashboard Demo [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/) [![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://python.org/) *A professional full-stack demo showing candidate tracking, workflow dashboards, and data visualization tools.* [Live Demo](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-endpoints)

</div>

---

🎯 Project Overview

CyberShield is a portfolio demonstration project designed specifically for technical recruiters and hiring managers.
It showcases how a real-world cybersecurity dashboard could be architected, implemented, and presented using modern web technologies.

This application is not intended for production use and does not manage recruitment processes. Instead, it demonstrates:

Secure authentication flows

Cybersecurity-oriented UI patterns

Log analysis and password evaluation concepts

Clean frontend–backend integration

Key highlights:

Modern React architecture with TypeScript and modular components

Python FastAPI backend with secure, well-structured endpoints

Cybersecurity-inspired dashboard design (monitoring, alerts, status panels)

Security fundamentals such as JWT authentication and password hashing

✨ Features
🔐 Secure Authentication Demo

JWT-based authentication flow

Password hashing using industry-standard practices

Role-based access simulation (Admin / Analyst)

🔑 Password Evaluation Tool

Password complexity and strength checks

Real-time feedback for weak or risky patterns

Demonstrates security-aware form handling and validation

📊 Log & Activity Analysis Demo

Log input and analysis interface

Visual severity indicators (normal / warning states)

Historical scan panel to demonstrate persistent UI patterns

Clickable history items that load detailed views

All data is mock or simulated for demonstration purposes.

🛠️ Tech Stack
Layer	Technologies
Frontend	React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
Backend	Python 3.11+, FastAPI, Pydantic, Uvicorn
Security	JWT authentication, bcrypt, CORS middleware
Dev Tools	ESLint, TypeScript strict mode, hot reload
🚀 Quick Start
Prerequisites

Node.js 18+

Python 3.11+

Frontend Setup
npm install
npm run dev


Runs at http://localhost:3000

Backend Setup
cd backend

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000


API docs available at http://localhost:8000/docs

📡 API Endpoints (Demo)
Endpoint	Method	Auth	Description
/api/v1/auth/login	POST	❌	Authenticate user (demo)
/api/v1/auth/me	GET	✅	Get current user profile
/api/v1/analyze/password	POST	❌	Password strength evaluation
/api/v1/analyze/logs	POST	✅	Log analysis demonstration
/api/v1/analyze/logs/quick	POST	❌	Rule-based log analysis
📁 Project Structure
cybershield/
├── App.tsx                  # Main application component
├── index.tsx                # React entry point
├── types.ts                 # Shared TypeScript types
├── components/
│   ├── Login.tsx            # Authentication UI
│   ├── Dashboard.tsx        # Main dashboard layout
│   ├── PasswordChecker.tsx  # Password evaluation tool
│   └── LogAnalyzer.tsx      # Log analysis interface
├── services/
│   └── cyberService.ts      # API client layer
└── backend/
    ├── main.py              # FastAPI application
    ├── auth.py              # Authentication logic
    ├── config.py            # Configuration
    ├── models.py            # Data schemas
    └── services/
        ├── password_analyzer.py
        └── log_analyzer.py

🔒 Security Demonstrations
# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token creation
access_token = jwt.encode(
    {"sub": username, "exp": expire},
    SECRET_KEY,
    algorithm="HS256"
)

🎨 UI Overview

Clean, modern cybersecurity dashboard layout

Responsive sidebar navigation

Status panels with visual severity indicators

Smooth transitions and structured component design

📄 License

This project is provided for portfolio and demonstration purposes only.
