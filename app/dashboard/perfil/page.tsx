import DashboardShell from '../_components/DashboardShell';
import ArtistProfileForm from '../_components/ArtistProfileForm';
import { getArtist } from '@/lib/dashboardData';

export default async function PerfilPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Perfil del artista</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px' }}>
        Esta información se usa para solicitar y tramitar registros a nombre del artista.
      </p>
      <ArtistProfileForm artist={artist} />
    </DashboardShell>
  );
}
