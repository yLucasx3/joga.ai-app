# Requirements Document - Refatoração do Sistema de Autenticação Mobile

## Introduction

Este documento descreve os requisitos para a refatoração do fluxo de autenticação no aplicativo mobile JOGAI para alinhar com a realidade do backend. O backend possui 8 rotas de autenticação implementadas com Clean Architecture, e o mobile app precisa ser atualizado para consumir corretamente esses endpoints, incluindo gestão adequada de sessões e tokens.

## Glossary

- **Mobile_App**: Aplicativo React Native que consome a API de autenticação
- **Auth_API**: API de autenticação do backend rodando na porta 3001
- **Access_Token**: Token JWT de curta duração retornado no login usado para autenticar requisições
- **Refresh_Token**: Token de longa duração retornado no login usado para obter novos access tokens
- **Session_ID**: UUID da sessão criada no backend, necessário para refresh e logout
- **Auth_Service**: Camada de serviço no mobile que gerencia lógica de autenticação
- **Storage_Service**: Serviço que persiste dados localmente usando AsyncStorage
- **Auth_Context**: Context do React que gerencia estado de autenticação global
- **Email_Verification**: Processo de validação do endereço de email do usuário
- **Password_Reset**: Processo de recuperação de senha através de token enviado por email

## Requirements

### Requirement 1: Alinhamento com Endpoints do Backend

**User Story:** Como desenvolvedor mobile, eu quero que o app consuma corretamente os endpoints reais do backend, para que a autenticação funcione conforme implementado na API.

#### Acceptance Criteria

1. WHEN THE Mobile_App calls login endpoint, THE Mobile_App SHALL send POST request to /api/v1/auth/login with email and password
2. WHEN THE Auth_API returns login response, THE Mobile_App SHALL receive and store accessToken, refreshToken, and sessionId
3. WHEN THE Mobile_App calls register endpoint, THE Mobile_App SHALL send POST request to /api/v1/auth/register with email, password, and optional phone and organizationName
4. WHEN THE Mobile_App calls refresh endpoint, THE Mobile_App SHALL send POST request to /api/v1/auth/refresh with sessionId and refreshToken
5. WHEN THE Mobile_App calls logout endpoint, THE Mobile_App SHALL send POST request to /api/v1/auth/logout with sessionId
6. WHEN THE Mobile_App requests password reset, THE Mobile_App SHALL send POST request to /api/v1/auth/password/request-reset with email
7. WHEN THE Mobile_App resets password, THE Mobile_App SHALL send POST request to /api/v1/auth/password/reset with token and new password
8. WHEN THE Mobile_App verifies email, THE Mobile_App SHALL send POST request to /api/v1/auth/email/verify with verification token

### Requirement 2: Gestão Correta de Sessões

**User Story:** Como usuário do app, eu quero que minhas sessões sejam gerenciadas corretamente, para que eu possa fazer logout adequadamente e renovar minha autenticação quando necessário.

#### Acceptance Criteria

1. WHEN THE Mobile_App receives login response, THE Mobile_App SHALL store sessionId along with tokens
2. WHEN THE Mobile_App calls refresh token, THE Mobile_App SHALL include sessionId in the request body
3. WHEN THE Mobile_App calls logout, THE Mobile_App SHALL include sessionId in the request body to invalidate the session
4. WHEN THE Mobile_App stores session data, THE Mobile_App SHALL persist sessionId in secure storage
5. WHEN THE Mobile_App clears authentication, THE Mobile_App SHALL remove sessionId along with tokens from storage

### Requirement 3: Tratamento de Erros e Feedback ao Usuário

**User Story:** Como usuário do app, eu quero receber mensagens claras quando algo der errado na autenticação, para que eu saiba como resolver o problema.

#### Acceptance Criteria

1. WHEN THE Auth_API returns validation error (400), THE Mobile_App SHALL display field-specific error messages to user
2. WHEN THE Auth_API returns authentication error (401), THE Mobile_App SHALL display "Email ou senha inválidos" message
3. WHEN THE Auth_API returns rate limit error (429), THE Mobile_App SHALL display "Muitas tentativas. Tente novamente mais tarde" message
4. WHEN THE Auth_API returns server error (500), THE Mobile_App SHALL display generic error message without technical details
5. WHEN THE Mobile_App encounters network error, THE Mobile_App SHALL display "Erro de conexão. Verifique sua internet" message

### Requirement 4: Renovação Automática de Tokens

**User Story:** Como usuário do app, eu quero que minha sessão seja renovada automaticamente quando o token expirar, para que eu não precise fazer login repetidamente.

#### Acceptance Criteria

1. WHEN THE Mobile_App detects access token expiration (401 error), THE Mobile_App SHALL automatically attempt token refresh
2. WHEN THE Mobile_App refreshes token, THE Mobile_App SHALL use stored sessionId and refreshToken
3. WHEN THE Auth_API returns new tokens, THE Mobile_App SHALL update stored accessToken and refreshToken
4. WHEN THE Mobile_App refresh fails, THE Mobile_App SHALL clear authentication and redirect to login screen
5. WHEN THE Mobile_App makes API request, THE Mobile_App SHALL include valid access token in Authorization header

### Requirement 5: Validação de Dados no Cliente

**User Story:** Como usuário do app, eu quero receber feedback imediato quando preencher dados inválidos, para que eu possa corrigir antes de enviar.

#### Acceptance Criteria

1. WHEN THE Mobile_App validates email field, THE Mobile_App SHALL check for valid email format before submission
2. WHEN THE Mobile_App validates password field, THE Mobile_App SHALL enforce minimum 8 characters
3. WHEN THE Mobile_App validates phone field, THE Mobile_App SHALL accept optional phone number in international format
4. WHEN THE Mobile_App validates required fields, THE Mobile_App SHALL display error message for empty fields
5. WHEN THE Mobile_App submits form, THE Mobile_App SHALL disable submit button until all validations pass

### Requirement 6: Persistência Segura de Dados

**User Story:** Como usuário do app, eu quero que minhas credenciais e tokens sejam armazenados de forma segura, para que minha conta permaneça protegida.

#### Acceptance Criteria

1. WHEN THE Mobile_App stores tokens, THE Mobile_App SHALL use secure storage mechanism (AsyncStorage with encryption if available)
2. WHEN THE Mobile_App stores sessionId, THE Mobile_App SHALL persist it along with tokens
3. WHEN THE Mobile_App stores user data, THE Mobile_App SHALL exclude sensitive information like passwords
4. WHEN THE Mobile_App clears authentication, THE Mobile_App SHALL remove all stored tokens, sessionId, and user data
5. WHEN THE Mobile_App retrieves stored data, THE Mobile_App SHALL handle missing or corrupted data gracefully

### Requirement 7: Fluxo de Registro Completo

**User Story:** Como novo usuário, eu quero me registrar no app fornecendo meus dados básicos, para que eu possa criar uma conta.

#### Acceptance Criteria

1. WHEN THE Mobile_App submits registration, THE Mobile_App SHALL send email, password, and optional phone and organizationName
2. WHEN THE Auth_API returns registration success, THE Mobile_App SHALL receive user id, name, email, and optional organizationId and membershipId
3. WHEN THE Mobile_App completes registration, THE Mobile_App SHALL store user data locally
4. WHEN THE Mobile_App registers user, THE Mobile_App SHALL NOT automatically log in the user
5. WHEN THE Mobile_App completes registration, THE Mobile_App SHALL redirect to login screen with success message

### Requirement 8: Fluxo de Recuperação de Senha

**User Story:** Como usuário que esqueceu a senha, eu quero poder recuperá-la através do meu email, para que eu possa acessar minha conta novamente.

#### Acceptance Criteria

1. WHEN THE Mobile_App requests password reset, THE Mobile_App SHALL send user email to /api/v1/auth/password/request-reset
2. WHEN THE Auth_API accepts request, THE Mobile_App SHALL display message "Email de recuperação enviado"
3. WHEN THE Mobile_App receives reset token (via deep link or manual input), THE Mobile_App SHALL navigate to reset password screen
4. WHEN THE Mobile_App submits new password, THE Mobile_App SHALL send token and newPassword to /api/v1/auth/password/reset
5. WHEN THE Auth_API confirms reset, THE Mobile_App SHALL redirect to login screen with success message

### Requirement 9: Integração com Context de Autenticação

**User Story:** Como desenvolvedor mobile, eu quero que o estado de autenticação seja gerenciado globalmente via Context, para que todas as telas tenham acesso ao estado do usuário.

#### Acceptance Criteria

1. WHEN THE Mobile_App initializes, THE Auth_Context SHALL check for stored tokens and sessionId
2. WHEN THE Mobile_App has valid tokens, THE Auth_Context SHALL set isAuthenticated to true and load user data
3. WHEN THE Mobile_App completes login, THE Auth_Context SHALL update authentication state globally
4. WHEN THE Mobile_App completes logout, THE Auth_Context SHALL clear authentication state globally
5. WHEN THE Mobile_App refreshes tokens, THE Auth_Context SHALL update stored tokens without changing authentication state

### Requirement 10: Tipos TypeScript Corretos

**User Story:** Como desenvolvedor mobile, eu quero que os tipos TypeScript reflitam exatamente as respostas da API, para que eu tenha type safety e autocomplete corretos.

#### Acceptance Criteria

1. WHEN THE Mobile_App defines LoginResponse type, THE Mobile_App SHALL include accessToken, refreshToken, and sessionId fields
2. WHEN THE Mobile_App defines RegisterResponse type, THE Mobile_App SHALL include id, name, email, and optional organizationId and membershipId
3. WHEN THE Mobile_App defines RefreshTokenRequest type, THE Mobile_App SHALL include sessionId and refreshToken fields
4. WHEN THE Mobile_App defines LogoutRequest type, THE Mobile_App SHALL include sessionId field
5. WHEN THE Mobile_App defines API types, THE Mobile_App SHALL match exactly the backend DTOs
