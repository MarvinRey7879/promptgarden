'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * Starter-Kit im Wizard-Ergebnis (Ideen-Runde 4): generierte Projekt-Anleitungsdatei
 * zum Kopieren + die ersten Befehle der gewählten Plattform.
 * Dateinamen sind belegt: CLAUDE.md (code.claude.com/docs/en/memory),
 * .cursor/rules (cursor.com/docs/cli/changelog), CONVENTIONS.md
 * (aider.chat/docs/usage/conventions.html), AGENTS.md (developers.openai.com/codex/cli).
 */
export type KitCommand = { platform: string; slug: string; name: string; summary: string };

export type WizardKitData = {
  /** Index der Tool-Frage (0 Claude Code, 1 Cursor, 2 Aider, 3 Codex, 4 noch keins) → Befehle */
  commandsByTool: KitCommand[][];
};

const FILE_BY_TOOL = ['CLAUDE.md', '.cursor/rules/projekt.mdc', 'CONVENTIONS.md', 'AGENTS.md'];
const PLATFORM_BY_TOOL = ['claude-code', 'cursor-cli', 'aider', 'codex-cli'];

const DICT: Record<Lang, {
  fileTitle: (f: string) => string;
  fileHint: string;
  copy: string;
  copied: string;
  cmdTitle: string;
  cmdHint: string;
  edit: string;
  levels: Record<string, string>;
  tpl: (level: string) => string;
}> = {
  de: {
    fileTitle: (f) => `Deine ${f} zum Kopieren`,
    fileHint: 'Leg diese Datei ins Projekt-Hauptverzeichnis. Der Agent liest sie bei jedem Start und hält sich an die Regeln. Passe die eckigen Klammern an dein Projekt an.',
    copy: 'Datei kopieren',
    copied: '✓ Kopiert',
    cmdTitle: 'Deine ersten Befehle',
    cmdHint: 'Mit diesen kommst du im Alltag am weitesten — klick für die ausführliche Erklärung.',
    edit: 'Anpassen und kopieren:',
    levels: { beginner: 'Erklär mir kurz, was du vorhast, bevor du Dateien änderst.', intermediate: 'Zeig mir bei größeren Änderungen zuerst einen Plan.', pro: 'Arbeite eigenständig, aber halte Commits klein und nachvollziehbar.' },
    tpl: (l) => `# Projekt-Anleitung

## Worum es geht
[Ein bis zwei Sätze: Was ist dieses Projekt, für wen?]

## Stack
[z.B. TypeScript, React, Node 22, PostgreSQL]

## So baust und testest du
- Installieren: \`[npm install]\`
- Starten: \`[npm run dev]\`
- Tests: \`[npm test]\`
- Vor jedem Commit: Tests laufen lassen, keine fehlschlagenden Tests einchecken.

## Regeln für dich als Agent
- ${l}
- Keine neuen Abhängigkeiten ohne Rückfrage.
- Bestehenden Code-Stil übernehmen statt eigenen einführen.
- Keine Secrets, Keys oder .env-Inhalte in Code oder Commits schreiben.
- Bei Unsicherheit: nachfragen statt raten.

## Was du nicht anfassen sollst
[z.B. /migrations, /vendor, generierte Dateien]`,
  },
  en: {
    fileTitle: (f) => `Your ${f}, ready to copy`,
    fileHint: 'Put this file in your project root. The agent reads it on every start and follows the rules. Replace the square brackets with your project details.',
    copy: 'Copy file',
    copied: '✓ Copied',
    cmdTitle: 'Your first commands',
    cmdHint: 'These carry you furthest day to day — click for the full explanation.',
    edit: 'Adjust and copy:',
    levels: { beginner: 'Briefly explain what you are about to do before changing files.', intermediate: 'Show me a plan first for larger changes.', pro: 'Work independently, but keep commits small and reviewable.' },
    tpl: (l) => `# Project guide

## What this is
[One or two sentences: what is this project, who is it for?]

## Stack
[e.g. TypeScript, React, Node 22, PostgreSQL]

## How to build and test
- Install: \`[npm install]\`
- Run: \`[npm run dev]\`
- Tests: \`[npm test]\`
- Before every commit: run the tests, never check in failing ones.

## Rules for you as an agent
- ${l}
- No new dependencies without asking.
- Follow the existing code style instead of introducing your own.
- Never write secrets, keys or .env contents into code or commits.
- When unsure: ask instead of guessing.

## What not to touch
[e.g. /migrations, /vendor, generated files]`,
  },
  es: {
    fileTitle: (f) => `Tu ${f} para copiar`,
    fileHint: 'Coloca este archivo en la raíz del proyecto. El agente lo lee en cada inicio y sigue las reglas. Sustituye los corchetes por los datos de tu proyecto.',
    copy: 'Copiar archivo',
    copied: '✓ Copiado',
    cmdTitle: 'Tus primeros comandos',
    cmdHint: 'Con estos llegarás más lejos en el día a día: haz clic para la explicación completa.',
    edit: 'Ajusta y copia:',
    levels: { beginner: 'Explica brevemente qué vas a hacer antes de modificar archivos.', intermediate: 'Muéstrame primero un plan para cambios grandes.', pro: 'Trabaja de forma autónoma, pero manteniendo commits pequeños y revisables.' },
    tpl: (l) => `# Guía del proyecto

## De qué se trata
[Una o dos frases: qué es este proyecto y para quién.]

## Stack
[p. ej. TypeScript, React, Node 22, PostgreSQL]

## Cómo compilar y probar
- Instalar: \`[npm install]\`
- Ejecutar: \`[npm run dev]\`
- Pruebas: \`[npm test]\`
- Antes de cada commit: ejecuta las pruebas, nunca subas pruebas que fallan.

## Reglas para ti como agente
- ${l}
- Sin nuevas dependencias sin preguntar.
- Sigue el estilo de código existente en lugar de imponer el tuyo.
- Nunca escribas secretos, claves ni contenido de .env en el código o los commits.
- Ante la duda: pregunta en vez de suponer.

## Qué no tocar
[p. ej. /migrations, /vendor, archivos generados]`,
  },
  fr: {
    fileTitle: (f) => `Ton ${f} à copier`,
    fileHint: 'Place ce fichier à la racine du projet. L’agent le lit à chaque démarrage et suit les règles. Remplace les crochets par les infos de ton projet.',
    copy: 'Copier le fichier',
    copied: '✓ Copié',
    cmdTitle: 'Tes premières commandes',
    cmdHint: 'Ce sont celles qui servent le plus au quotidien — clique pour l’explication complète.',
    edit: 'Adapte et copie :',
    levels: { beginner: 'Explique brièvement ce que tu vas faire avant de modifier des fichiers.', intermediate: 'Montre-moi d’abord un plan pour les changements importants.', pro: 'Travaille de façon autonome, mais garde des commits petits et relisibles.' },
    tpl: (l) => `# Guide du projet

## De quoi il s’agit
[Une ou deux phrases : quel est ce projet, pour qui ?]

## Stack
[p. ex. TypeScript, React, Node 22, PostgreSQL]

## Comment construire et tester
- Installer : \`[npm install]\`
- Lancer : \`[npm run dev]\`
- Tests : \`[npm test]\`
- Avant chaque commit : lance les tests, ne commite jamais de test en échec.

## Règles pour toi en tant qu’agent
- ${l}
- Pas de nouvelle dépendance sans demander.
- Reprends le style de code existant au lieu d’imposer le tien.
- N’écris jamais de secrets, de clés ou de contenu .env dans le code ou les commits.
- En cas de doute : demande plutôt que deviner.

## Ce qu’il ne faut pas toucher
[p. ex. /migrations, /vendor, fichiers générés]`,
  },
  zh: {
    fileTitle: (f) => `你的 ${f}（可直接复制）`,
    fileHint: '把这个文件放到项目根目录。智能体每次启动都会读取它并遵守其中的规则。请把方括号里的内容换成你项目的实际信息。',
    copy: '复制文件',
    copied: '✓ 已复制',
    cmdTitle: '你的第一批命令',
    cmdHint: '日常最常用的几条——点击查看详细说明。',
    edit: '修改后复制：',
    levels: { beginner: '修改文件之前，先简要说明你打算做什么。', intermediate: '较大的改动请先给我一份计划。', pro: '可以自主推进，但要保持提交小而清晰。' },
    tpl: (l) => `# 项目说明

## 这是什么
[一两句话：这个项目是什么、给谁用。]

## 技术栈
[例如 TypeScript、React、Node 22、PostgreSQL]

## 如何构建与测试
- 安装：\`[npm install]\`
- 启动：\`[npm run dev]\`
- 测试：\`[npm test]\`
- 每次提交前：先跑测试，不要提交失败的测试。

## 给智能体的规则
- ${l}
- 未经询问不要新增依赖。
- 沿用现有代码风格，不要另起一套。
- 绝不要把密钥、令牌或 .env 内容写进代码或提交。
- 拿不准时：先问，不要猜。

## 不要改动的部分
[例如 /migrations、/vendor、生成的文件]`,
  },
};

export default function WizardKit({ lang, level, tool, data }: { lang: Lang; level: string; tool: number; data: WizardKitData }) {
  const t = DICT[lang];
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState(() => t.tpl(t.levels[level] ?? t.levels.intermediate));

  if (tool < 0 || tool > 3) return null; // „noch kein Tool" → kein Kit
  const fileName = FILE_BY_TOOL[tool];
  const platform = PLATFORM_BY_TOOL[tool];
  const commands = data.commandsByTool[tool] ?? [];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard kann blockiert sein */
    }
  };

  return (
    <div style={{ marginTop: 22, textAlign: 'left' }}>
      <div className="card" style={{ padding: '18px 20px', background: 'var(--card)', boxShadow: '4px 4px 0 var(--ink)' }}>
        <p className="kicker" style={{ margin: '0 0 4px' }}>📄 {t.fileTitle(fileName).toUpperCase()}</p>
        <p style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>{t.fileHint}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label={t.fileTitle(fileName)}
          style={{
            width: '100%',
            minHeight: 240,
            padding: '12px 14px',
            fontFamily: 'var(--mono, ui-monospace, monospace)',
            fontSize: 12.5,
            lineHeight: 1.6,
            border: '2.5px solid var(--ink)',
            borderRadius: 12,
            background: 'var(--bg)',
            color: 'inherit',
            resize: 'vertical',
          }}
        />
        <button className="btn" onClick={copy} style={{ marginTop: 10 }}>
          {copied ? t.copied : `📋 ${t.copy}`}
        </button>
      </div>

      {commands.length > 0 && (
        <div className="card" style={{ padding: '18px 20px', marginTop: 14, background: 'var(--lime)', boxShadow: '4px 4px 0 var(--ink)' }}>
          <p className="kicker" style={{ margin: '0 0 4px', color: 'var(--ink)' }}>⌨️ {t.cmdTitle.toUpperCase()}</p>
          <p style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.55 }}>{t.cmdHint}</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 9 }}>
            {commands.map((c) => (
              <li key={c.slug} style={{ fontSize: 14, lineHeight: 1.5 }}>
                <Link href={`/${lang}/befehle/${platform}/${c.slug}/`} className="mono" style={{ fontWeight: 800 }}>
                  {c.name}
                </Link>
                <span style={{ display: 'block', fontSize: 13, marginTop: 2 }}>{c.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
