import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TOLLPILOT v3 — Apple × IKEA × Revolut polish
// ═══════════════════════════════════════════════════════════════════

const T = {
  dark: {
    bg:'#0A0F1C', surface:'#111827', card:'#151C2E', cardHi:'#1F2937',
    primary:'#3BA9FF', accent:'#FDC500', success:'#22C55E', danger:'#EF4444',
    textPri:'#F8FAFC', textSec:'#94A3B8', textTer:'#64748B',
    border:'rgba(255,255,255,0.06)', borderLi:'rgba(255,255,255,0.10)',
    mapBg:'#0D1220', mapGrid:'rgba(148,163,184,0.08)', mapRoad:'rgba(148,163,184,0.18)'
  },
  light: {
    bg:'#F7F8FA', surface:'#FFFFFF', card:'#FFFFFF', cardHi:'#F1F5F9',
    primary:'#1C6ED5', accent:'#F59E0B', success:'#16A34A', danger:'#DC2626',
    textPri:'#0F172A', textSec:'#475569', textTer:'#94A3B8',
    border:'rgba(15,23,42,0.08)', borderLi:'rgba(15,23,42,0.12)',
    mapBg:'#E2E8F0', mapGrid:'rgba(71,85,105,0.12)', mapRoad:'rgba(71,85,105,0.25)'
  }
};

const ZONES = [
  { id:'ulez', n:'London ULEZ', region:'Greater London', period:'24/7', price:'£12.50', priority:'critical' },
  { id:'cc', n:'London Congestion Charge', region:'Central London', period:'Mon-Fri 7am-6pm', price:'£18.00', priority:'critical' },
  { id:'bcaz', n:'Birmingham CAZ', region:'West Midlands', period:'24/7', price:'£8.00', priority:'high' },
  { id:'brcaz', n:'Bristol CAZ', region:'South West', period:'24/7', price:'£9.00', priority:'high' },
  { id:'ozez', n:'Oxford ZEZ', region:'South East', period:'7am-7pm', price:'£4-10', priority:'high' }
];

const MONTHS = [{m:'Nov',a:38},{m:'Dec',a:52},{m:'Jan',a:67},{m:'Feb',a:45},{m:'Mar',a:89},{m:'Apr',a:23}];
const TRIPS = [
  { id:1, from:'Stratford', to:'City of London', date:'Today, 5:42pm', saved:12.50, dist:'8.2 mi', dur:'32 min', avoided:['ULEZ'] },
  { id:2, from:'Croydon', to:'Heathrow T5', date:'Yesterday, 6:15am', saved:7.00, dist:'22.1 mi', dur:'48 min', avoided:['Airport'] },
  { id:3, from:'Watford', to:'Canary Wharf', date:'3 Apr, 8:30am', saved:30.50, dist:'24.6 mi', dur:'55 min', avoided:['ULEZ','CC'] }
];
const totalSaved = MONTHS.reduce((s,m)=>s+m.a,0);

// ─── ICONS ───────────────────────────────────────────────────────
const IC = {
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  nav:'M3 11l19-9-9 19-2-8-8-2z',
  route:'M6 19a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM18 5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H18',
  history:'M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2',
  up:'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  bell:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  close:'M18 6L6 18M6 6l12 12',
  check:'M20 6L9 17l-5-5',
  right:'M9 18l6-6-6-6',
  left:'M15 18l-6-6 6-6',
  plus:'M12 5v14M5 12h14',
  alert:'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17v.01',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  search:'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  sun:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  moon:'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  crown:'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  locate:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v2M12 20v2M2 12h2M20 12h2'
};
const Icon = ({ n, s=20, c='currentColor', sw=2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {(IC[n]||'').split('M').filter(Boolean).map((p,i)=><path key={i} d={'M'+p}/>)}
  </svg>
);

// ─── TOLLPILOT LOGO (real brand mark) ────────────────────────────
const Logo = ({ s=32, theme, variant='auto' }) => {
  // Auto-select: dark theme → white, light theme → blue
  const useMono = variant === 'mono';
  const useWhite = variant === 'white' || (variant === 'auto' && theme === 'dark');
  const arch = useWhite ? '#FFFFFF' : useMono ? '#0F172A' : '#93C5FD';
  const road = useWhite ? '#FFFFFF' : useMono ? '#0F172A' : '#1E40AF';
  const text = useWhite ? '#FFFFFF' : useMono ? '#0F172A' : '#1E40AF';
  const roadOp = useWhite ? 0.85 : 1;
  const archOp = useWhite ? 0.6 : 1;

  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:10}} role="img" aria-label="TollPilot">
      <svg width={s} height={s*0.95} viewBox="0 0 40 38" fill="none">
        {/* Toll arch */}
        <path
          d="M 6 4 L 34 4 L 32 10 L 30 10 L 30 32 L 10 32 L 10 10 L 8 10 Z"
          fill={arch}
          opacity={archOp}
        />
        {/* Arch opening */}
        <path d="M 15 10 Q 15 18 20 18 Q 25 18 25 10 Z" fill={theme==='dark' && !useMono ? '#0A0F1C' : '#FFFFFF'} opacity={useWhite ? 0.2 : 1}/>
        {/* Road curve */}
        <path
          d="M 10 32 Q 14 26 20 24 Q 28 22 32 18 L 34 32 Z"
          fill={road}
          opacity={roadOp}
        />
        {/* Road highlight */}
        <path
          d="M 12 30 Q 18 26 24 25"
          stroke={theme==='dark' && !useMono ? '#0A0F1C' : '#FFFFFF'}
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
          strokeLinecap="round"
          opacity={0.4}
        />
      </svg>
      <span style={{fontSize:s*0.58, fontWeight:800, letterSpacing:'-0.03em', color:text, fontFamily:'system-ui, -apple-system, sans-serif'}}>
        TollPilot
      </span>
    </div>
  );
};

// ─── UK PLATE (centered, bold, polished) ─────────────────────────
const Plate = ({ value='', onChange, editable, size='lg', validated, showHint=true, theme }) => {
  const sz = {
    sm: { h:40, fs:18, gb:30, rad:8 },
    md: { h:56, fs:24, gb:40, rad:10 },
    lg: { h:72, fs:32, gb:52, rad:12 }
  }[size];
  const v = value.toUpperCase().replace(/[^A-Z0-9 ]/g,'').slice(0,8);
  const [snap, setSnap] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (validated) {
      setSnap(true);
      const x = setTimeout(() => setSnap(false), 400);
      return () => clearTimeout(x);
    }
  }, [validated]);

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:14, width:'100%'}}>
      <div
        onClick={() => editable && inputRef.current?.focus()}
        style={{
          position:'relative',
          width:'100%',
          maxWidth: size==='lg' ? 300 : size==='md' ? 240 : 180,
          height:sz.h,
          background:'#FDC500',
          borderRadius:sz.rad,
          border:'2px solid #0A0F1C',
          boxShadow: validated
            ? '0 12px 32px rgba(253,197,0,0.4), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.1)'
            : '0 6px 20px rgba(253,197,0,0.25), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.08)',
          display:'flex',
          alignItems:'center',
          overflow:'hidden',
          transform: snap ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
          cursor: editable ? 'text' : 'default'
        }}
        role={editable ? 'presentation' : 'img'}
        aria-label={!editable ? `Registration plate ${v||'AB12 CDE'}` : undefined}
      >
        {/* GB tag */}
        <div style={{
          position:'absolute', left:0, top:0, bottom:0, width:sz.gb,
          background:'#0A3FC4',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'space-between',
          padding:size==='lg' ? '8px 0' : '5px 0'
        }}>
          {/* EU stars ring */}
          <div style={{
            width: size==='lg' ? 14 : 10, height: size==='lg' ? 14 : 10,
            borderRadius:'50%',
            border: `${size==='lg' ? 1.5 : 1}px solid #FDC500`,
            position:'relative'
          }}>
            {[0,60,120,180,240,300].map(deg=>(
              <div key={deg} style={{
                position:'absolute', top:'50%', left:'50%',
                width:2, height:2, borderRadius:'50%',
                background:'#FDC500',
                transform:`translate(-50%,-50%) rotate(${deg}deg) translateY(-${size==='lg' ? 5 : 3.5}px)`
              }}/>
            ))}
          </div>
          <span style={{
            color:'#FFFFFF',
            fontSize:size==='lg' ? 13 : size==='md' ? 11 : 9,
            fontWeight:800,
            letterSpacing:'0.08em',
            fontFamily:'system-ui, sans-serif'
          }}>GB</span>
        </div>

        {/* Plate number — centered, bold */}
        {editable ? (
          <input
            ref={inputRef}
            type="text"
            value={v}
            onChange={(e) => onChange?.(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g,'').slice(0,8))}
            placeholder="AB12 CDE"
            aria-label="Enter vehicle registration plate"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            style={{
              position:'absolute',
              left: sz.gb,
              right: 0,
              top: 0,
              bottom: 0,
              width: `calc(100% - ${sz.gb}px)`,
              background:'transparent',
              border:'none',
              outline:'none',
              fontFamily:"'Charles Wright', 'JetBrains Mono', monospace",
              fontSize:sz.fs,
              fontWeight:900,
              color:'#0A0F1C',
              letterSpacing:'0.12em',
              textAlign:'center',
              textTransform:'uppercase'
            }}
          />
        ) : (
          <div style={{
            position:'absolute',
            left: sz.gb,
            right: 0,
            top: 0,
            bottom: 0,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontFamily:"'Charles Wright', 'JetBrains Mono', monospace",
            fontSize:sz.fs,
            fontWeight:900,
            color:'#0A0F1C',
            letterSpacing:'0.12em'
          }}>
            {v || 'AB12 CDE'}
          </div>
        )}
      </div>

      {showHint && validated && (
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          fontSize:13, fontWeight:600, color:'#22C55E',
          animation:'fadeUp 0.4s ease'
        }} role="status">
          <div style={{
            width:20, height:20, borderRadius:'50%', background:'#22C55E',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <Icon n="check" s={13} c="#FFFFFF" sw={3}/>
          </div>
          Looks good — this is your registered vehicle
        </div>
      )}
    </div>
  );
};

// ─── PHOTOREALISTIC 3D CAR ───────────────────────────────────────
// Built with advanced SVG — realistic shading, reflections, shadows
const Car3D = ({ theme, color = '#2563EB' }) => {
  const isDark = theme === 'dark';
  return (
    <div style={{width:280, height:130, position:'relative'}} role="img" aria-label="Your registered vehicle">
      <svg width="280" height="130" viewBox="0 0 280 130">
        <defs>
          {/* Body gradient — top to bottom with highlights */}
          <linearGradient id="bodyTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1"/>
            <stop offset="40%" stopColor={color} stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="1"/>
          </linearGradient>
          {/* Body side panel */}
          <linearGradient id="bodySide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A"/>
            <stop offset="50%" stopColor={color}/>
            <stop offset="100%" stopColor="#1E3A8A"/>
          </linearGradient>
          {/* Window gradient — reflection */}
          <linearGradient id="glass" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95"/>
            <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.9"/>
          </linearGradient>
          {/* Wheel — metallic */}
          <radialGradient id="wheel" cx="0.35" cy="0.35">
            <stop offset="0%" stopColor="#6B7280"/>
            <stop offset="50%" stopColor="#374151"/>
            <stop offset="100%" stopColor="#111827"/>
          </radialGradient>
          {/* Wheel rim */}
          <radialGradient id="rim" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="#E5E7EB"/>
            <stop offset="60%" stopColor="#9CA3AF"/>
            <stop offset="100%" stopColor="#4B5563"/>
          </radialGradient>
          {/* Shadow */}
          <radialGradient id="shadow" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="#000" stopOpacity="0.45"/>
            <stop offset="70%" stopColor="#000" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          {/* Roof reflection */}
          <linearGradient id="roofShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0"/>
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.35"/>
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="140" cy="115" rx="110" ry="7" fill="url(#shadow)"/>

        {/* Car body — lower section */}
        <path
          d="M 30 92
             L 30 72
             Q 30 66 36 66
             L 50 66
             Q 56 52 68 44
             Q 80 38 100 36
             L 180 36
             Q 200 38 212 44
             Q 224 52 230 66
             L 244 66
             Q 250 66 250 72
             L 250 92
             Q 250 98 244 98
             L 36 98
             Q 30 98 30 92 Z"
          fill="url(#bodySide)"
        />

        {/* Upper body / roof */}
        <path
          d="M 62 66
             Q 68 50 80 44
             Q 92 38 108 38
             L 170 38
             Q 188 38 200 44
             Q 214 50 218 66 Z"
          fill="url(#bodyTop)"
        />

        {/* Roof shine */}
        <path
          d="M 72 48 Q 88 42 110 42 L 168 42 Q 190 42 208 48"
          stroke="url(#roofShine)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Windshield */}
        <path
          d="M 72 66
             Q 78 52 90 48
             L 130 48
             L 130 66 Z"
          fill="url(#glass)"
        />

        {/* Rear window */}
        <path
          d="M 150 48
             L 188 48
             Q 200 52 208 66
             L 150 66 Z"
          fill="url(#glass)"
        />

        {/* B-pillar */}
        <rect x="135" y="48" width="12" height="18" fill="#1E3A8A"/>

        {/* Side windows (rear door glass) */}
        <path d="M 138 50 L 146 50 L 146 64 L 138 64 Z" fill="url(#glass)" opacity="0.8"/>

        {/* Door cut line */}
        <line x1="140" y1="68" x2="140" y2="92" stroke="#0F172A" strokeWidth="0.8" opacity="0.4"/>

        {/* Door handles */}
        <rect x="100" y="78" width="18" height="3" rx="1.5" fill="#0F172A" opacity="0.7"/>
        <rect x="160" y="78" width="18" height="3" rx="1.5" fill="#0F172A" opacity="0.7"/>

        {/* Headlight (front right) */}
        <ellipse cx="228" cy="74" rx="8" ry="6" fill="#FEF3C7"/>
        <ellipse cx="228" cy="74" rx="5" ry="3.5" fill="#FDE68A"/>
        <ellipse cx="228" cy="74" rx="2" ry="1.5" fill="#FFFFFF"/>

        {/* Taillight */}
        <rect x="34" y="70" width="8" height="12" rx="2" fill="#DC2626"/>
        <rect x="34" y="72" width="8" height="3" rx="1" fill="#FEE2E2" opacity="0.6"/>

        {/* Grille */}
        <rect x="216" y="80" width="18" height="6" rx="1" fill="#0F172A" opacity="0.8"/>
        <line x1="218" y1="83" x2="232" y2="83" stroke="#374151" strokeWidth="0.5"/>

        {/* Bumper line */}
        <line x1="40" y1="92" x2="240" y2="92" stroke="#0F172A" strokeWidth="1" opacity="0.3"/>

        {/* Front wheel */}
        <g>
          <circle cx="212" cy="100" r="16" fill="#111827"/>
          <circle cx="212" cy="100" r="14" fill="url(#wheel)"/>
          <circle cx="212" cy="100" r="10" fill="url(#rim)"/>
          <circle cx="212" cy="100" r="3" fill="#1F2937"/>
          {/* Spokes */}
          {[0,72,144,216,288].map(d=>(
            <line
              key={d}
              x1="212" y1="100"
              x2={212 + Math.cos(d*Math.PI/180)*9}
              y2={100 + Math.sin(d*Math.PI/180)*9}
              stroke="#6B7280" strokeWidth="1.5"
            />
          ))}
        </g>

        {/* Rear wheel */}
        <g>
          <circle cx="68" cy="100" r="16" fill="#111827"/>
          <circle cx="68" cy="100" r="14" fill="url(#wheel)"/>
          <circle cx="68" cy="100" r="10" fill="url(#rim)"/>
          <circle cx="68" cy="100" r="3" fill="#1F2937"/>
          {[0,72,144,216,288].map(d=>(
            <line
              key={d}
              x1="68" y1="100"
              x2={68 + Math.cos(d*Math.PI/180)*9}
              y2={100 + Math.sin(d*Math.PI/180)*9}
              stroke="#6B7280" strokeWidth="1.5"
            />
          ))}
        </g>

        {/* Body bottom reflection/gradient overlay */}
        <path
          d="M 30 88 L 250 88 L 244 98 L 36 98 Z"
          fill="#0A0F1C"
          opacity="0.3"
        />

        {/* Top light reflection on windshield */}
        <path
          d="M 80 52 L 120 50 L 118 54 L 82 56 Z"
          fill="#FFFFFF"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

// ─── MAP COMPONENT (polished, Waze-inspired) ─────────────────────
const MiniMap = ({ t, theme, size = 'md', showDestination = true }) => {
  const h = size === 'lg' ? 260 : size === 'md' ? 200 : 160;
  return (
    <div
      role="img"
      aria-label="Route map"
      style={{
        width:'100%', height:h, borderRadius:20, overflow:'hidden',
        background:t.mapBg, position:'relative',
        border:`1px solid ${t.border}`,
        boxShadow: theme==='dark' ? '0 0 0 1px rgba(59,169,255,0.08), 0 20px 40px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15,23,42,0.08)'
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="mapGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={t.mapGrid} strokeWidth="0.5"/>
          </pattern>
          <linearGradient id="routeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#3BA9FF"/>
            <stop offset="70%" stopColor="#3BA9FF"/>
            <stop offset="100%" stopColor="#22D3EE"/>
          </linearGradient>
          <linearGradient id="altRoute" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.4"/>
          </linearGradient>
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="3"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="dangerZone">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35"/>
            <stop offset="70%" stopColor="#EF4444" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <rect width="400" height="260" fill={t.mapBg}/>
        <rect width="400" height="260" fill="url(#mapGrid)"/>

        {/* Street network — subtle roads */}
        <g stroke={t.mapRoad} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6">
          <path d="M 0 80 Q 100 75 200 90 T 400 100"/>
          <path d="M 0 180 Q 120 175 250 185 T 400 190"/>
          <path d="M 80 0 Q 85 100 120 180 T 140 260"/>
          <path d="M 280 0 Q 275 100 290 180 T 310 260"/>
        </g>

        {/* Secondary streets */}
        <g stroke={t.mapRoad} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35">
          <path d="M 0 40 L 400 50"/>
          <path d="M 0 130 Q 200 135 400 140"/>
          <path d="M 0 220 L 400 225"/>
          <path d="M 40 0 L 50 260"/>
          <path d="M 180 0 L 190 260"/>
          <path d="M 350 0 L 360 260"/>
        </g>

        {/* Danger zone (ULEZ) */}
        <circle cx="300" cy="70" r="50" fill="url(#dangerZone)"/>
        <circle cx="300" cy="70" r="14" fill="#EF4444" opacity="0.7">
          <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="300" cy="70" r="8" fill="#EF4444"/>

        {/* Alternative route (cheapest - green) */}
        <path
          d="M 60 220 Q 80 180 130 170 Q 180 160 220 200 Q 260 230 340 200"
          stroke="url(#altRoute)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 4"
        />

        {/* Main route */}
        <path
          d="M 60 220 Q 90 170 140 140 Q 180 120 220 100 Q 260 80 300 70"
          stroke="url(#routeGrad)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#routeGlow)"
        />

        {/* Start pin */}
        <circle cx="60" cy="220" r="10" fill="#FFFFFF" stroke="#3BA9FF" strokeWidth="3"/>
        <circle cx="60" cy="220" r="4" fill="#3BA9FF"/>

        {/* Current position (animated) */}
        <circle cx="140" cy="140" r="14" fill="#3BA9FF" opacity="0.25">
          <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="140" cy="140" r="8" fill="#FFFFFF" stroke="#3BA9FF" strokeWidth="3"/>

        {/* Destination pin */}
        {showDestination && (
          <g transform="translate(300, 70)">
            <circle r="14" fill="#FDC500" opacity="0.3"/>
            <path d="M 0 -12 L 6 0 L 0 -4 L -6 0 Z" fill="#FDC500"/>
            <circle r="5" fill="#FDC500"/>
          </g>
        )}

        {/* Compass */}
        <g transform="translate(368, 28)">
          <circle r="16" fill={t.card} opacity="0.9" stroke={t.borderLi}/>
          <path d="M 0 -8 L 3 3 L 0 1 L -3 3 Z" fill={t.danger}/>
          <path d="M 0 8 L 3 -3 L 0 -1 L -3 -3 Z" fill={t.textSec} opacity="0.5"/>
          <text y="-9" textAnchor="middle" fontSize="7" fontWeight="700" fill={t.textPri} fontFamily="system-ui">N</text>
        </g>
      </svg>
    </div>
  );
};

// ─── REUSABLE UI ─────────────────────────────────────────────────
const Btn = ({ v='primary', onClick, children, icon, t, disabled, size='md', full=true, ariaLabel }) => {
  const styles = {
    primary: { bg:t.primary, c:'#FFFFFF', shadow:`0 8px 24px ${t.primary}44` },
    accent: { bg:t.accent, c:'#0A0F1C', shadow:`0 8px 24px ${t.accent}55` },
    secondary: { bg:t.cardHi, c:t.textPri, shadow:'none' },
    tertiary: { bg:'transparent', c:t.primary, shadow:'none' },
    success: { bg:t.success, c:'#FFFFFF', shadow:`0 8px 24px ${t.success}55` }
  }[v];
  const h = { sm:42, md:52, lg:58 }[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: full ? '100%' : 'auto',
        height: h,
        borderRadius: 16,
        background: styles.bg,
        color: styles.c,
        border: v==='tertiary' ? `1px solid ${t.borderLi}` : 'none',
        fontSize: size==='sm' ? 14 : 16,
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: styles.shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '0 24px',
        transition: 'transform 0.12s ease, box-shadow 0.2s ease',
        letterSpacing: '-0.01em'
      }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(0.97)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
    >
      {icon && <Icon n={icon} s={18} c={styles.c}/>}
      {children}
    </button>
  );
};

const Card = ({ children, t, style={}, onClick, pad=20 }) => (
  <div
    onClick={onClick}
    style={{
      background: t.card, borderRadius: 22, border: `1px solid ${t.border}`,
      padding: pad, cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s ease',
      ...style
    }}
  >
    {children}
  </div>
);

const Badge = ({ icon, color, size=42 }) => (
  <div style={{
    width: size, height: size, borderRadius: size*0.32,
    background: `${color}1F`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  }} aria-hidden="true">
    <Icon n={icon} s={size*0.46} c={color}/>
  </div>
);

const Header = ({ title, onBack, t, right }) => (
  <div style={{
    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: `1px solid ${t.border}`, background: t.bg,
    position: 'sticky', top: 0, zIndex: 10
  }}>
    {onBack && (
      <button
        onClick={onBack}
        aria-label="Go back"
        style={{
          width: 40, height: 40, borderRadius: 12, background: t.cardHi,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Icon n="left" s={22} c={t.textPri}/>
      </button>
    )}
    <h1 style={{flex: 1, fontSize: 20, fontWeight: 800, margin: 0, color: t.textPri, letterSpacing: '-0.02em'}}>
      {title}
    </h1>
    {right}
  </div>
);

const Toggle = ({ on, onChange, t, label }) => (
  <div
    role="switch"
    aria-checked={on}
    aria-label={label}
    tabIndex={0}
    onClick={() => onChange(!on)}
    onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onChange(!on)}
    style={{
      width: 48, height: 28, borderRadius: 999,
      background: on ? t.primary : t.cardHi,
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.2s ease'
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: on ? 23 : 3,
      width: 22, height: 22, borderRadius: '50%', background: '#FFF',
      transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    }}/>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════

const Splash = ({ t, theme, onNext }) => {
  useEffect(() => { const x = setTimeout(onNext, 1800); return () => clearTimeout(x); }, [onNext]);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32,
      background: `radial-gradient(ellipse at 50% 35%, ${t.primary}22, transparent 65%)`
    }}>
      <div style={{animation: 'breath 2.4s ease-in-out infinite'}}>
        <Logo s={56} theme={theme}/>
      </div>
      <div style={{width: 56, height: 3, borderRadius: 2, background: t.primary, animation: 'loadBar 1.8s ease'}}/>
      <div style={{fontSize: 13, color: t.textTer, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600}}>
        Smart driving · Zero surprises
      </div>
    </div>
  );
};

const Onboarding = ({ t, theme, onComplete }) => {
  const [slide, setSlide] = useState(0);
  const [reg, setReg] = useState('');
  const [validated, setValidated] = useState(false);

  const slides = [
    { icon: 'shield', color: t.primary, title: "Never pay a charge\nyou didn't expect", body: 'Real-time alerts before ULEZ, congestion and toll zones.' },
    { icon: 'route', color: t.accent, title: 'See the true cost\nof every route', body: 'Compare fastest, cheapest and balanced — before you drive.' }
  ];

  useEffect(() => {
    const valid = /^[A-Z]{2}[0-9]{1,2}\s?[A-Z]{3}$/.test(reg.replace(/\s/g,'').toUpperCase()) && reg.length >= 6;
    if (slide === 2 && valid && !validated) {
      const x = setTimeout(() => setValidated(true), 300);
      return () => clearTimeout(x);
    }
    if (slide !== 2) setValidated(false);
  }, [reg, slide, validated]);

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Logo s={24} theme={theme}/>
        {slide < 2 && (
          <button
            onClick={() => onComplete('')}
            aria-label="Skip onboarding"
            style={{background: 'transparent', border: 'none', color: t.textSec, fontSize: 14, fontWeight: 600, cursor: 'pointer'}}
          >
            Skip
          </button>
        )}
      </div>

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center'}}>
        {slide < 2 ? (
          <>
            <div style={{
              width: 104, height: 104, borderRadius: 32,
              background: `${slides[slide].color}1F`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 36,
              animation: 'fadeScale 0.5s ease'
            }}>
              <Icon n={slides[slide].icon} s={52} c={slides[slide].color}/>
            </div>
            <h1 style={{
              fontSize: 32, fontWeight: 800, color: t.textPri,
              lineHeight: 1.15, margin: 0, whiteSpace: 'pre-line',
              letterSpacing: '-0.025em'
            }}>
              {slides[slide].title}
            </h1>
            <p style={{fontSize: 17, color: t.textSec, lineHeight: 1.55, marginTop: 20, maxWidth: 320}}>
              {slides[slide].body}
            </p>
          </>
        ) : (
          <>
            <h1 style={{fontSize: 30, fontWeight: 800, color: t.textPri, margin: 0, marginBottom: 12, letterSpacing: '-0.025em'}}>
              Which one's yours?
            </h1>
            <p style={{fontSize: 15, color: t.textSec, marginBottom: 32, maxWidth: 280, lineHeight: 1.5}}>
              We'll check MOT, tax and ULEZ compliance automatically.
            </p>
            <Plate
              value={reg}
              onChange={setReg}
              editable
              size="lg"
              validated={validated}
              theme={theme}
            />
            {validated && (
              <div style={{marginTop: 24, animation: 'fadeUp 0.5s ease'}}>
                <Car3D theme={theme}/>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{padding: '24px 24px 40px'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24}} role="tablist" aria-label="Onboarding progress">
          {[0,1,2].map(i => (
            <div
              key={i}
              role="tab"
              aria-selected={i === slide}
              style={{
                width: i === slide ? 28 : 8, height: 8, borderRadius: 4,
                background: i === slide ? t.primary : t.borderLi,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <Btn
          t={t}
          v="accent"
          onClick={() => slide < 2 ? setSlide(slide + 1) : onComplete(reg)}
          disabled={slide === 2 && !validated}
        >
          Continue
        </Btn>
      </div>
    </div>
  );
};

const Permission = ({ t, variant, onNext }) => {
  const cfg = variant === 'location' ? {
    icon: 'locate', color: t.primary,
    title: 'Enable location',
    body: "TollPilot alerts you before you enter a charge zone. We only use your location while driving.",
    cta: 'Allow location'
  } : {
    icon: 'bell', color: t.accent,
    title: 'Stay informed',
    body: "Get notified about charges, MOT dates, and how much you've saved.",
    cta: 'Enable notifications'
  };
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: 24}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{
          width: 104, height: 104, borderRadius: 32,
          background: `${cfg.color}1F`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 36
        }}>
          <Icon n={cfg.icon} s={52} c={cfg.color}/>
        </div>
        <h1 style={{fontSize: 30, fontWeight: 800, color: t.textPri, margin: 0, marginBottom: 16, letterSpacing: '-0.025em'}}>
          {cfg.title}
        </h1>
        <p style={{fontSize: 17, color: t.textSec, lineHeight: 1.55, maxWidth: 320}}>
          {cfg.body}
        </p>
      </div>
      <Btn t={t} v="accent" onClick={onNext}>{cfg.cta}</Btn>
      <button
        onClick={onNext}
        style={{marginTop: 12, padding: '12px 0', background: 'transparent', border: 'none', color: t.textSec, fontSize: 14, cursor: 'pointer', fontWeight: 600}}
      >
        Not now
      </button>
    </div>
  );
};

const VehicleLookup = ({ t, theme, reg, onNext }) => {
  useEffect(() => { const x = setTimeout(onNext, 1600); return () => clearTimeout(x); }, [onNext]);
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center'}}>
      <div style={{marginBottom: 32}}>
        <Plate value={reg || 'AB12 CDE'} size="md" showHint={false} theme={theme}/>
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: `3px solid ${t.border}`, borderTopColor: t.primary,
        animation: 'spin 1s linear infinite', marginBottom: 24
      }}/>
      <h2 style={{fontSize: 22, fontWeight: 700, color: t.textPri, margin: 0, marginBottom: 8, letterSpacing: '-0.02em'}}>
        Looking up your vehicle
      </h2>
      <p style={{fontSize: 15, color: t.textSec}}>Checking DVLA for MOT, tax and ULEZ…</p>
    </div>
  );
};

const Dashboard = ({ t, theme, reg, nav, toggleTheme }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{flex: 1, overflowY: 'auto', paddingBottom: 100}}>
      <div style={{padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Logo s={24} theme={theme}/>
        <div style={{display: 'flex', gap: 8}}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: 40, height: 40, borderRadius: 12, background: t.cardHi,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Icon n={theme === 'dark' ? 'sun' : 'moon'} s={20} c={t.textPri}/>
          </button>
          <button
            onClick={() => nav('notifs')}
            aria-label="Notifications (2 unread)"
            style={{
              width: 40, height: 40, borderRadius: 12, background: t.cardHi,
              border: 'none', cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Icon n="bell" s={20} c={t.textPri}/>
            <div style={{position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: t.danger}}/>
          </button>
        </div>
      </div>

      <div style={{padding: '0 20px 8px'}}>
        <div style={{fontSize: 14, color: t.textSec, marginBottom: 2}}>{greeting}, Justin</div>
        <h1 style={{fontSize: 28, fontWeight: 800, color: t.textPri, margin: 0, letterSpacing: '-0.025em'}}>
          Your dashboard
        </h1>
      </div>

      <div style={{padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14}}>
        {/* MOT Alert */}
        <Card
          t={t}
          onClick={() => nav('motBooking')}
          style={{boxShadow: `0 0 0 1px ${t.accent}33, 0 12px 32px ${t.accent}18`, animation: 'fadeUp 0.4s ease'}}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Badge icon="alert" color={t.accent} size={48}/>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 11, fontWeight: 700, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2}}>
                Action needed
              </div>
              <div style={{fontSize: 16, fontWeight: 700, color: t.textPri}}>MOT expires in 14 days</div>
              <div style={{fontSize: 13, color: t.textSec, marginTop: 2}}>Book from 20 March</div>
            </div>
            <Icon n="right" s={20} c={t.textTer}/>
          </div>
        </Card>

        {/* Vehicle */}
        <Card t={t} onClick={() => nav('vehicle')}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em'}}>
              Your vehicle
            </div>
            <Icon n="right" s={16} c={t.textTer}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 14}}>
            <Plate value={reg || 'AB12 CDE'} size="md" showHint={false} theme={theme}/>
          </div>
          <div style={{fontSize: 13, color: t.textSec, textAlign: 'center', marginBottom: 16}}>
            VW Golf · 2019 · Petrol · Euro 6
          </div>
          <div style={{display: 'flex', gap: 8}}>
            {[
              { l: 'MOT', v: '14d', c: t.accent },
              { l: 'Tax', v: 'Valid', c: t.success },
              { l: 'ULEZ', v: 'Exempt', c: t.success }
            ].map(s => (
              <div key={s.l} style={{flex: 1, padding: '12px 0', borderRadius: 12, background: t.cardHi, textAlign: 'center'}}>
                <div style={{fontSize: 10, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3}}>
                  {s.l}
                </div>
                <div style={{fontSize: 13, fontWeight: 800, color: s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10}}>
          {[
            { icon: 'nav', color: t.primary, label: 'Drive', screen: 'driving' },
            { icon: 'route', color: t.accent, label: 'Route', screen: 'routes' },
            { icon: 'shield', color: t.success, label: 'Zones', screen: 'zones' }
          ].map(a => (
            <button
              key={a.label}
              onClick={() => nav(a.screen)}
              aria-label={a.label}
              style={{
                padding: '18px 8px', borderRadius: 20,
                background: t.card, border: `1px solid ${t.border}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              <Badge icon={a.icon} color={a.color} size={46}/>
              <span style={{fontSize: 13, fontWeight: 700, color: t.textPri}}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Savings hero */}
        <Card
          t={t}
          onClick={() => nav('savings')}
          style={{
            background: `linear-gradient(135deg, ${t.success}22, ${t.success}08)`,
            border: `1px solid ${t.success}44`,
            boxShadow: `0 12px 32px ${t.success}20`
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16}}>
            <div>
              <div style={{fontSize: 11, fontWeight: 700, color: t.success, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8}}>
                Total saved
              </div>
              <div style={{fontSize: 44, fontWeight: 800, color: t.textPri, lineHeight: 1, letterSpacing: '-0.03em'}}>
                £{totalSaved}
              </div>
              <div style={{fontSize: 13, color: t.textSec, marginTop: 8}}>22 zones avoided this year</div>
            </div>
            <div style={{padding: '6px 12px', borderRadius: 999, background: `${t.success}33`, fontSize: 12, fontWeight: 800, color: t.success}}>
              ↑ 18%
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 6, height: 48}} aria-hidden="true">
            {MONTHS.map((m, i) => {
              const max = Math.max(...MONTHS.map(x => x.a));
              return (
                <div key={m.m} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                  <div style={{
                    width: '100%', borderRadius: 4,
                    height: Math.max(6, (m.a / max) * 40),
                    background: i === MONTHS.length - 1 ? t.success : `${t.success}44`
                  }}/>
                  <span style={{fontSize: 10, color: t.textTer, fontWeight: 600}}>{m.m}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent trips */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: t.textTer,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            padding: '8px 4px', marginTop: 4
          }}>
            Recent trips
          </div>
          <Card t={t} pad={4}>
            {TRIPS.slice(0, 3).map((trip, i) => (
              <div
                key={trip.id}
                onClick={() => nav('trip', trip)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderBottom: i < 2 ? `1px solid ${t.border}` : 'none',
                  cursor: 'pointer'
                }}
              >
                <Badge icon="nav" color={t.success} size={36}/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: t.textPri, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {trip.from} → {trip.to}
                  </div>
                  <div style={{fontSize: 12, color: t.textTer, marginTop: 2}}>
                    {trip.date.split(',')[0]} · {trip.dist}
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 16, fontWeight: 800, color: t.success}}>£{trip.saved.toFixed(2)}</div>
                  <div style={{fontSize: 10, color: t.textTer}}>saved</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const Routes = ({ t, theme, nav }) => (
  <div style={{flex: 1, overflowY: 'auto', paddingBottom: 100}}>
    <div style={{padding: '20px 20px 16px'}}>
      <h1 style={{fontSize: 32, fontWeight: 800, color: t.textPri, margin: 0, letterSpacing: '-0.025em'}}>
        Routes
      </h1>
      <p style={{fontSize: 15, color: t.textSec, margin: '4px 0 0'}}>
        Compare routes by cost and time
      </p>
    </div>

    {/* Map preview */}
    <div style={{padding: '0 20px 16px'}}>
      <div onClick={() => nav('routeInput')} style={{cursor: 'pointer', position: 'relative'}}>
        <MiniMap t={t} theme={theme} size="md"/>
        {/* Route info overlay */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(10,15,28,0.85)', backdropFilter: 'blur(10px)',
          borderRadius: 14, padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: 8
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF'}}/>
            <span style={{fontSize: 12, color: '#FFFFFF', fontWeight: 600}}>Current location</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 8, height: 8, borderRadius: '50%', background: '#FDC500'}}/>
            <span style={{fontSize: 12, color: '#FFFFFF', fontWeight: 600}}>London EC2</span>
          </div>
        </div>
      </div>
    </div>

    {/* Plan CTA */}
    <div style={{padding: '0 20px 20px'}}>
      <Btn t={t} v="primary" icon="search" onClick={() => nav('routeInput')}>
        Plan a route
      </Btn>
    </div>

    {/* Zones near you */}
    <div style={{padding: '0 20px'}}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: t.textTer,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        marginBottom: 12
      }}>
        Zones near you
      </div>
      <Card t={t} pad={4}>
        {ZONES.map((z, i) => (
          <div
            key={z.id}
            onClick={() => nav('zoneDetail', z)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              borderBottom: i < ZONES.length - 1 ? `1px solid ${t.border}` : 'none',
              cursor: 'pointer'
            }}
          >
            <Badge
              icon="shield"
              color={z.priority === 'critical' ? t.danger : t.primary}
              size={40}
            />
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 15, fontWeight: 700, color: t.textPri}}>{z.n}</div>
              <div style={{fontSize: 12, color: t.textTer, marginTop: 2}}>
                {z.region} · {z.period}
              </div>
            </div>
            <div style={{fontSize: 15, fontWeight: 800, color: t.textPri}}>{z.price}</div>
            <Icon n="right" s={16} c={t.textTer}/>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

const RouteInput = ({ t, theme, onBack, onCompare }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Plan route" onBack={onBack} t={t}/>
    <div style={{padding: 20, flex: 1, overflowY: 'auto'}}>
      <Card t={t} pad={4} style={{marginBottom: 20}}>
        {[
          { l: 'From', v: 'Stratford', c: t.success },
          { l: 'To', v: 'City of London', c: t.danger }
        ].map((r, i) => (
          <div
            key={r.l}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px',
              borderBottom: i === 0 ? `1px solid ${t.border}` : 'none'
            }}
          >
            <div style={{width: 10, height: 10, borderRadius: '50%', background: r.c}}/>
            <div style={{flex: 1}}>
              <div style={{fontSize: 10, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700}}>
                {r.l}
              </div>
              <input
                defaultValue={r.v}
                aria-label={r.l}
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: t.textPri, fontSize: 16, fontWeight: 700,
                  padding: '4px 0', width: '100%', fontFamily: 'inherit'
                }}
              />
            </div>
          </div>
        ))}
      </Card>

      <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12}}>
        Recent
      </div>
      {['Stratford → City of London', 'Croydon → Heathrow T5', 'Home → Work'].map(r => (
        <div
          key={r}
          onClick={onCompare}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 0',
            borderBottom: `1px solid ${t.border}`,
            cursor: 'pointer'
          }}
        >
          <Icon n="history" s={18} c={t.textTer}/>
          <div style={{flex: 1, fontSize: 14, fontWeight: 600, color: t.textPri}}>{r}</div>
          <Icon n="right" s={16} c={t.textTer}/>
        </div>
      ))}
    </div>
    <div style={{padding: 20, borderTop: `1px solid ${t.border}`}}>
      <Btn t={t} v="primary" icon="search" onClick={onCompare}>Compare routes</Btn>
    </div>
  </div>
);

const RouteCompare = ({ t, theme, onBack, onStart }) => {
  const [sel, setSel] = useState('cheap');
  const routes = [
    { id: 'fast', label: 'Fastest', time: '28 min', dist: '14.2 mi', cost: 30.50, charges: ['ULEZ £12.50', 'CC £18'], color: t.primary },
    { id: 'cheap', label: 'Cheapest', time: '42 min', dist: '19.8 mi', cost: 0, charges: [], color: t.success, rec: true },
    { id: 'bal', label: 'Balanced', time: '34 min', dist: '16.1 mi', cost: 12.50, charges: ['ULEZ £12.50'], color: t.accent }
  ];
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <Header title="Compare routes" onBack={onBack} t={t}/>
      <div style={{padding: 20, flex: 1, overflowY: 'auto'}}>
        <div style={{marginBottom: 16}}>
          <MiniMap t={t} theme={theme} size="md"/>
        </div>
        {routes.map((r, i) => {
          const isSel = sel === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSel(r.id)}
              role="button"
              aria-pressed={isSel}
              tabIndex={0}
              style={{
                background: t.card, borderRadius: 22, padding: 20, marginBottom: 12,
                border: isSel ? `2px solid ${r.color}` : `1px solid ${t.border}`,
                boxShadow: isSel && r.rec ? `0 12px 32px ${t.success}33` : isSel ? `0 12px 32px ${r.color}22` : 'none',
                position: 'relative', cursor: 'pointer',
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`
              }}
            >
              {r.rec && (
                <div style={{
                  position: 'absolute', top: -10, right: 18,
                  padding: '4px 12px', borderRadius: 999,
                  background: t.success, fontSize: 11, fontWeight: 800,
                  color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>
                  Best value
                </div>
              )}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14}}>
                <div>
                  <div style={{fontSize: 11, fontWeight: 800, color: r.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4}}>
                    {r.label}
                  </div>
                  <div style={{display: 'flex', gap: 14}}>
                    <span style={{fontSize: 14, color: t.textSec, display: 'flex', alignItems: 'center', gap: 4}}>
                      <Icon n="clock" s={13} c={t.textTer}/>{r.time}
                    </span>
                    <span style={{fontSize: 14, color: t.textTer}}>{r.dist}</span>
                  </div>
                </div>
                <div style={{fontSize: 30, fontWeight: 800, color: r.cost === 0 ? t.success : t.textPri, letterSpacing: '-0.02em'}}>
                  {r.cost === 0 ? '£0' : `£${r.cost.toFixed(2)}`}
                </div>
              </div>
              {r.charges.length > 0 ? (
                <div style={{display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: isSel ? 14 : 0}}>
                  {r.charges.map(c => (
                    <span key={c} style={{padding: '4px 10px', borderRadius: 999, background: t.cardHi, fontSize: 12, fontWeight: 600, color: t.textSec}}>
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{fontSize: 13, color: t.success, fontWeight: 700, marginBottom: isSel ? 14 : 0, display: 'flex', alignItems: 'center', gap: 6}}>
                  <Icon n="check" s={14} c={t.success}/> No charges on this route
                </div>
              )}
              {isSel && (
                <Btn t={t} v={r.rec ? 'success' : 'primary'} onClick={onStart} size="sm">
                  Start navigation
                </Btn>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Driving = ({ t, theme, onBack }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setPhase(1), 1600));
    timers.push(setTimeout(() => setPhase(2), 4200));
    return () => timers.forEach(clearTimeout);
  }, []);
  const reroute = () => { setPhase(3); setTimeout(() => setPhase(0), 3500); };

  return (
    <div style={{flex: 1, position: 'relative', overflow: 'hidden', background: t.mapBg}}>
      <div style={{position: 'absolute', inset: 0}}>
        <svg width="100%" height="100%" viewBox="0 0 400 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="drivingGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={t.mapGrid} strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="mainRoute" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#3BA9FF"/>
              <stop offset="100%" stopColor="#22D3EE"/>
            </linearGradient>
            <filter id="routeBlur">
              <feGaussianBlur stdDeviation="4"/>
            </filter>
          </defs>
          <rect width="400" height="900" fill="url(#drivingGrid)"/>
          <g stroke={t.mapRoad} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5">
            <path d="M 0 200 L 400 220"/>
            <path d="M 0 450 L 400 460"/>
            <path d="M 0 700 L 400 710"/>
            <path d="M 100 0 L 110 900"/>
            <path d="M 300 0 L 290 900"/>
          </g>
          {/* Main route glow */}
          <path
            d="M 200 900 Q 180 700 220 500 Q 260 300 280 100"
            stroke="url(#mainRoute)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
            filter="url(#routeBlur)"
          />
          <path
            d="M 200 900 Q 180 700 220 500 Q 260 300 280 100"
            stroke="url(#mainRoute)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity={phase === 2 ? 0.4 : 1}
          />
          {/* Danger zone */}
          {phase >= 1 && (
            <g>
              <circle cx="280" cy="100" r="60" fill="#EF4444" opacity="0.15"/>
              <circle cx="280" cy="100" r="16" fill="#EF4444" opacity="0.5">
                <animate attributeName="r" values="16;24;16" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="280" cy="100" r="10" fill="#EF4444"/>
            </g>
          )}
        </svg>
      </div>

      {/* Top controls */}
      <div style={{position: 'relative', zIndex: 2, padding: 16, display: 'flex', justifyContent: 'space-between'}}>
        <button
          onClick={onBack}
          aria-label="Exit driving mode"
          style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'rgba(10,15,28,0.7)', backdropFilter: 'blur(12px)',
            border: `1px solid ${t.borderLi}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Icon n="close" s={20} c="#FFFFFF"/>
        </button>
        <div style={{
          padding: '8px 16px', borderRadius: 999,
          background: `${t.success}33`, backdropFilter: 'blur(12px)',
          border: `1px solid ${t.success}44`,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: t.success, animation: 'pulse 2s infinite'}}/>
          <span style={{fontSize: 12, fontWeight: 800, color: t.success, letterSpacing: '0.1em'}}>LIVE</span>
        </div>
      </div>

      {/* Speed dial */}
      <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', marginTop: 12}}>
        <div style={{
          width: 98, height: 98, borderRadius: '50%',
          background: 'rgba(10,15,28,0.7)', backdropFilter: 'blur(12px)',
          border: `2px solid ${t.borderLi}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{fontSize: 36, fontWeight: 800, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.02em'}}>52</span>
          <span style={{fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700}}>mph</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, padding: '0 16px 28px'}}>
        {phase >= 1 && phase < 3 && (
          <div style={{
            background: 'rgba(10,15,28,0.94)', backdropFilter: 'blur(24px)',
            borderRadius: 24, padding: 22, marginBottom: 12,
            border: `1px solid ${phase === 1 ? t.primary : t.accent}44`,
            boxShadow: `0 0 0 1px ${phase === 1 ? t.primary : t.accent}22, 0 20px 48px ${phase === 1 ? t.primary : t.accent}33`,
            animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)'
          }}
          role="alert">
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18}}>
              <Badge icon="alert" color={phase === 1 ? t.primary : t.accent} size={52}/>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 11, fontWeight: 800, color: phase === 1 ? t.primary : t.accent, textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                  {phase === 1 ? 'Zone approaching' : 'Charge zone imminent'}
                </div>
                <div style={{fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 2, letterSpacing: '-0.02em'}}>
                  ULEZ ahead
                </div>
                <div style={{fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4}}>
                  {phase === 1 ? '2.4 km' : '400 m'} · Adds 2 min if avoided
                </div>
              </div>
              <div style={{fontSize: 32, fontWeight: 800, color: phase === 1 ? t.primary : t.accent, letterSpacing: '-0.02em'}}>
                £12.50
              </div>
            </div>
            <div style={{display: 'flex', gap: 10}}>
              <button
                onClick={reroute}
                style={{
                  flex: 1, height: 54, borderRadius: 16,
                  background: t.accent, color: '#0A0F1C',
                  fontSize: 16, fontWeight: 800, border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 8px 24px ${t.accent}55`,
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em'
                }}
              >
                Reroute
              </button>
              <button
                onClick={() => setPhase(0)}
                style={{
                  flex: 1, height: 54, borderRadius: 16,
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 16, fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                Accept charge
              </button>
            </div>
          </div>
        )}
        {phase === 3 && (
          <div style={{
            background: `${t.success}22`, backdropFilter: 'blur(12px)',
            borderRadius: 24, padding: '16px 20px', marginBottom: 12,
            border: `1px solid ${t.success}55`,
            display: 'flex', alignItems: 'center', gap: 14,
            animation: 'slideUp 0.4s ease'
          }}
          role="status">
            <Badge icon="check" color={t.success} size={44}/>
            <div>
              <div style={{fontSize: 11, fontWeight: 800, color: t.success, textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                Smart move
              </div>
              <div style={{fontSize: 17, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em'}}>
                You just avoided £12.50
              </div>
            </div>
          </div>
        )}
        <div style={{
          background: 'rgba(10,15,28,0.7)', backdropFilter: 'blur(12px)',
          borderRadius: 20, padding: '16px 20px',
          border: `1px solid ${t.borderLi}`,
          display: 'flex', justifyContent: 'space-around'
        }}>
          {[
            ['12 min', 'ETA', '#FFFFFF'],
            ['3.4 mi', 'Distance', '#FFFFFF'],
            [phase === 3 ? '£0.00' : '£12.50', 'Cost', phase === 3 ? t.success : '#FFFFFF']
          ].map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{width: 1, height: 32, background: 'rgba(255,255,255,0.15)'}}/>}
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 20, fontWeight: 800, color: s[2], letterSpacing: '-0.02em'}}>{s[0]}</div>
                <div style={{fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2}}>
                  {s[1]}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const Zones = ({ t, theme, onBack, onSelect }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Zones near you" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      {ZONES.map((z, i) => (
        <div
          key={z.id}
          onClick={() => onSelect(z)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 0',
            borderBottom: i < ZONES.length - 1 ? `1px solid ${t.border}` : 'none',
            cursor: 'pointer',
            animation: `fadeUp 0.3s ease ${i * 0.04}s both`
          }}
        >
          <Badge icon="shield" color={z.priority === 'critical' ? t.danger : t.primary} size={44}/>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontSize: 15, fontWeight: 700, color: t.textPri}}>{z.n}</div>
            <div style={{fontSize: 12, color: t.textTer, marginTop: 2}}>
              {z.region} · {z.period}
            </div>
          </div>
          <div style={{fontSize: 15, fontWeight: 800, color: t.textPri}}>{z.price}</div>
          <Icon n="right" s={16} c={t.textTer}/>
        </div>
      ))}
    </div>
  </div>
);

const ZoneDetail = ({ t, theme, zone, onBack }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title={zone.n} onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      <Card
        t={t}
        style={{
          marginBottom: 14,
          boxShadow: zone.priority === 'critical' ? `0 12px 32px ${t.danger}22` : `0 12px 32px ${t.primary}22`
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <span style={{
            padding: '4px 12px', borderRadius: 999,
            fontSize: 11, fontWeight: 800,
            background: `${zone.priority === 'critical' ? t.danger : t.primary}22`,
            color: zone.priority === 'critical' ? t.danger : t.primary,
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            {zone.priority}
          </span>
          <span style={{fontSize: 36, fontWeight: 800, color: t.textPri, letterSpacing: '-0.025em'}}>
            {zone.price}
          </span>
        </div>
        {[
          ['Region', zone.region],
          ['Hours', zone.period],
          ['Penalty', '£180 (reduced to £90 in 14 days)']
        ].map(([l, v], i) => (
          <div
            key={l}
            style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < 2 ? `1px solid ${t.border}` : 'none'
            }}
          >
            <span style={{fontSize: 13, color: t.textTer}}>{l}</span>
            <span style={{fontSize: 13, fontWeight: 700, color: t.textPri}}>{v}</span>
          </div>
        ))}
      </Card>
      <Card t={t} style={{background: `${t.success}12`, border: `1px solid ${t.success}33`}}>
        <div style={{fontSize: 11, fontWeight: 800, color: t.success, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8}}>
          How to avoid
        </div>
        <p style={{fontSize: 15, color: t.textSec, lineHeight: 1.55, margin: 0}}>
          TollPilot's cheapest route option always routes around this zone when possible.
        </p>
      </Card>
    </div>
  </div>
);

const Savings = ({ t, theme, onBack }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const dur = 1200, start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setCount(Math.floor(totalSaved * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <Header title="Savings" onBack={onBack} t={t}/>
      <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
        <Card
          t={t}
          style={{
            background: `linear-gradient(135deg, ${t.success}33, ${t.success}08)`,
            border: `1px solid ${t.success}55`,
            boxShadow: `0 12px 32px ${t.success}22`,
            textAlign: 'center', padding: '36px 20px', marginBottom: 20
          }}
        >
          <div style={{fontSize: 11, fontWeight: 800, color: t.success, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12}}>
            Total saved
          </div>
          <div style={{fontSize: 64, fontWeight: 800, color: t.textPri, letterSpacing: '-0.04em', lineHeight: 1}}>
            £{count}
          </div>
          <div style={{fontSize: 14, color: t.textSec, marginTop: 14}}>
            22 zones avoided · 35 min saved
          </div>
          <div style={{
            display: 'inline-block', marginTop: 16,
            padding: '6px 14px', borderRadius: 999,
            background: `${t.success}33`,
            fontSize: 13, fontWeight: 800, color: t.success
          }}>
            ↑ 18% vs last month
          </div>
        </Card>

        <Card t={t} style={{marginBottom: 20}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <span style={{fontSize: 13, color: t.textSec, fontWeight: 600}}>Monthly target</span>
            <span style={{fontSize: 13, fontWeight: 800, color: t.textPri}}>£{totalSaved} / £400</span>
          </div>
          <div style={{height: 10, borderRadius: 999, background: t.cardHi, overflow: 'hidden'}}>
            <div style={{
              width: `${(totalSaved / 400) * 100}%`, height: '100%',
              background: `linear-gradient(90deg, ${t.success}, ${t.primary})`,
              borderRadius: 999
            }}/>
          </div>
          <div style={{fontSize: 12, color: t.textTer, marginTop: 10}}>
            £{400 - totalSaved} away from your April target
          </div>
        </Card>

        <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12}}>
          Monthly breakdown
        </div>
        <Card t={t} style={{marginBottom: 20}}>
          {MONTHS.map((m, i) => {
            const max = Math.max(...MONTHS.map(x => x.a));
            return (
              <div
                key={m.m}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderBottom: i < MONTHS.length - 1 ? `1px solid ${t.border}` : 'none'
                }}
              >
                <span style={{width: 36, fontSize: 13, color: t.textTer, fontWeight: 600}}>{m.m}</span>
                <div style={{flex: 1, height: 8, borderRadius: 999, background: t.cardHi}}>
                  <div style={{
                    width: `${(m.a / max) * 100}%`, height: '100%',
                    background: t.success, borderRadius: 999
                  }}/>
                </div>
                <span style={{width: 48, textAlign: 'right', fontSize: 14, fontWeight: 800, color: t.textPri}}>
                  £{m.a}
                </span>
              </div>
            );
          })}
        </Card>

        <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12}}>
          By category
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
          {[
            { icon: 'shield', label: 'ULEZ', amount: 142, color: t.primary },
            { icon: 'shield', label: 'Tolls', amount: 52, color: t.accent },
            { icon: 'shield', label: 'Airports', amount: 48, color: t.primary },
            { icon: 'shield', label: 'Congestion', amount: 72, color: t.danger }
          ].map(c => (
            <Card key={c.label} t={t} pad={18}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
                <Badge icon={c.icon} color={c.color} size={32}/>
                <span style={{fontSize: 14, fontWeight: 700, color: t.textSec}}>{c.label}</span>
              </div>
              <div style={{fontSize: 26, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em'}}>
                £{c.amount}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Trips = ({ t, theme, onBack, onSelect }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Trip history" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      <div style={{fontSize: 13, color: t.textSec, marginBottom: 16, fontWeight: 600}}>
        18 trips · £{totalSaved} saved
      </div>
      {TRIPS.map((tr, i) => (
        <Card
          key={tr.id}
          t={t}
          onClick={() => onSelect(tr)}
          style={{marginBottom: 12, animation: `fadeUp 0.3s ease ${i * 0.07}s both`}}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <div style={{minWidth: 0, flex: 1}}>
              <div style={{fontSize: 16, fontWeight: 700, color: t.textPri}}>
                {tr.from} → {tr.to}
              </div>
              <div style={{fontSize: 12, color: t.textTer, marginTop: 2}}>
                {tr.date} · {tr.dist}
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: 24, fontWeight: 800, color: t.success, letterSpacing: '-0.02em'}}>
                £{tr.saved.toFixed(2)}
              </div>
              <div style={{fontSize: 10, color: t.textTer}}>saved</div>
            </div>
          </div>
          <div style={{display: 'flex', gap: 6}}>
            {tr.avoided.map(a => (
              <span
                key={a}
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: `${t.success}22`,
                  fontSize: 12, fontWeight: 700, color: t.success
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const TripDetail = ({ t, theme, trip, onBack }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Trip detail" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      <Card t={t} style={{marginBottom: 14}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
          <div>
            <div style={{fontSize: 20, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em'}}>
              {trip.from} → {trip.to}
            </div>
            <div style={{fontSize: 13, color: t.textTer, marginTop: 4}}>{trip.date}</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 30, fontWeight: 800, color: t.success, letterSpacing: '-0.025em'}}>
              £{trip.saved.toFixed(2)}
            </div>
            <div style={{fontSize: 11, color: t.textTer}}>saved</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 8}}>
          {[['Distance', trip.dist], ['Duration', trip.dur], ['Avg speed', '18 mph']].map(([l, v]) => (
            <div key={l} style={{flex: 1, padding: '12px 0', borderRadius: 12, background: t.cardHi, textAlign: 'center'}}>
              <div style={{fontSize: 10, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 3}}>
                {l}
              </div>
              <div style={{fontSize: 15, fontWeight: 800, color: t.textPri}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12}}>
        Charges avoided
      </div>
      <Card t={t} pad={4}>
        {trip.avoided.map((a, i) => (
          <div
            key={a}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px',
              borderBottom: i < trip.avoided.length - 1 ? `1px solid ${t.border}` : 'none'
            }}
          >
            <Badge icon="check" color={t.success} size={32}/>
            <div>
              <div style={{fontSize: 14, fontWeight: 700, color: t.textPri}}>{a}</div>
              <div style={{fontSize: 12, color: t.success, fontWeight: 600}}>Avoided</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

const Vehicle = ({ t, theme, reg, onBack, nav }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Your vehicle" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      <div style={{textAlign: 'center', padding: '20px 0 28px'}}>
        <Plate value={reg || 'AB12 CDE'} size="lg" validated={false} showHint={false} theme={theme}/>
        <div style={{fontSize: 15, color: t.textSec, marginTop: 20, fontWeight: 600}}>
          VW Golf · 2019 · Petrol · Euro 6
        </div>
      </div>
      <Card t={t} pad={4} style={{marginBottom: 14}}>
        {[
          { l: 'MOT', d: 'Expires 19 Apr 2026', c: t.accent, b: '14 days' },
          { l: 'Road tax', d: 'Valid until Oct 2026', c: t.success, b: '6 months' },
          { l: 'ULEZ', d: 'Compliant (Euro 6)', c: t.success, b: 'Exempt' },
          { l: 'Insurance', d: 'Active', c: t.success, b: 'Valid' }
        ].map((s, i) => (
          <div
            key={s.l}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px',
              borderBottom: i < 3 ? `1px solid ${t.border}` : 'none'
            }}
          >
            <div>
              <div style={{fontSize: 15, fontWeight: 700, color: t.textPri}}>{s.l}</div>
              <div style={{fontSize: 12, color: t.textTer, marginTop: 2}}>{s.d}</div>
            </div>
            <span style={{padding: '4px 10px', borderRadius: 999, background: `${s.c}22`, fontSize: 12, fontWeight: 800, color: s.c}}>
              {s.b}
            </span>
          </div>
        ))}
      </Card>
      <Btn t={t} v="accent" icon="clock" onClick={() => nav('motBooking')}>
        Book MOT — 14 days left
      </Btn>
    </div>
  </div>
);

const MOTBooking = ({ t, theme, onBack }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Book MOT" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      <Card
        t={t}
        style={{
          background: `${t.accent}18`, border: `1px solid ${t.accent}33`,
          marginBottom: 20, boxShadow: `0 12px 32px ${t.accent}18`
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
          <Icon n="alert" s={20} c={t.accent}/>
          <div style={{fontSize: 16, fontWeight: 700, color: t.textPri}}>MOT expires 19 April 2026</div>
        </div>
        <p style={{fontSize: 13, color: t.textSec, lineHeight: 1.5, margin: 0}}>
          Book from 1 month before expiry. Your new MOT runs from the current expiry date.
        </p>
      </Card>
      <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12}}>
        Nearby centres
      </div>
      {[
        ['Halfords Stratford', '0.8 mi · £35 · ★ 4.6', 'Tomorrow'],
        ['Kwik Fit Bow', '1.2 mi · £30 · ★ 4.3', 'Today'],
        ['ATS Hackney', '1.5 mi · £40 · ★ 4.5', 'Fri']
      ].map(([n, d, a], i) => (
        <Card key={n} t={t} style={{marginBottom: 10, animation: `fadeUp 0.3s ease ${i * 0.08}s both`}}>
          <div style={{fontSize: 15, fontWeight: 700, color: t.textPri, marginBottom: 4}}>{n}</div>
          <div style={{fontSize: 12, color: t.textTer, marginBottom: 12}}>{d}</div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{padding: '4px 10px', borderRadius: 999, background: `${t.success}22`, fontSize: 12, fontWeight: 700, color: t.success}}>
              {a}
            </span>
            <Btn t={t} v="primary" full={false} size="sm">Book</Btn>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const Settings = ({ t, theme, onBack, nav, toggleTheme }) => {
  const secs = [
    { label: 'Account', items: [['Profile', 'Justin', 'profile'], ['Vehicles', '1 vehicle', 'vehicle']] },
    { label: 'Appearance', items: [['Theme', theme === 'dark' ? 'Dark' : 'Light', '_theme']] },
    { label: 'Support', items: [['Help centre', '', null], ['About', 'v1.0', null]] }
  ];
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <Header title="Settings" onBack={onBack} t={t}/>
      <div style={{flex: 1, overflowY: 'auto', padding: '16px 20px 32px'}}>
        <div style={{display: 'flex', justifyContent: 'center', padding: '16px 0 24px'}}>
          <Logo s={28} theme={theme}/>
        </div>
        {secs.map(s => (
          <div key={s.label} style={{marginBottom: 24}}>
            <div style={{fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, padding: '0 4px'}}>
              {s.label}
            </div>
            <Card t={t} pad={4}>
              {s.items.map((it, i) => (
                <button
                  key={it[0]}
                  onClick={() => it[2] === '_theme' ? toggleTheme() : it[2] && nav(it[2])}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', width: '100%',
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    borderBottom: i < s.items.length - 1 ? `1px solid ${t.border}` : 'none',
                    fontFamily: 'inherit'
                  }}
                >
                  <span style={{fontSize: 15, fontWeight: 600, color: t.textPri}}>{it[0]}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                    {it[1] && <span style={{fontSize: 13, color: t.textTer}}>{it[1]}</span>}
                    <Icon n="right" s={16} c={t.textTer}/>
                  </div>
                </button>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const Notifs = ({ t, theme, onBack }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Notifications" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: '4px 20px 32px'}}>
      {[
        { type: 'savings', title: 'ULEZ avoided', body: 'Saved £12.50 on morning commute', time: '2h ago', unread: true, color: t.success, icon: 'check' },
        { type: 'mot', title: 'MOT due in 14 days', body: 'Expires 19 Apr. Book now?', time: '5h ago', unread: true, color: t.accent, icon: 'alert' },
        { type: 'report', title: 'Weekly report', body: '£31.50 saved across 4 trips', time: '1d ago', unread: false, color: t.primary, icon: 'up' }
      ].map((n, i) => (
        <div
          key={i}
          style={{
            display: 'flex', gap: 14, padding: '16px 4px',
            borderBottom: `1px solid ${t.border}`,
            opacity: n.unread ? 1 : 0.6,
            animation: `fadeUp 0.3s ease ${i * 0.05}s both`
          }}
        >
          <Badge icon={n.icon} color={n.color} size={42}/>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontSize: 15, fontWeight: 700, color: t.textPri, marginBottom: 2}}>{n.title}</div>
            <div style={{fontSize: 13, color: t.textSec, lineHeight: 1.45}}>{n.body}</div>
            <div style={{fontSize: 11, color: t.textTer, marginTop: 6, fontWeight: 600}}>{n.time}</div>
          </div>
          {n.unread && <div style={{width: 8, height: 8, borderRadius: '50%', background: t.primary, marginTop: 6}}/>}
        </div>
      ))}
    </div>
  </div>
);

const Profile = ({ t, theme, reg, onBack }) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <Header title="Profile" onBack={onBack} t={t}/>
    <div style={{flex: 1, overflowY: 'auto', padding: 20}}>
      <div style={{textAlign: 'center', padding: '16px 0 24px'}}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `${t.primary}33`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16
        }}>
          <Icon n="user" s={40} c={t.primary}/>
        </div>
        <div style={{fontSize: 24, fontWeight: 800, color: t.textPri, letterSpacing: '-0.02em'}}>Justin</div>
        <div style={{fontSize: 13, color: t.textTer, marginTop: 4, fontWeight: 600}}>Free plan</div>
      </div>
      <div style={{marginBottom: 20}}>
        <label style={{fontSize: 12, color: t.textTer, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'block', marginBottom: 10}}>
          Default vehicle
        </label>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Plate value={reg || 'AB12 CDE'} size="md" showHint={false} theme={theme}/>
        </div>
      </div>
      <Btn t={t} v="primary">Save changes</Btn>
    </div>
  </div>
);

// ─── BOTTOM NAV ──────────────────────────────────────────────────
const BottomNav = ({ current, onNav, t }) => (
  <nav
    aria-label="Primary navigation"
    style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 0 24px',
      background: `${t.bg}F5`, backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${t.border}`, zIndex: 10
    }}
  >
    {[
      { id: 'dashboard', i: 'shield', l: 'Home' },
      { id: 'routes', i: 'route', l: 'Routes' },
      { id: 'trips', i: 'history', l: 'Trips' },
      { id: 'savings', i: 'up', l: 'Savings' },
      { id: 'settings', i: 'gear', l: 'More' }
    ].map(tab => {
      const active = current === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onNav(tab.id)}
          aria-label={tab.l}
          aria-current={active ? 'page' : undefined}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'none', border: 'none',
            padding: '6px 12px', cursor: 'pointer',
            fontFamily: 'inherit', minWidth: 56
          }}
        >
          <Icon n={tab.i} s={22} c={active ? t.primary : t.textTer}/>
          <span style={{fontSize: 10, fontWeight: 700, color: active ? t.primary : t.textTer}}>
            {tab.l}
          </span>
        </button>
      );
    })}
  </nav>
);

// ═══════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [screen, setScreen] = useState('splash');
  const [tab, setTab] = useState('dashboard');
  const [reg, setReg] = useState('');
  const [ctx, setCtx] = useState(null);
  const t = T[theme];
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const nav = (s, c) => { if (c) setCtx(c); setScreen(s); };
  const navTab = (id) => {
    setTab(id);
    const map = { dashboard: 'dashboard', routes: 'routes', trips: 'trips', savings: 'savings', settings: 'settings' };
    setScreen(map[id]);
  };
  const showTabs = ['dashboard', 'routes', 'trips', 'savings', 'settings'].includes(screen);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeScale { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        @keyframes breath { 0%,100% { transform:scale(1) } 50% { transform:scale(1.05) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes loadBar { from { width:0 } to { width:56px } }
        * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
        button:focus-visible, [role="switch"]:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid ${t.primary};
          outline-offset: 2px;
        }
        input:focus-visible {
          outline: 2px solid ${t.primary};
          outline-offset: 2px;
        }
      `}</style>
      <div
        style={{
          width: '100%', maxWidth: 430, height: '100vh', margin: '0 auto',
          background: t.bg, color: t.textPri,
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          transition: 'background 0.3s ease, color 0.3s ease'
        }}
      >
        {screen === 'splash' && <Splash t={t} theme={theme} onNext={() => setScreen('onboarding')}/>}
        {screen === 'onboarding' && <Onboarding t={t} theme={theme} onComplete={(r) => { setReg(r); setScreen('vehicleLookup'); }}/>}
        {screen === 'vehicleLookup' && <VehicleLookup t={t} theme={theme} reg={reg} onNext={() => setScreen('locPerm')}/>}
        {screen === 'locPerm' && <Permission t={t} variant="location" onNext={() => setScreen('notifPerm')}/>}
        {screen === 'notifPerm' && <Permission t={t} variant="notif" onNext={() => setScreen('dashboard')}/>}
        {screen === 'dashboard' && <Dashboard t={t} theme={theme} reg={reg} nav={nav} toggleTheme={toggleTheme}/>}
        {screen === 'routes' && <Routes t={t} theme={theme} nav={nav}/>}
        {screen === 'routeInput' && <RouteInput t={t} theme={theme} onBack={() => { setScreen('routes'); setTab('routes'); }} onCompare={() => setScreen('routeCompare')}/>}
        {screen === 'routeCompare' && <RouteCompare t={t} theme={theme} onBack={() => setScreen('routeInput')} onStart={() => setScreen('driving')}/>}
        {screen === 'driving' && <Driving t={t} theme={theme} onBack={() => setScreen('dashboard')}/>}
        {screen === 'zones' && <Zones t={t} theme={theme} onBack={() => setScreen('dashboard')} onSelect={(z) => nav('zoneDetail', z)}/>}
        {screen === 'zoneDetail' && <ZoneDetail t={t} theme={theme} zone={ctx} onBack={() => setScreen('zones')}/>}
        {screen === 'trips' && <Trips t={t} theme={theme} onBack={() => { setScreen('dashboard'); setTab('dashboard'); }} onSelect={(tr) => nav('trip', tr)}/>}
        {screen === 'trip' && <TripDetail t={t} theme={theme} trip={ctx} onBack={() => setScreen('trips')}/>}
        {screen === 'savings' && <Savings t={t} theme={theme} onBack={() => { setScreen('dashboard'); setTab('dashboard'); }}/>}
        {screen === 'vehicle' && <Vehicle t={t} theme={theme} reg={reg} onBack={() => setScreen('dashboard')} nav={nav}/>}
        {screen === 'motBooking' && <MOTBooking t={t} theme={theme} onBack={() => setScreen('vehicle')}/>}
        {screen === 'notifs' && <Notifs t={t} theme={theme} onBack={() => setScreen('dashboard')}/>}
        {screen === 'settings' && <Settings t={t} theme={theme} onBack={() => { setScreen('dashboard'); setTab('dashboard'); }} nav={nav} toggleTheme={toggleTheme}/>}
        {screen === 'profile' && <Profile t={t} theme={theme} reg={reg} onBack={() => setScreen('settings')}/>}
        {showTabs && <BottomNav current={tab} onNav={navTab} t={t}/>}
      </div>
    </>
  );
}
