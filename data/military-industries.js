const MILITARY_INDUSTRIES = {
  woodworking: {
    names: ["Bowyer’s Workshop", "Military Bowyer", "Master Weaponsmith’s Woodworks"],
    levels: [{ cap: 16, crew: 1 }, { cap: 24, crew: 2, gold: 45, wood: 60, stone: 36 }, { cap: 36, crew: 3, gold: 80, wood: 96, stone: 60 }],
  },
  siegeWorks: {
    names: ["Siege Carpenter’s Yard", "Siege Engineer’s Yard", "Grand Siege Works"],
    levels: [{ cap: 42, crew: 1 }, { cap: 70, crew: 2, gold: 65, wood: 96, stone: 48 }, { cap: 120, crew: 3, gold: 110, wood: 144, stone: 84 }],
  },
};

const MILITARY_SUPPLIES = [
  ['ironFitting', 'Ferragem de ferro', { iron: 1 }, 8, 30, 1],
  ['metalFitting', 'Ferragem de metal', { bronze: 1 }, 6, 35, 1],
  ['steelComponent', 'Componente de aço', { steel: 1 }, 4, 45, 2],
  ['heavyHinge', 'Dobradiça pesada', { iron: 1 }, 2, 45, 2],
  ['rope', 'Corda', { leatherStrip: 1 }, 4, 20, 1],
  ['heavyBowstring', 'Corda de arco pesada', { bowstring: 2 }, 1, 25, 2],
];

const MILITARY_RECIPES = Object.fromEntries(Object.entries({
  woodworking: [
    [
      ['shortBow', 'Arco curto', 45, { timber: 2, bowstring: 1 }, { weapon: 'shortBow' }],
      ['huntingBow', 'Arco de caça', 55, { timber: 3, bowstring: 1 }, { weapon: 'shortBow' }],
      ['quarterstaff', 'Bordão', 35, { timber: 2 }, { weapon: 'crookedStaff' }],
      ['woodenClub', 'Clava de madeira', 40, { timber: 2 }, { weapon: 'woodenMace' }],
      ['reinforcedClub', 'Clava reforçada', 55, { timber: 2, ironFitting: 1 }, { weapon: 'woodenMace' }],
      ['basicWand', 'Varinha básica', 30, { timber: 1 }, { weapon: 'crookedStaff' }],
      ['spearShaft', 'Haste de lança', 30, { timber: 2 }],
      ['axeHaft', 'Cabo de machado', 25, { timber: 1 }],
      ['hammerHandle', 'Cabo de martelo', 25, { timber: 1 }],
      ['arrowShaft', 'Haste de flecha', 35, { timber: 2 }, { qty: 10 }],
      ['woodenShieldBody', 'Corpo de escudo de madeira', 45, { timber: 3 }],
      ['woodenShield', 'Escudo de madeira', 35, { woodenShieldBody: 1, leatherStrip: 1 }, { equipment: 'plankShield' }],
      ['basicBowStave', 'Peça básica de arco', 30, { timber: 2 }],
      ['crookedStaff', 'Cajado torto', 35, { timber: 2 }, { weapon: 'crookedStaff' }],
      ['woodenMace', 'Maça de madeira', 40, { timber: 2 }, { weapon: 'woodenMace' }],
      ['arrow', 'Flecha', 30, { arrowShaft: 10, iron: 1 }, { qty: 10 }],
    ],
    [
      ['handcart', 'Carrinho de carga', 90, { timber: 6, ironFitting: 2 }],
      ['longbow', 'Arco longo', 75, { timber: 4, bowstring: 1 }, { weapon: 'yewBow' }],
      ['recurveBow', 'Arco recurvo', 85, { timber: 3, bowstring: 1, cattleHorn: 1 }, { weapon: 'yewBow' }],
      ['lightCrossbow', 'Besta leve', 100, { timber: 4, ironFitting: 2, bowstring: 1 }, { weapon: 'yewBow' }],
      ['warStaff', 'Cajado de guerra', 70, { timber: 3, ironFitting: 2 }, { weapon: 'crookedStaff' }],
      ['reinforcedQuarterstaff', 'Bordão reforçado', 60, { timber: 3, ironFitting: 1 }, { weapon: 'crookedStaff' }],
      ['heavyClub', 'Clava pesada', 75, { timber: 4, ironFitting: 2 }, { weapon: 'woodenMace' }],
      ['polearmShaft', 'Haste de arma de haste', 40, { timber: 3 }],
      ['crossbowStock', 'Coronha de besta', 50, { timber: 3 }],
      ['crossbowBolt', 'Virote', 45, { timber: 2, iron: 1 }, { qty: 10 }],
      ['reinforcedShieldBody', 'Corpo de escudo reforçado', 75, { timber: 4, ironFitting: 2 }],
      ['reinforcedShield', 'Escudo de madeira reforçado', 55, { reinforcedShieldBody: 1, leatherStrip: 1 }, { equipment: 'ironShield' }],
      ['compositeBowStave', 'Peça de arco composto', 65, { timber: 2, cattleHorn: 1, sinew: 1 }],
      ['heavyBowLimbs', 'Braços de arco pesado', 75, { timber: 4, sinew: 1 }],
      ['yewBow', 'Arco de teixo', 90, { yewStave: 1, bowstring: 1, leatherStrip: 1 }, { weapon: 'yewBow' }],
      ['ebonyStaff', 'Cajado de ébano', 85, { ebonyBlank: 1, copper: .20, leatherStrip: 1 }, { weapon: 'ebonyStaff' }],
      ['skullStaff', 'Cajado de caveira', 125, { ebonyBlank: 1, recoveredSkull: 1, iron: .25, leatherStrip: 1, ember: 1, charcoal: .10 }, { weapon: 'skullStaff' }],
    ],
    [
      ['compositeWarBow', 'Arco de guerra composto', 150, { timber: 3, cattleHorn: 2, sinew: 2, bowstring: 1 }, { weapon: 'hornBow' }],
      ['heavyCrossbow', 'Besta pesada', 160, { timber: 5, ironFitting: 4, heavyBowstring: 1 }, { weapon: 'hornBow' }],
      ['arbalest', 'Arbalesta', 180, { timber: 6, ironFitting: 5, steelComponent: 2 }, { weapon: 'hornBow' }],
      ['masterworkLongbow', 'Arco longo magistral', 150, { timber: 5, sinew: 2, bowstring: 1 }, { weapon: 'hornBow' }],
      ['reinforcedWarStaff', 'Cajado de guerra reforçado', 120, { timber: 4, ironFitting: 3 }, { weapon: 'crookedStaff' }],
      ['masterworkStaff', 'Cajado magistral', 130, { timber: 4, metalFitting: 2 }, { weapon: 'crookedStaff' }],
      ['towerShieldBody', 'Corpo de escudo torre', 125, { timber: 6, ironFitting: 3 }],
      ['woodenTowerShield', 'Escudo torre de madeira', 75, { towerShieldBody: 1, leatherStrip: 2 }, { equipment: 'towerShield' }],
      ['heavyPolearmShaft', 'Haste pesada', 95, { timber: 4, ironFitting: 2 }],
      ['precisionCrossbowStock', 'Coronha de precisão', 100, { timber: 4, ironFitting: 2 }],
      ['siegeBowLimbs', 'Braços de arco de cerco', 150, { timber: 8, sinew: 4 }],
      ['heavyTriggerAssembly', 'Mecanismo de gatilho pesado', 120, { timber: 2, ironFitting: 3 }],
      ['siegeFrame', 'Estrutura de madeira para cerco', 140, { timber: 10, ironFitting: 4 }],
      ['hornBow', 'Arco de chifre', 150, { yewStave: 1, hornPlate: 2, sinew: 2, bowstring: 1, hideGlue: 1 }, { weapon: 'hornBow' }],
    ],
  ],
  siegeWorks: [
    [
      ['woodenGate', 'Portão de madeira', 80, { timber: 16, ironFitting: 4 }, { deploy: 'gate', hp: 175 }],
      ['woodenPalisade', 'Seção de paliçada', 70, { timber: 12, ironFitting: 2 }, { deploy: 'wall', hp: 140 }],
      ['reinforcedWoodenWall', 'Muralha de madeira reforçada', 95, { timber: 20, ironFitting: 5 }, { deploy: 'wall', hp: 220 }],
      ['siegeLadder', 'Escada de mão de cerco', 55, { timber: 8, rope: 2 }, { deploy: 'stairs', hp: 60 }],
      ['siegeStaircase', 'Escadaria de cerco', 90, { timber: 18, ironFitting: 4, rope: 3 }, { deploy: 'stairs', hp: 110 }],
      ['woodenAssaultRamp', 'Rampa de assalto', 80, { timber: 15, ironFitting: 3 }, { deploy: 'stairs', hp: 95 }],
      ['woodenMantlet', 'Mantelete de madeira', 60, { timber: 10, ironFitting: 2 }, { deploy: 'wall', hp: 100 }],
      ['batteringRam', 'Aríete', 115, { timber: 20, ironFitting: 6, rope: 4 }, { deploy: 'ram', hp: 150, damage: 35 }],
      ['spikedBarricade', 'Barricada de estacas', 65, { timber: 8, ironFitting: 2 }, { deploy: 'wall', hp: 115 }],
      ['woodenWheel', 'Roda de madeira', 65, { timber: 4, ironFitting: 1 }, { qty: 4 }],
    ],
    [
      ['reinforcedWoodenGate', 'Portão de madeira reforçado', 135, { timber: 26, ironFitting: 8 }, { deploy: 'gate', hp: 305 }],
      ['reinforcedPalisade', 'Paliçada reforçada', 130, { timber: 25, ironFitting: 10 }, { deploy: 'wall', hp: 280 }],
      ['fortifiedWoodenWall', 'Muralha de madeira fortificada', 155, { timber: 35, ironFitting: 12, rope: 4 }, { deploy: 'wall', hp: 340 }],
      ['heavySiegeStaircase', 'Escadaria de cerco pesada', 130, { timber: 25, ironFitting: 8, rope: 5 }, { deploy: 'stairs', hp: 180 }],
      ['coveredBatteringRam', 'Aríete coberto', 170, { timber: 30, ironFitting: 10, rope: 6, leatherStrip: 4 }, { deploy: 'ram', hp: 240, damage: 55 }],
      ['lightBallista', 'Balista leve', 170, { siegeFrame: 1, siegeBowLimbs: 2, ironFitting: 8, rope: 4 }, { deploy: 'artillery', hp: 140, ammo: 'siegeBolt', damage: 35, range: 14 }],
      ['tractionTrebuchet', 'Trabuco de tração', 190, { siegeFrame: 2, timber: 12, rope: 10, ironFitting: 8 }, { deploy: 'artillery', hp: 160, ammo: 'siegeShot', damage: 45, range: 17 }],
      ['lightSiegeTower', 'Torre de cerco leve', 210, { siegeFrame: 3, timber: 20, ironFitting: 12, rope: 8 }, { deploy: 'stairs', hp: 220 }],
      ['mobileDefensiveWall', 'Muralha móvel', 145, { timber: 20, ironFitting: 6, woodenWheel: 4 }, { deploy: 'wall', hp: 230 }],
      ['siegeBolt', 'Virote de cerco', 60, { timber: 4, iron: 2 }, { qty: 5 }],
      ['siegeShot', 'Projétil de pedra', 55, { stone: 10 }, { qty: 5 }],
    ],
    [
      ['heavyBallista', 'Balista pesada', 230, { siegeFrame: 2, siegeBowLimbs: 4, ironFitting: 15, rope: 8 }, { deploy: 'artillery', hp: 230, ammo: 'siegeBolt', damage: 65, range: 19 }],
      ['counterweightTrebuchet', 'Trabuco de contrapeso', 280, { siegeFrame: 4, timber: 30, rope: 20, ironFitting: 20, stoneCounterweight: 1 }, { deploy: 'artillery', hp: 280, ammo: 'siegeShot', damage: 90, range: 24 }],
      ['grandSiegeTower', 'Grande torre de cerco', 270, { siegeFrame: 6, timber: 40, ironFitting: 25, rope: 15, woodenWheel: 8 }, { deploy: 'stairs', hp: 360 }],
      ['heavyCoveredRam', 'Aríete pesado coberto', 235, { siegeFrame: 3, ironFitting: 15, rope: 10, leatherStrip: 8 }, { deploy: 'ram', hp: 340, damage: 80 }],
      ['fortifiedSiegeStaircase', 'Escadaria de cerco fortificada', 200, { siegeFrame: 3, timber: 20, ironFitting: 15, rope: 8 }, { deploy: 'stairs', hp: 280 }],
      ['heavyDefensiveWall', 'Muralha defensiva pesada', 220, { timber: 50, ironFitting: 20, rope: 8 }, { deploy: 'wall', hp: 520 }],
      ['fortifiedWoodenGate', 'Portão de madeira fortificado', 200, { timber: 35, ironFitting: 16, heavyHinge: 2 }, { deploy: 'gate', hp: 420 }],
      ['heavySiegeBridge', 'Ponte de cerco pesada', 240, { siegeFrame: 4, timber: 30, ironFitting: 12, rope: 8 }, { deploy: 'bridge', hp: 300 }],
      ['stoneCounterweight', 'Contrapeso de pedra', 100, { stone: 20 }],
    ],
  ],
}).map(([type, levels]) => [type, levels.flatMap((rows, index) => rows.map(
  ([id, name, work, needs, extra]) => ({ id, name, work, needs, level: index + 1, qty: 1, ...extra }),
))]));

const MILITARY_PRODUCTS = Object.values(MILITARY_RECIPES).flat();
const SIEGE_DEPLOYMENTS = Object.fromEntries(MILITARY_RECIPES.siegeWorks.filter(recipe => recipe.deploy).map(recipe => [recipe.id, recipe]));
// Prancha original gerada para as peças de cerco: quatro colunas por quatro linhas.
const SIEGE_PHOTO_CELLS = {
  siegeLadder: [0, 0], siegeStaircase: [1, 0], woodenAssaultRamp: [2, 0], heavySiegeStaircase: [3, 0],
  lightSiegeTower: [0, 1], grandSiegeTower: [1, 1], fortifiedSiegeStaircase: [2, 1],
  batteringRam: [3, 1], coveredBatteringRam: [0, 2], heavyCoveredRam: [1, 2],
  lightBallista: [2, 2], heavyBallista: [3, 2], tractionTrebuchet: [0, 3], counterweightTrebuchet: [1, 3],
};
function siegePhotoStyle(type) {
  const cell = SIEGE_PHOTO_CELLS[type];
  return cell ? `background-image:url('public/art/military-v01/siege-equipment-sheet-v01.png');background-size:400% 400%;background-position:${cell[0] * 100 / 3}% ${cell[1] * 100 / 3}%;background-repeat:no-repeat;` : '';
}

const militaryLevel = building => MILITARY_INDUSTRIES[building.type]?.levels[producerLevel(building)];
const militaryCrew = building => state.workers.filter(worker => worker.alive && worker.workplace?.site === building.site);
const militaryInputs = recipe => Object.entries(recipe.needs).map(([id, qty]) => `${qty} ${workshopName(id)} (${formatMass(workshopHave(id))})`).join(' · ');

function militaryRecipes(building) {
  return MILITARY_RECIPES[building.type].filter(recipe => !recipe.weapon || chapterAllows('weapons', recipe.weapon));
}

function militaryOrderProblem(building, recipe) {
  if (!recipe || !militaryRecipes(building).includes(recipe)) return 'Escolha uma receita disponível.';
  if (recipe.level > producerLevel(building) + 1) return `Requer nível ${recipe.level}.`;
  if (building.militaryJob) return 'Já há uma ordem em andamento.';
  if (!militaryCrew(building).length) return 'Atribua um camponês.';
  if (Object.entries(recipe.needs).some(([id, qty]) => workshopHave(id) + 1e-9 < qty)) return 'Faltam insumos.';
  if (Object.values(recipe.needs).reduce((sum, qty) => sum + qty, 0) > militaryLevel(building).cap) return 'Capacidade da oficina insuficiente.';
  return '';
}

function startMilitaryOrder(building, id) {
  if (!isDone(building)) return;
  const recipe = militaryRecipes(building).find(item => item.id === id);
  const problem = militaryOrderProblem(building, recipe);
  if (problem) { say(problem); return; }
  if (!reserveWeaponMaterials(recipe.needs)) return;
  building.militaryJob = { id, elapsed: 0 };
  renderPanel();
  updateHud();
}

function cancelMilitaryOrder(building) {
  const recipe = MILITARY_PRODUCTS.find(item => item.id === building.militaryJob?.id);
  if (!recipe || building.militaryJob.elapsed >= recipe.work) return;
  releaseWeaponMaterials(recipe.needs);
  taxLog({ kind: 'ordem militar cancelada', site: building.site, materiaisDevolvidos: { ...recipe.needs } });
  delete building.militaryJob;
  renderPanel();
  updateHud();
}

function processMilitaryIndustries(dt) {
  for (const building of state.buildings) {
    const job = building.militaryJob;
    if (!job || !isDone(building)) continue;
    const recipe = MILITARY_PRODUCTS.find(item => item.id === job.id);
    if (!recipe) continue;
    const crew = militaryCrew(building).filter(worker => worker.buildSite == null && actorAtPost(worker, building));
    if (crew.length) {
      const rate = crew.length + crew.reduce((sum, worker) => sum + gearBonus(worker, 'work'), 0);
      job.elapsed = Math.min(recipe.work, job.elapsed + dt * rate);
    }
    if (job.elapsed < recipe.work) continue;
    const reserved = militaryReservedSpace(building);
    if (storedUnits() - reserved + recipe.qty > storageCap() + 1e-6) continue;
    if (recipe.weapon || recipe.equipment) {
      const weapon = makeWeapon(WEAPON_CATALOG.get(recipe.id));
      weapon.location = 'inventory';
      state.craftedWeapons.push(weapon);
      state.items.push(weapon.id);
    } else {
      changeWorkshopStock(recipe.id, recipe.qty);
    }
    delete building.militaryJob;
    say(`${recipe.qty} × ${recipe.name} entregue ao depósito.`);
    updateHud();
  }
}

function workerOnBuildingMap(worker, building) {
  return (worker.mapId || 'city') === (building.mapId || 'city') && (worker.mapSet || 1) === (building.mapSet || 1);
}

function militaryReservedSpace(building) {
  if (!building.militaryJob) return 0;
  const recipe = MILITARY_PRODUCTS.find(item => item.id === building.militaryJob?.id);
  if (!recipe) return 0;
  return Object.entries(recipe.needs).reduce((sum, [id, qty]) => sum + qty * workshopSpace(id), 0);
}

function toggleMilitaryWorker(building, id) {
  const worker = state.workers.find(item => item.alive && String(item.id) === id);
  if (!worker || !isDone(building) || worker.carrying || worker.buildSite != null) return;
  const same = worker.workplace?.site === building.site;
  if (!same && militaryCrew(building).length >= militaryLevel(building).crew) return;
  interruptTavernVisit(worker);
  worker.workplace = same ? null : building;
  worker.jobSite = null;
  worker.finalPoint = null;
  worker.route = [];
  worker.wait = 0;
  worker.workTrip = false;
  renderPanel();
  renderHeroes();
}

function militaryIndustryHTML(building) {
  const level = militaryLevel(building);
  const crew = militaryCrew(building);
  const job = building.militaryJob;
  const recipes = militaryRecipes(building);
  const chosen = recipes.find(recipe => recipe.id === building.militaryRecipe) || recipes[0];
  const active = job && MILITARY_PRODUCTS.find(recipe => recipe.id === job.id);
  const used = active ? Object.values(active.needs).reduce((sum, qty) => sum + qty, 0) : 0;
  const problem = militaryOrderProblem(building, chosen);
  const next = MILITARY_INDUSTRIES[building.type].levels[producerLevel(building) + 1];
  return `<section class="inspector-section"><h4>Ordens de produção</h4>
    <p class="pit-hint">Capacidade de insumos por ordem · ${used}/${level.cap}</p>
    <label>Receita <select data-military-recipe>${recipes.map(recipe => `<option value="${recipe.id}" ${recipe === chosen ? 'selected' : ''}>${recipe.name} × ${recipe.qty} · Nível ${recipe.level}</option>`).join('')}</select></label>
    <p class="pit-hint">${militaryInputs(chosen)} · ${chosen.work} min de trabalho</p>
    ${active ? `<p class="pit-hint">${active.name} · ${Math.floor(job.elapsed)}/${active.work} min${job.elapsed >= active.work ? ' · aguardando espaço no depósito' : ''}</p>
      ${job.elapsed < active.work ? '<button type="button" class="hut-upgrade" data-military-cancel>Cancelar e devolver insumos</button>' : ''}`
      : `<button type="button" class="hut-upgrade" data-military-order="${chosen.id}" ${problem ? 'disabled' : ''}>Encomendar</button>${problem ? `<p class="pit-hint">${problem}</p>` : ''}`}
    <h4>Equipe · ${crew.length}/${level.crew}</h4>
    <div class="pit-crew">${state.workers.filter(worker => worker.alive).map(worker => {
      const here = crew.includes(worker);
      return `<button type="button" class="pit-worker${here ? ' here' : ''}" data-military-worker="${worker.id}" aria-pressed="${here}" ${worker.carrying || worker.buildSite != null || (!here && crew.length >= level.crew) ? 'disabled' : ''}>${worker.name}</button>`;
    }).join('')}</div>
    ${next ? `<button type="button" class="hut-upgrade" data-producer-upgrade="${building.site}">Ampliar · ${next.crew} vagas · capacidade ${next.cap} · ${costHTML(next.gold, next.wood, next.stone)}</button>` : ''}
  </section>`;
}

function bindMilitaryInspector(host) {
  $$('[data-fortification-axis]', host).forEach(button => button.addEventListener('click', () => setFortificationAxis(button.dataset.fortificationAxis)));
  const building = state.buildings.find(item => item.site === state.selectedSite);
  if (!building) return;
  $('[data-military-recipe]', host)?.addEventListener('change', event => { building.militaryRecipe = event.target.value; renderInspector(); });
  $('[data-military-order]', host)?.addEventListener('click', event => startMilitaryOrder(building, event.currentTarget.dataset.militaryOrder));
  $('[data-military-cancel]', host)?.addEventListener('click', () => cancelMilitaryOrder(building));
  $$('[data-military-worker]', host).forEach(button => button.addEventListener('click', () => toggleMilitaryWorker(building, button.dataset.militaryWorker)));
  $('[data-siege-fire]', host)?.addEventListener('click', () => fireSiegeEngine(building));
  $('[data-fortification-upgrade]', host)?.addEventListener('click', () => upgradeFortification(building));
}

function siegeTargets(building) {
  const recipe = SIEGE_DEPLOYMENTS[building.type];
  const range = recipe.range || 4;
  return state.bandits.filter(actor => actor.alive && isHostile(actor) && workerOnBuildingMap(actor, building) && distanceTo(actor, building) <= range)
    .sort((a, b) => distanceTo(a, building) - distanceTo(b, building));
}

function fireSiegeEngine(building) {
  const recipe = SIEGE_DEPLOYMENTS[building.type];
  if (!isDone(building) || !recipe?.damage || state.minutes < (building.siegeReadyAt || 0)) return;
  const lair = (state.lairs || []).filter(item => item.active && CREATURE_DENS.includes(item.kind)
    && workerOnBuildingMap({ ...item, mapId: item.mapId || 'wilds' }, building) && distanceTo(item, building) <= (recipe.range || 4))
    .sort((a, b) => distanceTo(a, building) - distanceTo(b, building))[0];
  const enemy = siegeTargets(building)[0];
  const target = recipe.deploy === 'ram' ? lair || enemy : enemy || lair;
  if (!target) { say('Nenhum alvo ao alcance.'); return; }
  if (recipe.ammo && !reserveWeaponMaterials({ [recipe.ammo]: 1 })) { say('Falta munição no depósito.'); return; }
  building.siegeReadyAt = state.minutes + (recipe.ammo ? 12 : 6);
  if (target === lair) {
    lair.damage = (lair.damage || 0) + recipe.damage;
    if (lairHp(lair) <= 0) destroyLair(lair, null, state.bounties.find(item => item.lairId === lair.id));
    else renderLairs();
  } else {
    enemy.hp = hpOf(enemy) - recipe.damage;
    if (enemy.hp <= 0) killActor(enemy, null);
  }
  say(`${recipe.name} atingiu ${target.name} por ${recipe.damage}.`);
  renderPanel();
  updateHud();
}

function siegeControlsHTML(building) {
  const recipe = SIEGE_DEPLOYMENTS[building.type];
  if (!recipe) return '';
  const details = recipe.deploy === 'stairs' ? 'Coloque junto a uma muralha para dar passagem a aliados.'
    : recipe.deploy === 'bridge' ? 'Coloque sobre o riacho para estabelecer uma passagem.'
    : recipe.deploy === 'gate' ? 'Só camponeses e heróis podem atravessar enquanto o portão estiver de pé.'
    : recipe.deploy === 'wall' ? 'Bloqueia a passagem enquanto estiver de pé.' : '';
  const upgrade = FORTIFICATION_UPGRADES[building.type];
  if (!details && !recipe.damage && !upgrade) return '';
  return `<section class="inspector-section">
    ${details ? `<p class="pit-hint">${details}</p>` : ''}
    ${upgrade ? `<button type="button" class="hut-upgrade" data-fortification-upgrade ${workshopHave(upgrade) < 1 ? 'disabled' : ''}>Reforçar no local · 1 ${workshopName(upgrade)}</button>` : ''}
    ${recipe.damage ? `<button type="button" class="hut-upgrade" data-siege-fire ${state.minutes < (building.siegeReadyAt || 0) || (recipe.ammo && workshopHave(recipe.ammo) < 1) ? 'disabled' : ''}>${recipe.ammo ? 'Disparar' : 'Golpear'} o alvo ao alcance</button>
      <p class="pit-hint">Alcance ${recipe.range || 4} · Dano ${recipe.damage}${recipe.ammo ? ` · ${workshopName(recipe.ammo)} no depósito: ${workshopHave(recipe.ammo)}` : ''}</p>` : ''}
  </section>`;
}

function militaryWorkerRoutine(worker, building) {
  if (travelToMap(worker, building.mapId || 'city', building.mapSet || 1)) return;
  if (!isAt(worker, building)) { walkTo(worker, building); return; }
  worker.task = building.militaryJob ? `Trabalhando em ${siteLabel(building)}` : 'Aguardando ordem';
  worker.wait = 2;
  worker.actionTime = building.militaryJob ? 2 : 0;
}

const isSiegeBarrier = type => ['wall', 'gate'].includes(SIEGE_DEPLOYMENTS[type]?.deploy);

const FORTIFICATION_LENGTH = 9;
const FORTIFICATION_UPGRADES = { woodenPalisade: 'reinforcedWoodenWall', woodenGate: 'reinforcedWoodenGate' };
let fortificationAxis = 'horizontal';

const isModularFortification = type => isSiegeBarrier(type)
  && !['mobileDefensiveWall', 'woodenMantlet', 'spikedBarricade'].includes(type);
const gateAllows = actor => !isHostile(actor) && (actor.className === 'Peasant' || state.heroes.some(hero => hero.id === actor.id));

function setFortificationAxis(axis) {
  if (!['horizontal', 'vertical'].includes(axis)) return;
  fortificationAxis = axis;
  $('#placement-preview').hidden = true;
  renderPanel();
}

function fortificationAxisHTML(type) {
  if (!isModularFortification(type)) return '';
  return `<div class="fortification-axis"><span>Direção da seção</span>
    <button type="button" class="hut-upgrade" data-fortification-axis="horizontal" aria-pressed="${fortificationAxis === 'horizontal'}">Horizontal</button>
    <button type="button" class="hut-upgrade" data-fortification-axis="vertical" aria-pressed="${fortificationAxis === 'vertical'}">Vertical</button>
    <small>As pontas se alinham na malha. Use as duas direções para fechar os cantos.</small></div>`;
}

function snapFortification(x, y, axis) {
  const stepY = FORTIFICATION_LENGTH / Y_TO_X_SCALE;
  const center = (value, step, offset) => (Math.round(value / step - offset) + offset) * step;
  return { x: center(x, FORTIFICATION_LENGTH, axis === 'vertical' ? 0 : .5),
    y: center(y, stepY, axis === 'vertical' ? .5 : 0) };
}

// Collision and placement use the same segment in map units.
function wallCoordinates(wall, point) {
  const x = point.x - wall.x;
  const y = (point.y - wall.y) * Y_TO_X_SCALE;
  return wall.fortificationAxis === 'vertical' ? { along: y, across: x } : { along: x, across: y };
}

function wallPoint(wall, along, across) {
  return wall.fortificationAxis === 'vertical'
    ? { x: wall.x + across, y: wall.y + along / Y_TO_X_SCALE }
    : { x: wall.x + along, y: wall.y + across / Y_TO_X_SCALE };
}

function fortificationsOverlap(a, b) {
  const half = FORTIFICATION_LENGTH / 2;
  const p = wallCoordinates(a, b);
  const sameAxis = (a.fortificationAxis || 'horizontal') === (b.fortificationAxis || 'horizontal');
  if (sameAxis) return Math.abs(p.across) < .75 && Math.abs(p.along) < FORTIFICATION_LENGTH - .08;
  if (Math.abs(p.across) > half + .08 || Math.abs(p.along) > half + .08) return false;
  return Math.abs(p.across) < half - .08 || Math.abs(p.along) < half - .08;
}

function upgradeFortification(building) {
  const type = FORTIFICATION_UPGRADES[building.type];
  if (!type || !isDone(building) || !reserveWeaponMaterials({ [type]: 1 })) return;
  startUpgrade(building, { kind: 'fortification', type }, workshopName(type));
}
function siegeBarrierBetween(actor, target) {
  let first = null;
  for (const wall of state.buildings) {
    if (!isSiegeBarrier(wall.type) || wall.ruined || (wall.underConstruction && !wall.pendingUpgrade) || !workerOnBuildingMap(actor, wall)) continue;
    if (SIEGE_DEPLOYMENTS[wall.type].deploy === 'gate' && gateAllows(actor)) continue;
    const from = wallCoordinates(wall, actor), to = wallCoordinates(wall, target);
    if (Math.abs(to.across - from.across) < 1e-7) continue;
    const t = -from.across / (to.across - from.across);
    if (t <= 1e-7 || t > 1 || (first && t >= first.t)) continue;
    const along = from.along + (to.along - from.along) * t;
    if (Math.abs(along) <= FORTIFICATION_LENGTH / 2 + .08) first = { wall, along, t };
  }
  return first;
}

function siegePassage(actor, target, step) {
  const hit = siegeBarrierBetween(actor, target);
  if (!hit) return siegeBridgeWaypoint(actor, target);
  const { wall, along } = hit;
  const from = wallCoordinates(wall, actor);
  const side = Math.sign(from.across);
  if (isHostile(actor)) {
    if (distanceTo(actor, wallPoint(wall, along, 0)) < 2.2 && actor.cooldown <= 0) {
      actor.cooldown = ATTACK_COOLDOWN;
      actor.attackAnim = 0.5;
      damageBuilding(wall, Math.max(1, Math.round(statsOf(actor).atk)));
    }
    if (wall.ruined) return target;
    return wallPoint(wall, along, side * 1.2);
  }
  const stairs = SIEGE_DEPLOYMENTS[wall.type].deploy === 'wall' && gateAllows(actor)
    ? state.buildings.find(building => {
      if (SIEGE_DEPLOYMENTS[building.type]?.deploy !== 'stairs' || !isDone(building) || !workerOnBuildingMap(actor, building)) return false;
      const p = wallCoordinates(wall, building);
      return Math.abs(p.along) <= 4 && Math.abs(p.across) <= 6;
    }) : null;
  if (stairs) {
    const approach = wallCoordinates(wall, stairs).along;
    return Math.abs(from.across) <= 1.15 && Math.abs(from.along - approach) < .15
      ? wallPoint(wall, approach, -side * Math.max(step, 1.2))
      : wallPoint(wall, approach, side);
  }

  // Nearby gates and exposed ends are useful only when both legs avoid other sections.
  const half = FORTIFICATION_LENGTH / 2;
  const detours = [-half - 1, half + 1].map(end => [wallPoint(wall, end, side), wallPoint(wall, end, -side)]);
  if (gateAllows(actor)) {
    for (const gate of state.buildings) {
      if (SIEGE_DEPLOYMENTS[gate.type]?.deploy !== 'gate' || !workerOnBuildingMap(actor, gate) || (!isDone(gate) && !gate.pendingUpgrade)) continue;
      detours.push([-1, 1].map(s => wallPoint(gate, 0, s * 1.2)));
      detours.push([1, -1].map(s => wallPoint(gate, 0, s * 1.2)));
    }
  }
  const possible = detours.filter(([entry, exit]) => !siegeBarrierBetween(actor, entry)
    && !siegeBarrierBetween({ ...actor, ...entry }, exit) && !siegeBarrierBetween({ ...actor, ...exit }, target));
  possible.sort(([a, b], [c, d]) => distanceTo(actor, a) + distanceTo(b, target) - distanceTo(actor, c) - distanceTo(d, target));
  if (!possible.length) return fortificationRoute(actor, target) || wallPoint(wall, along, side * 1.2);
  const [entry, exit] = possible[0];
  return distanceTo(actor, entry) > 0.1 ? entry : exit;
}

function siegePlacementSpacing(type, building) {
  const next = SIEGE_DEPLOYMENTS[type]?.deploy;
  const existing = SIEGE_DEPLOYMENTS[building.type]?.deploy;
  if (!next || !existing) return BUILD_SPACING;
  if ((isSiegeBarrier(type) && existing === 'stairs') || (next === 'stairs' && isSiegeBarrier(building.type))) return 1.75;
  if (isSiegeBarrier(type) && isSiegeBarrier(building.type)) return 8.5;
  return 4;
}

function siegeThumbHTML(type, extraClass = '') {
  if (SIEGE_PHOTO_CELLS[type]) return `<span class="siege-thumb siege-thumb-photo siege-sheet ${extraClass}" style="${siegePhotoStyle(type)}" aria-hidden="true"></span>`;
  if (['woodenPalisade', 'reinforcedWoodenWall', 'woodenGate', 'reinforcedWoodenGate'].includes(type)) {
    const art = BUILDING_ART[type];
    return `<span class="siege-thumb siege-thumb-photo ${extraClass}" style="${buildingImageStyle(art)}" aria-hidden="true"></span>`;
  }
  return `<span class="siege-thumb ${extraClass}" data-siege="${SIEGE_DEPLOYMENTS[type].deploy}" aria-hidden="true"></span>`;
}

function siegeBridgeWaypoint(actor, target) {
  if ((actor.mapId || 'city') !== 'wilds' || isHostile(actor) || actor.y === target.y) return target;
  for (const bridge of state.buildings) {
    if (SIEGE_DEPLOYMENTS[bridge.type]?.deploy !== 'bridge' || !isDone(bridge) || !workerOnBuildingMap(actor, bridge)) continue;
    const t = (bridge.y - actor.y) / (target.y - actor.y);
    if (t <= 0 || t >= 1 || Math.abs(actor.x + (target.x - actor.x) * t - bridge.x) > 7) continue;
    if (Math.abs(actor.x - bridge.x) < 0.15) return { x: bridge.x, y: bridge.y + Math.sign(target.y - actor.y) * 2 };
    return { x: bridge.x, y: actor.y };
  }
  return target;
}

function fortificationRoute(actor, target) {
  const unit = FORTIFICATION_LENGTH;
  const cell = point => [Math.floor(point.x / unit), Math.floor(point.y * Y_TO_X_SCALE / unit)];
  const point = ([x, y]) => ({ x: (x + .5) * unit, y: (y + .5) * unit / Y_TO_X_SCALE });
  const start = cell(actor), goal = cell(target);
  const path = [{ cell: start, first: null }];
  const visited = new Set([start.join(',')]);
  for (const current of path) {
    if (current.first && current.cell[0] === goal[0] && current.cell[1] === goal[1]) return current.first;
    const [x, y] = current.cell;
    const from = current.first ? { ...actor, ...point(current.cell) } : actor;
    for (const next of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const center = point(next);
      const key = next.join(',');
      if (visited.has(key) || center.x <= 1 || center.x >= 99 || center.y <= 1 || center.y >= 198 || siegeBarrierBetween(from, center)) continue;
      visited.add(key);
      path.push({ cell: next, first: current.first || center });
    }
  }
  return null;
}
