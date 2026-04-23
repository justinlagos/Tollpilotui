import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, Logo, Btn, Icon } from '../tp';

type AuthMode = 'signin' | 'signup' | 'reset';

function InputField({ label, type, value, onChange, icon, t, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  icon?: string; t: ReturnType<typeof useTheme>['t']; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: t.textSec }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon n={icon} s={18} c={t.textTer} />
          </div>
        )}
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', height: 52, borderRadius: 14, background: t.cardHi,
            border: `1px solid ${t.borderLi}`, color: t.textPri, fontSize: 15,
            paddingLeft: icon ? 44 : 16, paddingRight: isPassword ? 48 : 16,
            outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />
        {isPassword && (
          <button onClick={() => setShow(s => !s)} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer'
          }}>
            <Icon n={show ? 'eyeOff' : 'eye'} s={18} c={t.textTer} />
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthScreen() {
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleContinue = () => navigate('/onboarding');

  const SSOBtn = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
    <button style={{
      flex: 1, height: 50, borderRadius: 14, background: t.cardHi, border: `1px solid ${t.borderLi}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      color: t.textPri, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
    }}>
      {icon}
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Top area */}
      <div style={{
        background: `linear-gradient(180deg, ${t.primary}22 0%, transparent 100%)`,
        padding: '60px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
      }}>
        <Logo s={36} theme={theme} />
        <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Smart routes. Zero surprises.</p>
      </div>

      {/* Tab switcher */}
      {mode !== 'reset' && (
        <div style={{ display: 'flex', margin: '0 24px 24px', background: t.cardHi, borderRadius: 14, padding: 4 }}>
          {(['signin', 'signup'] as AuthMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, height: 42, borderRadius: 11, border: 'none', cursor: 'pointer',
              background: mode === m ? t.card : 'transparent',
              color: mode === m ? t.textPri : t.textSec, fontWeight: mode === m ? 700 : 500,
              fontSize: 14, fontFamily: 'inherit',
              boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>
      )}

      {/* Form */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {mode === 'reset' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <button onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon n="left" s={24} c={t.textPri} />
              </button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: t.textPri }}>Reset password</div>
                <div style={{ fontSize: 13, color: t.textSec }}>We'll send a link to your email</div>
              </div>
            </div>

            {resetSent ? (
              <div style={{
                background: `${t.success}18`, border: `1px solid ${t.success}44`, borderRadius: 16,
                padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center'
              }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${t.success}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon n="check" s={28} c={t.success} sw={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.textPri, marginBottom: 4 }}>Email sent!</div>
                  <div style={{ fontSize: 14, color: t.textSec }}>Check your inbox for a reset link at {email || 'your email'}</div>
                </div>
                <button onClick={() => { setMode('signin'); setResetSent(false); }} style={{
                  background: 'none', border: 'none', color: t.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>Back to sign in</button>
              </div>
            ) : (
              <>
                <InputField label="Email address" type="email" value={email} onChange={setEmail} icon="mail" t={t} placeholder="you@example.com" />
                <Btn t={t} v="primary" onClick={() => setResetSent(true)}>Send reset link</Btn>
              </>
            )}
          </>
        ) : (
          <>
            {mode === 'signup' && (
              <InputField label="Full name" value={name} onChange={setName} icon="user" t={t} placeholder="Justin Smith" />
            )}
            <InputField label="Email address" type="email" value={email} onChange={setEmail} icon="mail" t={t} placeholder="you@example.com" />
            <InputField label="Password" type="password" value={password} onChange={setPassword} icon="lock" t={t} placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'} />

            {mode === 'signin' && (
              <button onClick={() => navigate('/auth/forgot')} style={{
                background: 'none', border: 'none', color: t.primary, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit'
              }}>Forgot password?</button>
            )}

            <Btn t={t} v="primary" size="lg" onClick={handleContinue}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Btn>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: t.border }} />
              <span style={{ fontSize: 13, color: t.textTer }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: t.border }} />
            </div>

            {/* SSO */}
            <div style={{ display: 'flex', gap: 12 }}>
              <SSOBtn label="Google" icon={
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" /></svg>
              } />
              <SSOBtn label="Apple" icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
              } />
            </div>

            {/* Guest */}
            <button onClick={handleContinue} style={{
              background: 'none', border: 'none', color: t.textSec, fontSize: 13,
              fontWeight: 500, cursor: 'pointer', textAlign: 'center', paddingBottom: 24
            }}>
              Continue as guest →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
