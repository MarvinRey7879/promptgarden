'use client';

import { useState } from 'react';

/**
 * Modell-Preisrechner (Marvin-Ideen-Wahl #2): Listenpreise $/MTok aus der
 * verifizierten Preistabelle (research/vergleiche-modelle-research.md, Stand: Juli 2026).
 * Reine Client-Rechnung, keine Requests. Quellen unten verlinkt.
 */
type PriceModel = { name: string; anbieter: string; inP: number; outP: number; note?: string; batch?: boolean };

// Stand: Juli 2026 — Listenpreise laut Anbieter-Preisseiten (Quellen im Disclaimer)
const MODELS: PriceModel[] = [
  // Batch-Flag nur wo der −50-%-Rabatt vom Anbieter dokumentiert ist (Research 17.07.2026)
  { name: 'Haiku 4.5', anbieter: 'Anthropic', inP: 1, outP: 5, batch: true },
  { name: 'Sonnet 5', anbieter: 'Anthropic', inP: 3, outP: 15, note: 'intro', batch: true },
  { name: 'Opus 4.8', anbieter: 'Anthropic', inP: 5, outP: 25, batch: true },
  { name: 'Fable 5', anbieter: 'Anthropic', inP: 10, outP: 50, batch: true },
  { name: 'GPT-5.6 Luna', anbieter: 'OpenAI', inP: 1, outP: 6 },
  { name: 'GPT-5.6 Terra', anbieter: 'OpenAI', inP: 2.5, outP: 15 },
  { name: 'GPT-5.6 Sol', anbieter: 'OpenAI', inP: 5, outP: 30 },
  { name: 'Gemini 3.5 Flash', anbieter: 'Google', inP: 1.5, outP: 9, batch: true },
  { name: 'Gemini 3.1 Pro', anbieter: 'Google', inP: 2, outP: 12, note: 'tier', batch: true },
  { name: 'Grok 4.5', anbieter: 'xAI', inP: 2, outP: 6 },
  { name: 'Kimi K3', anbieter: 'Moonshot', inP: 3, outP: 15 },
  { name: 'Kimi K2.5', anbieter: 'Moonshot', inP: 0.6, outP: 3 },
  { name: 'DeepSeek-V4-Pro', anbieter: 'DeepSeek', inP: 0.435, outP: 0.87 },
  { name: 'GLM-4.7', anbieter: 'Zhipu', inP: 0.6, outP: 2.2 },
  { name: 'Muse Spark 1.1', anbieter: 'Meta', inP: 1.25, outP: 4.25 },
  { name: 'Qwen3.7-Max', anbieter: 'Alibaba', inP: 2.5, outP: 7.5, batch: true },
];

const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: 'var(--lime)',
  OpenAI: 'var(--blue)',
  Google: 'var(--yellow)',
  xAI: 'var(--pink)',
  Moonshot: '#e0d4f7',
  DeepSeek: '#c9e8f0',
  Zhipu: '#f0e0c9',
  Meta: '#d4e8d4',
  Alibaba: '#f7d4d4',
};

const TXT: Record<string, Record<string, string>> = {
  de: {
    kicker: '💶 PREISRECHNER — WAS KOSTET DEIN SETUP PRO MONAT?',
    inTok: 'Input pro Anfrage',
    outTok: 'Output pro Anfrage',
    reqs: 'Anfragen pro Tag',
    batch: 'Batch-API (−50 % — nur bei Modellen mit dokumentiertem Batch-Rabatt)',
    month: '≈ Monatskosten (30 Tage, Listenpreise)',
    noteIntro: 'Sonnet 5: Einführungspreis 2/10 $ bis 31.08.2026 — Rechner nutzt den regulären Preis 3/15 $.',
    noteTier: 'Gemini 3.1 Pro: Preis gilt bis 200k-Prompts; darüber 4/18 $.',
    disclaimer: 'Listenpreise der Anbieter-Preisseiten (Stand: Juli 2026), ohne Caching/Rabatte/Abos — reale Kosten können abweichen. Quellen:',
  },
  en: {
    kicker: '💶 PRICE CALCULATOR — WHAT DOES YOUR SETUP COST PER MONTH?',
    inTok: 'Input per request',
    outTok: 'Output per request',
    reqs: 'Requests per day',
    batch: 'Batch API (−50% — only for models with a documented batch discount)',
    month: '≈ monthly cost (30 days, list prices)',
    noteIntro: 'Sonnet 5: intro pricing $2/$10 until Aug 31, 2026 — calculator uses the regular $3/$15.',
    noteTier: 'Gemini 3.1 Pro: price applies up to 200k prompts; above that $4/$18.',
    disclaimer: 'List prices from vendor pricing pages (as of July 2026), excluding caching/discounts/subscriptions — real costs may differ. Sources:',
  },
  es: {
    kicker: '💶 CALCULADORA DE PRECIOS — ¿CUÁNTO CUESTA TU SETUP AL MES?',
    inTok: 'Input por petición',
    outTok: 'Output por petición',
    reqs: 'Peticiones al día',
    batch: 'Batch API (−50 % — solo para modelos con descuento batch documentado)',
    month: '≈ coste mensual (30 días, precios de lista)',
    noteIntro: 'Sonnet 5: precio de lanzamiento 2/10 $ hasta el 31.08.2026 — la calculadora usa el precio regular 3/15 $.',
    noteTier: 'Gemini 3.1 Pro: precio hasta prompts de 200k; por encima, 4/18 $.',
    disclaimer: 'Precios de lista de las páginas oficiales (a fecha de julio de 2026), sin caché/descuentos/suscripciones — el coste real puede variar. Fuentes:',
  },
  fr: {
    kicker: '💶 CALCULATEUR DE PRIX — COMBIEN COÛTE TON SETUP PAR MOIS ?',
    inTok: 'Input par requête',
    outTok: 'Output par requête',
    reqs: 'Requêtes par jour',
    batch: 'Batch API (−50 % — uniquement pour les modèles avec remise batch documentée)',
    month: '≈ coût mensuel (30 jours, prix catalogue)',
    noteIntro: 'Sonnet 5 : prix de lancement 2/10 $ jusqu’au 31.08.2026 — le calculateur utilise le prix normal 3/15 $.',
    noteTier: 'Gemini 3.1 Pro : prix jusqu’à 200k de prompt ; au-delà 4/18 $.',
    disclaimer: 'Prix catalogue des pages officielles (état : juillet 2026), hors cache/remises/abonnements — le coût réel peut varier. Sources :',
  },
  zh: {
    kicker: '💶 价格计算器——你的用量每月要花多少？',
    inTok: '每次请求的输入',
    outTok: '每次请求的输出',
    reqs: '每天请求数',
    batch: 'Batch API（−50%——仅适用于官方说明有批量折扣的模型）',
    month: '≈ 每月费用（30 天，按目录价）',
    noteIntro: 'Sonnet 5：2026-08-31 前为推广价 $2/$10——计算器使用常规价 $3/$15。',
    noteTier: 'Gemini 3.1 Pro：价格适用于 200k 以内的提示；超过为 $4/$18。',
    disclaimer: '价格来自各官方定价页（截至 2026 年 7 月），不含缓存/折扣/订阅——实际费用可能不同。来源：',
  },
};

const SOURCES = [
  { title: 'Anthropic Pricing', url: 'https://platform.claude.com/docs/en/about-claude/pricing' },
  { title: 'OpenAI Models', url: 'https://developers.openai.com/api/docs/models' },
  { title: 'Gemini API Pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { title: 'xAI Models', url: 'https://docs.x.ai/docs/models' },
  { title: 'Kimi Pricing', url: 'https://platform.kimi.ai/docs/pricing/chat-k3' },
  { title: 'DeepSeek Pricing', url: 'https://api-docs.deepseek.com/quick_start/pricing/' },
  { title: 'Z.ai Pricing', url: 'https://docs.z.ai/guides/overview/pricing' },
  { title: 'Meta Model API', url: 'https://developer.meta.com/ai/products/meta-model-api/' },
  { title: 'Alibaba Model Studio', url: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing' },
];

const fmt = (n: number) =>
  n >= 100 ? `$${Math.round(n).toLocaleString('en-US')}` : n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(3)}`;

export default function PriceCalculator({ lang }: { lang: string }) {
  const t = TXT[lang] ?? TXT.de;
  const [inTok, setInTok] = useState(20); // k Tokens
  const [outTok, setOutTok] = useState(2); // k Tokens
  const [reqs, setReqs] = useState(50);
  const [batch, setBatch] = useState(false);

  const rows = MODELS.map((m) => {
    const factor = batch && m.batch ? 0.5 : 1;
    const perReq = ((inTok * 1000) / 1e6) * m.inP + ((outTok * 1000) / 1e6) * m.outP;
    return { ...m, cost: perReq * reqs * 30 * factor };
  }).sort((a, b) => a.cost - b.cost);
  const max = rows[rows.length - 1].cost || 1;

  const Slider = ({ label, value, set, min, max: mx, step, unit }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; unit: string }) => (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>
      {label}: <span className="mono" style={{ background: 'var(--yellow)', borderRadius: 6, padding: '0 6px' }}>{value.toLocaleString('de-DE')}{unit}</span>
      <input type="range" min={min} max={mx} step={step} value={value} onChange={(e) => set(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--ink)' }} />
    </label>
  );

  return (
    <div className="card" style={{ padding: '20px 24px', marginBottom: 30, background: '#fff', boxShadow: '5px 5px 0 var(--ink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>{t.kicker}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '12px 0' }}>
        <Slider label={t.inTok} value={inTok} set={setInTok} min={1} max={200} step={1} unit="k Tok" />
        <Slider label={t.outTok} value={outTok} set={setOutTok} min={0.5} max={32} step={0.5} unit="k Tok" />
        <Slider label={t.reqs} value={reqs} set={setReqs} min={1} max={500} step={1} unit="" />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginBottom: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={batch} onChange={(e) => setBatch(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--ink)' }} />
        {t.batch}
      </label>

      <p className="kicker" style={{ marginBottom: 8 }}>{t.month.toUpperCase()}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rows.map((r) => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
            <span className="mono" style={{ width: 130, fontWeight: 700, flex: 'none' }}>{r.name}</span>
            <div style={{ flex: 1, background: '#00000010', borderRadius: 8, height: 20, border: '2px solid var(--ink)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.max((r.cost / max) * 100, 1.5)}%`, background: PROVIDER_COLORS[r.anbieter], height: '100%' }} />
            </div>
            <span className="mono" style={{ width: 86, textAlign: 'right', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{fmt(r.cost)}</span>
          </div>
        ))}
      </div>

      <p style={{ margin: '12px 0 0', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>
        {t.noteIntro} {t.noteTier}
        <br />
        {t.disclaimer}{' '}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{s.title}</a>
          </span>
        ))}
      </p>
    </div>
  );
}
