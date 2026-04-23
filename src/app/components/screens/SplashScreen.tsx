import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../tp';
import { Pilot } from '../Pilot';
import { PilotFX } from '../PilotFX';

// ═══════════════════════════════════════════════════════════════
// SPLASH SCREEN — brand moment
//
// Entry (strict):
//   1. Background glow softly appears
//   2. Car fades + scales in FROM CENTER ONLY (no slide)
//   3. Car settles vertically (subtle)
//   4. Wordmark fades in under the car
//   5. Car transitions into subtle idle loop (handled by Pilot)
//
// No directional movement from edges. No sliding from sides.
// Wordmark: "Toll" = white, "Pilot" = yellow (#F5BD31).
// ═══════════════════════════════════════════════════════════════

const WORDMARK = (
  // Provided wordmark SVG, coloured per spec.
  // "Toll" paths → white, "Pilot" paths → yellow #F5BD31.
  // Original paths retained verbatim; only fills changed.
  <svg viewBox="0 0 1880.72 376.67" width="260" height="52" aria-label="TollPilot" role="img">
    {/* P (Pilot) – yellow */}
    <path d="M1082.53,19.01c-26.93-5.64-55.61-3.98-83.56-3.97l-103.5.03c-15.7,68.93-31.85,137.74-48.46,206.45-9.98,42.32-20.45,91.82-31.69,133.45,30.07.05,60.63.37,90.66-.01,8.33-33.63,16.45-67.29,24.36-101.02l45-.07c39.18.2,66.03.85,102.77-17.05,82.28-40.08,118.56-193.91,4.42-217.8ZM1059.46,138.93c-4.89,15.99-11.27,24.6-26.03,33.23-20.28,9.21-63.31,6.29-86.7,6.19,7.14-29.85,13.72-60.92,21.47-90.51,20.87-.18,45.44-1.61,65.88,1.39,25.51,3.73,32.13,27.65,25.38,49.7Z" fill="#F5BD31"/>
    {/* o (Toll) – white */}
    <path d="M421.94,100.81c-47.5,5.07-87.21,23.68-118.37,61.38-40.6,49.12-56.47,130.62-1.02,175.69,29.24,23.78,66.24,27.42,102.81,25.71,46.49-5.3,91.53-24.76,119.13-63.04,72.8-100.97,26.23-209.44-102.54-199.75ZM414.53,289.78c-83.02,16.57-80.88-94.23-3.21-115.42,86.03-7.69,73.48,96.77,3.21,115.42Z" fill="#FFFFFF"/>
    {/* o (Pilot) – yellow */}
    <path d="M1524.71,100.78c-47.76,5.56-86.56,23.73-117.68,61.79-40.1,49.06-57.37,132.48-.58,176.61,28.76,22.35,66.02,26.37,101.46,24.44,46.97-6.18,92.77-26.48,120.09-65.85,69.04-99.52,23.67-208.29-103.29-196.99ZM1514.37,289.99c-55.79,6.72-71.95-37.34-47.02-80.7,11.3-19.66,28.44-29.56,50.16-34.92,80.87-6.54,69.3,98.09-3.14,115.62Z" fill="#F5BD31"/>
    {/* T – white */}
    <path d="M54.22,15.27l323.77-.04c-6.51,24.66-12.46,50.78-18.53,75.65h-114.86s-38.34,167.25-38.34,167.25l-22.89,96.76-89.73-.02c20.15-87.89,39.83-175.89,59.04-263.99l-114.54-.08c5.55-24.26,11.7-51.15,16.07-75.52Z" fill="#FFFFFF"/>
    {/* t – yellow */}
    <path d="M1722.95,41.42l88.13.02-16.92,70.3,68.29.04c-5.81,22.89-11.08,47.81-16.42,70.97h-68.82c-5.88,24.31-15.34,57.45-18.39,81.75-4.39,35.06,51.39,16.2,68.02,16.19.68,2.9-.75,7.49-1.46,10.64-4.07,18.76-8.28,37.49-12.62,56.2-27.77,12.5-64.87,14.58-93.8,8.59-59.88-12.42-57.86-61.5-45.07-109.35,4.39-16.4,8.71-36.04,12.7-52.59l36.35-152.76Z" fill="#F5BD31"/>
    {/* l (Toll) – white */}
    <path d="M630.54,15.24l87.63-.07c-25.7,113.38-52.06,226.62-79.08,339.7-28.93-.17-57.85-.12-86.78.14,13.95-56.84,26.81-114.79,39.98-171.86,13.1-55.88,25.85-111.86,38.25-167.91Z" fill="#FFFFFF"/>
    {/* l (Pilot) – yellow */}
    <path d="M1318.09,15l87.53-.03-82.39,339.92-86.85.07c3.55-11.79,6.92-27.96,9.84-40.18l17.18-71.41,54.69-228.37Z" fill="#F5BD31"/>
    {/* l (Toll) – white */}
    <path d="M756.84,15.18c28.94.32,58.37.02,87.35-.02-12.28,56.39-27.97,117.01-40.39,173.3-3.72,16.85-37.11,162.47-40.77,166.33l-85.52.04c10.81-38.64,21.37-90.08,30.63-130.13,16.7-69.73,32.93-139.57,48.69-209.52Z" fill="#FFFFFF"/>
    {/* i-dot (Pilot) – yellow */}
    <path d="M1173.86,115.57h87.08s-58.17,239.39-58.17,239.39l-87.08-.06c20.46-76.57,39.89-161.7,58.17-239.33Z" fill="#F5BD31"/>
    <path d="M1234.78,10.15c68.98-1.81,63.71,79.1-4.22,90.33-76.25,3.47-64.83-82.78,4.22-90.33Z" fill="#F5BD31"/>
  </svg>
);

export function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    const wm = setTimeout(() => setShowWordmark(true), 700); // car settles, then wordmark fades in
    const nav = setTimeout(() => navigate('/auth'), 2600);
    return () => { clearTimeout(wm); clearTimeout(nav); };
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100dvh', background: t.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* 1. Background glow — softly appears first */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 420, height: 420, borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${t.accent}22 0%, transparent 68%)`,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        style={{
          position: 'absolute', top: '52%', left: '50%',
          width: 260, height: 260, borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${t.primary}1a 0%, transparent 72%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 2 + 3. Car fades + scales in FROM CENTER, settles vertically
             No directional slide. Pilot's internal idle loop handles
             breathing, blink, pupil drift, eye motion after entry. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          // subtle vertical settle: nudge down 6px then back to 0
          y: [0, 6, 0],
        }}
        transition={{
          opacity: { duration: 0.55, ease: 'easeOut', delay: 0.25 },
          scale:   { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
          y:       { duration: 0.7, ease: 'easeInOut', delay: 0.55, times: [0, 0.4, 1] },
        }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {/* confident idle — subtle float + micro eye + occasional blink */}
        <div style={{ position: "relative", width: 180, height: 180, display: "inline-block" }}><PilotFX emotion="confident" size={180} /><Pilot size={180} emotion="confident"  showScene={false} /></div>
      </motion.div>

      {/* 4. Wordmark fades in UNDER the car */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, marginTop: 8 }}>
        <AnimatePresence>
          {showWordmark && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {WORDMARK}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
