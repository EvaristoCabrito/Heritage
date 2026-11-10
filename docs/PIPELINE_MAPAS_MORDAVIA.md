# Pipeline permanente dos mapas de Mordavia

Use este procedimento para mapas futuros do jogo. A arte é fotorealista e acompanha as referências aprovadas. O mapa final deve ser contínuo: “seamless” significa continuidade real da mesma composição, não uma faixa disfarçada.

## 1. Planejar regiões

- Defina o conteúdo de cada região antes de gerar a arte.
- O mapa principal mantém o casarão, as ruínas existentes e a Estrada Velha.
- Os Wilds começam depois da Estrada Velha. No primeiro painel dos Wilds ficam a pedreira e a mina de metais preciosos; o segundo painel permanece aberto para locais futuros, sem quarry, mina ou construções fixas.
- Deixe caminhos e clareiras utilizáveis para construções e personagens.

## 2. Gerar cada região como uma fonte única

- Gere cada região inteira como um único panorama vertical com terreno e caminho contínuos de cima a baixo. Nunca gere cada metade separadamente.
- Gere uma camada de árvores em um único PNG RGBA transparente, no mesmo enquadramento da base.
- Não crie a emenda com dissolução, crossfade, sobreposição, reflexão, linha ou faixa copiada, pintura de borda, nem mistura de imagens.
- A borda entre regiões diferentes pode ter continuidade de entrada exata, ajustando apenas a primeira linha do trecho seguinte se preciso; não alterar nem espalhar a divisão central interna.

## 3. Normalizar e cortar sem alterar a emenda

- Normalize cada região completa e cada camada transparente para **1199 × 2624 px**, redimensionando o panorama completo uma única vez antes do corte.
- Corte base e árvores na mesma coordenada: **y=1312 px**. Cada região produz painel 1 `y=0–1311` e painel 2 `y=1312–2623`, ambos **1199 × 1312 px**.
- Reconcatenar os dois painéis verticalmente deve reproduzir os respectivos panoramas de origem pixel a pixel. Verifique base e árvores separadamente.
- Mantenha os painéis na ordem em que foram criados; não reescalone nem recomprima entre o corte e a montagem.

## 4. Montar e integrar

- Há conjuntos de mapa por fase. O **Map 1** mantém as rotas originais de City e Wilds. Ao confirmar a passagem do Cenário 1 para a fase seguinte, o jogo passa ao **Map 2**, que contém City tropical e Wilds/Quarry tropical. Dentro de cada conjunto, o botão alterna City/Wilds; nunca empilhe as regiões nem prolongue um mapa além de dois painéis.
- Cada mapa usa exatamente duas camadas pareadas: uma base sem árvores e uma imagem PNG RGBA contendo apenas as copas/árvores com alfa real. A composição visual é feita pelo jogo; não grave as árvores na base.
- Dimensões finais de cada base e de sua camada de árvores: **1199 × 2624 px**; cada painel de tela mede **1199 × 1312 px**.
- Pares do Map 2, preservando os assets originais do Map 1:
  - City: `public/art/mordavia-map02-city-v01.png` + `public/art/mordavia-map02-city-trees-v01.png`.
  - Wilds/Quarry: `public/art/mordavia-map02-wilds-v01.png` + `public/art/mordavia-map02-wilds-trees-v01.png`.
- Preserve as versões anteriores no projeto. Para atualizar um mapa, crie um novo par versionado e altere somente a rota daquele mapa.
- Covis e outros marcadores precisam respeitar o conjunto de mapa e ficar em terreno firme, fora de pontes, travessias e caminhos.
- Atualize a proporção do mapa, limites verticais, pontos de passagem e câmera regional. Preserve coordenadas já salvas usando `WORLD_Y_UNITS = 200 * MAP_WORLD_HEIGHT / 2452` e posicione elementos com `y / WORLD_Y_UNITS * 100%`.
- Mantenha atalhos de câmera para casarão, Estrada Velha e Wilds.

## 5. Fumaça do casarão

- Use um sprite PNG com transparência real, encaixado à chaminé sem cobrir o telhado.
- A área atmosférica corresponde à altura original do mapa principal (**2452 px**) dentro do mapa atual; recalcule essa fração ao mudar a altura total.
- Use várias partículas CSS discretas com durações, larguras, atrasos e deriva lateral diferentes. Respeite `prefers-reduced-motion`.

## 6. Revisar offline

- Exporte prévias dos painéis e da composição longa com base e árvores compostas.
- Inspecione a divisão central dos dois panoramas em resolução nativa: caminho, terreno e copa continuam sem deslocamento, faixa, repetição ou duplicação.
- Confirme que a camada de árvores preserva alfa e que a concatenação dos painéis é idêntica à fonte.
- Não abra o jogo para revisar. Não marque arte como aprovada sem revisão do usuário.

## Registro desta versão

O Map 1 continua com seus arquivos e rotas originais. Após confirmar a passagem de fase, o Map 2 carrega City tropical ou Wilds/Quarry, cada um com sua própria base de 1199 × 2624 e camada de árvores. Cada panorama corresponde a duas telas, com divisão em y=1312. Wilds/Quarry tem a pedreira e a mina no painel superior e terreno livre no inferior. City mantém o casarão arruinado acima e áreas abertas para construção. Os covis existentes ficam no Map 1; nenhum covil é colocado sobre ponte ou travessia no Map 2.
