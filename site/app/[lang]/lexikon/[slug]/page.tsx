import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import BodyToggle from '@/components/BodyToggle';
import ShareButtons from '@/components/ShareButtons';
import Quiz from '@/components/Quiz';
import CompleteButton from '@/components/CompleteButton';
import TokenPlayground from '@/components/TokenPlayground';
import ContextWindowDiagram from '@/components/ContextWindowDiagram';
import ExampleVideo from '@/components/ExampleVideo';
import { breadcrumbLd } from '@/lib/schema';
import Comments from '@/components/Comments';
import { getEntries, getEntry, difficultyDots } from '@/lib/content';
import { LANGS, isLang, langAlternates, ui } from '@/lib/i18n';

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
    title: `${entry.title} — promptgarten 🌱`,
    description: entry.teaser,
    openGraph: { title: entry.title, description: entry.teaser, type: 'article' },
    alternates: langAlternates(lang, `lexikon/${slug}/`),
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
  const detailHtml = entry.bodyDetail ? (marked.parse(entry.bodyDetail) as string) : null;
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
  const crumbs = breadcrumbLd(lang, [
    { name: t.nav.lexikon, path: 'lexikon/' },
    { name: entry.title, path: `lexikon/${entry.slug}/` },
  ]);

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
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

      <BodyToggle bodyHtml={bodyHtml} detailHtml={detailHtml} labelSimple={t.levelSimple} labelDetail={t.levelDetail} />

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
        <>
          <ContextWindowDiagram lang={lang} />
          {entry.slug === 'context-window' && (
            <ExampleVideo lang={lang} name="context-window" label={entry.title} />
          )}
          <TokenPlayground lang={lang} />
        </>
      )}

      {(entry.slug === 'agent-loop' || entry.slug === 'loops-fuer-agenten') && (
        <ExampleVideo lang={lang} name="loop-zyklus" label={entry.title} />
      )}

      {entry.slug === 'mixture-of-experts' && (
        <ExampleVideo lang={lang} name="moe-demo" label={entry.title} />
      )}

      {entry.slug === 'latenz-optimieren' && (
        <ExampleVideo lang={lang} name="latenz-demo" label={entry.title} />
      )}

      {entry.exercise && (
        <div className="card" style={{ padding: '18px 22px', marginTop: 26, background: 'var(--lime)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ color: 'var(--ink)' }}>
            🛠️ {t.exercise.toUpperCase()}
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>
            {entry.exercise.task}
          </p>
          <ol style={{ margin: '0 0 14px', paddingLeft: 22, fontSize: 14.5, lineHeight: 1.7 }}>
            {entry.exercise.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="kicker" style={{ color: 'var(--ink)', marginBottom: 6 }}>
            ✅ {t.selfCheck.toUpperCase()}
          </p>
          <ul style={{ margin: 0, paddingLeft: 4, fontSize: 14, lineHeight: 1.7, listStyle: 'none' }}>
            {entry.exercise.selfCheck.map((s, i) => (
              <li key={i}>☐ {s}</li>
            ))}
          </ul>
        </div>
      )}

      <Quiz lang={lang} slug={entry.slug} xp={entry.xp} quiz={entry.quiz} />

      <ShareButtons lang={lang} title={entry.title} teaser={entry.teaser} />

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
