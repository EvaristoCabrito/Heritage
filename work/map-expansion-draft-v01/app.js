const BUILDINGS = [
  { id: 'farm', name: 'Fazenda', glyph: 'F', cost: 115, wood: 6, detail: 'Escolha entre alho, trigo, bacon, ovos e leite.', gold: 0.55, grain: 2.4, people: 0 },
  { id: 'mill', name: 'Moinho', glyph: 'M', cost: 155, wood: 10, detail: 'Mói os grãos e amplia as provisões.', gold: 0.4, grain: 1.8, people: 0 },
  { id: 'tavern', name: 'Taverna', glyph: 'T', cost: 145, wood: 9, detail: 'Atrai aventureiros para o domínio.', gold: 1.15, grain: 0, people: 0 },
  { id: 'hotel', name: 'Hotel de Estrada', glyph: 'H', cost: 170, wood: 11, detail: 'Hospeda mais 4 heróis e atrai viajantes.', gold: 0.85, grain: 0, people: 0 },
  { id: 'warrior', name: 'Guilda de Guerreiros', glyph: 'W', cost: 185, wood: 11, detail: 'Atrai Warriors para a linha de frente.', heroClass: 'Warrior', gold: 0.3, grain: 0, people: 1 },
  { id: 'archer', name: 'Salão de Arqueiros', glyph: 'A', cost: 170, wood: 10, detail: 'Atrai Archers de olhar preciso.', heroClass: 'Archer', gold: 0.3, grain: 0, people: 1 },
  { id: 'lancer', name: 'Pátio dos Lanceiros', glyph: 'L', cost: 175, wood: 11, detail: 'Atrai Lancers para proteger os caminhos.', heroClass: 'Lancer', gold: 0.3, grain: 0, people: 1 },
  { id: 'blackMage', name: 'Torre do Black Mage', glyph: 'M', cost: 210, wood: 12, detail: 'Atrai Black Mages para artes destrutivas.', heroClass: 'Black Mage', gold: 0.2, grain: 0, people: 1 },
  { id: 'conjurer', name: 'Casa dos Conjuradores', glyph: 'C', cost: 200, wood: 12, detail: 'Atrai Conjurers e seus estudos estranhos.', heroClass: 'Conjurer', gold: 0.2, grain: 0, people: 1 },
  { id: 'healer', name: 'Guilda de Curandeiros', glyph: 'H', cost: 180, wood: 10, detail: 'Atrai Healers para manter gente viva.', heroClass: 'Healer', gold: 0.25, grain: 0, people: 1 },
  { id: 'armory', name: 'Arsenal do Domínio', glyph: 'E', cost: 165, wood: 9, detail: 'Equipa heróis e encurta a caçada ao covil.', gold: 0.15, grain: 0, people: 0 },
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
const actorArt = actor => actor.spriteId || CLASS_ART[actor.className];
const actorPortrait = actor => actor.portraitId || PORTRAIT_ART[actor.className] || 'male-peasant';
const heroCapacity = () => 8 + state.buildings.filter(building => building.type === 'hotel').length * 4;
const SITES = [
  { x: 77, y: 42 }, { x: 26, y: 56 }, { x: 76, y: 63 },
  { x: 25, y: 77 }, { x: 76, y: 86 }, { x: 54, y: 82 },
  { x: 23, y: 131 }, { x: 79, y: 125 }, { x: 77, y: 156 }, { x: 23, y: 168 },
];
const BUILDING_ART = {
  farm: 'farm-wheat', mill: 'mill-body', tavern: 'tavern', hotel: 'hotel', warrior: 'guild', archer: 'archer', lancer: 'lancer',
  blackMage: 'tower', conjurer: 'conjurer', healer: 'healer', armory: 'armory',
};
const LAIR_ART = { dungeon: 'mordavia-dungeon-entrance-v01.png', monster: 'mordavia-monster-lair-v01.png' };
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
  { x: 49, y: 97, links: [5, 13] },        // Saída sul do casarão
  { x: 65, y: 107, links: [12, 14] },      // Entrada da Estrada Velha
  { x: 55, y: 132, links: [13, 15, 17] },
  { x: 44, y: 155, links: [14, 16] },
  { x: 51, y: 181, links: [15] },
  { x: 64, y: 151, links: [14] },
];
const PATROLS = {
  Warrior: [0, 3, 6, 1, 5, 14, 16],
  Healer: [0, 2, 5, 1, 6, 14],
  other: [0, 1, 3, 6, 2, 14, 17],
};

const state = {
  gold: 240, grain: 58, timber: 30, people: 14,
  speed: 1, minutes: 380, ticks: 0, selectedBuild: null, selectedSite: null, selectedFarmType: 'wheat', bountyTimer: 0, taxLevel: 1,
  tab: 'build', bounty: 0, denCleared: false, raidCount: 0, won: false,
  buildings: [],
  heroes: [
    { id: 1, name: 'Warrior 01', className: 'Warrior', level: 7, xp: 5, x: 42, y: 39, alive: true },
    { id: 2, name: 'Healer 01', className: 'Healer', level: 14, xp: 13, x: 53, y: 54, alive: true },
  ],
  workers: [
    { id: 'peasant-1', name: 'Peasant 01', className: 'Peasant', spriteId: 'peasant', portraitId: 'male-peasant', x: 42, y: 39, alive: true, workTrip: false },
    { id: 'female-peasant-1', name: 'Female Peasant 01', className: 'Peasant', spriteId: 'female-peasant', portraitId: 'female-peasant', x: 42, y: 39, alive: true, workTrip: false },
  ],
  selectedActor: null,
  selectedLair: null, movingLair: null, activeExpedition: null,
  lairs: [
    { id: 'crypt', name: 'Cripta Abandonada', type: 'dungeon', region: 'manor', x: 62, y: 24, cleared: false },
    { id: 'wolves', name: 'Covil dos Lobos', type: 'monster', region: 'manor', x: 11, y: 68, cleared: false },
    { id: 'vault', name: 'Ruínas Subterrâneas', type: 'dungeon', region: 'road', x: 49, y: 120, cleared: false },
    { id: 'beasts', name: 'Covil das Feras', type: 'monster', region: 'road', x: 90, y: 180, cleared: false },
  ],
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const format = n => Math.floor(n).toLocaleString('pt-BR');
let toastTimer;

// A câmera percorre o mundo sem alterar as coordenadas dos lotes e personagens.
const ZOOM_LEVELS = [1, 1.3, 1.6];
const camera = { x: 0.5, y: 0.08, zoom: 1, drag: null };
const clampCamera = value => Math.max(0, Math.min(1, value));

function cameraBounds() {
  const scene = $('#map-scene');
  const world = $('#map-world');
  return {
    x: Math.max(0, world.offsetWidth * ZOOM_LEVELS[camera.zoom] - scene.clientWidth),
    y: Math.max(0, world.offsetHeight * ZOOM_LEVELS[camera.zoom] - scene.clientHeight),
  };
}

function renderCamera() {
  const bounds = cameraBounds();
  const world = $('#map-world');
  world.style.setProperty('--zoom', ZOOM_LEVELS[camera.zoom]);
  world.style.setProperty('--camera-x', `${-bounds.x * camera.x}px`);
  world.style.setProperty('--camera-y', `${-bounds.y * camera.y}px`);
  const centerY = (bounds.y * camera.y + $('#map-scene').clientHeight / 2) / ZOOM_LEVELS[camera.zoom];
  const region = centerY >= $('.road-region').offsetTop ? 'road' : 'manor';
  $$('[data-region]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.region === region)));
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
  const scene = $('#map-scene');
  const region = name === 'road' ? $('.road-region') : $('.manor-region');
  const bounds = cameraBounds();
  const worldY = (region.offsetTop + region.offsetHeight * (name === 'road' ? 0.38 : 0.34)) * ZOOM_LEVELS[camera.zoom];
  camera.x = 0.5;
  camera.y = bounds.y ? clampCamera((worldY - scene.clientHeight / 2) / bounds.y) : 0;
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
    const place = event.type === 'pointerup' && !camera.drag.moved && state.movingLair;
    camera.drag = null;
    scene.classList.remove('dragging');
    if (scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
    if (place) placeLairAt(event.clientX, event.clientY);
  };
  scene.addEventListener('pointerdown', event => {
    if (camera.drag || event.button !== 0 || event.target.closest('button')) return;
    camera.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
    scene.setPointerCapture(event.pointerId);
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
      camera.x = 0.5; camera.y = 0.08; renderCamera();
    }
  });
  $('#camera-home').addEventListener('click', () => {
    focusRegion('manor');
  });
  $$('.zoom-btn').forEach(button => button.addEventListener('click', () => setZoom(Number(button.dataset.zoom))));
  $$('[data-region]').forEach(button => button.addEventListener('click', () => focusRegion(button.dataset.region)));
  window.addEventListener('resize', renderCamera);
  renderCamera();
}

function say(message, event = message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  $('#event-line').textContent = event;
}

function rates() {
  return state.buildings.reduce((sum, building) => {
    const def = BUILDINGS.find(item => item.id === building.type);
    if (def) {
      const output = building.type === 'farm' ? farmType(building.produce) : def;
      sum.gold += output.gold; sum.grain += output.grain; sum.people += def.people;
    }
    return sum;
  }, { gold: [0.45, 1.05, 1.8][state.taxLevel], grain: 0, timber: 0.28, people: 0 });
}

function updateHud() {
  const r = rates();
  $('#gold').textContent = format(state.gold);
  $('#grain').textContent = format(state.grain);
  $('#timber').textContent = format(state.timber);
  $('#people').textContent = format(state.people);
  $('#gold-rate').textContent = `+${r.gold.toFixed(1).replace('.', ',')}/s`;
  $('#grain-rate').textContent = `+${r.grain.toFixed(1).replace('.', ',')}/s`;
  $('#timber-rate').textContent = `+${r.timber.toFixed(1).replace('.', ',')}/s`;
  const taxNames = ['LEVE','MODERADO','PESADO'];
  const taxRates = ['REDUZIDO','PADRÃO','ALTO'];
  $('#tax-name').textContent = taxNames[state.taxLevel];
  $('#tax-rate-label').textContent = taxRates[state.taxLevel];
  $('#objective-gold').textContent = format(state.gold);
  const pct = Math.min(100, state.gold / 6);
  $('#objective-bar').style.width = `${pct}%`;
  const hh = Math.floor(state.minutes / 60) % 24;
  const mm = state.minutes % 60;
  $('#clock').textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  if (state.gold >= 600 && !state.won) {
    state.won = true;
    say('Cenário conquistado: o domínio agora paga as próprias dívidas.', 'Os credores receberam a notícia. Infelizmente, também receberam o endereço.');
    $('#map-hint').textContent = 'O próximo título já está sendo preparado.';
  }
}

function renderSites() {
  $$('.site').forEach(site => {
    const idx = Number(site.dataset.site);
    const building = state.buildings.find(b => b.site === idx);
    site.classList.toggle('built', !!building);
    site.classList.toggle('selected', state.selectedSite === idx);
    site.classList.toggle('pending', !!state.selectedBuild && !building);
    site.style.zIndex = String(Math.round(SITES[idx].y * 10));
    if (building) {
      const def = BUILDINGS.find(item => item.id === building.type);
      const branchNames = { Bishop: 'Templo Bishop', Cleric: 'Treino Cleric' };
      const label = building.type === 'farm' ? `Fazenda de ${farmType(building.produce).name}` : building.branch ? (branchNames[building.branch] || `Guilda ${building.branch}`) : def.name;
      const art = building.type === 'farm' ? farmType(building.produce).art : BUILDING_ART[building.type];
      site.classList.toggle('just-built', Date.now() - building.builtAt < 1400);
      site.dataset.art = art;
      site.innerHTML = `<span class="building-art" style="background-image:url('public/art/${art}-v01.webp')" aria-hidden="true">${building.type === 'mill' ? '<span class="mill-sails"></span>' : ''}</span><small>${label}</small>`;
      site.setAttribute('aria-label', `${label}. Toque para ver opções.`);
    } else {
      site.classList.remove('just-built');
      delete site.dataset.art;
      site.innerHTML = '<span class="site-ring">+</span><small>LOTE LIVRE</small>';
      site.setAttribute('aria-label', `Lote de construção ${idx + 1}`);
    }
  });
}

function renderLairs() {
  const hosts = { manor: $('#lair-layer-manor'), road: $('#lair-layer-road') };
  Object.values(hosts).forEach(host => host.replaceChildren());
  state.lairs.forEach(lair => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `lair-marker${lair.cleared ? ' cleared' : ''}${state.selectedLair === lair.id ? ' selected' : ''}`;
    button.style.left = `${lair.x}%`;
    button.style.top = `${lair.region === 'road' ? lair.y - 100 : lair.y}%`;
    button.style.zIndex = String(Math.round(lair.y * 10));
    button.setAttribute('aria-label', `${lair.name}${lair.cleared ? ', explorado' : ', ativo'}. Toque para ver opções.`);
    button.innerHTML = `<img src="public/art/${LAIR_ART[lair.type]}" alt=""><small>${lair.name}</small>`;
    button.addEventListener('click', () => selectLair(lair.id));
    hosts[lair.region].append(button);
  });
}

function selectLair(id) {
  const lair = state.lairs.find(item => item.id === id);
  if (!lair) return;
  state.movingLair = null;
  state.selectedLair = id;
  state.tab = 'lairs';
  $$('.tab').forEach(tab => {
    const active = tab.dataset.tab === 'lairs';
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  renderLairs(); renderPanel();
  say(`${lair.name}: ${lair.cleared ? 'explorado' : 'ainda ativo'}.`);
}

function moveLair(id) {
  const lair = state.lairs.find(item => item.id === id);
  if (!lair) return;
  if (state.movingLair === id) {
    state.movingLair = null;
    renderPanel();
    say('Mudança de local cancelada.');
    return;
  }
  if (state.activeExpedition?.id === id) { say('Aguarde o retorno da expedição antes de mover este local.'); return; }
  state.selectedLair = id;
  state.movingLair = id;
  focusRegion(lair.region);
  renderLairs(); renderPanel();
  say(`Escolha um ponto livre no mapa para mover ${lair.name}. Arraste para percorrer o mapa.`);
}

function placeLairAt(clientX, clientY) {
  const lair = state.lairs.find(item => item.id === state.movingLair);
  if (!lair) return;
  const region = lair.region === 'road' ? $('.road-region') : $('.manor-region');
  const rect = region.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    say('Escolha um ponto na mesma região do local selecionado.');
    return;
  }
  const x = (clientX - rect.left) / rect.width * 100;
  const localY = (clientY - rect.top) / rect.height * 100;
  const y = localY + (lair.region === 'road' ? 100 : 0);
  const nearSite = SITES.some(site => Math.hypot(site.x - x, site.y - y) < 14);
  const nearLair = state.lairs.some(other => other.id !== lair.id && other.region === lair.region && Math.hypot(other.x - x, other.y - y) < 16);
  const nearOriginalDen = lair.region === 'manor' && Math.hypot(88 - x, 17 - y) < 16;
  if (x < 9 || x > 91 || localY < 10 || localY > 88 || nearSite || nearLair || nearOriginalDen) {
    say('Este ponto está ocupado ou perto da borda. Escolha outro terreno.');
    return;
  }
  lair.x = x; lair.y = y;
  state.movingLair = null;
  renderLairs(); renderPanel();
  say(`${lair.name} movido para um novo ponto.`);
}

function exploreLair(id) {
  const lair = state.lairs.find(item => item.id === id);
  if (!lair || lair.cleared) return;
  if (state.activeExpedition) { say('Já existe uma expedição em andamento.'); return; }
  const cost = lair.type === 'dungeon' ? 35 : 45;
  if (state.gold < cost) { say(`A expedição exige ${cost} moedas.`); return; }
  if (!state.heroes.some(hero => hero.alive)) { say('É preciso ter ao menos um herói para explorar.'); return; }
  state.gold -= cost;
  state.activeExpedition = { id, remaining: 20 };
  state.heroes.filter(hero => hero.alive).forEach(hero => { hero.wait = 0; routeActor(hero, nearestNode(lair)); });
  renderPanel(); updateHud();
  say(`Expedição enviada a ${lair.name}.`, `Heróis partiram para ${lair.name}.`);
}

function renderHeroes() {
  const layers = [$('#hero-layer'), $('#hero-layer-road')];
  const active = new Set();
  [...state.heroes, ...state.workers].filter(actor => actor.alive).forEach(actor => {
    active.add(String(actor.id));
    const layer = actor.y < 100 ? layers[0] : layers[1];
    let token = layers.flatMap(host => [...host.children]).find(node => node.dataset.actor === String(actor.id));
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
        state.selectedActor = actor.id;
        say(`${actor.name}: ${actor.className === 'Peasant' ? 'trabalha entre o casarão e os terrenos do domínio.' : 'percorre o domínio por conta própria.'}`);
        renderHeroes();
      });
      layer.append(token);
    }
    if (token.parentElement !== layer) layer.append(token);
    const fighting = actor.className !== 'Peasant' && state.bountyTarget?.includes('Covil') && !state.denCleared && Math.hypot(actor.x - 85, actor.y - 21) < 6;
    token.className = `character${actor.className === 'Peasant' ? ' worker' : ''}${fighting ? ' attacking' : ''}${state.selectedActor === actor.id ? ' selected' : ''}`;
    token.style.left = `${actor.x}%`;
    token.style.top = `${actor.y < 100 ? actor.y : actor.y - 100}%`;
    token.style.zIndex = String(Math.round(actor.y * 10));
    token.dataset.facing = actor.facing || 'front';
    token.dataset.side = actor.side || 'right';
    if (actorArt(actor)) {
      const sheet = actor.action === 'action' ? 'action' : 'walk';
      if (token.dataset.sheet !== sheet) {
        $('.character-sprite', token).style.backgroundImage = `url('public/art/${actorArt(actor)}-${sheet}-v01.webp')`;
        token.dataset.sheet = sheet;
      }
    }
    token.style.setProperty('--frame-x', `${(actor.frame || 0) * 100 / 3}%`);
  });
  layers.flatMap(host => [...host.children]).filter(node => !active.has(node.dataset.actor)).forEach(node => node.remove());
  if (state.denCleared && !$('.den-marker').dataset.cleared) {
    $('.den-marker').dataset.cleared = 'true';
    $('.den-marker').innerHTML = '<span class="den-pulse" style="background:#73836b;border-color:#a3b394;box-shadow:0 0 12px #819276"></span><b>RUÍNAS LIMPAS</b><small>ameaça encerrada</small>';
  }
}

function heroCard(hero) {
  const prestigeTargets = PRESTIGE[hero.className];
  const nextInfo = hero.prestige ? `Caminho de prestígio: ${hero.prestige}` : hero.level >= 15 ? 'A guilda disponível mais próxima define a especialização.' : `Nível ${hero.level} · ${15 - hero.level} até o prestígio`;
  const guildType = GUILD_FOR[hero.className];
  const canChooseBranch = prestigeTargets && state.buildings.some(b => b.type === guildType && !b.branch);
  return `<article class="hero-card">
    <img class="hero-portrait" src="public/art/portraits/${actorPortrait(hero)}-portrait-v01.webp" alt="Retrato de ${hero.name}">
    <div class="hero-details"><b>${hero.name}</b><small>${hero.className}${hero.prestige ? ` · ${hero.prestige}` : ''}</small><small>${nextInfo}</small></div>
    <div class="hero-xp">NÍV. ${hero.level}<i style="--xp:${Math.min(100,hero.xp * 5)}%"></i></div>
  </article>${canChooseBranch ? `<div class="branch-choice">${prestigeTargets.map((path, i) => `<button data-branch="${path}" data-building="${guildType}">${i === 0 ? 'ESPECIALIZAR' : 'ESPECIALIZAR'} · ${path.toUpperCase()}</button>`).join('')}</div>` : ''}`;
}

function workerCard(worker) {
  return `<article class="hero-card worker-card">
    <img class="hero-portrait" src="public/art/portraits/${actorPortrait(worker)}-portrait-v01.webp" alt="Retrato de ${worker.name}">
    <div class="hero-details"><b>${worker.name}</b><small>Trabalha entre o casarão e as construções de produção.</small></div>
  </article>`;
}

function renderPanel() {
  const host = $('#panel-view');
  if (state.tab === 'build') {
    const selectedFarm = state.selectedSite === null ? null : state.buildings.find(building => building.site === state.selectedSite && building.type === 'farm');
    const farmChoice = state.selectedBuild === 'farm' || !!selectedFarm;
    const currentFarmType = selectedFarm ? farmType(selectedFarm.produce).id : state.selectedFarmType;
    host.innerHTML = `<div class="panel-title"><h3>Erga o domínio</h3><span>Toque numa carta e escolha um lote</span></div>
      ${farmChoice ? `<section class="farm-selector" aria-label="Tipo de fazenda"><div class="farm-selector-heading"><b>${selectedFarm ? 'Produção desta fazenda' : 'Escolha a produção da fazenda'}</b><small>${selectedFarm ? 'Toque para trocar a produção' : 'Depois toque em um lote livre'}</small></div>
        <div class="farm-type-grid">${FARM_TYPES.map(type => `<button class="farm-type${currentFarmType === type.id ? ' selected' : ''}" data-farm-type="${type.id}" aria-pressed="${currentFarmType === type.id}"><img src="public/art/${type.art}-v01.webp" alt=""><span><b>${type.name}</b><small>+${type.grain.toFixed(1).replace('.', ',')} provisões/s</small><small>+${rateNumber(type.gold)} ouro/s</small></span></button>`).join('')}</div></section>` : ''}
      <div class="build-grid">${BUILDINGS.map(item => `<button class="build-card${state.selectedBuild === item.id ? ' selected' : ''}" data-build="${item.id}" aria-label="Construir ${item.id === 'farm' ? `Fazenda de ${farmType(state.selectedFarmType).name}` : item.name}, custa ${item.cost} moedas e ${item.wood} madeira">
        <span class="build-preview"><img src="public/art/${item.id === 'farm' ? farmType(state.selectedFarmType).art : BUILDING_ART[item.id]}-v01.webp" alt="">${item.id === 'mill' ? '<span class="mill-sails"></span>' : ''}</span><span class="build-copy"><b>${item.name}${item.id === 'farm' ? ` · ${farmType(state.selectedFarmType).name}` : ''}</b><small>${item.detail}</small></span><span class="build-cost">${item.cost} G<em>${item.wood} M</em></span></button>`).join('')}</div>
      <p class="build-note">Custos indicados em moedas (G) e madeira (M). As construções geram renda e atraem heróis em tempo real.</p>`;
  } else if (state.tab === 'heroes') {
    host.innerHTML = `<div class="panel-title"><h3>Companhia autônoma</h3><span>${state.heroes.filter(h => h.alive).length}/${heroCapacity()} hóspedes</span></div>
      <div class="hero-list">${state.heroes.filter(h => h.alive).map(heroCard).join('') || '<div class="empty-state">Sem heróis no domínio.<br>Construa uma taverna ou guilda para atrair companhia.</div>'}</div>
      <div class="panel-title worker-heading"><h3>Trabalhadores</h3><span>${state.workers.filter(worker => worker.alive).length} no domínio</span></div>
      <div class="hero-list">${state.workers.filter(worker => worker.alive).map(workerCard).join('')}</div>
      <p class="build-note">Heróis tomam as próprias decisões. Recompensas e guildas influenciam seus destinos.</p>`;
  } else if (state.tab === 'lairs') {
    host.innerHTML = `<div class="panel-title"><h3>Dungeons e covis</h3><span>${state.lairs.filter(lair => !lair.cleared).length} ativos</span></div>
      <div class="lair-list">${state.lairs.map(lair => `<article class="lair-card${state.selectedLair === lair.id ? ' selected' : ''}">
        <img src="public/art/${LAIR_ART[lair.type]}" alt=""><div><b>${lair.name}</b><small>${lair.region === 'road' ? 'Estrada Velha' : 'Casarão'} · ${lair.cleared ? 'explorado' : state.activeExpedition?.id === lair.id ? 'expedição em andamento' : 'ativo'}</small>
        <div class="lair-actions"><button data-lair-focus="${lair.id}">VER NO MAPA</button><button data-lair-move="${lair.id}">${state.movingLair === lair.id ? 'CANCELAR' : 'MOVER'}</button><button data-lair-explore="${lair.id}" ${lair.cleared || state.activeExpedition ? 'disabled' : ''}>EXPLORAR · ${lair.type === 'dungeon' ? 35 : 45} G</button></div></div></article>`).join('')}</div>
      <p class="build-note">Mover: escolha um ponto livre na mesma região. Dungeons rendem tesouros; covis ativos ameaçam o domínio.${state.movingLair ? ' Toque no terreno para concluir a mudança.' : ''}</p>`;
  } else {
    host.innerHTML = `<div class="panel-title"><h3>Recompensas e editos</h3><span>Influencie, não comande</span></div>
      <div class="contract-list">
        <article class="contract"><b>Covil de saqueadores</b><button data-reward="45" ${state.denCleared ? 'disabled' : ''}>45 G · MARCAR</button><p>Coloque uma recompensa para atrair os heróis ao covil. A ameaça faz incursões periódicas.</p></article>
        <article class="contract"><b>Explorar a estrada velha</b><button data-reward="25">25 G · MARCAR</button><p>Heróis curiosos podem encontrar madeira, provisões ou novas dívidas.</p></article>
        <article class="contract"><b>Proteger a fazenda</b><button data-reward="35">35 G · MARCAR</button><p>Ajude os trabalhadores a manterem as colheitas seguras.</p></article>
      </div>`;
  }
  $$('.build-card', host).forEach(button => button.addEventListener('click', () => chooseBuild(button.dataset.build)));
  $$('[data-farm-type]', host).forEach(button => button.addEventListener('click', () => chooseFarmType(button.dataset.farmType)));
  $$('[data-branch]', host).forEach(button => button.addEventListener('click', () => chooseBranch(button.dataset.branch, button.dataset.build)));
  $$('[data-reward]', host).forEach(button => button.addEventListener('click', () => placeReward(Number(button.dataset.reward), button.closest('.contract').querySelector('b').textContent)));
  $$('[data-lair-focus]', host).forEach(button => button.addEventListener('click', () => { const lair = state.lairs.find(item => item.id === button.dataset.lairFocus); state.selectedLair = lair.id; focusRegion(lair.region); renderLairs(); renderPanel(); }));
  $$('[data-lair-move]', host).forEach(button => button.addEventListener('click', () => moveLair(button.dataset.lairMove)));
  $$('[data-lair-explore]', host).forEach(button => button.addEventListener('click', () => exploreLair(button.dataset.lairExplore)));
}

function chooseBuild(id) {
  const item = BUILDINGS.find(building => building.id === id);
  if (id !== 'farm' && (state.gold < item.cost || state.timber < item.wood)) {
    say('Faltam recursos. Dê tempo à economia ou escolha uma construção mais barata.');
    return;
  }
  state.selectedBuild = id;
  state.selectedSite = null;
  renderSites(); renderPanel();
  say(id === 'farm' ? 'Escolha Alho, Trigo, Bacon, Ovos ou Leite; depois toque em um lote livre.' : `Construção selecionada: ${item.name}. Toque em um lote livre no mapa.`, `${item.name} aguarda um terreno e trabalhadores.`);
}

function chooseFarmType(id) {
  const type = farmType(id);
  if (state.selectedBuild === 'farm') {
    state.selectedFarmType = type.id;
    renderPanel();
    say(`Fazenda de ${type.name} selecionada. Toque em um lote livre.`);
    return;
  }
  const farm = state.buildings.find(building => building.site === state.selectedSite && building.type === 'farm');
  if (!farm) return;
  farm.produce = type.id;
  state.selectedFarmType = type.id;
  renderSites(); renderPanel(); updateHud();
  say(`Fazenda agora produz ${type.name.toLowerCase()}.`, `A fazenda mudou sua produção para ${type.name.toLowerCase()}.`);
}

function placeBuilding(site) {
  const item = BUILDINGS.find(building => building.id === state.selectedBuild);
  if (!item) return;
  if (state.buildings.some(building => building.site === site)) {
    say('Este lote já está ocupado. Toque em outro terreno.');
    return;
  }
  if (state.gold < item.cost || state.timber < item.wood) {
    say('A obra parou: faltam moedas ou madeira.');
    return;
  }
  state.gold -= item.cost;
  state.timber -= item.wood;
  state.buildings.push({ site, type: item.id, produce: item.id === 'farm' ? state.selectedFarmType : null, branch: null, x: SITES[site].x, y: SITES[site].y, builtAt: Date.now() });
  state.selectedBuild = null;
  state.selectedSite = site;
  if (item.heroClass) recruit(item.heroClass);
  renderSites(); renderPanel(); updateHud();
  setTimeout(() => $(`.site[data-site="${site}"]`)?.classList.remove('just-built'), 1400);
  const name = item.id === 'farm' ? `Fazenda de ${farmType(state.selectedFarmType).name}` : item.name;
  say(`${name} erguida.`, item.heroClass ? `${item.name} abriu as portas; ${item.heroClass} já procura uma cama.` : `${name} começou a trabalhar para o domínio.`);
}

function recruit(className) {
  if (state.heroes.filter(hero => hero.alive).length >= heroCapacity()) {
    say('A guilda abriu, mas os alojamentos estão cheios.');
    return false;
  }
  const n = state.heroes.filter(hero => hero.className === className).length + 1;
  const hero = { id: Date.now() + Math.random(), name: `${className} ${String(n).padStart(2,'0')}`, className, level: 1, xp: 0, x: PATH_NODES[0].x, y: PATH_NODES[0].y, alive: true };
  state.heroes.push(hero);
  $('.tab-count').textContent = state.heroes.filter(h => h.alive).length;
  renderHeroes();
  return true;
}

function chooseBranch(branch, guildType) {
  const guild = state.buildings.find(building => building.type === guildType && !building.branch);
  if (!guild) {
    say(`Construa outra Guilda de Curandeiros para abrir o caminho de ${branch}.`);
    return;
  }
  const fee = 90;
  if (state.gold < fee) { say(`A reforma exige ${fee} moedas.`); return; }
  state.gold -= fee;
  guild.branch = branch;
  state.heroes.filter(h => h.className === BUILDINGS.find(item => item.id === guildType)?.heroClass && h.level >= 15 && !h.prestige).forEach(assignPrestige);
  renderSites(); renderPanel(); renderHeroes(); updateHud();
  say(`Guilda reformada para ${branch}.`, `Uma nova instituição agora prepara ${branch}s.`);
}

function placeReward(amount, target) {
  if (state.denCleared && target.includes('Covil')) { say('O covil já foi reduzido a ruínas.'); return; }
  if (state.gold < amount) { say(`Faltam ${amount} moedas para financiar a recompensa.`); return; }
  state.gold -= amount;
  state.bounty = amount;
  state.bountyTarget = target;
  state.bountyProgress = 0;
  state.bountyTimer = 18;
  const destination = target.includes('Covil') ? 9 : target.includes('estrada') ? 5 : 2;
  state.heroes.filter(h => h.alive).forEach(hero => { hero.wait = 0; routeActor(hero, destination); });
  renderPanel(); updateHud(); renderHeroes();
  say(`Recompensa de ${amount} moedas anunciada: ${target}.`, `Os heróis ouviram falar da recompensa por ${target.toLowerCase()}.`);
}

function assignPrestige(hero) {
  if (!hero || hero.prestige) return;
  const guildType = GUILD_FOR[hero.className];
  const available = state.buildings.filter(b => b.type === guildType && b.branch);
  if (!available.length) return;
  const nearest = available.sort((a, b) => {
    const da = Math.hypot(a.x - hero.x, a.y - hero.y);
    const db = Math.hypot(b.x - hero.x, b.y - hero.y);
    return da - db;
  })[0];
  hero.prestige = nearest.branch;
  say(`${hero.name} escolheu ${hero.prestige}.`, `${hero.name} seguiu para a guilda mais próxima e tomou o caminho de ${hero.prestige}.`);
}

function raid() {
  if (state.denCleared) return;
  state.raidCount++;
  const fighters = state.heroes.filter(h => h.alive && ['Warrior','Archer','Lancer','Paladin','Heavy Knight','Ranger','Assassin','Sentinel','Templar'].includes(h.prestige || h.className)).length;
  if (fighters > 0 && state.bounty && state.bountyTarget?.includes('Covil')) {
    state.bountyProgress += state.buildings.some(building => building.type === 'armory') ? 2 : 1;
    state.gold = Math.max(0, state.gold - 8);
    say('Os heróis interceptaram parte dos saqueadores; a luta segue perto do covil.', 'O ataque foi contido parcialmente. Ainda há movimento no covil.');
  } else {
    state.gold = Math.max(0, state.gold - 24);
    state.grain = Math.max(0, state.grain - 10);
    state.people = Math.max(0, state.people - 1);
    say('Incursão no domínio: perderam-se moedas, provisões e uma pessoa.', 'Os saqueadores vieram buscar o que a antiga família ainda devia.');
  }
  if (state.bounty && state.bountyTarget?.includes('Covil') && state.bountyProgress >= 3) {
    state.denCleared = true;
    state.bounty = 0;
    state.gold += 90;
    state.grain += 18;
    state.heroes.filter(hero => hero.alive).forEach(hero => routeActor(hero, 0));
    say('O covil caiu. Os heróis voltam com saque e provisões.', 'O covil foi limpo. A região ficou um pouco menos condenada.');
    renderSites(); renderPanel(); renderHeroes();
  }
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

function workerDestination() {
  const workplace = state.buildings.find(building => ['farm', 'mill'].includes(building.type));
  if (!workplace) return 5;
  const candidates = [2, 3, 5, 6, 7, 14, 15, 16, 17];
  return candidates.reduce((best, index) =>
    Math.hypot(PATH_NODES[index].x - workplace.x, PATH_NODES[index].y - workplace.y) <
    Math.hypot(PATH_NODES[best].x - workplace.x, PATH_NODES[best].y - workplace.y) ? index : best, candidates[0]);
}

function nextActorGoal(actor) {
  if (actor.className === 'Peasant') {
    routeActor(actor, actor.workTrip ? 0 : workerDestination());
    actor.workTrip = !actor.workTrip;
    return;
  }
  if (state.bounty && state.bountyTarget) {
    routeActor(actor, state.bountyTarget.includes('Covil') ? 9 : state.bountyTarget.includes('estrada') ? 5 : 2);
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  [...state.heroes, ...state.workers].filter(actor => actor.alive).forEach(actor => {
    const atCovil = actor.className !== 'Peasant' && state.bounty && state.bountyTarget?.includes('Covil') && !state.denCleared && Math.hypot(actor.x - 85, actor.y - 21) < 1.2;
    if (atCovil) {
      actor.action = 'action';
      actor.actionClock = (actor.actionClock || 0) + delta;
      actor.frame = reducedMotion ? 0 : Math.floor(actor.actionClock * 5) % 4;
      return;
    }
    if (actor.wait > 0) {
      actor.wait = Math.max(0, actor.wait - delta);
      actor.action = actor.actionTime > 0 ? 'action' : 'walk';
      if (actor.actionTime > 0) actor.actionTime = Math.max(0, actor.actionTime - delta);
      actor.actionClock = (actor.actionClock || 0) + delta;
      actor.frame = actor.action === 'action' && !reducedMotion ? Math.floor(actor.actionClock * 5) % 4 : 0;
      return;
    }
    if (!actor.route?.length) nextActorGoal(actor);
    let remaining = (actor.className === 'Peasant' ? 3.1 : 4.2) * delta;
    let moved = false;
    while (remaining > 0 && actor.route?.length) {
      const node = PATH_NODES[actor.route[0]];
      const dx = node.x - actor.x, dy = node.y - actor.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.001) { actor.route.shift(); continue; }
      actor.facing = dy < -0.2 ? 'back' : dy > 0.2 ? 'front' : (actor.facing || 'front');
      if (Math.abs(dx) > 0.2) actor.side = dx < 0 ? 'left' : 'right';
      const step = Math.min(distance, remaining);
      actor.x += dx / distance * step;
      actor.y += dy / distance * step;
      remaining -= step;
      moved = true;
      if (step >= distance - 0.001) {
        actor.x = node.x; actor.y = node.y;
        actor.route.shift();
        if (!actor.route.length) {
          actor.wait = actor.className === 'Peasant' ? 2.3 : 1.2;
          if (actor.className === 'Peasant' && actor.goal !== 0) { actor.actionTime = actor.wait; actor.actionClock = 0; }
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
  state.ticks++;
  const r = rates();
  state.gold += r.gold * state.speed;
  state.grain += r.grain * state.speed;
  state.timber += r.timber * state.speed;
  state.minutes += state.speed * 4;
  if (state.activeExpedition) {
    state.activeExpedition.remaining -= state.speed;
    if (state.activeExpedition.remaining <= 0) {
      const lair = state.lairs.find(item => item.id === state.activeExpedition.id);
      lair.cleared = true;
      if (lair.type === 'dungeon') { state.gold += 80; state.timber += 10; }
      else { state.gold += 55; state.grain += 20; }
      state.activeExpedition = null;
      state.heroes.filter(hero => hero.alive).forEach(hero => routeActor(hero, 0));
      renderLairs();
      if (state.tab === 'lairs') renderPanel();
      say(`${lair.name} explorado. Os heróis regressam com recursos.`);
    }
  }
  if (state.minutes % 300 < state.speed * 4 && state.lairs.some(lair => lair.type === 'monster' && !lair.cleared)) {
    state.gold = Math.max(0, state.gold - 10);
    say('Feras de um covil ativo atacaram as rotas do domínio. Perdeu-se 10 G.');
  }
  if (state.bounty && state.bountyTarget && !state.bountyTarget.includes('Covil')) {
    state.bountyTimer -= state.speed;
    if (state.bountyTimer <= 0) {
      if (state.bountyTarget.includes('estrada')) { state.timber += 14; state.gold += 18; say('A estrada foi explorada. Os heróis voltaram com madeira e moedas.', 'A patrulha encontrou materiais úteis na estrada velha.'); }
      else { state.grain += 24; say('A fazenda foi protegida. A colheita chegou aos celeiros.', 'Os trabalhadores conseguiram salvar parte das provisões.'); }
      state.bounty = 0; state.bountyTarget = null;
      state.heroes.filter(hero => hero.alive).forEach(hero => routeActor(hero, 0));
      renderPanel(); renderHeroes();
    }
  }
  // Heróis treinam, viajam e tomam decisões em tempo real.
  state.heroes.filter(h => h.alive).forEach(hero => {
    hero.xp += state.speed;
    if (hero.xp >= 30 && hero.level < 15) {
      hero.xp -= 30; hero.level++;
      if (hero.level === 15) {
        say(`${hero.name} alcançou o nível 15.`, `${hero.name} procura uma guilda de prestígio disponível.`);
        assignPrestige(hero);
        if (state.tab === 'heroes') renderPanel();
      }
    }
  });
  const hasTavern = state.buildings.some(building => building.type === 'tavern');
  const hasHotel = state.buildings.some(building => building.type === 'hotel');
  if ((hasTavern && state.minutes % 180 < state.speed * 4) || (hasHotel && state.minutes % 150 < state.speed * 4)) {
    const guildClasses = BUILDINGS.filter(building => building.heroClass && state.buildings.some(built => built.type === building.id)).map(building => building.heroClass);
    const arrivals = hasHotel && guildClasses.length ? guildClasses : ['Warrior','Archer','Lancer','Black Mage','Conjurer','Healer'];
    const className = arrivals[Math.floor(Math.random() * arrivals.length)];
    if (recruit(className)) say(`Um ${className} chegou ao domínio.`, `Um novo viajante encontrou hospedagem: ${className}.`);
  }
  if (!state.denCleared && state.minutes % 240 < state.speed * 4) raid();
  updateHud();
}

function init() {
  initCamera();
  renderLairs();
  $$('.site').forEach(site => site.addEventListener('click', () => {
    if (state.movingLair) { say('Escolha um trecho livre do chão para mover o local.'); return; }
    const idx = Number(site.dataset.site);
    const building = state.buildings.find(item => item.site === idx);
    if (state.selectedBuild && !building) placeBuilding(idx);
    else if (building) {
      state.selectedBuild = null;
      state.selectedSite = idx;
      const def = BUILDINGS.find(item => item.id === building.type);
      renderSites();
      if (def.heroClass || def.id === 'farm') {
        state.tab = def.id === 'farm' ? 'build' : 'heroes';
        $$('.tab').forEach(tab => { const active = tab.dataset.tab === state.tab; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
        if (def.id === 'farm') state.selectedFarmType = farmType(building.produce).id;
        renderPanel();
        say(def.id === 'farm' ? `Fazenda de ${farmType(building.produce).name}: escolha a produção no painel.` : `${def.name}: escolha uma melhoria para influenciar os heróis.`, def.id === 'farm' ? `A fazenda está produzindo ${farmType(building.produce).name.toLowerCase()}.` : `${def.name} está aberta. A localização afeta quem a procura.`);
      } else say(`${def.name}: produz ${def.grain ? 'provisões' : 'renda'} para o domínio.`);
    } else say('Escolha uma construção no painel e depois toque neste lote.');
  }));
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
  $('#bounty-btn').addEventListener('click', () => placeReward(45, 'Covil de saqueadores'));
  $('#tax-btn').addEventListener('click', () => {
    state.taxLevel = (state.taxLevel + 1) % 3;
    updateHud();
    const names = ['leve', 'moderada', 'pesada'];
    say(`Cobrança ${names[state.taxLevel]}.`, `A cobrança de impostos agora está ${names[state.taxLevel]}.`);
  });
  $('#reset-btn').addEventListener('click', () => location.reload());
  renderSites(); renderHeroes(); renderPanel(); updateHud();
  setInterval(tick, 1000);
  requestAnimationFrame(animateActors);
}

init();
