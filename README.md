# Wasteland Farming: Heritage of Ashes

Spin-off de *Ember Ashes* no Kingdom of Mordavia: fazenda com humor negro e controle indireto de heróis. Continua o *Herança de Cinzas* 2D original (`C:\WastelandFarm-main`), com o mesmo tom e um padrão gráfico novo.

## Abrir

Abra `index.html` em um navegador moderno ou execute `JOGAR.bat` no Windows. Não precisa instalar dependências nem iniciar um servidor. A interface se adapta a telas de celular e aceita toque.

## Telas

- **Entrada:** Continuar (quando há save), Novo jogo, Carregar jogo, Opções e Debug, com o resumo do último save.
- **Continuar:** mostra o último jogo salvo antes de abrir.
- **Novo jogo:** escolha um dos 3 slots; a introdução do cenário termina em "Aceitar a herança".
- **Pausa** (`Esc` ou MENU): voltar, salvar no slot, carregar, opções, debug e sair pro título (com "Salvar e sair").
- **Opções:** salvar sozinho, zoom ao começar e nomes dos personagens.
- **Debug:** modo teste e apagar todos os saves.

Ouro e madeira infinitos existem só no **modo teste**, ligado pela tela de Debug. Os saves feitos assim aparecem marcados como MODO TESTE.

## Identidade


- Fontes do Ember Ashes em `public/fonts` (licença OFL): Pirata One no título e nos botões, Newsreader nos títulos de seção, Figtree no texto.
- Botão principal em brasa e os demais em preto com borda dourada, como no menu do Ember.
- Textos, nomes de heróis, manias e falas vêm do *Herança de Cinzas* original.

## O que dá para experimentar

- Mercado (100 de ouro, 6 de madeira): depois de pronto, a aba Mercado vende e compra trigo, farinha, alho, ovos, leite, bacon e madeira, de 1 em 1 ou de 10 em 10. Preços fixos; comprar custa o dobro de vender. A comida comprada precisa caber no Depósito de Provisões. Armas e itens ainda não existem para negociar.
- Cabana do Lenhador (80 de ouro, 2 de madeira): toque nela e escale de 1 a 3 camponeses livres. Com 1 rende 0,1 de madeira por segundo, com 2 rende 0,3 e com 3 rende 0,5. Os escalados trabalham lá em vez da fazenda.
- Toda construção é uma obra: depois de paga, um camponês livre vai até o local e precisa trabalhar lá um minuto de jogo. Só então ela passa a valer (produção, heróis, moradores, depósito). Sem camponês livre, a obra espera.
- Construir onde quiser: escolha a carta e uma prévia da obra segue o cursor. Dá para construir em qualquer lugar do mapa, inclusive colado em outra construção; só fica vermelha fora da borda do mapa. Toque para erguer; `Esc`, botão direito ou tocar de novo na carta cancela.
- Tocar em qualquer construção pronta abre o quadro de informações no painel (o que produz, nível, quem trabalha ou mora nela) e o botão Mudar de lugar: toque no novo ponto livre do mapa; Esc ou botão direito cancela. A mudança não custa nada.
- Escolher o tipo de Fazenda (alho, trigo, bacon, ovos ou leite) antes da obra e trocar a produção ao tocar na fazenda construída. Fazendas e moinhos melhoram até o nível 3 no painel (nível 2: 90 G, 6 M; nível 3: 160 G, 10 M). Por segundo, nos níveis 1/2/3: alho 0,15/0,25/0,4; trigo 0,225/0,375/0,6; bacon 0,195/0,33/0,525; ovos 0,19/0,315/0,5; leite 0,205/0,345/0,55.
- Equipamento: heróis têm 10 espaços (arma, mão secundária, cabeça, armadura, mãos, pés, capa, amuleto e dois anéis) e chegam com a arma básica da classe; camponeses têm 5 (ferramenta, roupa, mãos, pés, cabeça). O Arsenal do Domínio vende tudo, em 3 níveis (melhorar: 120 G e 8 M, depois 200 G e 14 M). Ninguém recebe ordem: uma vez por hora de jogo quem está livre pode comprar uma peça por dia, com o próprio ouro, na ordem que acha mais importante (a mania do herói muda a ordem; o Covarde compra armadura primeiro, o Ganancioso compra anéis). O ouro das vendas vai pro cofre. Os bônus aparecem nos atributos da ficha; o equipamento dos camponeses aumenta produção, carga, passo ou velocidade de obra.
- Profissões: no cartão de cada camponês (aba Heróis) você escolhe Fazendeiro, Moleiro, Lenhador ou Pedreiro. Cada um trabalha no lugar da profissão (o Lenhador entra sozinho numa Cabana com vaga; o Pedreiro vai primeiro para obras e consertos) e compra a ferramenta e a roupa do ofício. Sem profissão, ou sem construção da profissão, faz o que estiver disponível e só compra equipamento básico.
- Habilidades dos camponeses (Lavoura, Moagem, Lenha, Construção e Carga) vão de 0 a 100 e sobem devagar com o que cada um faz, mais devagar quanto mais altas. Elas aumentam a produção, a carga e a velocidade de obra, e aparecem na ficha.
- Vida das construções: cada uma tem vida (fazenda 100, moinho 120, casebre 80, depósito 150, cabana 90, mercado 120, taverna 140, hotel 160, guildas 180, arsenal 200), +50% a cada nível. Monstros vão atacar (ainda não existem; a função damageBuilding já está pronta). Em ruínas a construção para; os camponeses consertam sozinhos, pedreiros primeiro.
- Mensagens do jogo ficam na tela até você clicar nelas; repetidas viram contador e, com três ou mais, aparece "Fechar todas".
- Tributos e Favor dos nobres: de um a dois dias de jogo, um nobre de Mordavia manda exigir uma quantidade de algum recurso (ouro, madeira, farinha, alho, bacon, ovos ou leite), com 24 horas de prazo e uma fala de humor negro. Os nobres são Lorde Anselm Grenholt, Dama Severina Montalvo, Padre-Conde Ottokar Lucerna, Baronesa Ilka Kastrell e a Tia-Avó Brunhilde Vaelmont; às vezes (15%) é o próprio Barão das Cinzas, que pede o dobro com 18 horas de prazo. No máximo dois tributos abertos ao mesmo tempo, e a quantidade cresce com os dias. O Favor vai de 0 a 100 (começa em 50) e aparece na barra do topo; clicar nele abre os tributos na aba Economia. Entregar no prazo: +8 (Barão +15). Atrasar: −5 na hora e −1 a cada hora; entregar atrasado ainda dá +2. Doze horas depois do prazo, os homens do nobre vêm buscar à força: levam o que houver do recurso, quebram uma construção (o Barão queima duas) e o Favor cai 10 (Barão 20). Com Favor abaixo de 20, uma vez por dia algum nobre manda atacar o domínio e danifica uma ou duas construções.
- Recompensas (aba Heróis): você escolhe o valor (10, 25, 50, 100 ou outro) e onde: marcar um ponto no mapa (o herói vigia ali por uma hora de jogo), patrulhar o segundo mapa pela estrada velha (ida e volta) ou vigiar as ruínas do covil. O ouro sai do cofre na hora e aparece uma bandeira no mapa (dourada aberta, verde aceita). Ninguém recebe ordem: cada herói pesa o valor contra a distância e o perigo, e a mania muda a conta (Ganancioso só vai por 40 ou mais; Covarde não vai longe por menos de 60; Valente e Teimoso gostam, mas o Teimoso às vezes nem escuta; Bêbado prefere a taverna). Ferido abaixo da metade da vida não aceita. Quem cumpre embolsa a recompensa inteira. Cancelar ou deixar vencer (2 dias sem ninguém) devolve o ouro ao cofre.
- Caveiras: toda noite, às 22h, o cemitério dos Wilds (na ponta sul da estrada velha) solta uma caveira, com nível igual ao dia. Ela sobe a estrada bem devagar (umas 6 a 7 horas de jogo até a cidade) e aparece na aba Heróis em "Caveiras na estrada", com o tempo que falta. Nesse tempo dá pra pôr uma recompensa de caça presa a ela; o herói que aceitar vai atrás, e quem derrubar embolsa. Chegando à cidade, ela bate na construção mais perto até virar ruína, depois na próxima, e ataca camponês que encostar. Heróis por perto lutam com ela sozinhos, com ou sem recompensa. Se ninguém derrubar, o ouro da recompensa volta pro cofre. O boneco é provisório (uma caveira desenhada em texto) até chegar a arte.
- Aba Economia: ouro por dia (impostos, taverna, vendas do Arsenal, salários e saldo), madeira por segundo por cabana, comida por segundo por tipo, farinha, consumo, o que espera carregador e a produção de cada fazenda e moinho.
- Cada personagem tem a própria bolsa de ouro, mostrada no cartão e na ficha. À meia-noite cada trabalhador recebe 5 de ouro de salário, tirados dos cofres do monarca (se o cofre não der, alguém fica sem). O imposto e a bebida na taverna saem da bolsa de cada um; quem está sem dinheiro paga o que tem ou bebe fiado. Heróis começam com 15 e enchem a bolsa com loot: quem derruba um ladrão fica com o que ele tinha no bolso (o que foi roubado volta pro cofre). A barra do topo mostra o saldo do dia: impostos menos salários.
- Ouro do tesouro só vem de impostos, cobrados à meia-noite do jogo. A 10%, cada camponês paga 2 de ouro; a porcentagem vai de 0% a 20% (passos de 5%) e o valor escala junto. O imposto mexe na felicidade: 0% +20, 5% +10, 10% 0, 15% −10, 20% −20. A taverna também paga, pelo uso: cada hora de jogo bebendo lá vale 1 de ouro por camponês, 2 por herói e 3 por herói de prestígio (a 10%). Camponeses bebem das 18h às 22h; heróis às vezes param entre uma ronda e outra (o Bêbado, mais vezes). Construções não geram ouro; provisões e madeira continuam em tempo real.
- Ajustar a porcentagem do imposto e escolher entre três velocidades.
- Alojamento: o Warrior inicial ocupa uma vaga; cada guilda abriga um único herói; cada hotel acrescenta quatro camas e cada taverna uma. Heróis que chegam de fora e os recrutados nos níveis 2 e 3 das guildas precisam de cama na taverna ou no hotel.
- Equipar a companhia no arsenal do domínio.
- Cada guilda tem três níveis: no nível 1 chega seu único morador; o nível 2 (120 G, 8 M) recruta outro herói da classe, que precisa de alojamento fora da guilda; o nível 3 (180 G, 12 M) escolhe a especialização e recruta o terceiro, também alojado fora da guilda.
- Acompanhar os heróis até o nível 15, quando procuram uma guilda especializada para o prestígio. A Torre dos Magos evolui para Torre dos Elementalistas ou Torre dos Arcanistas.
- Começar com um casal de camponeses e um Warrior, que vêm com o casarão. Ninguém aparece sem uma construção que o gere: guildas, taverna e hotel trazem heróis com nome e mania, e cada Casebre Pequeno traz um casal de camponeses; ampliar para Casebre Grande (90 G, 6 M) traz mais três, homem ou mulher no sorteio, até 5 moradores. Os camponeses moram no casebre e trabalham na fazenda ou moinho mais perto. A colheita fica na fazenda (até 10) e os camponeses carregam de 5 em 5 até o casarão ou o Depósito de Provisões mais perto; no moinho eles buscam trigo no depósito e levam a farinha de volta. O cartão e a ficha de cada camponês mostram onde trabalha, onde mora e o que está fazendo agora.
- Comida no estilo Lords of the Realm: cada fazenda produz o seu alimento (trigo, alho, bacon, ovos ou leite). Trigo cru não alimenta: o moinho mói o trigo do depósito em farinha, 1 para 1, e a farinha vai pra mesa (eles que cozinhem em casa). Na aba Provisões (ou clicando em Provisões ou Felicidade na barra do topo) você escolhe a ração (nenhuma, meia, normal, dobrada ou tripla, a 0,3 por camponês por segundo na normal) e o que servir. A Felicidade (0 a 100) aparece na barra do topo: ração maior, imposto baixo e comida servida aumentam (alho +1, farinha +3, bacon +4, ovos +2, leite +2); ração pequena, imposto alto e fome diminuem.
- O casarão guarda 200 unidades de comida, armas e itens. Para guardar mais, construa um Depósito de Provisões (70 G, 6 M): soma 30 e amplia para 45, 70 e 100 (80 G e 6 M, 140 G e 10 M, 220 G e 16 M). Com tudo cheio, o excesso da colheita se perde.
- Arrastar o mapa com mouse ou toque; usar a roda do mouse ou as setas do teclado para percorrer o domínio. O botão de casa volta ao casarão.
- Escolher entre três níveis de zoom: ampla (100%, o padrão), normal (130%) e próxima (160%). A troca mantém o centro da câmera quando possível. Recursos, heróis e trabalhadores com seus limites e o total de construções ficam na barra do topo. Personagens e construções seguem a escala do mapa, com os personagens da altura da porta do casarão.

## Arquivos principais

- `index.html` — estrutura da interface.
- `app.css` — layout responsivo e estilo visual.
- `app.js` — economia, obras, heróis, saves, menus e cenário.
- `public/art/mordavia-map.webp` — mapa contínuo ativo.
- `public/art/mordavia-forest-layer.png` — camada de floresta transparente sobre o mapa.
- `public/art/mordavia-title.webp` — fundo estático sem fumaça para a tela de título.
- `public/art/*-v01.webp` — construções novas com fundo transparente, exibidas onde o jogador as constrói. O moinho usa imagens separadas para o corpo e as pás.
- `public/art/farm-{garlic,wheat,bacon,eggs,milk}-v01.webp` — cinco variações fotográficas da fazenda; a arte `farm-v01.webp` permanece preservada.
- `public/art/manor-smoke.webp` — fumaça fotográfica transparente, animada sobre a chaminé principal.
- `public/art/{warrior,archer,lancer,black-mage,conjurer,healer,peasant,female-peasant}-{walk,action}-v01.webp` — folhas de caminhada e ação das seis classes iniciais e dos dois trabalhadores.
- `public/art/{paladin,heavy-knight,ranger,assassin,sentinel,templar,elementalist,warlock,sorcerer,necromancer,bishop,cleric}-walk-v01.webp` — folhas próprias das doze especializações.
- `public/art/portraits/*-portrait-v01.webp` — retratos de perfil novos para cada classe, trabalhador e especialização.
- `outputs/portrait-gallery-v01.html` — galeria offline dos vinte retratos para revisão.

O cenário tem fumaça e luz discretas em movimento, as novas obras aparecem com uma animação curta, e os marcadores dos heróis se deslocam entre destinos. A opção de reduzir movimento do sistema desliga essas animações.
O moinho custa 155 moedas e 10 de madeira e mói 0,45 de trigo em farinha por segundo (0,6 no nível 2 e 0,8 no nível 3); suas pás acompanham a velocidade I, II ou III do jogo.
As construções usam coordenadas da imagem inteira em todas as larguras de tela, para que os prédios continuem sobre o chão ao abrir em celular ou computador. A câmera mostra uma parte do cenário por vez e pode ser movida sem alterar os percursos dos personagens. As artes experimentais de regiões e covis desta etapa foram preservadas como arquivos separados, mas não são usadas no jogo.
As cartas do menu mostram miniaturas das onze construções. Cada tipo de fazenda mostra diretamente seu rendimento de provisões e ouro; o painel de construção mostra a produção atual quando uma fazenda existente é selecionada.
Os personagens seguem pontos de passagem; a posição vertical define se aparecem à frente ou atrás de uma construção. O painel da companhia mostra seus retratos.

É um protótipo de uma propriedade e um cenário. A lógica e a arte ainda são uma base de exploração, não o conteúdo final do jogo.

- Ficha do monarca (o herdeiro): ele não luta, só usa magia. Atributos: MP (mana), CHA (carisma), MAG (magia), INT (inteligência) e WIS (sabedoria), do nível 1 ao 30. MAG segue o Mago Negro do Ember.

- Ladrões e combate automático: a cada 6 horas de jogo chega um bando pela estrada velha (1 ladrão no começo, até 4, com nível que cresce com os dias), com bandidos de espada e de besta. Eles vão até uma construção ou o casarão, roubam ouro (ou comida, se não houver ouro) e fogem. Heróis que veem um ladrão até certa distância largam o que fazem e lutam sozinhos; arqueiros e magos atacam de longe, curandeiros curam heróis feridos. Dano e experiência seguem o Ember (ataque − defesa; magia para magos; 13 + 3 × diferença de nível por golpe, +25% ao matar). Heróis só ganham experiência em combate. Feridos mostram barra de vida e se recuperam fora da luta; quem chega a zero morre. Ladrão morto devolve o que roubou, e o herói que derrubou fica com o bolso dele. O equipamento soma nos atributos de luta (ataque, defesa, magia, vida e destreza).
