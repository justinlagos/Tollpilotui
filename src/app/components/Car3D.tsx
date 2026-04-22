import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Dark-studio, 3/4-front angle car images
const CAR_IMG_PRIMARY = "https://images.unsplash.com/photo-1591544007153-a68f93959f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYmx1ZSUyMGNhciUyMHN0dWRpbyUyMHRocmVlJTIwcXVhcnRlciUyMGFuZ2xlJTIwY2xlYW58ZW58MXx8fHwxNzc2NzIwNjY2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export type Car3DSize = 'sm' | 'md' | 'lg';
export type Car3DVariant = 'contained' | 'bare';

interface Car3DProps {
  size?: Car3DSize;
  glowColor?: string;
  variant?: Car3DVariant;
  entered?: boolean;
  sweep?: boolean;
  imgSrc?: string;
  style?: React.CSSProperties;
  className?: string;
}

// Contained: fixed crop area (dark shell card)
const CONTAINED_SIZE: Record<Car3DSize, { width: number; height: number }> = {
  sm: { width: 180, height: 110 },
  md: { width: 260, height: 158 },
  lg: { width: 330, height: 200 },
};

// Bare reveal stage dimensions — stage width, frame min-height, car img height
const BARE_STAGE: Record<Car3DSize, { stageW: number; frameMinH: number; carH: number }> = {
  sm: { stageW: 220, frameMinH: 200, carH: 160 },
  md: { stageW: 280, frameMinH: 290, carH: 230 },
  lg: { stageW: 320, frameMinH: 380, carH: 300 },
};

const SWEEP_STYLE = `
@keyframes tp-sweep {
  0%   { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateX(220%) skewX(-12deg); opacity: 0; }
}
@keyframes tp-float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-6px) scale(1.01); }
}
`;

let styleInjected = false;
function injectStyle() {
  if (styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = SWEEP_STYLE;
  document.head.appendChild(el);
  styleInjected = true;
}

export function Car3D({
  size = 'md',
  glowColor = '#3BA9FF',
  variant = 'contained',
  entered = true,
  sweep = true,
  imgSrc,
  style,
  className,
}: Car3DProps) {
  injectStyle();

  const [sweepActive, setSweepActive] = useState(false);
  const sweepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sweep) return;
    const first = setTimeout(() => {
      setSweepActive(true);
      setTimeout(() => setSweepActive(false), 1100);
    }, 1600);
    sweepTimer.current = setInterval(() => {
      setSweepActive(true);
      setTimeout(() => setSweepActive(false), 1100);
    }, 5200);
    return () => { clearTimeout(first); if (sweepTimer.current) clearInterval(sweepTimer.current); };
  }, [sweep]);

  const src = imgSrc ?? CAR_IMG_PRIMARY;
  const isBare = variant === 'bare';

  // ─── BARE — premium reveal stage ──────────────────────────────────────────
  if (isBare) {
    const { stageW, frameMinH, carH } = BARE_STAGE[size];

    return (
      <motion.div
        className={className}
        initial={entered ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: stageW,
          margin: '0 auto',
          ...style,
        }}
      >
        {/*
          ── Glow layer ──
          Wraps the stage, not the image.
          The stage owns the premium atmosphere.
          Gold primary (glowColor), blue secondary accent, blurred 28px.
        */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 36,
          background: `radial-gradient(circle at center, ${glowColor}28, rgba(59,169,255,0.14), transparent 72%)`,
          filter: 'blur(28px)',
          pointerEvents: 'none',
        }} />

        {/*
          ── Frame ──
          Transparent background, subtle rim border.
          Owns the min-height so the stage is a resolved fixed space.
        */}
        <div style={{
          position: 'relative',
          minHeight: frameMinH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
          padding: '24px 16px',
        }}>
          {/*
            ── Car image ──
            Full height, object-contain — never cropped.
            Drop-shadow provides depth. Float animation is premium (translateY + scale).
            The image stays clean; the stage provides all context.
          */}
          <img
            src={src}
            alt="Vehicle"
            style={{
              height: carH,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))',
              animation: 'tp-float 3.2s ease-in-out infinite',
            }}
          />
        </div>
      </motion.div>
    );
  }

  // ─── CONTAINED — dark studio shell ────────────────────────────────────────
  const { width, height } = CONTAINED_SIZE[size];

  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(170deg, #101e3d 0%, #0c1628 55%, #080d1c 100%)',
        borderRadius: 24,
        padding: '28px 16px 14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
    >
      {/* Ambient glow behind car */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
        width: width * 0.9, height: width * 0.5, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${glowColor}14 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      {/* Top rim accent */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
        background: `linear-gradient(90deg, transparent, ${glowColor}22, transparent)`,
      }} />

      {/* Car — floats inside the shell */}
      <motion.div
        initial={entered ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width }}
      >
        <div style={{
          width, height,
          animation: 'tp-float 3.2s ease-in-out infinite',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img
            src={src}
            alt="Vehicle"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: `drop-shadow(0 18px 36px ${glowColor}30) brightness(1.06) contrast(1.04)`,
              borderRadius: 12,
              display: 'block',
            }}
          />

          {/* Light sweep */}
          <AnimatePresence>
            {sweepActive && (
              <div
                key="sweep"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  overflow: 'hidden', borderRadius: 12,
                }}
              >
                <div style={{
                  position: 'absolute', top: '-20%', bottom: '-20%', width: '35%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)',
                  animation: 'tp-sweep 1s ease-in-out forwards',
                }} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Floor glow */}
        <div style={{
          width: '65%', height: 14, marginTop: -4,
          background: `radial-gradient(ellipse at center, ${glowColor}28 0%, transparent 72%)`,
          filter: 'blur(3px)',
          flexShrink: 0,
          pointerEvents: 'none',
        }} />
      </motion.div>
    </div>
  );
}
