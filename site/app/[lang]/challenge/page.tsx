import { notFound } from 'next/navigation';
import DailyChallenge from '@/components/DailyChallenge';
import { isLang, langAlternates, ui } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = ui[lang];
  return { title: `${t.challengeTitle} — promptgarten`, alternates: langAlternates(lang, 'challenge/') };
}

export default async function ChallengePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 0 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px,5vw,42px)', fontWeight: 800, letterSpacing: '-.025em' }}>
          🎯 {t.challengeTitle}
        </h1>
        <p style={{ margin: '10px 0 0', color: 'var(--muted)', fontSize: 15 }}>{t.challengeSub}</p>
      </div>
      <DailyChallenge lang={lang} />
    </div>
  );
}
