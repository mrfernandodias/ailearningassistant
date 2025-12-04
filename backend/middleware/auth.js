import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * ============================================================================
 * MIDDLEWARE DE AUTENTICAÇÃO (protect)
 * ============================================================================
 *
 * Este middleware protege rotas que exigem autenticação via JWT.
 * Similar ao middleware 'auth' do Laravel.
 *
 * Fluxo:
 * 1. Verifica se existe token JWT no header Authorization
 * 2. Valida o token usando a chave secreta
 * 3. Busca o usuário no banco de dados
 * 4. Adiciona o usuário em req.user para uso nos controllers
 * 5. Chama next() para continuar para o controller
 *
 * Uso:
 * router.get('/profile', protect, controller);
 *                        ^^^^^^^ middleware aplicado antes do controller
 *
 * Laravel equivalente:
 * Route::get('/profile', [Controller::class, 'method'])->middleware('auth');
 * ============================================================================
 */
const protect = async (req, res, next) => {
  let token;

  /**
   * =========================================================================
   * PASSO 1: Verificar se o token existe no header Authorization
   * =========================================================================
   *
   * O cliente deve enviar o token no formato:
   * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *
   * Laravel equivalente:
   * $token = $request->bearerToken();
   * =========================================================================
   */
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      /**
       * =====================================================================
       * PASSO 2: Extrair o token do header
       * =====================================================================
       *
       * Header: "Bearer TOKEN_AQUI"
       * split(' ') → ['Bearer', 'TOKEN_AQUI']
       * [1] → pega apenas 'TOKEN_AQUI'
       * =====================================================================
       */
      token = req.headers.authorization.split(' ')[1];

      /**
       * =====================================================================
       * PASSO 3: Verificar e decodificar o token
       * =====================================================================
       *
       * jwt.verify() faz 2 coisas:
       * 1. Verifica se o token foi assinado com JWT_SECRET (não foi adulterado)
       * 2. Verifica se o token não expirou (se tiver 'exp' no payload)
       *
       * Se tudo ok, retorna o payload decodificado: { id: '123', iat: ..., exp: ... }
       * Se falhar, lança erro (TokenExpiredError, JsonWebTokenError, etc)
       *
       * Laravel equivalente:
       * $payload = JWT::decode($token, config('app.key'));
       * =====================================================================
       */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      /**
       * =====================================================================
       * PASSO 4: Buscar o usuário no banco de dados
       * =====================================================================
       *
       * decoded.id = ID do usuário que estava no payload do token
       * .select('-password') = Exclui o campo password do resultado (segurança)
       *
       * Laravel equivalente:
       * $user = User::find($payload->id)->makeHidden(['password']);
       * ou simplesmente: Auth::user()
       * =====================================================================
       */
      req.user = await User.findById(decoded.id).select('-password');

      /**
       * =====================================================================
       * PASSO 5: Verificar se o usuário ainda existe no banco
       * =====================================================================
       *
       * Cenários possíveis:
       * - Usuário foi deletado mas o token ainda é válido
       * - ID no token não existe no banco
       *
       * Laravel: Auth::check() já faz isso automaticamente
       * =====================================================================
       */
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          statusCode: 401,
        });
      }

      /**
       * =====================================================================
       * PASSO 6: Autenticação bem-sucedida! Continua para o controller
       * =====================================================================
       *
       * next() passa o controle para o próximo middleware/controller
       * req.user agora está disponível no controller
       *
       * Exemplo no controller:
       * const userId = req.user._id;
       * const userName = req.user.username;
       *
       * Laravel equivalente:
       * $userId = Auth::id();
       * $userName = Auth::user()->username;
       * =====================================================================
       */
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);

      /**
       * ===================================================================
       * ERRO 1: Token expirado
       * ===================================================================
       *
       * O token tinha validade (expiresIn) e já passou do tempo.
       * Cliente precisa fazer login novamente para obter novo token.
       *
       * Laravel: automaticamente detectado pelo JWT guard
       * ===================================================================
       */
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token has expired',
          statusCode: 401,
        });
      }

      /**
       * ===================================================================
       * ERRO 2: Token inválido (malformado ou assinatura errada)
       * ===================================================================
       *
       * Possíveis causas:
       * - Token foi adulterado manualmente
       * - JWT_SECRET diferente do usado para criar o token
       * - Formato inválido do token
       *
       * Laravel: lança TokenInvalidException
       * ===================================================================
       */
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
          statusCode: 401,
        });
      }

      /**
       * ===================================================================
       * ERRO 3: Qualquer outro erro (fallback)
       * ===================================================================
       *
       * Exemplo: erro de conexão com banco, erro desconhecido do JWT, etc.
       * Por segurança, não expõe detalhes do erro ao cliente.
       * ===================================================================
       */
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
        statusCode: 401,
      });
    }
  } else {
    /**
     * =====================================================================
     * SEM TOKEN: Header Authorization não existe ou não tem "Bearer"
     * =====================================================================
     *
     * Cliente não enviou credenciais.
     * Precisa fazer login primeiro para obter um token.
     *
     * Laravel equivalente:
     * if (Auth::guest()) { return response()->json(['error' => 'Unauthenticated'], 401); }
     * =====================================================================
     */
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token',
      statusCode: 401,
    });
  }
};

export default protect;
