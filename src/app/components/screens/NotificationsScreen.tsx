import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme, AppHeader, EmptyState, Icon } from '../tp';

const NOTIFICATIONS = [
  { id: 1, type: 'zone', icon: 'alert', color: '#EF4444', title: 'ULEZ ahead', body: 'ULEZ ahead. Save £12.50 by rerouting.', time: '2 min ago', read: false },
  { id: 2, type: 'mot', icon: 'clock', color: '#F59E0B', title: 'MOT due in 14 days', body: 'DS18 JRX — book your MOT to stay legal and save money.', time: '1 hr ago', read: false },
  { id: 3, type: 'saving', icon: 'trending', color: '#22C55E', title: 'You saved £18 this week', body: 'Great route choices across your last 3 trips.', time: '3 hr ago', read: true },
  { id: 4, type: 'zone', icon: 'zap', color: '#EF4444', title: 'Charge zone entered', body: 'You entered a charge zone. Pay now to avoid a penalty.', time: 'Yesterday', read: true },
  { id: 5, type: 'zone', icon: 'mapPin', color: '#3BA9FF', title: 'New zone: Bath CAZ', body: 'Bath City Centre has announced a new Clean Air Zone from 1 June.', time: 'Yesterday', read: true },
  { id: 6, type: 'promo', icon: 'crown', color: '#A855F7', title: 'Upgrade to Pro', body: 'Get fleet management, predictive alerts and real-time traffic overlay.', time: '2 days ago', read: true },
  { id: 7, type: 'system', icon: 'info', color: '#64748B', title: 'App updated to v3.2', body: 'New: comparison view, improved map, and faster DVLA lookups.', time: '3 days ago', read: true },
];

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(ns => ns.filter(n => n.id !== id));
  const markRead = (id: number) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const filterTabs = ['All', 'Zones', 'MOT', 'Savings', 'System'];

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Zones') return n.type === 'zone';
    if (filter === 'MOT') return n.type === 'mot';
    if (filter === 'Savings') return n.type === 'saving';
    return n.type === 'system' || n.type === 'promo';
  });

  return (
    <div style={{ minHeight: '100dvh', background: t.bg }}>
      <AppHeader t={t} onBack={() => navigate('/dashboard')} title="Notifications"
        right={
          unreadCount > 0 ? (
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: t.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Mark all read
            </button>
          ) : null
        }
      />

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 40 }}>
        {/* Unread badge */}
        {unreadCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: `${t.primary}18`, border: `1px solid ${t.primary}33`,
            borderRadius: 14, padding: '10px 14px'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.primary }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: t.primary }}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {filterTabs.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flexShrink: 0, height: 32, borderRadius: 20, padding: '0 14px',
              background: filter === f ? t.primary : t.card,
              color: filter === f ? '#fff' : t.textSec,
              border: `1px solid ${filter === f ? t.primary : t.border}`,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
            }}>{f}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="bell"
            title="All clear"
            body="No notifications here. You'll be alerted the moment something needs your attention."
            t={t}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(notif => (
              <div key={notif.id} onClick={() => markRead(notif.id)} style={{
                background: notif.read ? t.card : `${t.primary}0A`,
                borderRadius: 18, border: `1px solid ${notif.read ? t.border : t.primary + '33'}`,
                padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12,
                transition: 'background 0.2s ease'
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: `${notif.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                  <Icon n={notif.icon} s={20} c={notif.color} />
                  {!notif.read && (
                    <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: t.primary, border: `2px solid ${t.bg}` }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: notif.read ? 600 : 700, color: t.textPri }}>{notif.title}</span>
                    <span style={{ fontSize: 11, color: t.textTer, flexShrink: 0 }}>{notif.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>{notif.body}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); dismiss(notif.id); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0
                }}>
                  <Icon n="close" s={14} c={t.textTer} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}