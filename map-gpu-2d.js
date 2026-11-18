/* GPU map surface: the existing image remains the fallback and the source of truth. */
(() => {
  if (!window.HeritageGPU2D) return;
  const metrics = window.HeritageRenderer2D?.metrics;
  const images = [document.querySelector('.map-art'), document.querySelector('.tree-foreground')].filter(Boolean);
  const layers = [];
  function updateMetrics() {
    if (!metrics) return;
    const active = layers.filter(layer => layer.active);
    metrics.backend = active.length ? `${active.map(layer => layer.renderer.backend).join(' + ')} (mapa: ${active.length}/2 camadas); HTML/CSS (objetos)` : 'HTML/CSS (mundo)';
    metrics.drawCalls = active.length;
    metrics.gpuTextureBytes = active.reduce((total, layer) => total + layer.bytes, 0);
    window.HeritageRenderer2D.refresh();
  }
  function restore(layer) {
    layer.image.style.visibility = layer.originalVisibility;
    layer.canvas.style.visibility = 'hidden';
    layer.active = false;
    updateMetrics();
  }
  async function createLayer(image, forceGL = false) {
    const renderer = await window.HeritageGPU2D.create(forceGL ? { backend: 'webgl2' } : {});
    const canvas = renderer.canvas;
    canvas.className = image.classList.contains('map-art') ? 'gpu-map-ground' : 'gpu-map-trees';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.visibility = 'hidden';
    image.before(canvas);
    const layer = { image, renderer, canvas, active: false, texture: null, bytes: 0, revision: 0, retired: false, originalVisibility: image.style.visibility };
    layers.push(layer);
    let observer;
    function retire() {
      if (layer.retired) return;
      layer.retired = true; layer.revision++; restore(layer);
      observer?.disconnect(); image.removeEventListener('load', schedule); image.removeEventListener('error', onError);
      layer.texture?.destroy(); layer.texture = null; layer.bytes = 0;
      canvas.remove(); renderer.destroy();
      const index = layers.indexOf(layer); if (index >= 0) layers.splice(index, 1);
      updateMetrics();
    }
    function fallback(error) {
      if (layer.retired) return;
      if (metrics) { metrics.errors.push(`Mapa GPU: ${error.message}`); window.HeritageRenderer2D.refresh(); }
      if (renderer.backend === 'WebGPU') {
        retire();
        createLayer(image, true).catch(reason => {
          if (metrics) { metrics.errors.push(`Mapa WebGL 2: ${reason.message}`); window.HeritageRenderer2D.refresh(); }
        });
      } else restore(layer);
    }
    const lost = () => fallback(new Error(`${renderer.backend} perdeu o dispositivo ou contexto`));
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost(); });
    if (renderer.device) renderer.device.lost.then(lost);
    async function draw() {
      if (layer.retired) return;
      const revision = ++layer.revision;
      restore(layer);
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
      let texture;
      let scope = false;
      try {
        const width = image.naturalWidth, height = image.naturalHeight;
        if (width > renderer.maxTextureSize || height > renderer.maxTextureSize) throw new Error('Mapa excede o limite de textura da GPU');
        renderer.beginValidation(); scope = true;
        canvas.width = width; canvas.height = height;
        texture = renderer.texture(image);
        const frame = window.HeritageGPU2D.batchesFor([{ texture, x: 0, y: 0, width, height }]);
        renderer.draw(frame.data, frame.batches);
        const validation = renderer.finishValidation(); scope = false;
        await validation;
        if (revision !== layer.revision || layer.retired) { texture.destroy(); return; }
        layer.texture?.destroy(); layer.texture = texture; layer.bytes = width * height * 4;
        canvas.style.visibility = 'visible'; image.style.visibility = 'hidden'; layer.active = true;
        updateMetrics();
      } catch (error) {
        if (scope) { try { await renderer.finishValidation(); } catch {} }
        texture?.destroy();
        if (revision !== layer.revision) return;
        fallback(error);
      }
    }
    let queue = Promise.resolve();
    const schedule = () => { queue = queue.then(draw, draw); };
    const onError = () => { layer.revision++; restore(layer); };
    image.addEventListener('load', schedule);
    image.addEventListener('error', onError);
    observer = new MutationObserver(() => { layer.revision++; restore(layer); });
    observer.observe(image, { attributes: true, attributeFilter: ['src'] });
    if (image.complete) schedule();
    return layer;
  }
  for (const image of images) createLayer(image).catch(error => {
    if (metrics) { metrics.errors.push(`Inicialização do mapa GPU: ${error.message}`); window.HeritageRenderer2D.refresh(); }
  });
})();
