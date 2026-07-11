import Link from 'next/link';
import { isLang, ui } from '@/lib/i18n';
import { getEntries, getFeed, getEntry, WORLD_0, WORLD_1, WORLD_2 } from '@/lib/content';
import ContinueCard from '@/components/ContinueCard';
import { notFound } from 'next/navigation';

const CARD_COLORS = ['var(--lime)', 'var(--pink)', 'var(--blue)', 'var(--yellow)'];
const CARD_TILT = ['-1.2deg', '.8deg', '-.6deg', '1deg'];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const count = getEntries(lang).length;
  const latestNews = getFeed(lang)[0];
  const pathChapters = [...WORLD_0, ...WORLD_1, ...WORLD_2]
    .map((slug) => {
      const e = getEntry(lang, slug);
      return e ? { slug: e.slug, title: e.title } : null;
    })
    .filter((c): c is { slug: string; title: string } => Boolean(c));

  return (
    <>
      <div style={{ textAlign: 'center', padding: '54px 0 40px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(38px, 7vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-.035em',
            lineHeight: 1.05,
          }}
        >
          {t.heroTop}
          <br />
          <span
            style={{
              background: 'var(--lime)',
              padding: '0 14px',
              borderRadius: 14,
              boxDecorationBreak: 'clone',
            }}
          >
            {t.heroMark}
          </span>{' '}
          {lang === 'de' ? 'an.' : ''}
        </h1>
        <p
          style={{
            margin: '20px auto 0',
            maxWidth: 480,
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--muted)',
          }}
        >
          {t.heroSub}
        </p>
      </div>

      <ContinueCard lang={lang} chapters={pathChapters} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 18,
          paddingBottom: 28,
        }}
      >
        {t.cards.map((c, i) => (
          <Link
            key={c.title}
            href={`/${lang}/${c.href}`}
            style={{
              background: CARD_COLORS[i],
              border: '2.5px solid var(--ink)',
              borderRadius: 20,
              padding: '24px 22px',
              boxShadow: '5px 5px 0 var(--ink)',
              transform: `rotate(${CARD_TILT[i]})`,
              display: 'block',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: 30 }}>{c.emoji}</p>
            <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800 }}>{c.title}</h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#4a4133' }}>{c.desc}</p>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 18, paddingBottom: 10, flexWrap: 'wrap' }}>
        <Link
          href={`/${lang}/feed/`}
          className="card"
          style={{
            flex: '1.4 1 300px',
            padding: '22px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              background: 'var(--ink)',
              borderRadius: 14,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flex: 'none',
            }}
          >
            💡
          </div>
          <div>
            <p className="kicker">{t.insightLabel}</p>
            <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600, lineHeight: 1.4 }}>
              {latestNews ? latestNews.title : t.insightText}
              {latestNews && (
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
                  {' '}→ Feed · {latestNews.date}
                </span>
              )}
            </p>
          </div>
        </Link>
        <div
          style={{
            flex: '1 1 260px',
            background: 'var(--ink)',
            color: 'var(--bg)',
            borderRadius: 20,
            padding: '22px 26px',
          }}
        >
          <p className="kicker" style={{ color: 'var(--lime)' }}>
            {t.levelLabel}
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 15.5, fontWeight: 600 }}>{t.levelTitle}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {t.levelChips.map((chip, i) => (
              <Link
                key={chip}
                href={`/${lang}/${i === 0 ? 'start/' : i === 1 ? 'lernpfade/' : 'lexikon/'}`}
                style={{
                  background: i === 0 ? 'var(--bg)' : 'transparent',
                  color: i === 0 ? 'var(--ink)' : 'var(--bg)',
                  border: i === 0 ? '1.5px solid var(--bg)' : '1.5px solid var(--muted)',
                  borderRadius: 99,
                  padding: '6px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mono" style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 30 }}>
        {count} {lang === 'de' ? 'Einträge · wächst jede Woche' : 'entries · growing every week'}
      </p>
    </>
  );
}
