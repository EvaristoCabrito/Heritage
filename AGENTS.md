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

## Modos do jogo
- A aplicação ativa é servida por `index.html` na raiz e usa `app.js` na raiz. Não crie uma implementação paralela em rascunhos ou cópias.
- Há um único sistema de jogo. O modo de teste só pode conceder um estoque inicial maior de recursos ao criar uma partida nova.
- Depois da concessão inicial, o modo de teste não pode alterar movimento, regras, ordem de execução, validações, custos, produção, consumo, desbloqueios, objetivos, salvamento ou qualquer outro sistema.
- Toda compra, construção, pagamento e consumo deve usar os mesmos métodos e débitos no estoque em qualquer partida.
- Não crie caminhos, versões, cenas, prefabs, classes, tabelas ou mecânicas paralelas para o modo de teste. Não use condicionais de modo de teste durante a simulação.
- Não grave uma marca de modo de teste no estado ou formato do save. O estoque concedido é apenas quantidade normal de recurso.
- Preserve os designs, estilos, assets e conteúdo existentes; não os substitua sem pedido explícito.
- Faça alterações aditivas e mantenha nomes e formatos existentes quando possível.
