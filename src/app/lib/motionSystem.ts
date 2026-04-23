/**
 * TollPilot Motion System
 * ---------------------------------------------------------------------------
 * Single source of truth for how the Pilot character performs and how the
 * surrounding UI/environment reacts per emotion.
 *
 * Architecture layers (all keyed on Emotion):
 *   1. FACE        — eyes, brows, mouth, blink cadence
 *   2. BODY        — suspension, lean, float amplitude, stillness
 *   3. ENVIRONMENT — glow, scan, telemetry, pulse, streak, flare, impact
 *   4. TIMING      — transition durations + easings by event class
 *
 * Design principles:
 *   - Stillness is a valid animation. Most emotions rest.
 *   - Bounce is rare. Reserved for celebration moments only.
 *   - External FX must carry as much narrative weight as the character.
 *   - Urgent states snap. Confident states settle. Thinking states pause.
 */

import type { Emotion } from './emotionStateMachine';

// ────────────────────────────────────────────────────────────────────────────
// 1. FACE PERFORMANCE
// ────────────────────────────────────────────────────────────────────────────

export interface FaceConfig {
  /** Inward-upward brow tilt, negative = outward/down. Applied to both brows, mirrored. */
  browTilt: number;           // degrees
  /** Vertical brow translation, negative = higher (surprise/alert), positive = lower (focused). */
  browY: number;              // 0..+/- 2 pixels
  /** Eyelid coverage. 0 = fully open, 1 = fully closed. 0.3 = narrowed, 0.7 = half-lidded. */
  eyelid: number;             // 0..1
  /** Pupil horizontal range for drift. 0 = fixed, 2 = wide wander. */
  pupilDrift: number;
  /** Pupil vertical bias. Negative = looking up. */
  pupilBiasY: number;
  /** Pupil scale. Shocked = small pupils. Happy = slightly wider. */
  pupilScale: number;
  /** Mouth path id: 'neutral' | 'smileSoft' | 'smileWide' | 'open' | 'flat' | 'tight' | 'asymmetric'. */
  mouth: MouthPreset;
  /** Average blink period in ms. 0 suppresses blinking. */
  blinkPeriodMs: number;
  /** Blink burst: probability of double-blink events. */
  blinkBurstProb: number;
}

export type MouthPreset =
  | 'neutral' | 'smileSoft' | 'smileWide' | 'open' | 'flat' | 'tight' | 'asymmetric' | 'worried';

// ────────────────────────────────────────────────────────────────────────────
// 2. BODY PERFORMANCE
// ────────────────────────────────────────────────────────────────────────────

export interface BodyConfig {
  /** Vertical float amplitude in pixels. 0 = planted. */
  floatAmpPx: number;
  /** Float period in ms. Slower = calmer. */
  floatPeriodMs: number;
  /** Body tilt in degrees for asymmetric postures (smug, annoyed). */
  leanDeg: number;
  /** Shiver micro-motion in pixels, for panicked/shocked. Restrained. */
  shiverPx: number;
  /** One-shot settle on state entry: downward dip then release. 0 disables. */
  settleDipPx: number;
  /** Forward lean for speed/focused. */
  forwardLeanPx: number;
}

// ────────────────────────────────────────────────────────────────────────────
// 3. ENVIRONMENTAL FX
// ────────────────────────────────────────────────────────────────────────────

export interface FxConfig {
  /** Base glow intensity 0..1. 0 disables. */
  glow: number;
  /** Glow colour as CSS hex or token key. */
  glowColor: string;
  /** Breathing ring — slow radial pulse around the car. 0 disables. */
  breathRing: number;
  /** Telemetry tick frequency per second. 0 disables. Used in thinking/focused. */
  telemetryHz: number;
  /** Caution pulse amplitude. Amber for concerned, red-amber for alert. */
  cautionPulse: number;
  /** Danger pulse amplitude. Red for panicked, flash for shocked. */
  dangerPulse: number;
  /** One-shot impact ring on entry (shocked, panicked snap). */
  impactRing: boolean;
  /** Speed streaks intensity 0..1 — forward compression lines for speed-emotion or drive. */
  speedStreaks: number;
  /** Success flare one-shot on entry — expanding highlight. */
  successFlare: boolean;
  /** Score/badge shimmer — subtle scan across the car for proud/celebrating. */
  shimmer: boolean;
  /** Scan line — thin directional line for focused. */
  scanLine: boolean;
  /** Underglow colour (under-car light). Empty = off. */
  underglow: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 4. COMPOSITE — per-emotion profile
// ────────────────────────────────────────────────────────────────────────────

export interface MotionProfile {
  face: FaceConfig;
  body: BodyConfig;
  fx: FxConfig;
  /** Transition duration into this emotion, in ms. */
  inMs: number;
  /** Easing keyword consumed by motion/react. */
  inEase: string;
  /** Priority level for concurrent FX (0 low, 100 critical). */
  priority: number;
}

const GLOW_YELLOW = '#F5BD31';
const GLOW_BLUE = '#3BA9FF';
const GLOW_AMBER = '#F59E0B';
const GLOW_RED = '#EF4444';
const GLOW_GREEN = '#22C55E';

// Factory helpers to avoid repetition ────────────────────────────────────────
const face = (p: Partial<FaceConfig>): FaceConfig => ({
  browTilt: 0, browY: 0, eyelid: 0, pupilDrift: 0.6, pupilBiasY: 0,
  pupilScale: 1, mouth: 'neutral', blinkPeriodMs: 3800, blinkBurstProb: 0.18, ...p,
});

const body = (p: Partial<BodyConfig>): BodyConfig => ({
  floatAmpPx: 0.8, floatPeriodMs: 4200, leanDeg: 0, shiverPx: 0,
  settleDipPx: 0, forwardLeanPx: 0, ...p,
});

const fx = (p: Partial<FxConfig>): FxConfig => ({
  glow: 0, glowColor: GLOW_YELLOW, breathRing: 0, telemetryHz: 0,
  cautionPulse: 0, dangerPulse: 0, impactRing: false, speedStreaks: 0,
  successFlare: false, shimmer: false, scanLine: false, underglow: '', ...p,
});

// ────────────────────────────────────────────────────────────────────────────
// THE PROFILES
// ────────────────────────────────────────────────────────────────────────────

export const MOTION: Record<Emotion, MotionProfile> = {
  idle: {
    face: face({ blinkPeriodMs: 5200, blinkBurstProb: 0.08, pupilDrift: 0.8 }),
    body: body({ floatAmpPx: 0.8, floatPeriodMs: 4800 }),
    fx: fx({ glow: 0.10, glowColor: GLOW_YELLOW, breathRing: 0.08 }),
    inMs: 400, inEase: 'easeOut', priority: 10,
  },

  confident: {
    face: face({ mouth: 'smileSoft', browY: -0.3, pupilDrift: 0.4, blinkPeriodMs: 4600 }),
    body: body({ floatAmpPx: 0.6, floatPeriodMs: 4600 }),
    fx: fx({ glow: 0.22, glowColor: GLOW_YELLOW, breathRing: 0.14 }),
    inMs: 380, inEase: 'easeOut', priority: 25,
  },

  thinking: {
    // non-symmetrical pupil scan; one brow lifts; mouth tightens.
    face: face({ browTilt: -3, pupilDrift: 1.6, pupilBiasY: -0.3, mouth: 'tight', blinkPeriodMs: 5400 }),
    body: body({ floatAmpPx: 0.3, floatPeriodMs: 5400 }),
    fx: fx({ glow: 0.16, glowColor: GLOW_BLUE, telemetryHz: 2.2, breathRing: 0.10 }),
    inMs: 420, inEase: 'easeInOut', priority: 35,
  },

  focused: {
    // narrowed eyes, lowered firmer brows, planted body, forward lean.
    face: face({ browY: 1.4, browTilt: 4, eyelid: 0.28, pupilDrift: 0.2, mouth: 'flat', blinkPeriodMs: 6200 }),
    body: body({ floatAmpPx: 0.2, floatPeriodMs: 5800, forwardLeanPx: 1.2 }),
    fx: fx({ glow: 0.20, glowColor: GLOW_BLUE, scanLine: true, underglow: GLOW_BLUE }),
    inMs: 360, inEase: 'easeOut', priority: 45,
  },

  concerned: {
    // brows tilt inward-up; eyes slightly taller; smile flattened; body dips.
    face: face({ browTilt: 8, browY: -0.6, mouth: 'flat', pupilDrift: 0.6, blinkPeriodMs: 3200 }),
    body: body({ floatAmpPx: 0.5, settleDipPx: 2 }),
    fx: fx({ glow: 0.18, glowColor: GLOW_AMBER, cautionPulse: 0.45 }),
    inMs: 420, inEase: 'easeOut', priority: 55,
  },

  alert: {
    // wider eyes, suppressed blinking, sharp brow response, visible caution pulse.
    face: face({ browY: -1.2, browTilt: 2, eyelid: -0.15, pupilDrift: 0.3, mouth: 'tight', blinkPeriodMs: 0, blinkBurstProb: 0 }),
    body: body({ floatAmpPx: 0.3, floatPeriodMs: 4000, forwardLeanPx: 0.6 }),
    fx: fx({ glow: 0.32, glowColor: GLOW_AMBER, cautionPulse: 0.78, breathRing: 0.18 }),
    inMs: 260, inEase: 'easeOut', priority: 70,
  },

  shocked: {
    // snap-open eyes, contracted pupils, brief mouth-open, immediate freeze.
    face: face({ browY: -1.8, eyelid: -0.28, pupilScale: 0.7, pupilDrift: 0, mouth: 'open', blinkPeriodMs: 0, blinkBurstProb: 0 }),
    body: body({ floatAmpPx: 0, floatPeriodMs: 1, settleDipPx: 3 }),
    fx: fx({ glow: 0.38, glowColor: GLOW_RED, dangerPulse: 0.6, impactRing: true }),
    inMs: 120, inEase: 'easeOut', priority: 90,
  },

  panicked: {
    // unstable wide eyes, pupil jitter, worried mouth open, subtle shiver.
    face: face({ browY: -1.5, browTilt: 6, eyelid: -0.22, pupilDrift: 2.2, pupilScale: 1.1, mouth: 'worried', blinkPeriodMs: 2600, blinkBurstProb: 0.5 }),
    body: body({ floatAmpPx: 0.4, shiverPx: 0.6, floatPeriodMs: 1800 }),
    fx: fx({ glow: 0.42, glowColor: GLOW_RED, dangerPulse: 0.9, breathRing: 0.22, cautionPulse: 0.6 }),
    inMs: 220, inEase: 'easeOut', priority: 95,
  },

  relieved: {
    // exhale settle; eyelids soften; brow releases.
    face: face({ eyelid: 0.2, mouth: 'smileSoft', pupilDrift: 0.4, blinkPeriodMs: 4800 }),
    body: body({ floatAmpPx: 0.7, floatPeriodMs: 5200, settleDipPx: 1 }),
    fx: fx({ glow: 0.22, glowColor: GLOW_GREEN, breathRing: 0.22 }),
    inMs: 520, inEase: 'easeOut', priority: 40,
  },

  happy: {
    face: face({ mouth: 'smileWide', browY: -0.5, pupilScale: 1.05, blinkPeriodMs: 4000 }),
    body: body({ floatAmpPx: 1.0, floatPeriodMs: 3600 }),
    fx: fx({ glow: 0.28, glowColor: GLOW_YELLOW, shimmer: true, breathRing: 0.18 }),
    inMs: 340, inEase: 'easeOut', priority: 40,
  },

  proud: {
    // composed, stable, slightly held.
    face: face({ mouth: 'smileSoft', browY: 0.5, pupilDrift: 0.2, blinkPeriodMs: 5000 }),
    body: body({ floatAmpPx: 0.4, floatPeriodMs: 5400 }),
    fx: fx({ glow: 0.26, glowColor: GLOW_YELLOW, shimmer: true, breathRing: 0.12 }),
    inMs: 440, inEase: 'easeOut', priority: 42,
  },

  smug: {
    // asymmetric brow/smile, small off-axis lean.
    face: face({ mouth: 'asymmetric', browTilt: -4, pupilBiasY: -0.3, pupilDrift: 0.5, blinkPeriodMs: 4400 }),
    body: body({ floatAmpPx: 0.5, leanDeg: -1.6, floatPeriodMs: 4400 }),
    fx: fx({ glow: 0.22, glowColor: GLOW_YELLOW, successFlare: true }),
    inMs: 380, inEase: 'easeOut', priority: 38,
  },

  celebrating: {
    // one controlled bounce on entry; open, joyful.
    face: face({ mouth: 'smileWide', browY: -0.8, pupilScale: 1.1, blinkPeriodMs: 3600 }),
    body: body({ floatAmpPx: 1.4, floatPeriodMs: 2800, settleDipPx: -4 }), // negative dip = lift
    fx: fx({ glow: 0.42, glowColor: GLOW_YELLOW, shimmer: true, successFlare: true, breathRing: 0.25 }),
    inMs: 320, inEase: 'easeOut', priority: 60,
  },

  annoyed: {
    face: face({ browY: 1, browTilt: -6, eyelid: 0.3, mouth: 'flat', pupilBiasY: 0.2, blinkPeriodMs: 4200 }),
    body: body({ floatAmpPx: 0.3, leanDeg: 1, floatPeriodMs: 4600 }),
    fx: fx({ glow: 0.14, glowColor: GLOW_AMBER, cautionPulse: 0.22 }),
    inMs: 360, inEase: 'easeOut', priority: 32,
  },

  sleepy: {
    face: face({ eyelid: 0.55, mouth: 'neutral', pupilDrift: 0.3, pupilBiasY: 0.4, blinkPeriodMs: 2000, blinkBurstProb: 0.2 }),
    body: body({ floatAmpPx: 0.5, floatPeriodMs: 6400 }),
    fx: fx({ glow: 0.08, glowColor: GLOW_YELLOW, breathRing: 0.05 }),
    inMs: 600, inEase: 'easeOut', priority: 12,
  },

  curious: {
    face: face({ browTilt: -5, pupilDrift: 1.4, pupilBiasY: -0.5, mouth: 'smileSoft', blinkPeriodMs: 4400 }),
    body: body({ floatAmpPx: 0.6, leanDeg: -0.6, floatPeriodMs: 4400 }),
    fx: fx({ glow: 0.16, glowColor: GLOW_BLUE, telemetryHz: 1.2 }),
    inMs: 380, inEase: 'easeOut', priority: 28,
  },

  suspicious: {
    face: face({ browTilt: 5, browY: 0.8, eyelid: 0.34, mouth: 'flat', pupilBiasY: -0.4, pupilDrift: 0.3, blinkPeriodMs: 5400 }),
    body: body({ floatAmpPx: 0.3, leanDeg: -1, floatPeriodMs: 5000 }),
    fx: fx({ glow: 0.14, glowColor: GLOW_AMBER, scanLine: true }),
    inMs: 420, inEase: 'easeInOut', priority: 30,
  },
};

// ────────────────────────────────────────────────────────────────────────────
// UI RESPONSE HOOKS — helpers the screens can call without owning motion logic
// ────────────────────────────────────────────────────────────────────────────

export const UI_PULSE: Record<'info' | 'caution' | 'danger' | 'success', { color: string; ms: number }> = {
  info:    { color: GLOW_BLUE,   ms: 1400 },
  caution: { color: GLOW_AMBER,  ms: 900 },
  danger:  { color: GLOW_RED,    ms: 620 },
  success: { color: GLOW_GREEN,  ms: 1100 },
};

/** Default transition used by cards and CTAs when the emotion changes. */
export const TRANSITION_CARD = { duration: 0.36, ease: 'easeOut' as const };
export const TRANSITION_CTA  = { duration: 0.22, ease: 'easeOut' as const };

// ────────────────────────────────────────────────────────────────────────────
// TIMING CONSTANTS
// ────────────────────────────────────────────────────────────────────────────

/** Minimum time an interrupt must hold before returning to base. */
export const MIN_INTERRUPT_MS = 900;
/** Splash beat durations. */
export const SPLASH = {
  glowIn: 460,
  carIn: 620,
  settleDelay: 540,
  wordmarkIn: 380,
  holdMs: 900,
};
