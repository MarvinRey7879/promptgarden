import de from '@/content/fehler.de.json';
import en from '@/content/fehler.en.json';
import es from '@/content/fehler.es.json';
import fr from '@/content/fehler.fr.json';
import zh from '@/content/fehler.zh.json';
import type { Lang } from './i18n';

export type FehlerKategorie = 'limits' | 'auth' | 'kontext' | 'werkzeuge' | 'sicherheit' | 'code' | 'setup';

export type FehlerEintrag = {
  id: string;
  symptom: string;
  kategorie: FehlerKategorie;
  plattformen: string[];
  ursache: string;
  fix: string[];
  vorbeugen: string;
  sources: { title: string; url: string }[];
};

export type FehlerFile = {
  title: string;
  intro: string;
  stand: string;
  items: FehlerEintrag[];
};

const byLang: Record<Lang, FehlerFile> = {
  de: de as FehlerFile,
  en: en as FehlerFile,
  es: es as FehlerFile,
  fr: fr as FehlerFile,
  zh: zh as FehlerFile,
};

export function getFehler(lang: Lang): FehlerFile {
  return byLang[lang];
}
