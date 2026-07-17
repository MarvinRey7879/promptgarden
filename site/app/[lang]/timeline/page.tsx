import { notFound } from 'next/navigation';
import tDe from '@/content/timeline.de.json';
import tEn from '@/content/timeline.en.json';
import tEs from '@/content/timeline.es.json';
import tFr from '@/content/timeline.fr.json';
import tZh from '@/content/timeline.zh.json';
import { LANGS, isLang, langAlternates, type Lang } from '@/lib/i18n';

const DATA: Record<Lang, typeof tDe> = { de: tDe, en: tEn, es: tEs, fr: tFr, zh: tZh };

const TYP_COLORS: Record<string, string> = {
  release: 'var(--lime)',
  sunset: 'var(--pink)',
  preisaenderung: 'var(--yellow)',
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = DATA[lang];
  return { title: `${d.title} — promptgarten`, description: d.intro, alternates: langAlternates(lang, 'timeline/') };
}

export default async function TimelinePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = DATA[lang];
  const heute = d.updated;
  const eintraege = [...d.eintraege].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>📊 {d.title}</h1>
      <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.5 }}>{d.intro}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 26 }}>
        {Object.entries(d.legende).map(([typ, label]) => (
          <span key={typ} className="mono" style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: TYP_COLORS[typ], border: '2px solid var(--ink)', display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>

      <div style={{ borderLeft: '4px solid var(--ink)', marginLeft: 10, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
        {eintraege.map((e) => (
          <div key={`${e.date}-${e.name}`} className="card" style={{ padding: '16px 20px', position: 'relative', boxShadow: '4px 4px 0 var(--ink)' }}>
            <span style={{ position: 'absolute', left: -38, top: 22, width: 20, height: 20, borderRadius: '50%', background: TYP_COLORS[e.typ], border: '3px solid var(--ink)' }} />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="mono" style={{ background: TYP_COLORS[e.typ], border: '2px solid var(--ink)', borderRadius: 8, padding: '2px 10px', fontSize: 12, fontWeight: 800 }}>
                {e.date}{e.date > heute ? ' ⏳' : ''}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)' }}>{e.anbieter}</span>
            </div>
            <h2 style={{ margin: '10px 0 6px', fontSize: 19, fontWeight: 800, letterSpacing: '-.01em', lineHeight: 1.3 }}>{e.name}</h2>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>{e.text}</p>
            <p style={{ margin: '10px 0 0', fontSize: 12.5 }}>
              <a href={e.source.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}>
                {e.source.title} ↗
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
