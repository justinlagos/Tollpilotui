import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, Logo, Btn, Icon } from '../tp';
import { Car3D } from '../Car3D';

const SLIDES = [
  {
    icon: 'zap',
    color: '#3BA9FF',
    title: 'Stop paying charges you didn\'t plan for',
    body: 'ULEZ, tolls, airport fees. They add up quietly.\nWe surface them before they cost you.',
    visual: 'route',
  },
  {
    icon: 'bell',
    color: '#FDC500',
    title: 'See the real cost of every route',
    body: 'Not just time.\nEvery route shows what you\'ll pay, what you\'ll avoid, and what it saves you.',
    visual: 'alert',
  },
  {
    icon: 'shield',
    color: '#3BA9FF',
    title: "You're covered.",
    body: "We've verified your vehicle.\nYou'll know before any charge hits.",
    visual: 'car',
  },
];

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 30 },
      opacity: { duration: 0.25, ease: 'easeOut' },
      scale: { duration: 0.3, ease: 'easeOut' },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 30 },
      opacity: { duration: 0.2, ease: 'easeIn' },
      scale: { duration: 0.2 },
    },
  }),
};

const TEXT_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 280, damping: 28, delay: 0.08 },
      opacity: { duration: 0.3, ease: 'easeOut', delay: 0.08 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  }),
};

const STATUS_CHIPS = [
  { label: 'MOT', value: 'Covered' },
  { label: 'TAX', value: 'Up to date' },
  { label: 'ULEZ', value: 'No charges' },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [slide, setSlide] = useState(0);
  const dirRef = useRef(1);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  const goTo = (next: number) => {
    dirRef.current = next > slide ? 1 : -1;
    setSlide(next);
  };

  const next = () => {
    if (slide < SLIDES.length - 1) goTo(slide + 1);
    else navigate('/lookup');
  };

  // CTA always yellow on last slide — system accent, not slide color
  const ctaColor = isLast ? '#FDC500' : current.color;
  const ctaIconColor = (isLast || slide === 1) ? '#0A0F1C' : '#fff';

  return (
    <div style={{
      minHeight: '100dvh', background: t.bg,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Ambient glow blob — tracks slide color */}
      <motion.div
        animate={{ background: `radial-gradient(circle, ${current.color}20 0%, transparent 65%)` }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
          width: 380, height: 380, borderRadius: '50%', pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ background: `radial-gradient(circle, ${current.color}0c 0%, transparent 70%)` }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '8%', right: '-12%',
          width: 280, height: 280, borderRadius: '50%', pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '56px 24px 0', position: 'relative', zIndex: 2,
      }}>
        <Logo s={26} theme={theme} />
        <button onClick={() => navigate('/lookup')} style={{
          background: 'none', border: 'none', color: t.textTer, fontSize: 14,
          fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>Skip</button>
      </div>

      {/* Slide content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 24px 0', gap: 20, position: 'relative', zIndex: 2, overflow: 'hidden',
      }}>

        {/* Visual area */}
        <div style={{ width: '100%', maxWidth: 360, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence initial={false} custom={dirRef.current} mode="popLayout">
            <motion.div
              key={`visual-${slide}`}
              custom={dirRef.current}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ width: '100%' }}
            >
              {/* ── Slide 0: Route map ── */}
              {slide === 0 && (
                <div style={{
                  background: t.card, borderRadius: 24, border: `1px solid ${t.border}`,
                  padding: 24, position: 'relative', overflow: 'hidden',
                }}>
                  <svg width="100%" height="140" viewBox="0 0 340 140">
                    <defs>
                      <linearGradient id="ob1" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3BA9FF" /><stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                      <linearGradient id="ob2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" /><stop offset="100%" stopColor="#22C55E" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <rect width="340" height="140" fill={t.mapBg} rx="12" />
                    <g stroke={t.mapRoad} strokeWidth="4" fill="none" opacity="0.5">
                      <path d="M 0 70 Q 85 60 170 70 T 340 80" />
                      <path d="M 0 100 Q 85 105 170 100 T 340 90" />
                      <path d="M 80 0 L 85 140" />
                      <path d="M 260 0 L 265 140" />
                    </g>
                    <path d="M 20 110 Q 100 80 170 70 Q 240 60 320 50" stroke="url(#ob1)" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <circle cx="240" cy="60" r="30" fill="#EF444425" stroke="#EF444455" strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx="240" cy="60" r="8" fill="#EF4444" opacity="0.8" />
                    <path d="M 20 110 Q 60 105 100 100 Q 150 95 180 100 Q 230 108 320 50" stroke="url(#ob2)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="5 3" />
                    <circle cx="20" cy="110" r="7" fill="#3BA9FF" />
                    <circle cx="320" cy="50" r="8" fill="#FDC500" />
                    <rect x="200" y="46" width="40" height="18" rx="5" fill="#EF444490" />
                    <text x="220" y="59" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">£12.50</text>
                    <rect x="155" y="108" width="48" height="18" rx="5" fill="#22C55E90" />
                    <text x="179" y="121" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">FREE</text>
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 3, borderRadius: 2, background: '#3BA9FF' }} />
                      <span style={{ fontSize: 12, color: t.textSec }}>Fastest · £30.50</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 3, borderRadius: 2, background: '#22C55E' }} />
                      <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 700 }}>Cheapest · £0</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Slide 1: Alerts ── */}
              {slide === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { color: '#3BA9FF', label: 'APPROACHING', title: 'ULEZ ahead', sub: 'ULEZ ahead. Save £12.50 by rerouting.' },
                    { color: '#F59E0B', label: 'IMMINENT', title: 'Toll in 0.8 miles', sub: 'Toll crossing in 0.8 miles. Continue or avoid?' },
                    { color: '#EF4444', label: 'ZONE ENTERED', title: 'Payment required', sub: 'Airport drop-off fee ahead. Pay attention.' },
                  ].map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.08, duration: 0.35, ease: 'easeOut' }}
                      style={{
                        background: t.card, borderRadius: 16, border: `1px solid ${a.color}33`,
                        boxShadow: `0 4px 20px ${a.color}18`, padding: 14,
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: `${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon n="bell" s={18} c={a.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: a.color, letterSpacing: '0.08em' }}>{a.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: t.textSec }}>{a.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ── Slide 2: Car hero (bare — sits on page bg) ── */}
              {slide === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  {/* Car — transparent/bare, grounded by blue glow */}
                  <Car3D
                    size="lg"
                    glowColor="#3BA9FF"
                    variant="bare"
                    entered
                    sweep
                  />

                  {/* Status chips — stagger in after car */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, width: '100%' }}>
                    {STATUS_CHIPS.map((chip, i) => (
                      <motion.div
                        key={chip.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 + i * 0.05, duration: 0.3, ease: 'easeOut' }}
                        style={{
                          background: t.cardHi,
                          borderRadius: 12,
                          padding: '10px 6px',
                          textAlign: 'center',
                          border: `1px solid ${t.border}`,
                        }}
                      >
                        <div style={{ fontSize: 9, fontWeight: 700, color: t.textTer, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                          {chip.label}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#3BA9FF', marginTop: 3 }}>
                          {chip.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Copy — slides in slightly behind the visual */}
        <div style={{ textAlign: 'center', maxWidth: 300, overflow: 'hidden' }}>
          <AnimatePresence initial={false} custom={dirRef.current} mode="popLayout">
            <motion.div
              key={`text-${slide}`}
              custom={dirRef.current}
              variants={TEXT_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <h2 style={{
                fontSize: 28, fontWeight: 900, color: t.textPri, letterSpacing: '-0.03em',
                margin: '0 0 12px', lineHeight: 1.2,
              }}>{current.title}</h2>
              <p style={{ fontSize: 15, color: t.textSec, margin: 0, lineHeight: 1.65 }}>
                {current.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '20px 24px 44px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* Progress dots — pill expands, active uses slide color */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width: i === slide ? 28 : 7,
                height: 7,
                background: i === slide ? current.color : t.cardHi,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{
                borderRadius: 999,
                border: 'none', cursor: 'pointer', padding: 0,
              }}
            />
          ))}
        </div>

        {/* Trust line — fades in on last slide */}
        <AnimatePresence>
          {isLast && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ fontSize: 12, color: t.textTer, textAlign: 'center' }}
            >
              Trusted by drivers across the UK
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA — always yellow on last slide */}
        <motion.div
          animate={{ scale: 1 }}
          initial={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          style={{ width: '100%' }}
        >
          <Btn v="accent" t={{ ...t, accent: ctaColor }} size="lg" onClick={next} full>
            {isLast ? 'Start saving now' : 'Next'}
            <Icon n="right" s={18} c={ctaIconColor} />
          </Btn>
        </motion.div>
      </div>
    </div>
  );
}
