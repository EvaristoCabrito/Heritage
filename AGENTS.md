# Instruções para agentes de código

Todos os agentes que alterarem este jogo devem ler e seguir estas regras antes de editar código.

## Preferências do usuário
- Preserve tabelas completas no formato original; nunca resuma, comprima ou invente outro formato para economizar caracteres.
- Deixe tabelas fáceis de ler, com valores mostrados diretamente.
- Faça cálculos e extraia os dados; não peça ao usuário para converter valores.

## Estilo visual permanente
- Todo trabalho visual deve ser fotorealista, em todos os projetos.
- Siga as referências fornecidas e os sprites fotográficos existentes: materiais naturais, cores contidas, textura realista e iluminação consistente.
- Não introduza arte pictórica, cartoon, estilizada, cel-shaded ou ilustrativa e colorida.
- Nunca apague, sobrescreva ou descarte assets ou conteúdo de jogo criado. Preserve originais no jogo/editor e crie versões separadas com novos nomes e identificadores. Use cada tipo de decoração criado nos mapas solicitados.

## Saves: não gaste tempo com isso
- Nunca perca tempo com saves. Não existe jogo salvo e não vai existir.
- Não escreva, corrija, migre nem teste salvamento, carregamento, compatibilidade ou formato de save, e não use partida salva para verificar mudanças: teste sempre em partida nova.
- Não levante save como risco, pendência ou pergunta. Se uma mudança quebrar um save antigo, isso não importa.

## Modos do jogo
- A aplicação ativa é servida por `index.html` na raiz e usa `app.js` na raiz. Não crie uma implementação paralela em rascunhos ou cópias.
- Há um único sistema de jogo. O modo de teste só pode manter um estoque maior de recursos, reposto ao entrar na partida e a cada segundo, por um único ponto de concessão (`grantStartingStock`).
- Depois dessa concessão, o modo de teste não pode alterar movimento, regras, ordem de execução, validações, custos, produção, consumo, desbloqueios, objetivos, salvamento ou qualquer outro sistema.
- Toda compra, construção, pagamento e consumo deve usar os mesmos métodos e débitos no estoque em qualquer partida.
- Não crie caminhos, versões, cenas, prefabs, classes, tabelas ou mecânicas paralelas para o modo de teste. Não use condicionais de modo de teste durante a simulação.
- Não grave uma marca de modo de teste no estado ou formato do save. O estoque concedido é apenas quantidade normal de recurso.
- Preserve os designs, estilos, assets e conteúdo existentes; não os substitua sem pedido explícito.
- Faça alterações aditivas e mantenha nomes e formatos existentes quando possível.

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
