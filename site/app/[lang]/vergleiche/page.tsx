import { notFound } from 'next/navigation';
import vglDe from '@/content/vergleiche.de.json';
import vglEn from '@/content/vergleiche.en.json';
import vglEs from '@/content/vergleiche.es.json';
import vglFr from '@/content/vergleiche.fr.json';
import vglZh from '@/content/vergleiche.zh.json';
import ScenarioPicker, { type Szenario } from '@/components/ScenarioPicker';
import PriceCalculator from '@/components/PriceCalculator';
import ModelQuadrant, { type QuadrantModel, type QuadrantZone } from '@/components/ModelQuadrant';
import ExampleVideo from '@/components/ExampleVideo';

// Vergleiche-Demo-Clip (Remotion R10) unter dem Scatter
const COMPARE_LABEL: Record<string, string> = {
  de: 'Das Diagramm in 10 Sekunden: teurer nach rechts, schlauer nach oben — und wo der Sweet Spot liegt.',
  en: 'The chart in 10 seconds: pricier to the right, smarter towards the top — and where the sweet spot sits.',
  es: 'El diagrama en 10 segundos: más caro a la derecha, más listo hacia arriba — y dónde está el punto óptimo.',
  fr: 'Le graphique en 10 secondes : plus cher à droite, plus malin vers le haut — et où se trouve le sweet spot.',
  zh: '10 秒看懂图表：越右越贵，越上越聪明——最佳选择在哪里。',
};
import { isLang, langAlternates, ui, type Lang } from '@/lib/i18n';

type Source = { title: string; url: string };
type ToolCard = {
  id: string;
  name: string;
  typ: string;
  openSource: string;
  preis: string;
  bestFor: string;
  highlights: string[];
  caveats: string[];
  sources: Source[];
};
/** v2-Schema — neue Sektionen optional, damit Build auch mit Alt-Daten läuft. */
type Vergleich = {
  updated: string;
  title: string;
  intro: string;
  picker?: { kicker: string; toolLabel: string; modellLabel: string; szenarien: Szenario[] };
  quadrant?: { title: string; intro: string; xLabel: string; yLabel: string; hinweis: string; zones: QuadrantZone[]; openLabel: string; models: QuadrantModel[] };
  ratio?: {
    title: string;
    intro: string;
    spalten: { platz: string; modell: string; index: string; blended: string; ratio: string };
    rows: { platz: number; name: string; anbieter: string; index: number; blended: string; ratio: number; open: boolean }[];
    fussnoten: string[];
  };
  modelle?: {
    title: string;
    intro: string;
    anbieter: {
      name: string;
      modelle: { name: string; positionierung: string; kontext: string; preis: string; stark: string[]; schwach: string[]; wofuer: string }[];
    }[];
    sources: Source[];
  };
  imTool?: {
    title: string;
    intro: string;
    tools: { tool: string; standard: string; empfehlungen: { aufgabe: string; wahl: string; warum: string }[]; sources: Source[] }[];
  };
  duelle?: {
    title: string;
    intro: string;
    items: {
      id: string;
      titel: string;
      frage: string;
      a: { name: string; nimm: string; beispiele: string[] };
      b: { name: string; nimm: string; beispiele: string[] };
      nichtLohnen: string;
      benchmark?: string;
      sources: Source[];
    }[];
  };
  toolsTitle?: string;
  tools: ToolCard[];
};

const byLang: Record<Lang, Vergleich> = {
  de: vglDe as Vergleich,
  en: vglEn as Vergleich,
  es: vglEs as Vergleich,
  fr: vglFr as Vergleich,
  zh: vglZh as Vergleich,
};

const PROVIDER_TILT = ['-.4deg', '.35deg', '-.3deg', '.4deg'];

function Sources({ sources }: { sources: Source[] }) {
  return (
    <p style={{ margin: 0, fontSize: 12 }}>
      {sources.map((s, j) => (
        <span key={s.url}>
          {j > 0 && ' · '}
          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}>
            {s.title} ↗
          </a>
        </span>
      ))}
    </p>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const data = byLang[lang];
  return { title: `${data.title} — promptgarten 🌱`, description: data.intro, alternates: langAlternates(lang, 'vergleiche/') };
}

export default async function VergleichePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const data = byLang[lang];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {data.title}
      </h1>
      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 15.5, maxWidth: 680 }}>{data.intro}</p>
      <p className="mono" style={{ margin: '0 0 26px', fontSize: 12, color: 'var(--muted)' }}>
        Stand / as of: {data.updated} ·{' '}
        <a href={`/${lang}/benchmarks/`} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {lang === 'de' ? 'Benchmarks-Übersicht →' : 'Benchmark overview →'}
        </a>{' '}
        ·{' '}
        <a href={`/${lang}/timeline/`} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
          📊 {lang === 'de' ? 'Modell-Timeline →' : 'Model timeline →'}
        </a>
      </p>

      {/* ① Szenario-Picker: Was willst du tun? */}
      {data.picker && (
        <ScenarioPicker
          kicker={data.picker.kicker}
          toolLabel={data.picker.toolLabel}
          modellLabel={data.picker.modellLabel}
          szenarien={data.picker.szenarien}
          lang={lang}
        />
      )}

      {/* ② Intelligenz-pro-Dollar-Scatter */}
      {data.quadrant && (
        <ModelQuadrant
          title={data.quadrant.title}
          intro={data.quadrant.intro}
          xLabel={data.quadrant.xLabel}
          yLabel={data.quadrant.yLabel}
          hinweis={data.quadrant.hinweis}
          zones={data.quadrant.zones}
          openLabel={data.quadrant.openLabel}
          models={data.quadrant.models}
        />
      )}

      {data.quadrant && (
        <div style={{ marginBottom: 30 }}>
          <ExampleVideo lang={lang} name="compare-demo" label={COMPARE_LABEL[lang]} />
        </div>
      )}

      {/* ②b Ratio-Ranking */}
      {data.ratio && (
        <div className="card" style={{ padding: '18px 22px', marginBottom: 34, background: '#fff', boxShadow: '4px 4px 0 var(--ink)' }}>
          <h3 style={{ margin: '4px 0 6px', fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>{data.ratio.title}</h3>
          <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{data.ratio.intro}</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560, fontSize: 14 }}>
              <thead>
                <tr>
                  {[data.ratio.spalten.platz, data.ratio.spalten.modell, data.ratio.spalten.index, data.ratio.spalten.blended, data.ratio.spalten.ratio].map((h) => (
                    <th key={h} style={{ textAlign: 'left', borderBottom: '3px solid var(--ink)', padding: '6px 10px', fontSize: 12.5, letterSpacing: '.05em' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.ratio.rows.map((r, i) => (
                  <tr key={r.name} style={{ background: i < 3 ? 'var(--lime)' : i % 2 ? 'var(--bg)' : '#fff' }}>
                    <td style={{ padding: '7px 10px', fontWeight: 800 }}>{r.platz}</td>
                    <td style={{ padding: '7px 10px', fontWeight: 700 }}>
                      {r.name} {r.open && <span title="Open Weights">✳</span>}
                      <span style={{ color: 'var(--muted)', fontWeight: 500 }}> · {r.anbieter}</span>
                    </td>
                    <td style={{ padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{r.index.toFixed(2)}</td>
                    <td style={{ padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{r.blended}</td>
                    <td style={{ padding: '7px 10px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{r.ratio.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul style={{ margin: '12px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            {data.ratio.fussnoten.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ③ Modelle der großen Anbieter */}
      {data.modelle && (
        <div style={{ marginBottom: 34 }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>{data.modelle.title}</h2>
          <p style={{ margin: '0 0 18px', fontSize: 14.5, color: 'var(--muted)', maxWidth: 680 }}>{data.modelle.intro}</p>
          {data.modelle.anbieter.map((a, ai) => (
            <div key={a.name} style={{ marginBottom: 18 }}>
              <p className="kicker" style={{ marginBottom: 10 }}>{a.name.toUpperCase()}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                {a.modelle.map((m) => (
                  <div key={m.name} className="card" style={{ padding: '16px 18px', transform: `rotate(${PROVIDER_TILT[ai % 4]})`, boxShadow: '3px 3px 0 var(--ink)' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>{m.name}</h3>
                    <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{m.positionierung}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span className="chip" style={{ fontSize: 10.5 }}>🧠 {m.kontext}</span>
                      <span className="chip" style={{ fontSize: 10.5, background: 'var(--yellow)' }}>💶 {m.preis}</span>
                    </div>
                    <ul style={{ margin: '0 0 8px', paddingLeft: 16, fontSize: 12.5, lineHeight: 1.55 }}>
                      {m.stark.map((s) => (
                        <li key={s}>✅ {s}</li>
                      ))}
                      {m.schwach.map((s) => (
                        <li key={s} style={{ color: 'var(--muted)' }}>⚠️ {s}</li>
                      ))}
                    </ul>
                    <p style={{ margin: 0, fontSize: 12.5, background: 'var(--lime)', border: '2px solid var(--ink)', borderRadius: 10, padding: '7px 10px', fontWeight: 700 }}>
                      → {m.wofuer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Sources sources={data.modelle.sources} />
        </div>
      )}

      {/* ③b Modell-Duelle: wann nimmst du was — konkret */}
      {data.duelle && (
        <div style={{ marginBottom: 34 }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>{data.duelle.title}</h2>
          <p style={{ margin: '0 0 18px', fontSize: 14.5, color: 'var(--muted)', maxWidth: 680 }}>{data.duelle.intro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {data.duelle.items.map((d, i) => (
              <div key={d.id} className="card" style={{ padding: '20px 24px', transform: `rotate(${i % 2 === 0 ? '-.25deg' : '.25deg'})`, boxShadow: '5px 5px 0 var(--ink)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>⚔️ {d.titel}</h3>
                  <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 700 }}>{d.frage}</span>
                </div>
                <div className="duel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, margin: '14px 0' }}>
                  {[d.a, d.b].map((side, si) => (
                    <div key={side.name} style={{ border: '2.5px solid var(--ink)', borderRadius: 14, padding: '12px 16px', background: si === 0 ? 'var(--lime)' : 'var(--blue)' }}>
                      <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800 }}>{side.name}</p>
                      <p style={{ margin: '0 0 8px', fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>{side.nimm}</p>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, lineHeight: 1.6 }}>
                        {side.beispiele.map((bsp) => (
                          <li key={bsp}>{bsp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '0 0 8px', fontSize: 13.5, background: 'var(--pink)', border: '2px solid var(--ink)', borderRadius: 10, padding: '8px 12px' }}>
                  <b>💸 {lang === 'de' ? 'Wann es sich NICHT lohnt' : lang === 'en' ? 'When it is NOT worth it' : lang === 'es' ? 'Cuándo NO merece la pena' : lang === 'fr' ? 'Quand ça ne vaut PAS le coup' : '什么时候不值得'}:</b>{' '}
                  {d.nichtLohnen}
                </p>
                {d.benchmark && (
                  <p style={{ margin: '0 0 8px', fontSize: 12.5, color: 'var(--muted)' }}>📊 {d.benchmark}</p>
                )}
                <Sources sources={d.sources} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ③c Preisrechner (Ideen-Wahl #2) */}
      <PriceCalculator lang={lang} />

      {/* ④ Im Tool: welches Modell wofür */}
      {data.imTool && (
        <div style={{ marginBottom: 34 }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>{data.imTool.title}</h2>
          <p style={{ margin: '0 0 18px', fontSize: 14.5, color: 'var(--muted)', maxWidth: 680 }}>{data.imTool.intro}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {data.imTool.tools.map((tl, i) => (
              <div key={tl.tool} className="card" style={{ padding: '18px 20px', transform: `rotate(${i % 2 === 0 ? '-.3deg' : '.3deg'})`, boxShadow: '4px 4px 0 var(--ink)' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 800 }}>{tl.tool}</h3>
                <p style={{ margin: '0 0 10px', fontSize: 12.5, color: 'var(--muted)' }}>{tl.standard}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                  {tl.empfehlungen.map((e) => (
                    <div key={e.aufgabe} style={{ border: '2px solid var(--ink)', borderRadius: 12, padding: '8px 12px', background: 'var(--bg)' }}>
                      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800 }}>{e.aufgabe}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12.5 }}>
                        <span className="mono" style={{ fontWeight: 700, background: 'var(--blue)', borderRadius: 6, padding: '1px 6px' }}>{e.wahl}</span>{' '}
                        <span style={{ color: 'var(--muted)' }}>{e.warum}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <Sources sources={tl.sources} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⑤ Tool-Karten */}
      {data.toolsTitle && (
        <h2 style={{ margin: '0 0 16px', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>{data.toolsTitle}</h2>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 22, paddingBottom: 30 }}>
        {data.tools.map((tool, i) => (
          <div key={tool.id} className="card" style={{ padding: '22px 26px', transform: `rotate(${i % 2 === 0 ? '-.3' : '.3'}deg)` }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 23, fontWeight: 800, letterSpacing: '-.02em' }}>{tool.name}</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="chip" style={{ fontSize: 11 }}>{tool.typ}</span>
              <span className="chip" style={{ fontSize: 11, background: tool.openSource === 'ja' || tool.openSource === 'yes' || tool.openSource === 'sí' || tool.openSource === 'oui' || tool.openSource === '是' ? 'var(--lime)' : 'var(--pink)' }}>
                Open Source: {tool.openSource}
              </span>
              <span className="chip" style={{ fontSize: 11, background: 'var(--yellow)' }}>{tool.preis}</span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 14.5, fontWeight: 700, lineHeight: 1.45 }}>{tool.bestFor}</p>
            <ul style={{ margin: '0 0 10px', paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6 }}>
              {tool.highlights.map((h) => (
                <li key={h}>✅ {h}</li>
              ))}
              {tool.caveats.map((c) => (
                <li key={c} style={{ color: 'var(--muted)' }}>⚠️ {c}</li>
              ))}
            </ul>
            <Sources sources={tool.sources} />
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
