# Dropdown Component

Componente de dropdown reutilizável para seleção de opções com suporte a seleção única e múltipla.

## Características

- ✅ Seleção única ou múltipla
- ✅ Modal com lista de opções
- ✅ Ícones personalizados
- ✅ Badge de contagem para seleção múltipla
- ✅ Animação suave
- ✅ Feedback visual de seleção
- ✅ Responsivo e acessível

## Uso Básico

### Seleção Única

```tsx
import { Dropdown, DropdownOption } from '@/components/common';

const options: DropdownOption[] = [
  { label: 'Option 1', value: '1', icon: '🎯' },
  { label: 'Option 2', value: '2', icon: '⚡' },
  { label: 'Option 3', value: '3', icon: '🌟' },
];

<Dropdown
  label="Select Option"
  placeholder="Choose one"
  options={options}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value as string)}
  icon="📋"
/>
```

### Seleção Múltipla

```tsx
<Dropdown
  label="Select Sports"
  placeholder="Choose sports"
  options={sportOptions}
  value={selectedSports}
  multiple
  onChange={(value) => setSelectedSports(value as string[])}
  icon="⚽"
/>
```

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|-----------|
| `label` | `string` | ✅ | - | Título do dropdown exibido no modal |
| `placeholder` | `string` | ❌ | `'Select...'` | Texto quando nenhuma opção está selecionada |
| `options` | `DropdownOption[]` | ✅ | - | Array de opções disponíveis |
| `value` | `string \| string[]` | ❌ | - | Valor(es) selecionado(s) |
| `multiple` | `boolean` | ❌ | `false` | Permite seleção múltipla |
| `onChange` | `(value: string \| string[]) => void` | ✅ | - | Callback quando valor muda |
| `icon` | `string` | ❌ | - | Emoji/ícone exibido no botão |

## DropdownOption

```typescript
interface DropdownOption {
  label: string;   // Texto exibido
  value: string;   // Valor único
  icon?: string;   // Emoji/ícone opcional
}
```

## Exemplos de Uso

### Filtro de Tipo de Atividade

```tsx
const activityTypeOptions: DropdownOption[] = [
  { label: 'All', value: 'ALL', icon: '🌐' },
  { label: 'Public', value: 'PUBLIC', icon: '🌍' },
  { label: 'Private', value: 'PRIVATE', icon: '🔒' },
];

<Dropdown
  label="Activity Type"
  placeholder="All"
  options={activityTypeOptions}
  value={selectedType}
  onChange={handleTypeChange}
  icon="🎯"
/>
```

### Filtro de Esportes (Múltiplo)

```tsx
const sportOptions: DropdownOption[] = SPORTS.map((sport) => ({
  label: sport.name,
  value: sport.key,
  icon: sport.icon,
}));

<Dropdown
  label="Sports"
  placeholder="All Sports"
  options={sportOptions}
  value={selectedSports}
  multiple
  onChange={handleSportsChange}
  icon="⚽"
/>
```

### Filtro de Distância

```tsx
const distanceOptions: DropdownOption[] = [
  { label: '1 km', value: '1', icon: '📍' },
  { label: '5 km', value: '5', icon: '📍' },
  { label: '10 km', value: '10', icon: '📍' },
  { label: '25 km', value: '25', icon: '📍' },
  { label: '50 km', value: '50', icon: '📍' },
];

<Dropdown
  label="Distance"
  placeholder="10 km"
  options={distanceOptions}
  value={selectedDistance}
  onChange={handleDistanceChange}
  icon="📍"
/>
```

## Comportamento

### Seleção Única
- Clique em uma opção → Seleciona e fecha o modal
- Clique na mesma opção → Mantém selecionada
- Clique em outra opção → Troca a seleção

### Seleção Múltipla
- Clique em uma opção → Adiciona/remove da seleção
- Modal permanece aberto
- Botão "Done" para fechar o modal
- Badge mostra quantidade de itens selecionados

## Estilização

O componente usa o tema global do app:
- `colors.primary` - Cor principal
- `colors.primaryLight` - Fundo quando ativo
- `colors.border` - Bordas
- `colors.white` - Fundo do botão
- `colors.overlay` - Fundo do modal

## Acessibilidade

- ✅ Área de toque adequada (hitSlop)
- ✅ Feedback visual de seleção
- ✅ Modal pode ser fechado tocando fora
- ✅ Botão de fechar visível
- ✅ Scroll suave na lista de opções

## Notas

- O modal é centralizado e responsivo
- Máximo de 70% da altura da tela
- Largura máxima de 400px
- Funciona em iOS e Android
- Suporta listas longas com scroll
