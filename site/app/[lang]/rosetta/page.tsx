import Link from 'next/link';
import { notFound } from 'next/navigation';
import ExampleVideo from '@/components/ExampleVideo';
import RosettaTable from '@/components/RosettaTable';
import ShareButtons from '@/components/ShareButtons';
import { getPlatforms } from '@/lib/commands';
import { getRosetta } from '@/lib/rosetta';
import { isLang, langAlternates } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getRosetta(lang);
  return {
    title: d.title,
    description: d.intro.slice(0, 155),
    alternates: langAlternates(lang, 'rosetta/'),
  };
}

const BACK: Record<string, string> = {
  de: '← Zur Befehls-Referenz',
  en: '← Back to command reference',
  es: '← A la referencia de comandos',
  fr: '← Vers la référence des commandes',
  zh: '← 返回命令参考',
};

const STAND: Record<string, string> = { de: 'Stand', en: 'As of', es: 'Actualizado', fr: 'Mise à jour', zh: '数据截至' };

const VIDEO_LABEL: Record<string, string> = {
  de: 'In 11 Sekunden: dieselbe Aufgabe auf allen fünf Plattformen — und wo es keinen eigenen Befehl gibt.',
  en: 'In 11 seconds: the same task across all five platforms — and where no dedicated command exists.',
  es: 'En 11 segundos: la misma tarea en las cinco plataformas y dónde no existe un comando propio.',
  fr: 'En 11 secondes : la même tâche sur les cinq plateformes — et là où aucune commande dédiée n’existe.',
  zh: '11 秒看懂：同一个任务在五个平台上的写法，以及哪里没有专门命令。',
};

export default async function RosettaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getRosetta(lang);
  const platformNames = Object.fromEntries(getPlatforms(lang).map((p) => [p.id, p.name]));

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <Link href={`/${lang}/befehle/`} style={{ fontSize: 14, fontWeight: 700 }}>
        {BACK[lang]}
      </Link>

      <h1 style={{ margin: '18px 0 8px', fontSize: 38, fontWeight: 800, letterSpacing: '-.03em', textWrap: 'balance' }}>
        🔄 {d.title}
      </h1>
      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.6, maxWidth: 720 }}>{d.intro}</p>
      <p className="mono" style={{ margin: '0 0 26px', fontSize: 12.5, color: 'var(--muted)' }}>
        {STAND[lang]}: {d.stand}
      </p>

      <ExampleVideo lang={lang} name="rosetta-demo" label={VIDEO_LABEL[lang]} />

      <RosettaTable lang={lang} data={d} platformNames={platformNames} />

      <ShareButtons lang={lang} title={d.title} teaser={d.intro} />
    </div>
  );
}
