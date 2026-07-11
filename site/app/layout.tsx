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
  title: 'promptgarden 🌱 — Pflanze dein KI-Wissen an',
  description:
    'Kostenlose Lern-Plattform für Coden mit KI: Begriffe, Prompts, Agenten, Loops. Simpel erklärt, immer aktuell.',
  robots: { index: false, follow: false }, // noindex bis Domain-Entscheidung
  openGraph: {
    siteName: 'promptgarden',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${bricolage.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
