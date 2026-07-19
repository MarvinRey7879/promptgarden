import { notFound } from 'next/navigation';
import { getFeed } from '@/lib/content';
import { isLang, langAlternates, ui } from '@/lib/i18n';

const TAG_COLORS: Record<string, string> = {
  modelle: 'var(--lime)',
  tools: 'var(--blue)',
  mcp: 'var(--yellow)',
  security: 'var(--pink)',
  papers: '#e0d4f7',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'feed/') };
}

export default async function FeedPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const items = getFeed(lang);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {t.feedTitle}
      </h1>
      <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 15.5 }}>{t.feedSub}</p>
      <p style={{ margin: '0 0 28px' }}>
        <a
          href={`/feed.${lang}.xml`}
          style={{
            display: 'inline-block',
            background: 'var(--yellow)',
            border: '2.5px solid var(--ink)',
            borderRadius: 99,
            padding: '4px 14px',
            fontSize: 13,
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '3px 3px 0 var(--ink)',
          }}
        >
          📡 RSS
        </a>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((item, i) => (
          <article
            key={item.id}
            id={item.id}
            className="card"
            style={{
              padding: '20px 24px',
              transform: `rotate(${i % 2 === 0 ? '-.25' : '.25'}deg)`,
              boxShadow: '4px 4px 0 var(--ink)',
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: TAG_COLORS[item.tag] ?? '#fff',
                  border: '2px solid var(--ink)',
                  borderRadius: 8,
                  padding: '2px 10px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                {t.feedTags[item.tag] ?? item.tag}
              </span>
              <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>
                {item.date}
              </span>
            </div>
            <h2 style={{ margin: '12px 0 8px', fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.25 }}>
              {item.title}
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{item.summary}</p>
            <p style={{ margin: '12px 0 0', fontSize: 14 }}>
              {item.sources.map((s, j) => (
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
          </article>
        ))}
      </div>
    </div>
  );
}
