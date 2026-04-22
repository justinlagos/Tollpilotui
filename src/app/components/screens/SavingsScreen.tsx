import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Icon, Card, SectionLabel, BottomNav } from '../tp';

const MONTHS = [
  { m: 'Nov', a: 38 }, { m: 'Dec', a: 52 }, { m: 'Jan', a: 67 },
  { m: 'Feb', a: 45 }, { m: 'Mar', a: 89 }, { m: 'Apr', a: 23 }
];
const MAX = Math.max(...MONTHS.map(m => m.a));
const totalSaved = MONTHS.reduce((s, m) => s + m.a, 0);

const BREAKDOWN = [
  { zone: 'London ULEZ', count: 18, saved: 225.00, color: '#EF4444' },
  { zone: 'Congestion Charge', count: 3, saved: 54.00, color: '#F59E0B' },
  { zone: 'Birmingham CAZ', count: 2, saved: 16.00, color: '#F97316' },
  { zone: 'Airport tolls', count: 2, saved: 19.00, color: '#3BA9FF' },
];

const GOAL = 500;
const progress = Math.min(totalSaved / GOAL, 1);

export function SavingsScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const goalMet = totalSaved >= GOAL;

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 88 }}>
      <AppHeader t={t} title="Savings"
        right={
          <button onClick={() => navigate('/referral')} style={{
            display: 'flex', alignItems: 'center', gap: 6, height: 36, borderRadius: 20,
            background: `${t.accent}22`, border: `1px solid ${t.accent}44`,
            padding: '0 12px', cursor: 'pointer'
          }}>
            <Icon n="gift" s={15} c={t.accent} />
            <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>Refer</span>
          </button>
        }
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Hero */}
        <Card t={t} glow={t.success} style={{ background: `linear-gradient(135deg, ${t.card} 0%, ${t.success}10 100%)` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.success, letterSpacing: '0.1em' }}>YOU'VE KEPT THIS YEAR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${t.success}22`, borderRadius: 20, padding: '4px 10px' }}>
              <Icon n="trending" s={12} c={t.success} />
              <span style={{ fontSize: 11, fontWeight: 700, color: t.success }}>+18% vs last year</span>
            </div>
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: t.textPri, letterSpacing: '-0.05em', lineHeight: 1, margin: '8px 0' }}>
            £{totalSaved}
          </div>
          <div style={{ fontSize: 14, color: t.textSec, marginBottom: 20 }}>Not by driving less. By driving smarter.</div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 64, marginBottom: 6 }}>
            {MONTHS.map((m, i) => (
              <div key={i} onClick={() => setSelectedMonth(i === selectedMonth ? null : i)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: '100%', justifyContent: 'flex-end', cursor: 'pointer'
              }}>
                <div style={{
                  width: '100%', borderRadius: 5,
                  height: `${(m.a / MAX) * 100}%`,
                  background: i === selectedMonth ? t.success : (i === MONTHS.length - 1 ? `${t.success}55` : t.success),
                  minHeight: 4, transition: 'background 0.2s ease'
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {MONTHS.map((m, i) => (
              <span key={i} style={{ fontSize: 10, color: i === selectedMonth ? t.success : t.textTer, flex: 1, textAlign: 'center', fontWeight: i === selectedMonth ? 700 : 400 }}>
                {m.m}
              </span>
            ))}
          </div>
          {selectedMonth !== null && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: `${t.success}22`, borderRadius: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.success }}>
                {MONTHS[selectedMonth].m}: £{MONTHS[selectedMonth].a} saved
              </span>
            </div>
          )}
        </Card>

        {/* Goal progress */}
        <Card t={t} glow={goalMet ? t.accent : undefined}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.textPri, marginBottom: 2 }}>
                {goalMet ? '🎉 Savings goal achieved!' : 'Annual savings goal'}
              </div>
              <div style={{ fontSize: 12, color: t.textSec }}>
                {goalMet ? `You've hit your £${GOAL} goal!` : `£${GOAL - totalSaved} more to reach £${GOAL}`}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: goalMet ? t.accent : t.textPri }}>
              {Math.round(progress * 100)}%
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 10, background: t.cardHi, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress * 100}%`,
              background: goalMet ? `linear-gradient(90deg, ${t.success}, ${t.accent})` : t.success,
              borderRadius: 999, transition: 'width 0.5s ease'
            }} />
          </div>
          {!goalMet && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: t.textTer }}>£0</span>
              <span style={{ fontSize: 11, color: t.textTer }}>Goal: £{GOAL}</span>
            </div>
          )}
        </Card>

        {/* Breakdown by zone */}
        <SectionLabel t={t}>Breakdown by zone</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {BREAKDOWN.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < BREAKDOWN.length - 1 ? `1px solid ${t.border}` : 'none'
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{b.zone}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{b.count} trips avoided</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: t.success }}>+£{b.saved.toFixed(0)}</div>
            </div>
          ))}
        </Card>

        {/* Projected annual savings */}
        <Card t={t} style={{ background: `${t.primary}12`, border: `1px solid ${t.primary}22` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="trending" s={22} c={t.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: t.textSec, marginBottom: 2 }}>Projected annual savings</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.primary, letterSpacing: '-0.02em' }}>£628</div>
            </div>
            <button onClick={() => navigate('/pro')} style={{
              background: t.primary, color: '#fff', border: 'none', borderRadius: 12,
              padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
            }}>Go Pro →</button>
          </div>
        </Card>
      </div>

      <BottomNav active="trips" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}