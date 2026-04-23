/**
 * DebugTodayScreen — reviewer surface for the four Today card states.
 *
 * Visit /debug/today to see every confidence state rendered side-by-side
 * without editing code. Primarily for stakeholder review, QA traversal,
 * and regression spotting.
 */
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, SectionLabel } from '../tp';
import { TodayCard } from '../TodayCard';

const STATES: { label: string; state: 'high' | 'medium' | 'low' | 'empty'; note: string }[] = [
  { label: 'High confidence', state: 'high',   note: '≥ 70% — full prediction, no indicator.' },
  { label: 'Medium confidence', state: 'medium', note: '50–69% — inference label under route.' },
  { label: 'Low confidence', state: 'low',    note: '< 50% — prediction suppressed, CTA to plan.' },
  { label: 'Empty (no usual route)', state: 'empty',  note: 'No history — onboarding nudge.' },
];

export function DebugTodayScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Debug · Today states" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.55 }}>
          Every state the Today card can be in. Production logic is specified in <span style={{ fontFamily: 'monospace', color: t.textPri }}>src/app/lib/todayConfidence.ts</span>.
          Live URL override: <span style={{ fontFamily: 'monospace', color: t.textPri }}>/dashboard?state=low</span>.
        </div>

        {STATES.map(s => (
          <div key={s.state} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionLabel t={t}>{s.label}</SectionLabel>
            <div style={{ fontSize: 12, color: t.textTer, marginBottom: 4 }}>{s.note}</div>
            <TodayCard confidence={s.state} />
          </div>
        ))}
      </div>
    </div>
  );
}
