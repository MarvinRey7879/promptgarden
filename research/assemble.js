const de = require('./gen_de.js');
const en = require('./gen_en.js');
const fs = require('fs');

const targetSlugs = ["api","erst-plan-dann-code","hermes","openclaw","modell-lifecycle","vibe-coding-sicherheit","claude-code-installieren","modell-und-plan-wahl","git-github-basics","agent-festgefahren","projekt-deployen","rag","embeddings","fine-tuning","prompt-injection","structured-outputs","evals","git-worktrees","hooks","multi-agent-patterns","kontext-strategien"];

function checkSet(arr, label) {
  const slugs = arr.map(e => e.slug);
  if (slugs.length !== 21) throw new Error(label + ' count != 21: ' + slugs.length);
  const missing = targetSlugs.filter(s => !slugs.includes(s));
  if (missing.length) throw new Error(label + ' missing: ' + missing.join(','));
  const dupes = slugs.filter((s,i) => slugs.indexOf(s) !== i);
  if (dupes.length) throw new Error(label + ' dupes: ' + dupes.join(','));
}
checkSet(de, 'DE');
checkSet(en, 'EN');

const out = { de, en };
fs.writeFileSync('C:/Users/marvi/promptgarden/research/bodydetail-batch3.json', JSON.stringify(out, null, 2));
console.log('Written. DE:', de.length, 'EN:', en.length);
