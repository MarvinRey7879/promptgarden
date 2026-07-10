import { notFound } from 'next/navigation';
import vglDe from '@/content/vergleiche.de.json';
import vglEn from '@/content/vergleiche.en.json';
import vglEs from '@/content/vergleiche.es.json';
import vglFr from '@/content/vergleiche.fr.json';
import vglZh from '@/content/vergleiche.zh.json';
import { isLang, ui, type Lang } from '@/lib/i18n';

type Vergleich = typeof vglDe;

const byLang: Record<Lang, Vergleich> = {
  de: vglDe,
  en: vglEn as Vergleich,
  es: vglEs as Vergleich,
  fr: vglFr as Vergleich,
  zh: vglZh as Vergleich,
};

export default async function VergleichePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const data = byLang[lang];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {data.title}
      </h1>
      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 15.5, maxWidth: 640 }}>
        {data.intro}
      </p>
      <p className="mono" style={{ margin: '0 0 26px', fontSize: 12, color: 'var(--muted)' }}>
        Stand / as of: {data.updated}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 22,
          paddingBottom: 30,
        }}
      >
        {data.tools.map((tool, i) => (
          <div
            key={tool.id}
            className="card"
            style={{
              padding: '22px 26px',
              transform: `rotate(${i % 2 === 0 ? '-.3' : '.3'}deg)`,
            }}
          >
            <h2 style={{ margin: '0 0 10px', fontSize: 23, fontWeight: 800, letterSpacing: '-.02em' }}>
              {tool.name}
            </h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="chip" style={{ fontSize: 11 }}>{tool.typ}</span>
              <span
                className="chip"
                style={{
                  fontSize: 11,
                  background: tool.openSource === 'ja' || tool.openSource === 'yes' ? 'var(--lime)' : 'var(--pink)',
                }}
              >
                Open Source: {tool.openSource}
              </span>
              <span className="chip" style={{ fontSize: 11, background: 'var(--yellow)' }}>
                {tool.preis}
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 14.5, fontWeight: 700, lineHeight: 1.45 }}>
              {tool.bestFor}
            </p>
            <ul style={{ margin: '0 0 10px', paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6 }}>
              {tool.highlights.map((h) => (
                <li key={h}>✅ {h}</li>
              ))}
              {tool.caveats.map((c) => (
                <li key={c} style={{ color: 'var(--muted)' }}>⚠️ {c}</li>
              ))}
            </ul>
            <p style={{ margin: 0, fontSize: 12 }}>
              {tool.sources.map((s, j) => (
                <span key={s.url}>
                  {j > 0 && ' · '}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}
                  >
                    {s.title} ↗
                  </a>
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted)', paddingBottom: 30 }}>
        {t.sources}: {lang === 'de'
          ? 'Alle Angaben aus den verlinkten offiziellen Quellen; gemeldete Fehler korrigiert die Loop. 🐛-Button unten rechts.'
          : 'All claims come from the linked official sources; the loop fixes reported errors. 🐛 button bottom right.'}
      </p>
    </div>
  );
}
