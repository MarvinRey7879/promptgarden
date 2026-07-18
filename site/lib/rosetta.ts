import de from '@/content/rosetta.de.json';
import en from '@/content/rosetta.en.json';
import es from '@/content/rosetta.es.json';
import fr from '@/content/rosetta.fr.json';
import zh from '@/content/rosetta.zh.json';
import type { Lang } from './i18n';

export type RosettaCell = { slug: string; name: string } | null;

export type RosettaTask = {
  id: string;
  label: string;
  hint: string;
  cells: Record<string, RosettaCell>;
};

export type RosettaGroup = { id: string; label: string; tasks: RosettaTask[] };

export type RosettaFile = {
  title: string;
  intro: string;
  stand: string;
  platforms: string[];
  groups: RosettaGroup[];
};

const byLang: Record<Lang, RosettaFile> = {
  de: de as RosettaFile,
  en: en as RosettaFile,
  es: es as RosettaFile,
  fr: fr as RosettaFile,
  zh: zh as RosettaFile,
};

export function getRosetta(lang: Lang): RosettaFile {
  return byLang[lang];
}
