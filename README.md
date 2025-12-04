# 🎓 AI Learning Assistant - MERN Stack

AI-powered learning assistant for uploading PDFs, intelligent chat, automatic flashcard and quiz generation using Google Gemini AI.

---

## 📚 Tutorial Project

**Source:** [YouTube - AI Learning Assistant Full Stack](https://www.youtube.com/watch?v=iaAdWmAu0TE)
**Duration:** 6+ hours
**Stack:** MongoDB, Express, React, Node.js + Google Gemini AI

---

## ✨ Features

### 🔐 Authentication

- [x] Login/Register with JWT
- [x] Protected routes (ProtectedRoute)
- [ ] Password reset
- [ ] User profile

### 📄 Document Management

- [x] PDF upload with Multer
- [x] PDF text extraction (pdf-parse)
- [x] Text chunking for AI processing
- [x] Document listing with aggregation
- [x] Document deletion
- [ ] Embedded PDF viewer

### 🤖 AI Integration (Google Gemini)

- [ ] Contextual chat with documents (RAG pattern)
- [ ] Automatic summarization
- [ ] Concept explanation
- [ ] Chat history

### 🎴 Flashcards

- [ ] AI-powered generation
- [ ] Favorites system
- [ ] Flip animation
- [ ] Flashcard review

### 📝 Quizzes

- [ ] Automatic question generation
- [ ] Multiple choice questions
- [ ] Results with feedback
- [ ] Performance analytics

### 📊 Dashboard

- [ ] Activity overview
- [ ] Statistics (documents, flashcards, quizzes)
- [ ] Recent activity feed

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4.1
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Markdown:** React Markdown + Remark GFM
- **Icons:** Lucide React
- **Dates:** Moment.js
- **Code Highlight:** React Syntax Highlighter

### Backend

- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **PDF Processing:** pdf-parse
- **AI:** Google Gemini AI
- **Validation:** Express Validator
- **Security:** Helmet, CORS, bcryptjs

---

## 📂 Project Structure

```
ailearningassistant/
├── .vscode/              # VSCode settings
├── docs/                 # Documentation
│   ├── react-router-dom-essencial.md
│   └── VISAO-GERAL-DO-PROJETO.md
├── frontend/
│   └── ai-learning-assistant/
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── pages/        # Application pages
│       │   ├── services/     # API services (axios)
│       │   ├── utils/        # Utilities
│       │   ├── App.jsx       # Main routes
│       │   └── main.jsx      # Entry point
│       ├── package.json
│       └── vite.config.js
└── backend/
    ├── models/           # Mongoose schemas
    ├── routes/           # Express routes
    ├── controllers/      # Business logic
    ├── helpers/          # Helper functions (processPDF)
    ├── middleware/       # Auth, error handling
    ├── config/           # Database, multer, env
    ├── utils/            # PDF parser, text chunker
    ├── uploads/          # Uploaded PDFs (gitignored)
    ├── server.js         # Entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Google Gemini API key

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd ailearningassistant
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables in .env
npm run dev
```

**Required environment variables (.env):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-learning-assistant
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_key_here
```

### 3️⃣ Frontend Setup

```bash
cd frontend/ai-learning-assistant
npm install
npm run dev
```

### 4️⃣ Access Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📖 Learning & Progress

### Implemented Features

- ✅ React Router DOM (protected routes, layouts, Outlet)
- ✅ Tailwind CSS v4 (new syntax with @import)
- ✅ MERN project structure
- ✅ JWT authentication
- ✅ Document upload with Multer
- ✅ PDF text extraction and chunking
- ✅ Document CRUD operations
- ✅ Background PDF processing

### Next Steps

- [ ] AI chat controller (RAG pattern)
- [ ] Flashcard generation with Gemini
- [ ] Quiz generation with Gemini
- [ ] Connect frontend with backend API
- [ ] Implement frontend pages
- [ ] Full integration testing

---

## 🎓 About the Developer

**Name:** Fernando
**Background:** PHP/Laravel
**Learning:** MERN Stack
**Style:** Understanding the "why" of things, analogies with Laravel

---

## 📝 Development Notes

- **Start Date:** December 3, 2025
- **Status:** 🟢 Backend document domain complete
- **Commits:** Modular structure, one commit per feature
- **Docs:** Custom documentation in `/docs/`

---

## 🤝 Contributing

This is a personal learning project following a tutorial. Suggestions and improvements are welcome!

---

## 📄 License

MIT License - Free for educational use

---

## 🔗 Useful Links

- [Original Tutorial](https://www.youtube.com/watch?v=iaAdWmAu0TE)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [MongoDB Docs](https://www.mongodb.com/docs/)

---

✨ **Made with ❤️ while learning MERN Stack**
