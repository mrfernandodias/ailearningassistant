import { createContext, useContext, useEffect, useState } from 'react';

// 1. Cria o contexto de autenticação (deve ser chamado como função)
const AuthContext = createContext();

/**
 * 2. Hook customizado para acessar o contexto de autenticação
 * Garante que o hook só seja usado dentro do AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

/**
 * 3. Provider que gerencia o estado global de autenticação
 * Responsável por:
 * - Verificar token no localStorage ao carregar app
 * - Prover métodos de login/logout
 * - Manter estado do usuário sincronizado
 */
export const AuthProvider = ({ children }) => {
  // Estados de autenticação
  const [user, setUser] = useState(null); // Dados do usuário logado
  const [loading, setLoading] = useState(true); // Loading inicial
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Flag de auth

  // 4. Verifica autenticação ao montar o componente
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * 5. Verifica se existe token válido no localStorage
   * Se sim, restaura o estado do usuário
   * Se não, mantém como não autenticado
   */
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      // Se ambos existirem, restaura sessão
      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout(); // Limpa dados corrompidos
    } finally {
      setLoading(false); // Sempre finaliza loading
    }
  };

  /**
   * 6. Função de login
   * Salva token e dados do usuário no localStorage
   * Atualiza estado da aplicação
   */
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * 7. Função de logout
   * Limpa localStorage e estado
   * Redireciona para home
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/'; // Redireciona para home
  };

  /**
   * 8. Atualiza dados do usuário
   * Usado após edição de perfil
   * Mantém localStorage sincronizado
   */
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  // 9. Valores disponíveis para toda a aplicação
  const value = {
    user, // Dados do usuário atual
    loading, // Estado de carregamento inicial
    isAuthenticated, // Flag booleana de autenticação
    login, // Função para fazer login
    logout, // Função para fazer logout
    updateUser, // Função para atualizar perfil
    checkAuthStatus, // Função para revalidar auth
  };

  // 10. Provê o contexto para toda a árvore de componentes
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
