# Regras para agentes de código

Leia este arquivo inteiro antes de tocar em qualquer arquivo do projeto. Vale para todo agente de código, de qualquer ferramenta.

## Regra permanente: um único sistema, o modo teste é só estoque

Não existe variação de caminhos nem de sistemas entre o modo normal e o modo teste. O modo teste serve para o dono do projeto testar o jogo real com recursos infinitos. Nada mais, nada menos.

O modo teste não é um sistema paralelo. É um valor de recurso.

### Proibido

- Qualquer condicional sobre o modo teste (`if (testMode)`, `state.testMode ? a : b`, `!state.testMode && ...`) que altere fluxo, ordem de execução, regra, validação, fórmula ou estado.
- Função, classe, cena, tabela ou configuração duplicada com sufixo `_test`, `_debug` ou `_dev`.
- Atalho que pule etapas: desbloqueio instantâneo, requisito ignorado, condição contornada.
- Item, receita, construção ou mecânica que exista só no teste.
- Diferença de salvamento, serialização ou formato de dados.

### Permitido, e só isto

- Quantidade de recursos elevada no início ou que não diminui.

O teste joga o jogo real com o estoque cheio. Toda aquisição, custo, requisito e consumo passa pelos mesmos métodos nos dois modos. Se um custo é debitado no modo normal, é debitado no teste também; a diferença é que o saldo não acaba.

### Como implementar

Um único ponto de origem do valor, nunca um ramo de lógica.

```js
// errado
if (test) { build(); } else { if (canAfford()) { pay(); build(); } }

// certo
resources.grant(TEST_STOCK);   // só no boot, só quantidade
// o resto do jogo não sabe que o modo teste existe
```

O código do jogo não contém a palavra "teste" (nem `test`, `debug`, `dev`) em nenhuma condicional. A única menção vive no boot, concedendo estoque.

### Código antigo

Trecho existente que viola esta regra é dívida a remover, não precedente a seguir. Não copie o padrão, não acrescente novos ramos, e ao mexer num trecho desses passe o custo pelo mesmo caminho do modo normal.
