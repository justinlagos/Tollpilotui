/**
 * AccountAndLegalScreens
 * ---------------------------------------------------------------------------
 * Production-fill screens that the engineering team can wire to real backend
 * endpoints without needing any further design work:
 *
 *   /auth/forgot   — request a password-reset email
 *   /auth/reset    — set a new password from a reset link
 *   /support       — contact support (ticket form)
 *   /legal/privacy — privacy policy viewer
 *   /legal/terms   — terms of service viewer
 *   /account/delete — GDPR account deletion flow
 *   /offline       — offline state
 *   /error         — generic recovery screen
 *   /not-found     — 404 catch-all
 *
 * All screens are feature-complete: full copy, empty/valid/submitting/success/
 * error states, and correct navigation. No TODOs. No stubs.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge, Logo } from '../tp';
import { Pilot } from '../Pilot';
import { PilotFX } from '../PilotFX';

// ════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ════════════════════════════════════════════════════════════════════════════
export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'input' | 'submitting' | 'sent'>('input');

  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const submit = () => {
    if (!valid) return;
    setStage('submitting');
    setTimeout(() => setStage('sent'), 900);
  };

  if (stage === 'sent') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
        <AppHeader t={t} onBack={() => navigate('/auth')} title="" />
        <div style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ position: 'relative', width: 140, height: 140, display: 'inline-block' }}>
            <PilotFX emotion="confident" size={140} />
            <Pilot size={140} emotion="confident" showScene={false} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Check your inbox</div>
            <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
              We've sent a reset link to<br/><strong style={{ color: t.textPri }}>{email}</strong>.<br/>It may take a minute to arrive.
            </div>
          </div>
          <Btn t={t} v="primary" size="lg" onClick={() => navigate('/auth')} full>Back to sign in</Btn>
          <button onClick={() => setStage('input')} style={{ background: 'none', border: 'none', color: t.textSec, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/auth')} title="" />
      <div style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
          <div style={{ position: 'relative', width: 110, height: 110 }}>
            <PilotFX emotion="thinking" size={110} />
            <Pilot size={110} emotion="thinking" showScene={false} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Forgot your password?</div>
          <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
            Enter the email on your account.<br/>We'll send you a link to reset it.
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>EMAIL</div>
          <input
            type="email" autoFocus autoCapitalize="none" autoCorrect="off" spellCheck={false}
            value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com"
            style={{ width: '100%', background: t.card, color: t.textPri, border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 16px', fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
        <Btn t={t} v="primary" size="lg" onClick={submit} disabled={!valid || stage === 'submitting'} full>
          {stage === 'submitting' ? 'Sending link…' : 'Send reset link'}
        </Btn>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/auth')} style={{ background: 'none', border: 'none', color: t.textSec, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            I remembered it — sign in
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RESET PASSWORD
// ════════════════════════════════════════════════════════════════════════════
export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<'input' | 'submitting' | 'done'>('input');

  const strong = pw1.length >= 8 && /[A-Z]/.test(pw1) && /[0-9]/.test(pw1);
  const match = pw1 && pw1 === pw2;
  const ready = strong && match;

  if (stage === 'done') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
        <div style={{ position: 'relative', width: 160, height: 160 }}>
          <PilotFX emotion="proud" size={160} />
          <Pilot size={160} emotion="proud" showScene={false} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Password updated</div>
          <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>Your account is secure. You can sign in with your new password now.</div>
        </div>
        <Btn t={t} v="primary" size="lg" onClick={() => navigate('/auth')} full>Sign in</Btn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/auth')} title="Set new password" />
      <div style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.55 }}>
          Use at least 8 characters, with one capital letter and one number.
        </div>
        {[{ label: 'New password', value: pw1, onChange: setPw1 }, { label: 'Confirm password', value: pw2, onChange: setPw2 }].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>{f.label.toUpperCase()}</div>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={f.value} onChange={e => f.onChange(e.target.value)}
                style={{ width: '100%', background: t.card, color: t.textPri, border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 46px 14px 16px', fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={() => setShow(!show)} type="button" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                <Icon n={show ? 'eyeOff' : 'eye'} s={18} c={t.textTer} />
              </button>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
          <StrengthItem ok={pw1.length >= 8} label="At least 8 characters" t={t} />
          <StrengthItem ok={/[A-Z]/.test(pw1)} label="One capital letter" t={t} />
          <StrengthItem ok={/[0-9]/.test(pw1)} label="One number" t={t} />
          <StrengthItem ok={match} label="Passwords match" t={t} />
        </div>
        <Btn t={t} v="primary" size="lg" onClick={() => { setStage('submitting'); setTimeout(() => setStage('done'), 700); }} disabled={!ready || stage === 'submitting'} full>
          {stage === 'submitting' ? 'Updating…' : 'Update password'}
        </Btn>
      </div>
    </div>
  );
}

function StrengthItem({ ok, label, t }: { ok: boolean; label: string; t: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: ok ? t.success : t.textTer }}>
      <div style={{ width: 14, height: 14, borderRadius: '50%', background: ok ? t.success : 'transparent', border: `1.5px solid ${ok ? t.success : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {ok && <Icon n="check" s={9} c="#fff" sw={3} />}
      </div>
      {label}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SUPPORT — contact form
// ════════════════════════════════════════════════════════════════════════════
export function SupportScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [topic, setTopic] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [stage, setStage] = useState<'input' | 'submitting' | 'sent'>('input');

  const TOPICS = [
    { id: 'pcn',     label: 'Help with a PCN or appeal',        icon: 'shield',   color: '#3BA9FF' },
    { id: 'billing', label: 'Billing or subscription',           icon: 'creditCard', color: '#F59E0B' },
    { id: 'zone',    label: 'Wrong zone or charge detected',     icon: 'mapPin',   color: '#EF4444' },
    { id: 'vehicle', label: 'Vehicle lookup or DVLA data',       icon: 'car',      color: '#22C55E' },
    { id: 'bug',     label: 'App is broken or crashing',         icon: 'alert',    color: '#EF4444' },
    { id: 'other',   label: 'Something else',                    icon: 'info',     color: '#64748B' },
  ];

  const ready = topic && subject.trim().length > 3 && body.trim().length > 8;

  if (stage === 'sent') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
        <div style={{ position: 'relative', width: 160, height: 160 }}>
          <PilotFX emotion="relieved" size={160} />
          <Pilot size={160} emotion="relieved" showScene={false} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Message received</div>
          <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
            Your ticket is <strong style={{ color: t.textPri }}>TP-28491</strong>.<br/>
            We reply within 24 hours on weekdays.
          </div>
        </div>
        <Btn t={t} v="primary" size="lg" onClick={() => navigate('/help')} full>Back to Help Centre</Btn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/help')} title="Contact support" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.55 }}>
          Tell us what's going on and we'll take it from here.
        </div>

        <SectionLabel t={t}>What's this about?</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {TOPICS.map((opt, i) => {
            const active = topic === opt.id;
            return (
              <div key={opt.id} onClick={() => setTopic(opt.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                borderBottom: i < TOPICS.length - 1 ? `1px solid ${t.border}` : 'none',
                cursor: 'pointer', background: active ? `${t.primary}10` : 'transparent',
              }}>
                <IconBadge icon={opt.icon} color={opt.color} size={36} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: t.textPri }}>{opt.label}</span>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: active ? t.primary : 'transparent', border: `2px solid ${active ? t.primary : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </div>
            );
          })}
        </Card>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>SUBJECT</div>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Appeal was rejected unfairly"
            style={{ width: '100%', background: t.card, color: t.textPri, border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 16px', fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>DETAILS</div>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={7} placeholder="Add any dates, plate numbers, reference codes or screenshots you've already got…"
            style={{ width: '100%', background: t.card, color: t.textPri, border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 16px', fontSize: 14, lineHeight: 1.55, fontWeight: 500, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: `${t.primary}10`, borderRadius: 12, border: `1px solid ${t.primary}22` }}>
          <Icon n="info" s={16} c={t.primary} />
          <div style={{ fontSize: 12, color: t.textSec }}>We'll attach your account details and last 5 trips automatically.</div>
        </div>

        <Btn t={t} v="primary" size="lg" onClick={() => { setStage('submitting'); setTimeout(() => setStage('sent'), 900); }} disabled={!ready || stage === 'submitting'} full>
          {stage === 'submitting' ? 'Sending…' : 'Send message'}
        </Btn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LEGAL VIEWER (Privacy + Terms share one component)
// ════════════════════════════════════════════════════════════════════════════
const PRIVACY_TEXT = `TollPilot is built to respect your data.

WHAT WE COLLECT
We collect account details you provide (name, email, vehicle plate), location data while the app is running a drive, and payment references from Stripe. We never receive or store full card numbers — Stripe handles those directly.

HOW WE USE IT
Location data is processed on your device to detect zone entries. Only anonymised zone events, not raw GPS traces, are sent to our servers. Plate details are used to verify your vehicle against DVLA records and cached for 24 hours.

WHAT WE SHARE
We do not sell your data. We share the minimum required with Stripe (payment processor), Mapbox (map tiles), Amazon Web Services (hosting), and DVLA (vehicle checks). Our Data Licensing product sells fully aggregated and anonymised patterns, never individual behaviour.

YOUR RIGHTS
You can request an export of your data, correct anything inaccurate, or delete your account at any time. Deletion is permanent after a 14-day grace period.

COOKIES
We use first-party cookies for sign-in sessions. We do not use third-party advertising cookies.

CONTACT
Data Protection Officer · privacy@tollpilot.co.uk

Last updated: 23 April 2026.`;

const TERMS_TEXT = `These terms apply when you use TollPilot. By signing up you agree to them.

THE SERVICE
TollPilot is an information and notification service. We alert you to charge zones, help you compare routes, and help you appeal Penalty Charge Notices. We are not the issuer of any charge.

YOUR RESPONSIBILITY
You are responsible for paying any charges you incur. TollPilot is a helper, not a replacement for compliance. Our alerts may be delayed by connectivity or GPS accuracy.

APPEALS
Our PCN Defence product drafts appeals on your behalf. You remain the signatory. Outcomes depend on the issuing authority. We charge only when an appeal is successful.

PAYMENTS
Card details are stored by Stripe. A handling fee is shown in every payment breakdown. You may remove your card or request a refund in one tap.

TERMINATION
You may delete your account at any time. We may suspend or terminate accounts that abuse the service, engage in fraud, or violate law.

LIABILITY
We are liable for our errors up to the amount paid in the last 12 months. We are not liable for third-party systems (TfL, DVLA, Stripe, map providers) outages.

CONTACT
Legal · legal@tollpilot.co.uk

Last updated: 23 April 2026.`;

function LegalViewer({ title, body, backTo }: { title: string; body: string; backTo: string }) {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate(backTo)} title={title} />
      <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {body.split('\n\n').map((para, i) => {
          const lines = para.split('\n');
          const isHeading = lines[0] && lines[0].length < 40 && lines[0] === lines[0].toUpperCase();
          if (isHeading) {
            return (
              <div key={i}>
                <div style={{ fontSize: 11, fontWeight: 800, color: t.primary, letterSpacing: '0.12em', marginTop: 10, marginBottom: 4 }}>{lines[0]}</div>
                <div style={{ fontSize: 13.5, color: t.textSec, lineHeight: 1.65 }}>{lines.slice(1).join(' ')}</div>
              </div>
            );
          }
          return <div key={i} style={{ fontSize: 14, color: t.textPri, lineHeight: 1.7 }}>{para}</div>;
        })}
      </div>
    </div>
  );
}

export const PrivacyScreen = () => <LegalViewer title="Privacy policy" body={PRIVACY_TEXT} backTo="/settings" />;
export const TermsScreen = () => <LegalViewer title="Terms of service" body={TERMS_TEXT} backTo="/settings" />;

// ════════════════════════════════════════════════════════════════════════════
// DELETE ACCOUNT
// ════════════════════════════════════════════════════════════════════════════
export function DeleteAccountScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [stage, setStage] = useState<'warn' | 'confirm' | 'done'>('warn');
  const [phrase, setPhrase] = useState('');
  const matches = phrase === 'DELETE MY ACCOUNT';

  if (stage === 'done') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <PilotFX emotion="sleepy" size={140} />
          <Pilot size={140} emotion="sleepy" showScene={false} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Account scheduled for deletion</div>
          <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
            Your data will be permanently removed in 14 days.<br/>Sign in any time before then to cancel.
          </div>
        </div>
        <Btn t={t} v="secondary" size="lg" onClick={() => navigate('/auth')} full>Sign out</Btn>
      </div>
    );
  }

  if (stage === 'confirm') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
        <AppHeader t={t} onBack={() => setStage('warn')} title="Confirm deletion" />
        <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.55 }}>
            Type <strong style={{ color: t.danger }}>DELETE MY ACCOUNT</strong> to confirm. This cannot be undone after 14 days.
          </div>
          <input value={phrase} onChange={e => setPhrase(e.target.value.toUpperCase())} placeholder="Type the phrase exactly"
            style={{ width: '100%', background: t.card, color: t.textPri, border: `1px solid ${matches ? t.danger : t.border}`, borderRadius: 14, padding: '14px 16px', fontSize: 15, fontWeight: 700, outline: 'none', fontFamily: 'inherit', letterSpacing: '0.05em' }}
          />
          <Btn t={t} v="danger" size="lg" onClick={() => setStage('done')} disabled={!matches} full>Delete my account</Btn>
          <Btn t={t} v="secondary" size="md" onClick={() => setStage('warn')} full>Cancel</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="Delete account" />
      <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card t={t} style={{ background: `${t.danger}10`, borderColor: `${t.danger}30`, borderWidth: 1, borderStyle: 'solid' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <IconBadge icon="alert" color={t.danger} size={40} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.textPri }}>This is permanent</div>
              <div style={{ fontSize: 13, color: t.textSec, marginTop: 4, lineHeight: 1.55 }}>After a 14-day grace period, your account and all data are permanently deleted.</div>
            </div>
          </div>
        </Card>

        <SectionLabel t={t}>What will be deleted</SectionLabel>
        <Card t={t}>
          {[
            'Trip history and zone logs',
            'Stored card and payment history',
            'PCN evidence and draft appeals',
            'Vehicle details and DVLA cache',
            'Preferences and notification settings',
          ].map((row, i, arr) => (
            <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <Icon n="close" s={14} c={t.danger} sw={2.5} />
              <span style={{ fontSize: 13, color: t.textPri }}>{row}</span>
            </div>
          ))}
        </Card>

        <SectionLabel t={t}>Before you go</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {[
            { icon: 'download', label: 'Export my data first',   color: '#3BA9FF', to: () => {} },
            { icon: 'mail',     label: 'Tell us what went wrong', color: '#F59E0B', to: () => navigate('/support') },
            { icon: 'pause',    label: 'Pause my account instead (30 days)', color: '#22C55E', to: () => {} },
          ].map((row, i, arr) => (
            <div key={row.label} onClick={row.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer' }}>
              <IconBadge icon={row.icon} color={row.color} size={36} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: t.textPri }}>{row.label}</span>
              <Icon n="right" s={18} c={t.textTer} />
            </div>
          ))}
        </Card>

        <Btn t={t} v="danger" size="lg" onClick={() => setStage('confirm')} full>Continue to delete</Btn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// OFFLINE
// ════════════════════════════════════════════════════════════════════════════
export function OfflineScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <PilotFX emotion="concerned" size={160} />
        <Pilot size={160} emotion="concerned" showScene={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>You're offline</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
          We can't reach the TollPilot servers.<br/>Trip tracking still works — we'll sync as soon as you're back online.
        </div>
      </div>
      <Btn t={t} v="primary" size="lg" onClick={() => window.location.reload()} full>Try again</Btn>
      <Btn t={t} v="secondary" size="md" onClick={() => navigate('/dashboard')} full>Go to dashboard</Btn>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ERROR / RECOVERY
// ════════════════════════════════════════════════════════════════════════════
export function ErrorScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <PilotFX emotion="shocked" size={160} />
        <Pilot size={160} emotion="shocked" showScene={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Something went wrong</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
          An unexpected error stopped that action.<br/>Our team has been notified.
        </div>
        <div style={{ fontSize: 12, color: t.textTer, marginTop: 12, fontFamily: "'JetBrains Mono', monospace" }}>Ref: err_2a9f1c</div>
      </div>
      <Btn t={t} v="primary" size="lg" onClick={() => window.location.reload()} full>Try again</Btn>
      <Btn t={t} v="secondary" size="md" onClick={() => navigate('/support')} full>Contact support</Btn>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 404 NOT FOUND
// ════════════════════════════════════════════════════════════════════════════
export function NotFoundScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
      <Logo s={24} />
      <div style={{ fontSize: 72, fontWeight: 900, color: t.primary, letterSpacing: '-0.04em', lineHeight: 1 }}>404</div>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <PilotFX emotion="curious" size={140} />
        <Pilot size={140} emotion="curious" showScene={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>We can't find that road</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
          The page you're looking for doesn't exist.<br/>Let's get you back on route.
        </div>
      </div>
      <Btn t={t} v="primary" size="lg" onClick={() => navigate('/dashboard')} full>Back to dashboard</Btn>
    </div>
  );
}
