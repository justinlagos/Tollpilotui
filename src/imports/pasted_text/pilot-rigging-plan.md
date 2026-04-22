Source: Pilot-svg.svg · 500×400 viewBox · Front-facing cartoon car

1. SVG RIGGING PLAN
1.1 Required layer breakdown (rebuild SVG with these IDs)
#pilot_root                    [g, master container]
│
├── #shadow                    [ellipse, cx=250 cy=380, rx=200 ry=12, fill=rgba(0,0,0,0.18)]
├── #glow_base                 [ellipse, cx=250 cy=380, rx=220 ry=18, fill=#6EC1FF, blur=24]
│
├── #body_group                [g, parent of body assembly]
│   ├── #body_main             [path, current d= car silhouette]
│   ├── #body_highlight        [path, top arc shine]
│   ├── #windshield_frame      [path, current eyebrow stroke]
│   ├── #windshield_glass      [path, current D0D0D0 fill]
│   ├── #bumper                [rect, x=40 y=340 w=420 h=25]
│   ├── #wheel_L               [rect, x=70 y=365]
│   ├── #wheel_R               [rect, x=370 y=365]
│   ├── #side_mirror_L         [ellipse cx=65]
│   └── #side_mirror_R         [ellipse cx=435]
│
├── #face_group                [g, parent of all expression layers]
│   │
│   ├── #eye_L_group           [g, anchor 160,250]
│   │   ├── #eye_L_white       [circle r=65]
│   │   ├── #eye_L_iris        [circle r=30, fill #7B4B2A]
│   │   ├── #eye_L_pupil       [circle r=12, fill black]
│   │   ├── #eye_L_shine       [circle r=5, fill white]
│   │   ├── #eye_L_brow        [path, current eyebrow above]
│   │   └── #eye_L_lid         [path, hidden by default, opacity 0]
│   │
│   ├── #eye_R_group           [g, anchor 340,250]
│   │   ├── #eye_R_white       [circle r=65]
│   │   ├── #eye_R_iris        [circle r=30]
│   │   ├── #eye_R_pupil       [circle r=12]
│   │   ├── #eye_R_shine       [circle r=5]
│   │   ├── #eye_R_brow        [path]
│   │   └── #eye_R_lid         [path, opacity 0]
│   │
│   └── #mouth_group           [g, anchor 250,320]
│       ├── #mouth_neutral     [path, slight smile, opacity 1]
│       ├── #mouth_smile       [path, wider smile, opacity 0]
│       ├── #mouth_open        [path, open joyful, opacity 0]
│       └── #mouth_concern     [path, slight frown, opacity 0]
│
└── #fx_group                  [g, sparkles + speed lines]
    ├── #sparkle_01..05        [4-point stars, opacity 0]
    └── #speed_lines_01..04    [thin paths, opacity 0]
1.2 Pivot points (anchor coordinates)
LAYER                  PIVOT (x, y)    PURPOSE
pilot_root             250, 360        ground contact, main bob
body_group             250, 360        bounce, lean, squash
face_group             250, 250        independent face animation
eye_L_group            160, 250        eye scale/squint
eye_R_group            340, 250        eye scale/squint
eye_L_pupil            160, 250        pupil drift
eye_R_pupil            340, 250        pupil drift
mouth_group            250, 320        mouth swap pivot
shadow                 250, 380        ground stretch
glow_base              250, 380        glow scale
sparkle_xx             individual      pop + drift
1.3 What animates per layer
LAYER                  PROPERTIES ANIMATED
pilot_root             translateY (bob), translateX (speed shake)
body_group             rotation (lean), scaleX/scaleY (squash)
shadow                 scaleX (compress on bounce), opacity
glow_base              scale, opacity, fill (color via tween)
eye_L_group            scaleY (squint, blink)
eye_R_group            scaleY (squint, blink)
eye_L_pupil            translateX/Y (drift, focus)
eye_R_pupil            translateX/Y (drift, focus)
eye_L_lid              opacity, position (alert state)
eye_R_lid              opacity, position
mouth_neutral          opacity (cross-fade)
mouth_smile            opacity
mouth_open             opacity
mouth_concern          opacity
wheel_L                rotation (speed state, illusion)
wheel_R                rotation
sparkle_xx             scale, opacity, translateY, rotation
speed_lines_xx         opacity, translateX
side_mirror_L/R        translateX micro-shake (speed)

2. CORE STATES (LOOPING)
2.1 CALM — 4000ms loop
PROPERTY              TIMELINE                                 EASE
pilot_root.y          0ms: 0    →  2000ms: -8    →  4000ms: 0  ease-in-out
glow_base.opacity     0ms: 0.4  →  2000ms: 0.6   →  4000ms: 0.4 ease-in-out
glow_base.scale       0ms: 1.0  →  2000ms: 1.05  →  4000ms: 1.0 ease-in-out
glow_base.fill        #6EC1FF (static)
shadow.scaleX         0ms: 1.0  →  2000ms: 0.95  →  4000ms: 1.0 ease-in-out
shadow.opacity        0ms: 0.18 →  2000ms: 0.14  →  4000ms: 0.18 ease-in-out
mouth_neutral         opacity 1, all others 0
eye_L_lid.opacity     0
eye_R_lid.opacity     0

[micro: pupil drift + blink — see section 4]
2.2 ALERT — 2000ms loop
PROPERTY              TIMELINE                                 EASE
body_group.rotation   0ms: 0°   →  1000ms: -2°   →  2000ms: 0° ease-in-out
                      pivot at 250, 360
pilot_root.y          0ms: 0    →  1000ms: -2    →  2000ms: 0  ease-in-out
glow_base.opacity     0ms: 0.5  →  500ms: 0.9    →  1000ms: 0.5 ease-in-out
                      0ms: 0.5  →  1500ms: 0.9   →  2000ms: 0.5
glow_base.scale       0ms: 1.0  →  500ms: 1.12   →  1000ms: 1.0
                      0ms: 1.0  →  1500ms: 1.12  →  2000ms: 1.0
glow_base.fill        #FFB347
eye_L_group.scaleY    0.55 (held, narrowed)
eye_R_group.scaleY    0.55 (held, narrowed)
eye_L_lid.opacity     1, position y +18px
eye_R_lid.opacity     1, position y +18px
eye_L_pupil           translateY +4 (looking slightly down/forward, fixed)
eye_R_pupil           translateY +4
mouth_concern         opacity 1, others 0

[micro: NO drift, NO blink during alert — fixed focus]
2.3 CELEBRATE — 800ms loop
PROPERTY              TIMELINE                                 EASE
pilot_root.y          0ms: 0     →  160ms: -28  →  340ms: +6   →  540ms: -10  →  720ms: +2  →  800ms: 0
                      ease-out → ease-in → ease-out → ease-in → ease-out
body_group.scaleX/Y   0ms: 1.0/1.0
                      160ms: 0.92/1.12  (stretch up at peak)
                      340ms: 1.12/0.90  (squash on floor)
                      540ms: 0.96/1.06  (secondary stretch)
                      720ms: 1.04/0.96  (secondary squash)
                      800ms: 1.0/1.0
shadow.scaleX         0ms: 1.0   →  160ms: 0.7  →  340ms: 1.25  →  540ms: 0.85  →  800ms: 1.0
shadow.opacity        0ms: 0.18  →  160ms: 0.08 →  340ms: 0.28  →  800ms: 0.18
glow_base.opacity     0ms: 0.6   →  160ms: 1.0  →  340ms: 0.7   →  800ms: 0.6
glow_base.scale       0ms: 1.0   →  160ms: 1.25 →  340ms: 1.10  →  800ms: 1.0
glow_base.fill        #FFD46A
eye_L_group.scaleY    1.15 (held, wide)
eye_R_group.scaleY    1.15 (held, wide)
eye_L_pupil.scale     1.1
eye_R_pupil.scale     1.1
mouth_open            opacity 1, others 0
sparkle_01..05        active — see section 2.4

[micro: NO drift, NO blink during celebrate]
2.4 Sparkle particles (Celebrate only)
SPARKLE   POSITION (x,y)    DELAY    DURATION    PEAK SCALE
01        130, 130          0ms      640ms       1.0
02        370, 110          80ms     640ms       0.85
03        90, 230           160ms    640ms       1.1
04        410, 220          240ms    640ms       0.9
05        250, 80           320ms    640ms       1.2

PER-SPARKLE TIMELINE:
  0ms:    scale 0,    opacity 0,   rotation 0°
  160ms:  scale peak, opacity 1,   rotation 90°
  480ms:  scale 0.5,  opacity 0,   rotation 180°, translateY -32
  481ms+: dormant

3. SPEED STATE — 1500ms loop
PROPERTY                  TIMELINE                                   EASE
body_group.rotation       -3° (held, forward lean)                   static
pilot_root.y              0ms: 0  →  750ms: -1  →  1500ms: 0         linear
pilot_root.x              0ms: 0  →  100ms: 0.5  →  200ms: -0.5      linear
                          (continuous micro-vibration, ±0.5px)
glow_base.fill            #6EC1FF (subtle, kept calm)
glow_base.opacity         0.45 (held lower than calm — recedes)
glow_base.scaleY          0.7 (compressed — speed flattens it)
glow_base.scaleX          1.4 (stretched — motion trail)
shadow.scaleX             1.3 (stretched horizontally, motion blur feel)
shadow.opacity            0.12 (lighter, vehicle "lifted")

eye_L_group.scaleY        0.85 (slightly narrowed, focused but calm)
eye_R_group.scaleY        0.85
eye_L_pupil.translateX    +5 (looking forward — slight right of center as facing camera)
eye_R_pupil.translateX    +5
mouth_neutral             opacity 1

wheel_L.rotation          continuous 360°/300ms (motion blur via opacity)
wheel_R.rotation          continuous 360°/300ms
side_mirror_L.x           ±0.3px shake
side_mirror_R.x           ±0.3px shake

speed_lines_01..04        active — see 3.1

[micro: blink rate doubles to every 1.5–2.5s, faster but calm]
3.1 Speed lines
LINE    Y-POS    LENGTH    OPACITY MAX    PHASE OFFSET
01      120      80px      0.4            0ms
02      200      120px     0.5            120ms
03      280      90px      0.35           240ms
04      340      110px     0.45           360ms

PER-LINE TIMELINE (480ms loop):
  0ms:    x=520 (off-right), opacity 0
  80ms:   opacity peak
  240ms:  x=−100 (off-left), opacity peak
  280ms:  opacity 0
  281ms+: reset to start
3.2 Wheel rotation illusion
Wheels are rectangles in source SVG — true rotation looks bad. Use this trick:
wheel_L, wheel_R    apply horizontal stripe pattern as fill
                    animate fill pattern X-offset continuously
                    creates rolling illusion without rotating shape

OR

wheel_L, wheel_R    keep static
                    add 2 small spoke-lines as children
                    rotate spokes only, not full wheel

4. CONTINUOUS MICRO-BEHAVIOURS
These run underneath state animations on a separate animation track. They never override state animation, only add on top.
4.1 Blinking system
STATE         BLINK INTERVAL    BLINK DURATION    BLINK CURVE
calm          3000–5000ms       180ms             scaleY 1 → 0.05 → 1
                                                  ease-in (close), ease-out (open)
alert         disabled          —                 (suppressed)
celebrate     disabled          —                 (suppressed)
speed         1500–2500ms       140ms             faster, snappier
idle/empty    4000–6000ms       200ms             slower, dreamy

INTERVAL RANDOMISATION: ±20% jitter on each cycle
DOUBLE-BLINK CHANCE: 8% — second blink 220ms after first
4.2 Pupil micro-drift
STATE         AMPLITUDE       FREQUENCY        PATTERN
calm          ±3px X, ±2px Y  3000ms cycle     organic random walk
alert         0               —                fixed
celebrate     0               —                wide stare
speed         0               —                forward focused
idle          ±4px X, ±3px Y  5000ms cycle     slow, dreamy

IMPLEMENTATION: Perlin noise driver on pupil x,y offset
                Both pupils drift in sync (saccade illusion)
4.3 Idle breathing
APPLIES TO: pilot_root.y when state has no motion already
AMPLITUDE: ±1.5px
PERIOD: 3500ms
CURVE: sine wave

This is BLENDED with state motion, never replacing it.
In states with strong motion (Celebrate), suppress to 0.
4.4 Eye focus shifts
Periodically (every 8–12s), pupils briefly look toward a "point of interest":
TRIGGER:    every 8000–12000ms (random)
DURATION:   600ms (200ms shift, 200ms hold, 200ms return)
TARGET:     random direction from set: [up-left, up-right, down-left, down-right, up]
AMPLITUDE:  ±5px X, ±4px Y
SUPPRESS IN: alert, celebrate, speed
4.5 Micro facial adjustments
MOUTH MICRO-SHIFT     ±2% width scale, every 4–7s, 400ms duration
EYEBROW MICRO-LIFT    1px Y, every 6–10s, 500ms (calm only)
HEAD-TILT             rotation ±0.5°, every 10–15s, 1200ms (calm + idle only)

5. TRANSITIONS
TRANSITION              DURATION    MOTION DESCRIPTION
─────────────────────────────────────────────────────────────────────────────
Calm → Alert            300ms       SNAP. Body rotation 0 → -2° (linear, no ease).
                                    Eyes scaleY 1 → 0.55 in 100ms.
                                    Lids fade in over 150ms.
                                    Glow color crossfade #6EC1FF → #FFB347.
                                    Mouth crossfade neutral → concern over 200ms.

Alert → Calm            600ms       EASE. Body rotation -2° → 0° (ease-out cubic).
                                    Eyes scaleY 0.55 → 1.0 over 400ms.
                                    Lids fade out over 300ms.
                                    Glow color crossfade #FFB347 → #6EC1FF.
                                    Mouth crossfade concern → neutral.

Calm → Celebrate        400ms       POP. Anticipation dip 0 → +4 in 80ms,
                                    then jump to -28 in 240ms (overshoot ease-out back).
                                    Eyes scaleY snap to 1.15.
                                    Mouth crossfade neutral → open in 200ms.
                                    Glow #6EC1FF → #FFD46A in 200ms.
                                    Sparkles all launch at frame 240ms.

Celebrate → Calm        800ms       SETTLE. Damped spring back to y=0 over 600ms.
                                    Body scale settle to 1.0/1.0 (decay oscillation).
                                    Eyes scaleY 1.15 → 1.0 over 500ms.
                                    Mouth crossfade open → neutral over 400ms.
                                    Glow color crossfade #FFD46A → #6EC1FF over 600ms.
                                    Sparkles fade opacity 1 → 0 over 300ms.

Calm → Speed            500ms       ENGAGE. Body rotation 0 → -3° over 400ms (ease-in).
                                    Glow stretch scaleX 1 → 1.4, scaleY 1 → 0.7.
                                    Eyes scaleY 1 → 0.85 over 300ms.
                                    Speed lines fade in starting at 200ms.
                                    Wheels begin rotating from 0 → full speed over 500ms.

Speed → Calm            700ms       SLOW DOWN. Body rotation -3° → 0° (ease-out).
                                    Glow returns to round shape over 500ms.
                                    Eyes return to scaleY 1.0 over 400ms.
                                    Speed lines fade out starting at 0ms over 300ms.
                                    Wheels decelerate over 700ms.

Alert → Speed           400ms       URGENT MOTION. Body rotation -2° → -3° over 200ms.
                                    Eyes stay narrowed, transition lid opacity 1 → 0.5.
                                    Mouth crossfade concern → neutral over 250ms.
                                    Glow color crossfade #FFB347 → #6EC1FF over 350ms.
                                    Speed lines fade in at 150ms.

Speed → Alert           350ms       TIGHTEN. Body rotation -3° → -2° over 200ms.
                                    Eyes scaleY 0.85 → 0.55 in 200ms.
                                    Lids fade in 0 → 1 over 250ms.
                                    Glow color crossfade #6EC1FF → #FFB347 over 300ms.
                                    Mouth crossfade neutral → concern over 250ms.
                                    Speed lines fade out over 200ms.

6. TRIGGERED MOMENTS (ONE-SHOT)
TRIGGER                  DURATION    EMOTION              ANIMATION DESCRIPTION
─────────────────────────────────────────────────────────────────────────────────────
plate_verified_intro     2400ms      Awakening, joy        First 600ms: dimmed state, no glow, eyes closed.
                                                           Frame 600ms: blink open snap (eyes scaleY 0 → 1.15
                                                           in 100ms, settle to 1.0 by 800ms).
                                                           Glow fades in #6EC1FF over 400ms starting at 700ms.
                                                           Mouth crossfade flat → neutral → smile by 1500ms.
                                                           Single celebrate bounce at 1600ms.
                                                           Settle to calm by 2400ms.

zone_alert_entry         700ms       Sudden focus          INSTANT. Frame 0: pop scale to 1.05 (warning flash).
                                                           Frame 100ms: scale settles, lean to -2°.
                                                           Eyes scaleY 1 → 0.55 in 200ms.
                                                           Glow flashes #FFB347 at high opacity 0.95 then settles.
                                                           Single subtle screen shake (root x ±2px) over 300ms.
                                                           Holds in alert state after.

reroute_success          2000ms      Quick win             Single celebrate loop (800ms) with double sparkle count.
                                                           Hold final frame 200ms.
                                                           Settle to calm over 1000ms (smooth ease).

trip_end_saved           2500ms      Earned satisfaction   Two celebrate loops (1600ms total).
                                                           Coin/£ icon could fly across mouth area.
                                                           Settle to calm over 900ms.

pcn_success              5000ms      Hero moment           HERO. Frame 0: glow flash #FFD46A at full opacity.
                                                           5 celebrate loops (4000ms).
                                                           Sparkle count doubled to 10 across all loops.
                                                           Final sparkle wave at 3800ms with extended opacity.
                                                           Hold pose 400ms (eyes wide, mouth open).
                                                           Settle to calm over 600ms.

streak_milestone         3000ms      Pride                 Frame 0: badge SVG drops in from above (0 → +30 over
                                                           300ms with elastic ease) above pilot's roof.
                                                           3 celebrate loops (2400ms).
                                                           Badge stays visible throughout.
                                                           Settle to calm over 300ms, badge fades over 500ms.

empty_state_idle         4500ms      Patient anticipation  Loop. Calm base.
                                                           Eyes occasionally look up-left (waiting).
                                                           Slower blink rate (every 5s).
                                                           Glow opacity reduced to 0.3 (sleeping).
                                                           Single soft sigh-bob every 4500ms (deeper than calm bob).
                                                           Loops indefinitely until trigger.

7. APP MAPPING
SCREEN                      DEFAULT     TRIGGER                                     STATE PLAYED              SIZE      BEHAVIOR
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Onboarding slide 3          —           Plate verified                              plate_verified_intro      280px     One-shot, then calm loop
Dashboard (home hero)       calm        MOT <14d / Tax expiring / ULEZ failure      calm → alert              140px     Hold alert until issue cleared
Dashboard (home hero)       calm        Daily savings > £0 (first open of day)      reroute_success           140px     Once per day on first open
Vehicle status card         calm        Compliance issue                            calm → alert              72px      Mirror dashboard state
Vehicle detail screen       calm        MOT booking flow opened                     calm → celebrate (1 loop) 200px     Reward action
Drive mode (top corner)     calm        Vehicle moving > 8mph                       calm → speed              48px      Held while in motion
Drive mode (top corner)     speed       Zone 1km ahead                              speed → alert             48px      Held until zone passed
Drive mode (top corner)     alert       Reroute accepted                            reroute_success           48px      Then back to speed
Zone alert overlay          alert       Zone entered                                zone_alert_entry          120px     One-shot, then alert hold
Reroute success screen      celebrate   Auto-fires on successful reroute            reroute_success           160px     Centered hero
Trip summary screen         celebrate   Trip ended with savings                     trip_end_saved            180px     Above savings figure
Trip summary screen         calm        Trip ended with no savings                  calm                      180px     Neutral
PCN appeal success modal    celebrate   Appeal upheld notification                  pcn_success               240px     FULL hero takeover
MOT warning banner          alert       MOT < 14d                                   alert (held)              48px      Inline with banner
MOT warning banner          alert       MOT < 3d                                    alert + faster pulse      48px      Escalated urgency
Streak milestone modal      celebrate   7d / 30d / 100d / 365d                      streak_milestone          280px     Full screen takeover
Empty state — no trips      idle        First-time user, no data                    empty_state_idle          200px     Looping waiting state
Empty state — no vehicles   idle        No vehicle added                            empty_state_idle          200px     Looping
TollScore weekly +          calm        Score increased week-over-week              calm → celebrate (1 loop) 100px     Sunday evening notification
TollScore weekly −          calm        Score decreased week-over-week              calm → alert (3s hold)    100px     Sunday evening notification
Notification tray icon      —           Push notification received                  static PNG fallback       48px      Per-notification mood color
Tab bar (Home tab)          calm        Active tab                                  calm                      32px      Static, very subtle bob
Tab bar (Home tab)          calm        Pending action exists                       alert (badge mode)        32px      Replace with alert state PNG
Lock-screen widget          calm        Daily commute window                        calm                      64px      Static frame, no animation
Year-in-Review intro        celebrate   Annual recap launch                         pcn_success (re-skinned)  full      The biggest annual moment

8. RIVE IMPLEMENTATION
8.1 State machine structure
STATE MACHINE NAME: PilotMain

STATES (nodes):
  ┌─ Entry
  ├─ Calm           [looping, default]
  ├─ Alert          [looping]
  ├─ Celebrate      [looping]
  ├─ Speed          [looping]
  ├─ Idle           [looping, slower than Calm]
  └─ One-shot layer (separate state machine):
       ├─ PlateVerified
       ├─ ZoneAlertEntry
       ├─ RerouteSuccess
       ├─ TripEndSaved
       ├─ PCNSuccess
       └─ StreakMilestone
8.2 Inputs (parameters)
NAME              TYPE        VALUES                              CONTROL
mode              enum        calm | alert | celebrate | speed | idle    primary state driver
trigger           trigger     (fires one-shot)                    pulse-based
oneShotName       string      plate_verified | zone_alert_entry |
                              reroute_success | trip_end_saved |
                              pcn_success | streak_milestone      paired with trigger
speedValue        number      0–100                               drives Speed state intensity
alertSeverity     number      0–1                                 drives Alert pulse rate (0=mild, 1=severe)
isNight           boolean     false                               adjusts color tokens
celebrateLoops    number      1–5                                 how many loops Celebrate plays
8.3 Animation blending rules
PRIORITY LAYERS (bottom to top):
  Layer 0:  Idle breathing      (always active, blended additively)
  Layer 1:  Pupil drift          (always active, blended additively)
  Layer 2:  Blinking system      (always active, blended additively)
  Layer 3:  Core state           (calm | alert | celebrate | speed | idle)
  Layer 4:  Transition           (active during state changes only)
  Layer 5:  One-shot triggers    (override all when active)

BLEND MODES:
  Layer 0–2 blend ADDITIVELY onto Layer 3
  Layer 3 fully drives transform/opacity for state-defined properties
  Layer 4 takes over Layer 3 for transition duration
  Layer 5 takes full control when triggered, queues other states

PRIORITY ORDER (when conflicts):
  pcn_success > streak_milestone > reroute_success > trip_end_saved
  > zone_alert_entry > plate_verified > Celebrate > Alert > Speed > Calm > Idle

INTERRUPTION RULES:
  Higher priority interrupts lower with appropriate transition.
  Same priority does not interrupt — queues for next loop completion.
8.4 Loop vs one-shot handling
LOOPING (Layer 3):
  Loops indefinitely until mode input changes.
  On mode change, plays appropriate transition then enters new state.

ONE-SHOT (Layer 5):
  Plays once, fires "completed" event.
  On completion, returns control to Layer 3 (current mode).
  If mode changed during one-shot, transitions to new mode after.

CELEBRATE LOOP COUNT:
  celebrateLoops input determines repeats.
  After N loops, automatically transitions back to Calm.

SPEED INTENSITY:
  speedValue input scales:
    - body rotation magnitude (0 = -1°, 100 = -3°)
    - speed line opacity peak (0 = 0.2, 100 = 0.5)
    - vibration amplitude (0 = ±0.2px, 100 = ±0.5px)
    - blink frequency (linear interpolation)

9. EXPORT STRATEGY
9.1 For Figma Make (prototype phase)
FORMAT          USE CASE                            OUTPUT SPEC
────────────────────────────────────────────────────────────────────────────
MP4 loops       In-prototype playback               320×320, 60fps, H.264, transparent BG (use ProRes 4444 for alpha)
GIF loops       Quick sharing, low fidelity         320×320, 30fps, max 256 colors, looped
PNG sequence    Per-frame control                   320×320 PNG, 60fps, sequential numbering
Static PNG      Fallback/placeholder                32, 72, 140, 280px, transparent BG, one per state

REQUIRED EXPORTS PER STATE:
  pilot_calm_loop.mp4
  pilot_alert_loop.mp4
  pilot_celebrate_loop.mp4
  pilot_speed_loop.mp4
  pilot_idle_loop.mp4

REQUIRED EXPORTS PER TRIGGER:
  pilot_plate_verified.mp4
  pilot_zone_alert_entry.mp4
  pilot_reroute_success.mp4
  pilot_trip_end_saved.mp4
  pilot_pcn_success.mp4
  pilot_streak_milestone.mp4

REQUIRED STATIC PNGs:
  pilot_calm_32.png, _72.png, _140.png, _280.png
  pilot_alert_32.png, _72.png, _140.png, _280.png
  pilot_celebrate_32.png, _72.png, _140.png, _280.png
  pilot_speed_72.png, _140.png

FIGMA MAKE STATE SIMULATION:
  Use prototype interactions to swap between MP4 layers.
  On-tap or after-delay transitions trigger video swaps.
  Layer one MP4 per state, control opacity via prototype variants.
9.2 For production app
FORMAT          USE CASE                            OUTPUT SPEC
────────────────────────────────────────────────────────────────────────────
.riv file       Full state machine                  Single file, all states + transitions + triggers
                                                    Target file size: < 80KB

RUNTIME INTEGRATION:
  iOS:          rive-ios SDK, RiveViewModel
  Android:      rive-android SDK
  React Native: rive-react-native
  Web:          @rive-app/canvas or @rive-app/webgl

CODE CONTROL EXAMPLE (React Native):

  import Rive, { RiveRef } from 'rive-react-native';
  
  const pilotRef = useRef<RiveRef>(null);
  
  // Set state
  pilotRef.current?.setInputState('PilotMain', 'mode', 'celebrate');
  
  // Fire one-shot
  pilotRef.current?.setInputState('PilotMain', 'oneShotName', 'pcn_success');
  pilotRef.current?.fireState('PilotMain', 'trigger');
  
  // Speed intensity
  pilotRef.current?.setInputState('PilotMain', 'speedValue', currentSpeedMph);
  
  // Alert severity (e.g., MOT 3 days vs 14 days)
  pilotRef.current?.setInputState('PilotMain', 'alertSeverity', daysUntilExpiry < 3 ? 1 : 0.5);

PERFORMANCE TARGETS:
  Single Pilot instance:    < 2% CPU on iPhone 12
  Memory footprint:         < 8MB
  Cold start render:        < 100ms
  State transition latency: < 16ms (1 frame at 60fps)

FALLBACK:
  If Rive fails to load, render pilot_calm_140.png static.
  If device is low-power mode, render static PNGs throughout.

10. NAMING SYSTEM
pilot/
├── source/
│   ├── pilot_master.svg                  Rigged SVG with all named layers
│   ├── pilot_master.riv                  Rive source file (editable)
│   └── pilot_spec.md                     This document
│
├── states/
│   ├── calm/
│   │   ├── pilot_calm_loop.mp4
│   │   ├── pilot_calm_loop.gif
│   │   ├── pilot_calm_32.png
│   │   ├── pilot_calm_72.png
│   │   ├── pilot_calm_140.png
│   │   └── pilot_calm_280.png
│   ├── alert/
│   │   ├── pilot_alert_loop.mp4
│   │   ├── pilot_alert_loop.gif
│   │   ├── pilot_alert_32.png
│   │   ├── pilot_alert_72.png
│   │   ├── pilot_alert_140.png
│   │   └── pilot_alert_280.png
│   ├── celebrate/
│   │   ├── pilot_celebrate_loop.mp4
│   │   ├── pilot_celebrate_loop.gif
│   │   ├── pilot_celebrate_32.png
│   │   ├── pilot_celebrate_72.png
│   │   ├── pilot_celebrate_140.png
│   │   └── pilot_celebrate_280.png
│   ├── speed/
│   │   ├── pilot_speed_loop.mp4
│   │   ├── pilot_speed_loop.gif
│   │   ├── pilot_speed_72.png
│   │   └── pilot_speed_140.png
│   └── idle/
│       ├── pilot_idle_loop.mp4
│       └── pilot_idle_140.png
│
├── transitions/
│   ├── pilot_calm_to_alert.mp4
│   ├── pilot_alert_to_calm.mp4
│   ├── pilot_calm_to_celebrate.mp4
│   ├── pilot_celebrate_to_calm.mp4
│   ├── pilot_calm_to_speed.mp4
│   ├── pilot_speed_to_calm.mp4
│   ├── pilot_alert_to_speed.mp4
│   └── pilot_speed_to_alert.mp4
│
├── triggers/
│   ├── pilot_plate_verified.mp4
│   ├── pilot_zone_alert_entry.mp4
│   ├── pilot_reroute_success.mp4
│   ├── pilot_trip_end_saved.mp4
│   ├── pilot_pcn_success.mp4
│   ├── pilot_streak_milestone.mp4
│   └── pilot_empty_state_idle.mp4
│
└── production/
    ├── pilot.riv                         Final Rive file for app
    ├── pilot_fallback.png                Static fallback (140px)
    └── pilot_controller.ts               State machine wrapper code

HANDOFF CHECKLIST
□ Rebuild SVG with named layer IDs per Section 1.1
□ Set pivot points per Section 1.2
□ Build Rive state machine per Section 8
□ Export all loops + transitions + triggers per Section 9
□ Generate static PNG fallbacks per Section 9.1
□ Implement runtime controller per Section 9.2
□ Test priority interruption logic (PCN > Streak > Reroute > etc.)
□ QA at 32px, 72px, 140px, 280px sizes
□ Performance test on iPhone SE (low-end target device)
□ Validate against App Mapping (Section 7) — every screen has correct state