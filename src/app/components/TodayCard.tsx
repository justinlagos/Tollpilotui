/**
 * TodayCard — dashboard Today surface with honest uncertainty.
 *
 * Four states per src/app/lib/todayConfidence.ts:
 *   high    Full prediction. Route + cost + alt + traffic.
 *   medium  Same layout + "Based on your usual route" inference label.
 *   low     Prediction suppressed. Fallback to "Plan today's route".
 *   empty   No usual route yet. "Drive three times to unlock …".
 *
 * The card never shows a wrong number with high visual certainty.
 */

import { useNavigate } from 'react-router';
import { useTheme, Card, Icon } from './tp';
import type { TodayConfidence } from '../lib/todayConfidence';

interface TodayCardProps {
  confidence: TodayConfidence;
  /** Optional override for the hero metrics — prototype wiring only. */
  data?: {
    origin: string;
    destination: string;
    cost: string;
    chargeLabel: string;
    altCost: string;
    altSub: string;
    traffic: { level: 'green' | 'amber' | 'red'; label: string };
  };
}

const DEFAULT_DATA = {
  origin: 'Stratford',
  destination: 'City of London',
  cost: '£12.50',
  chargeLabel: 'ULEZ + Congestion',
  altCost: '£0',
  altSub: '+6 mins · avoids the zone',
  traffic: { level: 'amber' as const, label: 'Moderate traffic' },
};

export function TodayCard({ confidence, data = DEFAULT_DATA }: TodayCardProps) {
  const navigate = useNavigate();
  const { t } = useTheme();

  if (confidence === 'empty') {
    return <EmptyState onPlan={() => navigate('/route')} />;
  }
  if (confidence === 'low') {
    return <LowConfidence onPlan={() => navigate('/route')} />;
  }

  const isMedium = confidence === 'medium';
  const trafficColor =
    data.traffic.level === 'green' ? t.success :
    data.traffic.level === 'red' ? t.danger : t.warn;

  return (
    <Card t={t} onClick={() => navigate('/compare')} glow={t.primary} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, letterSpacing: '0.08em' }}>TODAY</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.textTer }}>Auto-detected · Wed, 08:12</div>
      </div>

      <div style={{ fontSize: 14, color: t.textSec, marginBottom: 4 }}>Your usual route today costs</div>

      {/* Route pair — medium confidence adds the inference label below */}
      <div style={{ fontSize: 13, color: t.textPri, fontWeight: 600, marginBottom: isMedium ? 2 : 6 }}>
        {data.origin} → {data.destination}
      </div>
      {isMedium && (
        <div style={{ fontSize: 11, color: t.textTer, marginBottom: 6 }}>
          Based on your usual route
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: t.danger, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {data.cost}
        </div>
        <div style={{ fontSize: 13, color: t.textTer }}>{data.chargeLabel}</div>
      </div>

      <div style={{
        background: `${t.success}15`, borderRadius: 14, border: `1px solid ${t.success}30`,
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n="route" s={18} c={t.success} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.textPri }}>{data.altCost} alternative available</div>
          <div style={{ fontSize: 12, color: t.textSec }}>{data.altSub}</div>
        </div>
        <Icon n="right" s={18} c={t.success} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: t.textTer }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: trafficColor }} />
        <span>{data.traffic.label}</span>
      </div>
    </Card>
  );
}

/* ────────────────────────── LOW CONFIDENCE ─────────────────────────── */

function LowConfidence({ onPlan }: { onPlan: () => void }) {
  const { t } = useTheme();
  return (
    <Card t={t} onClick={onPlan} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, letterSpacing: '0.08em' }}>TODAY</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.textTer }}>Unusual day</div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: t.textPri, letterSpacing: '-0.015em', marginBottom: 4 }}>
        We're not sure about your route today.
      </div>
      <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5, marginBottom: 14 }}>
        Plan one manually for an accurate cost. We'll predict again tomorrow.
      </div>
      <div style={{
        background: `${t.primary}14`, border: `1px solid ${t.primary}30`, borderRadius: 14,
        padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n="route" s={16} c={t.primary} />
        </div>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: t.primary }}>Plan today's route</div>
        <Icon n="right" s={18} c={t.primary} />
      </div>
    </Card>
  );
}

/* ────────────────────────── EMPTY STATE ───────────────────────────── */

function EmptyState({ onPlan }: { onPlan: () => void }) {
  const { t } = useTheme();
  return (
    <Card t={t} onClick={onPlan} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, letterSpacing: '0.08em' }}>TODAY</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.textTer }}>Getting to know you</div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: t.textPri, letterSpacing: '-0.015em', marginBottom: 4 }}>
        Drive three times to unlock your daily charge forecast.
      </div>
      <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5, marginBottom: 14 }}>
        We learn your commute from your drives. Until then, plan each route manually.
      </div>
      <div style={{
        background: `${t.primary}14`, border: `1px solid ${t.primary}30`, borderRadius: 14,
        padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n="route" s={16} c={t.primary} />
        </div>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: t.primary }}>Plan today's route</div>
        <Icon n="right" s={18} c={t.primary} />
      </div>
    </Card>
  );
}
