'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Account = {
  handle: string | null;
  status: string;
  followers_count: number | null;
  monthly_listeners: number | null;
  profile_url: string | null;
};

export default function SocialAccountCard({
  artistId, platform, label, hasListeners, account,
}: {
  artistId: string; platform: string; label: string; hasListeners?: boolean; account?: Account;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [handle, setHandle] = useState(account?.handle ?? '');
  const [profileUrl, setProfileUrl] = useState(account?.profile_url ?? '');
  const [followers, setFollowers] = useState(account?.followers_count?.toString() ?? '');
  const [listeners, setListeners] = useState(account?.monthly_listeners?.toString() ?? '');
  const [loading, setLoading] = useState(false);

  const isConnected = account?.status === 'connected';

  async function handleSave() {
    setLoading(true);
    await fetch('/api/social-accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist_id: artistId,
        platform,
        handle: handle || null,
        profile_url: profileUrl || null,
        followers_count: followers ? Number(followers) : null,
        monthly_listeners: listeners ? Number(listeners) : null,
        status: 'connected',
      }),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>{label}</h3>
        <span className={`badge ${isConnected ? 'badge-connected' : 'badge-pending'}`}>
          {isConnected ? 'Conectado ✅' : 'Pendiente ⏳'}
        </span>
      </div>

      {!editing ? (
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>
          {account?.handle && <div>@{account.handle}</div>}
          {account?.followers_count != null && <div>{account.followers_count.toLocaleString()} seguidores</div>}
          {hasListeners && account?.monthly_listeners != null && <div>{account.monthly_listeners.toLocaleString()} oyentes mensuales</div>}
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setEditing(true)}>
              {isConnected ? 'Editar' : 'Conectar'}
            </button>
            {account?.profile_url && (
              <a href={account.profile_url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}>Ver perfil</a>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input className="input" placeholder="Handle (sin @)" value={handle} onChange={(e) => setHandle(e.target.value)} />
          <input className="input" placeholder="URL del perfil" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} />
          <input className="input" placeholder="Seguidores" type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} />
          {hasListeners && (
            <input className="input" placeholder="Oyentes mensuales" type="number" value={listeners} onChange={(e) => setListeners(e.target.value)} />
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
            <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
