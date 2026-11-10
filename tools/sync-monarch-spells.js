// Gera data/monarch-spells.js a partir de data/monarch-spells.json.
// O jogo abre por file:// (JOGAR.bat), onde fetch de JSON não funciona; por isso a cópia em JS.
// Uso: node tools/sync-monarch-spells.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', 'monarch-spells.json'), 'utf8'));
const out = `// Gerado por tools/sync-monarch-spells.js a partir de data/monarch-spells.json. Não edite à mão.\nconst MONARCH_SPELLS = ${JSON.stringify(data)};\n`;
fs.writeFileSync(path.join(root, 'data', 'monarch-spells.js'), out);
console.log(`data/monarch-spells.js: ${data.spells.length} magias + ${(data.fieldSpells || []).length} de campo`);
