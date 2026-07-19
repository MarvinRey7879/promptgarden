/**
 * UX-Audit der Qualitaets-Phase (Direktive 16): misst je Seite Ladezeit,
 * Scrollhoehe auf Desktop und Handy, waagerechten Ueberlauf, Textknoten unter
 * 13 px und Klickziele unter 32 px Hoehe. Screenshots landen in data/.
 *
 * Aufruf aus dem REPO-ROOT: node research/audit-ux.mjs
 * Braucht playwright (im Scratchpad installiert).
 */
// playwright liegt nicht im Repo (kein Build-Abhaengigkeit). Wir nehmen es aus dem
// lokalen node_modules, sonst aus dem Pfad in PW_MODULES.
const { chromium } = await (async () => {
  try { return await import('playwright'); }
  catch {
    if (!process.env.PW_MODULES) throw new Error('playwright fehlt — PW_MODULES auf ein node_modules-Verzeichnis setzen');
    const basis = process.env.PW_MODULES.replace(/\\/g, '/').replace(/\/?$/, '/');
    const mod = await import(new URL('playwright/index.js', 'file:///' + basis).href);
    return mod.default ?? mod; // CommonJS-Paket: named exports liegen unter default
  }
})();
const D = 'https://promptgarten.com';
const SEITEN = [
  ['de/', 'landing'],
  ['de/lexikon/', 'lexikon'],
  ['de/lexikon/token/', 'kapitel'],
  ['de/befehle/', 'befehle-hub'],
  ['de/vergleiche/', 'vergleiche'],
  ['de/feed/', 'feed'],
  ['de/lernpfade/', 'lernpfade'],
  ['de/start/', 'start'],
];
const b = await chromium.launch();
const befunde = [];
for (const [pfad, name] of SEITEN) {
  // Desktop
  const d = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const t0 = Date.now();
  await d.goto(`${D}/${pfad}`, { waitUntil: 'networkidle' });
  const ladezeit = Date.now() - t0;
  const dHoehe = await d.evaluate(() => document.documentElement.scrollHeight);
  await d.screenshot({ path: `C:/Users/marvi/promptgarden/data/audit-${name}-desktop.png` });
  // Mobil
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(`${D}/${pfad}`, { waitUntil: 'networkidle' });
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const mHoehe = await m.evaluate(() => document.documentElement.scrollHeight);
  // Kleine Schriftgrößen und winzige Klickziele finden
  const probleme = await m.evaluate(() => {
    const out = { kleineSchrift: 0, kleineZiele: 0 };
    for (const el of document.querySelectorAll('p, li, span, a, button')) {
      // SVG-Knoten überspringen: Diagramm-Beschriftungen sind keine Tap-Ziele und
      // dürfen kleiner sein. Sie erzeugten auf /lernpfade/ 82 Fehlalarme (It. 165).
      if (el.ownerSVGElement || el.namespaceURI === 'http://www.w3.org/2000/svg') continue;
      const st = getComputedStyle(el);
      const fs = parseFloat(st.fontSize);
      if (fs > 0 && fs < 13 && el.textContent.trim().length > 20) out.kleineSchrift++;
      if (el.matches('a, button')) {
        // Links mitten im Fließtext zählen nicht: WCAG 2.5.8 nimmt sie von der
        // Mindestgröße aus, weil sie Teil eines Satzes sind (Quellenangaben z. B.).
        const imSatz = el.tagName === 'A' && st.display.startsWith('inline') && el.closest('p, li');
        const r = el.getBoundingClientRect();
        if (!imSatz && r.width > 0 && r.height > 0 && r.height < 32) out.kleineZiele++;
      }
    }
    return out;
  });
  await m.screenshot({ path: `C:/Users/marvi/promptgarden/data/audit-${name}-mobil.png` });
  befunde.push({ name, ladezeit, dHoehe, mHoehe, overflow, ...probleme });
  await d.close(); await m.close();
}
console.log('Seite'.padEnd(14), 'Laden', 'DeskH', 'MobH', 'Overflow', 'kl.Schrift', 'kl.Ziele');
for (const f of befunde) {
  console.log(f.name.padEnd(14), String(f.ladezeit).padStart(5), String(f.dHoehe).padStart(5), String(f.mHoehe).padStart(5), String(f.overflow).padStart(8), String(f.kleineSchrift).padStart(10), String(f.kleineZiele).padStart(8));
}
await b.close();
