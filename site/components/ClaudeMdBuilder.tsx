'use client';

import { useMemo, useState } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * CLAUDE.md-Generator (Ideen-Runde 5): Felder ausfüllen → fertige CLAUDE.md /
 * AGENTS.md zum Kopieren. Rein clientseitig. Die generierte Datei nutzt
 * englische Standard-Überschriften (agenten-lesbar, konventionell); die
 * Bedien-Oberfläche ist übersetzt.
 */
const T: Record<Lang, Record<string, string>> = {
  de: { title: 'CLAUDE.md-Generator', sub: 'Felder ausfüllen — fertige CLAUDE.md / AGENTS.md zum Kopieren. Rein clientseitig, nichts wird gesendet.', name: 'Projektname', desc: 'Kurzbeschreibung', stack: 'Sprache / Laufzeit', pkg: 'Paketmanager', build: 'Build-Befehl', test: 'Test-Befehl', run: 'Start-Befehl', lint: 'Lint-Befehl', conv: 'Konventionen (eine pro Zeile)', dos: 'DO — erwünscht (eine pro Zeile)', donts: 'DON’T — vermeiden (eine pro Zeile)', notes: 'Notizen', preview: 'Fertige CLAUDE.md', copy: '📋 CLAUDE.md kopieren', copied: '✓ Kopiert' },
  en: { title: 'CLAUDE.md generator', sub: 'Fill the fields — get a ready-to-paste CLAUDE.md / AGENTS.md. Fully client-side, nothing is sent.', name: 'Project name', desc: 'Short description', stack: 'Language / runtime', pkg: 'Package manager', build: 'Build command', test: 'Test command', run: 'Run command', lint: 'Lint command', conv: 'Conventions (one per line)', dos: 'DO — encouraged (one per line)', donts: 'DON’T — avoid (one per line)', notes: 'Notes', preview: 'Final CLAUDE.md', copy: '📋 Copy CLAUDE.md', copied: '✓ Copied' },
  es: { title: 'Generador de CLAUDE.md', sub: 'Rellena los campos — obtén un CLAUDE.md / AGENTS.md listo para pegar. Todo en el cliente, nada se envía.', name: 'Nombre del proyecto', desc: 'Descripción breve', stack: 'Lenguaje / runtime', pkg: 'Gestor de paquetes', build: 'Comando de build', test: 'Comando de test', run: 'Comando de arranque', lint: 'Comando de lint', conv: 'Convenciones (una por línea)', dos: 'DO — recomendado (una por línea)', donts: 'DON’T — evitar (una por línea)', notes: 'Notas', preview: 'CLAUDE.md final', copy: '📋 Copiar CLAUDE.md', copied: '✓ Copiado' },
  fr: { title: 'Générateur de CLAUDE.md', sub: 'Remplis les champs — obtiens un CLAUDE.md / AGENTS.md prêt à coller. Entièrement côté client, rien n’est envoyé.', name: 'Nom du projet', desc: 'Description courte', stack: 'Langage / runtime', pkg: 'Gestionnaire de paquets', build: 'Commande de build', test: 'Commande de test', run: 'Commande de démarrage', lint: 'Commande de lint', conv: 'Conventions (une par ligne)', dos: 'DO — recommandé (une par ligne)', donts: 'DON’T — à éviter (une par ligne)', notes: 'Notes', preview: 'CLAUDE.md final', copy: '📋 Copier CLAUDE.md', copied: '✓ Copié' },
  zh: { title: 'CLAUDE.md 生成器', sub: '填写字段——生成可直接粘贴的 CLAUDE.md / AGENTS.md。全程在浏览器本地，不发送任何数据。', name: '项目名称', desc: '简短描述', stack: '语言 / 运行时', pkg: '包管理器', build: '构建命令', test: '测试命令', run: '启动命令', lint: 'Lint 命令', conv: '约定（每行一条）', dos: 'DO——鼓励做的（每行一条）', donts: 'DON’T——避免做的（每行一条）', notes: '备注', preview: '最终 CLAUDE.md', copy: '📋 复制 CLAUDE.md', copied: '✓ 已复制' },
};

type Preset = { pkg: string; build: string; test: string; run: string; lint: string };
const PRESETS: Record<string, Preset> = {
  'TypeScript / Node': { pkg: 'pnpm', build: 'pnpm build', test: 'pnpm test', run: 'pnpm dev', lint: 'pnpm lint && pnpm typecheck' },
  'Python': { pkg: 'uv (or pip)', build: '', test: 'pytest', run: 'python main.py', lint: 'ruff check .' },
  'Go': { pkg: 'go modules', build: 'go build ./...', test: 'go test ./...', run: 'go run .', lint: 'golangci-lint run' },
  'Rust': { pkg: 'cargo', build: 'cargo build', test: 'cargo test', run: 'cargo run', lint: 'cargo clippy -- -D warnings' },
  'Java / Kotlin': { pkg: 'Gradle', build: './gradlew build', test: './gradlew test', run: './gradlew run', lint: './gradlew check' },
  'Other': { pkg: '', build: '', test: '', run: '', lint: '' },
};

const DEFAULT_CONV = 'Match the style of the surrounding code.\nSmall, focused changes; no unrelated refactors.\nWrite tests for new behavior.';
const DEFAULT_DO = 'Run the test command before saying a task is done.\nAsk before large or destructive changes.';
const DEFAULT_DONT = 'Do not commit secrets or .env files.\nDo not add dependencies without asking.';

function bullets(text: string): string {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => `- ${l}`).join('\n');
}

export default function ClaudeMdBuilder({ lang }: { lang: Lang }) {
  const t = T[lang] ?? T.de;
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [stack, setStack] = useState('TypeScript / Node');
  const [pkg, setPkg] = useState(PRESETS['TypeScript / Node'].pkg);
  const [build, setBuild] = useState(PRESETS['TypeScript / Node'].build);
  const [test, setTest] = useState(PRESETS['TypeScript / Node'].test);
  const [run, setRun] = useState(PRESETS['TypeScript / Node'].run);
  const [lint, setLint] = useState(PRESETS['TypeScript / Node'].lint);
  const [conv, setConv] = useState(DEFAULT_CONV);
  const [dos, setDos] = useState(DEFAULT_DO);
  const [donts, setDonts] = useState(DEFAULT_DONT);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const applyStack = (s: string) => {
    setStack(s);
    const p = PRESETS[s];
    if (p) { setPkg(p.pkg); setBuild(p.build); setTest(p.test); setRun(p.run); setLint(p.lint); }
  };

  const output = useMemo(() => {
    const lines: string[] = ['# CLAUDE.md', ''];
    lines.push('## Project', `${name.trim() || 'My project'}${desc.trim() ? ` — ${desc.trim()}` : ''}`, '');
    lines.push('## Tech stack', `- Language / runtime: ${stack}`);
    if (pkg.trim()) lines.push(`- Package manager: ${pkg.trim()}`);
    lines.push('');
    const cmds: string[] = [];
    if (build.trim()) cmds.push(`- Build: \`${build.trim()}\``);
    if (test.trim()) cmds.push(`- Test: \`${test.trim()}\``);
    if (run.trim()) cmds.push(`- Run: \`${run.trim()}\``);
    if (lint.trim()) cmds.push(`- Lint: \`${lint.trim()}\``);
    if (cmds.length) { lines.push('## Commands', ...cmds, ''); }
    if (conv.trim()) lines.push('## Conventions', bullets(conv), '');
    if (dos.trim()) lines.push('## Do', bullets(dos), '');
    if (donts.trim()) lines.push("## Don't", bullets(donts), '');
    if (notes.trim()) lines.push('## Notes', notes.trim(), '');
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }, [name, desc, stack, pkg, build, test, run, lint, conv, dos, donts, notes]);

  const field = (label: string, value: string, set: (v: string) => void, opts?: { area?: boolean; mono?: boolean }) => (
    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>
      {label}
      {opts?.area ? (
        <textarea className="field" value={value} onChange={(e) => set(e.target.value)} rows={3}
          style={{ display: 'block', width: '100%', marginTop: 4, fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical' }} />
      ) : (
        <input className="field" value={value} onChange={(e) => set(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4, fontSize: 13.5, fontFamily: opts?.mono ? 'var(--mono, monospace)' : 'inherit' }} />
      )}
    </label>
  );

  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
      <div>
        {field(t.name, name, setName)}
        {field(t.desc, desc, setDesc)}
        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>
          {t.stack}
          <select className="field" value={stack} onChange={(e) => applyStack(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4, fontSize: 13.5, fontFamily: 'inherit' }}>
            {Object.keys(PRESETS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        {field(t.pkg, pkg, setPkg, { mono: true })}
        {field(t.build, build, setBuild, { mono: true })}
        {field(t.test, test, setTest, { mono: true })}
        {field(t.run, run, setRun, { mono: true })}
        {field(t.lint, lint, setLint, { mono: true })}
        {field(t.conv, conv, setConv, { area: true })}
        {field(t.dos, dos, setDos, { area: true })}
        {field(t.donts, donts, setDonts, { area: true })}
        {field(t.notes, notes, setNotes, { area: true })}
      </div>
      <div style={{ position: 'sticky', top: 16 }}>
        <p className="kicker" style={{ marginBottom: 8 }}>{t.preview}</p>
        <pre className="mono" style={{ background: 'var(--ink)', color: 'var(--bg)', border: '2.5px solid var(--ink)', borderRadius: 12, padding: '16px 18px', fontSize: 12.5, lineHeight: 1.6, whiteSpace: 'pre-wrap', maxHeight: 520, overflow: 'auto', margin: '0 0 12px' }}>
          {output}
        </pre>
        <button className="btn" style={{ fontSize: 13.5 }} onClick={async () => {
          try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* blockiert */ }
        }}>
          {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
