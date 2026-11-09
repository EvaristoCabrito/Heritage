# Mordavia: protótipo 2D

Protótipo web jogável de estratégia indireta em Mordavia, no universo de *Ember Ashes*.

## Abrir

Abra `index.html` em um navegador moderno ou execute `JOGAR.bat` no Windows. Não precisa instalar dependências nem iniciar um servidor. A interface se adapta a telas de celular e aceita toque.

## O que dá para experimentar

- Escolher uma construção e posicioná-la em um dos dez terrenos livres das duas regiões do mapa; cada opção tem imagem própria.
- Escolher o tipo de Fazenda (alho, trigo, bacon, ovos ou leite) antes da obra e trocar a produção ao tocar na fazenda construída.
- Gerar ouro, provisões e madeira em tempo real.
- Ajustar a cobrança de impostos e escolher entre três velocidades.
- Atrair heróis construindo guildas e taverna.
- Equipar a companhia no arsenal do domínio.
- Oferecer uma recompensa para levar heróis ao covil e conter as incursões.
- Acompanhar o Healer até o nível 15 e orientar caminhos de prestígio reformando guildas.
- Ver Warrior, Healer e Peasant caminhando por trajetos contínuos; o Peasant trabalha e volta ao casarão.
- Arrastar o mapa com mouse ou toque; usar a roda do mouse ou as setas do teclado para percorrer o domínio. Os botões CASARÃO e ESTRADA VELHA saltam entre as regiões; o botão de casa volta ao casarão.
- Escolher entre três níveis de zoom: visão ampla (100%), normal (130%) e próxima (160%). A troca mantém o centro da câmera quando possível.

## Arquivos principais

- `index.html` — estrutura da interface.
- `app.css` — layout responsivo e estilo visual.
- `app.js` — economia, obras, heróis, recompensas e cenário.
- `public/art/mordavia-farmstead-open-v02.webp` — cenário ativo, com terrenos secos e abertos para as seis construções.
- `public/art/mordavia-farmstead-open-v02.png` — versão integral do cenário aberto.
- `public/art/mordavia-old-road-v01.png` — nova região fotográfica da Estrada Velha, preservada como arquivo separado.
- `public/art/mordavia-farmstead-v01.webp` e `public/art/mordavia-farmstead-v01.png` — cenário original preservado sem alteração.
- `public/art/*-v01.webp` — construções novas com fundo transparente, exibidas sobre os lotes. O moinho usa imagens separadas para o corpo e as pás.
- `public/art/farm-{garlic,wheat,bacon,eggs,milk}-v01.webp` — cinco variações fotográficas da fazenda; a arte `farm-v01.webp` permanece preservada.
- `public/art/manor-smoke-v01.webp` — fumaça fotográfica transparente animada sobre a chaminé principal.
- `public/art/{warrior,healer,peasant}-{walk,action}-v01.webp` — folhas fotográficas de caminhada e ação, com quatro quadros em duas direções.

O cenário tem fumaça e luz discretas em movimento, as novas obras aparecem com uma animação curta, e os marcadores dos heróis se deslocam entre destinos. A opção de reduzir movimento do sistema desliga essas animações.
O moinho custa 155 moedas e 10 de madeira, produz 1,8 provisão e 0,4 moeda por segundo; suas pás acompanham a velocidade I, II ou III do jogo.
Os lotes usam coordenadas de suas regiões em todas as larguras de tela, para que os prédios continuem sobre o chão ao abrir em celular ou computador. A câmera mostra uma parte do mundo por vez e pode ser movida sem alterar os percursos dos personagens. Os heróis podem atravessar a ligação entre o casarão e a Estrada Velha; os trabalhadores alcançam obras nas duas regiões.
As cartas do menu mostram miniaturas das dez construções. Cada tipo de fazenda mostra diretamente seu rendimento de provisões e ouro; o painel de construção mostra a produção atual quando uma fazenda existente é selecionada.
Os três personagens novos seguem pontos de passagem; a posição vertical define se aparecem à frente ou atrás de uma construção. Os demais tipos de heróis ainda usam seus marcadores anteriores.

É um protótipo de uma propriedade e um cenário. A lógica e a arte ainda são uma base de exploração, não o conteúdo final do jogo.
