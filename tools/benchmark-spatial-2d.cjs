// Microbenchmark de consultas espaciais em Node; não mede FPS nem GPU.
const fs = require('node:fs');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const window = {};
vm.runInNewContext(fs.readFileSync('gpu-2d.js', 'utf8'), { window, Float32Array });
const { SpatialIndex } = window.HeritageGPU2D;
let seed = 1234567;
function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
const sprites = Array.from({ length: 10000 }, (_, id) => ({ id, x: random() * 10000, y: random() * 10000, width: 25 + random() * 75, height: 25 + random() * 75 }));
const views = Array.from({ length: 200 }, () => ({ x: random() * 9000, y: random() * 9000, width: 1000, height: 800 }));
const intersects = (r, v) => r.x < v.x + v.width && r.x + r.width > v.x && r.y < v.y + v.height && r.y + r.height > v.y;
const beginBuild = performance.now();
const index = new SpatialIndex(256);
for (const sprite of sprites) index.set(sprite.id, sprite, sprite);
const buildMs = performance.now() - beginBuild;
function run(fn) {
  const start = performance.now();
  const results = views.map(fn);
  return { ms: performance.now() - start, results };
}
for (let i = 0; i < 3; i++) { run(view => sprites.filter(sprite => intersects(sprite, view))); run(view => index.query(view)); }
const naive = run(view => sprites.filter(sprite => intersects(sprite, view)));
const indexed = run(view => index.query(view));
for (let i = 0; i < views.length; i++) {
  const expected = naive.results[i].map(sprite => sprite.id);
  const actual = indexed.results[i].map(sprite => sprite.id);
  if (expected.length !== actual.length || expected.some((id, n) => id !== actual[n])) throw new Error(`Consulta divergente ${i}`);
}
console.log(JSON.stringify({ sprites: sprites.length, consultas: views.length, construcaoIndiceMs: +buildMs.toFixed(2), buscaLinearMs: +naive.ms.toFixed(2), buscaIndexadaMs: +indexed.ms.toFixed(2), relacao: +(naive.ms / indexed.ms).toFixed(2), mediaVisiveis: +(naive.results.reduce((n, list) => n + list.length, 0) / views.length).toFixed(1) }, null, 2));
