export type WavInfo = {
  valid: boolean;
  sampleRate?: number;
  bitDepth?: number;
  channels?: number;
  meetsDistributionSpec?: boolean;
};

// Lee los primeros bytes de un WAV (RIFF/WAVE) para extraer sample rate,
// bit depth y canales — validación honesta sin depender de un servicio externo.
export async function readWavHeader(file: File): Promise<WavInfo> {
  const buffer = await file.slice(0, 64).arrayBuffer();
  const view = new DataView(buffer);

  const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));

  if (riff !== 'RIFF' || wave !== 'WAVE') {
    return { valid: false };
  }

  const channels = view.getUint16(22, true);
  const sampleRate = view.getUint32(24, true);
  const bitDepth = view.getUint16(34, true);

  const meetsDistributionSpec = sampleRate >= 44100 && bitDepth >= 16;

  return { valid: true, sampleRate, bitDepth, channels, meetsDistributionSpec };
}
