import { notFound } from 'next/navigation';
import Wizard from '@/components/Wizard';
import ExampleVideo from '@/components/ExampleVideo';
import { isLang, langAlternates, ui } from '@/lib/i18n';

// Suche-Demo unter dem Wizard (Remotion R7): zeigt Neulingen die Volltext-Suche.
const SEARCH_LABEL: Record<string, string> = {
  de: 'So findest du alles: Suche mit 🔍 oder Strg+K — Kapitel, Befehle, Prompt-Vorlagen.',
  en: 'Find anything: search with 🔍 or Ctrl+K — chapters, commands, prompt templates.',
  es: 'Encuentra todo: busca con 🔍 o Ctrl+K — capítulos, comandos, plantillas.',
  fr: 'Trouve tout : cherche avec 🔍 ou Ctrl+K — chapitres, commandes, modèles.',
  zh: '找到一切：用 🔍 或 Ctrl+K 搜索——章节、命令、提示词模板。',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'start/') };
}

export default async function StartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 0 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,5vw,42px)', fontWeight: 800, letterSpacing: '-.025em' }}>
          {t.wizardTitle}
        </h1>
        <p style={{ margin: '10px 0 0', color: 'var(--muted)', fontSize: 15 }}>{t.wizardSub}</p>
      </div>
      <Wizard lang={lang} />
      <ExampleVideo lang={lang} name="search-demo" label={SEARCH_LABEL[lang]} />
    </div>
  );
}
