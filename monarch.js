// ==========================================================================
// Monarca: as 30 magias do herdeiro (data/monarch-spells.json) funcionando no mapa.
// O Monarca anda pelo domínio, não luta e ninguém bate nele. Ele comanda: auras em volta dele,
// ordens e decretos para os aliados, editos e julgamentos contra os inimigos, invocações.
// Recurso: MP (o atributo do herdeiro).
// Os ganchos no combate do app.js chamam window.Monarch.* com ?. para o jogo rodar sem este arquivo.
// ==========================================================================
const Monarch = (() => {
  const DATA = MONARCH_SPELLS;
  const SPELLS = DATA.spells;
  const byKey = {}, byId = {};
  SPELLS.forEach(spell => { byKey[spell.key] = spell; byId[spell.id] = spell; });
  const C = SpellFX.COLORS;
  const D = SpellFX.draw;
  const FX = SpellFX.fx;
  const emit = SpellFX.emit;
  const BODY = 2.4;   // altura do peito acima dos pés, em unidades do mapa
  const HEAD = 4.9;
  const WALK_SPEED = 3.8;
  const POSITIVE = ['shield', 'haste', 'order', 'annihilate', 'invuln', 'ccImmune'];
  const CONTROL = ['slow', 'root', 'stun', 'knock', 'push', 'silence'];

  const GLYPHS = {
    'ordem-de-comando': '⚔', 'aura-da-presenca': '♛', 'edito-de-contencao': '❅', 'pulso-de-soberania': '◎', 'convocacao-do-vassalo': '☗',
    'decreto-de-ferro': '⛨', 'marca-do-rebelde': '✠', 'aura-da-coragem': '✷', 'julgamento-real': '☀', 'dominio-territorial': '⚑',
    'ordem-de-investida': '➹', 'aura-de-submissao': '▼', 'edito-de-silencio': '☾', 'aegis-da-coroa': '⛉', 'convocacao-da-guarda-real': '♜',
    'decreto-de-executado': '☠', 'aura-da-conquista': '⚜', 'correntes-da-lei': '⛓', 'palavra-do-imperador': '✺', 'pacto-de-soberania': '♥',
    'ordem-de-aniquilacao': '✪', 'aura-de-invulnerabilidade': '◈', 'decreto-da-ruina': '✸', 'santuario-do-trono': '♖', 'invocacao-do-exercito-astral': '☄',
    'edito-de-servidao': '♞', 'aura-do-imperador-divino': '☼', 'julgamento-do-trono-supremo': '⚡', 'presenca-esmagadora': '⬣', 'majestade-absoluta': '♔',
  };
  const ACCENT = {
    ordem: '#f1c66a', aura: '#e9d08f', edito: '#a98bff', onda: '#d8e6ff', invocacao: '#7fd3ff', decreto: '#d0b47a', marca: '#ff6a55',
    ataque: '#fff1c4', zona: '#8cf2a4', controle: '#c9d3e6', grito: '#ffd46b', pacto: '#ff8a8a', canalizacao: '#ffd98a', suprema: '#ffe08a',
  };

  const rt = {
    time: 0, summons: [], zones: [], armies: [], channel: null, majesty: 0, conquest: { stacks: 0, t: 0 },
    targeting: null, hover: null, mods: new Map(), allies: [], enemies: [], crushInside: new Set(), nextId: 1,
    self: { id: 'monarch', name: 'O Monarca', className: 'Monarch', purse: 0, x: 0, y: 0 }, barKey: '', barClock: 0, cache: new Map(),
    projs: [], timers: [], fzones: [], lastMap: '', panelClock: 0,
  };

  // ----- Nível, ranks e números de cada magia -----
  const level = () => Math.max(1, Math.min(DATA.maxLevel, state.heirLevel || 1));
  const heirStat = key => { const stat = HEIR_STATS.find(item => item.key === key); return stat ? stat.base + stat.per * (level() - 1) : 0; };
  const mag = () => heirStat('MAG');
  // Atributo do nível mais o do equipamento.
  const statTotal = key => heirStat(key) + (typeof monarchBonus === 'function' ? monarchBonus(key) : 0);
  // Recuperação de MP por segundo: Sabedoria é a principal, Inteligência ajuda. Em combate, metade.
  // Nível 1 (WIS 7, INT 9) ~1,1 MP/s; nível 30 (WIS 65, INT 67) ~9,2 MP/s.
  const mpRegen = (fighting = false) => (statTotal('WIS') * 0.10 + statTotal('INT') * 0.04) * (fighting ? 0.5 : 1);
  const isUnlocked = spell => level() >= spell.unlockLevel && !(spell.replacedBySpellId && level() >= byId[spell.replacedBySpellId].unlockLevel);
  const rankIndex = spell => { let index = -1; spell.ranks.forEach((rank, i) => { if (rank.level <= level()) index = i; }); return index; };
  function stats(spell) {
    const cacheKey = `${spell.key}:${level()}`;
    if (rt.cache.has(cacheKey)) return rt.cache.get(cacheKey);
    const result = { ...spell.base };
    spell.ranks.slice(0, rankIndex(spell) + 1).forEach(rank => Object.assign(result, rank.changes));
    rt.cache.set(cacheKey, result);
    return result;
  }
  const effects = spell => spell.ranks[Math.max(0, rankIndex(spell))].effects;
  const unlockedSpells = () => SPELLS.filter(isUnlocked);
  const byLevelTable = table => { let value = 0; Object.entries(table).forEach(([lv, v]) => { if (Number(lv) <= level()) value = v; }); return value; };

  // ----- Estado salvo junto com o jogo -----
  function ms() {
    if (!state.monarch) state.monarch = { x: 44.5, y: 41.5, mp: null, auras: [], cd: {}, goal: null, pending: null, knownLevel: level() };
    const m = state.monarch;
    if (!Array.isArray(m.auras)) m.auras = [];
    if (!m.cd) m.cd = {};
    if (m.mp == null) m.mp = mpCap();
    return m;
  }
  const auraOn = key => !!state.monarch?.auras.includes(key) && isUnlocked(byKey[key]);
  const auraMult = () => (rt.majesty > 0 ? 2 : 1);
  const maxMp = () => heirStat('MP');
  const reservedMp = () => (state.monarch?.auras || []).reduce((sum, key) => sum + (stats(byKey[key]).manaReservePercent || 0) / 100 * maxMp(), 0);
  const mpCap = () => Math.max(0, maxMp() - reservedMp());
  const auraSlots = () => byLevelTable(DATA.auraSlotsByLevel);
  const slotsUsed = () => ms().auras.filter(key => !byKey[key].auraSlotShared).length;
  function radiusOf(spell) {
    const st = stats(spell);
    let r = st.auraRadius;
    const follow = st.auraRadiusFollows && byKey[st.auraRadiusFollows];
    if (follow && isUnlocked(follow)) r = stats(follow).auraRadius;
    if (spell.activation === 'alternavel' && rt.majesty > 0) r *= 1.3;
    return r;
  }
  const heirName = () => heirById(state.heir)?.name || 'O Monarca';
  const firstName = () => heirName().split(' ')[0];

  // ----- Quem é aliado e quem é inimigo -----
  const isAlly = actor => !!actor && (actor.summon || actor.mfx?.convert || !isHostile(actor));
  const isEnemy = actor => !!actor && isHostile(actor) && !actor.mfx?.convert;
  const near = (list, x, y, r) => list.filter(actor => actor.alive && Math.hypot(actor.x - x, actor.y - y) <= r);
  const nearest = (list, x, y, r) => near(list, x, y, r).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;
  const fighters = () => rt.allies.filter(actor => actor.className !== 'Peasant');
  function refreshLists() {
    // O Monarca fica na cidade: quem está nos Wilds não conta.
    const here = a => a.alive && (a.mapId || 'city') === 'city';
    rt.allies = [...state.heroes.filter(here), ...state.workers.filter(here), ...rt.summons.filter(a => a.alive), ...(state.bandits || []).filter(b => here(b) && b.mfx?.convert)];
    rt.enemies = (state.bandits || []).filter(b => here(b) && !b.mfx?.convert);
  }
  const addFx = (actor, key, t, data = {}) => { actor.mfx = actor.mfx || {}; actor.mfx[key] = { t, ...data }; return actor.mfx[key]; };
  const heal = (actor, amount) => { actor.hp = Math.min(maxHpOf(actor), hpOf(actor) + amount); };

  // ----- Dano das magias -----
  function hurt(enemy, amount) {
    if (!enemy.alive || amount <= 0) return 0;
    const d = statsOf(enemy);
    let damage = amount * amount / Math.max(1, amount + d.def / 2);
    const f = enemy.mfx || {};
    let mul = 1;
    if (f.execute && hpOf(enemy) < maxHpOf(enemy) * f.execute.thr / 100) mul += f.execute.v / 100;
    if (f.silence?.magicTaken) mul += f.silence.magicTaken / 100;
    damage = Math.max(1, Math.round(damage * mul));
    enemy.hp = hpOf(enemy) - damage;
    enemy.calm = 5;
    if (enemy.hp <= 0) killBySpell(enemy);
    return damage;
  }
  function killBySpell(enemy) {
    onEnemyKilled(enemy);
    const m = ms();
    Object.assign(rt.self, { name: heirName(), x: m.x, y: m.y });
    killActor(enemy, rt.self);
    if (rt.self.purse) { if (!state.testMode) state.gold += rt.self.purse; rt.self.purse = 0; updateHud(); }
    gainHeirXp(4);
  }
  function onEnemyKilled(enemy) {
    spreadPlague(enemy);
    const m = ms();
    const dist = Math.hypot(enemy.x - m.x, enemy.y - m.y);
    const widest = Math.max(0, ...m.auras.filter(key => isUnlocked(byKey[key])).map(key => radiusOf(byKey[key])));
    if (auraOn('aura-da-conquista') && dist <= radiusOf(byKey['aura-da-conquista'])) {
      const e = effects(byKey['aura-da-conquista']);
      rt.conquest.stacks = Math.min(e.maxStacks, rt.conquest.stacks + 1);
      rt.conquest.t = e.stackDurationSeconds;
      FX.link({ x: enemy.x, y: enemy.y - BODY }, { x: m.x, y: m.y - BODY }, C.crimson, 0.5, 0, 0.5);
      emit(m.x, m.y - BODY, { color: C.crimson, count: 10, speed: 3, size: 0.35, up: 3 });
    }
    const f = enemy.mfx || {};
    if (f.mark?.jump) {
      const next = nearest(rt.enemies.filter(other => other !== enemy && !other.mfx?.mark), enemy.x, enemy.y, 12);
      if (next) { addFx(next, 'mark', f.mark.t / 2, { v: f.mark.v, jump: true }); FX.link({ x: enemy.x, y: enemy.y - HEAD }, { x: next.x, y: next.y - HEAD }, C.crimson, 0.6, 0, 0.4); }
    }
    emit(enemy.x, enemy.y - BODY, { color: C.paleGold, count: 8, speed: 1.5, size: 0.4, up: 4, shape: SpellFX.SHAPE.wisp });
  }

  // Empurrão: o alvo voa por um instante; se bater numa construção ou na beira do mapa, pode ficar atordoado.
  function push(actor, fromX, fromY, dist, stun = 0) {
    if (!dist || actor.mfx?.root) return;
    let dx = actor.x - fromX, dy = actor.y - fromY;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const dur = 0.28;
    addFx(actor, 'push', dur, { vx: dx * dist / dur, vy: dy * dist / dur, stun });
  }

  const control = (actor, key, t, data = {}) => { addFx(actor, key, Math.max(actor.mfx?.[key]?.t || 0, t), data); };

  // ----- Invocações -----
  function summon(kind, x, y, e, st) {
    rt.summons.filter(s => s.alive && (s.summon === kind || (kind === 'guard' && s.summon === 'vassal'))).forEach(s => dismiss(s, false));
    const count = e.summonCount || 1;
    const hp = Math.round(e.summonHpBase + e.summonHpPerLevel * level());
    const atk = Math.round(e.summonDamageBase + e.summonDamageMagPercent / 100 * mag());
    for (let i = 0; i < count; i++) {
      const offset = count > 1 ? (i - (count - 1) / 2) * 2.4 : 0;
      const s = {
        id: `summon-${rt.nextId++}`, summon: kind, className: 'Summon', prestige: kind === 'vassal' ? 'Templar' : 'Paladin',
        name: kind === 'vassal' ? 'Vassalo Espectral' : 'Guarda Real', level: level(), alive: true, x: x + offset, y, hp,
        fixedStats: { hp, atk, mag: 0, def: Math.round(6 + level() * 1.6), dex: 4 + level() }, life: st.durationSeconds,
        absorb: e.absorbPercent || 0, absorbRange: e.absorbRangeMeters || 0, tauntRadius: st.tauntRadius || 0, tauntSeconds: e.tauntSeconds || 0,
        tauntEvery: e.tauntEverySeconds || 0, tauntDr: e.damageReductionWhileTauntingPercent || 0, tauntClock: 0.4, taunting: 0, cooldown: 0, facing: 'front', side: 'right',
      };
      rt.summons.push(s);
      FX.beam(s.x, s.y, 1.4, 14, C.astral, 1.0);
      FX.sigil(s.x, s.y, 2.6, C.astral, 1.4, 5);
      emit(s.x, s.y - BODY, { color: C.astral, count: 26, speed: 4, size: 0.45, up: 5 });
    }
  }
  function dismiss(s, died) {
    s.alive = false;
    FX.flash(s.x, s.y - BODY, 3, C.astral, 0.5);
    emit(s.x, s.y - BODY, { color: C.astral, count: 18, speed: 2.5, size: 0.4, up: 5, shape: SpellFX.SHAPE.wisp });
    if (died) say(`${s.name} se desfez em fumaça azul. Lealdade espectral tem prazo de validade.`);
  }
  function summonStep(s, dt, reducedMotion) {
    s.life -= dt;
    if (s.life <= 0) { dismiss(s, false); return; }
    s.taunting = Math.max(0, s.taunting - dt);
    if (s.tauntEvery) {
      s.tauntClock -= dt;
      if (s.tauntClock <= 0) {
        s.tauntClock = s.tauntEvery;
        const hit = near(rt.enemies, s.x, s.y, s.tauntRadius);
        hit.forEach(enemy => addFx(enemy, 'taunt', s.tauntSeconds, { by: s.id }));
        if (hit.length) { s.taunting = s.tauntSeconds; FX.shockwave(s.x, s.y, s.tauntRadius, C.crimson, 0.6); }
      }
    }
    if (chargeStep(s, dt, reducedMotion)) return;
    s.cooldown = (s.cooldown || 0) - dt * attackRate(s);
    const focus = s.focus ? rt.enemies.find(enemy => enemy.id === s.focus) : null;
    const target = focus || nearest(rt.enemies, s.x, s.y, 22);
    if (!target) {
      const m = ms();
      const spot = { x: m.x + (s.x < m.x ? -2.5 : 2.5), y: m.y + 1 };
      animateWalk(s, Math.hypot(spot.x - s.x, spot.y - s.y) > 1.5 && moveToward(s, spot, 4 * dt) > 0, dt, reducedMotion);
      return;
    }
    if (Math.hypot(target.x - s.x, target.y - s.y) > MELEE_RANGE) { animateWalk(s, moveToward(s, target, 4.4 * dt) > 0, dt, reducedMotion); return; }
    faceToward(s, target);
    if (s.cooldown <= 0) { s.cooldown = ATTACK_COOLDOWN; s.attackAnim = 0.5; s.actionClock = 0; strike(s, target); }
    animateAttack(s, dt, reducedMotion);
  }

  // Investida: o aliado larga o que estava fazendo e corre até a área marcada.
  function chargeStep(actor, dt, reducedMotion) {
    const c = actor.mfx?.charge;
    if (!c || c.arrived) return false;
    const close = rt.enemies.some(enemy => Math.hypot(enemy.x - actor.x, enemy.y - actor.y) < MELEE_RANGE);
    if (close || Math.hypot(c.x - actor.x, c.y - actor.y) <= c.r) { c.arrived = true; return false; }
    actor.route = []; actor.finalPoint = null;
    animateWalk(actor, moveToward(actor, c, 4.2 * dt) > 0, dt, reducedMotion);
    if (Math.random() < dt * 14) emit(actor.x, actor.y - 1, { color: C.ember, count: 1, speed: 0.6, size: 0.35, up: 1, life: 0.5, layer: 'ground' });
    return true;
  }

  // Inimigo convertido pelo Edito de Servidão: luta contra os antigos colegas.
  function convertedStep(enemy, dt, reducedMotion) {
    enemy.cooldown = (enemy.cooldown || 0) - dt;
    const target = nearest(rt.enemies, enemy.x, enemy.y, 22);
    if (!target) { animateWalk(enemy, false, dt, reducedMotion); return; }
    const range = enemy.kind === 'crossbow' ? SHOT_RANGE : MELEE_RANGE;
    if (Math.hypot(target.x - enemy.x, target.y - enemy.y) > range) { animateWalk(enemy, moveToward(enemy, target, 3.6 * dt) > 0, dt, reducedMotion); return; }
    faceToward(enemy, target);
    if (enemy.cooldown <= 0) { enemy.cooldown = ATTACK_COOLDOWN; enemy.attackAnim = 0.5; enemy.actionClock = 0; strike(enemy, target); }
    animateAttack(enemy, dt, reducedMotion);
  }

  // ----- Conjuração -----
  function canCast(spell) {
    if (!isUnlocked(spell)) return `${spell.name}: ainda não aprendeu.`;
    const m = ms();
    const st = stats(spell);
    if (spell.activation === 'alternavel' && m.auras.includes(spell.key)) return null;
    if ((m.cd[spell.key] || 0) > 0) return `${spell.name}: em recarga (${Math.ceil(m.cd[spell.key])} s).`;
    if (m.mp < st.manaCost) return `${spell.name}: falta mana. O sangue azul não paga contas.`;
    if (spell.activation === 'alternavel') {
      if (spell.auraSlotShared && !m.auras.includes(spell.auraSlotShared)) return `${spell.name}: ligue antes a ${byKey[spell.auraSlotShared].name}.`;
      if (!spell.auraSlotShared && slotsUsed() >= auraSlots()) return `Sem espaço para mais auras (${auraSlots()} ao mesmo tempo). Desligue uma.`;
    }
    return null;
  }
  function pay(spell) {
    const m = ms();
    const st = stats(spell);
    m.mp -= st.manaCost;
    m.cd[spell.key] = st.cooldownSeconds;
  }
  const needsTarget = spell => stats(spell).castRange > 0;

  function press(key) {
    if (!active()) return;
    const m = ms();
    if (key === 'move') { rt.targeting = rt.targeting?.key === 'move' ? null : { key: 'move' }; refreshCursor(); return; }
    const spell = byKey[key];
    if (!spell) return;
    if (rt.channel?.key === key) { endChannel(); return; }
    const reason = canCast(spell);
    if (reason) { say(reason); return; }
    // Aura já ligada desliga na hora. Todo o resto: escolhe a magia e clica no mapa onde ela sai.
    if (spell.activation === 'alternavel' && m.auras.includes(spell.key)) { toggleAura(spell); return; }
    m.pending = null;
    rt.targeting = rt.targeting?.key === key ? null : { key };
    refreshCursor();
  }
  function toggleAura(spell) {
    const m = ms();
    if (m.auras.includes(spell.key)) {
      m.auras = m.auras.filter(key => key !== spell.key && byKey[key].auraSlotShared !== spell.key);
      say(`${spell.name} desligada.`);
    } else {
      pay(spell);
      m.auras.push(spell.key);
      FX.shockwave(m.x, m.y, radiusOf(spell), auraColor(spell.key), 0.8);
      emit(m.x, m.y - BODY, { color: auraColor(spell.key), count: 20, speed: 4, size: 0.4, up: 3 });
      say(`${spell.name} ligada.`);
    }
    m.mp = Math.min(m.mp, mpCap());
    renderBar(true);
  }
  function startChannel(spell) {
    const e = effects(spell);
    pay(spell);
    rt.channel = { key: spell.key, t: 0, max: e.maxChannelSeconds, r: radiusOf(spell), move: e.casterMoveSpeedPercent || 0, perSecond: stats(spell).manaPerSecond || 0 };
    const m = ms();
    if (e.cleanseOnStart) near(rt.allies, m.x, m.y, rt.channel.r).forEach(ally => CONTROL.forEach(key => { if (ally.mfx) delete ally.mfx[key]; }));
    FX.shockwave(m.x, m.y, rt.channel.r, C.gold, 0.7);
    say(`${firstName()} ergue a coroa. Ninguém por perto vai ser derrubado enquanto ela durar.`);
  }
  function endChannel() {
    if (!rt.channel) return;
    const m = ms();
    FX.flash(m.x, m.y - BODY, rt.channel.r * 0.6, C.gold, 0.4);
    rt.channel = null;
  }

  // Clique no mapa com uma magia escolhida: a magia sai ali, na hora. Não existe Monarca andando:
  // o ponto de origem da magia passa a ser onde você clicou (ou o inimigo clicado).
  function onMapClick(point) {
    const t = rt.targeting;
    if (!t) return false;
    const m = ms();
    if (t.key === 'move') {
      m.goal = point; m.pending = null; rt.targeting = null; refreshCursor();
      FX.sigil(point.x, point.y, 1.4, C.gold, 0.7, 4);
      return true;
    }
    const spell = byKey[t.key];
    let targetId = null;
    if (spell.target === 'inimigo_unico') {
      const enemy = nearest(rt.enemies, point.x, point.y, 4);
      if (enemy && spell.key === 'edito-de-servidao') {
        const e = effects(spell);
        if (enemy.boss) { say('Chefes não se ajoelham. Pelo menos não para você.'); return true; }
        if ((enemy.level || 1) > level() + e.maxTargetLevelAboveCaster) { say(`${enemy.name} é forte demais para servir. Por enquanto.`); return true; }
      }
      targetId = enemy?.id || null;
    }
    // Sem inimigo perto, a magia sai no chão do mesmo jeito. Ela continua escolhida para o próximo tiro.
    const enemy = (targetId ? rt.enemies.find(other => other.id === targetId) : null) || (spell.target === 'inimigo_unico' ? ghostAt(point) : null);
    const spot = enemy || point;
    m.pending = null; m.goal = null; m.walkTo = null;
    m.x = spot.x; m.y = spot.y;
    if (spell.activation === 'alternavel') { rt.targeting = null; refreshCursor(); }
    const reason = canCast(spell);
    if (reason) { say(reason); return true; }
    if (spell.activation === 'alternavel') toggleAura(spell);
    else cast(spell, { x: spot.x, y: spot.y, enemy });
    return true;
  }
  function pendingStep() {
    const m = ms();
    const p = m.pending;
    if (!p) return;
    const spell = byKey[p.key];
    const target = p.targetId ? rt.enemies.find(enemy => enemy.id === p.targetId) : null;
    if ((p.targetId || spell.target === 'inimigo_unico') && !target) { m.pending = null; m.walkTo = null; return; }
    const spot = target || p;
    const range = stats(spell).castRange;
    if (Math.hypot(spot.x - m.x, spot.y - m.y) > range) { m.walkTo = spot; return; }
    m.pending = null;
    m.walkTo = null;
    const reason = canCast(spell);
    if (reason) { say(reason); return; }
    cast(spell, { x: spot.x, y: spot.y, enemy: target });
  }

  function cast(spell, target) {
    if (rt.channel && spell.key !== rt.channel.key) endChannel();
    if (spell.activation === 'canalizada') { startChannel(spell); return; }
    pay(spell);
    const handler = CAST[spell.key];
    if (handler) handler(spell, stats(spell), effects(spell), target);
    renderBar(true);
  }

  const CAST = {
    'ordem-de-comando'(spell, st, e, t) {
      const m = ms();
      const chosen = near(rt.allies, t.x, t.y, st.auraRadius).sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y)).slice(0, e.maxAllies);
      chosen.forEach(ally => {
        addFx(ally, 'order', st.durationSeconds, { v: e.nextAttackDamagePercent });
        FX.link({ x: m.x, y: m.y - HEAD }, { x: ally.x, y: ally.y - HEAD }, C.gold, 0.5, 0, 0.35);
        emit(ally.x, ally.y - HEAD, { color: C.gold, count: 10, speed: 2, size: 0.3, up: 2 });
      });
      FX.sigil(t.x, t.y, st.auraRadius, C.gold, 1.0, 6);
      FX.shockwave(t.x, t.y, st.auraRadius, C.paleGold, 0.6);
      if (!chosen.length) say('A ordem ecoou no vazio. Ninguém por perto para obedecer.');
    },
    'edito-de-contencao'(spell, st, e) {
      const m = ms();
      const r = radiusOf(spell);
      const hit = near(rt.enemies, m.x, m.y, r);
      hit.forEach(enemy => {
        control(enemy, 'slow', st.durationSeconds, { v: e.slowPercent, summonTaken: e.summonDamageTakenPercent || 0 });
        if (e.rootAfterStacks) {
          const stack = enemy.mfx.containHits || addFx(enemy, 'containHits', e.stackWindowSeconds, { n: 0 });
          stack.n++;
          if (stack.n >= e.rootAfterStacks) { delete enemy.mfx.containHits; control(enemy, 'root', e.rootSeconds, { anchors: anchors() }); }
        }
        emit(enemy.x, enemy.y - 1, { color: C.frost, count: 8, speed: 1.5, size: 0.35, up: 1.5, layer: 'ground' });
      });
      FX.shockwave(m.x, m.y, r, C.frost, 0.9);
      FX.sigil(m.x, m.y, r, C.violet, 1.0, 8, 'ground', -0.8);
    },
    'pulso-de-soberania'(spell, st, e) {
      const m = ms();
      near(rt.enemies, m.x, m.y, st.auraRadius).forEach(enemy => {
        hurt(enemy, e.damageBase + e.damageMagPercent / 100 * mag());
        if (enemy.alive) push(enemy, m.x, m.y, e.knockbackMeters, e.stunOnCollisionSeconds || 0);
      });
      FX.shockwave(m.x, m.y, st.auraRadius, C.paleGold, 0.55);
      FX.shockwave(m.x, m.y, st.auraRadius * 0.7, C.white, 0.4);
      FX.flash(m.x, m.y - BODY, st.auraRadius * 0.5, C.gold, 0.3);
      emit(m.x, m.y, { color: C.steel, count: 40, speed: st.auraRadius * 2.2, size: 0.45, up: 0.6, ring: 1, layer: 'ground', life: 0.6 });
    },
    'convocacao-do-vassalo'(spell, st, e, t) { summon('vassal', t.x, t.y, e, st); },
    'convocacao-da-guarda-real'(spell, st, e, t) { summon('guard', t.x, t.y, e, st); say('A Guarda Real voltou dos mortos. Não pela sua honra: pelo soldo atrasado.'); },
    'aegis-da-coroa'(spell, st, e) {
      const m = ms();
      near(rt.allies, m.x, m.y, st.auraRadius).forEach(ally => {
        CONTROL.forEach(key => { if (ally.mfx) delete ally.mfx[key]; });
        addFx(ally, 'ccImmune', st.durationSeconds);
      });
      FX.shockwave(m.x, m.y, st.auraRadius, C.gold, 0.7);
      FX.sigil(m.x, m.y, st.auraRadius, C.paleGold, st.durationSeconds, 12);
      say(firstName() + ' ergue a coroa. O grupo fica imune a controle por 60 s.');
    },
    'decreto-de-ferro'(spell, st, e) {
      const m = ms();
      const value = Math.round(e.shieldBase + e.shieldPerLevel * level() + e.shieldMagPercent / 100 * mag());
      near(rt.allies, m.x, m.y, st.auraRadius).forEach(ally => {
        addFx(ally, 'shield', st.durationSeconds, { v: value, max: value, knock: e.breakKnockbackMeters || 0, heal: e.expireHealPercent || 0 });
        FX.flash(ally.x, ally.y - BODY, 2.6, C.steel, 0.4);
      });
      FX.sigil(m.x, m.y, st.auraRadius, C.steel, 1.0, 6);
      FX.shockwave(m.x, m.y, st.auraRadius, C.steel, 0.6);
    },
    'marca-do-rebelde'(spell, st, e, t) {
      const enemy = t.enemy;
      const marked = rt.enemies.filter(other => other.mfx?.mark).sort((a, b) => a.mfx.mark.t - b.mfx.mark.t);
      while (marked.length >= e.maxMarkedTargets) delete marked.shift().mfx.mark;
      addFx(enemy, 'mark', st.durationSeconds, { v: e.healAttackerPercent, jump: !!e.jumpsOnDeath });
      focusSummons(enemy);
      FX.beam(enemy.x, enemy.y, 0.7, 10, C.crimson, 0.6);
      FX.sigil(enemy.x, enemy.y, 1.8, C.crimson, 0.9, 5);
      say(`${enemy.name} foi marcado como rebelde. Quem bater nele, sara.`);
    },
    'julgamento-real'(spell, st, e, t) {
      const enemy = t.enemy;
      let damage = e.holyDamageBase + e.holyDamageMagPercent / 100 * mag();
      const marked = !!enemy.mfx?.mark;
      if (e.critVsMarked && marked) damage *= 1.5;
      focusSummons(enemy);
      addFx(enemy, 'judged', st.durationSeconds, { v: e.armorReductionPercent });
      const x = enemy.x, y = enemy.y;
      FX.beam(x, y, 1.3, 26, C.holy, 0.75);
      FX.shockwave(x, y, 3, C.paleGold, 0.5);
      FX.flash(x, y - BODY, 3.4, C.holy, 0.35);
      emit(x, y - BODY, { color: C.holy, count: marked ? 30 : 18, speed: 5, size: 0.4, up: 3, shape: SpellFX.SHAPE.star });
      hurt(enemy, damage);
    },
    'dominio-territorial'(spell, st, e, t) {
      rt.zones.push({ kind: 'domain', x: t.x, y: t.y, r: st.auraRadius, t: st.durationSeconds, max: st.durationSeconds, e });
      FX.beam(t.x, t.y, 1, 16, C.emerald, 0.9);
      FX.shockwave(t.x, t.y, st.auraRadius, C.emerald, 0.8);
      say(`${firstName()} fincou o estandarte. Esta terra agora é dele. Os vermes discordam em silêncio.`);
    },
    'ordem-de-investida'(spell, st, e, t) {
      const m = ms();
      const runners = near(fighters(), m.x, m.y, st.auraRadius);
      runners.forEach((ally, i) => {
        const angle = i * 2.4;
        addFx(ally, 'charge', st.durationSeconds + 4, { x: t.x + Math.cos(angle) * 1.2, y: t.y + Math.sin(angle) * 1.2, r: st.targetAreaRadius, first: e.firstHitDamagePercent, arrived: false, used: false });
        addFx(ally, 'haste', st.durationSeconds, { v: e.moveSpeedPercent, unstoppable: e.unstoppableSeconds || 0 });
        FX.link({ x: ally.x, y: ally.y - 1 }, { x: t.x, y: t.y }, C.ember, 0.7, 0, 0.3);
      });
      FX.sigil(t.x, t.y, st.targetAreaRadius, C.ember, 1.6, 3);
      FX.shockwave(t.x, t.y, st.targetAreaRadius, C.gold, 0.5);
      if (!runners.length) say('Investida ordenada. A tropa estava longe demais para ouvir.');
    },
    'edito-de-silencio'(spell, st, e, t) {
      near(rt.enemies, t.x, t.y, st.auraRadius).forEach(enemy => control(enemy, 'silence', e.silenceSeconds, { magicTaken: e.silencedMagicDamageTakenPercent || 0 }));
      const r = st.auraRadius;
      FX.custom(1.2, k => { D.dome(t.x, t.y, r, C.darkViolet, (1 - k) * 0.8, 0, 3); D.darkZone(t.x, t.y, r, C.shadow, (1 - k) * 0.45); });
      FX.shockwave(t.x, t.y, r, C.violet, 0.7);
      emit(t.x, t.y - 3, { color: C.violet, count: 30, speed: 2, size: 0.4, up: -1, ring: r * 0.6, gravity: 2 });
    },
    'decreto-de-executado'(spell, st, e, t) {
      near(rt.enemies, t.x, t.y, st.auraRadius).forEach(enemy => addFx(enemy, 'execute', st.durationSeconds, { thr: e.executeThresholdHpPercent, v: e.damageTakenBonusPercent }));
      FX.sigil(t.x, t.y, st.auraRadius, C.blood, 1.4, 4, 'ground', 0.3);
      FX.cracks(t.x, t.y, st.auraRadius, C.crimson, 0.9);
    },
    'correntes-da-lei'(spell, st, e, t) {
      const chained = near(rt.enemies, t.x, t.y, st.auraRadius).sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y)).slice(0, e.maxTargets);
      chained.forEach(enemy => control(enemy, 'root', e.rootSeconds, { anchors: anchors(), dot: e.dotBase ? e.dotBase + e.dotMagPercent / 100 * mag() : 0, clock: 0 }));
      FX.sigil(t.x, t.y, st.auraRadius, C.steel, 1.2, 8);
      FX.shockwave(t.x, t.y, st.auraRadius, C.steel, 0.5);
    },
    'palavra-do-imperador'(spell, st, e) {
      const m = ms();
      const stunned = near(rt.enemies, m.x, m.y, st.auraRadius);
      stunned.forEach(enemy => { control(enemy, 'stun', e.stunSeconds); emit(enemy.x, enemy.y - HEAD, { color: C.gold, count: 6, speed: 1.5, size: 0.3, up: 1, shape: SpellFX.SHAPE.star }); });
      [0, 0.12, 0.24].forEach((delay, i) => setTimeout(() => FX.shockwave(m.x, m.y, st.auraRadius * (1 - i * 0.12), i ? C.gold : C.white, 0.6), delay * 1000));
      FX.flash(m.x, m.y - HEAD, 4, C.gold, 0.35);
      say(`${firstName()} falou mais alto. O vale inteiro calou a boca.`);
    },
    'pacto-de-soberania'(spell, st, e) {
      const m = ms();
      const group = near(rt.allies, m.x, m.y, st.auraRadius).filter(ally => !ally.mfx?.convert);
      if (!group.length) return;
      const average = group.reduce((sum, ally) => sum + hpOf(ally) / maxHpOf(ally), 0) / group.length;
      group.forEach(ally => {
        ally.hp = Math.min(maxHpOf(ally), maxHpOf(ally) * Math.min(1, average + e.bonusHealPercent / 100));
        if (e.shieldMaxHpPercent) addFx(ally, 'shield', e.shieldSeconds, { v: Math.round(maxHpOf(ally) * e.shieldMaxHpPercent / 100), max: Math.round(maxHpOf(ally) * e.shieldMaxHpPercent / 100) });
        FX.link({ x: m.x, y: m.y - BODY }, { x: ally.x, y: ally.y - BODY }, C.crimson, 0.9, 0, 0.35);
        emit(ally.x, ally.y - BODY, { color: [1, 0.5, 0.55], count: 8, speed: 1.2, size: 0.4, up: 2.5 });
      });
      FX.shockwave(m.x, m.y, st.auraRadius, [1, 0.45, 0.5], 0.8);
      say(`Pacto de Soberania: ${group.length} ${group.length === 1 ? 'vida dividida' : 'vidas divididas'} por igual. Ninguém ficou feliz, que é o que se espera de justiça.`);
    },
    'ordem-de-aniquilacao'(spell, st, e) {
      const m = ms();
      near(rt.allies, m.x, m.y, st.auraRadius).forEach(ally => {
        addFx(ally, 'annihilate', st.durationSeconds, { bonus: e.critDamageBonusPercent || 0 });
        FX.link({ x: m.x, y: m.y - HEAD }, { x: ally.x, y: ally.y - HEAD }, C.crimson, 0.45, 0, 0.3);
      });
      FX.sigil(m.x, m.y, st.auraRadius, C.crimson, 1.0, 8);
      FX.shockwave(m.x, m.y, st.auraRadius, C.gold, 0.6);
    },
    'aura-de-invulnerabilidade'(spell, st, e) {
      const m = ms();
      near(rt.allies, m.x, m.y, st.auraRadius).forEach(ally => addFx(ally, 'invuln', e.damageImmunitySeconds));
      FX.flash(m.x, m.y - BODY, st.auraRadius * 0.8, C.holy, 0.5);
      FX.shockwave(m.x, m.y, st.auraRadius, C.holy, 0.7);
      FX.sigil(m.x, m.y, st.auraRadius, C.paleGold, e.damageImmunitySeconds, 12);
    },
    'decreto-da-ruina'(spell, st, e) {
      const m = ms();
      let broken = 0;
      near(rt.enemies, m.x, m.y, st.auraRadius).forEach(enemy => {
        const f = enemy.mfx || {};
        const shield = (f.shield?.v || 0) + (enemy.shieldHp || 0);
        if (f.shield) delete f.shield;
        enemy.shieldHp = 0;
        let dispelled = 0;
        POSITIVE.forEach(key => { if (f[key] && dispelled < e.dispelMagicBuffs) { delete f[key]; dispelled++; } });
        if (e.blockShieldsSeconds) addFx(enemy, 'noShield', e.blockShieldsSeconds);
        if (shield) { broken++; hurt(enemy, shield * e.damageFromRemovedShieldPercent / 100); }
        emit(enemy.x, enemy.y - BODY, { color: C.crimson, count: 12, speed: 4, size: 0.35, up: 2, shape: SpellFX.SHAPE.star });
      });
      FX.cracks(m.x, m.y, Math.min(st.auraRadius, 28), C.crimson, 1.2);
      FX.flash(m.x, m.y - BODY, 8, C.crimson, 0.4);
      say(broken ? `Decreto da Ruína: ${broken} ${broken === 1 ? 'proteção desfeita' : 'proteções desfeitas'}.` : 'Decreto da Ruína: nenhum inimigo tinha proteção. Mas agora sabem que você pode.');
    },
    'santuario-do-trono'(spell, st, e, t) {
      rt.zones.push({ kind: 'sanctuary', x: t.x, y: t.y, r: st.auraRadius, t: st.durationSeconds, max: st.durationSeconds, e });
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; FX.beam(t.x + Math.cos(a) * st.auraRadius, t.y + Math.sin(a) * st.auraRadius, 0.6, 10, C.astral, 0.9); }
      FX.shockwave(t.x, t.y, st.auraRadius, C.astral, 0.8);
    },
    'invocacao-do-exercito-astral'(spell, st, e, t) {
      const m = ms();
      let dx = t.x - m.x, dy = t.y - m.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      rt.armies.push({ x: m.x, y: m.y, dx, dy, len: st.lineLength, width: st.lineWidth, t: 0, dur: st.durationSeconds, passes: e.passes, spirits: e.spiritCount,
        damage: e.damagePerPassBase + e.damagePerPassMagPercent / 100 * mag(), knock: e.knockbackMeters, hits: {} });
      FX.sigil(m.x, m.y, 4, C.astral, 1.2, 8);
      say(`${firstName()} chamou o Exército Astral. Os mortos de Mordavia finalmente servem pra alguma coisa.`);
    },
    'edito-de-servidao'(spell, st, e, t) {
      const enemy = t.enemy;
      addFx(enemy, 'convert', st.durationSeconds, { endDmg: e.endDamageMaxHpPercent, dmgPct: e.convertedDamagePercent || 0 });
      CONTROL.forEach(key => { if (enemy.mfx[key]) delete enemy.mfx[key]; });
      const m = ms();
      FX.link({ x: m.x, y: m.y - BODY }, { x: enemy.x, y: enemy.y - BODY }, C.violet, 1.0, 1, 0.5);
      FX.sigil(enemy.x, enemy.y, 2.4, C.violet, 1.2, 7);
      emit(enemy.x, enemy.y - BODY, { color: C.violet, count: 20, speed: 2, size: 0.4, up: 2 });
      say(`${enemy.name} se ajoelhou diante de ${firstName()}. Vai lutar do nosso lado até lembrar quem é.`);
    },
    'julgamento-do-trono-supremo'(spell, st, e, t) {
      const targets = near(rt.enemies, t.x, t.y, st.auraRadius);
      const pool = e.holyDamagePoolBase + e.holyDamagePoolMagPercent / 100 * mag();
      FX.beam(t.x, t.y, st.auraRadius * 0.45, 40, C.holy, 1.3);
      FX.shockwave(t.x, t.y, st.auraRadius, C.paleGold, 0.9);
      FX.cracks(t.x, t.y, st.auraRadius, C.gold, 1.2);
      FX.flash(t.x, t.y - BODY, st.auraRadius, C.holy, 0.6);
      emit(t.x, t.y - 12, { color: C.holy, count: 60, speed: 5, size: 0.5, up: -6, ring: st.auraRadius * 0.6, gravity: 4, shape: SpellFX.SHAPE.star });
      if (!targets.length) return;
      const each = pool / targets.length * (targets.length === 1 ? 1 + e.singleTargetBonusPercent / 100 : 1);
      targets.forEach(enemy => hurt(enemy, each));
      say(`O trono julgou ${targets.length} ${targets.length === 1 ? 'réu' : 'réus'}. Sentença executada antes da defesa falar.`);
    },
    'majestade-absoluta'(spell, st, e) {
      const m = ms();
      rt.majesty = st.durationSeconds;
      Object.keys(m.cd).forEach(key => { if (key !== spell.key) m.cd[key] = 0; });
      near([...state.heroes.filter(a => (a.mapId || 'city') === 'city'), ...rt.summons], m.x, m.y, st.auraRadius).forEach(ally => { ally.cooldown = 0; FX.flash(ally.x, ally.y - BODY, 2, C.gold, 0.4); });
      FX.beam(m.x, m.y, 2.6, 40, C.gold, 1.4);
      FX.shockwave(m.x, m.y, st.auraRadius, C.gold, 1.0);
      FX.sigil(m.x, m.y, st.auraRadius, C.paleGold, 1.8, 12);
      emit(m.x, m.y - BODY, { color: C.gold, count: 80, speed: 8, size: 0.5, up: 6, shape: SpellFX.SHAPE.star });
      say(`${firstName()} assumiu a Majestade Absoluta. Por doze segundos, até os credores se curvam.`);
    },
  };
  const anchors = () => [0, 1, 2].map(i => i / 3 * Math.PI * 2 + Math.random() * 0.8);
  const focusSummons = enemy => rt.summons.forEach(s => { if (s.alive) s.focus = enemy.id; });

  // =====================================================================
  // Magias de campo (ids 31 a 60): uma por nível, além das 30 do Monarca.
  // O herdeiro não aparece no mapa: o jogador escolhe a magia no painel MAGIAS e clica no alvo.
  // Valem no mapa que estiver aberto (City ou Wilds).
  // =====================================================================
  const FIELD = DATA.fieldSpells || [];
  const fieldByKey = {};
  FIELD.forEach(spell => { fieldByKey[spell.key] = spell; });
  const SCHOOL_COLOR = { fogo: C.fire, gelo: C.ice, raio: C.lightning, arcano: C.arcane, veneno: C.poison, sombra: C.violet, sagrado: C.holy, cura: C.heal };
  const SCHOOL_HEX = { fogo: '#ff7a3a', gelo: '#9fdcff', raio: '#c9d8ff', arcano: '#c69bff', veneno: '#8cff5a', sombra: '#a77bff', sagrado: '#fff1c4', cura: '#7dffa0' };
  const FIELD_GLYPH = {
    fagulha: '✹', 'toque-restaurador': '✚', 'missil-magico': '✦', 'dardo-venenoso': '➶', 'bola-de-fogo': '☄', fraqueza: '☾', 'cadeia-de-relampagos': 'ϟ', nevasca: '❄',
    'onda-de-cura': '✚', 'nuvem-toxica': '☣', 'lanca-de-gelo': '❆', relampago: 'ϟ', 'maldicao-da-carne': '☠', regeneracao: '❦', meteoro: '☄', 'dreno-de-vida': '♥',
    'chuva-de-fogo': '♨', ruina: '☾', 'tempestade-de-raios': '⛈', ressurreicao: '✝', praga: '☣', 'explosao-solar': '☀', 'enxame-de-missseis': '✦', 'enxame-de-misseis': '✦',
    'fonte-da-vida': '❦', inferno: '♨', 'zero-absoluto': '❄', 'furia-dos-ceus': '⛈', eclipse: '◐', cataclismo: '☄', milagre: '✝',
  };
  const fieldUnlocked = spell => level() >= spell.unlockLevel;
  const grow = (v, spell) => (v ? v.base + v.perLevel * Math.max(0, level() - spell.unlockLevel) + v.magPercent / 100 * mag() : 0);
  const r1 = v => Math.round(v * 10) / 10;
  function fieldNums(spell) {
    const n = {
      dano: Math.round(grow(spell.damage, spell)), cura: Math.round(grow(spell.heal, spell)), raio: spell.radius || 0, duracao: spell.durationSeconds || 0,
      intervalo: spell.tickSeconds || 0, porTique: spell.hitsPerTick || 0, misseis: spell.missiles || 0, saltos: spell.jumps || 0, perda: spell.falloffPercent || 0,
      atordoa: spell.stunSeconds || 0, congela: spell.freezeSeconds || 0, empurra: spell.knockback || 0, dreno: spell.drainHealPercent || 0, atraso: spell.delaySeconds || 0,
      raios: spell.strikes || 0, raioImpacto: spell.impactRadius || 0, chanceCongelar: spell.freezeChancePercent || 0, vidaVolta: spell.reviveHpPercent || 0,
      curaPct: spell.healPercent || 0, execucao: spell.execute?.belowHpPercent || 0,
    };
    if (spell.dot) { n.dotDps = grow(spell.dot.dps, spell); n.dotDuracao = spell.dot.durationSeconds; n.dotTotal = Math.round(n.dotDps * n.dotDuracao); }
    if (spell.cloud) { n.cloudDps = grow(spell.cloud, spell); n.dps = r1(n.cloudDps); }
    if (spell.hot) { n.hotHps = grow(spell.hot.hps, spell); n.hps = r1(n.hotHps); n.hotDuracao = spell.hot.durationSeconds; }
    if (spell.slow) { n.lentidao = spell.slow.percent; n.lentidaoDuracao = spell.slow.durationSeconds; }
    if (spell.weaken) { n.fraqueza = spell.weaken.damageDealtPercent; n.vulneravel = spell.weaken.damageTakenPercent; n.armadura = spell.weaken.armorPercent; n.fraquezaDuracao = spell.weaken.durationSeconds; }
    return n;
  }
  const fieldText = spell => { const n = fieldNums(spell); return spell.description.replace(/\{(\w+)\}/g, (_, k) => String(n[k] ?? '?').replace('.', ',')); };
  const fieldTitle = spell => `${spell.name} (nível ${spell.unlockLevel})\n${fieldText(spell)}\n${spell.manaCost} MP · recarga ${spell.cooldownSeconds} s · ${DATA.fieldRules?.targets?.[spell.target] || ''}`;

  // Quem está no mapa aberto.
  const mapKey = () => `${currentMap}:${currentMapSet}`;
  const onMap = a => a.alive && (a.mapId || 'city') === currentMap && (a.mapSet || 1) === currentMapSet;
  const fEnemies = () => (state.bandits || []).filter(b => onMap(b) && !b.mfx?.convert);
  const fAllies = () => [...state.heroes, ...state.workers, ...rt.summons, ...(state.bandits || []).filter(b => b.mfx?.convert)].filter(onMap);
  const deadHeroes = () => state.heroes.filter(h => !h.alive && (h.mapId || 'city') === currentMap && (h.mapSet || 1) === currentMapSet);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const rand = (a, b) => a + Math.random() * (b - a);
  const inDisk = (x, y, r) => { const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r; return { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.9 }; };

  // Dano que ignora armadura (venenos, queimaduras, nuvens): guarda a fração até virar ponto inteiro.
  function hurtRaw(enemy, amount) {
    if (!enemy.alive || amount <= 0) return;
    const f = enemy.mfx || {};
    if (f.weaken?.taken) amount *= 1 + f.weaken.taken / 100;
    enemy.rawAcc = (enemy.rawAcc || 0) + amount;
    const whole = Math.floor(enemy.rawAcc);
    if (!whole) return;
    enemy.rawAcc -= whole;
    enemy.hp = hpOf(enemy) - whole;
    enemy.calm = 5;
    if (enemy.hp <= 0) killBySpell(enemy);
  }
  // Dano direto de magia: armadura conta, e Fraqueza/Ruína fazem o alvo apanhar mais.
  // Alvo de mentira no chão, para a magia sair onde clicou mesmo sem ninguém ali. Não leva dano nem efeito.
  const ghostAt = point => ({ id: 'ghost', name: '', x: point.x, y: point.y, alive: true, ghost: true });
  function hit(enemy, amount, spell) {
    if (!enemy.alive || enemy.ghost) return 0;
    let value = amount;
    if (spell?.execute && hpOf(enemy) < maxHpOf(enemy) * spell.execute.belowHpPercent / 100) value *= 1 + spell.execute.bonusPercent / 100;
    if (enemy.mfx?.weaken?.taken) value *= 1 + enemy.mfx.weaken.taken / 100;
    return hurt(enemy, value);
  }
  const keep = (actor, key, t, data = {}) => addFx(actor, key, Math.max(actor.mfx?.[key]?.t || 0, t), data);
  function freeze(enemy, t) {
    keep(enemy, 'freeze', t);
    FX.flash(enemy.x, enemy.y - BODY, 2, C.ice, 0.35);
    emit(enemy.x, enemy.y - BODY, { color: C.ice, count: 8, speed: 2.5, size: 0.3, up: 2, shape: SpellFX.SHAPE.star });
  }
  function addDot(enemy, spell, n) {
    if (!enemy.alive || !spell.dot) return;
    addFx(enemy, `dot:${spell.key}`, spell.dot.durationSeconds, { dps: n.dotDps, clock: 0, school: spell.school, spread: !!spell.spreadOnDeath, spell: spell.key });
  }
  function weaken(enemy, w) {
    if (!enemy.alive) return;
    keep(enemy, 'weaken', w.durationSeconds, { dealt: w.damageDealtPercent, taken: w.damageTakenPercent, armor: w.armorPercent });
  }
  // Os efeitos que vêm junto com o dano: lentidão, atordoar, congelar, enfraquecer, queimar, empurrar.
  function riders(enemy, spell, n, from) {
    if (!enemy.alive || enemy.ghost) return;
    if (spell.slow) keep(enemy, 'slow', spell.slow.durationSeconds, { v: spell.slow.percent });
    if (spell.stunSeconds) keep(enemy, 'stun', spell.stunSeconds);
    if (spell.freezeSeconds && (!spell.freezeChancePercent || Math.random() * 100 < spell.freezeChancePercent)) freeze(enemy, spell.freezeSeconds);
    if (spell.weaken) weaken(enemy, spell.weaken);
    if (spell.dot) addDot(enemy, spell, n);
    if (spell.knockback && from) push(enemy, from.x, from.y, spell.knockback);
  }
  // Praga: quem morre infectado passa para o vizinho mais perto.
  function spreadPlague(enemy) {
    const f = enemy.mfx || {};
    Object.keys(f).filter(key => key.startsWith('dot:') && f[key].spread).forEach(key => {
      const next = (state.bandits || []).filter(b => b.alive && b !== enemy && !b.mfx?.[key] && (b.mapId || 'city') === (enemy.mapId || 'city'))
        .sort((a, b) => dist(a, enemy) - dist(b, enemy))[0];
      if (!next || dist(next, enemy) > 8) return;
      const spell = fieldByKey[f[key].spell];
      addFx(next, key, spell.dot.durationSeconds, { ...f[key], clock: 0, t: spell.dot.durationSeconds });
      FX.link({ x: enemy.x, y: enemy.y - BODY }, { x: next.x, y: next.y - BODY }, C.poison, 0.6, 0, 0.5);
      emit(next.x, next.y - BODY, { color: C.poison, count: 12, speed: 2, size: 0.4, up: 2 });
    });
  }
  const healFx = (a, big = 1) => {
    FX.beam(a.x, a.y, 0.7 * big, 9 * big, C.heal, 0.7);
    FX.sigil(a.x, a.y, 1.6 * big, C.heal, 0.9, 6);
    emit(a.x, a.y - BODY, { color: C.heal, count: Math.round(14 * big), speed: 1.2, size: 0.4, up: 4, ring: 0.8, shape: SpellFX.SHAPE.wisp });
  };
  function healUnit(a, amount, big = 1) { heal(a, amount); healFx(a, big); }
  function addHot(a, spell, n) { if (spell.hot) addFx(a, `hot:${spell.key}`, spell.hot.durationSeconds, { hps: n.hotHps }); }

  // ----- Impactos por escola -----
  function lightningStrike(x, y, width = 1.4, color = C.lightning) {
    const sx = x + rand(-5, 5), sy = y - 46;
    FX.custom(0.32, (k, t) => {
      const a = k < 0.15 ? 1 : 1 - (k - 0.15) / 0.85;
      D.segment('sky', sx, sy, x, y - 0.4, color, a, 2, width, t * 8);
      D.segment('sky', (sx + x) / 2, (sy + y) / 2, x + rand(-3, 3), y - rand(6, 12), color, a * 0.6, 2, width * 0.5, t * 5 + 3);
    });
    FX.flash(x, y - 2, 4.5, C.white, 0.25);
    FX.shockwave(x, y, 3, color, 0.4);
    FX.cracks(x, y, 2.2, color, 0.6);
    emit(x, y, { color: C.white, count: 16, speed: 7, size: 0.25, up: 3, gravity: 8, life: 0.5, shape: SpellFX.SHAPE.star });
  }
  function explode(x, y, r, school) {
    const color = SCHOOL_COLOR[school] || C.gold;
    FX.flash(x, y - r * 0.3, r * 1.3, school === 'fogo' ? C.flame : color, 0.35);
    FX.shockwave(x, y, r, color, 0.55);
    FX.shockwave(x, y, r * 0.6, C.white, 0.35);
    if (school === 'fogo') {
      FX.cracks(x, y, r * 0.8, C.ember, 1.0);
      emit(x, y - 1, { color: C.flame, count: 40, speed: r * 2.5, size: 0.45, up: 5, gravity: 7, life: 0.8 });
      emit(x, y - 1, { color: C.fire, count: 26, speed: r * 1.5, size: 0.7, up: 3, life: 0.6 });
      FX.custom(1.4, k => D.darkZone(x, y - 1 - k * 3, r * (0.6 + k * 0.5), C.smoke, 0.45 * (1 - k)));
    } else if (school === 'gelo') {
      emit(x, y - 1, { color: C.ice, count: 36, speed: r * 2.4, size: 0.35, up: 3, gravity: 6, life: 0.8, shape: SpellFX.SHAPE.star });
      FX.custom(0.9, k => D.zone(x, y, r, C.ice, 0.5 * (1 - k), 0.06, 8, 0));
    } else if (school === 'arcano') {
      emit(x, y - 1, { color: C.arcane, count: 30, speed: r * 2.2, size: 0.35, up: 2, life: 0.6, shape: SpellFX.SHAPE.star });
      FX.sigil(x, y, r, C.arcane, 0.8, 7);
    } else if (school === 'veneno') {
      emit(x, y - 1, { color: C.poison, count: 30, speed: r * 1.6, size: 0.5, up: 2.5, gravity: 4, life: 0.9 });
    } else if (school === 'sombra') {
      FX.custom(1, k => D.darkZone(x, y, r * (0.5 + k * 0.6), C.shadow, 0.6 * (1 - k)));
      emit(x, y - 1, { color: C.violet, count: 20, speed: r, size: 0.5, up: 3, life: 1, shape: SpellFX.SHAPE.wisp });
    } else if (school === 'sagrado') {
      FX.beam(x, y, r * 0.5, 22, C.holy, 0.7);
      emit(x, y - 1, { color: C.holy, count: 26, speed: r * 2, size: 0.4, up: 3, life: 0.7, shape: SpellFX.SHAPE.star });
    }
  }
  // Projétil que cai do céu até um alvo (ator ou ponto) e chama onHit quando chega.
  function launch(o) {
    const end = o.target ? { x: o.target.x, y: o.target.y - BODY } : { x: o.x, y: o.y };
    const from = o.from || { x: end.x - 9, y: end.y - 34 };
    rt.projs.push({ ...o, sx: from.x, sy: from.y, ex: end.x, ey: end.y, cx: o.curve ? (from.x + end.x) / 2 + o.curve.x : (from.x + end.x) / 2, cy: o.curve ? (from.y + end.y) / 2 + o.curve.y : (from.y + end.y) / 2,
      t: 0, trail: [], map: mapKey(), color: o.color || C.gold, size: o.size || 0.8 });
  }
  const later = (t, fn) => rt.timers.push({ t, fn, map: mapKey() });

  // ----- Conjuração -----
  function fieldCanCast(spell) {
    if (!fieldUnlocked(spell)) return `${spell.name}: chega no nível ${spell.unlockLevel}.`;
    const m = ms();
    if ((m.cd[spell.key] || 0) > 0) return `${spell.name}: em recarga (${Math.ceil(m.cd[spell.key])} s).`;
    if (m.mp < spell.manaCost) return `${spell.name}: falta mana (${spell.manaCost} MP).`;
    return null;
  }
  function fieldPress(key) {
    if (!active()) return;
    const spell = fieldByKey[key];
    if (!spell) return;
    const reason = fieldCanCast(spell);
    if (reason) { say(reason); return; }
    if (spell.target === 'global') { fieldCast(spell, null); return; }
    rt.targeting = rt.targeting?.key === key ? null : { key, field: true };
    refreshCursor();
  }
  function fieldClick(point) {
    const spell = fieldByKey[rt.targeting.key];
    // Atira onde clicar: se tiver alguém perto, pega nele; se não, a magia sai no chão do mesmo jeito.
    // A magia continua escolhida para o próximo tiro, até Esc ou clique direito.
    let target = point;
    if (spell.target === 'inimigo') target = nearest(fEnemies(), point.x, point.y, 5) || ghostAt(point);
    else if (spell.target === 'aliado') target = nearest(fAllies(), point.x, point.y, 5) || ghostAt(point);
    const reason = fieldCanCast(spell);
    if (reason) { say(reason); return; }
    fieldCast(spell, target);
  }
  function fieldCast(spell, target) {
    const m = ms();
    m.mp -= spell.manaCost;
    m.cd[spell.key] = spell.cooldownSeconds;
    const n = fieldNums(spell);
    const run = MECHANIC[spell.mechanic];
    if (run) run(spell, n, target);
    const sig = SIGNATURE[spell.key];
    const at = target || rt.hover || { x: m.x, y: m.y };
    if (sig) later(sig[0], () => sig[1](at.x, at.y, spell.radius || 2.5, spell));
    renderPanel(true);
  }

  // ----- Assinatura visual de cada magia de campo -----
  // Cada uma tem um desenho só dela, no ponto onde cai, por cima do efeito base da mecânica.
  // [atraso até o impacto em segundos, desenho(x, y, raio)]
  const S = SpellFX.SHAPE;
  const ringOf = (x, y, r, n, fn) => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; fn(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.9, a, i); } };
  const SIGNATURE = {
    // 1. Fagulha: redemoinho de brasas que sobe em espiral.
    fagulha: [0.38, (x, y) => {
      FX.custom(0.9, (k, t) => { for (let i = 0; i < 6; i++) { const a = t * 9 + i * 1.05; D.glow('sky', x + Math.cos(a) * (1.2 - k), y - 1 - k * 4 + Math.sin(a) * 0.4, 0.45, i % 2 ? C.flame : C.ember, 1 - k); } });
      emit(x, y - 0.5, { color: C.flame, count: 26, speed: 3, size: 0.3, up: 6, gravity: 5, life: 0.9, shape: S.star });
      FX.custom(0.7, (k, t) => D.wisp(x, y - 1.6, 0.9, 2.6 * (1 - k * 0.6), C.fire, 1 - k, t));
    }],
    // 2. Toque Restaurador: pétalas verdes que sobem num anel de folhas.
    'toque-restaurador': [0, (x, y) => {
      FX.sigil(x, y, 2.2, C.emerald, 1.2, 5, 'ground', 0.6);
      FX.custom(1.2, (k, t) => ringOf(x, y - k * 5, 1.4 * (1 - k * 0.5), 5, (px, py, a) => D.wisp(px, py - 1, 0.35, 0.8, C.heal, 1 - k, a + t)));
      emit(x, y - 1, { color: C.white, count: 12, speed: 0.6, size: 0.25, up: 5, life: 1.2, shape: S.star });
    }],
    // 3. Míssil Mágico: runa arcana que gira e estoura em estrelas.
    'missil-magico': [0.5, (x, y) => {
      FX.custom(0.8, (k, t) => D.rune(x, y - BODY, 1.6 * (1 + k), C.arcane, 1 - k, t * 4));
      emit(x, y - BODY, { color: C.arcane, count: 24, speed: 6, size: 0.35, up: 1, life: 0.6, shape: S.star });
      FX.shockwave(x, y, 2, C.violet, 0.5);
    }],
    // 4. Dardo Venenoso: respingo verde que pinga e deixa poça borbulhando.
    'dardo-venenoso': [0.3, (x, y) => {
      emit(x, y - BODY, { color: C.poison, count: 22, speed: 4, size: 0.35, up: 4, gravity: 12, life: 0.8 });
      FX.custom(2.2, (k, t) => { D.zone(x, y, 1.6, C.toxic, 0.7 * (1 - k), 0.08, 9, t * 0.3); if (Math.random() < 0.25) emit(x + rand(-1.2, 1.2), y + rand(-0.6, 0.6), { color: C.poison, count: 1, speed: 0.1, size: 0.3, up: 1.5, life: 0.5 }); });
    }],
    // 5. Bola de Fogo: anel de fogo no chão, chão queimado e coluna de fumaça.
    'bola-de-fogo': [0.55, (x, y, r) => {
      FX.custom(1.0, (k, t) => ringOf(x, y, r * (0.5 + k * 0.6), 10, (px, py, a) => D.wisp(px, py - 1, 0.6, 2.2 * (1 - k), C.fire, 1 - k, a + t)));
      FX.custom(2.6, k => D.darkZone(x, y - k * 9, r * (0.5 + k), C.smoke, 0.5 * (1 - k)));
      FX.custom(3, k => D.zone(x, y, r * 0.8, C.ember, 0.35 * (1 - k), 0.1, 10, 0));
    }],
    // 6. Fraqueza: correntes de runas violetas que descem e prendem o chão.
    fraqueza: [0, (x, y, r) => {
      FX.custom(1.4, (k, t) => ringOf(x, y, r * 0.8, 6, (px, py, a) => D.rune(px, py - 6 * (1 - Math.min(1, k * 2)), 0.9, C.violet, 1 - k, a + t)));
      FX.custom(1.4, (k, t) => D.ring(x, y, r * 0.8, C.darkViolet, 0.9 * (1 - k), 0.06, 6, t * 0.4));
    }],
    // 7. Cadeia de Relâmpagos: estrela elétrica com raios em leque saindo do alvo.
    'cadeia-de-relampagos': [0, (x, y) => {
      FX.custom(0.5, (k, t) => ringOf(x, y - BODY, 0, 6, (px, py, a) => D.segment('sky', px, py, px + Math.cos(a) * 4, py + Math.sin(a) * 2.5, C.lightning, 1 - k, 2, 0.4, t * 9 + a)));
      FX.custom(0.4, (k, t) => D.star(x, y - BODY, 2.2 * (1 - k * 0.5), C.white, 1 - k, t * 6));
    }],
    // 8. Nevasca: floco de neve gigante no chão e neve caindo em espiral.
    nevasca: [0, (x, y, r) => {
      FX.custom(2.5, (k, t) => D.sigil('ground', x, y, r * 0.9, C.ice, 0.8 * Math.min(1, (1 - k) * 3), 6, t * 0.3));
      FX.custom(2.5, (k, t) => { for (let i = 0; i < 3; i++) emit(x + rand(-r, r), y + rand(-r, r) * 0.8, { color: C.white, count: 1, h: 14, up: -4, speed: 1, angle: 0.5, spread: 0.4, size: 0.25, life: 1.2, drag: 0.5, shape: S.star }); });
    }],
    // 9. Onda de Cura: três anéis verdes que se abrem um depois do outro.
    'onda-de-cura': [0, (x, y, r) => {
      [0, 0.25, 0.5].forEach(d => later(d, () => FX.shockwave(x, y, r, C.heal, 0.8)));
      FX.custom(1.3, (k, t) => D.zone(x, y, r * ease3(k), C.emerald, 0.35 * (1 - k), 0.04, 5, t));
      emit(x, y, { color: C.heal, count: 30, ring: r * 0.7, speed: 0.4, size: 0.35, up: 4, life: 1.2, shape: S.wisp });
    }],
    // 10. Nuvem Tóxica: bolhas verdes que estouram na nuvem.
    'nuvem-toxica': [0, (x, y, r) => {
      FX.custom(3, (k, t) => { if (Math.random() < 0.5) { const p = inDisk(x, y, r * 0.8); FX.custom(0.5, kk => D.ring(p.x, p.y - 0.5, 0.5 + kk * 0.6, C.poison, 1 - kk, 0.2, 0, 0)); } });
    }],
    // 11. Lança de Gelo: cristais pontudos que brotam do chão em volta do alvo.
    'lanca-de-gelo': [0.3, (x, y) => {
      ringOf(x, y, 1.3, 7, (px, py, a, i) => later(i * 0.03, () => FX.custom(1.1, k => D.beam(px, py, 0.35, 2.2 * Math.min(1, k * 6) * (1 - k * 0.3), C.ice, 1 - k * k, a))));
      FX.custom(1.1, k => D.hex(x, y - BODY, 2, C.frost, 1 - k, x));
    }],
    // 12. Relâmpago: o chão racha em estrela e solta faíscas por um tempo.
    relampago: [0, (x, y, r) => {
      FX.custom(1.2, (k, t) => { D.sigil('ground', x, y, r, C.lightning, 1 - k, 4, t * 2); if (Math.random() < 0.4) { const p = inDisk(x, y, r); D.segment('sky', p.x, p.y, p.x + rand(-1, 1), p.y - rand(1, 2.5), C.white, 1 - k, 2, 0.2, t * 9); } });
    }],
    // 13. Maldição da Carne: gotas de sangue que escorrem e uma caveira de runa.
    'maldicao-da-carne': [0.3, (x, y) => {
      FX.custom(1.6, (k, t) => D.rune(x, y - HEAD - 1.4, 1.3, C.blood, Math.min(1, (1 - k) * 2), Math.sin(t * 2) * 0.3));
      emit(x, y - BODY, { color: C.blood, count: 18, speed: 1.2, size: 0.3, up: 1, gravity: 10, life: 1, shape: S.wisp });
      FX.custom(1.6, k => D.darkZone(x, y, 1.6, C.blood, 0.5 * (1 - k)));
    }],
    // 14. Regeneração: espiral de folhas subindo e um broto de luz.
    regeneracao: [0, (x, y, r) => {
      FX.custom(2, (k, t) => { for (let i = 0; i < 8; i++) { const a = t * 3 + i * 0.785, h = ((i / 8 + k) % 1) * 7; D.wisp(x + Math.cos(a) * r * 0.5, y - h + Math.sin(a) * r * 0.25, 0.3, 0.6, C.heal, 1 - k, i); } });
      FX.beam(x, y, 0.5, 7, C.emerald, 1.4);
    }],
    // 15. Meteoro: cratera com pedras voando e brasa no fundo.
    meteoro: [1.0, (x, y, r) => {
      emit(x, y - 0.5, { color: C.smoke, count: 18, speed: r * 2.5, size: 0.5, up: 7, gravity: 14, life: 1, shape: S.glow, layer: 'sky' });
      emit(x, y - 0.5, { color: C.ember, count: 24, speed: r * 3, size: 0.25, up: 9, gravity: 16, life: 1.1, shape: S.star });
      FX.custom(3, k => D.zone(x, y, r * 0.55, C.fire, 0.55 * (1 - k), 0.12, 12, 0));
    }],
    // 16. Dreno de Vida: redemoinho vermelho que puxa para dentro.
    'dreno-de-vida': [0, (x, y) => {
      FX.custom(1.1, (k, t) => { for (let i = 0; i < 10; i++) { const a = -t * 7 + i * 0.63, d = 3 * (1 - k) + 0.3; D.glow('sky', x + Math.cos(a) * d, y - BODY + Math.sin(a) * d * 0.5, 0.35, C.crimson, 1 - k * 0.5); } });
      FX.custom(1.1, (k, t) => D.ring(x, y, 3 * (1 - k) + 0.4, C.blood, 0.8, 0.08, 0, t));
    }],
    // 17. Chuva de Fogo: círculo de fogo no chão e gotas de fogo caindo.
    'chuva-de-fogo': [0, (x, y, r) => {
      FX.custom(2.4, (k, t) => D.sigil('ground', x, y, r, C.fire, 0.7 * Math.min(1, (1 - k) * 3), 8, t * 0.5));
      FX.custom(2.4, () => { if (Math.random() < 0.6) { const p = inDisk(x, y, r); emit(p.x, p.y, { color: C.flame, count: 1, h: 16, up: -10, speed: 0.4, size: 0.4, life: 0.9, drag: 0.2, shape: S.wisp }); } });
    }],
    // 18. Ruína: rachaduras violetas e pedras de runa que sobem e caem.
    ruina: [0, (x, y, r) => {
      FX.cracks(x, y, r, C.violet, 1.6);
      ringOf(x, y, r * 0.6, 5, (px, py, a, i) => later(i * 0.08, () => FX.custom(1.2, k => D.rune(px, py - Math.sin(k * Math.PI) * 4, 0.9, C.darkViolet, 1 - k, a))));
    }],
    // 19. Tempestade de Raios: nuvem escura com clarões.
    'tempestade-de-raios': [0, (x, y, r) => {
      FX.custom(2.8, (k, t) => { D.darkZone(x, y - 14, r * 1.3, C.shadow, 0.7 * Math.min(1, (1 - k) * 3)); if (Math.sin(t * 17) > 0.92) D.glow('sky', x + rand(-r, r), y - 14, r * 0.7, C.lightning, 0.6); });
    }],
    // 20. Ressurreição: coluna dourada, coroa e penas caindo.
    ressurreicao: [0, (x, y) => {
      FX.beam(x, y, 1.6, 22, C.holy, 1.8);
      FX.custom(1.8, (k, t) => D.crown(x, y - 10 - k * 3, 2, C.gold, Math.min(1, (1 - k) * 2)));
      FX.custom(1.8, () => { if (Math.random() < 0.5) emit(x + rand(-3, 3), y + rand(-1, 1), { color: C.paleGold, count: 1, h: 12, up: -2, speed: 0.5, size: 0.35, life: 1.4, drag: 1, shape: S.wisp }); });
    }],
    // 21. Praga: enxame de moscas pretas rodando.
    praga: [0, (x, y, r) => {
      FX.custom(2.4, (k, t) => { for (let i = 0; i < 24; i++) { const a = t * (2 + i % 5) + i * 2.4, d = r * (0.3 + (i % 7) / 9); D.glow('sky', x + Math.cos(a) * d, y - 2 - Math.sin(a * 1.7) * 1.2 + Math.sin(a) * d * 0.4, 0.18, C.toxic, 1 - k); } });
    }],
    // 22. Explosão Solar: sol branco-dourado com raios girando.
    'explosao-solar': [0.55, (x, y, r) => {
      FX.custom(1.1, (k, t) => { D.star(x, y - 3, r * 1.4 * (0.6 + k * 0.6), C.paleGold, 1 - k, t * 1.5); D.glow('sky', x, y - 3, r * 1.2 * (1 - k * 0.5), C.white, 1 - k); });
      FX.shockwave(x, y, r * 1.5, C.gold, 0.8);
    }],
    // 23. Enxame de Mísseis: sinete arcano de oito pontas no alvo.
    'enxame-de-misseis': [0.5, (x, y) => {
      FX.sigil(x, y, 3, C.arcane, 1.3, 8, 'ground', 2);
      FX.custom(1.3, (k, t) => ringOf(x, y - BODY, 2.5 * (1 - k), 8, (px, py, a) => D.star(px, py, 0.5, C.violet, 1 - k, t * 5 + a)));
    }],
    // 24. Fonte da Vida: jorro de água e luz que sobe e cai.
    'fonte-da-vida': [0, (x, y, r) => {
      FX.custom(2.2, () => emit(x, y - 0.5, { color: Math.random() < 0.5 ? C.heal : C.frost, count: 3, speed: r * 0.5, size: 0.3, up: 9, gravity: 10, life: 1.2 }));
      FX.custom(2.2, (k, t) => D.ring(x, y, r * 0.6, C.emerald, 0.7 * (1 - k), 0.05, 12, t * 0.3));
    }],
    // 25. Inferno: colunas de fogo que brotam em volta.
    inferno: [0, (x, y, r) => {
      ringOf(x, y, r * 0.7, 7, (px, py, a, i) => later(i * 0.1, () => FX.custom(1.4, (k, t) => D.wisp(px, py - 2, 1, 4.5 * Math.sin(k * Math.PI), i % 2 ? C.flame : C.fire, 1, a + t))));
      FX.custom(2, (k, t) => D.wisp(x, y - 3, 1.8, 6 * Math.sin(k * Math.PI), C.fire, 1, t));
    }],
    // 26. Zero Absoluto: domo de gelo que congela e racha.
    'zero-absoluto': [0, (x, y, r) => {
      FX.custom(1.8, (k, t) => D.dome(x, y, r * Math.min(1, k * 4), C.ice, 0.7 * (1 - k), 1, t));
      later(0.9, () => FX.cracks(x, y, r, C.white, 1.2));
    }],
    // 27. Fúria dos Céus: três colunas de luz descendo em sequência.
    'furia-dos-ceus': [0, (x, y, r) => {
      [0, 0.18, 0.36].forEach((d, i) => later(d, () => { const p = inDisk(x, y, r * 0.6); FX.beam(p.x, p.y, 1.2, 26, i === 1 ? C.white : C.lightning, 0.6); FX.shockwave(p.x, p.y, 2.5, C.lightning, 0.5); }));
    }],
    // 28. Eclipse: disco escuro no céu com coroa de luz.
    eclipse: [0, (x, y) => {
      FX.custom(3, (k, t) => { const a = Math.min(1, k * 4) * Math.min(1, (1 - k) * 3); D.darkZone(x, y - 18, 7, C.shadow, 0.95 * a); D.ring(x, y - 18, 7.4, C.gold, 0.8 * a, 0.08, 0, t * 0.2); D.glow('sky', x, y - 18, 11, C.paleGold, 0.25 * a); });
    }],
    // 29. Cataclismo: chão rachando em lava e rochas subindo.
    cataclismo: [1.0, (x, y, r) => {
      FX.cracks(x, y, r * 1.4, C.ember, 2.5);
      FX.custom(3.5, k => D.zone(x, y, r * 1.1, C.fire, 0.5 * (1 - k), 0.15, 14, 0));
      ringOf(x, y, r * 0.8, 9, (px, py, a, i) => later(i * 0.06, () => emit(px, py, { color: C.smoke, count: 4, speed: 1, size: 0.6, up: 10, gravity: 18, life: 1.2 })));
    }],
    // 30. Milagre: coroa de luz enorme e estrelas caindo do céu.
    milagre: [0, (x, y) => {
      FX.custom(2.6, (k, t) => { const a = Math.min(1, k * 4) * Math.min(1, (1 - k) * 2); D.crown(x, y - 16, 4, C.gold, a); D.glow('sky', x, y - 16, 9, C.holy, 0.4 * a); });
      FX.custom(2.6, () => { if (Math.random() < 0.7) emit(x + rand(-10, 10), y + rand(-5, 5), { color: C.paleGold, count: 1, h: 20, up: -6, speed: 0.3, size: 0.3, life: 1.2, drag: 0.4, shape: S.star }); });
    }],
  };
  const ease3 = k => 1 - Math.pow(1 - k, 3);

  const MECHANIC = {
    // Projétil único num inimigo.
    bolt(spell, n, enemy) {
      const color = SCHOOL_COLOR[spell.school];
      const look = { fogo: { size: 0.9, speed: 0.38 }, gelo: { size: 0.7, speed: 0.3 }, raio: null, sombra: { size: 1, speed: 0.45 }, sagrado: { size: 0.8, speed: 0.25 } }[spell.school];
      const land = () => {
        hit(enemy, n.dano, spell);
        riders(enemy, spell, n, null);
        explode(enemy.x, enemy.y, 1.6, spell.school);
        if (spell.school === 'sombra') FX.custom(0.7, k => D.rune(enemy.x, enemy.y - HEAD - 0.8, 1.1 * (1 - k * 0.3), C.violet, 1 - k, k * 2));
      };
      if (spell.school === 'raio') { lightningStrike(enemy.x, enemy.y, 1.1); land(); return; }
      launch({ target: enemy, dur: look.speed, color, size: look.size, school: spell.school, onHit: land, shard: spell.school === 'gelo' });
    },
    // Vários mísseis curvos divididos entre os inimigos perto do alvo.
    missiles(spell, n, enemy) {
      const pool = near(fEnemies(), enemy.x, enemy.y, spell.radius).sort((a, b) => dist(a, enemy) - dist(b, enemy));
      if (!pool.includes(enemy)) pool.unshift(enemy);
      for (let i = 0; i < spell.missiles; i++) {
        const target = pool[i % pool.length];
        later(i * 0.07, () => {
          if (!target.alive) return;
          const side = i % 2 ? 1 : -1;
          launch({ target, dur: 0.45 + Math.random() * 0.15, color: C.arcane, size: 0.55, school: 'arcano', from: { x: target.x + side * rand(6, 12), y: target.y - rand(22, 30) },
            curve: { x: side * rand(4, 9), y: rand(-4, 4) }, onHit: () => { hit(target, n.dano, spell); FX.flash(target.x, target.y - BODY, 1.6, C.arcane, 0.25); emit(target.x, target.y - BODY, { color: C.arcane, count: 6, speed: 3, size: 0.3, up: 1.5, shape: SpellFX.SHAPE.star }); } });
        });
      }
    },
    // Dano contínuo num alvo só.
    dot(spell, n, enemy) {
      const color = SCHOOL_COLOR[spell.school];
      launch({ target: enemy, dur: 0.3, color, size: 0.5, school: spell.school, onHit: () => {
        riders(enemy, spell, n, null);
        emit(enemy.x, enemy.y - BODY, { color, count: 16, speed: 2, size: 0.45, up: 2.5, gravity: 2 });
        FX.flash(enemy.x, enemy.y - BODY, 1.6, color, 0.3);
      } });
    },
    // Dano contínuo em todos na área.
    dotArea(spell, n, p) {
      const color = SCHOOL_COLOR[spell.school];
      near(fEnemies(), p.x, p.y, spell.radius).forEach(enemy => { riders(enemy, spell, n, null); FX.link({ x: p.x, y: p.y - 1 }, { x: enemy.x, y: enemy.y - BODY }, color, 0.5, 0, 0.3); });
      FX.custom(1.3, k => { D.zone(p.x, p.y, spell.radius * (0.4 + k * 0.6), color, 0.55 * (1 - k), 0.05, 5, k); D.darkZone(p.x, p.y, spell.radius, spell.school === 'veneno' ? C.toxic : C.shadow, 0.4 * (1 - k)); });
      emit(p.x, p.y, { color, count: 40, ring: spell.radius * 0.6, speed: 1, size: 0.5, up: 2, life: 1.2 });
    },
    // Bola que cai no ponto e explode.
    ball(spell, n, p) {
      const big = spell.radius / 3.5;
      launch({ x: p.x, y: p.y, dur: 0.55, color: C.fire, size: 1.1 * big, school: 'fogo', from: { x: p.x - 16, y: p.y - 34 }, curve: { x: -3, y: -4 }, onHit: () => {
        near(fEnemies(), p.x, p.y, spell.radius).forEach(enemy => { hit(enemy, n.dano, spell); riders(enemy, spell, n, p); });
        explode(p.x, p.y, spell.radius, 'fogo');
      } });
    },
    // Relâmpago que salta de inimigo em inimigo.
    chain(spell, n, first) {
      const done = new Set();
      let current = first, prev = null, damage = n.dano;
      for (let i = 0; i <= spell.jumps && current; i++) {
        const target = current, from = prev, amount = damage;
        later(i * 0.09, () => {
          if (!target.alive) return;
          if (from) {
            FX.custom(0.3, (k, t) => D.segment('sky', from.x, from.y - BODY, target.x, target.y - BODY, C.lightning, 1 - k, 2, 0.9, t * 9));
          } else lightningStrike(target.x, target.y, 1.1);
          FX.flash(target.x, target.y - BODY, 2, C.white, 0.2);
          hit(target, amount, spell);
          riders(target, spell, n, null);
        });
        done.add(target);
        prev = { x: target.x, y: target.y };
        damage *= 1 - spell.falloffPercent / 100;
        current = fEnemies().filter(e => !done.has(e) && dist(e, target) <= spell.jumpRange).sort((a, b) => dist(a, target) - dist(b, target))[0];
      }
    },
    // Raio(s) do céu numa área.
    strike(spell, n, p) {
      const holy = spell.school === 'sagrado';
      for (let i = 0; i < spell.strikes; i++) {
        const at = spell.strikes > 1 ? inDisk(p.x, p.y, spell.radius) : p;
        const r = spell.strikeRadius || spell.radius;
        later(spell.strikes > 1 ? i * 0.16 + Math.random() * 0.08 : 0, () => {
          if (holy) {
            FX.custom(0.35, k => D.beam(at.x, at.y, r * 0.6 * (1 - k * 0.5), 28, C.holy, 1 - k, 2));
            FX.flash(at.x, at.y - 2, r * 1.4, C.holy, 0.35);
            FX.shockwave(at.x, at.y, r, C.gold, 0.5);
            FX.cracks(at.x, at.y, r, C.gold, 1);
            emit(at.x, at.y, { color: C.holy, count: 30, speed: r * 2.6, size: 0.4, up: 3, gravity: 5, shape: SpellFX.SHAPE.star });
          } else lightningStrike(at.x, at.y, 1.4);
          near(fEnemies(), at.x, at.y, r).forEach(enemy => { hit(enemy, n.dano, spell); riders(enemy, spell, n, at); });
        });
      }
    },
    // Explosão no ponto, sem projétil.
    nova(spell, n, p) {
      const color = SCHOOL_COLOR[spell.school];
      FX.shockwave(p.x, p.y, spell.radius, color, 0.7);
      FX.shockwave(p.x, p.y, spell.radius * 0.7, C.white, 0.5);
      FX.flash(p.x, p.y - 2, spell.radius, color, 0.4);
      FX.sigil(p.x, p.y, spell.radius, color, 1, 8);
      if (spell.school === 'gelo') {
        FX.custom(1.6, k => D.zone(p.x, p.y, spell.radius, C.ice, 0.5 * (1 - k), 0.05, 7, 0));
        emit(p.x, p.y, { color: C.ice, count: 60, ring: spell.radius * 0.3, speed: spell.radius * 2.5, size: 0.4, up: 2.5, gravity: 4, shape: SpellFX.SHAPE.star });
      } else emit(p.x, p.y, { color, count: 40, speed: spell.radius * 2.6, size: 0.4, up: 2, shape: SpellFX.SHAPE.star });
      near(fEnemies(), p.x, p.y, spell.radius).forEach(enemy => { hit(enemy, n.dano, spell); riders(enemy, spell, n, p); });
    },
    // Enfraquecer todos na área.
    weaken(spell, n, p) {
      FX.sigil(p.x, p.y, spell.radius, C.darkViolet, 1.4, 5, 'ground', -0.6);
      FX.shockwave(p.x, p.y, spell.radius, C.violet, 0.7);
      FX.custom(1.4, k => D.darkZone(p.x, p.y, spell.radius * (0.6 + 0.4 * k), C.shadow, 0.55 * (1 - k)));
      near(fEnemies(), p.x, p.y, spell.radius).forEach(enemy => {
        riders(enemy, spell, n, null);
        FX.link({ x: p.x, y: p.y - 6 }, { x: enemy.x, y: enemy.y - HEAD }, C.violet, 0.6, 0, 0.3);
        emit(enemy.x, enemy.y - BODY, { color: C.violet, count: 10, speed: 1, size: 0.45, up: -1, gravity: 2, shape: SpellFX.SHAPE.wisp });
      });
    },
    // Enfraquecer todos os inimigos do mapa.
    weakenAll(spell, n) {
      fEnemies().forEach(enemy => {
        riders(enemy, spell, n, null);
        FX.custom(1.6, k => { D.darkZone(enemy.x, enemy.y, 6 * (0.5 + k), C.shadow, 0.6 * (1 - k)); D.rune(enemy.x, enemy.y - HEAD - 1, 1.2, C.violet, 1 - k, k * 3); });
      });
      say('O sol apagou. Os inimigos ficaram com medo do escuro.');
    },
    // Arranca vida e cura quem está perto.
    drain(spell, n, target) {
      const victims = spell.drainArea ? near(fEnemies(), target.x, target.y, spell.radius) : [target];
      let total = 0;
      victims.forEach(enemy => {
        total += hit(enemy, n.dano, spell);
        FX.custom(0.8, (k, t) => D.segment('sky', enemy.x, enemy.y - BODY, enemy.x, enemy.y - BODY - 5 * k, C.crimson, 1 - k, 0, 0.5, t));
        emit(enemy.x, enemy.y - BODY, { color: C.crimson, count: 12, speed: 2, size: 0.4, up: 3 });
      });
      const center = spell.drainArea ? target : { x: target.x, y: target.y };
      const allies = near(fAllies(), center.x, center.y, spell.radius);
      const each = allies.length ? total * spell.drainHealPercent / 100 / (spell.drainArea ? allies.length : 1) : 0;
      allies.forEach(ally => {
        heal(ally, each);
        const src = victims[0] || center;
        FX.link({ x: src.x, y: src.y - BODY }, { x: ally.x, y: ally.y - BODY }, C.crimson, 0.6, 0, 0.45);
        emit(ally.x, ally.y - BODY, { color: C.heal, count: 8, speed: 1, size: 0.35, up: 3, shape: SpellFX.SHAPE.wisp });
      });
    },
    // Zona que dura: nevasca, chuva de fogo, tempestade.
    storm(spell, n, p) {
      rt.fzones.push({ spell, n, x: p.x, y: p.y, r: spell.radius, t: spell.durationSeconds, max: spell.durationSeconds, clock: 0.15, map: mapKey(), seed: Math.random() * 10 });
      FX.shockwave(p.x, p.y, spell.radius, SCHOOL_COLOR[spell.school], 0.6);
    },
    // Nuvem no chão que fere quem estiver dentro.
    cloud(spell, n, p) {
      rt.fzones.push({ spell, n, x: p.x, y: p.y, r: spell.radius, t: spell.durationSeconds, max: spell.durationSeconds, clock: 0, map: mapKey(), seed: Math.random() * 10, cloud: true });
      FX.shockwave(p.x, p.y, spell.radius, SCHOOL_COLOR[spell.school], 0.6);
      emit(p.x, p.y, { color: SCHOOL_COLOR[spell.school], count: 30, ring: spell.radius * 0.5, speed: 2, size: 0.6, up: 2, life: 1 });
    },
    // Meteoro: aviso no chão, a pedra cai, explode e deixa o chão queimando.
    meteor(spell, n, p) {
      const r = spell.radius;
      FX.custom(spell.delaySeconds, (k, t) => {
        D.ring(p.x, p.y, r * (0.25 + 0.75 * k), C.crimson, 0.5 + 0.5 * k, 0.05, 12, t * 0.3);
        D.zone(p.x, p.y, r, C.fire, 0.25 * k, 0.03, 6, t * 0.2);
      });
      later(Math.max(0, spell.delaySeconds - 0.5), () => launch({ x: p.x, y: p.y, dur: 0.5, color: C.fire, size: 1.2 + r * 0.25, school: 'fogo', meteor: true, from: { x: p.x - 22, y: p.y - 60 }, onHit: () => {
        near(fEnemies(), p.x, p.y, r).forEach(enemy => { hit(enemy, n.dano, spell); riders(enemy, spell, n, p); });
        explode(p.x, p.y, r, 'fogo');
        FX.shockwave(p.x, p.y, r * 1.5, C.ember, 0.9);
        FX.flash(p.x, p.y - 4, r * 2, C.white, 0.3);
        rt.fzones.push({ spell, n, x: p.x, y: p.y, r: r * 0.8, t: spell.durationSeconds, max: spell.durationSeconds, clock: 0, map: mapKey(), seed: Math.random() * 10, cloud: true, burning: true });
      } }));
    },
    heal(spell, n, ally) {
      healUnit(ally, n.cura, 1.2);
      addHot(ally, spell, n);
    },
    healArea(spell, n, p) {
      FX.shockwave(p.x, p.y, spell.radius, C.heal, 0.8);
      FX.sigil(p.x, p.y, spell.radius, C.heal, 1.2, 8);
      near(fAllies(), p.x, p.y, spell.radius).forEach(ally => { healUnit(ally, n.cura); addHot(ally, spell, n); });
    },
    hot(spell, n, p) {
      FX.sigil(p.x, p.y, spell.radius, C.heal, 1.6, 6, 'ground', 0.4);
      FX.custom(1.6, k => D.zone(p.x, p.y, spell.radius, C.heal, 0.4 * (1 - k), 0.04, 5, k));
      near(fAllies(), p.x, p.y, spell.radius).forEach(ally => {
        if (n.cura) heal(ally, n.cura);
        addHot(ally, spell, n);
        emit(ally.x, ally.y - BODY, { color: C.heal, count: 10, speed: 1, size: 0.4, up: 3, shape: SpellFX.SHAPE.wisp });
      });
    },
    revive(spell, n, p) {
      const dead = deadHeroes().filter(h => dist(h, p) <= spell.radius).sort((a, b) => dist(a, p) - dist(b, p));
      const chosen = spell.maxTargets ? dead.slice(0, spell.maxTargets) : dead;
      if (!chosen.length) { say(`${spell.name}: nenhum herói morto perto do ponto.`); return; }
      chosen.forEach(h => reviveHero(h, spell.reviveHpPercent));
    },
    healAll(spell, n) {
      fAllies().forEach(ally => { healUnit(ally, maxHpOf(ally) * spell.healPercent / 100, 0.8); });
      if (spell.reviveHpPercent) deadHeroes().forEach(h => reviveHero(h, spell.reviveHpPercent));
      say(spell.healPercent >= 100 ? 'Um milagre. Até os padres ficaram desconfiados.' : 'Os antigos ouviram. Uma vez na vida.');
    },
  };
  function reviveHero(h, pct) {
    h.alive = true;
    h.mfx = {};
    h.hp = Math.max(1, Math.round(maxHpOf(h) * pct / 100));
    h.cooldown = 0;
    FX.beam(h.x, h.y, 1.6, 30, C.holy, 1.4);
    FX.flash(h.x, h.y - BODY, 4, C.holy, 0.6);
    FX.shockwave(h.x, h.y, 4, C.gold, 0.8);
    emit(h.x, h.y - BODY, { color: C.holy, count: 40, speed: 3, size: 0.45, up: 5, shape: SpellFX.SHAPE.star });
    say(`${h.name} voltou dos mortos. Reclamou do frio.`);
    updateHud();
  }

  // ----- Um quadro das magias de campo -----
  function fieldStep(dt) {
    const mk = mapKey();
    for (let i = rt.timers.length - 1; i >= 0; i--) {
      const timer = rt.timers[i];
      timer.t -= dt;
      if (timer.t > 0) continue;
      rt.timers.splice(i, 1);
      SpellFX.muted = timer.map !== mk;
      timer.fn();
      SpellFX.muted = false;
    }
    for (let i = rt.projs.length - 1; i >= 0; i--) {
      const p = rt.projs[i];
      p.t += dt;
      if (p.target?.alive) { p.ex = p.target.x; p.ey = p.target.y - BODY; }
      if (p.t < p.dur) continue;
      rt.projs.splice(i, 1);
      SpellFX.muted = p.map !== mk;
      p.onHit({ x: p.ex, y: p.ey });
      SpellFX.muted = false;
    }
    for (let i = rt.fzones.length - 1; i >= 0; i--) {
      const z = rt.fzones[i];
      z.t -= dt;
      if (z.t <= 0) { rt.fzones.splice(i, 1); continue; }
      const [zm, zs] = z.map.split(':');
      const inside = (state.bandits || []).filter(b => b.alive && !b.mfx?.convert && (b.mapId || 'city') === zm && String(b.mapSet || 1) === zs && dist(b, z) <= z.r);
      SpellFX.muted = z.map !== mk;
      if (z.cloud) {
        inside.forEach(enemy => {
          hurtRaw(enemy, z.n.cloudDps * dt);
          if (z.spell.slow) keep(enemy, 'slow', 0.6, { v: z.spell.slow.percent });
          if (z.spell.weaken && !z.burning) keep(enemy, 'weaken', 0.6, { dealt: z.spell.weaken.damageDealtPercent, taken: z.spell.weaken.damageTakenPercent, armor: z.spell.weaken.armorPercent });
        });
      } else {
        z.clock -= dt;
        if (z.clock <= 0) { z.clock += z.spell.tickSeconds; stormTick(z, inside); }
      }
      SpellFX.muted = false;
    }
  }
  function stormTick(z, inside) {
    const s = z.spell;
    if (s.hitsPerTick < 0) {
      // Impactos espalhados (meteoros, cinzas): cada um acerta quem estiver perto da queda.
      const at = inDisk(z.x, z.y, z.r);
      launch({ x: at.x, y: at.y, dur: 0.4, color: C.fire, size: 0.9, school: 'fogo', meteor: true, from: { x: at.x - 10, y: at.y - 36 }, onHit: () => {
        explode(at.x, at.y, s.impactRadius, 'fogo');
        (state.bandits || []).filter(b => b.alive && dist(b, at) <= s.impactRadius && (b.mapId || 'city') === z.map.split(':')[0]).forEach(enemy => { hit(enemy, z.n.dano, s); riders(enemy, s, z.n, at); });
      } });
      return;
    }
    const targets = s.hitsPerTick === 0 ? inside : [...inside].sort(() => Math.random() - 0.5).slice(0, s.hitsPerTick);
    targets.forEach(enemy => {
      if (s.school === 'raio') lightningStrike(enemy.x, enemy.y, 1.1);
      else if (s.school === 'fogo') launch({ target: enemy, dur: 0.3, color: C.fire, size: 0.6, school: 'fogo', from: { x: enemy.x - 5, y: enemy.y - 26 }, onHit: () => explode(enemy.x, enemy.y, 1.4, 'fogo') });
      else if (s.school === 'gelo') { emit(enemy.x, enemy.y - BODY, { color: C.ice, count: 6, speed: 2, size: 0.3, up: 1, shape: SpellFX.SHAPE.star }); FX.flash(enemy.x, enemy.y - BODY, 1.4, C.ice, 0.2); }
      hit(enemy, z.n.dano, s);
      riders(enemy, s, z.n, null);
    });
    if (s.school === 'gelo') FX.shockwave(z.x, z.y, z.r, C.ice, 0.5, 'ground', 0.4);
    if (s.school === 'raio' && Math.random() < 0.5) { const at = inDisk(z.x, z.y, z.r); lightningStrike(at.x, at.y, 0.9); }
  }

  function fieldDraw(dt) {
    const t = SpellFX.time;
    const mk = mapKey();
    // Projéteis.
    rt.projs.forEach(p => {
      if (p.map !== mk) return;
      const k = Math.min(1, p.t / p.dur);
      const u = 1 - k;
      const x = u * u * p.sx + 2 * u * k * p.cx + k * k * p.ex;
      const y = u * u * p.sy + 2 * u * k * p.cy + k * k * p.ey;
      p.trail.unshift({ x, y });
      if (p.trail.length > 9) p.trail.pop();
      for (let i = 0; i < p.trail.length - 1; i++) {
        const a = p.trail[i], b = p.trail[i + 1];
        D.segment('sky', a.x, a.y, b.x, b.y, p.color, (1 - i / p.trail.length) * 0.9, 0, p.size * (1 - i / p.trail.length) * 0.9, 0);
      }
      D.glow('sky', x, y, p.size * 2.2, p.color, 0.85);
      D.glow('sky', x, y, p.size * 0.9, C.white, 0.9);
      if (p.shard) D.star(x, y, p.size * 1.4, C.ice, 0.9, t * 6);
      if (p.school === 'arcano') D.star(x, y, p.size * 1.2, C.arcane, 0.8, t * 8);
      if (p.school === 'fogo' && Math.random() < dt * 60) emit(x, y, { color: Math.random() < 0.5 ? C.flame : C.fire, count: p.meteor ? 3 : 1, speed: 1, size: p.size * 0.5, up: 0.5, life: 0.4 });
      if (p.meteor) D.glow('sky', x, y, p.size * 3.5, C.ember, 0.35);
    });
    // Zonas.
    rt.fzones.forEach(z => {
      if (z.map !== mk) return;
      const fade = Math.min(1, z.t / 0.6, (z.max - z.t) / 0.3 + 0.05);
      const s = z.spell;
      const color = SCHOOL_COLOR[s.school];
      if (z.burning || (z.cloud && s.school === 'fogo')) {
        D.darkZone(z.x, z.y, z.r, C.smoke, 0.35 * fade);
        D.zone(z.x, z.y, z.r, C.fire, 0.55 * fade, 0.05, 7, t * 0.4);
        for (let i = 0; i < 9; i++) {
          const a = z.seed + i * 2.39, d = (0.25 + (i % 3) * 0.28) * z.r;
          const fx = z.x + Math.cos(a) * d, fy = z.y + Math.sin(a) * d * 0.9;
          D.wisp(fx, fy - 1.2, 0.9, 2.2 + Math.sin(t * 7 + i) * 0.4, i % 2 ? C.flame : C.fire, 0.8 * fade, i + z.seed);
        }
        if (Math.random() < dt * 14) { const at = inDisk(z.x, z.y, z.r); emit(at.x, at.y, { color: C.flame, count: 1, speed: 0.3, size: 0.3, up: 3, life: 0.8 }); }
      } else if (z.cloud) {
        D.darkZone(z.x, z.y, z.r, C.toxic, 0.45 * fade);
        D.zone(z.x, z.y, z.r, color, 0.5 * fade, 0.06, 4, t * 0.25);
        D.zone(z.x + Math.sin(t * 0.7) * 0.6, z.y, z.r * 0.75, color, 0.3 * fade, 0.02, 3, -t * 0.2);
        if (Math.random() < dt * 18) { const at = inDisk(z.x, z.y, z.r); emit(at.x, at.y, { color, count: 1, speed: 0.2, size: 0.45, up: 1.6, life: 1.2, layer: 'ground' }); }
      } else if (s.school === 'gelo') {
        D.darkZone(z.x, z.y, z.r, C.shadow, 0.2 * fade);
        D.zone(z.x, z.y, z.r, C.ice, 0.35 * fade, 0.04, 6, t * 0.1);
        D.ring(z.x, z.y, z.r, C.white, 0.5 * fade, 0.02, 16, t * 0.05);
        if (Math.random() < dt * 60) { const at = inDisk(z.x, z.y, z.r); emit(at.x - 1, at.y, { color: C.white, count: 1, h: 12, up: -3, speed: 1.4, angle: 0.4, spread: 0.3, size: 0.22, life: 1.4, drag: 0.4, gravity: 2 }); }
      } else if (s.school === 'raio') {
        D.darkZone(z.x, z.y, z.r * 1.1, C.shadow, 0.45 * fade);
        D.zone(z.x, z.y, z.r, C.lightning, (0.15 + 0.15 * Math.max(0, Math.sin(t * 13 + z.seed))) * fade, 0.03, 5, t * 0.2);
      } else if (s.school === 'fogo') {
        D.darkZone(z.x, z.y, z.r, C.smoke, 0.3 * fade);
        D.zone(z.x, z.y, z.r, C.fire, 0.3 * fade, 0.04, 6, t * 0.3);
        D.ring(z.x, z.y, z.r, C.ember, 0.5 * fade, 0.02, 10, t * 0.1);
      }
    });
    // Estados de quem está no mapa.
    const tt = t;
    [...fEnemies(), ...fAllies()].forEach(a => {
      const f = a.mfx;
      if (!f) return;
      if (f.freeze) { D.hex(a.x, a.y - BODY, 2.3, C.ice, 1, a.x); D.glow('ground', a.x, a.y, 2, C.ice, 0.5); }
      if (f.weaken) { D.rune(a.x, a.y - HEAD - 1.3, 0.8, C.violet, 0.85, tt * 0.8); D.ring(a.x, a.y, 1.5, C.darkViolet, 0.6, 0.1, 5, -tt * 0.2); }
      for (const key in f) {
        if (key.startsWith('dot:')) {
          const school = f[key].school;
          const color = SCHOOL_COLOR[school];
          if (Math.random() < dt * 9) emit(a.x + rand(-0.6, 0.6), a.y - rand(1, 3.5), { color, count: 1, speed: 0.3, size: school === 'fogo' ? 0.4 : 0.35, up: school === 'sombra' ? 1 : 2, life: 0.7, shape: school === 'sombra' ? SpellFX.SHAPE.wisp : SpellFX.SHAPE.glow });
          D.glow('ground', a.x, a.y, 1.4, color, 0.35);
        } else if (key.startsWith('hot:')) {
          if (Math.random() < dt * 6) emit(a.x + rand(-0.6, 0.6), a.y - rand(0.5, 2), { color: C.heal, count: 1, speed: 0.2, size: 0.35, up: 2, life: 0.9, shape: SpellFX.SHAPE.wisp });
        }
      }
    });
    // Mira de uma magia de campo.
    const aim = rt.targeting;
    if (aim?.field && rt.hover) {
      const spell = fieldByKey[aim.key];
      const h = rt.hover;
      const color = SCHOOL_COLOR[spell.school];
      if (spell.target === 'inimigo') {
        const enemy = nearest(fEnemies(), h.x, h.y, 5);
        if (enemy) { D.ring(enemy.x, enemy.y, 1.8, C.crimson, 0.95, 0.12, 8, t * 0.5); if (spell.radius) D.ring(enemy.x, enemy.y, spell.radius, color, 0.45, 0.02, 12, t * 0.1); }
        else D.sigil('ground', h.x, h.y, 1.2, C.crimson, 0.5, 4, t);
      } else if (spell.target === 'aliado') {
        const ally = nearest(fAllies(), h.x, h.y, 5);
        if (ally) D.ring(ally.x, ally.y, 1.8, C.heal, 0.95, 0.12, 8, t * 0.5);
        else D.sigil('ground', h.x, h.y, 1.2, C.heal, 0.5, 4, t);
      } else {
        const r = spell.radius || 2;
        D.ring(h.x, h.y, r, color, 0.9, 0.04, 12, t * 0.1);
        D.zone(h.x, h.y, r, color, 0.18, 0.01, 4, t * 0.1);
      }
    }
  }

  // ----- Painel MAGIAS: botão no canto do mapa e a lista para lançar -----
  let panel = null, panelBtn = null;
  const panelOpen = () => !!panel && !panel.hidden;
  function togglePanel(force) {
    if (!panel) return;
    const open = force ?? panel.hidden;
    panel.hidden = !open;
    panelBtn?.classList.toggle('on', open);
    if (!open && rt.targeting) { rt.targeting = null; refreshCursor(); }
    if (open) renderPanel(true);
  }
  function renderPanel(force) {
    if (!panelOpen()) return;
    if (!active()) { togglePanel(false); return; }
    const lv = level();
    const listKey = `${lv}`;
    const body = panel.querySelector('.spell-panel-list');
    if (force || panel.dataset.key !== listKey) {
      panel.dataset.key = listKey;
      panel.querySelector('.spell-panel-level').textContent = `Nível ${lv}`;
      const rows = [];
      for (let l = lv; l >= 1; l--) {
        const old = SPELLS.find(spell => spell.unlockLevel === l);
        const fresh = FIELD.find(spell => spell.unlockLevel === l);
        const cell = (spell, field) => {
          if (!spell) return '<span></span>';
          const usable = field || isUnlocked(spell);
      const cost = field ? spell.manaCost : stats(spell).manaCost;
          const color = field ? SCHOOL_HEX[spell.school] : (ACCENT[spell.type] || '#e9d08f');
          const title = (field ? fieldTitle(spell) : (usable ? spellTitle(spell) : `${spell.name}: substituída por outra magia.`)).replace(/"/g, '&quot;');
          return `<button type="button" class="spell-cast${field ? ' is-field' : ''}${usable ? '' : ' replaced'}" data-spell="${spell.key}" data-field="${field ? 1 : 0}" style="--accent:${color}" title="${title}"${usable ? '' : ' disabled'}>
            <span class="spell-glyph">${field ? FIELD_GLYPH[spell.key] || '✦' : GLYPHS[spell.key] || '✦'}</span><span class="spell-name">${spell.name}</span><small>${cost}</small><i class="spell-cd"></i></button>`;
        };
        rows.push(`<div class="spell-row-level"><b>${l}</b>${cell(old, false)}${cell(fresh, true)}</div>`);
      }
      body.innerHTML = rows.join('');
      const next = [...SPELLS, ...FIELD].filter(spell => spell.unlockLevel === lv + 1);
      panel.querySelector('.spell-panel-next').textContent = next.length ? `Nível ${lv + 1}: ${next.map(spell => spell.name).join(' e ')}` : 'Todas as magias aprendidas.';
    }
    const m = ms();
    const cap = mpCap(), max = maxMp();
    panel.querySelector('.spell-panel-mp i').style.width = `${Math.round(m.mp / Math.max(1, max) * 100)}%`;
    panel.querySelector('.spell-panel-mp span').textContent = `MP ${Math.floor(m.mp)} / ${Math.floor(cap)}`;
    body.querySelectorAll('.spell-cast').forEach(button => {
      const k = button.dataset.spell;
      const field = button.dataset.field === '1';
      const spell = field ? fieldByKey[k] : byKey[k];
      if (!spell) return;
      const cdMax = field ? spell.cooldownSeconds : stats(spell).cooldownSeconds;
      const cost = field ? spell.manaCost : stats(spell).manaCost;
      const cd = m.cd[k] || 0;
      button.style.setProperty('--cd', cd ? (cd / Math.max(0.1, cdMax)).toFixed(3) : 0);
      button.classList.toggle('cooling', cd > 0);
      button.classList.toggle('poor', m.mp < cost);
      button.classList.toggle('on', !field && (m.auras.includes(k) || rt.channel?.key === k));
      button.classList.toggle('targeting', rt.targeting?.key === k || (!field && m.pending?.key === k));
    });
  }
  function buildPanel() {
    const scene = document.getElementById('map-scene');
    const tools = scene?.querySelector('.map-tools');
    if (!scene || !tools) return;
    panelBtn = document.createElement('button');
    panelBtn.type = 'button';
    panelBtn.id = 'spells-btn';
    panelBtn.className = 'spell-corner-btn';
    panelBtn.title = 'Magias';
    panelBtn.setAttribute('aria-label', 'Abrir as magias');
    panelBtn.innerHTML = '<span>✦</span><small>MAGIAS</small>';
    tools.append(panelBtn);
    panel = document.createElement('div');
    panel.className = 'spell-panel';
    panel.hidden = true;
    panel.innerHTML = `<header><b>MAGIAS</b><span class="spell-panel-level"></span><button type="button" class="spell-panel-close" aria-label="Fechar" title="Fechar">×</button></header>
      <div class="spell-panel-mp"><i></i><span></span></div>
      <p class="spell-panel-help">Escolha a magia e clique no alvo. Esc ou clique direito cancela.</p>
      <div class="spell-panel-list"></div>
      <footer class="spell-panel-next"></footer>`;
    scene.append(panel);
    const stop = event => event.stopPropagation();
    [panel, panelBtn].forEach(el => { el.addEventListener('pointerdown', stop); el.addEventListener('wheel', stop, { passive: true }); });
    panelBtn.addEventListener('click', event => {
      event.stopPropagation();
      if (!active()) { say(state.heir ? 'Volte ao jogo para usar as magias.' : 'Sem herdeiro, sem magia. Comece um jogo novo e escolha um herdeiro.'); return; }
      togglePanel();
    });
    panel.addEventListener('click', event => {
      event.stopPropagation();
      if (event.target.closest('.spell-panel-close')) { togglePanel(false); return; }
      const button = event.target.closest('.spell-cast');
      if (!button || button.disabled) return;
      if (button.dataset.field === '1') fieldPress(button.dataset.spell); else press(button.dataset.spell);
      renderPanel(false);
    });
    scene.addEventListener('pointermove', event => { rt.hover = worldPoint(event); });
    scene.addEventListener('click', event => {
      if (!rt.targeting || !active() || camera.dragMoved || event.target.closest('.spell-panel, .map-tools')) return;
      event.stopPropagation();
      event.preventDefault();
      const point = worldPoint(event);
      if (rt.targeting.field) fieldClick(point); else onMapClick(point);
      renderPanel(false);
    }, true);
    scene.addEventListener('contextmenu', event => {
      if (!rt.targeting) return;
      event.preventDefault();
      rt.targeting = null;
      refreshCursor();
      renderPanel(false);
    });
    window.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !document.getElementById('menu-layer')?.hidden) return;
      if (rt.targeting) { event.preventDefault(); event.stopPropagation(); rt.targeting = null; refreshCursor(); renderPanel(false); return; }
      if (panelOpen()) { event.preventDefault(); event.stopPropagation(); togglePanel(false); }
    }, true);
  }

  // ----- Ganchos chamados pelo combate do app.js -----
  function statMods(actor, base) {
    const o = rt.mods.get(actor);
    const judged = actor.mfx?.judged;
    const broken = actor.mfx?.weaken?.armor;
    if (!o && !judged && !broken) return base;
    let s = base;
    if (o?.primary) { const k = 1 + o.primary / 100; s = { ...s, hp: Math.round(s.hp * k), atk: Math.round(s.atk * k), mag: Math.round(s.mag * k), def: Math.round(s.def * k), dex: Math.round(s.dex * k) }; }
    if (o?.armor || o?.armorPct) s = { ...s, def: Math.round((s.def + o.armor) * (1 + o.armorPct / 100)) };
    if (judged) s = { ...s, def: Math.round(s.def * (1 - judged.v / 100)) };
    if (broken) s = { ...s, def: Math.round(s.def * (1 - broken / 100)) };
    return s;
  }
  function moveMul(actor) {
    const f = actor.mfx;
    let k = 1;
    if (f) {
      if (f.stun || f.knock || f.root || f.push || f.freeze) return 0;
      if (f.slow) k *= 1 - f.slow.v / 100;
      if (f.crushSlow) k *= 1 - f.crushSlow.v / 100;
      if (f.haste) k *= 1 + f.haste.v / 100;
    }
    const o = rt.mods.get(actor);
    if (o?.moveHigh && hpOf(actor) > maxHpOf(actor) * 0.7) k *= 1 + o.moveHigh / 100;
    if (isEnemy(actor)) rt.zones.forEach(zone => { if (zone.kind === 'domain' && zone.e.enemySlowPercent && Math.hypot(actor.x - zone.x, actor.y - zone.y) <= zone.r) k *= 1 - zone.e.enemySlowPercent / 100; });
    return Math.max(0, k);
  }
  const attackRate = actor => 1 + (rt.mods.get(actor)?.atkSpd || 0) / 100;
  const tauntTarget = enemy => { const by = enemy.mfx?.taunt?.by; return by ? rt.summons.find(s => s.alive && s.id === by) || null : null; };
  const allyTargets = () => [...rt.summons.filter(s => s.alive), ...(state.bandits || []).filter(b => b.alive && b.mfx?.convert)];
  function blocksAttack(attacker) { return !!attacker.mfx?.silence && MAGIC_CLASSES.includes(classOf(attacker)); }
  function strikeBoost(attacker) {
    const f = attacker.mfx;
    if (!f?.annihilate || !isAlly(attacker)) return null;
    const bonus = f.annihilate.bonus / 100;
    delete f.annihilate;
    emit(attacker.x, attacker.y - BODY, { color: C.crimson, count: 10, speed: 3, size: 0.4, up: 2, shape: SpellFX.SHAPE.star });
    return { crit: true, critBonus: bonus };
  }
  function adjustDamage(attacker, defender, damage, magic) {
    if (damage <= 0) return 0;
    const m = ms();
    let dmg = damage;
    if (isAlly(attacker) && isEnemy(defender)) {
      const f = attacker.mfx || {};
      let mul = 1;
      if (f.order) { mul += f.order.v / 100; delete f.order; FX.flash(defender.x, defender.y - BODY, 1.8, C.gold, 0.3); }
      if (f.charge?.arrived && f.charge.first && !f.charge.used) { mul += f.charge.first / 100; f.charge.used = true; FX.shockwave(defender.x, defender.y, 2, C.ember, 0.4); }
      if (f.convert?.dmgPct) mul += f.convert.dmgPct / 100;
      if (rt.conquest.stacks && auraOn('aura-da-conquista')) mul += rt.conquest.stacks * effects(byKey['aura-da-conquista']).damagePercentPerStack * auraMult() / 100;
      const g = defender.mfx || {};
      if (g.execute && hpOf(defender) < maxHpOf(defender) * g.execute.thr / 100) mul += g.execute.v / 100;
      if (attacker.summon && g.slow?.summonTaken) mul += g.slow.summonTaken / 100;
      if (magic && g.silence?.magicTaken) mul += g.silence.magicTaken / 100;
      if (g.weaken?.taken) mul += g.weaken.taken / 100;
      dmg *= mul;
      if (g.mark) {
        heal(attacker, dmg * g.mark.v / 100);
        if (Math.random() < 0.6) FX.link({ x: defender.x, y: defender.y - BODY }, { x: attacker.x, y: attacker.y - BODY }, C.crimson, 0.35, 0, 0.25);
      }
    } else if (isEnemy(attacker) && isAlly(defender)) {
      const g = defender.mfx || {};
      if (attacker.mfx?.weaken?.dealt) dmg *= 1 - attacker.mfx.weaken.dealt / 100;
      if (g.invuln) { FX.flash(defender.x, defender.y - BODY, 2, C.holy, 0.25); return 0; }
      if (auraOn('aura-de-submissao') && Math.hypot(attacker.x - m.x, attacker.y - m.y) <= radiusOf(byKey['aura-de-submissao'])) {
        const e = effects(byKey['aura-de-submissao']);
        dmg *= 1 - Math.min(0.8, (magic ? e.enemyMagicDamageReductionPercent : e.enemyPhysicalDamageReductionPercent) * auraMult() / 100);
      }
      if (attacker.kind === 'crossbow') {
        const zone = rt.zones.find(z => z.kind === 'sanctuary' && Math.hypot(defender.x - z.x, defender.y - z.y) <= z.r);
        if (zone) {
          const back = Math.max(1, Math.round(dmg * zone.e.reflectedDamagePercent / 100));
          FX.link({ x: defender.x, y: defender.y - BODY }, { x: attacker.x, y: attacker.y - BODY }, C.astral, 0.4, 0, 0.3);
          attacker.hp = hpOf(attacker) - back;
          if (attacker.hp <= 0) { onEnemyKilled(attacker); killActor(attacker, defender); }
          return 0;
        }
      }
      const vassal = rt.summons.find(s => s.alive && s.absorb && s !== defender && Math.hypot(s.x - defender.x, s.y - defender.y) <= s.absorbRange);
      if (vassal) {
        const part = dmg * vassal.absorb / 100;
        dmg -= part;
        vassal.hp = hpOf(vassal) - part;
        if (Math.random() < 0.5) FX.link({ x: defender.x, y: defender.y - BODY }, { x: vassal.x, y: vassal.y - BODY }, C.astral, 0.3, 0, 0.25);
        if (vassal.hp <= 0) dismiss(vassal, true);
      }
      if (defender.summon && defender.taunting > 0 && defender.tauntDr) dmg *= 1 - defender.tauntDr / 100;
      if (g.shield) {
        const absorbed = Math.min(g.shield.v, dmg);
        g.shield.v -= absorbed;
        dmg -= absorbed;
        if (g.shield.v <= 0.5) {
          const s = g.shield;
          delete g.shield;
          FX.flash(defender.x, defender.y - BODY, 2.6, C.steel, 0.35);
          emit(defender.x, defender.y - BODY, { color: C.steel, count: 16, speed: 4, size: 0.35, up: 2, shape: SpellFX.SHAPE.star });
          if (s.knock) { near(rt.enemies, defender.x, defender.y, 3).forEach(enemy => push(enemy, defender.x, defender.y, s.knock)); FX.shockwave(defender.x, defender.y, 3, C.steel, 0.4); }
        }
      }
    }
    return Math.max(0, Math.round(dmg));
  }
  function afterStrike(attacker, defender, damage, killed) {
    if (killed && isEnemy(defender)) onEnemyKilled(defender);
  }
  function summonDied(victim) { dismiss(victim, true); }
  function enemyStep(enemy, dt, reducedMotion) {
    const f = enemy.mfx;
    if (!f) return false;
    if (f.push) { animateWalk(enemy, false, dt, reducedMotion); return true; }
    if (f.stun || f.knock || f.freeze) { enemy.action = 'walk'; enemy.frame = 0; return true; }
    if (f.convert) { convertedStep(enemy, dt, reducedMotion); return true; }
    return false;
  }

  // ----- Um quadro: tempos, auras, zonas, invocações, regeneração e desenho -----
  function tickFx(actor, dt) {
    const f = actor.mfx;
    if (!f) return;
    for (const key of Object.keys(f)) {
      const entry = f[key];
      if (key === 'push') {
        actor.x = Math.max(1, Math.min(99, actor.x + entry.vx * dt));
        actor.y = Math.max(2, Math.min(198, actor.y + entry.vy * dt));
        if (Math.random() < dt * 20) emit(actor.x, actor.y, { color: C.steel, count: 1, speed: 0.5, size: 0.4, up: 0.5, life: 0.4, layer: 'ground', alpha: 0.6 });
      }
      if (key.startsWith('dot:')) { hurtRaw(actor, entry.dps * dt); if (!actor.alive) return; }
      if (key.startsWith('hot:')) heal(actor, entry.hps * dt);
      if (key === 'root' && entry.dot) {
        entry.clock += dt;
        if (entry.clock >= 1) { entry.clock -= 1; hurt(actor, entry.dot); if (!actor.alive) return; }
      }
      entry.t -= dt;
      if (entry.t > 0) continue;
      delete f[key];
      if (key === 'push') {
        const clamped = actor.x <= 1.01 || actor.x >= 98.99 || actor.y <= 2.01 || actor.y >= 197.99;
        const wall = state.buildings.some(b => !b.ruined && Math.hypot(b.x - actor.x, b.y - actor.y) < 2.6);
        if (entry.stun && (clamped || wall)) { addFx(actor, 'stun', entry.stun); FX.flash(actor.x, actor.y - BODY, 1.6, C.paleGold, 0.3); }
      } else if (key === 'shield' && entry.heal && entry.v > 0) {
        heal(actor, entry.v * entry.heal / 100);
        emit(actor.x, actor.y - BODY, { color: C.emerald, count: 8, speed: 1, size: 0.35, up: 2.5 });
      } else if (key === 'convert') {
        actor.hp = hpOf(actor) - maxHpOf(actor) * entry.endDmg / 100;
        FX.flash(actor.x, actor.y - BODY, 2, C.violet, 0.4);
        say(`${actor.name} lembrou de que lado estava. Saiu da servidão com ${entry.endDmg}% de vida a menos.`);
        if (actor.hp <= 0) killBySpell(actor);
      }
    }
  }
  function computeMods() {
    rt.mods.clear();
    const m = ms();
    const mult = auraMult();
    const mod = actor => { let o = rt.mods.get(actor); if (!o) { o = { armor: 0, armorPct: 0, atkSpd: 0, moveHigh: 0, primary: 0 }; rt.mods.set(actor, o); } return o; };
    if (auraOn('aura-da-presenca')) { const e = effects(byKey['aura-da-presenca']); near(rt.allies, m.x, m.y, radiusOf(byKey['aura-da-presenca'])).forEach(a => { mod(a).armor += e.armorBonus * mult; }); }
    if (auraOn('aura-da-coragem') && auraOn('aura-da-presenca')) {
      const e = effects(byKey['aura-da-coragem']);
      near(rt.allies, m.x, m.y, radiusOf(byKey['aura-da-coragem'])).forEach(a => { const o = mod(a); o.atkSpd += Math.max(e.attackSpeedPercent, e.castSpeedPercent) * mult; o.moveHigh += (e.moveSpeedPercentAboveHp70 || 0) * mult; });
    }
    if (auraOn('aura-do-imperador-divino')) { const e = effects(byKey['aura-do-imperador-divino']); near(rt.allies, m.x, m.y, radiusOf(byKey['aura-do-imperador-divino'])).forEach(a => { mod(a).primary += e.primaryAttributesPercent * mult; }); }
    rt.zones.forEach(zone => { if (zone.kind === 'sanctuary') near(rt.allies, zone.x, zone.y, zone.r).forEach(a => { mod(a).armorPct += zone.e.alliedArmorPercent; }); });
  }
  function auraStep(dt) {
    const m = ms();
    const mult = auraMult();
    if (auraOn('aura-do-imperador-divino')) {
      const e = effects(byKey['aura-do-imperador-divino']);
      near(rt.allies, m.x, m.y, radiusOf(byKey['aura-do-imperador-divino'])).forEach(a => heal(a, maxHpOf(a) * e.hpRegenPercentPerSecond / 100 * mult * dt));
    }
    if (rt.conquest.stacks) { rt.conquest.t -= dt; if (rt.conquest.t <= 0 || !auraOn('aura-da-conquista')) rt.conquest.stacks = 0; }
    if (auraOn('presenca-esmagadora')) {
      const spell = byKey['presenca-esmagadora'];
      const e = effects(spell);
      const r = radiusOf(spell);
      const inside = new Set();
      rt.enemies.forEach(enemy => {
        if (Math.hypot(enemy.x - m.x, enemy.y - m.y) > r) return;
        inside.add(enemy.id);
        if (rt.crushInside.has(enemy.id) || enemy.mfx?.crushCd) return;
        if (enemy.boss) addFx(enemy, 'crushSlow', e.bossSlowSeconds, { v: e.bossSlowPercent });
        else control(enemy, 'knock', e.knockdownSeconds * mult);
        addFx(enemy, 'crushCd', e.perEnemyCooldownSeconds);
        FX.shockwave(enemy.x, enemy.y, 2.2, C.steel, 0.45);
        emit(enemy.x, enemy.y, { color: C.steel, count: 10, speed: 3, size: 0.4, up: 0.6, layer: 'ground', life: 0.5 });
      });
      rt.crushInside = inside;
    } else rt.crushInside.clear();
    for (let i = rt.zones.length - 1; i >= 0; i--) {
      const zone = rt.zones[i];
      zone.t -= dt;
      if (zone.t <= 0) { FX.shockwave(zone.x, zone.y, zone.r, zone.kind === 'domain' ? C.emerald : C.astral, 0.5); rt.zones.splice(i, 1); continue; }
      if (zone.kind === 'domain') {
        near(rt.allies, zone.x, zone.y, zone.r).forEach(a => heal(a, maxHpOf(a) * zone.e.hpRegenPercentPerSecond / 100 * dt));
        if (Math.hypot(m.x - zone.x, m.y - zone.y) <= zone.r) {
          m.mp = Math.min(mpCap(), m.mp + maxMp() * zone.e.manaRegenPercentPerSecond / 100 * dt);
        }
      }
    }
    if (rt.channel) {
      rt.channel.t += dt;
      m.mp -= rt.channel.perSecond * dt;
      near(rt.allies, m.x, m.y, rt.channel.r).forEach(a => addFx(a, 'ccImmune', 0.25));
      if (m.mp <= 0 || rt.channel.t >= rt.channel.max) { m.mp = Math.max(0, m.mp); endChannel(); }
    }
    if (rt.majesty > 0) rt.majesty = Math.max(0, rt.majesty - dt);
    for (let i = rt.armies.length - 1; i >= 0; i--) {
      const army = rt.armies[i];
      army.t += dt;
      const passDur = army.dur / army.passes;
      const pass = Math.floor(army.t / passDur);
      if (pass >= army.passes) { rt.armies.splice(i, 1); continue; }
      const front = (army.t - pass * passDur) / passDur * army.len;
      army.hits[pass] = army.hits[pass] || new Set();
      rt.enemies.forEach(enemy => {
        if (army.hits[pass].has(enemy.id)) return;
        const rx = enemy.x - army.x, ry = enemy.y - army.y;
        const along = rx * army.dx + ry * army.dy;
        const across = Math.abs(rx * -army.dy + ry * army.dx);
        if (across > army.width / 2 || Math.abs(along - front) > 1.6) return;
        army.hits[pass].add(enemy.id);
        hurt(enemy, army.damage);
        if (enemy.alive) push(enemy, enemy.x - army.dx, enemy.y - army.dy, army.knock);
        emit(enemy.x, enemy.y - BODY, { color: C.astral, count: 8, speed: 3, size: 0.35, up: 2 });
      });
    }
  }
  function resourceStep(dt) {
    const m = ms();
    const fighting = rt.enemies.length > 0;
    m.mp = Math.min(mpCap(), m.mp + mpRegen(fighting) * dt);
    Object.keys(m.cd).forEach(key => { m.cd[key] = Math.max(0, m.cd[key] - dt); if (!m.cd[key]) delete m.cd[key]; });
  }
  function moveStep(dt) {
    const m = ms();
    const goal = m.walkTo || m.goal;
    if (!goal) { m.moving = false; return; }
    let speed = WALK_SPEED * dt;
    if (rt.channel) speed *= rt.channel.move / 100;
    if (!speed) return;
    const dx = goal.x - m.x, dy = goal.y - m.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.2) { if (m.goal === goal) m.goal = null; m.moving = false; return; }
    const step = Math.min(dist, speed);
    m.x += dx / dist * step; m.y += dy / dist * step;
    m.moving = true;
    if (Math.abs(dx) > 0.2) m.side = dx < 0 ? 'left' : 'right';
  }
  function levelStep() {
    const m = ms();
    const lv = level();
    if (m.knownLevel == null) m.knownLevel = lv;
    if (lv <= m.knownLevel) return;
    const fresh = SPELLS.filter(spell => spell.unlockLevel > m.knownLevel && spell.unlockLevel <= lv);
    const upgraded = SPELLS.filter(spell => spell.unlockLevel <= m.knownLevel && spell.ranks.some(rank => rank.level > m.knownLevel && rank.level <= lv) && isUnlocked(spell));
    m.knownLevel = lv;
    rt.cache.clear();
    if (fresh.length) say(`${firstName()} aprendeu: ${fresh.map(spell => spell.name).join(', ')}.`);
    if (upgraded.length) say(`Aprimoradas: ${upgraded.map(spell => spell.name).join(', ')}.`);
    renderBar(true);
  }

  function step(dt, reducedMotion) {
    if (!active()) { hideUi(); togglePanel(false); return; }
    rt.time += dt;
    const m = ms();
    refreshLists();
    levelStep();
    computeMods();
    resourceStep(dt);
    pendingStep();
    moveStep(dt);
    [...state.heroes, ...state.workers, ...(state.bandits || []), ...rt.summons].forEach(actor => { if (actor.alive && actor.mfx) tickFx(actor, dt); });
    refreshLists();
    auraStep(dt);
    if (rt.lastMap !== mapKey()) { rt.lastMap = mapKey(); SpellFX.clear(); if (rt.targeting) { rt.targeting = null; refreshCursor(); } }
    fieldStep(dt);
    rt.summons.filter(s => s.alive).forEach(s => summonStep(s, dt, reducedMotion));
    rt.summons = rt.summons.filter(s => s.alive);
    // Pela borda: aura desligada se o nível caiu (save antigo) ou se a Presença saiu.
    m.auras = m.auras.filter(key => isUnlocked(byKey[key]) && (!byKey[key].auraSlotShared || m.auras.includes(byKey[key].auraSlotShared)));
    renderToken();
    drawFrame(dt, reducedMotion);
    rt.barClock -= dt;
    if (rt.barClock <= 0) { rt.barClock = 0.1; renderBar(false); }
    rt.panelClock -= dt;
    if (rt.panelClock <= 0) { rt.panelClock = 0.15; renderPanel(false); }
  }

  // ----- Desenho -----
  const auraColor = key => ({ 'aura-da-presenca': C.gold, 'aura-da-coragem': C.ember, 'aura-de-submissao': C.violet, 'aura-da-conquista': C.crimson, 'aura-do-imperador-divino': C.holy, 'presenca-esmagadora': C.steel }[key] || C.gold);
  function drawFrame(dt, reducedMotion) {
    if (!SpellFX.begin(dt, reducedMotion)) return;
    const m = ms();
    const t = SpellFX.time;
    const boost = rt.majesty > 0 ? 1.6 : 1;
    // O Monarca não aparece no mapa; só a Majestade Absoluta, quando ligada.
    if (rt.majesty > 0) {
      D.beam(m.x, m.y, 1.6, 22, C.gold, 0.55 + 0.15 * Math.sin(t * 6), 2);
      D.sigil('ground', m.x, m.y, 4.5, C.paleGold, 0.9, 12, -t * 0.4);
      D.crown(m.x, m.y - HEAD - 2.4, 1.6, C.gold, 1);
      if (Math.random() < dt * 30) emit(m.x, m.y - BODY, { color: C.gold, count: 1, speed: 2, size: 0.35, up: 4, shape: SpellFX.SHAPE.star });
    }
    // Auras ligadas.
    m.auras.forEach(key => {
      const spell = byKey[key];
      if (!isUnlocked(spell)) return;
      const r = radiusOf(spell);
      const color = auraColor(key);
      if (key === 'aura-da-presenca') { D.ring(m.x, m.y, r, color, 0.75 * boost, 0.03, 24, t * 0.02); D.zone(m.x, m.y, r, color, 0.18 * boost, 0.01, 4, t * 0.05); }
      else if (key === 'aura-da-coragem') { D.ring(m.x, m.y, r * 0.9, color, 0.6 * boost, 0.025, 16, -t * 0.06); if (Math.random() < dt * 10) emit(m.x, m.y, { color, count: 1, ring: r * 0.8, speed: 0.4, size: 0.3, up: 3, life: 1 }); }
      else if (key === 'aura-de-submissao') { D.darkZone(m.x, m.y, r, C.shadow, 0.3); D.ring(m.x, m.y, r, color, 0.7 * boost, 0.04, 12, t * 0.03); }
      else if (key === 'aura-da-conquista') {
        D.ring(m.x, m.y, r, color, 0.65 * boost, 0.03, 10, -t * 0.04);
        for (let i = 0; i < rt.conquest.stacks; i++) { const a = t * 1.5 + i / rt.conquest.stacks * Math.PI * 2; D.rune(m.x + Math.cos(a) * 2.2, m.y - BODY + Math.sin(a) * 0.8, 0.45, C.crimson, 0.9, a); }
      } else if (key === 'aura-do-imperador-divino') { D.zone(m.x, m.y, r, color, 0.32 * boost, 0.02, 6, t * 0.1); D.ring(m.x, m.y, r, C.paleGold, 0.8 * boost, 0.02, 30, t * 0.015); if (Math.random() < dt * 14) emit(m.x, m.y, { color: C.holy, count: 1, ring: r * 0.9, speed: 0.2, size: 0.35, up: 2.5, life: 1.4 }); }
      else if (key === 'presenca-esmagadora') { D.darkZone(m.x, m.y, r, C.shadow, 0.2); D.ring(m.x, m.y, r, color, (0.55 + 0.25 * Math.sin(t * 3)) * boost, 0.07, 6, t * 0.01); }
    });
    if (rt.channel) { D.dome(m.x, m.y, rt.channel.r, C.gold, 0.6, 0, 1); D.ring(m.x, m.y, rt.channel.r, C.gold, 0.9, 0.04, 8, t * 0.2); }
    // Zonas.
    rt.zones.forEach(zone => {
      const fade = Math.min(1, zone.t / 0.6, (zone.max - zone.t) / 0.4 + 0.01);
      if (zone.kind === 'domain') {
        D.zone(zone.x, zone.y, zone.r, C.emerald, 0.55 * fade, 0.04, 5, t * 0.1);
        D.ring(zone.x, zone.y, zone.r, C.gold, 0.6 * fade, 0.02, 20, t * 0.03);
        D.beam(zone.x, zone.y, 0.35, 7, C.emerald, 0.45 * fade, 5);
        if (Math.random() < dt * 8) emit(zone.x, zone.y, { color: C.emerald, count: 1, ring: zone.r * 0.8, speed: 0.2, size: 0.3, up: 2, life: 1.2 });
      } else {
        D.ring(zone.x, zone.y, zone.r, C.astral, 0.7 * fade, 0.05, 6, 0);
        D.dome(zone.x, zone.y, zone.r, C.astral, 0.5 * fade, 1, 4);
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; D.beam(zone.x + Math.cos(a) * zone.r, zone.y + Math.sin(a) * zone.r * 0.98, 0.45, 5.5, C.astral, 0.5 * fade, i); }
      }
    });
    // Exército Astral.
    rt.armies.forEach(army => {
      const passDur = army.dur / army.passes;
      const pass = Math.floor(army.t / passDur);
      const front = (army.t - pass * passDur) / passDur * army.len;
      const ex = army.x + army.dx * army.len, ey = army.y + army.dy * army.len;
      D.segment('ground', army.x, army.y, ex, ey, C.astral, 0.18, 0, army.width / 2, t);
      for (let i = 0; i < army.spirits; i++) {
        const off = (i / Math.max(1, army.spirits - 1) - 0.5) * army.width;
        const jitter = Math.sin(t * 7 + i) * 0.4;
        const x = army.x + army.dx * (front + jitter) - army.dy * off, y = army.y + army.dy * (front + jitter) + army.dx * off;
        const back = Math.max(0, front - 4);
        D.segment('ground', army.x + army.dx * back - army.dy * off, army.y + army.dy * back + army.dx * off, x, y, C.astral, 0.45, 0, 0.5, t);
        D.glow('ground', x, y, 1.8, C.astral, 0.7);
        D.wisp(x, y - 2.6, 1.6, 3.4, C.astral, 1, i);
        D.star(x, y - 4.6, 0.6, C.holy, 0.8, t * 3 + i);
        if (Math.random() < dt * 6) emit(x, y - 1, { color: C.astral, count: 1, speed: 0.5, size: 0.3, up: 1.5, life: 0.6 });
      }
    });
    // Estados de quem está no mapa.
    const g = rt.summons.filter(s => s.alive);
    g.forEach(s => {
      D.glow('ground', s.x, s.y, 2, C.astral, 0.5);
      D.wisp(s.x, s.y - BODY, 1.8, 3.2, C.astral, 0.32, s.id.length);
      if (s.taunting > 0) D.ring(s.x, s.y, s.tauntRadius, C.crimson, 0.35, 0.03, 0, 0);
    });
    [...fAllies(), ...fEnemies()].forEach(a => {
      const f = a.mfx;
      if (!f) return;
      if (f.order) D.crown(a.x, a.y - HEAD - 1, 0.75, C.gold, 0.95);
      if (f.annihilate) D.star(a.x, a.y - HEAD - 1.2, 1.1, C.crimson, 0.95, t * 2);
      if (f.shield) D.hex(a.x, a.y - BODY, 2.4, C.steel, Math.min(1, 0.4 + f.shield.v / Math.max(1, f.shield.max)), a.x);
      if (f.invuln) { D.hex(a.x, a.y - BODY, 2.6, C.holy, 1, a.y); D.glow('sky', a.x, a.y - BODY, 2.4, C.holy, 0.35); }
      if (f.ccImmune) D.ring(a.x, a.y, 1.5, C.gold, 0.8, 0.12, 0, 0);
      if (f.haste && Math.random() < dt * 10) emit(a.x, a.y - 1, { color: C.ember, count: 1, speed: 0.4, size: 0.3, up: 0.8, life: 0.5, layer: 'ground' });
      if (f.slow) D.ring(a.x, a.y, 1.5, C.frost, 0.85, 0.16, 6, t * 0.2);
      if (f.root) f.root.anchors?.forEach(angle => D.segment('sky', a.x + Math.cos(angle) * 2.6, a.y + Math.sin(angle) * 1.4, a.x, a.y - 1.4, C.steel, 0.95, 1, 0.32, 0));
      if (f.stun || f.knock) for (let i = 0; i < 3; i++) { const ang = t * 4 + i * 2.094; D.star(a.x + Math.cos(ang) * 1.1, a.y - HEAD + 0.2 + Math.sin(ang) * 0.35, 0.45, C.gold, 0.9, ang); }
      if (f.knock) D.glow('ground', a.x, a.y, 1.8, C.steel, 0.4);
      if (f.silence) D.rune(a.x, a.y - HEAD - 1, 0.75, C.violet, 0.95, Math.PI / 4);
      if (f.mark) { D.rune(a.x, a.y - HEAD - 1.1, 0.95, C.crimson, 1, t); D.ring(a.x, a.y, 1.7, C.crimson, 0.7, 0.08, 5, t * 0.3); }
      if (f.execute) {
        const low = hpOf(a) < maxHpOf(a) * f.execute.thr / 100;
        D.ring(a.x, a.y, 1.6, C.blood, low ? 0.9 + 0.1 * Math.sin(t * 8) : 0.35, 0.12, 4, 0);
        if (low) D.star(a.x, a.y - HEAD - 1, 0.9, C.crimson, 0.9, 0);
      }
      if (f.judged) D.ring(a.x, a.y, 1.35, C.paleGold, 0.6, 0.08, 8, t * 0.3);
      if (f.convert) { D.ring(a.x, a.y, 1.8, C.violet, 0.9, 0.1, 10, -t * 0.3); D.segment('ground', m.x, m.y, a.x, a.y, C.violet, 0.22, 1, 0.25, t); }
      if (f.taunt) { const by = tauntTarget(a); if (by) D.segment('sky', a.x, a.y - BODY, by.x, by.y - BODY, C.crimson, 0.3, 0, 0.12, t); }
    });
    // Mira.
    const aim = rt.targeting;
    if (aim && rt.hover) {
      const h = rt.hover;
      if (aim.key === 'move') D.sigil('ground', h.x, h.y, 1.3, C.gold, 0.7, 4, t);
      else {
        const spell = byKey[aim.key];
        const st = stats(spell);
        const inRange = Math.hypot(h.x - m.x, h.y - m.y) <= st.castRange;
        D.ring(m.x, m.y, st.castRange, C.paleGold, 0.4, 0.012, 48, t * 0.02);
        const color = inRange ? C.emerald : C.gold;
        if (spell.target === 'inimigo_unico') {
          const enemy = nearest(rt.enemies, h.x, h.y, 4);
          if (enemy) { D.ring(enemy.x, enemy.y, 1.8, C.crimson, 0.95, 0.12, 8, t * 0.5); D.rune(enemy.x, enemy.y - HEAD - 1.2, 0.8, C.crimson, 0.8, t); }
          else D.sigil('ground', h.x, h.y, 1.2, color, 0.5, 4, t);
        } else if (spell.target === 'linha') {
          let dx = h.x - m.x, dy = h.y - m.y; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
          D.segment('ground', m.x, m.y, m.x + dx * st.lineLength, m.y + dy * st.lineLength, C.astral, 0.35, 0, st.lineWidth / 2, t);
        } else {
          const r = spell.key === 'ordem-de-investida' ? st.targetAreaRadius : st.auraRadius || 2;
          D.ring(h.x, h.y, r, color, 0.85, 0.04, 12, t * 0.1);
          D.zone(h.x, h.y, r, color, 0.15, 0.01, 4, t * 0.1);
        }
      }
    }
    fieldDraw(dt);
    SpellFX.end(dt);
  }

  // ----- Interface: o Monarca no mapa, a barra de magias e a ficha -----
  const active = () => !!state.heir && game.running;
  let token = null, bar = null;
  function renderToken() {
    const layer = document.getElementById('monarch-layer');
    if (!layer) return;
    const m = ms();
    if (!token || token.parentElement !== layer) {
      layer.innerHTML = '';
      token = document.createElement('button');
      token.type = 'button';
      token.className = 'monarch-token';
      token.innerHTML = `<span class="monarch-standard">${crestSVG(heirById(state.heir)?.house, 26)}</span><span class="monarch-name"></span>`;
      token.addEventListener('click', event => { event.stopPropagation(); if (rt.targeting) return; menu.stack = []; showScreen('sheet'); });
      layer.append(token);
      token.dataset.heir = state.heir;
    }
    if (token.dataset.heir !== state.heir) { token = null; return; }
    const name = token.querySelector('.monarch-name');
    if (name.textContent !== heirName()) name.textContent = heirName();
    token.style.left = `${m.x}%`;
    token.style.top = `${m.y / 2}%`;
    token.style.zIndex = String(Math.round(m.y * 10));
    token.classList.toggle('moving', !!m.moving);
    token.classList.toggle('majesty', rt.majesty > 0);
    token.hidden = false;
  }
  function hideUi() {
    if (bar) bar.hidden = true;
    if (token) token.hidden = true;
  }
  const spellTitle = spell => {
    const st = stats(spell);
    const rank = rankIndex(spell) + 1;
    const cost = [st.manaCost ? (st.manaCost + ' MP') : '', st.manaReservePercent ? ('reserva ' + st.manaReservePercent + '% do MP') : ''].filter(Boolean).join(' · ') || 'sem custo';
    const reach = [st.castRange ? `alcance ${st.castRange} m` : 'sai do Monarca', st.auraRadius ? `raio ${st.auraRadius} m` : ''].filter(Boolean).join(' · ');
    return `${spell.name} (rank ${rank}/${spell.ranks.length})\n${spell.ranks[rank - 1].description}\n${cost} · recarga ${st.cooldownSeconds} s · ${reach}`;
  };
  function renderBar(force) {
    if (!bar) return;
    if (!active()) { bar.hidden = true; return; }
    bar.hidden = false;
    const m = ms();
    const list = unlockedSpells();
    const key = `${level()}:${list.map(spell => spell.key).join(',')}`;
    if (key !== rt.barKey) {
      rt.barKey = key;
      bar.querySelector('.spell-row').innerHTML = `<button type="button" class="spell-btn spell-move" data-spell="move" title="Mover o Monarca (ou clique direito no mapa)"><span class="spell-glyph">➤</span></button>`
        + list.map((spell, i) => `<button type="button" class="spell-btn${spell.activation === 'alternavel' ? ' is-aura' : ''}" data-spell="${spell.key}" style="--accent:${ACCENT[spell.type] || '#e9d08f'}" title="${spellTitle(spell).replace(/"/g, '&quot;')}"><span class="spell-glyph">${GLYPHS[spell.key] || '✦'}</span><i class="spell-cd"></i>${i < 10 ? `<b class="spell-hotkey">${(i + 1) % 10}</b>` : ''}</button>`).join('');
    } else if (force) {
      bar.querySelectorAll('.spell-btn[data-spell]').forEach(button => { const spell = byKey[button.dataset.spell]; if (spell) button.title = spellTitle(spell); });
    }
    const cap = mpCap(), max = maxMp();
    bar.querySelector('.res-mp i').style.width = `${Math.round(m.mp / Math.max(1, max) * 100)}%`;
    bar.querySelector('.res-mp em').style.width = `${Math.round(reservedMp() / Math.max(1, max) * 100)}%`;
    bar.querySelector('.res-mp span').textContent = `MP ${Math.floor(m.mp)}/${Math.floor(cap)}`;
    bar.querySelector('.aura-slots').textContent = auraSlots() ? `Auras ${slotsUsed()}/${auraSlots()}` : '';
    bar.querySelectorAll('.spell-btn[data-spell]').forEach(button => {
      const k = button.dataset.spell;
      if (k === 'move') { button.classList.toggle('targeting', rt.targeting?.key === 'move'); return; }
      const spell = byKey[k];
      if (!spell) return;
      const st = stats(spell);
      const cd = m.cd[k] || 0;
      button.style.setProperty('--cd', cd ? (cd / Math.max(0.1, st.cooldownSeconds)).toFixed(3) : 0);
      button.classList.toggle('cooling', cd > 0);
      button.classList.toggle('on', m.auras.includes(k) || rt.channel?.key === k);
      button.classList.toggle('targeting', rt.targeting?.key === k || m.pending?.key === k);
      button.classList.toggle('poor', !m.auras.includes(k) && m.mp < st.manaCost);
    });
  }
  function refreshCursor() {
    document.getElementById('map-scene')?.classList.toggle('monarch-aiming', !!rt.targeting);
    renderBar(false);
  }
  function sheetHTML(all) {
    if (!state.heir) return '';
    const m = ms();
    const list = unlockedSpells();
    const next = SPELLS.filter(spell => spell.unlockLevel > level()).slice(0, all ? undefined : 3);
    const row = spell => {
      const st = stats(spell);
      const rank = rankIndex(spell) + 1;
      const cost = [st.manaCost ? (st.manaCost + ' MP') : '', st.manaReservePercent ? ('reserva ' + st.manaReservePercent + '%') : ''].filter(Boolean).join(' · ');
      return `<li><span class="spell-glyph" style="--accent:${ACCENT[spell.type] || '#e9d08f'}">${GLYPHS[spell.key] || '✦'}</span><div><b>${spell.name}</b> <small>rank ${rank}/${spell.ranks.length}</small><p>${spell.ranks[rank - 1].description}</p><small>${cost || 'sem custo'} · recarga ${st.cooldownSeconds} s${st.castRange ? ` · alcance ${st.castRange} m` : ''}${st.auraRadius ? ` · raio ${st.auraRadius} m` : ''}</small></div></li>`;
    };
    return `<div class="sheet-section-label">MAGIAS DO MONARCA</div>
      <p class="sheet-spell-res">MP ${Math.floor(m.mp)} de ${Math.floor(mpCap())} · recupera ${mpRegen().toFixed(1).replace('.', ',')} MP/s (metade em combate) · ${auraSlots() ? `até ${auraSlots()} ${auraSlots() === 1 ? 'aura' : 'auras'} ao mesmo tempo` : 'nenhuma aura ainda'}</p>
      <ul class="spell-list">${list.map(row).join('')}</ul>
      <div class="sheet-section-label">MAGIAS DE CAMPO</div>
      <ul class="spell-list">${FIELD.filter(fieldUnlocked).map(spell => `<li><span class="spell-glyph" style="--accent:${SCHOOL_HEX[spell.school]}">${FIELD_GLYPH[spell.key] || '✦'}</span><div><b>${spell.name}</b> <small>nível ${spell.unlockLevel}</small><p>${fieldText(spell)}</p><small>${spell.manaCost} MP · recarga ${spell.cooldownSeconds} s</small></div></li>`).join('')}</ul>
      ${next.length ? `<div class="sheet-section-label">${all ? 'AINDA BLOQUEADAS' : 'PRÓXIMAS'}</div><ul class="spell-list locked">${next.map(spell => `<li><span class="spell-glyph">${GLYPHS[spell.key] || '✦'}</span><div><b>${spell.name}</b> <small>nível ${spell.unlockLevel}</small><p>${spell.ranks[0].description}</p></div></li>`).join('')}</ul>` : ''}`;
  }

  function reset() {
    rt.summons = []; rt.zones = []; rt.armies = []; rt.channel = null; rt.majesty = 0; rt.conquest = { stacks: 0, t: 0 };
    rt.targeting = null; rt.cache.clear(); rt.barKey = ''; rt.crushInside.clear(); token = null;
    rt.projs = []; rt.timers = []; rt.fzones = []; rt.lastMap = '';
    togglePanel(false);
    SpellFX.clear();
    if (state.monarch) { state.monarch.pending = null; state.monarch.walkTo = null; }
    refreshCursor();
  }

  // Sem Monarca no mapa: nada de estandarte nem barra. As magias ficam no painel do botão MAGIAS, no canto do mapa.
  function init() { buildPanel(); }

  init();
  return {
    statMods, moveMul, attackRate, tauntTarget, allyTargets, blocksAttack, strikeBoost, adjustDamage, afterStrike, summonDied, enemyStep, chargeStep,
    step, reset, sheetHTML, press, fieldPress, summons: () => rt.summons, isConverted: actor => !!actor?.mfx?.convert,
    debug: { rt, stats, effects, byKey, fieldByKey, fieldNums, fieldText, fieldCast: (key, target) => fieldCast(fieldByKey[key], target), cast: key => cast(byKey[key], { x: ms().x, y: ms().y + 6, enemy: rt.enemies[0] }) },
  };
})();
window.Monarch = Monarch;
