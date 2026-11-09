# Conceito do jogo

## Visão geral

Jogo de estratégia indireta e construção em 2D, inspirado pela dinâmica de *Majesty*, ambientado em Mordavia, no universo de *Ember Ashes*. O jogador administra terras decadentes, constrói uma economia funcional e influencia heróis autônomos por meio das estruturas, dos recursos e das oportunidades que oferece. O jogo será feito para rodar em celulares usando tecnologias web, com apresentação 2D de alta qualidade.

## Direção visual

- Jogo inteiramente em 2D.
- Câmera em perspectiva 3/4, seguindo a referência de *Majesty*.
- Direção visual fotorrealista, com materiais naturais, cores contidas e iluminação coerente com o mundo decadente de *Ember Ashes*.
- Qualidade visual alta, preservando desempenho e legibilidade em telas de celular.
- Cameos e conexões narrativas devem respeitar a lore existente de *Ember Ashes*.

## Plataforma e tecnologia

- Prioridade: celulares.
- Formato: jogo web baseado em HTML.
- Protótipo inicial implementado com HTML, CSS e JavaScript sem dependências externas.
- A estrutura técnica deve manter o jogo leve e responsivo em dispositivos móveis.
- Biblioteca de renderização, empacotamento e suporte a navegadores ainda serão escolhidos.

## Premissa da campanha

O protagonista é um jovem nobre que herda uma fazenda falida. Ao superar os problemas de cada terra, conquista títulos e recebe novas propriedades. As recompensas tendem a trazer terras maiores e problemas piores, sustentando o humor negro da campanha.

A campanha acompanha o mesmo nobre por diferentes terras de Mordavia. Os cenários variam de duração; objetivos e ameaças se acumulam enquanto o mapa revela regiões cada vez mais perigosas.

## Estrutura dos cenários

- Cada cenário apresenta um objetivo principal.
- Outros objetivos e problemas podem surgir e se acumular durante a partida.
- Os objetivos podem envolver metas econômicas, como acumular determinada quantidade de recursos, ou ameaças militares, como destruir um covil de monstros que ataca a cidade periodicamente.
- Os cenários variam em duração e ritmo.
- Condições de derrota confirmadas: destruição da cidade, falência de recursos ou morte do nobre.

## Ciclo de jogo

1. Construir e desenvolver a propriedade.
2. Produzir e acumular recursos, cobrar taxas e estabelecer negócios.
3. Construir tavernas, hotéis e guildas para atrair heróis e fornecer serviços e equipamento.
4. Manter os NPCs trabalhando em tempo real para a civilização funcionar.
5. Usar a infraestrutura e as recompensas para influenciar os heróis, que escolhem suas próprias ações.
6. Cumprir o objetivo principal e lidar com os problemas que surgem durante o cenário.
7. Entre cenários, escolher parte da comitiva e dos vínculos que seguirá com o nobre.

Há três velocidades de jogo. A velocidade pode ser aumentada nos períodos em que nada urgente exige atenção.

## Heróis e classes

Hotéis e guildas atraem tipos específicos de heróis. O jogador pode construir várias guildas e mantê-las em caminhos distintos.

| Classe inicial | Caminhos de prestígio | Acesso |
|---|---|---|
| Warrior | Paladin / Heavy Knight | Nível 15 |
| Archer | Ranger / Assassin | Nível 15 |
| Lancer | Sentinel / Templar | Nível 15 |
| Black Mage | Elementalist / Warlock | Nível 15 |
| Conjurer | Sorcerer / Necromancer | Nível 15 |
| Healer | Bishop / Cleric | Nível 15 |

Cada guilda pode ser desenvolvida para um dos dois caminhos de prestígio da classe correspondente. Por exemplo, a Healers Guild pode virar um templo de Bishop ou um local de treino de Clerics. Construir várias guildas permite manter ambos os caminhos disponíveis.

Ao alcançar o nível 15, o herói escolhe autonomamente o caminho disponível associado à guilda mais próxima e o aceita. A colocação e as melhorias das guildas são a forma indireta de orientar essa especialização.

## Continuidade entre cenários

Na mudança de cenário, o jogador escolhe alguns elementos para acompanhar o nobre, incluindo heróis favoritos, funcionários e vínculos religiosos. O sistema de continuidade deve preservar a sensação de progresso sem eliminar o desafio próprio de cada terra.

## Princípios de design já definidos

- O jogador administra a civilização; os NPCs trabalham em tempo real.
- Os heróis são autônomos: o jogador influencia suas opções por construções, economia e recompensas.
- A composição das guildas e sua localização afetam os heróis atraídos e seus caminhos de prestígio.
- A dificuldade cresce ao longo da campanha, com cenários de durações variadas.
- O humor negro nasce da carreira do nobre: cada promoção o recompensa com terras mais problemáticas.
- A lore, os cameos e a estética devem pertencer ao universo de *Ember Ashes*.

## Decisões ainda em aberto

- Biblioteca de renderização e ferramentas web.
- Navegadores e modelos de celular oficialmente suportados.
- Controles e adaptação da interface para toque.
- Escala dos mapas e limites de construção.
- Modelo de economia, cadeias de produção, taxas e manutenção.
- Regras detalhadas de atração, necessidades e comportamento dos NPCs e heróis.
- Sistemas de recompensas e objetivos secundários.
- Modelo de salvamento e conteúdo persistente entre cenários.
- Conteúdo canônico de religiões, funcionários, cameos e regiões de Mordavia.

## Protótipo atual

O protótipo jogável cobre duas regiões ligadas da primeira propriedade, com onze lotes para as onze opções de construção: fazenda com cinco produções, moinho, taverna, hotel, seis guildas e arsenal. Inclui produção contínua de recursos, três velocidades, ajuste de impostos, atração e equipamento das seis classes de heróis, dois camponeses, recompensas, covis e incursões. Guildas podem ser reformadas para orientar os doze caminhos de prestígio; heróis de nível 15 escolhem a opção disponível mais próxima. O cenário ativo usa `public/art/mordavia-farmstead-open-v02.webp` e `public/art/mordavia-old-road-v01.png`; a versão anterior do cenário permanece preservada.
