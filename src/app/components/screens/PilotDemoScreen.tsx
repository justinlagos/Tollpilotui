import React, { useState } from 'react';
import { useTheme } from '../tp';
import { Pilot, PilotMode, PilotTrigger } from '../Pilot';

export function PilotDemoScreen() {
  const { t } = useTheme();
  const [mode, setMode] = useState<PilotMode>('calm');
  const [trigger, setTrigger] = useState<PilotTrigger | null>(null);
  const [size, setSize] = useState(200);
  const [showScene, setShowScene] = useState(true);

  const handleTrigger = (triggerName: PilotTrigger) => {
    setTrigger(triggerName);
  };

  const handleTriggerComplete = () => {
    setTrigger(null);
  };

  return (
    <div style={{ 
      backgroundColor: t.bg, 
      minHeight: '100vh', 
      paddingTop: '64px',
      paddingBottom: '32px'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: t.surface,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: t.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: t.textPri 
        }}>
          Pilot Character Demo
        </h1>
      </div>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px' 
      }}>
        {/* Pilot Display */}
        <div style={{
          backgroundColor: t.surface,
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <Pilot 
            mode={mode} 
            size={size}
            trigger={trigger}
            onTriggerComplete={handleTriggerComplete}
            showScene={showScene}
          />
        </div>

        {/* Size Control */}
        <div style={{
          backgroundColor: t.surface,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: t.textPri,
            marginBottom: '12px'
          }}>
            Size: {size}px
          </label>
          <input
            type="range"
            min="48"
            max="280"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '12px',
            color: t.textSec
          }}>
            <span>48px (Tab bar)</span>
            <span>140px (Dashboard)</span>
            <span>280px (Hero)</span>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setShowScene(s => !s)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: `1px solid ${showScene ? t.accent : t.border}`,
                background: showScene ? `${t.accent}22` : 'transparent',
                color: showScene ? t.accent : t.textPri,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Scene overlays: {showScene ? 'ON' : 'OFF'}
            </button>
            <span style={{ fontSize: 12, color: t.textSec }}>
              Turn off for small embeds (tab icon, drive corner)
            </span>
          </div>
        </div>

        {/* State Controls */}
        <div style={{
          backgroundColor: t.surface,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: t.textPri,
            marginBottom: '16px'
          }}>
            Core States (Looping)
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {(['calm', 'alert', 'celebrate', 'speed', 'idle'] as PilotMode[]).map((state) => (
              <button
                key={state}
                onClick={() => setMode(state)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: mode === state ? t.accent : t.border,
                  backgroundColor: mode === state ? `${t.accent}22` : 'transparent',
                  color: mode === state ? t.accent : t.textPri,
                  fontSize: '14px',
                  fontWeight: mode === state ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Controls */}
        <div style={{
          backgroundColor: t.surface,
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: t.textPri,
            marginBottom: '16px'
          }}>
            One-Shot Triggers
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px'
          }}>
            {([
              { name: 'plate_verified', label: 'Plate Verified (2.4s)' },
              { name: 'zone_alert_entry', label: 'Zone Alert Entry (0.7s)' },
              { name: 'reroute_success', label: 'Reroute Success (2s)' },
              { name: 'trip_end_saved', label: 'Trip End Saved (2.5s)' },
              { name: 'pcn_success', label: 'PCN Success (5s)' },
              { name: 'streak_milestone', label: 'Streak Milestone (3s)' }
            ] as Array<{ name: PilotTrigger; label: string }>).map((triggerItem) => (
              <button
                key={triggerItem.name}
                onClick={() => handleTrigger(triggerItem.name)}
                disabled={trigger !== null}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: t.border,
                  backgroundColor: trigger === triggerItem.name ? t.primary : 'transparent',
                  color: trigger === triggerItem.name ? '#fff' : t.textPri,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: trigger !== null ? 'not-allowed' : 'pointer',
                  opacity: trigger !== null && trigger !== triggerItem.name ? 0.5 : 1,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                {triggerItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Implementation Notes */}
        <div style={{
          backgroundColor: t.surface,
          borderRadius: '16px',
          padding: '20px',
          marginTop: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: t.textPri,
            marginBottom: '12px'
          }}>
            Implementation Notes
          </h3>
          <div style={{
            fontSize: '14px',
            color: t.textSec,
            lineHeight: '1.6'
          }}>
            <p style={{ marginBottom: '8px' }}>
              <strong style={{ color: t.textPri }}>States:</strong> Calm (default breathing), Alert (warning focus), Celebrate (bouncing joy), Speed (forward lean), Idle (sleeping)
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong style={{ color: t.textPri }}>Features:</strong> Animated glow, bouncing, squash & stretch, blinking eyes, pupil tracking, mouth expressions
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong style={{ color: t.textPri }}>Usage:</strong> Place on Dashboard (140px), Onboarding (280px), Drive mode (48px), Vehicle cards (72px)
            </p>
            <p>
              <strong style={{ color: t.textPri }}>Based on:</strong> Full rigging plan with 5 core states, 6 one-shot triggers, and micro-behaviors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
