import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClaudeMdBuilder from '@/components/ClaudeMdBuilder';
import { breadcrumbLd } from '@/lib/schema';
import { LANGS, isLang, langAlternates, type Lang } from '@/lib/i18n';

const META: Record<Lang, { title: string; desc: string; h1: string; sub: string }> = {
  de: { title: 'CLAUDE.md-Generator (kostenlos, ohne Anmeldung)', desc: 'Erstelle eine saubere CLAUDE.md / AGENTS.md für deinen KI-Coding-Agenten: Projekt, Tech-Stack, Befehle, Konventionen, Do & Don’t. Rein clientseitig, zum Kopieren.', h1: 'CLAUDE.md-Generator', sub: 'Eine gute CLAUDE.md / AGENTS.md gibt deinem Coding-Agenten Kontext, Befehle und Regeln. Fülle die Felder aus und kopiere das Ergebnis in dein Projekt-Root.' },
  en: { title: 'CLAUDE.md generator (free, no signup)', desc: 'Build a clean CLAUDE.md / AGENTS.md for your AI coding agent: project, tech stack, commands, conventions, do & don’t. Fully client-side, ready to copy.', h1: 'CLAUDE.md generator', sub: 'A good CLAUDE.md / AGENTS.md gives your coding agent context, commands and rules. Fill in the fields and paste the result into your project root.' },
  es: { title: 'Generador de CLAUDE.md (gratis, sin registro)', desc: 'Crea un CLAUDE.md / AGENTS.md limpio para tu agente de código con IA: proyecto, stack, comandos, convenciones, do & don’t. Todo en el cliente, listo para copiar.', h1: 'Generador de CLAUDE.md', sub: 'Un buen CLAUDE.md / AGENTS.md da a tu agente contexto, comandos y reglas. Rellena los campos y pega el resultado en la raíz de tu proyecto.' },
  fr: { title: 'Générateur de CLAUDE.md (gratuit, sans inscription)', desc: 'Crée un CLAUDE.md / AGENTS.md propre pour ton agent de code IA : projet, stack, commandes, conventions, do & don’t. Entièrement côté client, prêt à copier.', h1: 'Générateur de CLAUDE.md', sub: 'Un bon CLAUDE.md / AGENTS.md donne à ton agent le contexte, les commandes et les règles. Remplis les champs et colle le résultat à la racine de ton projet.' },
  zh: { title: 'CLAUDE.md 生成器（免费，无需注册）', desc: '为你的 AI 编程智能体生成整洁的 CLAUDE.md / AGENTS.md：项目、技术栈、命令、约定、Do & Don’t。全程浏览器本地，可直接复制。', h1: 'CLAUDE.md 生成器', sub: '一份好的 CLAUDE.md / AGENTS.md 会给编程智能体提供上下文、命令与规则。填写字段，把结果粘贴到你的项目根目录。' },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const m = META[lang];
  return { title: `${m.title} — promptgarten 🌱`, description: m.desc, alternates: langAlternates(lang, 'claude-md-generator/') };
}

export default async function ClaudeMdGeneratorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const m = META[lang];
  const crumbs = breadcrumbLd(lang, [{ name: m.h1, path: 'claude-md-generator/' }]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '30px 0' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <div style={{ textAlign: 'center', padding: '10px 0 22px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, letterSpacing: '-.025em' }}>{m.h1}</h1>
        <p style={{ margin: '12px auto 0', maxWidth: 620, fontSize: 15, color: 'var(--muted)', lineHeight: 1.55 }}>{m.sub}</p>
      </div>
      <ClaudeMdBuilder lang={lang} />
      <p style={{ marginTop: 26, fontSize: 13.5, textAlign: 'center' }}>
        <Link href={`/${lang}/lexikon/claude-md/`} style={{ textDecoration: 'underline' }}>
          {lang === 'de' ? 'Mehr zu CLAUDE.md / AGENTS.md im Lexikon →' : lang === 'zh' ? '在词条中了解更多 CLAUDE.md / AGENTS.md →' : lang === 'es' ? 'Más sobre CLAUDE.md / AGENTS.md en el léxico →' : lang === 'fr' ? 'En savoir plus sur CLAUDE.md / AGENTS.md dans le lexique →' : 'More about CLAUDE.md / AGENTS.md in the glossary →'}
        </Link>
      </p>
    </div>
  );
}
