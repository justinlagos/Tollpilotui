import { useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useTheme, AppHeader, Btn, Icon, Card, UKPlate, SectionLabel } from '../tp';
import { Car3D } from '../Car3D';

export function VehicleDetailsScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Parallax: car floats up slightly as user scrolls down
  const parallaxY = Math.min(scrollY * 0.28, 24);
  const parallaxScale = Math.max(1 - scrollY * 0.0006, 0.88);
  const parallaxOpacity = Math.max(1 - scrollY * 0.003, 0.4);

  const STATUS = [
    { label: 'MOT', value: 'MOT due soon', status: 'warn', detail: 'Expires 4 May 2026', action: '/book-mot', actionLabel: 'Book MOT' },
    { label: 'Road Tax', value: 'MOT valid', status: 'ok', detail: 'Expires 31 Aug 2026' },
    { label: 'ULEZ', value: 'Exempt', status: 'ok', detail: 'Euro 6 — compliant' },
    { label: 'Congestion', value: 'Payable', status: 'neutral', detail: '£18/day if entering' },
  ];

  const statusColor = (s: string) => s === 'ok' ? t.success : s === 'warn' ? t.warn : s === 'danger' ? t.danger : t.textSec;

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Your vehicle"
        right={
          <button onClick={() => navigate('/vehicle/add')} style={{
            width: 40, height: 40, borderRadius: 12, background: t.cardHi,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon n="plus" s={20} c={t.textSec} />
          </button>
        }
      />

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>

        {/* Car hero — parallax scroll */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24 }}>
          <div style={{
            transform: `translateY(${-parallaxY}px) scale(${parallaxScale})`,
            opacity: parallaxOpacity,
            transformOrigin: 'center top',
            transition: 'transform 0.05s linear, opacity 0.05s linear',
          }}>
            <Car3D
              size="lg"
              glowColor="#3BA9FF"
              variant="contained"
              entered
              sweep
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Plate + name */}
        <Card t={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 20 }}>
          <UKPlate value="DS18JRX" size="md" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri }}>Volkswagen Golf GTI</div>
            <div style={{ fontSize: 14, color: t.textSec }}>2018 · 1.4 TSI Petrol · Manual</div>
          </div>
        </Card>

        {/* Status cards */}
        <SectionLabel t={t}>Vehicle status</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STATUS.map(s => (
            <div key={s.label} onClick={s.action ? () => navigate(s.action!) : undefined} style={{
              background: t.card, borderRadius: 18, border: `1px solid ${s.status === 'warn' ? `${t.warn}44` : t.border}`,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              cursor: s.action ? 'pointer' : 'default',
              boxShadow: s.status === 'warn' ? `0 4px 20px ${t.warn}15` : 'none'
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: statusColor(s.status)
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: statusColor(s.status) }}>{s.value}</span>
                </div>
                <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{s.detail}</div>
              </div>
              {s.action && (
                <span style={{
                  fontSize: 12, fontWeight: 700, color: t.warn, background: `${t.warn}18`,
                  borderRadius: 20, padding: '4px 10px'
                }}>{s.actionLabel}</span>
              )}
            </div>
          ))}
        </div>

        {/* Specs */}
        <SectionLabel t={t}>Specifications</SectionLabel>
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {[
            { label: 'Make', value: 'Volkswagen' },
            { label: 'Model', value: 'Golf GTI' },
            { label: 'Year', value: '2018' },
            { label: 'Fuel type', value: 'Petrol' },
            { label: 'Engine size', value: '1.4L TSI' },
            { label: 'Emission standard', value: 'Euro 6' },
            { label: 'Colour', value: 'Indium Grey' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none'
            }}>
              <span style={{ fontSize: 14, color: t.textSec }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{row.value}</span>
            </div>
          ))}
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Btn t={t} v="danger" onClick={() => navigate('/book-mot')}>
            <Icon n="calendar" s={18} c="#fff" />
            Book MOT — from £34.99
          </Btn>
          <Btn t={t} v="secondary" onClick={() => navigate('/vehicle/add')}>
            <Icon n="plus" s={16} c={t.textPri} />
            Add another vehicle
          </Btn>
        </div>
      </div>
    </div>
  );
}