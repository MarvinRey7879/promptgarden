import Link from 'next/link';
import { notFound } from 'next/navigation';
import bmDe from '@/content/benchmarks.de.json';
import bmEn from '@/content/benchmarks.en.json';
import bmEs from '@/content/benchmarks.es.json';
import bmFr from '@/content/benchmarks.fr.json';
import bmZh from '@/content/benchmarks.zh.json';
import { isLang, type Lang } from '@/lib/i18n';

type BmData = typeof bmDe;

const byLang: Record<Lang, BmData> = {
  de: bmDe,
  en: bmEn as BmData,
  es: bmEs as BmData,
  fr: bmFr as BmData,
  zh: bmZh as BmData,
};

export default async function BenchmarksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const data = byLang[lang];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 'clamp(30px,5vw,40px)', fontWeight: 800, letterSpacing: '-.03em' }}>
        {data.title}
      </h1>
      <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 15.5, maxWidth: 660, lineHeight: 1.55 }}>
        {data.intro}
      </p>
      <p style={{ margin: '0 0 26px', fontSize: 13.5 }}>
        <Link
          href={`/${lang}/lexikon/benchmarks-lesen/`}
          style={{ textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 700 }}
        >
          → {lang === 'de' ? 'Guide: Benchmarks lesen, ohne reinzufallen' : 'Guide: how to read benchmarks'}
        </Link>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
          {' '}· Stand / as of: {data.updated}
        </span>
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 18,
          paddingBottom: 40,
        }}
      >
        {data.benchmarks.map((b, i) => (
          <div
            key={b.id}
            className="card"
            style={{
              padding: '18px 22px',
              transform: `rotate(${i % 3 === 0 ? '-.3' : i % 3 === 1 ? '.25' : '0'}deg)`,
              boxShadow: '4px 4px 0 var(--ink)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-.01em' }}>
              {b.name}
            </h2>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>{b.measures}</p>
            <p className="mono" style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>{b.runBy}</p>
            {b.caveat && (
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.45 }}>
                ⚠️ {b.caveat}
              </p>
            )}
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="chip"
              style={{ alignSelf: 'flex-start', fontSize: 11.5, background: 'var(--blue)', marginTop: 'auto' }}
            >
              Live-Leaderboard ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
