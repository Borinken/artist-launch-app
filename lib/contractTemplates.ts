export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  producer_agreement: 'Acuerdo de productor',
  management_agreement: 'Acuerdo de management',
  publishing_agreement: 'Acuerdo de publishing',
  beat_license: 'Licencia de beat',
  nda: 'Acuerdo de confidencialidad (NDA)',
  photo_release: 'Cesión de derechos de imagen (fotos)',
  video_release: 'Cesión de derechos de imagen (video)',
  work_for_hire: 'Contrato de obra por encargo',
  letter_of_direction: 'Carta de instrucción de pago (LOD)',
};

export const CONTRACT_TYPE_OBJECT: Record<string, string> = {
  producer_agreement:
    'El Productor prestará servicios de producción musical para la Obra indicada, cediendo los derechos acordados al Artista bajo los términos aquí descritos.',
  management_agreement:
    'El Manager representará los intereses profesionales del Artista y gestionará oportunidades de carrera a cambio de la comisión acordada.',
  publishing_agreement:
    'El Editor (Publisher) administrará los derechos de publishing de la Obra del Artista en el territorio y porcentaje aquí indicados.',
  beat_license:
    'El Productor licencia el uso del beat/instrumental al Artista bajo los términos de uso y exclusividad aquí indicados.',
  nda:
    'Ambas partes acuerdan mantener confidencial la información compartida en el marco de esta colaboración.',
  photo_release:
    'El Fotógrafo/Modelo cede el uso de las imágenes producidas para los fines aquí descritos.',
  video_release:
    'El Videógrafo/Talento cede el uso del material audiovisual producido para los fines aquí descritos.',
  work_for_hire:
    'El Contratista realiza la obra descrita como trabajo por encargo, cediendo la titularidad al Artista/Contratante.',
  letter_of_direction:
    'El Artista instruye de forma irrevocable al distribuidor/administrador indicado para que pague directamente al Beneficiario el porcentaje de regalías aquí especificado, correspondientes a la Obra indicada, hasta nueva instrucción por escrito.',
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface ContractDoc {
  contractType: string;
  title?: string | null;
  artistLegalName: string;
  artistName?: string | null;
  trackTitle?: string | null;
  counterpartyName?: string;
  counterpartyRole?: string;
  effectiveDate?: string;
  percentage?: string;
  feeAmount?: string;
  territoryOrTerm?: string;
  notes?: string;
}

export function renderContractHtml(doc: ContractDoc): string {
  const label = CONTRACT_TYPE_LABELS[doc.contractType] ?? doc.contractType;
  const objectText = CONTRACT_TYPE_OBJECT[doc.contractType] ?? '';
  const e = escapeHtml;

  const rows: string[] = [];
  if (doc.counterpartyName) rows.push(`<tr><td>${e(doc.counterpartyRole || 'Contraparte')}</td><td>${e(doc.counterpartyName)}</td></tr>`);
  if (doc.trackTitle) rows.push(`<tr><td>Obra / Canción</td><td>${e(doc.trackTitle)}</td></tr>`);
  if (doc.percentage) rows.push(`<tr><td>Porcentaje acordado</td><td>${e(doc.percentage)}%</td></tr>`);
  if (doc.feeAmount) rows.push(`<tr><td>Monto / Contraprestación</td><td>${e(doc.feeAmount)}</td></tr>`);
  if (doc.territoryOrTerm) rows.push(`<tr><td>Territorio / Duración</td><td>${e(doc.territoryOrTerm)}</td></tr>`);
  if (doc.effectiveDate) rows.push(`<tr><td>Fecha efectiva</td><td>${e(doc.effectiveDate)}</td></tr>`);

  return `
    <h1>${e(doc.title || label)}</h1>
    <p class="muted">${e(label)}</p>

    <h2>Partes</h2>
    <table class="kv">
      <tr><td>Artista</td><td>${e(doc.artistName || doc.artistLegalName)} (${e(doc.artistLegalName)})</td></tr>
      ${rows.join('\n')}
    </table>

    <h2>Objeto del contrato</h2>
    <p>${e(objectText)}</p>

    ${doc.notes ? `<h2>Términos adicionales</h2><p>${e(doc.notes).replace(/\n/g, '<br/>')}</p>` : ''}

    <h2>Firmas</h2>
    <div class="signatures">
      <div><div class="sig-line"></div><span>${e(doc.artistName || doc.artistLegalName)} (Artista)</span></div>
      <div><div class="sig-line"></div><span>${e(doc.counterpartyName || 'Contraparte')}</span></div>
    </div>

    <p class="disclaimer">Este documento es una plantilla generada automáticamente por Artist Launch OS.
    No constituye asesoría legal — se recomienda revisión de un abogado antes de firmar.</p>
  `;
}
