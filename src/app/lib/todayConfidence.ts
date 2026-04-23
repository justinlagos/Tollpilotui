/**
 * todayConfidence — confidence model for the dashboard Today card.
 *
 * ─────────────────────────────────────────────────────────────────────
 * PRODUCTION RULE (for the backend team)
 * ─────────────────────────────────────────────────────────────────────
 *
 * The Today card must never show an incorrect prediction with high
 * visual certainty. A wrong number displayed confidently destroys
 * trust faster than no number at all. Four states only:
 *
 *   high    (>= 70% confidence)
 *     Full prediction shown. Route, cost, alternative, traffic.
 *     No confidence label needed.
 *
 *   medium  (50–69% confidence)
 *     Same layout, but an extra line under the route origin/destination
 *     reads "Based on your usual route" in t.textTer 11px.
 *     Acknowledges that this is inference.
 *
 *   low     (< 50% confidence)
 *     Prediction NOT shown. Card shifts to a "Plan today's route"
 *     fallback with a CTA to Route Input.
 *     The system does not guess. Silent guessing destroys trust.
 *
 *   empty   (no usual route, no history)
 *     "Drive three times to unlock your daily charge forecast."
 *     CTA: "Plan today's route".
 *
 * Suppression rules (card is replaced with empty state):
 *   - Weekend (Saturday / Sunday)
 *   - No registered vehicle
 *   - Fewer than 3 trips in the past 14 days
 *   - After 13:00 local time (decision window closed)
 *
 * Confidence score is computed server-side from:
 *   - Trip history density         (40% weight)
 *   - Weekly pattern stability     (30% weight)
 *   - Current-time-of-day match    (15% weight)
 *   - Last-seen-live zone data age (15% weight)
 *
 * The prototype returns "high" by default. A debug query override
 * (?state=medium|low|empty) flips state for reviewers.
 * ─────────────────────────────────────────────────────────────────────
 */

export type TodayConfidence = 'high' | 'medium' | 'low' | 'empty';

/**
 * In production: takes the user, time, and trip history context
 * and returns the appropriate confidence band.
 * In the prototype: returns high unless overridden by the
 * ?state query parameter (picked up by the dashboard screen).
 */
export function getTodayConfidence(override?: TodayConfidence | null): TodayConfidence {
  if (override) return override;
  return 'high';
}

/**
 * Parse a confidence override from a query string.
 * Used by the /debug/today route and the dashboard itself when
 * the query ?state=... is present.
 */
export function parseConfidenceOverride(search: string): TodayConfidence | null {
  const params = new URLSearchParams(search);
  const state = params.get('state');
  if (state === 'high' || state === 'medium' || state === 'low' || state === 'empty') {
    return state;
  }
  return null;
}
