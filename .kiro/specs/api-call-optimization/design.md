# Design Document

## Overview

Este documento descreve o design técnico para otimizar as chamadas à API no aplicativo móvel JogAI, focando em reduzir chamadas duplicadas ao endpoint `/activities/nearby/list` e corrigir problemas com tokens de compartilhamento de atividades.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   HomeScreen    │
│   Component     │
└────────┬────────┘
         │
         ├─ useDebounce Hook
         │  (500ms delay)
         │
         ├─ useNearbyActivities Hook
         │  (React Query)
         │
         └─ Filter State Management
                  │
                  ▼
         ┌────────────────┐
         │  API Client    │
         │  (Axios)       │
         └────────┬───────┘
                  │
                  ├─ Request Interceptor
                  │  - Add request ID
                  │  - Log requests
                  │
                  ├─ Response Interceptor
                  │  - Log responses
                  │  - Handle errors
                  │
                  └─ Duplicate Detection
                           │
                           ▼
                  ┌────────────────┐
                  │   Backend API  │
                  └────────────────┘
```

## Components and Interfaces

### 1. Custom Hook: useDebounce

**Purpose:** Atrasar a execução de valores até que eles se estabilizem

**Interface:**
```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Implementation Details:**
- Utiliza `useState` e `useEffect` para gerenciar o valor debounced
- Limpa timers anteriores quando o valor muda
- Retorna o valor estabilizado após o delay especificado

### 2. Enhanced API Client

**Purpose:** Adicionar logging, rastreamento e detecção de duplicatas

**Interface:**
```typescript
interface RequestMetadata {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  params?: any;
}

interface APIClientConfig {
  enableLogging: boolean;
  enableDuplicateDetection: boolean;
  duplicateWindow: number; // ms
}
```

**Implementation Details:**
- Interceptor de requisição para adicionar ID único e logging
- Interceptor de resposta para logging e tratamento de erros
- Map para rastrear requisições recentes e detectar duplicatas
- Configuração condicional baseada em ambiente (dev/prod)

### 3. React Query Configuration

**Purpose:** Otimizar cache e refetch behavior

**Configuration:**
```typescript
const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
    },
  },
};
```

### 4. Filter State Management

**Purpose:** Gerenciar estado de filtros com persistência

**Interface:**
```typescript
interface FilterState {
  type: string;
  sports: string[];
  distance: string;
  date: string;
}

interface UseFiltersReturn {
  filters: FilterState;
  debouncedFilters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function useFilters(): UseFiltersReturn;
```

**Implementation Details:**
- Hook customizado para gerenciar estado de filtros
- Integração com AsyncStorage para persistência
- Debounce automático dos filtros
- Função helper para verificar se há filtros ativos

### 5. Share Token Management

**Backend Changes:**

**Interface:**
```typescript
interface ShareTokenService {
  generateShareToken(activityId: string, expirationDays: number): Promise<string>;
  validateShareToken(token: string): Promise<boolean>;
  refreshShareToken(activityId: string): Promise<string>;
}
```

**Implementation Details:**
- Gerar tokens com expiração de 30 dias por padrão
- Validar tokens antes de retornar atividades
- Regenerar automaticamente tokens expirados
- Incluir share token em todas as respostas de atividades

**Mobile Changes:**

**Interface:**
```typescript
interface ShareService {
  shareActivity(activity: Activity): Promise<void>;
  ensureValidShareToken(activityId: string): Promise<string>;
}
```

**Implementation Details:**
- Verificar existência de share token antes de compartilhar
- Solicitar novo token se necessário
- Tratamento de erros com fallback para compartilhamento sem token

## Data Models

### Request Tracking

```typescript
interface TrackedRequest {
  id: string;
  url: string;
  method: string;
  params: any;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}
```

### Filter State

```typescript
interface FilterState {
  type: 'ALL' | 'PUBLIC' | 'PRIVATE';
  sports: string[];
  distance: string;
  date: 'ALL' | 'TODAY' | 'TOMORROW' | 'WEEK' | 'MONTH';
}
```

### Share Token

```typescript
interface ShareToken {
  token: string;
  activityId: string;
  expiresAt: Date;
  createdAt: Date;
}
```

## Error Handling

### API Client Errors

1. **Network Errors**
   - Retry automático (máximo 2 tentativas)
   - Mensagem amigável ao usuário
   - Log detalhado para debugging

2. **Duplicate Request Detection**
   - Log warning no console (apenas dev)
   - Não bloqueia a requisição
   - Coleta métricas para análise

3. **Share Token Errors**
   - Fallback para compartilhamento sem token
   - Tentativa automática de regeneração
   - Mensagem informativa ao usuário

### React Query Errors

1. **Query Failures**
   - Exibir estado de erro na UI
   - Botão de retry disponível
   - Cache de dados anteriores mantido

2. **Mutation Failures**
   - Rollback otimista se aplicável
   - Mensagem de erro específica
   - Opção de tentar novamente

## Testing Strategy

### Unit Tests

1. **useDebounce Hook**
   - Testa delay correto
   - Testa cancelamento de timers
   - Testa múltiplas mudanças rápidas

2. **API Client Interceptors**
   - Testa adição de request ID
   - Testa logging de requisições
   - Testa detecção de duplicatas

3. **useFilters Hook**
   - Testa atualização de filtros
   - Testa debounce de filtros
   - Testa persistência em AsyncStorage

### Integration Tests

1. **HomeScreen com Filtros**
   - Testa que apenas uma chamada é feita ao carregar
   - Testa debounce ao alterar filtros
   - Testa cache ao navegar e retornar

2. **Share Functionality**
   - Testa compartilhamento com token válido
   - Testa regeneração de token expirado
   - Testa fallback sem token

### Performance Tests

1. **API Call Optimization**
   - Medir número de chamadas antes e depois
   - Verificar tempo de resposta da UI
   - Monitorar uso de memória do cache

2. **Filter Performance**
   - Medir tempo de resposta ao alterar filtros
   - Verificar cancelamento de requisições pendentes
   - Testar com múltiplas mudanças rápidas

## Implementation Phases

### Phase 1: API Client Enhancement
- Implementar request/response interceptors
- Adicionar logging condicional
- Implementar detecção de duplicatas

### Phase 2: Debounce Implementation
- Criar hook useDebounce
- Integrar no HomeScreen
- Testar com diferentes delays

### Phase 3: Filter State Management
- Criar hook useFilters
- Implementar persistência
- Integrar debounce automático

### Phase 4: React Query Optimization
- Configurar staleTime e cacheTime
- Ajustar refetch behavior
- Implementar query key optimization

### Phase 5: Share Token Fix
- Implementar geração de tokens no backend
- Adicionar validação e regeneração
- Atualizar mobile app para usar tokens

### Phase 6: Testing and Monitoring
- Escrever testes unitários
- Implementar testes de integração
- Adicionar métricas de performance

## Performance Considerations

### Memory Management
- Limitar tamanho do cache do React Query
- Limpar requisições antigas do tracking map
- Usar WeakMap quando apropriado

### Network Optimization
- Cancelar requisições pendentes ao mudar filtros
- Usar HTTP/2 multiplexing quando disponível
- Implementar retry com backoff exponencial

### UI Responsiveness
- Atualizar UI imediatamente ao mudar filtros
- Mostrar loading state durante debounce
- Manter dados anteriores visíveis durante refetch

## Security Considerations

### Share Token Security
- Tokens devem ser únicos e não previsíveis
- Implementar rate limiting para geração de tokens
- Validar tokens no backend antes de retornar dados

### API Request Security
- Não logar dados sensíveis
- Sanitizar parâmetros antes de logging
- Implementar request signing se necessário

## Monitoring and Metrics

### Key Metrics
1. Número de chamadas à API por sessão
2. Taxa de cache hit do React Query
3. Tempo médio de resposta da API
4. Número de duplicatas detectadas
5. Taxa de sucesso de compartilhamento

### Logging Strategy
- Development: Log detalhado de todas as requisições
- Production: Log apenas erros e métricas
- Usar níveis de log apropriados (debug, info, warn, error)

## Migration Strategy

### Rollout Plan
1. Deploy backend changes primeiro (share token)
2. Deploy mobile app com feature flag
3. Monitorar métricas por 1 semana
4. Habilitar para 100% dos usuários
5. Remover código legado após 2 semanas

### Rollback Plan
- Feature flag permite desabilitar otimizações
- Manter código anterior comentado por 1 sprint
- Monitorar crash reports e user feedback
