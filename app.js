const BUILDINGS = [
  { id: 'farm', name: 'Fazenda', glyph: 'F', cost: 115, wood: 6, detail: 'Alho, trigo, bacon, ovos ou leite. Os camponeses trabalham aqui. Melhora até o nível 3.', gold: 0.55, grain: 0.225, people: 0 },
  { id: 'mill', name: 'Moinho', glyph: 'M', cost: 155, wood: 10, detail: 'Mói o trigo em farinha. Trigo cru não alimenta ninguém. As pás giram; a vila, nem tanto.', gold: 0.4, grain: 0, people: 0 },
  { id: 'hut', name: 'Casebre Pequeno', glyph: 'C', cost: 60, wood: 4, detail: 'Moradia para 2 camponeses. Amplia para Casebre Grande, com 5. Eles não tinham pra onde ir mesmo.', gold: 0, grain: 0, people: 0, housing: 2 },
  { id: 'depot', name: 'Depósito de Provisões', glyph: 'D', cost: 70, wood: 6, detail: 'Guarda mais 30 unidades de comida, armas e itens. Amplia para 45, 70 e 100. Os ratos aprovam.', gold: 0, grain: 0, people: 0 },
  { id: 'lumber', name: 'Cabana do Lenhador', glyph: 'L', cost: 80, wood: 2, detail: 'Coloque de 1 a 3 camponeses para cortar lenha: 0,05, 0,15 ou 0,25 de madeira por segundo.', gold: 0, grain: 0, people: 0 },
  { id: 'quarry', name: 'Pedreira', glyph: 'P', cost: 95, wood: 6, detail: 'Até 10 camponeses quebrando rocha: 0,05 de pedra por camponês por segundo. Você escolhe quem vai.', gold: 0, grain: 0, people: 0 },
  { id: 'mine', name: 'Campo de Mineração', glyph: 'M', cost: 120, wood: 8, detail: 'Até 10 camponeses cavando metal: 0,025 por camponês por segundo. Sai pouco, mas sai brilhando.', gold: 0, grain: 0, people: 0 },
  { id: 'market', name: 'Mercado', glyph: 'M', cost: 100, wood: 6, detail: 'Venda o que sobra e compre o que falta. Os mercadores cobram o dobro pra vender e pagam a metade pra comprar.', gold: 0, grain: 0, people: 0 },
  { id: 'tavern', name: 'Taverna', glyph: 'T', cost: 145, wood: 9, detail: 'Uma cama para um herói. Também recebe visitantes e serve bebida, que rende imposto.', gold: 1.15, grain: 0, people: 0 },
  { id: 'hotel', name: 'Hotel de Estrada', glyph: 'H', cost: 170, wood: 11, detail: 'Mais 4 camas para heróis. Os lençóis são trocados uma vez por viúva.', gold: 0.85, grain: 0, people: 0 },
  { id: 'warrior', name: 'Guilda de Guerreiros', glyph: 'W', cost: 185, wood: 11, detail: 'Recruta Warriors. Seguram a linha de frente na força.', heroClass: 'Warrior', gold: 0.3, grain: 0, people: 1 },
  { id: 'archer', name: 'Salão de Arqueiros', glyph: 'A', cost: 170, wood: 10, detail: 'Recruta Archers. Decidem a luta de longe.', heroClass: 'Archer', gold: 0.3, grain: 0, people: 1 },
  { id: 'lancer', name: 'Pátio dos Lanceiros', glyph: 'L', cost: 175, wood: 11, detail: 'Recruta Lancers. A lança chega antes da espada.', heroClass: 'Lancer', gold: 0.3, grain: 0, people: 1 },
  { id: 'blackMage', name: 'Torre dos Magos', glyph: 'M', cost: 210, wood: 12, detail: 'Recruta Black Mages. Magia que explode em área. Eles também morrem fácil.', heroClass: 'Black Mage', gold: 0.2, grain: 0, people: 1 },
  { id: 'conjurer', name: 'Casa dos Conjuradores', glyph: 'C', cost: 200, wood: 12, detail: 'Recruta Conjurers. Chegam sozinhos e lutam acompanhados.', heroClass: 'Conjurer', gold: 0.2, grain: 0, people: 1 },
  { id: 'healer', name: 'Guilda de Curandeiros', glyph: 'H', cost: 180, wood: 10, detail: 'Recruta Healers. Mantêm os heróis vivos. Por um tempo.', heroClass: 'Healer', gold: 0.25, grain: 0, people: 1 },
  { id: 'armory', name: 'Arsenal do Domínio', glyph: 'E', cost: 165, wood: 9, detail: 'Heróis e camponeses compram equipamento aqui com o próprio ouro. O ouro vem pro cofre.', gold: 0.15, grain: 0, people: 0 },
];
const FARM_TYPES = [
  // grain: produção por segundo nos níveis 1, 2 e 3 da fazenda.
  { id: 'garlic', name: 'Alho', art: 'farm-garlic', grain: [0.075, 0.125, 0.2], gold: 0.9 },
  { id: 'wheat', name: 'Trigo', art: 'farm-wheat', grain: [0.1125, 0.1875, 0.3], gold: 0.55 },
  { id: 'bacon', name: 'Bacon', art: 'farm-bacon', grain: [0.05, 0.083, 0.132], gold: 0.75 },
  { id: 'eggs', name: 'Ovos', art: 'farm-eggs', grain: [0.1, 0.166, 0.264], gold: 0.65 },
  { id: 'milk', name: 'Leite', art: 'farm-milk', grain: [0.1025, 0.1725, 0.275], gold: 0.6 },
];
const farmType = id => FARM_TYPES.find(type => type.id === id) || FARM_TYPES[1];
// A colheita fica na fazenda (até FARM_STOCK_CAP) até um camponês carregar CARRY_LOAD por viagem para o depósito.
const CARRY_LOAD = 5;
const FARM_STOCK_CAP = 10;
const MANOR_DOOR = { x: 42, y: 39 };
// Fazendas e moinhos sobem até o nível 3. O moinho melhorado mói mais rápido, sem exagero.
const PRODUCER_LEVELS = [{ gold: 0, wood: 0 }, { gold: 90, wood: 6 }, { gold: 160, wood: 10 }];
const MILL_RATE = [0.225, 0.3, 0.4]; // trigo moído em farinha por segundo, por nível
// Arte por nível: quando houver desenho do upgrade, liste aqui. Ex.: 'farm-garlic': [null, 'farm-garlic-l2', 'farm-garlic-l3']
const LEVEL_ART = {};
const producerLevel = building => Math.min(PRODUCER_LEVELS.length - 1, building?.level || 0);
const farmOutput = building => farmType(building.produce).grain[producerLevel(building)];
const millRate = building => MILL_RATE[producerLevel(building)];
const levelArt = (art, building) => LEVEL_ART[art]?.[producerLevel(building)] || art;
const rateNumber = value => value.toFixed(2).replace('.', ',');

const PRESTIGE = {
  Warrior: ['Paladin', 'Heavy Knight'], Archer: ['Ranger', 'Assassin'], Lancer: ['Sentinel', 'Templar'],
  'Black Mage': ['Elementalist', 'Warlock'], Conjurer: ['Sorcerer', 'Necromancer'], Healer: ['Bishop', 'Cleric'],
};
const GUILD_FOR = { Warrior: 'warrior', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'blackMage', Conjurer: 'conjurer', Healer: 'healer' };
const CLASS_ART = { Warrior: 'warrior', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'black-mage', Conjurer: 'conjurer', Healer: 'healer', Peasant: 'peasant' };
const PORTRAIT_ART = { Warrior: 'warrior', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'black-mage', Conjurer: 'conjurer', Healer: 'healer' };
const PRESTIGE_ART = { Paladin: 'paladin', 'Heavy Knight': 'heavy-knight', Ranger: 'ranger', Assassin: 'assassin', Sentinel: 'sentinel', Templar: 'templar', Elementalist: 'elementalist', Warlock: 'warlock', Sorcerer: 'sorcerer', Necromancer: 'necromancer', Bishop: 'bishop', Cleric: 'cleric' };
const actorArt = actor => PRESTIGE_ART[actor.prestige] || actor.spriteId || (actor.kind === 'skeleton' ? 'skeleton-v02' : actor.kind === 'zombie' ? 'zombie-v01' : actor.kind === 'wolf' ? 'mordavian-wolf-v01' : actor.kind === 'goblin' ? 'mordavian-goblin-v01' : actor.kind === 'troll' ? 'mordavian-troll-v01' : null) || CLASS_ART[actor.className];
const actorPortrait = actor => PRESTIGE_ART[actor.prestige] || actor.portraitId || PORTRAIT_ART[actor.className] || 'male-peasant';
const actorSheet = actor => actor.action === 'build' ? 'build' : actor.action === 'action' && !actor.prestige ? 'action' : 'walk';
// Nomes, manias e falas vindos do Herança de Cinzas original.
const FIRST_NAMES = ['Vasile','Mirela','Bogdan','Ileana','Radu','Doina','Grigore','Anca','Toma','Zoia','Petru','Lenuța','Costel','Viorica','Mircea','Sanda','Dorin','Floarea','Ion','Rodica'];
const EPITHETS = ['Três Dedos','Sem Sorte','do Brejo','da Vala','Meio Surdo','Olho Torto','de Ninguém','Dente Mole','do Poço'];
const TRAITS = {
  'Covarde': 'Foge na primeira ferida.', 'Ganancioso': 'Só aceita recompensa gorda.', 'Bêbado': 'Passa a noite na taverna, aconteça o que acontecer.',
  'Amaldiçoado': 'Os monstros preferem ele.', 'Valente': 'Nunca foge. Isso não é um elogio.', 'Honesto': 'Nenhum defeito conhecido. Suspeito.', 'Teimoso': 'Não foge. Não escuta. É você.',
};
const pick = list => list[Math.floor(Math.random() * list.length)];
function heroName() {
  const taken = new Set(state.heroes.map(hero => hero.name));
  for (let i = 0; i < 40; i++) { const name = `${pick(FIRST_NAMES)} ${pick(EPITHETS)}`; if (!taken.has(name)) return name; }
  return `${pick(FIRST_NAMES)} ${pick(EPITHETS)} ${state.heroes.length + 1}`;
}
const PROMO_MSG = {
  Paladin: n => `${n} virou Paladin. Agora reza antes de bater.`, 'Heavy Knight': n => `${n} virou Heavy Knight. A armadura pesa mais que ele.`,
  Ranger: n => `${n} virou Ranger. Agora erra de mais longe.`, Assassin: n => `${n} virou Assassin. Ninguém mais sabe o nome verdadeiro dele.`,
  Sentinel: n => `${n} virou Sentinel. Não sai de perto de casa nem pra beber.`, Templar: n => `${n} virou Templar. A lança foi benta. Ele, mais ou menos.`,
  Elementalist: n => `${n} virou Elementalist. Tirem o trigo de perto.`, Warlock: n => `${n} virou Warlock. Ninguém perguntou o preço.`,
  Sorcerer: n => `${n} virou Sorcerer. Os cães agora vêm em dupla.`, Necromancer: n => `${n} virou Necromancer. O cemitério ganhou um sindicato.`,
  Bishop: n => `${n} virou Bishop. Já pediu o dízimo.`, Cleric: n => `${n} virou Cleric. Cura com uma mão e bate com a outra.`,
};
const NIGHT_MSG = ['Primeira noite. Dizem que a primeira é a mais fácil. Dizem muita coisa.', 'Anoiteceu. Tranque as galinhas. Você não tem galinhas.',
  'Noite três. Os mortos já sabem o seu endereço.', 'Anoiteceu. O padre recomenda rezar. O padre está bêbado.', 'Noite cinco. A cinza está mais grossa. Isso não é cinza.',
  'Mais uma noite. Ou a última. Depende de você.', 'Anoiteceu. Alguém da família veio visitar.'];
const LOSS_MSG = ['Um camponês morreu. Os outros pediram aumento.', 'Um camponês foi levado. A colheita atrasou.', 'Perdemos um camponês. Ele tinha nome. Ninguém lembra qual.'];

const isDone = building => !building.underConstruction && !building.ruined;
// Vida das construções. Monstros atacam (damageBuilding); camponeses consertam sozinhos.
// Cada nível de melhoria dá +50% de vida. Em ruínas, a construção para até ser consertada.
const BASE_HP = { farm: 100, mill: 120, hut: 80, depot: 150, lumber: 90, quarry: 110, mine: 120, market: 120, tavern: 140, hotel: 160, armory: 200 };
const GUILD_HP = 180;
const REPAIR_RATE = 3; // vida por segundo de jogo, antes da habilidade e das ferramentas
function buildingLevel(building) {
  if (building.type === 'hut') return building.big ? 1 : 0;
  if (building.tier != null || building.branch) return building.tier ?? 2;
  return building.level || 0;
}
const buildingMaxHp = building => Math.round((BASE_HP[building.type] ?? GUILD_HP) * (1 + 0.5 * buildingLevel(building)));
const buildingHp = building => Math.max(0, buildingMaxHp(building) - (building.damage || 0));
const needsBuilder = building => !!building.underConstruction || (building.damage || 0) > 0;
function damageBuilding(building, amount) {
  if (!building || building.underConstruction) return;
  building.damage = Math.min(buildingMaxHp(building), (building.damage || 0) + amount);
  if (building.damage >= buildingMaxHp(building) && !building.ruined) {
    building.ruined = true;
    say(`${siteLabel(building)} virou ruína. Os camponeses vão juntar os pedaços.`);
  }
  assignBuilders();
  renderSites();
  if (state.selectedSite === building.site) renderPanel();
}
const guildHousing = () => state.buildings.filter(building => BUILDINGS.some(item => item.id === building.type && item.heroClass) && isDone(building)).length;
const lodgingCapacity = () => state.buildings.filter(building => isDone(building) && building.type === 'hotel').length * 4
  + state.buildings.filter(building => isDone(building) && building.type === 'tavern').length;
const heroCapacity = () => 1 + guildHousing() + lodgingCapacity();
const freeLodging = () => {
  return state.buildings.find(building => isDone(building)
    && ((building.type === 'hotel' && state.heroes.filter(hero => hero.alive && hero.homeSite === building.site).length < 4)
      || (building.type === 'tavern' && !state.heroes.some(hero => hero.alive && hero.homeSite === building.site)))) || null;
};
// Construção livre: vai onde o jogador colocar. Só não pode sair do mapa nem encostar em outra construção.
const BUILD_SPACING = 12.5;
const BUILDING_ART = {
  farm: 'farm-wheat', mill: 'mill-body', hut: 'hut', depot: 'depot', lumber: 'lumber', quarry: 'lumber', mine: 'lumber', market: 'market', tavern: 'tavern', hotel: 'hotel', warrior: 'guild', archer: 'archer', lancer: 'lancer',
  blackMage: 'tower', conjurer: 'conjurer', healer: 'healer', armory: 'armory',
};
const PHOTOREAL_BUILDING_ART = new Set([
  'farm-garlic', 'farm-wheat', 'farm-bacon', 'farm-eggs', 'farm-milk',
  'mill-body', 'mill-sails', 'hut', 'hut-big', 'depot', 'lumber', 'market',
  'tavern', 'hotel', 'guild', 'archer', 'lancer', 'tower', 'conjurer', 'healer', 'armory', 'manor',
]);
// Artes de obra: o sprite final existente continua sendo a fase completa.
// Para adicionar uma construção nova, inclua a chave aqui e os arquivos -early/-mid.
const CONSTRUCTION_STAGE_ART = new Set([
  'farm-garlic', 'farm-wheat', 'farm-bacon', 'farm-eggs', 'farm-milk',
  'mill-body', 'hut', 'hut-big', 'depot', 'lumber', 'market', 'tavern',
  'hotel', 'guild', 'archer', 'lancer', 'tower', 'conjurer', 'healer', 'armory',
]);
const BUILDING_ART_ASPECTS = {
  'farm-garlic': 1.5, 'farm-wheat': 1.5, 'farm-bacon': 1.5, 'farm-eggs': 1.5, 'farm-milk': 1.5,
  'mill-body': 1105 / 1424, 'mill-sails': 1312 / 1199, hut: 1.5, 'hut-big': 1.5,
  depot: 2, lumber: 1.5, market: 2, tavern: 1.5, hotel: 2, guild: 1.5,
  archer: 1199 / 1312, lancer: 1.5, tower: 1202 / 1308, conjurer: 1312 / 1199,
  healer: 1.5, armory: 1.5, manor: 1.5,
};
const buildingImage = (art, constructionStage = null, building = null) => {
  if (art === 'armory' && constructionStage && building?.armoryUpgradeTo >= 2 && building.armoryUpgradeTo <= 4) {
    return `public/art/armory-upgrade-phases-v01/armory-upgrade-to-level-0${building.armoryUpgradeTo}-${constructionStage}-v01.png`;
  }
  if (constructionStage && CONSTRUCTION_STAGE_ART.has(art)) {
    return `public/art/buildings-construction-dark-v01/${art}-${constructionStage}.webp`;
  }
  if (!PHOTOREAL_BUILDING_ART.has(art)) return `public/art/${art}-v01.webp`;
  if (options.buildingArtStyle === 'color') {
    return `public/art/buildings-color-v02/${art}.webp`;
  }
  return `public/art/buildings-photoreal-v03-runtime/${art}.webp`;
};
const PATH_NODES = [
  { x: 42, y: 39, links: [1] },                 // Entrada do casarão
  { x: 53, y: 54, links: [0, 2, 3] },           // Cruzamento central
  { x: 41, y: 58, links: [1, 4] },
  { x: 62, y: 56, links: [1, 6, 10] },
  { x: 40, y: 68, links: [2, 5] },
  { x: 40, y: 80, links: [4, 12] },
  { x: 62, y: 81, links: [3] },
  { x: 90, y: 52, links: [8, 11] },
  { x: 91, y: 29, links: [7, 9] },
  { x: 85, y: 21, links: [8] },                 // Ruínas do covil
  { x: 62, y: 67, links: [3, 11] },             // Contorno sul do lote direito
  { x: 90, y: 67, links: [10, 7] },
  { x: 42, y: 99, links: [5, 13] },
  { x: 54, y: 107, links: [12, 14] },
  { x: 51, y: 121, links: [13, 15] },
  { x: 39, y: 137, links: [14, 16] },
  { x: 45, y: 153, links: [15, 17] },
  { x: 56, y: 171, links: [16, 18] },
  { x: 44, y: 190, links: [17] },               // Final da estrada velha
];
const PATROLS = {
  Warrior: [0, 3, 6, 1, 5],
  Healer: [0, 2, 5, 1, 6],
  other: [0, 1, 3, 6, 2],
};

const GAME_VERSION = 'Version 0.12';
const SAVE_SLOTS = 3;
const SAVE_KEY = slot => `mordavia.save.${slot}`;
const OPTIONS_KEY = 'mordavia.options';
const DEBUG_KEY = 'mordavia.debug';

function readStore(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? { ...fallback, ...JSON.parse(raw) } : { ...fallback }; } catch { return { ...fallback }; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

// Opções do jogador e do debug ficam salvas no navegador.
const options = readStore(OPTIONS_KEY, { startZoom: 0, names: 'selected', autosave: 3, buildingArtStyle: 'dark' });
if (options.zoomVersion !== 3 || ![0, 1, 2].includes(options.startZoom)) { options.startZoom = 0; options.zoomVersion = 3; }
// Som: 1 ligado, 0 desligado. O jogo ainda não toca áudio; todo som futuro deve respeitar esta opção.
if (![0, 1].includes(options.sound)) options.sound = 1;
if (!['dark', 'color'].includes(options.buildingArtStyle)) options.buildingArtStyle = 'dark';
// Modo teste: ouro e madeira infinitos. Só existe ligado pela tela de Debug.
const debug = readStore(DEBUG_KEY, { testMode: false });

// Começo de um jogo novo. Regra: sem construção, sem ninguém. O casarão traz um camponês e um Warrior;
// outros heróis saem de guildas, taverna ou hotel; cada fazenda ou moinho traz mais um camponês.
// Bolsas: salário diário do trabalhador e o que cada um traz ao chegar.
const WORKER_WAGE = 5;
const WORKER_START_PURSE = 5;
const HERO_START_PURSE = 15;
function newGameState(testMode = false, heir = null) {
  return {
    gold: 240, grain: 58, timber: 30, stone: 0, metal: 0,
    food: { wheat: 0, flour: 40, garlic: 18, bacon: 0, eggs: 0, milk: 0 }, items: [], ration: 2, diet: { wheat: false, flour: true, garlic: true, bacon: true, eggs: true, milk: true }, happiness: 50, moodTarget: 50, moodParts: null, favor: 50, demands: [], nextDemandAt: 600, lastRaidDay: -1, bounties: [], bountyAmount: 25,
    speed: 1, minutes: 380, ticks: 0, selectedBuild: null, selectedSite: null, selectedFarmType: 'wheat', taxPercent: 10, tavernTab: 0, nextBuildingId: 1,
    tab: 'build', won: false,
    bandits: [], nextRaidAt: 720,
    testMode, heir, heirLevel: 1, heirXp: 0, equipment: BASIC_EQUIPMENT(), stash: null, playSeconds: 0,
    buildings: [],
    mapSet: 1,
    lairs: [
      { id: 'cemetery-l1', name: 'Cemiterio level 1', kind: 'cemetery', level: 1, art: 'mordavia-cemetery-l1-v01.png', mapId: 'city', x: 44, y: 190, active: true },
      { id: 'wolf-den-1', name: 'Covil de lobos 1', kind: 'wolf-den', level: 1, art: 'mordavia-wolf-den-l1-v01.png', mapId: 'wilds', x: 82, y: 173, active: true, nextSpawnAt: 380 + 90 },
      { id: 'wolf-den-2', name: 'Covil de lobos 2', kind: 'wolf-den', level: 1, art: 'mordavia-wolf-den-l1-v01.png', mapId: 'wilds', x: 91, y: 184, active: true, nextSpawnAt: 380 + 420 },
      { id: 'cemetery-l2', name: 'Cemiterio level 2', kind: 'cemetery', level: 2, art: 'mordavia-cemetery-l2-v01.png', mapId: 'wilds', x: 44, y: 190, active: false },
      { id: 'wolf-den-l2', name: 'Covil de lobos level 2', kind: 'wolf-den', level: 2, art: 'mordavia-wolf-den-l2-v01.png', mapId: 'wilds', x: 82, y: 173, active: false, nextScenario: true },
      { id: 'goblin-den-l1', name: 'Covil goblin level 1', kind: 'goblin-den', level: 1, art: 'mordavia-goblin-den-l1-v01.png', mapId: 'wilds', x: 82, y: 24, active: true, nextSpawnAt: 380 + 200 },
      { id: 'goblin-den-l2', name: 'Covil goblin level 2', kind: 'goblin-den', level: 2, art: 'mordavia-goblin-den-l2-v01.png', mapId: 'wilds', x: 34, y: 118, active: false, nextScenario: true },
      { id: 'troll-den-l1', name: 'Covil de trolls level 1', kind: 'troll-den', level: 1, art: 'mordavia-troll-den-l1-v01.png', mapId: 'wilds', x: 90, y: 34, active: true, nextSpawnAt: 380 + 300 },
      { id: 'troll-den-l2', name: 'Covil de trolls level 2', kind: 'troll-den', level: 2, art: 'mordavia-troll-den-l1-v01.png', mapId: 'wilds', x: 62, y: 162, active: false, nextScenario: true },
    ],
    heroes: [
      { id: 'warrior-manor', name: 'Bogdan Sem Sorte', className: 'Warrior', trait: 'Valente', level: 1, xp: 0, x: 42, y: 39, alive: true, home: 'manor', purse: HERO_START_PURSE, gear: { weapon: 'rustySword' } },
    ],
    workers: [
      { id: 'peasant-1', name: 'Ion do Poço', level: 1, xp: 0, className: 'Peasant', spriteId: 'peasant', portraitId: 'male-peasant', x: 42, y: 39, alive: true, workTrip: false, home: 'manor', purse: WORKER_START_PURSE },
      { id: 'peasant-2', name: 'Rodica do Poço', level: 1, xp: 0, className: 'Peasant', spriteId: 'female-peasant', portraitId: 'female-peasant', x: 42.6, y: 39, alive: true, workTrip: false, home: 'manor', purse: WORKER_START_PURSE },
    ],
    selectedActor: null,
  };
}

let state = newGameState();
const game = { running: false, slot: null, lastSaved: 0 };

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const format = n => Math.floor(n).toLocaleString('pt-BR');

// A câmera percorre o mundo sem alterar as coordenadas dos lotes e personagens.
// Zoom do jogo: ampla preenche a tela; normal aproxima 30%; próxima aproxima 60%.
const ZOOM_LEVELS = [1, 1.3, 1.6];
const MAP_WORLD_HEIGHT = 2624;
const MAP_RATIO = MAP_WORLD_HEIGHT / 1199;
const WORLD_Y_UNITS = 200 * MAP_WORLD_HEIGHT / 2452;
const Y_TO_X_SCALE = MAP_WORLD_HEIGHT / WORLD_Y_UNITS * 100 / 1199;
let currentMap = 'city';
let currentMapSet = 1;
const camera = { x: 0.5, y: 0, zoom: 0, drag: null };
const clampCamera = value => Math.max(0, Math.min(1, value));

function cameraBounds() {
  const scene = $('#map-scene');
  const world = $('#map-world');
  return {
    x: Math.max(0, world.offsetWidth * ZOOM_LEVELS[camera.zoom] - scene.clientWidth),
    y: Math.max(0, world.offsetHeight * ZOOM_LEVELS[camera.zoom] - scene.clientHeight),
  };
}

// O mundo cobre a moldura inteira: a largura é a maior entre a da moldura e a necessária para preencher a altura.
// Assim o zoom 1 (distante) nunca deixa faixas vazias, em qualquer formato de janela.
function sizeWorld() {
  const scene = $('#map-scene');
  const world = $('#map-world');
  world.style.width = `${Math.max(scene.clientWidth, scene.clientHeight / MAP_RATIO)}px`;
}

// Centraliza a câmera no casarão (cerca de 42% x 39% da arte).
function homeCamera() {
  const scene = $('#map-scene');
  const world = $('#map-world');
  camera.x = 0.5;
  camera.y = 0;
  renderCamera();
}

function renderCamera() {
  const bounds = cameraBounds();
  const scene = $('#map-scene');
  const world = $('#map-world');
  const zoom = ZOOM_LEVELS[camera.zoom];
  // Quando o mundo cabe inteiro na cena (zoom distante), ele fica centralizado em vez de colado à borda.
  const slackX = Math.max(0, scene.clientWidth - world.offsetWidth * zoom) / 2;
  const slackY = Math.max(0, scene.clientHeight - world.offsetHeight * zoom) / 2;
  world.style.setProperty('--zoom', zoom);
  world.style.setProperty('--camera-x', `${slackX - bounds.x * camera.x}px`);
  world.style.setProperty('--camera-y', `${slackY - bounds.y * camera.y}px`);
}

function setZoom(index) {
  if (index === camera.zoom || !ZOOM_LEVELS[index]) return;
  const scene = $('#map-scene');
  const world = $('#map-world');
  const oldBounds = cameraBounds();
  const oldScale = ZOOM_LEVELS[camera.zoom];
  const oldSlackX = Math.max(0, (scene.clientWidth - world.offsetWidth * oldScale) / 2);
  const oldSlackY = Math.max(0, (scene.clientHeight - world.offsetHeight * oldScale) / 2);
  const centerX = (scene.clientWidth / 2 - oldSlackX + oldBounds.x * camera.x) / (world.offsetWidth * oldScale);
  const centerY = (scene.clientHeight / 2 - oldSlackY + oldBounds.y * camera.y) / (world.offsetHeight * oldScale);
  camera.zoom = index;
  const bounds = cameraBounds();
  const newScale = ZOOM_LEVELS[index];
  const newSlackX = Math.max(0, (scene.clientWidth - world.offsetWidth * newScale) / 2);
  const newSlackY = Math.max(0, (scene.clientHeight - world.offsetHeight * newScale) / 2);
  camera.x = bounds.x ? clampCamera((newSlackX + centerX * world.offsetWidth * newScale - scene.clientWidth / 2) / bounds.x) : 0.5;
  camera.y = bounds.y ? clampCamera((newSlackY + centerY * world.offsetHeight * newScale - scene.clientHeight / 2) / bounds.y) : 0;
  $$('.zoom-btn').forEach(button => {
    const active = Number(button.dataset.zoom) === index;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderCamera();
}

function focusRegion(name) {
  if (name === 'manor') { homeCamera(); return; }
  if (name === 'wilds') { switchMap('wilds'); return; }
  const scene = $('#map-scene');
  const world = $('#map-world');
  const bounds = cameraBounds();
  const desiredCenter = world.offsetHeight * ZOOM_LEVELS[camera.zoom] * 0.72;
  camera.y = bounds.y ? clampCamera((desiredCenter - scene.clientHeight / 2) / bounds.y) : 0;
  renderCamera();
}

function switchMap(name) {
  currentMap = name === 'wilds' ? 'wilds' : 'city';
  const wilds = currentMap === 'wilds';
  $('#map-world').dataset.map = currentMap;
  $('#map-world').dataset.mapSet = String(currentMapSet);
  const art = currentMapSet === 2
    ? (wilds ? ['mordavia-map02-wilds-v01.png', 'mordavia-map02-wilds-trees-v01.png'] : ['mordavia-map02-city-v01.png', 'mordavia-map02-city-trees-v01.png'])
    : (wilds ? ['mordavia-wilds-map.webp', 'mordavia-wilds-forest-layer.png'] : ['mordavia-map.webp', 'mordavia-forest-layer.png']);
  $('.map-art').src = `public/art/${art[0]}`;
  $('.tree-foreground').src = `public/art/${art[1]}`;
  $('.map-art').alt = wilds ? 'Mapa dos Wilds' : 'Mapa de City';
  const button = $('#camera-wilds');
  button.textContent = wilds ? 'CITY' : 'WILDS';
  button.title = wilds ? 'Voltar para City' : 'Abrir Wilds';
  button.setAttribute('aria-label', button.title);
  camera.x = 0.5;
  camera.y = 0;
  sizeWorld();
  renderCamera();
  renderLairs();
  renderHeroes();
}

function moveCamera(dx, dy) {
  const bounds = cameraBounds();
  if (bounds.x) camera.x = clampCamera(camera.x - dx / bounds.x);
  if (bounds.y) camera.y = clampCamera(camera.y - dy / bounds.y);
  renderCamera();
}

function initCamera() {
  const scene = $('#map-scene');
  const endDrag = event => {
    if (camera.drag?.id !== event.pointerId) return;
    camera.dragMoved = camera.drag.moved;
    camera.drag = null;
    scene.classList.remove('dragging');
    if (scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
  };
  scene.addEventListener('pointerdown', event => {
    camera.dragMoved = false;
    if (camera.drag || event.button !== 0 || event.target.closest('button')) return;
    camera.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
    try { scene.setPointerCapture(event.pointerId); } catch {}
    scene.classList.add('dragging');
  });
  scene.addEventListener('pointermove', event => {
    if (camera.drag?.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - camera.drag.startX, event.clientY - camera.drag.startY) > 5) camera.drag.moved = true;
    if (!camera.drag.moved) return;
    moveCamera(event.clientX - camera.drag.x, event.clientY - camera.drag.y);
    camera.drag.x = event.clientX;
    camera.drag.y = event.clientY;
  });
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  scene.addEventListener('lostpointercapture', endDrag);
  scene.addEventListener('wheel', event => {
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? scene.clientHeight : 1;
    moveCamera(-event.deltaX * unit, -event.deltaY * unit);
  }, { passive: false });
  scene.addEventListener('keydown', event => {
    const step = 48;
    const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[event.key]) {
      event.preventDefault();
      moveCamera(...moves[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      homeCamera();
    }
  });
  $('#camera-home')?.addEventListener('click', () => {
    focusRegion('manor');
  });
  $('#camera-road')?.addEventListener('click', () => focusRegion('road'));
  $('#camera-wilds').addEventListener('click', () => switchMap(currentMap === 'city' ? 'wilds' : 'city'));
  $$('.zoom-btn').forEach(button => button.addEventListener('click', () => setZoom(Number(button.dataset.zoom))));
  window.addEventListener('resize', () => { sizeWorld(); renderCamera(); });
  sizeWorld();
  homeCamera();
}

// Mensagens ficam na tela até o jogador clicar. Repetida vira contador; acima de TOAST_MAX, sai a mais antiga.
const TOAST_MAX = 6;
const TOAST_SECONDS = 15;   // cada aviso some sozinho depois disso
function dismissToastLater(item) {
  clearTimeout(item.dismissTimer);
  item.dismissTimer = setTimeout(() => { item.remove(); updateToastClear(); }, TOAST_SECONDS * 1000);
}
function say(message, event = message) {
  const toast = $('#toast');
  const last = [...toast.querySelectorAll('.toast-msg')].pop();
  if (last && last.dataset.text === message) {
    last.dataset.count = String(Number(last.dataset.count || 1) + 1);
    last.querySelector('em').textContent = `×${last.dataset.count}`;
    dismissToastLater(last);
  } else {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'toast-msg';
    item.dataset.text = message;
    item.title = 'Clique para fechar';
    item.innerHTML = '<span></span><em></em>';
    item.querySelector('span').textContent = message;
    item.addEventListener('click', () => { item.remove(); updateToastClear(); });
    toast.insertBefore(item, toast.querySelector('.toast-clear'));
    dismissToastLater(item);
    while (toast.querySelectorAll('.toast-msg').length > TOAST_MAX) toast.querySelector('.toast-msg').remove();
  }
  updateToastClear();
  $('#event-line').textContent = event;
}
function updateToastClear() {
  const toast = $('#toast');
  let clear = toast.querySelector('.toast-clear');
  const count = toast.querySelectorAll('.toast-msg').length;
  if (count < 3) { clear?.remove(); return; }
  if (!clear) {
    clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'toast-clear';
    clear.textContent = 'Fechar todas';
    clear.addEventListener('click', () => { toast.querySelectorAll('.toast-msg').forEach(item => item.remove()); updateToastClear(); });
    toast.append(clear);
  }
}

const WORKER_UPKEEP = 0.3; // provisões por segundo, por trabalhador
// Mercado: sempre aberto. Sem a construção, só a troca simples de trigo, alho e madeira, 25% pior:
// vende por 75% do preço e compra por 125%.
// Preços fixos em ouro por unidade. Comprar custa o dobro de vender.
const MARKET_GOODS = [
  { id: 'wheat', name: 'Trigo', art: 'farm-wheat', sell: 1, buy: 2 },
  { id: 'flour', name: 'Farinha', art: 'mill-body', sell: 2, buy: 4 },
  { id: 'garlic', name: 'Alho', art: 'farm-garlic', sell: 1, buy: 2 },
  { id: 'eggs', name: 'Ovos', art: 'farm-eggs', sell: 2, buy: 4 },
  { id: 'milk', name: 'Leite', art: 'farm-milk', sell: 2, buy: 4 },
  { id: 'bacon', name: 'Bacon', art: 'farm-bacon', sell: 3, buy: 6 },
  { id: 'timber', name: 'Madeira', icon: 'icon-logs-photo-v01.png', sell: 2, buy: 4 },
];
const BASIC_GOODS = ['wheat', 'garlic', 'timber'];
const hasMarket = () => state.buildings.some(building => building.type === 'market' && isDone(building));
const marketGoods = () => hasMarket() ? MARKET_GOODS : MARKET_GOODS.filter(good => BASIC_GOODS.includes(good.id));
const unitPrice = (good, side) => hasMarket() ? good[side] : good[side] * (side === 'sell' ? 0.75 : 1.25);
const formatPrice = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const stockOf = id => id === 'timber' ? state.timber : (state.food[id] || 0);
function trade(id, amount) {
  const good = marketGoods().find(item => item.id === id);
  if (!good) return;
  if (amount > 0) {
    let qty = amount;
    if (id !== 'timber') qty = Math.min(qty, Math.floor(storageCap() - storedUnits()));
    if (qty <= 0) { say('O Depósito de Provisões está cheio. Não cabe nem um ovo.'); return; }
    const price = qty * unitPrice(good, 'buy');
    if (!state.testMode && state.gold < price) { say(`Falta ouro. ${qty} de ${good.name.toLowerCase()} custam ${formatPrice(price)}.`); return; }
    if (!state.testMode) state.gold -= price;
    if (id === 'timber') state.timber += qty; else state.food[id] = (state.food[id] || 0) + qty;
    say(`Comprou ${qty} de ${good.name.toLowerCase()} por ${formatPrice(price)} de ouro. O mercador sorriu demais.`);
  } else {
    const qty = Math.min(-amount, Math.floor(stockOf(id)));
    if (qty <= 0) { say(`Não tem ${good.name.toLowerCase()} pra vender.`); return; }
    const price = qty * unitPrice(good, 'sell');
    if (id === 'timber') state.timber -= qty; else state.food[id] -= qty;
    if (!state.testMode) state.gold += price;
    say(`Vendeu ${qty} de ${good.name.toLowerCase()} por ${formatPrice(price)} de ouro. O mercador fingiu que era caro.`);
  }
  state.grain = totalFood();
  updateHud(); renderPanel();
}
function marketPanelHTML() {
  const coin = pixelIcon('coin', 14).replace('class="pixel-icon"', 'class="pixel-icon cost-ico"');
  return `<div class="panel-title"><h3>Mercado</h3><span>${coin} ${state.testMode ? '∞' : format(state.gold)} · depósito ${Math.floor(storedUnits())}/${storageCap()}</span></div>
    <div class="market-list">${marketGoods().map(good => `<div class="market-row">
      <img src="${good.icon ? `public/art/${good.icon}` : `public/art/${good.art}-v01.webp`}" alt="">
      <span class="market-name"><b>${good.name}</b><small>Tem ${format(stockOf(good.id))}</small></span>
      <span class="market-side"><small>VENDER ${formatPrice(unitPrice(good, 'sell'))} ${coin}</small><span><button type="button" data-trade="${good.id}" data-amount="-1">1</button><button type="button" data-trade="${good.id}" data-amount="-10">10</button></span></span>
      <span class="market-side"><small>COMPRAR ${formatPrice(unitPrice(good, 'buy'))} ${coin}</small><span><button type="button" class="buy" data-trade="${good.id}" data-amount="1">1</button><button type="button" class="buy" data-trade="${good.id}" data-amount="10">10</button></span></span>
    </div>`).join('')}</div>
    <p class="build-note">${hasMarket() ? 'Armas e itens ainda não chegaram aos mercadores.' : 'Sem um Mercado, só passa a carroça de trigo, alho e madeira, e o carroceiro cobra 25% a mais. Construa um Mercado para preços justos e para negociar ovos, leite e bacon.'}</p>`;
}

// Cabana do Lenhador: até 3 camponeses escalados pelo painel.
const LUMBER_RATE = [0, 0.05, 0.15, 0.25];
const lumberCrew = camp => state.workers.filter(worker => worker.alive && worker.workplace && worker.workplace.site === camp.site);
// Pedreira (pedra) e Campo de Mineração (metal): até 10 camponeses cada, escolhidos pelo jogador.
const PIT_CREW_MAX = 10;
const PIT_GOODS = { quarry: { good: 'stone', name: 'pedra', rate: 0.05 }, mine: { good: 'metal', name: 'metal', rate: 0.025 } };
const isPit = building => !!PIT_GOODS[building?.type];
const pitRate = pit => PIT_GOODS[pit.type].rate * lumberCrew(pit).length * (1 + crewWork(pit));
// Metal rende 0,025: duas casas cortariam pra 0,03.
const fineRate = value => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
const CREW_TYPES = ['lumber', 'quarry', 'mine'];
function freeWorkers() {
  return state.workers.filter(worker => worker.alive && worker.buildSite == null && !CREW_TYPES.includes(worker.workplace?.type));
}
// Clique no nome: entra ou sai da equipe. Quem entra larga o trabalho que tinha.
function togglePitWorker(site, workerId) {
  const pit = state.buildings.find(building => building.site === site && isPit(building) && isDone(building));
  const worker = state.workers.find(item => String(item.id) === String(workerId) && item.alive);
  if (!pit || !worker) return;
  const name = buildingName(pit);
  if (worker.workplace?.site === pit.site) {
    worker.workplace = null;
    say(`${worker.name} largou a picareta ${pit.type === 'quarry' ? 'na Pedreira' : 'no Campo de Mineração'} e voltou pro trabalho de antes.`);
  } else {
    if (lumberCrew(pit).length >= PIT_CREW_MAX) { say(`${name} já tem dez camponeses. Mais um e alguém leva uma picareta na testa.`); return; }
    worker.workplace = pit;
    worker.jobSite = null;
    say(pit.type === 'quarry' ? `${worker.name} foi quebrar pedra. Disse que as costas aguentam. Não aguentam.` : `${worker.name} foi cavar metal. Volta mais sujo e mais pobre.`);
  }
  worker.route = []; worker.finalPoint = null; worker.wait = 0; worker.workTrip = false;
  renderPanel(); updateHud();
}
function pitBoxHTML(pit) {
  const crew = lumberCrew(pit);
  const people = state.workers.filter(worker => worker.alive).sort((a, b) => Number(b.workplace?.site === pit.site) - Number(a.workplace?.site === pit.site));
  const doing = worker => worker.workplace?.site === pit.site ? 'trabalhando aqui' : worker.buildSite != null ? 'em obra' : worker.workplace ? workPlaceName(worker.workplace).replace(/^(na|no) /, '') : workplaceOf(worker) ? workPlaceName(workplaceOf(worker)).replace(/^(na|no) /, '') : 'à toa';
  return `<section class="inspector-section"><h4>Quem trabalha aqui · ${crew.length} de ${PIT_CREW_MAX}</h4>
    <small class="pit-hint">Clique no nome para colocar ou tirar.</small>
    <div class="pit-crew">${people.map(worker => { const here = worker.workplace?.site === pit.site; return `<button type="button" class="pit-worker${here ? ' here' : ''}" data-pit="${pit.site}" data-worker="${worker.id}" aria-pressed="${here}" ${!here && crew.length >= PIT_CREW_MAX ? 'disabled' : ''}><b>${here ? '✓ ' : ''}${worker.name}</b><small>${doing(worker)} · Mineração ${Math.floor(skillOf(worker, 'mining'))}</small></button>`; }).join('') || '<div class="empty-state">Nenhum camponês. Construa um casebre.</div>'}</div></section>`;
}
function setLumberCrew(site, change) {
  const camp = state.buildings.find(building => building.site === site && building.type === 'lumber' && isDone(building));
  if (!camp) return;
  const crew = lumberCrew(camp);
  if (change > 0) {
    if (crew.length >= 3) { say('A cabana já tem três lenhadores. Um quarto só ia atrapalhar.'); return; }
    const worker = freeWorkers()[0];
    if (!worker) { say('Nenhum camponês livre. Construa um casebre ou tire alguém de outra cabana.'); return; }
    worker.workplace = camp; worker.route = []; worker.finalPoint = null; worker.wait = 0; worker.workTrip = false;
    say(`${worker.name} foi cortar lenha. Pediu um machado melhor. Não ganhou.`);
  } else {
    const worker = crew[crew.length - 1];
    if (!worker) return;
    worker.workplace = null; worker.route = []; worker.finalPoint = null; worker.wait = 0; worker.workTrip = false;
    say(`${worker.name} largou o machado e voltou para a fazenda.`);
  }
  renderPanel(); updateHud();
}
function lumberBoxHTML(camp) {
  const crew = lumberCrew(camp);
  return `<section class="inspector-section"><h4>Equipe</h4>
    <div class="guild-branches"><button type="button" class="hut-upgrade" data-lumber="${camp.site}" data-change="1" ${crew.length >= 3 ? 'disabled' : ''}>+1 camponês</button><button type="button" class="hut-upgrade" data-lumber="${camp.site}" data-change="-1" ${crew.length ? '' : 'disabled'}>−1 camponês</button></div></section>`;
}

function rates() {
  const sum = state.buildings.reduce((sum, building) => {
    const def = BUILDINGS.find(item => item.id === building.type);
    if (def && isDone(building)) {
      // Provisões comestíveis: trigo cru não conta; o moinho conta a farinha que mói.
      if (building.type === 'farm') sum.grain += building.produce === 'wheat' ? 0 : farmOutput(building);
      else if (building.type !== 'mill') sum.grain += def.grain;
      sum.people += def.people;
    }
    return sum;
  }, { gold: 0, grain: 0, timber: 0.14, stone: 0, metal: 0, people: 0 });
  state.buildings.filter(building => isPit(building) && isDone(building)).forEach(pit => { sum[PIT_GOODS[pit.type].good] += pitRate(pit); });
  sum.timber += state.buildings.filter(building => building.type === 'lumber' && isDone(building)).reduce((total, camp) => total + LUMBER_RATE[lumberCrew(camp).length] * (1 + crewWork(camp)), 0);
  // Farinha: o moinho só mói o trigo que existe; sem estoque, fica limitado ao que as fazendas colhem.
  sum.grain += (state.food.wheat || 0) > 0.5 ? millCapacity() : Math.min(millCapacity(), foodProduction().wheat);
  sum.grain -= foodDemand();
  return sum;
}

// ==========================================================================
// Impostos: cobrados uma vez por dia, à meia-noite. A 10%, cada camponês paga 2 de ouro.
// A taverna paga pelo uso: cada hora bebendo vale 1 (camponês), 2 (herói) ou 3 (herói de prestígio), a 10%.
// Tudo escala com a porcentagem escolhida.
// ==========================================================================
const taxFactor = () => (state.taxPercent ?? 10) / 10;
// Cada personagem tem a própria bolsa. Trabalhadores recebem salário dos cofres do monarca à meia-noite
// e pagam dela o imposto e a taverna. Heróis enchem a bolsa com loot.
const purseOf = actor => actor?.purse || 0;
const dailyWages = () => state.workers.filter(worker => worker.alive).length * WORKER_WAGE;
function lootHero(hero, amount) { hero.purse = purseOf(hero) + amount; }
const openTavern = () => state.buildings.find(building => building.type === 'tavern' && isDone(building)) || null;
const tavernRate = actor => actor.className === 'Peasant' ? 1 : actor.prestige ? 3 : 2;
function dailyTaxEstimate() {
  return state.workers.filter(worker => worker.alive).reduce((sum, worker) => sum + Math.min(purseOf(worker), 2 * taxFactor()), 0) + (state.tavernTab || 0) * taxFactor();
}
function tavernSpot(actor, tavern) {
  if (!actor.tavernSpot || actor.tavernSpot.site !== tavern.site) {
    actor.tavernSpot = { site: tavern.site, x: tavern.x + (Math.random() * 4 - 2), y: Math.min(198, tavern.y + 1 + Math.random() * 1.5) };
  }
  return actor.tavernSpot;
}
function goDrink(actor, tavern) {
  const spot = tavernSpot(actor, tavern);
  if (Math.hypot(actor.x - spot.x, actor.y - spot.y) < 1.2) { actor.wait = 2; return; }
  routeActor(actor, nearestNode(spot));
  actor.finalPoint = { x: spot.x, y: spot.y };
}
function isDrinking(actor) {
  const tavern = openTavern();
  return !!tavern && actor.drinkUntil > state.minutes && actor.tavernSpot?.site === tavern.site
    && Math.hypot(actor.x - actor.tavernSpot.x, actor.y - actor.tavernSpot.y) < 1.5;
}
// Uma vez por segundo de jogo (speed minutos): anota o consumo de quem está bebendo.
function accrueTavern(minutesPassed) {
  // Cada um paga da própria bolsa; quem está sem dinheiro bebe fiado e a taverna não ganha nada.
  [...state.heroes, ...state.workers].filter(actor => actor.alive && isDrinking(actor)).forEach(actor => {
    const paid = Math.min(purseOf(actor), tavernRate(actor) * minutesPassed / 60);
    actor.purse = purseOf(actor) - paid;
    state.tavernTab = (state.tavernTab || 0) + paid;
  });
}
function collectTaxes() {
  const workers = state.workers.filter(worker => worker.alive);
  // Primeiro o imposto, tirado da bolsa de cada um; quem não tem, paga o que tem.
  let fromPeasants = 0;
  workers.forEach(worker => {
    const paid = Math.min(purseOf(worker), 2 * taxFactor());
    worker.purse = purseOf(worker) - paid;
    fromPeasants += paid;
  });
  const fromTavern = (state.tavernTab || 0) * taxFactor();
  state.tavernTab = 0;
  state.armorySales = 0;
  if (!state.testMode) state.gold += fromPeasants + fromTavern;
  // Depois o salário, direto dos cofres do monarca. Sem ouro, alguém fica sem.
  const paidCount = state.testMode ? workers.length : Math.min(workers.length, Math.floor(state.gold / WORKER_WAGE));
  workers.slice(0, paidCount).forEach(worker => { worker.purse = purseOf(worker) + WORKER_WAGE; });
  if (!state.testMode) state.gold -= paidCount * WORKER_WAGE;
  const unpaid = workers.length - paidCount;
  say(`Impostos a ${state.taxPercent}%: ${format(fromPeasants)} de ouro dos camponeses${openTavern() ? ` e ${format(fromTavern)} da taverna` : ''}. Salários: ${format(paidCount * WORKER_WAGE)} de ouro${unpaid ? `; ${unpaid} ficaram sem receber` : ''}.`,
    unpaid ? 'O cofre não deu pra todos. Alguns trabalharam de graça hoje. Lembram disso.' : 'Os camponeses pagaram e receberam. O ouro deu uma volta e voltou menor.');
}

function updateHud() {
  if (state.testMode) { state.gold = 1e9; state.timber = 1e9; }
  const r = rates();
  $('#gold').textContent = format(state.gold);
  state.grain = totalFood();
  $('#grain').textContent = format(state.grain);
  $('#storage-cap').textContent = storageCap();
  $('#grain').closest('.stat').classList.toggle('full', storedUnits() >= storageCap() - 1);
  $('#happiness').textContent = Math.round(state.happiness);
  $('#happiness-label').textContent = happinessLabel(state.happiness);
  $('#favor').textContent = Math.round(state.favor ?? 50);
  $('#favor-label').textContent = `${favorLabel(state.favor ?? 50)}${state.demands?.length ? ` · ${state.demands.length} ${state.demands.length === 1 ? 'tributo' : 'tributos'}` : ''}`;
  $('#favor').closest('.stat').dataset.mood = (state.favor ?? 50) < 40 ? 'low' : (state.favor ?? 50) < 60 ? 'mid' : 'high';
  $('#happiness').closest('.stat').dataset.mood = state.happiness < 40 ? 'low' : state.happiness < 60 ? 'mid' : 'high';
  $('#timber').textContent = format(state.timber);
  if (state.testMode) { $('#gold').textContent = '∞'; $('#timber').textContent = '∞'; }
  const goldNet = dailyTaxEstimate() - dailyWages();
  $('#gold-rate').textContent = `${goldNet < 0 ? '−' : '+'}${format(Math.abs(goldNet))}/dia`;
  $('#grain-rate').textContent = `${r.grain < 0 ? '−' : '+'}${Math.abs(r.grain).toFixed(1).replace('.', ',')}/s`;
  $('#grain-rate').classList.toggle('negative', r.grain < 0);
  $('#timber-rate').textContent = `+${rateNumber(r.timber)}/s`;
  $('#stone').textContent = format(state.stone || 0);
  $('#stone-rate').textContent = `+${fineRate(r.stone)}/s`;
  $('#metal').textContent = format(state.metal || 0);
  $('#metal-rate').textContent = `+${fineRate(r.metal)}/s`;
  // Personagens: quantos existem e quantos o domínio comporta.
  const heroes = state.heroes.filter(hero => hero.alive).length;
  const heroCap = heroCapacity();
  const workers = state.workers.filter(worker => worker.alive).length;
  const workerCap = 2 + state.buildings.filter(building => building.type === 'hut' && isDone(building)).reduce((sum, hut) => sum + (hut.big ? 5 : 2), 0);
  $('#hero-count').textContent = heroes;
  $('#hero-cap').textContent = heroCap;
  $('#hero-count').closest('.stat').classList.toggle('full', heroes >= heroCap);
  $('#worker-count').textContent = workers;
  $('#worker-cap').textContent = workerCap;
  $('#tax-pct').textContent = `${state.taxPercent}%`;
  $('#tax-preview').textContent = `≈ ${format(dailyTaxEstimate())} de imposto · −${format(dailyWages())} de salários por dia`;
  $('#objective-gold').textContent = state.testMode ? '∞' : format(state.gold);
  const pct = Math.min(100, state.gold / 6);
  $('#objective-bar').style.width = `${pct}%`;
  const hh = Math.floor(state.minutes / 60) % 24;
  const mm = state.minutes % 60;
  $('#clock').textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  $('#date').textContent = `${dayPeriod()} · ${dateLabel()}`;
  if (!state.testMode && state.gold >= 600 && !state.won) {
    state.won = true;
    say('Cenário conquistado: o domínio agora paga as próprias dívidas.', 'Os credores receberam a notícia. Infelizmente, também receberam o endereço.');
    if (!state.retinue && game.slot) { menu.stack = []; showScreen('scenarioEnd', { servants: [], protectors: [] }); }
  }
}

const BRANCH_NAMES = { Bishop: 'Templo Bishop', Cleric: 'Treino Cleric', Elementalist: 'Torre dos Elementalistas', Warlock: 'Torre dos Arcanistas' };
function siteLabel(building) {
  const def = BUILDINGS.find(item => item.id === building.type);
  return building.type === 'farm' ? `Fazenda de ${farmType(building.produce).name}` : building.type === 'hut' ? (building.big ? 'Casebre Grande' : 'Casebre Pequeno') : building.branch ? (BRANCH_NAMES[building.branch] || `Guilda ${building.branch}`) : def.name;
}
function siteArt(building) {
  const art = building.type === 'farm' ? farmType(building.produce).art : building.type === 'hut' && building.big ? 'hut-big' : BUILDING_ART[building.type];
  return ['farm', 'mill'].includes(building.type) ? levelArt(art, building) : art;
}

// Uma construção por botão no mapa, no ponto onde foi erguida.
function renderSites() {
  const layer = $('#site-layer');
  const visibleBuildings = state.buildings.filter(building => (building.mapSet || 1) === currentMapSet);
  const ids = new Set(visibleBuildings.map(building => String(building.site)));
  $$('.site', layer).filter(site => !ids.has(site.dataset.site)).forEach(site => site.remove());
  const moving = state.movingSite != null;
  renderBountyFlags();
  $('#map-scene').classList.toggle('placing', !!state.selectedBuild || moving || !!state.placingBounty);
  if (!state.selectedBuild && !moving) $('#placement-preview').hidden = true;
  visibleBuildings.forEach(building => {
    const idx = building.site;
    let site = $(`.site[data-site="${idx}"]`, layer);
    if (!site) {
      site = document.createElement('button');
      site.type = 'button';
      site.className = 'site built';
      site.dataset.site = String(idx);
      layer.append(site);
    }
    site.style.setProperty('--x', `${building.x}%`);
    site.style.setProperty('--y', `${building.y / WORLD_Y_UNITS * 100}%`);
    site.classList.toggle('selected', state.selectedSite === idx);
    site.classList.toggle('constructing', !!building.underConstruction);
    site.classList.toggle('moving', state.movingSite === idx);
    site.classList.toggle('ruined', !!building.ruined);
    site.style.zIndex = String(Math.round(building.y * 10));
    {
      const label = siteLabel(building);
      const art = building.type === 'farm' ? farmType(building.produce).art : building.type === 'hut' && building.big ? 'hut-big' : BUILDING_ART[building.type];
      const constructionStage = building.underConstruction
        ? ((building.progress || 0) < BUILD_TIME / 2 ? 'early' : 'mid')
        : null;
      site.classList.toggle('just-built', Date.now() - building.builtAt < 1400);
      site.dataset.art = art;
      site.dataset.type = building.type;
      const artAspect = options.buildingArtStyle === 'dark' || constructionStage ? BUILDING_ART_ASPECTS[art] || 1 : art === 'manor' ? 1.5 : 1;
      site.innerHTML = `<span class="building-art" style="--art-aspect:${artAspect};background-image:url('${buildingImage(siteArt(building), constructionStage, building)}')" aria-hidden="true">${building.type === 'mill' && !building.underConstruction ? '<span class="mill-sails"></span>' : ''}</span>${building.underConstruction ? `<small class="build-progress">${constructionLabel(building)}</small><small class="build-spacer" aria-hidden="true">Em obra</small>` : `<small>${building.damage > 0 ? `${label} · ${building.ruined ? 'em ruínas' : 'vida'} ${buildingHp(building)}/${buildingMaxHp(building)}` : label}</small>`}`;
      site.setAttribute('aria-label', `${label}. Toque para ver opções.`);
    }
  });
  renderLairs();
}

// Se a construção cabe neste ponto: dentro do mapa, fora das áreas bloqueadas e longe das outras.

function renderLairs() {
  const layer = $('#lair-layer');
  if (!layer) return;
  const visibleIds = new Set();
  (state.lairs || []).filter(lair => lair.active).forEach(lair => {
    visibleIds.add(lair.id);
    let marker = $(`.lair-marker[data-lair="${lair.id}"]`, layer);
    if (!marker) { marker = document.createElement('div'); marker.className = 'lair-marker'; marker.dataset.lair = lair.id; layer.append(marker); }
    marker.style.left = `${lair.x}%`;
    marker.style.top = `${lair.y / WORLD_Y_UNITS * 100}%`;
    marker.style.zIndex = String(Math.round(lair.y * 10));
    marker.hidden = (lair.mapId || 'city') !== currentMap || (lair.mapSet || 1) !== currentMapSet;
    marker.classList.toggle('level-two', lair.level >= 2);
    marker.setAttribute('aria-label', lair.name);
    const image = `public/art/${lair.art}`;
    if (marker.dataset.image !== image) { marker.innerHTML = `<img src="${image}" alt=""><small>${lair.name}</small>`; marker.dataset.image = image; }
  });
  $$('.lair-marker', layer).filter(marker => !visibleIds.has(marker.dataset.lair)).forEach(marker => marker.remove());
}

function placementProblem(x, y, ignoreSite = null) {
  if (x < 6 || x > 94 || y < 4 || y > 196) return 'Fora do mapa.';
  const crowded = state.buildings.some(building => building.site !== ignoreSite && Math.hypot(building.x - x, (building.y - y) * Y_TO_X_SCALE) < BUILD_SPACING);
  if (crowded) return 'Encostado demais em outra construção.';
  return null;
}


function worldPoint(event) {
  const rect = $('#map-world').getBoundingClientRect();
  return { x: (event.clientX - rect.left) / rect.width * 100, y: (event.clientY - rect.top) / rect.height * WORLD_Y_UNITS };
}

function showPlacementPreview(event) {
  const preview = $('#placement-preview');
  const item = BUILDINGS.find(building => building.id === state.selectedBuild);
  const moving = state.movingSite != null ? state.buildings.find(building => building.site === state.movingSite) : null;
  if ((!item && !moving) || event.target.closest('.map-tools, .menu-btn')) { preview.hidden = true; return; }
  const { x, y } = worldPoint(event);
  const art = moving ? siteArt(moving) : item.id === 'farm' ? farmType(state.selectedFarmType).art : BUILDING_ART[item.id];
  preview.hidden = false;
  preview.style.setProperty('--x', `${x}%`);
  preview.style.setProperty('--y', `${y / WORLD_Y_UNITS * 100}%`);
  preview.style.zIndex = String(Math.round(y * 10) + 1);
  preview.dataset.art = art;
  preview.style.backgroundImage = `url('${buildingImage(art)}')`;
  preview.classList.toggle('invalid', !!placementProblem(x, y, moving ? moving.site : null));
}

function renderHeroes() {
  const layer = $('#hero-layer');
  const active = new Set();
  [...state.heroes, ...state.workers, ...(state.bandits || []), ...(window.Monarch?.summons() || [])].filter(actor => actor.alive && (actor.mapId || 'city') === currentMap && (actor.mapSet || 1) === currentMapSet).forEach(actor => {
    active.add(String(actor.id));
    let token = [...layer.children].find(node => node.dataset.actor === String(actor.id));
    if (!token) {
      token = document.createElement('button');
      token.type = 'button';
      token.dataset.actor = String(actor.id);
      token.setAttribute('aria-label', `${actor.name}, ${actor.className}`);
      const art = actorArt(actor);
      token.innerHTML = art
        ? `<span class="character-sprite" style="background-image:url('public/art/${art}-walk-v01.${art.startsWith('bandit') || art.startsWith('skeleton-v02') || art.startsWith('zombie-v01') || art.startsWith('mordavian-wolf-v01') || art.startsWith('mordavian-goblin-v01') || art.startsWith('mordavian-troll-v01') ? 'png' : 'webp'}')" aria-hidden="true"></span><span class="character-name">${actor.name}</span>`
        : actor.className === 'Monster' ? `<span class="monster-skull" aria-hidden="true">☠</span><span class="character-name">${actor.name}</span>`
        : `<span class="hero-face">${actor.className[0]}</span><span class="character-name">${actor.name}</span>`;
      token.addEventListener('click', () => {
        if (state.selectedBuild) return;
        // Clique esquerdo num inimigo põe recompensa pela cabeça dele (valor escolhido na aba Heróis).
        if (isHostile(actor)) {
          if ((state.bounties || []).some(bounty => bounty.target === actor.id)) { say(`${actor.name} já tem recompensa. Agora é esperar alguém com coragem.`); return; }
          huntBounty(actor.id);
          return;
        }
        state.selectedActor = actor.id;
        renderHeroes();
        // Clicar no boneco abre a ficha dele: nível, experiência, atributos e origem.
        menu.stack = [];
        showScreen('actor', { id: actor.id });
      });
      token.insertAdjacentHTML('beforeend', '<span class="hp-bar" aria-hidden="true"><i></i></span>');
      layer.append(token);
    }
    if (token.parentElement !== layer) layer.append(token);
    const hurt = actor.hp != null && actor.hp < maxHpOf(actor);
    token.className = `character${actor.className === 'Peasant' ? ' worker' : ''}${actor.className === 'Bandit' ? ' bandit' : ''}${actor.className === 'Monster' ? ' bandit monster' : ''}${actor.kind === 'wolf' ? ' wolf' : actor.kind === 'goblin' ? ' goblin' : actor.kind === 'troll' ? ' troll' : actor.kind === 'zombie' ? ' zombie' : ''}${actor.summon ? ' summon' : ''}${actor.mfx?.convert ? ' converted' : ''}${hurt ? ' hurt' : ''}${state.selectedActor === actor.id ? ' selected' : ''}`;
    if (hurt) token.style.setProperty('--hp', `${Math.max(0, Math.round(hpOf(actor) / maxHpOf(actor) * 100))}%`);
    token.style.left = `${actor.x}%`;
    token.style.top = `${actor.y / WORLD_Y_UNITS * 100}%`;
    token.style.zIndex = String(Math.round(actor.y * 10));
    token.dataset.facing = actor.facing || 'front';
    token.dataset.side = actor.side || 'right';
    if (actorArt(actor)) {
      const art = actorArt(actor);
      const sheet = actorSheet(actor);

      // A caminhada de costas tem uma tira própria: a cesta permanece na mesma mão
      // e os quatro quadros mantêm a passada alternada sem espelhar metade do ciclo.
      const backWalk = art === 'peasant' && sheet === 'walk' && token.dataset.facing === 'back';
      const verticalTrollWalk = actor.kind === 'troll' && sheet === 'walk' && ['up', 'down'].includes(actor.walkDirection);
      const extension = (art === 'peasant' && sheet === 'build') || art.startsWith('bandit') || art.startsWith('skeleton-v02') || art.startsWith('zombie-v01') || art.startsWith('mordavian-wolf-v01') || art.startsWith('mordavian-goblin-v01') || art.startsWith('mordavian-troll-v01') ? 'png' : 'webp';
      const spriteFile = backWalk ? 'peasant-walk-back-v02.png' : verticalTrollWalk ? 'mordavian-troll-v01-walk-vertical-v01.png' : art === 'skeleton-v02' && sheet === 'action' ? 'skeleton-v02-action-v02.png' : `${art}-${sheet}-v01.${extension}`;
      if (token.dataset.spriteFile !== spriteFile) {
        $('.character-sprite', token).style.backgroundImage = `url('public/art/${spriteFile}')`;
        token.dataset.spriteFile = spriteFile;
        token.dataset.sheet = sheet;
        token.dataset.art = art;
      }
      token.dataset.backWalk = backWalk ? 'true' : 'false';
      token.dataset.verticalWalk = verticalTrollWalk ? 'true' : 'false';
      const flipSprite = !verticalTrollWalk && token.dataset.side === 'left'; token.style.setProperty('--sprite-scale-x', flipSprite ? -1 : 1);
    }
    token.style.setProperty('--frame-x', `${(actor.frame || 0) * 100 / 3}%`);
    // Recompensa pela cabeça: a placa acompanha a caveira.
    const wanted = actor.className === 'Monster' ? (state.bounties || []).find(bounty => bounty.target === actor.id) : null;
    let tag = token.querySelector('.wanted-tag');
    if (wanted) {
      if (!tag) { tag = document.createElement('span'); tag.className = 'wanted-tag'; token.append(tag); }
      if (tag.textContent !== String(wanted.reward)) tag.textContent = String(wanted.reward);
    } else if (tag) tag.remove();
  });
  [...layer.children].filter(node => !active.has(node.dataset.actor)).forEach(node => node.remove());
}

function heroCard(hero) {
  const prestigeTargets = PRESTIGE[hero.className];
  const nextInfo = hero.prestige ? `Caminho de prestígio: ${hero.prestige}` : hero.level >= 15 ? 'A guilda disponível mais próxima define a especialização.' : `${15 - hero.level} ${15 - hero.level === 1 ? 'nível' : 'níveis'} até o prestígio`;
  const guildType = GUILD_FOR[hero.className];
  return `<article class="hero-card">
    <img class="hero-portrait" src="public/art/portraits/${actorPortrait(hero)}-portrait-v01.webp" alt="Retrato de ${hero.name}">
    <div class="hero-details"><b>${hero.name}</b><small>${hero.className}${hero.prestige ? ` · ${hero.prestige}` : ''}</small>${hero.trait ? `<small class="hero-trait"><b>${hero.trait}.</b> ${TRAITS[hero.trait] || ''}</small>` : ''}<small>${nextInfo}</small><small>Bolsa: ${format(purseOf(hero))} de ouro</small></div>
    <div class="hero-xp">NÍV. ${hero.level}<i style="--xp:${hero.level >= HEIR_MAX_LEVEL ? 100 : Math.round((hero.xp || 0) / xpToNext(hero.level) * 100)}%"></i><button type="button" class="card-sheet-btn" data-actor-sheet="${hero.id}">FICHA</button></div>
  </article>`;
}

function workerCard(worker) {
  return `<article class="hero-card worker-card">
    <img class="hero-portrait" src="public/art/portraits/${actorPortrait(worker)}-portrait-v01.webp" alt="Retrato de ${worker.name}">
    <div class="hero-details"><b>${worker.name}</b><small>${actorLabel(worker)}</small><small>${homeOf(worker) ? 'Mora no casebre.' : 'Mora no casarão, como as dívidas.'} ${workplaceOf(worker) ? `Trabalha ${workPlaceName(workplaceOf(worker))}.` : 'Sem fazenda pra trabalhar.'}</small><small class="worker-task">Agora: ${peasantActivity(worker)}.</small><label class="prof-select"><span>Profissão</span><select data-profession="${worker.id}"><option value="">Nenhuma</option>${Object.entries(PROFESSIONS).map(([id, prof]) => `<option value="${id}"${worker.profession === id ? ' selected' : ''}>${isFemalePeasant(worker) ? prof.fem : prof.name}</option>`).join('')}</select></label><small>Bolsa: ${format(purseOf(worker))} de ouro</small></div>
    <div class="hero-xp">NÍV. ${worker.level || 1}<i style="--xp:${(worker.level || 1) >= HEIR_MAX_LEVEL ? 100 : Math.round((worker.xp || 0) / xpToNext(worker.level || 1) * 100)}%"></i><button type="button" class="card-sheet-btn" data-actor-sheet="${worker.id}">FICHA</button></div>
  </article>`;
}

// A ficha da construção abre num menu próprio em cima do mapa (mover, melhorar, demolir).
// A aba Construir fica sempre com a lista de construções.
function inspectorHTML() {
    const selectedFarm = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'farm' && isDone(building));
    const selectedBuilding = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && !building.underConstruction);
    const selectedArmory = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'armory' && isDone(building));
    const selectedProducer = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && ['farm', 'mill'].includes(building.type) && isDone(building));
    const selectedHut = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'hut' && isDone(building));
    const selectedLumber = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'lumber' && isDone(building));
    const selectedPit = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && isPit(building) && isDone(building));
    const selectedDepot = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'depot' && isDone(building));
    const selectedGuild = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && isDone(building) && BUILDINGS.find(item => item.id === building.type)?.heroClass);
    const currentFarmType = selectedFarm ? farmType(selectedFarm.produce).id : state.selectedFarmType;
    const inspectorActions = selectedBuilding ? `${selectedFarm ? `<section class="inspector-section" aria-label="Tipo de fazenda"><h4>Produção</h4>
        <div class="farm-type-grid compact">${FARM_TYPES.map(type => `<button class="farm-type${currentFarmType === type.id ? ' selected' : ''}" data-farm-type="${type.id}" aria-pressed="${currentFarmType === type.id}" title="+${rateNumber(type.grain[producerLevel(selectedFarm)])} por segundo"><img src="public/art/${type.art}-v01.webp" alt=""><b>${type.name}</b></button>`).join('')}</div></section>` : ''}
      ${selectedProducer ? producerBoxHTML(selectedProducer) : ''}
      ${selectedHut && !selectedHut.big ? `<section class="inspector-section"><h4>Ampliação</h4><button type="button" class="hut-upgrade" data-hut-upgrade="${selectedHut.site}">Casebre Grande · +3 moradores · ${costHTML(HUT_UPGRADE.gold, HUT_UPGRADE.wood)}</button></section>` : ''}
      ${selectedGuild ? guildBoxHTML(selectedGuild) : ''}
      ${selectedDepot ? depotBoxHTML(selectedDepot) : ''}
      ${selectedLumber ? lumberBoxHTML(selectedLumber) : ''}
      ${selectedPit ? pitBoxHTML(selectedPit) : ''}
      ${selectedArmory ? armoryBoxHTML(selectedArmory) : ''}` : '';
  return selectedBuilding ? buildingInfoHTML(selectedBuilding, inspectorActions) : '';
}

function renderInspector() {
  const box = $('#site-inspector');
  if (!box) return;
  const html = inspectorHTML();
  box.hidden = !html;
  box.innerHTML = html;
  if (html) bindPanel(box);
}

function bindPanel(host) {
  $$('.build-card', host).forEach(button => button.addEventListener('click', () => chooseBuild(button.dataset.build)));
  $$('[data-farm-type]', host).forEach(button => button.addEventListener('click', () => chooseFarmType(button.dataset.farmType)));
  $$('[data-guild-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeGuild(Number(button.dataset.guildUpgrade), button.dataset.branch || null)));
  $$('[data-ration]', host).forEach(button => button.addEventListener('click', () => { state.ration = Number(button.dataset.ration); say(`Ração ${RATIONS[state.ration].label.toLowerCase()}.`); renderPanel(); updateHud(); }));
  $$('[data-diet]', host).forEach(button => button.addEventListener('click', () => { state.diet[button.dataset.diet] = !state.diet[button.dataset.diet]; renderPanel(); }));
  $$('[data-trade]', host).forEach(button => button.addEventListener('click', () => trade(button.dataset.trade, Number(button.dataset.amount))));
  $$('[data-pit]', host).forEach(button => button.addEventListener('click', () => togglePitWorker(Number(button.dataset.pit), button.dataset.worker)));
  $$('[data-lumber]', host).forEach(button => button.addEventListener('click', () => setLumberCrew(Number(button.dataset.lumber), Number(button.dataset.change))));
  $$('[data-inspector-close]', host).forEach(button => button.addEventListener('click', () => { if (state.movingSite != null) cancelMove(); state.selectedSite = null; renderSites(); renderPanel(); }));
  $$('[data-move-site]', host).forEach(button => button.addEventListener('click', () => (state.movingSite === Number(button.dataset.moveSite) ? cancelMove() : startMove(Number(button.dataset.moveSite)))));
  $$('[data-open-market]', host).forEach(button => button.addEventListener('click', () => { state.tab = 'market'; $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); }); renderPanel(); }));
  $$('[data-bounty-amount]', host).forEach(button => button.addEventListener('click', () => { state.bountyAmount = Number(button.dataset.bountyAmount); renderPanel(); }));
  $$('[data-bounty-input]', host).forEach(input => input.addEventListener('change', () => { state.bountyAmount = Math.max(5, Math.round(Number(input.value) || 25)); renderPanel(); }));
  $$('[data-bounty-place]', host).forEach(button => button.addEventListener('click', () => (state.placingBounty ? cancelBountyPlacement() : startBountyPlacement())));
  $$('[data-bounty-preset]', host).forEach(button => button.addEventListener('click', () => createBounty(BOUNTY_PRESETS[button.dataset.bountyPreset])));
  $$('[data-bounty-hunt]', host).forEach(button => button.addEventListener('click', () => huntBounty(button.dataset.bountyHunt)));
  $$('[data-bounty-cancel]', host).forEach(button => button.addEventListener('click', () => cancelBounty(button.dataset.bountyCancel)));
  $$('[data-deliver]', host).forEach(button => button.addEventListener('click', () => deliverDemand(button.dataset.deliver)));
  $$('[data-monarch-buy]', host).forEach(button => button.addEventListener('click', () => {
    const select = $(`[data-monarch-pick="${button.dataset.monarchBuy}"]`, host);
    if (select) buyMonarchItem(button.dataset.monarchBuy, select.value);
  }));
  $$('[data-armory-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeArmory(Number(button.dataset.armoryUpgrade))));
  $$('[data-producer-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeProducer(Number(button.dataset.producerUpgrade))));
  $$('[data-depot-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeDepot(Number(button.dataset.depotUpgrade))));
  $$('[data-hut-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeHut(Number(button.dataset.hutUpgrade))));
  $$('[data-profession]', host).forEach(select => select.addEventListener('change', () => setProfession(select.dataset.profession, select.value)));
  $$('[data-actor-sheet]', host).forEach(button => button.addEventListener('click', () => { menu.stack = []; showScreen('actor', { id: button.dataset.actorSheet }); }));
  $$('[data-demolish]', host).forEach(button => button.addEventListener('click', () => demolishBuilding(Number(button.dataset.demolish))));
}

// A aba Construir mostra as construções agrupadas por tipo, uma seção embaixo da outra.
const BUILD_CATEGORIES = [
  { id: 'houses', name: 'Casas', types: ['hut', 'depot'] },
  { id: 'production', name: 'Produção', types: ['farm', 'mill', 'lumber', 'quarry', 'mine', 'market'] },
  { id: 'guilds', name: 'Guildas', types: ['warrior', 'archer', 'lancer', 'conjurer', 'healer', 'armory', 'tavern', 'hotel'] },
];
const buildCardHTML = item => `<button class="build-card${state.selectedBuild === item.id ? ' selected' : ''}" data-build="${item.id}" aria-label="Construir ${item.id === 'farm' ? `Fazenda de ${farmType(state.selectedFarmType).name}` : item.name}, custa ${item.cost} moedas e ${item.wood} madeira">
        <span class="build-preview"><img src="${buildingImage(item.id === 'farm' ? farmType(state.selectedFarmType).art : BUILDING_ART[item.id])}" alt="">${item.id === 'mill' ? '<span class="mill-sails"></span>' : ''}</span><span class="build-copy"><b>${item.name}${item.id === 'farm' ? ` · ${farmType(state.selectedFarmType).name}` : ''}</b><small>${item.detail}</small></span><span class="build-cost">${costHTML(item.cost, item.wood)}</span></button>`;
const buildCategoryOf = id => BUILD_CATEGORIES.find(category => category.types.includes(id))?.id || (BUILDINGS.find(item => item.id === id)?.heroClass ? 'guilds' : 'houses');

let panelTabShown = null;
const panelScroll = {};
function renderPanel() {
  const host = $('#panel-view');
  // A lista nunca volta pro começo sozinha: cada aba lembra onde estava.
  if (panelTabShown) panelScroll[panelTabShown] = host.scrollTop;
  const keepScroll = panelScroll[state.tab] || 0;
  if (state.tab === 'build') {
    const selectedFarm = null;
    const farmChoice = state.selectedBuild === 'farm';
    const currentFarmType = state.selectedFarmType;
    host.innerHTML = `<div class="panel-title"><h3>Erga o domínio</h3><span>Escolha uma carta e toque no mapa</span></div>
      ${farmChoice ? `<section class="farm-selector" aria-label="Tipo de fazenda"><div class="farm-selector-heading"><b>${selectedFarm ? 'Produção desta fazenda' : 'Escolha a produção da fazenda'}</b><small>${selectedFarm ? 'Toque para trocar a produção' : 'Depois toque no mapa'}</small></div>
        <div class="farm-type-grid">${FARM_TYPES.map(type => `<button class="farm-type${currentFarmType === type.id ? ' selected' : ''}" data-farm-type="${type.id}" aria-pressed="${currentFarmType === type.id}"><img src="public/art/${type.art}-v01.webp" alt=""><span><b>${type.name}</b><small>+${rateNumber(type.grain[selectedFarm ? producerLevel(selectedFarm) : 0])} ${type.id === 'wheat' ? 'trigo' : 'provisões'}/s</small></span></button>`).join('')}</div></section>` : ''}
      ${BUILD_CATEGORIES.map(category => `<section class="build-section" aria-label="${category.name}"><h4 class="build-section-title">${category.name}</h4><div class="build-grid">${BUILDINGS.filter(item => buildCategoryOf(item.id) === category.id).map(buildCardHTML).join('')}</div></section>`).join('')}
      <p class="build-note">A moeda é o custo em ouro e a lenha é o custo em madeira.</p>`;
  } else if (state.tab === 'heroes') {
    host.innerHTML = `<div class="panel-title"><h3>Companhia autônoma</h3><span>${state.heroes.filter(h => h.alive).length}/${heroCapacity()} hóspedes</span></div>
      ${bountyPanelHTML()}
      <div class="hero-list">${state.heroes.filter(h => h.alive).map(heroCard).join('') || '<div class="empty-state">Nenhum herói. Ninguém foi corajoso, ou burro, o bastante.<br>Construa uma taverna ou guilda.</div>'}</div>
      <div class="panel-title worker-heading"><h3>Trabalhadores</h3><span>${state.workers.filter(worker => worker.alive).length} no domínio</span></div>
      <div class="hero-list">${state.workers.filter(worker => worker.alive).map(workerCard).join('') || '<div class="empty-state">Nenhum camponês. Até eles desistiram.<br>Construa um casebre.</div>'}</div>
      <p class="build-note">Você não manda nos heróis. Eles fazem o que querem.</p>`;
  } else if (state.tab === 'food') {
    host.innerHTML = foodPanelHTML();
  } else if (state.tab === 'economy') {
    host.innerHTML = economyPanelHTML();
  } else if (state.tab === 'market') {
    host.innerHTML = marketPanelHTML();
  }
  host.scrollTop = keepScroll;
  panelTabShown = state.tab;
  bindPanel(host);
  renderInspector();
}

// Inspetor da construção selecionada, no padrão dos jogos de construir cidade: quem é, vida, o que faz,
// as ações dela e, por último, pequeno no rodapé, mudar de lugar.
function buildingInfoHTML(building, actions = '') {
  const def = BUILDINGS.find(item => item.id === building.type);
  const alive = state.workers.filter(worker => worker.alive);
  const workersHere = alive.filter(worker => worker.buildSite == null && workplaceOf(worker)?.site === building.site);
  const names = list => list.length ? list.map(actor => actor.name).join(', ') : 'ninguém';
  const lines = [];
  const repairer = needsBuilder(building) && building.builderId != null ? findActor(building.builderId) : null;
  if (building.damage > 0) lines.push(['Conserto', repairer ? `${repairer.name} está consertando` : 'Esperando um camponês livre']);
  if (building.type === 'farm') {
    lines.push(['Produz', `${rateNumber(farmOutput(building))} de ${farmType(building.produce).name.toLowerCase()} por segundo${building.produce === 'wheat' ? ' (vai pro moinho)' : ''}`]);
    lines.push(['Nível', `${producerLevel(building) + 1} de ${PRODUCER_LEVELS.length}`]);
    lines.push(['Esperando carregador', `${format(building.stock || 0)} de ${FARM_STOCK_CAP}`]);
    if (crewWork(building)) lines.push(['Ferramentas', `+${Math.round(crewWork(building) * 100)}% de produção`]);
    lines.push(['Trabalhando', `${workersHere.length}: ${names(workersHere)}`]);
  } else if (building.type === 'mill') {
    lines.push(['Mói', `${rateNumber(millRate(building))} de trigo em farinha por segundo`]);
    lines.push(['Nível', `${producerLevel(building) + 1} de ${PRODUCER_LEVELS.length}`]);
    lines.push(['No moinho', `${format(building.input || 0)} de trigo · ${format(building.stock || 0)} de farinha esperando`]);
    lines.push(['No depósito', `${format(state.food.wheat || 0)} de trigo · ${format(state.food.flour || 0)} de farinha`]);
    lines.push(['Trabalhando', `${workersHere.length}: ${names(workersHere)}`]);
  } else if (building.type === 'hut') {
    const residents = alive.filter(worker => worker.homeSite === building.site);
    lines.push(['Moradores', `${residents.length} de ${building.big ? 5 : 2}: ${names(residents)}`]);
  } else if (building.type === 'depot') {
    lines.push(['Guarda', `${depotCap(building)} unidades`]);
    lines.push(['Ocupação total', `${Math.floor(storedUnits())} de ${storageCap()}`]);
  } else if (building.type === 'lumber') {
    const crew = lumberCrew(building);
    lines.push(['Produz', `${rateNumber(LUMBER_RATE[crew.length])} de madeira por segundo`]);
    lines.push(['Lenhadores', `${crew.length} de 3: ${names(crew)}`]);
  } else if (isPit(building)) {
    const crew = lumberCrew(building);
    lines.push(['Produz', `${fineRate(pitRate(building))} de ${PIT_GOODS[building.type].name} por segundo`]);
    if (crewWork(building)) lines.push(['Ferramentas', `+${Math.round(crewWork(building) * 100)}% de produção`]);
    lines.push(['No estoque', `${format(state.stone || 0)} de pedra · ${format(state.metal || 0)} de metal`]);
  } else if (building.type === 'market') {
    lines.push(['Faz', 'Compra e vende comida e madeira a preço fixo']);
  } else if (building.type === 'tavern') {
    const drinkers = [...state.heroes, ...state.workers].filter(actor => actor.alive && isDrinking(actor));
    lines.push(['Bebendo agora', `${drinkers.length}: ${names(drinkers)}`]);
    lines.push(['Imposto de hoje', `${format((state.tavernTab || 0) * taxFactor())} de ouro, pago à meia-noite`]);
  } else if (building.type === 'hotel') {
    lines.push(['Faz', '+4 camas para heróis']);
    lines.push(['Heróis no domínio', `${state.heroes.filter(hero => hero.alive).length} de ${heroCapacity()}`]);
  } else if (building.type === 'armory') {
    const geared = [...state.heroes, ...state.workers].filter(actor => actor.alive && Object.keys(gearOf(actor)).length).length;
    lines.push(['Vende', `Equipamento até o tier ${ARMORY_LEVELS[Math.min(building.level || 0, ARMORY_LEVELS.length - 1)].tierCap}`]);
    lines.push(['Equipados', `${geared} personagens`]);
  } else if (def.heroClass) {
    const recruits = state.heroes.filter(hero => hero.alive && hero.guildSite === building.site);
    lines.push(['Recruta', building.branch || def.heroClass]);
    lines.push(['Heróis daqui', `${recruits.length}: ${names(recruits)}`]);
  }
  const moving = state.movingSite === building.site;
  const hp = buildingHp(building), maxHp = buildingMaxHp(building);
  const level = ['farm', 'mill'].includes(building.type) ? `Nível ${producerLevel(building) + 1} de ${PRODUCER_LEVELS.length}`
    : building.type === 'armory' ? `Nível ${(building.level || 0) + 1} de ${ARMORY_LEVELS.length}`
    : building.type === 'depot' ? `Nível ${(building.level || 0) + 1} de ${STORAGE_LEVELS.length}`
    : def.heroClass ? `Nível ${guildTier(building) + 1} de 3` : building.type === 'hut' ? (building.big ? 'Grande' : 'Pequeno') : '';
  const stats = building.ruined ? [['Estado', 'Em ruínas, parada'], ...lines] : lines.filter(([label]) => label !== 'Nível');
  return `<section class="inspector" aria-label="${siteLabel(building)}">
    <button type="button" class="inspector-back" data-inspector-close aria-label="Fechar" title="Fechar">×</button>
    <header class="inspector-id">
      <img class="inspector-thumb" src="${buildingImage(siteArt(building))}" alt="">
      <div><h3>${siteLabel(building)}</h3><small>${[def.name === siteLabel(building) ? '' : def.name, level].filter(Boolean).join(' · ')}</small></div>
    </header>
    <div class="inspector-hp${building.ruined ? ' ruined' : building.damage > 0 ? ' hurt' : ''}" title="Vida da construção"><span>Vida</span><i style="--hp:${Math.round(hp / maxHp * 100)}%"></i><b>${hp} / ${maxHp}</b></div>
    <dl class="inspector-stats">${stats.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
    ${building.ruined ? '' : actions}
    ${building.type === 'market' && !building.ruined ? '<section class="inspector-section"><button type="button" class="hut-upgrade" data-open-market>Abrir o Mercado</button></section>' : ''}
    <footer class="inspector-foot">${moving ? '<span>Toque no novo lugar no mapa. Esc cancela.</span>' : ''}<button type="button" class="move-site-btn" data-move-site="${building.site}">${moving ? 'Cancelar mudança' : 'Mudar de lugar'}</button>${moving ? '' : `<button type="button" class="demolish-btn${state.demolishArmed === building.site ? ' armed' : ''}" data-demolish="${building.site}">${state.demolishArmed === building.site ? 'Confirmar demolição' : 'Demolir'}</button>`}</footer>
  </section>`;
}

// Demolir: primeiro clique arma, segundo confirma. Não devolve ouro nem madeira.
// Quem morava, trabalhava ou se hospedava ali fica sem o lugar e volta para o casarão.
function demolishBuilding(site) {
  const building = state.buildings.find(item => item.site === site);
  if (!building) return;
  if (state.demolishArmed !== site) {
    state.demolishArmed = site;
    renderPanel();
    say(`${siteLabel(building)}: clique de novo em Confirmar demolição. Não tem volta nem reembolso.`);
    return;
  }
  state.demolishArmed = null;
  state.buildings = state.buildings.filter(item => item !== building);
  [...state.heroes, ...state.workers].forEach(actor => {
    let touched = false;
    if (actor.homeSite === site) { actor.homeSite = null; touched = true; }
    if (actor.guildSite === site) { actor.guildSite = null; touched = true; }
    if (actor.jobSite === site) { actor.jobSite = null; touched = true; }
    if (actor.buildSite === site) { actor.buildSite = null; touched = true; }
    if (actor.recruitedFromSite === site) actor.recruitedFromSite = null;
    if (actor.workplace === building || actor.workplace?.site === site) { actor.workplace = null; touched = true; }
    if (actor.tavernSpot?.site === site) { actor.tavernSpot = null; touched = true; }
    if (touched) { actor.route = []; actor.finalPoint = null; actor.wait = 0; actor.workTrip = false; }
  });
  (state.bandits || []).forEach(monster => { if (monster.targetSite === site) monster.targetSite = null; });
  if (state.selectedSite === site) state.selectedSite = null;
  if (state.movingSite === site) state.movingSite = null;
  assignBuilders();
  renderSites(); renderPanel(); renderHeroes(); updateHud();
  say(`${siteLabel(building)}: demolido. Os vizinhos levaram as tábuas antes da poeira baixar.`);
}

// Mudar de lugar: a construção pronta vai inteira para outro ponto livre, sem custo.
function startMove(site) {
  const building = state.buildings.find(item => item.site === site && isDone(item));
  if (!building) return;
  state.selectedBuild = null;
  state.movingSite = site;
  state.selectedSite = site;
  renderSites(); renderPanel();
  say(`${siteLabel(building)}: toque no novo lugar. Esc cancela.`);
}
function cancelMove() {
  if (state.movingSite == null) return;
  state.movingSite = null;
  renderSites(); renderPanel();
  say('Mudança cancelada. Ninguém queria carregar nada mesmo.');
}
function moveBuilding(x, y) {
  const building = state.buildings.find(item => item.site === state.movingSite);
  if (!building) { state.movingSite = null; return; }
  const problem = placementProblem(x, y, building.site);
  if (problem) { say(problem); return; }
  building.x = Math.round(x * 10) / 10;
  building.y = Math.round(y * 10) / 10;
  state.movingSite = null;
  [...state.heroes, ...state.workers].forEach(actor => { if (actor.tavernSpot?.site === building.site) actor.tavernSpot = null; actor.route = []; });
  renderSites(); renderPanel();
  say(`${siteLabel(building)} mudou de lugar. Os camponeses vão reclamar do caminho novo.`);
}

function chooseBuild(id) {
  state.placingBounty = false;
  const item = BUILDINGS.find(building => building.id === id);
  if (id !== 'farm' && (state.gold < item.cost || state.timber < item.wood)) {
    say('Falta ouro ou madeira. As dívidas, não.');
    return;
  }
  if (state.selectedBuild === id) { cancelPlacement(); return; }
  state.movingSite = null;
  state.selectedBuild = id;
  state.selectedSite = null;
  renderSites(); renderPanel();
  say(id === 'farm' ? 'Escolha alho, trigo, bacon, ovos ou leite e toque onde quiser no mapa. Esc cancela.' : `${item.name}: toque onde quiser no mapa. Esc cancela.`, `${item.name} procura um terreno. E alguém pra pagar.`);
}

function cancelPlacement() {
  if (!state.selectedBuild) return;
  state.selectedBuild = null;
  renderSites(); renderPanel();
  say('Obra cancelada. Os pedreiros nem notaram.');
}

function chooseFarmType(id) {
  const type = farmType(id);
  if (state.selectedBuild === 'farm') {
    state.selectedFarmType = type.id;
    renderPanel();
    say(`Fazenda de ${type.name}. Toque onde quiser no mapa.`);
    return;
  }
  const farm = state.buildings.find(building => building.site === state.selectedSite && building.type === 'farm' && isDone(building));
  if (!farm) return;
  if (farm.produce !== type.id) farm.stock = 0;
  farm.produce = type.id;
  state.selectedFarmType = type.id;
  renderSites(); renderPanel(); updateHud();
  say(`Fazenda agora produz ${type.name.toLowerCase()}.`, `A fazenda mudou sua produção para ${type.name.toLowerCase()}.`);
}

// Obras e melhorias: um camponês trabalha no local durante dois minutos de jogo.
// A habilidade de construção e as ferramentas dele aceleram (veja progressConstruction).
const BUILD_TIME = 120;
const buildingName = building => building.type === 'farm' ? `Fazenda de ${farmType(building.produce).name}` : BUILDINGS.find(item => item.id === building.type)?.name || 'Construção';

function placeBuilding(x, y) {
  const item = BUILDINGS.find(building => building.id === state.selectedBuild);
  if (!item) return;
  const problem = placementProblem(x, y);
  if (problem) { say(problem); return; }
  if (state.gold < item.cost || state.timber < item.wood) {
    say('A obra parou: falta ouro ou madeira. Os pedreiros foram beber.');
    return;
  }
  state.gold -= item.cost;
  state.timber -= item.wood;
  const site = state.nextBuildingId++;
  const building = { site, mapSet: currentMapSet, type: item.id, produce: item.id === 'farm' ? state.selectedFarmType : null, branch: null, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, builtAt: Date.now(), underConstruction: true, progress: 0, builderId: null };
  state.buildings.push(building);
  state.selectedBuild = null;
  state.selectedSite = site;
  assignBuilders();
  renderSites(); renderPanel(); updateHud();
  const builder = building.builderId != null ? findActor(building.builderId) : null;
  say(builder ? `Obra de ${buildingName(building)} iniciada. ${builder.name} vai trabalhar nela por dois minutos.` : `Obra de ${buildingName(building)} marcada. Falta um camponês livre pra trabalhar nela.`);
}

function busyBuilders() {
  return new Set(state.buildings.filter(building => needsBuilder(building) && building.builderId != null).map(building => String(building.builderId)));
}

// Cada obra sem camponês recebe o primeiro camponês livre.
function assignBuilders() {
  state.buildings.filter(needsBuilder).sort((a, b) => Number(!!b.underConstruction) - Number(!!a.underConstruction)).forEach(building => {
    const current = building.builderId != null ? findActor(building.builderId) : null;
    if (current && current.alive) return;
    const busy = busyBuilders();
    const rank = candidate => candidate.profession === 'builder' ? 0 : !candidate.profession ? 1 : 2;
    const worker = state.workers.filter(candidate => candidate.alive && !busy.has(String(candidate.id))).sort((a, b) => rank(a) - rank(b))[0];
    building.builderId = worker ? worker.id : null;
    if (worker) { worker.buildSite = building.site; worker.route = []; worker.finalPoint = null; worker.wait = 0; }
  });
}

// O camponês trabalha ao lado da obra, na base. O rótulo de progresso fica no alto da obra, longe dele.
const buildSpot = building => ({ x: building.x + (building.x > 92 ? -5 : 5), y: building.y });

// Uma vez por segundo de jogo: a obra avança só com o camponês no local.
function progressConstruction(dt) {
  assignBuilders();
  state.buildings.filter(needsBuilder).forEach(building => {
    const worker = building.builderId != null ? findActor(building.builderId) : null;
    const spot = buildSpot(building);
    if (!building.underConstruction) {
      if (worker && Math.hypot(worker.x - spot.x, worker.y - spot.y) < 1.5) {
        building.damage = Math.max(0, building.damage - REPAIR_RATE * dt * (1 + skillOf(worker, 'building') / 100 + gearBonus(worker, 'build')));
        gainSkill(worker, 'building', 0.02 * dt);
        if (building.damage <= 0) {
          building.damage = 0;
          building.ruined = false;
          building.builderId = null;
          worker.buildSite = null; worker.route = []; worker.finalPoint = null; worker.wait = 0;
          renderSites();
          say(`${siteLabel(building)} consertada por ${worker.name}. Até o próximo monstro.`);
          return;
        }
      }
      const label = $(`.site[data-site="${building.site}"] small`);
      if (label) label.textContent = `${siteLabel(building)} · ${building.ruined ? 'em ruínas' : 'consertando'} ${buildingHp(building)}/${buildingMaxHp(building)}`;
      return;
    }
    if (worker && Math.hypot(worker.x - spot.x, worker.y - spot.y) < 1.5) {
      const previousProgress = building.progress || 0;
      building.progress = Math.min(BUILD_TIME, previousProgress + dt * (1 + skillOf(worker, 'building') / 100 + gearBonus(worker, 'build')));
      gainSkill(worker, 'building', 0.02 * dt);
      if (building.progress >= BUILD_TIME) { completeBuilding(building); return; }
      if (previousProgress < BUILD_TIME / 2 && building.progress >= BUILD_TIME / 2) renderSites();
    }
    const label = $(`.site[data-site="${building.site}"] .build-progress`);
    if (label) label.textContent = constructionLabel(building);
  });
}

function constructionLabel(building) {
  const worker = building.builderId != null ? findActor(building.builderId) : null;
  const work = building.armoryUpgradeTo ? `Reforma do Arsenal · nível ${building.armoryUpgradeTo} · ` : building.upgradeLabel ? `${building.upgradeLabel} · ` : 'Em obra · ';
  return `${work}${Math.floor((building.progress || 0) / BUILD_TIME * 100)}%${worker ? '' : ' · sem camponês'}`;
}

function completeBuilding(building) {
  const item = BUILDINGS.find(entry => entry.id === building.type);
  const worker = building.builderId != null ? findActor(building.builderId) : null;
  if (building.pendingUpgrade) {
    const upgrade = building.pendingUpgrade;
    delete building.pendingUpgrade;
    delete building.upgradeLabel;
    building.underConstruction = false;
    building.progress = BUILD_TIME;
    building.builderId = null;
    if (worker) { worker.buildSite = null; worker.route = []; worker.finalPoint = null; worker.wait = 0; }
    finishUpgrade(building, upgrade);
    assignBuilders();
    renderSites(); renderPanel(); renderHeroes(); updateHud();
    return;
  }
  if (building.type === 'armory' && building.armoryUpgradeTo) {
    const level = building.armoryUpgradeTo;
    building.level = level - 1;
    delete building.armoryUpgradeTo;
    building.underConstruction = false;
    building.progress = BUILD_TIME;
    building.builtAt = Date.now();
    building.builderId = null;
    if (worker) { worker.buildSite = null; worker.route = []; worker.finalPoint = null; worker.wait = 0; }
    gainHeirXp(25);
    assignBuilders();
    renderSites(); renderPanel(); updateHud();
    setTimeout(() => $(`.site[data-site="${building.site}"]`)?.classList.remove('just-built'), 1400);
    say(`Reforma concluída. Arsenal no nível ${level}, equipamento até tier ${ARMORY_LEVELS[level - 1].tierCap}.`);
    return;
  }
  building.underConstruction = false;
  building.progress = BUILD_TIME;
  building.builtAt = Date.now();
  building.builderId = null;
  if (worker) { worker.buildSite = null; worker.route = []; worker.finalPoint = null; worker.wait = 0; }
  gainHeirXp(25);
  const arrived = item.heroClass ? recruit(item.heroClass, building, null, true) : null;
  if (item.housing) for (let i = 0; i < item.housing; i++) hireWorker(building, i % 2 === 1);
  // Fazenda ou moinho novo: todo mundo é redistribuído para ninguém ficar vazio.
  if (['farm', 'mill'].includes(item.id)) state.workers.forEach(worker => { worker.jobSite = null; });
  assignBuilders();
  renderSites(); renderPanel(); updateHud();
  setTimeout(() => $(`.site[data-site="${building.site}"]`)?.classList.remove('just-built'), 1400);
  const name = buildingName(building);
  const credit = worker ? ` ${worker.name} terminou a obra.` : '';
  say(arrived ? `${item.name} abriu as portas.${credit} ${arrived.name} já está reclamando da cama.` : item.housing ? `Casebre Pequeno erguido.${credit} Chegaram dois camponeses. Eles não tinham pra onde ir mesmo.` : `${name} erguida.${credit} Ninguém morreu na obra. Ainda.`);
}

function recruit(className, origin, prestige = null, guildResident = false) {
  if (!origin) return null;
  const lodging = guildResident ? null : freeLodging();
  if (guildResident && state.heroes.some(hero => hero.alive && hero.guildSite === origin.site)) {
    say('Esta guilda já tem seu único morador.');
    return null;
  }
  if (!guildResident && !lodging) {
    say('Sem cama na taverna ou no hotel. O herói foi embora ofendido.');
    return null;
  }
  const hero = { id: Date.now() + Math.random(), name: heroName(), className, prestige, trait: pick(Object.keys(TRAITS)), level: 1, xp: 0, x: origin.x, y: origin.y, alive: true, guildSite: guildResident ? origin.site : null, recruitedFromSite: origin.site ?? null, homeSite: lodging?.site ?? null, purse: HERO_START_PURSE, gear: STARTER_WEAPON[className] ? { weapon: STARTER_WEAPON[className] } : {} };
  state.heroes.push(hero);
  gainHeirXp(10);
  renderHeroes();
  updateHud();
  return hero;
}

// Cada fazenda ou moinho traz um camponês, que sai da construção e trabalha nela.
const HUT_UPGRADE = { gold: 90, wood: 6 };
// Melhoria vira obra: o ouro e a madeira saem na hora, e o efeito só vale quando o camponês termina.
function startUpgrade(building, upgrade, label) {
  building.pendingUpgrade = upgrade;
  building.upgradeLabel = label;
  building.underConstruction = true;
  building.progress = 0;
  building.builderId = null;
  assignBuilders();
  renderSites(); renderPanel(); updateHud();
  const worker = building.builderId != null ? findActor(building.builderId) : null;
  say(worker ? `${label}: obra iniciada. ${worker.name} vai trabalhar nela por dois minutos.` : `${label}: obra iniciada. Falta um camponês livre para trabalhar nela.`);
}
function finishUpgrade(building, upgrade) {
  gainHeirXp(25);
  if (upgrade.kind === 'hut') {
    building.big = true;
    for (let i = 0; i < 3; i++) hireWorker(building, Math.random() < 0.5);
    say('Casebre Grande pronto. Chegaram mais três. Cabem cinco, se ninguém respirar fundo.');
  } else if (upgrade.kind === 'depot') {
    building.level = (building.level || 0) + 1;
    say(`Depósito de Provisões ampliado para ${depotCap(building)} unidades. Os ratos agradecem o espaço extra.`);
  } else if (upgrade.kind === 'producer') {
    building.level = producerLevel(building) + 1;
    say(building.type === 'mill' ? `Moinho no nível ${building.level + 1}: mói ${rateNumber(millRate(building))} de trigo por segundo.` : `${buildingName(building)} no nível ${building.level + 1}: ${rateNumber(farmOutput(building))} por segundo. A terra não pediu, mas aceitou.`);
  } else if (upgrade.kind === 'guild') {
    const def = BUILDINGS.find(item => item.id === building.type);
    if (upgrade.tier === 0) {
      building.tier = 1;
      const hero = recruit(def.heroClass, building, null, false);
      say(hero ? `${def.name} chegou ao nível 2. ${hero.name} ficou alojado fora da guilda.` : `${def.name} chegou ao nível 2, mas falta alojamento para o herói novo.`);
    } else {
      building.tier = 2;
      building.branch = upgrade.branch;
      const hero = recruit(def.heroClass, building, upgrade.branch);
      say(hero ? `${def.name} chegou ao nível 3 e forma ${upgrade.branch}. ${hero.name} ficou alojado fora da guilda.` : `${def.name} chegou ao nível 3, mas falta alojamento para o herói novo.`);
    }
  }
}

function upgradeHut(site) {
  const hut = state.buildings.find(building => building.site === site && building.type === 'hut');
  if (!hut || hut.big || hut.underConstruction) return;
  if (state.gold < HUT_UPGRADE.gold || state.timber < HUT_UPGRADE.wood) { say('Falta ouro ou madeira. Os camponeses vão continuar apertados.'); return; }
  state.gold -= HUT_UPGRADE.gold;
  state.timber -= HUT_UPGRADE.wood;
  startUpgrade(hut, { kind: 'hut' }, 'Ampliação para Casebre Grande');
}

function hireWorker(home, female) {
  const n = state.workers.length + 1;
  state.workers.push({
    id: `worker-${Date.now()}-${n}`,
    name: peasantName(female),
    level: 1, xp: 0,
    className: 'Peasant',
    spriteId: female ? 'female-peasant' : 'peasant',
    portraitId: female ? 'female-peasant' : 'male-peasant',
    x: home.x, y: home.y, alive: true, workTrip: false, homeSite: home.site, purse: WORKER_START_PURSE,
  });
  renderHeroes();
  updateHud();
  if (state.tab === 'heroes') renderPanel();
}

// Nível 1 traz um morador da guilda; níveis 2 e 3 trazem heróis extras, alojados em taverna/hotel.
const GUILD_UPGRADES = [{ gold: 120, wood: 8 }, { gold: 180, wood: 12 }];
const guildTier = guild => guild.tier ?? (guild.branch ? 2 : 0);
function upgradeGuild(site, branch) {
  const guild = state.buildings.find(building => building.site === site);
  const def = guild && BUILDINGS.find(item => item.id === guild.type);
  if (!def?.heroClass || guild.underConstruction) return;
  const tier = guildTier(guild);
  const cost = GUILD_UPGRADES[tier];
  if (!cost) return;
  if (tier === 1 && !PRESTIGE[def.heroClass]?.includes(branch)) return;
  if (!freeLodging()) { say('A guilda mantém um único herói. Construa uma taverna ou hotel para alojar os próximos níveis.'); return; }
  if (state.gold < cost.gold || state.timber < cost.wood) { say('Falta ouro ou madeira. Os heróis vão continuar dividindo beliche.'); return; }
  state.gold -= cost.gold;
  state.timber -= cost.wood;
  startUpgrade(guild, { kind: 'guild', tier, branch }, `${def.name} para o nível ${tier + 2}`);
}

function guildBoxHTML(guild) {
  const def = BUILDINGS.find(item => item.id === guild.type);
  const tier = guildTier(guild);
  const branchNames = { Bishop: 'Templo Bishop', Cleric: 'Treino Cleric', Elementalist: 'Torre dos Elementalistas', Warlock: 'Torre dos Arcanistas' };
  const name = guild.branch ? (branchNames[guild.branch] || `Guilda ${guild.branch}`) : def.name;
  const members = state.heroes.filter(hero => hero.alive && hero.guildSite === guild.site).length;
  const cost = GUILD_UPGRADES[tier];
  let actions = '';
  if (tier === 0) actions = `<button type="button" class="hut-upgrade" data-guild-upgrade="${guild.site}" ${freeLodging() ? '' : 'disabled'}>Nível 2 · ${costHTML(cost.gold, cost.wood)} · +1 ${def.heroClass} (precisa de cama)</button>`;
  else if (tier === 1) actions = `<p class="storage-items">Nível 3: escolha a especialização (${costHTML(cost.gold, cost.wood)}). Chega um herói especializado; os anteriores ficam como são.</p>
      <div class="guild-branches">${PRESTIGE[def.heroClass].map(path => `<button type="button" class="hut-upgrade" data-guild-upgrade="${guild.site}" data-branch="${path}" ${freeLodging() ? '' : 'disabled'}>${path} · +1 ${path}</button>`).join('')}</div>`;
  else actions = `<p class="storage-items">Especializada em ${guild.branch}. Guilda no nível máximo.</p>`;
  return `<section class="inspector-section"><h4>Melhoria · ${members}/1 morador na guilda</h4>${actions}</section>`;
}

function assignPrestige(hero) {
  if (!hero || hero.prestige) return;
  const guildType = GUILD_FOR[hero.className];
  const available = state.buildings.filter(b => b.type === guildType && b.branch && isDone(b));
  if (!available.length) return;
  const nearest = available.sort((a, b) => {
    const da = Math.hypot(a.x - hero.x, a.y - hero.y);
    const db = Math.hypot(b.x - hero.x, b.y - hero.y);
    return da - db;
  })[0];
  hero.prestige = nearest.branch;
  say((PROMO_MSG[hero.prestige] || (n => `${n} virou ${hero.prestige}.`))(hero.name));
}

function nearestNode(actor) {
  return PATH_NODES.reduce((best, node, index) =>
    Math.hypot(node.x - actor.x, node.y - actor.y) < Math.hypot(PATH_NODES[best].x - actor.x, PATH_NODES[best].y - actor.y) ? index : best, 0);
}

function shortestPath(start, finish) {
  const queue = [start];
  const previous = new Map([[start, null]]);
  for (let head = 0; head < queue.length && !previous.has(finish); head++) {
    PATH_NODES[queue[head]].links.forEach(next => {
      if (!previous.has(next)) { previous.set(next, queue[head]); queue.push(next); }
    });
  }
  if (!previous.has(finish)) return [];
  const path = [];
  for (let node = finish; node !== null; node = previous.get(node)) path.unshift(node);
  return path;
}

function routeActor(actor, finish) {
  const path = shortestPath(nearestNode(actor), finish);
  if (path.length && Math.hypot(PATH_NODES[path[0]].x - actor.x, PATH_NODES[path[0]].y - actor.y) < 0.5) path.shift();
  actor.route = path;
  actor.goal = finish;
}

function homeOf(actor) {
  return actor && actor.homeSite != null ? state.buildings.find(building => building.site === actor.homeSite) || null : null;
}

function workplaceOf(actor) {
  if (actor?.workplace) return actor.workplace;
  // Lenhador entra sozinho numa Cabana do Lenhador com vaga.
  if (actor?.profession === 'woodcutter') {
    const camp = state.buildings.find(building => building.type === 'lumber' && isDone(building) && lumberCrew(building).length < 3);
    if (camp) { actor.workplace = camp; actor.jobSite = null; return camp; }
  }
  if (actor?.profession === 'miner') {
    const pit = state.buildings.find(building => isPit(building) && isDone(building) && lumberCrew(building).length < PIT_CREW_MAX);
    if (pit) { actor.workplace = pit; actor.jobSite = null; return pit; }
  }
  const all = state.buildings.filter(building => ['farm', 'mill'].includes(building.type) && isDone(building));
  if (!all.length) return null;
  // Com profissão, só os lugares dela; se não houver nenhum, faz o que estiver disponível.
  const own = all.filter(building => PROFESSIONS[actor?.profession]?.types.includes(building.type));
  const places = own.length ? own : all;
  // Cada camponês fica fixo num lugar; quem não tem vai para o que tem menos gente (empate: o mais perto de casa).
  const current = actor && places.find(place => place.site === actor.jobSite);
  if (current) return current;
  const from = homeOf(actor) || actor || { x: 42, y: 39 };
  const crew = site => state.workers.filter(worker => worker.alive && worker !== actor && !worker.workplace && worker.jobSite === site).length;
  const dist = place => Math.hypot(place.x - from.x, place.y - from.y);
  const best = places.reduce((best, place) => crew(place.site) < crew(best.site) || (crew(place.site) === crew(best.site) && dist(place) < dist(best)) ? place : best);
  if (actor) actor.jobSite = best.site;
  return best;
}

function workerDestination(actor) {
  const workplace = workplaceOf(actor);
  if (!workplace) return 5;
  return nearestNode(workplace);
}

// Cada personagem anda na própria faixa da trilha: um desvio fixo, tirado do id, para ninguém andar em cima do outro.
function laneOffset(actor) {
  if (!actor.lane) {
    let hash = 0;
    for (const ch of String(actor.id)) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    hash >>>= 0;
    const angle = (hash % 360) * Math.PI / 180, radius = 0.7 + (Math.floor(hash / 360) % 100) / 100 * 1.3;
    actor.lane = { x: Math.round(Math.cos(angle) * radius * 100) / 100, y: Math.round(Math.sin(angle) * radius * 100) / 100 };
  }
  return actor.lane;
}

// Camponês sem trabalho passeia pela vila: escolhe um ponto da trilha que nenhum outro ocioso escolheu
// e para um pouco fora dela. Ficam longe do covil e da estrada velha.
const IDLE_NODES = [1, 2, 3, 4, 5, 6, 10, 12];
function idleSpot(actor) {
  const taken = state.workers.filter(other => other !== actor && other.alive && other.idleNode != null).map(other => other.idleNode);
  const free = IDLE_NODES.filter(node => !taken.includes(node) && node !== actor.idleNode);
  const node = pick(free.length ? free : IDLE_NODES.filter(node => node !== actor.idleNode));
  const base = PATH_NODES[node], angle = Math.random() * Math.PI * 2, radius = 2 + Math.random() * 3;
  actor.idleNode = node;
  return { node, point: { x: Math.max(2, Math.min(98, base.x + Math.cos(angle) * radius)), y: Math.min(198, base.y + Math.sin(angle) * radius) } };
}

function nextActorGoal(actor) {
  if (actor.className === 'Peasant') {
    if (actor.buildSite != null) {
      const site = state.buildings.find(building => building.site === actor.buildSite && needsBuilder(building));
      if (site) {
        const spot = buildSpot(site);
        actor.headingToWork = false;
        actor.task = `${site.underConstruction ? 'Construindo' : 'Consertando'} ${buildingName(site)}`;
        if (Math.hypot(actor.x - spot.x, actor.y - spot.y) < 1.2) { actor.wait = 1.5; actor.actionTime = 1.5; actor.actionClock = 0; return; }
        routeActor(actor, nearestNode(spot));
        actor.finalPoint = spot;
        return;
      }
      actor.buildSite = null;
    }
    const tavern = openTavern();
    const minuteOfDay = state.minutes % 1440;
    if (tavern && minuteOfDay >= 1080 && minuteOfDay < 1320) {
      actor.drinkUntil = state.minutes - minuteOfDay + 1320;
      actor.headingToWork = false;
      actor.task = 'Bebendo na taverna';
      goDrink(actor, tavern);
      return;
    }
    const job = workplaceOf(actor);
    if (job && ['farm', 'mill'].includes(job.type) && isDone(job)) { haulRoutine(actor, job); return; }
    const home = homeOf(actor);
    const workplace = actor.workTrip ? null : workplaceOf(actor);
    if (!workplace && !job && !actor.workTrip) {
      const spot = idleSpot(actor);
      actor.task = 'À toa, sem fazenda pra trabalhar';
      routeActor(actor, spot.node);
      actor.finalPoint = spot.point;
      actor.headingToWork = false;
      actor.workTrip = true;
      return;
    }
    if (workplace || job) actor.idleNode = null;
    actor.task = workplace ? (workplace.type === 'lumber' ? 'Cortando lenha na Cabana do Lenhador' : isPit(workplace) ? `Tirando ${PIT_GOODS[workplace.type].name} ${workPlaceName(workplace)}` : `Indo trabalhar ${workPlaceName(workplace)}`) : home ? 'Voltando pra casa' : job ? 'Voltando pro casarão' : 'À toa, sem fazenda pra trabalhar';
    const target = actor.workTrip ? home : workplace;
    routeActor(actor, actor.workTrip ? (home ? nearestNode(home) : 0) : workerDestination(actor));
    // Da trilha até a porta da construção, em linha reta.
    actor.finalPoint = target ? { x: target.x, y: Math.min(198, target.y + 1.2) } : null;
    actor.headingToWork = !!workplace;
    actor.workTrip = !actor.workTrip;
    return;
  }
  const current = actor.bountyId ? (state.bounties || []).find(bounty => bounty.id === actor.bountyId && String(bounty.takenBy) === String(actor.id)) : null;
  if (current) { bountyStep(actor, current); return; }
  actor.bountyId = null;
  const tavern = openTavern();
  if (tavern && actor.drinkUntil > state.minutes) { goDrink(actor, tavern); return; }
  if (tavern && Math.random() < (actor.trait === 'Bêbado' ? 0.6 : 0.2)) {
    actor.drinkUntil = state.minutes + 60 + Math.floor(Math.random() * 120);
    goDrink(actor, tavern);
    return;
  }
  const offer = considerBounties(actor);
  if (offer) { bountyStep(actor, offer); return; }
  const patrol = PATROLS[actor.className] || PATROLS.other;
  let destination = patrol[(actor.patrolIndex || 0) % patrol.length];
  actor.patrolIndex = (actor.patrolIndex || 0) + 1;
  if (destination === nearestNode(actor)) {
    destination = patrol[actor.patrolIndex % patrol.length];
    actor.patrolIndex++;
  }
  routeActor(actor, destination);
}

let lastActorFrame = 0;
function animateActors(now) {
  const delta = Math.min(0.05, lastActorFrame ? (now - lastActorFrame) / 1000 : 0) * state.speed;
  lastActorFrame = now;
  if (!game.running) { requestAnimationFrame(animateActors); return; }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  [...state.heroes, ...state.workers].filter(actor => actor.alive).forEach(actor => {
    if (actor.className !== 'Peasant' && window.Monarch?.chargeStep(actor, delta, reducedMotion)) return;
    if (actor.className === 'Peasant' ? peasantDefenseStep(actor, delta, reducedMotion) : heroCombatStep(actor, delta, reducedMotion)) return;
    const construction = actor.className === 'Peasant' && actor.buildSite != null
      ? state.buildings.find(building => building.site === actor.buildSite && needsBuilder(building))
      : null;
    if (construction) {
      const spot = buildSpot(construction);
      if (Math.hypot(actor.x - spot.x, actor.y - spot.y) < 1.5) {
        actor.actionClock = (actor.action === 'build' ? actor.actionClock || 0 : 0) + delta;
        actor.action = 'build';
        actor.frame = reducedMotion ? 0 : Math.floor(actor.actionClock * 5) % 4;
        return;
      }
    }
    if (actor.wait > 0) {
      actor.wait = Math.max(0, actor.wait - delta);
      actor.action = actor.actionTime > 0 ? 'action' : 'walk';
      if (actor.actionTime > 0) actor.actionTime = Math.max(0, actor.actionTime - delta);
      actor.actionClock = (actor.actionClock || 0) + delta;
      actor.frame = actor.action === 'action' && !reducedMotion ? Math.floor(actor.actionClock * 5) % 4 : 0;
      return;
    }
    if (!actor.route) actor.route = [];
    if (!actor.route.length && !actor.finalPoint) nextActorGoal(actor);
    let remaining = (actor.className === 'Peasant' ? 3.1 : 4.2) * (1 + gearBonus(actor, 'speed')) * delta * (window.Monarch?.moveMul(actor) ?? 1);
    let moved = false;
    while (remaining > 0 && (actor.route.length || actor.finalPoint)) {
      const onTrail = actor.route.length > 0;
      const lane = onTrail ? laneOffset(actor) : null;
      const node = onTrail ? { x: PATH_NODES[actor.route[0]].x + lane.x, y: Math.min(198, PATH_NODES[actor.route[0]].y + lane.y) } : actor.finalPoint;
      const dx = node.x - actor.x, dy = node.y - actor.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.001) { if (onTrail) actor.route.shift(); else actor.finalPoint = null; continue; }
      actor.facing = dy < -0.2 ? 'back' : dy > 0.2 ? 'front' : (actor.facing || 'front');
      if (Math.abs(dx) > 0.2) actor.side = dx < 0 ? 'left' : 'right';
      const step = Math.min(distance, remaining);
      actor.x += dx / distance * step;
      actor.y += dy / distance * step;
      remaining -= step;
      moved = true;
      if (step >= distance - 0.001) {
        actor.x = node.x; actor.y = node.y;
        if (onTrail) actor.route.shift(); else actor.finalPoint = null;
        if (!actor.route.length && !actor.finalPoint) {
          // Quem trabalha tem ritmo fixo; quem só anda para um tempo diferente a cada vez, para ninguém andar em fila sincronizada.
          actor.wait = actor.className === 'Peasant' ? (actor.headingToWork ? 2.3 : 1.8 + Math.random() * 3) : 1.2;
          if (actor.className === 'Peasant' && actor.headingToWork && workplaceOf(actor)?.type === 'lumber') gainSkill(actor, 'woodcutting', 0.3);
          if (actor.className === 'Peasant' && actor.headingToWork && isPit(workplaceOf(actor))) gainSkill(actor, 'mining', 0.3);
          if (actor.className === 'Peasant' && actor.headingToWork) { actor.actionTime = actor.wait; actor.actionClock = 0; gainActorXp(actor, 13); actor.headingToWork = false; }
          actor.goal = null;
        }
      }
    }
    actor.action = 'walk';
    actor.walkClock = (actor.walkClock || 0) + (moved ? delta : 0);
    actor.frame = moved && !reducedMotion ? Math.floor(actor.walkClock * 7) % 4 : 0;
  });
  (state.bandits || []).filter(bandit => bandit.alive).forEach(bandit => {
    // Atordoado, derrubado, empurrado ou convertido pelo Monarca: quem decide o passo é ele.
    if (window.Monarch?.enemyStep(bandit, delta, reducedMotion)) return;
    (bandit.className === 'Monster' ? monsterStep : banditStep)(bandit, delta, reducedMotion);
  });
  window.Monarch?.step(delta, reducedMotion);
  renderHeroes();
  requestAnimationFrame(animateActors);
}

function tick() {
  if (!game.running) return;
  state.ticks++;
  state.playSeconds = (state.playSeconds || 0) + 1;
  if (options.autosave && state.playSeconds % (options.autosave * 60) === 0) writeSave(game.slot);
  const r = rates();
  feedWorkers(state.speed);
  progressConstruction(state.speed);
  state.grain = totalFood();
  if ((state.tab === 'food' || state.tab === 'market') && !document.querySelector('#panel-view button:hover')) renderPanel();
  if (state.tab === 'economy' && state.ticks % 10 === 0 && !document.querySelector('#panel-view button:hover, #panel-view details[open]')) renderPanel();
  state.timber += r.timber * state.speed;
  state.stone = (state.stone || 0) + r.stone * state.speed;
  state.metal = (state.metal || 0) + r.metal * state.speed;
  accrueTavern(state.speed);
  if (state.minutes % 60 < state.speed) { shopAtArmory(); processDemands(); processBounties(); }
  state.minutes += state.speed;
  if (Math.floor(state.minutes / 1440) > Math.floor((state.minutes - state.speed) / 1440)) {
    gainHeirXp(40); collectTaxes();
    if (Math.floor(state.minutes / 1440) % DAYS_PER_WEEK === 0) applyWeeklyMood();
    if (Math.floor(state.minutes / 1440) % DAYS_PER_YEAR === 0) newYear();
  }
  // Heróis ganham experiência só em combate (golpes e curas). Aqui chegam os bandos e todos se recuperam.
  combatTick(state.speed);
  const hasTavern = state.buildings.some(building => building.type === 'tavern' && isDone(building));
  const hasHotel = state.buildings.some(building => building.type === 'hotel' && isDone(building));
  if ((hasTavern && state.minutes % 180 < state.speed) || (hasHotel && state.minutes % 150 < state.speed)) {
    const guildClasses = BUILDINGS.filter(building => building.heroClass && state.buildings.some(built => built.type === building.id && isDone(built))).map(building => building.heroClass);
    const arrivals = hasHotel && guildClasses.length ? guildClasses : ['Warrior','Archer','Lancer','Black Mage','Conjurer','Healer'];
    const className = arrivals[Math.floor(Math.random() * arrivals.length)];
    const origin = state.buildings.find(building => building.type === (hasHotel ? 'hotel' : 'tavern') && isDone(building));
    const arrived = recruit(className, origin);
    if (arrived) say(`${arrived.name}, ${className}, chegou ao domínio. Ninguém perguntou de onde.`);
  }
  const minuteOfDay = state.minutes % 1440;
  if (minuteOfDay >= 1200 && minuteOfDay - state.speed < 1200) say(NIGHT_MSG[Math.floor(state.minutes / 1440) % NIGHT_MSG.length]);
  updateHud();
}

// ==========================================================================
// Herdeiros: cinco casas de Mordavia, um herdeiro e uma herdeira em cada.
// ==========================================================================
const HOUSES = {
  vaelmont: { name: 'Casa Vaelmont', motto: 'O sangue é velho. A dívida, mais ainda.', colors: ['#6b1717', '#151313'], ink: '#e9cf9a', pattern: 'pale', letter: 'V',
    about: 'Nobreza antiga, castelo hipotecado e um retrato de família que ninguém tem coragem de tirar da parede.' },
  grenholt: { name: 'Casa Grenholt', motto: 'Quem uiva por último uiva sozinho.', colors: ['#6a7076', '#1e2328'], ink: '#f1e6cf', pattern: 'fess', letter: 'G',
    about: 'Caçadores de lobo das montanhas. Dizem que há lobo no sangue deles. Eles não negam.' },
  montalvo: { name: 'Casa Montalvo', motto: 'Tudo tem preço. Inclusive o luto.', colors: ['#21412a', '#b48c3c'], ink: '#f4e3b0', pattern: 'bend', letter: 'M',
    about: 'Mercadores de sal, de grão e de dívidas alheias. Ficaram ricos e faliram tantas vezes que perderam a conta.' },
  salazar: { name: 'Casa Salazar', motto: 'A chama recorda o sangue.', colors: ['#7a2d1d', '#c19a4a'], ink: '#f4e3b0', pattern: 'quarterly', letter: 'S',
    about: 'Uma linhagem ibérica antiga, moldada por séculos de encontros entre povos latinos, ibéricos e norte-africanos do Mediterrâneo.' },
  lucerna: { name: 'Casa Lucerna', motto: 'Enterramos todo mundo. Um dia, a gente também.', colors: ['#3d2549', '#d9cfb6'], ink: '#2a1a31', pattern: 'chevron', letter: 'L',
    about: 'Coveiros, carpideiras e padres de aluguel. Nenhuma família de Mordavia conhece tantos mortos pelo nome.' },
  kastrell: { name: 'Casa Kastrell', motto: 'Prontos pra guerra. A guerra é que se atrasou.', colors: ['#1e2f50', '#8d939d'], ink: '#efe6d2', pattern: 'quarterly', letter: 'K',
    about: 'Família de soldados que treina para uma guerra que nunca chega. Os duelos entre primos ajudam a passar o tempo.' },
};

const HEIRS = [
  { id: 'radu', name: 'Lucien Vaelmont', house: 'vaelmont', gender: 'm', age: 19, tie: 'Sobrinho do falecido.', about: 'Vendeu o cavalo pra pagar o funeral do cavalo. Ainda acha que foi um bom negócio.' },
  { id: 'costel', name: 'Bran Grenholt', house: 'grenholt', gender: 'm', age: 20, tie: 'Primo, por um casamento que ninguém aprovou.', about: 'Caça lobos desde os doze. Os lobos caçam ele de volta. Empate técnico.' },
  { id: 'mircea', name: 'Teodoro Montalvo', house: 'montalvo', gender: 'm', age: 22, tie: 'Credor do falecido. Também é parente.', about: 'Sabe o preço de tudo. O valor, ele cobra à parte.' },
  { id: 'toma', name: 'Inácio Lucerna', house: 'lucerna', gender: 'm', age: 21, tie: 'Enterrou o falecido. E o pai dele.', about: 'Coveiro de terceira geração. Os clientes nunca reclamam.' },
  { id: 'petru', name: 'Darian Kastrell', house: 'kastrell', gender: 'm', age: 18, tie: 'Afilhado do falecido.', about: 'Treinado pra guerra desde criança. A guerra nunca veio buscar ele.' },
  { id: 'ileana', name: 'Odette Vaelmont', house: 'vaelmont', gender: 'f', age: 17, tie: 'Sobrinha do falecido.', about: 'Herdou o orgulho da família. Só o orgulho. O resto foi penhorado.' },
  { id: 'doina', name: 'Wren Grenholt', house: 'grenholt', gender: 'f', age: 16, tie: 'Prima distante. A uma distância segura.', about: 'Uiva na lua cheia. Jura que é canto.' },
  { id: 'viorica', name: 'Lavinia Montalvo', house: 'montalvo', gender: 'f', age: 18, tie: 'Viúva do sobrinho do falecido.', about: 'Já faliu três vezes. Na prática, é uma especialista.' },
  { id: 'zoia', name: 'Amara Lucerna', house: 'lucerna', gender: 'f', age: 17, tie: 'Parente, segundo os mortos.', about: 'Conversa com os mortos. Eles respondem mais que os vivos.' },
  { id: 'anca', name: 'Rowena Kastrell', house: 'kastrell', gender: 'f', age: 16, tie: 'Neta do irmão do falecido.', about: 'Duelou com metade da corte. A outra metade foi embora do reino.' },
  { id: 'isabel-salazar', name: 'Isabel Salazar', house: 'salazar', gender: 'f', age: 21, tie: 'Descendente do mesmo ramo antigo da família Salazar.', about: 'Aprendeu que a elegância também é uma armadura — e que uma família sobrevive melhor quando sabe mudar sem esquecer de onde veio.' },
  { id: 'afonso-salazar', name: 'Afonso Salazar', house: 'salazar', gender: 'm', age: 21, tie: 'Herdeiro de um ramo antigo da Casa Salazar.', about: 'Criado entre os salões da corte, aprendeu cedo que nome, presença e lealdade também decidem disputas.' },
  // Os nobres das casas também podem herdar. Os retratos deles ficam em noble-portraits-v01.
  { id: 'anselm', name: 'Anselm Grenholt', house: 'grenholt', gender: 'm', age: 21, portrait: 'noble-portraits-v01/grenholt', tie: 'Caçador-Mor das Montanhas. Primo do falecido, pelo lado dos lobos.', about: 'Os cães dele comem melhor que os camponeses. Ele acha justo: os cães trabalham mais.' },
  { id: 'ottokar', name: 'Ottokar Lucerna', house: 'lucerna', gender: 'm', age: 22, portrait: 'noble-portraits-v01/lucerna', tie: 'Padre-Conde. Rezou a missa do falecido e leu o testamento na mesma tarde.', about: 'Mede a porta de quem visita. Pra saber se o caixão passa.' },
  { id: 'severina', name: 'Severina Montalvo', house: 'montalvo', gender: 'f', age: 20, portrait: 'noble-portraits-v01/montalvo', tie: 'Credora do falecido. Veio cobrar e saiu com a herança.', about: 'Anota tudo num livro de capa vermelha. Seu nome já está lá, sublinhado duas vezes.' },
  { id: 'ilka', name: 'Ilka Kastrell', house: 'kastrell', gender: 'f', age: 19, portrait: 'noble-portraits-v01/kastrell', tie: 'Baronesa e marechal de uma guerra que nunca veio.', about: 'Abastece um exército há anos pra uma guerra que não chega. Desta vez, jura ela, vem.' },
  { id: 'brunhilde', name: 'Brunhilde Vaelmont', house: 'vaelmont', gender: 'f', age: 18, portrait: 'noble-portraits-v01/vaelmont', tie: 'Tia-avó do falecido. A idade verdadeira dela é segredo de família.', about: 'Ninguém sobrevive ao chá dela por muito tempo. Ela jura que é a receita da família.' },
];
const heirById = id => HEIRS.find(heir => heir.id === id) || null;

// Brasão da casa, desenhado em SVG (escudo com divisão heráldica e a inicial da casa).
function crestSVG(houseId, size = 64) {
  const h = HOUSES[houseId];
  if (!h) return '';
  const [a, b] = h.colors;
  const shield = 'M4 4H60V34C60 54 46 66 32 72C18 66 4 54 4 34Z';
  const fields = {
    pale: `<rect x="0" y="0" width="32" height="76" fill="${a}"/><rect x="32" y="0" width="32" height="76" fill="${b}"/>`,
    fess: `<rect x="0" y="0" width="64" height="30" fill="${a}"/><rect x="0" y="30" width="64" height="46" fill="${b}"/>`,
    bend: `<rect x="0" y="0" width="64" height="76" fill="${a}"/><path d="M-6 8L8 -6L74 60L60 74Z" fill="${b}"/>`,
    chevron: `<rect x="0" y="0" width="64" height="76" fill="${a}"/><path d="M4 50L32 24L60 50V62L32 36L4 62Z" fill="${b}"/>`,
    quarterly: `<rect x="0" y="0" width="32" height="34" fill="${a}"/><rect x="32" y="0" width="32" height="34" fill="${b}"/><rect x="0" y="34" width="32" height="42" fill="${b}"/><rect x="32" y="34" width="32" height="42" fill="${a}"/>`,
  };
  const clip = `crest-${houseId}-${Math.random().toString(36).slice(2, 7)}`;
  return `<svg class="crest" width="${size}" height="${Math.round(size * 76 / 64)}" viewBox="0 0 64 76" aria-hidden="true">
    <defs><clipPath id="${clip}"><path d="${shield}"/></clipPath></defs>
    <g clip-path="url(#${clip})">${fields[h.pattern]}</g>
    <path d="${shield}" fill="none" stroke="#c9a464" stroke-width="2.4"/>
    <path d="${shield}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1" transform="translate(0 1)"/>
    <text x="32" y="44" text-anchor="middle" font-family="'Pirata One', Georgia, serif" font-size="30" fill="${h.ink}" stroke="#000" stroke-opacity=".35" stroke-width=".8">${h.letter}</text>
  </svg>`;
}

// Nível do herdeiro (1 a 30) e experiência.
const HEIR_MAX_LEVEL = 30;
// Mesma tabela do Ember Ashes (expToLevel): experiência para passar do nível atual ao próximo.
const xpToNext = level => { const c = Math.max(1, Math.min(HEIR_MAX_LEVEL - 1, level)); return c >= 28 ? 600 : c >= 23 ? 500 : c >= 18 ? 400 : c >= 13 ? 300 : c >= 8 ? 225 : c >= 3 ? 150 : 100; };
const LEVEL_MSG = [
  n => `${n} subiu de nível. Ninguém notou.`,
  n => `${n} subiu de nível. A família mandou parabéns e uma conta.`,
  n => `${n} subiu de nível. Os credores também.`,
  n => `${n} subiu de nível. A fazenda continua do mesmo jeito.`,
];
function gainHeirXp(amount) {
  if (!state.heir || state.heirLevel >= HEIR_MAX_LEVEL) return;
  state.heirXp += amount;
  let leveled = false;
  while (state.heirLevel < HEIR_MAX_LEVEL && state.heirXp >= xpToNext(state.heirLevel)) {
    state.heirXp -= xpToNext(state.heirLevel);
    state.heirLevel++;
    leveled = true;
  }
  if (state.heirLevel >= HEIR_MAX_LEVEL) state.heirXp = 0;
  const heir = heirById(state.heir);
  if (leveled && heir) say(`${pick(LEVEL_MSG)(heir.name.split(' ')[0])} Nível ${state.heirLevel}.`);
}

// Equipamento básico do herdeiro, com ícones provisórios em pixel art (12 x 12).
const PIXEL_COLORS = {
  k: '#1a1410', g: '#d6a94a', G: '#f2d27a', d: '#8a6420', w: '#7a4b26', W: '#a8703c', r: '#7c1f1a', R: '#b8382c',
  b: '#2f5f9a', B: '#7fb2e6', s: '#9aa0a6', S: '#d8dde2', c: '#b0642e', C: '#e09056', o: '#d8cfb6', O: '#a89c80', x: '#3c9a5a',
};
const RING = ['............', '.....kk.....', '....kxxk....', '....kxxk....', '...kcCCck...', '..kcckkcck..', '.kck....kck.', '.kck....kck.', '.kck....kck.', '..kcckkcck..', '...kcccck...', '....kkkk....'];
const PIXEL_ART = {
  scepter: ['.........kk.', '........kRRk', '........kRRk', '.......kgkk.', '......kgk...', '.....kwk....', '....kwk.....', '...kwk......', '..kwk.......', '.kgk........', 'kgk.........', '.k..........'],
  orb: ['.....kk.....', '....kggk....', '.....kk.....', '...kkkkkk...', '..kbBbbbbk..', '.kbBbbbbbbk.', '.kggggggggk.', '.kbbbbbbbbk.', '.kbbbbbbbbk.', '..kbbbbbbk..', '...kkkkkk...', '............'],
  mantle: ['....kkkk....', '...kgRRgk...', '..kRRggRRk..', '..kRRRRRRk..', '.kRRrRRrRRk.', '.kRrRRRRrRk.', '.kRrRRRRrRk.', 'kRrRRRRRRrRk', 'kRrRRRRRRrRk', 'krRRRRRRRRrk', 'krrRrRRrRrrk', 'kkkkkkkkkkkk'],
  crown: ['............', '.k...kk...k.', 'kSk.kSSk.kSk', 'kSk.kSSk.kSk', 'kSSkSSSSkSSk', 'kSSSSSSSSSSk', 'ksRssbbssRsk', 'kSSSSSSSSSSk', 'kssssssssssk', '.kkkkkkkkkk.', '............', '............'],
  medallion: ['.k........k.', '.kk......kk.', '..kk....kk..', '...kk..kk...', '....kkkk....', '...kggggk...', '..kgGggggk..', '..kgggrggk..', '..kggrrggk..', '..kgggggdk..', '...kddddk...', '....kkkk....'],
  ringCopper: RING,
  ringBone: RING.map(row => row.replace(/c/g, 'o').replace(/C/g, 'O').replace(/x/g, 'R')),
};
PIXEL_ART.coin = ['....kkkk....', '..kkGGGgkk..', '.kGGgggggdk.', '.kGgkkkkgdk.', 'kGgkggggkgdk', 'kGgkgGggkgdk', 'kggkggggkgdk', 'kggkggggkddk', '.kgdkkkkddk.', '.kddddddddk.', '..kkddddkk..', '....kkkk....'];
PIXEL_ART.logs = ['............', '............', '.kkkkkkkkkk.', 'kwWwwWwwwkWk', 'kwwwwwwWwkdk', '.kkkkkkkkkk.', '.kkkkkkkkkk.', 'kwwWwwwwWkWk', 'kwwwwWwwwkdk', '.kkkkkkkkkk.', '............', '............'];

// Custo com ícones: moeda para ouro, lenha para madeira.
function costHTML(gold, wood) {
  const ico = name => pixelIcon(name, 14).replace('class="pixel-icon"', 'class="pixel-icon cost-ico"');
  return `<span class="cost-pair"><span class="cost-item" title="${gold} de ouro">${ico('coin')}${gold}</span><span class="cost-item" title="${wood} de madeira">${ico('logs')}${wood}</span></span>`;
}

function pixelIcon(name, size = 48) {
  if (!PIXEL_ART[name]) return '';
  const asset = { ringCopper: 'ring-copper', ringBone: 'ring-bone' }[name] || name;
  return `<img class="pixel-icon" src="public/art/icon-${asset}-photo-v01.png" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async">`;
}

const EQUIP_SLOTS = [
  { slot: 'scepter', label: 'Cetro' }, { slot: 'orb', label: 'Globo' }, { slot: 'mantle', label: 'Manto' }, { slot: 'crown', label: 'Coroa' },
  { slot: 'medallion', label: 'Medalhão' }, { slot: 'ring1', label: 'Anel I' }, { slot: 'ring2', label: 'Anel II' },
];
const ITEMS = {
  pineScepter: { name: 'Cetro de Pinho', slot: 'scepter', tier: 1, price: 0, bonus: {}, icon: 'scepter', about: 'Pintado de dourado. A tinta descasca quando você aponta pra alguém.' },
  crackedOrb: { name: 'Globo Rachado', slot: 'orb', tier: 1, price: 0, bonus: {}, icon: 'orb', about: 'Representa o mundo. A rachadura também.' },
  wornMantle: { name: 'Manto Puído', slot: 'mantle', tier: 1, price: 0, bonus: {}, icon: 'mantle', about: 'Era vermelho real. Hoje é vermelho tanto faz.' },
  tinCrown: { name: 'Coroa de Lata', slot: 'crown', tier: 1, price: 0, bonus: {}, icon: 'crown', about: 'Brilha bem de longe. De perto, faz barulho.' },
  familyMedallion: { name: 'Medalhão da Família', slot: 'medallion', tier: 1, price: 0, bonus: {}, icon: 'medallion', about: 'Tem o brasão da casa na frente e o nome de um credor atrás.' },
  copperRing: { name: 'Anel de Cobre', slot: 'ring', tier: 1, price: 0, bonus: {}, icon: 'ringCopper', about: 'Deixa o dedo verde. Nobreza tem seu preço.' },
  boneRing: { name: 'Anel de Osso', slot: 'ring', tier: 1, price: 0, bonus: {}, icon: 'ringBone', about: 'Ninguém sabe de quem é o osso. Melhor assim.' },
};
function BASIC_EQUIPMENT() { return { scepter: 'pineScepter', orb: 'crackedOrb', mantle: 'wornMantle', crown: 'tinCrown', medallion: 'familyMedallion', ring1: 'copperRing', ring2: 'boneRing' }; }

// Equipamento do monarca: 10 tiers por peça. O tier 1 é o que veio com a herança; os outros
// se compram no Arsenal com o ouro do cofre, e cada nível do Arsenal libera até o seu tierCap.
// Bônus: atributo principal +2 por tier acima do 1, secundário +1 (Mana vale o triplo).
const MONARCH_TIER_PRICE = [0, 25, 50, 90, 140, 210, 300, 420, 580, 800];
const MONARCH_LINES = {
  scepter: { icon: 'scepter', main: 'MAG', side: 'CHA', items: [
    ['ashScepter', 'Cetro de Freixo', 'Não é ouro, mas aponta igual.'],
    ['oldBronzeScepter', 'Cetro de Bronze Velho', 'Herdado de um prefeito que sumiu.'],
    ['villageJudgeScepter', 'Cetro do Juiz de Aldeia', 'Já condenou três galinhas e um primo.'],
    ['beatenSilverScepter', 'Cetro de Prata Batida', 'A prata é verdadeira. O brasão, discutível.'],
    ['mourningValeScepter', 'Cetro do Vale do Luto', 'Os camponeses abaixam a cabeça. Por hábito.'],
    ['onyxScepter', 'Cetro de Ônix', 'Pesa na mão e na consciência.'],
    ['baronScepter', 'Cetro do Barão', 'Um barão morreu segurando. Não soltou fácil.'],
    ['ashenScepter', 'Cetro das Cinzas', 'Esquenta quando alguém mente. Vive quente.'],
    ['forgottenKingScepter', 'Cetro do Rei Esquecido', 'Mordavia já teve um rei. Ninguém lembra o nome, só o cetro.'],
  ] },
  orb: { icon: 'orb', main: 'INT', side: 'WIS', items: [
    ['blownGlassOrb', 'Globo de Vidro Soprado', 'Mostra o mundo. Embaçado, como ele é.'],
    ['brassOrb', 'Globo de Latão', 'Gira. Ninguém sabe pra quê.'],
    ['cartographerOrb', 'Globo do Cartógrafo', 'Tem o mapa da região. Com erros de propósito.'],
    ['silverOrb', 'Globo de Prata', 'Reflete o rosto do dono. Melhor não olhar muito.'],
    ['rockCrystalOrb', 'Globo de Cristal de Rocha', 'Prevê o tempo. Sempre chuva.'],
    ['astrologerOrb', 'Globo do Astrólogo', 'As estrelas dizem que você vai pagar caro por ele.'],
    ['blackAmberOrb', 'Globo de Âmbar Negro', 'Tem um inseto dentro. Ele pisca.'],
    ['livingAshOrb', 'Globo das Cinzas Vivas', 'A fumaça lá dentro forma nomes de devedores.'],
    ['wholeWorldOrb', 'Globo do Mundo Inteiro', 'Contém Mordavia inteira. Ela não sabe.'],
  ] },
  mantle: { icon: 'mantle', main: 'MP', side: 'CHA', items: [
    ['dyedWoolMantle', 'Manto de Lã Tingida', 'Vermelho de beterraba. Desbota na chuva.'],
    ['marketFeltMantle', 'Manto de Feltro do Mercado', 'Comprado de um mercador que jurou que era nobre.'],
    ['wornVelvetMantle', 'Manto de Veludo Gasto', 'Veludo de verdade. Gasto de verdade.'],
    ['foxCollarMantle', 'Manto com Gola de Raposa', 'A raposa ainda tem opinião.'],
    ['fakeErmineMantle', 'Manto de Arminho Falso', 'Coelho pintado. Ninguém tem coragem de dizer.'],
    ['councilMantle', 'Manto do Conselho', 'Usado em reuniões longas. Esconde o cochilo.'],
    ['trueErmineMantle', 'Manto de Arminho Verdadeiro', 'Agora sim. Os coelhos estão aliviados.'],
    ['goldThreadMantle', 'Manto Bordado a Ouro', 'Cada fio de ouro é um imposto de alguém.'],
    ['coronationMantle', 'Manto da Coroação', 'Feito para a coroação de um rei que não veio. Serve em você.'],
  ] },
  crown: { icon: 'crown', main: 'CHA', side: 'WIS', items: [
    ['copperDiadem', 'Diadema de Cobre', 'Fica verde na testa. Lembra de onde você veio.'],
    ['beatenIronCrown', 'Coroa de Ferro Batido', 'O ferreiro bateu com raiva. Dá pra ver.'],
    ['bronzeCrown', 'Coroa de Bronze', 'Brilha o bastante para ser roubada.'],
    ['fineSilverCrown', 'Coroa de Prata Fina', 'Fina demais para guerra. Ótima para jantar.'],
    ['garnetCrown', 'Coroa com Granadas', 'Pedras vermelhas. Dizem que são granadas.'],
    ['valeCrown', 'Coroa do Vale', 'O povo do Vale do Luto reconhece. E reclama.'],
    ['oldGoldCrown', 'Coroa de Ouro Velho', 'Ouro antigo, derretido de outras coroas menos sortudas.'],
    ['ashAndGoldCrown', 'Coroa de Cinzas e Ouro', 'Leve como cinza. Pesada como herança.'],
    ['mordaviaCrown', 'Coroa de Mordavia', 'A verdadeira. Ou a melhor cópia já feita.'],
  ] },
  medallion: { icon: 'medallion', main: 'WIS', side: 'MP', items: [
    ['pewterMedallion', 'Medalhão de Estanho', 'O brasão está ao contrário. Ninguém percebeu ainda.'],
    ['engravedCopperMedallion', 'Medalhão de Cobre Gravado', 'Gravado à mão. A mão tremia.'],
    ['guildMedallion', 'Medalhão da Guilda', 'Abre portas. Algumas.'],
    ['houseSilverMedallion', 'Medalhão de Prata da Casa', 'O brasão certo, desta vez.'],
    ['portraitMedallion', 'Medalhão com Retrato', 'Tem o retrato de uma tia. Ela ainda observa.'],
    ['oathMedallion', 'Medalhão do Juramento', 'Jurado diante de testemunhas. Elas morreram.'],
    ['baronGoldMedallion', 'Medalhão de Ouro do Barão', 'Prova que você é barão. Ou que roubou um.'],
    ['ashMedallion', 'Medalhão das Cinzas', 'Guarda as cinzas de um antepassado. Ele pesa.'],
    ['firstHeirMedallion', 'Medalhão do Primeiro Herdeiro', 'O primeiro dono fundou a casa. O segundo a perdeu.'],
  ] },
  ring: { icon: 'ringCopper', main: 'MAG', side: 'INT', items: [
    ['brassRing', 'Anel de Latão', 'Brilha como ouro por uma semana.'],
    ['carvedBoneRing', 'Anel de Osso Entalhado', 'Entalhado por um coveiro com tempo livre.', 'ringBone'],
    ['plainSilverRing', 'Anel de Prata Lisa', 'Liso. Sem brasão, sem dívida.'],
    ['signetRing', 'Anel de Sinete', 'Sela cartas. As respostas demoram.'],
    ['jadeRing', 'Anel de Jade', 'Jade de verdade, trazido de longe por alguém que não voltou.'],
    ['wolfBoneRing', 'Anel de Osso de Lobo', 'Lobo grande. Dedo pequeno.', 'ringBone'],
    ['rubyGoldRing', 'Anel de Ouro com Rubi', 'O rubi pisca no escuro. Não pergunte.'],
    ['ashRing', 'Anel das Cinzas', 'Morno o tempo todo. Como uma brasa que não apaga.', 'ringBone'],
    ['forgottenKingRing', 'Anel do Rei Esquecido', 'Faz par com o cetro. Os dois esperam alguém.'],
  ] },
};
Object.entries(MONARCH_LINES).forEach(([slot, line]) => line.items.forEach(([id, name, about, icon], i) => {
  const tier = i + 2, step = tier - 1, mana = key => (key === 'MP' ? 3 : 1);
  ITEMS[id] = { name, slot, tier, price: MONARCH_TIER_PRICE[tier - 1], icon: icon || line.icon, about,
    bonus: { [line.main]: 2 * step * mana(line.main), [line.side]: step * mana(line.side) } };
}));
const monarchEquipment = () => state.equipment || (state.equipment = BASIC_EQUIPMENT());
const monarchBonus = key => Object.values(monarchEquipment()).reduce((sum, id) => sum + (ITEMS[id]?.bonus?.[key] || 0), 0);
const monarchBonusText = bonus => Object.entries(bonus).map(([key, value]) => `+${value} ${key}`).join(' ');

// Loja do monarca no Arsenal: uma linha por slot, com o que este Arsenal libera e é melhor que o atual.
function monarchShopHTML(tierCap) {
  const equipped = monarchEquipment();
  const rows = EQUIP_SLOTS.map(({ slot, label }) => {
    const current = ITEMS[equipped[slot]];
    const kind = slot.startsWith('ring') ? 'ring' : slot;
    const options = Object.entries(ITEMS).filter(([, item]) => item.slot === kind && item.tier > (current?.tier || 0) && item.tier <= tierCap).sort((a, b) => a[1].tier - b[1].tier);
    const affordable = options.filter(([, item]) => state.testMode || item.price <= state.gold);
    const pick = (affordable[affordable.length - 1] || options[0] || [])[0];
    return `<div class="monarch-shop-row"><span class="monarch-shop-slot">${current ? pixelIcon(current.icon, 24) : ''}<span><small>${label}</small><b>${current ? `${current.name} · T${current.tier}` : 'Vazio'}</b></span></span>
      ${options.length ? `<select data-monarch-pick="${slot}" aria-label="Escolher ${label.toLowerCase()}">${options.map(([id, item]) => `<option value="${id}"${id === pick ? ' selected' : ''}>T${item.tier} · ${item.price} ouro · ${item.name} · ${monarchBonusText(item.bonus)}</option>`).join('')}</select>
      <button type="button" class="monarch-buy" data-monarch-buy="${slot}">Comprar</button>` : `<em>${(current?.tier || 0) >= 10 ? 'Melhor que isso não existe' : 'Nada melhor neste nível'}</em>`}</div>`;
  });
  return `<p class="storage-items">O monarca paga com o cofre. A peça antiga vai pro fundo do baú.</p><div class="monarch-shop">${rows.join('')}</div>`;
}

function buyMonarchItem(slot, id) {
  const item = ITEMS[id];
  const current = ITEMS[monarchEquipment()[slot]];
  const kind = slot.startsWith('ring') ? 'ring' : slot;
  if (!item || item.slot !== kind || item.tier <= (current?.tier || 0)) return;
  if (item.tier > armoryTier()) { say('O Arsenal ainda não vende isso. Melhore o Arsenal.'); return; }
  if (!state.testMode && state.gold < item.price) { say(`Falta ouro. ${item.name} custa ${item.price}.`); return; }
  if (!state.testMode) state.gold -= item.price;
  monarchEquipment()[slot] = id;
  say(`${item.name} agora é do monarca. O cofre emagreceu ${item.price}.`);
  updateHud();
  renderPanel();
}

// ==========================================================================
// Equipamento de heróis e camponeses. Cada um compra no Arsenal com a própria bolsa, pela ordem
// de prioridade que acha mais importante; o ouro da venda vai pro cofre do monarca.
// Cada nível do Arsenal libera o teto de tier definido em ARMORY_LEVELS.
// ==========================================================================
const HERO_SLOTS = [
  { slot: 'weapon', label: 'Arma' }, { slot: 'offhand', label: 'Mão secundária' }, { slot: 'head', label: 'Cabeça' }, { slot: 'body', label: 'Armadura' },
  { slot: 'hands', label: 'Mãos' }, { slot: 'feet', label: 'Pés' }, { slot: 'cloak', label: 'Capa' }, { slot: 'amulet', label: 'Amuleto' },
  { slot: 'ring1', label: 'Anel I' }, { slot: 'ring2', label: 'Anel II' },
];
const PEASANT_SLOTS = [
  { slot: 'tool', label: 'Ferramenta' }, { slot: 'clothes', label: 'Roupa' }, { slot: 'hands', label: 'Mãos' }, { slot: 'feet', label: 'Pés' }, { slot: 'head', label: 'Cabeça' },
];
const MELEE = ['Warrior', 'Lancer', 'Healer'];
const FRONT = ['Warrior', 'Lancer'];
const CASTERS = ['Black Mage', 'Conjurer'];
// bonus: atk, def, mag, hp, dex (heróis) · work (produção, fração), carry (carga extra), speed (passo, fração) (camponeses)
const GEAR = {
  rustySword: { name: 'Espada Enferrujada', slot: 'weapon', tier: 1, price: 10, classes: ['Warrior'], bonus: { atk: 2 }, about: 'A ferrugem também corta. Mais devagar.' },
  warAxe: { name: 'Machado de Guerra', slot: 'weapon', tier: 2, price: 40, classes: ['Warrior'], bonus: { atk: 5 }, about: 'Pesado o bastante pra resolver discussões.' },
  valeGreatsword: { name: 'Montante do Vale', slot: 'weapon', tier: 3, price: 110, classes: ['Warrior'], bonus: { atk: 9 }, about: 'Forjado pra um herói. Vendido pra quem pagou.' },
  shortBow: { name: 'Arco Curto', slot: 'weapon', tier: 1, price: 10, classes: ['Archer'], bonus: { atk: 2, dex: 1 }, about: 'Curto no alcance e na paciência.' },
  yewBow: { name: 'Arco Longo de Teixo', slot: 'weapon', tier: 2, price: 40, classes: ['Archer'], bonus: { atk: 4, dex: 2 }, about: 'Teixo de cemitério. Por isso acerta.' },
  hornBow: { name: 'Arco de Chifre', slot: 'weapon', tier: 3, price: 110, classes: ['Archer'], bonus: { atk: 7, dex: 3 }, about: 'O dono anterior era o bicho do chifre.' },
  ashSpear: { name: 'Lança de Freixo', slot: 'weapon', tier: 1, price: 10, classes: ['Lancer'], bonus: { atk: 2 }, about: 'Um pau comprido com opinião na ponta.' },
  halberd: { name: 'Alabarda', slot: 'weapon', tier: 2, price: 40, classes: ['Lancer'], bonus: { atk: 5 }, about: 'Machado, lança e gancho. Indecisa, mas eficiente.' },
  knightLance: { name: 'Lança de Cavaleiro', slot: 'weapon', tier: 3, price: 110, classes: ['Lancer'], bonus: { atk: 9 }, about: 'Feita pra cavalo. Ninguém aqui tem cavalo.' },
  crookedStaff: { name: 'Cajado Torto', slot: 'weapon', tier: 1, price: 10, classes: ['Black Mage'], bonus: { mag: 2 }, about: 'Torto de nascença. A magia sai torta também.' },
  scorchedTome: { name: 'Grimório Chamuscado', slot: 'weapon', tier: 1, price: 10, classes: ['Conjurer'], bonus: { mag: 2 }, about: 'Faltam páginas. As que sobraram mordem.' },
  ebonyStaff: { name: 'Cajado de Ébano', slot: 'weapon', tier: 2, price: 45, classes: CASTERS, bonus: { mag: 5 }, about: 'Preto, lustroso e frio ao toque. Como o dono.' },
  skullStaff: { name: 'Cajado de Caveira', slot: 'weapon', tier: 3, price: 120, classes: CASTERS, bonus: { mag: 9 }, about: 'A caveira às vezes dá palpite.' },
  woodenMace: { name: 'Maça de Madeira', slot: 'weapon', tier: 1, price: 10, classes: ['Healer'], bonus: { atk: 1, mag: 1 }, about: 'Cura de um lado, machuca do outro.' },
  blessedMace: { name: 'Maça Benta', slot: 'weapon', tier: 2, price: 40, classes: ['Healer'], bonus: { atk: 2, mag: 3 }, about: 'Abençoada por um padre bêbado. Conta igual.' },
  reliquaryMace: { name: 'Maça Relicário', slot: 'weapon', tier: 3, price: 110, classes: ['Healer'], bonus: { atk: 4, mag: 5 }, about: 'Tem um dedo de santo dentro. Dizem.' },
  plankShield: { name: 'Escudo de Tábuas', slot: 'offhand', tier: 1, price: 8, classes: MELEE, bonus: { def: 2 }, about: 'Era uma porta. Ainda range.' },
  ironShield: { name: 'Escudo de Ferro', slot: 'offhand', tier: 2, price: 35, classes: MELEE, bonus: { def: 4 }, about: 'Amassado nos lugares certos.' },
  towerShield: { name: 'Escudo-Torre', slot: 'offhand', tier: 3, price: 95, classes: FRONT, bonus: { def: 7 }, about: 'Dá pra morar atrás dele.' },
  quiver: { name: 'Aljava de Couro', slot: 'offhand', tier: 1, price: 8, classes: ['Archer'], bonus: { dex: 2 }, about: 'Cabe flecha, pão e arrependimento.' },
  boneTalisman: { name: 'Talismã de Osso', slot: 'offhand', tier: 1, price: 8, classes: CASTERS, bonus: { mag: 1 }, about: 'Chacoalha quando alguém mente.' },
  crystalFocus: { name: 'Foco de Cristal', slot: 'offhand', tier: 2, price: 35, classes: CASTERS, bonus: { mag: 3 }, about: 'Concentra a magia. E o sol, se esquecer na janela.' },
  leatherHood: { name: 'Capuz de Couro', slot: 'head', tier: 1, price: 6, bonus: { def: 1 }, about: 'Protege da chuva. Do resto, nem tanto.' },
  ironHelm: { name: 'Elmo de Ferro', slot: 'head', tier: 2, price: 30, classes: MELEE, bonus: { def: 3 }, about: 'Ouve-se o mar dentro dele. Não tem mar aqui.' },
  greatHelm: { name: 'Elmo Fechado', slot: 'head', tier: 3, price: 80, classes: FRONT, bonus: { def: 5 }, about: 'Não se vê nada. Mas também não se é visto.' },
  pointyHat: { name: 'Chapéu Pontudo', slot: 'head', tier: 2, price: 30, classes: CASTERS, bonus: { mag: 2 }, about: 'Ninguém sabe se ajuda. Ninguém arrisca tirar.' },
  paddedJerkin: { name: 'Gibão Acolchoado', slot: 'body', tier: 1, price: 12, bonus: { def: 2, hp: 3 }, about: 'Recheado de palha e esperança.' },
  studdedLeather: { name: 'Couro Tachonado', slot: 'body', tier: 2, price: 45, classes: ['Archer'], bonus: { def: 3, dex: 2 }, about: 'Leve, firme e com cheiro de curtume.' },
  chainmail: { name: 'Cota de Malha', slot: 'body', tier: 2, price: 50, classes: MELEE, bonus: { def: 5, hp: 5 }, about: 'Mil argolinhas, cada uma com um furo.' },
  arcaneRobe: { name: 'Manto Arcano', slot: 'body', tier: 2, price: 45, classes: [...CASTERS, 'Healer'], bonus: { mag: 3, hp: 3 }, about: 'Bordado com runas. Uma diz "lavar à mão".' },
  plateArmor: { name: 'Armadura de Placas', slot: 'body', tier: 3, price: 130, classes: FRONT, bonus: { def: 9, hp: 8 }, about: 'Leva meia hora pra vestir e a vida toda pra pagar.' },
  leatherGloves: { name: 'Luvas de Couro', slot: 'hands', tier: 1, price: 5, bonus: { dex: 1 }, about: 'Firmes no punho. Furadas no dedão.' },
  ironGauntlets: { name: 'Manoplas de Ferro', slot: 'hands', tier: 2, price: 25, classes: MELEE, bonus: { def: 2, atk: 1 }, about: 'Ótimas pra socar. Péssimas pra coçar.' },
  wornBoots: { name: 'Botas Gastas', slot: 'feet', tier: 1, price: 5, bonus: { dex: 1 }, about: 'Já andaram mais que o dono.' },
  travelBoots: { name: 'Botas de Viagem', slot: 'feet', tier: 2, price: 22, bonus: { dex: 2, hp: 2 }, about: 'Feitas pra ir longe. Ninguém volta pra reclamar.' },
  steelGreaves: { name: 'Grevas de Aço', slot: 'feet', tier: 3, price: 70, classes: FRONT, bonus: { def: 4 }, about: 'Chutam portas. E canelas.' },
  woolCloak: { name: 'Capa de Lã', slot: 'cloak', tier: 1, price: 6, bonus: { hp: 2 }, about: 'Esquenta e pinica na mesma medida.' },
  travelerCloak: { name: 'Capa de Viajante', slot: 'cloak', tier: 2, price: 25, bonus: { hp: 4, def: 1 }, about: 'Tem bolso secreto. Vazio.' },
  shadowCloak: { name: 'Capa das Sombras', slot: 'cloak', tier: 3, price: 75, bonus: { dex: 3, def: 2 }, about: 'Some no escuro. O dono também, às vezes.' },
  garlicAmulet: { name: 'Amuleto de Alho', slot: 'amulet', tier: 1, price: 6, bonus: { def: 1 }, about: 'Afasta strigoi e amizades.' },
  silverAmulet: { name: 'Amuleto de Prata', slot: 'amulet', tier: 2, price: 35, bonus: { mag: 2, def: 1 }, about: 'Prata de verdade. Quase toda.' },
  saintReliquary: { name: 'Relicário de Santo', slot: 'amulet', tier: 3, price: 90, bonus: { hp: 6, mag: 2 }, about: 'Ossinho de santo. De qual santo, ninguém garante.' },
  ironRing: { name: 'Anel de Ferro', slot: 'ring', tier: 1, price: 8, bonus: { atk: 1 }, about: 'Deixa marca no dedo e na cara dos outros.' },
  silverRing: { name: 'Anel de Prata', slot: 'ring', tier: 2, price: 30, bonus: { def: 2 }, about: 'Brilha o suficiente pra ser roubado.' },
  rubyRing: { name: 'Anel de Rubi', slot: 'ring', tier: 3, price: 85, bonus: { atk: 3, mag: 3 }, about: 'Vermelho como a dívida que ele custou.' },
  // Camponeses. Itens com prof são da profissão; sem profissão o camponês só compra o básico (sem prof).
  oldSickle: { name: 'Foice Velha', slot: 'tool', tier: 1, price: 5, peasant: true, prof: ['farmer'], bonus: { work: 0.1 }, about: 'Cega, mas insiste.' },
  ironHoe: { name: 'Enxada de Ferro', slot: 'tool', tier: 2, price: 15, peasant: true, prof: ['farmer'], bonus: { work: 0.2 }, about: 'A terra cede. As costas também.' },
  greatScythe: { name: 'Gadanha', slot: 'tool', tier: 3, price: 30, peasant: true, prof: ['farmer'], bonus: { work: 0.3 }, about: 'Corta trigo e conversa fiada.' },
  flourSieve: { name: 'Peneira de Farinha', slot: 'tool', tier: 1, price: 5, peasant: true, prof: ['miller'], bonus: { work: 0.1 }, about: 'Separa a farinha do resto. O resto é a maior parte.' },
  millPick: { name: 'Picão de Mó', slot: 'tool', tier: 2, price: 15, peasant: true, prof: ['miller'], bonus: { work: 0.2 }, about: 'Afia a pedra do moinho. E a paciência.' },
  millwrightKit: { name: 'Ferramentas de Moleiro', slot: 'tool', tier: 3, price: 30, peasant: true, prof: ['miller'], bonus: { work: 0.3 }, about: 'Conserta engrenagem, pá e eixo. Menos a vida.' },
  hatchet: { name: 'Machadinha', slot: 'tool', tier: 1, price: 5, peasant: true, prof: ['woodcutter'], bonus: { work: 0.1 }, about: 'Pequena, mas não se ofende.' },
  woodAxe: { name: 'Machado de Lenhador', slot: 'tool', tier: 2, price: 15, peasant: true, prof: ['woodcutter'], bonus: { work: 0.2 }, about: 'As árvores do vale já ouviram falar dele.' },
  bowSaw: { name: 'Serra de Arco', slot: 'tool', tier: 3, price: 30, peasant: true, prof: ['woodcutter'], bonus: { work: 0.3 }, about: 'Range como gente. Corta melhor que gente.' },
  mallet: { name: 'Maço de Madeira', slot: 'tool', tier: 1, price: 5, peasant: true, prof: ['builder'], bonus: { build: 0.1 }, about: 'Bate prego, bate dedo.' },
  masonHammer: { name: 'Martelo de Pedreiro', slot: 'tool', tier: 2, price: 15, peasant: true, prof: ['builder'], bonus: { build: 0.2 }, about: 'Ergue parede. Às vezes reta.' },
  smithTools: { name: 'Ferramentas de Ferreiro', slot: 'tool', tier: 3, price: 30, peasant: true, prof: ['builder'], bonus: { build: 0.3 }, about: 'Martelo, tenaz e lima. Resolve até dobradiça.' },
  workClothes: { name: 'Roupa de Trabalho', slot: 'clothes', tier: 1, price: 4, peasant: true, bonus: { carry: 1 }, about: 'Remendada sobre remendo.' },
  farmSmock: { name: 'Bata de Lavrador', slot: 'clothes', tier: 2, price: 10, peasant: true, prof: ['farmer', 'woodcutter'], bonus: { carry: 2 }, about: 'Bolsos fundos e cheiro de terra.' },
  leatherApron: { name: 'Avental de Couro', slot: 'clothes', tier: 2, price: 10, peasant: true, prof: ['miller', 'builder'], bonus: { carry: 2 }, about: 'Segura farinha, cal e reclamação.' },
  smithApron: { name: 'Avental de Ferreiro', slot: 'clothes', tier: 3, price: 20, peasant: true, prof: ['builder'], bonus: { carry: 3 }, about: 'Aguenta brasa, ferro e patrão.' },
  woolGloves: { name: 'Luvas de Lã', slot: 'hands', tier: 1, price: 3, peasant: true, bonus: { work: 0.05 }, about: 'Quentinhas até molhar.' },
  workGloves: { name: 'Luvas de Couro Grosso', slot: 'hands', tier: 2, price: 8, peasant: true, bonus: { work: 0.1 }, about: 'Calo é pra quem não tem.' },
  smithGloves: { name: 'Luvas de Ferreiro', slot: 'hands', tier: 3, price: 16, peasant: true, prof: ['builder', 'woodcutter'], bonus: { work: 0.1, build: 0.15 }, about: 'Pega carvão em brasa. Não recomendado.' },
  clogs: { name: 'Tamancos', slot: 'feet', tier: 1, price: 3, peasant: true, bonus: { speed: 0.05 }, about: 'Dá pra ouvir chegando.' },
  workBoots: { name: 'Botas de Trabalho', slot: 'feet', tier: 2, price: 8, peasant: true, bonus: { speed: 0.1 }, about: 'Lama não entra. Quase.' },
  hobnailBoots: { name: 'Botas Ferradas', slot: 'feet', tier: 3, price: 16, peasant: true, prof: ['woodcutter', 'builder'], bonus: { speed: 0.15 }, about: 'Pregos na sola, firmeza no passo.' },
  strawHat: { name: 'Chapéu de Palha', slot: 'head', tier: 1, price: 2, peasant: true, bonus: { work: 0.05 }, about: 'Protege do sol. Sol aqui é raro.' },
  wideHat: { name: 'Chapéu de Abas Largas', slot: 'head', tier: 2, price: 6, peasant: true, prof: ['farmer'], bonus: { work: 0.1 }, about: 'Sombra pra ele e pra quem estiver do lado.' },
};
const STARTER_WEAPON = { Warrior: 'rustySword', Archer: 'shortBow', Lancer: 'ashSpear', 'Black Mage': 'crookedStaff', Conjurer: 'scorchedTome', Healer: 'woodenMace' };
// Cada herói compra na ordem que acha mais importante. A mania muda a ordem.
const SLOT_PRIORITY = {
  default: ['weapon', 'body', 'head', 'offhand', 'feet', 'hands', 'cloak', 'amulet', 'ring1', 'ring2'],
  Valente: ['weapon', 'hands', 'ring1', 'body', 'offhand', 'head', 'feet', 'cloak', 'amulet', 'ring2'],
  Teimoso: ['weapon', 'ring1', 'ring2', 'body', 'head', 'offhand', 'hands', 'feet', 'cloak', 'amulet'],
  Covarde: ['body', 'head', 'offhand', 'feet', 'cloak', 'hands', 'amulet', 'weapon', 'ring1', 'ring2'],
  Amaldiçoado: ['amulet', 'body', 'head', 'cloak', 'weapon', 'offhand', 'feet', 'hands', 'ring1', 'ring2'],
  Ganancioso: ['ring1', 'ring2', 'amulet', 'weapon', 'body', 'head', 'offhand', 'cloak', 'feet', 'hands'],
  Bêbado: ['cloak', 'feet', 'weapon', 'body', 'head', 'offhand', 'hands', 'amulet', 'ring1', 'ring2'],
};
// Profissões: você escolhe. Sem profissão o camponês faz o que houver e não compra ferramenta de ofício.
const PROFESSIONS = {
  farmer: { name: 'Fazendeiro', fem: 'Fazendeira', skill: 'farming', types: ['farm'] },
  miller: { name: 'Moleiro', fem: 'Moleira', skill: 'milling', types: ['mill'] },
  woodcutter: { name: 'Lenhador', fem: 'Lenhadora', skill: 'woodcutting', types: ['lumber'] },
  miner: { name: 'Minerador', fem: 'Mineradora', skill: 'mining', types: ['quarry', 'mine'] },
  builder: { name: 'Pedreiro', fem: 'Pedreira', skill: 'building', types: [] },
};
// Habilidades de 0 a 100. Sobem devagar com o que o camponês faz, e mais devagar quanto mais alto.
const SKILLS = [
  { id: 'farming', name: 'Lavoura' }, { id: 'milling', name: 'Moagem' }, { id: 'woodcutting', name: 'Lenha' }, { id: 'mining', name: 'Mineração' },
  { id: 'building', name: 'Construção' }, { id: 'hauling', name: 'Carga' },
];
const SKILL_OF_TYPE = { farm: 'farming', mill: 'milling', lumber: 'woodcutting', quarry: 'mining', mine: 'mining' };
const skillOf = (actor, id) => actor?.skills?.[id] || 0;
function gainSkill(actor, id, amount) {
  if (!actor || actor.className !== 'Peasant') return;
  actor.skills = actor.skills || {};
  const now = actor.skills[id] || 0;
  actor.skills[id] = Math.min(100, now + amount * (1 - now / 110));
}
const professionName = actor => { const prof = PROFESSIONS[actor.profession]; return prof ? (isFemalePeasant(actor) ? prof.fem : prof.name) : 'Sem profissão'; };
function setProfession(id, profession) {
  const worker = findActor(id);
  if (!worker || worker.className !== 'Peasant') return;
  worker.profession = PROFESSIONS[profession] ? profession : null;
  worker.jobSite = null;
  if (worker.workplace?.type === 'lumber' && worker.profession !== 'woodcutter') worker.workplace = null;
  if (isPit(worker.workplace) && worker.profession && worker.profession !== 'miner') worker.workplace = null;
  worker.route = []; worker.finalPoint = null; worker.wait = 0;
  workplaceOf(worker);
  renderPanel();
  say(worker.profession ? `${worker.name} agora é ${professionName(worker).toLowerCase()}. Ninguém perguntou se queria.` : `${worker.name} ficou sem profissão. Vai fazer o que aparecer.`);
}
const PEASANT_PRIORITY = ['tool', 'clothes', 'feet', 'hands', 'head'];
const ARMORY_LEVELS = [
  { gold: 0, wood: 0, tierCap: 3 },
  { gold: 120, wood: 8, tierCap: 5 },
  { gold: 200, wood: 14, tierCap: 8 },
  { gold: 360, wood: 24, tierCap: 10 },
];
const BONUS_LABELS = { atk: 'Ataque', def: 'Defesa', mag: 'Magia', hp: 'Vida', dex: 'Destreza', work: 'trabalho', carry: 'carga', speed: 'passo', build: 'obra' };
const gearOf = actor => actor.gear || (actor.gear = {});
const slotsFor = actor => actor.className === 'Peasant' ? PEASANT_SLOTS : HERO_SLOTS;
const slotKind = slot => slot.startsWith('ring') ? 'ring' : slot;
const fitsSlot = (item, actor, slot) => item.slot === slotKind(slot) && (actor.className === 'Peasant' ? !!item.peasant && (!item.prof || item.prof.includes(actor.profession)) : !item.peasant && (!item.classes || item.classes.includes(actor.className)));
const gearBonus = (actor, key) => Object.values(gearOf(actor)).reduce((sum, id) => sum + (GEAR[id]?.bonus[key] || 0), 0);
const bonusText = bonus => Object.entries(bonus).map(([key, value]) => ['work', 'speed', 'build'].includes(key) ? `+${Math.round(value * 100)}% ${BONUS_LABELS[key]}` : `+${value} ${BONUS_LABELS[key]}`).join(', ');
const carryLoad = actor => CARRY_LOAD + gearBonus(actor, 'carry') + Math.floor(skillOf(actor, 'hauling') / 25);
// Bônus de trabalho de quem está escalado nesta construção (fazenda, moinho ou cabana).
function crewWork(building) {
  return state.workers.filter(worker => worker.alive && worker.buildSite == null && (worker.workplace ? worker.workplace.site : worker.jobSite) === building.site)
    .reduce((sum, worker) => sum + gearBonus(worker, 'work') + skillOf(worker, SKILL_OF_TYPE[building.type]) / 200, 0);
}
const armoryTier = () => state.buildings.filter(building => building.type === 'armory' && isDone(building))
  .reduce((best, armory) => Math.max(best, ARMORY_LEVELS[Math.min(armory.level || 0, ARMORY_LEVELS.length - 1)].tierCap), 0);
function bestPurchase(actor, tier) {
  const order = actor.className === 'Peasant' ? PEASANT_PRIORITY.filter(slot => actor.profession || slot !== 'tool') : (SLOT_PRIORITY[actor.trait] || SLOT_PRIORITY.default);
  for (const slot of order) {
    const current = GEAR[gearOf(actor)[slot]];
    const options = Object.entries(GEAR).filter(([, item]) => fitsSlot(item, actor, slot) && item.tier <= tier && item.price <= purseOf(actor) && item.tier > (current?.tier || 0));
    if (options.length) {
      const [id, item] = options.sort((a, b) => b[1].tier - a[1].tier)[0];
      return { slot, id, item };
    }
  }
  return null;
}
// Uma vez por hora de jogo: quem está livre pode passar no Arsenal. No máximo uma compra por dia por pessoa.
function shopAtArmory() {
  const tier = armoryTier();
  if (!tier) return;
  const day = Math.floor(state.minutes / 1440);
  [...state.heroes, ...state.workers].filter(actor => actor.alive && actor.buildSite == null && !(actor.drinkUntil > state.minutes) && actor.lastShopDay !== day).forEach(actor => {
    if (Math.random() > 0.3) return;
    const buy = bestPurchase(actor, tier);
    if (!buy) return;
    actor.purse = purseOf(actor) - buy.item.price;
    gearOf(actor)[buy.slot] = buy.id;
    actor.lastShopDay = day;
    if (!state.testMode) state.gold += buy.item.price;
    state.armorySales = (state.armorySales || 0) + buy.item.price;
    say(`${actor.name} comprou ${buy.item.name} no Arsenal por ${buy.item.price} de ouro.`, `${actor.name} saiu do Arsenal com ${buy.item.name}. E com a bolsa mais leve.`);
  });
}
function upgradeArmory(site) {
  const armory = state.buildings.find(building => building.site === site && building.type === 'armory' && isDone(building));
  const nextIndex = (armory?.level || 0) + 1;
  const next = armory && ARMORY_LEVELS[nextIndex];
  if (!next) return;
  if (state.gold < next.gold || state.timber < next.wood) { say('Falta ouro ou madeira. O ferreiro vai continuar vendendo sucata.'); return; }
  state.gold -= next.gold;
  state.timber -= next.wood;
  armory.armoryUpgradeTo = nextIndex + 1;
  armory.underConstruction = true;
  armory.progress = 0;
  armory.builderId = null;
  assignBuilders();
  renderSites(); renderPanel(); updateHud();
  const worker = armory.builderId != null ? findActor(armory.builderId) : null;
  say(worker ? `Reforma do Arsenal para o nível ${nextIndex + 1} iniciada. ${worker.name} vai trabalhar nela.` : `Reforma do Arsenal para o nível ${nextIndex + 1} iniciada. Falta um camponês livre para a obra.`);
}
function armoryBoxHTML(armory) {
  const level = armory.level || 0;
  const next = ARMORY_LEVELS[level + 1];
  const tierCap = ARMORY_LEVELS[Math.min(level, ARMORY_LEVELS.length - 1)].tierCap;
  const forSale = Object.values(GEAR).filter(item => item.tier <= tierCap).sort((a, b) => (a.peasant === b.peasant ? 0 : a.peasant ? 1 : -1) || a.tier - b.tier || a.price - b.price);
  return `<section class="inspector-section"><h4>Melhoria</h4>
    ${next ? `<button type="button" class="hut-upgrade" data-armory-upgrade="${armory.site}">Nível ${level + 2} · até tier ${next.tierCap} · ${costHTML(next.gold, next.wood)}</button>` : '<p class="storage-items">Nível máximo. O ferreiro já não dorme.</p>'}</section>
    <section class="inspector-section"><h4>Loja do monarca · até tier ${tierCap}</h4>${monarchShopHTML(tierCap)}</section>
    <details class="inspector-section"><summary>À venda para heróis e camponeses · ${forSale.length} itens</summary>
    <p class="storage-items">Heróis e camponeses compram sozinhos, com o próprio ouro. O ouro vai pro cofre.</p>
    <ul class="shop-list">${forSale.map(item => `<li><span><b>${item.name}</b><small>${item.peasant ? (item.prof ? item.prof.map(id => PROFESSIONS[id].name).join(', ') : 'Qualquer camponês') : item.classes ? item.classes.join(', ') : 'Qualquer herói'} · ${bonusText(item.bonus)}</small></span><em>${item.price}</em></li>`).join('')}</ul></details>`;
}
function gearHTML(actor) {
  if (actor.className === 'Bandit' || actor.className === 'Monster') return '';
  return `<div class="sheet-section-label">EQUIPAMENTO</div><div class="equip-grid">${slotsFor(actor).map(({ slot, label }) => {
    const item = GEAR[gearOf(actor)[slot]];
    return `<div class="equip-slot${item ? '' : ' empty'}"><span class="gear-icon" aria-hidden="true">${label[0]}</span><span><small>${label}</small><b>${item ? item.name : 'Vazio'}</b><em>${item ? `${bonusText(item.bonus)}. ${item.about}` : ''}</em></span></div>`;
  }).join('')}</div>`;
}

// Tabelas de atributos de combate: [Vida, Ataque, Magia, Defesa, Destreza] no nível 1; mov = Movimento.
// Todas as classes crescem no mesmo ritmo (+16% do valor inicial por nível, até o nível 30). Assim o equilíbrio
// entre classes é o mesmo no nível 1 e no 30, e só a diferença de nível muda quem leva vantagem.
// Referência contra um Salteador do mesmo nível (golpes para matá-lo / golpes que ele precisa):
// Warrior 3/12, Heavy Knight 4/18, Paladin 4/13, Lancer 3/8, Archer 3/5, Assassin 2/5, Mage 2/4, Healer 7/7, Camponês −/5.
const STAT_GROWTH = 0.16;
const statTable = (mov, base) => ({
  mov, stats: Array.from({ length: 30 }, (_, i) => base.map(value => Math.round(value * (1 + STAT_GROWTH * i)))),
});
const EMBER_CLASSES = {
  swordsman: statTable(5, [40, 11, 0, 10, 4]),
  archer: statTable(6, [26, 11, 0, 4, 8]),
  lancer: statTable(5, [34, 11, 0, 7, 5]),
  mage: statTable(5, [22, 3, 14, 3, 6]),
  conjurer: statTable(5, [20, 3, 12, 2, 8]),
  healer: statTable(5, [30, 6, 8, 6, 6]),
  paladin: statTable(5, [42, 9, 6, 11, 4]),
  heavyKnight: statTable(4, [50, 10, 0, 15, 3]),
  ranger: statTable(6, [28, 12, 0, 5, 9]),
  assassin: statTable(6, [26, 15, 0, 4, 12]),
  templar: statTable(5, [36, 11, 4, 9, 4]),
  elementalist: statTable(5, [24, 3, 16, 3, 7]),
  warlock: statTable(5, [24, 3, 17, 3, 6]),
  sorcerer: statTable(5, [22, 3, 14, 3, 9]),
  necromancer: statTable(5, [24, 3, 14, 4, 7]),
  bishop: statTable(5, [30, 5, 11, 6, 7]),
  cleric: statTable(5, [36, 9, 8, 9, 5]),
  peasant1: statTable(4, [24, 4, 0, 4, 2]),
  villagerF1: statTable(4, [22, 3, 0, 3, 5]),
  captain: statTable(4, [60, 11, 0, 7, 4]),
  rogue: statTable(6, [25, 8, 0, 3, 5]),
  brigandCrossbowman: statTable(3, [20, 9, 0, 2, 6]),
};

// Cada classe do jogo usa a tabela da classe equivalente do Ember. Sentinel não existe no Ember e usa a do Lanceiro;
// o herdeiro usa a do Capitão; camponeses usam Camponês e Aldeã.
const CLASS_TABLE = {
  Warrior: 'swordsman', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'mage', Conjurer: 'conjurer', Healer: 'healer',
  Paladin: 'paladin', 'Heavy Knight': 'heavyKnight', Ranger: 'ranger', Assassin: 'assassin', Sentinel: 'lancer', Templar: 'templar',
  Elementalist: 'elementalist', Warlock: 'warlock', Sorcerer: 'sorcerer', Necromancer: 'necromancer', Bishop: 'bishop', Cleric: 'cleric',
};
const isFemalePeasant = actor => actor.spriteId === 'female-peasant';
function tableFor(actor) {
  if (actor === 'heir') return EMBER_CLASSES.captain;
  if (actor.className === 'Bandit') return EMBER_CLASSES[actor.kind === 'crossbow' ? 'brigandCrossbowman' : 'rogue'];
  if (actor.className === 'Monster') return SKELETON_TABLE;
  if (actor.className === 'Peasant') return EMBER_CLASSES[isFemalePeasant(actor) ? 'villagerF1' : 'peasant1'];
  return EMBER_CLASSES[CLASS_TABLE[actor.prestige] || CLASS_TABLE[actor.className]] || EMBER_CLASSES.swordsman;
}
function attributesAt(table, level) {
  const [hp, atk, mag, def, dex] = table.stats[Math.max(1, Math.min(HEIR_MAX_LEVEL, level)) - 1];
  return { hp, atk, mag, def, dex, mov: table.mov };
}
function attributesHTML(attrs, actor = null) {
  const rows = [['Vida', attrs.hp, 'hp'], ['Ataque', attrs.atk, 'atk'], ['Magia', attrs.mag, 'mag'], ['Defesa', attrs.def, 'def'], ['Destreza', attrs.dex, 'dex'], ['Movimento', attrs.mov, null]];
  return `<div class="sheet-section-label">ATRIBUTOS</div><dl class="attr-grid">${rows.map(([label, value, key]) => { const extra = actor && key ? gearBonus(actor, key) : 0; return `<div><dt>${label}</dt><dd>${value + extra}${extra ? `<small class="attr-bonus">+${extra}</small>` : ''}</dd></div>`; }).join('')}</dl>`;
}
// Monarca: não luta, só usa magia. Atributos MP, CHA, MAG, INT e WIS.
// MAG segue o Mago Negro do Ember (+3 por nível); os outros crescem em linha reta até o nível 30.
const HEIR_STATS = [
  { key: 'MP', name: 'Mana', base: 30, per: 6 },
  { key: 'CHA', name: 'Carisma', base: 8, per: 2 },
  { key: 'MAG', name: 'Magia', base: 10, per: 3 },
  { key: 'INT', name: 'Inteligência', base: 9, per: 2 },
  { key: 'WIS', name: 'Sabedoria', base: 7, per: 2 },
];
function heirAttributesHTML(level) {
  const lv = Math.max(1, Math.min(HEIR_MAX_LEVEL, level));
  return `<div class="sheet-section-label">ATRIBUTOS</div><dl class="attr-grid heir-attrs">${HEIR_STATS.map(stat => { const base = stat.base + stat.per * (lv - 1), extra = monarchBonus(stat.key); return `<div title="${stat.name}: ${base} do nível${extra ? ` + ${extra} do equipamento` : ''}"><dt>${stat.key}</dt><dd>${base + extra}${extra ? `<i>+${extra}</i>` : ''}</dd><small>${stat.name}</small></div>`; }).join('')}</dl>`;
}

function levelHTML(level, xp) {
  const maxed = level >= HEIR_MAX_LEVEL;
  return `<div class="sheet-level">
    <div class="sheet-level-head"><b>Nível ${level}</b><span>de ${HEIR_MAX_LEVEL}</span><small>${maxed ? 'Nível máximo. O tédio também.' : `${xp} / ${xpToNext(level)} XP`}</small></div>
    <div class="xp-bar"><i style="width:${maxed ? 100 : Math.round(xp / xpToNext(level) * 100)}%"></i></div></div>`;
}
// Experiência de heróis e camponeses, na mesma regra do Ember (1 a 30).
function gainActorXp(actor, amount) {
  actor.level = actor.level || 1;
  actor.xp = actor.xp || 0;
  if (actor.level >= HEIR_MAX_LEVEL) return 0;
  actor.xp += amount;
  let gained = 0;
  while (actor.level < HEIR_MAX_LEVEL && actor.xp >= xpToNext(actor.level)) { actor.xp -= xpToNext(actor.level); actor.level++; gained++; }
  if (actor.level >= HEIR_MAX_LEVEL) actor.xp = 0;
  return gained;
}
const PEASANT_EPITHETS = ['Três Dedos', 'Sem Sorte', 'do Brejo', 'da Vala', 'de Ninguém', 'do Poço', 'Olho Torto', 'Dente Mole'];
function peasantName(female) {
  const firsts = FIRST_NAMES.filter((_, i) => (i % 2 === 1) === female);
  const taken = new Set(state.workers.map(worker => worker.name));
  for (let i = 0; i < 40; i++) { const name = `${pick(firsts)} ${pick(PEASANT_EPITHETS)}`; if (!taken.has(name)) return name; }
  return `${pick(firsts)} ${pick(PEASANT_EPITHETS)} ${state.workers.length + 1}`;
}
const actorLabel = actor => actor.className === 'Monster' ? `Caveira · nível ${actor.level || 1}` : actor.className === 'Bandit' ? (actor.kind === 'crossbow' ? 'Ladrão de besta' : 'Ladrão de espada') : actor.className === 'Peasant' ? (isFemalePeasant(actor) ? 'Camponesa' : 'Camponês') : `${actor.className}${actor.prestige ? ` · ${actor.prestige}` : ''}`;
const findActor = id => [...state.heroes, ...state.workers, ...(state.bandits || [])].find(actor => String(actor.id) === String(id)) || null;
function actorOrigin(actor) {
  if (actor.className === 'Bandit') return 'Veio pela estrada velha atrás do que não é dele.';
  if (actor.className === 'Monster') return 'Levantou do cemitério dos Wilds. Ninguém sabe o que quer. Ela também não.';
  if (actor.className === 'Peasant' && homeOf(actor)) return 'Veio morar no casebre. Não tinha pra onde ir mesmo.';
  if (actor.className === 'Peasant') return actor.workplace ? `Veio com ${actor.workplace.type === 'mill' ? 'o moinho' : 'a fazenda'}. Não tinha pra onde ir mesmo.` : 'Veio junto com o casarão, como as dívidas.';
  if (actor.home === 'manor') return 'Veio junto com o casarão. Ninguém lembra de ter contratado.';
  return 'Chegou atraído pelas construções do domínio. Ninguém perguntou de onde.';
}


// ==========================================================================
// Comida e felicidade, no estilo Lords of the Realm: estoque por alimento, ração escolhida
// e cardápio servido. Carne e variedade alegram; ração pequena e fome entristecem.
// ==========================================================================
const FOOD_TYPES = [
  { id: 'flour', name: 'Farinha', art: 'mill-body', mood: 2, note: 'Sai do moinho. Eles que cozinhem em casa.' },
  { id: 'wheat', name: 'Trigo', art: 'farm-wheat', raw: true, note: 'Cru não serve pra nada. Vai pro moinho virar farinha.' },
  { id: 'garlic', name: 'Alho', art: 'farm-garlic', mood: 1, note: 'Afasta strigoi. E todo o resto também.' },
  { id: 'bacon', name: 'Bacon', art: 'farm-bacon', meat: true, mood: 2, note: 'Carne. Deixa os camponeses mais felizes.' },
  { id: 'eggs', name: 'Ovos', art: 'farm-eggs', mood: 1, note: 'Variedade. Os camponeses notam.' },
  { id: 'milk', name: 'Leite', art: 'farm-milk', mood: 1, note: 'Variedade. Às vezes azeda antes.' },
];
const RATIONS = [
  { label: 'Nenhuma', mult: 0, mood: -20 }, { label: 'Meia', mult: 0.5, mood: -8 }, { label: 'Normal', mult: 1, mood: 0 },
  { label: 'Dobrada', mult: 2, mood: 5 }, { label: 'Tripla', mult: 3, mood: 10 },
];
// Imposto: 0% alegra, 10% é neutro, 20% entristece.
const TAX_MAX = 20;
const taxMood = () => Math.round(10 - (state.taxPercent ?? 10));
// Felicidade muda uma vez por semana, à meia-noite do 7º dia: anda até MOOD_WEEKLY_STEP pontos
// na direção da média da semana (50 + efeitos), no estilo de turno do Lords of the Realm.
const MOOD_WEEKLY_STEP = 10;
const moodWeekAverage = () => (state.moodTime > 0 ? state.moodSum / state.moodTime : state.moodTarget ?? state.happiness);
// Calendário: usa o mesmo relógio (state.minutes) e a mesma semana de 7 dias da felicidade.
// Um mês tem 4 semanas e um ano tem 12 meses. O jogo começa no dia 1 do mês 1 do ano 1.
const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_MONTH = DAYS_PER_WEEK * WEEKS_PER_MONTH;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR;
function gameDate(minutes = state.minutes) {
  const days = Math.floor(minutes / 1440);
  return { day: days % DAYS_PER_MONTH + 1, month: Math.floor(days / DAYS_PER_MONTH) % MONTHS_PER_YEAR + 1, year: Math.floor(days / DAYS_PER_YEAR) + 1 };
}
const dateLabel = (minutes = state.minutes) => { const d = gameDate(minutes); return `Dia ${d.day} · Mês ${d.month} · Ano ${d.year}`; };
// Período do dia: madrugada (0h–6h), manhã (6h–12h), tarde (12h–18h), noite (18h–24h).
const DAY_PERIODS = ['Madrugada', 'Manhã', 'Tarde', 'Noite'];
const dayPeriod = (minutes = state.minutes) => DAY_PERIODS[Math.floor((minutes % 1440) / 360)];
// O herdeiro faz aniversário a cada virada de ano: a idade da escolha mais os anos já passados.
const heirAge = (heir, minutes = state.minutes) => heir.age + gameDate(minutes).year - 1;
const BIRTHDAY_MSG = [
  (n, a) => `Ano novo. ${n} fez ${a} anos. A festa foi cancelada por falta de convidados.`,
  (n, a) => `Ano novo. ${n} fez ${a} anos. Os credores mandaram um cartão. Com juros.`,
  (n, a) => `Ano novo. ${n} fez ${a} anos. O espelho foi o primeiro a notar.`,
];
function newYear() {
  const heir = heirById(state.heir);
  if (heir) say(pick(BIRTHDAY_MSG)(heir.name.split(' ')[0], heirAge(heir)), `${heir.name.split(' ')[0]} fez ${heirAge(heir)} anos.`);
}
const nextMoodDay = () => (Math.floor(Math.floor(state.minutes / 1440) / 7) + 1) * 7 + 1;
function applyWeeklyMood() {
  const average = moodWeekAverage();
  const change = Math.round(Math.max(-MOOD_WEEKLY_STEP, Math.min(MOOD_WEEKLY_STEP, average - state.happiness)));
  state.happiness = Math.max(0, Math.min(100, state.happiness + change));
  state.moodSum = 0;
  state.moodTime = 0;
  say(change ? `Fim da semana: felicidade ${change > 0 ? '+' : '−'}${Math.abs(change)}, agora ${Math.round(state.happiness)}. ${change > 0 ? 'Ninguém agradeceu.' : 'Ninguém se surpreendeu.'}` : `Fim da semana: a felicidade ficou em ${Math.round(state.happiness)}.`);
  updateHud();
  if (state.tab === 'food') renderPanel();
}
const emptyFood = () => ({ wheat: 0, flour: 0, garlic: 0, bacon: 0, eggs: 0, milk: 0 });
// O casarão guarda 200 unidades. Cada Depósito de Provisões construído soma 30, e amplia para 45, 70 e 100.
// Guardam comida, armas e itens; madeira e ouro ficam fora.
const MANOR_STORAGE = 200;
const STORAGE_LEVELS = [
  { cap: 30, gold: 0, wood: 0 }, { cap: 45, gold: 80, wood: 6 }, { cap: 70, gold: 140, wood: 10 }, { cap: 100, gold: 220, wood: 16 },
];
const depots = () => state.buildings.filter(building => building.type === 'depot' && isDone(building));
const depotCap = depot => STORAGE_LEVELS[depot.level || 0].cap;
const storageCap = () => MANOR_STORAGE + depots().reduce((sum, depot) => sum + depotCap(depot), 0);
const storedUnits = () => totalFood() + (state.items?.length || 0);
function upgradeDepot(site) {
  const depot = state.buildings.find(building => building.site === site && building.type === 'depot');
  const next = depot && STORAGE_LEVELS[(depot.level || 0) + 1];
  if (!next || depot.underConstruction) return;
  if (state.gold < next.gold || state.timber < next.wood) { say('Falta ouro ou madeira. A comida vai continuar empilhada no corredor.'); return; }
  state.gold -= next.gold;
  state.timber -= next.wood;
  startUpgrade(depot, { kind: 'depot' }, `Ampliação do Depósito para ${next.cap} unidades`);
}
function depotBoxHTML(depot) {
  const level = depot.level || 0;
  const next = STORAGE_LEVELS[level + 1];
  return `<section class="inspector-section"><h4>Ampliação</h4>
    ${next ? `<button type="button" class="hut-upgrade" data-depot-upgrade="${depot.site}">${next.cap} unidades · ${costHTML(next.gold, next.wood)}</button>` : '<p class="storage-items">Tamanho máximo. Agora só falta ter o que guardar.</p>'}</section>`;
}
const totalFood = () => FOOD_TYPES.reduce((sum, food) => sum + (state.food?.[food.id] || 0), 0);
const eaters = () => state.workers.filter(worker => worker.alive).length;

function foodProduction() {
  const prod = emptyFood();
  state.buildings.filter(isDone).forEach(building => {
    if (building.type === 'farm') prod[farmType(building.produce).id] += farmOutput(building);
  });
  return prod;
}
// Moinhos prontos: quanto trigo conseguem moer por segundo, somados.
const millCapacity = () => state.buildings.filter(building => building.type === 'mill' && isDone(building)).reduce((sum, mill) => sum + millRate(mill), 0);
// Cada moinho mói o trigo que os camponeses trouxeram; a farinha espera no moinho até alguém levar ao depósito.
function grindWheat(dt) {
  state.buildings.filter(building => building.type === 'mill' && isDone(building)).forEach(mill => {
    const qty = Math.min(millRate(mill) * (1 + crewWork(mill)) * dt, mill.input || 0, Math.max(0, FARM_STOCK_CAP - (mill.stock || 0)));
    if (qty <= 0) return;
    mill.input -= qty;
    mill.stock = (mill.stock || 0) + qty;
  });
}
// Depósitos onde o camponês descarrega: o casarão e os Depósitos de Provisões prontos.
function nearestStorage(from) {
  const points = [MANOR_DOOR, ...depots()];
  return points.reduce((best, point) => Math.hypot(point.x - from.x, point.y - from.y) < Math.hypot(best.x - from.x, best.y - from.y) ? point : best);
}
function deliverLoad(actor) {
  const load = actor.carrying;
  actor.carrying = null;
  if (!load) return;
  gainSkill(actor, 'hauling', 0.25);
  const put = Math.min(load.qty, Math.max(0, storageCap() - storedUnits()));
  state.food[load.food] = (state.food[load.food] || 0) + put;
  if (put < load.qty - 1e-6 && !state.storageWarned) { state.storageWarned = true; say('O Depósito de Provisões está cheio. O resto da carga apodreceu do lado de fora.'); }
  if (put >= load.qty - 1e-6) state.storageWarned = false;
}
const foodName = id => (FOOD_TYPES.find(food => food.id === id)?.name || id).toLowerCase();
const workPlaceName = building => building.type === 'mill' ? 'no moinho' : building.type === 'lumber' ? 'na Cabana do Lenhador' : building.type === 'quarry' ? 'na Pedreira' : building.type === 'mine' ? 'no Campo de Mineração' : `na ${buildingName(building)}`;
function walkTo(actor, point) {
  routeActor(actor, nearestNode(point));
  actor.finalPoint = { x: point.x, y: Math.min(198, point.y + 1.2) };
}
const isAt = (actor, point) => Math.hypot(actor.x - point.x, actor.y - Math.min(198, point.y + 1.2)) < 1.5;
// Rotina do camponês de fazenda ou moinho: trabalha, carrega a produção ao depósito e volta.
// No moinho ele também busca trigo no depósito e leva a farinha de volta.
function haulRoutine(actor, workplace) {
  const store = nearestStorage(workplace);
  const mill = workplace.type === 'mill';
  if (isAt(actor, workplace)) {
    if (mill && actor.carrying?.food === 'wheat') { workplace.input = (workplace.input || 0) + actor.carrying.qty; actor.carrying = null; }
    if ((workplace.stock || 0) >= 1) {
      const qty = Math.min(carryLoad(actor), workplace.stock);
      workplace.stock -= qty;
      actor.carrying = { food: mill ? 'flour' : farmType(workplace.produce).id, qty };
      actor.task = `Carregando ${format(qty)} de ${foodName(actor.carrying.food)} para o depósito`;
      walkTo(actor, store);
      return;
    }
    if (mill && (state.food.wheat || 0) >= 1 && (workplace.input || 0) < CARRY_LOAD) {
      actor.task = 'Indo buscar trigo no depósito';
      walkTo(actor, store);
      return;
    }
    actor.task = mill ? (workplace.input > 0 ? 'Moendo trigo no moinho' : 'No moinho, esperando trigo') : `Trabalhando ${workPlaceName(workplace)}`;
    if (!mill || workplace.input > 0) gainSkill(actor, SKILL_OF_TYPE[workplace.type], 0.3);
    actor.wait = 3; actor.actionTime = 3; actor.actionClock = 0;
    return;
  }
  if (isAt(actor, store)) {
    if (actor.carrying && (actor.carrying.food !== 'wheat' || !mill)) deliverLoad(actor);
    if (mill && !actor.carrying && (state.food.wheat || 0) >= 0.5) {
      const qty = Math.min(carryLoad(actor), state.food.wheat);
      state.food.wheat -= qty;
      actor.carrying = { food: 'wheat', qty };
    }
  }
  if (actor.carrying && (actor.carrying.food !== 'wheat' || !mill)) {
    actor.task = `Carregando ${format(actor.carrying.qty)} de ${foodName(actor.carrying.food)} para o depósito`;
    walkTo(actor, store);
    return;
  }
  actor.task = actor.carrying ? `Levando ${format(actor.carrying.qty)} de trigo pro moinho` : `Indo trabalhar ${workPlaceName(workplace)}`;
  actor.headingToWork = true;
  walkTo(actor, workplace);
}
// O que o camponês está fazendo agora, para a ficha e o cartão.
function peasantActivity(actor) {
  if (actor.buildSite != null) {
    const site = state.buildings.find(building => building.site === actor.buildSite && needsBuilder(building));
    if (site) return `${site.underConstruction ? 'Construindo' : 'Consertando'} ${buildingName(site)}`;
  }
  if (actor.drinkUntil > state.minutes && openTavern()) return 'Bebendo na taverna';
  return actor.task || 'À toa, esperando trabalho';
}
function producerBoxHTML(building) {
  const level = producerLevel(building);
  const next = PRODUCER_LEVELS[level + 1];
  const mill = building.type === 'mill';
  const rateAt = lv => mill ? MILL_RATE[lv] : farmType(building.produce).grain[lv];
  const unit = mill ? 'de trigo moído em farinha por segundo' : `de ${farmType(building.produce).name.toLowerCase()} por segundo`;
  return `<section class="inspector-section"><h4>Melhoria</h4>
    ${next ? `<button type="button" class="hut-upgrade" data-producer-upgrade="${building.site}">Nível ${level + 2} · ${rateNumber(rateAt(level + 1))}/s · ${costHTML(next.gold, next.wood)}</button>` : '<p class="storage-items">Nível máximo. Mais que isso, só com milagre.</p>'}</section>`;
}
function upgradeProducer(site) {
  const building = state.buildings.find(item => item.site === site && ['farm', 'mill'].includes(item.type) && isDone(item));
  const next = building && PRODUCER_LEVELS[producerLevel(building) + 1];
  if (!next) return;
  if (state.gold < next.gold || state.timber < next.wood) { say('Falta ouro ou madeira. A colheita vai continuar do mesmo tamanho.'); return; }
  state.gold -= next.gold;
  state.timber -= next.wood;
  startUpgrade(building, { kind: 'producer' }, `${buildingName(building)} para o nível ${producerLevel(building) + 2}`);
}
const foodDemand = () => eaters() * WORKER_UPKEEP * RATIONS[state.ration].mult;

function happinessLabel(value) {
  return value < 20 ? 'Revoltados' : value < 40 ? 'Infelizes' : value < 60 ? 'Conformados' : value < 80 ? 'Contentes' : 'Felizes';
}

// Uma vez por segundo de jogo: produz, serve a mesa e anota o alvo de felicidade da semana.
function feedWorkers(dt) {
  state.buildings.filter(building => building.type === 'farm' && isDone(building)).forEach(farm => {
    farm.stock = Math.min(FARM_STOCK_CAP, (farm.stock || 0) + farmOutput(farm) * (1 + crewWork(farm)) * dt);
  });
  grindWheat(dt);
  const ration = RATIONS[state.ration];
  const demand = foodDemand() * dt;
  let remaining = demand;
  const eaten = new Set();
  let pool = FOOD_TYPES.filter(food => !food.raw && state.diet[food.id] && state.food[food.id] > 0);
  for (let pass = 0; pass < 6 && remaining > 1e-9 && pool.length; pass++) {
    const share = remaining / pool.length;
    pool.forEach(food => {
      const take = Math.min(share, state.food[food.id]);
      state.food[food.id] -= take;
      remaining -= take;
      if (take > 0) eaten.add(food.id);
    });
    pool = pool.filter(food => state.food[food.id] > 1e-9);
  }
  const fulfilled = demand > 0 ? (demand - remaining) / demand : 1;
  const parts = eaters() ? {
    ration: ration.mood,
    food: ration.mult > 0 ? [...eaten].reduce((sum, id) => sum + (FOOD_TYPES.find(food => food.id === id)?.mood || 0), 0) : 0,
    tax: taxMood(),
    hunger: demand > 0 ? -Math.round(20 * (1 - fulfilled)) : 0,
  } : { ration: 0, food: 0, tax: 0, hunger: 0 };
  const target = Math.max(0, Math.min(100, 50 + parts.ration + parts.food + parts.tax + parts.hunger));
  // Não muda agora: acumula o alvo para a média da semana (ver applyWeeklyMood).
  state.moodSum = (state.moodSum || 0) + target * dt;
  state.moodTime = (state.moodTime || 0) + dt;
  state.moodParts = parts;
  state.moodTarget = target;
  if (fulfilled < 0.999 && eaters() && !state.hungerWarned) { state.hungerWarned = true; say('A comida não deu pra todo mundo. Os camponeses estão passando fome. Por enquanto, reclamam baixinho.'); }
  if (fulfilled >= 0.999) state.hungerWarned = false;
}

// ==========================================================================
// Tributos e Favor dos nobres. De tempos em tempos um nobre de Mordavia (às vezes o próprio
// Barão das Cinzas) exige um tanto de algum recurso, com prazo. Entregar no prazo dá Favor;
// atrasar tira Favor a cada hora; passado o fim da tolerância, os homens dele vêm buscar
// à força. Com Favor muito baixo, os nobres atacam o domínio.
// ==========================================================================
const FAVOR_ATTACK = 20;
const DEMAND_GRACE = 720; // minutos de atraso tolerados antes de virem buscar
const NOBLES = [
  { id: 'grenholt', name: 'Lorde Anselm Grenholt', house: 'grenholt', title: 'Caçador-Mor das Montanhas', wants: ['bacon', 'timber', 'garlic'],
    lines: ['Diz que é pros cães. Os cães dele comem melhor que seus camponeses.', 'A lua cheia vem aí e a despensa dele esvaziou de um jeito que ninguém comenta.', 'Mandou junto um dente de lobo embrulhado num bilhete. O bilhete diz "lembrança".'],
    paid: 'Lorde Anselm mandou agradecer com um uivo. Pelo menos foi o que o mensageiro disse.', late: 'Lorde Anselm não gosta de esperar. Os cães dele, menos ainda.' },
  { id: 'montalvo', name: 'Dama Severina Montalvo', house: 'montalvo', title: 'Credora de Meio Reino', wants: ['gold', 'flour', 'eggs'],
    lines: ['Ela chama de "juros de cortesia". Você chama de assalto com sotaque.', 'Ela anotou a dívida num livro. Seu nome está em vermelho, sublinhado duas vezes.', 'O tio de vocês devia a ela. Ela fez questão de lembrar que dívida é herança.'],
    paid: 'Dama Severina riscou uma linha do livro. Sobraram só umas quarenta.', late: 'Dama Severina cobra juros sobre o atraso. E juros sobre os juros.' },
  { id: 'lucerna', name: 'Padre-Conde Ottokar Lucerna', house: 'lucerna', title: 'Coveiro da Coroa', wants: ['milk', 'flour', 'timber'],
    lines: ['É pra um velório. Ele não disse de quem. Ainda.', 'Segundo ele, os mortos de Mordavia também precisam comer.', 'É pros caixões, explicou. Perguntou o seu tamanho, por curiosidade.'],
    paid: 'O Padre-Conde rezou pela sua alma. Disse que ela vai precisar.', late: 'O Padre-Conde mandou medir a sua porta. Pra ver se o caixão passa.' },
  { id: 'kastrell', name: 'Baronesa Ilka Kastrell', house: 'kastrell', title: 'Marechal de uma guerra que não veio', wants: ['timber', 'bacon', 'gold'],
    lines: ['Ela abastece um exército pra uma guerra que nunca chega. Os soldados comem do mesmo jeito.', 'Diz que é pras paliçadas. Contra quem, ninguém sabe. Ela sabe.', 'A guerra vai começar a qualquer momento, garante ela. Faz vinte anos.'],
    paid: 'A Baronesa anotou seu nome na lista de aliados. A lista é curta e nervosa.', late: 'A Baronesa considera atraso um ato de guerra. Finalmente, uma guerra.' },
  { id: 'vaelmont', name: 'Tia-Avó Brunhilde Vaelmont', house: 'vaelmont', title: 'Matriarca de uma casa hipotecada', wants: ['eggs', 'milk', 'garlic', 'gold'],
    lines: ['Ela é da família. Isso não é bom sinal.', 'Diz que é pra um chá. Ninguém sobrevive ao chá dela por muito tempo.', 'Exige respeito aos mais velhos. E pontualidade. Principalmente a pontualidade.'],
    paid: 'A Tia-Avó Brunhilde resmungou. Na língua dela, isso é amor.', late: 'A Tia-Avó Brunhilde mencionou o testamento. O seu nome saiu dele.' },
];
const BARON = { id: 'baron', name: 'O Barão das Cinzas', house: null, title: 'Senhor de tudo o que já queimou', baron: true, wants: ['gold', 'flour', 'bacon', 'timber'],
  lines: ['Ninguém viu o rosto dele. Quem viu não comenta. Quem comenta não é mais visto.', 'O mensageiro chegou com o cabelo chamuscado e pediu pra não ser o próximo.', 'A carta veio selada com cera preta. Ainda estava quente.'],
  paid: 'O Barão das Cinzas aceitou o tributo. Ninguém se queimou hoje. Ainda.', late: 'Cheiro de fumaça no vento. O Barão das Cinzas não manda segundo aviso.' };
const DEMAND_BASE = { gold: 30, timber: 15, flour: 15, garlic: 10, bacon: 6, eggs: 8, milk: 8, wheat: 15 };
// Para a cronologia dos herdeiros, um ano ficcional equivale a 360 dias de jogo.
const GAME_YEAR_MINUTES = DAYS_PER_YEAR * 1440; // o mesmo ano do calendário do relógio
const HEIR_PHASE_YEARS = 25;
const heirYearsElapsed = (minutes = state.minutes) => Math.min(75, Math.floor(Math.max(0, minutes) / (GAME_YEAR_MINUTES * HEIR_PHASE_YEARS)) * HEIR_PHASE_YEARS);
const heirPhase = (minutes = state.minutes) => Math.min(4, 1 + Math.floor(heirYearsElapsed(minutes) / HEIR_PHASE_YEARS));
const heirPortraitSrc = (id, phase = 1) => `public/art/${heirById(id)?.portrait || `heir-portraits-v01/${id}`}-phase-${phase}.webp`;
const noblePortraitSrc = (house, phase = heirPhase()) => `public/art/noble-portraits-v01/${house}-phase-${phase}.webp`;
const resourceName = id => id === 'gold' ? 'ouro' : id === 'timber' ? 'madeira' : foodName(id);
const resourceStock = id => id === 'gold' ? (state.testMode ? Infinity : state.gold) : id === 'timber' ? state.timber : (state.food[id] || 0);
const nobleOf = demand => demand.noble === 'baron' ? BARON : NOBLES.find(noble => noble.id === demand.noble) || BARON;
function favorLabel(value) {
  return value < FAVOR_ATTACK ? 'Inimigo' : value < 40 ? 'Mal-visto' : value < 60 ? 'Tolerado' : value < 80 ? 'Bem-visto' : 'Favorito';
}
function changeFavor(amount) { state.favor = Math.max(0, Math.min(100, (state.favor ?? 50) + amount)); }
function newDemand() {
  const baron = Math.random() < 0.15;
  const noble = baron ? BARON : pick(NOBLES);
  const res = pick(noble.wants);
  const day = Math.floor(state.minutes / 1440);
  const qty = Math.round(DEMAND_BASE[res] * (1 + day * 0.15) * (baron ? 2 : 1));
  const demand = { id: `demand-${Date.now()}-${Math.floor(Math.random() * 1000)}`, noble: noble.id, res, qty, line: pick(noble.lines),
    created: state.minutes, due: state.minutes + (baron ? 1080 : 1440), late: false };
  state.demands.push(demand);
  say(`${noble.name} exige ${qty} de ${resourceName(res)} em ${baron ? 18 : 24} horas. ${demand.line}`, `${noble.name} mandou um mensageiro. Veja na aba Economia.`);
  if (state.tab === 'economy') renderPanel();
}
function deliverDemand(id) {
  const demand = state.demands.find(item => item.id === id);
  if (!demand) return;
  const noble = nobleOf(demand);
  if (resourceStock(demand.res) < demand.qty) { say(`Falta ${resourceName(demand.res)}. ${noble.name} não aceita metade. Nem fiado.`); return; }
  if (demand.res === 'gold') { if (!state.testMode) state.gold -= demand.qty; }
  else if (demand.res === 'timber') state.timber -= demand.qty;
  else state.food[demand.res] -= demand.qty;
  const gain = demand.late ? 2 : noble.baron ? 15 : 8;
  changeFavor(gain);
  state.demands = state.demands.filter(item => item !== demand);
  say(`${noble.paid} Favor +${gain}.`);
  updateHud(); renderPanel();
}
// Os homens do nobre vêm buscar o que der e ainda quebram alguma coisa no caminho.
function seizeDemand(demand) {
  const noble = nobleOf(demand);
  const taken = Math.min(demand.qty, Math.max(0, resourceStock(demand.res) === Infinity ? demand.qty : resourceStock(demand.res)));
  if (demand.res === 'gold') { if (!state.testMode) state.gold -= taken; }
  else if (demand.res === 'timber') state.timber -= taken;
  else state.food[demand.res] -= taken;
  changeFavor(noble.baron ? -20 : -10);
  const targets = state.buildings.filter(building => !building.underConstruction && !building.ruined);
  const hits = noble.baron ? 2 : 1;
  for (let i = 0; i < hits && targets.length; i++) {
    const target = targets.splice(Math.floor(Math.random() * targets.length), 1)[0];
    damageBuilding(target, Math.round(buildingMaxHp(target) * (noble.baron ? 0.6 : 0.3)));
  }
  state.demands = state.demands.filter(item => item !== demand);
  say(noble.baron ? `O Barão das Cinzas mandou buscar o tributo. Levaram ${format(taken)} de ${resourceName(demand.res)} e deixaram fogo. Favor −20.`
    : `Os homens de ${noble.name} vieram buscar à força: levaram ${format(taken)} de ${resourceName(demand.res)} e quebraram o que acharam. Favor −10.`);
}
// Com Favor abaixo de FAVOR_ATTACK, uma vez por dia algum nobre manda atacar o domínio.
function nobleRaid() {
  const day = Math.floor(state.minutes / 1440);
  if ((state.favor ?? 50) >= FAVOR_ATTACK || state.lastRaidDay === day) return;
  const targets = state.buildings.filter(building => !building.underConstruction && !building.ruined);
  if (!targets.length) return;
  state.lastRaidDay = day;
  const noble = pick(NOBLES);
  const hits = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < hits && targets.length; i++) {
    const target = targets.splice(Math.floor(Math.random() * targets.length), 1)[0];
    damageBuilding(target, Math.round(buildingMaxHp(target) * (0.25 + Math.random() * 0.25)));
  }
  say(`Os homens de ${noble.name} atacaram o domínio à noite. Com Favor assim, ninguém em Mordavia vai te defender.`);
}
// Uma vez por hora de jogo.
function processDemands() {
  if (!state.demands) state.demands = [];
  if (state.demands.length < 2 && state.minutes >= (state.nextDemandAt ?? 600)) {
    newDemand();
    state.nextDemandAt = state.minutes + 1440 + Math.floor(Math.random() * 1440);
  }
  [...state.demands].forEach(demand => {
    const noble = nobleOf(demand);
    if (!demand.late && state.minutes > demand.due) {
      demand.late = true;
      changeFavor(-5);
      say(`Tributo de ${noble.name} atrasado. ${noble.late} Favor −5, e cai mais a cada hora.`);
    } else if (demand.late) changeFavor(-1);
    if (state.minutes > demand.due + DEMAND_GRACE) seizeDemand(demand);
  });
  nobleRaid();
  updateHud();
}
function demandsHTML() {
  const favor = Math.round(state.favor ?? 50);
  const rows = (state.demands || []).map(demand => {
    const noble = nobleOf(demand);
    const left = demand.due - state.minutes;
    const when = demand.late ? `ATRASADO · vêm buscar em ${Math.max(0, Math.ceil((demand.due + DEMAND_GRACE - state.minutes) / 60))}h` : `${Math.ceil(left / 60)}h de prazo`;
    const enough = resourceStock(demand.res) >= demand.qty;
    return `<div class="demand${demand.late ? ' late' : ''}${noble.baron ? ' baron' : ''}">
      <div class="demand-head">${noble.house ? `<img class="noble-portrait" src="${noblePortraitSrc(noble.house)}" alt="Retrato de ${noble.name}, fase ${heirPhase()} de 4" decoding="async">` : '<span class="baron-seal" aria-hidden="true">B</span>'}<span><b>${noble.name}</b><small>${noble.title}</small></span></div>
      <p>${demand.line}</p>
      <div class="demand-foot"><span><b>${demand.qty} de ${resourceName(demand.res)}</b><small>${when} · você tem ${resourceStock(demand.res) === Infinity ? '∞' : format(resourceStock(demand.res))}</small></span>
        <button type="button" class="hut-upgrade" data-deliver="${demand.id}" ${enough ? '' : 'disabled'}>Entregar</button></div></div>`;
  }).join('');
  return `<div class="econ-block favor-block"><div class="mood-head"><span>FAVOR DOS NOBRES</span><b>${favor}</b><em>${favorLabel(favor)}</em></div>
    <div class="mood-bar favor-bar"><i style="width:${favor}%"></i></div>
    <p class="storage-items">Entregar no prazo: +8 (Barão +15). Atrasar: −5 e −1 por hora. Se não entregar, vêm buscar à força. Abaixo de ${FAVOR_ATTACK}, os nobres atacam o domínio.</p>
    <div class="food-label">TRIBUTOS</div>${rows || '<p class="storage-items">Nenhum nobre lembrou de você hoje. Aproveite.</p>'}</div>`;
}
// ==========================================================================
// Recompensas: você escolhe quanto paga e onde (um ponto do mapa, a patrulha do segundo mapa
// ou as ruínas do covil). O ouro sai do cofre na hora e fica guardado. Ninguém recebe ordem:
// cada herói decide se vale a pena pelo valor, pela distância e pela própria mania.
// Quem cumpre (vigiar o ponto por uma hora de jogo, ou fazer a patrulha inteira) embolsa tudo.
// ==========================================================================
const BOUNTY_GUARD = 60; // minutos de vigia no ponto
const BOUNTY_DAYS = 2; // prazo; vencida, o ouro volta pro cofre
const SOUTH_PATROL = [12, 13, 14, 15, 16, 17, 18, 17, 16, 15, 14, 13, 12];
const BOUNTY_PRESETS = {
  south: { label: 'Patrulha do segundo mapa', route: SOUTH_PATROL, node: 15 },
  lair: { label: 'Vigiar as ruínas do covil', node: 9 },
};
const bountyTaker = bounty => bounty.takenBy != null ? state.heroes.find(hero => String(hero.id) === String(bounty.takenBy) && hero.alive) || null : null;
function bountyLabelAt(x, y) {
  return y > 100 ? 'Vigiar a estrada velha' : x > 75 ? 'Vigiar a borda da floresta' : 'Vigiar este ponto';
}
function createBounty(spec) {
  const reward = Math.max(5, Math.round(state.bountyAmount || 25));
  if (!state.testMode && state.gold < reward) { say(`Falta ouro. Ninguém arrisca o pescoço por promessa.`); return null; }
  if (!state.testMode) state.gold -= reward;
  const node = spec.node ?? nearestNode(spec);
  const point = spec.x != null ? { x: spec.x, y: spec.y } : { x: PATH_NODES[node].x, y: PATH_NODES[node].y };
  const bounty = { id: `bounty-${Date.now()}-${Math.floor(Math.random() * 1000)}`, label: spec.label || bountyLabelAt(point.x, point.y), reward, x: point.x, y: point.y, node,
    route: spec.route || null, target: spec.target || null, takenBy: null, until: state.minutes + BOUNTY_DAYS * 1440 };
  state.bounties.push(bounty);
  renderSites(); renderPanel(); updateHud();
  say(`Recompensa de ${reward} de ouro: ${bounty.label.toLowerCase()}. Agora é ver quem tem coragem. Ou dívida.`);
  return bounty;
}
// Caça: a recompensa fica presa à caveira e vale enquanto ela andar.
function huntBounty(monsterId) {
  const monster = (state.bandits || []).find(actor => actor.id === monsterId && actor.alive);
  if (!monster || state.bounties.some(bounty => bounty.target === monsterId)) return;
  createBounty({ x: monster.x, y: monster.y, target: monster.id, label: `Caçar: ${monster.name}` });
}
const bountyPos = bounty => {
  if (!bounty.target) return bounty;
  const monster = (state.bandits || []).find(actor => actor.id === bounty.target);
  return monster ? { x: monster.x, y: monster.y } : bounty;
};
// Caveira derrubada: quem derrubou embolsa; se não foi herói, quem aceitou; senão o ouro volta.
function payHuntBounty(monster, killer) {
  const bounty = (state.bounties || []).find(item => item.target === monster.id);
  if (!bounty) return '';
  const taker = bountyTaker(bounty);
  const winner = killer && state.heroes.includes(killer) ? killer : taker;
  if (taker) taker.bountyId = null;
  state.bounties = state.bounties.filter(item => item !== bounty);
  if (winner) { lootHero(winner, bounty.reward); return ` ${winner.name} embolsou a recompensa de ${bounty.reward} de ouro.`; }
  if (!state.testMode) state.gold += bounty.reward;
  return ` A recompensa de ${bounty.reward} de ouro voltou pro cofre.`;
}
function cancelBounty(id) {
  const bounty = state.bounties.find(item => item.id === id);
  if (!bounty) return;
  const taker = bountyTaker(bounty);
  if (taker) { taker.bountyId = null; taker.route = []; taker.finalPoint = null; }
  if (!state.testMode) state.gold += bounty.reward;
  state.bounties = state.bounties.filter(item => item !== bounty);
  renderSites(); renderPanel(); updateHud();
  say(`Recompensa cancelada. ${bounty.reward} de ouro voltou pro cofre${taker ? `, e ${taker.name} reclamou do caminho à toa` : ''}.`);
}
function startBountyPlacement() {
  state.selectedBuild = null;
  state.movingSite = null;
  state.placingBounty = true;
  renderSites();
  say(`Toque no mapa onde os heróis devem vigiar. Recompensa: ${state.bountyAmount} de ouro. Esc cancela.`);
}
function cancelBountyPlacement() {
  if (!state.placingBounty) return;
  state.placingBounty = false;
  renderSites();
  say('Nenhuma recompensa marcada. Os heróis nem souberam.');
}
function placeBountyAt(x, y) {
  if (x < 3 || x > 97 || y < 3 || y > 197) { say('Fora do mapa. Nem os heróis vão tão longe.'); return; }
  state.placingBounty = false;
  createBounty({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
}
// O herói pesa o valor contra a distância e o perigo; a mania muda a conta.
function bountyScore(hero, bounty) {
  const pos = bountyPos(bounty);
  const dist = Math.hypot(hero.x - pos.x, hero.y - pos.y);
  const far = bounty.route || pos.y > 100;
  let score = bounty.reward / (10 + dist * 0.3);
  switch (hero.trait) {
    case 'Ganancioso': if (bounty.reward < 40) return 0; score *= 1.5; break;
    case 'Covarde': if (bounty.reward < 20 || (far && bounty.reward < 60)) return 0; score *= 0.6; break;
    case 'Bêbado': score *= 0.7; break;
    case 'Valente': score *= 1.25; break;
    case 'Teimoso': if (Math.random() < 0.5) return 0; score *= 1.2; break;
    default: break;
  }
  if (far) score *= 0.85;
  return score;
}
function considerBounties(hero) {
  if (hpOf(hero) < maxHpOf(hero) * 0.5) return null;
  const open = (state.bounties || []).filter(bounty => !bountyTaker(bounty));
  if (!open.length) return null;
  const best = open.map(bounty => ({ bounty, score: bountyScore(hero, bounty) })).sort((a, b) => b.score - a.score)[0];
  if (!best || best.score < 1) return null;
  best.bounty.takenBy = hero.id;
  best.bounty.leg = 0;
  best.bounty.arrivedAt = null;
  hero.bountyId = best.bounty.id;
  say(`${hero.name} aceitou a recompensa de ${best.bounty.reward} de ouro: ${best.bounty.label.toLowerCase()}.`, `${hero.name} foi atrás do ouro. Do ouro, não de você.`);
  if (state.tab === 'heroes') renderPanel();
  return best.bounty;
}
function completeBounty(hero, bounty) {
  lootHero(hero, bounty.reward);
  hero.bountyId = null;
  state.bounties = state.bounties.filter(item => item !== bounty);
  renderSites();
  if (state.tab === 'heroes') renderPanel();
  say(`${hero.name} cumpriu a recompensa (${bounty.label.toLowerCase()}) e embolsou ${bounty.reward} de ouro.`);
}
// Um passo da recompensa: anda até o ponto (ou pelo roteiro da patrulha) e vigia.
function bountyStep(hero, bounty) {
  if (bounty.target) {
    const monster = (state.bandits || []).find(actor => actor.id === bounty.target && actor.alive);
    if (!monster) return;
    hero.task = bounty.label;
    routeActor(hero, nearestNode(monster));
    hero.finalPoint = { x: monster.x, y: monster.y };
    return;
  }
  if (bounty.route) {
    const node = PATH_NODES[bounty.route[bounty.leg || 0]];
    if (Math.hypot(hero.x - node.x, hero.y - node.y) < 1) {
      bounty.leg = (bounty.leg || 0) + 1;
      if (bounty.leg >= bounty.route.length) { completeBounty(hero, bounty); return; }
    }
    hero.task = `Patrulhando: ${bounty.label}`;
    routeActor(hero, bounty.route[bounty.leg]);
    return;
  }
  if (Math.hypot(hero.x - bounty.x, hero.y - bounty.y) < 1.5) {
    if (bounty.arrivedAt == null) bounty.arrivedAt = state.minutes;
    if (state.minutes - bounty.arrivedAt >= BOUNTY_GUARD) { completeBounty(hero, bounty); return; }
    hero.wait = 2;
    return;
  }
  routeActor(hero, bounty.node);
  hero.finalPoint = { x: bounty.x, y: bounty.y };
}
// Uma vez por hora: recompensa vencida devolve o ouro; herói morto larga a dele.
function processBounties() {
  (state.bounties || []).forEach(bounty => {
    if (bounty.takenBy != null && !bountyTaker(bounty)) { bounty.takenBy = null; bounty.leg = 0; bounty.arrivedAt = null; }
  });
  // Caça cuja caveira sumiu sem ninguém derrubar: o ouro volta.
  (state.bounties || []).filter(bounty => bounty.target && !(state.bandits || []).some(actor => actor.id === bounty.target && actor.alive)).forEach(bounty => {
    if (!state.testMode) state.gold += bounty.reward;
    state.bounties = state.bounties.filter(item => item !== bounty);
  });
  const expired = (state.bounties || []).filter(bounty => !bounty.target && state.minutes > bounty.until && !bountyTaker(bounty));
  expired.forEach(bounty => {
    if (!state.testMode) state.gold += bounty.reward;
    say(`Ninguém quis a recompensa (${bounty.label.toLowerCase()}). ${bounty.reward} de ouro voltou pro cofre, envergonhado.`);
  });
  if (expired.length) { state.bounties = state.bounties.filter(bounty => !expired.includes(bounty)); renderSites(); }
}
function bountyPanelHTML() {
  const amounts = [10, 25, 50, 100];
  const monsters = (state.bandits || []).filter(actor => actor.alive && actor.className === 'Monster');
  const hunts = monsters.filter(monster => !(state.bounties || []).some(bounty => bounty.target === monster.id)).map(monster => {
    const eta = skeletonEta(monster);
    return `<div class="bounty-row monster-row"><span><b>${monster.name}</b><small>nível ${monster.level} · ${eta > 0 ? `chega à cidade em ~${Math.max(1, Math.round(eta / 60))}h` : 'atacando a cidade agora'}</small></span><button type="button" class="hut-upgrade hunt-btn" data-bounty-hunt="${monster.id}">Recompensa · ${state.bountyAmount}</button></div>`;
  }).join('');
  const rows = (state.bounties || []).map(bounty => {
    const taker = bountyTaker(bounty);
    const status = bounty.target ? (taker ? `${taker.name} foi caçar` : 'Ninguém aceitou ainda') : taker ? (bounty.route ? `${taker.name} · trecho ${Math.min(bounty.leg || 0, bounty.route.length)} de ${bounty.route.length}` : bounty.arrivedAt != null ? `${taker.name} vigiando · ${Math.max(0, BOUNTY_GUARD - (state.minutes - bounty.arrivedAt))} min` : `${taker.name} a caminho`) : 'Ninguém aceitou ainda';
    return `<div class="bounty-row"><span><b>${bounty.label}</b><small>${status}${bounty.target ? '' : ` · vence em ${Math.max(0, Math.ceil((bounty.until - state.minutes) / 60))}h`}</small></span><em>${bounty.reward}</em><button type="button" class="bounty-cancel" data-bounty-cancel="${bounty.id}" title="Cancelar e devolver o ouro">×</button></div>`;
  }).join('');
  return `<section class="farm-selector hut-box bounty-box"><div class="farm-selector-heading"><b>Recompensas</b><small>você paga, eles decidem</small></div>
    <div class="bounty-amount"><span>Valor</span>${amounts.map(value => `<button type="button" class="bounty-chip${state.bountyAmount === value ? ' active' : ''}" data-bounty-amount="${value}">${value}</button>`).join('')}<input type="number" min="5" step="5" value="${state.bountyAmount}" data-bounty-input aria-label="Valor da recompensa"></div>
    <div class="guild-branches"><button type="button" class="hut-upgrade" data-bounty-place>${state.placingBounty ? 'Toque no mapa…' : 'Marcar no mapa'}</button><button type="button" class="hut-upgrade" data-bounty-preset="south">Patrulhar o segundo mapa</button></div>
    <button type="button" class="hut-upgrade bounty-lair" data-bounty-preset="lair">Vigiar as ruínas do covil</button>
    <p class="storage-items">O ouro sai do cofre agora. Ganancioso só vai por 40 ou mais; Covarde não vai longe por pouco; Teimoso às vezes nem escuta.</p>
    ${hunts ? `<div class="food-label">CAVEIRAS NA ESTRADA</div><div class="bounty-list">${hunts}</div>` : ''}
    ${rows ? `<div class="bounty-list">${rows}</div>` : ''}</section>`;
}
function renderBountyFlags() {
  const layer = $('#site-layer');
  const ids = new Set((state.bounties || []).filter(bounty => !bounty.target).map(bounty => bounty.id));
  $$('.bounty-flag', layer).filter(flag => !ids.has(flag.dataset.bounty)).forEach(flag => flag.remove());
  (state.bounties || []).filter(bounty => !bounty.target).forEach(bounty => {
    let flag = $(`.bounty-flag[data-bounty="${bounty.id}"]`, layer);
    if (!flag) {
      flag = document.createElement('div');
      flag.className = 'bounty-flag';
      flag.dataset.bounty = bounty.id;
      layer.append(flag);
    }
    flag.style.setProperty('--x', `${bounty.x}%`);
    flag.style.setProperty('--y', `${bounty.y / WORLD_Y_UNITS * 100}%`);
    flag.style.zIndex = String(Math.round(bounty.y * 10) + 2);
    flag.classList.toggle('taken', !!bountyTaker(bounty));
    flag.innerHTML = `<i aria-hidden="true"></i><span>${bounty.reward}</span>`;
    flag.title = `${bounty.label}: ${bounty.reward} de ouro`;
  });
}
// Economia: tudo o que entra e sai, por segundo (comida e madeira) e por dia (ouro).
function economyPanelHTML() {
  const per = value => `${rateNumber(value)}/s`;
  const row = (label, value, note = '') => `<div><dt>${label}${note ? `<small>${note}</small>` : ''}</dt><dd>${value}</dd></div>`;
  const farms = state.buildings.filter(building => building.type === 'farm' && isDone(building));
  const mills = state.buildings.filter(building => building.type === 'mill' && isDone(building));
  const camps = state.buildings.filter(building => building.type === 'lumber' && isDone(building));
  const pits = state.buildings.filter(building => isPit(building) && isDone(building));
  const crewOf = building => state.workers.filter(worker => worker.alive && worker.buildSite == null && (worker.workplace ? worker.workplace.site : worker.jobSite) === building.site).length;
  const produced = emptyFood();
  farms.forEach(farm => { produced[farm.produce] += farmOutput(farm) * (1 + crewWork(farm)); });
  const milling = mills.reduce((sum, mill) => sum + millRate(mill) * (1 + crewWork(mill)), 0);
  const woodRates = camps.map(camp => LUMBER_RATE[lumberCrew(camp).length] * (1 + crewWork(camp)));
  const wood = 0.28 + woodRates.reduce((a, b) => a + b, 0);
  const taxes = dailyTaxEstimate();
  const wages = dailyWages();
  const waiting = farms.reduce((sum, farm) => sum + (farm.stock || 0), 0) + mills.reduce((sum, mill) => sum + (mill.stock || 0), 0);
  return `<div class="panel-title"><h3>Economia</h3><span>${state.testMode ? '∞' : format(state.gold)} de ouro no cofre</span></div>
    ${demandsHTML()}
    <div class="econ-block"><div class="food-label">OURO POR DIA</div><dl class="econ-lines">
      ${row('Impostos', `+${format(taxes - (state.tavernTab || 0) * taxFactor())}`, `${state.taxPercent}%, da bolsa dos camponeses`)}
      ${row('Taverna', `+${format((state.tavernTab || 0) * taxFactor())}`, 'conta de hoje, paga à meia-noite')}
      ${row('Vendas do Arsenal', `+${format(state.armorySales || 0)}`, 'hoje, já no cofre')}
      ${row('Salários', `−${format(wages)}`, `${WORKER_WAGE} por trabalhador`)}
      ${row('<b>Saldo da meia-noite</b>', `<b>${taxes - wages < 0 ? '−' : '+'}${format(Math.abs(taxes - wages))}</b>`)}
    </dl></div>
    <div class="econ-block"><div class="food-label">MADEIRA POR SEGUNDO</div><dl class="econ-lines">
      ${row('Lenha catada no casarão', per(0.28))}
      ${camps.map((camp, i) => row(`Cabana do Lenhador ${camps.length > 1 ? i + 1 : ''}`, per(woodRates[i]), `${lumberCrew(camp).length} de 3 lenhadores`)).join('')}
      ${row('<b>Total</b>', `<b>${per(wood)}</b>`, `${format(state.timber)} no estoque`)}
    </dl></div>
    ${pits.length ? `<div class="econ-block"><div class="food-label">PEDRA E METAL POR SEGUNDO</div><dl class="econ-lines">
      ${pits.map(pit => row(buildingName(pit), `${fineRate(pitRate(pit))}/s de ${PIT_GOODS[pit.type].name}`, `${lumberCrew(pit).length} de ${PIT_CREW_MAX} camponeses`)).join('')}
      ${row('<b>Pedra</b>', `<b>${fineRate(rates().stone)}/s</b>`, `${format(state.stone || 0)} no estoque`)}
      ${row('<b>Metal</b>', `<b>${fineRate(rates().metal)}/s</b>`, `${format(state.metal || 0)} no estoque`)}
    </dl></div>` : ''}
    <div class="econ-block"><div class="food-label">COMIDA POR SEGUNDO</div><dl class="econ-lines">
      ${FOOD_TYPES.filter(food => food.id !== 'flour').map(food => row(food.name, produced[food.id] ? `+${per(produced[food.id])}` : '—', `${format(state.food[food.id] || 0)} no depósito${food.raw ? ' · vai pro moinho' : ''}`)).join('')}
      ${row('Farinha', milling ? `até +${per(milling)}` : '—', `${format(state.food.flour || 0)} no depósito · ${mills.length ? `${mills.length} ${mills.length === 1 ? 'moinho' : 'moinhos'}` : 'sem moinho'}`)}
      ${row('Consumo dos camponeses', `−${per(foodDemand())}`, `${eaters()} bocas · ração ${RATIONS[state.ration].label.toLowerCase()}`)}
      ${row('Esperando carregador', format(waiting), 'nas fazendas e moinhos')}
      ${row('Depósito', `${Math.floor(storedUnits())} / ${storageCap()}`)}
    </dl></div>
    <div class="econ-block"><div class="food-label">POR CONSTRUÇÃO</div><dl class="econ-lines">
      ${[...farms, ...mills].map(building => row(siteLabel(building), building.type === 'mill' ? `${per(millRate(building) * (1 + crewWork(building)))} de trigo` : per(farmOutput(building) * (1 + crewWork(building))),
        `nível ${producerLevel(building) + 1} · ${crewOf(building)} ${crewOf(building) === 1 ? 'trabalhador' : 'trabalhadores'}${crewWork(building) ? ` · +${Math.round(crewWork(building) * 100)}%` : ''} · ${format(building.stock || 0)} esperando`)).join('') || '<p class="storage-items">Nenhuma fazenda ou moinho ainda.</p>'}
    </dl></div>
    <details class="econ-block"><summary class="food-label">CUSTOS PARA CONSTRUIR</summary><dl class="econ-lines">
      ${BUILDINGS.map(building => row(building.name, `${building.cost} ouro · ${building.wood} madeira`)).join('')}
    </dl><p class="storage-items">Custos únicos; melhorias têm seus próprios valores.</p></details>`;
}

function foodPanelHTML() {
  const prod = foodProduction();
  const milling = millCapacity();
  const parts = { ration: 0, food: 0, tax: 0, hunger: 0, ...(state.moodParts || {}) };
  const signed = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`;
  const n = eaters();
  const used = storedUnits();
  const extra = storageCap() - MANOR_STORAGE;
  const storageBox = `<div class="storage-box"><div class="mood-head"><span>DEPÓSITO DE PROVISÕES</span><b>${Math.floor(used)} / ${storageCap()}</b><small>comida, armas e itens</small></div>
      <div class="mood-bar storage-bar"><i style="width:${Math.min(100, Math.round(used / storageCap() * 100))}%"></i></div>
      <p class="storage-items">Casarão: ${MANOR_STORAGE}${depots().length ? ` · ${depots().length} ${depots().length === 1 ? 'depósito' : 'depósitos'}: +${extra}` : ''} · armas e itens guardados: ${state.items?.length || 0}</p>
      ${depots().length ? '' : '<p class="storage-items">Precisa de mais espaço? Construa um Depósito de Provisões.</p>'}</div>`;
  return `${storageBox}<div class="panel-title"><h3>Alimentos e consumo</h3><span>${n} ${n === 1 ? 'boca' : 'bocas'} · ${foodDemand().toFixed(1).replace('.', ',')} por segundo</span></div>
    <div class="food-block"><div class="food-label">RAÇÃO</div>
      <div class="segmented ration">${RATIONS.map((ration, i) => `<button type="button" data-ration="${i}" class="${state.ration === i ? 'active' : ''}"><b>${ration.label}</b><small>${(eaters() * WORKER_UPKEEP * ration.mult).toFixed(1).replace('.', ',')}/s</small><em class="${ration.mood > 0 ? 'mood-up' : ration.mood < 0 ? 'mood-down' : ''}">${ration.mood > 0 ? '+' : ration.mood < 0 ? '−' : ''}${Math.abs(ration.mood)} felicidade</em></button>`).join('')}</div>
      <p class="storage-items">Cada camponês come ${WORKER_UPKEEP.toFixed(1).replace('.', ',')} de provisão por segundo na ração normal. Meia come metade; dobrada, o dobro; tripla, o triplo.</p>
      <p class="ration-effect">Efeito na felicidade do povo: a ração <b>${RATIONS[state.ration].label.toLowerCase()}</b> ${RATIONS[state.ration].mood > 0 ? 'deixa o povo mais feliz' : RATIONS[state.ration].mood < 0 ? 'deixa o povo mais triste' : 'não muda a felicidade'} (${RATIONS[state.ration].mood > 0 ? '+' : RATIONS[state.ration].mood < 0 ? '−' : ''}${Math.abs(RATIONS[state.ration].mood)}). Quanto mais comida, mais feliz o povo, e mais rápido o estoque acaba. Se a comida servida não der para todos, a fome tira até 40.</p></div>
    <div class="food-label">CARDÁPIO</div>
    <div class="food-list">${FOOD_TYPES.map(food => { const on = !!state.diet[food.id]; const stock = state.food[food.id] || 0; return `<div class="food-row${on ? ' on' : ''}${stock <= 0 ? ' empty' : ''}">
        <img src="public/art/${food.art}-v01.webp" alt=""><span class="food-name"><b>${food.name}</b><small>${food.note}</small></span>
        <span class="food-stock"><b>${format(stock)}</b><small>${food.id === 'flour' ? (milling ? `até +${rateNumber(milling)}/s` : 'sem moinho') : prod[food.id] ? `+${rateNumber(prod[food.id])}/s${food.raw && milling ? ` · moinho −${rateNumber(milling)}/s` : ''}` : 'sem produção'}</small></span>
        ${food.raw ? '<button type="button" disabled>PRO MOINHO</button>' : `<button type="button" data-diet="${food.id}" class="${on ? 'on' : ''}">${on ? 'SERVINDO' : 'GUARDADO'}</button>`}</div>`; }).join('')}</div>
    <div class="mood-box"><div class="mood-head"><span>FELICIDADE</span><b>${Math.round(state.happiness)}</b><em>${happinessLabel(state.happiness)}</em><small>média da semana ${Math.round(moodWeekAverage())} · muda no dia ${nextMoodDay()}</small></div>
      <div class="mood-bar"><i style="width:${Math.round(state.happiness)}%"></i></div>
      <dl class="mood-parts"><div><dt>Ração</dt><dd>${signed(parts.ration)}</dd></div><div><dt>Comida</dt><dd>${signed(parts.food)}</dd></div><div><dt>Imposto</dt><dd>${signed(parts.tax)}</dd></div><div><dt>Fome</dt><dd>${signed(parts.hunger)}</dd></div></dl></div>
    <div class="mood-rules"><div class="food-label">O QUE MUDA A FELICIDADE</div>
      <p>A felicidade muda uma vez por semana, à meia-noite do 7º dia: anda até ${MOOD_WEEKLY_STEP} pontos na direção da média da semana, que é 50 somado a estes efeitos:</p>
      <dl>
        <div><dt>Ração</dt><dd>Nenhuma −20 · Meia −8 · Normal 0 · Dobrada +5 · Tripla +10</dd></div>
        <div><dt>Comida</dt><dd>Cada alimento servido soma: alho +1 · farinha +2 · bacon +2 · ovos +1 · leite +1</dd></div>
        <div><dt>Imposto</dt><dd>0% +10 · 5% +5 · 10% 0 · 15% −5 · 20% −10</dd></div>
        <div><dt>Fome</dt><dd>Quando a comida servida não dá pra todos: até −20</dd></div>
      </dl>
      <p>Só conta o que está marcado como SERVINDO e tem estoque. Trigo cru não vai pra mesa: o moinho transforma em farinha.</p></div>`;
}



// ==========================================================================
// Ladrões e combate automático. Ladrões chegam pela estrada velha a cada 6 horas de jogo,
// vão roubar uma construção e fogem. Heróis que os veem lutam sozinhos (idle combat).
// Dano proporcional (ver strike); experiência segue o Ember: 13 + 3 × (nível do alvo − nível de quem bate).
// ==========================================================================
// Caveiras: toda noite, às 22h, o cemitério dos Wilds (ponta sul da estrada velha) solta uma.
// Ela sobe a estrada devagar até a cidade; chegando, ataca as construções até alguém derrubar.
// Mais dura que um Salteador: um herói sozinho do mesmo nível luta parelho; dois resolvem.
const SKELETON_TABLE = statTable(3, [44, 12, 0, 6, 2]);
// Onde a estrada dos Wilds encosta na borda de cima do mapa (um ponto por conjunto de mapas).
const WILDS_ROAD_EXIT = { 1: { x: 57.5, y: 1 }, 2: { x: 64, y: 1 } };
const SKELETON_PATH = [18, 17, 16, 15, 14, 13, 12, 5, 4, 2, 1];
const SKELETON_SPEED = 3.6; // monstros andam no passo dos outros personagens (ladrões: 3,6)
const SKELETON_NAMES = ['do Coveiro Esquecido', 'Sem Lápide', 'da Cova Rasa', 'do Velório Barato', 'Que Ninguém Chorou', 'do Jazigo Vendido', 'da Vala Comum'];
const isHostile = actor => actor.className === 'Bandit' || actor.className === 'Monster';
function spawnSkeleton() {
  const day = Math.floor(state.minutes / 1440) + 1;
  const start = PATH_NODES[SKELETON_PATH[0]];
  state.bandits.push({
    id: `skeleton-${Date.now()}`, className: 'Monster', kind: 'skeleton', spriteId: 'skeleton-v02', mapId: 'city', name: `Caveira ${pick(SKELETON_NAMES)}`,
    level: Math.min(HEIR_MAX_LEVEL, day), alive: true, x: start.x, y: Math.min(198, start.y + 2), leg: 0, mode: 'walk', bornAt: state.minutes,
  });
  say('O cemitério dos Wilds soltou uma caveira. Ela vem subindo a estrada velha, devagar. Dá tempo de pagar alguém pra ir atrás.', 'Uma caveira vem pela estrada velha.');
  if (state.tab === 'heroes') renderPanel();
}
// Quanto falta (em minutos de jogo, na velocidade 1) para a caveira chegar à cidade.

function spawnWolf(lair) {
  const n = (state.bandits || []).filter(actor => actor.kind === 'wolf' && actor.lairId === lair.id).length + 1;
  state.bandits.push({ id: `wolf-${lair.id}-${state.minutes}`, className: 'Monster', kind: 'wolf', spriteId: 'mordavian-wolf-v01', mapId: 'wilds', lairId: lair.id, name: `Lobo mordaviano ${n}`, level: 1, alive: true, x: lair.x, y: lair.y, mode: 'approach-road', bornAt: state.minutes });
  say(`Um novo lobo mordaviano saiu de ${lair.name} e desce em direcao a Estrada Velha.`);
}
function spawnLairCreature(lair) {
  const kind = lair.kind === 'goblin-den' ? 'goblin' : 'troll';
  const spriteId = kind === 'goblin' ? 'mordavian-goblin-v01' : 'mordavian-troll-v01';
  const n = (state.bandits || []).filter(actor => actor.kind === kind && actor.lairId === lair.id).length + 1;
  state.bandits.push({ id: `${kind}-${lair.id}-${state.minutes}`, className: 'Monster', kind, spriteId, mapId: 'wilds', lairId: lair.id, name: `${kind === 'goblin' ? 'Goblin' : 'Troll'} ${n}`, level: lair.level || 1, alive: true, x: lair.x, y: lair.y, mode: 'approach-road', bornAt: state.minutes });
  say(`Um ${kind === 'goblin' ? 'goblin' : 'troll'} saiu de ${lair.name} e avanca pela Estrada Velha.`);
}
function spawnZombie() {
  const lair = (state.lairs || []).find(item => item.active && item.kind === 'cemetery' && item.level === 2);
  if (!lair) return;
  state.bandits.push({ id: `zombie-${Date.now()}`, className: 'Monster', kind: 'zombie', spriteId: 'zombie-v01', mapId: lair.mapId || 'wilds', lairId: lair.id, name: 'Zumbi da cova funda', level: Math.min(HEIR_MAX_LEVEL, Math.floor(state.minutes / 1440) + 1), alive: true, x: lair.x, y: lair.y, mode: 'approach-road', leg: 0, bornAt: state.minutes });
  say('Uma cova funda se abriu. Um zumbi saiu do cemiterio level 2.');
}
function skeletonEta(monster) {
  if (monster.mode !== 'walk') return 0;
  let dist = 0, from = monster;
  for (let i = monster.leg || 0; i < SKELETON_PATH.length; i++) { const node = PATH_NODES[SKELETON_PATH[i]]; dist += Math.hypot(node.x - from.x, node.y - from.y); from = node; }
  return dist / SKELETON_SPEED;
}
function monsterStep(monster, delta, reducedMotion) {
  monster.cooldown = (monster.cooldown || 0) - delta;
  monster.calm = Math.max(0, (monster.calm || 0) - delta);
  const heroes = [...state.heroes, ...(window.Monarch?.allyTargets() || [])].filter(hero => hero.alive && (hero.mapId || 'city') === (monster.mapId || 'city') && distanceTo(monster, hero) < 6);
  const foe = window.Monarch?.tauntTarget(monster) || heroes.sort((x, y) => distanceTo(monster, x) - distanceTo(monster, y))[0] || state.workers.find(worker => worker.alive && (worker.mapId || 'city') === (monster.mapId || 'city') && distanceTo(monster, worker) < 2.5) || null;
  if (foe) {
    if (distanceTo(monster, foe) > MELEE_RANGE) { animateWalk(monster, moveToward(monster, foe, SKELETON_SPEED * delta) > 0, delta, reducedMotion); return; }
    faceToward(monster, foe);
    if (monster.cooldown <= 0) { monster.cooldown = ATTACK_COOLDOWN; monster.attackAnim = 0.5; monster.actionClock = 0; strike(monster, foe); }
    animateAttack(monster, delta, reducedMotion);
    return;
  }
  if (monster.mode === 'approach-road') {
    // Nos Wilds a estrada sobe para a cidade: a saída é a ponta de cima, não a de baixo.
    const entry = { x: PATH_NODES[18].x, y: PATH_NODES[18].y };
    const inWilds = (monster.mapId || 'city') === 'wilds';
    const exit = inWilds ? WILDS_ROAD_EXIT[monster.mapSet === 2 ? 2 : 1] : entry;
    animateWalk(monster, moveToward(monster, exit, SKELETON_SPEED * delta) > 0, delta, reducedMotion);
    if (distanceTo(monster, exit) < 0.5) { monster.mapId = 'city'; monster.mode = 'walk'; monster.leg = 0; monster.x = entry.x; monster.y = entry.y; }
    return;
  }
  if (monster.mode === 'walk') {
    const node = PATH_NODES[SKELETON_PATH[monster.leg || 0]];
    animateWalk(monster, moveToward(monster, node, SKELETON_SPEED * delta) > 0, delta, reducedMotion);
    if (distanceTo(monster, node) < 0.5) {
      monster.leg = (monster.leg || 0) + 1;
      if (monster.leg >= SKELETON_PATH.length) {
        monster.mode = 'siege';
        say(`${monster.name} chegou à cidade e começou a bater nas paredes. Com os ossos.`);
      }
    }
    return;
  }
  // Na cidade: escolhe a construção mais perto e bate até virar ruína.
  let target = monster.targetSite != null ? state.buildings.find(building => building.site === monster.targetSite && !building.ruined && !building.underConstruction) : null;
  if (!target) {
    const options = state.buildings.filter(building => !building.ruined && !building.underConstruction);
    target = options.sort((a, b) => distanceTo(monster, a) - distanceTo(monster, b))[0] || null;
    monster.targetSite = target ? target.site : null;
  }
  const spot = target ? { x: target.x, y: Math.min(198, target.y + 1.2) } : { x: 42, y: 40 };
  if (distanceTo(monster, spot) > 1.5) { animateWalk(monster, moveToward(monster, spot, SKELETON_SPEED * delta) > 0, delta, reducedMotion); return; }
  if (!target) { animateWalk(monster, false, delta, reducedMotion); return; }
  faceToward(monster, target);
  if (monster.cooldown <= 0) {
    monster.cooldown = ATTACK_COOLDOWN * 1.5; monster.attackAnim = 0.5; monster.actionClock = 0;
    damageBuilding(target, Math.round(statsOf(monster).atk * 1.5));
    if (target.ruined) monster.targetSite = null;
  }
  animateAttack(monster, delta, reducedMotion);
}

const RAID_EVERY = 360;                 // minutos de jogo entre bandos
const AGGRO_RANGE = 22;                 // heróis enxergam ladrões até esta distância
const MELEE_RANGE = 2.5;
const SHOT_RANGE = 10;
const ATTACK_COOLDOWN = 1.2;            // segundos de jogo entre golpes
const RANGED_CLASSES = ['Archer', 'Ranger', 'Assassin', 'Black Mage', 'Elementalist', 'Warlock', 'Conjurer', 'Sorcerer', 'Necromancer'];
const MAGIC_CLASSES = ['Black Mage', 'Elementalist', 'Warlock', 'Conjurer', 'Sorcerer', 'Necromancer'];
const HEALER_CLASSES = ['Healer', 'Bishop', 'Cleric'];
const DEATH_MSG = [
  n => `${n} morreu. Deixou dívidas na taverna.`, n => `${n} morreu fazendo o que amava: fugindo devagar demais.`,
  n => `${n} morreu. A família vai receber uma carta. Ou não.`, n => `${n} virou adubo. Os campos agradecem.`, n => `${n} morreu. Era o favorito de ninguém.`,
];
const isBandit = actor => actor.className === 'Bandit';
const classOf = actor => actor.prestige || actor.className;
// Atributos de luta: os da classe no nível, mais o equipamento.
// Invocações do Monarca trazem os próprios atributos (fixedStats); auras e debuffs dele entram por último.
const statsOf = actor => {
  const raw = actor.fixedStats ? { ...actor.fixedStats } : attributesAt(tableFor(actor), actor.level || 1);
  const base = !actor.gear ? raw
    : { ...raw, hp: raw.hp + gearBonus(actor, 'hp'), atk: raw.atk + gearBonus(actor, 'atk'), mag: raw.mag + gearBonus(actor, 'mag'), def: raw.def + gearBonus(actor, 'def'), dex: raw.dex + gearBonus(actor, 'dex') };
  return window.Monarch ? Monarch.statMods(actor, base) : base;
};
const maxHpOf = actor => statsOf(actor).hp;
const hpOf = actor => (actor.hp == null ? maxHpOf(actor) : actor.hp);
const distanceTo = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const raidEntry = () => PATH_NODES[18] || PATH_NODES[9];

function moveToward(actor, target, step) {
  const dx = target.x - actor.x, dy = target.y - actor.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.001) return 0;
  if (actor.kind === 'troll') actor.walkDirection = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 'up' : 'down') : 'side';
  // Lentidão, raízes, atordoamento e pressa vêm das magias do Monarca.
  const move = Math.min(distance, step * (window.Monarch?.moveMul(actor) ?? 1));
  if (move <= 0) return 0;
  actor.x += dx / distance * move;
  actor.y += dy / distance * move;
  actor.facing = dy < -0.2 ? 'back' : dy > 0.2 ? 'front' : (actor.facing || 'front');
  if (Math.abs(dx) > 0.2) actor.side = dx < 0 ? 'left' : 'right';
  return move;
}

function faceToward(actor, target) {
  const dx = target.x - actor.x, dy = target.y - actor.y;
  actor.facing = dy < -0.5 ? 'back' : 'front';
  if (Math.abs(dx) > 0.2) actor.side = dx < 0 ? 'left' : 'right';
}

function animateWalk(actor, moved, delta, reducedMotion) {
  actor.action = 'walk';
  actor.walkClock = (actor.walkClock || 0) + (moved ? delta : 0);
  actor.frame = moved && !reducedMotion ? Math.floor(actor.walkClock * 7) % 4 : 0;
}

function animateAttack(actor, delta, reducedMotion) {
  if ((actor.attackAnim || 0) > 0) {
    actor.attackAnim -= delta;
    actor.action = 'action';
    actor.actionClock = (actor.actionClock || 0) + delta;
    actor.frame = reducedMotion ? 0 : Math.floor(actor.actionClock * 8) % 4;
  } else {
    actor.action = 'walk';
    actor.frame = 0;
  }
}

function checkPrestige(hero, before) {
  if (before < 15 && hero.level >= 15) {
    say(`${hero.name} chegou ao nível 15 e acha que merece mais.`, `${hero.name} procura uma guilda de prestígio. As guildas fingem que não estão.`);
    assignPrestige(hero);
    if (state.tab === 'heroes') renderPanel();
  }
}

function lootText(loot) {
  if (!loot) return 'nada';
  if (loot.gold) return `${loot.gold} de ouro`;
  if (loot.food) return `${loot.food.qty} de ${FOOD_TYPES.find(food => food.id === loot.food.id)?.name.toLowerCase() || 'comida'}`;
  return 'nada';
}

function killActor(victim, killer) {
  if (victim.summon) { window.Monarch?.summonDied(victim); return; }
  victim.alive = false;
  victim.hp = 0;
  if (isBandit(victim)) {
    let back = '';
    if (victim.loot?.gold) { if (!state.testMode) state.gold += victim.loot.gold; back = ` Recuperou ${victim.loot.gold} de ouro.`; }
    if (victim.loot?.food) {
      const qty = Math.min(victim.loot.food.qty, Math.max(0, Math.floor(storageCap() - storedUnits())));
      state.food[victim.loot.food.id] = (state.food[victim.loot.food.id] || 0) + qty;
      if (qty) back = ` Recuperou ${qty} de ${FOOD_TYPES.find(food => food.id === victim.loot.food.id)?.name.toLowerCase()}.`;
    }
    // O que o ladrão tinha no bolso é de quem derrubou: o loot do herói.
    if (killer && !isHostile(killer) && killer.className !== 'Peasant') {
      const coins = 2 + Math.floor(Math.random() * 4) + 2 * (victim.level || 1);
      lootHero(killer, coins);
      back += ` ${killer.name} ficou com ${coins} de ouro do bolso dele.`;
    }
    say(`${killer ? killer.name : 'Alguém'} derrubou ${victim.name}.${back}`, `${victim.name} não volta mais pela estrada velha.`);
  } else if (victim.className === 'Monster') {
    say(`${killer ? killer.name : 'Alguém'} desmontou ${victim.name}. Os ossos voltaram a ser só ossos.${payHuntBounty(victim, killer)}`, `${victim.name} não sobe mais a estrada.`);
  } else if (victim.className === 'Peasant') {
    say(`${victim.name} foi ${isFemalePeasant(victim) ? 'morta' : 'morto'}${killer?.className === 'Monster' ? ' por uma caveira' : ' por ladrões'}. ${pick(['Os outros pediram aumento.', 'A colheita atrasou.', 'Ele tinha nome. Ninguém lembra qual.'])}`);
  } else {
    say(pick(DEATH_MSG)(victim.name), `${victim.name} morreu lutando contra ladrões.`);
  }
  updateHud();
  if (state.tab === 'heroes') renderPanel();
}

// Destreza: quem é mais ágil que o outro desvia mais e acha mais pontos fracos. Iguais: 5%; teto de 30%.
const dexChance = (mine, theirs) => Math.max(0, Math.min(0.3, (40 * mine / Math.max(1, mine + theirs) - 15) / 100));

// Um golpe: dano proporcional (ataque² / (ataque + defesa)), então defesa alta reduz o dano mas nunca zera;
// magia ignora metade da defesa. Destreza dá crítico (×1,5) e esquiva. Heróis ganham experiência a cada golpe, mais 25% quando matam.
function strike(attacker, defender) {
  if (window.Monarch?.blocksAttack(attacker)) return;
  const a = statsOf(attacker), d = statsOf(defender);
  const magic = MAGIC_CLASSES.includes(classOf(attacker));
  const power = magic ? a.mag : a.atk;
  const guard = magic ? d.def / 2 : d.def;
  const raw = power * power / Math.max(1, power + guard);
  // Ordem de Aniquilação: crítico garantido, que também não pode ser esquivado.
  const boost = window.Monarch?.strikeBoost(attacker, defender) || null;
  const crit = boost?.crit || Math.random() < dexChance(a.dex, d.dex);
  const dodged = !boost?.crit && Math.random() < dexChance(d.dex, a.dex);
  let damage = dodged ? 0 : Math.max(1, Math.round(raw * (crit ? 1.5 + (boost?.critBonus || 0) : 1) * (0.8 + Math.random() * 0.4)));
  if (window.Monarch) damage = Monarch.adjustDamage(attacker, defender, damage, magic);
  if (!attacker.alive) return; // refletido pelo Santuário do Trono
  defender.hp = hpOf(defender) - damage;
  defender.calm = 5;
  attacker.calm = 5;
  const killed = defender.hp <= 0;
  if (!isHostile(attacker) && attacker.className !== 'Peasant' && !attacker.summon) {
    let xp = Math.max(1, 13 + 3 * ((defender.level || 1) - (attacker.level || 1)));
    if (killed) xp = Math.floor(xp * 1.25);
    const before = attacker.level || 1;
    gainActorXp(attacker, xp);
    checkPrestige(attacker, before);
  }
  window.Monarch?.afterStrike(attacker, defender, damage, killed);
  if (killed && defender.alive) killActor(defender, attacker);
}

function healHit(healer, patient) {
  const amount = Math.max(1, statsOf(healer).mag);
  patient.hp = Math.min(maxHpOf(patient), hpOf(patient) + amount);
  healer.calm = 5;
  const before = healer.level || 1;
  gainActorXp(healer, 13);
  checkPrestige(healer, before);
}

// Herói: procura ladrão (ou ferido, se for curandeiro) por perto; se achar, larga o resto e luta.
function heroCombatStep(hero, delta, reducedMotion) {
  hero.calm = Math.max(0, (hero.calm || 0) - delta);
  const bandits = (state.bandits || []).filter(bandit => bandit.alive && !bandit.mfx?.convert);
  let target = null, heal = false;
  if (HEALER_CLASSES.includes(classOf(hero))) {
    const wounded = state.heroes.filter(other => other.alive && other !== hero && hpOf(other) < maxHpOf(other) * 0.7 && distanceTo(hero, other) < AGGRO_RANGE);
    if (wounded.length) { target = wounded.sort((x, y) => distanceTo(hero, x) - distanceTo(hero, y))[0]; heal = true; }
  }
  if (!target && bandits.length) {
    const sameMap = bandits.filter(bandit => (bandit.mapId || 'city') === (hero.mapId || 'city'));
    const near = sameMap.filter(bandit => distanceTo(hero, bandit) < AGGRO_RANGE).sort((x, y) => distanceTo(hero, x) - distanceTo(hero, y));
    target = near[0] || sameMap.find(bandit => bandit.id === hero.respondTo) || null;
    if (!target) hero.respondTo = null;
  }
  if (!target) { if (hero.combatTarget) { hero.combatTarget = null; hero.route = []; hero.finalPoint = null; } return false; }
  if (!hero.combatTarget) { hero.route = []; hero.finalPoint = null; hero.wait = 0; }
  hero.combatTarget = target.id;
  hero.cooldown = (hero.cooldown || 0) - delta * (window.Monarch?.attackRate(hero) ?? 1);
  const range = heal ? SHOT_RANGE : RANGED_CLASSES.includes(classOf(hero)) ? SHOT_RANGE : MELEE_RANGE;
  if (distanceTo(hero, target) > range) {
    const moved = moveToward(hero, target, 4.2 * delta);
    animateWalk(hero, moved > 0, delta, reducedMotion);
    return true;
  }
  faceToward(hero, target);
  if (hero.cooldown <= 0) {
    hero.cooldown = ATTACK_COOLDOWN;
    hero.attackAnim = 0.5;
    hero.actionClock = 0;
    if (heal) healHit(hero, target); else strike(hero, target);
  }
  animateAttack(hero, delta, reducedMotion);
  return true;
}

// Camponês: não caça ladrão, mas depois de apanhar revida quem estiver colado nele. Bate fraco.
function peasantDefenseStep(worker, delta, reducedMotion) {
  worker.calm = Math.max(0, (worker.calm || 0) - delta);
  worker.cooldown = (worker.cooldown || 0) - delta;
  if (!worker.calm) return false;
  const foe = (state.bandits || []).filter(bandit => bandit.alive && !bandit.mfx?.convert && distanceTo(worker, bandit) < MELEE_RANGE + 0.5)
    .sort((x, y) => distanceTo(worker, x) - distanceTo(worker, y))[0];
  if (!foe) return false;
  faceToward(worker, foe);
  if (worker.cooldown <= 0) { worker.cooldown = ATTACK_COOLDOWN; worker.attackAnim = 0.5; worker.actionClock = 0; strike(worker, foe); }
  animateAttack(worker, delta, reducedMotion);
  return true;
}

// Ladrão: revida heróis por perto, ataca camponês colado (espada), senão rouba e foge.
function banditStep(bandit, delta, reducedMotion) {
  bandit.cooldown = (bandit.cooldown || 0) - delta;
  bandit.calm = Math.max(0, (bandit.calm || 0) - delta);
  const range = bandit.kind === 'crossbow' ? SHOT_RANGE : MELEE_RANGE;
  const heroes = [...state.heroes, ...(window.Monarch?.allyTargets() || [])].filter(hero => hero.alive && distanceTo(bandit, hero) < (bandit.kind === 'crossbow' ? SHOT_RANGE + 2 : 7));
  // Provocação da Guarda Real: o ladrão só enxerga o guarda.
  let foe = window.Monarch?.tauntTarget(bandit) || heroes.sort((x, y) => distanceTo(bandit, x) - distanceTo(bandit, y))[0] || null;
  if (!foe && bandit.kind === 'sword') foe = state.workers.find(worker => worker.alive && distanceTo(bandit, worker) < 3) || null;
  if (foe) {
    if (distanceTo(bandit, foe) > range) {
      const moved = moveToward(bandit, foe, (bandit.kind === 'crossbow' ? 3.2 : 3.6) * delta);
      animateWalk(bandit, moved > 0, delta, reducedMotion);
      return;
    }
    faceToward(bandit, foe);
    if (bandit.cooldown <= 0) { bandit.cooldown = ATTACK_COOLDOWN; bandit.attackAnim = 0.5; bandit.actionClock = 0; strike(bandit, foe); }
    animateAttack(bandit, delta, reducedMotion);
    return;
  }
  const speed = (bandit.kind === 'crossbow' ? 3.2 : 3.6) * delta;
  if (bandit.mode === 'raid') {
    const goal = bandit.goalSpot;
    const moved = moveToward(bandit, goal, speed);
    animateWalk(bandit, moved > 0, delta, reducedMotion);
    if (distanceTo(bandit, goal) < 0.6) stealFrom(bandit);
  } else {
    const exit = raidEntry();
    const moved = moveToward(bandit, exit, speed);
    animateWalk(bandit, moved > 0, delta, reducedMotion);
    if (distanceTo(bandit, exit) < 0.6) {
      bandit.alive = false;
      bandit.escaped = true;
      say(`${bandit.name} escapou pela estrada velha com ${lootText(bandit.loot)}. Ninguém viu nada. Ninguém nunca vê.`);
    }
  }
}

// "do casarão", "da Taverna", "do Mercado": artigo pelo gênero da construção.
function fromPlace(name) {
  if (name.startsWith('o ')) return `do ${name.slice(2)}`;
  const feminine = ['Fazenda', 'Taverna', 'Guilda', 'Torre', 'Casa', 'Cabana'].includes(name.split(' ')[0]);
  return `${feminine ? 'da' : 'do'} ${name}`;
}

function stealFrom(bandit) {
  const where = bandit.goalName || 'o domínio';
  if (!state.testMode && state.gold >= 1) {
    const amount = Math.min(Math.floor(state.gold), 10 + 5 * (bandit.level || 1));
    state.gold -= amount;
    bandit.loot = { gold: amount };
  } else {
    const richest = FOOD_TYPES.map(food => ({ id: food.id, qty: state.food[food.id] || 0 })).sort((a, b) => b.qty - a.qty)[0];
    const qty = Math.min(10, Math.floor(richest?.qty || 0));
    if (qty > 0) { state.food[richest.id] -= qty; bandit.loot = { food: { id: richest.id, qty } }; }
  }
  bandit.mode = 'flee';
  updateHud();
  say(`${bandit.name} roubou ${lootText(bandit.loot)} ${fromPlace(where)} e está fugindo pela estrada velha.`);
}

// Bando novo: cresce com os dias.
function spawnBandits() {
  const day = Math.floor(state.minutes / 1440) + 1;
  const count = Math.min(4, 1 + Math.floor((day - 1) / 2));
  const level = Math.min(HEIR_MAX_LEVEL, 1 + Math.floor((day - 1) / 2));
  const entry = raidEntry();
  const targets = [{ x: 42, y: 40, name: 'o casarão' }, ...state.buildings.filter(isDone).map(building => ({ x: building.x, y: Math.min(198, building.y + 1.2), name: buildingName(building) }))];
  for (let i = 0; i < count; i++) {
    const kind = Math.random() < 0.4 ? 'crossbow' : 'sword';
    const goal = pick(targets);
    state.bandits.push({
      id: `bandit-${Date.now()}-${i}`, className: 'Bandit', kind, spriteId: kind === 'crossbow' ? 'bandit-crossbow' : 'bandit-sword',
      name: `${kind === 'crossbow' ? 'Besteiro' : 'Salteador'} ${pick(EPITHETS)}`, level, alive: true,
      x: entry.x + (Math.random() * 4 - 2), y: entry.y - i * 1.5, mode: 'raid', goalSpot: { x: goal.x, y: goal.y }, goalName: goal.name,
    });
  }
  say(count === 1 ? 'Um ladrão apareceu na estrada velha. Ele não veio pedir informação.' : `${count} ladrões apareceram na estrada velha. Eles não vieram pedir informação.`);
}

const LAIR_SPAWN_EVERY = 720;
// Chamado às armas: cada inimigo na cidade tem pelo menos um herói indo atrás dele.
// Quem estava bebendo larga o copo; o herói mais perto e livre é o escolhido.
function assignResponders() {
  const heroes = state.heroes.filter(hero => hero.alive && (hero.mapId || 'city') === 'city');
  const enemies = (state.bandits || []).filter(enemy => enemy.alive && (enemy.mapId || 'city') === 'city');
  heroes.forEach(hero => { if (hero.respondTo && !enemies.some(enemy => enemy.id === hero.respondTo)) hero.respondTo = null; });
  enemies.forEach(enemy => {
    if (heroes.some(hero => hero.respondTo === enemy.id || hero.combatTarget === enemy.id)) return;
    const free = heroes.filter(hero => !hero.respondTo && !hero.combatTarget);
    const pick = (free.filter(hero => !hero.bountyId).length ? free.filter(hero => !hero.bountyId) : free)
      .sort((a, b) => distanceTo(a, enemy) - distanceTo(b, enemy))[0];
    if (!pick) return;
    const wasDrinking = pick.drinkUntil > state.minutes;
    pick.respondTo = enemy.id;
    pick.drinkUntil = 0;
    pick.route = []; pick.finalPoint = null; pick.wait = 0;
    if (wasDrinking) say(`${pick.name} largou o copo na taverna e saiu atrás de ${enemy.name}.`);
  });
}
// Uma vez por segundo de jogo: bandos novos, limpeza e recuperação fora de combate.
function combatTick(minutesPassed) {
  assignResponders();
  if (state.nextRaidAt == null) state.nextRaidAt = 720;
  if (state.minutes >= state.nextRaidAt) { spawnBandits(); state.nextRaidAt += RAID_EVERY; }
  const night = Math.floor(state.minutes / 1440);
  if (state.minutes % 1440 >= 1320 && state.lastSkeletonDay !== night && (state.lairs || []).some(lair => lair.active && lair.kind === 'cemetery' && lair.level === 1)) { state.lastSkeletonDay = night; spawnSkeleton(); }
  // Covis ativos soltam um bicho a cada 12 horas de jogo (12 minutos reais na velocidade 1).
  // Saves antigos tinham o próximo marcado para dias depois: puxa para no máximo 12 horas.
  (state.lairs || []).filter(lair => lair.active && ['wolf-den', 'goblin-den', 'troll-den'].includes(lair.kind)).forEach(lair => {
    if (lair.nextSpawnAt == null || lair.nextSpawnAt > state.minutes + LAIR_SPAWN_EVERY) lair.nextSpawnAt = state.minutes + LAIR_SPAWN_EVERY;
    if (state.minutes < lair.nextSpawnAt) return;
    if (lair.kind === 'wolf-den') spawnWolf(lair); else spawnLairCreature(lair);
    lair.nextSpawnAt = state.minutes + LAIR_SPAWN_EVERY;
  });
  if (state.minutes % 1440 >= 1320 && state.lastZombieDay !== night && (state.lairs || []).some(lair => lair.active && lair.kind === 'cemetery' && lair.level === 2)) { state.lastZombieDay = night; spawnZombie(); }
  state.bandits = (state.bandits || []).filter(bandit => bandit.alive);
  [...state.heroes, ...state.workers].filter(actor => actor.alive && actor.hp != null && (actor.calm || 0) <= 0).forEach(actor => {
    actor.hp = Math.min(maxHpOf(actor), actor.hp + maxHpOf(actor) * 0.03 * minutesPassed);
  });
}

// ==========================================================================
// Saves, menus e telas: entrada, continuar, escolher save, opções, debug e pausa.
// ==========================================================================
function readSave(slot) {
  try { const raw = localStorage.getItem(SAVE_KEY(slot)); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function allSaves() {
  return Array.from({ length: SAVE_SLOTS }, (_, i) => ({ slot: i + 1, record: readSave(i + 1) }));
}

function latestSave() {
  return allSaves().filter(entry => entry.record).sort((a, b) => b.record.savedAt - a.record.savedAt)[0] || null;
}

function serializeState() {
  const copy = { ...state, workers: state.workers.map(worker => ({ ...worker, workplace: worker.workplace ? worker.workplace.site : null })) };
  const data = JSON.parse(JSON.stringify(copy));
  data.selectedBuild = null;
  data.movingSite = null;
  data.placingBounty = false;
  return data;
}

function hydrateState(data) {
  const loaded = Object.assign(newGameState(!!data.testMode), data);
  loaded.mapSet = data.mapSet === 2 ? 2 : 1;
  const defaultLairs = newGameState(!!data.testMode).lairs;
  loaded.lairs = defaultLairs.map(base => ({ ...base, mapSet: 1, ...(Array.isArray(data.lairs) ? data.lairs.find(lair => lair.id === base.id) : null) }));
  ['goblin-den-l1', 'troll-den-l1'].forEach(id => { const lair = loaded.lairs.find(item => item.id === id); if (lair) lair.active = true; });
  loaded.buildings.forEach(building => { building.builtAt = 0; });
  if (!data.food) loaded.food = { ...emptyFood(), wheat: data.grain || 0 };
  if (loaded.food.flour == null) loaded.food.flour = 0;
  if (loaded.diet && loaded.diet.flour == null) loaded.diet.flour = true;
  if (!Array.isArray(loaded.items)) loaded.items = [];
  if (!Array.isArray(loaded.bandits)) loaded.bandits = [];
  (loaded.lairs || []).filter(lair => lair.active && ['wolf-den', 'goblin-den', 'troll-den'].includes(lair.kind)).forEach(lair => {
    if (!Number.isFinite(lair.nextSpawnAt)) lair.nextSpawnAt = loaded.minutes + 2880;
  });
  if (data.nextRaidAt == null) loaded.nextRaidAt = loaded.minutes + RAID_EVERY;
  loaded.bandits.forEach(bandit => { bandit.route = []; bandit.finalPoint = null; });
  if (loaded.taxPercent == null) loaded.taxPercent = 10;
  if (loaded.stone == null) loaded.stone = 0;
  if (loaded.metal == null) loaded.metal = 0;
  if (loaded.favor == null) loaded.favor = 50;
  if (!Array.isArray(loaded.demands)) loaded.demands = [];
  if (!Array.isArray(loaded.bounties)) loaded.bounties = [];
  if (loaded.bountyAmount == null) loaded.bountyAmount = 25;
  loaded.placingBounty = false;
  if (loaded.nextDemandAt == null) loaded.nextDemandAt = loaded.minutes + 600;
  loaded.taxPercent = Math.min(TAX_MAX, loaded.taxPercent);
  if (loaded.tavernTab == null) loaded.tavernTab = 0;
  loaded.nextBuildingId = Math.max(loaded.nextBuildingId || 1, ...loaded.buildings.map(building => building.site + 1));
  if (loaded.tab === 'contracts') loaded.tab = 'build';
  loaded.workers.forEach(worker => {
    worker.workplace = worker.workplace == null ? null : loaded.buildings.find(building => building.site === worker.workplace) || null;
  });
  // Saves antigos marcavam todos os heróis recrutados por uma guilda como moradores dela.
  // Mantém um por guilda e transfere os demais para camas disponíveis, sem apagar personagens.
  loaded.buildings.filter(building => isDone(building) && BUILDINGS.some(item => item.id === building.type && item.heroClass)).forEach(guild => {
    const residents = loaded.heroes.filter(hero => hero.alive && hero.guildSite === guild.site);
    residents.slice(1).forEach(hero => {
      hero.recruitedFromSite = guild.site;
      hero.guildSite = null;
      const lodging = loaded.buildings.find(building => isDone(building) && (
        (building.type === 'hotel' && loaded.heroes.filter(other => other.alive && other.homeSite === building.site).length < 4)
        || (building.type === 'tavern' && !loaded.heroes.some(other => other.alive && other.homeSite === building.site))));
      hero.homeSite = lodging?.site ?? null;
    });
  });
  loaded.heroes.filter(hero => hero.alive && hero.guildSite != null
    && !loaded.buildings.some(building => building.site === hero.guildSite && BUILDINGS.some(item => item.id === building.type && item.heroClass)))
    .forEach(hero => {
      hero.recruitedFromSite = hero.recruitedFromSite ?? hero.guildSite;
      hero.guildSite = null;
      if (hero.homeSite == null) {
        const lodging = loaded.buildings.find(building => isDone(building) && (
          (building.type === 'hotel' && loaded.heroes.filter(other => other.alive && other.homeSite === building.site).length < 4)
          || (building.type === 'tavern' && !loaded.heroes.some(other => other.alive && other.homeSite === building.site))));
        hero.homeSite = lodging?.site ?? null;
      }
    });
  [...loaded.heroes, ...loaded.workers].forEach(actor => { actor.route = []; actor.goal = null; actor.wait = 0; actor.finalPoint = null; });
  loaded.selectedBuild = null;
  loaded.movingSite = null;
  loaded.selectedSite = null;
  loaded.selectedActor = null;
  return loaded;
}

function writeSave(slot) {
  if (!slot) return false;
  const ok = writeStore(SAVE_KEY(slot), { version: 1, savedAt: Date.now(), state: serializeState() });
  if (ok) game.lastSaved = Date.now();
  return ok;
}

function deleteSave(slot) {
  try { localStorage.removeItem(SAVE_KEY(slot)); } catch {}
}

const pad2 = n => String(n).padStart(2, '0');
function formatPlayTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h ? `${h} h ${pad2(m)} min` : `${m} min`;
}

function describeSave(record) {
  const s = record.state;
  return {
    day: Math.floor(s.minutes / 1440) + 1,
    clock: `${pad2(Math.floor(s.minutes / 60) % 24)}:${pad2(s.minutes % 60)}`,
    gold: s.testMode ? '∞' : format(s.gold),
    buildings: s.buildings.length,
    heroes: s.heroes.filter(hero => hero.alive).length,
    played: formatPlayTime(s.playSeconds || 0),
    savedAt: new Date(record.savedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
    testMode: !!s.testMode,
  };
}

function saveCard(slot, record) {
  if (!record) return `<div class="save-head"><b>Slot ${slot}</b><span>Vazio</span></div><p class="save-empty">Nenhuma herança registrada. Ainda.</p>`;
  const d = describeSave(record);
  return `<div class="save-head"><b>Slot ${slot}</b>${d.testMode ? '<span class="tag-test">MODO TESTE</span>' : ''}<span>${d.savedAt}</span></div>
    <div class="save-title">${heirById(record.state.heir) ? `${heirById(record.state.heir).name} · ` : ''}Vale do Luto · Cenário 01</div>
    <dl class="save-stats"><div><dt>Dia</dt><dd>${d.day} · ${d.clock}</dd></div><div><dt>Ouro</dt><dd>${d.gold}</dd></div><div><dt>Construções</dt><dd>${d.buildings}</dd></div><div><dt>Heróis</dt><dd>${d.heroes}</dd></div><div><dt>Tempo de jogo</dt><dd>${d.played}</dd></div></dl>`;
}

// Aplica o jogo escolhido na tela e começa a rodar.
function startGame(newState, slot) {
  state = newState;
  game.slot = slot;
  currentMapSet = state.mapSet === 2 ? 2 : 1;
  switchMap('city');
  $('#hero-layer').innerHTML = '';
  $$('.speed-btn').forEach(button => button.classList.toggle('active', Number(button.dataset.speed) === state.speed));
  $('#map-scene').style.setProperty('--mill-spin-duration', `${8 / state.speed}s`);
  $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
  camera.zoom = Math.min(2, Math.max(0, options.startZoom));
  $$('.zoom-btn').forEach(button => { const active = Number(button.dataset.zoom) === camera.zoom; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  closeMenu();
  sizeWorld();
  homeCamera();
  window.Monarch?.reset();
  renderSites(); renderHeroes(); renderPanel(); updateHud();
  $('#event-line').textContent = state.ticks ? 'De volta ao Vale do Luto.' : 'A herança foi aceita. Os credores já estão a caminho.';
  writeSave(slot);
  game.running = true;
}

function newGame(slot, heir) {
  startGame(newGameState(debug.testMode, heir), slot);
  say(debug.testMode ? 'A herança é sua. Modo teste: o ouro não acaba, a desgraça também não.' : 'A herança é sua. Os credores já foram avisados.');
}

function loadGame(slot) {
  const record = readSave(slot);
  if (!record) return;
  startGame(hydrateState(record.state), slot);
  say(`Bem-vindo de volta. Dia ${Math.floor(state.minutes / 1440) + 1}. A fazenda continua horrível.`);
}

function setTestMode(on) {
  debug.testMode = on;
  writeStore(DEBUG_KEY, debug);
  if (!game.slot) return;
  if (on && !state.testMode) { state.stash = { gold: state.gold, timber: state.timber }; state.testMode = true; }
  if (!on && state.testMode) { state.gold = state.stash?.gold ?? 240; state.timber = state.stash?.timber ?? 30; state.stash = null; state.testMode = false; }
  updateHud(); renderPanel();
}

function applyOptions() {
  document.body.classList.toggle('names-always', options.names === 'always');
  document.documentElement.style.setProperty('--mill-sails-image', `url('${buildingImage('mill-sails')}')`);
}

const menu = { stack: [], pending: null };


function segmented(name, value, choices) {
  return `<div class="segmented" role="group">${choices.map(([v, label]) => `<button type="button" data-set="${name}" data-value="${v}" class="${String(v) === String(value) ? 'active' : ''}" aria-pressed="${String(v) === String(value)}">${label}</button>`).join('')}</div>`;
}

const menuMode = () => (game.slot ? 'is-pause' : 'is-title');

const titleLine = 'Dizem que a primeira noite é mais difícil. Dizem muitas coisas.';

function ago(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'agora há pouco';
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  return h < 24 ? `há ${h} h` : `há ${Math.round(h / 24)} dias`;
}

function slotSummary(record) {
  const d = describeSave(record);
  return `Dia ${d.day}, ${d.clock} · ${d.gold} de ouro · ${d.heroes} ${d.heroes === 1 ? 'herói' : 'heróis'} · salvo ${ago(record.savedAt)}`;
}

function economySnapshot(source) {
  const workers = (source.workers || []).filter(worker => worker.alive);
  const buildings = (source.buildings || []).filter(isDone);
  const produced = Object.fromEntries(FOOD_TYPES.map(food => [food.id, 0]));
  buildings.forEach(building => {
    if (building.type === 'farm') produced[farmType(building.produce).id] += farmOutput(building);
    if (building.type === 'mill') produced.flour += millRate(building);
  });
  const ration = RATIONS[source.ration ?? 2] || RATIONS[2];
  const consumption = workers.length * WORKER_UPKEEP * ration.mult;
  const woodRate = 0.28 + buildings.filter(building => building.type === 'lumber').reduce((sum, camp) => {
    const crew = workers.filter(worker => (worker.workplace?.site ?? worker.workplace) === camp.site).length;
    return sum + LUMBER_RATE[Math.min(3, crew)];
  }, 0);
  const factor = (source.taxPercent ?? 10) / 10;
  const workerTax = workers.reduce((sum, worker) => sum + Math.min(purseOf(worker), 2 * factor), 0);
  const wages = workers.length * WORKER_WAGE;
  const tavernTax = (source.tavernTab || 0) * factor;
  const food = source.food || {};
  const stock = FOOD_TYPES.reduce((sum, item) => sum + (food[item.id] || 0), 0);
  const capacity = MANOR_STORAGE + buildings.filter(building => building.type === 'depot').reduce((sum, depot) => sum + STORAGE_LEVELS[depot.level || 0].cap, 0);
  const edible = FOOD_TYPES.filter(item => !item.raw).reduce((sum, item) => sum + produced[item.id], 0);
  return { source, workers: workers.length, buildings: buildings.length, produced, edible, consumption, woodRate, workerTax, wages, tavernTax, taxEstimate: workerTax + tavernTax, stock, capacity };
}

const economyRate = value => `${value.toFixed(2).replace('.', ',')}`;

const SCREENS = {
  title() {
    const latest = latestSave();
    return { cls: 'is-title', html: `<div class="title-screen">
      <div class="title-logo"><h1>Wasteland Farming</h1><p class="title-sub">HERITAGE OF ASHES · A KINGDOM OF MORDAVIA FANTASY SIM</p><p class="title-epigraph">${titleLine}</p><p class="title-version">${GAME_VERSION}</p></div>
      <nav class="menu-list" aria-label="Menu principal">
        ${latest ? '<button type="button" class="primary" data-action="load">Continuar</button>' : ''}
        <button type="button" class="${latest ? '' : 'primary'}" data-action="new">Novo jogo</button>
        ${latest ? '<button type="button" data-action="load">Carregar jogo</button>' : ''}
        <button type="button" data-action="nobles">Nobres</button>
        <button type="button" data-action="options">Opções</button>
        <button type="button" data-action="debug">Debug</button>
      </nav>
      <p class="title-save">${latest ? `Slot ${latest.slot} · ${slotSummary(latest.record)}` : 'Nenhum jogo salvo ainda.'}</p>
      ${debug.testMode ? '<footer class="title-footer"><span class="tag-test">MODO TESTE LIGADO</span></footer>' : ''}
    </div>` };
  },
  economy() {
    const latest = latestSave();
    const source = game.slot ? state : latest?.record?.state || newGameState();
    const e = economySnapshot(source);
    const foodRows = FOOD_TYPES.map(food => `<div><dt>${food.name}${food.raw ? ' · vai pro moinho' : food.id === 'flour' ? ' · do moinho' : ''}</dt><dd>+${economyRate(e.produced[food.id])} /s</dd></div>`).join('');
    const demandRow = `<div><dt>Consumo dos camponeses · ${RATIONS[source.ration ?? 2]?.label || 'Normal'}</dt><dd>−${economyRate(e.consumption)} /s</dd></div>`;
    const costs = BUILDINGS.map(building => `<tr><th>${building.name}</th><td>${building.cost} ouro</td><td>${building.wood} madeira</td></tr>`).join('');
    return { cls: menuMode(), html: `<section class="menu-card economy-card wide">
      <header class="menu-card-head"><span class="eyebrow">${game.slot ? `DIA ${Math.floor(source.minutes / 1440) + 1}` : latest ? 'ÚLTIMO SAVE' : 'REGRAS DO INÍCIO'}</span><h2>Economia do domínio</h2><p>${game.slot ? 'Valores atuais do jogo pausado.' : latest ? 'Valores gravados no save mais recente.' : 'Sem save: mostrando o início da partida. Produção e taxas mudam com as construções e moradores.'}</p></header>
      <div class="economy-metrics"><div><small>OURO DISPONÍVEL</small><b>${source.testMode ? '∞' : format(source.gold || 0)}</b></div><div><small>MADEIRA</small><b>${source.testMode ? '∞' : format(source.timber || 0)}</b><em>+${economyRate(e.woodRate)}/s</em></div><div><small>PROVISÕES EM ESTOQUE</small><b>${format(e.stock)} / ${e.capacity}</b></div><div><small>IMPOSTO CONFIGURADO</small><b>${source.taxPercent ?? 10}%</b></div></div>
      <div class="economy-columns"><section><h3>Provisões por segundo</h3><dl class="economy-list">${foodRows}${demandRow}<div class="economy-net"><dt>Saldo líquido atual</dt><dd>${e.edible - e.consumption >= 0 ? '+' : '−'}${economyRate(Math.abs(e.edible - e.consumption))} /s</dd></div></dl></section>
        <section><h3>Ouro na próxima cobrança</h3><dl class="economy-list"><div><dt>Camponeses · ${e.workers} × ${economyRate(2 * ((source.taxPercent ?? 10) / 10))} por dia</dt><dd>+${economyRate(e.workerTax)}</dd></div><div><dt>Conta da taverna acumulada</dt><dd>+${economyRate(e.tavernTax)}</dd></div><div><dt>Salários · ${e.workers} × ${WORKER_WAGE}</dt><dd>−${economyRate(e.wages)}</dd></div><div class="economy-net"><dt>Estimativa da próxima coleta</dt><dd>≈ ${economyRate(e.taxEstimate)} ouro</dd></div></dl><p class="economy-note">Impostos são recolhidos à meia-noite do jogo. A taverna depende de quem bebe e de quanto tempo ficou.</p></section></div>
      <section class="economy-costs"><h3>Gasto para construir</h3><div class="economy-table-wrap"><table><thead><tr><th>Construção</th><th>Ouro</th><th>Madeira</th></tr></thead><tbody>${costs}</tbody></table></div><p class="economy-note">Esses são custos únicos de construção. Melhorias têm custo próprio; comida é o consumo contínuo. Construções não geram ouro.</p></section>
      <div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar</button></div>
    </section>` };
  },
  continue() {
    const latest = latestSave();
    if (!latest) return SCREENS.title();
    return { cls: 'is-title', html: `<section class="menu-card">
      <header class="menu-card-head"><span class="eyebrow">CONTINUAR</span><h2>A fazenda continua horrível</h2><p>Mas continua sua.</p></header>
      <div class="save-slot static"><div class="slot-main">${saveCard(latest.slot, latest.record)}</div></div>
      <div class="menu-actions"><button type="button" class="primary" data-action="load-slot" data-slot="${latest.slot}">Continuar</button><button type="button" data-action="load">Outros saves</button><button type="button" data-action="back">Voltar</button></div>
    </section>` };
  },
  // Um menu de saves só, com a mesma cara de onde for aberto. Vindo de Novo jogo, qualquer slot começa um jogo novo;
  // vindo de Continuar ou Carregar, jogo salvo continua e espaço vazio começa um novo.
  saves({ mode }) {
    const fresh = mode === 'new';
    const slots = allSaves().map(({ slot, record }) => {
      const side = record ? `<span class="slot-actions"><button type="button" class="slot-delete" data-action="new-slot" data-slot="${slot}">Novo jogo</button><button type="button" class="slot-delete" data-action="delete-slot" data-slot="${slot}">Apagar</button></span>` : '';
      return `<div class="save-slot${record ? '' : ' empty'}${game.slot === slot ? ' current' : ''}"><button type="button" class="slot-main" data-action="${record && !fresh ? 'load-slot' : 'new-slot'}" data-slot="${slot}">${saveCard(slot, record)}</button>${side}</div>`;
    }).join('');
    return { cls: menuMode(), html: `<section class="menu-card wide">
      <header class="menu-card-head"><span class="eyebrow">SAVES</span><h2>Jogos salvos</h2><p>${fresh ? 'Clique num espaço para começar um jogo novo nele.' : 'Clique num jogo para continuar. Clique num espaço vazio para começar um novo.'}</p></header>
      <div class="save-list">${slots}</div>
      <div class="menu-actions"><button type="button" data-action="back">Voltar</button></div>
    </section>` };
  },
  intro({ slot, heir }) {
    const occupied = !!readSave(slot);
    return { cls: 'is-title', html: `<section class="menu-card wide intro">
      <header class="menu-card-head"><span class="eyebrow">CENÁRIO 1 · A HERANÇA</span><h2>Wasteland Farming</h2>
        <p class="lead">Seu tio morreu e deixou a fazenda pra você. Ninguém da família quis. Agora você vai descobrir por quê.</p></header>
      <p class="goal"><b>Objetivo:</b> juntar 600 moedas. O antigo dono deixou dívidas, e elas cobram juros.</p>
      <ul class="how">
        <li><b>Casebres</b> trazem camponeses. Eles trabalham nas fazendas e moinhos e comem. Na aba <b>Provisões</b> você escolhe a ração e o que servir. Carne deixa todo mundo mais feliz.</li>
        <li><b>Guildas, taverna e hotel</b> trazem heróis. Você não manda neles. Eles fazem o que querem.</li>
        <li>Escolha a construção e <b>toque onde quiser</b> no mapa. Onde não dá, ela fica vermelha. <b>Esc</b> cancela.</li>
        <li>Toda construção é uma <b>obra</b>: um camponês precisa trabalhar dois minutos no local.</li>
        <li><b>Ladrões</b> chegam pela estrada velha a cada 6 horas. Heróis que os veem lutam sozinhos e ganham experiência com isso.</li>
        <li>O <b>ouro</b> vem dos impostos, cobrados à meia-noite: dos camponeses e de quem bebe na taverna.</li>
        <li><b>Esc</b> ou <b>MENU</b> pausa e salva.</li>
      </ul>
      ${debug.testMode ? '<p class="title-save"><b class="test-text">Modo teste ligado: ouro e madeira infinitos.</b></p>' : ''}
      <div class="menu-actions"><button type="button" class="primary" data-action="accept" data-slot="${slot}">Aceitar a herança</button><button type="button" data-action="back">Voltar</button></div>
    </section>` };
  },
  heir({ slot, selected }) {
    const card = (heir, i) => `<button type="button" class="heir-card${i === selected ? ' selected' : ''}" data-action="pick-heir" data-index="${i}" aria-pressed="${i === selected}">
        <img class="heir-card-portrait" src="${heirPortraitSrc(heir.id)}" alt="Retrato jovem de ${heir.name}"><b>${heir.name.split(' ')[0]}</b><small>${HOUSES[heir.house].name.replace(/^Casa /, '')} · ${heir.age}</small></button>`;
    const men = HEIRS.map((heir, i) => ({ heir, i })).filter(entry => entry.heir.gender === 'm');
    const women = HEIRS.map((heir, i) => ({ heir, i })).filter(entry => entry.heir.gender === 'f');
    const chosen = HEIRS[selected];
    const house = HOUSES[chosen.house];
    return { cls: 'is-title', html: `<section class="menu-card heir-screen">
      <header class="menu-card-head"><span class="eyebrow">NOVO JOGO</span><h2>Quem herda o Vale do Luto?</h2><p>Ninguém da família quis. Escolha quem vai ser obrigado.</p></header>
      <div class="heir-layout">
        <div class="heir-pick">
          <div class="heir-row-label">HERDEIROS</div>
          <div class="heir-grid">${men.map(entry => card(entry.heir, entry.i)).join('')}</div>
          <div class="heir-row-label">HERDEIRAS</div>
          <div class="heir-grid">${women.map(entry => card(entry.heir, entry.i)).join('')}</div>
        </div>
        <div class="heir-detail">
          <img class="heir-detail-portrait" src="${heirPortraitSrc(chosen.id)}" alt="${chosen.name}, fase jovem">
          <span class="eyebrow">${house.name.toUpperCase()}</span><h3>${chosen.name}</h3><p class="heir-motto">“${house.motto}”</p>
          <p>${chosen.about}</p><p class="heir-tie">${chosen.age} anos · ${chosen.tie}</p>
        </div>
      </div>
      <div class="menu-actions"><button type="button" class="primary" data-action="choose-heir" data-slot="${slot}">Escolher ${chosen.name.split(' ')[0]}</button><button type="button" data-action="back">Voltar</button></div>
    </section>` };
  },
  // Nobres e linhagens: a mesma lista que ficava na aba NOBRES do jogo, agora na entrada, com a casa de cada um.
  nobles() {
    const houseNobles = NOBLES.map(noble => ({ name: noble.name, title: noble.title, house: noble.house, src: noblePortraitSrc(noble.house, 1), gender: ['grenholt', 'lucerna'].includes(noble.house) ? 'm' : 'f' }));
    const heirs = HEIRS.filter(heir => !heir.portrait).map(heir => ({ name: heir.name, title: heir.tie, house: heir.house, src: heirPortraitSrc(heir.id, 1), gender: heir.gender }));
    const all = [...houseNobles, ...heirs];
    const men = all.filter(entry => entry.gender === 'm').length;
    const card = entry => `<article class="noble-roster-card"><img src="${entry.src}" alt="${entry.name}"><div class="noble-roster-copy"><b>${entry.name}</b><small>${entry.title}</small><small class="noble-house">${HOUSES[entry.house].name} · “${HOUSES[entry.house].motto}”</small></div></article>`;
    return { cls: 'is-title', html: `<section class="menu-card nobles-screen">
      <header class="menu-card-head"><span class="eyebrow">NOBRES</span><h2>Nobres e linhagens</h2><p>${all.length} personagens · ${men} homens · ${all.length - men} mulheres.</p></header>
      <div class="noble-roster">${all.map(card).join('')}</div>
      <div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar</button></div>
    </section>` };
  },
  sheet() {
    const heir = heirById(state.heir);
    if (!heir) return { cls: 'is-pause', html: `<section class="menu-card"><header class="menu-card-head"><span class="eyebrow">FICHA DO HERDEIRO</span><h2>Herdeiro desconhecido</h2><p>Este save é de antes da escolha de herdeiros. Ninguém lembra quem assinou a herança.</p></header><div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar ao jogo</button></div></section>` };
    const house = HOUSES[heir.house];
    const phase = heirPhase();
    const elapsed = heirYearsElapsed();
    return { cls: 'is-pause', html: `<section class="menu-card sheet">
      <div class="sheet-close-row"><button type="button" class="sheet-close" data-action="resume" aria-label="Fechar ficha" title="Fechar ficha">×</button></div>
      <div class="sheet-top"><img class="sheet-portrait" src="${heirPortraitSrc(heir.id, phase)}" alt="${heir.name}, fase ${phase}">
        <div><span class="eyebrow">FICHA DO HERDEIRO · FASE ${phase} DE 4</span><h2>${heir.name}</h2><p class="heir-motto">${house.name} · “${house.motto}”</p><p class="heir-age">${heirAge(heir)} anos · ${elapsed ? `${elapsed} anos de Ember` : 'sem corrupção de Ember'}</p></div></div>
      <div class="sheet-level">
        <div class="sheet-level-head"><b>Nível ${state.heirLevel}</b><span>de ${HEIR_MAX_LEVEL}</span><small>${state.heirLevel >= HEIR_MAX_LEVEL ? 'Nível máximo. O tédio também.' : `${state.heirXp} / ${xpToNext(state.heirLevel)} XP`}</small></div>
        <div class="xp-bar"><i style="width:${state.heirLevel >= HEIR_MAX_LEVEL ? 100 : Math.round(state.heirXp / xpToNext(state.heirLevel) * 100)}%"></i></div>
      </div>
      ${heirAttributesHTML(state.heirLevel)}
      ${window.Monarch ? Monarch.sheetHTML() : ''}
      <dl class="sheet-facts">
        <div><dt>Idade</dt><dd>${heirAge(heir)} anos</dd></div>
        <div><dt>Parentesco</dt><dd>${heir.tie}</dd></div>
      </dl>
      <p class="sheet-about">${heir.about}</p>
      <div class="sheet-section-label">EQUIPAMENTO</div>
      <div class="equip-grid">${EQUIP_SLOTS.map(({ slot, label }) => { const item = ITEMS[(state.equipment || BASIC_EQUIPMENT())[slot]]; return `<div class="equip-slot" title="${item ? `${item.about}${Object.keys(item.bonus || {}).length ? ` (${monarchBonusText(item.bonus)})` : ''}` : 'Vazio'}">${item ? pixelIcon(item.icon, 28) : ''}<span><small>${label}${item?.tier ? ` · T${item.tier}` : ''}</small><b>${item ? item.name : 'Vazio'}</b></span></div>`; }).join('')}</div>
    </section>` };
  },
  actor({ id }) {
    const actor = findActor(id);
    if (!actor) return { cls: 'is-pause', html: `<section class="menu-card"><header class="menu-card-head"><span class="eyebrow">FICHA</span><h2>Não está mais aqui</h2><p>Foi embora, morreu ou as duas coisas.</p></header><div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar ao jogo</button></div></section>` };
    const level = actor.level || 1;
    return { cls: 'is-pause', html: `<section class="menu-card sheet">
      <div class="sheet-close-row"><button type="button" class="sheet-close" data-action="resume" aria-label="Fechar ficha" title="Fechar ficha">×</button></div>
      <div class="sheet-top"><img class="sheet-portrait" src="public/art/portraits/${actorPortrait(actor)}-portrait-v01.webp" alt="">
        <div><span class="eyebrow">FICHA · ${actor.className === 'Monster' ? 'MONSTRO' : actor.className === 'Bandit' ? 'LADRÃO' : actor.className === 'Peasant' ? 'SERVO' : 'PROTETOR'}</span><h2>${actor.name}</h2><p class="heir-motto">${actorLabel(actor)}</p></div></div>
      ${levelHTML(level, actor.xp || 0)}
      <p class="sheet-house">Vida agora: ${Math.ceil(hpOf(actor))} de ${maxHpOf(actor)}</p>
      ${attributesHTML(attributesAt(tableFor(actor), level), actor)}
      ${actor.trait ? `<p class="sheet-about"><b>${actor.trait}.</b> ${TRAITS[actor.trait] || ''}</p>` : ''}
      ${actor.className === 'Peasant' ? `<dl class="info-lines sheet-work"><div><dt>Profissão</dt><dd>${professionName(actor)}</dd></div><div><dt>Trabalha</dt><dd>${workplaceOf(actor) ? siteLabel(workplaceOf(actor)) : 'Em lugar nenhum'}</dd></div><div><dt>Mora</dt><dd>${homeOf(actor) ? siteLabel(homeOf(actor)) : 'Casarão'}</dd></div><div><dt>Agora</dt><dd>${peasantActivity(actor)}</dd></div>${actor.carrying ? `<div><dt>Carregando</dt><dd>${format(actor.carrying.qty)} de ${foodName(actor.carrying.food)}</dd></div>` : ''}<div><dt>Bolsa</dt><dd>${format(purseOf(actor))} de ouro · salário ${WORKER_WAGE} por dia</dd></div></dl>` : `<dl class="info-lines sheet-work"><div><dt>Bolsa</dt><dd>${format(purseOf(actor))} de ouro, ganho no loot</dd></div></dl>`}
      ${actor.className === 'Peasant' ? `<div class="sheet-section-label">HABILIDADES</div><dl class="skill-grid">${SKILLS.map(skill => { const value = skillOf(actor, skill.id); return `<div${PROFESSIONS[actor.profession]?.skill === skill.id ? ' class="main"' : ''}><dt>${skill.name}</dt><dd><i style="width:${value}%"></i></dd><small>${Math.floor(value)}</small></div>`; }).join('')}</dl>` : ''}
      ${gearHTML(actor)}
      <p class="sheet-house">${actorOrigin(actor)}</p>
    </section>` };
  },
  scenarioEnd({ servants, protectors }) {
    const heir = heirById(state.heir);
    const workers = state.workers.filter(worker => worker.alive);
    const heroes = state.heroes.filter(hero => hero.alive);
    const needS = Math.min(2, workers.length), needP = Math.min(3, heroes.length);
    const pickCard = (actor, kind, chosen) => `<button type="button" class="retinue-card${chosen.includes(String(actor.id)) ? ' selected' : ''}" data-action="toggle-retinue" data-kind="${kind}" data-id="${actor.id}">
        <img src="public/art/portraits/${actorPortrait(actor)}-portrait-v01.webp" alt=""><span><b>${actor.name}</b><small>${actorLabel(actor)} · Nível ${actor.level || 1}</small></span></button>`;
    const ready = servants.length === needS && protectors.length === needP;
    return { cls: 'is-pause', html: `<section class="menu-card wide retinue">
      <header class="menu-card-head"><span class="eyebrow">FIM DO CENÁRIO 1 · A HERANÇA</span><h2>O Vale do Luto paga as próprias dívidas</h2>
        <p>Por enquanto. Escolha quem segue com ${heir ? heir.name.split(' ')[0] : 'você'} para o castelo. O resto fica. Ninguém vai chorar.</p></header>
      <div class="heir-row-label">SERVOS · ${servants.length} DE ${needS}</div>
      <div class="retinue-grid">${workers.map(worker => pickCard(worker, 's', servants)).join('') || '<p class="save-empty">Nenhum servo sobrou.</p>'}</div>
      <div class="heir-row-label">PROTETORES · ${protectors.length} DE ${needP}</div>
      <div class="retinue-grid">${heroes.map(hero => pickCard(hero, 'p', protectors)).join('') || '<p class="save-empty">Nenhum protetor sobrou.</p>'}</div>
      <div class="menu-actions"><button type="button" class="primary" data-action="confirm-retinue" ${ready ? '' : 'disabled'}>Seguir para o castelo</button></div>
    </section>` };
  },
  retinueDone() {
    const r = state.retinue || { servants: [], protectors: [] };
    const names = list => list.map(actor => `<li><b>${actor.name}</b> · ${actorLabel(actor)} · Nível ${actor.level || 1}</li>`).join('');
    return { cls: 'is-pause', html: `<section class="menu-card">
      <header class="menu-card-head"><span class="eyebrow">COMITIVA FORMADA</span><h2>Quem segue com você</h2><p>O castelo do próximo cenário vai abrigar a comitiva. Ele ainda está sendo erguido. Os pedreiros prometeram. Pedreiros prometem muito.</p></header>
      <div class="heir-row-label">SERVOS</div><ul class="retinue-list">${names(r.servants) || '<li>Ninguém.</li>'}</ul>
      <div class="heir-row-label">PROTETORES</div><ul class="retinue-list">${names(r.protectors) || '<li>Ninguém.</li>'}</ul>
      <div class="menu-actions"><button type="button" class="primary" data-action="resume">Continuar no Vale do Luto</button><button type="button" data-action="save-quit">Voltar ao menu principal</button></div>
    </section>` };
  },
  confirm({ title, text, confirmLabel, danger }) {
    return { cls: menuMode(), html: `<section class="menu-card">
      <header class="menu-card-head"><span class="eyebrow">CONFIRMAR</span><h2>${title}</h2><p>${text}</p></header>
      <div class="menu-actions"><button type="button" class="${danger ? 'danger' : 'primary'}" data-action="confirm-yes">${confirmLabel}</button><button type="button" data-action="back">Cancelar</button></div>
    </section>` };
  },
  options() {
    return { cls: menuMode(), html: `<section class="menu-card">
      <header class="menu-card-head"><span class="eyebrow">OPÇÕES</span><h2>Opções</h2></header>
      <div class="option-list">
        <div class="option-row"><div><b>Som</b><small>Música e efeitos do jogo.</small></div>${segmented('sound', options.sound, [[1, 'Ligado'], [0, 'Desligado']])}</div>
        <div class="option-row"><div><b>Salvar sozinho</b><small>Salva o jogo de tempos em tempos e quando você fecha a página.</small></div>${segmented('autosave', options.autosave, [[0, 'Desligado'], [1, '1 min'], [3, '3 min'], [5, '5 min']])}</div>
        <div class="option-row"><div><b>Zoom ao começar</b><small>Ampla, normal ou próxima. Dá pra trocar no mapa a qualquer hora.</small></div>${segmented('startZoom', options.startZoom, [[0, 'Ampla'], [1, 'Normal'], [2, 'Próxima']])}</div>
        <div class="option-row"><div><b>Nomes dos personagens</b><small>Eles têm nome. Ninguém lembra qual.</small></div>${segmented('names', options.names, [['selected', 'Ao tocar'], ['always', 'Sempre']])}</div>
        <div class="option-row"><div><b>Aparência das construções</b><small>Só troca a arte. Não altera produção, custos, regras nem saves.</small></div>${segmented('buildingArtStyle', options.buildingArtStyle, [['dark', 'Escura'], ['color', 'Colorida']])}</div>
      </div>
      <div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar</button></div>
    </section>` };
  },
  debug() {
    const used = allSaves().filter(entry => entry.record).length;
    return { cls: menuMode(), html: `<section class="menu-card">
      <header class="menu-card-head"><span class="eyebrow">DEBUG</span><h2>Ferramentas de teste</h2><p>Pra trapacear a morte com responsabilidade.</p></header>
      <div class="option-list">
        <div class="option-row"><div><b>Modo teste</b><small>Ouro e madeira infinitos. A economia finge que não viu. Vale para novos jogos e para o jogo aberto.</small></div>${segmented('testMode', debug.testMode ? 1 : 0, [[0, 'Desligado'], [1, 'Ligado']])}</div>
        <div class="option-row"><div><b>Apagar todos os saves</b><small>Remove os ${SAVE_SLOTS} slots deste navegador.</small></div><button type="button" class="danger small" data-action="wipe" ${used ? '' : 'disabled'}>Apagar</button></div>
      </div>
      <dl class="debug-info"><div><dt>Versão</dt><dd>${GAME_VERSION}</dd></div><div><dt>Slots usados</dt><dd>${used} / ${SAVE_SLOTS}</dd></div><div><dt>Jogo aberto</dt><dd>${game.slot ? `Slot ${game.slot}${state.testMode ? ' · teste' : ''}` : 'Nenhum'}</dd></div></dl>
      <div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar</button></div>
    </section>` };
  },
  pause() {
    const day = Math.floor(state.minutes / 1440) + 1;
    const clock = `${pad2(Math.floor(state.minutes / 60) % 24)}:${pad2(state.minutes % 60)}`;
    return { cls: 'is-pause', html: `<section class="menu-card narrow">
      <header class="menu-card-head"><span class="eyebrow">DIA ${day} · ${clock}</span><h2>Pausado</h2></header>
      <nav class="menu-list compact" aria-label="Menu de pausa">
        <button type="button" class="primary" data-action="resume">Voltar ao jogo</button>
        <button type="button" data-action="save">Salvar</button>
        <button type="button" data-action="load">Carregar jogo</button>
        <button type="button" data-action="options">Opções</button>
        <button type="button" data-action="debug">Debug</button>
        <button type="button" data-action="quit">Voltar ao menu principal</button>
      </nav>
    </section>` };
  },
  quit() {
    return { cls: 'is-pause', html: `<section class="menu-card narrow">
      <header class="menu-card-head"><span class="eyebrow">SAIR</span><h2>Voltar ao menu principal?</h2><p>O que não foi salvo vai ser perdido. A fazenda não vai sentir sua falta.</p></header>
      <nav class="menu-list compact">
        <button type="button" class="primary" data-action="save-quit">Salvar e sair</button>
        <button type="button" data-action="quit-nosave">Sair sem salvar</button>
        <button type="button" data-action="back">Cancelar</button>
      </nav>
    </section>` };
  },
};

function renderMenu() {
  const current = menu.stack[menu.stack.length - 1];
  if (!current) return;
  const { cls, html } = SCREENS[current.name](current.params || {});
  const layer = $('#menu-layer');
  layer.className = `menu-layer ${cls}${current.name === 'sheet' || current.name === 'actor' ? ' sheet-open' : ''}`;
  layer.hidden = false;
  $('#menu-panel').innerHTML = html;
  fitMenu();
  $('#menu-panel button:not([disabled])')?.focus({ preventScroll: true });
}

// A tela de menu encolhe o mínimo necessário para caber na altura da janela, sem rolagem.
// Escolha de herdeiro e Nobres não encolhem (as fotos ficariam minúsculas): essas rolam.
function fitMenu() {
  $('#menu-layer').scrollTop = 0;
  const card = $('#menu-panel').firstElementChild;
  if (!card || card.classList.contains('sheet') || card.classList.contains('heir-screen') || card.classList.contains('nobles-screen')) return;
  card.style.zoom = '';
  const layer = $('#menu-layer');
  const pad = parseFloat(getComputedStyle(layer).paddingTop) + parseFloat(getComputedStyle(layer).paddingBottom);
  const available = window.innerHeight - pad - 6;
  let zoom = 1;
  for (let i = 0; i < 4; i++) {
    const height = card.getBoundingClientRect().height;
    if (height <= available || zoom <= 0.5) break;
    zoom = Math.max(0.5, zoom * available / height - 0.005);
    card.style.zoom = zoom.toFixed(3);
  }
}

function showScreen(name, params = {}) {
  menu.stack.push({ name, params });
  game.running = false;
  renderMenu();
}

function closeMenu() {
  menu.stack = [];
  $('#menu-layer').hidden = true;
  if (game.slot) game.running = true;
}

function goBack() {
  if (menu.stack.length > 1) { menu.stack.pop(); renderMenu(); return; }
  if (game.slot) closeMenu();
}

function openPause() {
  if (!game.slot) return;
  menu.stack = [];
  showScreen('pause');
}

function confirmThen(params, onConfirm) {
  menu.pending = onConfirm;
  showScreen('confirm', params);
}

function toTitle() {
  game.slot = null;
  game.running = false;
  menu.stack = [];
  showScreen('title');
}

function initMenus() {
  applyOptions();
  $('#menu-panel').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    const slot = Number(button.dataset.slot);
    if (button.dataset.set) {
      const name = button.dataset.set;
      const raw = button.dataset.value;
      const value = Number.isNaN(Number(raw)) ? raw : Number(raw);
      if (name === 'testMode') setTestMode(value === 1);
      else {
        options[name] = value;
        writeStore(OPTIONS_KEY, options);
        applyOptions();
        if (name === 'buildingArtStyle') { renderSites(); renderPanel(); }
      }
      renderMenu();
      return;
    }
    switch (button.dataset.action) {
      case 'continue': showScreen('continue'); break;
      case 'new': showScreen('saves', { mode: 'new' }); break;
      case 'load': showScreen('saves', { mode: 'load' }); break;
      case 'nobles': showScreen('nobles'); break;
      case 'economy': showScreen('economy'); break;
      case 'options': showScreen('options'); break;
      case 'debug': showScreen('debug'); break;
      case 'back': goBack(); break;
      case 'resume': closeMenu(); break;
      case 'load-slot':
        if (game.slot && game.slot !== slot) confirmThen({ title: `Carregar o slot ${slot}?`, text: `O jogo aberto vai ser salvo no slot ${game.slot} antes. Por precaução, não por otimismo.`, confirmLabel: 'Carregar' }, () => { writeSave(game.slot); loadGame(slot); });
        else loadGame(slot);
        break;
      case 'new-slot':
        if (readSave(slot)) confirmThen({ title: `Novo jogo no slot ${slot}?`, text: 'O jogo que está lá some pra sempre.', confirmLabel: 'Começar novo', danger: true }, () => { menu.stack.pop(); showScreen('heir', { slot, selected: 0 }); });
        else showScreen('heir', { slot, selected: 0 });
        break;
      case 'pick-heir': case 'pick-noble': menu.stack[menu.stack.length - 1].params.selected = Number(button.dataset.index); renderMenu(); break;
      case 'choose-heir': showScreen('intro', { slot, heir: HEIRS[menu.stack[menu.stack.length - 1].params.selected].id }); break;
      case 'accept': newGame(slot, menu.stack[menu.stack.length - 1].params.heir); break;
      case 'delete-slot':
        confirmThen({ title: `Apagar o slot ${slot}?`, text: 'Esse jogo some pra sempre. Como a família anterior.', confirmLabel: 'Apagar', danger: true }, () => {
          deleteSave(slot);
          if (game.slot === slot) { toTitle(); return; }
          menu.stack.pop();
          renderMenu();
        });
        break;
      case 'wipe':
        confirmThen({ title: 'Apagar todos os saves?', text: 'Todos os jogos salvos deste navegador serão apagados. Um recomeço limpo, coisa rara em Mordavia.', confirmLabel: 'Apagar tudo', danger: true }, () => {
          for (let i = 1; i <= SAVE_SLOTS; i++) deleteSave(i);
          toTitle();
        });
        break;
      case 'toggle-retinue': {
        const params = menu.stack[menu.stack.length - 1].params;
        const list = button.dataset.kind === 's' ? params.servants : params.protectors;
        const cap = button.dataset.kind === 's' ? 2 : 3;
        const id = button.dataset.id;
        if (list.includes(id)) list.splice(list.indexOf(id), 1); else if (list.length < cap) list.push(id);
        renderMenu();
        break;
      }
      case 'confirm-retinue': {
        const params = menu.stack[menu.stack.length - 1].params;
        const copy = actor => { const { workplace, route, finalPoint, ...rest } = actor; return JSON.parse(JSON.stringify(rest)); };
        const selected = [...params.servants, ...params.protectors].map(findActor).filter(Boolean);
        selected.forEach(actor => { actor.mapSet = 2; });
        state.mapSet = 2;
        currentMapSet = 2;
        switchMap(currentMap);
        state.retinue = { scenario: 1, servants: params.servants.map(findActor).filter(Boolean).map(copy), protectors: params.protectors.map(findActor).filter(Boolean).map(copy) };
        renderSites(); renderHeroes();
        writeSave(game.slot);
        menu.stack = [];
        showScreen('retinueDone');
        break;
      }
      case 'confirm-yes': { const run = menu.pending; menu.pending = null; run?.(); break; }
      case 'save': say(writeSave(game.slot) ? 'Jogo salvo.' : 'Não deu pra salvar. O navegador recusou.'); renderMenu(); break;
      case 'quit': showScreen('quit'); break;
      case 'save-quit': writeSave(game.slot); toTitle(); break;
      case 'quit-nosave': toTitle(); break;
    }
  });
  $('#menu-btn').addEventListener('click', openPause);
  $('#economy-open-btn').addEventListener('click', () => {
    state.tab = 'economy';
    $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
    renderPanel();
  });
  ['#grain', '#happiness'].forEach(sel => $(sel).closest('.stat').addEventListener('click', () => {
    if (!game.slot) return;
    state.tab = 'food';
    $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
    renderPanel();
  }));
  $('#favor').closest('.stat').addEventListener('click', () => {
    if (!game.slot) return;
    state.tab = 'economy';
    $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
    renderPanel();
  });
  $('#sheet-btn').addEventListener('click', () => { if (!game.slot) return; menu.stack = []; showScreen('sheet'); });
  // Clique fora de qualquer menu fecha o menu. No jogo, volta pro jogo; sem jogo aberto, volta pra tela de entrada.
  // A tela de entrada e o fim de cenário (que pede uma escolha) não fecham.
  $('#menu-layer').addEventListener('click', event => {
    // Só conta clique no fundo: um botão que acabou de trocar a tela já saiu da página e não é clique fora.
    if (!event.target.isConnected || event.target.closest('#menu-panel > *')) return;
    const top = menu.stack[menu.stack.length - 1]?.name;
    if (!top || top === 'title' || top === 'scenarioEnd') return;
    menu.pending = null;
    if (game.slot) closeMenu();
    else { menu.stack = []; showScreen('title'); }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!$('#menu-layer').hidden) {
      const top = menu.stack[menu.stack.length - 1]?.name;
      if (top === 'title') return;
      event.preventDefault();
      if (top === 'scenarioEnd') return;
      if (['pause', 'sheet', 'actor', 'retinueDone'].includes(top)) closeMenu(); else goBack();
    } else if (state.selectedBuild) {
      cancelPlacement();
    } else if (state.movingSite != null) {
      cancelMove();
    } else if (state.placingBounty) {
      cancelBountyPlacement();
    } else if (state.selectedSite != null) {
      state.selectedSite = null; state.demolishArmed = null;
      renderSites(); renderPanel();
    } else {
      event.preventDefault();
      openPause();
    }
  });
  window.addEventListener('resize', () => { if (!$('#menu-layer').hidden) fitMenu(); });
  window.addEventListener('pagehide', () => { if (game.slot && options.autosave) writeSave(game.slot); });
  showScreen('title');
}

function init() {
  initCamera();
  const scene = $('#map-scene');
  // O menu da construção fica em cima do mapa: cliques, arrasto e rolagem nele não mexem no mapa.
  ['pointerdown', 'click', 'wheel', 'contextmenu'].forEach(type => $('#site-inspector').addEventListener(type, event => event.stopPropagation()));
  scene.addEventListener('pointermove', event => { if (state.selectedBuild || state.movingSite != null) showPlacementPreview(event); });
  scene.addEventListener('pointerleave', () => { $('#placement-preview').hidden = true; });
  scene.addEventListener('contextmenu', event => {
    if (state.selectedBuild) { event.preventDefault(); cancelPlacement(); }
    else if (state.movingSite != null) { event.preventDefault(); cancelMove(); }
    else if (state.placingBounty) { event.preventDefault(); cancelBountyPlacement(); }
  });
  scene.addEventListener('click', event => {
    // Clique no mapa fora de construções e personagens fecha o menu da construção.
    if (state.selectedSite != null && state.movingSite == null && !state.selectedBuild && !state.placingBounty && !camera.dragMoved && !event.target.closest('button')) {
      state.selectedSite = null; state.demolishArmed = null;
      renderSites(); renderPanel();
      return;
    }
    if ((!state.selectedBuild && state.movingSite == null && !state.placingBounty) || camera.dragMoved || event.target.closest('button')) return;
    const { x, y } = worldPoint(event);
    if (state.placingBounty) placeBountyAt(x, y);
    else if (state.movingSite != null) moveBuilding(x, y); else placeBuilding(x, y);
  });
  $('#site-layer').addEventListener('click', event => {
    const site = event.target.closest('.site');
    if (!site) return;
    const idx = Number(site.dataset.site);
    const building = state.buildings.find(item => item.site === idx);
    if (state.movingSite != null) { if (idx === state.movingSite) cancelMove(); else say('Aqui já tem construção. Escolha outro lugar.'); }
    else if (state.selectedBuild) say('Aqui já tem construção. Escolha outro lugar.');
    else if (building && building.underConstruction) {
      const worker = building.builderId != null ? findActor(building.builderId) : null;
      say(`${buildingName(building)}: em obra, ${Math.floor((building.progress || 0) / BUILD_TIME * 100)}%. ${worker ? `${worker.name} está trabalhando.` : 'Esperando um camponês livre.'}`);
    } else if (building) {
      state.selectedBuild = null;
      state.selectedSite = idx;
      const def = BUILDINGS.find(item => item.id === building.type);
      state.demolishArmed = null;
      renderSites();
      if (def.id === 'farm') state.selectedFarmType = farmType(building.produce).id;
      renderPanel();
      $('#site-inspector').scrollTop = 0;
      if (def.id === 'market') {
        say('Mercado: venda o que sobra, compre o que falta.');
      } else if (def.id === 'hut' || def.id === 'depot' || def.id === 'lumber') {
        say(def.id === 'lumber' ? `Cabana do Lenhador: ${lumberCrew(building).length} de 3 camponeses. Escale no painel.` : def.id === 'depot' ? `Depósito de Provisões: ${depotCap(building)} unidades. Dá pra ampliar no painel.` : building.big ? 'Casebre Grande: cinco moradores, nenhuma privacidade.' : 'Casebre Pequeno: dá pra ampliar no painel.');
      } else if (def.heroClass || def.id === 'farm' || def.id === 'mill') {
        if (def.id === 'mill') say(`Moinho, nível ${producerLevel(building) + 1}: mói ${rateNumber(millRate(building))} de trigo em farinha por segundo. Dá pra melhorar no painel.`);
        else say(def.id === 'farm' ? `Fazenda de ${farmType(building.produce).name}, nível ${producerLevel(building) + 1}: troque a produção ou melhore no painel.` : `${def.name}: atualize ou especialize no painel.`, def.id === 'farm' ? `A fazenda está produzindo ${farmType(building.produce).name.toLowerCase()}.` : `${def.name} está aberta. A localização afeta quem a procura.`);
      } else say(def.id === 'tavern' ? 'Taverna: o imposto vem de quem passa o tempo livre bebendo aqui.' : def.grain ? `${def.name}: produz provisões.` : `${def.name}.`);
    }
  });
  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    state.tab = tab.dataset.tab;
    $$('.tab').forEach(other => { const active = other === tab; other.classList.toggle('active', active); other.setAttribute('aria-selected', String(active)); });
    renderPanel();
  }));
  $$('.speed-btn').forEach(button => button.addEventListener('click', () => {
    state.speed = Number(button.dataset.speed);
    $('#map-scene').style.setProperty('--mill-spin-duration', `${8 / state.speed}s`);
    $$('.speed-btn').forEach(other => other.classList.toggle('active', other === button));
    say(`Velocidade do domínio: ${state.speed}×.`, `A rotina agora corre a ${state.speed}×.`);
  }));
  const setTax = step => {
    state.taxPercent = Math.max(0, Math.min(TAX_MAX, state.taxPercent + step));
    updateHud();
    say(`Imposto em ${state.taxPercent}%. Cobrado à meia-noite.`, state.taxPercent >= 15 ? `Imposto em ${state.taxPercent}%. Os camponeses aprenderam palavras novas.` : `Imposto em ${state.taxPercent}%.`);
  };
  $('#tax-down').addEventListener('click', () => setTax(-5));
  $('#tax-up').addEventListener('click', () => setTax(5));
  renderSites(); renderHeroes(); renderPanel(); updateHud();
  setInterval(tick, 1000);
  requestAnimationFrame(animateActors);
  initMenus();
}

init();

// Desenvolvimento em localhost: quando o código do jogo muda, salva a partida, recarrega e volta nela sozinho.
(function liveReload() {
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  const RESUME_KEY = 'mordavia.resume';
  try {
    const resume = Number(sessionStorage.getItem(RESUME_KEY));
    sessionStorage.removeItem(RESUME_KEY);
    if (resume && readSave(resume)) loadGame(resume);
  } catch {}
  let seen = null;
  setInterval(async () => {
    try {
      const stamp = await (await fetch('/__version', { cache: 'no-store' })).text();
      if (seen === null) { seen = stamp; return; }
      if (stamp === seen) return;
      if (game.slot) { writeSave(game.slot); sessionStorage.setItem(RESUME_KEY, String(game.slot)); }
      location.reload();
    } catch {}
  }, 1500);
})();
