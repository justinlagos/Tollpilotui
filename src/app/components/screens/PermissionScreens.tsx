import { useNavigate } from 'react-router';
import { useTheme, Btn, Icon } from '../tp';

function PermissionLayout({ icon, color, title, body, allow, onAllow, onDeny, note }: {
  icon: string; color: string; title: string; body: string;
  allow: string; onAllow: () => void; onDeny: () => void; note?: string;
}) {
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 32 }}>
      {/* Illustration */}
      <div style={{ position: 'relative' }}>
        <div style={{ width: 120, height: 120, borderRadius: 40, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 20px ${color}0D, 0 0 0 40px ${color}06` }}>
          <Icon n={icon} s={56} c={color} />
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 300 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: 15, color: t.textSec, margin: 0, lineHeight: 1.7 }}>{body}</p>
      </div>

      {note && (
        <div style={{
          background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
          padding: 16, display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', maxWidth: 340
        }}>
          <Icon n="lock" s={16} c={t.textTer} />
          <p style={{ margin: 0, fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>{note}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
        <Btn t={t} v="primary" size="lg" onClick={onAllow}><Icon n="check" s={18} c="#fff" />{allow}</Btn>
        <Btn t={t} v="tertiary" size="md" onClick={onDeny}>Not now</Btn>
      </div>
    </div>
  );
}

export function LocationPermissionScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();

  return (
    <PermissionLayout
      icon="locate"
      color="#3BA9FF"
      title="We only alert when it matters"
      body="Your location lets us warn you before you enter a charge zone. Nothing is stored unnecessarily."
      allow="Enable alerts"
      onAllow={() => navigate('/permission/notifications')}
      onDeny={() => navigate('/permission/notifications')}
      note="Your location is processed on-device and never shared with third parties."
    />
  );
}

export function NotificationPermissionScreen() {
  const navigate = useNavigate();
  return (
    <PermissionLayout
      icon="bell"
      color="#FDC500"
      title="Stay ahead, not caught out"
      body="We'll notify you before charges hit. No noise. Only when it matters."
      allow="Allow notifications"
      onAllow={() => navigate('/onboarding/success')}
      onDeny={() => navigate('/onboarding/success')}
      note="We only notify you about charges relevant to your route. No spam, ever."
    />
  );
}

export function OnboardingSuccessScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 28 }}>
      {/* Success animation */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: `radial-gradient(circle, ${t.success}44 0%, ${t.success}11 60%, transparent 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulseSuccess 2s ease infinite'
        }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${t.success}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="check" s={36} c={t.success} sw={2.5} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em', marginBottom: 10 }}>You're ready to save</div>
        <div style={{ fontSize: 15, color: t.textSec, lineHeight: 1.6 }}>We'll guide you before every charge, every time.</div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
        {[
          { icon: 'car', color: '#3BA9FF', label: 'VW Golf · DS18 JRX', sub: 'Vehicle connected' },
          { icon: 'locate', color: '#22C55E', label: 'Location access', sub: 'Active' },
          { icon: 'bell', color: '#FDC500', label: 'Zone alerts', sub: 'Enabled' },
        ].map(item => (
          <div key={item.label} style={{
            background: t.card, borderRadius: 16, border: `1px solid ${t.border}`,
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n={item.icon} s={18} c={item.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{item.label}</div>
              <div style={{ fontSize: 12, color: t.textSec }}>{item.sub}</div>
            </div>
            <Icon n="check" s={16} c={t.success} sw={2.5} />
          </div>
        ))}
      </div>

      <Btn t={t} v="accent" size="lg" onClick={() => navigate('/dashboard')}>
        Start driving <Icon n="right" s={18} c="#0A0F1C" />
      </Btn>

      <style>{`@keyframes pulseSuccess { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>
    </div>
  );
}