const BUILDINGS = [
  { id: 'farm', name: 'Fazenda', glyph: 'F', cost: 115, wood: 6, detail: 'Alho, trigo, bacon, ovos ou leite. Os camponeses trabalham aqui.', gold: 0.55, grain: 2.4, people: 0 },
  { id: 'mill', name: 'Moinho', glyph: 'M', cost: 155, wood: 10, detail: 'Mói o grão e engorda as provisões. As pás giram; a vila, nem tanto.', gold: 0.4, grain: 1.8, people: 0 },
  { id: 'hut', name: 'Casebre Pequeno', glyph: 'C', cost: 60, wood: 4, detail: 'Moradia para 2 camponeses. Amplia para Casebre Grande, com 5. Eles não tinham pra onde ir mesmo.', gold: 0, grain: 0, people: 0, housing: 2 },
  { id: 'depot', name: 'Depósito de Provisões', glyph: 'D', cost: 70, wood: 6, detail: 'Guarda mais 30 unidades de comida, armas e itens. Amplia para 45, 70 e 100. Os ratos aprovam.', gold: 0, grain: 0, people: 0 },
  { id: 'lumber', name: 'Cabana do Lenhador', glyph: 'L', cost: 80, wood: 2, detail: 'Coloque de 1 a 3 camponeses para cortar lenha: 0,1, 0,3 ou 0,5 de madeira por segundo.', gold: 0, grain: 0, people: 0 },
  { id: 'market', name: 'Mercado', glyph: 'M', cost: 100, wood: 6, detail: 'Venda o que sobra e compre o que falta. Os mercadores cobram o dobro pra vender e pagam a metade pra comprar.', gold: 0, grain: 0, people: 0 },
  { id: 'tavern', name: 'Taverna', glyph: 'T', cost: 145, wood: 9, detail: 'Heróis e camponeses bebem aqui no tempo livre, e a taverna paga imposto por isso. Atrai andarilhos sem perguntar de onde vêm.', gold: 1.15, grain: 0, people: 0 },
  { id: 'hotel', name: 'Hotel de Estrada', glyph: 'H', cost: 170, wood: 11, detail: 'Mais 4 camas para heróis. Os lençóis são trocados uma vez por viúva.', gold: 0.85, grain: 0, people: 0 },
  { id: 'warrior', name: 'Guilda de Guerreiros', glyph: 'W', cost: 185, wood: 11, detail: 'Recruta Warriors. Seguram a linha de frente na força.', heroClass: 'Warrior', gold: 0.3, grain: 0, people: 1 },
  { id: 'archer', name: 'Salão de Arqueiros', glyph: 'A', cost: 170, wood: 10, detail: 'Recruta Archers. Decidem a luta de longe.', heroClass: 'Archer', gold: 0.3, grain: 0, people: 1 },
  { id: 'lancer', name: 'Pátio dos Lanceiros', glyph: 'L', cost: 175, wood: 11, detail: 'Recruta Lancers. A lança chega antes da espada.', heroClass: 'Lancer', gold: 0.3, grain: 0, people: 1 },
  { id: 'blackMage', name: 'Torre dos Magos', glyph: 'M', cost: 210, wood: 12, detail: 'Recruta Black Mages. Magia que explode em área. Eles também morrem fácil.', heroClass: 'Black Mage', gold: 0.2, grain: 0, people: 1 },
  { id: 'conjurer', name: 'Casa dos Conjuradores', glyph: 'C', cost: 200, wood: 12, detail: 'Recruta Conjurers. Chegam sozinhos e lutam acompanhados.', heroClass: 'Conjurer', gold: 0.2, grain: 0, people: 1 },
  { id: 'healer', name: 'Guilda de Curandeiros', glyph: 'H', cost: 180, wood: 10, detail: 'Recruta Healers. Mantêm os heróis vivos. Por um tempo.', heroClass: 'Healer', gold: 0.25, grain: 0, people: 1 },
  { id: 'armory', name: 'Arsenal do Domínio', glyph: 'E', cost: 165, wood: 9, detail: 'Heróis compram equipamento aqui.', gold: 0.15, grain: 0, people: 0 },
];
const FARM_TYPES = [
  { id: 'garlic', name: 'Alho', art: 'farm-garlic', grain: 1.6, gold: 0.9 },
  { id: 'wheat', name: 'Trigo', art: 'farm-wheat', grain: 2.4, gold: 0.55 },
  { id: 'bacon', name: 'Bacon', art: 'farm-bacon', grain: 2.1, gold: 0.75 },
  { id: 'eggs', name: 'Ovos', art: 'farm-eggs', grain: 2.0, gold: 0.65 },
  { id: 'milk', name: 'Leite', art: 'farm-milk', grain: 2.2, gold: 0.6 },
];
const farmType = id => FARM_TYPES.find(type => type.id === id) || FARM_TYPES[1];
const rateNumber = value => value.toFixed(2).replace('.', ',');

const PRESTIGE = {
  Warrior: ['Paladin', 'Heavy Knight'], Archer: ['Ranger', 'Assassin'], Lancer: ['Sentinel', 'Templar'],
  'Black Mage': ['Elementalist', 'Warlock'], Conjurer: ['Sorcerer', 'Necromancer'], Healer: ['Bishop', 'Cleric'],
};
const GUILD_FOR = { Warrior: 'warrior', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'blackMage', Conjurer: 'conjurer', Healer: 'healer' };
const CLASS_ART = { Warrior: 'warrior', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'black-mage', Conjurer: 'conjurer', Healer: 'healer', Peasant: 'peasant' };
const PORTRAIT_ART = { Warrior: 'warrior', Archer: 'archer', Lancer: 'lancer', 'Black Mage': 'black-mage', Conjurer: 'conjurer', Healer: 'healer' };
const PRESTIGE_ART = { Paladin: 'paladin', 'Heavy Knight': 'heavy-knight', Ranger: 'ranger', Assassin: 'assassin', Sentinel: 'sentinel', Templar: 'templar', Elementalist: 'elementalist', Warlock: 'warlock', Sorcerer: 'sorcerer', Necromancer: 'necromancer', Bishop: 'bishop', Cleric: 'cleric' };
const actorArt = actor => PRESTIGE_ART[actor.prestige] || actor.spriteId || CLASS_ART[actor.className];
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

const isDone = building => !building.underConstruction;
const heroCapacity = () => 8 + state.buildings.filter(building => building.type === 'hotel' && isDone(building)).length * 4;
// Construção livre: estas áreas da arte não aceitam obra (coordenadas em % do mapa, no pé da construção).
const BLOCKED_AREAS = [
  { x0: 0, x1: 50, y0: 0, y1: 43, why: 'Em cima do casarão não dá.' },
  { x0: 68, x1: 100, y0: 0, y1: 29, why: 'As ruínas não aceitam obra. Nem visita.' },
  { x0: 0, x1: 100, y0: 0, y1: 16, why: 'A floresta não deixa. Ela tem dono.' },
  { x0: 0, x1: 100, y0: 96, y1: 109, why: 'A passagem entre as regiões deve ficar livre.' },
];
const BUILD_SPACING = 12.5;
const BUILDING_ART = {
  farm: 'farm-wheat', mill: 'mill-body', hut: 'hut', depot: 'depot', lumber: 'lumber', market: 'market', tavern: 'tavern', hotel: 'hotel', warrior: 'guild', archer: 'archer', lancer: 'lancer',
  blackMage: 'tower', conjurer: 'conjurer', healer: 'healer', armory: 'armory',
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
  { x: 62, y: 67, links: [3, 11] },           // Contorno sul do lote direito
  { x: 90, y: 67, links: [10, 7] },
  { x: 42, y: 99, links: [5, 13] },
  { x: 54, y: 107, links: [12, 14] },
  { x: 51, y: 121, links: [13, 15] },
  { x: 39, y: 137, links: [14, 16] },
  { x: 45, y: 153, links: [15, 17] },
  { x: 56, y: 171, links: [16, 18] },
  { x: 44, y: 190, links: [17] },
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
const options = readStore(OPTIONS_KEY, { startZoom: 0, names: 'selected', autosave: 3 });
if (options.zoomVersion !== 3 || ![0, 1, 2].includes(options.startZoom)) { options.startZoom = 0; options.zoomVersion = 3; }
// Som: 1 ligado, 0 desligado. O jogo ainda não toca áudio; todo som futuro deve respeitar esta opção.
if (![0, 1].includes(options.sound)) options.sound = 1;
// Modo teste: ouro e madeira infinitos. Só existe ligado pela tela de Debug.
const debug = readStore(DEBUG_KEY, { testMode: false });

// Começo de um jogo novo. Regra: sem construção, sem ninguém. O casarão traz um camponês e um Warrior;
// outros heróis saem de guildas, taverna ou hotel; cada fazenda ou moinho traz mais um camponês.
function newGameState(testMode = false, heir = null) {
  return {
    gold: 240, grain: 58, timber: 30, people: 14,
    food: { wheat: 40, garlic: 18, bacon: 0, eggs: 0, milk: 0 }, items: [], ration: 2, diet: { wheat: true, garlic: true, bacon: true, eggs: true, milk: true }, happiness: 50, moodTarget: 50, moodParts: null,
    speed: 1, minutes: 380, ticks: 0, selectedBuild: null, selectedSite: null, selectedFarmType: 'wheat', taxPercent: 10, tavernTab: 0, nextBuildingId: 1,
    tab: 'build', won: false,
    testMode, heir, heirLevel: 1, heirXp: 0, equipment: BASIC_EQUIPMENT(), stash: null, playSeconds: 0,
    buildings: [],
    heroes: [
      { id: 'warrior-manor', name: 'Bogdan Sem Sorte', className: 'Warrior', trait: 'Valente', level: 1, xp: 0, x: 42, y: 39, alive: true, home: 'manor' },
    ],
    workers: [
      { id: 'peasant-1', name: 'Ion do Poço', level: 1, xp: 0, className: 'Peasant', spriteId: 'peasant', portraitId: 'male-peasant', x: 42, y: 39, alive: true, workTrip: false, home: 'manor' },
    ],
    selectedActor: null,
  };
}

let state = newGameState();
const game = { running: false, slot: null, lastSaved: 0 };

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const format = n => Math.floor(n).toLocaleString('pt-BR');
let toastTimer;

// A câmera percorre o mundo sem alterar as coordenadas dos lotes e personagens.
// Zoom do jogo: 1 = ampla (100%, o padrão), 2 = normal (130%), 3 = próxima (160%).
const ZOOM_LEVELS = [1, 1.3, 1.6];
const MAP_RATIO = 1312 / 1199;
const camera = { x: 0.5, y: 0.08, zoom: 0, drag: null };
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
  camera.y = 0.08;
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
  const centerX = (oldBounds.x * camera.x + scene.clientWidth / 2) / (world.offsetWidth * ZOOM_LEVELS[camera.zoom]);
  const centerY = (oldBounds.y * camera.y + scene.clientHeight / 2) / (world.offsetHeight * ZOOM_LEVELS[camera.zoom]);
  camera.zoom = index;
  const bounds = cameraBounds();
  camera.x = bounds.x ? clampCamera((centerX * world.offsetWidth * ZOOM_LEVELS[index] - scene.clientWidth / 2) / bounds.x) : 0.5;
  camera.y = bounds.y ? clampCamera((centerY * world.offsetHeight * ZOOM_LEVELS[index] - scene.clientHeight / 2) / bounds.y) : 0;
  $$('.zoom-btn').forEach(button => {
    const active = Number(button.dataset.zoom) === index;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderCamera();
}

function focusRegion(name) {
  if (name !== 'road') { homeCamera(); return; }
  const scene = $('#map-scene');
  const world = $('#map-world');
  const bounds = cameraBounds();
  const desiredCenter = world.offsetHeight * ZOOM_LEVELS[camera.zoom] * 0.75;
  camera.y = bounds.y ? clampCamera((desiredCenter - scene.clientHeight / 2) / bounds.y) : 0;
  renderCamera();
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
  $('#camera-home').addEventListener('click', () => {
    focusRegion('manor');
  });
  $('#camera-road').addEventListener('click', () => focusRegion('road'));
  $$('.zoom-btn').forEach(button => button.addEventListener('click', () => setZoom(Number(button.dataset.zoom))));
  window.addEventListener('resize', () => { sizeWorld(); renderCamera(); });
  sizeWorld();
  homeCamera();
}

function say(message, event = message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  $('#event-line').textContent = event;
}

const WORKER_UPKEEP = 0.3; // provisões por segundo, por trabalhador
// Mercado: sempre aberto. Sem a construção, só a troca simples de trigo, alho e madeira, 25% pior:
// vende por 75% do preço e compra por 125%.
// Preços fixos em ouro por unidade. Comprar custa o dobro de vender.
const MARKET_GOODS = [
  { id: 'wheat', name: 'Trigo', art: 'farm-wheat', sell: 1, buy: 2 },
  { id: 'garlic', name: 'Alho', art: 'farm-garlic', sell: 1, buy: 2 },
  { id: 'eggs', name: 'Ovos', art: 'farm-eggs', sell: 2, buy: 4 },
  { id: 'milk', name: 'Leite', art: 'farm-milk', sell: 2, buy: 4 },
  { id: 'bacon', name: 'Bacon', art: 'farm-bacon', sell: 3, buy: 6 },
  { id: 'timber', name: 'Madeira', art: 'lumber', sell: 2, buy: 4 },
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
      <img src="public/art/${good.art}-v01.webp" alt="">
      <span class="market-name"><b>${good.name}</b><small>Tem ${format(stockOf(good.id))}</small></span>
      <span class="market-side"><small>VENDER · ${formatPrice(unitPrice(good, 'sell'))} ${coin} cada</small><span><button type="button" data-trade="${good.id}" data-amount="-1">1</button><button type="button" data-trade="${good.id}" data-amount="-10">10</button></span></span>
      <span class="market-side"><small>COMPRAR · ${formatPrice(unitPrice(good, 'buy'))} ${coin} cada</small><span><button type="button" class="buy" data-trade="${good.id}" data-amount="1">1</button><button type="button" class="buy" data-trade="${good.id}" data-amount="10">10</button></span></span>
    </div>`).join('')}</div>
    <p class="build-note">${hasMarket() ? 'Armas e itens ainda não chegaram aos mercadores.' : 'Sem um Mercado, só passa a carroça de trigo, alho e madeira, e o carroceiro cobra 25% a mais. Construa um Mercado para preços justos e para negociar ovos, leite e bacon.'}</p>`;
}

// Cabana do Lenhador: até 3 camponeses escalados pelo painel.
const LUMBER_RATE = [0, 0.1, 0.3, 0.5];
const lumberCrew = camp => state.workers.filter(worker => worker.alive && worker.workplace && worker.workplace.site === camp.site);
function freeWorkers() {
  return state.workers.filter(worker => worker.alive && worker.buildSite == null && worker.workplace?.type !== 'lumber');
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
  const rate = LUMBER_RATE[crew.length].toFixed(1).replace('.', ',');
  return `<section class="farm-selector hut-box"><div class="farm-selector-heading"><b>Cabana do Lenhador</b><small>${crew.length} de 3 camponeses · ${rate} de madeira por segundo</small></div>
    <p class="storage-items">${crew.length ? crew.map(worker => worker.name).join(', ') : 'Ninguém trabalhando. Sem lenhador, sem lenha.'}</p>
    <div class="guild-branches"><button type="button" class="hut-upgrade" data-lumber="${camp.site}" data-change="1" ${crew.length >= 3 ? 'disabled' : ''}>+1 camponês</button><button type="button" class="hut-upgrade" data-lumber="${camp.site}" data-change="-1" ${crew.length ? '' : 'disabled'}>−1 camponês</button></div></section>`;
}

function rates() {
  const sum = state.buildings.reduce((sum, building) => {
    const def = BUILDINGS.find(item => item.id === building.type);
    if (def && isDone(building)) {
      const output = building.type === 'farm' ? farmType(building.produce) : def;
      sum.grain += output.grain; sum.people += def.people;
    }
    return sum;
  }, { gold: 0, grain: 0, timber: 0.28, people: 0 });
  sum.timber += state.buildings.filter(building => building.type === 'lumber' && isDone(building)).reduce((total, camp) => total + LUMBER_RATE[lumberCrew(camp).length], 0);
  sum.grain -= foodDemand();
  return sum;
}

// ==========================================================================
// Impostos: cobrados uma vez por dia, à meia-noite. A 10%, cada camponês paga 2 de ouro.
// A taverna paga pelo uso: cada hora bebendo vale 1 (camponês), 2 (herói) ou 3 (herói de prestígio), a 10%.
// Tudo escala com a porcentagem escolhida.
// ==========================================================================
const taxFactor = () => (state.taxPercent ?? 10) / 10;
const openTavern = () => state.buildings.find(building => building.type === 'tavern' && isDone(building)) || null;
const tavernRate = actor => actor.className === 'Peasant' ? 1 : actor.prestige ? 3 : 2;
function dailyTaxEstimate() {
  return state.workers.filter(worker => worker.alive).length * 2 * taxFactor() + (state.tavernTab || 0) * taxFactor();
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
  [...state.heroes, ...state.workers].filter(actor => actor.alive && isDrinking(actor)).forEach(actor => {
    state.tavernTab = (state.tavernTab || 0) + tavernRate(actor) * minutesPassed / 60;
  });
}
function collectTaxes() {
  const peasants = state.workers.filter(worker => worker.alive).length;
  const fromPeasants = peasants * 2 * taxFactor();
  const fromTavern = (state.tavernTab || 0) * taxFactor();
  state.tavernTab = 0;
  if (!state.testMode) state.gold += fromPeasants + fromTavern;
  say(`Impostos a ${state.taxPercent}%: ${format(fromPeasants)} de ouro dos camponeses${openTavern() ? ` e ${format(fromTavern)} da taverna` : ''}.`,
    'Os camponeses pagaram. Uns com moedas, outros com olhares.');
}

function updateHud() {
  if (state.testMode) { state.gold = 1e9; state.timber = 1e9; }
  $('#test-badge').hidden = !state.testMode;
  const r = rates();
  $('#gold').textContent = format(state.gold);
  state.grain = totalFood();
  $('#grain').textContent = format(state.grain);
  $('#storage-cap').textContent = storageCap();
  $('#grain').closest('.stat').classList.toggle('full', storedUnits() >= storageCap() - 1);
  $('#happiness').textContent = Math.round(state.happiness);
  $('#happiness-label').textContent = happinessLabel(state.happiness);
  $('#happiness').closest('.stat').dataset.mood = state.happiness < 40 ? 'low' : state.happiness < 60 ? 'mid' : 'high';
  $('#timber').textContent = format(state.timber);
  if (state.testMode) { $('#gold').textContent = '∞'; $('#timber').textContent = '∞'; }
  $('#people').textContent = format(state.people);
  $('#gold-rate').textContent = `+${format(dailyTaxEstimate())}/dia`;
  $('#grain-rate').textContent = `${r.grain < 0 ? '−' : '+'}${Math.abs(r.grain).toFixed(1).replace('.', ',')}/s`;
  $('#grain-rate').classList.toggle('negative', r.grain < 0);
  $('#timber-rate').textContent = `+${r.timber.toFixed(1).replace('.', ',')}/s`;
  // Personagens: quantos existem e quantos o domínio comporta.
  const heroes = state.heroes.filter(hero => hero.alive).length;
  const heroCap = heroCapacity();
  const workers = state.workers.filter(worker => worker.alive).length;
  const workerCap = 1 + state.buildings.filter(building => building.type === 'hut' && isDone(building)).reduce((sum, hut) => sum + (hut.big ? 5 : 2), 0);
  $('#hero-count').textContent = heroes;
  $('#hero-cap').textContent = heroCap;
  $('#hero-count').closest('.stat').classList.toggle('full', heroes >= heroCap);
  $('#worker-count').textContent = workers;
  $('#worker-cap').textContent = workerCap;
  $('#site-count').textContent = state.buildings.length;
  $('.tab-count').textContent = heroes;
  $('#tax-pct').textContent = `${state.taxPercent}%`;
  $('#tax-preview').textContent = `≈ ${format(dailyTaxEstimate())} de ouro por dia`;
  $('#objective-gold').textContent = state.testMode ? '∞' : format(state.gold);
  const pct = Math.min(100, state.gold / 6);
  $('#objective-bar').style.width = `${pct}%`;
  const hh = Math.floor(state.minutes / 60) % 24;
  const mm = state.minutes % 60;
  $('#clock').textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  if (!state.testMode && state.gold >= 600 && !state.won) {
    state.won = true;
    say('Cenário conquistado: o domínio agora paga as próprias dívidas.', 'Os credores receberam a notícia. Infelizmente, também receberam o endereço.');
    if (!state.retinue && game.slot) { menu.stack = []; showScreen('scenarioEnd', { servants: [], protectors: [] }); }
  }
}

// Uma construção por botão no mapa, no ponto onde foi erguida.
function renderSites() {
  const layer = $('#site-layer');
  const ids = new Set(state.buildings.map(building => String(building.site)));
  $$('.site', layer).filter(site => !ids.has(site.dataset.site)).forEach(site => site.remove());
  $('#map-scene').classList.toggle('placing', !!state.selectedBuild);
  if (!state.selectedBuild) $('#placement-preview').hidden = true;
  state.buildings.forEach(building => {
    const idx = building.site;
    let site = $(`.site[data-site="${idx}"]`, layer);
    if (!site) {
      site = document.createElement('button');
      site.type = 'button';
      site.className = 'site built';
      site.dataset.site = String(idx);
      layer.insertBefore(site, $('#hero-layer'));
    }
    site.style.setProperty('--x', `${building.x}%`);
    site.style.setProperty('--y', `${building.y / 2}%`);
    site.classList.toggle('selected', state.selectedSite === idx);
    site.classList.toggle('constructing', !!building.underConstruction);
    site.style.zIndex = String(Math.round(building.y * 10));
    {
      const def = BUILDINGS.find(item => item.id === building.type);
      const branchNames = { Bishop: 'Templo Bishop', Cleric: 'Treino Cleric', Elementalist: 'Torre dos Elementalistas', Warlock: 'Torre dos Arcanistas' };
      const label = building.type === 'farm' ? `Fazenda de ${farmType(building.produce).name}` : building.type === 'hut' ? (building.big ? 'Casebre Grande' : 'Casebre Pequeno') : building.branch ? (branchNames[building.branch] || `Guilda ${building.branch}`) : def.name;
      const art = building.type === 'farm' ? farmType(building.produce).art : building.type === 'hut' && building.big ? 'hut-big' : BUILDING_ART[building.type];
      site.classList.toggle('just-built', Date.now() - building.builtAt < 1400);
      site.dataset.art = art;
      site.innerHTML = `<span class="building-art" style="background-image:url('public/art/${art}-v01.webp')" aria-hidden="true">${building.type === 'mill' && !building.underConstruction ? '<span class="mill-sails"></span>' : ''}</span><small>${building.underConstruction ? constructionLabel(building) : label}</small>`;
      site.setAttribute('aria-label', `${label}. Toque para ver opções.`);
    }
  });
}

// Se a construção cabe neste ponto: dentro do mapa, fora das áreas bloqueadas e longe das outras.
function placementProblem(x, y) {
  if (x < 6 || x > 94 || y < 4 || y > 196) return 'Fora do mapa.';
  const blocked = BLOCKED_AREAS.find(area => x >= area.x0 && x <= area.x1 && y >= area.y0 && y <= area.y1);
  if (blocked) return blocked.why;
  const crowded = state.buildings.some(building => Math.hypot(building.x - x, (building.y - y) * MAP_RATIO) < BUILD_SPACING);
  if (crowded) return 'Encostado demais em outra construção.';
  return null;
}

function worldPoint(event) {
  const rect = $('#map-world').getBoundingClientRect();
  return { x: (event.clientX - rect.left) / rect.width * 100, y: (event.clientY - rect.top) / rect.height * 200 };
}

function showPlacementPreview(event) {
  const preview = $('#placement-preview');
  const item = BUILDINGS.find(building => building.id === state.selectedBuild);
  if (!item || event.target.closest('.map-tools, .menu-btn')) { preview.hidden = true; return; }
  const { x, y } = worldPoint(event);
  const art = item.id === 'farm' ? farmType(state.selectedFarmType).art : BUILDING_ART[item.id];
  preview.hidden = false;
  preview.style.setProperty('--x', `${x}%`);
  preview.style.setProperty('--y', `${y / 2}%`);
  preview.style.zIndex = String(Math.round(y * 10) + 1);
  preview.dataset.art = art;
  preview.style.backgroundImage = `url('public/art/${art}-v01.webp')`;
  preview.classList.toggle('invalid', !!placementProblem(x, y));
}

function renderHeroes() {
  const layer = $('#hero-layer');
  const active = new Set();
  [...state.heroes, ...state.workers].filter(actor => actor.alive).forEach(actor => {
    active.add(String(actor.id));
    let token = [...layer.children].find(node => node.dataset.actor === String(actor.id));
    if (!token) {
      token = document.createElement('button');
      token.type = 'button';
      token.dataset.actor = String(actor.id);
      token.setAttribute('aria-label', `${actor.name}, ${actor.className}`);
      const art = actorArt(actor);
      token.innerHTML = art
        ? `<span class="character-sprite" style="background-image:url('public/art/${art}-walk-v01.webp')" aria-hidden="true"></span><span class="character-name">${actor.name}</span>`
        : `<span class="hero-face">${actor.className[0]}</span><span class="character-name">${actor.name}</span>`;
      token.addEventListener('click', () => {
        if (state.selectedBuild) return;
        state.selectedActor = actor.id;
        renderHeroes();
        // Clicar no boneco abre a ficha dele: nível, experiência, atributos e origem.
        menu.stack = [];
        showScreen('actor', { id: actor.id });
      });
      layer.append(token);
    }
    if (token.parentElement !== layer) layer.append(token);
    token.className = `character${actor.className === 'Peasant' ? ' worker' : ''}${state.selectedActor === actor.id ? ' selected' : ''}`;
    token.style.left = `${actor.x}%`;
    token.style.top = `${actor.y / 2}%`;
    // Trabalhando na obra, fica à frente dela mesmo estando um pouco acima da base.
    token.style.zIndex = String(Math.round(actor.y * 10) + (actor.action === 'build' ? 10 : 0));
    token.dataset.facing = actor.facing || 'front';
    token.dataset.side = actor.side || 'right';
    if (actorArt(actor)) {
      const art = actorArt(actor);
      const sheet = actorSheet(actor);
      if (token.dataset.sheet !== sheet || token.dataset.art !== art) {
        const extension = art === 'peasant' && sheet === 'build' ? 'png' : 'webp';
        $('.character-sprite', token).style.backgroundImage = `url('public/art/${art}-${sheet}-v01.${extension}')`;
        token.dataset.sheet = sheet;
        token.dataset.art = art;
      }
      // Os quadros 2 e 3 da caminhada de costas do camponês têm o balde na mão oposta.
      // Espelhar só esses quadros mantém o balde no mesmo lado durante a sequência.
      const reversedBackFrame = art === 'peasant' && sheet === 'walk' && token.dataset.facing === 'back' && (actor.frame || 0) >= 2;
      const facingLeft = token.dataset.side === 'left';
      token.style.setProperty('--sprite-scale-x', facingLeft !== reversedBackFrame ? -1 : 1);
    }
    token.style.setProperty('--frame-x', `${(actor.frame || 0) * 100 / 3}%`);
  });
  [...layer.children].filter(node => !active.has(node.dataset.actor)).forEach(node => node.remove());
}

function heroCard(hero) {
  const prestigeTargets = PRESTIGE[hero.className];
  const nextInfo = hero.prestige ? `Caminho de prestígio: ${hero.prestige}` : hero.level >= 15 ? 'A guilda disponível mais próxima define a especialização.' : `${15 - hero.level} ${15 - hero.level === 1 ? 'nível' : 'níveis'} até o prestígio`;
  const guildType = GUILD_FOR[hero.className];
  return `<article class="hero-card">
    <img class="hero-portrait" src="public/art/portraits/${actorPortrait(hero)}-portrait-v01.webp" alt="Retrato de ${hero.name}">
    <div class="hero-details"><b>${hero.name}</b><small>${hero.className}${hero.prestige ? ` · ${hero.prestige}` : ''}</small>${hero.trait ? `<small class="hero-trait"><b>${hero.trait}.</b> ${TRAITS[hero.trait] || ''}</small>` : ''}<small>${nextInfo}</small></div>
    <div class="hero-xp">NÍV. ${hero.level}<i style="--xp:${hero.level >= HEIR_MAX_LEVEL ? 100 : Math.round((hero.xp || 0) / xpToNext(hero.level) * 100)}%"></i><button type="button" class="card-sheet-btn" data-actor-sheet="${hero.id}">FICHA</button></div>
  </article>`;
}

function workerCard(worker) {
  return `<article class="hero-card worker-card">
    <img class="hero-portrait" src="public/art/portraits/${actorPortrait(worker)}-portrait-v01.webp" alt="Retrato de ${worker.name}">
    <div class="hero-details"><b>${worker.name}</b><small>${actorLabel(worker)}</small><small>${homeOf(worker) ? 'Mora no casebre.' : 'Mora no casarão, como as dívidas.'} ${worker.buildSite != null ? 'Agora está numa obra.' : workplaceOf(worker) ? `Trabalha ${workplaceOf(worker).type === 'lumber' ? 'na Cabana do Lenhador' : workplaceOf(worker).type === 'mill' ? 'no moinho' : 'na fazenda'}.` : 'Sem fazenda pra trabalhar.'}</small></div>
    <div class="hero-xp">NÍV. ${worker.level || 1}<i style="--xp:${(worker.level || 1) >= HEIR_MAX_LEVEL ? 100 : Math.round((worker.xp || 0) / xpToNext(worker.level || 1) * 100)}%"></i><button type="button" class="card-sheet-btn" data-actor-sheet="${worker.id}">FICHA</button></div>
  </article>`;
}

function renderPanel() {
  const host = $('#panel-view');
  if (state.tab === 'build') {
    const selectedFarm = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'farm' && isDone(building));
    const selectedHut = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'hut' && isDone(building));
    const selectedLumber = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'lumber' && isDone(building));
    const selectedDepot = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'depot' && isDone(building));
    const selectedGuild = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && isDone(building) && BUILDINGS.find(item => item.id === building.type)?.heroClass);
    const farmChoice = state.selectedBuild === 'farm' || !!selectedFarm;
    const currentFarmType = selectedFarm ? farmType(selectedFarm.produce).id : state.selectedFarmType;
    host.innerHTML = `<div class="panel-title"><h3>Erga o domínio</h3><span>Escolha uma carta e toque no mapa</span></div>
      ${farmChoice ? `<section class="farm-selector" aria-label="Tipo de fazenda"><div class="farm-selector-heading"><b>${selectedFarm ? 'Produção desta fazenda' : 'Escolha a produção da fazenda'}</b><small>${selectedFarm ? 'Toque para trocar a produção' : 'Depois toque no mapa'}</small></div>
        <div class="farm-type-grid">${FARM_TYPES.map(type => `<button class="farm-type${currentFarmType === type.id ? ' selected' : ''}" data-farm-type="${type.id}" aria-pressed="${currentFarmType === type.id}"><img src="public/art/${type.art}-v01.webp" alt=""><span><b>${type.name}</b><small>+${type.grain.toFixed(1).replace('.', ',')} provisões/s</small></span></button>`).join('')}</div></section>` : ''}
      ${selectedHut ? `<section class="farm-selector hut-box"><div class="farm-selector-heading"><b>${selectedHut.big ? 'Casebre Grande' : 'Casebre Pequeno'}</b><small>${selectedHut.big ? '5 moradores. Não cabe mais ninguém. Nem com boa vontade.' : '2 moradores'}</small></div>${selectedHut.big ? '' : `<button type="button" class="hut-upgrade" data-hut-upgrade="${selectedHut.site}">Ampliar para Casebre Grande · ${costHTML(HUT_UPGRADE.gold, HUT_UPGRADE.wood)} · +3 moradores</button>`}</section>` : ''}
      ${selectedGuild ? guildBoxHTML(selectedGuild) : ''}
      ${selectedDepot ? depotBoxHTML(selectedDepot) : ''}
      ${selectedLumber ? lumberBoxHTML(selectedLumber) : ''}
      <div class="build-grid">${BUILDINGS.map(item => `<button class="build-card${state.selectedBuild === item.id ? ' selected' : ''}" data-build="${item.id}" aria-label="Construir ${item.id === 'farm' ? `Fazenda de ${farmType(state.selectedFarmType).name}` : item.name}, custa ${item.cost} moedas e ${item.wood} madeira">
        <span class="build-preview"><img src="public/art/${item.id === 'farm' ? farmType(state.selectedFarmType).art : BUILDING_ART[item.id]}-v01.webp" alt="">${item.id === 'mill' ? '<span class="mill-sails"></span>' : ''}</span><span class="build-copy"><b>${item.name}${item.id === 'farm' ? ` · ${farmType(state.selectedFarmType).name}` : ''}</b><small>${item.detail}</small></span><span class="build-cost">${costHTML(item.cost, item.wood)}</span></button>`).join('')}</div>
      <p class="build-note">A moeda é o custo em ouro e a lenha é o custo em madeira.</p>`;
  } else if (state.tab === 'heroes') {
    host.innerHTML = `<div class="panel-title"><h3>Companhia autônoma</h3><span>${state.heroes.filter(h => h.alive).length}/${heroCapacity()} hóspedes</span></div>
      <div class="hero-list">${state.heroes.filter(h => h.alive).map(heroCard).join('') || '<div class="empty-state">Nenhum herói. Ninguém foi corajoso, ou burro, o bastante.<br>Construa uma taverna ou guilda.</div>'}</div>
      <div class="panel-title worker-heading"><h3>Trabalhadores</h3><span>${state.workers.filter(worker => worker.alive).length} no domínio</span></div>
      <div class="hero-list">${state.workers.filter(worker => worker.alive).map(workerCard).join('') || '<div class="empty-state">Nenhum camponês. Até eles desistiram.<br>Construa um casebre.</div>'}</div>
      <p class="build-note">Você não manda nos heróis. Eles fazem o que querem.</p>`;
  } else if (state.tab === 'food') {
    host.innerHTML = foodPanelHTML();
  } else if (state.tab === 'market') {
    host.innerHTML = marketPanelHTML();
  }
  $$('.build-card', host).forEach(button => button.addEventListener('click', () => chooseBuild(button.dataset.build)));
  $$('[data-farm-type]', host).forEach(button => button.addEventListener('click', () => chooseFarmType(button.dataset.farmType)));
  $$('[data-guild-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeGuild(Number(button.dataset.guildUpgrade), button.dataset.branch || null)));
  $$('[data-ration]', host).forEach(button => button.addEventListener('click', () => { state.ration = Number(button.dataset.ration); say(`Ração ${RATIONS[state.ration].label.toLowerCase()}.`); renderPanel(); updateHud(); }));
  $$('[data-diet]', host).forEach(button => button.addEventListener('click', () => { state.diet[button.dataset.diet] = !state.diet[button.dataset.diet]; renderPanel(); }));
  $$('[data-trade]', host).forEach(button => button.addEventListener('click', () => trade(button.dataset.trade, Number(button.dataset.amount))));
  $$('[data-lumber]', host).forEach(button => button.addEventListener('click', () => setLumberCrew(Number(button.dataset.lumber), Number(button.dataset.change))));
  $$('[data-depot-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeDepot(Number(button.dataset.depotUpgrade))));
  $$('[data-hut-upgrade]', host).forEach(button => button.addEventListener('click', () => upgradeHut(Number(button.dataset.hutUpgrade))));
  $$('[data-actor-sheet]', host).forEach(button => button.addEventListener('click', () => { menu.stack = []; showScreen('actor', { id: button.dataset.actorSheet }); }));
}

function chooseBuild(id) {
  const item = BUILDINGS.find(building => building.id === id);
  if (id !== 'farm' && (state.gold < item.cost || state.timber < item.wood)) {
    say('Falta ouro ou madeira. As dívidas, não.');
    return;
  }
  if (state.selectedBuild === id) { cancelPlacement(); return; }
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
  farm.produce = type.id;
  state.selectedFarmType = type.id;
  renderSites(); renderPanel(); updateHud();
  say(`Fazenda agora produz ${type.name.toLowerCase()}.`, `A fazenda mudou sua produção para ${type.name.toLowerCase()}.`);
}

// Obras: um camponês precisa trabalhar no local durante um minuto de jogo.
const BUILD_TIME = 60;
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
  const building = { site, type: item.id, produce: item.id === 'farm' ? state.selectedFarmType : null, branch: null, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, builtAt: Date.now(), underConstruction: true, progress: 0, builderId: null };
  state.buildings.push(building);
  state.selectedBuild = null;
  state.selectedSite = site;
  assignBuilders();
  renderSites(); renderPanel(); updateHud();
  const builder = building.builderId != null ? findActor(building.builderId) : null;
  say(builder ? `Obra de ${buildingName(building)} iniciada. ${builder.name} vai trabalhar nela por um minuto.` : `Obra de ${buildingName(building)} marcada. Falta um camponês livre pra trabalhar nela.`);
}

function busyBuilders() {
  return new Set(state.buildings.filter(building => building.underConstruction && building.builderId != null).map(building => String(building.builderId)));
}

// Cada obra sem camponês recebe o primeiro camponês livre.
function assignBuilders() {
  state.buildings.filter(building => building.underConstruction).forEach(building => {
    const current = building.builderId != null ? findActor(building.builderId) : null;
    if (current && current.alive) return;
    const busy = busyBuilders();
    const worker = state.workers.find(candidate => candidate.alive && !busy.has(String(candidate.id)));
    building.builderId = worker ? worker.id : null;
    if (worker) { worker.buildSite = building.site; worker.route = []; worker.finalPoint = null; worker.wait = 0; }
  });
}

// O camponês trabalha ao lado da obra, um pouco acima da base, para não tampar o rótulo de progresso logo abaixo.
const buildSpot = building => ({ x: building.x + (building.x > 92 ? -5 : 5), y: building.y - 0.8 });

// Uma vez por segundo de jogo: a obra avança só com o camponês no local.
function progressConstruction(dt) {
  assignBuilders();
  state.buildings.filter(building => building.underConstruction).forEach(building => {
    const worker = building.builderId != null ? findActor(building.builderId) : null;
    const spot = buildSpot(building);
    if (worker && Math.hypot(worker.x - spot.x, worker.y - spot.y) < 1.5) {
      building.progress = Math.min(BUILD_TIME, (building.progress || 0) + dt);
      if (building.progress >= BUILD_TIME) { completeBuilding(building); return; }
    }
    const label = $(`.site[data-site="${building.site}"] small`);
    if (label) label.textContent = constructionLabel(building);
  });
}

function constructionLabel(building) {
  const worker = building.builderId != null ? findActor(building.builderId) : null;
  return `Em obra · ${Math.floor((building.progress || 0) / BUILD_TIME * 100)}%${worker ? '' : ' · sem camponês'}`;
}

function completeBuilding(building) {
  const item = BUILDINGS.find(entry => entry.id === building.type);
  const worker = building.builderId != null ? findActor(building.builderId) : null;
  building.underConstruction = false;
  building.progress = BUILD_TIME;
  building.builtAt = Date.now();
  building.builderId = null;
  if (worker) { worker.buildSite = null; worker.route = []; worker.finalPoint = null; worker.wait = 0; }
  gainHeirXp(25);
  const arrived = item.heroClass ? recruit(item.heroClass, building) : null;
  if (item.housing) for (let i = 0; i < item.housing; i++) hireWorker(building);
  assignBuilders();
  renderSites(); renderPanel(); updateHud();
  setTimeout(() => $(`.site[data-site="${building.site}"]`)?.classList.remove('just-built'), 1400);
  const name = buildingName(building);
  const credit = worker ? ` ${worker.name} terminou a obra.` : '';
  say(arrived ? `${item.name} abriu as portas.${credit} ${arrived.name} já está reclamando da cama.` : item.housing ? `Casebre Pequeno erguido.${credit} Chegaram dois camponeses. Eles não tinham pra onde ir mesmo.` : `${name} erguida.${credit} Ninguém morreu na obra. Ainda.`);
}

function recruit(className, origin, prestige = null) {
  if (!origin) return null;
  if (state.heroes.filter(hero => hero.alive).length >= heroCapacity()) {
    say('Os alojamentos estão cheios. O herói foi embora ofendido.');
    return null;
  }
  const hero = { id: Date.now() + Math.random(), name: heroName(), className, prestige, trait: pick(Object.keys(TRAITS)), level: 1, xp: 0, x: origin.x, y: origin.y, alive: true, guildSite: origin.site ?? null };
  state.heroes.push(hero);
  gainHeirXp(10);
  renderHeroes();
  updateHud();
  return hero;
}

// Cada fazenda ou moinho traz um camponês, que sai da construção e trabalha nela.
const HUT_UPGRADE = { gold: 90, wood: 6 };
function upgradeHut(site) {
  const hut = state.buildings.find(building => building.site === site && building.type === 'hut');
  if (!hut || hut.big) return;
  if (state.gold < HUT_UPGRADE.gold || state.timber < HUT_UPGRADE.wood) { say('Falta ouro ou madeira. Os camponeses vão continuar apertados.'); return; }
  state.gold -= HUT_UPGRADE.gold;
  state.timber -= HUT_UPGRADE.wood;
  hut.big = true;
  for (let i = 0; i < 3; i++) hireWorker(hut);
  gainHeirXp(25);
  renderSites(); renderPanel(); updateHud();
  say('Casebre Grande. Chegaram mais três. Cabem cinco, se ninguém respirar fundo.');
}

function hireWorker(home) {
  const n = state.workers.length + 1;
  const female = n % 2 === 0;
  state.workers.push({
    id: `worker-${Date.now()}-${n}`,
    name: peasantName(female),
    level: 1, xp: 0,
    className: 'Peasant',
    spriteId: female ? 'female-peasant' : 'peasant',
    portraitId: female ? 'female-peasant' : 'male-peasant',
    x: home.x, y: home.y, alive: true, workTrip: false, homeSite: home.site,
  });
  renderHeroes();
  updateHud();
  if (state.tab === 'heroes') renderPanel();
}

// Cada guilda: atualização 1 traz mais um herói da classe; atualização 2 escolhe a especialização
// e traz um terceiro herói já especializado. Os dois primeiros continuam como são.
const GUILD_UPGRADES = [{ gold: 120, wood: 8 }, { gold: 180, wood: 12 }];
const guildTier = guild => guild.tier ?? (guild.branch ? 2 : 0);
function upgradeGuild(site, branch) {
  const guild = state.buildings.find(building => building.site === site);
  const def = guild && BUILDINGS.find(item => item.id === guild.type);
  if (!def?.heroClass) return;
  const tier = guildTier(guild);
  const cost = GUILD_UPGRADES[tier];
  if (!cost) return;
  if (tier === 1 && !PRESTIGE[def.heroClass]?.includes(branch)) return;
  if (state.gold < cost.gold || state.timber < cost.wood) { say('Falta ouro ou madeira. Os heróis vão continuar dividindo beliche.'); return; }
  state.gold -= cost.gold;
  state.timber -= cost.wood;
  gainHeirXp(25);
  if (tier === 0) {
    guild.tier = 1;
    const hero = recruit(def.heroClass, guild);
    say(hero ? `${def.name} ampliada. ${hero.name} já pegou a cama nova.` : 'A guilda foi ampliada, mas os alojamentos do domínio estão cheios.');
  } else {
    guild.tier = 2;
    guild.branch = branch;
    const hero = recruit(def.heroClass, guild, branch);
    say(hero ? `A guilda agora forma ${branch}. ${hero.name} chegou já especializado. Os outros dois continuam como eram.` : `A guilda agora forma ${branch}, mas os alojamentos do domínio estão cheios.`);
  }
  renderSites(); renderPanel(); renderHeroes(); updateHud();
}

function guildBoxHTML(guild) {
  const def = BUILDINGS.find(item => item.id === guild.type);
  const tier = guildTier(guild);
  const branchNames = { Bishop: 'Templo Bishop', Cleric: 'Treino Cleric', Elementalist: 'Torre dos Elementalistas', Warlock: 'Torre dos Arcanistas' };
  const name = guild.branch ? (branchNames[guild.branch] || `Guilda ${guild.branch}`) : def.name;
  const members = state.heroes.filter(hero => hero.alive && hero.guildSite === guild.site).length;
  const cost = GUILD_UPGRADES[tier];
  let actions = '';
  if (tier === 0) actions = `<button type="button" class="hut-upgrade" data-guild-upgrade="${guild.site}">Atualizar · ${costHTML(cost.gold, cost.wood)} · +1 ${def.heroClass}</button>`;
  else if (tier === 1) actions = `<p class="storage-items">Escolha a especialização (${costHTML(cost.gold, cost.wood)}). Chega um herói já especializado; os outros dois continuam como são.</p>
      <div class="guild-branches">${PRESTIGE[def.heroClass].map(path => `<button type="button" class="hut-upgrade" data-guild-upgrade="${guild.site}" data-branch="${path}">${path} · +1 ${path}</button>`).join('')}</div>`;
  else actions = `<p class="storage-items">Especializada em ${guild.branch}. Guilda no nível máximo.</p>`;
  return `<section class="farm-selector hut-box"><div class="farm-selector-heading"><b>${name}</b><small>Atualização ${tier} de 2 · ${members} ${members === 1 ? 'herói' : 'heróis'} da guilda</small></div>${actions}</section>`;
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
  const places = state.buildings.filter(building => ['farm', 'mill'].includes(building.type) && isDone(building));
  if (!places.length) return null;
  const from = homeOf(actor) || actor || { x: 42, y: 39 };
  return places.reduce((best, place) => Math.hypot(place.x - from.x, place.y - from.y) < Math.hypot(best.x - from.x, best.y - from.y) ? place : best);
}

function workerDestination(actor) {
  const workplace = workplaceOf(actor);
  if (!workplace) return 5;
  return nearestNode(workplace);
}

function nextActorGoal(actor) {
  if (actor.className === 'Peasant') {
    if (actor.buildSite != null) {
      const site = state.buildings.find(building => building.site === actor.buildSite && building.underConstruction);
      if (site) {
        const spot = buildSpot(site);
        actor.headingToWork = false;
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
      goDrink(actor, tavern);
      return;
    }
    const home = homeOf(actor);
    const workplace = actor.workTrip ? null : workplaceOf(actor);
    const target = actor.workTrip ? home : workplace;
    routeActor(actor, actor.workTrip ? (home ? nearestNode(home) : 0) : workerDestination(actor));
    // Da trilha até a porta da construção, em linha reta.
    actor.finalPoint = target ? { x: target.x, y: Math.min(198, target.y + 1.2) } : null;
    actor.headingToWork = !!workplace;
    actor.workTrip = !actor.workTrip;
    return;
  }
  const tavern = openTavern();
  if (tavern && actor.drinkUntil > state.minutes) { goDrink(actor, tavern); return; }
  if (tavern && Math.random() < (actor.trait === 'Bêbado' ? 0.6 : 0.2)) {
    actor.drinkUntil = state.minutes + 60 + Math.floor(Math.random() * 120);
    goDrink(actor, tavern);
    return;
  }
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
    const construction = actor.className === 'Peasant' && actor.buildSite != null
      ? state.buildings.find(building => building.site === actor.buildSite && building.underConstruction)
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
    let remaining = (actor.className === 'Peasant' ? 3.1 : 4.2) * delta;
    let moved = false;
    while (remaining > 0 && (actor.route.length || actor.finalPoint)) {
      const onTrail = actor.route.length > 0;
      const node = onTrail ? PATH_NODES[actor.route[0]] : actor.finalPoint;
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
          actor.wait = actor.className === 'Peasant' ? 2.3 : 1.2;
          if (actor.className === 'Peasant' && actor.headingToWork) { actor.actionTime = actor.wait; actor.actionClock = 0; gainActorXp(actor, 13); actor.headingToWork = false; }
          actor.goal = null;
        }
      }
    }
    actor.action = 'walk';
    actor.walkClock = (actor.walkClock || 0) + (moved ? delta : 0);
    actor.frame = moved && !reducedMotion ? Math.floor(actor.walkClock * 7) % 4 : 0;
  });
  renderHeroes();
  requestAnimationFrame(animateActors);
}

function tick() {
  if (!game.running) return;
  state.ticks++;
  state.playSeconds = (state.playSeconds || 0) + 1;
  if (options.autosave && state.playSeconds % (options.autosave * 60) === 0 && writeSave(game.slot)) say(`Salvo sozinho no slot ${game.slot}.`);
  const r = rates();
  feedWorkers(state.speed);
  progressConstruction(state.speed);
  state.grain = totalFood();
  if ((state.tab === 'food' || state.tab === 'market') && !document.querySelector('#panel-view button:hover')) renderPanel();
  state.timber += r.timber * state.speed;
  accrueTavern(state.speed);
  state.minutes += state.speed;
  if (Math.floor(state.minutes / 1440) > Math.floor((state.minutes - state.speed) / 1440)) { gainHeirXp(40); collectTaxes(); }
  // Heróis treinam, viajam e tomam decisões em tempo real.
  state.heroes.filter(h => h.alive).forEach(hero => {
    const before = hero.level || 1;
    gainActorXp(hero, state.speed);
    {
      if (before < 15 && hero.level >= 15) {
        say(`${hero.name} chegou ao nível 15 e acha que merece mais.`, `${hero.name} procura uma guilda de prestígio. As guildas fingem que não estão.`);
        assignPrestige(hero);
        if (state.tab === 'heroes') renderPanel();
      }
    }
  });
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
  pineScepter: { name: 'Cetro de Pinho', icon: 'scepter', about: 'Pintado de dourado. A tinta descasca quando você aponta pra alguém.' },
  crackedOrb: { name: 'Globo Rachado', icon: 'orb', about: 'Representa o mundo. A rachadura também.' },
  wornMantle: { name: 'Manto Puído', icon: 'mantle', about: 'Era vermelho real. Hoje é vermelho tanto faz.' },
  tinCrown: { name: 'Coroa de Lata', icon: 'crown', about: 'Brilha bem de longe. De perto, faz barulho.' },
  familyMedallion: { name: 'Medalhão da Família', icon: 'medallion', about: 'Tem o brasão da casa na frente e o nome de um credor atrás.' },
  copperRing: { name: 'Anel de Cobre', icon: 'ringCopper', about: 'Deixa o dedo verde. Nobreza tem seu preço.' },
  boneRing: { name: 'Anel de Osso', icon: 'ringBone', about: 'Ninguém sabe de quem é o osso. Melhor assim.' },
};
function BASIC_EQUIPMENT() { return { scepter: 'pineScepter', orb: 'crackedOrb', mantle: 'wornMantle', crown: 'tinCrown', medallion: 'familyMedallion', ring1: 'copperRing', ring2: 'boneRing' }; }

// Tabelas de atributos do Ember Ashes (content/data/battle-rules.json, classes): uma linha por nivel, 1 a 30,
// [Vida, Ataque, Magia, Defesa, Destreza]; mov = Movimento.
const EMBER_CLASSES = {
  swordsman: { mov: 5, stats: [[34,9,0,6,3],[38,11,0,8,4],[42,13,0,10,5],[46,15,0,12,6],[50,17,0,14,7],[54,19,0,16,8],[58,21,0,18,9],[62,23,0,20,10],[66,25,0,22,11],[70,27,0,24,12],[74,29,0,26,13],[78,31,0,28,14],[82,33,0,30,15],[86,35,0,32,16],[90,37,0,34,17],[94,39,0,36,18],[98,41,0,38,19],[102,43,0,40,20],[106,45,0,42,21],[110,47,0,44,22],[114,49,0,46,23],[118,51,0,48,24],[122,53,0,50,25],[126,55,0,52,26],[130,57,0,54,27],[134,59,0,56,28],[138,61,0,58,29],[142,63,0,60,30],[146,65,0,62,31],[150,67,0,64,32]] },
  archer: { mov: 6, stats: [[24,8,0,3,4],[27,10,0,4,5],[30,12,0,5,6],[33,14,0,6,7],[36,16,0,7,8],[39,18,0,8,9],[42,20,0,9,10],[45,22,0,10,11],[48,24,0,11,12],[51,26,0,12,13],[54,28,0,13,14],[57,30,0,14,15],[60,32,0,15,16],[63,34,0,16,17],[66,36,0,17,18],[69,38,0,18,19],[72,40,0,19,20],[75,42,0,20,21],[78,44,0,21,22],[81,46,0,22,23],[84,48,0,23,24],[87,50,0,24,25],[90,52,0,25,26],[93,54,0,26,27],[96,56,0,27,28],[99,58,0,28,29],[102,60,0,29,30],[105,62,0,30,31],[108,64,0,31,32],[111,66,0,32,33]] },
  lancer: { mov: 5, stats: [[26,8,0,4,3],[30,10,0,6,4],[34,12,0,8,5],[38,14,0,10,6],[42,16,0,12,7],[46,18,0,14,8],[50,20,0,16,9],[54,22,0,18,10],[58,24,0,20,11],[62,26,0,22,12],[66,28,0,24,13],[70,30,0,26,14],[74,32,0,28,15],[78,34,0,30,16],[82,36,0,32,17],[86,38,0,34,18],[90,40,0,36,19],[94,42,0,38,20],[98,44,0,40,21],[102,46,0,42,22],[106,48,0,44,23],[110,50,0,46,24],[114,52,0,48,25],[118,54,0,50,26],[122,56,0,52,27],[126,58,0,54,28],[130,60,0,56,29],[134,62,0,58,30],[138,64,0,60,31],[142,66,0,62,32]] },
  mage: { mov: 5, stats: [[22,3,10,2,6],[25,3,13,3,9],[28,3,16,4,12],[31,3,19,5,15],[34,3,22,6,18],[37,3,25,7,21],[40,3,28,8,24],[43,3,31,9,27],[46,3,34,10,30],[49,3,37,11,33],[52,3,40,12,36],[55,3,43,13,39],[58,3,46,14,42],[61,3,49,15,45],[64,3,52,16,48],[67,3,55,17,51],[70,3,58,18,54],[73,3,61,19,57],[76,3,64,20,60],[79,3,67,21,63],[82,3,70,22,66],[85,3,73,23,69],[88,3,76,24,72],[91,3,79,25,75],[94,3,82,26,78],[97,3,85,27,81],[100,3,88,28,84],[103,3,91,29,87],[106,3,94,30,90],[109,3,97,31,93]] },
  conjurer: { mov: 5, stats: [[18,3,10,2,9],[20,3,13,3,13],[22,3,16,4,17],[24,3,19,5,21],[26,3,22,6,25],[28,3,25,7,29],[30,3,28,8,33],[32,3,31,9,37],[34,3,34,10,41],[36,3,37,11,45],[38,3,40,12,49],[40,3,43,13,53],[42,3,46,14,57],[44,3,49,15,61],[46,3,52,16,65],[48,3,55,17,69],[50,3,58,18,73],[52,3,61,19,77],[54,3,64,20,81],[56,3,67,21,85],[58,3,70,22,89],[60,3,73,23,93],[62,3,76,24,97],[64,3,79,25,101],[66,3,82,26,105],[68,3,85,27,109],[70,3,88,28,113],[72,3,91,29,117],[74,3,94,30,121],[76,3,97,31,125]] },
  healer: { mov: 5, stats: [[26,4,8,3,6],[29,4,9,5,8],[32,4,10,7,10],[35,4,11,9,12],[38,4,12,11,14],[41,4,13,13,16],[44,4,14,15,18],[47,4,15,17,20],[50,4,16,19,22],[53,4,17,21,24],[56,4,18,23,26],[59,4,19,25,28],[62,4,20,27,30],[65,4,21,29,32],[68,4,22,31,34],[71,4,23,33,36],[74,4,24,35,38],[77,4,25,37,40],[80,4,26,39,42],[83,4,27,41,44],[86,4,28,43,46],[89,4,29,45,48],[92,4,30,47,50],[95,4,31,49,52],[98,4,32,51,54],[101,4,33,53,56],[104,4,34,55,58],[107,4,35,57,60],[110,4,36,59,62],[113,4,37,61,64]] },
  paladin: { mov: 5, stats: [[30,6,4,7,5],[35,7,5,10,7],[40,8,6,13,9],[45,9,7,16,11],[50,10,8,19,13],[55,11,9,22,15],[60,12,10,25,17],[65,13,11,28,19],[70,14,12,31,21],[75,15,13,34,23],[80,16,14,37,25],[85,17,15,40,27],[90,18,16,43,29],[95,19,17,46,31],[100,20,18,49,33],[105,21,19,52,35],[110,22,20,55,37],[115,23,21,58,39],[120,24,22,61,41],[125,25,23,64,43],[130,26,24,67,45],[135,27,25,70,47],[140,28,26,73,49],[145,29,27,76,51],[150,30,28,79,53],[155,31,29,82,55],[160,32,30,85,57],[165,33,31,88,59],[170,34,32,91,61],[175,35,33,94,63]] },
  heavyKnight: { mov: 4, stats: [[32,7,0,9,3],[37,8,0,12,4],[42,9,0,15,5],[47,10,0,18,6],[52,11,0,21,7],[57,12,0,24,8],[62,13,0,27,9],[67,14,0,30,10],[72,15,0,33,11],[77,16,0,36,12],[82,17,0,39,13],[87,18,0,42,14],[92,19,0,45,15],[97,20,0,48,16],[102,21,0,51,17],[107,22,0,54,18],[112,23,0,57,19],[117,24,0,60,20],[122,25,0,63,21],[127,26,0,66,22],[132,27,0,69,23],[137,28,0,72,24],[142,29,0,75,25],[147,30,0,78,26],[152,31,0,81,27],[157,32,0,84,28],[162,33,0,87,29],[167,34,0,90,30],[172,35,0,93,31],[177,36,0,96,32]] },
  ranger: { mov: 6, stats: [[24,8,0,3,4],[27,10,0,4,5],[30,12,0,5,6],[33,14,0,6,7],[36,16,0,7,8],[39,18,0,8,9],[42,20,0,9,10],[45,22,0,10,11],[48,24,0,11,12],[51,26,0,12,13],[54,28,0,13,14],[57,30,0,14,15],[60,32,0,15,16],[63,34,0,16,17],[66,36,0,17,18],[69,38,0,18,19],[72,40,0,19,20],[75,42,0,20,21],[78,44,0,21,22],[81,46,0,22,23],[84,48,0,23,24],[87,50,0,24,25],[90,52,0,25,26],[93,54,0,26,27],[96,56,0,27,28],[99,58,0,28,29],[102,60,0,29,30],[105,62,0,30,31],[108,64,0,31,32],[111,66,0,32,33]] },
  assassin: { mov: 6, stats: [[20,9,0,2,3],[23,12,0,3,4],[26,15,0,4,5],[29,18,0,5,6],[32,21,0,6,7],[35,24,0,7,8],[38,27,0,8,9],[41,30,0,9,10],[44,33,0,10,11],[47,36,0,11,12],[50,39,0,12,13],[53,42,0,13,14],[56,45,0,14,15],[59,48,0,15,16],[62,51,0,16,17],[65,54,0,17,18],[68,57,0,18,19],[71,60,0,19,20],[74,63,0,20,21],[77,66,0,21,22],[80,69,0,22,23],[83,72,0,23,24],[86,75,0,24,25],[89,78,0,25,26],[92,81,0,26,27],[95,84,0,27,28],[98,87,0,28,29],[101,90,0,29,30],[104,93,0,30,31],[107,96,0,31,32]] },
  templar: { mov: 5, stats: [[26,8,0,4,3],[30,10,0,6,4],[34,12,0,8,5],[38,14,0,10,6],[42,16,0,12,7],[46,18,0,14,8],[50,20,0,16,9],[54,22,0,18,10],[58,24,0,20,11],[62,26,0,22,12],[66,28,0,24,13],[70,30,0,26,14],[74,32,0,28,15],[78,34,0,30,16],[82,36,0,32,17],[86,38,0,34,18],[90,40,0,36,19],[94,42,0,38,20],[98,44,0,40,21],[102,46,0,42,22],[106,48,0,44,23],[110,50,0,46,24],[114,52,0,48,25],[118,54,0,50,26],[122,56,0,52,27],[126,58,0,54,28],[130,60,0,56,29],[134,62,0,58,30],[138,64,0,60,31],[142,66,0,62,32]] },
  elementalist: { mov: 5, stats: [[22,3,10,2,6],[25,3,13,3,9],[28,3,16,4,12],[31,3,19,5,15],[34,3,22,6,18],[37,3,25,7,21],[40,3,28,8,24],[43,3,31,9,27],[46,3,34,10,30],[49,3,37,11,33],[52,3,40,12,36],[55,3,43,13,39],[58,3,46,14,42],[61,3,49,15,45],[64,3,52,16,48],[67,3,55,17,51],[70,3,58,18,54],[73,3,61,19,57],[76,3,64,20,60],[79,3,67,21,63],[82,3,70,22,66],[85,3,73,23,69],[88,3,76,24,72],[91,3,79,25,75],[94,3,82,26,78],[97,3,85,27,81],[100,3,88,28,84],[103,3,91,29,87],[106,3,94,30,90],[109,3,97,31,93]] },
  warlock: { mov: 5, stats: [[22,3,10,2,6],[25,3,13,3,9],[28,3,16,4,12],[31,3,19,5,15],[34,3,22,6,18],[37,3,25,7,21],[40,3,28,8,24],[43,3,31,9,27],[46,3,34,10,30],[49,3,37,11,33],[52,3,40,12,36],[55,3,43,13,39],[58,3,46,14,42],[61,3,49,15,45],[64,3,52,16,48],[67,3,55,17,51],[70,3,58,18,54],[73,3,61,19,57],[76,3,64,20,60],[79,3,67,21,63],[82,3,70,22,66],[85,3,73,23,69],[88,3,76,24,72],[91,3,79,25,75],[94,3,82,26,78],[97,3,85,27,81],[100,3,88,28,84],[103,3,91,29,87],[106,3,94,30,90],[109,3,97,31,93]] },
  sorcerer: { mov: 5, stats: [[18,3,10,2,9],[20,3,13,3,13],[22,3,16,4,17],[24,3,19,5,21],[26,3,22,6,25],[28,3,25,7,29],[30,3,28,8,33],[32,3,31,9,37],[34,3,34,10,41],[36,3,37,11,45],[38,3,40,12,49],[40,3,43,13,53],[42,3,46,14,57],[44,3,49,15,61],[46,3,52,16,65],[48,3,55,17,69],[50,3,58,18,73],[52,3,61,19,77],[54,3,64,20,81],[56,3,67,21,85],[58,3,70,22,89],[60,3,73,23,93],[62,3,76,24,97],[64,3,79,25,101],[66,3,82,26,105],[68,3,85,27,109],[70,3,88,28,113],[72,3,91,29,117],[74,3,94,30,121],[76,3,97,31,125]] },
  necromancer: { mov: 5, stats: [[18,3,10,2,9],[20,3,13,3,13],[22,3,16,4,17],[24,3,19,5,21],[26,3,22,6,25],[28,3,25,7,29],[30,3,28,8,33],[32,3,31,9,37],[34,3,34,10,41],[36,3,37,11,45],[38,3,40,12,49],[40,3,43,13,53],[42,3,46,14,57],[44,3,49,15,61],[46,3,52,16,65],[48,3,55,17,69],[50,3,58,18,73],[52,3,61,19,77],[54,3,64,20,81],[56,3,67,21,85],[58,3,70,22,89],[60,3,73,23,93],[62,3,76,24,97],[64,3,79,25,101],[66,3,82,26,105],[68,3,85,27,109],[70,3,88,28,113],[72,3,91,29,117],[74,3,94,30,121],[76,3,97,31,125]] },
  bishop: { mov: 5, stats: [[26,4,8,3,6],[29,4,9,5,8],[32,4,10,7,10],[35,4,11,9,12],[38,4,12,11,14],[41,4,13,13,16],[44,4,14,15,18],[47,4,15,17,20],[50,4,16,19,22],[53,4,17,21,24],[56,4,18,23,26],[59,4,19,25,28],[62,4,20,27,30],[65,4,21,29,32],[68,4,22,31,34],[71,4,23,33,36],[74,4,24,35,38],[77,4,25,37,40],[80,4,26,39,42],[83,4,27,41,44],[86,4,28,43,46],[89,4,29,45,48],[92,4,30,47,50],[95,4,31,49,52],[98,4,32,51,54],[101,4,33,53,56],[104,4,34,55,58],[107,4,35,57,60],[110,4,36,59,62],[113,4,37,61,64]] },
  cleric: { mov: 5, stats: [[26,4,8,3,6],[29,4,9,5,8],[32,4,10,7,10],[35,4,11,9,12],[38,4,12,11,14],[41,4,13,13,16],[44,4,14,15,18],[47,4,15,17,20],[50,4,16,19,22],[53,4,17,21,24],[56,4,18,23,26],[59,4,19,25,28],[62,4,20,27,30],[65,4,21,29,32],[68,4,22,31,34],[71,4,23,33,36],[74,4,24,35,38],[77,4,25,37,40],[80,4,26,39,42],[83,4,27,41,44],[86,4,28,43,46],[89,4,29,45,48],[92,4,30,47,50],[95,4,31,49,52],[98,4,32,51,54],[101,4,33,53,56],[104,4,34,55,58],[107,4,35,57,60],[110,4,36,59,62],[113,4,37,61,64]] },
  peasant1: { mov: 4, stats: [[12,2,0,1,0],[14,3,0,2,0],[16,4,0,3,0],[18,5,0,4,0],[20,6,0,5,0],[22,7,0,6,0],[24,8,0,7,0],[26,9,0,8,0],[28,10,0,9,0],[30,11,0,10,0],[32,12,0,11,0],[34,13,0,12,0],[36,14,0,13,0],[38,15,0,14,0],[40,16,0,15,0],[42,17,0,16,0],[44,18,0,17,0],[46,19,0,18,0],[48,20,0,19,0],[50,21,0,20,0],[52,22,0,21,0],[54,23,0,22,0],[56,24,0,23,0],[58,25,0,24,0],[60,26,0,25,0],[62,27,0,26,0],[64,28,0,27,0],[66,29,0,28,0],[68,30,0,29,0],[70,31,0,30,0]] },
  villagerF1: { mov: 4, stats: [[9,1,0,0,1],[11,2,0,0,2],[13,3,0,0,3],[15,4,0,0,4],[17,5,0,0,5],[19,6,0,0,6],[21,7,0,0,7],[23,8,0,0,8],[25,9,0,0,9],[27,10,0,0,10],[29,11,0,0,11],[31,12,0,0,12],[33,13,0,0,13],[35,14,0,0,14],[37,15,0,0,15],[39,16,0,0,16],[41,17,0,0,17],[43,18,0,0,18],[45,19,0,0,19],[47,20,0,0,20],[49,21,0,0,21],[51,22,0,0,22],[53,23,0,0,23],[55,24,0,0,24],[57,25,0,0,25],[59,26,0,0,26],[61,27,0,0,27],[63,28,0,0,28],[65,29,0,0,29],[67,30,0,0,30]] },
  captain: { mov: 4, stats: [[60,11,0,7,4],[64,13,0,9,5],[68,15,0,11,6],[72,17,0,13,7],[76,19,0,15,8],[80,21,0,17,9],[84,23,0,19,10],[88,25,0,21,11],[92,27,0,23,12],[96,29,0,25,13],[100,31,0,27,14],[104,33,0,29,15],[108,35,0,31,16],[112,37,0,33,17],[116,39,0,35,18],[120,41,0,37,19],[124,43,0,39,20],[128,45,0,41,21],[132,47,0,43,22],[136,49,0,45,23],[140,51,0,47,24],[144,53,0,49,25],[148,55,0,51,26],[152,57,0,53,27],[156,59,0,55,28],[160,61,0,57,29],[164,63,0,59,30],[168,65,0,61,31],[172,67,0,63,32],[176,69,0,65,33]] },
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
  if (actor.className === 'Peasant') return EMBER_CLASSES[isFemalePeasant(actor) ? 'villagerF1' : 'peasant1'];
  return EMBER_CLASSES[CLASS_TABLE[actor.prestige] || CLASS_TABLE[actor.className]] || EMBER_CLASSES.swordsman;
}
function attributesAt(table, level) {
  const [hp, atk, mag, def, dex] = table.stats[Math.max(1, Math.min(HEIR_MAX_LEVEL, level)) - 1];
  return { hp, atk, mag, def, dex, mov: table.mov };
}
function attributesHTML(attrs) {
  const rows = [['Vida', attrs.hp], ['Ataque', attrs.atk], ['Magia', attrs.mag], ['Defesa', attrs.def], ['Destreza', attrs.dex], ['Movimento', attrs.mov]];
  return `<div class="sheet-section-label">ATRIBUTOS</div><dl class="attr-grid">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
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
  return `<div class="sheet-section-label">ATRIBUTOS</div><dl class="attr-grid heir-attrs">${HEIR_STATS.map(stat => `<div title="${stat.name}"><dt>${stat.key}</dt><dd>${stat.base + stat.per * (lv - 1)}</dd><small>${stat.name}</small></div>`).join('')}</dl>`;
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
const actorLabel = actor => actor.className === 'Peasant' ? (isFemalePeasant(actor) ? 'Camponesa' : 'Camponês') : `${actor.className}${actor.prestige ? ` · ${actor.prestige}` : ''}`;
const findActor = id => [...state.heroes, ...state.workers].find(actor => String(actor.id) === String(id)) || null;
function actorOrigin(actor) {
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
  { id: 'wheat', name: 'Trigo', art: 'farm-wheat', note: 'Pão de todo dia. Ninguém reclama, ninguém comemora.' },
  { id: 'garlic', name: 'Alho', art: 'farm-garlic', note: 'Afasta strigoi. E todo o resto também.' },
  { id: 'bacon', name: 'Bacon', art: 'farm-bacon', meat: true, note: 'Carne. Deixa os camponeses mais felizes.' },
  { id: 'eggs', name: 'Ovos', art: 'farm-eggs', note: 'Variedade. Os camponeses notam.' },
  { id: 'milk', name: 'Leite', art: 'farm-milk', note: 'Variedade. Às vezes azeda antes.' },
];
const RATIONS = [
  { label: 'Nenhuma', mult: 0, mood: -40 }, { label: 'Meia', mult: 0.5, mood: -15 }, { label: 'Normal', mult: 1, mood: 0 },
  { label: 'Dobrada', mult: 2, mood: 10 }, { label: 'Tripla', mult: 3, mood: 20 },
];
const VARIETY_MOOD = [0, -5, 0, 5, 8, 10]; // pelo número de alimentos diferentes na mesa
const MEAT_MOOD = 10;
const emptyFood = () => ({ wheat: 0, garlic: 0, bacon: 0, eggs: 0, milk: 0 });
// O casarão guarda 100 unidades. Cada Depósito de Provisões construído soma 30, e amplia para 45, 70 e 100.
// Guardam comida, armas e itens; madeira e ouro ficam fora.
const MANOR_STORAGE = 100;
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
  if (!next) return;
  if (state.gold < next.gold || state.timber < next.wood) { say('Falta ouro ou madeira. A comida vai continuar empilhada no corredor.'); return; }
  state.gold -= next.gold;
  state.timber -= next.wood;
  depot.level = (depot.level || 0) + 1;
  renderSites(); renderPanel(); updateHud();
  say(`Depósito de Provisões ampliado para ${next.cap} unidades. Os ratos agradecem o espaço extra.`);
}
function depotBoxHTML(depot) {
  const level = depot.level || 0;
  const next = STORAGE_LEVELS[level + 1];
  return `<section class="farm-selector hut-box"><div class="farm-selector-heading"><b>Depósito de Provisões</b><small>${depotCap(depot)} unidades · nível ${level + 1} de ${STORAGE_LEVELS.length}</small></div>
    ${next ? `<button type="button" class="hut-upgrade" data-depot-upgrade="${depot.site}">Ampliar para ${next.cap} unidades · ${costHTML(next.gold, next.wood)}</button>` : '<p class="storage-items">Tamanho máximo. Agora só falta ter o que guardar.</p>'}</section>`;
}
const totalFood = () => FOOD_TYPES.reduce((sum, food) => sum + (state.food?.[food.id] || 0), 0);
const eaters = () => state.workers.filter(worker => worker.alive).length;

function foodProduction() {
  const prod = emptyFood();
  state.buildings.filter(isDone).forEach(building => {
    if (building.type === 'farm') { const type = farmType(building.produce); prod[type.id] += type.grain; }
    else if (building.type === 'mill') prod.wheat += BUILDINGS.find(item => item.id === 'mill').grain;
  });
  return prod;
}
const foodDemand = () => eaters() * WORKER_UPKEEP * RATIONS[state.ration].mult;

function happinessLabel(value) {
  return value < 20 ? 'Revoltados' : value < 40 ? 'Infelizes' : value < 60 ? 'Conformados' : value < 80 ? 'Contentes' : 'Felizes';
}

// Uma vez por segundo de jogo: produz, serve a mesa e move a felicidade em direção ao alvo.
function feedWorkers(dt) {
  const prod = foodProduction();
  const produced = FOOD_TYPES.reduce((sum, food) => sum + prod[food.id] * dt, 0);
  const free = Math.max(0, storageCap() - storedUnits());
  const fit = produced > 0 ? Math.min(1, free / produced) : 1;
  FOOD_TYPES.forEach(food => { state.food[food.id] = (state.food[food.id] || 0) + prod[food.id] * dt * fit; });
  if (fit < 1 && !state.storageWarned) { state.storageWarned = true; say('O Depósito de Provisões está cheio. O resto da colheita apodreceu do lado de fora.'); }
  if (fit >= 1) state.storageWarned = false;
  const ration = RATIONS[state.ration];
  const demand = foodDemand() * dt;
  let remaining = demand;
  const eaten = new Set();
  let pool = FOOD_TYPES.filter(food => state.diet[food.id] && state.food[food.id] > 0);
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
    variety: ration.mult > 0 ? VARIETY_MOOD[eaten.size] : 0,
    meat: [...eaten].some(id => FOOD_TYPES.find(food => food.id === id)?.meat) ? MEAT_MOOD : 0,
    hunger: demand > 0 ? -Math.round(40 * (1 - fulfilled)) : 0,
  } : { ration: 0, variety: 0, meat: 0, hunger: 0 };
  const target = Math.max(0, Math.min(100, 50 + parts.ration + parts.variety + parts.meat + parts.hunger));
  const step = 0.5 * dt;
  state.happiness = Math.max(0, Math.min(100, state.happiness + Math.max(-step, Math.min(step, target - state.happiness))));
  state.moodParts = parts;
  state.moodTarget = target;
  if (fulfilled < 0.999 && eaters() && !state.hungerWarned) { state.hungerWarned = true; say('A comida não deu pra todo mundo. Os camponeses estão passando fome. Por enquanto, reclamam baixinho.'); }
  if (fulfilled >= 0.999) state.hungerWarned = false;
}

function foodPanelHTML() {
  const prod = foodProduction();
  const parts = state.moodParts || { ration: 0, variety: 0, meat: 0, hunger: 0 };
  const signed = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`;
  const n = eaters();
  const used = storedUnits();
  const extra = storageCap() - MANOR_STORAGE;
  const storageBox = `<div class="storage-box"><div class="mood-head"><span>DEPÓSITO DE PROVISÕES</span><b>${Math.floor(used)} / ${storageCap()}</b><small>comida, armas e itens</small></div>
      <div class="mood-bar storage-bar"><i style="width:${Math.min(100, Math.round(used / storageCap() * 100))}%"></i></div>
      <p class="storage-items">Casarão: ${MANOR_STORAGE}${depots().length ? ` · ${depots().length} ${depots().length === 1 ? 'depósito' : 'depósitos'}: +${extra}` : ''} · armas e itens guardados: ${state.items?.length || 0}</p>
      ${depots().length ? '' : '<p class="storage-items">Precisa de mais espaço? Construa um Depósito de Provisões.</p>'}</div>`;
  return `${storageBox}<div class="panel-title"><h3>Mesa dos camponeses</h3><span>${n} ${n === 1 ? 'boca' : 'bocas'} · ${foodDemand().toFixed(1).replace('.', ',')} por segundo</span></div>
    <div class="food-block"><div class="food-label">RAÇÃO</div>
      <div class="segmented ration">${RATIONS.map((ration, i) => `<button type="button" data-ration="${i}" class="${state.ration === i ? 'active' : ''}"><b>${ration.label}</b><small>${(eaters() * WORKER_UPKEEP * ration.mult).toFixed(1).replace('.', ',')}/s</small></button>`).join('')}</div>
      <p class="storage-items">Cada camponês come ${WORKER_UPKEEP.toFixed(1).replace('.', ',')} de provisão por segundo na ração normal. Meia come metade; dobrada, o dobro; tripla, o triplo.</p></div>
    <div class="food-label">CARDÁPIO</div>
    <div class="food-list">${FOOD_TYPES.map(food => { const on = !!state.diet[food.id]; const stock = state.food[food.id] || 0; return `<div class="food-row${on ? ' on' : ''}${stock <= 0 ? ' empty' : ''}">
        <img src="public/art/${food.art}-v01.webp" alt=""><span class="food-name"><b>${food.name}</b><small>${food.note}</small></span>
        <span class="food-stock"><b>${format(stock)}</b><small>${prod[food.id] ? `+${prod[food.id].toFixed(1).replace('.', ',')}/s` : 'sem produção'}</small></span>
        <button type="button" data-diet="${food.id}" class="${on ? 'on' : ''}">${on ? 'SERVINDO' : 'GUARDADO'}</button></div>`; }).join('')}</div>
    <div class="mood-box"><div class="mood-head"><span>FELICIDADE</span><b>${Math.round(state.happiness)}</b><em>${happinessLabel(state.happiness)}</em><small>indo para ${Math.round(state.moodTarget ?? state.happiness)}</small></div>
      <div class="mood-bar"><i style="width:${Math.round(state.happiness)}%"></i></div>
      <dl class="mood-parts"><div><dt>Ração</dt><dd>${signed(parts.ration)}</dd></div><div><dt>Variedade</dt><dd>${signed(parts.variety)}</dd></div><div><dt>Carne</dt><dd>${signed(parts.meat)}</dd></div><div><dt>Fome</dt><dd>${signed(parts.hunger)}</dd></div></dl></div>
    <div class="mood-rules"><div class="food-label">O QUE MUDA A FELICIDADE</div>
      <p>A felicidade parte de 50 e anda devagar até o alvo, que é 50 somado a estes efeitos:</p>
      <dl>
        <div><dt>Ração</dt><dd>Nenhuma −40 · Meia −15 · Normal 0 · Dobrada +10 · Tripla +20</dd></div>
        <div><dt>Variedade</dt><dd>Alimentos diferentes na mesa: 1 = −5 · 2 = 0 · 3 = +5 · 4 = +8 · 5 = +10</dd></div>
        <div><dt>Carne</dt><dd>Bacon servido e no estoque: +10</dd></div>
        <div><dt>Fome</dt><dd>Quando a comida servida não dá pra todos: até −40</dd></div>
      </dl>
      <p>Só conta o que está marcado como SERVINDO e tem estoque.</p></div>`;
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
  return data;
}

function hydrateState(data) {
  const loaded = Object.assign(newGameState(!!data.testMode), data);
  loaded.buildings.forEach(building => { building.builtAt = 0; });
  if (!data.food) loaded.food = { ...emptyFood(), wheat: data.grain || 0 };
  if (!Array.isArray(loaded.items)) loaded.items = [];
  if (loaded.taxPercent == null) loaded.taxPercent = 10;
  if (loaded.tavernTab == null) loaded.tavernTab = 0;
  loaded.nextBuildingId = Math.max(loaded.nextBuildingId || 1, ...loaded.buildings.map(building => building.site + 1));
  if (loaded.tab === 'contracts') loaded.tab = 'build';
  loaded.workers.forEach(worker => {
    worker.workplace = worker.workplace == null ? null : loaded.buildings.find(building => building.site === worker.workplace) || null;
  });
  [...loaded.heroes, ...loaded.workers].forEach(actor => { actor.route = []; actor.goal = null; actor.wait = 0; actor.finalPoint = null; });
  loaded.selectedBuild = null;
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
  $('#hero-layer').innerHTML = '';
  $$('.speed-btn').forEach(button => button.classList.toggle('active', Number(button.dataset.speed) === state.speed));
  $('#map-scene').style.setProperty('--mill-spin-duration', `${8 / state.speed}s`);
  $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
  camera.zoom = Math.min(2, Math.max(0, options.startZoom));
  $$('.zoom-btn').forEach(button => { const active = Number(button.dataset.zoom) === camera.zoom; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  closeMenu();
  sizeWorld();
  homeCamera();
  renderSites(); renderHeroes(); renderPanel(); updateHud();
  $('#event-line').textContent = state.ticks ? 'De volta ao Vale do Luto.' : 'A herança foi aceita. Os credores já estão a caminho.';
  writeSave(slot);
  game.running = true;
}

function newGame(slot, heir) {
  startGame(newGameState(debug.testMode, heir), slot);
  say(debug.testMode ? `Slot ${slot}. A herança é sua. Modo teste: o ouro não acaba, a desgraça também não.` : `Slot ${slot}. A herança é sua. Os credores já foram avisados.`);
}

function loadGame(slot) {
  const record = readSave(slot);
  if (!record) return;
  startGame(hydrateState(record.state), slot);
  say(`Slot ${slot}. Bem-vindo de volta. Dia ${Math.floor(state.minutes / 1440) + 1}. A fazenda continua horrível.`);
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

const SCREENS = {
  title() {
    const latest = latestSave();
    return { cls: 'is-title', html: `<div class="title-screen">
      <div class="title-logo"><h1>Wasteland Farming</h1><p class="title-sub">HERITAGE OF ASHES · A KINGDOM OF MORDAVIA FANTASY SIM</p><p class="title-epigraph">${titleLine}</p><p class="title-version">${GAME_VERSION}</p></div>
      <nav class="menu-list" aria-label="Menu principal">
        ${latest ? '<button type="button" class="primary" data-action="continue">Continuar</button>' : ''}
        <button type="button" class="${latest ? '' : 'primary'}" data-action="new">Novo jogo</button>
        ${latest ? '<button type="button" data-action="load">Carregar jogo</button>' : ''}
        <button type="button" data-action="options">Opções</button>
        <button type="button" data-action="debug">Debug</button>
      </nav>
      <p class="title-save">${latest ? `Slot ${latest.slot} · ${slotSummary(latest.record)}` : 'Nenhum jogo salvo ainda.'}</p>
      <footer class="title-footer"><span>O SAVE FICA NESTE NAVEGADOR</span>${debug.testMode ? '<span class="tag-test">MODO TESTE LIGADO</span>' : ''}</footer>
    </div>` };
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
  saves({ mode }) {
    const loading = mode === 'load';
    const slots = allSaves().map(({ slot, record }) => {
      const disabled = loading && !record;
      const del = record ? `<button type="button" class="slot-delete" data-action="delete-slot" data-slot="${slot}">Apagar</button>` : '';
      return `<div class="save-slot${record ? '' : ' empty'}${game.slot === slot ? ' current' : ''}"><button type="button" class="slot-main" data-action="${loading ? 'load-slot' : 'new-slot'}" data-slot="${slot}" ${disabled ? 'disabled' : ''}>${saveCard(slot, record)}</button>${del}</div>`;
    }).join('');
    return { cls: menuMode(), html: `<section class="menu-card wide">
      <header class="menu-card-head"><span class="eyebrow">${loading ? 'CARREGAR' : 'NOVO JOGO'}</span><h2>${loading ? 'Carregar jogo' : 'Em qual slot?'}</h2><p>${loading ? 'Escolha qual desastre retomar.' : 'Escolha onde a próxima tragédia da família vai ficar registrada.'}</p></header>
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
        <li>Toda construção é uma <b>obra</b>: um camponês precisa trabalhar um minuto no local.</li>
        <li>O <b>ouro</b> vem dos impostos, cobrados à meia-noite: dos camponeses e de quem bebe na taverna.</li>
        <li><b>Esc</b> ou <b>MENU</b> pausa e salva.</li>
      </ul>
      <p class="title-save">Este jogo salva no slot ${slot}.${occupied ? ' O jogo que está lá some.' : ''}${debug.testMode ? ' <b class="test-text">Modo teste ligado: ouro e madeira infinitos.</b>' : ''}</p>
      <div class="menu-actions"><button type="button" class="primary" data-action="accept" data-slot="${slot}">Aceitar a herança</button><button type="button" data-action="back">Voltar</button></div>
    </section>` };
  },
  heir({ slot, selected }) {
    const card = (heir, i) => `<button type="button" class="heir-card${i === selected ? ' selected' : ''}" data-action="pick-heir" data-index="${i}" aria-pressed="${i === selected}">
        ${crestSVG(heir.house, 44)}<b>${heir.name.split(' ')[0]}</b><small>${HOUSES[heir.house].name}</small><small>${heir.age} anos</small></button>`;
    const men = HEIRS.map((heir, i) => ({ heir, i })).filter(entry => entry.heir.gender === 'm');
    const women = HEIRS.map((heir, i) => ({ heir, i })).filter(entry => entry.heir.gender === 'f');
    const chosen = HEIRS[selected];
    const house = HOUSES[chosen.house];
    return { cls: 'is-title', html: `<section class="menu-card heir-screen">
      <header class="menu-card-head"><span class="eyebrow">NOVO JOGO · SLOT ${slot}</span><h2>Quem herda o Vale do Luto?</h2><p>Ninguém da família quis. Escolha quem vai ser obrigado.</p></header>
      <div class="heir-row-label">HERDEIROS</div>
      <div class="heir-grid">${men.map(entry => card(entry.heir, entry.i)).join('')}</div>
      <div class="heir-row-label">HERDEIRAS</div>
      <div class="heir-grid">${women.map(entry => card(entry.heir, entry.i)).join('')}</div>
      <div class="heir-detail">
        ${crestSVG(chosen.house, 76)}
        <div><span class="eyebrow">${house.name.toUpperCase()}</span><h3>${chosen.name}</h3><p class="heir-motto">“${house.motto}”</p>
          <p>${chosen.about}</p><p class="heir-tie">${chosen.age} anos · ${chosen.tie}</p></div>
      </div>
      <div class="menu-actions"><button type="button" class="primary" data-action="choose-heir" data-slot="${slot}">Escolher ${chosen.name.split(' ')[0]}</button><button type="button" data-action="back">Voltar</button></div>
    </section>` };
  },
  sheet() {
    const heir = heirById(state.heir);
    const day = Math.floor(state.minutes / 1440) + 1;
    if (!heir) return { cls: 'is-pause', html: `<section class="menu-card"><header class="menu-card-head"><span class="eyebrow">FICHA DO HERDEIRO</span><h2>Herdeiro desconhecido</h2><p>Este save é de antes da escolha de herdeiros. Ninguém lembra quem assinou a herança.</p></header><div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar ao jogo</button></div></section>` };
    const house = HOUSES[heir.house];
    return { cls: 'is-pause', html: `<section class="menu-card sheet">
      <div class="sheet-top">${crestSVG(heir.house, 96)}
        <div><span class="eyebrow">FICHA DO HERDEIRO</span><h2>${heir.name}</h2><p class="heir-motto">${house.name} · “${house.motto}”</p></div></div>
      <div class="sheet-level">
        <div class="sheet-level-head"><b>Nível ${state.heirLevel}</b><span>de ${HEIR_MAX_LEVEL}</span><small>${state.heirLevel >= HEIR_MAX_LEVEL ? 'Nível máximo. O tédio também.' : `${state.heirXp} / ${xpToNext(state.heirLevel)} XP`}</small></div>
        <div class="xp-bar"><i style="width:${state.heirLevel >= HEIR_MAX_LEVEL ? 100 : Math.round(state.heirXp / xpToNext(state.heirLevel) * 100)}%"></i></div>
      </div>
      ${heirAttributesHTML(state.heirLevel)}
      <dl class="sheet-facts">
        <div><dt>Idade</dt><dd>${heir.age} anos</dd></div>
        <div><dt>${heir.gender === 'f' ? 'Herdeira' : 'Herdeiro'} de</dt><dd>Vale do Luto</dd></div>
        <div><dt>Parentesco</dt><dd>${heir.tie}</dd></div>
      </dl>
      <p class="sheet-about">${heir.about}</p>
      <p class="sheet-house">${house.about}</p>
      <div class="sheet-section-label">EQUIPAMENTO</div>
      <div class="equip-grid">${EQUIP_SLOTS.map(({ slot, label }) => { const item = ITEMS[(state.equipment || BASIC_EQUIPMENT())[slot]]; return `<div class="equip-slot">${item ? pixelIcon(item.icon, 48) : ''}<span><small>${label}</small><b>${item ? item.name : 'Vazio'}</b><em>${item ? item.about : ''}</em></span></div>`; }).join('')}</div>
      <dl class="sheet-facts domain">
        <div><dt>Dias no domínio</dt><dd>${day}</dd></div>
        <div><dt>Construções</dt><dd>${state.buildings.length}</dd></div>
        <div><dt>Heróis</dt><dd>${state.heroes.filter(hero => hero.alive).length}</dd></div>
        <div><dt>Trabalhadores</dt><dd>${state.workers.filter(worker => worker.alive).length}</dd></div>
      </dl>
      <div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar ao jogo</button></div>
    </section>` };
  },
  actor({ id }) {
    const actor = findActor(id);
    if (!actor) return { cls: 'is-pause', html: `<section class="menu-card"><header class="menu-card-head"><span class="eyebrow">FICHA</span><h2>Não está mais aqui</h2><p>Foi embora, morreu ou as duas coisas.</p></header><div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar ao jogo</button></div></section>` };
    const level = actor.level || 1;
    return { cls: 'is-pause', html: `<section class="menu-card sheet">
      <div class="sheet-top"><img class="sheet-portrait" src="public/art/portraits/${actorPortrait(actor)}-portrait-v01.webp" alt="">
        <div><span class="eyebrow">FICHA · ${actor.className === 'Peasant' ? 'SERVO' : 'PROTETOR'}</span><h2>${actor.name}</h2><p class="heir-motto">${actorLabel(actor)}</p></div></div>
      ${levelHTML(level, actor.xp || 0)}
      ${attributesHTML(attributesAt(tableFor(actor), level))}
      ${actor.trait ? `<p class="sheet-about"><b>${actor.trait}.</b> ${TRAITS[actor.trait] || ''}</p>` : ''}
      <p class="sheet-house">${actorOrigin(actor)}</p>
      <div class="menu-actions"><button type="button" class="primary" data-action="back">Voltar ao jogo</button></div>
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
      <div class="menu-actions"><button type="button" class="primary" data-action="resume">Continuar no Vale do Luto</button><button type="button" data-action="save-quit">Sair pro título</button></div>
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
        <div class="option-row"><div><b>Salvar sozinho</b><small>Salva no slot do jogo de tempos em tempos e quando você fecha a página.</small></div>${segmented('autosave', options.autosave, [[0, 'Desligado'], [1, '1 min'], [3, '3 min'], [5, '5 min']])}</div>
        <div class="option-row"><div><b>Zoom ao começar</b><small>Ampla, normal ou próxima. Dá pra trocar no mapa a qualquer hora.</small></div>${segmented('startZoom', options.startZoom, [[0, 'Ampla'], [1, 'Normal'], [2, 'Próxima']])}</div>
        <div class="option-row"><div><b>Nomes dos personagens</b><small>Eles têm nome. Ninguém lembra qual.</small></div>${segmented('names', options.names, [['selected', 'Ao tocar'], ['always', 'Sempre']])}</div>
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
      <header class="menu-card-head"><span class="eyebrow">SLOT ${game.slot} · DIA ${day} · ${clock}</span><h2>Pausado</h2><p>${game.lastSaved ? `Último save ${ago(game.lastSaved)}.` : 'Ainda não salvou este jogo.'}</p></header>
      <nav class="menu-list compact" aria-label="Menu de pausa">
        <button type="button" class="primary" data-action="resume">Voltar ao jogo</button>
        <button type="button" data-action="save">Salvar no slot ${game.slot}</button>
        <button type="button" data-action="load">Carregar jogo</button>
        <button type="button" data-action="options">Opções</button>
        <button type="button" data-action="debug">Debug</button>
        <button type="button" data-action="quit">Sair pro título</button>
      </nav>
    </section>` };
  },
  quit() {
    return { cls: 'is-pause', html: `<section class="menu-card narrow">
      <header class="menu-card-head"><span class="eyebrow">SAIR</span><h2>Sair pro título?</h2><p>O que não foi salvo se perde. A fazenda não vai sentir sua falta.</p></header>
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
  layer.className = `menu-layer ${cls}`;
  layer.hidden = false;
  $('#menu-panel').innerHTML = html;
  fitMenu();
  $('#menu-panel button:not([disabled])')?.focus({ preventScroll: true });
}

// A tela de menu encolhe o mínimo necessário para caber na altura da janela, sem rolagem.
function fitMenu() {
  const card = $('#menu-panel').firstElementChild;
  if (!card) return;
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
      else { options[name] = value; writeStore(OPTIONS_KEY, options); applyOptions(); }
      renderMenu();
      return;
    }
    switch (button.dataset.action) {
      case 'continue': showScreen('continue'); break;
      case 'new': showScreen('saves', { mode: 'new' }); break;
      case 'load': showScreen('saves', { mode: 'load' }); break;
      case 'options': showScreen('options'); break;
      case 'debug': showScreen('debug'); break;
      case 'back': goBack(); break;
      case 'resume': closeMenu(); break;
      case 'load-slot':
        if (game.slot && game.slot !== slot) confirmThen({ title: `Carregar o slot ${slot}?`, text: `O jogo aberto vai ser salvo no slot ${game.slot} antes. Por precaução, não por otimismo.`, confirmLabel: 'Carregar' }, () => { writeSave(game.slot); loadGame(slot); });
        else loadGame(slot);
        break;
      case 'new-slot': showScreen('heir', { slot, selected: 0 }); break;
      case 'pick-heir': menu.stack[menu.stack.length - 1].params.selected = Number(button.dataset.index); renderMenu(); break;
      case 'choose-heir': showScreen('intro', { slot, heir: HEIRS[menu.stack[menu.stack.length - 1].params.selected].id }); break;
      case 'accept': newGame(slot, menu.stack[menu.stack.length - 1].params.heir); break;
      case 'delete-slot':
        confirmThen({ title: `Apagar o slot ${slot}?`, text: 'Esse jogo some pra sempre. Como a família anterior.', confirmLabel: 'Apagar', danger: true }, () => {
          deleteSave(slot);
          if (game.slot === slot) { toTitle(); return; }
          menu.stack.pop();
          if (!latestSave() && menu.stack[menu.stack.length - 1]?.params?.mode === 'load') menu.stack.pop();
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
        state.retinue = { scenario: 1, servants: params.servants.map(findActor).filter(Boolean).map(copy), protectors: params.protectors.map(findActor).filter(Boolean).map(copy) };
        writeSave(game.slot);
        menu.stack = [];
        showScreen('retinueDone');
        break;
      }
      case 'confirm-yes': { const run = menu.pending; menu.pending = null; run?.(); break; }
      case 'save': say(writeSave(game.slot) ? `Salvo no slot ${game.slot}, neste navegador.` : 'Não deu pra salvar. O navegador recusou.'); renderMenu(); break;
      case 'quit': showScreen('quit'); break;
      case 'save-quit': writeSave(game.slot); toTitle(); break;
      case 'quit-nosave': toTitle(); break;
    }
  });
  $('#menu-btn').addEventListener('click', openPause);
  ['#grain', '#happiness'].forEach(sel => $(sel).closest('.stat').addEventListener('click', () => {
    if (!game.slot) return;
    state.tab = 'food';
    $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
    renderPanel();
  }));
  $('#sheet-btn').addEventListener('click', () => { if (!game.slot) return; menu.stack = []; showScreen('sheet'); });
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
  scene.addEventListener('pointermove', event => { if (state.selectedBuild) showPlacementPreview(event); });
  scene.addEventListener('pointerleave', () => { $('#placement-preview').hidden = true; });
  scene.addEventListener('contextmenu', event => { if (state.selectedBuild) { event.preventDefault(); cancelPlacement(); } });
  scene.addEventListener('click', event => {
    if (!state.selectedBuild || camera.dragMoved || event.target.closest('button')) return;
    const { x, y } = worldPoint(event);
    placeBuilding(x, y);
  });
  $('#site-layer').addEventListener('click', event => {
    const site = event.target.closest('.site');
    if (!site) return;
    const idx = Number(site.dataset.site);
    const building = state.buildings.find(item => item.site === idx);
    if (state.selectedBuild) say('Aqui já tem construção. Escolha outro lugar.');
    else if (building && building.underConstruction) {
      const worker = building.builderId != null ? findActor(building.builderId) : null;
      say(`${buildingName(building)}: em obra, ${Math.floor((building.progress || 0) / BUILD_TIME * 100)}%. ${worker ? `${worker.name} está trabalhando.` : 'Esperando um camponês livre.'}`);
    } else if (building) {
      state.selectedBuild = null;
      state.selectedSite = idx;
      const def = BUILDINGS.find(item => item.id === building.type);
      renderSites();
      if (def.id === 'market') {
        state.tab = 'market';
        $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
        renderPanel();
        say('Mercado: venda o que sobra, compre o que falta.');
      } else if (def.id === 'hut' || def.id === 'depot' || def.id === 'lumber') {
        state.tab = 'build';
        $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
        renderPanel();
        say(def.id === 'lumber' ? `Cabana do Lenhador: ${lumberCrew(building).length} de 3 camponeses. Escale no painel.` : def.id === 'depot' ? `Depósito de Provisões: ${depotCap(building)} unidades. Dá pra ampliar no painel.` : building.big ? 'Casebre Grande: cinco moradores, nenhuma privacidade.' : 'Casebre Pequeno: dá pra ampliar no painel.');
      } else if (def.heroClass || def.id === 'farm') {
        state.tab = 'build';
        $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
        if (def.id === 'farm') state.selectedFarmType = farmType(building.produce).id;
        renderPanel();
        say(def.id === 'farm' ? `Fazenda de ${farmType(building.produce).name}: escolha a produção no painel.` : `${def.name}: atualize ou especialize no painel.`, def.id === 'farm' ? `A fazenda está produzindo ${farmType(building.produce).name.toLowerCase()}.` : `${def.name} está aberta. A localização afeta quem a procura.`);
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
    state.taxPercent = Math.max(0, Math.min(50, state.taxPercent + step));
    updateHud();
    say(`Imposto em ${state.taxPercent}%. Cobrado à meia-noite.`, state.taxPercent >= 30 ? `Imposto em ${state.taxPercent}%. Os camponeses aprenderam palavras novas.` : `Imposto em ${state.taxPercent}%.`);
  };
  $('#tax-down').addEventListener('click', () => setTax(-5));
  $('#tax-up').addEventListener('click', () => setTax(5));
  renderSites(); renderHeroes(); renderPanel(); updateHud();
  setInterval(tick, 1000);
  requestAnimationFrame(animateActors);
  initMenus();
}

init();
