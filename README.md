# 🛡️ CyberShield

### Recruitment & Workflow Dashboard Demo

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://python.org/)

*A professional full-stack demo showing candidate tracking, workflow dashboards, and data visualization tools.*

[Live Demo](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-endpoints)

</div>

---

## 🎯 Project Overview

CyberShield is a **recruitment workflow and analytics platform demo**. It demonstrates full-stack development skills while showcasing professional dashboard design for tracking candidate activity, managing tasks, and visualizing data.

Key points:

* **Modern React Architecture** with TypeScript and component-based design
* **Python FastAPI Backend** with secure endpoints and async handling
* **Professional Dashboard Layouts** for activity tracking, status panels, and historical actions
* **Compliance & Security Basics** for password management and secure login

---

## ✨ Features

### 🔐 Secure Login

* JWT-based authentication with secure token storage
* Password hashing using industry-standard techniques
* Role-based access (Admin / Recruiter)

### 📊 Workflow & Candidate Tracking

* Track candidate submissions, reviews, and interview scheduling
* Historical action panels for easy review
* Visual indicators for task status or priority (green, yellow, red)
* Clickable items load full details in the main workspace

### 🔍 Activity Analysis

* Analyze candidate and workflow data quickly
* Color-coded status indicators for alerts or pending actions
* Historical tracking of actions for review and reporting

---

## 🛠️ Tech Stack

| Layer         | Technologies                                           |
| ------------- | ------------------------------------------------------ |
| **Frontend**  | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend**   | Python 3.11+, FastAPI, Pydantic, Uvicorn               |
| **Security**  | JWT, bcrypt, CORS middleware                           |
| **Dev Tools** | ESLint, TypeScript strict mode, Hot reload             |

---

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* Python 3.11+

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at **[http://localhost:3000](http://localhost:3000)**

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run API server
uvicorn main:app --reload --port 8000
```

API documentation at **[http://localhost:8000/docs](http://localhost:8000/docs)**

### Demo Credentials

| Username  | Password      | Role          |
| --------- | ------------- | ------------- |
| `Analyst` | `demo2024`    | Recruiter     |
| `admin`   | `password123` | Administrator |

---

## 📡 API Endpoints

| Endpoint                     | Method | Auth | Description                |
| ---------------------------- | ------ | :--: | -------------------------- |
| `/api/v1/auth/login`         | POST   |   ❌  | Login and get JWT          |
| `/api/v1/auth/me`            | GET    |   ✅  | Get current user info      |
| `/api/v1/analyze/password`   | POST   |   ❌  | Password strength check    |
| `/api/v1/analyze/logs`       | POST   |   ✅  | Workflow activity analysis |
| `/api/v1/analyze/logs/quick` | POST   |   ❌  | Quick action analysis      |

---

## 📁 Project Structure

```
cybershield/
├── App.tsx                  # Main application component
├── index.tsx                # React entry point
├── types.ts                 # TypeScript interfaces
├── components/
│   ├── Login.tsx            # Login UI
│   ├── Dashboard.tsx        # Main dashboard layout
│   ├── PasswordChecker.tsx  # Password check tool
│   └── LogAnalyzer.tsx      # Workflow/action analyzer
├── services/
│   └── cyberService.ts      # API client layer
└── backend/
    ├── main.py              # FastAPI app
    ├── auth.py              # JWT authentication
    ├── config.py            # Environment settings
    ├── models.py            # Data models
    └── services/
        ├── password_analyzer.py  # Password rules & validation
        └── log_analyzer.py       # Workflow log processing
```

---

## 🔒 Security Basics

```python
# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token creation
access_token = jwt.encode(
    {"sub": username, "exp": expire},
    SECRET_KEY,
    algorithm="HS256"
)
```

---

## 🎨 UI Preview

* Modern, clean dashboard layout
* Responsive sidebar navigation
* Real-time status and task visualization
* Color-coded task/action severity
* Smooth animations and transitions

---

## 📄 License

This project is available for demonstration and educational purposes.

---
