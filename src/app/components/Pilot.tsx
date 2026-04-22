import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

// ═══════════════════════════════════════════════════════════════
// PILOT — TollPilot brand character
//
// The visual character (body silhouette, roof arc, eye circles,
// brows, mouth, bumper, wheel blocks, side mirrors) is LOCKED.
// It comes from the approved master SVG /src/imports/Pilot-svg.svg
// and is embedded here verbatim, with only the body fill repainted
// to the brand yellow #F5C744.
//
// Everything else (bob, tilt, blink, pupil drift, glow, sparkles,
// confetti, siren, speed scene, etc.) is a behaviour layer that
// wraps around the locked character without altering any path.
// ═══════════════════════════════════════════════════════════════

export type PilotMode = 'calm' | 'alert' | 'celebrate' | 'speed' | 'idle';
export type PilotTrigger =
  | 'plate_verified'
  | 'zone_alert_entry'
  | 'reroute_success'
  | 'trip_end_saved'
  | 'pcn_success'
  | 'streak_milestone';

interface PilotProps {
  mode?: PilotMode;
  size?: number;
  trigger?: PilotTrigger | null;
  onTriggerComplete?: () => void;
  className?: string;
  /** Show full scene overlays (road, confetti, siren, dust). Defaults to true.
   *  Set false for small embeds (tab icon, drive-mode corner). */
  showScene?: boolean;
  background?: string;
}

// Pilot is a fixed-color brand identity — NOT theme-reactive.
const C = {
  bodyYellow: '#F5C744',
  bodyStroke: '#707070',
  roofStroke: '#707070',
  windshield: '#D0D0D0',
  irisBrown: '#7B4B2A',
  pupilBlack: 'black',
  shine: 'white',
  brow: '#222',
  mouth: '#222',
  bumper: '#888888',
  wheel: '#333',
  glowCalm: '#F5C744',
  glowAlert: '#EF4444',
  glowCelebrate: '#FDC500',
  glowSpeed: '#3BA9FF',
};

const rootVariants = {
  calm: { y: [0, -8, 0], x: 0, transition: { y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0 } } },
  alert: {
    x: [0, -1.5, 1.5, -1, 0],
    y: [0, -1, 0, -1.5, 0],
    transition: {
      x: { duration: 0.25, repeat: Infinity, ease: 'linear' },
      y: { duration: 0.25, repeat: Infinity, ease: 'linear' },
    },
  },
  celebrate: {
    y: [0, -28, 6, -10, 2, 0],
    x: 0,
    transition: {
      y: {
        duration: 0.8,
        repeat: Infinity,
        times: [0, 0.2, 0.425, 0.675, 0.9, 1],
        ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut'],
      },
      x: { duration: 0 },
    },
  },
  speed: {
    y: [0, -1.5, 0, -1, 0],
    x: 0,
    transition: { y: { duration: 0.5, repeat: Infinity, ease: 'linear' }, x: { duration: 0 } },
  },
  idle: { y: [0, -6, 0], x: 0, transition: { y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0 } } },
};

const bodyVariants = {
  calm: { scaleX: 1, scaleY: 1, transition: { duration: 0.4 } },
  alert: { scaleX: 1, scaleY: 1, transition: { duration: 0.3 } },
  celebrate: {
    scaleX: [1, 0.92, 1.12, 0.96, 1.04, 1],
    scaleY: [1, 1.12, 0.9, 1.06, 0.96, 1],
    transition: { duration: 0.8, repeat: Infinity, times: [0, 0.2, 0.425, 0.675, 0.9, 1] },
  },
  speed: { scaleX: 1, scaleY: 1, transition: { duration: 0.5 } },
  idle: { scaleX: 1, scaleY: 1, transition: { duration: 0.4 } },
};

const pupilVariants = {
  calm: { x: 0, y: 0, scale: 1, transition: { duration: 0.3 } },
  alert: { x: 0, y: 0, scale: 0.75, transition: { duration: 0.2 } },
  celebrate: { x: 0, y: 0, scale: 1.15, transition: { duration: 0.2 } },
  speed: { x: 0, y: -3, scale: 0.9, transition: { duration: 0.3 } },
  idle: { x: 0, y: 0, scale: 1, transition: { duration: 0.4 } },
};

const irisVariants = {
  calm: { scale: 1, transition: { duration: 0.3 } },
  alert: { scale: 0.7, transition: { duration: 0.2 } },
  celebrate: { scale: 1.1, transition: { duration: 0.2 } },
  speed: { scale: 1, transition: { duration: 0.3 } },
  idle: { scale: 1, transition: { duration: 0.3 } },
};

const browLVariants = {
  calm: { y: 0, rotate: 0, transition: { duration: 0.3 } },
  alert: { y: -18, rotate: -8, transition: { duration: 0.2 } },
  celebrate: { y: -8, rotate: 0, transition: { duration: 0.2 } },
  speed: { y: 0, rotate: 0, transition: { duration: 0.3 } },
  idle: { y: 0, rotate: 0, transition: { duration: 0.3 } },
};
const browRVariants = {
  calm: { y: 0, rotate: 0, transition: { duration: 0.3 } },
  alert: { y: -18, rotate: 8, transition: { duration: 0.2 } },
  celebrate: { y: -8, rotate: 0, transition: { duration: 0.2 } },
  speed: { y: 0, rotate: 0, transition: { duration: 0.3 } },
  idle: { y: 0, rotate: 0, transition: { duration: 0.3 } },
};

const glowColorForMode = (m: PilotMode) =>
  ({
    calm: C.glowCalm,
    alert: C.glowAlert,
    celebrate: C.glowCelebrate,
    speed: C.glowSpeed,
    idle: C.glowCalm,
  }[m]);

// ═══════════════════════════════════════════════════════════════
export function Pilot({
  mode = 'calm',
  size = 200,
  trigger = null,
  onTriggerComplete,
  className = '',
  showScene = true,
  background,
}: PilotProps) {
  const [currentMode, setCurrentMode] = useState<PilotMode>(mode);
  const [mouthState, setMouthState] = useState<'neutral' | 'shock' | 'happy'>('neutral');
  const [blinking, setBlinking] = useState(false);
  const [pupilDrift, setPupilDrift] = useState({ x: 0, y: 0 });
  const triggerCompleteRef = useRef(onTriggerComplete);
  triggerCompleteRef.current = onTriggerComplete;

  useEffect(() => {
    setCurrentMode(mode);
    if (mode === 'alert') setMouthState('shock');
    else if (mode === 'celebrate') setMouthState('happy');
    else setMouthState('neutral');
  }, [mode]);

  useEffect(() => {
    if (!trigger) return;
    const durations: Record<PilotTrigger, { mode: PilotMode; ms: number }> = {
      plate_verified: { mode: 'celebrate', ms: 2400 },
      zone_alert_entry: { mode: 'alert', ms: 1200 },
      reroute_success: { mode: 'celebrate', ms: 2000 },
      trip_end_saved: { mode: 'celebrate', ms: 2500 },
      pcn_success: { mode: 'celebrate', ms: 5000 },
      streak_milestone: { mode: 'celebrate', ms: 3000 },
    };
    const spec = durations[trigger];
    setCurrentMode(spec.mode);
    setMouthState(spec.mode === 'alert' ? 'shock' : spec.mode === 'celebrate' ? 'happy' : 'neutral');
    const id = setTimeout(() => {
      setCurrentMode(mode);
      setMouthState(mode === 'alert' ? 'shock' : mode === 'celebrate' ? 'happy' : 'neutral');
      triggerCompleteRef.current?.();
    }, spec.ms);
    return () => clearTimeout(id);
  }, [trigger, mode]);

  useEffect(() => {
    if (currentMode === 'alert' || currentMode === 'celebrate') return;
    const intervals: Record<PilotMode, [number, number]> = {
      calm: [3200, 5500],
      alert: [0, 0],
      celebrate: [0, 0],
      speed: [1400, 2400],
      idle: [4500, 6500],
    };
    const [minI, maxI] = intervals[currentMode];
    if (minI === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const interval = minI + Math.random() * (maxI - minI);
      timeoutId = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          if (Math.random() < 0.1) {
            setTimeout(() => {
              setBlinking(true);
              setTimeout(() => {
                setBlinking(false);
                scheduleBlink();
              }, currentMode === 'speed' ? 100 : 130);
            }, 200);
          } else {
            scheduleBlink();
          }
        }, currentMode === 'speed' ? 130 : 170);
      }, interval);
    };
    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [currentMode]);

  useEffect(() => {
    if (currentMode !== 'calm' && currentMode !== 'idle') {
      setPupilDrift({ x: 0, y: 0 });
      return;
    }
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleSaccade = () => {
      const interval = 2400 + Math.random() * 3500;
      timeoutId = setTimeout(() => {
        setPupilDrift({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 3 });
        setTimeout(() => setPupilDrift({ x: 0, y: 0 }), 1100);
        scheduleSaccade();
      }, interval);
    };
    scheduleSaccade();
    return () => clearTimeout(timeoutId);
  }, [currentMode]);

  const svgW = size;
  const svgH = size * 0.8;
  const stageH = showScene ? size * 1.15 : svgH * 1.05;
  const uid = React.useId();

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: stageH,
        display: 'inline-block',
        overflow: showScene ? 'hidden' : 'visible',
        borderRadius: showScene ? 24 : 0,
        background: background ?? 'transparent',
      }}
    >
      {showScene && currentMode === 'speed' && <SpeedScene size={size} uid={uid} />}
      {showScene && currentMode === 'alert' && <AlertSiren size={size} uid={uid} />}
      {showScene && currentMode === 'celebrate' && <Confetti size={size} />}
      {showScene && (currentMode === 'calm' || currentMode === 'idle') && <DustParticles size={size} />}
      {showScene && currentMode === 'idle' && <SleepZ size={size} />}

      {/* Ground glow — subtler when embedded without scene */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: showScene ? size * 0.06 : size * 0.02,
          left: '50%',
          width: showScene ? size * 0.7 : size * 0.5,
          height: showScene ? size * 0.08 : size * 0.04,
          borderRadius: '50%',
          background: glowColorForMode(currentMode),
          filter: `blur(${showScene ? size * 0.08 : size * 0.05}px)`,
          zIndex: 1,
          pointerEvents: 'none',
          translateX: '-50%',
        }}
        animate={{
          opacity:
            currentMode === 'celebrate'
              ? (showScene ? [0.6, 1, 0.7, 0.6] : [0.3, 0.55, 0.35, 0.3])
              : currentMode === 'alert'
              ? (showScene ? [0.6, 1, 0.6] : [0.3, 0.55, 0.3])
              : currentMode === 'speed'
              ? (showScene ? 0.5 : 0.3)
              : (showScene ? [0.4, 0.6, 0.4] : [0.2, 0.35, 0.2]),
          scale:
            currentMode === 'celebrate'
              ? [1, 1.25, 1.1, 1]
              : currentMode === 'speed'
              ? 1.3
              : [1, 1.05, 1],
        }}
        transition={{
          duration: currentMode === 'celebrate' ? 0.8 : currentMode === 'alert' ? 0.5 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ground shadow — only when full scene is on */}
      {showScene && (
        <div
          style={{
            position: 'absolute',
            bottom: size * 0.09,
            left: '50%',
            width: size * 0.5,
            height: size * 0.035,
            borderRadius: '50%',
            background: 'rgba(2, 6, 17, 0.5)',
            zIndex: 2,
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
          }}
        />
      )}

      {/* PILOT SVG — locked character */}
      <motion.svg
        width={svgW}
        height={svgH}
        viewBox="0 0 500 400"
        xmlns="http://www.w3.org/2000/svg"
        variants={rootVariants}
        animate={currentMode}
        style={{
          overflow: 'visible',
          display: 'block',
          position: 'absolute',
          bottom: showScene ? size * 0.1 : 0,
          left: 0,
          zIndex: 5,
          transformOrigin: '50% 85%',
        }}
      >
        <defs>
          <radialGradient id={`haloAlert-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.glowAlert} stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.glowAlert} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`haloCelebrate-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.glowCelebrate} stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.glowCelebrate} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`haloSpeed-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.glowSpeed} stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.glowSpeed} stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.g variants={bodyVariants} animate={currentMode} style={{ transformOrigin: '250px 360px' }}>
          {/* Halos */}
          {currentMode === 'alert' && (
            <>
              <circle cx="160" cy="250" r="100" fill={`url(#haloAlert-${uid})`} />
              <circle cx="340" cy="250" r="100" fill={`url(#haloAlert-${uid})`} />
            </>
          )}
          {currentMode === 'celebrate' && (
            <>
              <circle cx="160" cy="250" r="100" fill={`url(#haloCelebrate-${uid})`} />
              <circle cx="340" cy="250" r="100" fill={`url(#haloCelebrate-${uid})`} />
            </>
          )}
          {currentMode === 'speed' && (
            <>
              <circle cx="160" cy="250" r="100" fill={`url(#haloSpeed-${uid})`} />
              <circle cx="340" cy="250" r="100" fill={`url(#haloSpeed-${uid})`} />
            </>
          )}

          {/* APPROVED paths — verbatim */}
          <path
            d="M50,300 Q50,150 250,150 Q450,150 450,300 L450,340 Q450,360 250,360 Q50,360 50,340 Z"
            fill={C.bodyYellow}
            stroke={C.bodyStroke}
            strokeWidth="2"
          />
          <path
            d="M120,150 Q130,50 250,50 Q370,50 380,150"
            fill="none"
            stroke={C.roofStroke}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M140,150 L160,80 Q250,70 340,80 L360,150" fill={C.windshield} opacity="0.5" />

          {/* LEFT EYE */}
          <g>
            <circle cx="160" cy="250" r="65" fill="white" stroke={C.bodyStroke} strokeWidth="3" />
            <motion.g variants={irisVariants} animate={currentMode} style={{ transformOrigin: '160px 250px' }}>
              <circle cx="160" cy="250" r="30" fill={C.irisBrown} />
              <motion.g variants={pupilVariants} animate={currentMode} style={{ transformOrigin: '160px 250px' }}>
                <motion.g animate={{ x: pupilDrift.x, y: pupilDrift.y }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
                  <circle cx="160" cy="250" r="12" fill={C.pupilBlack} />
                  <circle cx="145" cy="235" r="5" fill={C.shine} opacity="0.8" />
                </motion.g>
              </motion.g>
            </motion.g>
            <motion.path
              d="M 95 185 Q 160 178 225 185 L 225 252 Q 160 245 95 252 Z"
              fill={C.bodyYellow}
              stroke={C.bodyStroke}
              strokeWidth="2"
              animate={{ scaleY: blinking ? 1 : 0 }}
              transition={{ duration: 0.08 }}
              style={{ transformOrigin: '160px 185px' }}
            />
          </g>

          {/* RIGHT EYE */}
          <g>
            <circle cx="340" cy="250" r="65" fill="white" stroke={C.bodyStroke} strokeWidth="3" />
            <motion.g variants={irisVariants} animate={currentMode} style={{ transformOrigin: '340px 250px' }}>
              <circle cx="340" cy="250" r="30" fill={C.irisBrown} />
              <motion.g variants={pupilVariants} animate={currentMode} style={{ transformOrigin: '340px 250px' }}>
                <motion.g animate={{ x: pupilDrift.x, y: pupilDrift.y }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
                  <circle cx="340" cy="250" r="12" fill={C.pupilBlack} />
                  <circle cx="325" cy="235" r="5" fill={C.shine} opacity="0.8" />
                </motion.g>
              </motion.g>
            </motion.g>
            <motion.path
              d="M 275 185 Q 340 178 405 185 L 405 252 Q 340 245 275 252 Z"
              fill={C.bodyYellow}
              stroke={C.bodyStroke}
              strokeWidth="2"
              animate={{ scaleY: blinking ? 1 : 0 }}
              transition={{ duration: 0.08 }}
              style={{ transformOrigin: '340px 185px' }}
            />
          </g>

          {/* BROWS */}
          <motion.path
            d="M110,180 Q160,165 210,180"
            fill="none"
            stroke={C.brow}
            strokeWidth="12"
            strokeLinecap="round"
            variants={browLVariants}
            animate={currentMode}
            style={{ transformOrigin: '160px 180px' }}
          />
          <motion.path
            d="M290,180 Q340,165 390,180"
            fill="none"
            stroke={C.brow}
            strokeWidth="12"
            strokeLinecap="round"
            variants={browRVariants}
            animate={currentMode}
            style={{ transformOrigin: '340px 180px' }}
          />

          {/* MOUTH */}
          <motion.path
            d="M180,310 Q250,350 320,310"
            fill="none"
            stroke={C.mouth}
            strokeWidth="5"
            strokeLinecap="round"
            animate={{ opacity: mouthState === 'neutral' ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.g animate={{ opacity: mouthState === 'shock' ? 1 : 0 }} transition={{ duration: 0.18 }}>
            <ellipse cx="250" cy="325" rx="18" ry="22" fill={C.brow} />
            <ellipse cx="246" cy="318" rx="5" ry="6" fill="rgba(255,255,255,0.25)" />
          </motion.g>
          <motion.g animate={{ opacity: mouthState === 'happy' ? 1 : 0 }} transition={{ duration: 0.18 }}>
            <path d="M180,310 Q250,360 320,310 Q310,340 250,340 Q190,340 180,310 Z" fill={C.brow} />
            <ellipse cx="250" cy="335" rx="18" ry="6" fill="#E8708A" />
          </motion.g>

          {/* Bumper */}
          <rect x="40" y="340" width="420" height="25" rx="12" fill={C.bumper} />
          {/* Wheels */}
          <rect x="70" y="365" width="60" height="30" rx="5" fill={C.wheel} />
          <rect x="370" y="365" width="60" height="30" rx="5" fill={C.wheel} />
          {/* Mirrors — repainted */}
          <ellipse cx="65" cy="190" rx="25" ry="15" fill={C.bodyYellow} stroke={C.bodyStroke} />
          <ellipse cx="435" cy="190" rx="25" ry="15" fill={C.bodyYellow} stroke={C.bodyStroke} />

          {/* Shock lines for alert */}
          {currentMode === 'alert' && (
            <g>
              {[
                { x1: 40, y1: 100, x2: 70, y2: 130, d: 0 },
                { x1: 250, y1: 20, x2: 250, y2: 55, d: 0.1 },
                { x1: 460, y1: 100, x2: 430, y2: 130, d: 0.2 },
                { x1: 30, y1: 200, x2: 60, y2: 215, d: 0.05 },
                { x1: 470, y1: 200, x2: 440, y2: 215, d: 0.15 },
              ].map((l, i) => (
                <motion.line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={C.glowAlert}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], strokeWidth: [6, 4, 1] }}
                  transition={{ duration: 0.4, delay: l.d, repeat: Infinity }}
                />
              ))}
            </g>
          )}
        </motion.g>
      </motion.svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCENE: SPEED
// ═══════════════════════════════════════════════════════════════
function SpeedScene({ size, uid }: { size: number; uid: string }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 80% at 50% 45%, rgba(15, 25, 55, 0) 0%, rgba(5, 8, 20, 0.75) 100%), radial-gradient(ellipse at 50% 30%, #0A1838 0%, #030610 75%)',
          zIndex: 0,
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1024 1024"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id={`asphalt-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#050A18" />
            <stop offset="35%" stopColor="#0B1428" />
            <stop offset="100%" stopColor="#1C2536" />
          </linearGradient>
          <linearGradient id={`edgeFade-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.45)" />
          </linearGradient>
          <linearGradient id={`centerFade-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(245, 199, 68, 0)" />
            <stop offset="35%" stopColor="rgba(245, 199, 68, 0.35)" />
            <stop offset="100%" stopColor="rgba(245, 199, 68, 1)" />
          </linearGradient>
          <radialGradient id={`carBaseGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 199, 68, 0.35)" />
            <stop offset="100%" stopColor="rgba(245, 199, 68, 0)" />
          </radialGradient>
          <clipPath id={`leftLaneClip-${uid}`}>
            <path d="M 380 520 L 0 1024 L 510 1024 L 510 520 Z" />
          </clipPath>
          <clipPath id={`rightLaneClip-${uid}`}>
            <path d="M 514 520 L 514 1024 L 1024 1024 L 644 520 Z" />
          </clipPath>
          <linearGradient id={`horizonFog-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(30, 50, 90, 0)" />
            <stop offset="50%" stopColor="rgba(40, 70, 120, 0.4)" />
            <stop offset="100%" stopColor="rgba(30, 50, 90, 0)" />
          </linearGradient>
        </defs>

        <path d="M 0 1024 L 380 520 L 644 520 L 1024 1024 Z" fill={`url(#asphalt-${uid})`} />
        <path d="M 380 520 L -40 1024 L 30 1024 L 394 520 Z" fill={`url(#edgeFade-${uid})`} />
        <path d="M 644 520 L 1060 1024 L 994 1024 L 630 520 Z" fill={`url(#edgeFade-${uid})`} />

        <g clipPath={`url(#leftLaneClip-${uid})`}>
          <path d="M 500 540 L 468 620 L 490 620 L 510 540 Z" fill={`url(#centerFade-${uid})`} opacity="0.85" />
          <path d="M 460 680 L 420 760 L 446 760 L 488 680 Z" fill={`url(#centerFade-${uid})`} />
          <path d="M 410 820 L 360 920 L 394 920 L 442 820 Z" fill={`url(#centerFade-${uid})`} />
          <path d="M 350 960 L 290 1024 L 330 1024 L 386 960 Z" fill="#F5C744" />
        </g>
        <g clipPath={`url(#rightLaneClip-${uid})`}>
          <path d="M 514 540 L 534 620 L 556 620 L 524 540 Z" fill={`url(#centerFade-${uid})`} opacity="0.85" />
          <path d="M 536 680 L 578 760 L 604 760 L 564 680 Z" fill={`url(#centerFade-${uid})`} />
          <path d="M 582 820 L 630 920 L 664 920 L 614 820 Z" fill={`url(#centerFade-${uid})`} />
          <path d="M 638 960 L 694 1024 L 734 1024 L 674 960 Z" fill="#F5C744" />
        </g>

        <rect x="0" y="460" width="1024" height="120" fill={`url(#horizonFog-${uid})`} />
        <ellipse cx="512" cy="720" rx="220" ry="40" fill={`url(#carBaseGlow-${uid})`} />
      </svg>

      {/* Radial speed streaks */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '65%',
          overflow: 'hidden',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {[
          { r: -165, w: 180, d: 0, dur: 0.5, c: 'white', thin: false },
          { r: -155, w: 160, d: 0.08, dur: 0.55, c: 'blue', thin: true },
          { r: -145, w: 200, d: 0.16, dur: 0.48, c: 'white', thin: true },
          { r: -135, w: 220, d: 0.04, dur: 0.52, c: 'blue', thin: false },
          { r: -125, w: 170, d: 0.2, dur: 0.58, c: 'white', thin: true },
          { r: -115, w: 190, d: 0.12, dur: 0.5, c: 'white', thin: false },
          { r: -105, w: 150, d: 0.24, dur: 0.56, c: 'blue', thin: true },
          { r: -75, w: 150, d: 0.22, dur: 0.54, c: 'white', thin: false },
          { r: -65, w: 170, d: 0.1, dur: 0.5, c: 'blue', thin: true },
          { r: -55, w: 220, d: 0.06, dur: 0.52, c: 'white', thin: false },
          { r: -45, w: 210, d: 0.18, dur: 0.48, c: 'blue', thin: false },
          { r: -35, w: 190, d: 0.14, dur: 0.58, c: 'white', thin: true },
          { r: -25, w: 170, d: 0.02, dur: 0.5, c: 'white', thin: false },
          { r: -15, w: 160, d: 0.26, dur: 0.56, c: 'blue', thin: true },
        ].map((s, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              height: s.thin ? 1 : 2,
              borderRadius: 2,
              transformOrigin: '0 50%',
              transform: `rotate(${s.r}deg)`,
              background:
                s.c === 'white'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(220, 235, 255, 0.9) 60%, rgba(255,255,255,1) 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(100, 160, 230, 0.7) 70%, rgba(140, 200, 255, 0.9) 100%)',
              boxShadow: s.c === 'white' ? '0 0 6px rgba(180, 210, 255, 0.6)' : '0 0 8px rgba(59, 169, 255, 0.5)',
              opacity: s.thin ? 0.5 : 1,
            }}
            animate={{ width: [0, s.w, s.w], opacity: [0, 1, 0] }}
            transition={{ duration: s.dur, delay: s.d, repeat: Infinity, ease: 'linear', times: [0, 0.15, 1] }}
          />
        ))}
      </div>

      {/* Headlight beams on road */}
      <motion.svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYEnd meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: size * 0.14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: size * 0.5,
          zIndex: 3,
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id={`beamL-${uid}`} x1="50%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5C744" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F5C744" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`beamR-${uid}`} x1="50%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5C744" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F5C744" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 160 0 L 20 200 L 180 200 Z" fill={`url(#beamL-${uid})`} />
        <path d="M 240 0 L 380 200 L 220 200 Z" fill={`url(#beamR-${uid})`} />
      </motion.svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 90% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.7) 100%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
function AlertSiren({ size, uid }: { size: number; uid: string }) {
  const barW = size * 0.32;
  const barH = size * 0.12;
  return (
    <>
      <motion.svg
        viewBox="0 0 240 280"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: size * 0.13,
          left: '50%',
          width: size * 0.55,
          height: size * 0.7,
          zIndex: 3,
          pointerEvents: 'none',
        }}
        initial={{ rotate: -25, x: '-50%' }}
        animate={{ rotate: [-25, 25, -25], x: '-50%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <linearGradient id={`sirenBeam-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 120 0 L 60 280 L 180 280 Z" fill={`url(#sirenBeam-${uid})`} />
      </motion.svg>

      <motion.svg
        viewBox="0 0 140 50"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: size * 0.05,
          left: '50%',
          width: barW,
          height: barH,
          zIndex: 6,
          pointerEvents: 'none',
        }}
        initial={{ y: -40, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <rect x="20" y="30" width="100" height="14" rx="3" fill="#1F2532" stroke="#000" strokeWidth="1.5" />
        <rect x="20" y="30" width="100" height="3" fill="rgba(255,255,255,0.2)" />
        <rect x="66" y="20" width="8" height="12" fill="#1F2532" />
        <motion.rect
          x="24"
          y="33"
          width="46"
          height="8"
          rx="2"
          fill="#EF4444"
          animate={{ opacity: [1, 1, 0.25, 0.25, 1] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1, 1] }}
          style={{ filter: 'drop-shadow(0 0 12px #EF4444)' }}
        />
        <motion.rect
          x="70"
          y="33"
          width="46"
          height="8"
          rx="2"
          fill="#3BA9FF"
          animate={{ opacity: [0.25, 0.25, 1, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1, 1] }}
          style={{ filter: 'drop-shadow(0 0 12px #3BA9FF)' }}
        />
        <line x1="70" y1="30" x2="70" y2="44" stroke="#000" strokeWidth="1.5" />
      </motion.svg>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
function Confetti({ size }: { size: number }) {
  const colors = ['#EF4444', '#3BA9FF', '#FDC500', '#22C55E'];
  const pieces = Array.from({ length: 14 }, (_, i) => ({
    left: `${8 + (i * 85) / 13}%`,
    color: colors[i % colors.length],
    delay: (i * 0.08) % 1.2,
  }));
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      >
        {pieces.map((p, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: -20,
              left: p.left,
              width: size * 0.025,
              height: size * 0.035,
              borderRadius: 2,
              background: p.color,
            }}
            initial={{ y: 0, rotate: 0, opacity: 0 }}
            animate={{ y: size * 1.3, rotate: 720, opacity: [0, 1, 1, 0.6] }}
            transition={{ duration: 1.6, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: size * 0.1,
          left: '50%',
          width: size * 0.1,
          height: size * 0.1,
          borderRadius: '50%',
          border: '3px solid #FDC500',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        initial={{ scale: 0.5, opacity: 1, x: '-50%' }}
        animate={{ scale: 5, opacity: 0, x: '-50%' }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
function DustParticles({ size }: { size: number }) {
  const dusts = [
    { left: '15%', delay: 0 },
    { left: '28%', delay: 1.2 },
    { left: '42%', delay: 2.4 },
    { left: '68%', delay: 3.6 },
    { left: '82%', delay: 4.8 },
    { left: '55%', delay: 1.6 },
    { left: '22%', delay: 3.2 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
      {dusts.map((d, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: d.left,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(245, 199, 68, 0.4)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -size * 0.9, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
function SleepZ({ size }: { size: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: size * 0.08,
        left: '54%',
        fontSize: size * 0.14,
        fontWeight: 800,
        color: '#94A3B8',
        zIndex: 6,
        pointerEvents: 'none',
      }}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
      animate={{ y: -size * 0.15, x: size * 0.05, opacity: [0, 0.6, 0], scale: [0.5, 1.3, 1.3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      z
    </motion.div>
  );
}
