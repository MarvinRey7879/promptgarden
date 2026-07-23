import { notFound } from 'next/navigation';
import { isLang, langAlternates, ui, type Lang } from '@/lib/i18n';
import { GraphifyDiagram, ObsidianClaudeDiagram, type AddonDiagramLabels } from '@/components/AddonDiagrams';
import AddonFilter from '@/components/AddonFilter';
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
  detail?: unknown;
};

const byLang: Record<Lang, { items: Addon[] }> = {
  de: de as { items: Addon[] },
  en: en as { items: Addon[] },
  es: es as { items: Addon[] },
  fr: fr as { items: Addon[] },
  zh: zh as { items: Addon[] },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: `${ui[lang].addonsTitle} — promptgarten 🌱`,
    description: ui[lang].addonsSub,
    alternates: langAlternates(lang, 'addons/'),
  };
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

      {'diagrams' in byLang[lang] && (
        <>
          <GraphifyDiagram t={(byLang[lang] as unknown as { diagrams: AddonDiagramLabels }).diagrams} />
          <ObsidianClaudeDiagram t={(byLang[lang] as unknown as { diagrams: AddonDiagramLabels }).diagrams} />
        </>
      )}

      <AddonFilter items={items} lang={lang} officialLabel={t.addonsOfficial} />
    </div>
  );
}
