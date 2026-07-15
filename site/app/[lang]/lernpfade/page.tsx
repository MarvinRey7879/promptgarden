import Link from 'next/link';
import { notFound } from 'next/navigation';
import PathBoard from '@/components/PathBoard';
import LearnMap from '@/components/LearnMap';
import ExampleVideo from '@/components/ExampleVideo';
import { WORLD_0, WORLD_1, WORLD_2, WORLD_3, getEntry } from '@/lib/content';
import { isLang, langAlternates, ui } from '@/lib/i18n';

// Landkarte-Demo unter der LearnMap (Remotion R9): zeigt Punkte-Füllen + Welt-Abschluss.
const MAP_LABEL: Record<string, string> = {
  de: 'So wächst deine Landkarte: Kapitel abschließen, Punkte färben sich, Welt geschafft — alles nur in deinem Browser gespeichert.',
  en: 'How your map grows: finish chapters, dots light up, world complete — all stored only in your browser.',
  es: 'Así crece tu mapa: termina capítulos, los puntos se iluminan, mundo completado — todo guardado solo en tu navegador.',
  fr: "Ta carte grandit : termine des chapitres, les points s'allument, monde terminé — tout est stocké uniquement dans ton navigateur.",
  zh: '地图这样成长：完成章节、圆点点亮、世界通关——数据只保存在你的浏览器里。',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { alternates: langAlternates(lang, 'lernpfade/') };
}

export default async function LernpfadePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];

  const world0 = WORLD_0.map((slug) => getEntry(lang, slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const world1 = WORLD_1.map((slug) => getEntry(lang, slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const world2 = WORLD_2.map((slug) => getEntry(lang, slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const world3 = WORLD_3.map((slug) => getEntry(lang, slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  // Course-List Structured Data (Google unterstützt Course aktiv; FAQPage-Rich-Results
  // wurden Mai 2026 eingestellt — deshalb bewusst nur Course-Schema).
  // Quelle: https://developers.google.com/search/docs/appearance/structured-data/course
  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { name: t.pathWorld0, desc: world0.map((e) => e.title).join(' · ') },
      { name: t.pathWorld, desc: world1.map((e) => e.title).join(' · ') },
      { name: t.pathWorld2, desc: world2.map((e) => e.title).join(' · ') },
      { name: t.pathWorld3, desc: world3.map((e) => e.title).join(' · ') },
    ].map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: w.name,
        description: w.desc,
        url: `https://promptgarten.com/${lang}/lernpfade/`,
        provider: { '@type': 'Organization', name: 'promptgarten', sameAs: 'https://promptgarten.com' },
        offers: { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'EUR' },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: 'PT2H' },
      },
    })),
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
      />
      <div style={{ textAlign: 'center', padding: '36px 0 6px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,5vw,42px)', fontWeight: 800, letterSpacing: '-.025em' }}>
          {t.pathTitle}
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--muted)', lineHeight: 1.5 }}>
          {t.pathSub}
        </p>
      </div>

      <LearnMap
        lang={lang}
        worlds={[
          { name: t.pathWorld0, chapters: world0.map((e) => ({ slug: e.slug, title: e.title, category: e.category })) },
          { name: t.pathWorld, chapters: world1.map((e) => ({ slug: e.slug, title: e.title, category: e.category })) },
          { name: t.pathWorld2, chapters: world2.map((e) => ({ slug: e.slug, title: e.title, category: e.category })) },
          { name: t.pathWorld3, chapters: world3.map((e) => ({ slug: e.slug, title: e.title, category: e.category })) },
        ]}
      />

      <ExampleVideo lang={lang} name="map-demo" label={MAP_LABEL[lang]} />

      {world0.length >= 4 && (
        <>
          <div style={{ textAlign: 'center', padding: '18px 0 0' }}>
            <p className="kicker" style={{ letterSpacing: '.14em' }}>
              {t.pathWorld0}
            </p>
          </div>
          <PathBoard lang={lang} chapters={world0} />
        </>
      )}

      <div style={{ textAlign: 'center', padding: '30px 0 0' }}>
        <p className="kicker" style={{ letterSpacing: '.14em' }}>
          {t.pathWorld}
        </p>
      </div>

      <PathBoard lang={lang} chapters={world1} />

      <div id="welt2" style={{ textAlign: 'center', padding: '30px 0 0' }}>
        <p className="kicker" style={{ letterSpacing: '.14em' }}>
          {t.pathWorld2}
        </p>
      </div>

      <PathBoard lang={lang} chapters={world2} />

      <div style={{ textAlign: 'center', padding: '30px 0 0' }}>
        <p className="kicker" style={{ letterSpacing: '.14em' }}>
          {t.pathWorld3}
        </p>
      </div>

      <PathBoard lang={lang} chapters={world3} />

      <div style={{ textAlign: 'center', paddingBottom: 20 }}>
        <Link href={`/${lang}/lexikon/`} className="btn secondary">
          {t.pathReadOnly}
        </Link>
      </div>
    </div>
  );
}
