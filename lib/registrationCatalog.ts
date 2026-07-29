// Catálogo de tipos de registro. suggestedCost es solo un punto de partida
// editable — no es una tarifa oficial de ningún proveedor. Ajusta según tus
// costos reales antes de cobrar a un artista.
export const REGISTRATION_TYPES: { value: string; label: string; provider: string; suggestedCost: number }[] = [
  { value: 'pro_affiliation', label: 'Afiliación a PRO', provider: 'SGAE / ASCAP / BMI / SESAC', suggestedCost: 0 },
  { value: 'copyright', label: 'Registro de copyright', provider: 'Oficina de Copyright', suggestedCost: 65 },
  { value: 'the_mlc', label: 'The MLC (mechanical royalties)', provider: 'The MLC', suggestedCost: 0 },
  { value: 'distribution', label: 'Distribución digital', provider: 'TuneCore / DistroKid', suggestedCost: 20 },
  { value: 'publishing_admin', label: 'Publishing administration', provider: 'TuneCore Publishing', suggestedCost: 0 },
  { value: 'soundexchange', label: 'SoundExchange', provider: 'SoundExchange', suggestedCost: 0 },
  { value: 'spotify_verified', label: 'Verificación de artista', provider: 'Spotify for Artists', suggestedCost: 0 },
  { value: 'apple_verified', label: 'Verificación de artista', provider: 'Apple Music for Artists', suggestedCost: 0 },
];

export const REGISTRATION_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  REGISTRATION_TYPES.map((t) => [t.value, t.label])
);

export function formatCost(costCents: number | null | undefined, currency: string = 'usd'): string {
  if (costCents === null || costCents === undefined) return 'Sin costo definido';
  if (costCents === 0) return 'Sin costo';
  return new Intl.NumberFormat('es', { style: 'currency', currency: currency.toUpperCase() }).format(costCents / 100);
}
