// Mede apenas a busca de elementos no renderHeroes, com dados simulados.
const { performance } = require('node:perf_hooks');
for (const size of [50, 500, 2000]) {
  const nodes = Array.from({ length: size }, (_, id) => ({ dataset: { actor: String(id) } }));
  const actors = nodes.map((_, id) => ({ id }));
  function oldLookup() { return actors.map(actor => [...nodes].find(node => node.dataset.actor === String(actor.id))); }
  function newLookup() {
    const byActor = new Map();
    for (const node of nodes) if (!byActor.has(node.dataset.actor)) byActor.set(node.dataset.actor, node);
    return actors.map(actor => byActor.get(String(actor.id)));
  }
  const reference = oldLookup(), optimized = newLookup();
  if (reference.some((node, i) => node !== optimized[i])) throw Error('Resultado divergente');
  for (let i = 0; i < 5; i++) { oldLookup(); newLookup(); }
  const repeat = Math.max(10, Math.floor(10000 / size));
  function measure(fn) { const start = performance.now(); for (let i = 0; i < repeat; i++) fn(); return (performance.now() - start) / repeat; }
  const before = measure(oldLookup), after = measure(newLookup);
  console.log(JSON.stringify({ personagens: size, repeticoes: repeat, antesMs: +before.toFixed(3), depoisMs: +after.toFixed(3), relacao: +(before / after).toFixed(2) }));
}
