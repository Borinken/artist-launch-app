'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const BAR_COUNT = 28;
const NOTES = ['♪', '♫', '♬', '♩'];

export default function MusicHero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 120, damping: 14 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 120, damping: 14 });
  const glowX = useTransform(mx, [0, 1], ['20%', '80%']);
  const glowY = useTransform(my, [0, 1], ['20%', '80%']);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        maxWidth: 760,
        margin: '56px auto 0',
        borderRadius: 24,
        border: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
        padding: '36px 32px',
        perspective: 1000,
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]: any) => `radial-gradient(320px circle at ${gx} ${gy}, rgba(168,85,247,0.25), transparent 70%)`
          ),
        }}
      />

      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', display: 'flex', alignItems: 'center', gap: 40, position: 'relative' }}>
        <Vinyl />
        <Equalizer />
      </motion.div>

      <FloatingNotes />
    </motion.div>
  );
}

function Vinyl() {
  return (
    <div style={{ flex: '0 0 auto', width: 140, height: 140, position: 'relative' }}>
      <div
        style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'repeating-radial-gradient(circle, #1c1c22 0px, #1c1c22 2px, #0c0c10 3px, #0c0c10 6px)',
          border: '1px solid var(--border)',
          animation: 'spin-vinyl 6s linear infinite',
          boxShadow: '0 0 40px rgba(168,85,247,0.25)',
        }}
      />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 54, height: 54,
        transform: 'translate(-50%, -50%)', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        animation: 'spin-vinyl 6s linear infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#08080b' }} />
      </div>
      <style>{`
        @keyframes spin-vinyl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function Equalizer() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const duration = 0.6 + ((i * 37) % 10) / 10;
        const delay = ((i * 13) % 10) / 10;
        const hue = i % 2 === 0 ? 'var(--accent)' : 'var(--accent-2)';
        return (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 3,
              borderRadius: 3,
              background: hue,
              opacity: 0.85,
              animation: `eq-bar ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes eq-bar {
          0% { height: 12%; }
          100% { height: 95%; }
        }
      `}</style>
    </div>
  );
}

function FloatingNotes() {
  const notes = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i * 1.3) % 8,
    duration: 6 + (i % 4),
    glyph: NOTES[i % NOTES.length],
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {notes.map((n) => (
        <span
          key={n.id}
          style={{
            position: 'absolute',
            left: `${n.left}%`,
            bottom: '-10%',
            fontSize: 18 + (n.id % 3) * 6,
            color: 'var(--accent)',
            opacity: 0,
            animation: `float-note ${n.duration}s ease-in ${n.delay}s infinite`,
          }}
        >
          {n.glyph}
        </span>
      ))}
      <style>{`
        @keyframes float-note {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.55; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-220px) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
