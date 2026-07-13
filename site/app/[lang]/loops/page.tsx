import { notFound } from 'next/navigation';
import loopsDe from '@/content/loops.de.json';
import loopsEn from '@/content/loops.en.json';
import loopsEs from '@/content/loops.es.json';
import loopsFr from '@/content/loops.fr.json';
import loopsZh from '@/content/loops.zh.json';
import { isLang, langAlternates, type Lang } from '@/lib/i18n';
import { GoodBadLoopDiagram, LoopCycleDiagram, type LoopDiagramLabels } from '@/components/LoopDiagram';

type LoopsData = typeof loopsDe;

const byLang: Record<Lang, LoopsData> = {
  de: loopsDe,
  en: loopsEn as LoopsData,
  es: loopsEs as LoopsData,
  fr: loopsFr as LoopsData,
  zh: loopsZh as LoopsData,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'loops/') };
}

export default async function LoopsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const data = byLang[lang];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 'clamp(30px,5vw,40px)', fontWeight: 800, letterSpacing: '-.03em' }}>
        {data.title}
      </h1>
      <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: 15.5, maxWidth: 640, lineHeight: 1.55 }}>
        {data.intro}
      </p>
      <p
        className="mono"
        style={{
          margin: '0 0 30px',
          fontSize: 12.5,
          background: 'var(--lime)',
          border: '2px solid var(--ink)',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'inline-block',
        }}
      >
        🤖 {data.metaNote}
      </p>

      {'diagram' in data && (
        <>
          <LoopCycleDiagram t={(data as { diagram: LoopDiagramLabels }).diagram} />
          <GoodBadLoopDiagram t={(data as { diagram: LoopDiagramLabels }).diagram} />
        </>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, paddingBottom: 40 }}>
        {data.examples.map((ex, i) => {
          const isGood = ex.verdict === 'gut';
          return (
            <section
              key={ex.id}
              className="card"
              style={{
                padding: '24px 28px',
                transform: `rotate(${i % 2 === 0 ? '-.3' : '.3'}deg)`,
                borderColor: 'var(--ink)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span
                  className="chip"
                  style={{ background: isGood ? 'var(--lime)' : 'var(--pink)', fontSize: 12 }}
                >
                  {isGood ? '✅' : '❌'}
                </span>
                <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: '-.02em' }}>
                  {ex.title}
                </h2>
              </div>
              <p style={{ margin: '12px 0 16px', fontSize: 14.5, lineHeight: 1.55 }}>{ex.description}</p>

              <ol style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ex.steps.map((s) => (
                  <li key={s.label} style={{ fontSize: 14.5 }}>
                    <b>{s.good ? '' : '🚫 '}{s.label}</b>
                    <br />
                    <span style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.5 }}>{s.note}</span>
                  </li>
                ))}
              </ol>

              <div
                style={{
                  marginTop: 18,
                  background: isGood ? 'rgba(201,226,101,.35)' : 'rgba(249,197,216,.4)',
                  border: '2px solid var(--ink)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6 }}>
                  {ex.lessons.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>

              <p style={{ margin: '14px 0 0', fontSize: 12 }}>
                {ex.sources.map((s, j) => (
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
