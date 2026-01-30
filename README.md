<div align="center">

# 🛡️ CyberShield  
### Password Strength & Entropy Analyzer (Portfolio Project)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

*A professional full-stack password security demo built to showcase secure application design and cybersecurity fundamentals to recruiters.*

[Quick Start](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Security Context](#-security-context)

</div>

---

## 🎯 Project Overview

**CyberShield – Password Strength & Entropy Analyzer** is a **portfolio demonstration project** created specifically for **technical recruiters and hiring managers**.  
It showcases how a **security-focused password analysis tool** can be architected, implemented, and presented using **modern web technologies** and cybersecurity best practices.

This application is **not intended for production use** and **does not store real user passwords**.  
All password input is handled securely and transiently for demonstration purposes only.

The project demonstrates:

- Secure authentication flows for protected features  
- Password strength evaluation using **entropy-based calculations**  
- Detection of weak, predictable, or high-risk password patterns  
- Security-aware frontend–backend integration  
- Clear, explainable security logic suitable for SOC and blue-team discussions  

---

### Key Highlights

- Modern **React architecture** using **TypeScript** and modular components  
- **Python FastAPI backend** with structured, security-aware endpoints  
- Password analysis based on **length, complexity, character diversity, and entropy**  
- Core security fundamentals such as **cryptographic hashing**, **JWT authentication**, and **secure input handling**

---

## ✨ Features

### 🔐 Secure Authentication Demo
- JWT-based authentication flow  
- Password hashing using industry-standard practices (bcrypt)  
- Role-based access simulation (Admin / Analyst)  

### 🔑 Password Strength & Entropy Analyzer
- Password complexity checks (length, symbols, character classes)  
- Entropy calculation to estimate resistance against brute-force attacks  
- Real-time feedback for weak or high-risk password patterns  
- Visual indicators to clearly explain password strength  
- No password persistence or storage  

### 📊 Analysis History (Demonstration)
- Simulated history panel to demonstrate persistent UI patterns  
- Clickable entries that load detailed analysis views  
- Emphasis on **explainability**, not data retention  

> All data used in this project is mock or transient and exists solely for demonstration.

---

## 🛡️ Security Context

### 🔍 What threat does this detect?
This project detects **weak authentication practices**, specifically:
- Low-entropy passwords  
- Predictable password patterns  
- Passwords vulnerable to brute-force or credential-stuffing attacks  

Weak passwords are a common **initial access vector** in real-world security incidents.

---

### 🎯 What attack would this catch?
The analyzer helps identify credentials vulnerable to:
- **Brute-force attacks**
- **Credential stuffing**
- **Password spraying**
- **Dictionary-based attacks**

While this tool does not actively block attacks, it demonstrates **preventive detection** by identifying high-risk passwords before they are deployed.

---

### 🖥️ How would this be used in a SOC?
In a Security Operations Center (SOC) context, this system would be used to:

- Support **secure application onboarding reviews**
- Assist during **identity and access management (IAM) audits**
- Provide **developer security feedback** during SDLC reviews  
- Educate users and teams on password hygiene and entropy concepts  
- Complement SIEM alerts related to repeated authentication failures  

This project demonstrates how **application-layer security controls** contribute to a broader **defense-in-depth strategy**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | Python 3.11+, FastAPI, Pydantic, Uvicorn |
| **Security** | JWT authentication, bcrypt, CORS middleware |
| **Dev Tools** | ESLint, TypeScript strict mode, hot reload |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Python 3.11+**

---

### 🔹 Frontend Setup

```bash
npm install
npm run dev
````

### 🔹 Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 📄 License

This project is provided **for portfolio and demonstration purposes only**.


