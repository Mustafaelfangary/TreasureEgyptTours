import { notFound } from 'next/navigation';

const KNOWN = new Set([
  'luxor-aswan',
  'aswan-luxor',
  'short-cruise',
  'extended-cruise',
  'temples-tour',
  'cultural-immersion',
]);

export default function ItineraryDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!slug) return notFound();

  const title = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  const images = [
    '/images/Royal Cleopatra/DSC_8502.jpg',
    '/images/Royal Cleopatra/DSC_8568.jpg',
    '/images/Princess Cleopatra Dahabiya (1).jpg',
  ];

  return (
    <main style={{ paddingTop: '6rem' }}>
      <section style={{
        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
        padding: '3rem 0'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e40af', marginBottom: '0.5rem' }}>{title}</h1>
          <p style={{ color: '#334155' }}>Signature itinerary details and highlights.</p>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {images.map((src, idx) => (
            <div key={idx} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>              <img src={src} alt={title} style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return Array.from(KNOWN).map((slug) => ({ slug }));
}
