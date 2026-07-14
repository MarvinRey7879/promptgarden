export const metadata = { title: 'Impressum — promptgarten' };

export default function Impressum() {
  return (
    <div className="wrap" style={{ maxWidth: 640, padding: '50px 20px 80px' }}>
      <h1 style={{ fontWeight: 800, letterSpacing: '-.02em' }}>Impressum</h1>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 28 }}>Angaben gemäß § 5 DDG</h2>
      <p style={{ lineHeight: 1.7 }}>
        Marvin Mez
        <br />
        Zinhainerweg 6
        <br />
        50767 Köln
        <br />
        Deutschland
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 24 }}>Kontakt</h2>
      <p style={{ lineHeight: 1.7 }}>
        E-Mail: marvinmez2002@gmail.com
        <br />
        Telefon: +49 172 3240478
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 24 }}>Umsatzsteuer-ID</h2>
      <p style={{ lineHeight: 1.7 }}>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE461538484
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 24 }}>
        Verantwortlich für den Inhalt
      </h2>
      <p style={{ lineHeight: 1.7 }}>Marvin Mez (Anschrift wie oben)</p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 32 }}>Datenschutz (Kurzfassung)</h2>
      <p style={{ lineHeight: 1.7 }}>
        promptgarten verwendet keine Cookies und kein personenbezogenes Tracking. Erfasst werden
        ausschließlich anonyme Seitenaufrufe (Pfad, Sprache, Herkunftsland, Datum) — ohne
        Speicherung von IP-Adressen, ohne Nutzer-IDs, ohne Profile. Zur ungefähren Zählung
        einzelner Besucher wird ein täglich wechselnder, nicht rückrechenbarer Kurz-Hash
        verwendet; IP-Adresse und Browser-Kennung werden dafür nie gespeichert und der Hash ist
        nach 24 Stunden wertlos. Aufrufe des Betreibers werden aus den Statistiken
        herausgefiltert. Lernfortschritt (XP, Streak) wird nur lokal in
        deinem Browser gespeichert und nie übertragen. Freiwillige Eingaben (Bug-Meldungen,
        Feedback, Newsletter-E-Mail) werden zweckgebunden gespeichert und nicht weitergegeben.
        Hosting und Datenspeicherung: Cloudflare (Pages, Workers, D1). Auskunft und Löschung
        jederzeit per E-Mail.
      </p>
      <p style={{ lineHeight: 1.7 }}>
        <b>Werbung (optional, nur mit Einwilligung):</b> Zur Finanzierung der kostenlosen Inhalte
        kann Google AdSense (Google Ireland Ltd.) eingebunden werden. Das Werbe-Skript wird
        ausschließlich geladen, wenn du im Hinweis-Banner ausdrücklich zustimmst — erst dann setzt
        Google Cookies bzw. verarbeitet Daten gemäß den{' '}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
          Google-Richtlinien
        </a>
        . Ohne Zustimmung bleibt die Seite werbefrei und cookielos. Deine Entscheidung wird lokal
        gespeichert (pg_ads_consent) und lässt sich durch Löschen der Website-Daten im Browser
        jederzeit widerrufen.
      </p>
    </div>
  );
}
