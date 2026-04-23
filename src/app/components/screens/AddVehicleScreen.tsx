import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Btn, Icon, UKPlate } from '../tp';
import { Pilot } from '../Pilot';
import { PilotFX } from '../PilotFX';

type LookupState = 'input' | 'loading' | 'found' | 'not_found';

export function AddVehicleScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [plate, setPlate] = useState('');
  const [state, setState] = useState<LookupState>('input');

  const isValid = plate.replace(/\s/g, '').length >= 5;

  const handleLookup = () => {
    if (!isValid) return;
    setState('loading');
    setTimeout(() => setState(Math.random() > 0.2 ? 'found' : 'not_found'), 2000);
  };

  return (
    <div style={{ minHeight: '100dvh', background: t.bg }}>
      <AppHeader t={t} onBack={() => navigate('/vehicle')} title="Add vehicle" />

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
        {state === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 60 }}>
            <div style={{ position: 'relative', width: 140, height: 140, display: 'inline-block' }}>
              <PilotFX emotion="thinking" size={140} />
              <Pilot size={140} emotion="thinking" showScene={false} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.textPri, marginBottom: 8 }}>Looking up {plate}…</div>
              <div style={{ fontSize: 14, color: t.textSec }}>Checking DVLA records</div>
            </div>
            <UKPlate value={plate} size="md" />
          </div>
        )}

        {state === 'found' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 32 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n="check" s={30} c={t.success} sw={2.5} />
              </div>
              <UKPlate value={plate} size="lg" validated />
            </div>
            <div style={{ background: t.card, borderRadius: 22, border: `1px solid ${t.border}`, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 14 }}>VEHICLE FOUND</div>
              {[
                { label: 'Make & model', value: 'Toyota Prius' },
                { label: 'Year', value: '2021' },
                { label: 'Fuel type', value: 'Hybrid' },
                { label: 'Emission standard', value: 'Euro 6' },
                { label: 'ULEZ status', value: '✓ Compliant', color: t.success },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 14, color: t.textSec }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: row.color || t.textPri }}>{row.value}</span>
                </div>
              ))}
            </div>
            <Btn t={t} v="success" size="lg" onClick={() => navigate('/vehicle')}>
              <Icon n="plus" s={18} c="#fff" />
              Add this vehicle
            </Btn>
            <Btn t={t} v="tertiary" onClick={() => setState('input')}>Try a different plate</Btn>
          </>
        )}

        {state === 'not_found' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 32 }}>
              <div style={{ width: 72, height: 72, borderRadius: 24, background: `${t.danger}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n="close" s={36} c={t.danger} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: t.textPri, marginBottom: 8 }}>Vehicle not found</div>
                <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6 }}>"{plate}" wasn't found in DVLA records. Check the plate and try again.</div>
              </div>
            </div>
            <Btn t={t} v="primary" onClick={() => setState('input')}>Try again</Btn>
          </>
        )}

        {state === 'input' && (
          <>
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, marginBottom: 8 }}>Add a new vehicle</div>
              <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6 }}>Enter your registration and we'll pull the details from DVLA</div>
            </div>

            <UKPlate value={plate} onChange={setPlate} editable size="lg" validated={isValid} showHint={isValid} />

            {!isValid && plate.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${t.danger}15`, borderRadius: 12, padding: '10px 14px' }}>
                <Icon n="alert" s={16} c={t.danger} />
                <span style={{ fontSize: 13, color: t.danger, fontWeight: 600 }}>Enter a valid UK registration</span>
              </div>
            )}

            <Btn t={t} v="accent" size="lg" onClick={handleLookup} disabled={!isValid}>
              <Icon n="search" s={18} c={isValid ? '#0A0F1C' : '#64748B'} />
              Look up vehicle
            </Btn>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: t.border }} />
              <span style={{ fontSize: 13, color: t.textTer }}>or enter manually</span>
              <div style={{ flex: 1, height: 1, background: t.border }} />
            </div>

            <button onClick={() => navigate('/vehicle')} style={{
              background: t.card, border: `1px solid ${t.border}`, borderRadius: 16,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', width: '100%'
            }}>
              <Icon n="gear" s={20} c={t.textSec} />
              <span style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>Enter vehicle details manually</span>
              <span style={{ marginLeft: 'auto', display: 'flex' }}><Icon n="right" s={16} c={t.textTer} /></span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}