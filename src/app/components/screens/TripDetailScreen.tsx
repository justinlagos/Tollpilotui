import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTheme, AppHeader, Btn, Icon, Card, MiniMap, SectionLabel } from '../tp';
import { Pilot } from '../Pilot';

export function TripDetailScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const { id } = useParams();
  const [tripType, setTripType] = useState<'business' | 'personal'>('business');

  const trip = {
    id: Number(id),
    from: 'Stratford · E15 1LY',
    to: 'City of London · EC3V 3QQ',
    date: 'Today, 5:42pm',
    dist: '8.2 mi',
    dur: '32 min',
    saved: 12.50,
    avoided: ['ULEZ'],
    cost: 0,
    avgSpeed: '15 mph',
    co2Saved: '1.2 kg',
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/trips')} title="Trip detail"
        right={
          <button style={{
            width: 40, height: 40, borderRadius: 12, background: t.cardHi,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon n="share" s={18} c={t.textSec} />
          </button>
        }
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Map */}
        <MiniMap t={t} theme={theme} size="md" showULEZ={false} />

        {/* Pilot hero — celebrates if money was saved */}
        {trip.saved > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Pilot size={96} mode="calm" trigger="trip_end_saved" showScene={false} />
            <div style={{ fontSize: 13, fontWeight: 700, color: t.success, letterSpacing: '0.04em' }}>
              YOU SAVED £{trip.saved.toFixed(2)}
            </div>
          </div>
        )}

        {/* Route */}
        <Card t={t}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.primary }} />
              <div style={{ flex: 1, width: 2, height: 28, background: t.border }} />
              <div style={{ width: 10, height: 10, borderRadius: 2, background: t.danger }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri, marginBottom: 8 }}>{trip.from}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>{trip.to}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: t.textSec }}>{trip.date}</div>
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Saved', value: `£${trip.saved.toFixed(2)}`, color: t.success, icon: 'trending' },
            { label: 'Cost', value: trip.cost === 0 ? 'Free' : `£${trip.cost.toFixed(2)}`, color: trip.cost === 0 ? t.success : t.danger, icon: 'creditCard' },
            { label: 'Distance', value: trip.dist, color: t.primary, icon: 'route' },
            { label: 'Duration', value: trip.dur, color: t.primary, icon: 'clock' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
              padding: 16, display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: `${stat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n={stat.icon} s={18} c={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em' }}>{stat.label.toUpperCase()}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mileage classification */}
        <SectionLabel t={t}>Mileage classification</SectionLabel>
        <Card t={t} style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{trip.dist} logged</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>
                {tripType === 'business' ? `Claimable: £${(8.2 * 0.45).toFixed(2)} at 45p/mi` : 'Personal — not claimable'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['business', 'personal'] as const).map(ty => (
                <button key={ty} onClick={() => setTripType(ty)} style={{
                  padding: '6px 12px', borderRadius: 10,
                  background: tripType === ty ? t.primary : t.cardHi,
                  color: tripType === ty ? '#fff' : t.textSec,
                  border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', textTransform: 'capitalize',
                }}>{ty}</button>
              ))}
            </div>
          </div>
        </Card>

        {/* Zones avoided */}
        <SectionLabel t={t}>Zones avoided</SectionLabel>
        {trip.avoided.map(zone => (
          <div key={zone} style={{
            background: `${t.success}18`, border: `1px solid ${t.success}33`,
            borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="shield" s={20} c={t.success} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>London {zone}</div>
              <div style={{ fontSize: 13, color: t.success }}>£12.50 charge avoided</div>
            </div>
            <Icon n="check" s={18} c={t.success} sw={2.5} />
          </div>
        ))}

        {/* Extra stats */}
        <Card t={t}>
          <SectionLabel t={t}>Trip stats</SectionLabel>
          {[
            { label: 'Average speed', value: trip.avgSpeed },
            { label: 'CO₂ saved', value: trip.co2Saved },
          ].map((s, i) => (
            <div key={s.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: i < 1 ? `1px solid ${t.border}` : 'none'
            }}>
              <span style={{ fontSize: 14, color: t.textSec }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{s.value}</span>
            </div>
          ))}
        </Card>

        <Btn t={t} v="secondary" onClick={() => navigate('/trips')}>
          <Icon n="history" s={16} c={t.textPri} />
          All trips
        </Btn>
      </div>
    </div>
  );
}
