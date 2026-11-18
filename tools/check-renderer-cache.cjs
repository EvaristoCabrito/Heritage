// Exercita o carregador sem navegador nem acesso à rede.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const pending = [];
class FakeImage {
  constructor() { this.width = 10; this.height = 20; }
  decode() { return Promise.resolve(); }
  set src(value) { this.url = value; pending.push(this); }
}
const scene = { clientWidth: 100, clientHeight: 100, append() {} };
const panel = { setAttribute() {} };
const document = {
  hidden: false,
  getElementById: () => scene,
  createElement: name => name === 'aside' ? panel : { getContext: () => null },
  addEventListener() {},
};
const window = { addEventListener() {} };
const context = { document, window, navigator: {}, Image: FakeImage, performance: { now: () => 0 }, requestAnimationFrame: () => 1, cancelAnimationFrame() {}, console };
vm.runInNewContext(fs.readFileSync('renderer-2d.js', 'utf8'), context);
const cache = window.HeritageRenderer2D.textures;
const flush = () => new Promise(resolve => setImmediate(resolve));

(async () => {
  const a = cache.load('a');
  assert.equal(cache.load('a'), a, 'carregamentos duplicados compartilham a mesma promessa');
  const b = cache.load('b');
  const c = cache.load('c');
  const low = cache.load('low', 0);
  const high = cache.load('high', 10);
  await flush();
  assert.deepEqual(pending.map(image => image.url), ['a', 'b', 'c']);
  pending[0].onload();
  await a;
  await flush();
  assert.equal(pending[3].url, 'high', 'a fila escolhe a prioridade maior');
  pending[1].onload(); pending[2].onload(); pending[3].onload();
  await Promise.all([b, c, high]);
  await flush();
  assert.equal(pending[4].url, 'low');
  pending[4].onload();
  const texture = await low;
  assert.equal(window.HeritageRenderer2D.metrics.textureBytes, 5 * 10 * 20 * 4);
  texture.dispose(); texture.dispose();
  assert.equal(window.HeritageRenderer2D.metrics.textures, 4);
  const failed = cache.load('failed');
  await flush();
  pending[5].onerror();
  await assert.rejects(failed);
  assert.equal(cache.size, 4);
  console.log('Cache de imagens: deduplicação, limite, prioridade, descarte e falha verificados.');
})().catch(error => { console.error(error); process.exitCode = 1; });
