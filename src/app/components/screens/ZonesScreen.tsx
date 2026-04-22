import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, EmptyState, Icon, Card, MiniMap, BottomNav, SectionLabel } from '../tp';

const ALL_ZONES = [
  { id: 'ulez', name: 'London ULEZ', region: 'Greater London', period: '24/7', price: '£12.50', priority: 'critical', type: 'ulez', status: 'active', dist: '0.8 mi' },
  { id: 'cc', name: 'Congestion Charge', region: 'Central London', period: 'Mon–Fri 7am–6pm', price: '£18.00', priority: 'critical', type: 'congestion', status: 'active', dist: '2.1 mi' },
  { id: 'bcaz', name: 'Birmingham CAZ', region: 'West Midlands', period: '24/7', price: '£8.00', priority: 'high', type: 'caz', status: 'active', dist: '92 mi' },
  { id: 'brcaz', name: 'Bristol CAZ', region: 'South West', period: '24/7', price: '£9.00', priority: 'high', type: 'caz', status: 'active', dist: '118 mi' },
  { id: 'ozez', name: 'Oxford ZEZ', region: 'South East', period: '7am–7pm', price: '£4–£10', priority: 'high', type: 'zez', status: 'active', dist: '56 mi' },
  { id: 'slez', name: 'Glasgow LEZ', region: 'Scotland', period: '24/7', price: 'BAN', priority: 'critical', type: 'lez', status: 'ban', dist: '340 mi' },
  { id: 'dart', name: 'Dartford Crossing', region: 'Essex/Kent', period: '6am–10pm', price: '£3.00', priority: 'medium', type: 'toll', status: 'active', dist: '18 mi' },
];

const FILTERS = ['All', 'Near me', 'Critical', 'Toll', 'CAZ', 'LEZ'];

const ZONE_COLORS: Record<string, string> = {
  ulez: '#EF4444', congestion: '#F59E0B', caz: '#F97316', zez: '#8B5CF6', lez: '#DC2626', toll: '#3BA9FF',
};

export function ZonesScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_ZONES.filter(z => {
    const matchFilter = filter === 'All' || filter === 'Near me' ? true
      : filter === 'Critical' ? z.priority === 'critical'
      : z.type === filter.toLowerCase();
    const matchSearch = !search || z.name.toLowerCase().includes(search.toLowerCase()) || z.region.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const priorityColor = (p: string, status: string) => {
    if (status === 'ban') return '#DC2626';
    return p === 'critical' ? '#EF4444' : p === 'high' ? '#F59E0B' : '#3BA9FF';
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 88 }}>
      <AppHeader t={t} title="Charge Zones" logo={false}
        right={
          <button onClick={() => navigate('/drive')} style={{
            width: 40, height: 40, borderRadius: 12, background: `${t.primary}22`,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon n="map" s={18} c={t.primary} />
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
            placeholder="Search zones or regions…"
            style={{
              width: '100%', height: 48, borderRadius: 14, background: t.card,
              border: `1px solid ${t.border}`, color: t.textPri, fontSize: 14,
              paddingLeft: 44, paddingRight: 16, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flexShrink: 0, height: 34, borderRadius: 20, padding: '0 14px',
              background: filter === f ? t.primary : t.card,
              color: filter === f ? '#fff' : t.textSec,
              border: `1px solid ${filter === f ? t.primary : t.border}`,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}>{f}</button>
          ))}
        </div>

        {/* Map thumbnail */}
        <MiniMap t={t} theme={theme} size="sm" showULEZ />

        {/* Zone list */}
        <SectionLabel t={t}>{filtered.length} zones</SectionLabel>

        {filtered.length === 0 ? (
          <EmptyState
            icon="mapPin"
            title="No zones match your filter"
            body="Try adjusting the filter or search term to find charge zones near you."
            cta="Clear filters"
            onCta={() => { setFilter('All'); setSearch(''); }}
            t={t}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(zone => {
              const color = ZONE_COLORS[zone.type] || t.primary;
              const isBan = zone.status === 'ban';
              return (
                <div key={zone.id} onClick={() => navigate(`/zones/${zone.id}`)} style={{
                  background: t.card, borderRadius: 18, border: `1px solid ${t.border}`,
                  padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 16, background: `${color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon n="mapPin" s={24} c={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>{zone.name}</span>
                      {zone.priority === 'critical' && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: t.textSec }}>{zone.region} · {zone.period}</div>
                    <div style={{ fontSize: 11, color: t.textTer, marginTop: 2 }}>{zone.dist} away</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <div style={{
                      background: isBan ? `${t.danger}22` : `${color}22`,
                      borderRadius: 20, padding: '5px 10px'
                    }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: isBan ? t.danger : color
                      }}>{zone.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav active="zones" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}
