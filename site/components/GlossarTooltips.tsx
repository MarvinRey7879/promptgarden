'use client';

import { useEffect } from 'react';

/**
 * Inline-Glossar-Tooltips (Ideen-Runde 5): markiert Fachbegriffe im Kapiteltext
 * (aus den vorhandenen Lexikon-Einträgen) mit gepunkteter Unterstreichung und
 * zeigt bei Hover/Fokus die Definition als Popover + Link. Rein clientseitig,
 * läuft nach der Hydration über den bereits gerenderten .prose-Inhalt; ein
 * MutationObserver wendet es nach dem 🌱/🔬-Toggle erneut an.
 */
type G = { term: string; slug: string; teaser: string };

const LATIN = /[a-zA-ZÀ-ɏ]/;
const SKIP = new Set(['A', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'SCRIPT', 'STYLE']);

export default function GlossarTooltips({ lang, glossary, max = 8 }: { lang: string; glossary: G[]; max?: number }) {
  useEffect(() => {
    if (!glossary.length) return;
    const container = document.querySelector('.prose') as HTMLElement | null;
    if (!container) return;
    const terms = glossary.filter((g) => g.term && g.term.length >= 2).sort((a, b) => b.term.length - a.term.length);
    let observer: MutationObserver | null = null;

    const apply = () => {
      const used = new Set<string>();
      let count = 0;
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          let p = node.parentElement;
          while (p && p !== container) {
            if (SKIP.has(p.tagName) || p.classList.contains('glossar-term')) return NodeFilter.FILTER_REJECT;
            p = p.parentElement;
          }
          return node.nodeValue && node.nodeValue.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      });
      const textNodes: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) textNodes.push(n as Text);

      for (const tn of textNodes) {
        if (count >= max) break;
        const text = tn.nodeValue || '';
        for (const g of terms) {
          if (count >= max) break;
          if (used.has(g.slug)) continue;
          const idx = text.toLowerCase().indexOf(g.term.toLowerCase());
          if (idx < 0) continue;
          if (LATIN.test(g.term[0])) {
            // Beide Wortgrenzen verlangen: Begriff nur als eigenständiges Wort
            // matchen. Verhindert Mitten-im-Wort-Treffer („API" in „capital")
            // UND deutsche Kompositum-Fragmente („Sicherheit" in
            // „Sicherheitsaspekte"). Hohe Präzision, dafür keine Plurale.
            const before = text[idx - 1];
            const after = text[idx + g.term.length];
            if (before && LATIN.test(before)) continue;
            if (after && LATIN.test(after)) continue;
          }
          const matchText = text.substr(idx, g.term.length);
          const rest = tn.splitText(idx); // rest beginnt beim Treffer
          rest.splitText(g.term.length); // rest = exakt der Treffer
          const span = document.createElement('span');
          span.className = 'glossar-term';
          span.setAttribute('tabindex', '0');
          span.textContent = matchText;
          const pop = document.createElement('span');
          pop.className = 'glossar-pop';
          const def = document.createElement('span');
          def.textContent = g.teaser;
          const link = document.createElement('a');
          link.href = `/${lang}/lexikon/${g.slug}/`;
          link.textContent = ' →';
          link.className = 'glossar-link';
          pop.appendChild(def);
          pop.appendChild(link);
          span.appendChild(pop);
          rest.parentNode?.replaceChild(span, rest);
          used.add(g.slug);
          count += 1;
          break; // Textknoten-Indizes haben sich verschoben — nächster Knoten
        }
      }
    };

    const run = () => {
      observer?.disconnect();
      apply();
      observer?.observe(container, { childList: true, subtree: true });
    };

    observer = new MutationObserver(() => run());
    const id = window.setTimeout(run, 300);
    return () => {
      window.clearTimeout(id);
      observer?.disconnect();
    };
  }, [lang, glossary, max]);

  return (
    <style>{`
      .glossar-term{border-bottom:1.5px dotted var(--muted);cursor:help;position:relative}
      .glossar-term:focus{outline:2px solid var(--ink);outline-offset:2px;border-radius:2px}
      .glossar-pop{display:none;position:absolute;left:0;top:1.7em;z-index:30;width:min(280px,80vw);background:#fff;color:var(--ink);border:2.5px solid var(--ink);border-radius:12px;box-shadow:5px 5px 0 var(--ink);padding:11px 13px;font-size:13px;line-height:1.55;font-weight:400;white-space:normal;text-align:left}
      .glossar-term:hover .glossar-pop,.glossar-term:focus .glossar-pop,.glossar-term:focus-within .glossar-pop{display:block}
      .glossar-link{font-weight:800;text-decoration:underline;text-underline-offset:2px}
    `}</style>
  );
}
