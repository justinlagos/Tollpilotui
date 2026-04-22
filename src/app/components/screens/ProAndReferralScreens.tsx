import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTheme, AppHeader, Btn, Icon, Card, SectionLabel } from '../tp';

// ═══════════════════════════════════════════════════════════════
// PRO UPGRADE
// ═══════════════════════════════════════════════════════════════
export function ProUpgradeScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  const features = [
    { icon: 'route', color: '#FDC500', title: 'Mileage logging', sub: 'Auto-track business vs personal, HMRC-ready export' },
    { icon: 'shield', color: '#3BA9FF', title: 'PCN Defence', sub: 'Evidence logging + one-tap TfL charge appeals' },
    { icon: 'team', color: '#3BA9FF', title: 'Fleet management', sub: 'Track up to 20 drivers and vehicles' },
    { icon: 'bell', color: '#F59E0B', title: 'Predictive alerts', sub: 'AI-powered zone warnings 5 min early' },
    { icon: 'map', color: '#22C55E', title: 'Real-time traffic overlay', sub: 'Avoid congestion before it forms' },
    { icon: 'trending', color: '#A855F7', title: 'Advanced analytics', sub: 'Monthly reports and savings insights' },
    { icon: 'route', color: '#EF4444', title: 'Unlimited route comparisons', sub: 'Compare up to 8 routes at once' },
    { icon: 'phone', color: '#3BA9FF', title: 'Priority support', sub: 'Dedicated support line & live chat' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="" />

      {/* Hero */}
      <div style={{
        background: `linear-gradient(160deg, ${t.primary}22 0%, ${t.accent}15 100%)`,
        padding: '24px 20px 32px', textAlign: 'center'
      }}>
        <div style={{ width: 64, height: 64, borderRadius: 22, background: `${t.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `1px solid ${t.accent}44` }}>
          <Icon n="crown" s={32} c={t.accent} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: '0.12em', marginBottom: 8 }}>TOLLPILOT PRO</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: t.textPri, letterSpacing: '-0.03em', marginBottom: 8 }}>You're leaving money on the road</div>
        <div style={{ fontSize: 15, color: t.textSec }}>Pro catches more charges, earlier and helps you avoid them automatically.</div>
      </div>

      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Plan toggle */}
        <div style={{ background: t.cardHi, borderRadius: 14, padding: 4, display: 'flex' }}>
          {(['monthly', 'annual'] as const).map(p => (
            <button key={p} onClick={() => setPlan(p)} style={{
              flex: 1, height: 42, borderRadius: 11, border: 'none', cursor: 'pointer',
              background: plan === p ? t.card : 'transparent',
              color: plan === p ? t.textPri : t.textSec,
              fontWeight: plan === p ? 700 : 500, fontSize: 14, fontFamily: 'inherit',
              boxShadow: plan === p ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              {p === 'annual' ? 'Annual' : 'Monthly'}
              {p === 'annual' && <span style={{ fontSize: 10, fontWeight: 700, color: t.success, background: `${t.success}22`, borderRadius: 8, padding: '2px 6px' }}>-40%</span>}
            </button>
          ))}
        </div>

        {/* Pricing */}
        <Card t={t} glow={t.accent}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: t.textPri, letterSpacing: '-0.04em', lineHeight: 1 }}>
              £{plan === 'annual' ? '2.99' : '4.99'}
            </div>
            <div style={{ fontSize: 14, color: t.textSec, marginTop: 4 }}>
              {plan === 'annual' ? 'per month, billed annually (£35.88/yr)' : 'per month, cancel anytime'}
            </div>
            {plan === 'annual' && (
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: t.success }}>You save £24/year vs monthly</div>
            )}
          </div>
        </Card>

        {/* Features */}
        <SectionLabel t={t}>What's included</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${f.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon n={f.icon} s={20} c={f.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{f.title}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{f.sub}</div>
              </div>
              <Icon n="check" s={16} c={t.success} sw={2.5} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Btn t={t} v="accent" size="lg" onClick={() => navigate('/payment')}>
            <Icon n="crown" s={18} c="#0A0F1C" />
            Start free trial
          </Btn>
          <div style={{ textAlign: 'center', fontSize: 12, color: t.textTer }}>
            No card required for trial · Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REFERRAL SCREEN
// ═══════════════════════════════════════════════════════════════
export function ReferralScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);
  const code = 'TOLLPILOT-JS42';

  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referrals = [
    { name: 'Sarah M.', status: 'Joined', reward: '£5.00', avatar: 'SM' },
    { name: 'James C.', status: 'Joined', reward: '£5.00', avatar: 'JC' },
    { name: 'Priya P.', status: 'Pending', reward: '—', avatar: 'PP' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="Refer a friend" />

      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 24, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Icon n="gift" s={36} c={t.success} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em', marginBottom: 8 }}>Earn £5 per referral</div>
          <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6 }}>Share your code and earn £5 credit when a friend signs up and completes their first trip.</div>
        </div>

        {/* Code */}
        <div style={{ background: `${t.primary}18`, border: `1px solid ${t.primary}44`, borderRadius: 20, padding: '20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, letterSpacing: '0.1em' }}>YOUR REFERRAL CODE</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: t.textPri, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>{code}</div>
          <button onClick={copyCode} style={{
            display: 'flex', alignItems: 'center', gap: 8, height: 40, borderRadius: 12,
            background: copied ? `${t.success}22` : t.cardHi, border: `1px solid ${copied ? t.success : t.border}`,
            color: copied ? t.success : t.textPri, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '0 16px', fontFamily: 'inherit', transition: 'all 0.2s ease'
          }}>
            <Icon n={copied ? 'check' : 'copy'} s={16} c={copied ? t.success : t.textPri} />
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn t={t} v="primary" size="sm" full onClick={() => {}} icon="share">Share via link</Btn>
          <Btn t={t} v="secondary" size="sm" full onClick={() => {}} icon="mail">Email invite</Btn>
        </div>

        {/* Referrals */}
        <SectionLabel t={t}>Your referrals</SectionLabel>
        <div style={{ display: 'flex', justifyContent: 'space-between', background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, padding: '12px 16px', marginBottom: 4 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: t.success }}>2</div>
            <div style={{ fontSize: 11, color: t.textSec }}>Joined</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri }}>1</div>
            <div style={{ fontSize: 11, color: t.textSec }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: t.success }}>£10</div>
            <div style={{ fontSize: 11, color: t.textSec }}>Earned</div>
          </div>
        </div>

        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {referrals.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < referrals.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.primary }}>{r.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{r.name}</div>
                <div style={{ fontSize: 12, color: r.status === 'Joined' ? t.success : t.textTer }}>{r.status}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: r.status === 'Joined' ? t.success : t.textTer }}>{r.reward}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAYMENT CONFIRMATION
// ═══════════════════════════════════════════════════════════════
export function PaymentConfirmationScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 28 }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: `radial-gradient(circle, ${t.success}44 0%, ${t.success}11 60%, transparent 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulseS 2s ease infinite'
        }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${t.success}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="check" s={36} c={t.success} sw={2.5} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: t.textPri, marginBottom: 8 }}>Payment confirmed!</div>
        <div style={{ fontSize: 15, color: t.textSec }}>Your ULEZ charge has been processed successfully.</div>
      </div>

      <Card t={t} style={{ width: '100%', maxWidth: 360 }}>
        {[
          { label: 'Amount', value: '£12.50' },
          { label: 'Zone', value: 'London ULEZ' },
          { label: 'Date', value: 'Today, 5:42pm' },
          { label: 'Reference', value: '#TLP-884521' },
        ].map((row, i, arr) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontSize: 14, color: t.textSec }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: row.label === 'Amount' ? t.danger : t.textPri }}>{row.value}</span>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360 }}>
        <Btn t={t} v="primary" onClick={() => navigate('/dashboard')}>Back to dashboard</Btn>
        <Btn t={t} v="secondary" onClick={() => {}} icon="download">Download receipt</Btn>
      </div>

      <style>{`@keyframes pulseS { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ZONE ENTERED / PAYMENT REMINDER
// ═══════════════════════════════════════════════════════════════
export function ZoneEnteredScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n="check" s={40} c={t.success} sw={2.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, marginBottom: 8 }}>Payment scheduled</div>
          <div style={{ fontSize: 14, color: t.textSec }}>We'll process your ULEZ payment of £12.50 before midnight.</div>
        </div>
        <Btn t={t} v="primary" onClick={() => navigate('/dashboard')}>Back to dashboard</Btn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg }}>
      {/* Red header zone */}
      <div style={{ background: `${t.danger}22`, borderBottom: `1px solid ${t.danger}33`, padding: '56px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 18, background: `${t.danger}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="zap" s={26} c={t.danger} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.danger, letterSpacing: '0.1em', marginBottom: 2 }}>ZONE ENTERED</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>You've entered London ULEZ</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
        <Card t={t} glow={t.danger}>
          {[
            { label: 'Zone', value: 'London ULEZ' },
            { label: 'Charge', value: '£12.50' },
            { label: 'Entry time', value: 'Today, 5:42pm' },
            { label: 'Payment deadline', value: 'Midnight tonight' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <span style={{ fontSize: 14, color: t.textSec }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: row.label === 'Charge' ? t.danger : t.textPri }}>{row.value}</span>
            </div>
          ))}
        </Card>

        <div style={{ background: `${t.warn}18`, border: `1px solid ${t.warn}33`, borderRadius: 16, padding: 14, display: 'flex', gap: 10 }}>
          <Icon n="alert" s={16} c={t.warn} />
          <span style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>Pay before midnight to avoid a £120 penalty charge notice.</span>
        </div>

        <Btn t={t} v="danger" size="lg" onClick={() => setPaid(true)}>
          <Icon n="creditCard" s={18} c="#fff" />
          Pay £12.50 now
        </Btn>

        {/* PCN Defence hook */}
        <div onClick={() => navigate('/pcn')} style={{
          background: `${t.primary}12`, border: `1px solid ${t.primary}30`, borderRadius: 16,
          padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="shield" s={18} c={t.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.textPri }}>Think this charge is wrong?</div>
            <div style={{ fontSize: 12, color: t.textSec }}>We've logged the evidence. Appeal in one tap.</div>
          </div>
          <Icon n="right" s={16} c={t.textTer} />
        </div>

        <Btn t={t} v="secondary" onClick={() => navigate('/dashboard')}>Dismiss — I'll pay later</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLEET DRIVER DETAIL
// ═══════════════════════════════════════════════════════════════
export function FleetDriverDetailScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { id } = useParams();

  const driver = {
    name: 'Sarah Mitchell', plate: 'LK23ABC', vehicle: 'Ford Transit · Diesel · 2021',
    role: 'Driver', saved: 145.00, trips: 28, motStatus: 'ok', avatar: 'SM',
    lastTrip: 'Birmingham → Wolverhampton', lastTripDate: 'Today, 9:15am',
    zones: [{ name: 'Birmingham CAZ', count: 5, saved: 40 }],
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/fleet')} title="Driver detail" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Driver card */}
        <Card t={t} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 20, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: t.primary }}>{driver.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri }}>{driver.name}</div>
            <div style={{ fontSize: 13, color: t.textSec }}>{driver.role} · {driver.vehicle}</div>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ label: 'Total saved', value: `£${driver.saved.toFixed(0)}`, color: t.success }, { label: 'Trips', value: driver.trips, color: t.primary }].map(m => (
            <div key={m.label} style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <SectionLabel t={t}>Last trip</SectionLabel>
        <Card t={t}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri, marginBottom: 2 }}>{driver.lastTrip}</div>
          <div style={{ fontSize: 13, color: t.textSec }}>{driver.lastTripDate}</div>
        </Card>

        <SectionLabel t={t}>Zone avoidances</SectionLabel>
        {driver.zones.map(z => (
          <Card key={z.name} t={t}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{z.name}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{z.count} avoidances</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.success }}>+£{z.saved}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROUTE COST BY DRIVER
// ═══════════════════════════════════════════════════════════════
export function RouteCostByDriverScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();

  const data = [
    { name: 'Sarah M.', avatar: 'SM', saved: 145, cost: 0, trips: 28 },
    { name: 'James C.', avatar: 'JC', saved: 92, cost: 24, trips: 19 },
    { name: 'Priya P.', avatar: 'PP', saved: 78, cost: 8, trips: 15 },
    { name: 'Marcus W.', avatar: 'MW', saved: 231, cost: 0, trips: 44 },
  ];

  const maxSaved = Math.max(...data.map(d => d.saved));

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/fleet')} title="Route cost by driver" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionLabel t={t}>Savings leaderboard</SectionLabel>
        {data.sort((a, b) => b.saved - a.saved).map((d, i) => (
          <div key={d.name} style={{ background: t.card, borderRadius: 16, border: `1px solid ${t.border}`, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.primary }}>{d.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{d.name}</div>
                <div style={{ fontSize: 11, color: t.textSec }}>{d.trips} trips · £{d.cost > 0 ? d.cost : 0} paid</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.success }}>+£{d.saved}</div>
            </div>
            {/* Bar */}
            <div style={{ height: 6, background: t.cardHi, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(d.saved / maxSaved) * 100}%`, background: t.success, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}