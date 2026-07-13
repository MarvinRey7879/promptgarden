import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommands, getPlatform, getPlatforms } from '@/lib/commands';
import { LANGS, isLang, langAlternates, ui } from '@/lib/i18n';

export function generateStaticParams() {
  return LANGS.flatMap((lang) => getPlatforms(lang).map((p) => ({ lang, platform: p.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; platform: string }>;
}) {
  const { lang, platform } = await params;
  if (!isLang(lang)) return {};
  const p = getPlatform(lang, platform);
  if (!p) return {};
  return {
    title: `${p.name} — ${ui[lang].cmdTitle} — promptgarten 🌱`,
    description: p.tagline,
    alternates: langAlternates(lang, `befehle/${platform}/`),
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ lang: string; platform: string }>;
}) {
  const { lang, platform } = await params;
  if (!isLang(lang)) notFound();
  const p = getPlatform(lang, platform);
  if (!p) notFound();
  const t = ui[lang];
  const commands = getCommands(lang, platform);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <p className="kicker" style={{ margin: '30px 0 4px' }}>
        <Link href={`/${lang}/befehle/`} style={{ textDecoration: 'underline' }}>
          {t.cmdTitle}
        </Link>
      </p>
      <h1 style={{ margin: '0 0 6px', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em' }}>
        {p.name}
      </h1>
      <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 15.5 }}>{p.tagline}</p>
      <p style={{ margin: '0 0 26px', fontSize: 12.5 }}>
        <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}>
          {new URL(p.docsUrl).hostname} ↗
        </a>
      </p>

      <p className="kicker">{t.cmdAllCommands.toUpperCase()} · {commands.length}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {commands.map((c) => (
          <Link
            key={c.slug}
            href={`/${lang}/befehle/${platform}/${c.slug}/`}
            className="card"
            style={{ padding: '14px 18px', textDecoration: 'none', color: 'inherit', boxShadow: '3px 3px 0 var(--ink)' }}
          >
            <span className="mono" style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</span>
            <span style={{ marginLeft: 12, fontSize: 14, color: 'var(--muted)' }}>{c.summary}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
