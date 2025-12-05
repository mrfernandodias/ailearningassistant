/**
 * ============================================
 * 🚀 AI LEARNING ASSISTANT - SERVER
 * ============================================
 *
 * Servidor Express.js para API REST do sistema de aprendizado com IA.
 * Fornece endpoints para autenticação, upload de PDFs, chat com IA,
 * geração de flashcards e quizzes.
 *
 * Analogia Laravel: Similar a bootstrap/app.php + routes/api.php
 */

// ==========================================
// 📦 IMPORTS - Dependências Externas
// ==========================================
import cors from 'cors'; // Cross-Origin Resource Sharing (permite frontend acessar API)
import dotenv from 'dotenv'; // Carrega variáveis de ambiente do arquivo .env
import express from 'express'; // Framework web para Node.js (como Laravel para PHP)
import path from 'path'; // Manipulação de caminhos de arquivos
import { fileURLToPath } from 'url'; // Converte URLs de módulos ES6 para caminhos

// ==========================================
// 📦 IMPORTS - Módulos Internos
// ==========================================
import connectDB from './config/db.js'; // Conexão com MongoDB
import errorHandler from './middleware/errorHandler.js'; // Middleware global de erros
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';

// ==========================================
// ⚙️ CONFIGURAÇÃO INICIAL
// ==========================================

/**
 * Carrega variáveis de ambiente do arquivo .env
 * Exemplo: PORT, MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
 * Laravel: Equivalente ao arquivo .env carregado automaticamente
 */
dotenv.config();

/**
 * ES6 Modules não têm __dirname por padrão
 * Workaround para obter o diretório atual do arquivo
 * Necessário para servir arquivos estáticos (uploads)
 */
const __filename = fileURLToPath(import.meta.url); // Caminho completo do arquivo atual
const __dirname = path.dirname(__filename); // Diretório do arquivo atual

/**
 * Inicializa aplicação Express
 * Laravel: Equivalente a criar instância do Application
 */
const app = express();

// ==========================================
// 🗄️ DATABASE CONNECTION
// ==========================================

/**
 * Conecta ao MongoDB usando Mongoose
 * Conexão é assíncrona, mas não bloqueamos o servidor
 * Se falhar, o errorHandler captura e exibe erro
 * Laravel: Similar a config/database.php + DB::connection()
 */
connectDB();

// ==========================================
// 🛡️ MIDDLEWARES GLOBAIS
// ==========================================

/**
 * CORS: Permite requisições de diferentes origens
 *
 * Frontend: http://localhost:5173 (Vite)
 * Backend:  http://localhost:8000 (Express)
 *
 * Sem CORS, navegador bloqueia requisições por segurança
 *
 * Configuração:
 * - origin: '*' = permite qualquer origem (OK para dev, MUDAR em produção!)
 * - methods: Métodos HTTP permitidos
 * - allowedHeaders: Headers aceitos (Content-Type para JSON, Authorization para JWT)
 * - credentials: true = permite envio de cookies/auth headers
 *
 * Laravel: Equivalente a config/cors.php
 */
app.use(
  cors({
    origin: '*', // ⚠️ TODO: Mudar para process.env.CLIENT_URL em produção
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

/**
 * Express JSON Parser
 * Converte body de requisições JSON para objeto JavaScript
 * Exemplo: { "email": "user@email.com" } → req.body.email
 * Laravel: Request $request->input('email') faz isso automaticamente
 */
app.use(express.json());

/**
 * Express URL-encoded Parser
 * Processa dados de formulários HTML (application/x-www-form-urlencoded)
 * extended: true = permite objetos aninhados
 * Laravel: Request também processa automaticamente
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Servir arquivos estáticos da pasta 'uploads'
 * PDFs enviados pelos usuários ficam acessíveis via URL
 * Exemplo: uploads/documento.pdf → http://localhost:8000/uploads/documento.pdf
 * Laravel: Equivalente a Storage::disk('public') ou public/storage
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 🛤️ ROTAS DA API
// ==========================================

/**
 * TODO: Registrar rotas aqui
 *
 * Estrutura esperada:
 * app.use('/api/auth', authRoutes);         // Login, Register, Profile
 * app.use('/api/documents', documentRoutes); // Upload, List, Delete PDFs
 * app.use('/api/flashcards', flashcardRoutes); // CRUD Flashcards
 * app.use('/api/quizzes', quizRoutes);       // CRUD Quizzes
 * app.use('/api/ai', aiRoutes);             // Chat, Summary, Explain
 *
 * Laravel: Equivalente a Route::group(['prefix' => 'api'], ...)
 */

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);

// ==========================================
// ❌ 404 HANDLER - Rota Não Encontrada
// ==========================================

/**
 * Captura todas as requisições que não correspondem a nenhuma rota
 * DEVE vir DEPOIS de todas as rotas, mas ANTES do errorHandler
 *
 * Retorna JSON padronizado com status 404
 * Laravel: Route::fallback() ou App\Exceptions\Handler::render()
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    statusCode: 404,
  });
});

// ==========================================
// 🛡️ ERROR HANDLER - Middleware de Erros
// ==========================================

/**
 * Middleware global para capturar TODOS os erros da aplicação
 * DEVE ser o ÚLTIMO middleware registrado
 *
 * Erros capturados:
 * - Mongoose (CastError, ValidationError, Duplicate key)
 * - Express Validator (validação de formulários)
 * - Multer (upload de arquivos)
 * - JWT (token inválido/expirado)
 * - Erros customizados (throw new Error())
 *
 * Laravel: App\Exceptions\Handler::render()
 */
app.use(errorHandler);

// ==========================================
// 🚀 START SERVER
// ==========================================

/**
 * Porta do servidor
 * Usa PORT do .env ou 8000 como fallback
 * Laravel: php artisan serve (porta 8000 por padrão)
 */
const PORT = process.env.PORT || 8000;

/**
 * Inicia servidor e escuta requisições HTTP
 * Callback executado quando servidor está pronto
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// ==========================================
// 🔥 PROCESS ERROR HANDLERS
// ==========================================

/**
 * Captura promises rejeitadas não tratadas
 *
 * Exemplo: await fetch() sem try/catch
 *
 * Importante para evitar crashes silenciosos
 * Loga erro e encerra processo (em produção, usar PM2 para restart automático)
 *
 * Laravel: Similar a reportar exceções não tratadas
 */
process.on('unhandledRejection', err => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
  process.exit(1); // Encerra processo com código de erro
});
