# 🎓 AI Learning Assistant - MERN Stack

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

**AI-powered learning assistant that transforms PDFs into interactive study experiences**

[Features](#-features) • [Installation](#-installation) • [Usage](#-how-to-use) • [Structure](#-project-structure) • [API](#-api-documentation)

</div>

---

## 📖 About The Project

AI Learning Assistant is a full-stack application that leverages artificial intelligence to revolutionize how students interact with their study materials. Upload PDFs, chat with your documents using AI, generate flashcards automatically, and create quizzes - all powered by Google Gemini AI.

### 🎯 Purpose

Developed as a learning project following the [Time to Program](https://www.youtube.com/watch?v=iaAdWmAu0TE) tutorial, this project demonstrates the implementation of a complete MERN application with AI integration, file processing, and the RAG (Retrieval-Augmented Generation) pattern.

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ User registration with validation
- ✅ Login/Logout with JWT tokens
- ✅ Protected routes on frontend and backend
- ✅ Session management
- [ ] Password reset functionality
- [ ] Email verification

### 📄 Document Management

- ✅ **PDF Upload**
  - Drag & drop interface
  - File validation (type, size)
  - Multer middleware for file handling
  - Unique filename generation
- ✅ **PDF Processing**
  - Text extraction with pdf-parse
  - Automatic text chunking (500 words per chunk)
  - 50-word overlap between chunks for context preservation
  - Background processing with status tracking
- ✅ **Document CRUD**
  - List all user documents with metadata
  - View document details
  - Delete documents with file cleanup
  - Aggregation with flashcard/quiz counts

### 🤖 AI Integration (Google Gemini)

- [ ] **Contextual Chat**
  - Chat with your documents using RAG pattern
  - Retrieval of relevant chunks
  - AI responses based on document content
  - Chat history persistence
- [ ] **Content Generation**
  - Automatic flashcard generation from document
  - Quiz creation with multiple choice questions
  - Explanations for quiz answers
  - Difficulty levels (Easy, Medium, Hard)

### 🎴 Flashcards

- [ ] AI-powered flashcard generation
- [ ] Question/Answer pairs from document chunks
- [ ] Star/favorite system
- [ ] Review tracking
- [ ] Progress statistics
- [ ] Flip animation interface

### 📝 Quizzes

- [ ] Automatic quiz generation
- [ ] Multiple choice questions (4 options)
- [ ] Correct answer marking
- [ ] Detailed explanations
- [ ] Performance analytics
- [ ] Score tracking

### 📊 Dashboard

- [ ] Study statistics overview
- [ ] Document upload history
- [ ] Quiz performance metrics
- [ ] Flashcard review progress
- [ ] Recent activity feed

---

## 🛠️ Tech Stack

### Frontend

```json
{
  "framework": "React 19",
  "build": "Vite",
  "routing": "React Router DOM 7",
  "styling": "Tailwind CSS 4.1",
  "http": "Axios",
  "notifications": "React Hot Toast",
  "markdown": "React Markdown + Remark GFM",
  "icons": "Lucide React",
  "code": "React Syntax Highlighter",
  "date": "Moment.js"
}
```

### Backend

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.18",
  "database": "MongoDB + Mongoose",
  "auth": "JWT (jsonwebtoken)",
  "upload": "Multer",
  "pdf": "pdf-parse",
  "ai": "Google Gemini AI",
  "validation": "Express Validator",
  "security": "bcryptjs, helmet, cors"
}
```

---

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Google Gemini API key ([Get it here](https://ai.google.dev/))
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/mrfernandodias/ailearningassistant.git
cd ailearningassistant
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend/ai-learning-assistant
npm install
```

---

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` folder (use `.env.example` as template):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-learning-assistant

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads/documents

# CORS
CLIENT_URL=http://localhost:5173
```

**Security Tips:**

- Generate secure JWT secret: `openssl rand -base64 32`
- Never commit your `.env` file to version control
- Get Gemini API key at: https://ai.google.dev/

### Frontend Environment Variables

Create a `.env` file in the `frontend/ai-learning-assistant/` folder:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=AI Learning Assistant
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Running the Project

### Development

#### 1. Start MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud)
```

#### 2. Start Backend

```bash
cd backend
npm run dev
```

Server running at: `http://localhost:5000`

#### 3. Start Frontend

```bash
cd frontend/ai-learning-assistant
npm run dev
```

Application running at: `http://localhost:5173`

### Production

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend/ai-learning-assistant
npm run build
npm run preview
```

---

## 📂 Project Structure

```
ailearningassistant/
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB configuration
│   │   └── multer.js                 # File upload configuration
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic
│   │   ├── documentController.js     # Document CRUD + upload
│   │   ├── aiController.js           # AI chat functionality (planned)
│   │   ├── flashcardController.js    # Flashcard generation (planned)
│   │   └── quizController.js         # Quiz generation (planned)
│   ├── helpers/
│   │   └── documentHelpers.js        # PDF processing helper
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification
│   │   └── errorHandler.js           # Global error handler
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Document.js               # Document schema with chunks
│   │   ├── ChatHistory.js            # Chat history schema
│   │   ├── Flashcard.js              # Flashcard schema
│   │   └── Quiz.js                   # Quiz schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── aiRoutes.js               # (planned)
│   │   ├── flashcardRoutes.js        # (planned)
│   │   └── quizRoutes.js             # (planned)
│   ├── utils/
│   │   ├── pdfParser.js              # PDF text extraction
│   │   └── textChunker.js            # Text chunking for AI
│   ├── uploads/
│   │   └── documents/                # Uploaded PDFs (gitignored)
│   ├── .env                          # Environment variables
│   ├── server.js                     # Entry point
│   └── package.json
│
└── frontend/ai-learning-assistant/
    ├── public/                       # Static assets
    ├── src/
    │   ├── components/
    │   │   ├── layouts/
    │   │   │   └── DashboardLayout.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ...                   # (more components)
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── Documents/
    │   │   │   ├── DocumentList.jsx
    │   │   │   ├── DocumentUpload.jsx
    │   │   │   └── DocumentView.jsx
    │   │   ├── Chat/
    │   │   │   └── DocumentChat.jsx  # (planned)
    │   │   ├── Flashcards/
    │   │   │   └── FlashcardReview.jsx # (planned)
    │   │   ├── Quizzes/
    │   │   │   └── QuizTaker.jsx     # (planned)
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   ├── api.js                # Axios instance
    │   │   ├── authService.js
    │   │   ├── documentService.js
    │   │   └── ...
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx                   # Main routes
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── .env                          # Environment variables
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🎯 How to Use

### 1. Create Account

- Access `http://localhost:5173`
- Click "Register" or "Sign Up"
- Fill in your details (name, email, password)
- Create your account

### 2. Login

- Login with your credentials
- You will be redirected to the dashboard

### 3. Upload Document

- Navigate to "Documents" or "Upload"
- Click "Upload PDF" or drag & drop a PDF file
- Enter a title for your document
- Click "Upload"
- The system will:
  - Save the file to the server
  - Extract all text from the PDF
  - Split the text into chunks (500 words each)
  - Store everything in MongoDB
  - Update status from "processing" to "ready"

### 4. View Documents

- Access "My Documents" to see all uploaded files
- Each document shows:
  - Title and filename
  - Upload date
  - File size
  - Processing status
  - Number of pages
  - Number of flashcards generated
  - Number of quizzes created
- Click on a document to view details

### 5. Chat with Document (Coming Soon)

- Open a document
- Click "Chat with Document"
- Ask questions about the content:
  - "Summarize chapter 3"
  - "What are the main concepts?"
  - "Explain [specific topic]"
- The AI will:
  - Find relevant chunks from your document
  - Use only your document's content (not general knowledge)
  - Provide accurate, contextual answers
  - Save chat history for later reference

### 6. Generate Flashcards (Coming Soon)

- Open a document
- Click "Generate Flashcards"
- AI will:
  - Analyze document chunks
  - Create question/answer pairs
  - Set difficulty levels
  - Save flashcards to your library
- Review flashcards with flip animation
- Star important cards
- Track your review progress

### 7. Generate Quiz (Coming Soon)

- Open a document
- Click "Generate Quiz"
- Choose:
  - Number of questions
  - Difficulty level
  - Topics to focus on
- AI will:
  - Create multiple choice questions
  - Provide 4 options per question
  - Include explanations for answers
- Take the quiz
- View results with detailed feedback
- See performance analytics

### 8. Dashboard Analytics (Coming Soon)

- View your learning statistics:
  - Documents uploaded
  - Flashcards created and reviewed
  - Quizzes taken and average scores
  - Study time tracking
  - Progress over time
- Recent activity feed
- Upcoming reviews reminder

---

## 🌐 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile
POST   /api/auth/logout       - Logout user
```

### Document Endpoints

```
POST   /api/documents/upload  - Upload PDF document
GET    /api/documents         - Get all user documents (with aggregation)
GET    /api/documents/:id     - Get document by ID
DELETE /api/documents/:id     - Delete document and file
```

### AI Chat Endpoints (Planned)

```
POST   /api/ai/chat                    - Chat with document
GET    /api/ai/chat/:documentId        - Get chat history
DELETE /api/ai/chat/:documentId        - Clear chat history
```

### Flashcard Endpoints (Planned)

```
POST   /api/flashcards/generate/:documentId  - Generate flashcards
GET    /api/flashcards                        - Get all user flashcards
GET    /api/flashcards/:id                    - Get flashcard set
PUT    /api/flashcards/:id/review             - Update review status
DELETE /api/flashcards/:id                    - Delete flashcard set
```

### Quiz Endpoints (Planned)

```
POST   /api/quizzes/generate/:documentId  - Generate quiz
GET    /api/quizzes                        - Get all user quizzes
GET    /api/quizzes/:id                    - Get quiz by ID
POST   /api/quizzes/:id/submit             - Submit quiz answers
GET    /api/quizzes/:id/results            - Get quiz results
DELETE /api/quizzes/:id                    - Delete quiz
```

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔍 Key Technical Concepts

### RAG Pattern (Retrieval-Augmented Generation)

This project implements the RAG pattern for AI chat:

1. **Retrieval**: Find relevant chunks from document
2. **Augmentation**: Add chunks as context to user question
3. **Generation**: AI generates answer based on provided context

**Why RAG?**

- AI answers based on YOUR document, not general knowledge
- Accurate, contextual responses
- Handles documents larger than AI context window
- Cost-effective (only send relevant chunks, not entire document)

### Text Chunking Strategy

**Why chunk documents?**

- AI models have token limits (typically 8k-32k tokens)
- Large PDFs can be 50k+ tokens
- Sending entire document is expensive and slow
- Only relevant sections needed for each query

**Our approach:**

- **Chunk size**: 500 words
- **Overlap**: 50 words between chunks
- **Why overlap?** Prevents losing context at chunk boundaries

**Example:**

```
Document: 10,000 words
Chunks created: ~20 chunks
User asks: "What is React?"
Relevant chunks: 2-3 chunks sent to AI (~1,500 words)
Savings: 85% fewer tokens = 85% cost reduction!
```

### Document Processing Pipeline

```
1. User uploads PDF
   └─> Multer saves file to disk
       └─> Document record created (status: 'processing')
           └─> Response sent immediately (non-blocking)

2. Background Processing (async)
   └─> pdf-parse extracts all text
       └─> textChunker splits into 500-word chunks
           └─> Chunks stored in MongoDB
               └─> Status updated to 'ready'

3. Document Ready for AI Features
   └─> Chat can use chunks
   └─> Flashcards generated from chunks
   └─> Quizzes created from chunks
```

---

## 📊 Project Stats

```
Backend (Implemented):
- 5 Models (User, Document, ChatHistory, Flashcard, Quiz)
- Document upload with Multer
- PDF text extraction (pdf-parse)
- Text chunking algorithm
- JWT Authentication
- MongoDB aggregation pipelines

Backend (Planned):
- 10+ AI endpoints
- RAG implementation
- Gemini AI integration
- Flashcard/Quiz generation

Frontend (Implemented):
- Authentication pages
- Protected routing
- Dashboard layout

Frontend (Planned):
- Document management UI
- Chat interface
- Flashcard review system
- Quiz interface
- Analytics dashboard
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (COMPLETE)

- [x] Project structure setup
- [x] MongoDB connection
- [x] JWT authentication
- [x] User model and routes
- [x] Document model with chunks
- [x] Multer file upload
- [x] PDF text extraction
- [x] Text chunking algorithm
- [x] Document CRUD operations

### 🚧 Phase 2: AI Integration (IN PROGRESS)

- [ ] Google Gemini AI setup
- [ ] AI chat controller
- [ ] RAG pattern implementation
- [ ] Chat history persistence
- [ ] Flashcard generation
- [ ] Quiz generation

### 📋 Phase 3: Frontend (PLANNED)

- [ ] Document upload UI
- [ ] Document list with filters
- [ ] Chat interface with Markdown
- [ ] Flashcard review interface
- [ ] Quiz taking interface
- [ ] Dashboard with analytics

### 🚀 Phase 4: Advanced Features

- [ ] Semantic search with embeddings
- [ ] Study recommendations
- [ ] Spaced repetition algorithm
- [ ] Export flashcards (Anki format)
- [ ] Collaborative study groups
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! This project was created for learning purposes, and improvements are always appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Commit Convention

This project follows the Conventional Commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process or tool changes

---

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

## 👨‍💻 Author

**Fernando Dias**

- GitHub: [@mrfernandodias](https://github.com/mrfernandodias)
- LinkedIn: [Fernando Dias](https://linkedin.com/in/mrfernandodias)

---

## 🙏 Acknowledgments

- **[Time to Program](https://www.youtube.com/@TimetoProgram)** - Excellent MERN Stack + AI tutorial
- Google Gemini AI team for providing powerful AI capabilities
- React, Node.js, MongoDB, and Express.js communities
- All open source library maintainers

---

<div align="center">

**⭐ If this project was helpful to you, consider giving it a star!**

Made with ❤️ and ☕ while learning MERN Stack + AI

</div>
