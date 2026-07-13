// 1d-"Spielwiese"-Design-Tokens (identisch zur Site)
export const T = {
  bg: '#fdf6ec',
  ink: '#2b2118',
  muted: '#6b5d4d',
  accent: '#e8613c',
  lime: '#c9e265',
  pink: '#f9c5d8',
  blue: '#a8d8f0',
  yellow: '#f5d565',
  font: '"Segoe UI", system-ui, -apple-system, sans-serif',
};

export const card = (bg: string): React.CSSProperties => ({
  background: bg,
  border: `4px solid ${T.ink}`,
  borderRadius: 24,
  boxShadow: `8px 8px 0 ${T.ink}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export type Lang = 'de' | 'en' | 'es' | 'fr' | 'zh';
