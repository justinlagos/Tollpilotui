import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Card, Icon, SectionLabel } from '../tp';

const SCORE = 742;
const PREV = 718;
const BAND = 'Optimised';
const COMPONENTS = [
  { name: 'Charge Avoidance', score: 88, prev: 82, weight: 25, color: '#22C55E' },
  { name: 'Route Efficiency', score: 76, prev: 74, weight: 20, color: '#3BA9FF' },
  { name: 'Driving Smoothness', score: 71, prev: 75, weight: 15, color: '#8B5CF6' },
  { name: 'Cost Efficiency', score: 80, prev: 78, weight: 20, color: '#FDC500' },
  { name: 'Vehicle Compliance', score: 95, prev: 95, weight: 20, color: '#22D3EE' },
];
const WEEKS = [
  { w: 'W1', s: 680 }, { w: 'W2', s: 705 }, { w: 'W3', s: 695 },
  { w: 'W4', s: 718 }, { w: 'W5', s: 742 },
];
const weekMax = Math.max(...WEEKS.map(w => w.s));

export function TollScoreScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const diff = SCORE - PREV;
  const diffSign = diff >= 0 ? '+' : '';

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="TollScore" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero score ring */}
        <Card t={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px' }}>
          <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 16 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke={t.cardHi} strokeWidth="10" />
              <circle cx="70" cy="70" r="60" fill="none" stroke={t.primary} strokeWidth="10"
                strokeDasharray={`${(SCORE / 1000) * 377} 377`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: t.textPri, letterSpacing: '-0.04em', lineHeight: 1 }}>{SCORE}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginTop: 2 }}>/ 1000</div>
            </div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: t.primary, marginBottom: 4 }}>{BAND}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon n="trending" s={14} c={diff >= 0 ? t.success : t.danger} />
            <span style={{ fontSize: 13, fontWeight: 700, color: diff >= 0 ? t.success : t.danger }}>{diffSign}{diff} from last week</span>
          </div>
          <div style={{ fontSize: 12, color: t.textTer, marginTop: 6 }}>Updated weekly · Next update in 3 days</div>
        </Card>

        {/* Components */}
        <SectionLabel t={t}>Score breakdown</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COMPONENTS.map(c => {
            const d = c.score - c.prev;
            return (
              <Card t={t} key={c.name} style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: t.textTer }}>{c.weight}% weight</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: c.color }}>{c.score}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: d >= 0 ? t.success : t.danger }}>
                      {d >= 0 ? '↑' : '↓'}{Math.abs(d)}
                    </div>
                  </div>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: t.cardHi, overflow: 'hidden' }}>
                  <div style={{ width: `${c.score}%`, height: '100%', borderRadius: 3, background: c.color }} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Weekly trend */}
        <SectionLabel t={t}>Weekly trend</SectionLabel>
        <Card t={t} style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64 }}>
            {WEEKS.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.textPri }}>{w.s}</div>
                <div style={{
                  width: '100%', borderRadius: 4, minHeight: 4,
                  height: `${(w.s / weekMax) * 100}%`,
                  background: i === WEEKS.length - 1 ? t.primary : `${t.primary}55`,
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {WEEKS.map(w => (
              <span key={w.w} style={{ fontSize: 10, color: t.textTer, flex: 1, textAlign: 'center' }}>{w.w}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
