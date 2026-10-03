# TalentAI — AI-Powered Part-Time Job Services Platform Prototype

> **Prototype Objective:** A functional, modern web platform designed specifically for students and job seekers to discover flexible part-time opportunities matched to their exact skills, schedule availability, and career interests.

---

## 🌟 Core Student Workflow

```
Landing Page
     ↓
Register Account
     ↓
Auto Login & Token Session
     ↓
Student Profile Setup (Skills, Education, Availability)
     ↓
Student Dashboard (Profile Completion & AI Recommendations)
     ↓
Browse & Filter Job Marketplace
     ↓
Open Job Details (Large AI Match Score & Skill Gap Analysis)
     ↓
Apply Modal (✨ Generate AI Application Letter & Edit)
     ↓
Application Submitted (Duplicate Prevention)
     ↓
Track My Applications (Stage-by-Stage Visual Timeline)
```

---

## 🚀 Key Features

1. **AI Job Matching Engine**:
   - Skill Match: **50%**
   - Location & Remote Preference: **15%**
   - Availability Schedule: **15%**
   - Job Type / Category: **10%**
   - Education Relevance: **10%**
   - Dynamic rationale ("Why this job matches")
   - Skill Gap Analysis (Matched skills vs Learnable skills)

2. **AI Application Assistant**:
   - One-click cover letter generator tailored to student credentials and specific employer requirements.
   - Fully editable before explicit student submission.

3. **Application Tracking**:
   - Visual timeline (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected` / `Rejected`).
   - Built-in status simulation selector for demonstration.

4. **Notifications System**:
   - Real-time notifications for application submissions, profile milestones, and hiring status updates.

5. **Resilient Data Storage**:
   - Dual-engine architecture: connects to MongoDB if available, or seamlessly falls back to persistent JSON storage in `./server/data/` for zero-setup execution.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS
- **Database**: MongoDB / Mongoose with persistent file-backed fallback
- **AI Mode**: Transparent rule-based weighted matching + AI cover letter generation (`AI_MODE=mock`)

---

## 🏃 Quick Start Instructions

### 1. Start Backend Server
```bash
cd server
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🧪 Demonstration Test Credentials

- **Email**: `student@university.edu`
- **Password**: `student123`
*(Or click "Demo Fill" on the Login page)*
