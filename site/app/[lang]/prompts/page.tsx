import { notFound } from 'next/navigation';
import pDe from '@/content/prompts.de.json';
import pEn from '@/content/prompts.en.json';
import pEs from '@/content/prompts.es.json';
import pFr from '@/content/prompts.fr.json';
import pZh from '@/content/prompts.zh.json';
import CopyButton from '@/components/CopyButton';
import ShareButtons from '@/components/ShareButtons';
import PromptSandbox from '@/components/PromptSandbox';
import { breadcrumbLd } from '@/lib/schema';
import { LANGS, isLang, langAlternates, ui, type Lang } from '@/lib/i18n';

type Source = { title: string; url: string };
type PromptLib = {
  updated: string;
  title: string;
  intro: string;
  categories: { id: string; name: string; emoji: string }[];
  items: { id: string; category: string; title: string; wann: string; prompt: string; hinweis?: string; sources: Source[] }[];
};

const byLang: Record<Lang, PromptLib> = {
  de: pDe as PromptLib,
  en: pEn as PromptLib,
  es: pEs as PromptLib,
  fr: pFr as PromptLib,
  zh: pZh as PromptLib,
};

const CAT_COLORS = ['var(--lime)', 'var(--blue)', 'var(--pink)', 'var(--yellow)', '#e8d9c3', '#fff'];

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = byLang[lang];
  return { title: `${d.title} — promptgarten 🌱`, description: d.intro, alternates: langAlternates(lang, 'prompts/') };
}

export default async function PromptsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const d = byLang[lang];
  const crumbs = breadcrumbLd(lang, [{ name: d.title, path: 'prompts/' }]);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>{d.title}</h1>
      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 15.5, maxWidth: 640 }}>{d.intro}</p>
      <p className="mono" style={{ margin: '0 0 20px', fontSize: 12, color: 'var(--muted)' }}>Stand / as of: {d.updated}</p>

      <PromptSandbox
        lang={lang}
        items={d.items.map((i) => ({ id: i.id, title: i.title, category: i.category, prompt: i.prompt }))}
      />

      {/* Kategorie-Anker */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
        {d.categories.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="chip"
            style={{ background: CAT_COLORS[i % CAT_COLORS.length], fontWeight: 700, textDecoration: 'none' }}
          >
            {c.emoji} {c.name}
          </a>
        ))}
      </div>

      {d.categories.map((c, ci) => {
        const items = d.items.filter((it) => it.category === c.id);
        return (
          <section key={c.id} id={c.id} style={{ marginBottom: 30, scrollMarginTop: 80 }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>
              {c.emoji} {c.name}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((it, i) => (
                <div key={it.id} className="card" style={{ padding: '18px 22px', transform: `rotate(${(ci + i) % 2 === 0 ? '-.25deg' : '.25deg'})`, boxShadow: '4px 4px 0 var(--ink)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: 18.5, fontWeight: 800 }}>{it.title}</h3>
                    <CopyButton text={it.prompt} lang={lang} />
                  </div>
                  <p style={{ margin: '6px 0 10px', fontSize: 13.5, color: 'var(--muted)', fontWeight: 600 }}>{it.wann}</p>
                  <pre
                    className="mono"
                    style={{
                      margin: '0 0 10px', fontSize: 12.5, lineHeight: 1.65, whiteSpace: 'pre-wrap',
                      background: 'var(--ink)', color: '#e8e0d2', borderRadius: 12, padding: '12px 16px',
                      overflowX: 'auto',
                    }}
                  >
                    {it.prompt}
                  </pre>
                  {it.hinweis && (
                    <p style={{ margin: '0 0 8px', fontSize: 12.5, background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 10, padding: '6px 10px' }}>
                      💡 {it.hinweis}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 11.5 }}>
                    {it.sources.map((s, j) => (
                      <span key={s.url}>
                        {j > 0 && ' · '}
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}>
                          {s.title} ↗
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <p style={{ fontSize: 13, color: 'var(--muted)', paddingBottom: 4 }}>
        {t.sources}: {lang === 'de'
          ? 'Vorlagen-Muster aus den verlinkten offiziellen Best-Practices; Vorlagen an dein Projekt anpassen.'
          : 'Template patterns from the linked official best practices; adapt templates to your project.'}
      </p>
      <div style={{ paddingBottom: 30 }}>
        <ShareButtons lang={lang} title={d.title} />
      </div>
    </div>
  );
}
