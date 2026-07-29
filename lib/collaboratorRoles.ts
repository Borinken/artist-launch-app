// Basado en un análisis de qué necesita registrarse/rastrearse para cada
// rol del equipo de un artista, de lo más básico a lo más complejo.
export const COLLABORATOR_ROLES = [
  {
    value: 'producer',
    label: 'Productor',
    checklist: [
      { key: 'identity', label: 'Identidad y fiscalidad propias (tax ID)' },
      { key: 'pro', label: 'Afiliación a PRO / IPI number (si co-escribe)' },
      { key: 'contract', label: 'Acuerdo de productor firmado' },
    ],
  },
  {
    value: 'manager',
    label: 'Manager',
    checklist: [
      { key: 'identity', label: 'Identidad y fiscalidad propias (tax ID)' },
      { key: 'contract', label: 'Acuerdo de management firmado' },
      { key: 'commission', label: 'Comisión (%) definida' },
    ],
  },
] as const;

export const COLLABORATOR_ROLE_LABELS: Record<string, string> = Object.fromEntries(
  COLLABORATOR_ROLES.map((r) => [r.value, r.label])
);

export function getCollaboratorChecklist(
  role: string,
  collaborator: { tax_id: string | null },
  hasSignedContract: boolean,
  commissionPct: number | null
): { key: string; label: string; done: boolean }[] {
  const roleDef = COLLABORATOR_ROLES.find((r) => r.value === role);
  if (!roleDef) return [];
  return roleDef.checklist.map((item) => {
    if (item.key === 'identity') return { ...item, done: !!collaborator.tax_id };
    if (item.key === 'pro') return { ...item, done: true }; // opcional, no bloqueante
    if (item.key === 'contract') return { ...item, done: hasSignedContract };
    if (item.key === 'commission') return { ...item, done: commissionPct !== null };
    return { ...item, done: false };
  });
}
