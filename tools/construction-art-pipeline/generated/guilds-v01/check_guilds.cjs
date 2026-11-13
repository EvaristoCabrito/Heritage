const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const input=fs.readFileSync('app.js','utf8').split('\ninit();')[0];
vm.runInNewContext(input + `
let count=0;
for (const [type, levels] of Object.entries(GUILD_BUILDING_ART)) {
  const building={type,tier:0};
  const base=siteArt(building);
  for (const stage of ['early','mid',null]) assert.ok(exists(buildingImage(base,stage)),type+' '+stage);
  for (let tier=1;tier<levels.length;tier++) {
    const choices=typeof levels[tier]==='string' ? [[null,levels[tier]]] : Object.entries(levels[tier]);
    for (const [branch,target] of choices) {
      building.tier=tier-1;
      building.guildForm=null;
      building.branch=null;
      building.pendingUpgrade={kind:'guild',tier:tier-1,branch};
      const art=siteArt(building);
      assert.equal(buildingImage(art,'early',building),buildingImage(art));
      const mid=buildingImage(art,'mid',building);
      assert.ok(mid.endsWith('/'+target+'-mid.webp') && exists(mid),mid);
      building.tier=tier;
      building.guildForm=branch;
      assert.equal(siteArt(building),target);
      assert.ok(exists(buildingImage(target)),target);
      count++;
    }
  }
}
console.log('8 sedes e '+count+' variantes de melhoria verificadas no renderizador.');
`,{window:{},Audio:class{addEventListener(){}},console,assert,exists:fs.existsSync});
