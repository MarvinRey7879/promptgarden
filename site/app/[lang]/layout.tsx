import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BugButton from '@/components/BugButton';
import Track from '@/components/Track';
import AdsConsent from '@/components/AdsConsent';
import { LANGS, isLang } from '@/lib/i18n';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

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
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
      <BugButton lang={lang} />
      <Track lang={lang} />
      <AdsConsent />
    </div>
  );
}
