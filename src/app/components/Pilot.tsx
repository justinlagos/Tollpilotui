import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';

// ═══════════════════════════════════════════════════════════════
// PILOT STATES & TYPES
// ═══════════════════════════════════════════════════════════════
export type PilotMode = 'calm' | 'alert' | 'celebrate' | 'speed' | 'idle';
export type PilotTrigger = 
  | 'plate_verified' 
  | 'zone_alert_entry' 
  | 'reroute_success' 
  | 'trip_end_saved' 
  | 'pcn_success' 
  | 'streak_milestone';

interface PilotProps {
  mode?: PilotMode;
  size?: number;
  trigger?: PilotTrigger | null;
  onTriggerComplete?: () => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════

// Root bob animation
const rootVariants = {
  calm: {
    y: [0, -8, 0],
    x: 0,
    transition: { 
      y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      x: { duration: 0 }
    }
  },
  alert: {
    y: [0, -2, 0],
    x: 0,
    transition: { 
      y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      x: { duration: 0 }
    }
  },
  celebrate: {
    y: [0, -28, 6, -10, 2, 0],
    x: 0,
    transition: {
      y: { 
        duration: 0.8, 
        repeat: Infinity,
        times: [0, 0.2, 0.425, 0.675, 0.9, 1],
        ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut']
      },
      x: { duration: 0 }
    }
  },
  speed: {
    y: [0, -1, 0],
    x: [0, 0.5, -0.5, 0],
    transition: { 
      y: { duration: 1.5, repeat: Infinity, ease: 'linear' },
      x: { duration: 0.2, repeat: Infinity, ease: 'linear' }
    }
  },
  idle: {
    y: [0, -8, 0],
    x: 0,
    transition: { 
      y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
      x: { duration: 0 }
    }
  }
};

// Body rotation and squash
const bodyVariants = {
  calm: {
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 0.3 }
  },
  alert: {
    rotate: [0, -2, 0],
    scaleX: 1,
    scaleY: 1,
    transition: { 
      rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  celebrate: {
    rotate: 0,
    scaleX: [1, 0.92, 1.12, 0.96, 1.04, 1],
    scaleY: [1, 1.12, 0.90, 1.06, 0.96, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      times: [0, 0.2, 0.425, 0.675, 0.9, 1]
    }
  },
  speed: {
    rotate: -3,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 0.5 }
  },
  idle: {
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 0.3 }
  }
};

// Shadow variants
const shadowVariants = {
  calm: {
    scaleX: [1.0, 0.95, 1.0],
    opacity: [0.18, 0.14, 0.18],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  },
  alert: {
    scaleX: 1.0,
    opacity: 0.18,
    transition: { duration: 0.3 }
  },
  celebrate: {
    scaleX: [1.0, 0.7, 1.25, 0.85, 1.0],
    opacity: [0.18, 0.08, 0.28, 0.18, 0.18],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      times: [0, 0.2, 0.425, 0.675, 1]
    }
  },
  speed: {
    scaleX: 1.3,
    opacity: 0.12,
    transition: { duration: 0.5 }
  },
  idle: {
    scaleX: [1.0, 0.95, 1.0],
    opacity: [0.18, 0.14, 0.18],
    transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
  }
};

// Glow variants
const glowVariants = {
  calm: {
    scale: [1.0, 1.05, 1.0],
    opacity: [0.4, 0.6, 0.4],
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  },
  alert: {
    scale: [1.0, 1.12, 1.0, 1.0, 1.12, 1.0],
    opacity: [0.5, 0.9, 0.5, 0.5, 0.9, 0.5],
    scaleX: 1,
    scaleY: 1,
    transition: {
      duration: 2,
      repeat: Infinity,
      times: [0, 0.25, 0.5, 0.5, 0.75, 1],
      ease: 'easeInOut'
    }
  },
  celebrate: {
    scale: [1.0, 1.25, 1.10, 1.0],
    opacity: [0.6, 1.0, 0.7, 0.6],
    scaleX: 1,
    scaleY: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      times: [0, 0.2, 0.425, 1]
    }
  },
  speed: {
    scale: 1.0,
    opacity: 0.45,
    scaleX: 1.4,
    scaleY: 0.7,
    transition: { duration: 0.5 }
  },
  idle: {
    scale: 1.0,
    opacity: 0.3,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 0.3 }
  }
};

// Eye variants
const eyeVariants = {
  calm: {
    scaleY: 1.0,
    transition: { duration: 0.4 }
  },
  alert: {
    scaleY: 0.55,
    transition: { duration: 0.1 }
  },
  celebrate: {
    scaleY: 1.15,
    transition: { duration: 0.2 }
  },
  speed: {
    scaleY: 0.85,
    transition: { duration: 0.3 }
  },
  idle: {
    scaleY: 1.0,
    transition: { duration: 0.4 }
  }
};

// Pupil variants
const pupilVariants = {
  calm: {
    x: 0,
    y: 0,
    scale: 1.0,
    transition: { duration: 0.3 }
  },
  alert: {
    x: 0,
    y: 4,
    scale: 1.0,
    transition: { duration: 0.3 }
  },
  celebrate: {
    x: 0,
    y: 0,
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  speed: {
    x: 5,
    y: 0,
    scale: 1.0,
    transition: { duration: 0.3 }
  },
  idle: {
    x: 0,
    y: 0,
    scale: 1.0,
    transition: { duration: 0.4 }
  }
};

// Glow colors per state
const glowColors = {
  calm: '#6EC1FF',
  alert: '#FFB347',
  celebrate: '#FFD46A',
  speed: '#6EC1FF',
  idle: '#6EC1FF'
};

// ═══════════════════════════════════════════════════════════════
// PILOT COMPONENT
// ═══════════════════════════════════════════════════════════════
export function Pilot({ 
  mode = 'calm', 
  size = 140, 
  trigger = null,
  onTriggerComplete,
  className = '' 
}: PilotProps) {
  const [currentMode, setCurrentMode] = useState<PilotMode>(mode);
  const [mouthState, setMouthState] = useState<'neutral' | 'smile' | 'open' | 'concern'>('neutral');
  const [showSparkles, setShowSparkles] = useState(false);
  const [blinking, setBlinking] = useState(false);

  // Update mode when prop changes
  useEffect(() => {
    setCurrentMode(mode);
    
    // Set mouth based on mode
    if (mode === 'alert') setMouthState('concern');
    else if (mode === 'celebrate') setMouthState('open');
    else setMouthState('neutral');
  }, [mode]);

  // Handle triggers
  useEffect(() => {
    if (trigger) {
      // Handle one-shot animations
      if (trigger === 'celebrate' || trigger === 'reroute_success' || trigger === 'trip_end_saved') {
        setShowSparkles(true);
        setMouthState('open');
        setTimeout(() => {
          setShowSparkles(false);
          onTriggerComplete?.();
        }, 2000);
      } else if (trigger === 'pcn_success' || trigger === 'streak_milestone') {
        setShowSparkles(true);
        setMouthState('open');
        setTimeout(() => {
          setShowSparkles(false);
          onTriggerComplete?.();
        }, 5000);
      } else if (trigger === 'zone_alert_entry') {
        setMouthState('concern');
        setTimeout(() => {
          onTriggerComplete?.();
        }, 700);
      } else if (trigger === 'plate_verified') {
        setMouthState('smile');
        setTimeout(() => {
          setMouthState('neutral');
          onTriggerComplete?.();
        }, 2400);
      }
    }
  }, [trigger, onTriggerComplete]);

  // Blinking animation
  useEffect(() => {
    const blinkIntervals = {
      calm: [3000, 5000],
      alert: [0, 0], // disabled
      celebrate: [0, 0], // disabled
      speed: [1500, 2500],
      idle: [4000, 6000]
    };

    const [minInterval, maxInterval] = blinkIntervals[currentMode];
    
    if (minInterval === 0) return; // No blinking in this state

    const scheduleBlink = () => {
      const interval = minInterval + Math.random() * (maxInterval - minInterval);
      return setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleNext();
        }, currentMode === 'speed' ? 140 : 180);
      }, interval);
    };

    let timeoutId: NodeJS.Timeout;
    const scheduleNext = () => {
      timeoutId = scheduleBlink();
    };

    timeoutId = scheduleBlink();

    return () => clearTimeout(timeoutId);
  }, [currentMode]);

  const viewBoxSize = 500;
  const scale = size / viewBoxSize;

  return (
    <div className={className} style={{ width: size, height: size * 0.8 }}>
      <svg 
        width={size} 
        height={size * 0.8} 
        viewBox="0 0 500 400" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <motion.g
          id="pilot_root"
          variants={rootVariants}
          animate={currentMode}
          style={{ originX: '250px', originY: '360px' }}
        >
          {/* Shadow */}
          <motion.ellipse
            id="shadow"
            cx={250}
            cy={380}
            rx={200}
            ry={12}
            fill="rgba(0,0,0,0.18)"
            variants={shadowVariants}
            animate={currentMode}
            style={{ originX: '250px', originY: '380px' }}
          />

          {/* Glow base */}
          <motion.ellipse
            id="glow_base"
            cx={250}
            cy={380}
            rx={220}
            ry={18}
            fill={glowColors[currentMode]}
            variants={glowVariants}
            animate={currentMode}
            style={{ 
              originX: '250px', 
              originY: '380px',
              filter: 'blur(24px)'
            }}
          />

          {/* Body group */}
          <motion.g
            id="body_group"
            variants={bodyVariants}
            animate={currentMode}
            style={{ originX: '250px', originY: '360px' }}
          >
            {/* Main body */}
            <path
              id="body_main"
              d="M50,300 Q50,150 250,150 Q450,150 450,300 L450,340 Q450,360 250,360 Q50,360 50,340 Z"
              fill="#A0A0A0"
              stroke="#707070"
              strokeWidth="2"
            />

            {/* Body highlight */}
            <path
              id="body_highlight"
              d="M120,150 Q130,50 250,50 Q370,50 380,150"
              fill="none"
              stroke="#707070"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Windshield */}
            <path
              id="windshield_glass"
              d="M140,150 L160,80 Q250,70 340,80 L360,150"
              fill="#D0D0D0"
              opacity="0.5"
            />

            {/* Bumper */}
            <rect
              id="bumper"
              x={40}
              y={340}
              width={420}
              height={25}
              rx={12}
              fill="#888888"
            />

            {/* Wheels */}
            <rect
              id="wheel_L"
              x={70}
              y={365}
              width={60}
              height={30}
              rx={5}
              fill="#333"
            />
            <rect
              id="wheel_R"
              x={370}
              y={365}
              width={60}
              height={30}
              rx={5}
              fill="#333"
            />

            {/* Side mirrors */}
            <ellipse
              id="side_mirror_L"
              cx={65}
              cy={190}
              rx={25}
              ry={15}
              fill="#A0A0A0"
              stroke="#707070"
            />
            <ellipse
              id="side_mirror_R"
              cx={435}
              cy={190}
              rx={25}
              ry={15}
              fill="#A0A0A0"
              stroke="#707070"
            />
          </motion.g>

          {/* Face group */}
          <g id="face_group">
            {/* Left eye */}
            <motion.g
              id="eye_L_group"
              variants={eyeVariants}
              animate={currentMode}
              style={{ originX: '160px', originY: '250px' }}
            >
              <circle
                id="eye_L_white"
                cx={160}
                cy={250}
                r={65}
                fill="white"
                stroke="#707070"
                strokeWidth="3"
              />
              <motion.g
                variants={pupilVariants}
                animate={currentMode}
              >
                <circle
                  id="eye_L_iris"
                  cx={160}
                  cy={250}
                  r={30}
                  fill="#7B4B2A"
                />
                <circle
                  id="eye_L_pupil"
                  cx={160}
                  cy={250}
                  r={12}
                  fill="black"
                />
                <circle
                  id="eye_L_shine"
                  cx={145}
                  cy={235}
                  r={5}
                  fill="white"
                  opacity="0.8"
                />
              </motion.g>
              {/* Blink overlay */}
              <motion.rect
                x={95}
                y={185}
                width={130}
                height={130}
                fill="#A0A0A0"
                stroke="#707070"
                strokeWidth="2"
                animate={{ scaleY: blinking ? 1 : 0 }}
                transition={{ duration: 0.08 }}
                style={{ originX: '160px', originY: '250px' }}
              />
            </motion.g>

            {/* Right eye */}
            <motion.g
              id="eye_R_group"
              variants={eyeVariants}
              animate={currentMode}
              style={{ originX: '340px', originY: '250px' }}
            >
              <circle
                id="eye_R_white"
                cx={340}
                cy={250}
                r={65}
                fill="white"
                stroke="#707070"
                strokeWidth="3"
              />
              <motion.g
                variants={pupilVariants}
                animate={currentMode}
              >
                <circle
                  id="eye_R_iris"
                  cx={340}
                  cy={250}
                  r={30}
                  fill="#7B4B2A"
                />
                <circle
                  id="eye_R_pupil"
                  cx={340}
                  cy={250}
                  r={12}
                  fill="black"
                />
                <circle
                  id="eye_R_shine"
                  cx={325}
                  cy={235}
                  r={5}
                  fill="white"
                  opacity="0.8"
                />
              </motion.g>
              {/* Blink overlay */}
              <motion.rect
                x={275}
                y={185}
                width={130}
                height={130}
                fill="#A0A0A0"
                stroke="#707070"
                strokeWidth="2"
                animate={{ scaleY: blinking ? 1 : 0 }}
                transition={{ duration: 0.08 }}
                style={{ originX: '340px', originY: '250px' }}
              />
            </motion.g>

            {/* Eyebrows */}
            <path
              id="eye_L_brow"
              d="M110,180 Q160,165 210,180"
              fill="none"
              stroke="#222"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              id="eye_R_brow"
              d="M290,180 Q340,165 390,180"
              fill="none"
              stroke="#222"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Mouth group */}
            <g id="mouth_group">
              <motion.path
                id="mouth_neutral"
                d="M180,310 Q250,350 320,310"
                fill="none"
                stroke="#222"
                strokeWidth="5"
                strokeLinecap="round"
                animate={{ opacity: mouthState === 'neutral' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.path
                id="mouth_smile"
                d="M170,300 Q250,360 330,300"
                fill="none"
                stroke="#222"
                strokeWidth="6"
                strokeLinecap="round"
                animate={{ opacity: mouthState === 'smile' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.ellipse
                id="mouth_open"
                cx={250}
                cy={320}
                rx={30}
                ry={20}
                fill="#222"
                animate={{ opacity: mouthState === 'open' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.path
                id="mouth_concern"
                d="M180,320 Q250,300 320,320"
                fill="none"
                stroke="#222"
                strokeWidth="5"
                strokeLinecap="round"
                animate={{ opacity: mouthState === 'concern' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </g>
          </g>

          {/* Sparkles (for celebrate state) */}
          {showSparkles && (
            <g id="fx_group">
              {[
                { id: '01', x: 130, y: 130, delay: 0, scale: 1.0 },
                { id: '02', x: 370, y: 110, delay: 80, scale: 0.85 },
                { id: '03', x: 90, y: 230, delay: 160, scale: 1.1 },
                { id: '04', x: 410, y: 220, delay: 240, scale: 0.9 },
                { id: '05', x: 250, y: 80, delay: 320, scale: 1.2 },
              ].map((sparkle) => (
                <motion.g
                  key={sparkle.id}
                  id={`sparkle_${sparkle.id}`}
                  initial={{ scale: 0, opacity: 0, rotate: 0, y: 0 }}
                  animate={{
                    scale: [0, sparkle.scale, sparkle.scale * 0.5, 0],
                    opacity: [0, 1, 0, 0],
                    rotate: [0, 90, 180, 180],
                    y: [0, 0, -32, -32]
                  }}
                  transition={{
                    duration: 0.64,
                    delay: sparkle.delay / 1000,
                    times: [0, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 0.16
                  }}
                >
                  <path
                    d={`M${sparkle.x},${sparkle.y - 8} L${sparkle.x},${sparkle.y + 8} M${sparkle.x - 8},${sparkle.y} L${sparkle.x + 8},${sparkle.y}`}
                    stroke="#FFD46A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.g>
              ))}
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
}
