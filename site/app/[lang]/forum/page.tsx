import { notFound } from 'next/navigation';
import ForumBoard from '@/components/ForumBoard';
import { isLang } from '@/lib/i18n';

export default async function ForumPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ margin: '30px 0 10px', fontSize: 40, fontWeight: 800, letterSpacing: '-.03em' }}>
        Forum
      </h1>
      <ForumBoard lang={lang} />
    </div>
  );
}
