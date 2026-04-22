import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, Btn, Icon, UKPlate, Logo } from '../tp';
import { Pilot } from '../Pilot';

type LookupState = 'input' | 'loading' | 'success' | 'error';
const VALID_PLATES = ['DS18JRX', 'AB12CDE', 'LK23ABC'];

export function VehicleLookupScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [plate, setPlate] = useState('');
  const [state, setState] = useState<LookupState>('input');

  const isValid = plate.replace(/\s/g, '').length >= 5;

  const handleLookup = () => {
    if (!isValid) return;
    setState('loading');
    setTimeout(() => {
      const found = VALID_PLATES.some(p => p === plate.replace(/\s/g, '').toUpperCase());
      setState(found ? 'success' : Math.random() > 0.3 ? 'success' : 'error');
    }, 2400);
  };

  const retry = () => { setState('input'); setPlate(''); };

  // ─── LOADING ───────────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 24px' }}>
        <div style={{ width: '100%', maxWidth: 340, display: 'flex', justifyContent: 'center' }}>
          <Pilot size={120} mode="speed" showScene={false} />
        </div>
        <div style={{ width: '100%', maxWidth: 280, height: 2, background: t.cardHi, borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #3BA9FF, transparent)', borderRadius: 999 }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.textPri, marginBottom: 8 }}>Checking your vehicle</div>
          <div style={{ fontSize: 14, color: t.textSec }}>MOT, tax, emissions — we're pulling everything in now.</div>
        </div>
        <UKPlate value={plate} size="md" />
      </div>
    );
  }

  // ─── SUCCESS ───────────────────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', padding: '48px 24px 40px', gap: 24 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Pilot size={120} mode="calm" trigger="plate_verified" showScene={false} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <UKPlate value={plate || 'DS18JRX'} size="lg" validated />
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${t.success}18`, borderRadius: 20, padding: '8px 14px' }}
          >
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="check" s={11} c="#fff" sw={2.5} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.success }}>Vehicle found — DS18 JRX</span>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
          style={{ background: t.card, borderRadius: 22, border: `1px solid ${t.border}`, padding: 20 }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 14 }}>VEHICLE DETAILS</div>
          {[
            { label: 'Make & model', value: 'Volkswagen Golf' },
            { label: 'Year', value: '2018' },
            { label: 'Fuel type', value: 'Petrol' },
            { label: 'Emission standard', value: 'Euro 6' },
            { label: 'ULEZ status', value: '✓ Compliant', color: t.success },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 14, color: t.textSec }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: row.color || t.textPri }}>{row.value}</span>
            </div>
          ))}
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
          <Btn t={t} v="primary" size="lg" onClick={() => navigate('/permission/location')}>
            <Icon n="check" s={18} c="#fff" />
            Confirm vehicle
          </Btn>
          <Btn t={t} v="tertiary" size="md" onClick={retry}>Not my vehicle</Btn>
        </div>
      </div>
    );
  }

  // ─── ERROR ─────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 24, background: `${t.danger}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n="close" s={36} c={t.danger} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, marginBottom: 8 }}>DVLA lookup failed</div>
          <div style={{ fontSize: 15, color: t.textSec, lineHeight: 1.6 }}>
            We couldn't find "{plate}" in the DVLA database. Check the registration and try again.
          </div>
        </div>
        <UKPlate value={plate} size="md" />
        <div style={{ background: `${t.warn}18`, borderRadius: 16, border: `1px solid ${t.warn}33`, padding: 16, width: '100%' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Icon n="alert" s={18} c={t.warn} />
            <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>
              Newly registered vehicles may not yet appear in DVLA records. Try again in 24 hours or enter details manually.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <Btn t={t} v="primary" onClick={retry}><Icon n="history" s={18} c="#fff" />Try again</Btn>
          <Btn t={t} v="tertiary" onClick={() => navigate('/permission/location')}>Enter details manually</Btn>
        </div>
      </div>
    );
  }

  // ─── INPUT (main redesigned state) ─────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100dvh', background: t.bg,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Warm ambient glow — anchored to car area */}
      <div style={{
        position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)',
        width: 340, height: 220, borderRadius: '50%',
        background: 'radial-gradient(ellipse, #FDC50016 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '56px 24px 0', position: 'relative', zIndex: 2,
      }}>
        <Logo s={26} theme={theme} />
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: t.textTer, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Skip
        </button>
      </div>

      {/* Top content: headline + plate */}
      <div style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', zIndex: 2 }}>

        {/* Headline */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: t.textPri, letterSpacing: '-0.03em', margin: '0 0 10px', lineHeight: 1.15 }}>
            Which one's yours?
          </h1>
          <p style={{ fontSize: 15, color: t.textSec, margin: 0, lineHeight: 1.6 }}>
            We'll check MOT, tax and ULEZ{'\n'}compliance automatically.
          </p>
        </div>

        {/* Plate input */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
          <UKPlate value={plate} onChange={setPlate} editable size="lg" validated={isValid && plate.length >= 5} showHint={isValid} />

          {/* Too-short hint */}
          {!isValid && plate.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${t.danger}15`, borderRadius: 12, padding: '9px 14px' }}>
              <Icon n="alert" s={15} c={t.danger} />
              <span style={{ fontSize: 13, color: t.danger, fontWeight: 600 }}>UK plates are 2–7 characters</span>
            </div>
          )}
        </div>
      </div>

      {/* Car reveal stage — always present, car animates in after validation */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <AnimatePresence>
          {isValid ? (
            <motion.div
              key="car"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%' }}
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Pilot size={100} mode="calm" showScene={false} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '0 32px' }}
            >
              <div style={{ opacity: 0.2, marginBottom: 12 }}>
                <Pilot size={64} mode="idle" showScene={false} />
              </div>
              <div style={{ fontSize: 14, color: t.textTer, lineHeight: 1.6 }}>
                Type your registration above{'\n'}and your car will appear here
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar: progress dots + CTA */}
      <div style={{ padding: '0 24px 44px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* Progress dots — this is step 4 (after 3 onboarding slides) */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{
                width: i === 2 ? 28 : 7,
                background: i === 2 ? '#3BA9FF' : (theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'),
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{ height: 7, borderRadius: 999 }}
            />
          ))}
        </div>

        <motion.div
          animate={{ scale: 1 }}
          initial={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          style={{ width: '100%' }}
        >
          <Btn t={t} v="accent" size="lg" onClick={handleLookup} disabled={!isValid} full>
            <Icon n="search" s={18} c={isValid ? '#0A0F1C' : '#64748B'} />
            Look up vehicle
          </Btn>
        </motion.div>

        <div style={{ fontSize: 12, color: t.textTer }}>
          Powered by DVLA · Data updated daily
        </div>
      </div>
    </div>
  );
}