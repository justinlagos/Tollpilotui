import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel } from '../tp';

export function DailyCommuteScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [enabled, setEnabled] = useState(true);

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Daily Commute" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Notification preview mock */}
        <SectionLabel t={t}>Push notification preview</SectionLabel>
        <div style={{
          background: t.card, borderRadius: 20, border: `1px solid ${t.border}`,
          padding: 16, boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
        }}>
          {/* Mock iOS notification chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#F5C744', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="nav" s={14} c="#0A0F1C" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.textPri }}>TollPilot</div>
              <div style={{ fontSize: 10, color: t.textTer }}>now</div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri, marginBottom: 4 }}>Good morning, Justin</div>
          <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.55 }}>
            Your usual route today includes <span style={{ fontWeight: 700, color: t.danger }}>£12.50</span> in charges and moderate traffic. Cheapest alternative: <span style={{ fontWeight: 700, color: t.success }}>£0 in charges</span>, 6 mins longer.
          </div>
        </div>

        {/* Settings */}
        <SectionLabel t={t}>Configuration</SectionLabel>
        <Card t={t}>
          {[
            { label: 'Daily briefing', sub: 'Push notification at departure time', on: enabled },
            { label: 'Departure time', sub: '8:15 AM', on: null },
            { label: 'Usual route', sub: 'Stratford → City of London', on: null },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{row.label}</div>
                <div style={{ fontSize: 12, color: t.textSec, marginTop: 1 }}>{row.sub}</div>
              </div>
              {row.on !== null ? (
                <button onClick={() => setEnabled(e => !e)} style={{
                  width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: enabled ? t.success : t.cardHi,
                  position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: enabled ? 23 : 3,
                    transition: 'left 0.2s',
                  }} />
                </button>
              ) : (
                <Icon n="right" s={16} c={t.textTer} />
              )}
            </div>
          ))}
        </Card>

        {/* What you get */}
        <SectionLabel t={t}>What's included</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: 'zap', text: 'Charge forecast for your usual route' },
            { icon: 'route', text: 'Cheapest alternative with time difference' },
            { icon: 'clock', text: 'Traffic level at your departure time' },
            { icon: 'bell', text: 'Sent before you leave, not after' },
          ].map(item => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: t.card, borderRadius: 14, border: `1px solid ${t.border}`,
              padding: '12px 14px',
            }}>
              <Icon n={item.icon} s={16} c={t.primary} />
              <span style={{ fontSize: 13, color: t.textSec }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
