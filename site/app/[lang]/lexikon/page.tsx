import { notFound } from 'next/navigation';
import LexikonList from '@/components/LexikonList';
import { getEntries } from '@/lib/content';
import { isLang, langAlternates, ui } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'lexikon/') };
}

export default async function LexikonPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const entries = getEntries(lang);

  return (
    <>
      <h1 style={{ margin: '30px 0 0', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {t.lexikonTitle}
      </h1>
      <LexikonList lang={lang} entries={entries} />
    </>
  );
}
