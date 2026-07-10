import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '90px 20px' }}>
      <p style={{ fontSize: 46, margin: 0 }}>🥀</p>
      <h1 style={{ fontSize: 30, fontWeight: 800, margin: '10px 0' }}>404</h1>
      <p style={{ color: 'var(--muted)' }}>
        Diese Seite ist noch nicht gewachsen. / This page has not grown yet.
      </p>
      <p>
        <Link href="/de/" style={{ textDecoration: 'underline', fontWeight: 700 }}>
          Zur Startseite
        </Link>
        {' · '}
        <Link href="/en/" style={{ textDecoration: 'underline', fontWeight: 700 }}>
          Home
        </Link>
      </p>
    </div>
  );
}
