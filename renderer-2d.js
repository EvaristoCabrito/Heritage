/* Shared 2D GPU backend bootstrap and renderer telemetry. Gameplay DOM remains authoritative. */
(() => {
  const scene = document.getElementById('map-scene');
  if (!scene) return;
  const textureCache = new Map();
  const textureQueue = [];
  const maxConcurrentLoads = 3;
  let activeLoads = 0;
  const metrics = { backend: 'HTML/CSS (mundo)', gpuAvailability: 'verificando', fps: 0, frameMs: 0, simulationMs: null, animationMs: null, sprites: null, culled: null, drawCalls: null, particles: null, textures: 0, textureBytes: 0, resolution: '—', profile: 'não implementado', errors: [] };
  let frame = 0, last = performance.now(), frames = 0, sample = last;
  const panel = document.createElement('aside'); panel.className = 'renderer-diagnostics'; panel.hidden = true; panel.setAttribute('aria-live', 'polite'); scene.append(panel);
  function report() {
    metrics.resolution = `${scene.clientWidth} × ${scene.clientHeight} CSS px`;
    const time = value => value == null ? 'indisponível' : `${value.toFixed(2)} ms`;
    const mapMemory = metrics.gpuTextureBytes == null ? 'indisponível' : `${(metrics.gpuTextureBytes / 1048576).toFixed(1)} MiB estimados`;
    panel.textContent = `Diagnóstico 2D · ${metrics.backend}\nDisponibilidade GPU: ${metrics.gpuAvailability}\nFPS da página: ${metrics.fps} · intervalo entre frames: ${metrics.frameMs.toFixed(1)} ms\nÚltimo ciclo do jogo: ${time(metrics.simulationMs)} · atualização de animação: ${time(metrics.animationMs)}\nRenderização do navegador: indisponível\nSprites: ${metrics.sprites ?? 'indisponível'} · descartados: ${metrics.culled ?? 'indisponível'} · desenhos estáticos do mapa: ${metrics.drawCalls ?? 'indisponível'}\nPartículas: ${metrics.particles ?? 'indisponível'} · imagens no cache auxiliar: ${metrics.textures} · texturas GPU do mapa: ${mapMemory}\n${metrics.resolution} · perfil ${metrics.profile}${metrics.errors.length ? `\n${metrics.errors.at(-1)}` : ''}`;
  }
  metrics.gpuAvailability = navigator.gpu ? 'WebGPU suportado pelo navegador' : 'WebGL 2 será tentado pelo renderizador';
  function tick(now) {
    metrics.frameMs = now - last; last = now; frames++;
    if (now - sample >= 1000) { metrics.fps = Math.round(frames * 1000 / (now - sample)); frames = 0; sample = now; report(); }
    if (!document.hidden) frame = requestAnimationFrame(tick);
  }
  function resume() { if (document.hidden) { cancelAnimationFrame(frame); return; } last = sample = performance.now(); frames = 0; frame = requestAnimationFrame(tick); }
  window.addEventListener('keydown', e => { if (e.altKey && e.shiftKey && e.code === 'KeyR') { panel.hidden = !panel.hidden; report(); } });
  document.addEventListener('visibilitychange', resume);
  function pumpTextureQueue() {
    while (activeLoads < maxConcurrentLoads && textureQueue.length) {
      textureQueue.sort((a, b) => b.priority - a.priority || a.order - b.order);
      const job = textureQueue.shift();
      activeLoads++;
      Promise.resolve().then(job.run).catch(job.fail).finally(() => { activeLoads--; pumpTextureQueue(); });
    }
  }
  let textureOrder = 0;
  function loadTexture(url, priority = 0) {
    if (textureCache.has(url)) return textureCache.get(url);
    const pending = new Promise((resolve, reject) => {
      textureQueue.push({ priority, order: textureOrder++, fail(error) { textureCache.delete(url); reject(error); }, run: () => new Promise(done => {
      const image = new Image(); image.decoding = 'async';
      image.onload = async () => {
        try { await image.decode(); } catch {}
        let bitmap;
        try { bitmap = typeof createImageBitmap === 'function' ? await createImageBitmap(image) : image; }
        catch (error) { textureCache.delete(url); reject(error); done(); return; }
        const bytes = bitmap.width * bitmap.height * 4;
        metrics.textures++; metrics.textureBytes += bytes; report();
        let disposed = false;
        resolve({ image: bitmap, width: bitmap.width, height: bitmap.height, bytes, priority, dispose() { if (disposed) return; disposed = true; bitmap.close?.(); metrics.textures = Math.max(0, metrics.textures - 1); metrics.textureBytes = Math.max(0, metrics.textureBytes - bytes); textureCache.delete(url); report(); } });
        done();
      };
      image.onerror = () => { textureCache.delete(url); reject(new Error(`Falha ao carregar textura: ${url}`)); done(); };
      image.src = url;
      }) });
    });
    textureCache.set(url, pending); pumpTextureQueue(); return pending;
  }
  window.HeritageRenderer2D = Object.freeze({ metrics, textures: Object.freeze({ load: loadTexture, get size() { return textureCache.size; } }), refresh: report });
  resume();
})();
