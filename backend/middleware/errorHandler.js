/**
 * ============================================
 * 🛡️ ERROR HANDLER MIDDLEWARE
 * ============================================
 *
 * Middleware global para tratamento de erros da aplicação.
 * Captura todos os erros e retorna responses padronizadas.
 *
 * Analogia Laravel: app/Exceptions/Handler.php
 *
 * @param {Error} err - Objeto de erro capturado
 * @param {Request} req - Request do Express
 * @param {Response} res - Response do Express
 * @param {Function} next - Próximo middleware (não usado aqui)
 */
const errorHandler = (err, req, res, next) => {
  // 📋 Inicializa statusCode e message com valores padrão
  // Usa valores do erro se existirem, senão 500 (Internal Server Error)
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // ==========================================
  // 🔍 MONGOOSE ERRORS
  // ==========================================

  /**
   * CastError: ID inválido no MongoDB
   * Exemplo: /api/documents/abc123 (ID deve ser ObjectId válido)
   * Laravel: ModelNotFoundException
   */
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  /**
   * ValidationError: Validação do Schema Mongoose falhou
   * Exemplo: Campo obrigatório não preenchido, tipo de dado errado
   * Laravel: ValidationException
   */
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  /**
   * MongoServerError: Erro mais moderno do MongoDB
   * Versões mais recentes do Mongoose usam este ao invés de código direto
   * Trata duplicação de chave única (código 11000)
   * Exemplo: Email já cadastrado, username duplicado
   * Laravel: QueryException com código 1062
   */
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    message = `${field || 'Field'} already exists`;
    statusCode = 400;
  }

  // ==========================================
  // 📝 EXPRESS VALIDATOR ERRORS
  // ==========================================

  /**
   * Express Validator: Erros de validação de request
   * Usado em routes com body(), param(), query()
   * Exemplo: Email inválido, senha muito curta
   * Laravel: Form Request Validation
   */
  if (err.array && typeof err.array === 'function') {
    message = err
      .array()
      .map((e) => e.msg)
      .join(', ');
    statusCode = 400;
  }

  // ==========================================
  // 📤 MULTER (FILE UPLOAD) ERRORS
  // ==========================================

  /**
   * LIMIT_FILE_SIZE: Arquivo excede tamanho máximo
   * Configurado no middleware multer (ex: 10MB)
   * Exemplo: Upload de PDF com 15MB quando limite é 10MB
   * Laravel: FilesizeExceededException
   */
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File size exceeds the maximum limit of 10MB';
    statusCode = 400;
  }

  // ==========================================
  // 🔐 JWT (JSON WEB TOKEN) ERRORS
  // ==========================================

  /**
   * JsonWebTokenError: Token JWT malformado ou inválido
   * Exemplo: Token corrompido, assinatura inválida
   * Laravel: TokenInvalidException (Sanctum/Passport)
   */
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401; // Unauthorized
  }

  /**
   * TokenExpiredError: Token JWT expirou
   * Usuário precisa fazer login novamente
   * Laravel: TokenExpiredException
   */
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401; // Unauthorized
  }

  // ==========================================
  // 📊 LOGGING
  // ==========================================

  /**
   * Log do erro no console do servidor
   * Em produção, considere usar logger profissional (Winston, Morgan)
   * Stack trace só em development por segurança
   */
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // ==========================================
  // 📤 RESPONSE PADRONIZADA
  // ==========================================

  /**
   * Response JSON estruturada para o cliente
   *
   * Campos sempre presentes:
   * - success: false (indica erro)
   * - error: mensagem amigável do erro
   * - statusCode: código HTTP (400, 401, 404, 500, etc)
   * - timestamp: quando o erro ocorreu (ISO 8601)
   * - path: rota que gerou o erro
   *
   * Campos apenas em development (segurança):
   * - stack: stack trace completo do erro
   * - details: objeto de erro completo (para debugging)
   */
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    // Spread operator: adiciona campos extras apenas em development
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
};

export default errorHandler;
