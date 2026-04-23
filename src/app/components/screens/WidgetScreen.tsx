import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge } from '../tp';
import { Pilot } from '../Pilot';

type Variant = 'small' | 'medium';

export function WidgetScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>('medium');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showEnabledSheet, setShowEnabledSheet] = useState(false);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) setShowEnabledSheet(true);
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Lock screen widget" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Hero */}
        <Card t={t} glow={t.primary}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="widget" s={24} c={t.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em' }}>Today at a glance</div>
              <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>Your route, the cost and a cheaper way — right on your lock screen.</div>
            </div>
          </div>
        </Card>

        {/* Variant picker */}
        <div style={{ display: 'flex', gap: 10 }}>
          {(['small', 'medium'] as Variant[]).map(v => (
            <button key={v} onClick={() => setVariant(v)} style={{
              flex: 1, padding: '10px 14px', borderRadius: 12,
              background: variant === v ? t.primary : t.card,
              color: variant === v ? '#fff' : t.textPri,
              border: `1px solid ${variant === v ? t.primary : t.border}`,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              textTransform: 'capitalize',
            }}>{v}</button>
          ))}
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em' }}>PREVIEW</div>
          <LockScreenPreview variant={variant} notifEnabled={notifEnabled} />
        </div>

        {/* Enable toggle */}
        <Card t={t}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: enabled ? `${t.success}22` : `${t.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n={enabled ? 'check' : 'widget'} s={22} c={enabled ? t.success : t.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>Show on lock screen</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>
                {enabled ? 'Active · refreshes every 15 min' : 'Off · tap to add it to your lock screen'}
              </div>
            </div>
            <Toggle value={enabled} onChange={() => toggle()} />
          </div>
        </Card>

        {/* Notification preview */}
        <SectionLabel t={t}>Morning notification</SectionLabel>
        <NotificationPreview enabled={notifEnabled} />

        <Card t={t}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="bell" s={22} c={t.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>Daily wake-up preview</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>We send today's cost and cheaper option at 7:30am.</div>
            </div>
            <Toggle value={notifEnabled} onChange={setNotifEnabled} />
          </div>
        </Card>

        <SectionLabel t={t}>How to add it</SectionLabel>
        <Card t={t}>
          {[
            { n: 1, title: 'Long-press your lock screen', body: 'Then tap Customise → Lock screen.' },
            { n: 2, title: 'Tap the widget area', body: 'Pick TollPilot from the widget list.' },
            { n: 3, title: 'Choose a size', body: 'Small shows today\'s cost. Medium adds the cheaper option.' },
          ].map((row, i, arr) => (
            <div key={row.n} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${t.primary}22`, color: t.primary, fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{row.title}</div>
                <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, lineHeight: 1.5 }}>{row.body}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <AnimatePresence>
        {showEnabledSheet && <EnabledSheet onClose={() => setShowEnabledSheet(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ============ LOCK SCREEN PREVIEW ============ */

function LockScreenPreview({ variant, notifEnabled }: { variant: Variant; notifEnabled: boolean }) {
  // Render a phone frame with lock screen + widget
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{
      width: 260, borderRadius: 38, padding: 10,
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      border: '2px solid rgba(255,255,255,0.08)',
      boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        borderRadius: 30, padding: '32px 16px 28px',
        background: 'linear-gradient(180deg, #0B1220 0%, #0E1E3A 40%, #1A2B54 100%)',
        position: 'relative', minHeight: 440, overflow: 'hidden',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 100, height: 24, borderRadius: 16, background: '#000' }} />

        {/* Time + date */}
        <div style={{ textAlign: 'center', marginTop: 20, color: '#fff', marginBottom: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>{date}</div>
          <div style={{ fontSize: 58, fontWeight: 300, letterSpacing: '-0.02em', marginTop: 2, lineHeight: 1 }}>{time}</div>
        </div>

        {/* Widget */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          {variant === 'small' ? <SmallWidget /> : <MediumWidget />}
        </div>

        {/* Notification */}
        {notifEnabled && (
          <div style={{ marginTop: 14, marginInline: 6 }}>
            <MiniNotif />
          </div>
        )}
      </div>
    </div>
  );
}

function SmallWidget() {
  return (
    <div style={{
      width: 108, height: 108, borderRadius: 22,
      background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.9))',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: 12, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      backdropFilter: 'blur(14px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FDC500' }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75 }}>TOLLPILOT</span>
      </div>
      <div>
        <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.05em' }}>TODAY</div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>£12.50</div>
      </div>
      <div style={{ fontSize: 9, opacity: 0.7 }}>Alt · £0 · +6 min</div>
    </div>
  );
}

function MediumWidget() {
  return (
    <div style={{
      width: 228, height: 108, borderRadius: 22,
      background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.9))',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: 12, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      backdropFilter: 'blur(14px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FDC500' }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75 }}>TOLLPILOT · TODAY</span>
        </div>
        <span style={{ fontSize: 9, opacity: 0.55 }}>Stratford → City</span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, opacity: 0.65 }}>USUAL ROUTE</div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 2 }}>£12.50</div>
          <div style={{ fontSize: 9, opacity: 0.55, marginTop: 1 }}>ULEZ · 32 min</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, opacity: 0.65, color: '#FDC500' }}>CHEAPER</div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 2, color: '#FDC500' }}>£0</div>
          <div style={{ fontSize: 9, opacity: 0.7, marginTop: 1 }}>Avoid · 38 min</div>
        </div>
      </div>
    </div>
  );
}

function MiniNotif() {
  return (
    <div style={{
      borderRadius: 16, padding: '10px 12px',
      background: 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(18px)',
      display: 'flex', gap: 10, alignItems: 'center', color: '#fff',
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: '#FDC500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#0A0F1C' }}>TP</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.9 }}>TollPilot</div>
        <div style={{ fontSize: 10, opacity: 0.8, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Today: £12.50 · avoid zone for £0 (+6 min)</div>
      </div>
      <div style={{ fontSize: 9, opacity: 0.55 }}>7:30</div>
    </div>
  );
}

/* ============ NOTIFICATION PREVIEW (in-page, larger) ============ */

function NotificationPreview({ enabled }: { enabled: boolean }) {
  const { t } = useTheme();
  return (
    <div style={{
      borderRadius: 18, padding: 16, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, #111827, #1E293B)`,
      border: `1px solid ${t.border}`,
      opacity: enabled ? 1 : 0.45,
      transition: 'opacity 0.2s ease',
    }}>
      <div style={{
        display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px',
        background: 'rgba(255,255,255,0.08)', borderRadius: 14, backdropFilter: 'blur(20px)',
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FDC500', color: '#0A0F1C', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TP</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>TollPilot</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>now</span>
          </div>
          <div style={{ fontSize: 13, color: '#fff', marginTop: 2, fontWeight: 600 }}>Good morning, Justin</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, lineHeight: 1.4 }}>
            Today: £12.50 via ULEZ · or go for £0 (+6 min). Tap to plan.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ ENABLED SHEET ============ */

function EnabledSheet({ onClose }: { onClose: () => void }) {
  const { t } = useTheme();
  // Backdrop: fixed fullscreen, but dim only. Sheet itself is width-capped
  // to the mobile canvas so it never escapes the prototype frame.
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 60,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{
          width: '100%', maxWidth: 430,
          background: t.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
          padding: '22px 20px 30px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          boxShadow: '0 -12px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 2, background: t.border }} />
        <Pilot size={120} emotion="proud" showScene={false} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Ready for your lock screen</div>
          <div style={{ fontSize: 14, color: t.textSec, marginTop: 6, lineHeight: 1.55 }}>Long-press your lock screen and pick TollPilot to place the widget.</div>
        </div>
        <Btn t={t} v="primary" size="lg" onClick={onClose} full>Got it</Btn>
      </motion.div>
    </motion.div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { t } = useTheme();
  return (
    <button onClick={() => onChange(!value)} aria-pressed={value} style={{
      width: 46, height: 28, borderRadius: 14, border: 'none',
      background: value ? t.primary : t.border, position: 'relative', cursor: 'pointer',
      transition: 'background 0.2s ease', flexShrink: 0,
    }}>
      <motion.div
        animate={{ x: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ position: 'absolute', top: 2, width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
      />
    </button>
  );
}
