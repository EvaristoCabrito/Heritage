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
      layer.textures?.forEach(t => t.destroy()); layer.texture?.destroy(); layer.texture = null; layer.textures = null; layer.bytes = 0;
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
      const textures = [];
      let scope = false;
      try {
        const width = image.naturalWidth, height = image.naturalHeight;
        const scale = Math.min(1, renderer.maxTextureSize / width, renderer.maxTextureSize / height);
        const canvasW = Math.max(1, Math.round(width * scale)), canvasH = Math.max(1, Math.round(height * scale));
        const sprites = [];
        if (width <= renderer.maxTextureSize && height <= renderer.maxTextureSize) {
          const texture = renderer.texture(image);
          textures.push(texture);
          sprites.push({ texture, x: 0, y: 0, width: canvasW, height: canvasH });
        } else {
          const sliceH = Math.min(renderer.maxTextureSize, 2048);
          const sliceW = width <= renderer.maxTextureSize ? width : canvasW;
          for (let y = 0; y < height; y += sliceH) {
            const h = Math.min(sliceH, height - y);
            const dstY = Math.round(y * scale);
            const dstH = Math.max(1, Math.round((y + h) * scale) - dstY);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = sliceW;
            sliceCanvas.height = h;
            const ctx = sliceCanvas.getContext('2d');
            if (!ctx) throw new Error('Contexto 2D para fatia de mapa indisponível');
            ctx.drawImage(image, 0, y, width, h, 0, 0, sliceW, h);
            const texture = renderer.texture(sliceCanvas);
            textures.push(texture);
            sprites.push({ texture, x: 0, y: dstY, width: canvasW, height: dstH });
          }
        }
        renderer.beginValidation(); scope = true;
        canvas.width = canvasW; canvas.height = canvasH;
        const frame = window.HeritageGPU2D.batchesFor(sprites);
        renderer.draw(frame.data, frame.batches);
        const validation = renderer.finishValidation(); scope = false;
        await validation;
        if (revision !== layer.revision || layer.retired) { textures.forEach(t => t.destroy()); return; }
        layer.textures?.forEach(t => t.destroy()); layer.texture?.destroy();
        layer.textures = textures; layer.texture = textures[0]; layer.bytes = textures.length === 1 ? width * height * 4 : canvasW * canvasH * 4;
        canvas.style.visibility = 'visible'; image.style.visibility = 'hidden'; layer.active = true;
        updateMetrics();
      } catch (error) {
        if (scope) { try { await renderer.finishValidation(); } catch {} }
        textures.forEach(t => t.destroy());
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
