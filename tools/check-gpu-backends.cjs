// Exercita chamadas aos dois backends com dispositivos simulados; não valida drivers nem shaders reais.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('gpu-2d.js', 'utf8');

function makeGL() {
  const calls = [];
  const gl = { calls, MAX_TEXTURE_SIZE: 1, COMPILE_STATUS: 2, LINK_STATUS: 3,
    createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}), createVertexArray: () => ({}), createTexture: () => ({}),
    getShaderParameter: () => true, getProgramParameter: () => true, getParameter: () => 4096,
    isContextLost: () => false, getUniformLocation: () => ({}), getError: () => 0, NO_ERROR: 0,
  };
  for (const method of ['shaderSource', 'compileShader', 'deleteShader', 'attachShader', 'linkProgram', 'bindVertexArray', 'bindBuffer', 'enableVertexAttribArray', 'vertexAttribPointer', 'vertexAttribDivisor', 'bindTexture', 'pixelStorei', 'texParameteri', 'texImage2D', 'deleteTexture', 'viewport', 'clearColor', 'clear', 'enable', 'blendFuncSeparate', 'useProgram', 'uniform2f', 'uniform1i', 'activeTexture', 'bufferData', 'bufferSubData', 'drawArraysInstanced', 'deleteBuffer', 'deleteVertexArray', 'deleteProgram']) gl[method] = (...args) => calls.push([method, ...args]);
  return gl;
}
function makeDevice() {
  const calls = [];
  const buffer = () => ({ destroy() { calls.push(['destroyBuffer']); } });
  const pass = {};
  for (const name of ['setPipeline', 'setBindGroup', 'setVertexBuffer', 'draw', 'end']) pass[name] = (...args) => calls.push([name, ...args]);
  const device = { calls, limits: { maxTextureDimension2D: 4096 }, queue: {},
    createShaderModule: () => ({}), createRenderPipelineAsync: async () => ({ getBindGroupLayout: () => ({}) }),
    createBuffer: buffer, createBindGroup: () => ({}), createSampler: () => ({}),
    createTexture: () => ({ createView: () => ({}), destroy() { calls.push(['destroyTexture']); } }),
    createCommandEncoder: () => ({ beginRenderPass: () => pass, finish: () => ({}) }),
    pushErrorScope() {}, popErrorScope: async () => null,
    destroy() { calls.push(['destroyDevice']); },
  };
  for (const name of ['writeBuffer', 'copyExternalImageToTexture', 'submit']) device.queue[name] = (...args) => calls.push([name, ...args]);
  device.queue.onSubmittedWorkDone = async () => {};
  return device;
}
function load(navigator, getContext) {
  const window = {};
  const context = { window, navigator, document: { createElement: () => ({ width: 100, height: 100, getContext }) }, Float32Array,
    GPUBufferUsage: { UNIFORM: 1, COPY_DST: 2, VERTEX: 4 }, GPUTextureUsage: { TEXTURE_BINDING: 1, COPY_DST: 2, RENDER_ATTACHMENT: 4 } };
  vm.runInNewContext(source, context); return window.HeritageGPU2D;
}
(async () => {
  const device = makeDevice();
  const gpuContext = { configure() {}, unconfigure() {}, getCurrentTexture: () => ({ createView: () => ({}) }) };
  const api = load({ gpu: { requestAdapter: async () => ({ requestDevice: async () => device }), getPreferredCanvasFormat: () => 'rgba8unorm' } }, kind => kind === 'webgpu' ? gpuContext : null);
  const gpu = await api.create();
  assert.equal(gpu.backend, 'WebGPU');
  gpu.beginValidation();
  const texture = gpu.texture({ width: 8, height: 8 });
  const frame = api.batchesFor([{ texture, x: 1, y: 2, width: 3, height: 4 }]);
  gpu.draw(frame.data, frame.batches);
  await gpu.finishValidation();
  assert.equal(device.calls.filter(call => call[0] === 'draw').length, 1);
  assert.throws(() => gpu.texture({ width: 5000, height: 1 }), /Dimensões/);
  texture.destroy(); gpu.destroy();
  assert(device.calls.some(call => call[0] === 'destroyDevice'));

  const gl = makeGL();
  const fallback = load({ gpu: { requestAdapter: async () => { throw new Error('indisponível'); } } }, kind => kind === 'webgl2' ? gl : null);
  const renderer = await fallback.create();
  assert.equal(renderer.backend, 'WebGL 2');
  renderer.beginValidation();
  const glTexture = renderer.texture({ width: 8, height: 8 });
  const batch = fallback.batchesFor([{ texture: glTexture, x: 0, y: 0, width: 8, height: 8 }]);
  renderer.draw(batch.data, batch.batches);
  await renderer.finishValidation();
  assert.equal(gl.calls.filter(call => call[0] === 'drawArraysInstanced').length, 1);
  assert.throws(() => renderer.texture({ width: 4097, height: 1 }), /Dimensões/);
  glTexture.destroy(); renderer.destroy();
  console.log('Backends simulados: inicialização, fallback, textura, desenho e liberação verificados.');
})().catch(error => { console.error(error); process.exitCode = 1; });
