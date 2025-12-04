/**
 * ============================================
 * 📁 MULTER CONFIGURATION
 * ============================================
 *
 * Configuração do middleware Multer para upload de arquivos
 *
 * Multer processa arquivos enviados via multipart/form-data:
 * 1. Intercepta request com arquivo
 * 2. Valida tipo e tamanho
 * 3. Salva no disco com nome único
 * 4. Adiciona info em req.file
 *
 * Laravel Equivalent: Similar a configurar Storage disk + Request->file()
 */

// ==========================================
// 📦 IMPORTS
// ==========================================
import fs from 'fs'; // File system (sem promises - apenas checagem síncrona)
import multer from 'multer'; // Middleware para upload de arquivos
import path from 'path'; // Manipulação de caminhos
import { fileURLToPath } from 'url'; // Converter URLs ES6 para caminhos

// ==========================================
// 🛠️ SETUP DE DIRETÓRIOS (ES6 Modules)
// ==========================================

/**
 * ES6 Modules não têm __dirname por padrão
 * Precisamos recriar manualmente
 */
const __filename = fileURLToPath(import.meta.url); // Caminho completo deste arquivo
const __dirname = path.dirname(__filename); // Diretório deste arquivo

/**
 * Criar pasta de uploads se não existir
 * ../uploads/documents (relativo a /config)
 *
 * Laravel: Storage::makeDirectory('documents')
 */
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Cria pasta e subpastas
}

// ==========================================
// 💾 CONFIGURAÇÃO DE ARMAZENAMENTO
// ==========================================

/**
 * Define ONDE e COMO salvar arquivos
 *
 * Laravel Equivalent:
 * config/filesystems.php - 'disks' configuration
 */
const storage = multer.diskStorage({
  /**
   * Pasta de destino dos arquivos
   *
   * @param {Request} req - Request do Express
   * @param {File} file - Arquivo sendo enviado
   * @param {Function} cb - Callback (error, destination)
   */
  destination: (req, file, cb) => {
    cb(null, uploadDir); // null = sem erro, uploadDir = pasta destino
  },

  /**
   * Nome do arquivo no disco
   *
   * Formato: timestamp-random-nomeoriginal.pdf
   * Exemplo: 1733352000000-123456789-documento.pdf
   *
   * Por que timestamp + random?
   * - Evita conflitos se 2 usuários fazem upload ao mesmo tempo
   * - Evita sobrescrever arquivos com mesmo nome
   *
   * Laravel: hash names ou original names com Storage::putFile()
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// ==========================================
// 🔒 VALIDAÇÃO DE TIPO DE ARQUIVO
// ==========================================

/**
 * Filtra tipos de arquivo aceitos
 *
 * Recebe cada arquivo antes de salvar e decide:
 * - cb(null, true) = Aceita arquivo
 * - cb(error, false) = Rejeita arquivo
 *
 * Laravel: 'mimes:pdf' ou 'file|mimetypes:application/pdf'
 */
const fileFilter = (req, file, cb) => {
  /**
   * Verifica MIME type (tipo do arquivo)
   *
   * MIME types comuns:
   * - application/pdf = PDF
   * - image/jpeg = JPEG
   * - image/png = PNG
   * - text/plain = TXT
   *
   * ⚠️ IMPORTANTE: MIME type pode ser falsificado!
   * Em produção, considere validação adicional do conteúdo
   */
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Aceita PDF
  } else {
    // Rejeita outros tipos com erro descritivo
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// ==========================================
// ⚙️ CONFIGURAÇÃO FINAL DO MULTER
// ==========================================

/**
 * Cria instância do Multer com todas configurações
 *
 * Este objeto será usado como middleware nas rotas:
 * router.post('/upload', upload.single('file'), controller)
 */
const upload = multer({
  storage: storage, // Onde/como salvar
  fileFilter: fileFilter, // O que aceitar
  limits: {
    /**
     * Tamanho máximo do arquivo em bytes
     *
     * Usa variável de ambiente MAX_FILE_SIZE ou 10MB como padrão
     * 10485760 bytes = 10 * 1024 * 1024 = 10 MB
     *
     * Laravel: 'max:10240' (em KB)
     */
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  },
});

/**
 * Exporta middleware configurado
 *
 * Uso nas rotas:
 * - upload.single('fieldName')   → 1 arquivo
 * - upload.array('fieldName', 5) → Até 5 arquivos
 * - upload.fields([...])         → Múltiplos campos
 */
export default upload;
