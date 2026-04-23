import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AlertSheet, Icon, MiniMap } from '../tp';
import { Pilot, PilotMode, PilotTrigger } from '../Pilot';
import { PilotFX } from '../PilotFX';
import { getBaseState, emotionForEvent, Emotion } from '../../lib/emotionStateMachine';

type DriveState = 'normal' | 'approaching' | 'imminent' | 'entered' | 'rerouted' | 'no_charge';

// Map drive state → Pilot mode (legacy fallback)
const pilotModeFor = (ds: DriveState): PilotMode => {
  switch (ds) {
    case 'approaching':
    case 'imminent':
    case 'entered':
      return 'alert';
    case 'rerouted':
    case 'no_charge':
      return 'calm';
    case 'normal':
    default:
      return 'speed';
  }
};

// Map drive state → canonical emotion
const emotionFor = (ds: DriveState): Emotion => {
  switch (ds) {
    case 'approaching': return emotionForEvent('approaching_zone') ?? 'concerned';
    case 'imminent': return 'alert';
    case 'entered': return 'shocked';
    case 'rerouted': return emotionForEvent('reroute_success') ?? 'proud';
    case 'no_charge': return 'relieved';
    case 'normal':
    default: return getBaseState('drive', {});
  }
};

export function DriveScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [driveState, setDriveState] = useState<DriveState>('approaching');
  const [speed] = useState(47);
  const [pilotTrigger, setPilotTrigger] = useState<PilotTrigger | null>(null);
  const prevDriveStateRef = useRef<DriveState>(driveState);

  // Fire reroute_success celebration when user reroutes
  useEffect(() => {
    if (driveState === 'rerouted' && prevDriveStateRef.current !== 'rerouted') {
      setPilotTrigger('reroute_success');
    }
    prevDriveStateRef.current = driveState;
  }, [driveState]);

  const stateLabels: Record<DriveState, string> = {
    normal: 'On route', approaching: 'Zone approaching',
    imminent: 'Zone imminent', entered: 'Zone entered',
    rerouted: 'Rerouted ✓', no_charge: 'Charge-free route',
  };

  return (
    <div style={{ height: '100dvh', background: t.mapBg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Map background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          <rect width="430" height="900" fill={t.mapBg} />
          <defs>
            <pattern id="dvGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke={t.mapGrid} strokeWidth="0.5" />
            </pattern>
            <linearGradient id="dvRoute" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#3BA9FF" /><stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <filter id="dvGlow"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <radialGradient id="dvDanger"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" /><stop offset="100%" stopColor="#EF4444" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="430" height="900" fill="url(#dvGrid)" />
          {/* Roads */}
          <g stroke={t.mapRoad} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.5">
            <path d="M 50 900 Q 80 700 150 600 Q 220 500 215 400 Q 210 300 260 200 Q 300 100 350 0" />
            <path d="M 0 500 Q 100 490 200 500 T 430 520" />
            <path d="M 0 300 Q 200 310 430 295" />
          </g>
          {/* Route line */}
          <path d="M 215 800 Q 215 700 215 600 Q 215 500 215 400 Q 215 300 260 200" stroke="url(#dvRoute)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#dvGlow)" />
          {/* ULEZ zone */}
          {(driveState === 'approaching' || driveState === 'imminent') && (
            <>
              <circle cx="260" cy="200" r="80" fill="url(#dvDanger)" />
              <circle cx="260" cy="200" r="18" fill="#EF4444" opacity="0.7">
                <animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="260" cy="200" r="10" fill="#EF4444" />
            </>
          )}
          {/* Current position */}
          <circle cx="215" cy="440" r="18" fill="#3BA9FF" opacity="0.25">
            <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="215" cy="440" r="10" fill="#FFFFFF" stroke="#3BA9FF" strokeWidth="3" />
        </svg>
      </div>

      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 10, padding: '56px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          width: 44, height: 44, borderRadius: 14, background: `${t.card}E0`, backdropFilter: 'blur(8px)',
          border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <Icon n="close" s={20} c={t.textPri} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${t.card}E0`, backdropFilter: 'blur(8px)', borderRadius: 20, padding: '8px 14px', border: `1px solid ${t.border}` }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.success, animation: 'pulse 1.5s ease infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: t.success }}>LIVE</span>
        </div>

        <button onClick={() => navigate('/compare')} style={{
          width: 44, height: 44, borderRadius: 14, background: `${t.card}E0`, backdropFilter: 'blur(8px)',
          border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <Icon n="route" s={20} c={t.primary} />
        </button>
      </div>

      {/* Pilot + Speedometer row */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 32 }}>
        {/* Pilot — no box, floats freely */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <PilotFX
            emotion={emotionFor(driveState)}
            size={64}
            driving={driveState === 'normal' || driveState === 'rerouted' || driveState === 'no_charge'}
          />
          <Pilot
            size={64}
            emotion={emotionFor(driveState)}
            trigger={pilotTrigger}
            onTriggerComplete={() => setPilotTrigger(null)}
            showScene={false}
          />
        </div>

        {/* Speedometer */}
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: `${t.card}CC`, backdropFilter: 'blur(10px)',
          border: `2px solid ${t.borderLi}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${t.primary}22`
        }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: t.textPri, lineHeight: 1, letterSpacing: '-0.04em' }}>{speed}</div>
          <div style={{ fontSize: 13, color: t.textSec, fontWeight: 600, letterSpacing: '0.06em' }}>MPH</div>
        </div>
      </div>

      {/* Alert sheet area */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 16, gap: 10 }}>
        {/* State switcher for demo */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
          {(['approaching', 'imminent', 'entered', 'rerouted', 'no_charge'] as DriveState[]).map(s => (
            <button key={s} onClick={() => setDriveState(s)} style={{
              background: driveState === s ? t.primary : t.cardHi, color: driveState === s ? '#fff' : t.textSec,
              border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 10, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)'
            }}>{s === 'no_charge' ? 'no charge' : s}</button>
          ))}
        </div>

        {/* Alert states */}
        {driveState === 'approaching' && (
          <AlertSheet severity="approaching" zone="ULEZ" charge="£12.50" t={t}
            onReroute={() => setDriveState('rerouted')}
            onAccept={() => setDriveState('normal')} />
        )}
        {driveState === 'imminent' && (
          <AlertSheet severity="imminent" zone="Toll crossing" charge="£2.80" t={t}
            onReroute={() => setDriveState('rerouted')}
            onAccept={() => setDriveState('normal')} />
        )}
        {driveState === 'entered' && (
          <AlertSheet severity="entered" zone="Heathrow drop-off" charge="£7.00" t={t}
            onPay={() => navigate('/payment')}
            onDismiss={() => setDriveState('normal')} />
        )}
        {driveState === 'rerouted' && (
          <div style={{
            background: t.card, borderRadius: 24, border: `1px solid ${t.success}44`,
            boxShadow: `0 0 0 1px ${t.success}22, 0 16px 32px rgba(0,0,0,0.3)`, padding: 18
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n="check" s={24} c={t.success} sw={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.success, letterSpacing: '0.1em', marginBottom: 2 }}>REROUTED SUCCESSFULLY</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri }}>Smart move</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.success, marginBottom: 4 }}>You just avoided £12.50</div>
            <div style={{ fontSize: 13, color: t.textSec }}>New route avoids ULEZ. Adds 4 min.</div>
          </div>
        )}
        {driveState === 'no_charge' && (
          <div style={{
            background: t.card, borderRadius: 24, border: `1px solid ${t.success}44`,
            padding: 18, display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="zap" s={22} c={t.success} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.success, letterSpacing: '0.1em', marginBottom: 2 }}>NO CHARGES</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.textPri }}>Charge-free route ahead</div>
              <div style={{ fontSize: 13, color: t.textSec }}>Saving £30.50 vs. fastest route</div>
            </div>
            <div style={{ background: `${t.success}22`, borderRadius: 12, padding: '6px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.success }}>£0</span>
            </div>
          </div>
        )}
        {driveState === 'normal' && (
          <div style={{ background: `${t.card}E0`, backdropFilter: 'blur(10px)', borderRadius: 24, border: `1px solid ${t.border}`, padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, textAlign: 'center' }}>
              {[{ v: '12 min', l: 'ETA' }, { v: '3.4 mi', l: 'DISTANCE' }, { v: '£0', l: 'COST' }].map(m => (
                <div key={m.l}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>{m.v}</div>
                  <div style={{ fontSize: 10, color: t.textTer, fontWeight: 600, letterSpacing: '0.08em', marginTop: 2 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}