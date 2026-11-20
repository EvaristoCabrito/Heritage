/* GPU primitives for the existing 2D scene. No gameplay state is stored here. */
(() => {
  const STRIDE = 12;
  const WGSL = `
struct Screen { size: vec2f, _padding: vec2f };
@group(0) @binding(0) var<uniform> screen: Screen;
@group(1) @binding(0) var image: texture_2d<f32>;
@group(1) @binding(1) var imageSampler: sampler;
struct VertexOut { @builtin(position) position: vec4f, @location(0) uv: vec2f, @location(1) color: vec4f };
@vertex fn vertex(@builtin(vertex_index) vertexId: u32, @location(0) rect: vec4f, @location(1) uvRect: vec4f, @location(2) color: vec4f) -> VertexOut {
  let corners = array<vec2f, 6>(vec2f(0,0), vec2f(1,0), vec2f(0,1), vec2f(0,1), vec2f(1,0), vec2f(1,1));
  let corner = corners[vertexId];
  let point = rect.xy + corner * rect.zw;
  var out: VertexOut;
  out.position = vec4f(point.x / screen.size.x * 2.0 - 1.0, 1.0 - point.y / screen.size.y * 2.0, 0, 1);
  out.uv = uvRect.xy + corner * uvRect.zw;
  out.color = color;
  return out;
}
@fragment fn fragment(input: VertexOut) -> @location(0) vec4f { return textureSample(image, imageSampler, input.uv) * input.color; }`;
  const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec4 rect;
layout(location=1) in vec4 uvRect;
layout(location=2) in vec4 color;
uniform vec2 screen;
out vec2 uv;
out vec4 tint;
void main() {
  vec2 corners[6] = vec2[6](vec2(0,0),vec2(1,0),vec2(0,1),vec2(0,1),vec2(1,0),vec2(1,1));
  vec2 corner = corners[gl_VertexID];
  vec2 p = rect.xy + corner * rect.zw;
  gl_Position = vec4(p.x / screen.x * 2.0 - 1.0, 1.0 - p.y / screen.y * 2.0, 0, 1);
  uv = uvRect.xy + corner * uvRect.zw;
  tint = color;
}`;
  const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D image;
in vec2 uv;
in vec4 tint;
out vec4 outputColor;
void main() { outputColor = texture(image, uv) * tint; }`;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(message || 'Falha no shader 2D');
    }
    return shader;
  }
  function createGL(canvas) {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true });
    if (!gl) throw new Error('WebGL 2 indisponível');
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX), fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Falha no pipeline 2D');
    const buffer = gl.createBuffer(), vao = gl.createVertexArray();
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (let i = 0; i < 3; i++) { gl.enableVertexAttribArray(i); gl.vertexAttribPointer(i, 4, gl.FLOAT, false, STRIDE * 4, i * 16); gl.vertexAttribDivisor(i, 1); }
    gl.bindVertexArray(null);
    let capacity = 0;
    return {
      backend: 'WebGL 2', canvas, maxTextureSize,
      beginValidation() {},
      async finishValidation() { const error = gl.getError(); if (error !== gl.NO_ERROR) throw new Error(`Erro WebGL 2: ${error}`); },
      texture(source) {
        const width = source.naturalWidth || source.width, height = source.naturalHeight || source.height;
        if (!(width > 0 && height > 0) || width > maxTextureSize || height > maxTextureSize) throw new RangeError('Dimensões de textura incompatíveis com WebGL 2');
        const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        return { handle: texture, destroy: () => gl.deleteTexture(texture) };
      },
      draw(data, batches) {
        if (gl.isContextLost()) throw new Error('Contexto WebGL 2 perdido');
        gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(program); gl.uniform2f(gl.getUniformLocation(program, 'screen'), canvas.width, canvas.height);
        gl.uniform1i(gl.getUniformLocation(program, 'image'), 0); gl.activeTexture(gl.TEXTURE0);
        gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        if (data.byteLength > capacity) { capacity = Math.max(data.byteLength, capacity * 2, 4096); gl.bufferData(gl.ARRAY_BUFFER, capacity, gl.DYNAMIC_DRAW); }
        if (data.byteLength) gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        for (const batch of batches) {
          gl.bindTexture(gl.TEXTURE_2D, batch.texture.handle);
          for (let i = 0; i < 3; i++) gl.vertexAttribPointer(i, 4, gl.FLOAT, false, STRIDE * 4, batch.start * STRIDE * 4 + i * 16);
          gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, batch.count);
        }
        gl.bindVertexArray(null);
      },
      destroy() { gl.deleteBuffer(buffer); gl.deleteVertexArray(vao); gl.deleteProgram(program); },
    };
  }

  async function createGPU(canvas, device) {
    const context = canvas.getContext('webgpu');
    if (!context) throw new Error('Contexto WebGPU indisponível');
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'premultiplied' });
    const module = device.createShaderModule({ code: WGSL });
    const pipeline = await device.createRenderPipelineAsync({ layout: 'auto', vertex: { module, entryPoint: 'vertex', buffers: [{ arrayStride: STRIDE * 4, stepMode: 'instance', attributes: [0, 1, 2].map(i => ({ shaderLocation: i, offset: i * 16, format: 'float32x4' })) }] }, fragment: { module, entryPoint: 'fragment', targets: [{ format, blend: { color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } } }] }, primitive: { topology: 'triangle-list' } });
    const uniform = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const screenGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: uniform } }] });
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });
    let buffer = null, capacity = 0;
    return {
      backend: 'WebGPU', canvas, device, maxTextureSize: device.limits.maxTextureDimension2D,
      beginValidation() { device.pushErrorScope('validation'); device.pushErrorScope('out-of-memory'); },
      async finishValidation() {
        const memoryError = await device.popErrorScope();
        const validationError = await device.popErrorScope();
        if (memoryError || validationError) throw new Error((memoryError || validationError).message);
        await device.queue.onSubmittedWorkDone();
      },
      texture(source) {
        const width = source.naturalWidth || source.width, height = source.naturalHeight || source.height;
        if (!(width > 0 && height > 0) || width > device.limits.maxTextureDimension2D || height > device.limits.maxTextureDimension2D) throw new RangeError('Dimensões de textura incompatíveis com WebGPU');
        const texture = device.createTexture({ size: [width, height], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
        device.queue.copyExternalImageToTexture({ source }, { texture }, [width, height]);
        const group = device.createBindGroup({ layout: pipeline.getBindGroupLayout(1), entries: [{ binding: 0, resource: texture.createView() }, { binding: 1, resource: sampler }] });
        return { handle: texture, group, destroy: () => texture.destroy() };
      },
      draw(data, batches) {
        if (data.byteLength > capacity || !buffer) { buffer?.destroy(); capacity = Math.max(data.byteLength, capacity * 2, 4096); buffer = device.createBuffer({ size: capacity, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST }); }
        if (data.byteLength) device.queue.writeBuffer(buffer, 0, data);
        device.queue.writeBuffer(uniform, 0, new Float32Array([canvas.width, canvas.height, 0, 0]));
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({ colorAttachments: [{ view: context.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 0 } }] });
        pass.setPipeline(pipeline); pass.setBindGroup(0, screenGroup); pass.setVertexBuffer(0, buffer);
        for (const batch of batches) { pass.setBindGroup(1, batch.texture.group); pass.draw(6, batch.count, 0, batch.start); }
        pass.end(); device.queue.submit([encoder.finish()]);
      },
      destroy() { buffer?.destroy(); uniform.destroy(); context.unconfigure(); device.destroy(); },
    };
  }

  async function create(options = {}) {
    const errors = [];
    if (options.backend !== 'webgl2' && navigator.gpu) {
      let device;
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error('Adaptador WebGPU indisponível');
        const maxDim = adapter.limits?.maxTextureDimension2D;
        device = await (Number.isFinite(maxDim) && maxDim > 0
          ? adapter.requestDevice({ requiredLimits: { maxTextureDimension2D: maxDim } })
          : adapter.requestDevice());
        return await createGPU(document.createElement('canvas'), device);
      } catch (error) { device?.destroy(); errors.push(`WebGPU: ${error.message}`); }
    } else if (options.backend !== 'webgl2') errors.push('WebGPU indisponível');
    if (options.backend === 'webgpu') throw new Error(errors.join('; '));
    try { return createGL(document.createElement('canvas')); }
    catch (error) { errors.push(`WebGL 2: ${error.message}`); throw new Error(errors.join('; ')); }
  }

  // Consecutive textures form batches; reordering translucent sprites is forbidden.
  function batchesFor(sprites) {
    const data = new Float32Array(sprites.length * STRIDE), batches = [];
    sprites.forEach((sprite, index) => {
      data.set([sprite.x, sprite.y, sprite.width, sprite.height, ...(sprite.uv || [0, 0, 1, 1]), ...(sprite.color || [1, 1, 1, 1])], index * STRIDE);
      const previous = batches[batches.length - 1];
      if (previous && previous.texture === sprite.texture) previous.count++;
      else batches.push({ texture: sprite.texture, start: index, count: 1 });
    });
    return { data, batches };
  }
  // Coordinates and extents are in world pixels; queries preserve insertion order.
  class SpatialIndex {
    constructor(cellSize = 256) {
      if (!(cellSize > 0)) throw new RangeError('Tamanho de célula inválido');
      this.cellSize = cellSize; this.cells = new Map(); this.entries = new Map(); this.nextOrder = 0;
    }
    keys(rect) {
      if (![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0) return [];
      const keys = [], s = this.cellSize;
      const x0 = Math.floor(rect.x / s), x1 = Math.ceil((rect.x + rect.width) / s) - 1;
      const y0 = Math.floor(rect.y / s), y1 = Math.ceil((rect.y + rect.height) / s) - 1;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) keys.push(`${x},${y}`);
      return keys;
    }
    set(id, rect, value) {
      const old = this.entries.get(id), order = old ? old.order : this.nextOrder++;
      this.delete(id);
      const entry = { id, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, value, order, keys: this.keys(rect) };
      this.entries.set(id, entry);
      for (const key of entry.keys) { let cell = this.cells.get(key); if (!cell) this.cells.set(key, cell = new Set()); cell.add(entry); }
    }
    delete(id) {
      const entry = this.entries.get(id); if (!entry) return false;
      for (const key of entry.keys) { const cell = this.cells.get(key); cell.delete(entry); if (!cell.size) this.cells.delete(key); }
      this.entries.delete(id); return true;
    }
    query(rect) {
      const found = new Set();
      for (const key of this.keys(rect)) for (const entry of this.cells.get(key) || []) {
        const r = entry.rect;
        if (r.x < rect.x + rect.width && r.x + r.width > rect.x && r.y < rect.y + rect.height && r.y + r.height > rect.y) found.add(entry);
      }
      return Array.from(found).sort((a, b) => a.order - b.order).map(entry => entry.value);
    }
    clear() { this.cells.clear(); this.entries.clear(); }
  }
  class ParticlePool {
    constructor(limit) {
      if (!Number.isInteger(limit) || limit < 0) throw new RangeError('Limite de partículas inválido');
      this.items = Array.from({ length: limit }, () => ({ active: false })); this.active = 0;
    }
    emit(properties) {
      if (!(properties.life > 0)) return null;
      const particle = this.items.find(item => !item.active); if (!particle) return null;
      Object.assign(particle, { x: 0, y: 0, vx: 0, vy: 0, scale: 1, opacity: 1, color: [1, 1, 1, 1] }, properties, { active: true, age: 0 });
      this.active++; return particle;
    }
    update(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return;
      for (const particle of this.items) if (particle.active) {
        particle.age += seconds;
        if (particle.age >= particle.life) { particle.active = false; this.active--; continue; }
        particle.x += particle.vx * seconds; particle.y += particle.vy * seconds;
      }
    }
    clear() { for (const particle of this.items) particle.active = false; this.active = 0; }
  }
  class Camera2D {
    constructor(x = 0, y = 0, zoom = 1) { this.set(x, y, zoom); }
    set(x, y, zoom) {
      if (![x, y, zoom].every(Number.isFinite) || zoom <= 0) throw new RangeError('Câmera 2D inválida');
      this.x = x; this.y = y; this.zoom = zoom;
    }
    toScreen(x, y) { return { x: x * this.zoom + this.x, y: y * this.zoom + this.y }; }
    toWorld(x, y) { return { x: (x - this.x) / this.zoom, y: (y - this.y) / this.zoom }; }
    visible(width, height) {
      const origin = this.toWorld(0, 0);
      return { x: origin.x, y: origin.y, width: width / this.zoom, height: height / this.zoom };
    }
  }
  class Scene2D {
    constructor(cellSize) { this.index = new SpatialIndex(cellSize); this.sprites = new Map(); this.order = 0; }
    set(id, sprite) {
      const old = this.sprites.get(id);
      const entry = { ...sprite, id, sequence: old ? old.sequence : this.order++ };
      this.sprites.set(id, entry); this.index.set(id, entry, entry);
    }
    delete(id) { this.index.delete(id); return this.sprites.delete(id); }
    clear() { this.index.clear(); this.sprites.clear(); }
    visible(camera, width, height) {
      return this.index.query(camera.visible(width, height))
        .sort((a, b) => (a.layer || 0) - (b.layer || 0) || a.sequence - b.sequence)
        .map(sprite => ({ ...sprite, x: sprite.x * camera.zoom + camera.x, y: sprite.y * camera.zoom + camera.y, width: sprite.width * camera.zoom, height: sprite.height * camera.zoom }));
    }
  }
  class TextureStore {
    constructor(renderer, budgetBytes) {
      if (!Number.isFinite(budgetBytes) || budgetBytes < 0) throw new RangeError('Orçamento de texturas inválido');
      this.renderer = renderer; this.budgetBytes = budgetBytes; this.bytes = 0; this.entries = new Map(); this.clock = 0;
    }
    acquire(key, source) {
      let entry = this.entries.get(key);
      if (!entry) {
        const width = source.naturalWidth || source.width, height = source.naturalHeight || source.height;
        const bytes = width * height * 4;
        if (!Number.isSafeInteger(bytes) || bytes <= 0) throw new RangeError('Dimensões de textura inválidas');
        this.evict(bytes);
        if (this.bytes + bytes > this.budgetBytes) throw new RangeError('Orçamento de texturas excedido');
        entry = { texture: this.renderer.texture(source), bytes, refs: 0, used: 0 };
        this.entries.set(key, entry); this.bytes += bytes;
      }
      entry.refs++; entry.used = ++this.clock; return entry.texture;
    }
    release(key) {
      const entry = this.entries.get(key);
      if (!entry || entry.refs === 0) return false;
      entry.refs--; entry.used = ++this.clock; return true;
    }
    evict(required = 0) {
      const candidates = Array.from(this.entries, ([key, value]) => ({ key, ...value })).filter(item => !item.refs).sort((a, b) => a.used - b.used);
      for (const entry of candidates) {
        if (this.bytes + required <= this.budgetBytes) break;
        entry.texture.destroy(); this.entries.delete(entry.key); this.bytes -= entry.bytes;
      }
    }
    destroy() { for (const entry of this.entries.values()) entry.texture.destroy(); this.entries.clear(); this.bytes = 0; }
  }
  // Time is provided by the caller so animation is independent of frame rate.
  class Animation2D {
    constructor(frames, secondsPerFrame, loop = true) {
      if (!Array.isArray(frames) || !frames.length || !Number.isFinite(secondsPerFrame) || secondsPerFrame <= 0) throw new RangeError('Sequência de animação inválida');
      this.frames = frames; this.secondsPerFrame = secondsPerFrame; this.loop = loop; this.elapsed = 0;
    }
    advance(seconds) { if (Number.isFinite(seconds) && seconds > 0) this.elapsed += seconds; return this.frame; }
    get frame() {
      const frame = Math.floor(this.elapsed / this.secondsPerFrame);
      return this.frames[this.loop ? frame % this.frames.length : Math.min(frame, this.frames.length - 1)];
    }
    reset() { this.elapsed = 0; }
  }
  const profiles = Object.freeze({
    Ultra: Object.freeze({ resolutionScale: 1, particleLimit: 4000, textureBudget: 512 * 1024 * 1024 }),
    High: Object.freeze({ resolutionScale: 1, particleLimit: 2000, textureBudget: 256 * 1024 * 1024 }),
    Balanced: Object.freeze({ resolutionScale: 0.85, particleLimit: 1000, textureBudget: 128 * 1024 * 1024 }),
    Performance: Object.freeze({ resolutionScale: 0.7, particleLimit: 400, textureBudget: 64 * 1024 * 1024 }),
  });
  window.HeritageGPU2D = Object.freeze({ create, batchesFor, SpatialIndex, ParticlePool, Camera2D, Scene2D, TextureStore, Animation2D, profiles });
})();
