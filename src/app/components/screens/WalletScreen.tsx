import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge } from '../tp';
import { Pilot } from '../Pilot';
import { PilotFX } from '../PilotFX';

type Stage = 'overview' | 'add-card' | 'consent' | 'linked' | 'alert' | 'receipt';

interface SavedCard {
  brand: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  exp: string;
  holder: string;
}

const MOCK_RECEIPTS = [
  { id: 'r1', zone: 'London ULEZ', date: 'Today, 5:42pm', amount: '£12.50', fee: '£0.25', status: 'paid' },
  { id: 'r2', zone: 'Dartford Crossing', date: 'Sat 18 Apr', amount: '£2.50', fee: '£0.10', status: 'paid' },
  { id: 'r3', zone: 'Congestion Charge', date: 'Tue 14 Apr', amount: '£15.00', fee: '£0.25', status: 'paid' },
];

export function WalletScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [stage, setStage] = useState<Stage>('overview');
  const [card, setCard] = useState<SavedCard | null>(null);
  const [autopay, setAutopay] = useState(true);
  const [form, setForm] = useState({ number: '', exp: '', cvc: '', name: '' });

  const back = () => {
    if (stage === 'overview') navigate('/dashboard');
    else if (stage === 'add-card') setStage('overview');
    else if (stage === 'consent') setStage('add-card');
    else setStage('overview');
  };

  const title =
    stage === 'add-card' ? 'Add a card' :
    stage === 'consent' ? 'How Smart Wallet works' :
    stage === 'linked' ? 'Card added' :
    stage === 'alert' ? 'Charge detected' :
    stage === 'receipt' ? 'Receipt' :
    'Smart Wallet';

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={back} title={title} />

      <AnimatePresence mode="wait">
        {stage === 'overview' && (
          <Overview
            key="overview"
            card={card}
            autopay={autopay}
            setAutopay={setAutopay}
            onAdd={() => setStage('add-card')}
            onChargeDemo={() => setStage('alert')}
            onReceipt={() => setStage('receipt')}
          />
        )}
        {stage === 'add-card' && (
          <AddCard
            key="add"
            form={form}
            setForm={setForm}
            onNext={() => setStage('consent')}
          />
        )}
        {stage === 'consent' && (
          <Consent
            key="consent"
            onConfirm={() => {
              const last4 = form.number.replace(/\D/g, '').slice(-4) || '4242';
              setCard({ brand: 'Visa', last4, exp: form.exp || '04/30', holder: form.name || 'Justin Lagos' });
              setStage('linked');
            }}
          />
        )}
        {stage === 'linked' && (
          <LinkedSuccess key="linked" onDone={() => setStage('overview')} />
        )}
        {stage === 'alert' && (
          <ChargeAlert key="alert" autopay={autopay} onPay={() => setStage('receipt')} onBack={() => setStage('overview')} />
        )}
        {stage === 'receipt' && (
          <Receipt key="receipt" onBack={() => setStage('overview')} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ OVERVIEW ============ */

function Overview({ card, autopay, setAutopay, onAdd, onChargeDemo, onReceipt }: {
  card: SavedCard | null; autopay: boolean; setAutopay: (v: boolean) => void;
  onAdd: () => void; onChargeDemo: () => void; onReceipt: () => void;
}) {
  const { t } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <Card t={t} glow={t.primary}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="wallet" s={24} c={t.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em' }}>Smart Wallet</div>
            <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>One tap to settle charges. We never hold your money.</div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: '12px 14px', background: `${t.success}12`, borderRadius: 12, border: `1px solid ${t.success}25` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.success }}>Powered by Stripe · Small handling fee per payment</div>
        </div>
      </Card>

      {/* Card slot */}
      {!card ? (
        <Card t={t}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '6px 0 8px' }}>
            <div style={{ position: "relative", width: 92, height: 92, display: "inline-block" }}><PilotFX emotion="confident" size={92} /><Pilot size={92} emotion="confident"  showScene={false} /></div>
            <div style={{ fontSize: 17, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em' }}>No card on file</div>
            <div style={{ fontSize: 13, color: t.textSec, textAlign: 'center', maxWidth: 300 }}>Add a card to pay charges instantly when we spot them.</div>
          </div>
          <Btn t={t} v="primary" size="lg" onClick={onAdd} full>
            <Icon n="plus" s={18} c="#fff" />
            Add a card
          </Btn>
        </Card>
      ) : (
        <>
          <VisualCard card={card} />

          {/* Auto-pay toggle */}
          <Card t={t}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n="zap" s={22} c={t.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>Auto-pay detected charges</div>
                <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{autopay ? 'On — we settle as soon as we confirm the charge' : 'Off — we\'ll ask every time'}</div>
              </div>
              <Toggle value={autopay} onChange={setAutopay} />
            </div>
          </Card>

          {/* Demo alert trigger */}
          <Btn t={t} v="secondary" size="md" onClick={onChargeDemo} full>
            Preview a charge alert
          </Btn>
        </>
      )}

      {/* How it works */}
      <SectionLabel t={t}>How it works</SectionLabel>
      <Card t={t}>
        {[
          { icon: 'shield', title: 'We never hold your money', body: 'Your card stays with Stripe. We trigger the payment, they handle it.' },
          { icon: 'bell', title: 'We alert you first', body: 'You see the zone, time and amount before anything is paid.' },
          { icon: 'receipt', title: 'Small fee per payment', body: 'A small handling fee keeps TollPilot running. Shown before every charge.' },
        ].map((row, i, arr) => (
          <div key={row.title} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <IconBadge icon={row.icon} color={t.primary} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{row.title}</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, lineHeight: 1.5 }}>{row.body}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* LEDGER — v3 §5.3: positions wallet as the structured record, not a payment utility */}
      {card && (
        <>
          <div style={{
            fontSize: 11, fontWeight: 700, color: t.textTer,
            letterSpacing: '0.08em', marginTop: 6,
          }}>
            YOUR DRIVING LEDGER · THIS MONTH
          </div>

          <Card t={t}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Avoided',  value: '£37.50', color: t.success, sub: '3 reroutes' },
                { label: 'Paid',     value: '£30.00', color: t.primary, sub: '3 charges' },
                { label: 'Disputed', value: '£12.50', color: t.warn,    sub: '1 case open' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 4 }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: t.textTer, marginTop: 2 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <SectionLabel t={t}>Recent charges</SectionLabel>
            <div style={{ fontSize: 11, color: t.textTer, margin: '0 0 6px 2px' }}>
              Every charge, every receipt, structured and exportable.
            </div>
          </div>
          <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
            {MOCK_RECEIPTS.map((r, i) => (
              <div key={r.id} onClick={onReceipt} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < MOCK_RECEIPTS.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer',
              }}>
                <IconBadge icon="receipt" color={t.success} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{r.zone}</div>
                  <div style={{ fontSize: 12, color: t.textSec }}>{r.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{r.amount}</div>
                  <div style={{ fontSize: 11, color: t.textTer }}>fee {r.fee}</div>
                </div>
              </div>
            ))}
          </Card>

          <button
            onClick={() => alert('HMRC-ready CSV export of your entire driving cost history. Production only.')}
            title="HMRC-ready CSV export of your entire driving cost history"
            style={{
              background: 'none', border: `1px dashed ${t.border}`, borderRadius: 12,
              padding: '12px 14px', cursor: 'pointer', color: t.primary,
              fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginTop: 4,
            }}
          >
            Export all records <Icon n="right" s={14} c={t.primary} />
          </button>

          <div style={{ fontSize: 11, color: t.textTer, textAlign: 'center', lineHeight: 1.5, marginTop: 2 }}>
            We don't hold funds. We don't store card numbers.<br />
            Stripe does. We surface what you paid.
          </div>
        </>
      )}
    </motion.div>
  );
}

function VisualCard({ card }: { card: SavedCard }) {
  const { t } = useTheme();
  return (
    <div style={{
      background: `linear-gradient(135deg, ${t.primary}, #0B5FB5)`,
      borderRadius: 22, padding: 22, color: '#fff',
      boxShadow: `0 12px 30px ${t.primary}55`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', opacity: 0.9, fontWeight: 700 }}>SMART WALLET</div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>{card.brand}</div>
      </div>
      <div style={{ fontSize: 22, letterSpacing: '0.18em', fontWeight: 800, marginTop: 28, fontFamily: "'JetBrains Mono', monospace" }}>
        •••• •••• •••• {card.last4}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, opacity: 0.75, letterSpacing: '0.08em' }}>CARDHOLDER</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{card.holder}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, opacity: 0.75, letterSpacing: '0.08em' }}>EXPIRES</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{card.exp}</div>
        </div>
      </div>
    </div>
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

/* ============ ADD CARD ============ */

function AddCard({ form, setForm, onNext }: { form: any; setForm: (v: any) => void; onNext: () => void }) {
  const { t } = useTheme();
  const ready = form.number.replace(/\D/g, '').length >= 12 && form.exp.length >= 4 && form.cvc.length >= 3 && form.name.length >= 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: "relative", width: 72, height: 72, display: "inline-block" }}><PilotFX emotion="focused" size={72} /><Pilot size={72} emotion="focused"  showScene={false} /></div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri }}>Add your card</div>
          <div style={{ fontSize: 13, color: t.textSec }}>Stored securely by Stripe.</div>
        </div>
      </div>

      <Field t={t} label="Card number" value={form.number} onChange={v => setForm({ ...form, number: formatCardNumber(v) })} placeholder="1234 1234 1234 1234" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field t={t} label="Expiry" value={form.exp} onChange={v => setForm({ ...form, exp: formatExp(v) })} placeholder="MM/YY" />
        <Field t={t} label="CVC" value={form.cvc} onChange={v => setForm({ ...form, cvc: v.replace(/\D/g, '').slice(0, 4) })} placeholder="123" />
      </div>
      <Field t={t} label="Name on card" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Justin Lagos" />

      <div style={{ marginTop: 6, padding: '12px 14px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon n="lock" s={16} c={t.textSec} />
        <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.5 }}>Card details never touch our servers. Stripe handles storage and PCI compliance.</div>
      </div>

      <Btn t={t} v="primary" size="lg" onClick={onNext} disabled={!ready} full>Continue</Btn>
    </motion.div>
  );
}

function Field({ t, label, value, onChange, placeholder }: { t: any; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>{label.toUpperCase()}</div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: t.card, color: t.textPri, border: `1px solid ${t.border}`,
          borderRadius: 14, padding: '14px 16px', fontSize: 15, fontWeight: 600, outline: 'none',
          fontFamily: label === 'Card number' || label === 'Expiry' || label === 'CVC' ? "'JetBrains Mono', monospace" : 'inherit',
          letterSpacing: label === 'Card number' ? '0.08em' : 'normal',
        }}
      />
    </div>
  );
}

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExp(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return digits.slice(0, 2) + '/' + digits.slice(2);
}

/* ============ CONSENT ============ */

function Consent({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useTheme();
  const [checked, setChecked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <div style={{ position: "relative", width: 120, height: 120, display: "inline-block" }}><PilotFX emotion="confident" size={120} /><Pilot size={120} emotion="confident"  showScene={false} /></div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Quick heads-up</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 6, lineHeight: 1.5 }}>Here's exactly how your money moves. No surprises.</div>
      </div>

      <Card t={t}>
        {[
          { icon: 'shield', title: 'We do not hold your funds', body: 'Your card lives with Stripe. We never touch the money.' },
          { icon: 'bell', title: 'You\'re always notified first', body: 'Every charge shows zone, time, amount and fee before it\'s paid.' },
          { icon: 'pound', title: 'A small handling fee applies', body: 'A flat handling fee per charge. Shown clearly every time.' },
          { icon: 'lock', title: 'You can stop or refund anytime', body: 'Cancel auto-pay, remove your card or request a refund in one tap.' },
        ].map((row, i, arr) => (
          <div key={row.title} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <IconBadge icon={row.icon} color={t.primary} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>{row.title}</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, lineHeight: 1.5 }}>{row.body}</div>
            </div>
          </div>
        ))}
      </Card>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, cursor: 'pointer' }}>
        <div
          onClick={e => { e.preventDefault(); setChecked(!checked); }}
          style={{
            width: 22, height: 22, borderRadius: 6, marginTop: 1,
            background: checked ? t.primary : 'transparent',
            border: `2px solid ${checked ? t.primary : t.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          {checked && <Icon n="check" s={14} c="#fff" sw={3} />}
        </div>
        <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>
          I understand TollPilot does not hold funds, uses Stripe to store my card, and charges a handling fee per payment.
        </div>
      </label>

      <Btn t={t} v="primary" size="lg" onClick={onConfirm} disabled={!checked} full>Link card with Stripe</Btn>
    </motion.div>
  );
}

/* ============ LINKED SUCCESS ============ */

function LinkedSuccess({ onDone }: { onDone: () => void }) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}
    >
      <div style={{ position: "relative", width: 160, height: 160, display: "inline-block" }}><PilotFX emotion="celebrating" size={160} /><Pilot size={160} emotion="celebrating"  showScene={false} /></div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Card linked</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
          We're ready to settle charges the moment they appear.<br />
          You'll see them first. Always.
        </div>
      </div>
      <Btn t={t} v="primary" size="lg" onClick={onDone} full>Done</Btn>
    </motion.div>
  );
}

/* ============ CHARGE ALERT ============ */

function ChargeAlert({ autopay, onPay, onBack }: { autopay: boolean; onPay: () => void; onBack: () => void }) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: "relative", width: 72, height: 72, display: "inline-block" }}><PilotFX emotion="alert" size={72} /><Pilot size={72} emotion="alert"  showScene={false} /></div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>We spotted a charge</div>
          <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>Here are the facts before we settle it.</div>
        </div>
      </div>

      <Card t={t} glow={t.accent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em' }}>LONDON ULEZ</div>
            <div style={{ fontSize: 14, color: t.textSec, marginTop: 4 }}>Today · 17:42 · Stratford → City</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: t.textTer }}>Charge</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: t.textPri }}>£12.50</div>
          </div>
        </div>
      </Card>

      <Card t={t}>
        {[
          { label: 'Zone charge', value: '£12.50' },
          { label: 'Handling fee', value: '£0.25' },
        ].map((row, i, arr) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontSize: 13, color: t.textSec }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.textPri }}>{row.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 4, borderTop: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: t.textPri }}>Total</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: t.textPri }}>£12.75</span>
        </div>
      </Card>

      <div style={{ padding: '12px 14px', background: `${t.primary}10`, borderRadius: 12, border: `1px solid ${t.primary}22`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon n="shield" s={16} c={t.primary} />
        <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.5 }}>
          {autopay
            ? 'Auto-pay is on. Stripe will charge your card now. You can refund this in one tap.'
            : 'Auto-pay is off. Nothing will be paid unless you tap Pay now.'}
        </div>
      </div>

      <Btn t={t} v="primary" size="lg" onClick={onPay} full>
        {autopay ? 'Settle now · £12.75' : 'Pay now · £12.75'}
      </Btn>
      <Btn t={t} v="secondary" size="md" onClick={onBack} full>I'll handle this myself</Btn>
    </motion.div>
  );
}

/* ============ RECEIPT ============ */

function Receipt({ onBack }: { onBack: () => void }) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ position: "relative", width: 120, height: 120, display: "inline-block" }}><PilotFX emotion="relieved" size={120} /><Pilot size={120} emotion="relieved"  showScene={false} /></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Paid · £12.75</div>
          <div style={{ fontSize: 13, color: t.textSec, marginTop: 4 }}>Stripe receipt · Today 17:43</div>
        </div>
      </div>

      <Card t={t}>
        {[
          { label: 'Zone', value: 'London ULEZ' },
          { label: 'Date', value: 'Today, 17:42' },
          { label: 'Route', value: 'Stratford → City' },
          { label: 'Zone charge', value: '£12.50' },
          { label: 'Handling fee', value: '£0.25' },
          { label: 'Paid with', value: 'Visa •••• 4242' },
          { label: 'Stripe ref', value: 'pi_3Rt2Xa4ULEZ' },
        ].map((row, i, arr) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontSize: 13, color: t.textSec }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.textPri }}>{row.value}</span>
          </div>
        ))}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Btn t={t} v="secondary" size="md" onClick={() => {}} full>
          <Icon n="download" s={16} c={t.textPri} /> PDF
        </Btn>
        <Btn t={t} v="secondary" size="md" onClick={() => {}} full>
          <Icon n="share" s={16} c={t.textPri} /> Share
        </Btn>
      </div>

      <Btn t={t} v="primary" size="lg" onClick={onBack} full>Back to wallet</Btn>
    </motion.div>
  );
}
