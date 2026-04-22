import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, MiniMap, Btn, Icon, Card, BottomNav } from '../tp';

const ROUTES = [
  {
    id: 'fastest', label: 'Fastest route', color: '#3BA9FF', time: '28 min', dist: '14.2 mi',
    cost: 30.50, charges: [{ name: 'ULEZ', cost: 12.50 }, { name: 'Congestion', cost: 18.00 }],
    noCharge: false, selected: false, badge: null, badgeSub: null,
  },
  {
    id: 'cheapest', label: 'Lowest cost route', color: '#22C55E', time: '42 min', dist: '19.8 mi',
    cost: 0, charges: [], noCharge: true, selected: false, badge: null, badgeSub: null,
  },
  {
    id: 'balanced', label: 'Best balance', color: '#FDC500', time: '34 min', dist: '16.1 mi',
    cost: 12.50, charges: [{ name: 'ULEZ', cost: 12.50 }],
    noCharge: false, selected: true, badge: 'Best value', badgeSub: 'Saves you £8 with just 3 extra minutes',
  },
];

export function CompareRoutesScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [selected, setSelected] = useState('balanced');

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 88 }}>
      <AppHeader t={t} onBack={() => navigate('/route')} title="Compare routes"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${t.success}22`, borderRadius: 20, padding: '6px 12px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.success }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.success }}>LIVE</span>
          </div>
        }
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Route summary */}
        <div style={{
          background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.primary }} />
            <div style={{ width: 1.5, height: 16, background: t.border }} />
            <div style={{ width: 8, height: 8, borderRadius: 2, background: t.danger }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, color: t.textSec }}>Stratford · SE1 7PB</span>
            <span style={{ fontSize: 13, color: t.textSec }}>City of London · EC3V</span>
          </div>
          <button onClick={() => navigate('/route')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon n="gear" s={18} c={t.textTer} />
          </button>
        </div>

        {/* Map */}
        <MiniMap t={t} theme={theme} size="md" showULEZ />

        {/* Route cards */}
        {ROUTES.map(route => {
          const isSelected = selected === route.id;
          return (
            <div key={route.id} onClick={() => setSelected(route.id)} style={{
              background: t.card, borderRadius: 22,
              border: isSelected ? `2px solid ${route.color}` : `1px solid ${t.border}`,
              padding: 18, cursor: 'pointer', position: 'relative',
              boxShadow: isSelected ? `0 0 0 1px ${route.color}22, 0 8px 24px ${route.color}18` : 'none',
              transition: 'all 0.2s ease'
            }}>
              {/* Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: route.color, letterSpacing: '0.1em' }}>{route.label}</div>
                    {route.badge && (
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#0A0F1C', background: route.color, borderRadius: 8, padding: '2px 8px' }}>{route.badge}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: t.textSec }}>
                      <Icon n="clock" s={14} c={t.textTer} />{route.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: t.textSec }}>
                      <Icon n="route" s={14} c={t.textTer} />{route.dist}
                    </span>
                  </div>
                  {route.badgeSub && (
                    <div style={{ fontSize: 12, color: route.color, marginTop: 4, fontWeight: 600 }}>{route.badgeSub}</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, paddingRight: isSelected ? 30 : 0 }}>
                  <span style={{ fontSize: 30, fontWeight: 900, color: route.noCharge ? t.success : t.textPri, letterSpacing: '-0.03em' }}>
                    {route.noCharge ? '£0' : `£${route.cost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Charges / no charge badge */}
              {route.noCharge ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${t.success}22`, borderRadius: 20, padding: '6px 12px' }}>
                  <Icon n="check" s={14} c={t.success} sw={2.5} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.success }}>No charges on this route</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {route.charges.map(ch => (
                    <div key={ch.name} style={{ background: `${t.danger}18`, borderRadius: 20, padding: '5px 10px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: t.danger }}>{ch.name} £{ch.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: route.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon n="check" s={12} c="#fff" sw={2.5} />
                </div>
              )}

              {/* CTA if selected */}
              {isSelected && (
                <button onClick={e => { e.stopPropagation(); navigate('/drive'); }} style={{
                  marginTop: 14, width: '100%', height: 48, borderRadius: 14,
                  background: route.color, color: route.color === '#FDC500' ? '#0A0F1C' : '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                  <Icon n="nav" s={16} c={route.color === '#FDC500' ? '#0A0F1C' : '#fff'} />
                  Start navigation
                </button>
              )}
            </div>
          );
        })}

        {/* Save comparison */}
        <div style={{ background: `${t.success}18`, border: `1px solid ${t.success}33`, borderRadius: 18, padding: 16, display: 'flex', gap: 12 }}>
          <Icon n="zap" s={20} c={t.success} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri, marginBottom: 2 }}>Smart move — cheaper route selected</div>
            <div style={{ fontSize: 13, color: t.textSec }}>You'll save £30.50 vs. the fastest route.</div>
          </div>
        </div>
      </div>

      <BottomNav active="drive" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}