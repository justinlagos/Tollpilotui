import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, AppHeader, Card, Icon, Btn, SectionLabel, IconBadge } from '../tp';
import { Pilot } from '../Pilot';
import { PilotFX } from '../PilotFX';

const CASES = [
  { id: 1, zone: 'London ULEZ', date: 'Today, 5:42pm', charge: '£12.50', status: 'ready' as const, route: 'Stratford → City of London', gps: '51.5414°N, 0.0034°W', duration: '32 min', time: '17:42' },
  { id: 2, zone: 'Congestion Charge', date: 'Mon 14 Apr, 8:15am', charge: '£15.00', status: 'submitted' as const, route: 'Brixton → Westminster', gps: '51.5074°N, 0.1278°W', duration: '41 min', time: '08:15' },
  { id: 3, zone: 'London ULEZ', date: 'Fri 4 Apr, 6:30pm', charge: '£12.50', status: 'won' as const, route: 'Croydon → Canary Wharf', gps: '51.5054°N, 0.0235°W', duration: '55 min', time: '18:30' },
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

/* ================= NEW CASE FLOW ================= */

type NewCaseStep = 'choose' | 'manual' | 'processing' | 'evidence' | 'appeal' | 'done';

export function PCNNewCaseScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [step, setStep] = useState<NewCaseStep>('choose');
  const [manualNotice, setManualNotice] = useState({ zone: 'London ULEZ', date: '', time: '', plate: 'AB21 XYZ' });

  // Auto-progress processing -> evidence
  useEffect(() => {
    if (step === 'processing') {
      const t1 = setTimeout(() => setStep('evidence'), 2400);
      return () => clearTimeout(t1);
    }
  }, [step]);

  const title =
    step === 'choose' ? 'New case' :
    step === 'manual' ? 'Enter details' :
    step === 'processing' ? 'Analysing' :
    step === 'evidence' ? 'Evidence found' :
    step === 'appeal' ? 'Your appeal' :
    'Submitted';

  const back = () => {
    if (step === 'choose') navigate('/pcn');
    else if (step === 'manual') setStep('choose');
    else if (step === 'evidence') setStep('choose');
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
        {step === 'evidence' && <EvidenceStep key="evidence" onAppeal={() => setStep('appeal')} />}
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
  const steps = [
    'Reading your trip history',
    'Matching time, zone and plate',
    'Pulling GPS and route evidence',
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(a => Math.min(a + 1, steps.length - 1)), 750);
    return () => clearInterval(id);
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

function EvidenceStep({ onAppeal }: { onAppeal: () => void }) {
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
