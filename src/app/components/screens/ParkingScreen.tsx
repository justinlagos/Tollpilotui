import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge, MiniMap } from '../tp';

const SPOTS = [
  { id: 1, name: 'NCP Finsbury Square', dist: '0.2 mi', price: '£6.50/hr', total: '£19.50', hrs: 3, type: 'multi-storey' as const, spaces: 42 },
  { id: 2, name: 'On-street meter · Worship St', dist: '0.1 mi', price: '£4.90/hr', total: '£14.70', hrs: 3, type: 'on-street' as const, spaces: 3 },
  { id: 3, name: 'Q-Park Aldersgate', dist: '0.4 mi', price: '£8.00/hr', total: '£24.00', hrs: 3, type: 'multi-storey' as const, spaces: 118 },
  { id: 4, name: 'Resident bay · Leonard St', dist: '0.3 mi', price: 'Free', total: 'Free', hrs: 3, type: 'residents' as const, spaces: 0 },
];

const typeMeta = {
  'multi-storey': { icon: 'lock', color: '#3BA9FF' },
  'on-street': { icon: 'mapPin', color: '#22C55E' },
  'residents': { icon: 'alert', color: '#64748B' },
} as const;

export function ParkingScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [duration, setDuration] = useState(3);

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Parking" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Map */}
        <MiniMap t={t} theme={theme} size="md" showULEZ={false} />

        {/* Duration selector */}
        <Card t={t} style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>How long?</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: t.primary }}>{duration} hrs</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 8].map(h => (
              <button key={h} onClick={() => setDuration(h)} style={{
                flex: 1, padding: '8px 0', borderRadius: 10,
                background: duration === h ? t.primary : t.cardHi,
                color: duration === h ? '#fff' : t.textSec,
                border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{h}h</button>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Cheapest', value: '£4.90/hr', color: t.success },
            { label: 'Nearby', value: `${SPOTS.length} spots`, color: t.primary },
            { label: 'Available', value: `${SPOTS.reduce((s, x) => s + x.spaces, 0)}`, color: t.accent },
          ].map(s => (
            <div key={s.label} style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: '12px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 3 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Spot list */}
        <SectionLabel t={t}>Nearby parking</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPOTS.map((spot, i) => {
            const meta = typeMeta[spot.type];
            const isCheapest = i === 1;
            return (
              <Card t={t} key={spot.id} glow={isCheapest ? t.success : undefined} style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <IconBadge icon={meta.icon} color={meta.color} size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{spot.name}</div>
                        <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{spot.dist} away · {spot.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: spot.total === 'Free' ? t.success : t.textPri }}>{spot.total}</div>
                        <div style={{ fontSize: 11, color: t.textTer }}>{spot.price}</div>
                      </div>
                    </div>
                    {spot.spaces > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: spot.spaces > 20 ? t.success : spot.spaces > 5 ? t.warn : t.danger }} />
                        <span style={{ fontSize: 11, color: t.textSec }}>{spot.spaces} spaces available</span>
                      </div>
                    )}
                    {spot.type === 'residents' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
                        <Icon n="alert" s={12} c={t.textTer} />
                        <span style={{ fontSize: 11, color: t.textTer }}>Permit holders only · risk of PCN</span>
                      </div>
                    )}
                    {isCheapest && (
                      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, background: `${t.success}18`, borderRadius: 8, padding: '4px 10px' }}>
                        <Icon n="check" s={12} c={t.success} sw={2.5} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.success }}>Best value</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Btn t={t} v="accent" size="lg" full onClick={() => navigate('/drive')}>
          <Icon n="nav" s={18} c="#0A0F1C" />
          Navigate to cheapest
        </Btn>
      </div>
    </div>
  );
}
