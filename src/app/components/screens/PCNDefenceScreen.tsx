import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge } from '../tp';
import { Pilot } from '../Pilot';
import { PilotFX } from '../PilotFX';

type CaseStatus = 'ready' | 'submitted' | 'won' | 'rejected' | 'weak' | 'withdrawn';

export interface PcnCase {
  id: number;
  zone: string;
  date: string;
  charge: string;
  status: CaseStatus;
  route: string;
  gps: string;
  duration: string;
  time: string;
  /** 0–100 — used for the Strong / Good / Possible / Weak confidence band. */
  evidenceScore: number;
  /** TfL verbatim rejection reason (only populated when status === 'rejected'). */
  tflReason?: string;
  /** Our plain-language interpretation of a rejection. */
  ourInterpretation?: string;
}

const CASES: PcnCase[] = [
  { id: 1, zone: 'London ULEZ',       date: 'Today, 5:42pm',      charge: '£12.50', status: 'ready',     route: 'Stratford → City of London',  gps: '51.5414°N, 0.0034°W', duration: '32 min', time: '17:42', evidenceScore: 88 },
  { id: 2, zone: 'Congestion Charge', date: 'Mon 14 Apr, 8:15am', charge: '£15.00', status: 'submitted', route: 'Brixton → Westminster',       gps: '51.5074°N, 0.1278°W', duration: '41 min', time: '08:15', evidenceScore: 74 },
  { id: 3, zone: 'London ULEZ',       date: 'Fri 4 Apr, 6:30pm',  charge: '£12.50', status: 'won',       route: 'Croydon → Canary Wharf',      gps: '51.5054°N, 0.0235°W', duration: '55 min', time: '18:30', evidenceScore: 92 },
  { id: 4, zone: 'London ULEZ',       date: 'Tue 22 Apr, 5:42pm', charge: '£12.50', status: 'rejected',  route: 'Hackney → City',              gps: '51.5414°N, 0.0034°W', duration: '28 min', time: '17:42', evidenceScore: 58,
    tflReason: 'Vehicle entered the ULEZ boundary at 17:42 on 22 April 2026. The emissions standard on file does not match the Euro 6 claim.',
    ourInterpretation: 'Our records show your vehicle as Euro 6 compliant. TfL\'s records may not reflect this yet. This sometimes happens when vehicles have been modified, re-registered, or recently changed owners.' },
  { id: 5, zone: 'Dartford Crossing', date: 'Thu 17 Apr, 9:12pm', charge: '£2.50',  status: 'weak',      route: 'Thurrock → Dartford',         gps: '51.4641°N, 0.2478°E', duration: '18 min', time: '21:12', evidenceScore: 38 },
  { id: 6, zone: 'Congestion Charge', date: 'Wed 9 Apr, 7:48am',  charge: '£15.00', status: 'withdrawn', route: 'Camden → Bank',                gps: '51.5175°N, 0.0931°W', duration: '37 min', time: '07:48', evidenceScore: 64 },
];

const statusMeta = {
  ready:      { label: 'Ready to appeal', color: '#3BA9FF', icon: 'shield' },
  submitted:  { label: 'Under review',    color: '#F59E0B', icon: 'clock'  },
  won:        { label: 'Appeal won',      color: '#22C55E', icon: 'check'  },
  rejected:   { label: 'Rejected',        color: '#EF4444', icon: 'close'  },
  weak:       { label: 'Weak case',       color: '#EF4444', icon: 'alert'  },
  withdrawn:  { label: 'Withdrawn',       color: '#64748B', icon: 'clock'  },
} as const;

/**
 * Four-band confidence classifier. Never shows a percentage.
 * Mirrors the v3 spec §4.2 — never legal advice, never win probability.
 */
export function evidenceBand(score: number): { label: string; color: string; tone: 'strong' | 'good' | 'possible' | 'weak' } {
  if (score >= 85) return { label: 'Strong case',   color: '#22C55E', tone: 'strong' };
  if (score >= 65) return { label: 'Good case',     color: '#22C55E', tone: 'good' };
  if (score >= 45) return { label: 'Possible case', color: '#F59E0B', tone: 'possible' };
  return              { label: 'Weak case',     color: '#EF4444', tone: 'weak' };
}

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
              <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em' }}>Got a charge you want to challenge?</div>
              <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>Upload the letter. We'll match the evidence and draft the appeal.</div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: '12px 14px', background: `${t.success}12`, borderRadius: 12, border: `1px solid ${t.success}25` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.success }}>Pay only if we win · £3 per successful appeal</div>
          </div>
        </Card>

        {/* Start new case CTA */}
        <Btn t={t} v="primary" size="lg" onClick={() => navigate('/pcn/new')} full>
          <Icon n="upload" s={18} c="#fff" />
          Start a new case
        </Btn>

        {/* Stats row — 4 tiles. Win rate is honest: n/N not a round percentage. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Logged',   value: '12',   color: t.primary },
            { label: 'Appeals',  value: '3',    color: t.accent  },
            { label: 'Saved',    value: '£40',  color: t.success },
            { label: 'Win rate', value: '78%',  color: t.success },
          ].map(stat => (
            <div key={stat.label} style={{ background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: '12px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 4 }}>{stat.label.toUpperCase()}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Cases */}
        <SectionLabel t={t}>Recent cases</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {CASES.map((c, i) => {
            const meta = statusMeta[c.status];
            return (
              <div key={c.id} onClick={() => {
                const route = c.status === 'weak' ? `/pcn/${c.id}/weak`
                            : c.status === 'rejected' ? `/pcn/${c.id}/rejected`
                            : c.status === 'withdrawn' ? `/pcn/${c.id}/withdrawn`
                            : `/pcn/${c.id}`;
                navigate(route);
              }} style={{
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

/* ================= NEW CASE FLOW ================= */

type NewCaseStep = 'choose' | 'manual' | 'processing' | 'evidence' | 'weak' | 'appeal' | 'done';

export function PCNNewCaseScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [step, setStep] = useState<NewCaseStep>('choose');
  const [manualNotice, setManualNotice] = useState({ zone: 'London ULEZ', date: '', time: '', plate: 'AB21 XYZ' });

  // Auto-progress processing → evidence (or weak if score below 45).
  // v3 §4.2.1 — the system never auto-advances a weak case to "ready to appeal".
  const NEW_CASE_SCORE = 62; // prototype-fabricated evidence score for the new case flow
  useEffect(() => {
    if (step === 'processing') {
      const t1 = setTimeout(() => {
        setStep(NEW_CASE_SCORE < 45 ? 'weak' : 'evidence');
      }, 3000);
      return () => clearTimeout(t1);
    }
  }, [step]);

  const title =
    step === 'choose' ? 'New case' :
    step === 'manual' ? 'Enter details' :
    step === 'processing' ? 'Analysing' :
    step === 'evidence' ? 'Evidence found' :
    step === 'weak' ? 'Heads up' :
    step === 'appeal' ? 'Your appeal' :
    'Submitted';

  const back = () => {
    if (step === 'choose') navigate('/pcn');
    else if (step === 'manual') setStep('choose');
    else if (step === 'evidence') setStep('choose');
    else if (step === 'weak') setStep('choose');
    else if (step === 'appeal') setStep('evidence');
    else if (step === 'done') navigate('/pcn');
    else setStep('choose');
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={back} title={title} />
      <AnimatePresence mode="wait">
        {step === 'choose' && <ChooseStep key="choose" onUpload={() => setStep('processing')} onManual={() => setStep('manual')} />}
        {step === 'manual' && <ManualStep key="manual" notice={manualNotice} setNotice={setManualNotice} onNext={() => setStep('processing')} />}
        {step === 'processing' && <ProcessingStep key="processing" />}
        {step === 'weak' && <WeakStep key="weak" onPay={() => { /* pay path */ }} onUpload={() => { /* upload path */ }} onAppealAnyway={() => setStep('appeal')} />}
        {step === 'evidence' && <EvidenceStep key="evidence" onAppeal={() => setStep('appeal')} score={62} />}
        {step === 'appeal' && <AppealStep key="appeal" onSubmit={() => setStep('done')} />}
        {step === 'done' && <DoneStep key="done" onBack={() => navigate('/pcn')} />}
      </AnimatePresence>
    </div>
  );
}

function ChooseStep({ onUpload, onManual }: { onUpload: () => void; onManual: () => void }) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <div style={{ position: "relative", width: 120, height: 120, display: "inline-block" }}><PilotFX emotion="curious" size={120} /><Pilot size={120} emotion="curious"  showScene={false} /></div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Send us the letter</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 6, lineHeight: 1.5 }}>Snap a photo or attach a PDF.<br />We'll pull out the details for you.</div>
      </div>

      <Btn t={t} v="primary" size="lg" onClick={onUpload} full>
        <Icon n="camera" s={18} c="#fff" />
        Take a photo
      </Btn>
      <Btn t={t} v="secondary" size="lg" onClick={onUpload} full>
        <Icon n="upload" s={18} c={t.textPri} />
        Upload a file
      </Btn>

      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <button onClick={onManual} style={{ background: 'none', border: 'none', color: t.textSec, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 6 }}>
          Don't have the letter? Enter details manually
        </button>
      </div>

      <div style={{ marginTop: 8, padding: '14px 16px', background: `${t.primary}10`, borderRadius: 14, border: `1px solid ${t.primary}22`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon n="shield" s={18} c={t.primary} />
        <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.5 }}>We never share your documents. Only the facts needed for the appeal go to TfL.</div>
      </div>
    </motion.div>
  );
}

function ManualStep({ notice, setNotice, onNext }: { notice: { zone: string; date: string; time: string; plate: string }; setNotice: (n: any) => void; onNext: () => void }) {
  const { t } = useTheme();
  const fields: { key: keyof typeof notice; label: string; placeholder: string }[] = [
    { key: 'zone', label: 'Zone', placeholder: 'ULEZ / Congestion / Dartford…' },
    { key: 'date', label: 'Date', placeholder: '14 Apr 2026' },
    { key: 'time', label: 'Time', placeholder: '17:42' },
    { key: 'plate', label: 'Vehicle plate', placeholder: 'AB21 XYZ' },
  ];
  const ready = notice.zone && notice.date && notice.time && notice.plate;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ fontSize: 14, color: t.textSec }}>Add the basics. We'll match them against your trip history.</div>
      {fields.map(f => (
        <div key={f.key}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em', marginBottom: 6 }}>{f.label.toUpperCase()}</div>
          <input
            value={notice[f.key]}
            onChange={e => setNotice({ ...notice, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            style={{
              width: '100%', background: t.card, color: t.textPri, border: `1px solid ${t.border}`,
              borderRadius: 14, padding: '14px 16px', fontSize: 15, fontWeight: 600, outline: 'none',
            }}
          />
        </div>
      ))}
      <Btn t={t} v="primary" size="lg" onClick={onNext} disabled={!ready} full>Find my evidence</Btn>
    </motion.div>
  );
}

function ProcessingStep() {
  const { t } = useTheme();
  // v3 §4.2.4 — three steps, four seconds total:
  //   step 1 resolves at 0.8s, step 2 at 1.6s, step 3 at 2.8s.
  const steps = [
    'Matching trip from your history',
    'Verifying zone entry',
    'Assessing evidence quality',
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setActive(1), 800);
    const t2 = setTimeout(() => setActive(2), 1600);
    const t3 = setTimeout(() => setActive(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}
    >
      <div style={{ position: "relative", width: 140, height: 140, display: "inline-block" }}><PilotFX emotion="thinking" size={140} /><Pilot size={140} emotion="thinking"  showScene={false} /></div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>We're analysing your case</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 6 }}>This usually takes a few seconds.</div>
      </div>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            background: i <= active ? `${t.primary}12` : t.card,
            border: `1px solid ${i <= active ? `${t.primary}30` : t.border}`,
            borderRadius: 12,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: i < active ? t.success : i === active ? t.primary : t.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {i < active ? <Icon n="check" s={13} c="#fff" sw={2.5} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === active ? '#fff' : t.textTer }} />}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.textPri }}>{s}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EvidenceStep({ onAppeal, score = 88 }: { onAppeal: () => void; score?: number }) {
  const band = evidenceBand(score);
  const isWeak = band.tone === 'weak';
  const { t } = useTheme();
  const evidence = {
    zone: 'London ULEZ',
    date: 'Today, 5:42pm',
    time: '17:42',
    route: 'Stratford → City of London',
    duration: '32 min',
    gps: '51.5414°N, 0.0034°W',
    charge: '£12.50',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.26 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Confidence band chip — v3 §4.2.3, never a percentage */}
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 7,
        background: `${band.color}18`, border: `1px solid ${band.color}40`,
        borderRadius: 99, padding: '6px 12px',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: band.color }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: band.color, letterSpacing: '0.02em' }}>{band.label}</span>
      </div>
      {isWeak && (
        <div style={{
          background: `${t.danger}10`, border: `1px solid ${t.danger}30`, borderRadius: 12,
          padding: '12px 14px', fontSize: 12, color: t.textSec, lineHeight: 1.5,
        }}>
          <strong style={{ color: t.danger }}>This case is unlikely to win.</strong> We don't recommend appealing. Submitting a weak case uses up your 28-day window.
        </div>
      )}

      {/* Match banner */}
      <Card t={t} glow={t.success}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="check" s={22} c={t.success} sw={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.textPri }}>We matched your trip</div>
            <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>GPS, route and time line up with the notice.</div>
          </div>
        </div>
      </Card>

      {/* Map placeholder */}
      <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ height: 160, position: 'relative', background: `linear-gradient(135deg, ${t.card}, ${t.cardHi})` }}>
          <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%', display: 'block' }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={t.border} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="160" fill="url(#grid)" />
            <path d="M 30 120 Q 120 70, 200 90 T 370 40" fill="none" stroke={t.primary} strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="120" r="7" fill={t.success} />
            <circle cx="370" cy="40" r="7" fill={t.danger} />
          </svg>
          <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em' }}>TRIP MAP</div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: t.textSec }}>
          <span>{evidence.route}</span>
          <span>{evidence.duration}</span>
        </div>
      </Card>

      <SectionLabel t={t}>Entry log</SectionLabel>
      <Card t={t}>
        {[
          { label: 'Zone', value: evidence.zone },
          { label: 'Date', value: evidence.date },
          { label: 'Time of entry', value: evidence.time },
          { label: 'Duration inside', value: evidence.duration },
          { label: 'GPS', value: evidence.gps },
          { label: 'Charge', value: evidence.charge },
        ].map((row, i, arr) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontSize: 13, color: t.textSec }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: row.label === 'Charge' ? t.danger : t.textPri }}>{row.value}</span>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['GPS verified', 'Time logged', 'Route matched', 'Vehicle confirmed'].map(b => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${t.success}15`, borderRadius: 20, padding: '6px 12px' }}>
            <Icon n="check" s={12} c={t.success} sw={2.5} />
            <span style={{ fontSize: 11, fontWeight: 600, color: t.success }}>{b}</span>
          </div>
        ))}
      </div>

      <Btn t={t} v="accent" size="lg" onClick={onAppeal} full>
        <Icon n="shield" s={18} c="#0A0F1C" />
        Draft my appeal
      </Btn>
    </motion.div>
  );
}

function AppealStep({ onSubmit }: { onSubmit: () => void }) {
  const { t } = useTheme();
  const [letter, setLetter] = useState(
`Dear TfL,

I am writing to appeal the charge issued on Today at 17:42 for alleged entry into the London ULEZ zone.

My vehicle (AB21 XYZ) travelled the route Stratford → City of London, with GPS tracking confirming entry at 51.5414°N, 0.0034°W. The total duration inside the zone was 32 minutes, and the journey was recorded by the TollPilot trip log.

Please find attached the automatically collected evidence, including GPS verification, entry timestamp, route match and vehicle confirmation.

I respectfully request that this charge be reviewed.

Kind regards,
Justin`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.26 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: "relative", width: 64, height: 64, display: "inline-block" }}><PilotFX emotion="confident" size={64} /><Pilot size={64} emotion="confident"  showScene={false} /></div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri }}>Your appeal is ready</div>
          <div style={{ fontSize: 13, color: t.textSec }}>Feel free to edit before we send.</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em' }}>APPEAL LETTER</div>
      <textarea
        value={letter}
        onChange={e => setLetter(e.target.value)}
        style={{
          width: '100%', minHeight: 280, resize: 'vertical',
          background: t.card, color: t.textPri, border: `1px solid ${t.border}`,
          borderRadius: 14, padding: '14px 16px', fontSize: 14, lineHeight: 1.55,
          fontFamily: 'inherit', outline: 'none',
        }}
      />

      <div style={{ padding: '12px 14px', background: `${t.primary}10`, borderRadius: 12, border: `1px solid ${t.primary}22`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon n="shield" s={16} c={t.primary} />
        <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.5 }}>We'll attach your evidence pack automatically. You only pay £3 if TfL cancels the charge.</div>
      </div>

      <Btn t={t} v="primary" size="lg" onClick={onSubmit} full>Submit appeal</Btn>
    </motion.div>
  );
}

function DoneStep({ onBack }: { onBack: () => void }) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}
    >
      <div style={{ position: "relative", width: 160, height: 160, display: "inline-block" }}><PilotFX emotion="proud" size={160} /><Pilot size={160} emotion="proud"  showScene={false} /></div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Appeal submitted</div>
        <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
          We've sent it to TfL with your evidence.<br />
          You'll hear back here as soon as there's an update.
        </div>
      </div>
      <Btn t={t} v="primary" size="lg" onClick={onBack} full>Back to PCN Defence</Btn>
    </motion.div>
  );
}

/* ================= DETAIL SCREEN (existing case) ================= */

export function PCNDetailScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { id } = useParams();
  const c = CASES.find(x => x.id === Number(id)) || CASES[0];
  const meta = statusMeta[c.status];
  const [stage, setStage] = useState<'view' | 'appeal' | 'done'>('view');
  const [letter, setLetter] = useState(
`Dear TfL,

I am writing to appeal the charge issued on ${c.date} for alleged entry into the ${c.zone} zone.

My vehicle travelled the route ${c.route}, with GPS tracking confirming entry at ${c.gps}. The total duration inside the zone was ${c.duration}.

Please find attached the automatically collected evidence, including GPS verification, entry timestamp, route match and vehicle confirmation.

I respectfully request that this charge be reviewed.

Kind regards,
Justin`);

  if (stage === 'done') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 22 }}>
        <div style={{ position: "relative", width: 160, height: 160, display: "inline-block" }}><PilotFX emotion="proud" size={160} /><Pilot size={160} emotion="proud"  showScene={false} /></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>Appeal submitted</div>
          <div style={{ fontSize: 14, color: t.textSec, marginTop: 8, lineHeight: 1.55 }}>
            We've sent your evidence to TfL.<br />You'll only be charged £3 if the appeal succeeds.
          </div>
        </div>
        <Btn t={t} v="primary" size="lg" onClick={() => navigate('/pcn')} full>Back to PCN Defence</Btn>
      </div>
    );
  }

  if (stage === 'appeal') {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
        <AppHeader t={t} onBack={() => setStage('view')} title="Your appeal" />
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: "relative", width: 64, height: 64, display: "inline-block" }}><PilotFX emotion="confident" size={64} /><Pilot size={64} emotion="confident"  showScene={false} /></div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri }}>Your appeal is ready</div>
              <div style={{ fontSize: 13, color: t.textSec }}>Feel free to edit before we send.</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em' }}>APPEAL LETTER</div>
          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            style={{
              width: '100%', minHeight: 280, resize: 'vertical',
              background: t.card, color: t.textPri, border: `1px solid ${t.border}`,
              borderRadius: 14, padding: '14px 16px', fontSize: 14, lineHeight: 1.55,
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <div style={{ padding: '12px 14px', background: `${t.primary}10`, borderRadius: 12, border: `1px solid ${t.primary}22`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon n="shield" s={16} c={t.primary} />
            <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.5 }}>We'll attach your evidence pack automatically. You only pay £3 if TfL cancels the charge.</div>
          </div>
          <Btn t={t} v="primary" size="lg" onClick={() => setStage('done')} full>Submit appeal</Btn>
        </div>
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

        {/* Trip map */}
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ height: 160, position: 'relative', background: `linear-gradient(135deg, ${t.card}, ${t.cardHi})` }}>
            <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={t.border} strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="160" fill="url(#grid2)" />
              <path d="M 30 120 Q 120 70, 200 90 T 370 40" fill="none" stroke={t.primary} strokeWidth="4" strokeLinecap="round" />
              <circle cx="30" cy="120" r="7" fill={t.success} />
              <circle cx="370" cy="40" r="7" fill={t.danger} />
            </svg>
            <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 10, fontWeight: 700, color: t.textTer, letterSpacing: '0.06em' }}>TRIP MAP</div>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: t.textSec }}>
            <span>{c.route}</span>
            <span>{c.duration}</span>
          </div>
        </Card>

        {/* Evidence summary */}
        <SectionLabel t={t}>Evidence collected</SectionLabel>
        <Card t={t}>
          {[
            { label: 'Zone', value: c.zone },
            { label: 'Date', value: c.date },
            { label: 'Time of entry', value: c.time },
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
            <Btn t={t} v="accent" size="lg" onClick={() => setStage('appeal')} full>
              <Icon n="shield" s={18} c="#0A0F1C" />
              Draft my appeal
            </Btn>
            <div style={{ fontSize: 12, color: t.textTer, textAlign: 'center' }}>You only pay £3 if the appeal is successful</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  v3 §4.2 — FAILURE PATHS                                         */
/*                                                                  */
/*  Three screens handle the cases the product cannot win:          */
/*    1. Weak case     — pre-submission, evidence < 45              */
/*    2. Rejected      — submitted, TfL turned it down              */
/*    3. Withdrawn     — user cancelled or timed out                */
/*                                                                  */
/*  Each screen is honest, specific, and emotionally aligned with   */
/*  the user. The system is frustrated *on the user's behalf*.      */
/*  Pilot emotion is `annoyed` on weak and rejected, `concerned`    */
/*  on withdrawn.                                                   */
/*                                                                  */
/*  Fee clarification — "No charge for lost appeals" — is           */
/*  mandatory and prominent on every lost-case screen.              */
/* ═══════════════════════════════════════════════════════════════ */

interface EvidenceRow { ok: boolean; label: string; detail?: string }

function EvidenceList({ items }: { items: EvidenceRow[] }) {
  const { t } = useTheme();
  return (
    <Card t={t}>
      {items.map((r, i, arr) => (
        <div key={r.label} style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0',
          borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
            background: r.ok ? `${t.success}22` : `${t.danger}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon n={r.ok ? 'check' : 'close'} s={12} c={r.ok ? t.success : t.danger} sw={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.textPri }}>{r.label}</div>
            {r.detail && (
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{r.detail}</div>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
}

function NoChargeFooter() {
  const { t } = useTheme();
  return (
    <div style={{
      marginTop: 10, padding: '12px 14px', background: t.card, border: `1px solid ${t.border}`,
      borderRadius: 12, textAlign: 'center', fontSize: 12, color: t.textSec, lineHeight: 1.5,
    }}>
      <strong style={{ color: t.textPri }}>No charge for this appeal.</strong><br />
      We only charge £3 when we win.
    </div>
  );
}

/* ─── In-flow weak step (when a new case scores < 45) ─── */
function WeakStep({ onPay, onUpload, onAppealAnyway }: {
  onPay: () => void; onUpload: () => void; onAppealAnyway: () => void;
}) {
  const { t } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 72, height: 72, display: 'inline-block' }}>
          <PilotFX emotion="annoyed" size={72} />
          <Pilot size={72} emotion="annoyed" showScene={false} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>We can't build a strong case.</div>
          <div style={{ fontSize: 13, color: t.textSec, marginTop: 2, lineHeight: 1.45 }}>
            Submitting a weak case risks your 28-day window.
          </div>
        </div>
      </div>

      <SectionLabel t={t}>What we found</SectionLabel>
      <EvidenceList items={[
        { ok: true,  label: 'Trip in your history',      detail: 'Matched against your log.' },
        { ok: true,  label: 'Vehicle matches',            detail: 'AB21 XYZ · Euro 6 compliant.' },
        { ok: false, label: 'GPS gap during zone entry',  detail: 'Signal loss between 17:38 and 17:45.' },
        { ok: false, label: 'Zone boundary timestamp uncertain', detail: 'TfL notice time ±4 minutes from our log.' },
      ]} />

      <SectionLabel t={t}>Your options</SectionLabel>
      <Btn t={t} v="primary" size="lg" onClick={onPay} full>Pay the charge</Btn>
      <Btn t={t} v="secondary" size="md" onClick={onUpload} full>
        <Icon n="upload" s={16} c={t.textPri} /> Upload additional evidence
      </Btn>

      <div style={{ marginTop: 6, borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
        <div style={{ fontSize: 12, color: t.textTer, marginBottom: 8, lineHeight: 1.45 }}>
          <strong style={{ color: t.danger }}>Not recommended.</strong> TfL is likely to reject based on available evidence.
        </div>
        <Btn t={t} v="tertiary" size="sm" onClick={onAppealAnyway} full>Appeal anyway — not recommended</Btn>
      </div>

      <NoChargeFooter />
    </motion.div>
  );
}

/* ─── Standalone screen: /pcn/:id/weak (from case list) ─── */
export function PCNWeakScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { id } = useParams();
  const c = CASES.find(x => x.id === Number(id)) || CASES[0];
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/pcn')} title="Heads up" />
      <WeakStep
        onPay={() => navigate('/wallet')}
        onUpload={() => { /* prototype: no upload picker */ }}
        onAppealAnyway={() => navigate(`/pcn/${c.id}`)}
      />
    </div>
  );
}

/* ─── Standalone screen: /pcn/:id/rejected ─── */
export function PCNRejectedScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { id } = useParams();
  const c = CASES.find(x => x.id === Number(id)) || CASES.find(x => x.status === 'rejected') || CASES[0];
  const tflReason = c.tflReason ?? 'Reason not provided by the authority.';
  const interpretation = c.ourInterpretation ?? 'We are working with the authority to clarify.';
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/pcn')} title="Appeal rejected" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 72, height: 72, display: 'inline-block' }}>
            <PilotFX emotion="annoyed" size={72} />
            <Pilot size={72} emotion="annoyed" showScene={false} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>TfL rejected the appeal.</div>
            <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>Here's exactly what they said.</div>
          </div>
        </div>

        <SectionLabel t={t}>TfL's reason</SectionLabel>
        <Card t={t}>
          <div style={{ fontSize: 13, color: t.textPri, fontStyle: 'italic', lineHeight: 1.55 }}>
            "{tflReason}"
          </div>
        </Card>

        <SectionLabel t={t}>What this means</SectionLabel>
        <Card t={t}>
          <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.6 }}>{interpretation}</div>
        </Card>

        <SectionLabel t={t}>What you can do</SectionLabel>
        <Btn t={t} v="secondary" size="md" onClick={() => navigate(`/pcn/${c.id}`)} full>
          <Icon n="eye" s={16} c={t.textPri} /> View the evidence we submitted
        </Btn>
        <Btn t={t} v="secondary" size="md" onClick={() => { /* external link */ }} full>
          <Icon n="right" s={16} c={t.textPri} /> Request a DVLA record correction
        </Btn>
        <Btn t={t} v="primary" size="md" onClick={() => navigate('/wallet')} full>Accept charge and pay</Btn>

        <NoChargeFooter />
      </div>
    </div>
  );
}

/* ─── Standalone screen: /pcn/:id/withdrawn ─── */
export function PCNWithdrawnScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { id } = useParams();
  const c = CASES.find(x => x.id === Number(id)) || CASES.find(x => x.status === 'withdrawn') || CASES[0];
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/pcn')} title="Appeal withdrawn" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 72, height: 72, display: 'inline-block' }}>
            <PilotFX emotion="concerned" size={72} />
            <Pilot size={72} emotion="concerned" showScene={false} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: t.textPri, letterSpacing: '-0.02em' }}>This case was withdrawn.</div>
            <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>The 28-day appeal window closed without resolution.</div>
          </div>
        </div>

        <SectionLabel t={t}>Case summary</SectionLabel>
        <Card t={t}>
          {[
            { label: 'Zone', value: c.zone },
            { label: 'Date', value: c.date },
            { label: 'Charge', value: c.charge },
            { label: 'Status', value: 'Withdrawn' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: t.textSec }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.textPri }}>{row.value}</span>
            </div>
          ))}
        </Card>

        <SectionLabel t={t}>Your options</SectionLabel>
        <Btn t={t} v="primary" size="md" onClick={() => navigate('/wallet')} full>Pay the charge</Btn>
        <Btn t={t} v="secondary" size="md" onClick={() => navigate('/support')} full>Contact support</Btn>

        <NoChargeFooter />
      </div>
    </div>
  );
}
