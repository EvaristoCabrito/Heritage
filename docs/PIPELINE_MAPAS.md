# Pipeline de mapas — Heritage of Ashes

Guia vigente para pintar e integrar regiões. Medido no `app.js` da branch `main` em 2026-11-18.

`docs/PIPELINE_MAPAS_MORDAVIA.md` fica preservado como histórico. Onde os dois discordarem, valem este arquivo e o código atual. Não apague o histórico.

O jogo não é feito de tiles. Cada região é um panorama pintado, mais uma camada de copas. A câmera só recorta esse par. `map-gpu-2d.js` copia as mesmas imagens para a GPU. Não muda a aparência. Se a GPU falhar, o que se vê são as tags `<img>`.

## 1. O que existe

Há dois conjuntos visuais e, em cada um, duas regiões. Free Build e Campanha não são mapas extras. São percursos. O botão WILDS alterna City e Wilds dentro do conjunto atual. Nunca empilhe as regiões, e nunca faça um terceiro painel.

| Conjunto | `mapSet` | Região | `mapId` | Quando aparece |
|---|---|---|---|---|
| Free Build, outono contido | 1 | City | `city` | partida livre e capítulos no Vale do Luto |
| Free Build | 1 | Wilds | `wilds` | o mesmo, do outro lado da Estrada Velha |
| Campanha, fronteira tropical | 2 | City | `city` | capítulo nesse conjunto |
| Campanha | 2 | Wilds | `wilds` | o mesmo |

A troca de arquivo está só em `switchMap()`, por volta da linha 780 de `app.js`. Não crie outro renderizador, outra cena, ou um mapa paralelo para teste.

Pares no ar agora:

| Conjunto | Região | Chão | Copas |
|---|---|---|---|
| 1 | City | `public/art/mordavia-map.webp` | `public/art/mordavia-forest-layer.png` |
| 1 | Wilds | `public/art/mordavia-wilds-map.webp` | `public/art/mordavia-wilds-forest-layer.png` |
| 2 | City | `public/art/mordavia-map02-tropical-city-ground-v05.png` | `public/art/mordavia-map02-tropical-city-trees-v05.png` |
| 2 | Wilds | `public/art/mordavia-map02-tropical-wilds-ground-v06.png` | `public/art/mordavia-map02-tropical-wilds-trees-v07.png` |

O documento antigo ainda diz que City e Wilds do conjunto 1 dividem `mordavia-forest-layer.png`, e que as copas tropicais dos Wilds são a v06. O código não faz isso. Não copie o documento antigo.

## 2. Regras que não se negociam

- Fotorealista. Materiais naturais, cor contida, uma luz só. Sem cartoon, cel-shading, ilustração saturada ou “mapa de fantasia” pintado.
- A luz de referência é a dos sprites em `public/art/buildings-photoreal-v03-runtime/`: nublado, chave vinda da esquerda-cima, sombra curta. Tropical significa espécie, pedra e água. Não significa verde neon nem água ciano de estúdio.
- Não apague nem sobrescreva um arquivo de mapa. Versão nova, nome novo. O par antigo continua no repositório.
- Não gere as duas metades em separado. Uma fonte vertical contínua para o chão, outra para as copas, o mesmo enquadramento.
- Não disfarce emenda com crossfade, faixa, espelhamento, clone de borda ou dissolução.
- Não reutilize o chão de outra região. Continuidade entre City e Wilds é a estrada chegando no portão certo, não o mesmo bitmap. No conjunto 2 de hoje, a metade de baixo de City e de Wilds é quase a mesma pintura (correlação 0,93). Isso falha o guia.
- Não marque arte como aprovada sem revisão de quem pediu. Revise as imagens exportadas. Não use partida salva para verificar: partida nova.
- O modo teste não muda mapa, movimento nem regras. Não crie variante de mapa para teste.

## 3. Tela

| | Valor |
|---|---|
| Arquivo final, chão e copas | **1199 × 2624 px**, os dois |
| Proporção | 1199 / 2624 |
| Corte opcional de revisão | y = 1312. Painel de cima y 0–1311, painel de baixo y 1312–2623, cada um 1199 × 1312 |
| O que o jogo carrega | o arquivo inteiro, um `<img>` por camada |

O corte em dois painéis é só prova de que a entrega não foi gerada em metades. O runtime não empilha dois arquivos. `.map-world` tem `aspect-ratio: 1199 / 2624`. `.map-art` usa `object-fit: fill`. Arquivo com outra proporção é esticado. Arquivo menor é ampliado e fica mole no zoom 3 e 4.

Os arquivos tropicais no ar estão **847 × 1857**. Não repita isso. Também não entregue o chão do conjunto 1 esmagado: o WebP atual tem cerca de 1,1 MB para 1199 × 2624, e o capim vira mancha. O mestre é PNG. WebP só entra se um recorte 400 × 400 do capim, visto a 1:1, ainda mostrar folha.

A moldura (`.map-scene`) mostra mais ou menos a metade de cima da altura. Zoom do jogo: 1, 1.3, 1.6 e 2, em `ZOOM_LEVELS`. O zoom não troca de mapa. Não desenhe uma versão “de perto” separada.

## 4. As duas camadas

Ordem real na tela, de trás para a frente:

| Ordem | O quê | Onde |
|---|---|---|
| 1 | Chão: terra, água, estrada, tronco, árvore de fundo, construção fixa do cenário | `.map-art` |
| 2 | Prédios do jogador, covis, ervas, ordenados pela coordenada `y` dentro da própria camada | `.site-layer` e `.lair-layer`, z-index 4 |
| 3 | Área clicável do casarão | `.manor-inventory-trigger`, z-index 5, só em City |
| 4 | Pessoas, ordenadas por `y` dentro da camada | `.hero-layer`, z-index 6 |
| 5 | Fumaça do casarão em partículas | `.map-atmosphere`, só conjunto 1. O conjunto 2 esconde essa camada no CSS |
| 6 | Copas | `.tree-foreground`, z-index 20, **sempre na frente** de gente e prédio |
| 7 | Pontos de pesca | `.fishing-layer`, z-index 21, para o ícone não sumir debaixo da copa |

Não há ordenação por árvore. Uma copa não passa para trás de uma pessoa. Por isso:

- Tronco, árvore distante e árvore cujo pé o personagem deve cobrir ficam **no chão**.
- A PNG de copas leva só a copa que deve cobrir o personagem, com alfa de verdade.
- Não pinte a árvore inteira nas duas camadas. Dá copa dupla e borda suja.
- Não deixe retângulo opaco, franja branca, franja preta, nem xadrez gravado no arquivo.
- Pesca fica na água aberta, não debaixo de uma copa sólida. O ícone ainda aparece, a água não.

Alfa de referência do par atual de City: cerca de 24% dos pixels com alfa acima de 16, concentrado na borda. O meio fica livre para construir e andar.

## 5. Coordenadas

Não use pixel como coordenada de jogo.

| Eixo | Unidade | Fórmula na tela |
|---|---|---|
| `x` | 0 a 100, porcentagem da largura | `left: x%` |
| `y` | 0 a `WORLD_Y_UNITS` | `top: y / WORLD_Y_UNITS * 100%` |

```text
MAP_WORLD_HEIGHT = 2624
WORLD_Y_UNITS    = 200 * 2624 / 2452 = 214,0277
Y_TO_X_SCALE     = 2624 / WORLD_Y_UNITS * 100 / 1199 ≈ 1,0225
```

O 200 antigo era o fundo quando o mapa tinha 2452 px. O canvas cresceu até 2624 e a unidade esticou para os pontos velhos não pularem. O fundo jogável novo é **214**, não 200. A faixa extra é os últimos 6,5% da imagem. A fumaça usa exatamente essa fração: `.map-atmosphere` tem altura 93,45% (2452 / 2624).

Distância no código mistura os eixos assim: `hypot(dx, dy * Y_TO_X_SCALE)`. Um ponto de `y` vale quase um ponto de `x`.

Retângulo onde dá para construir, em `placementProblem`:

| | Mínimo | Máximo |
|---|---|---|
| `x` | 6 | 94 |
| `y` | 4 | 196 |

Fora isso o jogo responde “Fora do mapa.” A faixa `y` 196–214 aparece, mas não recebe obra. A saída da estrada nos Wilds fica de propósito em `y = 1`, na borda, fora desse retângulo.

Distância mínima entre construções: `BUILD_SPACING = 12,5`, na mesma conta do `hypot`. O chão em volta de um lote precisa ler como terra aberta, não como mata fechada. O código não lê máscara da pintura. Se a arte mente, a pessoa constrói em cima d’água.

Água, pedreira e mina são polilinhas e retângulos escritos à mão. Não existe máscara lida do PNG. Trocou o rio na pintura, troca a polilinha no mesmo commit. Senão o camponês anda na água e a casa nasce no leito.

## 6. O que a pintura tem de respeitar

Estes pontos já estão no código. Pinte o chão caminhável em cima deles. Não mova o número para encaixar uma pintura aleatória, a menos que o mesmo commit atualize a constante e tudo o que depende dela.

O pé do personagem é o ponto. O sprite usa `translate(-50%, -96%)` e, na moldura do palco, largura de 5,2% do mundo. A porta do casarão fica da altura desse sprite.

### 6.1 Estrada da City, os dois conjuntos

`PATH_NODES` é uma rede só. City do conjunto 1 e City do conjunto 2 usam os mesmos nós. Os dois chãos precisam de estrada caminhável passando por esta tabela. Wilds não herda essa rede como desenho: quem viaja troca de mapa no portão e segue em linha, desviando da água.

| Nó | x | y | Liga em | O que é |
|---|---|---|---|---|
| 0 | 42 | 39 | 1 | Entrada do casarão |
| 1 | 53 | 54 | 0, 2, 3 | Cruzamento central |
| 2 | 41 | 58 | 1, 4 | |
| 3 | 62 | 56 | 1, 6, 10 | |
| 4 | 40 | 68 | 2, 5 | |
| 5 | 40 | 80 | 4, 12 | |
| 6 | 62 | 81 | 3 | |
| 7 | 90 | 52 | 8, 11 | |
| 8 | 91 | 29 | 7, 9 | |
| 9 | 85 | 21 | 8 | Ruínas do covil |
| 10 | 62 | 67 | 3, 11 | Contorno sul do lote direito |
| 11 | 90 | 67 | 10, 7 | |
| 12 | 42 | 99 | 5, 13 | |
| 13 | 54 | 107 | 12, 14 | |
| 14 | 51 | 121 | 13, 15 | |
| 15 | 39 | 137 | 14, 16 | Pontapé da ponte no conjunto 2 |
| 16 | 45 | 153 | 15, 17 | Outro pé da ponte no conjunto 2 |
| 17 | 56 | 171 | 16, 18 | |
| 18 | 44 | 190 | 17 | Fim da Estrada Velha. Portão para os Wilds |

No conjunto 2, `CITY_MAP02_BRIDGE` é o segmento (39, 137) → (45, 153), os nós 15 e 16. A estrada central cruza o riacho aí. Fora desse corredor (folga 3,6), a água bloqueia o passo. O riacho da City tropical tem de passar entre esses dois pontos, com ponte pintada no chão. O conjunto 1 não tem essa água: não invente um rio atravessando a estrada da City de outono sem acrescentar a ponte no código.

### 6.2 Portões entre City e Wilds

A viagem não continua o pixel. Teleporta.

| Lado | Conjunto | x | y | Constante |
|---|---|---|---|---|
| Fim da estrada na City | 1 e 2 | 44 | 190 | `PATH_NODES[18]` |
| Chegada no topo dos Wilds | 1 | 57,5 | 1 | `WILDS_ROAD_EXIT[1]` |
| Chegada no topo dos Wilds | 2 | 64 | 1 | `WILDS_ROAD_EXIT[2]` |

Cada pintura precisa de estrada encostando nesse ponto: embaixo na City, em cima nos Wilds. O x não é o mesmo dos dois lados. Não force a estrada dos Wilds a nascer em x = 44.

Ladrões entram pelo nó 18. Caveiras sobem do mesmo nó pelos nós 18, 17, 16, 15, 14, 13, 12, 5, 4, 2, 1. Essa faixa da City fica desobstruída, sem copa sólida no meio da pista.

### 6.3 Casarão

A área clicável do inventário é CSS fixo, não vem do dado:

`left: 4%`, `top: 5,5%`, `width: 44%`, `height: 13%`, só quando `mapId` é `city`.

O corpo do casarão fica dentro dessa caixa, nos dois conjuntos. Mover o casarão na pintura quebra o clique. Não pinte o casarão no centro para “compor melhor”.

Fumaça: não pinte fumaça no chão. O conjunto 1 já solta partículas em `left` cerca de 36,7%, na chaminé, com `manor-smoke-v02.png`. Fumaça gravada no WebP não desliga e dobra a partícula. O conjunto 2 não usa essa fumaça.

### 6.4 Wilds: pedreira, mina e água

Retângulos onde nada se constrói, exceto a obra daquele depósito. `WILDS_PAINTED`. A pedreira e a mina pintadas têm de cair **dentro** do retângulo. Se a pintura puser a pedreira em outro lugar, o jogador constrói em cima do desenho e é bloqueado num retângulo vazio.

| Conjunto | Nome no código | x1 | x2 | y1 | y2 | Obra permitida |
|---|---|---|---|---|---|---|
| 1 | a pedreira desenhada no mapa | 4 | 48 | 8 | 46 | `quarry` |
| 1 | a mina de ouro desenhada no mapa | 64 | 90 | 62 | 95 | `mine` |
| 2 | a pedreira desenhada no mapa | 3 | 39 | 5 | 31 | `quarry` |
| 2 | a mina de ouro desenhada no mapa | 70 | 99 | 3 | 28 | `mine` |

Pontos de depósito usados quando o cenário não marca outro. A obra de mina só é aceita a até 5,5 desse ponto. A pintura do depósito cobre o ponto.

| Conjunto | Tipo | x | y | Nota |
|---|---|---|---|---|
| 1 | pedreira | 22 | 18 | |
| 1 | mina | 72 | 61 | rank II |
| 1 | mina extra | 37 | 100 | o código empurra uma segunda marca |
| 2 | pedreira | 22 | 19 | |
| 2 | mina | 84 | 14 | rank IV |

Dois desenhos de água, e os dois têm de descrever o mesmo rio. `WILDS_PAINTED.river` bloqueia obra a distância menor que 5. `WILDS_WATERWAYS` bloqueia obra a 2,7 e o passo a 3,4.

Rio usado por `paintedProblem`, conjunto 1, na ordem:

| x | y |
|---|---|
| 4 | 70 |
| 13 | 68 |
| 24 | 65 |
| 34 | 61 |
| 42 | 59 |
| 53 | 59 |
| 62 | 56 |
| 75 | 54 |
| 83 | 52 |
| 89 | 51 |
| 98 | 49 |

`WILDS_WATERWAYS` conjunto 1, dois trechos:

| Trecho | Pontos (x, y) |
|---|---|
| 1 | (0, 75), (17, 68), (29, 64), (40, 59), (52, 53), (64, 50), (75, 54), (88, 60), (100, 57) |
| 2 | (0, 91), (9, 87), (18, 84) |

Rio usado por `paintedProblem`, conjunto 2:

| x | y |
|---|---|
| 100 | 128 |
| 84 | 132 |
| 68 | 136 |
| 52 | 139 |
| 38 | 145 |
| 24 | 152 |
| 8 | 162 |
| 11 | 173 |
| 27 | 184 |
| 50 | 193 |
| 76 | 198 |
| 100 | 200 |

`WILDS_WATERWAYS` conjunto 2 é esse mesmo traçado.

Ponte de cerco só pousa em cima dessa água dos Wilds. Qualquer outra obra é recusada na água.

### 6.5 Água da City

Só o conjunto 2. `CITY_WATERWAYS`:

| Trecho | Pontos (x, y) |
|---|---|
| 1 | (0, 168), (12, 164), (24, 158), (35, 153), (44, 150), (50, 152), (56, 157), (61, 163), (68, 168), (77, 171), (88, 173), (100, 169) |
| 2 | (0, 188), (8, 184), (16, 181) |

O conjunto 1 não tem polilinha de água na City. Não pinte rio largo ali sem escrever a polilinha.

### 6.6 Pontos que precisam de chão aberto

Não pinte o covil, o peixe, a erva ou o bosque dentro do bitmap. Eles entram por cima, como sprite. O bitmap deixa clareira do tamanho do sprite, fora da estrada e fora da água.

Pesca. Cada ponto fica no trecho mais largo e mais escuro da água, longe de ponte e de estrada.

| site | mapa | conjunto | x | y |
|---|---|---|---|---|
| `wilds-stream-west-map01` | wilds | 1 | 22,7 | 66,9 |
| `wilds-stream-east-map01` | wilds | 1 | 55,6 | 57,1 |
| `wilds-stream-north` | wilds | 2 | 82 | 133 |
| `wilds-stream-south` | wilds | 2 | 29 | 184 |
| `city-stream-bridge-map02` | city | 2 | 32 | 166 |

Ervas, só nos Wilds:

| id | conjunto | x | y |
|---|---|---|---|
| `menderleaf-map01-a` | 1 | 31 | 41 |
| `bitterroot-map01-a` | 1 | 57 | 67 |
| `silver-sage-map01-a` | 1 | 78 | 93 |
| `menderleaf-map02-a` | 2 | 28 | 61 |
| `bitterroot-map02-a` | 2 | 67 | 105 |
| `frostmint-map02-a` | 2 | 82 | 143 |

Bosques de lenha, só Wilds do conjunto 1 (`WILDLIFE_MAP_SET`):

| id | x | y |
|---|---|---|
| `ashLog` | 24 | 51 |
| `yewLog` | 70 | 34 |
| `ebonyLog` | 83 | 112 |

Caça. Clareiras já escolhidas. A pintura mantém terra aberta, sem penhasco, sem água, sem estrada.

Conjunto 1: (16, 31), (31, 55), (48, 83), (72, 42), (79, 116), (23, 143), (54, 158), (91, 88).

Conjunto 2: (45, 100), (60, 90), (70, 108), (25, 150), (75, 160), (35, 170), (45, 190).

Covis da partida livre. `mapSet` ausente conta como 1. São sprites por cima do chão.

| id | mapa | conjunto | x | y | ativo no começo |
|---|---|---|---|---|---|
| `cemetery-l1` | city | 1 | 44 | 190 | sim |
| `wolf-den-1` | wilds | 1 | 82 | 173 | sim |
| `wolf-den-2` | wilds | 1 | 91 | 184 | sim |
| `cemetery-l2` | wilds | 1 | 44 | 190 | não |
| `wolf-den-l2` | wilds | 1 | 82 | 173 | não |
| `nekomata-den-l1` | wilds | 1 | 24 | 55 | sim |
| `nekomata-den-l2` | wilds | 2 | 34 | 118 | sim |
| `goblin-den-l1` | wilds | 1 | 82 | 24 | sim |
| `goblin-den-l2` | wilds | 1 | 34 | 118 | não |
| `troll-den-l1` | wilds | 1 | 90 | 34 | sim |
| `troll-den-l2` | wilds | 1 | 62 | 162 | não |

Covis do capítulo 1, Wilds do conjunto 2, campo aberto, longe da estrada, da ponte e do riacho:

| id | x | y | ativo no começo |
|---|---|---|---|
| `wolf-den-1` | 84 | 16 | sim |
| `goblin-den-l1` | 82 | 98 | sim |
| `goblin-den-l1b` | 14 | 132 | sim |
| `goblin-den-l2` | 84 | 200 | não |

O cemitério da City livre está no mesmo ponto do fim da estrada (44, 190). Não desenhe outro cemitério no bitmap, ou ficam dois.

## 7. Aparência

O que faz os mapas atuais parecerem fracos, e o que a próxima versão evita:

1. **Metade de baixo clonada.** City e Wilds precisam de caminhos diferentes, outra clareira, outra pedra, outra água. O único encontro é o portão da seção 6.2.
2. **Carimbo de folha.** O chão tropical repete um decalque de samambaia. Varie escala, espécie, terra nua, borda gasta da trilha e sombra de contato debaixo da copa.
3. **Tamanho errado.** Entregue 1199 × 2624. O 847 × 1857 do conjunto 2 é ampliado pelo CSS e desmancha no zoom.
4. **Duas luzes.** Conjunto 1 está em torno de rgb 90, 73, 48, saturação cerca de 42. Conjunto 2 está mais verde e em saturação cerca de 62, com água ciano. Grade o tropical para a luz dos prédios fotorrealistas antes de soltar os sprites em cima.
5. **Copa dupla e fumaça gravada.** Chão sem copa de primeiro plano, PNG só com essas copas, chaminé sem fumaça pintada.
6. **Rio que não é a polilinha.** Desenho bonito no lugar errado põe a casa na água. A seção 6 é contrato, não sugestão.

Recorte de prova, os quatro, antes de integrar:

- 400 × 400 de capim vazio, a 1:1. Folha legível, sem carimbo repetido, sem bloco de compressão.
- A estrada no portão, a 1:1. Chega no ponto da seção 6.2 e não atravessa água fora da ponte.
- A emenda y = 1312, 200 px para cada lado. Sem degrau, faixa, repetição ou mudança de luz.
- A copa sozinha, sobre xadrez. Alfa limpo, sem tronco, sem chão.

## 8. Passo a passo

1. Escolha uma região só: conjunto e City ou Wilds. Anote os pontos da seção 6 dessa região antes de gerar qualquer coisa.
2. Reserve, na fonte, terra aberta nesses pontos e ao longo da estrada. Borda do mapa pode ser mata. O meio, não.
3. Gere o chão inteiro como um panorama vertical. Depois, no mesmo enquadramento, a PNG de copas. Não gere metade de cima e metade de baixo.
4. Normalize os dois para 1199 × 2624, um único redimensionamento, antes de qualquer corte.
5. Se for conferir em painéis, corte os dois na mesma linha y = 1312. Empilhar de novo tem de bater com a fonte, pixel a pixel, alfa inclusive. Não recompresse entre o corte e a remontagem.
6. Exporte os recortes da seção 7. Não abra o jogo para decidir se a pintura passou.
7. Só então integre, com nome novo.

Nome:

```text
public/art/mordavia-map{conjunto}-{city|wilds}-{ground|trees}-v{NN}.{png|webp}
```

`NN` é o próximo número livre daquela região. Não reaproveite v05, v06, v07.

## 9. O que mexer no código

Num commit só, junto com os arquivos novos:

| Mudou | Onde |
|---|---|
| Qual arquivo a região usa | o ternário de `switchMap()` |
| Preload da City do conjunto 1, se o nome dela mudar | `index.html`, o `href` de `mordavia-map.webp` |
| O rio não está mais na polilinha | `WILDS_PAINTED`, `WILDS_WATERWAYS` e, na City do conjunto 2, `CITY_WATERWAYS` e `CITY_MAP02_BRIDGE` |
| A pedreira ou a mina mudou de lugar | o retângulo em `WILDS_PAINTED` e o ponto em `extractionPlaces()` |
| O portão dos Wilds mudou | `WILDS_ROAD_EXIT` |
| A estrada da City mudou | `PATH_NODES`, e a rota da caveira `SKELETON_PATH` |
| Pesca, erva, bosque, caça ou covil mudou de clareira | a constante daquele ponto, na seção 6 |

Não mude `MAP_WORLD_HEIGHT` sem recalcular `WORLD_Y_UNITS` e a altura de `.map-atmosphere`. Não ponha lógica de mapa dentro de condicional de modo teste. Não crie uma segunda função de câmera.

O conjunto 2 some com a fumaça por CSS: `#map-world[data-map-set="2"] .map-atmosphere { display: none; }`. Não reative isso pintando fumaça no chão.

## 10. Revisão

Antes de dizer que o mapa está no jogo:

- Chão e copas são 1199 × 2624.
- A copa é RGBA. A recomposição dos painéis, se houver, é idêntica à fonte.
- Os quatro recortes da seção 7 passam.
- Nenhum ponto da seção 6 cai em água, copa, ponte ou borda bloqueada, salvo a pesca, que cai na água, e a ponte, que cruza a água.
- City e Wilds do mesmo conjunto não compartilham a metade de baixo.
- O arquivo antigo continua no disco. `switchMap()` aponta para o nome novo.
- A conferência foi em partida nova.

Quem pediu a arte é quem marca aprovado. Até lá, a versão nova pode estar integrada para inspeção, mas o texto do commit não diz “aprovado”.
