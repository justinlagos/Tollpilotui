import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Btn, Icon, Card } from '../tp';

const RECENT = [
  { from: 'Home · SE1 7PB', to: 'Canary Wharf', time: 'Yesterday' },
  { from: 'Stratford', to: 'Heathrow T5', time: '3 days ago' },
  { from: 'Croydon', to: 'City of London', time: 'Last week' },
];
const POPULAR = ['ULEZ Boundary', 'Congestion Zone', 'Heathrow Airport', 'Canary Wharf', 'Kings Cross'];

export function RouteInputScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [active, setActive] = useState<'from' | 'to'>('from');

  const canSearch = from.length > 0 && to.length > 0;

  const fillRecent = (r: typeof RECENT[0]) => {
    setFrom(r.from);
    setTo(r.to);
  };

  const swap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Plan your route" />

      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Input card */}
        <Card t={t} pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.primary, border: `2px solid ${t.primary}` }} />
              <div style={{ width: 2, height: 24, background: `${t.border}`, borderRadius: 1 }} />
              <div style={{ width: 10, height: 10, borderRadius: 2, background: t.danger }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                value={from}
                onChange={e => setFrom(e.target.value)}
                onFocus={() => setActive('from')}
                placeholder="From"
                style={{
                  width: '100%', height: 44, borderRadius: 12,
                  background: active === 'from' ? `${t.primary}18` : t.cardHi,
                  border: active === 'from' ? `1px solid ${t.primary}44` : `1px solid transparent`,
                  color: t.textPri, fontSize: 14, padding: '0 12px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                  transition: 'all 0.15s ease'
                }}
              />
              <input
                value={to}
                onChange={e => setTo(e.target.value)}
                onFocus={() => setActive('to')}
                placeholder="To"
                style={{
                  width: '100%', height: 44, borderRadius: 12,
                  background: active === 'to' ? `${t.danger}15` : t.cardHi,
                  border: active === 'to' ? `1px solid ${t.danger}44` : `1px solid transparent`,
                  color: t.textPri, fontSize: 14, padding: '0 12px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                  transition: 'all 0.15s ease'
                }}
              />
            </div>
            <button onClick={swap} style={{
              width: 36, height: 36, borderRadius: 11, background: t.cardHi,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon n="arrowUp" s={18} c={t.textSec} />
            </button>
          </div>
        </Card>

        {/* Go button */}
        <Btn t={t} v="accent" size="lg" onClick={() => navigate('/compare')} disabled={!canSearch}>
          <Icon n="search" s={18} c={canSearch ? '#0A0F1C' : '#64748B'} />
          Compare routes
        </Btn>

        {/* Recent searches */}
        {RECENT.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recent</div>
            <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
              {RECENT.map((r, i) => (
                <div key={i} onClick={() => fillRecent(r)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < RECENT.length - 1 ? `1px solid ${t.border}` : 'none',
                  cursor: 'pointer'
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: t.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon n="history" s={18} c={t.textTer} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{r.from} → {r.to}</div>
                    <div style={{ fontSize: 12, color: t.textTer }}>{r.time}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setFrom(r.from); setTo(r.to); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer'
                  }}>
                    <Icon n="arrowUp" s={14} c={t.textTer} />
                  </button>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* Popular destinations */}
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Popular destinations</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {POPULAR.map(place => (
            <button key={place} onClick={() => setTo(place)} style={{
              background: t.card, border: `1px solid ${t.border}`, borderRadius: 20,
              padding: '8px 14px', fontSize: 13, fontWeight: 600, color: t.textSec,
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Icon n="mapPin" s={14} c={t.textTer} />
              {place}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}