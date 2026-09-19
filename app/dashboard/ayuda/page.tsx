import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import { getSessionArtist } from '@/lib/getSessionArtist';

const GLOSSARY: { term: string; def: string }[] = [
  { term: 'Split sheet (reparto de una canción)', def: 'Un papel que dice quién es dueño de qué porcentaje de una canción. Por ejemplo: 50% tú, 30% tu productor, 20% quien escribió la letra. Cuando todos lo firman, nadie puede discutirlo después.' },
  { term: 'Derechos de autor (copyright)', def: 'Que la canción es tuya. Existe desde el momento en que la creas, pero registrarla deja una prueba oficial de la fecha y de que eres el autor.' },
  { term: 'SGAE, ASCAP, BMI (entidades de gestión)', def: 'Organizaciones que cobran por ti cuando tu música suena en radio, TV, bares, tiendas o conciertos, y luego te pagan. En España se usa SGAE; en EE.UU., ASCAP o BMI.' },
  { term: 'Regalías', def: 'El dinero que recibes cada vez que tu música se usa o se escucha: en plataformas, radio, conciertos, series o anuncios.' },
  { term: 'ISRC', def: 'Un código único de tu grabación, como su "DNI". Las plataformas lo usan para saber a quién pagar.' },
  { term: 'Distribuidor', def: 'La empresa que lleva tu canción a Spotify, Apple Music y demás. Tú no puedes subir directamente; se hace a través de uno.' },
  { term: 'LOD (carta de instrucción de pago)', def: 'Un papel donde dices "págale a esta persona este porcentaje de lo que genere esta canción". Sirve, por ejemplo, para pagar a un productor sin tener que hacerlo tú a mano.' },
  { term: 'Publishing (edición)', def: 'La parte del dinero que corresponde a la composición (melodía y letra), distinta de la grabación. Alguien especializado puede reclamarla por ti en todo el mundo.' },
  { term: 'Retención de impuestos (W-8BEN)', def: 'Si vives fuera de EE.UU. y cobras de allí, te pueden quitar el 30% por adelantado. Este formulario evita o reduce esa retención.' },
];

export default async function AyudaPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Ayuda"
        subtitle="Cómo funciona todo esto, explicado sin palabras raras."
      />

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Cómo funciona, en 3 frases</h2>
        <ol style={{ margin: '12px 0 0', paddingLeft: 20, fontSize: 16, lineHeight: 1.7 }}>
          <li><strong>Tú</strong> completas tus datos y añades tus canciones.</li>
          <li><strong>Nosotros</strong> hacemos los trámites para proteger tu música y que puedas cobrar.</li>
          <li><strong>Los dos</strong> vemos aquí cómo va todo, y cuánto dinero entra cada mes.</li>
        </ol>
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Palabras que vas a ver</h2>
        <p className="section-sub">Toca una para leer qué significa.</p>
        {GLOSSARY.map((g) => (
          <details key={g.term} className="faq">
            <summary>{g.term}</summary>
            <p>{g.def}</p>
          </details>
        ))}
      </section>

      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px' }}>
          <h2 className="section-title">¿Sigues con dudas?</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, lineHeight: 1.5 }}>Escríbenos y te respondemos por correo. No hay preguntas tontas.</p>
        </div>
        <a href="mailto:hola@artistlaunchos.com" className="btn btn-primary btn-lg">Escribirnos</a>
      </section>
    </DashboardShell>
  );
}
