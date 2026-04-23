import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import { useTheme, Icon, Card, UKPlate, IconBadge, SectionLabel, BottomNav, Logo, OfflineBanner } from '../tp';
import { Pilot } from '../Pilot';
import { TodayCard } from '../TodayCard';
import { getTodayConfidence, parseConfidenceOverride } from '../../lib/todayConfidence';
import { PilotFX } from '../PilotFX';
import { getBaseState } from '../../lib/emotionStateMachine';

const MONTHS = [
  { m: 'Nov', a: 38 }, { m: 'Dec', a: 52 }, { m: 'Jan', a: 67 },
  { m: 'Feb', a: 45 }, { m: 'Mar', a: 89 }, { m: 'Apr', a: 23 }
];
const MAX = Math.max(...MONTHS.map(m => m.a));
const totalSaved = MONTHS.reduce((s, m) => s + m.a, 0);

export function DashboardScreen() {
  const location = useLocation();
  const todayOverride = parseConfidenceOverride(location.search);
  const todayConfidence = getTodayConfidence(todayOverride);
  const navigate = useNavigate();
  const { t, theme, toggleTheme } = useTheme();
  const [motState] = useState<'valid' | 'due' | 'expired'>('due');
  const [offline] = useState(false);

  const motColor = motState === 'expired' ? t.danger : motState === 'due' ? t.warn : t.success;
  const motLabel = motState === 'expired' ? 'MOT EXPIRED' : motState === 'due' ? 'MOT DUE SOON' : 'MOT VALID';
  const motValue = motState === 'expired' ? 'Expired 3 days ago' : motState === 'due' ? '14 days remaining' : 'Valid until Apr 2026';

  // emotion from state machine: concerned if MOT issue, otherwise confident
  const dashboardEmotion = getBaseState('dashboard', {
    motUrgency: motState === 'expired' ? 'expired' : motState === 'due' ? 'due' : 'none',
  });

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 80 }}>
      <OfflineBanner visible={offline} />

      {/* Header — wordmark top-left ONLY (no car icon), greeting + actions top-right */}
      <div style={{ padding: '56px 20px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Logo s={22} theme={theme} />
          <div>
            <div style={{ fontSize: 13, color: t.textTer, marginBottom: 2 }}>Good evening</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: t.textPri, letterSpacing: '-0.03em', lineHeight: 1 }}>Justin</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={toggleTheme} aria-label="Toggle theme" style={{
            width: 42, height: 42, borderRadius: 14, background: t.cardHi,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon n={theme === 'dark' ? 'sun' : 'moon'} s={20} c={t.textSec} />
          </button>
          <button onClick={() => navigate('/notifications')} aria-label="Notifications" style={{
            width: 42, height: 42, borderRadius: 14, background: t.cardHi,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <Icon n="bell" s={20} c={t.textSec} />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: t.danger, border: `2px solid ${t.bg}` }} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* MOT Warning — kept */}
        {motState !== 'valid' && (
          <div onClick={() => navigate('/book-mot')} style={{
            background: `${motColor}18`, border: `1px solid ${motColor}44`, borderRadius: 18,
            padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: `0 4px 20px ${motColor}18`
          }}>
            <IconBadge icon="alert" color={motColor} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: motColor, letterSpacing: '0.08em', marginBottom: 2 }}>{motLabel}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri, marginBottom: 2 }}>{motValue}</div>
              <div style={{ fontSize: 13, color: t.textSec }}>MOT due soon — fix it before it costs you</div>
            </div>
            <Icon n="right" s={18} c={t.textTer} />
          </div>
        )}

        {/* Vehicle card — emotion reflects MOT status */}
        <Card t={t} onClick={() => navigate('/vehicle')} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em' }}>YOUR VEHICLE</div>
            <Icon n="right" s={18} c={t.textTer} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              <PilotFX emotion={dashboardEmotion} size={72} />
              <Pilot size={72} emotion={dashboardEmotion} showScene={false} />
            </div>
            <UKPlate value="DS18JRX" size="sm" />
          </div>
          <div style={{ fontSize: 14, color: t.textSec, textAlign: 'center' }}>VW Golf · 2018 · Petrol · Euro 6</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'MOT', value: '14d', color: motColor },
              { label: 'TAX', value: 'Valid', color: t.success },
              { label: 'ULEZ', value: 'Exempt', color: t.success },
            ].map(m => (
              <div key={m.label} style={{ background: t.cardHi, borderRadius: 12, padding: '10px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today card — four confidence states driven by lib/todayConfidence */}
        <TodayCard confidence={todayConfidence} />

        {/* PRIMARY ACTIONS — Start Drive + Plan Route */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button onClick={() => navigate('/drive')} style={{
            background: t.primary, borderRadius: 20, padding: '22px 16px', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
            boxShadow: `0 10px 28px ${t.primary}44`, textAlign: 'left',
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="nav" s={22} c="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>Start Drive</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Live alerts on</div>
            </div>
          </button>
          <button onClick={() => navigate('/route')} style={{
            background: t.accent, borderRadius: 20, padding: '22px 16px', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
            boxShadow: `0 10px 28px ${t.accent}55`, textAlign: 'left',
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(10,15,28,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="route" s={22} c="#0A0F1C" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0A0F1C', letterSpacing: '-0.01em' }}>Plan Route</div>
              <div style={{ fontSize: 12, color: 'rgba(10,15,28,0.65)' }}>Compare cost + time</div>
            </div>
          </button>
        </div>

        {/* SECONDARY ACTIONS — Parking · History · Wallet */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: 'mapPin', label: 'Parking', color: t.success, path: '/parking' },
            { icon: 'history', label: 'History', color: t.textSec, path: '/trips' },
            { icon: 'creditCard', label: 'Wallet', color: t.primary, path: '/wallet' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.path)} style={{
              background: t.card, borderRadius: 18, padding: '16px 0', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 8, border: `1px solid ${t.border}`,
              cursor: 'pointer',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n={a.icon} s={20} c={a.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: t.textPri }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* TollScore */}
        <Card t={t} onClick={() => navigate('/tollscore')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke={t.cardHi} strokeWidth="5" />
                <circle cx="26" cy="26" r="22" fill="none" stroke={t.primary} strokeWidth="5"
                  strokeDasharray={`${(742 / 1000) * 138} 138`}
                  strokeLinecap="round"
                  transform="rotate(-90 26 26)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: t.textPri }}>742</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, letterSpacing: '0.08em' }}>TOLLSCORE</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: t.textPri }}>Optimised</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Icon n="trending" s={12} c={t.success} />
                <span style={{ fontSize: 12, fontWeight: 600, color: t.success }}>+24 this week</span>
              </div>
            </div>
            <Icon n="right" s={18} c={t.textTer} />
          </div>
        </Card>

        {/* Feature row: PCN Defence + Mileage + Widget */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Card t={t} onClick={() => navigate('/pcn')} style={{ cursor: 'pointer', padding: 14 }}>
            <IconBadge icon="shield" color={t.primary} size={36} />
            <div style={{ fontSize: 13, fontWeight: 700, color: t.textPri, marginTop: 10 }}>PCN Defence</div>
            <div style={{ fontSize: 11, color: t.textSec, marginTop: 2 }}>3 cases · £40 saved</div>
          </Card>
          <Card t={t} onClick={() => navigate('/widget')} style={{ cursor: 'pointer', padding: 14 }}>
            <IconBadge icon="lock" color={t.accent} size={36} />
            <div style={{ fontSize: 13, fontWeight: 700, color: t.textPri, marginTop: 10 }}>Lock screen widget</div>
            <div style={{ fontSize: 11, color: t.textSec, marginTop: 2 }}>Today's cost + alt</div>
          </Card>
        </div>

        {/* Savings card */}
        <Card t={t} onClick={() => navigate('/savings')} glow={t.success} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.success, letterSpacing: '0.08em' }}>TOTAL SAVED THIS YEAR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${t.success}22`, borderRadius: 20, padding: '4px 10px' }}>
              <Icon n="trending" s={12} c={t.success} />
              <span style={{ fontSize: 12, fontWeight: 700, color: t.success }}>+18%</span>
            </div>
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: t.textPri, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>
            £{totalSaved}
          </div>
          <div style={{ fontSize: 14, color: t.textSec, marginBottom: 16 }}>That's money you didn't have to spend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
            {MONTHS.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%', borderRadius: 4,
                  height: `${(m.a / MAX) * 100}%`,
                  background: i === MONTHS.length - 1 ? `${t.success}55` : t.success,
                  minHeight: 4
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {MONTHS.map(m => (
              <span key={m.m} style={{ fontSize: 10, color: t.textTer, flex: 1, textAlign: 'center' }}>{m.m}</span>
            ))}
          </div>
        </Card>

        {/* Recent trips */}
        <SectionLabel t={t} action="See all" onAction={() => navigate('/trips')}>Recent trips</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {[
            { from: 'Stratford', to: 'City of London', saved: '£12.50', time: 'Today 5:42pm' },
            { from: 'Croydon', to: 'Heathrow T5', saved: '£7.00', time: 'Yesterday' },
          ].map((trip, i) => (
            <div key={i} onClick={() => navigate('/trips/1')} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer'
            }}>
              <IconBadge icon="nav" color={t.primary} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{trip.from} → {trip.to}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{trip.time}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.success }}>+{trip.saved}</div>
            </div>
          ))}
        </Card>
      </div>

      <BottomNav active="home" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}
