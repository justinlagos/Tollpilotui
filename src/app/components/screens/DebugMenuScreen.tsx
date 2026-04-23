/**
 * DebugMenuScreen — QA traversal surface at /debug.
 *
 * Every v3 state that normally needs data to reach is reachable from
 * here in one tap. Reviewers can see every Today card state, every
 * PCN failure path, every wallet state, and every widget state.
 *
 * The menu itself is not part of the shipping product. It is a
 * reviewer aid.
 */
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, Card, Icon, IconBadge, SectionLabel } from '../tp';

interface Row { label: string; sub?: string; to: string; icon: string; color: string }
interface Section { title: string; rows: Row[] }

export function DebugMenuScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();

  const sections: Section[] = [
    {
      title: 'Today card · confidence states',
      rows: [
        { label: 'High confidence (default)', sub: 'Full prediction, no indicator', to: '/dashboard?state=high',   icon: 'check',  color: t.success },
        { label: 'Medium confidence',         sub: 'Inference label under route',   to: '/dashboard?state=medium', icon: 'info',   color: t.primary },
        { label: 'Low confidence',            sub: 'Prediction suppressed',         to: '/dashboard?state=low',    icon: 'alert',  color: t.warn    },
        { label: 'Empty (no usual route)',    sub: 'Three-trips-to-unlock nudge',   to: '/dashboard?state=empty',  icon: 'route',  color: t.textTer },
        { label: 'All four side-by-side',     sub: '/debug/today',                  to: '/debug/today',            icon: 'eye',    color: t.primary },
      ],
    },
    {
      title: 'PCN · failure paths',
      rows: [
        { label: 'Weak case (score < 45)',    sub: '/pcn/5/weak',       to: '/pcn/5/weak',       icon: 'alert', color: t.danger  },
        { label: 'Rejected by TfL',           sub: '/pcn/4/rejected',   to: '/pcn/4/rejected',   icon: 'close', color: t.danger  },
        { label: 'Withdrawn / timed out',     sub: '/pcn/6/withdrawn',  to: '/pcn/6/withdrawn',  icon: 'clock', color: t.textTer },
        { label: 'Happy path — strong case',  sub: '/pcn/1',            to: '/pcn/1',            icon: 'shield',color: t.success },
      ],
    },
    {
      title: 'PCN · new case flow',
      rows: [
        { label: 'Start a new case',          sub: 'Upload → processing → evidence',  to: '/pcn/new', icon: 'upload', color: t.primary },
      ],
    },
    {
      title: 'Wallet · full flow',
      rows: [
        { label: 'Overview — driving ledger', sub: '/wallet',                 to: '/wallet', icon: 'wallet',     color: t.primary },
      ],
    },
    {
      title: 'Widget',
      rows: [
        { label: 'Widget preview',            sub: '/widget',                 to: '/widget', icon: 'widget',     color: t.primary },
      ],
    },
    {
      title: 'Account · legal · error',
      rows: [
        { label: 'Forgot password',           sub: '/auth/forgot',            to: '/auth/forgot',   icon: 'mail',    color: t.primary },
        { label: 'Contact support',           sub: '/support',                to: '/support',       icon: 'mail',    color: t.primary },
        { label: 'Delete account',            sub: '/account/delete',         to: '/account/delete',icon: 'close',   color: t.danger  },
        { label: 'Privacy policy',            sub: '/legal/privacy',          to: '/legal/privacy', icon: 'lock',    color: t.textSec },
        { label: 'Terms of service',          sub: '/legal/terms',            to: '/legal/terms',   icon: 'receipt', color: t.textSec },
        { label: 'Offline',                   sub: '/offline',                to: '/offline',       icon: 'wifiOff', color: t.warn    },
        { label: 'Generic error',             sub: '/error',                  to: '/error',         icon: 'alert',   color: t.danger  },
        { label: '404 (catch-all)',           sub: 'Visit any invalid path',  to: '/this-page-does-not-exist', icon: 'question', color: t.textSec },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: t.bg, paddingBottom: 40 }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Debug · Reviewer menu" />
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.55 }}>
          Jump to every v3 state without needing to manufacture data. These routes exist in the prototype for QA traversal.
        </div>

        {sections.map(section => (
          <div key={section.title}>
            <SectionLabel t={t}>{section.title}</SectionLabel>
            <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
              {section.rows.map((row, i, arr) => (
                <div
                  key={row.label}
                  onClick={() => navigate(row.to)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <IconBadge icon={row.icon} color={row.color} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.textPri }}>{row.label}</div>
                    {row.sub && (
                      <div style={{ fontSize: 11, color: t.textTer, marginTop: 1, fontFamily: "'JetBrains Mono', monospace" }}>{row.sub}</div>
                    )}
                  </div>
                  <Icon n="right" s={16} c={t.textTer} />
                </div>
              ))}
            </Card>
          </div>
        ))}

        <div style={{
          fontSize: 11, color: t.textTer, textAlign: 'center', lineHeight: 1.5,
          marginTop: 6, paddingTop: 12, borderTop: `1px solid ${t.border}`,
        }}>
          v3 reviewer menu · not shipped in the production navigation
        </div>
      </div>
    </div>
  );
}
