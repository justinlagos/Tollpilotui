import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Icon, Card, SectionLabel, UKPlate } from '../tp';

const DRIVERS = [
  { id: 1, name: 'Sarah Mitchell', plate: 'LK23ABC', vehicle: 'Ford Transit · Diesel', role: 'Driver', saved: 145.00, trips: 28, motStatus: 'ok', avatar: 'SM' },
  { id: 2, name: 'James Carter', plate: 'HG19XYZ', vehicle: 'VW Transporter · Diesel', role: 'Senior Driver', saved: 92.00, trips: 19, motStatus: 'due', avatar: 'JC' },
  { id: 3, name: 'Priya Patel', plate: 'EK21TBN', vehicle: 'Citroën Dispatch · Diesel', role: 'Driver', saved: 78.50, trips: 15, motStatus: 'ok', avatar: 'PP' },
  { id: 4, name: 'Marcus Webb', plate: 'YR18GHF', vehicle: 'Mercedes Sprinter · Diesel', role: 'Manager', saved: 231.00, trips: 44, motStatus: 'expired', avatar: 'MW' },
];

const FLEET_ZONES = [
  { zone: 'London ULEZ', cost: '£12.50/day', risk: 'high' },
  { zone: 'Birmingham CAZ', cost: '£8.00/day', risk: 'medium' },
  { zone: 'Bristol CAZ', cost: '£9.00/day', risk: 'medium' },
];

export function FleetScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [tab, setTab] = useState<'drivers' | 'routes' | 'zones'>('drivers');

  const totalSaved = DRIVERS.reduce((s, d) => s + d.saved, 0);
  const totalTrips = DRIVERS.reduce((s, d) => s + d.trips, 0);
  const motIssues = DRIVERS.filter(d => d.motStatus !== 'ok').length;

  const motColor = (s: string) => s === 'ok' ? t.success : s === 'due' ? t.warn : t.danger;

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="Fleet manager"
        right={
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, height: 36, borderRadius: 20,
            background: `${t.primary}22`, borderWidth: 1, borderStyle: 'solid', borderColor: `${t.primary}44`,
            padding: '0 12px', cursor: 'pointer'
          }}>
            <Icon n="plus" s={15} c={t.primary} />
            <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>Add driver</span>
          </button>
        }
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
        {/* Fleet overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Total saved', value: `£${totalSaved.toFixed(0)}`, color: t.success },
            { label: 'Total trips', value: `${totalTrips}`, color: t.primary },
            { label: 'MOT alerts', value: `${motIssues}`, color: motIssues > 0 ? t.danger : t.success },
          ].map(m => (
            <div key={m.label} style={{ background: t.card, borderRadius: 14, borderWidth: 1, borderStyle: 'solid', borderColor: t.border, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 10, color: t.textSec, marginTop: 2, fontWeight: 600 }}>{m.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: t.cardHi, borderRadius: 14, padding: 4 }}>
          {(['drivers', 'routes', 'zones'] as const).map(tab2 => (
            <button key={tab2} onClick={() => setTab(tab2)} style={{
              flex: 1, height: 38, borderRadius: 11, border: 'none', cursor: 'pointer',
              background: tab === tab2 ? t.card : 'transparent',
              color: tab === tab2 ? t.textPri : t.textSec,
              fontWeight: tab === tab2 ? 700 : 500, fontSize: 13, fontFamily: 'inherit',
              boxShadow: tab === tab2 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              textTransform: 'capitalize', transition: 'all 0.15s ease'
            }}>{tab2}</button>
          ))}
        </div>

        {/* Drivers tab */}
        {tab === 'drivers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DRIVERS.map(driver => (
              <div key={driver.id} onClick={() => navigate(`/fleet/${driver.id}`)} style={{
                background: t.card, borderRadius: 18, borderWidth: 1, borderStyle: 'solid',
                borderColor: driver.motStatus !== 'ok' ? `${motColor(driver.motStatus)}44` : t.border,
                padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 16, background: `${t.primary}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 800, color: t.primary, flexShrink: 0
                }}>
                  {driver.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>{driver.name}</span>
                    {driver.motStatus !== 'ok' && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: motColor(driver.motStatus) }} />
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: t.textSec, marginBottom: 2 }}>{driver.vehicle}</div>
                  <div style={{ fontSize: 11, color: t.textTer }}>{driver.trips} trips · £{driver.saved.toFixed(0)} saved</div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <UKPlate value={driver.plate} size="sm" />
                  {driver.motStatus !== 'ok' && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: motColor(driver.motStatus), background: `${motColor(driver.motStatus)}18`, borderRadius: 8, padding: '2px 6px' }}>
                      MOT {driver.motStatus}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Routes tab */}
        {tab === 'routes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionLabel t={t}>Route cost by driver</SectionLabel>
            {DRIVERS.map(d => (
              <div key={d.id} onClick={() => navigate('/fleet/routes')} style={{
                background: t.card, borderRadius: 16, borderWidth: 1, borderStyle: 'solid', borderColor: t.border,
                padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.primary }}>{d.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: t.textSec }}>{d.trips} routes · avg £{(d.saved / d.trips).toFixed(2)} saved per trip</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: t.success }}>£{d.saved.toFixed(0)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Zones tab */}
        {tab === 'zones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionLabel t={t}>Zone exposure risk</SectionLabel>
            {FLEET_ZONES.map(z => (
              <Card key={z.zone} t={t} glow={z.risk === 'high' ? t.danger : t.warn}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: z.risk === 'high' ? t.danger : t.warn
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>{z.zone}</div>
                    <div style={{ fontSize: 13, color: t.textSec }}>{z.cost}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: z.risk === 'high' ? t.danger : t.warn,
                    background: z.risk === 'high' ? `${t.danger}18` : `${t.warn}18`,
                    borderRadius: 20, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>{z.risk}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
