import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLang, langAlternates, type Lang } from '@/lib/i18n';

/**
 * Autoren-/Über-Seite (Marvin 27.07): Google fragt im Helpful-Content-Check
 * ausdrücklich, ob Besucher erkennen, wer die Inhalte verfasst hat — bisher gab
 * es nur das Impressum. Zeigt Marvin als Macher, die Arbeitsweise (Quellenpflicht,
 * zwei Detailtiefen) und den Kontaktweg. Person-JSON-LD für E-E-A-T-Signale.
 */

type Txt = {
  title: string; sub: string; role: string; p1: string; p2: string;
  h_how: string; how1: string; how2: string; how3: string;
  h_contact: string; contact1: string; contact2: string;
};

const T: Record<Lang, Txt> = {
  de: {
    title: 'Über promptgarten',
    sub: 'Wer das hier baut — und wie die Inhalte entstehen.',
    role: 'Macher von promptgarten',
    p1: 'Hi, ich bin Marvin. Ich baue promptgarten, weil ich beim Programmieren mit KI-Agenten immer wieder dieselben Fragen hatte und die Antworten überall verstreut lagen: in Release-Notes, GitHub-Issues, halbaktuellen Blogposts. Ich wollte einen Ort, an dem das sortiert steht — kostenlos, ohne Anmeldung, in mehreren Sprachen.',
    p2: 'Hauptberuflich baue ich die Technik hinter TakeMeTo, einer Reiseplattform. promptgarten ist mein Nebenprojekt und bleibt kostenlos.',
    h_how: 'Wie die Inhalte entstehen',
    how1: 'Jede Aussage wird gegen die offizielle Dokumentation des jeweiligen Tools geprüft — Anbieter-Docs, Release-Notes, das Repository. Steht etwas nicht in einer belastbaren Quelle, kommt es nicht auf die Seite.',
    how2: 'Zu jedem Befehl und jedem Kapitel steht die Quelle dabei, damit du selbst nachlesen kannst. Wenn sich ein Tool ändert, wird die Seite nachgezogen statt stehen gelassen.',
    how3: 'Jedes Kapitel gibt es in zwei Tiefen: einfach erklärt für den Einstieg, ausführlich für alle, die es genauer wissen wollen.',
    h_contact: 'Kontakt & Mitmachen',
    contact1: 'Fehler gefunden oder etwas fehlt? Über den Bug-Button unten rechts auf jeder Seite geht das direkt an mich.',
    contact2: 'promptgarten ist bewusst offen: freie JSON-API, RSS-Feed und llms.txt — auch für KI-Tools nutzbar.',
  },
  en: {
    title: 'About promptgarten',
    sub: "Who's building this — and how the content comes together.",
    role: 'Creator of promptgarten',
    p1: "Hi, I'm Marvin. I'm building promptgarten because I kept running into the same questions while coding with AI agents, and the answers were scattered everywhere: release notes, GitHub issues, half-outdated blog posts. I wanted one place where it's all sorted — free, no sign-up, in multiple languages.",
    p2: 'My day job is building the tech behind TakeMeTo, a travel platform. promptgarten is my side project and stays free.',
    h_how: 'How the content comes together',
    how1: "Every statement is checked against the official documentation of the tool in question — vendor docs, release notes, the repository. If something isn't backed by a solid source, it doesn't go on the page.",
    how2: 'Every command and every chapter comes with its source, so you can check it yourself. When a tool changes, the page gets updated instead of left as is.',
    how3: 'Every chapter comes in two depths: a simple explanation to get started, and a detailed one for anyone who wants to know more.',
    h_contact: 'Contact & Contribute',
    contact1: 'Found a mistake or something missing? Use the bug button in the bottom right of any page — it goes straight to me.',
    contact2: 'promptgarten is deliberately open: a free JSON API, an RSS feed, and llms.txt — usable by AI tools too.',
  },
  es: {
    title: 'Sobre promptgarten',
    sub: 'Quién construye esto — y cómo se crean los contenidos.',
    role: 'Creador de promptgarten',
    p1: 'Hola, soy Marvin. Construyo promptgarten porque, al programar con agentes de IA, me encontraba siempre con las mismas preguntas y las respuestas estaban dispersas por todas partes: notas de versión, issues de GitHub, posts de blog a medio actualizar. Quería un lugar donde todo eso estuviera ordenado — gratis, sin registro, en varios idiomas.',
    p2: 'Mi trabajo principal es construir la tecnología detrás de TakeMeTo, una plataforma de viajes. promptgarten es mi proyecto paralelo y sigue siendo gratis.',
    h_how: 'Cómo se crean los contenidos',
    how1: 'Cada afirmación se comprueba con la documentación oficial de la herramienta en cuestión — docs del proveedor, notas de versión, el repositorio. Si algo no está respaldado por una fuente sólida, no aparece en la página.',
    how2: 'Cada comando y cada capítulo llevan su fuente al lado, para que puedas comprobarlo tú mismo. Cuando una herramienta cambia, la página se actualiza en vez de quedarse desactualizada.',
    how3: 'Cada capítulo existe en dos niveles: explicado de forma sencilla para empezar, y en detalle para quien quiera profundizar.',
    h_contact: 'Contacto y colaboración',
    contact1: '¿Encontraste un error o falta algo? Con el botón de errores abajo a la derecha en cada página, me llega directamente a mí.',
    contact2: 'promptgarten es deliberadamente abierto: API JSON libre, feed RSS y llms.txt — también utilizable por herramientas de IA.',
  },
  fr: {
    title: 'À propos de promptgarten',
    sub: 'Qui construit ce site — et comment le contenu est créé.',
    role: 'Créateur de promptgarten',
    p1: "Salut, je suis Marvin. Je construis promptgarten parce qu'en programmant avec des agents d'IA, je me retrouvais toujours face aux mêmes questions, et les réponses étaient éparpillées un peu partout : notes de version, issues GitHub, articles de blog à moitié à jour. Je voulais un endroit où tout ça soit rangé — gratuit, sans inscription, en plusieurs langues.",
    p2: "Mon métier principal, c'est de construire la technologie derrière TakeMeTo, une plateforme de voyage. promptgarten est mon projet personnel et reste gratuit.",
    h_how: 'Comment le contenu est créé',
    how1: "Chaque affirmation est vérifiée par rapport à la documentation officielle de l'outil concerné — docs de l'éditeur, notes de version, le dépôt. Si quelque chose ne repose pas sur une source fiable, ça n'apparaît pas sur la page.",
    how2: 'Chaque commande et chaque chapitre indiquent leur source, pour que tu puisses vérifier toi-même. Quand un outil change, la page est mise à jour plutôt que laissée telle quelle.',
    how3: "Chaque chapitre existe à deux niveaux : une explication simple pour débuter, et une version détaillée pour qui veut en savoir plus.",
    h_contact: 'Contact & Participer',
    contact1: "Tu as trouvé une erreur ou il manque quelque chose ? Le bouton de signalement de bug en bas à droite de chaque page m'envoie ça directement.",
    contact2: 'promptgarten est volontairement ouvert : API JSON libre, flux RSS et llms.txt — utilisables aussi par les outils IA.',
  },
  zh: {
    title: '关于 promptgarten',
    sub: '这个网站是谁做的——内容又是怎么来的。',
    role: 'promptgarten 的创建者',
    p1: '嗨，我是 Marvin。我做 promptgarten，是因为用 AI 智能体编程时，总是遇到同样的问题，而答案却散落各处：发布说明、GitHub issue、半过时的博客文章。我想要一个把这些整理好的地方——免费、无需注册、支持多种语言。',
    p2: '我的主业是搭建 TakeMeTo（一个旅行平台）背后的技术。promptgarten 是我的副业项目，会保持免费。',
    h_how: '内容是怎么来的',
    how1: '每一条内容都会对照相应工具的官方文档核实——厂商文档、发布说明、代码仓库。如果没有可靠来源支持，就不会出现在页面上。',
    how2: '每个命令、每个章节都会附上出处，方便你自己查证。工具一旦有变化，页面会跟着更新，而不是放着不管。',
    how3: '每个章节都有两种深度：入门用的简明讲解，以及给想深入了解的人看的详细版本。',
    h_contact: '联系与参与',
    contact1: '发现错误，或者觉得少了什么？每个页面右下角都有报错按钮，会直接发给我。',
    contact2: 'promptgarten 刻意保持开放：提供免费的 JSON API、RSS 订阅和 llms.txt——AI 工具也可以使用。',
  },
};

// Label für den Zurück-Link (die nav-Labels haben keinen „Startseite"-Eintrag)
const HOME: Record<Lang, string> = {
  de: 'Zur Startseite',
  en: 'Back to start',
  es: 'A la página de inicio',
  fr: "Retour à l'accueil",
  zh: '返回首页',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = T[lang];
  return {
    title: `${t.title} — promptgarten 🌱`,
    description: t.sub,
    alternates: langAlternates(lang, 'ueber/'),
  };
}

export default async function UeberPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];

  // Person-/AboutPage-Schema: macht die Autorenschaft auch maschinenlesbar.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t.title,
    inLanguage: lang,
    url: `https://promptgarten.com/${lang}/ueber/`,
    mainEntity: {
      '@type': 'Person',
      name: 'Marvin Mez',
      jobTitle: t.role,
      image: 'https://promptgarten.com/marvin.webp',
      worksFor: { '@type': 'Organization', name: 'TakeMeTo', url: 'https://takemeto.ai' },
      knowsAbout: ['AI coding agents', 'Claude Code', 'Cursor', 'Model Context Protocol', 'Prompt engineering'],
    },
  };

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 0' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 24px' }}>
        <img
          src="/marvin.webp"
          alt="Marvin Mez"
          width={112}
          height={112}
          style={{ borderRadius: 18, border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--ink)', flexShrink: 0 }}
        />
        <div style={{ minWidth: 220, flex: 1 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 36, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            {t.title}
          </h1>
          <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: 16 }}>{t.sub}</p>
          <p className="kicker" style={{ margin: 0 }}>Marvin Mez · {t.role}</p>
        </div>
      </div>

      <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.7 }}>{t.p1}</p>
      <p style={{ margin: '0 0 28px', fontSize: 16.5, lineHeight: 1.7 }}>{t.p2}</p>

      <div className="card" style={{ padding: '20px 24px', marginBottom: 20, background: 'var(--lime)', boxShadow: '4px 4px 0 var(--ink)' }}>
        <p className="kicker" style={{ color: 'var(--ink)', margin: '0 0 10px' }}>🔍 {t.h_how.toUpperCase()}</p>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7 }}>
          <li style={{ marginBottom: 8 }}>{t.how1}</li>
          <li style={{ marginBottom: 8 }}>{t.how2}</li>
          <li>{t.how3}</li>
        </ul>
      </div>

      <div className="card" style={{ padding: '20px 24px', marginBottom: 26, boxShadow: '4px 4px 0 var(--ink)' }}>
        <p className="kicker" style={{ color: 'var(--ink)', margin: '0 0 10px' }}>✉️ {t.h_contact.toUpperCase()}</p>
        <p style={{ margin: '0 0 8px', fontSize: 15, lineHeight: 1.65 }}>{t.contact1}</p>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>{t.contact2}</p>
      </div>

      <p style={{ margin: 0, fontSize: 13.5, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link href={`/${lang}/`} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
          ← {HOME[lang]}
        </Link>
        <a href="/impressum/" style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}>
          Impressum
        </a>
      </p>
    </article>
  );
}
