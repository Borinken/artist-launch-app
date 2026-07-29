// Catálogo de tipos de registro. suggestedCost es solo un punto de partida
// editable — no es una tarifa oficial de ningún proveedor. Ajusta según tus
// costos reales antes de cobrar a un artista.

type CatalogEntry = { value: string; label: string; provider: string; suggestedCost: number };

const US_PR_CATALOG: CatalogEntry[] = [
  { value: 'pro_affiliation', label: 'Afiliación a PRO', provider: 'ASCAP / BMI / SESAC', suggestedCost: 0 },
  { value: 'copyright', label: 'Registro de copyright', provider: 'US Copyright Office', suggestedCost: 65 },
  { value: 'the_mlc', label: 'The MLC (mechanical royalties)', provider: 'The MLC', suggestedCost: 0 },
  { value: 'distribution', label: 'Distribución digital', provider: 'TuneCore / DistroKid', suggestedCost: 20 },
  { value: 'publishing_admin', label: 'Publishing administration', provider: 'TuneCore Publishing', suggestedCost: 0 },
  { value: 'soundexchange', label: 'SoundExchange', provider: 'SoundExchange', suggestedCost: 0 },
  { value: 'spotify_verified', label: 'Verificación de artista', provider: 'Spotify for Artists', suggestedCost: 0 },
  { value: 'apple_verified', label: 'Verificación de artista', provider: 'Apple Music for Artists', suggestedCost: 0 },
];

const SPAIN_CATALOG: CatalogEntry[] = [
  { value: 'pro_affiliation', label: 'Afiliación a SGAE', provider: 'SGAE', suggestedCost: 0 },
  { value: 'copyright', label: 'Registro de Propiedad Intelectual', provider: 'Registro de la Propiedad Intelectual', suggestedCost: 25 },
  { value: 'the_mlc', label: 'Derechos de productor (AGEDI)', provider: 'AGEDI', suggestedCost: 0 },
  { value: 'distribution', label: 'Distribución digital', provider: 'TuneCore / DistroKid', suggestedCost: 20 },
  { value: 'publishing_admin', label: 'Publishing administration', provider: 'TuneCore Publishing', suggestedCost: 0 },
  { value: 'soundexchange', label: 'Derechos de artista intérprete (AIE)', provider: 'AIE', suggestedCost: 0 },
  { value: 'spotify_verified', label: 'Verificación de artista', provider: 'Spotify for Artists', suggestedCost: 0 },
  { value: 'apple_verified', label: 'Verificación de artista', provider: 'Apple Music for Artists', suggestedCost: 0 },
];

const SPAIN_COUNTRY_NAMES = ['españa', 'spain', 'es'];

export function getRegistrationCatalog(country?: string | null): CatalogEntry[] {
  if (country && SPAIN_COUNTRY_NAMES.includes(country.trim().toLowerCase())) return SPAIN_CATALOG;
  return US_PR_CATALOG;
}

export const REGISTRATION_TYPES = US_PR_CATALOG;

export const REGISTRATION_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  [...US_PR_CATALOG, ...SPAIN_CATALOG].map((t) => [t.value, t.label])
);

export function formatCost(costCents: number | null | undefined, currency: string = 'usd'): string {
  if (costCents === null || costCents === undefined) return 'Sin costo definido';
  if (costCents === 0) return 'Sin costo';
  return new Intl.NumberFormat('es', { style: 'currency', currency: currency.toUpperCase() }).format(costCents / 100);
}
