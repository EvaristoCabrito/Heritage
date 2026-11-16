# Pipeline de fases de construção — Mordávia

## Regra visual

O sprite final existente é a referência visual única de cada construção. Gere início e meio usando esse arquivo como a única imagem de referência. Não use outro prédio como referência de imagem: isso fez o gerador copiar a arquitetura de uma construção para outra.

Mantenha o mesmo ponto de vista, silhueta, proporção do canvas, textura fotorealista, luz e paleta escura natural do sprite original. Não converta para preto e branco nem aumente saturação. Descreva em texto os detalhes específicos da construção e o que ainda falta naquela fase.

## Três fases no jogo

| Progresso | Arte exibida |
|---|---|
| 0–49% | `<arte>-early.webp` |
| 50–99% | `<arte>-mid.webp` |
| 100% | O sprite final original em `buildings-photoreal-v03-runtime` |

As fases de obra ocupam o canvas inteiro e representam o prédio em construção. Não entregue tiras, recortes ou folhas com vários prédios.

## Melhorias de construções existentes

Uma melhoria também passa por exatamente 60 segundos de trabalho no relógio do jogo e duas etapas visuais. Na primeira metade, mantenha o sprite concluído do nível atual. Na segunda metade, use o sprite `-mid.webp` da própria construção; para mudanças de silhueta, como Casebre Pequeno para Casebre Grande, use o `-mid.webp` da arte de destino. Só aplique nível, capacidade, moradores, ramo ou novo tamanho quando os 60 segundos de trabalho terminarem. O edifício usa o mesmo sistema de camponês construtor e pausa o progresso enquanto não houver trabalhador no local. A habilidade do construtor não encurta a duração fixa da melhoria.

| Progresso da melhoria | Arte exibida | Estado do jogo |
|---|---|---|
| 0–49% | Sprite final do nível atual | Benefícios e nível atuais permanecem ativos; mudança ainda não aplicada |
| 50–99% | `<arte>-mid.webp` da construção ou da arte de destino | Melhoria visivelmente em curso; mudança ainda não aplicada |
| 100% | Sprite final original | Novo nível, capacidade ou tamanho é aplicado |

## Adicionar uma construção

1. Coloque o sprite final escuro em `public/art/buildings-photoreal-v03-runtime/<arte>.webp`.
2. Abra `new-building.template.json` e registre o ID lógico, o ID da arte e os traços arquitetônicos que tornam essa construção distinta.
3. Gere duas imagens separadas. Em cada edição, use somente o sprite final dessa construção como referência de imagem. Para início, descreva fundação, primeiras paredes e estrutura inicial conforme a função do prédio. Para meio, descreva paredes/armação prontas e cobertura ou mecanismo ainda incompleto.
4. Copie as imagens PNG para uma pasta de preparação e registre os caminhos em um manifesto no formato aceito por `prepare_phase_assets.py`.
5. Execute `python tools/construction-art-pipeline/prepare_phase_assets.py tools/construction-art-pipeline/manifest.json`. O script valida proporção e transparência, então salva WebP sem perdas em `public/art/buildings-construction-dark-v01`.
6. Adicione a arte a `CONSTRUCTION_STAGE_ART` em `app.js`; registre o tipo em `BUILDING_ART` e a proporção em `BUILDING_ART_ASPECTS` se ainda não existirem. A renderização escolhe início/meio automaticamente para obra nova e usa sprite atual/intermediário para melhoria, aplicando o estado final só ao terminar.
7. Revise início, meio e sprite final lado a lado antes de ativar o novo ID. Corrija qualquer fase que mude a silhueta, copie outro prédio ou destoe da paleta.

## Prompt base para editar cada sprite

> Crie uma imagem de sprite fotorealista e transparente da fase [início/meio] da construção. A imagem de referência é o sprite final exato deste prédio e é a única referência visual. Preserve sua silhueta, escala, proporções, ponto de vista, materiais, iluminação e paleta escura natural. [Descreva aqui os detalhes específicos da construção e o trabalho já realizado.] Tela inteira e centralizada, fundo transparente, sem vinheta, cenário, texto, painéis ou recorte; sem preto e branco, sem aumento de saturação e sem inventar outra arquitetura.

## Manifesto

Nas guildas, a obra inicial usa as fases `early` e `mid` da sede. A primeira metade de uma melhoria exibe o nível atual. A segunda metade usa a fase `mid` do nível e do caminho escolhidos. O sprite concluído só aparece quando a obra termina. Os valores agrupados em `upgradeLevels` são caminhos alternativos do mesmo nível.

`construction-phases.json` lista as fases de construção inicial e os sprites intermediários de melhoria, com suas artes finais e proporções. A chave `upgradeLevels` registra, por construção e produto, a sequência de níveis que o jogo usa. Use-o para nomear e verificar novas entradas. As artes antigas que foram substituídas permanecem no manifesto como histórico, mas não devem ser registradas como arte ativa no jogo.
