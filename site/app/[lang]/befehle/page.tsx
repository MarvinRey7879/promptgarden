import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommands, getPlatforms } from '@/lib/commands';
import { isLang, langAlternates, ui } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'befehle/') };
}

export default async function BefehleHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const platforms = getPlatforms(lang);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {t.cmdTitle}
      </h1>
      <p style={{ margin: '0 0 28px', color: 'var(--muted)', fontSize: 15.5 }}>{t.cmdSub}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {platforms.map((p, i) => {
          const count = getCommands(lang, p.id).length;
          return (
            <Link
              key={p.id}
              href={`/${lang}/befehle/${p.id}/`}
              className="card"
              style={{
                padding: '20px 22px',
                textDecoration: 'none',
                color: 'inherit',
                transform: `rotate(${i % 2 === 0 ? '-.3' : '.3'}deg)`,
                boxShadow: '4px 4px 0 var(--ink)',
              }}
            >
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
                {p.name}
              </h2>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                {p.tagline}
              </p>
              <span className="chip mono" style={{ fontSize: 12 }}>
                {count} × /
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
