# Especificação: Refatoração do Sistema de Autenticação

## Visão Geral

Esta especificação descreve a refatoração completa do sistema de autenticação da API JOGAI, mantendo a Clean Architecture existente enquanto adiciona melhorias significativas em segurança, organização e experiência do desenvolvedor.

## Status

- **Fase Atual**: Planejamento Completo
- **Próximo Passo**: Iniciar implementação da Fase 1 (Foundation)
- **Abordagem de Testes**: MVP com testes opcionais

## Documentos

1. **[requirements.md](./requirements.md)** - 8 requisitos principais com user stories e acceptance criteria
2. **[design.md](./design.md)** - Design técnico detalhado com arquitetura, componentes e interfaces
3. **[tasks.md](./tasks.md)** - 27 tarefas organizadas em 9 fases de implementação

## Principais Melhorias

### 🔒 Segurança
- Rate limiting por IP e email
- Logs de eventos de segurança
- Validação aprimorada de inputs
- Gestão melhorada de sessões

### 📊 Observabilidade
- Logs estruturados com Winston/Pino
- Métricas de performance
- Alertas configuráveis
- Health checks

### 📚 Documentação
- OpenAPI/Swagger interativo
- Guias de integração
- Exemplos de código
- Troubleshooting

### 🎯 Organização
- Rotas consolidadas
- Respostas padronizadas
- Estrutura de diretórios melhorada
- Separação clara de responsabilidades

### ✨ Novas Funcionalidades
- Listar sessões ativas
- Revogar sessões específicas
- Revogar todas as sessões
- Health checks detalhados

## Rotas da API

### Autenticação (Existentes)
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/password/request-reset
POST /auth/password/reset
POST /auth/email/send-verification
POST /auth/email/verify
```

### Gestão de Sessões (Novas)
```
GET    /auth/sessions              # Listar sessões ativas
DELETE /auth/sessions/:sessionId   # Revogar sessão específica
DELETE /auth/sessions              # Revogar todas as sessões
```

### Health Checks (Novos)
```
GET /health                         # Status geral
GET /health/ready                   # Readiness probe
GET /health/live                    # Liveness probe
```

## Fases de Implementação

### Fase 1: Foundation (Tarefas 1-4)
Infraestrutura base: logging, rate limiting, respostas padronizadas, configuração

### Fase 2: Session Management (Tarefas 5-8)
Melhorias no modelo de sessão e novos endpoints de gestão

### Fase 3: Validation & Security (Tarefas 9-11)
Validações aprimoradas, sanitização e logging de segurança

### Fase 4: Route Consolidation (Tarefas 12-13)
Reorganização de rotas e health checks

### Fase 5: Documentation (Tarefas 14-15)
OpenAPI/Swagger e documentação para desenvolvedores

### Fase 6: Testing (Tarefas 16-19)
Testes unitários, integração e E2E

### Fase 7: Performance (Tarefas 20-22)
Otimizações e monitoramento

### Fase 8: Migration (Tarefas 23-25)
Deploy gradual e validação

### Fase 9: Handoff (Tarefas 26-27)
Documentação final e transferência de conhecimento

## Como Começar a Implementação

1. **Abra o arquivo de tarefas**: `.kiro/specs/auth-refactoring/tasks.md`
2. **Clique em "Start task"** ao lado da primeira tarefa
3. **Siga as instruções** e referências aos requisitos
4. **Execute testes** após cada tarefa
5. **Marque como completo** quando finalizar

## Tecnologias e Dependências

### Novas Dependências
- `winston` ou `pino` - Logging estruturado
- `ioredis` - Cliente Redis para rate limiting
- `swagger-ui-express` - Documentação interativa
- `swagger-jsdoc` - Geração de specs OpenAPI
- `express-rate-limit` - Rate limiting middleware
- `ua-parser-js` - Parse de User-Agent

### Dependências Existentes
- Express.js
- TypeScript
- Vitest
- Zod (validação)

## Configuração Necessária

### Variáveis de Ambiente Novas
```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_STORE=redis
REDIS_URL=redis://localhost:6379
SWAGGER_ENABLED=true
SECURITY_LOGGING_ENABLED=true
MAX_SESSIONS_PER_USER=5
SESSION_CLEANUP_INTERVAL=1h
```

## Métricas de Sucesso

- ✅ Cobertura de testes > 80%
- ✅ Tempo de resposta < 200ms
- ✅ Rate limiting funcionando em todos os endpoints críticos
- ✅ Documentação Swagger completa
- ✅ Zero breaking changes para clientes existentes
- ✅ Logs estruturados em produção
- ✅ Health checks respondendo corretamente

## Compatibilidade

- ✅ **Backward Compatible**: Todos os endpoints existentes continuam funcionando
- ✅ **Gradual Migration**: Deploy pode ser feito em fases
- ✅ **Feature Flags**: Novas funcionalidades podem ser ativadas gradualmente
- ✅ **Rollback Ready**: Procedimentos de rollback documentados

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Rate limiting muito restritivo | Alto | Configuração ajustável, monitoramento de hits |
| Performance do Redis | Médio | Fallback para in-memory, connection pooling |
| Breaking changes acidentais | Alto | Testes de integração, deploy gradual |
| Logs excessivos | Baixo | Log levels configuráveis, rotação automática |

## Suporte e Dúvidas

Para dúvidas sobre a implementação:
1. Consulte o [design.md](./design.md) para detalhes técnicos
2. Revise os [requirements.md](./requirements.md) para entender o "porquê"
3. Siga as tarefas em [tasks.md](./tasks.md) passo a passo

## Próximos Passos

1. ✅ Requisitos aprovados
2. ✅ Design aprovado
3. ✅ Plano de tarefas aprovado
4. ⏭️ **Iniciar Fase 1: Foundation**

---

**Última Atualização**: 2025-11-16
**Versão**: 1.0.0
**Status**: Pronto para Implementação
