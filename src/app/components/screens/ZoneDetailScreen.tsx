import { useNavigate, useParams } from 'react-router';
import { useTheme, AppHeader, Btn, Icon, Card, MiniMap, SectionLabel } from '../tp';

const ZONE_DATA: Record<string, {
  name: string; region: string; type: string; charge: string; period: string;
  description: string; color: string; compliant: boolean; isBan?: boolean;
  rules: { title: string; detail: string }[];
}> = {
  ulez: {
    name: 'London ULEZ', region: 'Greater London', type: 'Ultra Low Emission Zone',
    charge: '£12.50', period: '24 hours a day, 7 days a week',
    description: 'The Ultra Low Emission Zone operates across most of London. Vehicles that don\'t meet the minimum emission standards must pay the daily charge.',
    color: '#EF4444', compliant: true,
    rules: [
      { title: 'Petrol vehicles', detail: 'Must meet Euro 4 standard (most vehicles registered after 2005)' },
      { title: 'Diesel vehicles', detail: 'Must meet Euro 6 standard (most vehicles registered after 2015)' },
      { title: 'Payment', detail: 'Pay by midnight the day after you drive. You can pay up to 90 days in advance.' },
    ]
  },
  cc: {
    name: 'Congestion Charge', region: 'Central London', type: 'Congestion Charge Zone',
    charge: '£18.00', period: 'Mon–Fri 7am–6pm, Sat–Sun 12pm–6pm',
    description: 'The Congestion Charge zone covers central London. All vehicles must pay to drive within the zone during charging hours.',
    color: '#F59E0B', compliant: true,
    rules: [
      { title: 'All vehicles', detail: 'All vehicles must pay regardless of emission standard' },
      { title: 'Exempt', detail: 'Fully electric vehicles are currently exempt from the charge' },
      { title: 'Auto-pay', detail: 'Register your vehicle for Auto Pay and never miss a payment' },
    ]
  },
  slez: {
    name: 'Glasgow LEZ', region: 'Scotland', type: 'Low Emission Zone',
    charge: 'BAN', period: '24 hours a day, 7 days a week',
    description: 'Glasgow\'s LEZ applies a vehicle access ban for non-compliant vehicles. Non-compliant vehicles face enforcement penalties rather than a charge.',
    color: '#DC2626', compliant: false, isBan: true,
    rules: [
      { title: 'Non-compliant vehicles', detail: 'Petrol vehicles registered before 2006, diesel before 2015' },
      { title: 'Penalty', detail: '£60 on first offence, escalating to £480 for repeated violations' },
      { title: 'Exceptions', detail: 'Blue badge holders may be exempt. Check Transport Scotland for details.' },
    ]
  },
};

export function ZoneDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t, theme } = useTheme();
  const zone = ZONE_DATA[id || 'ulez'] || ZONE_DATA['ulez'];

  return (
    <div style={{ minHeight: '100dvh', background: t.bg }}>
      <AppHeader t={t} onBack={() => navigate('/zones')} title={zone.name} />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
        {/* Map */}
        <MiniMap t={t} theme={theme} size="md" showULEZ />

        {/* Zone type + compliance */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, background: `${zone.color}18`, border: `1px solid ${zone.color}33`,
            borderRadius: 16, padding: '12px 14px'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: zone.color, letterSpacing: '0.08em', marginBottom: 4 }}>ZONE TYPE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>{zone.type}</div>
          </div>
          <div style={{
            background: zone.compliant ? `${t.success}18` : `${t.danger}18`,
            border: `1px solid ${zone.compliant ? t.success : t.danger}44`,
            borderRadius: 16, padding: '12px 14px'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: zone.compliant ? t.success : t.danger, letterSpacing: '0.08em', marginBottom: 4 }}>YOUR VEHICLE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: zone.compliant ? t.success : t.danger }}>
              {zone.compliant ? '✓ Compliant' : '✗ Non-compliant'}
            </div>
          </div>
        </div>

        {/* Charge amount */}
        <Card t={t} glow={zone.color}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 4 }}>
                {zone.isBan ? 'ENFORCEMENT' : 'DAILY CHARGE'}
              </div>
              <div style={{
                fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1,
                color: zone.isBan ? t.danger : zone.color
              }}>
                {zone.charge}
              </div>
            </div>
            <div style={{
              width: 56, height: 56, borderRadius: 18, background: `${zone.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon n={zone.isBan ? 'close' : 'creditCard'} s={28} c={zone.color} />
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: t.cardHi, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon n="clock" s={15} c={t.textTer} />
            <span style={{ fontSize: 13, color: t.textSec }}>{zone.period}</span>
          </div>
        </Card>

        {/* Description */}
        <p style={{ fontSize: 14, color: t.textSec, lineHeight: 1.7, margin: 0 }}>{zone.description}</p>

        {/* Rules */}
        <SectionLabel t={t}>Key rules</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {zone.rules.map((rule, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              borderBottom: i < zone.rules.length - 1 ? `1px solid ${t.border}` : 'none'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri, marginBottom: 4 }}>{rule.title}</div>
              <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>{rule.detail}</div>
            </div>
          ))}
        </Card>

        {/* Actions */}
        {zone.isBan ? (
          <div style={{ background: `${t.danger}18`, border: `1px solid ${t.danger}33`, borderRadius: 18, padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Icon n="alert" s={20} c={t.danger} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.danger, marginBottom: 4 }}>Your vehicle is BANNED from this zone</div>
                <div style={{ fontSize: 13, color: t.textSec }}>Entry may result in fines up to £480. TollPilot will always route you around this zone.</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Btn t={t} v="primary" onClick={() => navigate('/route')}>
              <Icon n="route" s={18} c="#fff" />
              Plan route avoiding this zone
            </Btn>
            <Btn t={t} v="secondary" onClick={() => navigate('/zones')}>
              <Icon n="left" s={16} c={t.textPri} />
              Back to all zones
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}