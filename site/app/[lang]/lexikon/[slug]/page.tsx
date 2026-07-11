import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Quiz from '@/components/Quiz';
import CompleteButton from '@/components/CompleteButton';
import TokenPlayground from '@/components/TokenPlayground';
import Comments from '@/components/Comments';
import { getEntries, getEntry, difficultyDots } from '@/lib/content';
import { LANGS, isLang, ui } from '@/lib/i18n';

export function generateStaticParams() {
  return LANGS.flatMap((lang) => getEntries(lang).map((e) => ({ lang, slug: e.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const entry = getEntry(lang, slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — promptgarden 🌱`,
    description: entry.teaser,
    openGraph: { title: entry.title, description: entry.teaser, type: 'article' },
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const entry = getEntry(lang, slug);
  if (!entry) notFound();
  const t = ui[lang];

  const bodyHtml = marked.parse(entry.body) as string;
  const related = entry.related
    .map((s) => getEntry(lang, s))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.teaser,
    inLanguage: lang,
    author: { '@type': 'Organization', name: 'promptgarden' },
    citation: (entry.sources ?? []).map((s) => s.url),
  };

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="chip" style={{ fontSize: 11.5 }}>
          {t.categories[entry.category]}
        </span>
        <span className="chip dots" style={{ fontSize: 11.5 }}>
          {difficultyDots(entry.difficulty)}
        </span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
          {entry.minutes} {t.minutes} · +{entry.xp} XP
        </span>
      </div>
      <h1 style={{ margin: '16px 0 6px', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>
        {entry.title}
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: 17, color: 'var(--muted)', lineHeight: 1.5 }}>
        {entry.teaser}
      </p>

      <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {entry.example && (
        <div className="card" style={{ padding: '18px 22px', marginTop: 26, background: 'var(--blue)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ color: 'var(--ink)' }}>
            {t.example.toUpperCase()}
          </p>
          <p className="mono" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {entry.example}
          </p>
        </div>
      )}

      {(entry.slug === 'token' || entry.slug === 'context-window') && (
        <TokenPlayground lang={lang} />
      )}

      <Quiz lang={lang} slug={entry.slug} xp={entry.xp} quiz={entry.quiz} />

      <div style={{ marginTop: 26 }}>
        <CompleteButton lang={lang} slug={entry.slug} xp={entry.xp} />
      </div>

      {entry.sources && entry.sources.length > 0 && (
        <div
          style={{
            marginTop: 40,
            borderTop: '2px solid var(--ink)',
            paddingTop: 18,
          }}
        >
          <p className="kicker">{t.sources.toUpperCase()}</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.7 }}>
            {entry.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}
                >
                  {s.title}
                </a>{' '}
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                  ↗ {new URL(s.url).hostname}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Comments lang={lang} />

      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <p className="kicker">{t.related.toUpperCase()}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {related.map((r) => (
              <Link key={r.slug} href={`/${lang}/lexikon/${r.slug}/`} className="chip">
                {r.title} <span className="dots">{difficultyDots(r.difficulty)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
