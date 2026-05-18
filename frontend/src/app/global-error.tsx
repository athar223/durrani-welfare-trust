'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, background: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: '#1a6b3c', fontSize: '1.5rem', marginBottom: '1rem' }}>Durrani Welfare Trust</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Something went wrong. Please try again.</p>
          <button
            onClick={reset}
            style={{ background: '#1a6b3c', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
