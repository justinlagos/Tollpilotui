import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, Logo } from '../tp';

export function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/auth'), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32, position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: `radial-gradient(circle, ${t.primary}22 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, ${t.accent}18 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Logo with entrance animation */}
      <div style={{ animation: 'fadeUp 0.6s ease forwards', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <Logo s={52} variant="splash" theme="dark" />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: t.textPri, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Drive smarter. Spend less.
          </p>
          <p style={{ fontSize: 14, color: t.textSec, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
            TollPilot keeps you ahead of charges, not reacting to them.
          </p>
        </div>
      </div>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: t.primary,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}