import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommands, getPlatforms } from '@/lib/commands';
import { isLang, langAlternates, ui } from '@/lib/i18n';

const ROSETTA_TEASER: Record<string, { title: string; sub: string }> = {
  de: { title: 'Befehls-Rosetta', sub: 'Dieselbe Aufgabe auf allen 5 Plattformen nebeneinander — was heißt /compact bei Cursor, Aider oder Codex?' },
  en: { title: 'Command Rosetta', sub: 'The same task across all 5 platforms side by side — what is /compact called in Cursor, Aider or Codex?' },
  es: { title: 'Rosetta de comandos', sub: 'La misma tarea en las 5 plataformas, lado a lado: ¿cómo se llama /compact en Cursor, Aider o Codex?' },
  fr: { title: 'Rosetta des commandes', sub: 'La même tâche sur les 5 plateformes côte à côte : comment s’appelle /compact dans Cursor, Aider ou Codex ?' },
  zh: { title: '命令对照表', sub: '同一个任务在 5 个平台上的写法并排对比——Cursor、Aider、Codex 里的 /compact 叫什么？' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'befehle/') };
}

export default async function BefehleHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const platforms = getPlatforms(lang);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 6px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        {t.cmdTitle}
      </h1>
      <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: 15.5 }}>{t.cmdSub}</p>

      <Link
        href={`/${lang}/rosetta/`}
        className="card"
        style={{
          display: 'block',
          padding: '16px 20px',
          margin: '0 0 26px',
          textDecoration: 'none',
          color: 'inherit',
          background: 'var(--yellow)',
          boxShadow: '4px 4px 0 var(--ink)',
        }}
      >
        <strong style={{ fontSize: 17, fontWeight: 800 }}>🔄 {ROSETTA_TEASER[lang].title}</strong>
        <span style={{ display: 'block', fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
          {ROSETTA_TEASER[lang].sub}
        </span>
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {platforms.map((p, i) => {
          const count = getCommands(lang, p.id).length;
          return (
            <Link
              key={p.id}
              href={`/${lang}/befehle/${p.id}/`}
              className="card"
              style={{
                padding: '20px 22px',
                textDecoration: 'none',
                color: 'inherit',
                transform: `rotate(${i % 2 === 0 ? '-.3' : '.3'}deg)`,
                boxShadow: '4px 4px 0 var(--ink)',
              }}
            >
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
                {p.name}
              </h2>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                {p.tagline}
              </p>
              <span className="chip mono" style={{ fontSize: 12 }}>
                {count} × /
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
