import { LoginCredentials, AuthResponse, User } from '@/types/auth';
import { loadingSimulation } from '@/lib/mock-delays';

// Mock API - Replace with actual API endpoints
const API_BASE_URL = '/api/auth';

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@brewery.com',
    name: 'Administrador',
    role: 'admin',
    department: 'Administração',
    permissions: ['manage_sessions', 'manage_users', 'view_reports', 'manage_products'],
    isActive: true,
  },
  {
    id: 'user-2',
    email: 'degustador@brewery.com',
    name: 'João Degustador',
    role: 'taster',
    department: 'Controle de Qualidade',
    permissions: ['participate_sessions', 'view_samples'],
    isActive: true,
  },
  {
    id: 'user-3',
    email: 'gerente@brewery.com',
    name: 'Maria Gerente',
    role: 'manager',
    department: 'Produção',
    permissions: ['manage_sessions', 'view_reports', 'manage_products'],
    isActive: true,
  }
];

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate authentication delay
    await loadingSimulation.authentication();

    // Mock authentication logic
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Email não encontrado');
    }

    if (!user.isActive) {
      throw new Error('Usuário inativo. Entre em contato com o administrador.');
    }

    // In a real app, you would verify the password hash
    // For demo purposes, accept any password for existing users
    if (credentials.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    // Generate mock tokens
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

    return {
      user: {
        ...user,
        lastLogin: new Date().toISOString(),
      },
      token,
      refreshToken,
      expiresIn: 3600, // 1 hour
    };
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    await loadingSimulation.medium();

    // Mock refresh logic
    const userId = refreshToken.split('-')[3];
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      throw new Error('Token de atualização inválido');
    }

    const newToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    const newRefreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    };
  },

  logout: async (): Promise<void> => {
    await loadingSimulation.short();
    // In a real app, you would invalidate the token on the server
  },

  getCurrentUser: async (token: string): Promise<User> => {
    await loadingSimulation.authentication();

    // Mock user validation with robust token format checking
    if (!token || typeof token !== 'string') {
      throw new Error('Token inválido');
    }

    const tokenParts = token.split('-');
    
    // Verify token has the expected format: mock-jwt-token-{userId}-{timestamp}
    if (tokenParts.length !== 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt' || tokenParts[2] !== 'token') {
      throw new Error('Token inválido');
    }

    const userId = tokenParts[3];
    
    if (!userId) {
      throw new Error('Token inválido');
    }

    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      throw new Error('Token inválido');
    }

    return user;
  },
};