import { notFound } from 'next/navigation';
import FehlerKatalog from '@/components/FehlerKatalog';
import ShareButtons from '@/components/ShareButtons';
import { getFehler } from '@/lib/fehler';
import { isLang, langAlternates } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getFehler(lang);
  return {
    title: d.title,
    description: d.intro.slice(0, 155),
    alternates: langAlternates(lang, 'fehler/'),
  };
}

const STAND: Record<string, string> = { de: 'Stand', en: 'As of', es: 'Actualizado', fr: 'Mise à jour', zh: '数据截至' };

export default async function FehlerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getFehler(lang);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 8px', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em', textWrap: 'balance' }}>
        🩺 {d.title}
      </h1>
      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.6 }}>{d.intro}</p>
      <p className="mono" style={{ margin: '0 0 24px', fontSize: 12.5, color: 'var(--muted)' }}>
        {STAND[lang]}: {d.stand} · {d.items.length}×
      </p>

      <FehlerKatalog lang={lang} data={d} />

      <ShareButtons lang={lang} title={d.title} teaser={d.intro} />
    </div>
  );
}
