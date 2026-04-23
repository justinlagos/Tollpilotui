/**
 * PilotFX
 * ---------------------------------------------------------------------------
 * The environmental storytelling layer that sits around the Pilot character.
 * Driven entirely by the active Emotion via the motion system.
 *
 * Renders (as needed, all optional):
 *   - ambient glow
 *   - breathing ring
 *   - telemetry ticks (thinking)
 *   - scan line (focused)
 *   - caution pulse (concerned/alert)
 *   - danger pulse (panicked)
 *   - impact ring (shocked)
 *   - speed streaks (drive)
 *   - success flare (smug/celebrating/proud)
 *   - shimmer (proud/happy/celebrating)
 *   - underglow (focused/drive)
 *
 * Design rule: restrained at base, but VISIBLE enough to carry meaning.
 * Nothing is decorative. Every element reinforces product state.
 */
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Emotion } from '../lib/emotionStateMachine';
import { MOTION } from '../lib/motionSystem';

interface Props {
  emotion: Emotion;
  size: number;
  /** Drive mode — activates speed streaks regardless of emotion. */
  driving?: boolean;
  /** Optional event tag: 'zoneEntered' | 'reroute' | 'paid' — triggers one-shot. */
  event?: string | null;
  /** Optional: show everything behind the character (z-index back). */
  behind?: boolean;
}

export function PilotFX({ emotion, size, driving = false, event, behind = true }: Props) {
  const p = MOTION[emotion].fx;
  const w = size;
  const h = size;
  const cx = w / 2;
  const cy = h / 2;

  // One-shot events (impact ring, success flare, shimmer sweep) are keyed so
  // they re-trigger on each emotion change.
  const eventKey = `${emotion}-${event ?? ''}`;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: behind ? 0 : 3,
        overflow: 'visible',
      }}
    >
      {/* ─── Ambient radial glow ─── */}
      {p.glow > 0 && (
        <motion.div
          key={`glow-${emotion}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: p.glow, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: `-${size * 0.28}px`,
            background: `radial-gradient(circle at 50% 55%, ${p.glowColor}55 0%, ${p.glowColor}00 62%)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* ─── Breathing ring (slow expand/fade) ─── */}
      {p.breathRing > 0 && (
        <motion.div
          key={`breath-${emotion}`}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: [0, p.breathRing, 0], scale: [0.88, 1.08, 1.18] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: `-${size * 0.18}px`,
            borderRadius: '50%',
            border: `1.5px solid ${p.glowColor}`,
          }}
        />
      )}

      {/* ─── Caution pulse (amber) ─── */}
      {p.cautionPulse > 0 && (
        <>
          <motion.div
            key={`caution-${emotion}-a`}
            animate={{ opacity: [0.05, p.cautionPulse * 0.8, 0.05], scale: [0.94, 1.12, 0.94] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: `-${size * 0.14}px`,
              borderRadius: '50%',
              border: `2px solid #F59E0B`,
            }}
          />
          <motion.div
            key={`caution-${emotion}-b`}
            animate={{ opacity: [0, p.cautionPulse * 0.5, 0], scale: [1, 1.25, 1.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              inset: `-${size * 0.22}px`,
              borderRadius: '50%',
              border: `1px solid #F59E0B`,
            }}
          />
        </>
      )}

      {/* ─── Danger pulse (red, faster, more urgent) ─── */}
      {p.dangerPulse > 0 && (
        <>
          <motion.div
            key={`danger-${emotion}-a`}
            animate={{ opacity: [0.25, p.dangerPulse, 0.25], scale: [0.9, 1.18, 0.9] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: `-${size * 0.12}px`,
              borderRadius: '50%',
              border: `2.5px solid #EF4444`,
              boxShadow: `0 0 22px #EF444455`,
            }}
          />
          <motion.div
            key={`danger-${emotion}-b`}
            animate={{ opacity: [0, p.dangerPulse * 0.7, 0], scale: [1, 1.4, 1.55] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: `-${size * 0.24}px`,
              borderRadius: '50%',
              border: `1.5px solid #EF4444`,
            }}
          />
        </>
      )}

      {/* ─── Impact ring (one-shot on entry for shocked) ─── */}
      <AnimatePresence>
        {p.impactRing && (
          <motion.div
            key={`impact-${eventKey}`}
            initial={{ opacity: 1, scale: 0.6 }}
            animate={{ opacity: 0, scale: 2.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              inset: `-${size * 0.1}px`,
              borderRadius: '50%',
              border: `3px solid #EF4444`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Success flare (one-shot expanding highlight) ─── */}
      <AnimatePresence>
        {p.successFlare && (
          <motion.div
            key={`flare-${eventKey}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.7, 1.25, 1.55] }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: `-${size * 0.22}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${p.glowColor}66 0%, transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Telemetry ticks (thinking / computing) ─── */}
      {p.telemetryHz > 0 && (
        <TelemetryRing size={size} hz={p.telemetryHz} color={p.glowColor} />
      )}

      {/* ─── Scan line (focused / suspicious) ─── */}
      {p.scanLine && (
        <motion.div
          key={`scan-${emotion}`}
          animate={{ y: [-size * 0.35, size * 0.35, -size * 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${size * 0.18}px`,
            right: `${size * 0.18}px`,
            top: '50%',
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${p.glowColor}aa, transparent)`,
          }}
        />
      )}

      {/* ─── Speed streaks (for drive mode or speed emotion) ─── */}
      {(driving || p.speedStreaks > 0) && (
        <SpeedStreaks size={size} intensity={Math.max(driving ? 0.7 : 0, p.speedStreaks)} />
      )}

      {/* ─── Underglow (under-car directional light) ─── */}
      {p.underglow && (
        <motion.div
          key={`underglow-${emotion}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            left: `${size * 0.22}px`,
            right: `${size * 0.22}px`,
            bottom: `${size * 0.06}px`,
            height: size * 0.12,
            background: `radial-gradient(ellipse at center, ${p.underglow}66 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* ─── Shimmer (proud / happy / celebrating) ─── */}
      {p.shimmer && (
        <motion.div
          key={`shimmer-${emotion}`}
          initial={{ x: -size * 0.8, opacity: 0 }}
          animate={{ x: size * 0.8, opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 0, right: 0, top: '25%',
            height: size * 0.55,
            width: size * 0.25,
            background: `linear-gradient(100deg, transparent, ${p.glowColor}88, transparent)`,
            filter: 'blur(2px)',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Telemetry ring — small dots + ticks that trace around the character,
// evoking route computation / analysis.
// ────────────────────────────────────────────────────────────────────────────
function TelemetryRing({ size, hz, color }: { size: number; hz: number; color: string }) {
  const r = size * 0.58;
  const cx = size / 2;
  const cy = size / 2;
  const ticks = 12;
  return (
    <svg
      width={size * 1.4}
      height={size * 1.4}
      style={{ position: 'absolute', left: -size * 0.2, top: -size * 0.2, overflow: 'visible' }}
    >
      {Array.from({ length: ticks }).map((_, i) => {
        const angle = (i / ticks) * Math.PI * 2 - Math.PI / 2;
        const inner = r * 0.94;
        const outer = r * 1.02;
        const x1 = cx + size * 0.2 + Math.cos(angle) * inner;
        const y1 = cy + size * 0.2 + Math.sin(angle) * inner;
        const x2 = cx + size * 0.2 + Math.cos(angle) * outer;
        const y2 = cy + size * 0.2 + Math.sin(angle) * outer;
        const delay = (i / ticks) * (1 / hz);
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{
              duration: 1 / hz,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Speed streaks — compressed forward lines behind the car.
// ────────────────────────────────────────────────────────────────────────────
function SpeedStreaks({ size, intensity }: { size: number; intensity: number }) {
  if (intensity <= 0) return null;
  const count = Math.round(4 + intensity * 5);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      {Array.from({ length: count }).map((_, i) => {
        const topPct = 18 + (i / count) * 58;
        const delay = (i * 0.12) % 1.1;
        const widthPct = 22 + (i % 3) * 10;
        return (
          <motion.div
            key={i}
            animate={{
              x: [-size * 0.65, size * 0.45],
              opacity: [0, intensity * 0.7, 0],
            }}
            transition={{
              duration: 0.75 + (i % 2) * 0.25,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              top: `${topPct}%`,
              left: 0,
              width: `${widthPct}%`,
              height: 1.5,
              background: `linear-gradient(90deg, transparent, #3BA9FFcc, transparent)`,
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
    </div>
  );
}
