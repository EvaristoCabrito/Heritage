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

- Mercado (100 de ouro, 6 de madeira): depois de pronto, a aba Mercado vende e compra trigo, alho, ovos, leite, bacon e madeira, de 1 em 1 ou de 10 em 10. Preços fixos; comprar custa o dobro de vender. A comida comprada precisa caber no Depósito de Provisões. Armas e itens ainda não existem para negociar.
- Cabana do Lenhador (80 de ouro, 2 de madeira): toque nela e escale de 1 a 3 camponeses livres. Com 1 rende 0,1 de madeira por segundo, com 2 rende 0,3 e com 3 rende 0,5. Os escalados trabalham lá em vez da fazenda.
- Toda construção é uma obra: depois de paga, um camponês livre vai até o local e precisa trabalhar lá um minuto de jogo. Só então ela passa a valer (produção, heróis, moradores, depósito). Sem camponês livre, a obra espera.
- Construir onde quiser: escolha a carta e uma prévia da obra segue o cursor. Ela fica dourada onde dá e vermelha onde não dá (casarão, ruínas, floresta do topo, borda do mapa ou encostada em outra construção). Toque para erguer; `Esc`, botão direito ou tocar de novo na carta cancela.
- Escolher o tipo de Fazenda (alho, trigo, bacon, ovos ou leite) antes da obra e trocar a produção ao tocar na fazenda construída.
- Ouro só vem de impostos, cobrados à meia-noite do jogo. A 10%, cada camponês paga 2 de ouro; a porcentagem vai de 0% a 50% (passos de 5%) e o valor escala junto. A taverna também paga, pelo uso: cada hora de jogo bebendo lá vale 1 de ouro por camponês, 2 por herói e 3 por herói de prestígio (a 10%). Camponeses bebem das 18h às 22h; heróis às vezes param entre uma ronda e outra (o Bêbado, mais vezes). Construções não geram ouro; provisões e madeira continuam em tempo real.
- Ajustar a porcentagem do imposto e escolher entre três velocidades.
- Atrair heróis construindo guildas, taverna e hotel. O hotel acrescenta quatro vagas à companhia.
- Equipar a companhia no arsenal do domínio.
- Atualizar cada guilda (toque nela): a 1ª atualização (120 G, 8 M) traz mais um herói da classe; a 2ª (180 G, 12 M) escolhe a especialização e traz um terceiro herói já especializado, enquanto os dois primeiros continuam como são.
- Acompanhar os heróis até o nível 15, quando procuram uma guilda especializada para o prestígio. A Torre dos Magos evolui para Torre dos Elementalistas ou Torre dos Arcanistas.
- Começar apenas com um camponês e um Warrior, que vêm com o casarão. Ninguém aparece sem uma construção que o gere: guildas, taverna e hotel trazem heróis com nome e mania, e cada Casebre Pequeno traz dois camponeses (alternando homem e mulher); ampliar para Casebre Grande (90 G, 6 M) traz mais três, até 5 moradores. Os camponeses moram no casebre e trabalham na fazenda ou moinho mais perto.
- Comida no estilo Lords of the Realm: cada fazenda produz o seu alimento (trigo, alho, bacon, ovos ou leite; o moinho rende trigo). Na aba Provisões (ou clicando em Provisões ou Felicidade na barra do topo) você escolhe a ração (nenhuma, meia, normal, dobrada ou tripla, a 0,3 por camponês por segundo na normal) e o que servir. A Felicidade (0 a 100) aparece na barra do topo: ração maior, variedade e carne aumentam; ração pequena e fome diminuem.
- O casarão guarda 100 unidades de comida, armas e itens. Para guardar mais, construa um Depósito de Provisões (70 G, 6 M): soma 30 e amplia para 45, 70 e 100 (80 G e 6 M, 140 G e 10 M, 220 G e 16 M). Com tudo cheio, o excesso da colheita se perde.
- Arrastar o mapa com mouse ou toque; usar a roda do mouse ou as setas do teclado para percorrer o domínio. O botão de casa volta ao casarão.
- Escolher entre três níveis de zoom: ampla (100%, o padrão), normal (130%) e próxima (160%). A troca mantém o centro da câmera quando possível. Recursos, heróis e trabalhadores com seus limites e o total de construções ficam na barra do topo. Personagens e construções seguem a escala do mapa, com os personagens da altura da porta do casarão.

## Arquivos principais

- `index.html` — estrutura da interface.
- `app.css` — layout responsivo e estilo visual.
- `app.js` — economia, obras, heróis, saves, menus e cenário.
- `public/art/mordavia-farmstead-open-v02.webp` — cenário ativo, com terrenos secos e abertos para as construções.
- `public/art/mordavia-farmstead-open-v02.png` — versão integral do cenário aberto.
- `public/art/mordavia-farmstead-v01.webp` e `public/art/mordavia-farmstead-v01.png` — cenário original preservado sem alteração.
- `public/art/*-v01.webp` — construções novas com fundo transparente, exibidas onde o jogador as constrói. O moinho usa imagens separadas para o corpo e as pás.
- `public/art/farm-{garlic,wheat,bacon,eggs,milk}-v01.webp` — cinco variações fotográficas da fazenda; a arte `farm-v01.webp` permanece preservada.
- `public/art/manor-smoke-v01.webp` — fumaça fotográfica transparente animada sobre a chaminé principal.
- `public/art/{warrior,archer,lancer,black-mage,conjurer,healer,peasant,female-peasant}-{walk,action}-v01.webp` — folhas de caminhada e ação das seis classes iniciais e dos dois trabalhadores.
- `public/art/{paladin,heavy-knight,ranger,assassin,sentinel,templar,elementalist,warlock,sorcerer,necromancer,bishop,cleric}-walk-v01.webp` — folhas próprias das doze especializações.
- `public/art/portraits/*-portrait-v01.webp` — retratos de perfil novos para cada classe, trabalhador e especialização.
- `outputs/portrait-gallery-v01.html` — galeria offline dos vinte retratos para revisão.

O cenário tem fumaça e luz discretas em movimento, as novas obras aparecem com uma animação curta, e os marcadores dos heróis se deslocam entre destinos. A opção de reduzir movimento do sistema desliga essas animações.
O moinho custa 155 moedas e 10 de madeira, produz 1,8 provisão e 0,4 moeda por segundo; suas pás acompanham a velocidade I, II ou III do jogo.
As construções usam coordenadas da imagem inteira em todas as larguras de tela, para que os prédios continuem sobre o chão ao abrir em celular ou computador. A câmera mostra uma parte do cenário por vez e pode ser movida sem alterar os percursos dos personagens. As artes experimentais de regiões e covis desta etapa foram preservadas como arquivos separados, mas não são usadas no jogo.
As cartas do menu mostram miniaturas das onze construções. Cada tipo de fazenda mostra diretamente seu rendimento de provisões e ouro; o painel de construção mostra a produção atual quando uma fazenda existente é selecionada.
Os personagens seguem pontos de passagem; a posição vertical define se aparecem à frente ou atrás de uma construção. O painel da companhia mostra seus retratos.

É um protótipo de uma propriedade e um cenário. A lógica e a arte ainda são uma base de exploração, não o conteúdo final do jogo.

- Ficha do monarca (o herdeiro): ele não luta, só usa magia. Atributos: MP (mana), CHA (carisma), MAG (magia), INT (inteligência) e WIS (sabedoria), do nível 1 ao 30. MAG segue o Mago Negro do Ember.
