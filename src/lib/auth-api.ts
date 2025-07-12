import { LoginCredentials, AuthResponse, User } from '@/types/auth';
import { loadingSimulation } from '@/lib/mock-delays';
import jwt from 'jwt-decode';

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
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour from now
    
    // Create a mock JWT token with proper structure
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: exp
    }));
    const signature = btoa(`mock-signature-${user.id}`);
    const token = `${header}.${payload}.${signature}`;
    
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

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour from now
    
    // Create a new mock JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: exp
    }));
    const signature = btoa(`mock-signature-${user.id}`);
    const newToken = `${header}.${payload}.${signature}`;
    
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

    // Validate JWT token format and expiration
    if (!token || typeof token !== 'string') {
      throw new Error('Token inválido');
    }

    try {
      // Decode the JWT token
      const decoded: any = jwt(token);
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new Error('Token expirado');
      }
      
      // Find user by ID from token
      const user = mockUsers.find(u => u.id === decoded.sub);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      return user;
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Token expirado') {
        throw error;
      }
      
      // Fallback to old token format for backward compatibility
      const tokenParts = token.split('.');
      
      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          const user = mockUsers.find(u => u.id === payload.sub);
          
          if (!user) {
            throw new Error('Token inválido');
          }
          
          return user;
        } catch {
          throw new Error('Token inválido');
        }
      }
      
      // Legacy token format
      const legacyParts = token.split('-');
      if (legacyParts.length !== 4 || legacyParts[0] !== 'mock' || legacyParts[1] !== 'jwt' || legacyParts[2] !== 'token') {
        throw new Error('Token inválido');
      }
    

      const userId = legacyParts[3];
      
      if (!userId) {
        throw new Error('Token inválido');
      }
    

      const user = mockUsers.find(u => u.id === userId);

      if (!user) {
        throw new Error('Token inválido');
      }

      return user;
    }
  },
};