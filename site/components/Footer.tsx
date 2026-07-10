import { type Lang, ui } from '@/lib/i18n';

// TODO(It.2): echte Handles von Marvin eintragen (PayPal.me / Ko-fi / GitHub Sponsors)
const DONATE_LINKS: { label: string; href: string | null }[] = [
  { label: 'PayPal', href: null },
  { label: 'Ko-fi', href: null },
  { label: 'GitHub Sponsors', href: null },
];

export default function Footer({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const live = DONATE_LINKS.filter((d) => d.href);

  return (
    <footer
      style={{
        marginTop: 70,
        borderTop: '2.5px solid var(--ink)',
        padding: '28px 0 40px',
        fontSize: 13.5,
        color: 'var(--muted)',
      }}
    >
      <div
        className="wrap"
        style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}
      >
        <p style={{ margin: 0, maxWidth: 520, lineHeight: 1.55 }}>
          {t.footerNote}{' '}
          <a href="/impressum/" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Impressum
          </a>
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          {live.length > 0 ? (
            live.map((d) => (
              <a key={d.label} className="chip" href={d.href!} target="_blank" rel="noopener">
                💛 {d.label}
              </a>
            ))
          ) : (
            <span className="chip" style={{ opacity: 0.5 }} title="Links folgen">
              💛 {t.donate} — bald
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
