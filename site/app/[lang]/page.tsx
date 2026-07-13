import Link from 'next/link';
import { isLang, langAlternates, ui } from '@/lib/i18n';
import { getEntries, getFeed, getEntry, difficultyDots, WORLD_0, WORLD_1, WORLD_2, WORLD_3 } from '@/lib/content';
import { getCommands } from '@/lib/commands';
import { landing } from '@/lib/landing';
import ContinueCard from '@/components/ContinueCard';
import { notFound } from 'next/navigation';
import addonsDe from '@/content/addons.de.json';

const CARD_COLORS = ['var(--lime)', 'var(--pink)', 'var(--blue)', 'var(--yellow)'];
const CARD_TILT = ['-1.2deg', '.8deg', '-.6deg', '1deg'];
const HOW_COLORS = ['var(--yellow)', 'var(--blue)', 'var(--lime)'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const L = landing[lang];
  return {
    title: L.metaTitle,
    description: L.heroSub,
    alternates: langAlternates(lang, ''),
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const L = landing[lang];
  const entries = getEntries(lang);
  const latestNews = getFeed(lang)[0];
  const example = getEntry(lang, L.exampleEntrySlug);
  const nCommands = getCommands(lang).length;
  const nAddons = (addonsDe as { items: unknown[] }).items.length;
  const nWorlds = [WORLD_0, WORLD_1, WORLD_2, WORLD_3].filter((w) => w.length >= 3).length;
  const pathChapters = [...WORLD_0, ...WORLD_1, ...WORLD_2]
    .map((slug) => {
      const e = getEntry(lang, slug);
      return e ? { slug: e.slug, title: e.title } : null;
    })
    .filter((c): c is { slug: string; title: string } => Boolean(c));

  return (
    <>
      <div style={{ textAlign: 'center', padding: '50px 0 34px' }}>
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
            maxWidth: 540,
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--muted)',
          }}
        >
          {L.heroSub}
        </p>

        <div style={{ marginTop: 26 }}>
          <Link
            href={`/${lang}/start/`}
            style={{
              display: 'inline-block',
              background: 'var(--ink)',
              color: 'var(--bg)',
              border: '2.5px solid var(--ink)',
              borderRadius: 16,
              padding: '14px 30px',
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: '-.01em',
              boxShadow: '5px 5px 0 var(--lime)',
            }}
          >
            {L.ctaPrimary}
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          {L.audiences.map((a) => (
            <span
              key={a}
              className="mono"
              style={{
                fontSize: 11.5,
                border: '1.5px solid rgba(43,33,24,.35)',
                borderRadius: 99,
                padding: '4px 12px',
                color: 'var(--muted)',
                fontWeight: 600,
              }}
            >
              {a}
            </span>
          ))}
        </div>

        <p className="mono" style={{ margin: '22px auto 0', maxWidth: 620, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
          {L.statsTemplate(entries.length, nCommands, nAddons, nWorlds)}
        </p>
      </div>

      <ContinueCard lang={lang} chapters={pathChapters} />

      {example && (
        <div style={{ maxWidth: 620, margin: '0 auto 34px' }}>
          <p className="kicker" style={{ textAlign: 'center', letterSpacing: '.14em', marginBottom: 10 }}>
            {L.exampleKicker}
          </p>
          <Link
            href={`/${lang}/lexikon/${example.slug}/`}
            className="card"
            style={{
              display: 'block',
              padding: '22px 26px',
              transform: 'rotate(-.5deg)',
              boxShadow: '5px 5px 0 var(--ink)',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{example.title}</h3>
              <span className="mono" style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {difficultyDots(example.difficulty)}
              </span>
            </div>
            <p style={{ margin: '10px 0 12px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)' }}>{example.teaser}</p>
            <span className="mono" style={{ fontSize: 12, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              → {t.categories[example.category]} · 🌱/🔬 · Quiz
            </span>
          </Link>
        </div>
      )}

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

      <div style={{ padding: '14px 0 30px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px', fontSize: 'clamp(24px,4vw,32px)', fontWeight: 800, letterSpacing: '-.025em' }}>
          {L.howTitle}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {L.how.map((s, i) => (
            <Link
              key={s.title}
              href={`/${lang}/${s.href}`}
              className="card"
              style={{
                display: 'block',
                padding: '22px 24px',
                background: HOW_COLORS[i],
                boxShadow: '4px 4px 0 var(--ink)',
                transform: `rotate(${i === 1 ? '.6deg' : '-.6deg'})`,
              }}
            >
              <p style={{ margin: '0 0 8px', fontSize: 28 }}>{s.emoji}</p>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#4a4133' }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'var(--ink)',
          color: 'var(--bg)',
          borderRadius: 22,
          padding: '26px 28px',
          marginBottom: 30,
        }}
      >
        <p className="kicker" style={{ color: 'var(--lime)', marginBottom: 14 }}>
          {L.trustTitle.toUpperCase()}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px 22px' }}>
          {L.trust.map((p) => (
            <div key={p.emoji} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flex: 'none' }}>{p.emoji}</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'rgba(247,243,233,.92)' }}>{p.text}</p>
            </div>
          ))}
        </div>
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
    </>
  );
}
