import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import SocialAccountCard from '../_components/SocialAccountCard';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getSocialAccounts } from '@/lib/dashboardData';
import { SOCIAL_PLATFORMS } from '@/lib/socialPlatforms';

export default async function RedesPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const accounts = await getSocialAccounts(artist.id);
  const byPlatform = Object.fromEntries(accounts.map((a) => [a.platform, a]));

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Mis redes sociales"
        subtitle="Añade tus perfiles para ver tus seguidores y oyentes en un solo lugar."
        tip={<><b>Solo copia tu usuario y el enlace de tu perfil.</b> No pedimos tu contraseña de ninguna red.</>}
      />
      <div className="grid-tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {SOCIAL_PLATFORMS.map((p) => (
          <SocialAccountCard
            key={p.value}
            artistId={artist.id}
            platform={p.value}
            label={p.label}
            hasListeners={p.hasListeners}
            account={byPlatform[p.value]}
          />
        ))}
      </div>
    </DashboardShell>
  );
}
