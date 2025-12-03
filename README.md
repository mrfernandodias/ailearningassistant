# 🎓 AI Learning Assistant - MERN Stack

Sistema de assistente de estudos com IA para upload de PDFs, chat inteligente, geração automática de flashcards e quizzes usando Google Gemini AI.

---

## 📚 Projeto Tutorial

**Fonte:** [YouTube - AI Learning Assistant Full Stack](https://www.youtube.com/watch?v=iaAdWmAu0TE)  
**Duração:** 6+ horas  
**Stack:** MongoDB, Express, React, Node.js + Google Gemini AI

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Login/Register com JWT
- [x] Proteção de rotas (ProtectedRoute)
- [ ] Atualização de senha
- [ ] Perfil do usuário

### 📄 Gestão de Documentos
- [ ] Upload de PDFs
- [ ] Visualizador de PDF embarcado
- [ ] Listagem e exclusão de documentos
- [ ] Tracking de tamanho de arquivos

### 🤖 IA Integrada (Google Gemini)
- [ ] Chat contextual com documentos
- [ ] Geração automática de resumos
- [ ] Explicação de conceitos
- [ ] Histórico de conversas

### 🎴 Flashcards
- [ ] Geração automática via IA
- [ ] Sistema de favoritos
- [ ] Animação de flip
- [ ] Review de flashcards

### 📝 Quizzes
- [ ] Geração automática de questões
- [ ] Múltipla escolha configurável
- [ ] Resultados com feedback
- [ ] Analytics de performance

### 📊 Dashboard
- [ ] Visão geral de atividades
- [ ] Estatísticas (documentos, flashcards, quizzes)
- [ ] Feed de atividades recentes

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** React 19 + Vite
- **Estilização:** Tailwind CSS v4.1
- **Roteamento:** React Router DOM v7
- **HTTP Client:** Axios
- **Notificações:** React Hot Toast
- **Markdown:** React Markdown + Remark GFM
- **Ícones:** Lucide React
- **Datas:** Moment.js
- **Code Highlight:** React Syntax Highlighter

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Autenticação:** JWT (jsonwebtoken)
- **Upload:** Multer
- **IA:** Google Gemini AI
- **Validação:** Express Validator
- **Segurança:** Helmet, CORS, bcryptjs

---

## 📂 Estrutura do Projeto

```
ailearningassistant/
├── .vscode/              # Configurações VSCode
├── docs/                 # Documentação
│   └── react-router-dom-essencial.md
├── frontend/
│   └── ai-learning-assistant/
│       ├── src/
│       │   ├── components/   # Componentes reutilizáveis
│       │   ├── pages/        # Páginas da aplicação
│       │   ├── services/     # API services (axios)
│       │   ├── utils/        # Utilitários
│       │   ├── App.jsx       # Rotas principais
│       │   └── main.jsx      # Entry point
│       ├── package.json
│       └── vite.config.js
└── backend/
    ├── models/           # Mongoose schemas
    ├── routes/           # Express routes
    ├── controllers/      # Business logic
    ├── middleware/       # Auth, upload, etc
    ├── config/           # Database, env
    ├── uploads/          # PDFs (gitignored)
    ├── server.js         # Entry point
    └── package.json
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB rodando (local ou Atlas)
- Chave API do Google Gemini

### 1️⃣ Clone o Repositório
```bash
git clone <repository-url>
cd ailearningassistant
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis no .env
npm run dev
```

**Variáveis necessárias (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-learning-assistant
JWT_SECRET=seu_jwt_secret_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
```

### 3️⃣ Frontend Setup
```bash
cd frontend/ai-learning-assistant
npm install
npm run dev
```

### 4️⃣ Acessar Aplicação
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📖 Aprendizado & Progresso

### Conceitos Dominados
- ✅ React Router DOM (rotas protegidas, layouts, Outlet)
- ✅ Tailwind CSS v4 (nova sintaxe com @import)
- ✅ Estrutura de projeto MERN
- ✅ Configuração VSCode para desenvolvimento

### Próximos Passos
- [ ] Implementar backend (MongoDB, Express)
- [ ] Integrar autenticação JWT
- [ ] Conectar frontend com API
- [ ] Implementar upload de PDFs
- [ ] Integrar Google Gemini AI
- [ ] Testar funcionalidades completas

---

## 🎓 Sobre o Desenvolvedor

**Nome:** Fernando  
**Background:** PHP/Laravel  
**Aprendendo:** MERN Stack  
**Estilo:** Entender o "porquê" das coisas, analogias com Laravel

---

## 📝 Notas de Desenvolvimento

- **Data Início:** 03/12/2025
- **Status:** 🟡 Em desenvolvimento (frontend estruturado)
- **Commits:** Estrutura modular, um commit por funcionalidade
- **Docs:** Documentação própria em `/docs/`

---

## 🤝 Contribuição

Este é um projeto de estudo pessoal seguindo tutorial. Sugestões e melhorias são bem-vindas!

---

## 📄 Licença

MIT License - Livre para uso educacional

---

## 🔗 Links Úteis

- [Tutorial Original](https://www.youtube.com/watch?v=iaAdWmAu0TE)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [MongoDB Docs](https://www.mongodb.com/docs/)

---

✨ **Made with ❤️ while learning MERN Stack**
