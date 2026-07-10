'use client';

/**
 * Backend-Anbindung (promptgarden-api Worker).
 * NEXT_PUBLIC_API_URL leer → alle Calls sind no-ops (v0.1 ohne Backend).
 * Nach Worker-Deploy: URL in .env setzen, kein weiterer Code-Change nötig.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiPost(path: string, data: Record<string, unknown>): Promise<boolean> {
  if (!API_URL) return false;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
