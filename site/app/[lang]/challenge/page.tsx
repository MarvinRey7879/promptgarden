import { notFound } from 'next/navigation';
import DailyChallenge from '@/components/DailyChallenge';
import ExampleVideo from '@/components/ExampleVideo';
import { isLang, langAlternates, ui } from '@/lib/i18n';

// Challenge-Demo unter dem Quiz (Remotion R8): zeigt den Ablauf Frage→Prüfen→XP→Serie.
const VIDEO_LABEL: Record<string, string> = {
  de: 'So funktioniert die Tages-Challenge: antworten, prüfen, XP sammeln — die Serie wächst jeden Tag.',
  en: 'How the daily challenge works: answer, check, collect XP — your streak grows every day.',
  es: 'Así funciona el reto diario: responde, comprueba, gana XP — tu racha crece cada día.',
  fr: 'Le défi du jour, mode d’emploi : réponds, vérifie, gagne des XP — ta série grandit chaque jour.',
  zh: '每日挑战这样玩：作答、检查、拿 XP——连续天数每天增长。',
};

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
      <ExampleVideo lang={lang} name="challenge-demo" label={VIDEO_LABEL[lang]} />
    </div>
  );
}
