import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { isLang, langAlternates, ui, type Lang } from '@/lib/i18n';
import de from '@/content/addons.de.json';
import en from '@/content/addons.en.json';
import es from '@/content/addons.es.json';
import fr from '@/content/addons.fr.json';
import zh from '@/content/addons.zh.json';
import { breadcrumbLd } from '@/lib/schema';

type Addon = {
  id: string;
  name: string;
  category: string;
  official: boolean;
  stars: string | null;
  what: string;
  why: string;
  source: { title: string; url: string };
  detail?: {
    how: string;
    setup: string[];
    whenGood: { title: string; example: string }[];
    whenBad: { title: string; why: string; alternative: string }[];
    links: { title: string; url: string }[];
  };
};

const byLang: Record<Lang, { items: Addon[] }> = {
  de: de as { items: Addon[] },
  en: en as { items: Addon[] },
  es: es as { items: Addon[] },
  fr: fr as { items: Addon[] },
  zh: zh as { items: Addon[] },
};

const LANG_KEYS = ['de', 'en', 'es', 'fr', 'zh'] as const;

export function generateStaticParams() {
  // Nur Addons mit Detail-Inhalt bekommen eine Seite
  return LANG_KEYS.flatMap((lang) =>
    byLang[lang].items.filter((a) => a.detail).map((a) => ({ lang, id: a.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang)) return {};
  const a = byLang[lang].items.find((x) => x.id === id);
  if (!a) return {};
  return {
    title: `${a.name} — ${ui[lang].addonsTitle} — promptgarten 🌱`,
    description: a.what,
    alternates: langAlternates(lang, `addons/${id}/`),
  };
}

export default async function AddonDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const a = byLang[lang].items.find((x) => x.id === id);
  if (!a || !a.detail) notFound();
  const t = ui[lang];
  const howHtml = marked.parse(a.detail.how) as string;
  const crumbs = breadcrumbLd(lang, [
    { name: t.nav.addons, path: 'addons/' },
    { name: a.name, path: `addons/${a.id}/` },
  ]);

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <p className="kicker" style={{ margin: '0 0 4px' }}>
        <Link href={`/${lang}/addons/`} style={{ textDecoration: 'underline' }}>{t.addonsTitle}</Link>
        {' · '}{a.category}
      </p>
      <h1 style={{ margin: '0 0 6px', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>
        {a.name}
      </h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 14px' }}>
        {a.official && <span className="chip" style={{ fontSize: 11.5, fontWeight: 800 }}>✓ {t.addonsOfficial}</span>}
        {a.stars && <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>★ {a.stars}</span>}
      </div>
      <p style={{ margin: '0 0 22px', fontSize: 17, color: 'var(--muted)', lineHeight: 1.5 }}>{a.what}</p>

      <div className="prose" dangerouslySetInnerHTML={{ __html: howHtml }} />

      <div className="card" style={{ padding: '18px 22px', marginTop: 26, background: 'var(--blue)', boxShadow: '4px 4px 0 var(--ink)' }}>
        <p className="kicker" style={{ color: 'var(--ink)' }}>🔧 SETUP</p>
        <ol style={{ margin: 0, paddingLeft: 22, fontSize: 14.5, lineHeight: 1.75 }}>
          {a.detail.setup.map((s, i) => (
            <li key={i} style={{ whiteSpace: 'pre-wrap' }}>{s}</li>
          ))}
        </ol>
      </div>

      {a.detail.whenGood.length > 0 && (
        <div className="card" style={{ padding: '18px 22px', marginTop: 18, background: 'var(--lime)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ color: 'var(--ink)' }}>✅ {t.cmdWhenGood.toUpperCase()}</p>
          {a.detail.whenGood.map((g, i) => (
            <div key={i} style={{ marginBottom: i < a.detail!.whenGood.length - 1 ? 12 : 0 }}>
              <p style={{ margin: '0 0 4px', fontSize: 14.5, fontWeight: 800 }}>{g.title}</p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{g.example}</p>
            </div>
          ))}
        </div>
      )}

      {a.detail.whenBad.length > 0 && (
        <div className="card" style={{ padding: '18px 22px', marginTop: 18, background: 'var(--pink)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ color: 'var(--ink)' }}>⛔ {t.cmdWhenBad.toUpperCase()}</p>
          {a.detail.whenBad.map((b, i) => (
            <div key={i} style={{ marginBottom: i < a.detail!.whenBad.length - 1 ? 12 : 0 }}>
              <p style={{ margin: '0 0 4px', fontSize: 14.5, fontWeight: 800 }}>{b.title}</p>
              <p style={{ margin: '0 0 4px', fontSize: 14, lineHeight: 1.55 }}>{b.why}</p>
              <p style={{ margin: 0, fontSize: 13.5 }}><b>{t.cmdAlternative}:</b> {b.alternative}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 34, borderTop: '2px solid var(--ink)', paddingTop: 16 }}>
        <p className="kicker">{t.sources.toUpperCase()}</p>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.7 }}>
          {[a.source, ...a.detail.links].map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                {s.title}
              </a>{' '}
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>↗ {new URL(s.url).hostname}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
