'use client';

export type Progress = {
  xp: number;
  streak: number;
  lastVisit: string; // YYYY-MM-DD
  completed: string[];
  /** XP-Stand je Tag (YYYY-MM-DD → XP), für die Fortschritts-Kurve. Max. 120 Tage. */
  history?: Record<string, number>;
};

const HISTORY_DAYS = 120;

const KEY = 'pg_progress_v1';
export const PROGRESS_EVENT = 'pg-progress';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadProgress(): Progress {
  if (typeof window === 'undefined') {
    return { xp: 0, streak: 0, lastVisit: '', completed: [], history: {} };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { xp: 0, streak: 0, lastVisit: '', completed: [], history: {} };
    const p = JSON.parse(raw) as Progress;
    return {
      xp: typeof p.xp === 'number' ? p.xp : 0,
      streak: typeof p.streak === 'number' ? p.streak : 0,
      lastVisit: typeof p.lastVisit === 'string' ? p.lastVisit : '',
      completed: Array.isArray(p.completed) ? p.completed : [],
      history: p.history && typeof p.history === 'object' ? p.history : {},
    };
  } catch {
    return { xp: 0, streak: 0, lastVisit: '', completed: [], history: {} };
  }
}

function save(p: Progress) {
  try {
    // Tages-Snapshot für die Kurve; ältere Einträge fallen hinten raus.
    const hist = { ...(p.history ?? {}), [today()]: p.xp };
    const keys = Object.keys(hist).sort();
    for (const k of keys.slice(0, Math.max(0, keys.length - HISTORY_DAYS))) delete hist[k];
    p.history = hist;
    localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
  } catch {
    /* storage full/blocked — gamification is optional */
  }
}

/** Call on page visit: maintains the day streak. */
export function touchVisit(): Progress {
  const p = loadProgress();
  const t = today();
  if (p.lastVisit === t) return p;
  p.streak = p.lastVisit === yesterday() ? p.streak + 1 : 1;
  p.lastVisit = t;
  save(p);
  return p;
}

/** Award XP for an entry exactly once. */
export function completeEntry(slug: string, xp: number): Progress {
  const p = touchVisit();
  if (!p.completed.includes(slug)) {
    p.completed.push(slug);
    p.xp += xp;
    save(p);
  }
  return p;
}

export function isCompleted(slug: string): boolean {
  return loadProgress().completed.includes(slug);
}

/** XP-Level (sprachneutral als Emoji): 🌱 Start, 🌿 ab 200 XP, 🌳 ab 600 XP */
export function levelEmoji(xp: number): string {
  if (xp >= 600) return '🌳';
  if (xp >= 200) return '🌿';
  return '🌱';
}
