import de from '@/content/commands.de.json';
import en from '@/content/commands.en.json';
import es from '@/content/commands.es.json';
import fr from '@/content/commands.fr.json';
import zh from '@/content/commands.zh.json';
import type { Lang } from './i18n';

export type Platform = {
  id: string; // 'claude-code'
  name: string; // 'Claude Code'
  tagline: string; // 1 Satz, was die Plattform ist
  docsUrl: string; // offizielle Doku (Quellenpflicht)
};

export type Command = {
  platform: string; // Platform.id
  slug: string; // 'goal'
  name: string; // '/goal'
  summary: string; // 1 Satz für Listen
  what: string; // simpel + faktisch, nur dokumentiertes Verhalten
  whenGood: { title: string; example: string }[];
  whenBad: { title: string; why: string; alternative: string }[];
  sources: { title: string; url: string }[];
};

type CommandsFile = { platforms: Platform[]; commands: Command[] };

const byLang: Record<Lang, CommandsFile> = {
  de: de as CommandsFile,
  en: en as CommandsFile,
  es: es as CommandsFile,
  fr: fr as CommandsFile,
  zh: zh as CommandsFile,
};

export function getPlatforms(lang: Lang): Platform[] {
  return byLang[lang].platforms;
}

export function getPlatform(lang: Lang, id: string): Platform | undefined {
  return byLang[lang].platforms.find((p) => p.id === id);
}

export function getCommands(lang: Lang, platform?: string): Command[] {
  const all = byLang[lang].commands;
  return platform ? all.filter((c) => c.platform === platform) : all;
}

export function getCommand(lang: Lang, platform: string, slug: string): Command | undefined {
  return byLang[lang].commands.find((c) => c.platform === platform && c.slug === slug);
}
