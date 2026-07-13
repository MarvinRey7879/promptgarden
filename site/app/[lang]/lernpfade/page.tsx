import Link from 'next/link';
import { notFound } from 'next/navigation';
import PathBoard from '@/components/PathBoard';
import { WORLD_0, WORLD_1, WORLD_2, WORLD_3, getEntry } from '@/lib/content';
import { isLang, langAlternates, ui } from '@/lib/i18n';

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

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '36px 0 6px' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,5vw,42px)', fontWeight: 800, letterSpacing: '-.025em' }}>
          {t.pathTitle}
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--muted)', lineHeight: 1.5 }}>
          {t.pathSub}
        </p>
      </div>

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
