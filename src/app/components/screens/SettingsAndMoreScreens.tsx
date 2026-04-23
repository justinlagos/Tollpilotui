import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Icon, Card, Toggle, RowItem, SectionLabel, BottomNav, Btn } from '../tp';

// ═══════════════════════════════════════════════════════════════
// SETTINGS SCREEN
// ═══════════════════════════════════════════════════════════════
export function SettingsScreen() {
  const navigate = useNavigate();
  const { t, theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 88 }}>
      <div style={{ padding: '56px 20px 0' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: t.textPri, letterSpacing: '-0.03em', marginBottom: 4 }}>More</div>
        <div style={{ fontSize: 14, color: t.textSec }}>Account, app settings & support</div>
      </div>

      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
        {/* Profile summary */}
        <div onClick={() => navigate('/profile')} style={{
          background: t.card, borderRadius: 22, border: `1px solid ${t.border}`,
          padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 18, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: t.primary }}>JS</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.textPri }}>Justin Smith</div>
            <div style={{ fontSize: 13, color: t.textSec }}>justin.smith@email.com</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${t.accent}22`, borderRadius: 20, padding: '5px 10px' }}>
            <Icon n="crown" s={14} c={t.accent} />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>Pro</span>
          </div>
        </div>

        {/* Account */}
        <div>
          <SectionLabel t={t}>Account</SectionLabel>
          <Card t={t} pad={0}>
            <RowItem icon="user" iconColor={t.primary} label="Profile" t={t} onPress={() => navigate('/profile')} />
            <RowItem icon="car" iconColor={t.primary} label="My vehicles" value="1 vehicle" t={t} onPress={() => navigate('/vehicle')} />
            <RowItem icon="team" iconColor={t.accent} label="Fleet manager" value="4 drivers" t={t} onPress={() => navigate('/fleet')} />
            <RowItem icon="crown" iconColor={t.accent} label="TollPilot Pro" value="Active" t={t} onPress={() => navigate('/pro')} />
          </Card>
        </div>

        {/* Appearance */}
        <div>
          <SectionLabel t={t}>Appearance</SectionLabel>
          <Card t={t} pad={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: `1px solid ${t.border}` }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${t.textTer}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                <Icon n={theme === 'dark' ? 'moon' : 'sun'} s={18} c={t.textSec} />
              </div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: t.textPri }}>Dark mode</span>
              <Toggle on={theme === 'dark'} onChange={toggleTheme} t={t} label="Toggle dark mode" />
            </div>
          </Card>
        </div>

        {/* Alerts & notifications */}
        <div>
          <SectionLabel t={t}>Alerts</SectionLabel>
          <Card t={t} pad={0}>
            <RowItem icon="bell" iconColor={t.warn} label="Alert settings" t={t} onPress={() => navigate('/alerts')} />
            <RowItem icon="bell" iconColor={t.primary} label="Notifications" t={t} onPress={() => navigate('/notifications')} />
          </Card>
        </div>

        {/* Support */}
        <div>
          <SectionLabel t={t}>Support</SectionLabel>
          <Card t={t} pad={0}>
            <RowItem icon="question" iconColor={t.primary} label="Help Centre" t={t} onPress={() => navigate('/help')} />
            <RowItem icon="mail" iconColor={t.primary} label="Contact support" t={t} onPress={() => navigate('/support')} />
            <RowItem icon="gift" iconColor={t.success} label="Refer a friend" t={t} onPress={() => navigate('/referral')} />
            <RowItem icon="info" iconColor={t.textSec} label="About TollPilot" t={t} onPress={() => navigate('/about')} />
          </Card>
        </div>

        {/* Legal */}
        <div>
          <SectionLabel t={t}>Legal</SectionLabel>
          <Card t={t} pad={0}>
            <RowItem icon="lock" iconColor={t.textSec} label="Privacy policy" t={t} onPress={() => navigate('/legal/privacy')} />
            <RowItem icon="receipt" iconColor={t.textSec} label="Terms of service" t={t} onPress={() => navigate('/legal/terms')} />
          </Card>
        </div>

        {/* Danger zone */}
        <div>
          <SectionLabel t={t}>Account</SectionLabel>
          <Card t={t} pad={0}>
            <RowItem icon="logout" label="Sign out" t={t} danger onPress={() => navigate('/auth')} />
            <RowItem icon="close" label="Delete account" t={t} danger onPress={() => navigate('/account/delete')} />
          </Card>
        </div>
      </div>

      <BottomNav active="more" t={t} onNav={tab => {
        const routes: Record<string, string> = { home: '/dashboard', drive: '/drive', zones: '/zones', trips: '/trips', more: '/settings' };
        navigate(routes[tab] || '/dashboard');
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ════════════════════════════��══════════════════════════════════
export function ProfileScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [name, setName] = useState('Justin Smith');
  const [email, setEmail] = useState('justin.smith@email.com');
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="Profile"
        right={
          <button onClick={() => setEditing(e => !e)} style={{ background: 'none', border: 'none', color: t.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {editing ? 'Save' : 'Edit'}
          </button>
        }
      />
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 88, height: 88, borderRadius: 30, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: t.primary, position: 'relative' }}>
            JS
            <button style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: t.primary, border: `2px solid ${t.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon n="plus" s={14} c="#fff" />
            </button>
          </div>
          <div style={{ background: `${t.accent}22`, borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon n="crown" s={14} c={t.accent} />
            <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>TollPilot Pro</span>
          </div>
        </div>

        {/* Fields */}
        <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
          {[{ label: 'Full name', value: name, set: setName }, { label: 'Email', value: email, set: setEmail }].map((f, i) => (
            <div key={f.label} style={{ padding: '14px 16px', borderBottom: i < 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', marginBottom: 6 }}>{f.label.toUpperCase()}</div>
              {editing ? (
                <input value={f.value} onChange={e => f.set(e.target.value)} style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: t.primary, fontFamily: 'inherit', borderBottom: `1px solid ${t.primary}` }} />
              ) : (
                <div style={{ fontSize: 15, fontWeight: 600, color: t.textPri }}>{f.value}</div>
              )}
            </div>
          ))}
        </Card>

        {/* Subscription */}
        <Card t={t} glow={t.accent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon n="crown" s={22} c={t.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPri }}>TollPilot Pro</div>
              <div style={{ fontSize: 13, color: t.textSec }}>Renews 20 May 2026 · £4.99/mo</div>
            </div>
            <button onClick={() => navigate('/pro')} style={{ background: `${t.accent}22`, border: 'none', borderRadius: 12, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: t.accent, cursor: 'pointer' }}>Manage</button>
          </div>
        </Card>

        <Btn t={t} v="danger" size="md" onClick={() => navigate('/auth')}>
          <Icon n="logout" s={16} c="#fff" />
          Sign out
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ALERT SETTINGS SCREEN
// ═══════════════════════════════════════════════════════════════
export function AlertSettingsScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [settings, setSettings] = useState({
    ulezApproach: true, congestion: true, toll: true, mot: true, summary: false,
    pushNotif: true, emailSummary: false, distThreshold: '800m', dailyCommute: true,
  });

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="Alert settings" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SectionLabel t={t}>Zone alerts</SectionLabel>
        <Card t={t} pad={0}>
          {[
            { key: 'ulezApproach', label: 'ULEZ alerts', sub: 'Warn before entering ULEZ', icon: 'mapPin', color: '#EF4444' },
            { key: 'congestion', label: 'Congestion Charge', sub: 'Warn before entering CC zone', icon: 'mapPin', color: '#F59E0B' },
            { key: 'toll', label: 'Toll road alerts', sub: 'Warn before toll roads', icon: 'route', color: '#3BA9FF' },
          ].map((item, i, arr) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n={item.icon} s={18} c={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{item.label}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{item.sub}</div>
              </div>
              <Toggle on={settings[item.key as keyof typeof settings] as boolean} onChange={() => toggle(item.key as keyof typeof settings)} t={t} label={item.label} />
            </div>
          ))}
        </Card>

        {/* Alert distance */}
        <SectionLabel t={t}>Alert distance</SectionLabel>
        <Card t={t}>
          <div style={{ fontSize: 14, color: t.textSec, marginBottom: 12 }}>Alert me when I am within:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['400m', '800m', '1.2 km', '2 km'].map(d => (
              <button key={d} onClick={() => setSettings(s => ({ ...s, distThreshold: d }))} style={{
                flex: 1, height: 36, borderRadius: 10,
                background: settings.distThreshold === d ? t.primary : t.cardHi,
                color: settings.distThreshold === d ? '#fff' : t.textSec,
                border: `1px solid ${settings.distThreshold === d ? t.primary : t.border}`,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}>{d}</button>
            ))}
          </div>
        </Card>

        <SectionLabel t={t}>Notifications</SectionLabel>
        <Card t={t} pad={0}>
          {[
            { key: 'dailyCommute', label: 'Daily Commute', sub: 'Morning charge forecast at departure', icon: 'zap', color: t.accent },
            { key: 'mot', label: 'MOT reminders', sub: '30, 14, 7 days before expiry', icon: 'clock', color: t.warn },
            { key: 'summary', label: 'Weekly summary', sub: 'How much you saved this week', icon: 'trending', color: t.success },
            { key: 'pushNotif', label: 'Push notifications', sub: 'Real-time zone alerts', icon: 'bell', color: t.primary },
            { key: 'emailSummary', label: 'Email digest', sub: 'Monthly savings report', icon: 'mail', color: t.textSec },
          ].map((item, i, arr) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon n={item.icon} s={18} c={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.textPri }}>{item.label}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{item.sub}</div>
              </div>
              <Toggle on={settings[item.key as keyof typeof settings] as boolean} onChange={() => toggle(item.key as keyof typeof settings)} t={t} label={item.label} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELP CENTRE
// ═══════════════════════════════════════════════════════════════
export function HelpCentreScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const FAQS = [
    { q: 'How does TollPilot detect charge zones?', a: 'TollPilot uses your GPS location combined with our up-to-date database of charge zones to alert you in real time as you approach a zone boundary.' },
    { q: 'Does TollPilot automatically pay charges?', a: 'Not yet — TollPilot alerts you and helps you avoid charges. Payment is your responsibility. We\'re working on auto-pay integration.' },
    { q: 'Is my location data stored?', a: 'Route data is processed on-device. We do not store your real-time location on our servers. Trip history is stored locally unless you opt in to cloud sync.' },
    { q: 'How accurate is DVLA data?', a: 'We refresh DVLA data daily. Newly registered vehicles may take up to 72 hours to appear. Contact support if your vehicle is missing.' },
    { q: 'Can I add multiple vehicles?', a: 'Yes! You can add as many vehicles as you like. Pro users can also manage a fleet and see per-driver reporting.' },
    { q: 'What is TollPilot Pro?', a: 'Pro includes fleet management for up to 20 drivers, predictive zone alerts, real-time traffic overlay, and priority customer support.' },
  ];

  const filtered = FAQS.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="Help Centre" />
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon n="search" s={18} c={t.textTer} />
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles…" style={{ width: '100%', height: 46, borderRadius: 14, background: t.card, border: `1px solid ${t.border}`, color: t.textPri, fontSize: 14, paddingLeft: 44, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ icon: 'mapPin', label: 'Zones', color: '#EF4444' }, { icon: 'car', label: 'Vehicles', color: '#3BA9FF' }, { icon: 'creditCard', label: 'Billing', color: '#22C55E' }, { icon: 'gear', label: 'Account', color: '#F59E0B' }].map(c => (
            <div key={c.label} style={{ flex: 1, background: t.card, borderRadius: 14, border: `1px solid ${t.border}`, padding: '12px 8px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <Icon n={c.icon} s={16} c={c.color} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textSec }}>{c.label}</div>
            </div>
          ))}
        </div>

        <SectionLabel t={t}>Frequently asked</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((faq, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: t.card, borderRadius: 16, border: `1px solid ${openFaq === i ? t.primary + '44' : t.border}`, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: t.textPri }}>{faq.q}</span>
                <Icon n={openFaq === i ? 'chevDown' : 'right'} s={18} c={t.textTer} />
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 16px 14px', fontSize: 13, color: t.textSec, lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <Card t={t} style={{ background: `${t.primary}10` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon n="mail" s={22} c={t.primary} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.textPri }}>Still stuck?</div>
              <div style={{ fontSize: 13, color: t.textSec }}>Our team replies within 24 hours</div>
            </div>
            <Btn t={t} v="primary" size="sm" full={false} onClick={() => navigate('/support')}>Contact</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ABOUT SCREEN
// ═══════════════════════════════════════════════════════════════
export function AboutScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/settings')} title="About TollPilot" />
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: 24, background: `${t.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="shield" s={36} c={t.primary} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.textPri }}>TollPilot</div>
            <div style={{ fontSize: 14, color: t.textSec }}>Version 3.2.1 · Build 2026.04.20</div>
          </div>
        </div>
        <Card t={t} pad={0}>
          {[
            { label: 'Privacy Policy', icon: 'lock' },
            { label: 'Terms of Service', icon: 'receipt' },
            { label: 'Open Source Licences', icon: 'info' },
            { label: 'Data & Privacy', icon: 'shield' },
          ].map((item) => (
            <RowItem key={item.label} icon={item.icon} label={item.label} t={t} onPress={() => {}} />
          ))}
        </Card>
        <div style={{ textAlign: 'center', fontSize: 12, color: t.textTer, lineHeight: 1.8 }}>
          Made with ♥ in London<br />© 2026 TollPilot Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
}