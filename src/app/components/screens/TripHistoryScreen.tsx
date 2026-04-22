import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, EmptyState, Icon, SectionLabel, BottomNav } from '../tp';

const ALL_TRIPS = [
  { id: 1, from: 'Stratford', to: 'City of London', date: 'Today', time: '5:42pm', saved: 12.50, dist: '8.2 mi', dur: '32 min', avoided: ['ULEZ'], cost: 0 },
  { id: 2, from: 'Croydon', to: 'Heathrow T5', date: 'Today', time: '6:15am', saved: 7.00, dist: '22.1 mi', dur: '48 min', avoided: ['Airport'], cost: 4.50 },
  { id: 3, from: 'Watford', to: 'Canary Wharf', date: 'Yesterday', time: '8:30am', saved: 30.50, dist: '24.6 mi', dur: '55 min', avoided: ['ULEZ', 'CC'], cost: 0 },
  { id: 4, from: 'Shoreditch', to: 'Heathrow T4', date: 'Yesterday', time: '2:10pm', saved: 12.50, dist: '18.4 mi', dur: '42 min', avoided: ['ULEZ'], cost: 0 },
  { id: 5, from: 'Birmingham City', to: 'Solihull', date: '3 Apr', time: '9:00am', saved: 8.00, dist: '12.1 mi', dur: '28 min', avoided: ['CAZ'], cost: 0 },
  { id: 6, from: 'Bristol Temple Meads', to: 'Bath Spa', date: '1 Apr', time: '11:20am', saved: 9.00, dist: '14.2 mi', dur: '35 min', avoided: ['CAZ'], cost: 0 },
];

const SORT_OPTIONS = ['Newest', 'Most saved', 'Distance'];

export function TripHistoryScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState('All time');

  const filtered = ALL_TRIPS.filter(trip => {
    if (!search) return true;
    return trip.from.toLowerCase().includes(search.toLowerCase()) || trip.to.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => {
    if (sort === 'Most saved') return b.saved - a.saved;
    if (sort === 'Distance') return parseFloat(b.dist) - parseFloat(a.dist);
    return b.id - a.id;
  });

  // Group by date
  const grouped: Record<string, typeof ALL_TRIPS> = {};
  filtered.forEach(trip => {
    if (!grouped[trip.date]) grouped[trip.date] = [];
    grouped[trip.date].push(trip);
  });

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 88 }}>
      <AppHeader t={t} title="Trip History"
        right={
          <button onClick={() => setShowFilter(f => !f)} style={{
            width: 40, height: 40, borderRadius: 12,
            background: showFilter ? `${t.primary}22` : t.cardHi,
            border: `1px solid ${showFilter ? t.primary : t.border}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon n="filter" s={18} c={showFilter ? t.primary : t.textSec} />
          </button>
        }
      />

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon n="search" s={18} c={t.textTer} />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trips…"
            style={{
              width: '100%', height: 46, borderRadius: 14, background: t.card,
              border: `1px solid ${t.border}`, color: t.textPri, fontSize: 14,
              paddingLeft: 44, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer'
            }}>
              <Icon n="close" s={16} c={t.textTer} />
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div style={{ background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 8 }}>SORT BY</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {SORT_OPTIONS.map(s => (
                  <button key={s} onClick={() => setSort(s)} style={{
                    height: 32, borderRadius: 20, padding: '0 12px',
                    background: sort === s ? t.primary : t.cardHi,
                    color: sort === s ? '#fff' : t.textSec,
                    border: `1px solid ${sort === s ? t.primary : t.border}`,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 8 }}>DATE RANGE</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Today', 'This week', 'This month', 'All time'].map(d => (
                  <button key={d} onClick={() => setDateRange(d)} style={{
                    height: 32, borderRadius: 20, padding: '0 12px',
                    background: dateRange === d ? t.primary : t.cardHi,
                    color: dateRange === d ? '#fff' : t.textSec,
                    border: `1px solid ${dateRange === d ? t.primary : t.border}`,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                  }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Summary pill */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Total saved', value: `£${filtered.reduce((s, t) => s + t.saved, 0).toFixed(0)}`, color: t.success },
            { label: 'Trips', value: `${filtered.length}`, color: t.primary },
          ].map(m => (
            <div key={m.label} style={{
              flex: 1, background: t.card, borderRadius: 14, border: `1px solid ${t.border}`,
              padding: '12px 14px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Trips list */}
        {filtered.length === 0 ? (
          <EmptyState icon="history" title="No trips found" body="Try adjusting your search or filter to find past trips." cta="Clear search" onCta={() => setSearch('')} t={t} />
        ) : (
          Object.entries(grouped).map(([date, trips]) => (
            <div key={date}>
              <SectionLabel t={t}>{date}</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trips.map(trip => (
                  <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} style={{
                    background: t.card, borderRadius: 18, border: `1px solid ${t.border}`,
                    padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon n="nav" s={22} c={t.primary} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trip.from} → {trip.to}
                      </div>
                      <div style={{ fontSize: 12, color: t.textSec, display: 'flex', gap: 8 }}>
                        <span>{trip.time}</span>
                        <span>·</span>
                        <span>{trip.dist}</span>
                        <span>·</span>
                        <span>{trip.dur}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        {trip.avoided.map(a => (
                          <span key={a} style={{ fontSize: 10, fontWeight: 700, color: t.success, background: `${t.success}18`, borderRadius: 10, padding: '2px 6px' }}>
                            {a} avoided
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: t.success, flexShrink: 0 }}>+£{trip.saved.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav active="trips" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}
