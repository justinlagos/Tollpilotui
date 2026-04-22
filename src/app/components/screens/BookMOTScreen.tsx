import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Btn, Icon, Card, SectionLabel } from '../tp';

const GARAGES = [
  { id: 1, name: 'Kwik Fit — Stratford', dist: '0.4 mi', price: 34.99, rating: 4.8, slots: ['8am', '10am', '2pm', '4pm'] },
  { id: 2, name: 'Halfords — Bethnal Green', dist: '1.2 mi', price: 39.99, rating: 4.6, slots: ['9am', '11am', '3pm'] },
  { id: 3, name: 'Formula One — Hackney', dist: '1.8 mi', price: 29.99, rating: 4.3, slots: ['8am', '1pm', '5pm'] },
];

const DATES = ['Mon 22 Apr', 'Tue 23 Apr', 'Wed 24 Apr', 'Thu 25 Apr', 'Fri 26 Apr'];

export function BookMOTScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [selectedGarage, setSelectedGarage] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const garage = GARAGES.find(g => g.id === selectedGarage);
  const canContinue = selectedGarage !== null && selectedDate !== null && selectedSlot !== null;

  if (step === 'confirm' && garage) {
    return (
      <div style={{ minHeight: '100dvh', background: t.bg }}>
        <AppHeader t={t} onBack={() => setStep('select')} title="Confirm booking" />
        <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="calendar" s={36} c={t.success} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri, marginBottom: 6 }}>Review your booking</div>
              <div style={{ fontSize: 14, color: t.textSec }}>Check the details before confirming</div>
            </div>
          </div>

          <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
            {[
              { label: 'Garage', value: garage.name },
              { label: 'Date', value: selectedDate || '' },
              { label: 'Time', value: selectedSlot || '' },
              { label: 'Vehicle', value: 'VW Golf · DS18 JRX' },
              { label: 'Price', value: `£${garage.price.toFixed(2)}` },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                <span style={{ fontSize: 14, color: t.textSec }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: row.label === 'Price' ? t.success : t.textPri }}>{row.value}</span>
              </div>
            ))}
          </Card>

          <div style={{ background: `${t.primary}18`, border: `1px solid ${t.primary}33`, borderRadius: 16, padding: 14, display: 'flex', gap: 10 }}>
            <Icon n="info" s={16} c={t.primary} />
            <span style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>A confirmation will be sent to your registered email. Free cancellation up to 24 hours before.</span>
          </div>

          <Btn t={t} v="success" size="lg" onClick={() => navigate('/payment')}>
            <Icon n="check" s={18} c="#fff" />
            Confirm booking · £{garage.price.toFixed(2)}
          </Btn>
          <Btn t={t} v="tertiary" onClick={() => setStep('select')}>Go back</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/vehicle')} title="Book your MOT" />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Warning */}
        <div style={{ background: `${t.warn}18`, border: `1px solid ${t.warn}33`, borderRadius: 16, padding: 14, display: 'flex', gap: 10 }}>
          <Icon n="alert" s={18} c={t.warn} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.warn, marginBottom: 2 }}>Your MOT expires soon</div>
            <div style={{ fontSize: 13, color: t.textSec }}>Book early to avoid penalties</div>
          </div>
        </div>

        {/* Date selector */}
        <SectionLabel t={t}>Choose a date</SectionLabel>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {DATES.map(d => (
            <button key={d} onClick={() => setSelectedDate(d)} style={{
              flexShrink: 0, height: 56, minWidth: 80, borderRadius: 14, padding: '0 14px',
              background: selectedDate === d ? t.primary : t.card,
              color: selectedDate === d ? '#fff' : t.textSec,
              border: `1px solid ${selectedDate === d ? t.primary : t.border}`,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{d.split(' ')[0]}</span>
              <span style={{ fontSize: 16, fontWeight: 800 }}>{d.split(' ')[1]}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{d.split(' ')[2]}</span>
            </button>
          ))}
        </div>

        {/* Garages */}
        <SectionLabel t={t}>Choose a garage</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GARAGES.map(g => (
            <div key={g.id} onClick={() => setSelectedGarage(g.id)} style={{
              background: t.card, borderRadius: 20,
              border: selectedGarage === g.id ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
              padding: 16, cursor: 'pointer', position: 'relative',
              boxShadow: selectedGarage === g.id ? `0 4px 20px ${t.primary}22` : 'none',
              transition: 'all 0.15s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri, marginBottom: 2 }}>{g.name}</div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 12, color: t.textSec }}>
                    <span>{g.dist}</span>
                    <span>⭐ {g.rating}</span>
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: t.textPri, paddingRight: selectedGarage === g.id ? 28 : 0 }}>£{g.price.toFixed(2)}</div>
              </div>

              {selectedGarage === g.id && selectedDate && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  {g.slots.map(slot => (
                    <button key={slot} onClick={e => { e.stopPropagation(); setSelectedSlot(slot); }} style={{
                      height: 34, borderRadius: 10, padding: '0 12px',
                      background: selectedSlot === slot ? t.primary : t.cardHi,
                      color: selectedSlot === slot ? '#fff' : t.textSec,
                      border: `1px solid ${selectedSlot === slot ? t.primary : t.border}`,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                    }}>{slot}</button>
                  ))}
                </div>
              )}

              {selectedGarage === g.id && (
                <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: '50%', background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon n="check" s={11} c="#fff" sw={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        <Btn t={t} v="primary" size="lg" disabled={!canContinue} onClick={() => setStep('confirm')}>
          <Icon n="right" s={18} c={canContinue ? '#fff' : '#64748B'} />
          Continue to confirm
        </Btn>
      </div>
    </div>
  );
}