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

Developed as a complete MERN learning project following the [Time to Program](https://www.youtube.com/watch?v=iaAdWmAu0TE) tutorial. This project demonstrates a production-ready implementation of a full-stack application with AI integration, file processing, the RAG (Retrieval-Augmented Generation) pattern, and modern UI/UX design.

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ User registration with validation
- ✅ Login/Logout with JWT tokens
- ✅ Protected routes on frontend and backend
- ✅ Session management
- ✅ Password change functionality
- ✅ User profile page

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

- ✅ **Contextual Chat (RAG Pattern)**
  - Chat with documents using Retrieval-Augmented Generation
  - Intelligent chunk retrieval with TF-IDF algorithm
  - Query expansion for better search results
  - Multi-turn conversations with context awareness
  - Chat history persistence in MongoDB
  - Top 5 most relevant chunks per query
- ✅ **Content Generation**
  - Automatic flashcard generation from documents
  - Quiz creation with multiple choice questions (4 options each)
  - Detailed explanations for quiz answers
  - Difficulty levels (Easy, Medium, Hard)
  - Document summarization with structured output

### 🎴 Flashcards

- ✅ AI-powered flashcard generation (10 cards per request)
- ✅ Question/Answer pairs from document chunks
- ✅ Star/favorite system
- ✅ Review tracking with timestamps and counters
- ✅ Flip animation interface
- ✅ Flashcard listing page with progress tracking

### 📝 Quizzes

- ✅ Automatic quiz generation (configurable quantity)
- ✅ Multiple choice questions (4 options)
- ✅ Correct answer marking
- ✅ Detailed explanations
- ✅ Quiz take page with navigation
- ✅ Results page with score breakdown and analytics

### 📊 Dashboard

- ✅ Study statistics overview
- ✅ Total documents, flashcards, and quizzes tracking
- ✅ Recent activity feed
- ✅ Quick access to all features

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
  │   ├── aiController.js           # AI chat, summary, explain, generation
  │   ├── flashcardController.js    # Flashcard CRUD and review
  │   ├── quizController.js         # Quiz generation and grading
  │   └── dashboardController.js    # Dashboard statistics
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
│   │   ├── aiRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── quizRoutes.js
│   │   └── dashboardRoutes.js
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
    │   │   │   ├── DocumentListPage.jsx
    │   │   │   ├── DocumentDetailPage.jsx
    │   │   │   └── DocumentCard.jsx
    │   │   ├── Chat/
    │   │   │   └── DocumentChat.jsx
    │   │   ├── Flashcards/
    │   │   │   ├── FlashcardListPage.jsx
    │   │   │   ├── FlashcardPage.jsx
    │   │   │   └── FlashcardSetCard.jsx
    │   │   ├── Quizzes/
    │   │   │   ├── QuizTakePage.jsx
    │   │   │   └── QuizResultPage.jsx
    │   │   ├── Profile/
    │   │   │   └── ProfilePage.jsx
    │   │   └── Dashboard/
    │   │       └── DashboardPage.jsx
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

### 5. Chat with Document

- Open a document
- Click on the "Chat" tab
- Ask questions about the content:
  - "Summarize chapter 3"
  - "What are the main concepts?"
  - "Explain [specific topic]"
- The AI will:
  - Find relevant chunks from your document using RAG
  - Use only your document's content (not general knowledge)
  - Provide accurate, contextual answers
  - Save chat history for later reference
- View your conversation history
- Multi-turn conversations with context awareness

### 6. Generate Flashcards

- Open a document
- Click on the "Flashcards" tab
- Click "Generate Flashcards"
- AI will:
  - Analyze document chunks
  - Create 10 question/answer pairs
  - Assign difficulty levels
  - Save flashcards to your library
- Review flashcards with flip animation
- Star/favorite important cards
- Track your review progress and count
- Access all flashcards from the dedicated Flashcards page

### 7. Generate Quiz

- Open a document
- Click on the "Quizzes" tab
- Click "Generate Quiz"
- Choose the number of questions (5, 10, 15, or 20)
- AI will:
  - Create multiple choice questions from document content
  - Provide 4 options per question
  - Mark the correct answer
  - Include detailed explanations
- Take the quiz with question navigation
- Submit your answers
- View results with:
  - Your score and percentage
  - Detailed breakdown for each question
  - Correct vs. selected answers highlighted
  - Explanations for all answers

### 8. Dashboard Analytics

- View your learning statistics:
  - Total documents uploaded
  - Total flashcards created
  - Total quizzes generated
  - Recent activity feed with timestamps
- Quick access cards to:
  - Upload new documents
  - Access your documents
  - Review flashcards
  - Take quizzes

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

### AI Endpoints

```
POST   /api/ai/chat                    - Chat with document (RAG)
GET    /api/ai/chat/:documentId        - Get chat history
DELETE /api/ai/chat/:documentId        - Clear chat history
POST   /api/ai/summary/:documentId     - Generate document summary
POST   /api/ai/explain/:documentId     - Explain a concept
POST   /api/ai/flashcards/:documentId  - Generate flashcards
POST   /api/ai/quiz/:documentId        - Generate quiz
```

### Flashcard Endpoints

```
GET    /api/flashcards                        - Get all user flashcards
GET    /api/flashcards/:id                    - Get flashcard set
PUT    /api/flashcards/:id/review             - Update review status
PUT    /api/flashcards/:id/favorite           - Toggle favorite status
DELETE /api/flashcards/:id                    - Delete flashcard set
```

### Quiz Endpoints

```
GET    /api/quizzes                        - Get all user quizzes
GET    /api/quizzes/:id                    - Get quiz by ID
POST   /api/quizzes/:id/submit             - Submit quiz answers
GET    /api/quizzes/:id/results            - Get quiz results
DELETE /api/quizzes/:id                    - Delete quiz
```

### Dashboard Endpoints

```
GET    /api/dashboard/overview             - Get dashboard statistics
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
Backend (Completed):
- 5 Models (User, Document, ChatHistory, Flashcard, Quiz)
- JWT Authentication with password change
- Document upload with Multer
- PDF text extraction (pdf-parse)
- Text chunking algorithm (500 words, 50 overlap)
- MongoDB aggregation pipelines
- RAG implementation with TF-IDF
- Google Gemini AI integration
- 15+ API endpoints
- AI chat with query expansion and multi-turn context
- Flashcard generation and review system
- Quiz generation, submission, and grading
- Dashboard statistics

Frontend (Completed):
- Authentication pages (Login, Register)
- Protected routing
- Dashboard with statistics and activity feed
- Document management UI (List, Upload, Details, PDF Viewer)
- AI Chat interface with history
- AI Actions (Summary, Explain Concept)
- Flashcard listing and review with flip animation
- Quiz take page with navigation
- Quiz results page with detailed breakdown
- Profile page with password change
- Responsive Tailwind CSS design
```

---

## 🚀 AI Enhancements Beyond Tutorial

This project started from the [Time to Program tutorial](https://www.youtube.com/watch?v=iaAdWmAu0TE) but has been significantly enhanced with advanced AI features:

### **1. Query Expansion** 🔍

Original question is expanded into 2-3 alternative phrasings to improve document search accuracy.

**Example:**

```
User asks: "How to install?"
System searches for:
  1. "How to install?"
  2. "Installation guide"
  3. "Steps to install"
```

**Benefit**: Finds relevant information even with different wording.

### **2. Multi-Turn Conversations** 💬

Chat remembers the last 5 messages to provide contextual responses.

**Example:**

```
User: "What is React?"
AI: "React is a JavaScript library..."
User: "How to install it?" ← Understands "it" refers to React
AI: "To install React, use create-react-app..."
```

**Benefit**: Natural conversation flow without repeating context.

### **3. Enhanced Chunk Retrieval** 📄

- Searches using multiple query variations
- Returns top 5 most relevant chunks (instead of 3)
- Removes duplicates intelligently
- Uses TF-IDF algorithm with stop words filtering

**Benefit**: More comprehensive and accurate answers.

### **4. Advanced Prompt Engineering** 🎯

Structured prompts with clear instructions for all AI features:

#### **Chat Prompts:**

- Staying within document context
- Using bullet points when appropriate
- Handling multi-turn context
- Clear fallback responses

#### **Flashcard Generation:**

- Tests comprehension, not just memorization
- Avoids yes/no questions
- Even difficulty distribution
- Self-contained cards

#### **Quiz Generation:**

- Realistic, plausible distractors
- Single correct answer validation
- Detailed explanations (2-3 sentences)
- Difficulty-based distribution

#### **Summary Generation:**

- Structured format (overview → concepts → takeaways)
- Markdown formatting (headers, bold, bullets)
- Controlled length (300-500 words)
- Academic tone

#### **Concept Explanation:**

- Simple definition first
- Uses analogies and real-world examples
- Addresses common misconceptions
- Practical applications
- Markdown formatting

**Benefit**: Consistent, high-quality AI responses across all features.

### **5. Chat History Persistence** 💾

All conversations stored in MongoDB with:

- User and assistant messages
- Timestamps
- Relevant chunk indices for each response
- Conversation threading per document

**Benefit**: Review past conversations and continue where you left off.

---

## 🗺️ Roadmap

This project is under active development. For a complete vision of planned features, business strategy, and future enhancements, see **[ROADMAP.md](ROADMAP.md)**.

### Current Development Status

**✅ MVP Completed (v1.0.0):**

- ✅ Full MERN stack with JWT authentication
- ✅ PDF upload, processing, and embedded viewer
- ✅ Google Gemini AI integration (chat, flashcards, quiz, summary, explain)
- ✅ RAG pattern with query expansion and multi-turn conversations
- ✅ Advanced prompt engineering for all AI features
- ✅ Chat history persistence
- ✅ Complete frontend UI for all features
- ✅ Quiz submission and grading system
- ✅ Dashboard with statistics and activity feed
- ✅ Flashcard flip animation and favorites system
- ✅ Profile management with password change
- ✅ Responsive mobile-friendly design

**📋 Future Enhancements:**

- Spaced repetition algorithm for flashcards
- Export features (Anki, Notion, PDF)
- Collaborative study features
- Advanced analytics and progress tracking
- Performance optimizations

For detailed feature breakdown, monetization strategy, and long-term vision, check the [complete roadmap](ROADMAP.md).

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
