import Link from 'next/link';
import { type Lang, ui } from '@/lib/i18n';

// Nützliche Nachschlage-Seiten, die nicht in die Haupt-Navigation passen
const EXTRA_LINKS: Record<Lang, { rosetta: string; fehler: string; fortschritt: string }> = {
  de: { rosetta: 'Befehls-Rosetta', fehler: 'Fehler-Katalog', fortschritt: 'Dein Fortschritt' },
  en: { rosetta: 'Command Rosetta', fehler: 'Error catalog', fortschritt: 'Your progress' },
  es: { rosetta: 'Rosetta de comandos', fehler: 'Catálogo de errores', fortschritt: 'Tu progreso' },
  fr: { rosetta: 'Rosette des commandes', fehler: 'Catalogue d’erreurs', fortschritt: 'Ta progression' },
  zh: { rosetta: '命令对照表', fehler: '错误图鉴', fortschritt: '你的进度' },
};

// Handles von Marvin (13.07.2026); GitHub Sponsors folgt nach Anmeldung
const DONATE_LINKS: { label: string; href: string | null }[] = [
  { label: 'PayPal', href: 'https://paypal.me/Marv7879' },
  { label: 'Ko-fi', href: 'https://ko-fi.com/marvinm' },
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
        <div style={{ maxWidth: 520 }}>
          <p style={{ margin: 0, lineHeight: 1.55 }}>
            {t.footerNote}{' '}
            <a href="/impressum/" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Impressum
            </a>
          </p>
          {/* Eigene Zeile statt Fließtext: als Nachschlage-Einstiege brauchen sie
              fingerfreundliche Höhe (waren 19 px, Audit It. 166). */}
          <nav style={{ margin: '10px 0 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { href: `/${lang}/rosetta/`, label: `🔄 ${EXTRA_LINKS[lang].rosetta}` },
              { href: `/${lang}/fehler/`, label: `🩺 ${EXTRA_LINKS[lang].fehler}` },
              { href: `/${lang}/fortschritt/`, label: `📊 ${EXTRA_LINKS[lang].fortschritt}` },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 40,
                  padding: '6px 12px',
                  border: '2px solid rgba(43,33,24,.25)',
                  borderRadius: 99,
                  fontWeight: 600,
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
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
