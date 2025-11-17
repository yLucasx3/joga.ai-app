# Requirements Document

## Introduction

Este documento define os requisitos para otimizar as chamadas à API no aplicativo móvel JogAI, especificamente relacionadas ao endpoint `/activities/nearby/list` que está sendo chamado múltiplas vezes desnecessariamente, e para corrigir o problema com tokens de compartilhamento de atividades que estão expirando.

## Glossary

- **API Client**: O módulo responsável por fazer requisições HTTP para o backend
- **React Query**: Biblioteca de gerenciamento de estado e cache para requisições assíncronas
- **Share Token**: Token único gerado para compartilhar atividades publicamente
- **Debounce**: Técnica para atrasar a execução de uma função até que um período de tempo tenha passado sem novas invocações
- **Query Key**: Identificador único usado pelo React Query para cachear e gerenciar requisições
- **Filter State**: Estado da aplicação que armazena os filtros selecionados pelo usuário

## Requirements

### Requirement 1: Reduzir Chamadas Duplicadas à API

**User Story:** Como desenvolvedor, quero que o aplicativo faça apenas as chamadas necessárias à API, para que o desempenho seja otimizado e os custos de servidor sejam reduzidos.

#### Acceptance Criteria

1. WHEN o usuário abre a tela Home, THE Mobile App SHALL fazer exatamente uma chamada ao endpoint `/activities/nearby/list`
2. WHEN o usuário altera um filtro, THE Mobile App SHALL aguardar 500ms antes de fazer uma nova chamada à API
3. WHEN múltiplos filtros são alterados em sequência, THE Mobile App SHALL fazer apenas uma chamada com todos os filtros aplicados
4. WHEN o usuário navega para outra tela e retorna, THE Mobile App SHALL utilizar dados em cache se eles tiverem menos de 5 minutos
5. WHILE o usuário está alterando filtros rapidamente, THE Mobile App SHALL cancelar requisições pendentes anteriores

### Requirement 2: Corrigir Validação de Share Token

**User Story:** Como usuário, quero compartilhar atividades com outras pessoas, para que elas possam visualizar e participar das atividades que criei.

#### Acceptance Criteria

1. WHEN uma atividade é criada, THE Backend SHALL gerar um share token com data de expiração válida no futuro
2. WHEN uma atividade é retornada pela API, THE Backend SHALL incluir um share token válido ou null
3. IF o share token está expirado, THEN THE Backend SHALL regenerar automaticamente um novo token
4. WHEN o usuário tenta compartilhar uma atividade, THE Mobile App SHALL verificar se o share token existe antes de compartilhar
5. IF o share token não existe, THEN THE Mobile App SHALL solicitar a geração de um novo token ao backend

### Requirement 3: Implementar Logging e Monitoramento

**User Story:** Como desenvolvedor, quero ter visibilidade sobre as chamadas à API, para que eu possa identificar e resolver problemas rapidamente.

#### Acceptance Criteria

1. WHEN uma chamada à API é feita, THE API Client SHALL registrar a URL, método e timestamp
2. WHEN uma chamada à API falha, THE API Client SHALL registrar o erro com contexto completo
3. WHEN múltiplas chamadas idênticas são detectadas, THE API Client SHALL emitir um aviso no console de desenvolvimento
4. WHILE em modo de desenvolvimento, THE API Client SHALL exibir estatísticas de cache do React Query
5. THE API Client SHALL incluir um identificador único em cada requisição para rastreamento

### Requirement 4: Otimizar Gerenciamento de Estado de Filtros

**User Story:** Como usuário, quero que os filtros respondam rapidamente às minhas ações, para que eu possa encontrar atividades de forma eficiente.

#### Acceptance Criteria

1. WHEN o usuário altera um filtro, THE Mobile App SHALL atualizar a UI imediatamente
2. WHEN o usuário altera um filtro, THE Mobile App SHALL aguardar estabilização antes de fazer a chamada à API
3. WHEN o usuário limpa todos os filtros, THE Mobile App SHALL fazer apenas uma chamada à API com filtros padrão
4. THE Mobile App SHALL manter os filtros selecionados em cache local durante a sessão
5. WHEN o aplicativo é reiniciado, THE Mobile App SHALL restaurar os últimos filtros utilizados
