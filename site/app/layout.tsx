import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-bricolage',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://promptgarten.com'),
  title: 'promptgarten 🌱 — Pflanze dein KI-Wissen an',
  description:
    'Kostenlose Lern-Plattform für Coden mit KI: Begriffe, Prompts, Agenten, Loops. Simpel erklärt, immer aktuell.',
  robots: { index: true, follow: true }, // Domain aktiv seit 13.07.2026 — indexierbar
  openGraph: {
    siteName: 'promptgarten',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  // AdSense-Site-Verifikation: reines Meta-Tag, löst keinen Google-Request aus.
  // Das eigentliche Ads-Script lädt erst nach Consent (components/AdsConsent.tsx).
  other: { 'google-adsense-account': 'ca-pub-6850490267678365' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${bricolage.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
