// Teste de integração com DOM e GPU simulados, sem executar um navegador.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const observers = [];
class ImageMock {
  constructor(kind) { this.kind = kind; this.style = {}; this.complete = true; this.naturalWidth = 80; this.naturalHeight = 60; this.events = {}; this.classList = { contains: value => value === 'map-art' && kind === 'ground' }; }
  before(canvas) { this.canvas = canvas; }
  addEventListener(name, callback) { this.events[name] = callback; }
  removeEventListener(name, callback) { if (this.events[name] === callback) delete this.events[name]; }
}
const images = [new ImageMock('ground'), new ImageMock('trees')];
const metrics = { errors: [] };
const deviceLost = [];
let failDraw = false, destroyed = 0;
const api = {
  create: async options => ({ backend: options?.backend === 'webgl2' ? 'WebGL 2' : 'WebGPU', maxTextureSize: 1024,
    device: { lost: new Promise(resolve => deviceLost.push(resolve)) },
    canvas: { style: {}, setAttribute() {}, addEventListener() {}, remove() {} },
    beginValidation() {}, finishValidation: async () => { if (failDraw) throw new Error('falha simulada'); },
    texture: () => ({ destroy() { destroyed++; } }), draw() {}, destroy() {},
  }),
  batchesFor: sprites => ({ data: new Float32Array(12), batches: [{ texture: sprites[0].texture }] }),
};
const window = { HeritageGPU2D: api, HeritageRenderer2D: { metrics, refresh() {} } };
const document = { querySelector: selector => selector === '.map-art' ? images[0] : images[1] };
class MutationObserver { constructor(callback) { this.callback = callback; observers.push(this); } observe() {} disconnect() {} }
vm.runInNewContext(fs.readFileSync('map-gpu-2d.js', 'utf8'), { window, document, MutationObserver, Promise });
const flush = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  await flush(); await flush();
  assert.equal(images[0].style.visibility, 'hidden');
  assert.equal(images[1].canvas.style.visibility, 'visible');
  assert.equal(metrics.drawCalls, 2);
  assert.equal(metrics.gpuTextureBytes, 2 * 80 * 60 * 4);
  observers[0].callback();
  assert.equal(images[0].style.visibility, undefined);
  failDraw = true;
  images[0].events.load();
  await flush(); await flush();
  assert.equal(images[0].canvas.style.visibility, 'hidden');
  assert(metrics.errors.some(error => error.includes('falha simulada')));
  failDraw = false;
  images[0].events.load();
  await flush(); await flush();
  assert.equal(images[0].style.visibility, 'hidden');
  assert(destroyed >= 2);
  assert.match(metrics.backend, /WebGL 2/);
  deviceLost[1]({ reason: 'unknown' });
  await flush(); await flush();
  assert.equal(images[1].canvas.style.visibility, 'visible');
  assert.equal(metrics.drawCalls, 2);
  assert.match(metrics.backend, /WebGL 2/);
  console.log('Mapa simulado: ativação, troca, falha, recuperação e perda do dispositivo verificadas.');
})().catch(error => { console.error(error); process.exitCode = 1; });
