# Design Document - Refatoração do Sistema de Autenticação Mobile

## Overview

Este documento descreve o design técnico para a refatoração do sistema de autenticação no aplicativo mobile JOGAI (React Native + Expo). A refatoração alinhará o app com os endpoints reais do backend, implementará gestão correta de sessões, e melhorará a experiência do usuário.

### Objetivos Principais

- Alinhar completamente com os 8 endpoints de autenticação do backend
- Implementar gestão correta de sessionId para refresh e logout
- Adicionar renovação automática de tokens
- Melhorar tratamento de erros com mensagens claras
- Atualizar tipos TypeScript para refletir respostas reais da API
- Manter código limpo e testável

### Princípios de Design

1. **API First**: Seguir exatamente o contrato da API do backend
2. **Type Safety**: Usar TypeScript para prevenir erros em tempo de compilação
3. **User Experience**: Fornecer feedback claro e imediato ao usuário
4. **Separation of Concerns**: Manter camadas bem definidas (API, Service, Context, UI)
5. **Error Resilience**: Tratar todos os cenários de erro graciosamente

## Architecture

### Estrutura de Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│              (Screens, Components, Hooks)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Context Layer                            │
│              (AuthContext, State Management)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│         (authService, Business Logic, Validation)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                              │
│            (authApi, HTTP Client, Interceptors)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Storage Layer                             │
│          (storageService, AsyncStorage, Persistence)         │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios Atualizada

```
src/
├── api/
│   ├── client.ts                    # Atualizado: Axios config com interceptors
│   ├── auth.api.ts                  # Atualizado: Endpoints alinhados com backend
│   └── user.api.ts                  # Existente
├── services/
│   ├── auth.service.ts              # Atualizado: Lógica de negócio
│   └── storage.service.ts           # Atualizado: Gestão de sessionId
├── contexts/
│   └── AuthContext.tsx              # Atualizado: Estado global de autenticação
├── types/
│   └── api.types.ts                 # Atualizado: Tipos alinhados com backend
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx          # Atualizado: Validação e feedback
│   │   ├── RegisterScreen.tsx       # Atualizado: Campos opcionais
│   │   ├── ForgotPasswordScreen.tsx # Atualizado: Novo endpoint
│   │   └── ResetPasswordScreen.tsx  # Novo: Reset com token
│   └── ...
├── hooks/
│   ├── useAuth.ts                   # Atualizado: Hook para AuthContext
│   └── useForm.ts                   # Existente: Validação de formulários
└── utils/
    ├── validation.ts                # Atualizado: Validações client-side
    └── errorHandler.ts              # Novo: Tratamento centralizado de erros
```

## Components and Interfaces

### 1. API Types (Alinhados com Backend)

#### Login

```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response (alinhado com backend)
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;  // UUID da sessão
}
```

#### Register

```typescript
// Request (alinhado com backend)
interface RegisterRequest {
  email: string;
  password: string;
  phone?: string | null;           // Opcional
  organizationName?: string | null; // Opcional
}

// Response (alinhado com backend)
interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  organizationId?: string;  // Opcional
  membershipId?: string;    // Opcional
}
```

#### Refresh Token

```typescript
// Request (alinhado com backend)
interface RefreshTokenRequest {
  sessionId: string;      // UUID obrigatório
  refreshToken: string;
}

// Response
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
```

#### Logout

```typescript
// Request (alinhado com backend)
interface LogoutRequest {
  sessionId: string;  // UUID obrigatório
}
```

#### Password Reset

```typescript
// Request Password Reset
interface RequestPasswordResetRequest {
  email: string;
}

// Reset Password
interface ResetPasswordRequest {
  token: string;
  password: string;
}
```

#### Email Verification

```typescript
// Send Verification
interface SendEmailVerificationRequest {
  email: string;
}

// Verify Email
interface VerifyEmailRequest {
  token: string;
}
```

### 2. Storage Service (Atualizado)

```typescript
interface IStorageService {
  // Tokens
  saveTokens(accessToken: string, refreshToken: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clearTokens(): Promise<void>;
  
  // Session (NOVO)
  saveSessionId(sessionId: string): Promise<void>;
  getSessionId(): Promise<string | null>;
  clearSessionId(): Promise<void>;
  
  // User
  saveUser(user: User): Promise<void>;
  getUser(): Promise<User | null>;
  clearUser(): Promise<void>;
  
  // Onboarding
  isOnboardingCompleted(): Promise<boolean>;
  setOnboardingCompleted(completed: boolean): Promise<void>;
  
  // Clear All
  clearAll(): Promise<void>;
}

class StorageService implements IStorageService {
  private readonly KEYS = {
    ACCESS_TOKEN: '@jogai:accessToken',
    REFRESH_TOKEN: '@jogai:refreshToken',
    SESSION_ID: '@jogai:sessionId',        // NOVO
    USER: '@jogai:user',
    ONBOARDING: '@jogai:onboarding',
  };
  
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [this.KEYS.ACCESS_TOKEN, accessToken],
      [this.KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  }
  
  async saveSessionId(sessionId: string): Promise<void> {
    await AsyncStorage.setItem(this.KEYS.SESSION_ID, sessionId);
  }
  
  async getSessionId(): Promise<string | null> {
    return await AsyncStorage.getItem(this.KEYS.SESSION_ID);
  }
  
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      this.KEYS.ACCESS_TOKEN,
      this.KEYS.REFRESH_TOKEN,
      this.KEYS.SESSION_ID,  // NOVO
      this.KEYS.USER,
    ]);
  }
}
```

### 3. Auth API (Atualizado)

```typescript
class AuthApi {
  /**
   * Login - POST /api/v1/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await authClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  }

  /**
   * Register - POST /api/v1/auth/register
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await authClient.post<RegisterResponse>(
      '/auth/register',
      userData
    );
    return response.data;
  }

  /**
   * Refresh Token - POST /api/v1/auth/refresh
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await authClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      request
    );
    return response.data;
  }

  /**
   * Logout - POST /api/v1/auth/logout
   */
  async logout(request: LogoutRequest): Promise<void> {
    await authClient.post('/auth/logout', request);
  }

  /**
   * Request Password Reset - POST /api/v1/auth/password/request-reset
   */
  async requestPasswordReset(request: RequestPasswordResetRequest): Promise<void> {
    await authClient.post('/auth/password/request-reset', request);
  }

  /**
   * Reset Password - POST /api/v1/auth/password/reset
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await authClient.post('/auth/password/reset', request);
  }

  /**
   * Send Email Verification - POST /api/v1/auth/email/send-verification
   */
  async sendEmailVerification(request: SendEmailVerificationRequest): Promise<void> {
    await authClient.post('/auth/email/send-verification', request);
  }

  /**
   * Verify Email - POST /api/v1/auth/email/verify
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<void> {
    await authClient.post('/auth/email/verify', request);
  }
}
```

### 4. Auth Service (Atualizado)

```typescript
class AuthService {
  /**
   * Login user and store tokens + sessionId
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      // Call login API
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, sessionId } = response;
      
      // Store tokens AND sessionId
      await storageService.saveTokens(accessToken, refreshToken);
      await storageService.saveSessionId(sessionId);
      
      // Fetch user data with new token
      const user = await userApi.getCurrentUser();
      
      // Store user data
      await storageService.saveUser(user);

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register new user (does NOT auto-login)
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user with sessionId
   */
  async logout(): Promise<void> {
    try {
      const sessionId = await storageService.getSessionId();
      
      if (sessionId) {
        // Call logout endpoint with sessionId
        await authApi.logout({ sessionId });
      }
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Always clear local data
      await storageService.clearAll();
    }
  }

  /**
   * Refresh tokens using sessionId
   */
  async refreshTokens(): Promise<boolean> {
    try {
      const refreshToken = await storageService.getRefreshToken();
      const sessionId = await storageService.getSessionId();
      
      if (!refreshToken || !sessionId) {
        return false;
      }

      // Call refresh with sessionId
      const response = await authApi.refreshToken({
        sessionId,
        refreshToken,
      });
      
      // Store new tokens (sessionId remains the same)
      await storageService.saveTokens(
        response.accessToken,
        response.refreshToken
      );
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear all data on refresh failure
      await storageService.clearAll();
      return false;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await authApi.requestPasswordReset({ email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await authApi.resetPassword({ token, password });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          return new Error(message || 'Dados inválidos');
        case 401:
          return new Error('Email ou senha inválidos');
        case 429:
          return new Error('Muitas tentativas. Tente novamente mais tarde');
        case 500:
          return new Error('Erro no servidor. Tente novamente');
        default:
          return new Error(message || 'Erro desconhecido');
      }
    }
    
    if (error.request) {
      return new Error('Erro de conexão. Verifique sua internet');
    }
    
    return error;
  }
}
```

### 5. Axios Interceptor (Atualizado)

```typescript
// Request interceptor - Add access token
authClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and auto-refresh
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh
        const refreshed = await authService.refreshTokens();
        
        if (refreshed) {
          // Retry original request with new token
          const newToken = await storageService.getAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return authClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        await storageService.clearAll();
        // Trigger navigation to login (via event or context)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 6. Auth Context (Atualizado)

```typescript
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - Check for existing session
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const [storedUser, accessToken, sessionId] = await Promise.all([
        storageService.getUser(),
        storageService.getAccessToken(),
        storageService.getSessionId(),
      ]);

      if (storedUser && accessToken && sessionId) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      await authService.register(userData);
      // Do NOT set user - registration doesn't auto-login
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshed = await authService.refreshTokens();
      if (!refreshed) {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

## Data Models

### User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organizationId?: string;
  membershipId?: string;
}
```

### Session Data (Stored Locally)

```typescript
interface StoredSessionData {
  accessToken: string;
  refreshToken: string;
  sessionId: string;  // UUID from backend
  user: User;
}
```

## Error Handling

### Error Types

```typescript
enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: any;
}
```

### Error Messages (Portuguese)

```typescript
const ERROR_MESSAGES: Record<AuthErrorType, string> = {
  [AuthErrorType.INVALID_CREDENTIALS]: 'Email ou senha inválidos',
  [AuthErrorType.VALIDATION_ERROR]: 'Dados inválidos. Verifique os campos',
  [AuthErrorType.RATE_LIMIT]: 'Muitas tentativas. Tente novamente mais tarde',
  [AuthErrorType.NETWORK_ERROR]: 'Erro de conexão. Verifique sua internet',
  [AuthErrorType.SERVER_ERROR]: 'Erro no servidor. Tente novamente',
  [AuthErrorType.UNKNOWN_ERROR]: 'Erro desconhecido. Tente novamente',
};
```

## Testing Strategy

### Unit Tests

- **authService**: Testar lógica de login, register, logout, refresh
- **storageService**: Testar save/get/clear de tokens e sessionId
- **validation**: Testar validações de email, password, phone

### Integration Tests

- **authApi**: Testar chamadas aos endpoints com mocks
- **AuthContext**: Testar fluxos de autenticação completos
- **Interceptors**: Testar refresh automático de tokens

### E2E Tests

- Complete auth flow: Register → Login → Navigate → Logout
- Token refresh flow: Login → Wait for expiration → Auto-refresh
- Password reset flow: Request → Reset → Login

## Security Considerations

### 1. Token Storage

- Usar AsyncStorage (criptografado no iOS, menos seguro no Android)
- Considerar usar react-native-keychain para tokens sensíveis
- Nunca logar tokens no console em produção

### 2. Session Management

- Sempre incluir sessionId em refresh e logout
- Limpar sessionId junto com tokens no logout
- Validar presença de sessionId antes de refresh

### 3. Input Validation

- Validar email format client-side
- Validar password length (min 8 chars)
- Sanitizar inputs antes de enviar

### 4. Error Handling

- Não expor detalhes técnicos ao usuário
- Logar erros para debugging
- Fornecer mensagens claras e acionáveis

## Performance Considerations

### 1. Token Refresh

- Implementar refresh automático antes da expiração
- Evitar múltiplas chamadas simultâneas de refresh
- Usar flag _retry para evitar loops infinitos

### 2. Storage Operations

- Usar multiSet/multiGet para operações em lote
- Evitar leituras desnecessárias do storage
- Cache user data em memória (Context)

### 3. Network Requests

- Implementar timeout adequado (10s)
- Usar retry logic para falhas de rede
- Cancelar requests pendentes ao desmontar componentes

## Migration Strategy

### Phase 1: Update Types and API Layer

1. Atualizar tipos em api.types.ts
2. Atualizar authApi.ts com endpoints corretos
3. Adicionar sessionId ao storageService

### Phase 2: Update Service Layer

1. Atualizar authService.login para armazenar sessionId
2. Atualizar authService.refreshTokens para usar sessionId
3. Atualizar authService.logout para enviar sessionId

### Phase 3: Update Context and UI

1. Atualizar AuthContext para usar novo authService
2. Atualizar telas de login/register
3. Adicionar telas de password reset

### Phase 4: Testing and Validation

1. Testar todos os fluxos de autenticação
2. Validar refresh automático
3. Testar tratamento de erros
4. Validar persistência de sessionId

## Configuration

### Environment Variables

```bash
# API Base URL
EXPO_PUBLIC_AUTH_API_URL=http://localhost:3001/api/v1

# Timeouts
EXPO_PUBLIC_API_TIMEOUT=10000

# Feature Flags
EXPO_PUBLIC_AUTO_REFRESH_ENABLED=true
```

### API Client Configuration

```typescript
const authClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_AUTH_API_URL,
  timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Monitoring and Debugging

### Logging Strategy

- Log authentication events (login, logout, refresh)
- Log API errors with context
- Use __DEV__ flag to control verbose logging
- Never log tokens or passwords

### Debug Tools

- React Native Debugger for network inspection
- Flipper for AsyncStorage inspection
- Sentry for production error tracking

## Documentation

### Developer Guide

- Como configurar ambiente de desenvolvimento
- Como testar fluxos de autenticação
- Como adicionar novos endpoints
- Como debugar problemas de autenticação

### API Integration Guide

- Documentação de todos os endpoints
- Exemplos de request/response
- Códigos de erro e significados
- Fluxos de autenticação completos
