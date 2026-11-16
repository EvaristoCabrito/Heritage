# Campanha de Mordavia

O Capítulo 1 usa a arte tropical confirmada de Map 02 (City e Wilds), com as respectivas camadas de árvores. O layout jogável será montado sobre esses mapas. O capítulo combina povoamento e sobrevivência, economia e comércio, e combate para liberar a estrada. O herdeiro e uma pequena comitiva escolhida pelo jogador seguem entre capítulos.

## Modos e fluxo

- **Construção livre:** abre no mapa atual com os sistemas disponíveis hoje. Mantém os saves existentes e permite continuar construindo sem uma transição obrigatória. Os objetivos atuais podem permanecer como desafios opcionais.
- **Campanha:** Novo jogo → Campanha → escolher slot e herdeiro → briefing → jogar. Cada capítulo tem seu mapa, data, estado inicial, ameaças, objetivos, briefing ilustrado e desfecho. O briefing pode ser revisto pelo menu de pausa.
- Os saves de campanha registram capítulo, progresso e comitiva. Saves antigos continuam carregando como Construção livre com o estado que já tinham. Rejogar um capítulo começa em outro slot ou mediante confirmação para substituir o progresso.
- O calendário avança durante a partida e determina a idade do herdeiro nos dois modos. A campanha leva a data e a idade atuais para o capítulo seguinte. Se a história exigir um intervalo entre capítulos, o briefing informa quanto tempo se passou e o que aconteceu à propriedade anterior.

## População inicial e chegadas nos dois modos

- Uma partida nova em Construção livre ou no Capítulo 1 começa com dois camponeses e um herói. A capacidade inicial é de três camponeses e dois heróis, com uma vaga livre em cada categoria. Capítulos seguintes recebem a comitiva escolhida conforme as regras do capítulo.
- A cada hora de jogo, chega no máximo uma unidade. Com vagas nas duas categorias, o sorteio escolhe entre camponês e herói. Com vaga em apenas uma categoria, chega uma unidade dessa categoria. Com lotação total, ninguém chega. Novas moradias ampliam a capacidade para as próximas chegadas. O sorteio da classe de um herói é uma decisão separada.

## Capítulo 1 · A Herança da Mata

O herdeiro recebe um posto à beira da mata tropical. Precisa alimentar os primeiros moradores, estabelecer comércio e reabrir a estrada para que o posto sobreviva à próxima estação.

**Briefing:** uma vista da propriedade ao amanhecer, com árvores tropicais, o casarão e a estrada entrando na mata. Use arte própria de briefing com composição que preserve a leitura em telas pequenas. Para o protótipo, usar uma composição do mapa com as copas sobre a base. A tela mostra época, local, situação inicial e os objetivos conhecidos.

> Você herdou um casarão, duas mãos para trabalhar e uma estrada que ninguém atravessa depois do escuro. Ponha comida na mesa e descubra quem anda cobrando pedágio sem brasão.

| Etapa | Objetivo proposto | Sistemas apresentados |
| --- | --- | --- |
| 1. Criar raízes | Concluir uma fazenda e um casebre. | Construção, trabalhadores, moradia e entregas. |
| 2. Garantir provisões | Entregar a primeira produção ao depósito e manter a ração normal atendida por seis horas de jogo. | Estoque, alimentos servidos, consumo e felicidade. |
| 3. Fazer o primeiro negócio | Abrir um Mercado e concluir uma venda ao mercador. | Estoque local, abastecimento manual e automático, preços e ouro. |
| 4. Abrir a estrada | Financiar uma recompensa e destruir o covil de nível 1 que ameaça a travessia. | Wilds, recompensas, alojamento e combate autônomo. |
| 5. Preparar a partida | Confirmar a rota liberada e escolher a comitiva para o próximo capítulo. | Resultado, seleção dos sobreviventes e transição. |

- **City tropical:** casarão e terreno firme para a expansão inicial. Concentrar as primeiras tarefas perto da moradia e deixar espaço para fazenda e recrutamento.
- **Wilds tropical:** trilha navegável, travessia, local de pesca, pedreira e um covil relevante para o objetivo. Confirmar cada posição no editor. Conferir também as rotas dos camponeses, dos heróis e dos invasores.
- **Ponto de partida para balanceamento:** dar provisões para absorver o tempo de construção e tempo para a primeira entrega antes da pressão maior. Sem prazo global no primeiro teste. Reservar no orçamento inicial espaço para construir o Mercado e financiar uma recompensa viável. Mineração e forja ficam disponíveis onde houver recursos, sem objetivos obrigatórios.
- **Conclusão:** resumo dos objetivos e sobreviventes. O herdeiro leva seu progresso e escolhe uma pequena comitiva entre os sobreviventes. Usar os limites existentes de dois trabalhadores e três heróis como ponto de partida para balanceamento. O próximo capítulo define seu próprio estoque inicial e recebe a comitiva em moradias preparadas. A campanha guarda o resultado e oferece o briefing seguinte quando houver outro capítulo disponível.

## Arco proposto

| Capítulo | Momento | Foco |
| --- | --- | --- |
| 1 · A Herança da Mata | Chegada à fronteira tropical | Povoar, alimentar e abrir a estrada. |
| 2 · O Castelo da Estrada | Após a passagem de uma estação | Receber a comitiva, firmar comércio e lidar com tributos. |
| 3 · As Cinzas da Coroa | Anos depois | Usar mineração, oficinas e Ember para sustentar um domínio sob pressão. |

Somente o primeiro capítulo entra no primeiro lote. Os demais nomes, datas e mapas são propostas.

## Implementação e critérios de aceite

1. Separar a escolha do modo da seleção do slot. Adaptar o fluxo de novo jogo e o carregamento para salvar explicitamente o modo e o capítulo. Manter os saves anteriores compatíveis.
2. Tornar o conjunto de mapa uma propriedade do capítulo, independente da numeração da campanha e da confirmação de comitiva. Reutilizar a câmera e as duas camadas de arte. Separar o layout confirmado do capítulo das versões locais do editor.
3. Substituir a dependência da lista global de objetivos por objetivos associados a cada capítulo. Preservar a sequência antiga em Construção livre como referência opcional e retirar dela a transição obrigatória.
4. Montar briefing, HUD de objetivos, tela de resultado e transição. Ao avançar, gravar o resultado e o estado do capítulo seguinte antes de abrir sua partida. Retomar no ponto correto ao sair durante o briefing ou a escolha da comitiva.
5. Testar um save antigo, um novo jogo livre e uma campanha nova. Verificar nos dois modos a população inicial e as chegadas com vagas nas duas categorias, em uma só e com lotação total. Confirmar que recarregar o save não repete a chegada da mesma hora. Completar o capítulo e testar recarga entre etapas, derrota e reinício, rotas em City e Wilds, seleção da comitiva e briefing em tela pequena. Confirmar que o fim do capítulo não altera a partida livre de outro slot.
