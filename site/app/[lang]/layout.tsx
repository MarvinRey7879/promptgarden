import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BugButton from '@/components/BugButton';
import Track from '@/components/Track';
import AdsConsent from '@/components/AdsConsent';
import { LANGS, isLang, type Lang } from '@/lib/i18n';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

// Skip-Link-Text (WCAG 2.4.1 Bypass Blocks): sichtbar nur bei Tastatur-Fokus.
const SKIP: Record<Lang, string> = {
  de: 'Zum Inhalt springen',
  en: 'Skip to main content',
  es: 'Saltar al contenido',
  fr: 'Aller au contenu',
  zh: '跳到主要内容',
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <div className="wrap">
      <a href="#main" className="skip-link">{SKIP[lang]}</a>
      <Header lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
      <BugButton lang={lang} />
      <Track lang={lang} />
      <AdsConsent />
    </div>
  );
}
