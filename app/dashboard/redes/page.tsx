import DashboardShell from '../_components/DashboardShell';
import SocialAccountCard from '../_components/SocialAccountCard';
import { getArtist, getSocialAccounts } from '@/lib/dashboardData';
import { SOCIAL_PLATFORMS } from '@/lib/socialPlatforms';

export default async function RedesPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const accounts = await getSocialAccounts(artistId);
  const byPlatform = Object.fromEntries(accounts.map((a) => [a.platform, a]));

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 24px', fontSize: 28 }}>Redes sociales</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {SOCIAL_PLATFORMS.map((p) => (
          <SocialAccountCard
            key={p.value}
            artistId={artistId}
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
