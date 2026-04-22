import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge, BottomNav } from '../tp';

const TRIPS = [
  { id: 1, from: 'Stratford', to: 'City of London', miles: 8.2, type: 'business' as const, date: 'Today, 5:42pm' },
  { id: 2, from: 'Croydon', to: 'Heathrow T5', miles: 14.6, type: 'personal' as const, date: 'Yesterday' },
  { id: 3, from: 'Brixton', to: 'Shoreditch', miles: 6.1, type: 'business' as const, date: 'Mon 14 Apr' },
  { id: 4, from: 'Lewisham', to: 'Greenwich', miles: 3.4, type: 'personal' as const, date: 'Sun 13 Apr' },
  { id: 5, from: 'Ealing', to: 'Hammersmith', miles: 4.8, type: 'business' as const, date: 'Sat 12 Apr' },
];

const totalBusiness = TRIPS.filter(t => t.type === 'business').reduce((s, t) => s + t.miles, 0);
const totalPersonal = TRIPS.filter(t => t.type === 'personal').reduce((s, t) => s + t.miles, 0);
const totalAll = totalBusiness + totalPersonal;
const hmrcRate = 0.45;
const claimable = totalBusiness * hmrcRate;

export function MileageScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [filter, setFilter] = useState<'all' | 'business' | 'personal'>('all');

  const filtered = filter === 'all' ? TRIPS : TRIPS.filter(x => x.type === filter);

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 80 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Mileage log"
        right={
          <button onClick={() => {}} style={{
            width: 40, height: 40, borderRadius: 12, background: t.cardHi,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon n="download" s={18} c={t.primary} />
          </button>
        }
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Card t={t} style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>THIS MONTH</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: t.textPri, letterSpacing: '-0.03em' }}>{totalAll.toFixed(1)}</div>
            <div style={{ fontSize: 12, color: t.textSec }}>miles logged</div>
          </Card>
          <Card t={t} glow={t.success} style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.success, letterSpacing: '0.06em', marginBottom: 6 }}>CLAIMABLE (HMRC)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: t.success, letterSpacing: '-0.03em' }}>£{claimable.toFixed(2)}</div>
            <div style={{ fontSize: 12, color: t.textSec }}>{totalBusiness.toFixed(1)} business miles × 45p</div>
          </Card>
        </div>

        {/* Split bar */}
        <div style={{ background: t.card, borderRadius: 14, padding: 14, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.primary }}>Business {totalBusiness.toFixed(1)} mi</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.textTer }}>Personal {totalPersonal.toFixed(1)} mi</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: t.cardHi, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(totalBusiness / totalAll) * 100}%`, background: t.primary, borderRadius: 3 }} />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'business', 'personal'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? t.primary : t.cardHi,
              color: filter === f ? '#fff' : t.textSec,
              border: 'none', borderRadius: 20, padding: '6px 14px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>

        {/* Trip list */}
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {filtered.map((trip, i) => (
            <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
              borderBottom: i < filtered.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer',
            }}>
              <IconBadge icon="nav" color={trip.type === 'business' ? t.primary : t.textTer} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{trip.from} → {trip.to}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{trip.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{trip.miles} mi</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  color: trip.type === 'business' ? t.primary : t.textTer,
                  textTransform: 'uppercase',
                }}>{trip.type}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Export CTA */}
        <Btn t={t} v="secondary" full onClick={() => {}}>
          <Icon n="download" s={16} c={t.textPri} />
          Export mileage report
        </Btn>
        <div style={{ fontSize: 12, color: t.textTer, textAlign: 'center' }}>HMRC-ready CSV for expenses and tax returns</div>
      </div>

      <BottomNav active="trips" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}
