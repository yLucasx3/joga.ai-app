# DraggableBottomSheet Component

Componente de bottom sheet arrastável com snap points para expandir/colapsar o conteúdo.

## Características

- **3 Snap Points**: MIN (25%), MID (50%), MAX (85%) da altura da tela
- **Gestos suaves**: Arraste para cima/baixo com animações fluidas
- **Velocidade considerada**: O gesto rápido leva ao próximo snap point
- **Feedback visual**: Barra de handle com opacidade dinâmica

## Uso

```tsx
import { DraggableBottomSheet } from '@/components/common';

<DraggableBottomSheet
  initialSnapPoint="MID"
  onSnapPointChange={(snapPoint) => {
    console.log('Novo snap point:', snapPoint);
  }}
>
  <YourContent />
</DraggableBottomSheet>
```

## Props

- `children`: Conteúdo a ser exibido no bottom sheet
- `initialSnapPoint`: Posição inicial ('MIN' | 'MID' | 'MAX'), padrão: 'MID'
- `onSnapPointChange`: Callback chamado quando o snap point muda

## Snap Points

- **MIN (25%)**: Visualização mínima, máximo de mapa visível
- **MID (50%)**: Visualização balanceada entre mapa e conteúdo
- **MAX (85%)**: Visualização máxima do conteúdo, mínimo de mapa

## Comportamento

1. **Arrastar para baixo**: Minimiza o sheet, mostra mais do mapa
2. **Arrastar para cima**: Maximiza o sheet, mostra mais conteúdo
3. **Gesto rápido**: Pula para o próximo snap point baseado na velocidade
4. **Soltar**: Anima automaticamente para o snap point mais próximo

## Exemplo na HomeScreen

```tsx
<DraggableBottomSheet
  initialSnapPoint="MID"
  onSnapPointChange={handleSnapPointChange}
>
  {/* Filtros */}
  <FiltersSection />
  
  {/* Lista de atividades */}
  <ScrollView>
    {activities.map(activity => (
      <ActivityCard key={activity.id} activity={activity} />
    ))}
  </ScrollView>
</DraggableBottomSheet>
```

## Notas Técnicas

- Usa `react-native-reanimated` para animações performáticas
- Usa `react-native-gesture-handler` para gestos nativos
- Requer o plugin do Reanimated no `babel.config.js`
- Funciona em iOS e Android
