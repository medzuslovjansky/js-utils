const fs = require('fs');

const pronounFile = './src/pronoun/declensionPronoun.ts';
let pContent = fs.readFileSync(pronounFile, 'utf8');
pContent = pContent.replace(/nom: \['jejin', 'jejna', 'jejno'/g, "nom: ['jejin', 'jejno', 'jejna'");
pContent = pContent.replace(/acc: \['jejnogo \/ jejin', 'jejnu', 'jejnogo \/ jejno'/g, "acc: ['jejnogo / jejin', 'jejno', 'jejnu'");
fs.writeFileSync(pronounFile, pContent);

const numeralFile = './src/numeral/declensionNumeral.ts';
let nContent = fs.readFileSync(numeralFile, 'utf8');
nContent = nContent.replace(/\['masculine', 'feminine\/neuter'\]/g, "['masculine/neuter', 'feminine']");
fs.writeFileSync(numeralFile, nContent);

console.log('Fixed pronoun and numeral src files in locally cloned js-utils');
