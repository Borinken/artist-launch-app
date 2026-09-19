import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import ArtistProfileForm from '../_components/ArtistProfileForm';
import { getSessionArtist } from '@/lib/getSessionArtist';

export default async function PerfilPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Mis datos"
        subtitle="Tu información personal. La usamos para hacer los trámites a tu nombre."
        tip={<><b>Es lo primero que hay que completar.</b> Sin tu nombre legal, país y número de identificación fiscal (NIF, DNI o similar) no podemos registrar nada.</>}
      />
      <ArtistProfileForm artist={artist} />
    </DashboardShell>
  );
}
