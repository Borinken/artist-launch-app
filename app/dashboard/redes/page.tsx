import DashboardShell from '../_components/DashboardShell';
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
      <h1 style={{ margin: '0 0 24px', fontSize: 28 }}>Redes sociales</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
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
