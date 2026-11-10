// ==========================================================================
// Monarca: as 30 magias do herdeiro (data/monarch-spells.json) funcionando no mapa.
// O Monarca anda pelo domínio, não luta e ninguém bate nele. Ele comanda: auras em volta dele,
// ordens e decretos para os aliados, editos e julgamentos contra os inimigos, invocações.
// Recursos: MP (o atributo do herdeiro) e Autoridade (ganha comandando e controlando).
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
    self: { id: 'monarch', name: 'O Monarca', className: 'Monarch', purse: 0, x: 0, y: 0 }, barKey: '', barClock: 0, cache: new Map(), outOfCombat: 0,
  };

  // ----- Nível, ranks e números de cada magia -----
  const level = () => Math.max(1, Math.min(DATA.maxLevel, state.heirLevel || 1));
  const heirStat = key => { const stat = HEIR_STATS.find(item => item.key === key); return stat ? stat.base + stat.per * (level() - 1) : 0; };
  const mag = () => heirStat('MAG');
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
    if (!state.monarch) state.monarch = { x: 44.5, y: 41.5, mp: null, authority: 0, auras: [], cd: {}, goal: null, pending: null, knownLevel: level() };
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
  const authMax = () => byLevelTable(DATA.resources.authority.maxByLevel);
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
  const gainAuth = amount => { const m = ms(); m.authority = Math.min(authMax(), (m.authority || 0) + amount); };

  // ----- Quem é aliado e quem é inimigo -----
  const isAlly = actor => !!actor && (actor.summon || actor.mfx?.convert || !isHostile(actor));
  const isEnemy = actor => !!actor && isHostile(actor) && !actor.mfx?.convert;
  const near = (list, x, y, r) => list.filter(actor => actor.alive && Math.hypot(actor.x - x, actor.y - y) <= r);
  const nearest = (list, x, y, r) => near(list, x, y, r).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;
  const fighters = () => rt.allies.filter(actor => actor.className !== 'Peasant');
  function refreshLists() {
    rt.allies = [...state.heroes.filter(a => a.alive), ...state.workers.filter(a => a.alive), ...rt.summons.filter(a => a.alive), ...(state.bandits || []).filter(b => b.alive && b.mfx?.convert)];
    rt.enemies = (state.bandits || []).filter(b => b.alive && !b.mfx?.convert);
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
    const m = ms();
    const dist = Math.hypot(enemy.x - m.x, enemy.y - m.y);
    const widest = Math.max(0, ...m.auras.filter(key => isUnlocked(byKey[key])).map(key => radiusOf(byKey[key])));
    if (dist <= widest) gainAuth(DATA.resources.authority.gain.enemyKilledInAura);
    if (auraOn('aura-da-conquista') && dist <= radiusOf(byKey['aura-da-conquista'])) {
      const e = effects(byKey['aura-da-conquista']);
      rt.conquest.stacks = Math.min(e.maxStacks, rt.conquest.stacks + 1);
      rt.conquest.t = e.stackDurationSeconds;
      FX.link({ x: enemy.x, y: enemy.y - BODY }, { x: m.x, y: m.y - BODY }, C.crimson, 0.5, 0, 0.5);
      emit(m.x, m.y - BODY, { color: C.crimson, count: 10, speed: 3, size: 0.35, up: 3 });
    }
    const f = enemy.mfx || {};
    if (f.execute?.refund) gainAuth(f.execute.refund);
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
  const control = (actor, key, t, data = {}) => { addFx(actor, key, Math.max(actor.mfx?.[key]?.t || 0, t), data); gainAuth(DATA.resources.authority.gain.enemyControlled); };

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
    if ((m.authority || 0) < st.authorityCost) return `${spell.name}: falta autoridade. Ninguém obedece a quem ainda não mandou nada.`;
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
    m.authority = Math.max(0, (m.authority || 0) - st.authorityCost);
    if (st.authorityGain) gainAuth(st.authorityGain);
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
    if (spell.activation === 'alternavel') { toggleAura(spell); return; }
    if (needsTarget(spell)) { rt.targeting = rt.targeting?.key === key ? null : { key }; refreshCursor(); return; }
    m.pending = null;
    cast(spell, { x: m.x, y: m.y });
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

  // Clique no mapa com uma magia escolhida: guarda o pedido; o Monarca anda até ficar ao alcance.
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
      if (!enemy) { say('Escolha um inimigo: clique em cima dele.'); return true; }
      if (spell.key === 'edito-de-servidao') {
        const e = effects(spell);
        if (enemy.boss) { say('Chefes não se ajoelham. Pelo menos não para você.'); return true; }
        if ((enemy.level || 1) > level() + e.maxTargetLevelAboveCaster) { say(`${enemy.name} é forte demais para servir. Por enquanto.`); return true; }
      }
      targetId = enemy.id;
    }
    m.pending = { key: spell.key, x: point.x, y: point.y, targetId };
    m.goal = null;
    rt.targeting = null;
    refreshCursor();
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
        addFx(ally, 'order', st.durationSeconds, { v: e.nextAttackDamagePercent, auth: e.authorityPerEmpoweredHit || 0 });
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
      near(rt.enemies, t.x, t.y, st.auraRadius).forEach(enemy => addFx(enemy, 'execute', st.durationSeconds, { thr: e.executeThresholdHpPercent, v: e.damageTakenBonusPercent, refund: e.authorityRefundOnKill || 0 }));
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
      if (e.authorityPerStunned) gainAuth(Math.min(e.authorityPerStunnedMax, e.authorityPerStunned * stunned.length));
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
      near([...state.heroes, ...rt.summons], m.x, m.y, st.auraRadius).forEach(ally => { ally.cooldown = 0; FX.flash(ally.x, ally.y - BODY, 2, C.gold, 0.4); });
      FX.beam(m.x, m.y, 2.6, 40, C.gold, 1.4);
      FX.shockwave(m.x, m.y, st.auraRadius, C.gold, 1.0);
      FX.sigil(m.x, m.y, st.auraRadius, C.paleGold, 1.8, 12);
      emit(m.x, m.y - BODY, { color: C.gold, count: 80, speed: 8, size: 0.5, up: 6, shape: SpellFX.SHAPE.star });
      say(`${firstName()} assumiu a Majestade Absoluta. Por doze segundos, até os credores se curvam.`);
    },
  };
  const anchors = () => [0, 1, 2].map(i => i / 3 * Math.PI * 2 + Math.random() * 0.8);
  const focusSummons = enemy => rt.summons.forEach(s => { if (s.alive) s.focus = enemy.id; });

  // ----- Ganchos chamados pelo combate do app.js -----
  function statMods(actor, base) {
    const o = rt.mods.get(actor);
    const judged = actor.mfx?.judged;
    if (!o && !judged) return base;
    let s = base;
    if (o?.primary) { const k = 1 + o.primary / 100; s = { ...s, hp: Math.round(s.hp * k), atk: Math.round(s.atk * k), mag: Math.round(s.mag * k), def: Math.round(s.def * k), dex: Math.round(s.dex * k) }; }
    if (o?.armor || o?.armorPct) s = { ...s, def: Math.round((s.def + o.armor) * (1 + o.armorPct / 100)) };
    if (judged) s = { ...s, def: Math.round(s.def * (1 - judged.v / 100)) };
    return s;
  }
  function moveMul(actor) {
    const f = actor.mfx;
    let k = 1;
    if (f) {
      if (f.stun || f.knock || f.root || f.push) return 0;
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
      if (f.order) { mul += f.order.v / 100; gainAuth(DATA.resources.authority.gain.allyHitUnderOrder + (f.order.auth || 0)); delete f.order; FX.flash(defender.x, defender.y - BODY, 1.8, C.gold, 0.3); }
      if (f.charge?.arrived && f.charge.first && !f.charge.used) { mul += f.charge.first / 100; f.charge.used = true; FX.shockwave(defender.x, defender.y, 2, C.ember, 0.4); }
      if (f.convert?.dmgPct) mul += f.convert.dmgPct / 100;
      if (rt.conquest.stacks && auraOn('aura-da-conquista')) mul += rt.conquest.stacks * effects(byKey['aura-da-conquista']).damagePercentPerStack * auraMult() / 100;
      const g = defender.mfx || {};
      if (g.execute && hpOf(defender) < maxHpOf(defender) * g.execute.thr / 100) mul += g.execute.v / 100;
      if (attacker.summon && g.slow?.summonTaken) mul += g.slow.summonTaken / 100;
      if (magic && g.silence?.magicTaken) mul += g.silence.magicTaken / 100;
      dmg *= mul;
      if (g.mark) {
        heal(attacker, dmg * g.mark.v / 100);
        if (Math.random() < 0.6) FX.link({ x: defender.x, y: defender.y - BODY }, { x: attacker.x, y: attacker.y - BODY }, C.crimson, 0.35, 0, 0.25);
      }
    } else if (isEnemy(attacker) && isAlly(defender)) {
      const g = defender.mfx || {};
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
    if (f.stun || f.knock) { enemy.action = 'walk'; enemy.frame = 0; return true; }
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
          if (zone.e.authorityPerSecondInside) gainAuth(zone.e.authorityPerSecondInside * dt);
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
    m.mp = Math.min(mpCap(), m.mp + maxMp() * (fighting ? 1.5 : 4) / 100 * dt);
    if (fighting) rt.outOfCombat = 0; else rt.outOfCombat += dt;
    if (rt.outOfCombat > 8) m.authority = Math.max(0, (m.authority || 0) - 2 * dt);
    m.authority = Math.min(authMax(), m.authority || 0);
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
    if (!active()) { hideUi(); return; }
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
    rt.summons.filter(s => s.alive).forEach(s => summonStep(s, dt, reducedMotion));
    rt.summons = rt.summons.filter(s => s.alive);
    // Pela borda: aura desligada se o nível caiu (save antigo) ou se a Presença saiu.
    m.auras = m.auras.filter(key => isUnlocked(byKey[key]) && (!byKey[key].auraSlotShared || m.auras.includes(byKey[key].auraSlotShared)));
    renderToken();
    drawFrame(dt, reducedMotion);
    rt.barClock -= dt;
    if (rt.barClock <= 0) { rt.barClock = 0.1; renderBar(false); }
  }

  // ----- Desenho -----
  const auraColor = key => ({ 'aura-da-presenca': C.gold, 'aura-da-coragem': C.ember, 'aura-de-submissao': C.violet, 'aura-da-conquista': C.crimson, 'aura-do-imperador-divino': C.holy, 'presenca-esmagadora': C.steel }[key] || C.gold);
  function drawFrame(dt, reducedMotion) {
    if (!SpellFX.begin(dt, reducedMotion)) return;
    const m = ms();
    const t = SpellFX.time;
    const boost = rt.majesty > 0 ? 1.6 : 1;
    // O Monarca.
    D.glow('ground', m.x, m.y, 2.4, C.gold, 0.5);
    D.sigil('ground', m.x, m.y, 1.9, C.gold, 0.6, 5, t * 0.6);
    if (rt.majesty > 0) {
      D.beam(m.x, m.y, 1.6, 22, C.gold, 0.55 + 0.15 * Math.sin(t * 6), 2);
      D.sigil('ground', m.x, m.y, 4.5, C.paleGold, 0.9, 12, -t * 0.4);
      D.crown(m.x, m.y - HEAD - 2.4, 1.6, C.gold, 1);
      if (Math.random() < dt * 30) emit(m.x, m.y - BODY, { color: C.gold, count: 1, speed: 2, size: 0.35, up: 4, shape: SpellFX.SHAPE.star });
    } else D.crown(m.x, m.y - HEAD - 1.6, 0.8, C.gold, 0.85);
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
    [...rt.allies, ...rt.enemies].forEach(a => {
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
    const cost = [st.manaCost ? `${st.manaCost} MP` : '', st.authorityCost ? `${st.authorityCost} de autoridade` : '', st.manaReservePercent ? `reserva ${st.manaReservePercent}% do MP` : ''].filter(Boolean).join(' · ') || 'sem custo';
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
    bar.querySelector('.res-auth i').style.width = `${Math.round((m.authority || 0) / authMax() * 100)}%`;
    bar.querySelector('.res-auth span').textContent = `Autoridade ${Math.floor(m.authority || 0)}/${authMax()}`;
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
      button.classList.toggle('poor', !m.auras.includes(k) && (m.mp < st.manaCost || (m.authority || 0) < st.authorityCost));
    });
  }
  function refreshCursor() {
    document.getElementById('map-scene')?.classList.toggle('monarch-aiming', !!rt.targeting);
    renderBar(false);
  }
  function sheetHTML() {
    if (!state.heir) return '';
    const m = ms();
    const list = unlockedSpells();
    const next = SPELLS.filter(spell => spell.unlockLevel > level()).slice(0, 3);
    const row = spell => {
      const st = stats(spell);
      const rank = rankIndex(spell) + 1;
      const cost = [st.manaCost ? `${st.manaCost} MP` : '', st.authorityCost ? `${st.authorityCost} Aut.` : '', st.manaReservePercent ? `reserva ${st.manaReservePercent}%` : ''].filter(Boolean).join(' · ');
      return `<li><span class="spell-glyph" style="--accent:${ACCENT[spell.type] || '#e9d08f'}">${GLYPHS[spell.key] || '✦'}</span><div><b>${spell.name}</b> <small>rank ${rank}/${spell.ranks.length}</small><p>${spell.ranks[rank - 1].description}</p><small>${cost || 'sem custo'} · recarga ${st.cooldownSeconds} s${st.castRange ? ` · alcance ${st.castRange} m` : ''}${st.auraRadius ? ` · raio ${st.auraRadius} m` : ''}</small></div></li>`;
    };
    return `<div class="sheet-section-label">MAGIAS DO MONARCA</div>
      <p class="sheet-spell-res">MP ${Math.floor(m.mp)} de ${Math.floor(mpCap())} · Autoridade ${Math.floor(m.authority || 0)} de ${authMax()} · ${auraSlots() ? `até ${auraSlots()} ${auraSlots() === 1 ? 'aura' : 'auras'} ao mesmo tempo` : 'nenhuma aura ainda'}</p>
      <ul class="spell-list">${list.map(row).join('')}</ul>
      ${next.length ? `<div class="sheet-section-label">PRÓXIMAS</div><ul class="spell-list locked">${next.map(spell => `<li><span class="spell-glyph">${GLYPHS[spell.key] || '✦'}</span><div><b>${spell.name}</b> <small>nível ${spell.unlockLevel}</small><p>${spell.ranks[0].description}</p></div></li>`).join('')}</ul>` : ''}`;
  }

  function reset() {
    rt.summons = []; rt.zones = []; rt.armies = []; rt.channel = null; rt.majesty = 0; rt.conquest = { stacks: 0, t: 0 };
    rt.targeting = null; rt.cache.clear(); rt.barKey = ''; rt.crushInside.clear(); token = null;
    SpellFX.clear();
    if (state.monarch) { state.monarch.pending = null; state.monarch.walkTo = null; }
    refreshCursor();
  }

  function init() {
    const world = document.getElementById('map-world');
    const scene = document.getElementById('map-scene');
    if (!world || !scene) return;
    const layer = document.createElement('div');
    layer.id = 'monarch-layer';
    layer.className = 'monarch-layer';
    document.getElementById('hero-layer').after(layer);
    bar = document.createElement('div');
    bar.className = 'monarch-bar';
    bar.id = 'monarch-bar';
    bar.hidden = true;
    bar.innerHTML = `<div class="monarch-res"><div class="res res-mp"><em></em><i></i><span></span></div><div class="res res-auth"><i></i><span></span></div><small class="aura-slots"></small></div><div class="spell-row"></div>`;
    scene.append(bar);
    bar.addEventListener('pointerdown', event => event.stopPropagation());
    bar.addEventListener('click', event => {
      event.stopPropagation();
      const button = event.target.closest('.spell-btn');
      if (button) press(button.dataset.spell);
    });
    scene.addEventListener('pointermove', event => { rt.hover = worldPoint(event); });
    scene.addEventListener('click', event => {
      if (!rt.targeting || !active() || camera.dragMoved || event.target.closest('.monarch-bar, .map-tools')) return;
      event.stopPropagation();
      event.preventDefault();
      onMapClick(worldPoint(event));
    }, true);
    scene.addEventListener('contextmenu', event => {
      if (!active() || state.selectedBuild || state.movingSite != null || state.placingBounty) return;
      event.preventDefault();
      if (rt.targeting) { rt.targeting = null; refreshCursor(); return; }
      const m = ms();
      m.goal = worldPoint(event); m.pending = null; m.walkTo = null;
      FX.sigil(m.goal.x, m.goal.y, 1.4, C.gold, 0.7, 4);
    });
    window.addEventListener('keydown', event => {
      if (!active() || !document.getElementById('menu-layer')?.hidden) return;
      if (event.target.closest?.('input, textarea, select')) return;
      if (event.key === 'Escape' && rt.targeting) { event.preventDefault(); event.stopPropagation(); rt.targeting = null; refreshCursor(); return; }
      if (/^[0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const index = (Number(event.key) + 9) % 10;
        const spell = unlockedSpells()[index];
        if (spell) { event.preventDefault(); press(spell.key); }
      }
    }, true);
  }

  init();
  return {
    statMods, moveMul, attackRate, tauntTarget, allyTargets, blocksAttack, strikeBoost, adjustDamage, afterStrike, summonDied, enemyStep, chargeStep,
    step, reset, sheetHTML, press, summons: () => rt.summons, isConverted: actor => !!actor?.mfx?.convert,
    debug: { rt, stats, effects, byKey, cast: key => cast(byKey[key], { x: ms().x, y: ms().y + 6, enemy: rt.enemies[0] }) },
  };
})();
window.Monarch = Monarch;
