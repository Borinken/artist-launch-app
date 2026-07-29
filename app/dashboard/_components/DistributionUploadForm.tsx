'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { readWavHeader, type WavInfo } from '@/lib/wavHeader';

const REQUIRED_SIZE = 3000;

export default function DistributionUploadForm({ trackId, hasCover, hasWav }: { trackId: string; hasCover: boolean; hasWav: boolean }) {
  const router = useRouter();
  const [coverDims, setCoverDims] = useState<{ w: number; h: number } | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [wavInfo, setWavInfo] = useState<WavInfo | null>(null);
  const [wavFile, setWavFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<'cover' | 'wav' | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCoverSelect(file: File | null) {
    setCoverFile(file);
    setCoverDims(null);
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setCoverDims({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  async function handleWavSelect(file: File | null) {
    setWavFile(file);
    setWavInfo(null);
    if (!file) return;
    const info = await readWavHeader(file);
    setWavInfo(info);
  }

  async function uploadFile(type: 'cover' | 'wav', file: File) {
    setUploading(type);
    setError(null);
    try {
      const signRes = await fetch('/api/track-assets/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, type }),
      });
      if (!signRes.ok) throw new Error('No se pudo preparar la subida');
      const { path, token } = await signRes.json();

      const { error: uploadError } = await supabaseBrowser.storage
        .from('track-assets')
        .uploadToSignedUrl(path, token, file);
      if (uploadError) throw uploadError;

      const confirmRes = await fetch('/api/track-assets/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, type, path }),
      });
      if (!confirmRes.ok) throw new Error('No se pudo confirmar la subida');

      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Error al subir el archivo');
    } finally {
      setUploading(null);
    }
  }

  const coverSizeOk = coverDims?.w === REQUIRED_SIZE && coverDims?.h === REQUIRED_SIZE;

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <label className="label">Carátula ({REQUIRED_SIZE}x{REQUIRED_SIZE}px, JPG)</label>
          {hasCover && !coverFile && <p style={{ fontSize: 12, color: 'var(--success)' }}>✅ Ya subida</p>}
          <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleCoverSelect(e.target.files?.[0] ?? null)} style={{ fontSize: 13 }} />
          {coverDims && (
            <p style={{ fontSize: 12, marginTop: 4, color: coverSizeOk ? 'var(--success)' : '#facc15' }}>
              {coverDims.w}x{coverDims.h}px {coverSizeOk ? '✅ cumple el spec' : `⚠ se recomienda exactamente ${REQUIRED_SIZE}x${REQUIRED_SIZE}px`}
            </p>
          )}
          {coverFile && (
            <button className="btn btn-ghost" style={{ marginTop: 8, padding: '6px 14px', fontSize: 13 }} disabled={uploading === 'cover'} onClick={() => uploadFile('cover', coverFile)}>
              {uploading === 'cover' ? 'Subiendo…' : 'Subir carátula'}
            </button>
          )}
        </div>

        <div style={{ flex: '1 1 240px' }}>
          <label className="label">Master (.wav, máx 50MB)</label>
          {hasWav && !wavFile && <p style={{ fontSize: 12, color: 'var(--success)' }}>✅ Ya subido</p>}
          <input type="file" accept="audio/wav,.wav" onChange={(e) => handleWavSelect(e.target.files?.[0] ?? null)} style={{ fontSize: 13 }} />
          {wavInfo && (
            wavInfo.valid ? (
              <p style={{ fontSize: 12, marginTop: 4, color: wavInfo.meetsDistributionSpec ? 'var(--success)' : '#facc15' }}>
                {wavInfo.sampleRate} Hz, {wavInfo.bitDepth}-bit, {wavInfo.channels === 2 ? 'estéreo' : 'mono'}
                {wavInfo.meetsDistributionSpec ? ' ✅ cumple el spec mínimo' : ' ⚠ por debajo de 44.1kHz/16-bit recomendado'}
              </p>
            ) : (
              <p style={{ fontSize: 12, marginTop: 4, color: '#f87171' }}>⚠ El archivo no parece ser un WAV válido</p>
            )
          )}
          {wavFile && (
            <button className="btn btn-ghost" style={{ marginTop: 8, padding: '6px 14px', fontSize: 13 }} disabled={uploading === 'wav'} onClick={() => uploadFile('wav', wavFile)}>
              {uploading === 'wav' ? 'Subiendo…' : 'Subir master'}
            </button>
          )}
        </div>
      </div>
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>}
    </div>
  );
}
