'use client';

/**
 * Admin-Dashboard (nur für Marvin, nicht verlinkt, DE-only).
 * Liest /v1/admin/summary vom Worker, Prio-Notizen → /v1/admin/note.
 * Key wird lokal gespeichert (pg_admin_key), nie geloggt.
 * Zeigt Setup-Hinweis solange Backend nicht deployed (API_URL leer).
 */
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

type Summary = {
  open_bugs: { id: number; created_at: string; message: string; page?: string }[];
  new_feedback: { id: number; created_at: string; message: string; page?: string }[];
  open_admin_notes: { id: number; created_at: string; note: string; prio: number }[];
  newsletter_count: number;
  views_7d: number;
  top_paths_7d: { path: string; n: number }[];
  marvin_todos?: { id: number; created_at: string; title: string; detail: string; done: number }[];
  views_by_day?: { day: string; n: number }[];
  views_by_lang?: { lang: string; n: number }[];
  views_by_country?: { country: string; n: number }[];
  top_refs?: { ref_host: string; n: number }[];
  views_total?: number;
  newsletter_recent?: { id: number; created_at: string; email: string }[];
  donations?: { id: number; created_at: string; source: string; amount_cents: number; currency: string; supporter: string }[];
  revenue_total_cents?: number;
  revenue_count?: number;
};

function BarChart({ data }: { data: { day: string; n: number }[] }) {
  if (!data.length) return <p style={{ fontSize: 13 }}>Noch keine Daten.</p>;
  const max = Math.max(...data.map((d) => d.n), 1);
  const w = Math.max(data.length * 22, 200);
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${w} 120`} style={{ display: 'block', width: '100%', minWidth: 260, height: 'auto' }}>
        {data.map((d, i) => {
          const h = Math.max((d.n / max) * 90, 2);
          return (
            <g key={d.day}>
              <rect x={i * 22 + 3} y={104 - h} width={16} height={h} rx={3} fill="var(--lime)" stroke="var(--ink)" strokeWidth={1.5} />
              <title>{`${d.day}: ${d.n}`}</title>
              {i % 5 === 0 && (
                <text x={i * 22 + 11} y={116} textAnchor="middle" fontSize={8} fill="var(--muted)">
                  {d.day.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Dist({ rows, labelKey }: { rows: Array<{ n: number } & Record<string, string | number>>; labelKey: string }) {
  const total = rows.reduce((s, r) => s + r.n, 0) || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {rows.map((r) => (
        <div key={String(r[labelKey])} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
          <span className="mono" style={{ width: 34, fontWeight: 700 }}>{String(r[labelKey])}</span>
          <div style={{ flex: 1, background: '#00000012', borderRadius: 6, height: 14, border: '1.5px solid var(--ink)' }}>
            <div style={{ width: `${Math.max((r.n / total) * 100, 2)}%`, background: 'var(--blue)', height: '100%', borderRadius: 4 }} />
          </div>
          <span className="mono" style={{ width: 56, textAlign: 'right' }}>{r.n} · {Math.round((r.n / total) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function ManualDonation({ apiKey, onSaved }: { apiKey: string; onSaved: () => void }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('paypal');
  const save = async () => {
    const cents = Math.round(parseFloat(amount.replace(',', '.')) * 100);
    if (!Number.isFinite(cents) || cents <= 0) return;
    await fetch(`${API_URL}/v1/admin/donation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': apiKey },
      body: JSON.stringify({ amount_cents: cents, source }),
    });
    setAmount('');
    onSaved();
  };
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <input className="field" style={{ maxWidth: 90 }} placeholder="€ 5,00" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select className="field" style={{ maxWidth: 110 }} value={source} onChange={(e) => setSource(e.target.value)}>
        <option value="paypal">PayPal</option>
        <option value="ko-fi">Ko-fi</option>
        <option value="sonstiges">Sonstiges</option>
      </select>
      <button className="btn" onClick={save} disabled={!amount.trim()}>+ Spende</button>
    </div>
  );
}

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [prio, setPrio] = useState(2);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(localStorage.getItem('pg_admin_key') || '');
  }, []);

  const load = async (k: string) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/v1/admin/summary`, { headers: { 'X-Admin-Key': k } });
      if (!res.ok) {
        setError(`Fehler ${res.status} — Key falsch?`);
        return;
      }
      localStorage.setItem('pg_admin_key', k);
      setSummary(await res.json());
    } catch {
      setError('Backend nicht erreichbar.');
    }
  };

  const sendNote = async () => {
    const res = await fetch(`${API_URL}/v1/admin/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
      body: JSON.stringify({ note, prio }),
    });
    if (res.ok) {
      setNote('');
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      load(key);
    }
  };

  if (!API_URL) {
    return (
      <div className="wrap" style={{ maxWidth: 640, padding: '60px 20px' }}>
        <h1 style={{ fontWeight: 800 }}>Admin</h1>
        <p>
          Backend noch nicht deployed — wartet auf den Cloudflare-Token (siehe Statusboard-Artifact).
          Sobald der Worker live ist, erscheinen hier Traffic, Bugs, Feedback und dein Prio-Feld.
        </p>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ maxWidth: 760, padding: '40px 20px' }}>
      <h1 style={{ fontWeight: 800, letterSpacing: '-.02em' }}>🌱 promptgarten Admin</h1>

      {!summary ? (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <input
            className="field"
            type="password"
            placeholder="Admin-Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button className="btn" onClick={() => load(key)} disabled={!key}>
            Öffnen
          </button>
          {error && <p style={{ color: 'var(--accent)', fontWeight: 700 }}>{error}</p>}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '18px 0' }}>
            <span className="chip">👀 {summary.views_7d} Views (7d)</span>
            <span className="chip">Σ {summary.views_total ?? '–'} Views gesamt</span>
            <span className="chip">💶 {((summary.revenue_total_cents ?? 0) / 100).toFixed(2)} € Spenden ({summary.revenue_count ?? 0})</span>
            <span className="chip">📬 {summary.newsletter_count} Newsletter</span>
            <span className="chip">🐛 {summary.open_bugs.length} offene Bugs</span>
            <span className="chip">💬 {summary.new_feedback.length} neues Feedback</span>
          </div>

          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 18 }}>
            <div className="card" style={{ padding: '16px 20px', boxShadow: 'none' }}>
              <p className="kicker">📈 VIEWS PRO TAG (30 TAGE)</p>
              <BarChart data={summary.views_by_day ?? []} />
            </div>
            <div className="card" style={{ padding: '16px 20px', boxShadow: 'none' }}>
              <p className="kicker">🌍 SPRACHEN (7 TAGE)</p>
              <Dist rows={(summary.views_by_lang ?? []) as never} labelKey="lang" />
              <p className="kicker" style={{ marginTop: 14 }}>🗺️ LÄNDER (7 TAGE)</p>
              <Dist rows={(summary.views_by_country ?? []).slice(0, 6) as never} labelKey="country" />
            </div>
            <div className="card" style={{ padding: '16px 20px', boxShadow: 'none' }}>
              <p className="kicker">💶 SPENDEN</p>
              {(summary.donations ?? []).length === 0 ? (
                <p style={{ fontSize: 13, margin: '0 0 10px' }}>
                  Noch keine erfasst. Ko-fi-Webhook ist vorbereitet — schick mir deinen Ko-fi „Verification Token"
                  (ko-fi.com → Settings → API), dann buche ich Ko-fi-Spenden automatisch. PayPal-Spenden kannst du
                  unten manuell erfassen.
                </p>
              ) : (
                <ul style={{ margin: '0 0 10px', paddingLeft: 18, fontSize: 13 }}>
                  {(summary.donations ?? []).map((dn) => (
                    <li key={dn.id}>
                      {(dn.amount_cents / 100).toFixed(2)} {dn.currency} · {dn.source}
                      {dn.supporter ? ` · ${dn.supporter}` : ''}{' '}
                      <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{dn.created_at}</span>
                    </li>
                  ))}
                </ul>
              )}
              <ManualDonation apiKey={key} onSaved={() => load(key)} />
              <p className="kicker" style={{ marginTop: 14 }}>🔗 EXTERNE REFERRER (7 TAGE)</p>
              {(summary.top_refs ?? []).length === 0 ? (
                <p style={{ fontSize: 13, margin: 0 }}>Noch keine.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                  {(summary.top_refs ?? []).map((r) => (
                    <li key={r.ref_host}><span className="mono">{r.ref_host}</span> — {r.n}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '18px 22px', marginBottom: 18, background: 'var(--lime)', boxShadow: '4px 4px 0 var(--ink)' }}>
            <p className="kicker" style={{ color: 'var(--ink)' }}>✅ DEINE TO-DOS (Loop pflegt sie, du hakst ab)</p>
            {(summary.marvin_todos ?? []).length === 0 && (
              <p style={{ margin: 0, fontSize: 13.5 }}>Gerade nichts offen 🎉</p>
            )}
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14 }}>
              {(summary.marvin_todos ?? []).map((t) => (
                <li key={t.id} style={{ padding: '8px 0', borderBottom: '1px dashed var(--ink)' }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={t.done === 1}
                      style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--ink)' }}
                      onChange={async (e) => {
                        await fetch(`${API_URL}/v1/admin/todo`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
                          body: JSON.stringify({ action: 'toggle', id: t.id, done: e.target.checked }),
                        });
                        load(key);
                      }}
                    />
                    <span>
                      <b style={{ textDecoration: t.done === 1 ? 'line-through' : 'none' }}>{t.title}</b>
                      {t.detail && (
                        <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                          {t.detail}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: '18px 22px', marginBottom: 18, background: 'var(--yellow)', boxShadow: '4px 4px 0 var(--ink)' }}>
            <p className="kicker" style={{ color: 'var(--ink)' }}>PRIO-NOTIZ AN DIE LOOP</p>
            <textarea
              className="field"
              placeholder="Wunsch / Änderung / Idee — die Loop liest das jede Iteration"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
              <select
                className="field"
                style={{ maxWidth: 140 }}
                value={prio}
                onChange={(e) => setPrio(Number(e.target.value))}
              >
                <option value={1}>Prio 1 — hoch</option>
                <option value={2}>Prio 2 — normal</option>
                <option value={3}>Prio 3 — niedrig</option>
              </select>
              <button className="btn" onClick={sendNote} disabled={!note.trim()}>
                {saved ? '✓ Gespeichert' : 'An Loop senden'}
              </button>
            </div>
            {summary.open_admin_notes.length > 0 && (
              <ul style={{ margin: '14px 0 0', paddingLeft: 18, fontSize: 13.5 }}>
                {summary.open_admin_notes.map((n) => (
                  <li key={n.id}>
                    <b>P{n.prio}</b> {n.note} <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{n.created_at}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="card" style={{ padding: '16px 20px', boxShadow: 'none' }}>
              <p className="kicker">TOP-SEITEN (7 TAGE)</p>
              <table style={{ width: '100%', fontSize: 13 }}>
                <tbody>
                  {summary.top_paths_7d.map((p) => (
                    <tr key={p.path}>
                      <td className="mono" style={{ padding: '3px 0' }}>{p.path}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{p.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card" style={{ padding: '16px 20px', boxShadow: 'none' }}>
              <p className="kicker">🐛 OFFENE BUGS</p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5 }}>
                {summary.open_bugs.length === 0 && <li>keine 🎉</li>}
                {summary.open_bugs.map((b) => (
                  <li key={b.id}>{b.message} <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{b.page}</span></li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: '16px 20px', boxShadow: 'none' }}>
              <p className="kicker">💬 NEUES FEEDBACK</p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5 }}>
                {summary.new_feedback.length === 0 && <li>nichts Neues</li>}
                {summary.new_feedback.map((f) => (
                  <li key={f.id}>{f.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
