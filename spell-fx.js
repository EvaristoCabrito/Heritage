// ==========================================================================
// Efeitos visuais das magias do Monarca em WebGL.
// Duas telas sobre o mapa: "ground" (no chão, abaixo dos personagens) e "sky" (acima deles).
// Cada tela cobre só a parte visível do mundo e acompanha a câmera; as coordenadas de entrada
// são as do jogo (x de 0 a 100, y de 0 a 200), as mesmas dos personagens.
// Tudo é desenhado como quads com um shader que escolhe a forma (brilho, anel, feixe, escudo...).
// ==========================================================================
const SpellFX = (() => {
  const SHAPE = { glow: 0, ring: 1, zone: 2, beam: 3, shock: 4, hex: 5, sigil: 6, segment: 7, dome: 8, crown: 9, star: 10, rune: 11, cracks: 12, wisp: 13 };
  const FLOATS = 12; // x, y, u, v, r, g, b, a, shape, p0, p1, p2
  const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
  const MAX_QUADS = 12000;
  const COLORS = {
    gold: [1, 0.8, 0.38], paleGold: [1, 0.93, 0.68], holy: [1, 0.97, 0.86], crimson: [1, 0.22, 0.16], blood: [0.75, 0.05, 0.08],
    violet: [0.66, 0.42, 1], darkViolet: [0.42, 0.16, 0.78], astral: [0.45, 0.82, 1], frost: [0.55, 0.78, 1], emerald: [0.45, 1, 0.6],
    ember: [1, 0.52, 0.18], steel: [0.8, 0.88, 1], shadow: [0.12, 0.05, 0.16], white: [1, 1, 1],
  };

  const VERT = `
    attribute vec2 aPos; attribute vec2 aUv; attribute vec4 aColor; attribute vec4 aParams;
    uniform vec2 uRes;
    varying vec2 vUv; varying vec4 vColor; varying vec4 vP;
    void main() {
      vUv = aUv; vColor = aColor; vP = aParams;
      vec2 clip = aPos / uRes * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    }`;
  const FRAG = `
    precision mediump float;
    varying vec2 vUv; varying vec4 vColor; varying vec4 vP;
    uniform float uTime;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) { return noise(p) * 0.55 + noise(p * 2.1 + 3.7) * 0.3 + noise(p * 4.3 + 7.1) * 0.15; }
    float hexDist(vec2 p) { p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.732))), p.x); }
    void main() {
      vec2 uv = vUv;
      float d = length(uv);
      float ang = atan(uv.y, uv.x);
      float shape = vP.x;
      float a = 0.0;
      vec3 col = vColor.rgb;
      if (shape < 0.5) {                       // brilho suave
        a = exp(-d * d * 4.0) * smoothstep(1.0, 0.55, d);
      } else if (shape < 1.5) {                // anel de aura: p0 espessura, p1 runas, p2 fase
        float edge = 1.0 - vP.y;
        a = smoothstep(edge - 0.05, edge, d) * smoothstep(1.0, 0.96, d);
        a += 0.10 * smoothstep(1.0, 0.0, d) * smoothstep(0.0, 0.9, d);
        if (vP.z > 0.5) {
          float r = step(0.55, fract((ang / 6.28318 + vP.w) * vP.z));
          float band = smoothstep(edge - 0.15, edge - 0.10, d) * smoothstep(edge - 0.01, edge - 0.06, d);
          a += band * r * 0.75;
        }
        a *= 0.75 + 0.25 * sin(uTime * 2.0 + ang * 3.0);
      } else if (shape < 2.5) {                // zona no chão: p0 borda, p1 escala do ruído, p2 fase
        float n = fbm(vec2(ang * 1.6 + vP.w, d * vP.z - uTime * 0.6));
        float fill = smoothstep(1.0, 0.2, d) * (0.22 + 0.35 * n);
        float rim = smoothstep(1.0 - vP.y - 0.05, 1.0 - vP.y, d) * smoothstep(1.0, 0.97, d);
        float spokes = step(0.92, fract(ang / 6.28318 * 12.0 + vP.w * 0.2)) * smoothstep(1.0, 0.7, d) * smoothstep(0.3, 0.6, d) * 0.35;
        a = (fill + rim + spokes) * smoothstep(1.0, 0.985, d);
      } else if (shape < 3.5) {                // feixe vertical (uv.y: -1 topo, 1 base)
        float core = exp(-uv.x * uv.x * 14.0);
        float halo = exp(-uv.x * uv.x * 3.0) * 0.45;
        float flicker = 0.75 + 0.25 * noise(vec2(uv.x * 3.0, uv.y * 4.0 - uTime * 6.0 + vP.w));
        float top = smoothstep(-1.0, -0.2, uv.y);
        float bottom = smoothstep(1.0, 0.86, uv.y);
        a = (core + halo) * flicker * top * bottom;
        col = mix(col, vec3(1.0), core * 0.6);
      } else if (shape < 4.5) {                // onda de choque: p0 progresso
        float r = vP.y;
        float th = 0.04 + 0.16 * (1.0 - r);
        a = smoothstep(r - th, r, d) * smoothstep(r + 0.02, r - 0.01, d) * (1.0 - r * 0.85);
        a += 0.25 * (1.0 - r) * smoothstep(r, 0.0, d);
      } else if (shape < 5.5) {                // bolha de escudo hexagonal: p0 força
        vec2 g = uv * 4.0;
        vec2 r = vec2(1.0, 1.732);
        vec2 h = r * 0.5;
        vec2 ga = mod(g, r) - h;
        vec2 gb = mod(g - h, r) - h;
        vec2 gv = dot(ga, ga) < dot(gb, gb) ? ga : gb;
        float hexEdge = smoothstep(0.38, 0.5, hexDist(gv));
        float rim = smoothstep(0.62, 1.0, d) * smoothstep(1.0, 0.94, d);
        float shimmer = 0.5 + 0.5 * sin(uTime * 3.0 + uv.y * 6.0 + vP.w);
        a = (rim * 0.9 + hexEdge * 0.35 * smoothstep(1.0, 0.3, d) * shimmer + 0.08) * smoothstep(1.0, 0.98, d) * vP.y;
      } else if (shape < 6.5) {                // selo: círculos, estrela de p1 pontas, giro p2
        float rot = ang + vP.w;
        float outer = smoothstep(0.93, 0.96, d) * smoothstep(1.0, 0.97, d);
        float inner = smoothstep(0.70, 0.73, d) * smoothstep(0.77, 0.74, d);
        float n = max(3.0, vP.z);
        float seg = 6.28318 / n;
        float sa = mod(rot, seg) - seg * 0.5;
        float star = smoothstep(0.03, 0.0, abs(d * cos(sa) - 0.72 * cos(seg))) * step(d, 0.73);
        float lines = smoothstep(0.035, 0.0, abs(d * cos(sa) - 0.72 * cos(seg * 0.5))) * step(d, 0.73);
        float glyphs = step(0.6, fract(rot / 6.28318 * n * 3.0)) * smoothstep(0.78, 0.81, d) * smoothstep(0.92, 0.89, d);
        a = outer + inner + lines + star * 0.5 + glyphs * 0.6 + vP.y * smoothstep(1.0, 0.0, d) * 0.3;
        a *= smoothstep(1.0, 0.99, d);
      } else if (shape < 7.5) {                // segmento: p0 estilo (0 feixe, 1 corrente), p1 comprimento, p2 fase
        float across = exp(-uv.y * uv.y * 7.0);
        float ends = smoothstep(1.0, 0.85, abs(uv.x));
        if (vP.y > 0.5) {
          float link = fract(uv.x * vP.z * 0.5 + vP.w);
          float ring = smoothstep(0.18, 0.05, abs(length(vec2((link - 0.5) * 2.0, uv.y * 1.6)) - 0.65));
          a = ring * ends + across * 0.25 * ends;
        } else {
          float pulse = 0.7 + 0.3 * sin(uv.x * vP.z * 2.0 - uTime * 10.0 + vP.w);
          a = across * pulse * ends;
          col = mix(col, vec3(1.0), exp(-uv.y * uv.y * 30.0) * 0.5);
        }
      } else if (shape < 8.5) {                // cúpula: p0 padrão (0 liso, 1 tijolos de cidadela)
        float rim = smoothstep(0.72, 1.0, d) * smoothstep(1.0, 0.95, d);
        float grad = smoothstep(1.0, -1.0, uv.y) * 0.18;
        float pattern = 0.0;
        if (vP.y > 0.5) {
          vec2 b = vec2(uv.x * 6.0 + step(0.5, fract(uv.y * 3.0)) * 0.5, uv.y * 6.0);
          vec2 f = abs(fract(b) - 0.5);
          pattern = smoothstep(0.42, 0.5, max(f.x, f.y)) * 0.35;
        }
        float sweep = smoothstep(0.08, 0.0, abs(fract(uTime * 0.25 + vP.w) * 2.4 - 1.2 - uv.y)) * 0.35;
        a = (rim + grad + pattern + sweep) * smoothstep(1.0, 0.97, d);
      } else if (shape < 9.5) {                // coroa
        vec2 p = uv * vec2(1.0, -1.0);
        float base = step(-0.55, p.y) * step(p.y, -0.2) * step(abs(p.x), 0.7);
        float spikes = 0.0;
        for (int i = 0; i < 3; i++) {
          float cx = -0.5 + float(i) * 0.5;
          float h = i == 1 ? 0.72 : 0.5;
          float w = 0.24 * (1.0 - (p.y + 0.2) / (h + 0.2));
          spikes = max(spikes, step(-0.2, p.y) * step(p.y, h) * step(abs(p.x - cx), w));
          spikes = max(spikes, smoothstep(0.12, 0.06, length(p - vec2(cx, h + 0.06))));
        }
        float shapeA = max(base, spikes);
        float glow = exp(-d * d * 2.2) * 0.45;
        a = shapeA + glow;
        col = mix(col, vec3(1.0, 0.98, 0.9), shapeA * 0.35);
      } else if (shape < 10.5) {               // faísca de quatro pontas
        float sx = exp(-abs(uv.x) * 9.0) * exp(-abs(uv.y) * 2.2);
        float sy = exp(-abs(uv.y) * 9.0) * exp(-abs(uv.x) * 2.2);
        a = max(sx, sy) + exp(-d * d * 18.0);
        col = mix(col, vec3(1.0), exp(-d * d * 30.0));
      } else if (shape < 11.5) {               // runa em losango
        float k = abs(uv.x) + abs(uv.y);
        a = smoothstep(0.12, 0.0, abs(k - 0.78)) + smoothstep(0.22, 0.0, d) + exp(-d * d * 3.0) * 0.3;
        a += smoothstep(0.05, 0.0, abs(uv.x)) * step(abs(uv.y), 0.55) * 0.6;
      } else if (shape < 12.5) {               // rachaduras: p0 progresso
        float r = vP.y;
        float n = noise(vec2(ang * 9.0 + vP.w, 1.0));
        float crack = smoothstep(0.08, 0.0, abs(fract(ang / 6.28318 * 18.0 + n * 0.6) - 0.5) * 2.0 - 0.02) * step(d, r) * smoothstep(0.0, 0.3, d);
        float front = smoothstep(r - 0.06, r, d) * smoothstep(r + 0.03, r, d);
        a = (crack * 0.8 + front) * (1.0 - r * 0.6);
      } else {                                  // chama espectral
        vec2 p = uv;
        float q = (1.0 - p.y) * 0.5;            // 0 na base, 1 na ponta
        float n = fbm(vec2(p.x * 2.0 + vP.w, p.y * 1.5 + uTime * 2.4));
        float w = mix(0.75, 0.1, q) * (0.8 + 0.4 * n);
        float body = exp(-(p.x * p.x) / (w * w) * 1.6) * smoothstep(1.0, 0.7, q) * smoothstep(0.0, 0.18, q);
        a = body * (0.55 + n * 0.8);
        col = mix(col, vec3(1.0), body * smoothstep(0.5, 0.0, q) * 0.4);
      }
      gl_FragColor = vec4(col, vColor.a * clamp(a, 0.0, 1.0));
    }`;

  const layers = {};
  const oneShots = [];
  const particles = [];
  let ok = false;
  let time = 0;
  let view = null;
  let reduced = false;

  function makeLayer(name, z, anchor, after) {
    const canvas = document.createElement('canvas');
    canvas.className = `spell-fx spell-fx-${name}`;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.zIndex = String(z);
    if (after) after.after(canvas); else anchor.append(canvas);
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: false })
      || canvas.getContext('experimental-webgl', { premultipliedAlpha: false, alpha: true });
    if (!gl) return null;
    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    const buffer = gl.createBuffer();
    const loc = {
      pos: gl.getAttribLocation(prog, 'aPos'), uv: gl.getAttribLocation(prog, 'aUv'), color: gl.getAttribLocation(prog, 'aColor'), params: gl.getAttribLocation(prog, 'aParams'),
      res: gl.getUniformLocation(prog, 'uRes'), time: gl.getUniformLocation(prog, 'uTime'),
    };
    return { name, canvas, gl, prog, buffer, loc, batches: { add: new Float32Array(MAX_QUADS * 6 * FLOATS), alpha: new Float32Array(MAX_QUADS * 6 * FLOATS) }, counts: { add: 0, alpha: 0 }, drewLast: false };
  }

  function init() {
    if (ok) return true;
    const world = document.getElementById('map-world');
    if (!world) return false;
    try {
      layers.ground = makeLayer('ground', 5, world, world.querySelector('.tree-foreground'));
      layers.sky = makeLayer('sky', 7, world, document.getElementById('hero-layer'));
      ok = !!(layers.ground && layers.sky);
    } catch (error) {
      console.warn('Efeitos das magias desligados: WebGL indisponível.', error);
      ok = false;
    }
    return ok;
  }

  // Parte visível do mundo, em pixels do mundo (sem zoom), e a escala até os pixels da tela.
  function computeView() {
    const world = document.getElementById('map-world');
    const scene = document.getElementById('map-scene');
    const wr = world.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const worldW = world.offsetWidth, worldH = world.offsetHeight;
    if (!worldW || !worldH || !wr.width) return null;
    const zoom = wr.width / worldW;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const left = (sr.left - wr.left) / zoom, top = (sr.top - wr.top) / zoom;
    const cssW = sr.width / zoom, cssH = sr.height / zoom;
    return { left, top, cssW, cssH, backW: Math.max(1, Math.round(sr.width * dpr)), backH: Math.max(1, Math.round(sr.height * dpr)), scale: zoom * dpr, ux: worldW / 100, uy: worldH / 200 };
  }

  // Posição do jogo -> pixel da tela de efeitos.
  const px = (x, y) => [(x * view.ux - view.left) * view.scale, (y * view.uy - view.top) * view.scale];
  const ux = units => units * view.ux * view.scale;
  const uy = units => units * view.uy * view.scale;

  // Um quad: centro (x, y) no jogo, meia-largura e meia-altura em unidades do jogo, rotação em radianos.
  function quad(layerName, blend, shape, x, y, hw, hh, color, alpha = 1, p0 = 0, p1 = 0, p2 = 0, rot = 0) {
    if (!ok || !view) return;
    const layer = layers[layerName];
    const batch = layer.batches[blend];
    const index = layer.counts[blend];
    if (index >= MAX_QUADS) return;
    const [cx, cy] = px(x, y);
    const w = ux(hw), h = uy(hh);
    if (cx + w + h < 0 || cy + w + h < 0 || cx - w - h > view.backW || cy - w - h > view.backH) return;
    const c = Math.cos(rot), s = Math.sin(rot);
    let o = index * 6 * FLOATS;
    for (const [u, v] of CORNERS) {
      const lx = u * w, ly = v * h;
      batch[o++] = cx + lx * c - ly * s;
      batch[o++] = cy + lx * s + ly * c;
      batch[o++] = u; batch[o++] = v;
      batch[o++] = color[0]; batch[o++] = color[1]; batch[o++] = color[2]; batch[o++] = alpha;
      batch[o++] = shape; batch[o++] = p0; batch[o++] = p1; batch[o++] = p2;
    }
    layer.counts[blend] = index + 1;
  }

  function flush(layer) {
    const { gl, canvas, prog, buffer, loc } = layer;
    if (canvas.width !== view.backW || canvas.height !== view.backH) { canvas.width = view.backW; canvas.height = view.backH; }
    canvas.style.left = `${view.left}px`;
    canvas.style.top = `${view.top}px`;
    canvas.style.width = `${view.cssW}px`;
    canvas.style.height = `${view.cssH}px`;
    const total = layer.counts.add + layer.counts.alpha;
    if (!total && !layer.drewLast) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    layer.drewLast = total > 0;
    if (!total) return;
    gl.useProgram(prog);
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform1f(loc.time, time);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const stride = FLOATS * 4;
    gl.enable(gl.BLEND);
    for (const blend of ['alpha', 'add']) {
      const count = layer.counts[blend];
      if (!count) continue;
      gl.bufferData(gl.ARRAY_BUFFER, layer.batches[blend].subarray(0, count * 6 * FLOATS), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc.pos); gl.vertexAttribPointer(loc.pos, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(loc.uv); gl.vertexAttribPointer(loc.uv, 2, gl.FLOAT, false, stride, 8);
      gl.enableVertexAttribArray(loc.color); gl.vertexAttribPointer(loc.color, 4, gl.FLOAT, false, stride, 16);
      gl.enableVertexAttribArray(loc.params); gl.vertexAttribPointer(loc.params, 4, gl.FLOAT, false, stride, 32);
      if (blend === 'add') gl.blendFunc(gl.SRC_ALPHA, gl.ONE); else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, count * 6);
    }
  }

  // ----- Partículas -----
  function emit(x, y, options = {}) {
    const count = Math.max(1, Math.round((options.count || 12) * (reduced ? 0.3 : 1)));
    for (let i = 0; i < count; i++) {
      const angle = options.angle != null ? options.angle + (Math.random() - 0.5) * (options.spread ?? Math.PI * 2) : Math.random() * Math.PI * 2;
      const speed = (options.speed ?? 4) * (0.4 + Math.random() * 0.8);
      const life = (options.life ?? 0.9) * (0.6 + Math.random() * 0.7);
      const ring = options.ring ? options.ring * (0.85 + Math.random() * 0.3) : 0;
      particles.push({
        x: x + Math.cos(angle) * ring + (Math.random() - 0.5) * (options.jitter || 0), y: y + Math.sin(angle) * ring + (Math.random() - 0.5) * (options.jitter || 0),
        h: options.h ?? 0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, vh: (options.up ?? 2) * (0.5 + Math.random()),
        life, max: life, size: (options.size ?? 0.5) * (0.6 + Math.random() * 0.8), color: options.color || COLORS.gold,
        shape: options.shape ?? SHAPE.glow, layer: options.layer || 'sky', drag: options.drag ?? 2.5, gravity: options.gravity ?? 0, alpha: options.alpha ?? 1,
      });
    }
  }
  function stepParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const drag = Math.exp(-p.drag * dt);
      p.vx *= drag; p.vy *= drag; p.vh = p.vh * drag - p.gravity * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.h = Math.max(0, p.h + p.vh * dt);
      const k = p.life / p.max;
      const fade = Math.min(1, k * 3) * Math.min(1, (1 - k) * 8 + 0.2);
      quad(p.layer, 'add', p.shape, p.x, p.y - p.h, p.size, p.size, p.color, p.alpha * fade, 0, 0, i * 0.37);
    }
    if (particles.length > 4000) particles.splice(0, particles.length - 4000);
  }

  // ----- Efeitos de uma vez (duram um tempo e somem) -----
  function oneShot(duration, draw) { oneShots.push({ t: 0, duration, draw }); }
  function stepOneShots(dt) {
    for (let i = oneShots.length - 1; i >= 0; i--) {
      const e = oneShots[i];
      e.t += dt;
      const k = Math.min(1, e.t / e.duration);
      e.draw(k, e.t);
      if (k >= 1) oneShots.splice(i, 1);
    }
  }
  const ease = k => 1 - Math.pow(1 - k, 3);
  const fadeInOut = (k, a = 0.15, b = 0.35) => Math.min(1, k / a) * Math.min(1, (1 - k) / b);

  const fx = {
    // Efeito livre: draw(k, t) é chamado a cada quadro com o progresso k de 0 a 1.
    custom(duration, drawFn) { oneShot(duration, drawFn); },
    shockwave(x, y, radius, color, duration = 0.6, layer = 'ground', alpha = 1) {
      oneShot(duration, k => quad(layer, 'add', SHAPE.shock, x, y, radius, radius, color, alpha, ease(k)));
    },
    flash(x, y, radius, color, duration = 0.35, layer = 'sky') {
      oneShot(duration, k => quad(layer, 'add', SHAPE.glow, x, y, radius * (0.6 + k * 0.6), radius * (0.6 + k * 0.6), color, 1 - k));
    },
    beam(x, y, width, height, color, duration = 0.8, seed = Math.random() * 10) {
      oneShot(duration, k => {
        const a = fadeInOut(k, 0.1, 0.5);
        const w = width * (0.6 + 0.4 * Math.sin(Math.min(1, k * 4) * Math.PI / 2));
        quad('sky', 'add', SHAPE.beam, x, y - height, w, height, color, a, 0, 0, seed);
        quad('ground', 'add', SHAPE.glow, x, y, width * 2.2, width * 1.3, color, a * 0.9);
      });
    },
    sigil(x, y, radius, color, duration = 1.2, points = 6, layer = 'ground', spin = 1) {
      oneShot(duration, (k, t) => quad(layer, 'add', SHAPE.sigil, x, y, radius * (0.7 + 0.3 * ease(Math.min(1, k * 3))), radius * (0.7 + 0.3 * ease(Math.min(1, k * 3))), color, fadeInOut(k), 0.4, points, t * spin));
    },
    link(from, to, color, duration = 0.5, style = 0, width = 0.6) {
      oneShot(duration, (k, t) => fx.segment('sky', from.x, from.y, to.x, to.y, color, fadeInOut(k, 0.1, 0.5), style, width, t * 3));
    },
    segment(layer, x1, y1, x2, y2, color, alpha = 1, style = 0, width = 0.6, phase = 0) {
      const dx = x2 - x1, dy = y2 - y1;
      const length = Math.hypot(dx, dy);
      if (length < 0.01) return;
      // O comprimento em pixels depende da direção; convertemos para unidades de x.
      const lenPx = Math.hypot(ux(dx), uy(dy));
      const unitPx = ux(1);
      quad(layer, 'add', SHAPE.segment, (x1 + x2) / 2, (y1 + y2) / 2, lenPx / unitPx / 2, width * (unitPx / uy(1)), color, alpha, style, lenPx / unitPx, phase, Math.atan2(uy(dy), ux(dx)));
    },
    cracks(x, y, radius, color, duration = 0.9) {
      oneShot(duration, k => {
        quad('ground', 'alpha', SHAPE.cracks, x, y, radius, radius, COLORS.shadow, 0.55 * (1 - k * 0.5), ease(k), 0, 1.3);
        quad('ground', 'add', SHAPE.cracks, x, y, radius, radius, color, 1 - k * 0.4, ease(k), 0, 1.3);
      });
    },
  };

  // Desenho imediato (chamado a cada quadro para efeitos que duram).
  const draw = {
    glow: (layer, x, y, r, color, alpha = 1) => quad(layer, 'add', SHAPE.glow, x, y, r, r, color, alpha),
    ring: (x, y, r, color, alpha = 1, thickness = 0.05, runes = 0, phase = 0) => quad('ground', 'add', SHAPE.ring, x, y, r, r, color, alpha, thickness, runes, phase),
    zone: (x, y, r, color, alpha = 1, border = 0.04, noiseScale = 6, phase = 0) => quad('ground', 'add', SHAPE.zone, x, y, r, r, color, alpha, border, noiseScale, phase),
    darkZone: (x, y, r, color, alpha = 1) => quad('ground', 'alpha', SHAPE.glow, x, y, r, r, color, alpha),
    hex: (x, y, r, color, strength = 1, seed = 0) => quad('sky', 'add', SHAPE.hex, x, y, r, r * 1.15, color, 0.9, strength, 0, seed),
    dome: (x, y, r, color, alpha = 1, pattern = 0, seed = 0) => quad('sky', 'add', SHAPE.dome, x, y - r * 0.35, r, r * 0.75, color, alpha, pattern, 0, seed),
    sigil: (layer, x, y, r, color, alpha = 1, points = 6, rot = 0) => quad(layer, 'add', SHAPE.sigil, x, y, r, r, color, alpha, 0.3, points, rot),
    crown: (x, y, size, color, alpha = 1) => quad('sky', 'add', SHAPE.crown, x, y, size, size * 0.8, color, alpha),
    star: (x, y, size, color, alpha = 1, rot = 0) => quad('sky', 'add', SHAPE.star, x, y, size, size, color, alpha, 0, 0, 0, rot),
    rune: (x, y, size, color, alpha = 1, rot = 0) => quad('sky', 'add', SHAPE.rune, x, y, size, size, color, alpha, 0, 0, 0, rot),
    wisp: (x, y, w, h, color, alpha = 1, seed = 0) => quad('sky', 'add', SHAPE.wisp, x, y, w, h, color, alpha, 0, 0, seed),
    beam: (x, y, w, h, color, alpha = 1, seed = 0) => quad('sky', 'add', SHAPE.beam, x, y - h, w, h, color, alpha, 0, 0, seed),
    segment: (layer, x1, y1, x2, y2, color, alpha = 1, style = 0, width = 0.6, phase = 0) => fx.segment(layer, x1, y1, x2, y2, color, alpha, style, width, phase),
  };

  return {
    SHAPE, COLORS, fx, draw, emit,
    get ok() { return ok; },
    get time() { return time; },
    init,
    // Começa um quadro: chamado antes de desenhar qualquer coisa.
    begin(dt, reducedMotion) {
      if (!ok && !init()) return false;
      reduced = reducedMotion;
      time += dt;
      view = computeView();
      if (!view) return false;
      for (const layer of Object.values(layers)) { layer.counts.add = 0; layer.counts.alpha = 0; }
      return true;
    },
    end(dt) {
      if (!ok || !view) return;
      stepOneShots(dt);
      stepParticles(dt);
      for (const layer of Object.values(layers)) flush(layer);
    },
    clear() { oneShots.length = 0; particles.length = 0; },
  };
})();
