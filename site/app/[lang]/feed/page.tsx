import { notFound } from 'next/navigation';
import { getFeed } from '@/lib/content';
import { isLang, langAlternates, ui } from '@/lib/i18n';
import FeedListe from '@/components/FeedListe';

// Beschriftung des Alle-Filters ueber der Meldungsliste
const ALLE_LABEL: Record<string, string> = {
  de: 'Alle',
  en: 'All',
  es: 'Todas',
  fr: 'Toutes',
  zh: '全部',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'feed/') };
}

export default async function FeedPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const items = getFeed(lang);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {t.feedTitle}
      </h1>
      <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 15.5 }}>{t.feedSub}</p>
      <p style={{ margin: '0 0 28px' }}>
        <a
          href={`/feed.${lang}.xml`}
          style={{
            display: 'inline-block',
            background: 'var(--yellow)',
            border: '2.5px solid var(--ink)',
            borderRadius: 99,
            padding: '4px 14px',
            fontSize: 13,
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '3px 3px 0 var(--ink)',
          }}
        >
          📡 RSS
        </a>
      </p>

      <FeedListe items={items} tagLabels={t.feedTags} alleLabel={ALLE_LABEL[lang]} />
    </div>
  );
}
