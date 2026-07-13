import type { Lang } from '@/lib/i18n';

/**
 * Remotion-Beispiel-Video (Direktive 12): kurze stumme mp4-Clips aus videos/ (Remotion-Projekt),
 * gerendert pro Sprache nach public/videos/<name>.<lang>.mp4. Kein Autoplay, preload=metadata.
 */
const kicker: Record<Lang, string> = {
  de: '🎬 ALS KURZES VIDEO',
  en: '🎬 AS A SHORT VIDEO',
  es: '🎬 EN VÍDEO CORTO',
  fr: '🎬 EN VIDÉO COURTE',
  zh: '🎬 短视频版',
};

export default function ExampleVideo({ lang, name, label }: { lang: Lang; name: string; label: string }) {
  return (
    <div className="card" style={{ padding: '18px 22px', marginTop: 26, boxShadow: '4px 4px 0 var(--ink)', background: '#fff' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>{kicker[lang]}</p>
      <video
        controls
        preload="metadata"
        playsInline
        aria-label={label}
        style={{ width: '100%', display: 'block', border: '2.5px solid var(--ink)', borderRadius: 14, background: 'var(--bg)' }}
      >
        <source src={`/videos/${name}.${lang}.mp4`} type="video/mp4" />
      </video>
      <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--muted)' }}>{label}</p>
    </div>
  );
}
