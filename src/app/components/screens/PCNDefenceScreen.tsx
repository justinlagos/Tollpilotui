import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge } from '../tp';

const CASES = [
  { id: 1, zone: 'London ULEZ', date: 'Today, 5:42pm', charge: '£12.50', status: 'ready' as const, route: 'Stratford → City of London', gps: '51.5414°N, 0.0034°W', duration: '32 min' },
  { id: 2, zone: 'Congestion Charge', date: 'Mon 14 Apr, 8:15am', charge: '£15.00', status: 'submitted' as const, route: 'Brixton → Westminster', gps: '51.5074°N, 0.1278°W', duration: '41 min' },
  { id: 3, zone: 'London ULEZ', date: 'Fri 4 Apr, 6:30pm', charge: '£12.50', status: 'won' as const, route: 'Croydon → Canary Wharf', gps: '51.5054°N, 0.0235°W', duration: '55 min' },
];

const statusMeta = {
  ready: { label: 'Ready to appeal', color: '#3BA9FF', icon: 'shield' },
  submitted: { label: 'Under review', color: '#F59E0B', icon: 'clock' },
  won: { label: 'Appeal won', color: '#22C55E', icon: 'check' },
} as const;

export function PCNDefenceScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="PCN Defence" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero */}
        <Card t={t} glow={t.primary}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="shield" s={24} c={t.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em' }}>TfL charge protection</div>
              <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>We log evidence automatically. You appeal in one tap.</div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: '12px 14px', background: `${t.success}12`, borderRadius: 12, border: `1px solid ${t.success}25` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.success }}>Pay only if we win · £3 per successful appeal</div>
          </div>
        </Card>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Logged', value: '12', color: t.primary },
            { label: 'Appeals', value: '3', color: t.accent },
            { label: 'Saved', value: '£40', color: t.success },
          ].map(s => (
            <div key={s.label} style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: '14px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 4 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Cases */}
        <SectionLabel t={t}>Recent cases</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {CASES.map((c, i) => {
            const meta = statusMeta[c.status];
            return (
              <div key={c.id} onClick={() => navigate(`/pcn/${c.id}`)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < CASES.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer',
              }}>
                <IconBadge icon={meta.icon} color={meta.color} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{c.zone}</div>
                  <div style={{ fontSize: 12, color: t.textSec }}>{c.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.danger }}>{c.charge}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: meta.color }}>{meta.label}</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

export function PCNDetailScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { id } = useParams();
  const c = CASES.find(x => x.id === Number(id)) || CASES[0];
  const meta = statusMeta[c.status];
  const [appealing, setAppealing] = useState(false);

  if (appealing) {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n="check" s={40} c={t.success} sw={2.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, marginBottom: 8 }}>Appeal submitted</div>
          <div style={{ fontSize: 14, color: t.textSec }}>We've sent your evidence to TfL. You'll only be charged £3 if the appeal succeeds.</div>
        </div>
        <Btn t={t} v="primary" onClick={() => navigate('/pcn')}>Back to PCN Defence</Btn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/pcn')} title="Case details" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: `${meta.color}15`, borderRadius: 14, border: `1px solid ${meta.color}30` }}>
          <Icon n={meta.icon} s={18} c={meta.color} />
          <span style={{ fontSize: 14, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        </div>

        {/* Evidence summary */}
        <SectionLabel t={t}>Evidence collected</SectionLabel>
        <Card t={t}>
          {[
            { label: 'Zone', value: c.zone },
            { label: 'Date', value: c.date },
            { label: 'Route', value: c.route },
            { label: 'Duration', value: c.duration },
            { label: 'GPS coordinates', value: c.gps },
            { label: 'Charge amount', value: c.charge },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: t.textSec }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.label === 'Charge amount' ? t.danger : t.textPri }}>{row.value}</span>
            </div>
          ))}
        </Card>

        {/* Auto-collected badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['GPS verified', 'Time logged', 'Route matched', 'Vehicle confirmed'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${t.success}15`, borderRadius: 20, padding: '6px 12px' }}>
              <Icon n="check" s={12} c={t.success} sw={2.5} />
              <span style={{ fontSize: 11, fontWeight: 600, color: t.success }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Appeal CTA */}
        {c.status === 'ready' && (
          <>
            <Btn t={t} v="accent" size="lg" onClick={() => setAppealing(true)} full>
              <Icon n="shield" s={18} c="#0A0F1C" />
              Appeal this charge
            </Btn>
            <div style={{ fontSize: 12, color: t.textTer, textAlign: 'center' }}>You only pay £3 if the appeal is successful</div>
          </>
        )}
      </div>
    </div>
  );
}
