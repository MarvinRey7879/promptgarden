import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommand, getCommands, getPlatform } from '@/lib/commands';
import { LANGS, isLang, langAlternates, ui } from '@/lib/i18n';
import ExampleVideo from '@/components/ExampleVideo';
import RosettaHinweis from '@/components/RosettaHinweis';
import ShareButtons from '@/components/ShareButtons';
import { breadcrumbLd, techArticleLd } from '@/lib/schema';

// Remotion-Terminal-Demos (Direktive 12) für ausgewählte Befehle: platform/slug → Video-Basename
const COMMAND_VIDEOS: Record<string, string> = {
  'claude-code/goal': 'goal-demo',
  'claude-code/loop': 'claude-loop-demo',
  'claude-code/compact': 'compact-demo',
  'claude-code/context': 'context-cmd-demo',
  'claude-code/rewind': 'rewind-demo',
  'cursor-cli/sandbox-run': 'sandbox-demo',
  'cursor-cli/plan': 'cursor-plan-demo',
  'aider/add': 'aider-add-demo',
  'codex-cli/exec': 'codex-exec-demo',
  'codex-cli/review': 'codex-review-demo',
  'antigravity-cli/print': 'agy-print-demo',
};

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    getCommands(lang).map((c) => ({ lang, platform: c.platform, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; platform: string; slug: string }>;
}) {
  const { lang, platform, slug } = await params;
  if (!isLang(lang)) return {};
  const c = getCommand(lang, platform, slug);
  if (!c) return {};
  return {
    title: `${c.name} — promptgarten 🌱`,
    description: c.summary,
    alternates: langAlternates(lang, `befehle/${platform}/${slug}/`),
  };
}

export default async function CommandPage({
  params,
}: {
  params: Promise<{ lang: string; platform: string; slug: string }>;
}) {
  const { lang, platform, slug } = await params;
  if (!isLang(lang)) notFound();
  const c = getCommand(lang, platform, slug);
  const p = getPlatform(lang, platform);
  if (!c || !p) notFound();
  const t = ui[lang];

  const crumbs = breadcrumbLd(lang, [
    { name: t.cmdTitle, path: 'befehle/' },
    { name: p.name, path: `befehle/${platform}/` },
    { name: c.name, path: `befehle/${platform}/${slug}/` },
  ]);
  const article = techArticleLd(lang, {
    headline: `${c.name} — ${p.name}`,
    description: c.summary,
    path: `befehle/${platform}/${slug}/`,
  });

  // Verwandte Befehle derselben Plattform (Bounce senken + internes Linking auf
  // Top-Landing-Seiten). Fenster ab dem nächsten Geschwister, ringförmig, sodass
  // jede Seite eine andere Auswahl zeigt — deterministisch, ohne Zufall.
  const siblings = getCommands(lang, platform);
  const cur = siblings.findIndex((x) => x.slug === slug);
  const related = [...siblings.slice(cur + 1), ...siblings.slice(0, Math.max(cur, 0))].slice(0, 12);

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <p className="kicker" style={{ margin: '0 0 4px' }}>
        <Link href={`/${lang}/befehle/`} style={{ textDecoration: 'underline' }}>{t.cmdTitle}</Link>
        {' · '}
        <Link href={`/${lang}/befehle/${platform}/`} style={{ textDecoration: 'underline' }}>{p.name}</Link>
      </p>
      <h1 className="mono" style={{ margin: '0 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.02em' }}>
        {c.name}
      </h1>
      <p style={{ margin: '0 0 22px', fontSize: 17, color: 'var(--muted)', lineHeight: 1.5 }}>{c.summary}</p>

      {(() => {
        const rest = c.what.startsWith(c.summary) ? c.what.slice(c.summary.length).trim() : c.what;
        return rest ? (
          <p style={{ margin: '0 0 24px', fontSize: 15.5, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{rest}</p>
        ) : null;
      })()}

      {COMMAND_VIDEOS[`${platform}/${slug}`] && (
        <div style={{ marginBottom: 24 }}>
          <ExampleVideo lang={lang} name={COMMAND_VIDEOS[`${platform}/${slug}`]} label={c.summary} />
        </div>
      )}

      <RosettaHinweis lang={lang} platform={platform} slug={slug} />

      {c.whenGood.length > 0 && (
        <div className="card" style={{ padding: '18px 22px', marginBottom: 18, background: 'var(--lime)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ color: 'var(--ink)' }}>✅ {t.cmdWhenGood.toUpperCase()}</p>
          {c.whenGood.map((g, i) => (
            <div key={i} style={{ marginBottom: i < c.whenGood.length - 1 ? 14 : 0 }}>
              <p style={{ margin: '0 0 4px', fontSize: 14.5, fontWeight: 800 }}>{g.title}</p>
              <p className="mono" style={{ margin: 0, fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{g.example}</p>
            </div>
          ))}
        </div>
      )}

      {c.whenBad.length > 0 && (
        <div className="card" style={{ padding: '18px 22px', marginBottom: 18, background: 'var(--pink)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ color: 'var(--ink)' }}>⛔ {t.cmdWhenBad.toUpperCase()}</p>
          {c.whenBad.map((b, i) => (
            <div key={i} style={{ marginBottom: i < c.whenBad.length - 1 ? 14 : 0 }}>
              <p style={{ margin: '0 0 4px', fontSize: 14.5, fontWeight: 800 }}>{b.title}</p>
              <p style={{ margin: '0 0 4px', fontSize: 14, lineHeight: 1.55 }}>{b.why}</p>
              <p style={{ margin: 0, fontSize: 13.5 }}>
                <b>{t.cmdAlternative}:</b> {b.alternative}
              </p>
            </div>
          ))}
        </div>
      )}

      {c.sources.length > 0 && (
        <div style={{ marginTop: 34, borderTop: '2px solid var(--ink)', paddingTop: 16 }}>
          <p className="kicker">{t.sources.toUpperCase()}</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.7 }}>
            {c.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {s.title}
                </a>{' '}
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>↗ {new URL(s.url).hostname}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {related.length > 0 && (
        <div style={{ marginTop: 34, borderTop: '2px solid var(--ink)', paddingTop: 16 }}>
          <p className="kicker">{t.cmdMore.toUpperCase()} · {p.name}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${lang}/befehle/${platform}/${r.slug}/`}
                className="mono"
                style={{
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  border: '2px solid var(--ink)', borderRadius: 8, padding: '4px 10px',
                  background: 'var(--yellow)', color: 'var(--ink)',
                }}
              >
                {r.name}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 12, fontSize: 13.5 }}>
            <Link href={`/${lang}/befehle/${platform}/`} style={{ textDecoration: 'underline' }}>
              {t.cmdAllCommands} · {p.name} →
            </Link>
          </p>
        </div>
      )}

      <ShareButtons lang={lang} title={c.name} teaser={c.summary} />
    </article>
  );
}
