import React from 'react';

/**
 * Máquina de cápsulas — globo de cristal lleno de bolitas pastel,
 * cuerpo rosa suave con palanca lavanda y ranura de salida.
 * (Solo cambia la paleta: misma geometría y animaciones que la original.)
 */
export const GachaMachine: React.FC<{ className?: string; spinning?: boolean }> = ({
  className = '',
  spinning = false,
}) => {
  const capsules: { cx: number; cy: number; c1: string; c2: string; r: number }[] = [
    { cx: 78, cy: 96, c1: '#FF9DB8', c2: '#FFD9E5', r: 15 },
    { cx: 110, cy: 88, c1: '#F5B95A', c2: '#FFE9BD', r: 14 },
    { cx: 142, cy: 98, c1: '#B5A6E2', c2: '#E2DBF5', r: 15 },
    { cx: 92, cy: 120, c1: '#CFC4EE', c2: '#F0EBFB', r: 14 },
    { cx: 126, cy: 118, c1: '#8ACD9C', c2: '#CDEEDD', r: 15 },
    { cx: 62, cy: 122, c1: '#F5B95A', c2: '#FFE9BD', r: 13 },
    { cx: 156, cy: 124, c1: '#FF9DB8', c2: '#FFD9E5', r: 13 },
    { cx: 108, cy: 140, c1: '#9DD4F0', c2: '#D9F0FB', r: 14 },
    { cx: 76, cy: 144, c1: '#FF9DB8', c2: '#FFD9E5', r: 13 },
    { cx: 140, cy: 142, c1: '#B5A6E2', c2: '#E2DBF5', r: 13 },
  ];

  return (
    <svg
      viewBox="0 0 220 320"
      className={`${className} ${spinning ? 'animate-float' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sombra suave */}
      <ellipse cx="110" cy="306" rx="88" ry="10" fill="#C9A2C4" opacity="0.25" />

      {/* Globo de cristal */}
      <circle cx="110" cy="112" r="88" fill="#F7F5FD" stroke="#E2DBF5" strokeWidth="5" />
      <circle cx="110" cy="112" r="80" fill="#FBFAFE" />

      {/* Cápsulas */}
      <g className={spinning ? 'animate-pulse-glow' : ''}>
        {capsules.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.c1} stroke="#F2DCE7" strokeWidth="3" />
            <path
              d={`M ${c.cx - c.r} ${c.cy} A ${c.r} ${c.r} 0 0 1 ${c.cx + c.r} ${c.cy} Z`}
              fill={c.c2}
            />
            <circle cx={c.cx - c.r * 0.3} cy={c.cy - c.r * 0.45} r={c.r * 0.22} fill="#fff" opacity="0.85" />
          </g>
        ))}
      </g>

      {/* Brillo del cristal */}
      <path
        d="M 62 60 Q 78 42 104 40 Q 82 52 72 74 Z"
        fill="#fff"
        opacity="0.75"
      />
      <circle cx="110" cy="112" r="88" fill="none" stroke="#E2DBF5" strokeWidth="5" />

      {/* Cuerpo de la máquina */}
      <rect x="52" y="188" width="116" height="96" rx="18" fill="#FFB9CD" stroke="#F2A8C0" strokeWidth="5" />
      <rect x="62" y="198" width="96" height="34" rx="10" fill="#FFD9E5" stroke="#F2A8C0" strokeWidth="3.5" />

      {/* Moneda / logo */}
      <circle cx="110" cy="215" r="11" fill="#FFE9BD" stroke="#F5B95A" strokeWidth="3.5" />
      <text x="110" y="220" textAnchor="middle" fontSize="12" fontWeight="900" fill="#A97B2A" fontFamily="Fredoka, sans-serif">
        G
      </text>

      {/* Ranura de salida */}
      <rect x="74" y="242" width="72" height="30" rx="10" fill="#C9A2C4" />
      <rect x="80" y="248" width="60" height="18" rx="8" fill="#DDB9D8" />

      {/* Palanca */}
      <rect x="160" y="212" width="30" height="12" rx="6" fill="#B5A6E2" stroke="#9D8BD0" strokeWidth="3.5" />
      <circle cx="196" cy="218" r="14" fill="#FFD9E5" stroke="#FF9DB8" strokeWidth="4.5" />
      <circle cx="191" cy="213" r="4" fill="#fff" opacity="0.8" />

      {/* Patitas */}
      <rect x="62" y="282" width="26" height="16" rx="6" fill="#FF9DB8" stroke="#F2A8C0" strokeWidth="3.5" />
      <rect x="132" y="282" width="26" height="16" rx="6" fill="#FF9DB8" stroke="#F2A8C0" strokeWidth="3.5" />

      {/* Estrellitas decorativas */}
      <g fill="#FFE9BD" stroke="#F5B95A" strokeWidth="2">
        <path d="M 30 70 l 4 9 l 10 1 l -7 7 l 2 10 l -9 -5 l -9 5 l 2 -10 l -7 -7 l 10 -1 z" />
        <path d="M 186 84 l 3 7 l 8 1 l -6 5 l 2 8 l -7 -4 l -7 4 l 2 -8 l -6 -5 l 8 -1 z" />
      </g>
    </svg>
  );
};

export default GachaMachine;
