// ═══════════════════════════════════════════════════════════════
// TOLLPILOT EMOTION STATE MACHINE
// ═══════════════════════════════════════════════════════════════
// Three-layer model:
//   Base state      — long-running emotion driven by screen context
//   Interrupt state — temporary override for events; auto-expires
//   Micro layer     — subtle polish (blink, pupil drift, body motion)
//
// activeEmotion = interruptState || baseState
// Higher-priority interrupts beat lower-priority ones.
// Never combine more than one strong emotion. Default back to
// confident / focused / idle often.
// ═══════════════════════════════════════════════════════════════

export type Emotion =
  // stable (can persist)
  | 'idle'
  | 'confident'
  | 'thinking'
  | 'focused'
  | 'curious'
  | 'sleepy'
  | 'concerned'
  | 'happy'
  | 'proud'
  // triggered (auto-expire)
  | 'alert'
  | 'shocked'
  | 'panicked'
  | 'relieved'
  | 'smug'
  | 'celebrating'
  | 'annoyed'
  | 'suspicious';

export type ScreenContext =
  | 'splash'
  | 'onboarding_route'
  | 'onboarding_alerts'
  | 'onboarding_vehicle'
  | 'plate_input_empty'
  | 'plate_input_active'
  | 'plate_verified'
  | 'dashboard'
  | 'drive_mode'
  | 'route_planning'
  | 'route_compare'
  | 'trip_history'
  | 'pcn_defence'
  | 'pcn_appeal'
  | 'wallet'
  | 'widget'
  | 'settings';

export interface ScreenData {
  verified?: boolean;
  motUrgency?: 'none' | 'due' | 'expired';
  route?: { charge?: number; alternative?: number };
  appeal?: 'ready' | 'submitted' | 'won' | 'weak';
}

// ───────────────────────────────────────────────────────────────
// PRIORITY (higher = overrides lower)
// ───────────────────────────────────────────────────────────────
export const PRIORITY: Record<Emotion, number> = {
  suspicious: 30,
  // critical
  panicked: 100,
  shocked: 100,
  // urgent
  alert: 80,
  concerned: 80,
  annoyed: 80,
  // task-driven
  focused: 60,
  thinking: 60,
  curious: 60,
  // positive outcome
  relieved: 40,
  happy: 40,
  proud: 40,
  smug: 40,
  celebrating: 40,
  // passive
  idle: 20,
  sleepy: 20,
  confident: 20,
};

// ───────────────────────────────────────────────────────────────
// DEFAULT DURATIONS (ms) FOR TRIGGERED STATES
// ───────────────────────────────────────────────────────────────
export const DEFAULT_DURATION: Partial<Record<Emotion, number>> = {
  relieved: 1000,
  happy: 1200,
  proud: 1600,
  celebrating: 2200,
  shocked: 1000,
  annoyed: 1500,
  smug: 1200,
  // alert / panicked persist while condition exists — handled by caller
};

// ───────────────────────────────────────────────────────────────
// SCREEN → BASE STATE
// ───────────────────────────────────────────────────────────────
export function getBaseState(context: ScreenContext, data: ScreenData = {}): Emotion {
  switch (context) {
    case 'splash':
      return 'confident';
    case 'onboarding_route':
      return 'thinking';
    case 'onboarding_alerts':
      return 'focused';
    case 'onboarding_vehicle':
      return data.verified ? 'confident' : 'curious';
    case 'plate_input_empty':
      return 'curious';
    case 'plate_input_active':
      return 'thinking';
    case 'plate_verified':
      return 'confident';
    case 'dashboard':
      if (data.motUrgency === 'expired') return 'concerned';
      if (data.motUrgency === 'due') return 'concerned';
      return 'confident';
    case 'drive_mode':
      return 'focused';
    case 'route_planning':
      return 'thinking';
    case 'route_compare':
      return 'thinking';
    case 'trip_history':
      return 'proud';
    case 'pcn_defence':
      return 'concerned';
    case 'pcn_appeal':
      if (data.appeal === 'won') return 'proud';
      if (data.appeal === 'submitted') return 'focused';
      if (data.appeal === 'weak') return 'concerned';
      return 'concerned';
    case 'wallet':
      return 'confident';
    case 'widget':
      return 'confident';
    case 'settings':
      return 'idle';
    default:
      return 'idle';
  }
}

// ───────────────────────────────────────────────────────────────
// EVENT → EMOTION (atomic events that fire an interrupt)
// ───────────────────────────────────────────────────────────────
export type EmotionEventName =
  // vehicle / compliance
  | 'mot_due_30_15'
  | 'mot_due_14_3'
  | 'mot_expired'
  | 'tax_expired'
  | 'ulez_exempt_confirmed'
  | 'vehicle_verified'
  | 'vehicle_lookup_failed'
  // route / charge
  | 'charge_detected_usual'
  | 'approaching_zone'
  | 'imminent_toll'
  | 'zone_entered'
  | 'zone_entered_expensive'
  | 'alternative_found'
  | 'reroute_accepted'
  | 'charge_avoided'
  | 'cheapest_selected'
  // savings
  | 'saved_under_5'
  | 'saved_over_10'
  | 'saved_over_25'
  | 'tollscore_improved'
  | 'streak_milestone'
  | 'year_recap'
  // pcn
  | 'pcn_uploaded'
  | 'pcn_evidence_matched'
  | 'pcn_weak_case'
  | 'pcn_appeal_generated'
  | 'pcn_appeal_submitted'
  | 'pcn_appeal_won'
  | 'pcn_appeal_rejected'
  // commute
  | 'daily_ready'
  | 'usual_route_expensive'
  | 'free_alt_available'
  | 'traffic_with_charges';

export function emotionForEvent(ev: EmotionEventName): Emotion {
  switch (ev) {
    // vehicle / compliance
    case 'mot_due_30_15': return 'concerned';
    case 'mot_due_14_3': return 'alert';
    case 'mot_expired': return 'panicked';
    case 'tax_expired': return 'panicked';
    case 'ulez_exempt_confirmed': return 'confident';
    case 'vehicle_verified': return 'relieved';
    case 'vehicle_lookup_failed': return 'concerned';
    // route / charge
    case 'charge_detected_usual': return 'concerned';
    case 'approaching_zone': return 'alert';
    case 'imminent_toll': return 'alert';
    case 'zone_entered': return 'shocked';
    case 'zone_entered_expensive': return 'panicked';
    case 'alternative_found': return 'thinking';
    case 'reroute_accepted': return 'relieved';
    case 'charge_avoided': return 'smug';
    case 'cheapest_selected': return 'confident';
    // savings
    case 'saved_under_5': return 'happy';
    case 'saved_over_10': return 'proud';
    case 'saved_over_25': return 'celebrating';
    case 'tollscore_improved': return 'proud';
    case 'streak_milestone': return 'celebrating';
    case 'year_recap': return 'proud';
    // pcn
    case 'pcn_uploaded': return 'focused';
    case 'pcn_evidence_matched': return 'confident';
    case 'pcn_weak_case': return 'concerned';
    case 'pcn_appeal_generated': return 'relieved';
    case 'pcn_appeal_submitted': return 'focused';
    case 'pcn_appeal_won': return 'celebrating';
    case 'pcn_appeal_rejected': return 'annoyed';
    // commute
    case 'daily_ready': return 'confident';
    case 'usual_route_expensive': return 'concerned';
    case 'free_alt_available': return 'smug';
    case 'traffic_with_charges': return 'alert';
  }
}

// ───────────────────────────────────────────────────────────────
// ARBITRATION
// ───────────────────────────────────────────────────────────────
export interface InterruptEvent {
  emotion: Emotion;
  priority: number;
  expiresAt?: number;
  source: string;
}

export function resolveEmotion(
  baseState: Emotion,
  interrupts: InterruptEvent[],
  now: number = Date.now(),
): Emotion {
  const active = interrupts
    .filter(e => !e.expiresAt || e.expiresAt > now)
    .sort((a, b) => b.priority - a.priority);
  const top = active[0];
  if (!top) return baseState;
  // interrupt only wins if it meaningfully outranks the base
  // (keeps the car calm when nothing important is happening)
  return PRIORITY[top.emotion] >= PRIORITY[baseState] ? top.emotion : baseState;
}

// ───────────────────────────────────────────────────────────────
// Helper to create an interrupt from an event name
// ───────────────────────────────────────────────────────────────
export function makeInterrupt(
  ev: EmotionEventName,
  source: string = ev,
  durationMs?: number,
): InterruptEvent {
  const emotion = emotionForEvent(ev);
  const dur = durationMs ?? DEFAULT_DURATION[emotion];
  return {
    emotion,
    priority: PRIORITY[emotion],
    expiresAt: dur ? Date.now() + dur : undefined,
    source,
  };
}

// ───────────────────────────────────────────────────────────────
// TRANSITION TIMING (ms) — hard cut for urgent, soft ease for calm
// ───────────────────────────────────────────────────────────────
export const TRANSITION_MS: Record<Emotion, number> = {
  suspicious: 420,
  panicked: 140,
  shocked: 140,
  alert: 160,
  concerned: 220,
  annoyed: 200,
  focused: 280,
  thinking: 280,
  curious: 280,
  relieved: 260,
  happy: 260,
  proud: 280,
  smug: 260,
  celebrating: 400,
  idle: 300,
  sleepy: 400,
  confident: 300,
};

// ───────────────────────────────────────────────────────────────
// BLINK PATTERNS (min ms, max ms, burst chance 0..1)
// ───────────────────────────────────────────────────────────────
export const BLINK_PATTERN: Record<Emotion, { min: number; max: number; burst: number }> = {
  suspicious: { min: 4600, max: 6200, burst: 0.15 },
  idle:        { min: 3500, max: 5500, burst: 0.08 },
  confident:   { min: 4000, max: 6000, burst: 0.05 },
  thinking:    { min: 2800, max: 4200, burst: 0.10 },
  focused:     { min: 4500, max: 6500, burst: 0.02 },
  curious:     { min: 3000, max: 4500, burst: 0.12 },
  concerned:   { min: 2500, max: 3500, burst: 0.10 },
  alert:       { min: 900,  max: 1400, burst: 0.30 },
  shocked:     { min: 0,    max: 0,    burst: 0    }, // no blink (frozen)
  panicked:    { min: 600,  max: 1000, burst: 0.40 },
  relieved:    { min: 3000, max: 4500, burst: 0.06 },
  happy:       { min: 2600, max: 4000, burst: 0.10 },
  proud:       { min: 3200, max: 5000, burst: 0.05 },
  smug:        { min: 3000, max: 4200, burst: 0.05 },
  celebrating: { min: 900,  max: 1400, burst: 0.35 },
  annoyed:     { min: 2200, max: 3200, burst: 0.08 },
  sleepy:      { min: 6000, max: 9000, burst: 0    }, // slow + long
};
