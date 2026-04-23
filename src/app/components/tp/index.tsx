import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import logoDark from '../../../imports/tollpilot-logo-design-05_copy.svg';
import logoLight from '../../../imports/tollpilot-logo-design-06.svg';
import logoSplash from '../../../imports/tollpilot-logo-design-00000.svg';

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════
export type Theme = 'dark' | 'light';
export type Tokens = {
  bg: string; surface: string; card: string; cardHi: string;
  primary: string; accent: string; success: string; danger: string; warn: string;
  textPri: string; textSec: string; textTer: string;
  border: string; borderLi: string;
  mapBg: string; mapGrid: string; mapRoad: string;
};

export const TOKENS: Record<Theme, Tokens> = {
  dark: {
    bg: '#0A0F1C', surface: '#111827', card: '#151C2E', cardHi: '#1F2937',
    primary: '#3BA9FF', accent: '#FDC500', success: '#22C55E', danger: '#EF4444', warn: '#F59E0B',
    textPri: '#F8FAFC', textSec: '#94A3B8', textTer: '#64748B',
    border: 'rgba(255,255,255,0.06)', borderLi: 'rgba(255,255,255,0.10)',
    mapBg: '#0D1220', mapGrid: 'rgba(148,163,184,0.08)', mapRoad: 'rgba(148,163,184,0.18)',
  },
  light: {
    bg: '#F7F8FA', surface: '#FFFFFF', card: '#FFFFFF', cardHi: '#F1F5F9',
    primary: '#1C6ED5', accent: '#F59E0B', success: '#16A34A', danger: '#DC2626', warn: '#D97706',
    textPri: '#0F172A', textSec: '#475569', textTer: '#94A3B8',
    border: 'rgba(15,23,42,0.08)', borderLi: 'rgba(15,23,42,0.12)',
    mapBg: '#E2E8F0', mapGrid: 'rgba(71,85,105,0.12)', mapRoad: 'rgba(71,85,105,0.25)',
  },
};

// ═══════════════════════════════════════════════════════════════
// THEME CONTEXT
// ═══════════════════════════════════════════════════════════════
type ThemeCtx = { theme: Theme; t: Tokens; toggleTheme: () => void };
const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', t: TOKENS.dark, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const t = TOKENS[theme];
  const toggleTheme = () => setTheme(th => th === 'dark' ? 'light' : 'dark');
  return <ThemeContext.Provider value={{ theme, t, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);

// ═══════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════
export const IC: Record<string, string> = {
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  nav: 'M3 11l19-9-9 19-2-8-8-2z',
  route: 'M6 19a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM18 5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H18',
  history: 'M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2',
  trending: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  close: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  right: 'M9 18l6-6-6-6',
  left: 'M15 18l-6-6 6-6',
  plus: 'M12 5v14M5 12h14',
  alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17v.01',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  crown: 'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  locate: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v2M12 20v2M2 12h2M20 12h2',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  car: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v7a2 2 0 0 1-2 2h-3M3 17h14M8 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M16 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  wifi: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
  wifiOff: 'M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  copy: 'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M12 12v4',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  gift: 'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  chevDown: 'M6 9l6 6 6-6',
  team: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
  question: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  creditCard: 'M1 4h22v16H1zM1 10h22',
  receipt: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h4',
  map: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  wallet: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4z',
  widget: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  pound: 'M18 7a4 4 0 0 0-8 0v14M6 12h9M6 21h12',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
};

export const Icon = ({ n, s = 20, c = 'currentColor', sw = 2 }: { n: string; s?: number; c?: string; sw?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: 'block', overflow: 'visible' }}>
    {(IC[n] || '').split('M').filter(Boolean).map((p, i) => <path key={i} d={'M' + p} />)}
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════
export const Logo = ({ s = 32, theme, variant = 'auto' }: { s?: number; theme?: string; variant?: string }) => {
  const isSplash = variant === 'splash';
  // Colour for the "Toll" letters, based on active theme.
  const forceWhite = variant === 'white' || variant === 'dark' || isSplash;
  const forceDark = variant === 'light';
  const tollFill = forceWhite
    ? '#FFFFFF'
    : forceDark
      ? '#0F172A'
      : (theme === 'dark' ? '#FFFFFF' : '#0F172A');
  const pilotFill = '#F5BD31';

  // Height-preserving width (source viewBox is 1880.72x376.67 → ratio ~5:1)
  const h = s;
  const w = (s * 1880.72) / 376.67;

  return (
    <div style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }} role="img" aria-label="TollPilot">
      <svg width={w} height={h} viewBox="0 0 1880.72 376.67" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* Pilot — P */}
        <path d="M1082.53,19.01c-26.93-5.64-55.61-3.98-83.56-3.97l-103.5.03c-15.7,68.93-31.85,137.74-48.46,206.45-9.98,42.32-20.45,91.82-31.69,133.45,30.07.05,60.63.37,90.66-.01,8.33-33.63,16.45-67.29,24.36-101.02l45-.07c39.18.2,66.03.85,102.77-17.05,82.28-40.08,118.56-193.91,4.42-217.8ZM1059.46,138.93c-4.89,15.99-11.27,24.6-26.03,33.23-20.28,9.21-63.31,6.29-86.7,6.19,7.14-29.85,13.72-60.92,21.47-90.51,20.87-.18,45.44-1.61,65.88,1.39,25.51,3.73,32.13,27.65,25.38,49.7Z" fill={pilotFill}/>
        {/* Toll — o */}
        <path d="M421.94,100.81c-47.5,5.07-87.21,23.68-118.37,61.38-40.6,49.12-56.47,130.62-1.02,175.69,29.24,23.78,66.24,27.42,102.81,25.71,46.49-5.3,91.53-24.76,119.13-63.04,72.8-100.97,26.23-209.44-102.54-199.75ZM414.53,289.78c-83.02,16.57-80.88-94.23-3.21-115.42,86.03-7.69,73.48,96.77,3.21,115.42Z" fill={tollFill}/>
        {/* Pilot — o */}
        <path d="M1524.71,100.78c-47.76,5.56-86.56,23.73-117.68,61.79-40.1,49.06-57.37,132.48-.58,176.61,28.76,22.35,66.02,26.37,101.46,24.44,46.97-6.18,92.77-26.48,120.09-65.85,69.04-99.52,23.67-208.29-103.29-196.99ZM1514.37,289.99c-55.79,6.72-71.95-37.34-47.02-80.7,11.3-19.66,28.44-29.56,50.16-34.92,80.87-6.54,69.3,98.09-3.14,115.62Z" fill={pilotFill}/>
        {/* Toll — T */}
        <path d="M54.22,15.27l323.77-.04c-6.51,24.66-12.46,50.78-18.53,75.65h-114.86s-38.34,167.25-38.34,167.25l-22.89,96.76-89.73-.02c20.15-87.89,39.83-175.89,59.04-263.99l-114.54-.08c5.55-24.26,11.7-51.15,16.07-75.52Z" fill={tollFill}/>
        {/* Pilot — t */}
        <path d="M1722.95,41.42l88.13.02-16.92,70.3,68.29.04c-5.81,22.89-11.08,47.81-16.42,70.97h-68.82c-5.88,24.31-15.34,57.45-18.39,81.75-4.39,35.06,51.39,16.2,68.02,16.19.68,2.9-.75,7.49-1.46,10.64-4.07,18.76-8.28,37.49-12.62,56.2-27.77,12.5-64.87,14.58-93.8,8.59-59.88-12.42-57.86-61.5-45.07-109.35,4.39-16.4,8.71-36.04,12.7-52.59l36.35-152.76Z" fill={pilotFill}/>
        {/* Toll — l */}
        <path d="M630.54,15.24l87.63-.07c-25.7,113.38-52.06,226.62-79.08,339.7-28.93-.17-57.85-.12-86.78.14,13.95-56.84,26.81-114.79,39.98-171.86,13.1-55.88,25.85-111.86,38.25-167.91Z" fill={tollFill}/>
        {/* Pilot — l */}
        <path d="M1318.09,15l87.53-.03-82.39,339.92-86.85.07c3.55-11.79,6.92-27.96,9.84-40.18l17.18-71.41,54.69-228.37Z" fill={pilotFill}/>
        {/* Toll — l */}
        <path d="M756.84,15.18c28.94.32,58.37.02,87.35-.02-12.28,56.39-27.97,117.01-40.39,173.3-3.72,16.85-37.11,162.47-40.77,166.33l-85.52.04c10.81-38.64,21.37-90.08,30.63-130.13,16.7-69.73,32.93-139.57,48.69-209.52Z" fill={tollFill}/>
        {/* Pilot — i body */}
        <path d="M1173.86,115.57h87.08s-58.17,239.39-58.17,239.39l-87.08-.06c20.46-76.57,39.89-161.7,58.17-239.33Z" fill={pilotFill}/>
        {/* Pilot — i dot */}
        <path d="M1234.78,10.15c68.98-1.81,63.71,79.1-4.22,90.33-76.25,3.47-64.83-82.78,4.22-90.33Z" fill={pilotFill}/>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// UK PLATE
// ═══════════════════════════════════════════════════════════════
export const UKPlate = ({ value = '', onChange, editable = false, size = 'lg', validated = false, showHint = true }: {
  value?: string; onChange?: (v: string) => void; editable?: boolean;
  size?: 'sm' | 'md' | 'lg'; validated?: boolean; showHint?: boolean;
}) => {
  const sz = { sm: { h: 40, fs: 18, gb: 30, rad: 8 }, md: { h: 56, fs: 24, gb: 40, rad: 10 }, lg: { h: 72, fs: 32, gb: 52, rad: 12 } }[size];
  const v = value.toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 8);
  const [snap, setSnap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (validated) { setSnap(true); const x = setTimeout(() => setSnap(false), 400); return () => clearTimeout(x); }
  }, [validated]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
      <div onClick={() => editable && inputRef.current?.focus()} style={{
        position: 'relative', width: size === 'lg' ? 300 : size === 'md' ? 220 : 140,
        height: sz.h, background: '#FDC500', borderRadius: sz.rad, borderWidth: 2.5, borderStyle: 'solid', borderColor: '#0A0F1C',
        boxShadow: validated ? '0 12px 32px rgba(253,197,0,0.45), inset 0 2px 0 rgba(255,255,255,0.5)' : '0 6px 20px rgba(253,197,0,0.3), inset 0 2px 0 rgba(255,255,255,0.45)',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
        transform: snap ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', cursor: editable ? 'text' : 'default'
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: sz.gb, background: '#0A3FC4',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          padding: size === 'lg' ? '8px 0' : '5px 0'
        }}>
          <div style={{ width: size === 'lg' ? 14 : 10, height: size === 'lg' ? 14 : 10, borderRadius: '50%', border: `${size === 'lg' ? 1.5 : 1}px solid #FDC500`, position: 'relative' }}>
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <div key={deg} style={{ position: 'absolute', top: '50%', left: '50%', width: 2, height: 2, borderRadius: '50%', background: '#FDC500', transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-${size === 'lg' ? 5 : 3.5}px)` }} />
            ))}
          </div>
          <span style={{ color: '#FFFFFF', fontSize: size === 'lg' ? 13 : size === 'md' ? 11 : 9, fontWeight: 800, letterSpacing: '0.08em', fontFamily: 'system-ui, sans-serif' }}>GB</span>
        </div>
        {editable ? (
          <input ref={inputRef} type="text" value={v}
            onChange={e => onChange?.(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 8))}
            placeholder="AB12 CDE" aria-label="Enter vehicle registration plate"
            autoCapitalize="characters" autoCorrect="off" spellCheck={false}
            style={{ position: 'absolute', left: sz.gb, right: 0, top: 0, bottom: 0, width: `calc(100% - ${sz.gb}px)`, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: sz.fs, fontWeight: 900, color: '#0A0F1C', letterSpacing: '0.12em', textAlign: 'center', textTransform: 'uppercase' }} />
        ) : (
          <div style={{ position: 'absolute', left: sz.gb, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: sz.fs, fontWeight: 900, color: '#0A0F1C', letterSpacing: '0.12em' }}>
            {v || 'AB12 CDE'}
          </div>
        )}
      </div>
      {showHint && validated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#22C55E' }} role="status">
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon n="check" s={12} c="#FFFFFF" sw={3} />
          </div>
          Looks good — this is your registered vehicle
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CARLOOP — animated SVG car
// ═══════════════════════════════════════════════════════════════
export const CarLoop = ({ color = '#2563EB' }: { color?: string }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);
  const wheelRot = (tick * 4) % 360;
  const floatY = Math.sin(tick * 0.05) * 5;
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ transform: `translateY(${floatY}px)`, transition: 'transform 0.1s ease' }}>
        <svg width="260" height="120" viewBox="0 0 280 130" role="img" aria-label="TollPilot vehicle">
          <defs>
            <linearGradient id="clBodyTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="clBodySide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="clGlass" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="clWheel" cx="0.35" cy="0.35">
              <stop offset="0%" stopColor="#6B7280" />
              <stop offset="100%" stopColor="#111827" />
            </radialGradient>
            <radialGradient id="clRim" cx="0.5" cy="0.5">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#4B5563" />
            </radialGradient>
            <radialGradient id="clShadow" cx="0.5" cy="0.5">
              <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="clRoofShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="140" cy="116" rx="105" ry="6" fill="url(#clShadow)" />
          <path d="M 30 92 L 30 72 Q 30 66 36 66 L 50 66 Q 56 52 68 44 Q 80 38 100 36 L 180 36 Q 200 38 212 44 Q 224 52 230 66 L 244 66 Q 250 66 250 72 L 250 92 Q 250 98 244 98 L 36 98 Q 30 98 30 92 Z" fill="url(#clBodySide)" />
          <path d="M 62 66 Q 68 50 80 44 Q 92 38 108 38 L 170 38 Q 188 38 200 44 Q 214 50 218 66 Z" fill="url(#clBodyTop)" />
          <path d="M 72 48 Q 88 42 110 42 L 168 42 Q 190 42 208 48" stroke="url(#clRoofShine)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 72 66 Q 78 52 90 48 L 130 48 L 130 66 Z" fill="url(#clGlass)" />
          <path d="M 150 48 L 188 48 Q 200 52 208 66 L 150 66 Z" fill="url(#clGlass)" />
          <rect x="135" y="48" width="12" height="18" fill="#1E3A8A" />
          <line x1="140" y1="68" x2="140" y2="92" stroke="#0F172A" strokeWidth="0.8" opacity="0.4" />
          <rect x="100" y="78" width="18" height="3" rx="1.5" fill="#0F172A" opacity="0.6" />
          <rect x="160" y="78" width="18" height="3" rx="1.5" fill="#0F172A" opacity="0.6" />
          {/* Headlight — pulsing */}
          <ellipse cx="228" cy="74" rx="8" ry="6" fill="#FEF3C7" opacity={0.7 + Math.sin(tick * 0.08) * 0.3} />
          <ellipse cx="228" cy="74" rx="4" ry="3" fill="#FFFFFF" opacity={0.8 + Math.sin(tick * 0.08) * 0.2} />
          <rect x="34" y="70" width="8" height="12" rx="2" fill="#DC2626" />
          <rect x="34" y="72" width="8" height="3" rx="1" fill="#FEE2E2" opacity="0.6" />
          <rect x="216" y="80" width="18" height="6" rx="1" fill="#0F172A" opacity="0.8" />
          {/* Front wheel */}
          <g transform={`rotate(${wheelRot}, 212, 100)`}>
            <circle cx="212" cy="100" r="16" fill="#111827" />
            <circle cx="212" cy="100" r="14" fill="url(#clWheel)" />
            <circle cx="212" cy="100" r="10" fill="url(#clRim)" />
            <circle cx="212" cy="100" r="3" fill="#1F2937" />
            {[0, 72, 144, 216, 288].map(d => (
              <line key={d} x1="212" y1="100" x2={212 + Math.cos(d * Math.PI / 180) * 9} y2={100 + Math.sin(d * Math.PI / 180) * 9} stroke="#6B7280" strokeWidth="1.5" />
            ))}
          </g>
          {/* Rear wheel */}
          <g transform={`rotate(${wheelRot}, 68, 100)`}>
            <circle cx="68" cy="100" r="16" fill="#111827" />
            <circle cx="68" cy="100" r="14" fill="url(#clWheel)" />
            <circle cx="68" cy="100" r="10" fill="url(#clRim)" />
            <circle cx="68" cy="100" r="3" fill="#1F2937" />
            {[0, 72, 144, 216, 288].map(d => (
              <line key={d} x1="68" y1="100" x2={68 + Math.cos(d * Math.PI / 180) * 9} y2={100 + Math.sin(d * Math.PI / 180) * 9} stroke="#6B7280" strokeWidth="1.5" />
            ))}
          </g>
          <path d="M 80 52 L 120 50 L 118 54 L 82 56 Z" fill="#FFFFFF" opacity="0.35" />
        </svg>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MINI MAP
// ═══════════════════════════════════════════════════════════════
export const MiniMap = ({ t, theme, size = 'md', showULEZ = true, variant = 'route' }: {
  t: Tokens; theme: string; size?: 'sm' | 'md' | 'lg'; showULEZ?: boolean; variant?: 'route' | 'zone' | 'full';
}) => {
  const h = size === 'lg' ? 280 : size === 'md' ? 200 : 150;
  return (
    <div role="img" aria-label="Route map" style={{
      width: '100%', height: h, borderRadius: 20, overflow: 'hidden', background: t.mapBg,
      position: 'relative', border: `1px solid ${t.border}`,
      boxShadow: theme === 'dark' ? '0 0 0 1px rgba(59,169,255,0.08), 0 20px 40px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="mmGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={t.mapGrid} strokeWidth="0.5" />
          </pattern>
          <linearGradient id="mmRoute" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#3BA9FF" /><stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="mmAlt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" /><stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
          </linearGradient>
          <filter id="mmGlow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="mmDanger"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" /><stop offset="100%" stopColor="#EF4444" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="400" height="280" fill={t.mapBg} />
        <rect width="400" height="280" fill="url(#mmGrid)" />
        <g stroke={t.mapRoad} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6">
          <path d="M 0 80 Q 100 75 200 90 T 400 100" />
          <path d="M 0 200 Q 120 195 250 205 T 400 210" />
          <path d="M 80 0 Q 85 100 120 190 T 140 280" />
          <path d="M 280 0 Q 275 100 290 200 T 310 280" />
        </g>
        <g stroke={t.mapRoad} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35">
          <path d="M 0 40 L 400 50" /><path d="M 0 140 Q 200 145 400 150" /><path d="M 0 240 L 400 245" />
          <path d="M 40 0 L 50 280" /><path d="M 190 0 L 200 280" /><path d="M 360 0 L 370 280" />
        </g>
        {showULEZ && (
          <>
            <circle cx="300" cy="80" r="55" fill="url(#mmDanger)" />
            <circle cx="300" cy="80" r="14" fill="#EF4444" opacity="0.7">
              <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="300" cy="80" r="8" fill="#EF4444" />
          </>
        )}
        <path d="M 60 230 Q 80 190 130 180 Q 180 170 220 210 Q 260 240 340 210" stroke="url(#mmAlt)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="6 4" />
        <path d="M 60 230 Q 90 180 140 150 Q 180 130 220 110 Q 260 90 300 80" stroke="url(#mmRoute)" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#mmGlow)" />
        <circle cx="60" cy="230" r="10" fill="#FFFFFF" stroke="#3BA9FF" strokeWidth="3" />
        <circle cx="60" cy="230" r="4" fill="#3BA9FF" />
        <circle cx="140" cy="150" r="14" fill="#3BA9FF" opacity="0.2">
          <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="150" r="8" fill="#FFFFFF" stroke="#3BA9FF" strokeWidth="3" />
        <g transform="translate(300, 80)">
          <circle r="14" fill="#FDC500" opacity="0.3" />
          <path d="M 0 -12 L 6 0 L 0 -4 L -6 0 Z" fill="#FDC500" />
          <circle r="4" fill="#FDC500" />
        </g>
        <g transform="translate(372, 32)">
          <circle r="16" fill={t.card} opacity="0.9" stroke={t.borderLi} />
          <path d="M 0 -8 L 3 3 L 0 1 L -3 3 Z" fill="#EF4444" />
          <path d="M 0 8 L 3 -3 L 0 -1 L -3 -3 Z" fill={t.textSec} opacity="0.5" />
          <text y="-9" textAnchor="middle" fontSize="7" fontWeight="700" fill={t.textPri} fontFamily="system-ui">N</text>
        </g>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════
type BtnVariant = 'primary' | 'accent' | 'secondary' | 'tertiary' | 'success' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';
export const Btn = ({ v = 'primary', onClick, children, icon, t, disabled = false, size = 'md', full = true, ariaLabel }: {
  v?: BtnVariant; onClick?: () => void; children?: React.ReactNode; icon?: string; t: Tokens;
  disabled?: boolean; size?: BtnSize; full?: boolean; ariaLabel?: string;
}) => {
  const styles: Record<BtnVariant, { bg: string; c: string; shadow: string }> = {
    primary: { bg: t.primary, c: '#FFFFFF', shadow: `0 8px 24px ${t.primary}44` },
    accent: { bg: t.accent, c: '#0A0F1C', shadow: `0 8px 24px ${t.accent}55` },
    secondary: { bg: t.cardHi, c: t.textPri, shadow: 'none' },
    tertiary: { bg: 'transparent', c: t.primary, shadow: 'none' },
    success: { bg: t.success, c: '#FFFFFF', shadow: `0 8px 24px ${t.success}55` },
    danger: { bg: t.danger, c: '#FFFFFF', shadow: `0 8px 24px ${t.danger}44` },
  };
  const st = styles[v];
  const h = { sm: 42, md: 52, lg: 58 }[size];
  return (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} style={{
      width: full ? '100%' : 'auto', height: h, borderRadius: 16, background: st.bg, color: st.c,
      border: v === 'tertiary' ? `1px solid ${t.borderLi}` : 'none',
      fontSize: size === 'sm' ? 14 : 16, fontWeight: 700, fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1, boxShadow: st.shadow, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, padding: '0 24px', transition: 'transform 0.12s ease, opacity 0.2s ease', letterSpacing: '-0.01em'
    }}
      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      {icon && <Icon n={icon} s={18} c={st.c} />}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════════════════════════
export const Card = ({ children, t, style = {}, onClick, pad = 20, glow }: {
  children: React.ReactNode; t: Tokens; style?: React.CSSProperties; onClick?: () => void; pad?: number; glow?: string;
}) => (
  <div onClick={onClick} style={{
    background: t.card, borderRadius: 22, border: `1px solid ${t.border}`, padding: pad,
    cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.15s ease',
    boxShadow: glow ? `0 0 0 1px ${glow}22, 0 8px 24px ${glow}18` : 'none', ...style
  }}
    onMouseDown={e => onClick && ((e.currentTarget as HTMLDivElement).style.transform = 'scale(0.99)')}
    onMouseUp={e => onClick && ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1)')}
    onMouseLeave={e => onClick && ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1)')}
  >
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ICON BADGE
// ═══════════════════════════════════════════════════════════════
export const IconBadge = ({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.32),
    background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  }} aria-hidden="true">
    <Icon n={icon} s={Math.round(size * 0.48)} c={color} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ALERT SHEET
// ═══════════════════════════════════════════════════════════════
type AlertSeverity = 'approaching' | 'imminent' | 'entered';
export const AlertSheet = ({ severity, zone, charge, onReroute, onAccept, onDismiss, onPay, t }: {
  severity: AlertSeverity; zone: string; charge: string; onReroute?: () => void;
  onAccept?: () => void; onDismiss?: () => void; onPay?: () => void; t: Tokens;
}) => {
  const cfg: Record<AlertSeverity, { color: string; label: string; title: string; icon: string; glow: string }> = {
    approaching: { color: t.primary, label: 'APPROACHING', title: 'Charge ahead', icon: 'nav', glow: '#3BA9FF' },
    imminent: { color: t.warn, label: 'IMMINENT', title: "You're about to enter a charge zone", icon: 'alert', glow: '#F59E0B' },
    entered: { color: t.danger, label: 'ZONE ENTERED', title: `You've entered ${zone}`, icon: 'zap', glow: '#EF4444' },
  };
  const c = cfg[severity];
  return (
    <div style={{
      background: t.card, borderRadius: 24, border: `1px solid ${c.color}33`,
      boxShadow: `0 0 0 1px ${c.glow}22, 0 24px 48px rgba(0,0,0,0.4)`,
      padding: 20, margin: '0 0 16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <IconBadge icon={c.icon} color={c.color} size={48} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.color, letterSpacing: '0.1em', marginBottom: 4 }}>{c.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em', marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontSize: 14, color: t.textSec }}>
            {severity === 'approaching' && 'Avoid it now and stay clear'}
            {severity === 'imminent' && 'Last chance to reroute'}
            {severity === 'entered' && 'Pay before the deadline to avoid a penalty'}
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: c.color }}>{charge}</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {severity === 'entered' ? (
          <>
            <Btn v="danger" t={t} size="sm" full onClick={onPay}><Icon n="creditCard" s={16} c="#fff" />Pay now</Btn>
            <Btn v="secondary" t={t} size="sm" full onClick={onDismiss}>Dismiss</Btn>
          </>
        ) : (
          <>
            <Btn v="accent" t={t} size="sm" full onClick={onReroute}><Icon n="route" s={16} c="#0A0F1C" />Reroute</Btn>
            <Btn v="secondary" t={t} size="sm" full onClick={onAccept}>Accept charge</Btn>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOGGLE
// ═══════════════════════════════════════════════════════════════
export const Toggle = ({ on, onChange, t, label }: { on: boolean; onChange: (v: boolean) => void; t: Tokens; label?: string }) => (
  <div role="switch" aria-checked={on} aria-label={label} tabIndex={0}
    onClick={() => onChange(!on)}
    onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onChange(!on)}
    style={{
      width: 50, height: 28, borderRadius: 999, background: on ? t.primary : t.cardHi,
      position: 'relative', cursor: 'pointer', transition: 'background 0.22s ease', flexShrink: 0
    }}>
    <div style={{
      position: 'absolute', top: 3, left: on ? 25 : 3, width: 22, height: 22,
      borderRadius: '50%', background: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(0,0,0,0.25)', transition: 'left 0.22s cubic-bezier(0.34,1.56,0.64,1)'
    }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// METRIC CARD
// ═══════════════════════════════════════════════════════════════
export const MetricCard = ({ label, value, sub, icon, color, t }: {
  label: string; value: string; sub?: string; icon?: string; color: string; t: Tokens;
}) => (
  <div style={{ background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, padding: 16, flex: 1 }}>
    {icon && <IconBadge icon={icon} color={color} size={36} />}
    <div style={{ marginTop: icon ? 10 : 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: t.textSec, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
export const AppHeader = ({ title, onBack, t, right, logo }: {
  title?: string; onBack?: () => void; t: Tokens; right?: React.ReactNode; logo?: boolean;
}) => (
  <div style={{
    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: `1px solid ${t.border}`, background: t.bg, position: 'sticky', top: 0, zIndex: 20
  }}>
    {onBack && (
      <button onClick={onBack} aria-label="Go back" style={{
        width: 40, height: 40, borderRadius: 12, background: t.cardHi,
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon n="left" s={22} c={t.textPri} />
      </button>
    )}
    {logo ? <Logo s={26} theme="dark" /> : null}
    {title && (
      <h1 style={{ flex: 1, fontSize: 20, fontWeight: 800, margin: 0, color: t.textPri, letterSpacing: '-0.02em' }}>{title}</h1>
    )}
    {!title && !logo && <div style={{ flex: 1 }} />}
    {right}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════
type NavTab = 'home' | 'drive' | 'zones' | 'trips' | 'more';
export const BottomNav = ({ active, t, onNav }: { active: NavTab; t: Tokens; onNav: (tab: NavTab) => void }) => {
  const tabs: { id: NavTab; icon: string; label: string }[] = [
    { id: 'home', icon: 'shield', label: 'Home' },
    { id: 'drive', icon: 'nav', label: 'Drive' },
    { id: 'zones', icon: 'mapPin', label: 'Zones' },
    { id: 'trips', icon: 'history', label: 'Trips' },
    { id: 'more', icon: 'gear', label: 'More' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: t.surface,
      borderTop: `1px solid ${t.border}`, zIndex: 50,
      paddingBottom: 8, paddingTop: 4,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '4px 0' }}>
        {tabs.map(tab => {
          const isActive = tab.id === active;
          return (
            <button key={tab.id} onClick={() => onNav(tab.id)} aria-label={tab.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px',
              color: isActive ? t.primary : t.textTer, position: 'relative', minWidth: 52,
            }}>
              {isActive && (
                <div style={{
                  position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%', background: t.primary
                }} />
              )}
              {/* Subtle active pill + semantically accurate icon per tab */}
              <div style={{
                width: 42, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 11,
                background: isActive ? `${t.primary}16` : 'transparent',
                transition: 'background 0.22s ease',
              }}>
                {tab.id === 'home' ? (
                  /* Minimal outline hatchback — bold rounded silhouette, two visible wheels */
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
                    stroke={isActive ? t.primary : t.textTer}
                    strokeWidth={isActive ? 2.1 : 1.9}
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true" style={{ flexShrink: 0, display: 'block', overflow: 'visible' }}>
                    {/* Body: rounded roof, sweeping down front/rear, chassis with wheel gaps */}
                    <path d="M2.5 15.5 L2.5 13.2 C2.5 12.2 3.3 11.4 4.3 11.3 L6 7.5 C6.5 6.2 7.8 5.4 9.2 5.4 L14.8 5.4 C16.2 5.4 17.5 6.2 18 7.5 L19.7 11.3 C20.7 11.4 21.5 12.2 21.5 13.2 L21.5 15.5 L19.5 15.5 M14.5 15.5 L9.5 15.5 M4.5 15.5 L2.5 15.5" />
                    <circle cx="7" cy="15.8" r="2" />
                    <circle cx="17" cy="15.8" r="2" />
                  </svg>
                ) : (
                  <Icon
                    n={({ drive: 'nav', zones: 'zap', trips: 'history', more: 'user' } as Record<string, string>)[tab.id] ?? tab.icon}
                    s={22}
                    c={isActive ? t.primary : t.textTer}
                    sw={isActive ? 2 : 1.6}
                  />
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════
export const EmptyState = ({ icon, title, body, cta, onCta, t }: {
  icon: string; title: string; body: string; cta?: string; onCta?: () => void; t: Tokens;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 32px', textAlign: 'center', gap: 16 }}>
    <div style={{ width: 72, height: 72, borderRadius: 24, background: `${t.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon n={icon} s={36} c={t.textTer} />
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.5 }}>{body}</div>
    </div>
    {cta && onCta && (
      <button onClick={onCta} style={{
        marginTop: 8, background: t.primary, color: '#fff', border: 'none', borderRadius: 14,
        padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
      }}>{cta}</button>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SECTION LABEL
// ═══════════════════════════════════════════════════════════════
export const SectionLabel = ({ children, t, action, onAction }: {
  children: React.ReactNode; t: Tokens; action?: string; onAction?: () => void;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
    <span style={{ fontSize: 11, fontWeight: 700, color: t.textTer, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{children}</span>
    {action && <button onClick={onAction} style={{ fontSize: 13, fontWeight: 600, color: t.primary, background: 'none', border: 'none', cursor: 'pointer' }}>{action}</button>}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ROW ITEM (settings / list row)
// ═══════════════════════════════════════════════════════════════
export const RowItem = ({ icon, iconColor, label, value, onPress, t, right, danger = false }: {
  icon?: string; iconColor?: string; label: string; value?: string; onPress?: () => void;
  t: Tokens; right?: React.ReactNode; danger?: boolean;
}) => (
  <div onClick={onPress} style={{
    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
    borderBottom: `1px solid ${t.border}`, cursor: onPress ? 'pointer' : 'default'
  }}>
    {icon && <div style={{ marginLeft: 8 }}><IconBadge icon={icon} color={iconColor || t.textSec} size={38} /></div>}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: danger ? t.danger : t.textPri }}>{label}</div>
      {value && <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>{value}</div>}
    </div>
    {right || (onPress && <div style={{ marginRight: 8 }}><Icon n="right" s={18} c={t.textTer} /></div>)}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// OFFLINE BANNER
// ═══════════════════════════════════════════════════════════════
export const OfflineBanner = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: '#1F2937', zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
      borderBottom: '1px solid rgba(239,68,68,0.3)'
    }}>
      <Icon n="wifiOff" s={18} c="#EF4444" />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#EF4444' }}>No internet connection</span>
      <span style={{ fontSize: 13, color: '#94A3B8' }}>— Some features unavailable</span>
    </div>
  );
};
