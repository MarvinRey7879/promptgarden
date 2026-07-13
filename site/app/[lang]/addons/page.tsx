import { notFound } from 'next/navigation';
import { isLang, ui, type Lang } from '@/lib/i18n';
import de from '@/content/addons.de.json';
import en from '@/content/addons.en.json';
import es from '@/content/addons.es.json';
import fr from '@/content/addons.fr.json';
import zh from '@/content/addons.zh.json';

type Addon = {
  id: string;
  name: string;
  category: string;
  official: boolean;
  stars: string | null;
  what: string;
  why: string;
  source: { title: string; url: string };
};

const byLang: Record<Lang, { items: Addon[] }> = {
  de: de as { items: Addon[] },
  en: en as { items: Addon[] },
  es: es as { items: Addon[] },
  fr: fr as { items: Addon[] },
  zh: zh as { items: Addon[] },
};

const CAT_COLORS: Record<string, string> = {
  MCP: 'var(--yellow)',
  Obsidian: '#e0d4f7',
  Editor: 'var(--blue)',
  Browser: 'var(--pink)',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: `${ui[lang].addonsTitle} — promptgarten 🌱`, description: ui[lang].addonsSub };
}

export default async function AddonsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const items = byLang[lang].items;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {t.addonsTitle}
      </h1>
      <p style={{ margin: '0 0 28px', color: 'var(--muted)', fontSize: 15.5 }}>{t.addonsSub}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {items.map((a, i) => (
          <article
            key={a.id}
            className="card"
            style={{
              padding: '18px 20px',
              transform: `rotate(${i % 2 === 0 ? '-.25' : '.25'}deg)`,
              boxShadow: '4px 4px 0 var(--ink)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <span
                style={{
                  background: CAT_COLORS[a.category] ?? 'var(--lime)',
                  border: '2px solid var(--ink)',
                  borderRadius: 8,
                  padding: '1px 8px',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.05em',
                }}
              >
                {a.category}
              </span>
              {a.official && (
                <span className="chip" style={{ fontSize: 11, fontWeight: 800 }}>
                  ✓ {t.addonsOfficial}
                </span>
              )}
              {a.stars && (
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  ★ {a.stars}
                </span>
              )}
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.2 }}>
              {a.name}
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.55 }}>{a.what}</p>
            <p style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>{a.why}</p>
            <p style={{ margin: 'auto 0 0', fontSize: 12.5 }}>
              <a
                href={a.source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                {a.source.title} ↗
              </a>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
