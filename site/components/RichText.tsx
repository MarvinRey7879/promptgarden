/**
 * Rendert Text mit `Inline-Code` in Backticks als <code>-Element (It. 245).
 * Anlass: die angereicherten Befehlsseiten enthalten Befehle, Flags und Pfade
 * in Backticks — vorher standen die Backticks als Zeichen im Fließtext.
 * Bewusst KEIN volles Markdown und kein dangerouslySetInnerHTML: nur dieses
 * eine Muster, dafür ohne HTML-Injektionsfläche. Absätze bleiben über
 * white-space: pre-wrap erhalten.
 */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code
            key={i}
            style={{
              background: 'rgba(43,33,24,.08)',
              borderRadius: 5,
              padding: '1px 5px',
              fontSize: '.92em',
              // Kein nowrap: lange Code-Strings (z.B. ganze Beispiel-Prompts)
              // erzeugten sonst horizontalen Scroll auf schmalen Screens.
              overflowWrap: 'anywhere',
            }}
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
