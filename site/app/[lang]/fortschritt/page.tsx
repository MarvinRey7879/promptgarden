import { notFound } from 'next/navigation';
import Fortschritt, { type EntryMeta, type WorldMeta } from '@/components/Fortschritt';
import { WORLD_0, WORLD_1, WORLD_2, WORLD_3, getEntries } from '@/lib/content';
import { isLang, langAlternates, ui } from '@/lib/i18n';

const TITLE: Record<string, { h1: string; sub: string }> = {
  de: { h1: 'Dein Fortschritt', sub: 'Was du bisher geschafft hast — XP, Welten, Challenge-Bilanz. Alles nur in diesem Browser gespeichert.' },
  en: { h1: 'Your progress', sub: 'What you have achieved so far — XP, worlds, challenge record. Stored in this browser only.' },
  es: { h1: 'Tu progreso', sub: 'Lo que llevas conseguido: XP, mundos, historial de retos. Guardado solo en este navegador.' },
  fr: { h1: 'Ta progression', sub: 'Ce que tu as accompli jusqu’ici : XP, mondes, bilan des défis. Stocké uniquement dans ce navigateur.' },
  zh: { h1: '你的进度', sub: '你目前的成果——XP、世界进度、挑战战绩。仅保存在这个浏览器里。' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: TITLE[lang].h1,
    description: TITLE[lang].sub,
    alternates: langAlternates(lang, 'fortschritt/'),
  };
}

export default async function FortschrittPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const all = getEntries(lang);

  const worlds: WorldMeta[] = [
    { id: 'w0', label: t.pathWorld0, slugs: WORLD_0 },
    { id: 'w1', label: t.pathWorld, slugs: WORLD_1 },
    { id: 'w2', label: t.pathWorld2, slugs: WORLD_2 },
    { id: 'w3', label: t.pathWorld3, slugs: WORLD_3 },
  ];

  const entries: EntryMeta[] = all.map((e) => ({
    slug: e.slug,
    title: e.title,
    category: e.category,
    difficulty: e.difficulty,
  }));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0 60px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em' }}>📊 {TITLE[lang].h1}</h1>
      <p style={{ margin: '0 0 28px', color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.6 }}>{TITLE[lang].sub}</p>

      <Fortschritt lang={lang} worlds={worlds} entries={entries} />
    </div>
  );
}
