import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommand, getCommands, getPlatform } from '@/lib/commands';
import { LANGS, isLang, langAlternates, ui } from '@/lib/i18n';

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

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0' }}>
      <p className="kicker" style={{ margin: '0 0 4px' }}>
        <Link href={`/${lang}/befehle/`} style={{ textDecoration: 'underline' }}>{t.cmdTitle}</Link>
        {' · '}
        <Link href={`/${lang}/befehle/${platform}/`} style={{ textDecoration: 'underline' }}>{p.name}</Link>
      </p>
      <h1 className="mono" style={{ margin: '0 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.02em' }}>
        {c.name}
      </h1>
      <p style={{ margin: '0 0 22px', fontSize: 17, color: 'var(--muted)', lineHeight: 1.5 }}>{c.summary}</p>

      <p style={{ margin: '0 0 24px', fontSize: 15.5, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{c.what}</p>

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
    </article>
  );
}
