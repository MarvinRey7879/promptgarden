import de from '@/content/entries.de.json';
import en from '@/content/entries.en.json';
import es from '@/content/entries.es.json';
import feedDe from '@/content/feed.de.json';
import feedEn from '@/content/feed.en.json';
import feedEs from '@/content/feed.es.json';
import type { Lang } from './i18n';

export type Entry = {
  slug: string;
  title: string;
  category: 'begriff' | 'prompt-pattern' | 'konzept' | 'guide' | 'vergleich';
  difficulty: 1 | 2 | 3;
  minutes: number;
  xp: number;
  teaser: string;
  body: string;
  example: string;
  related: string[];
  quiz: { question: string; options: string[]; correct: number; explain: string };
  /** Harte Regel (Marvin 10.07): Quellen IMMER sichtbar auf der Seite. Optional nur bis Retrofit abgeschlossen. */
  sources?: { title: string; url: string }[];
};

const byLang: Record<Lang, Entry[]> = {
  de: de as Entry[],
  en: en as Entry[],
  es: es as Entry[],
};

export type FeedItem = {
  id: string;
  date: string;
  tag: 'modelle' | 'tools' | 'mcp' | 'security';
  title: string;
  summary: string;
  sources: { title: string; url: string }[];
};

const feedByLang: Record<Lang, FeedItem[]> = {
  de: feedDe as FeedItem[],
  en: feedEn as FeedItem[],
  es: feedEs as FeedItem[],
};

export function getFeed(lang: Lang): FeedItem[] {
  return [...feedByLang[lang]].sort((a, b) => b.date.localeCompare(a.date));
}

export function getEntries(lang: Lang): Entry[] {
  return byLang[lang];
}

export function getEntry(lang: Lang, slug: string): Entry | undefined {
  return byLang[lang].find((e) => e.slug === slug);
}

/** Welt 1 — Grundlagen: geordneter Lernpfad (Kapitel-Slugs) */
export const WORLD_1: string[] = [
  'was-ist-ein-llm',
  'token',
  'context-window',
  'prompt',
  'kontext-fuettern',
  'system-prompt',
  'halluzination',
  'erst-plan-dann-code',
];

/** Welt 2 — Agenten: eigener Pfad, unabhängig von Welt 1 freischaltbar */
export const WORLD_2: string[] = [
  'ki-agent',
  'agent-loop',
  'vibe-coding',
  'subagents',
  'guardrails-fuer-agenten',
  'loops-fuer-agenten',
];

export function difficultyDots(d: 1 | 2 | 3): string {
  return '●'.repeat(d) + '○'.repeat(3 - d);
}
