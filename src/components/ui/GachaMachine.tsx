import React from 'react';

/**
 * Máquina de cápsulas estilo Gacha Life — globo de cristal lleno de
 * bolitas de colores, cuerpo rosa/rojo con palanca y ranura de salida.
 */
export const GachaMachine: React.FC<{ className?: string; spinning?: boolean }> = ({
  className = '',
  spinning = false,
}) => {
  const capsules: { cx: number; cy: number; c1: string; c2: string; r: number }[] = [
    { cx: 78, cy: 96, c1: '#FF87B2', c2: '#FFB1CE', r: 15 },
    { cx: 110, cy: 88, c1: '#FFE06B', c2: '#FFF3B8', r: 14 },
    { cx: 142, cy: 98, c1: '#74C9F0', c2: '#A8DEF8', r: 15 },
    { cx: 92, cy: 120, c1: '#B79AE0', c2: '#D7C6F2', r: 14 },
    { cx: 126, cy: 118, c1: '#95D97C', c2: '#C8EFB8', r: 15 },
    { cx: 62, cy: 122, c1: '#FFE06B', c2: '#FFF3B8', r: 13 },
    { cx: 156, cy: 124, c1: '#FF87B2', c2: '#FFB1CE', r: 13 },
    { cx: 108, cy: 140, c1: '#74C9F0', c2: '#A8DEF8', r: 14 },
    { cx: 76, cy: 144, c1: '#FF87B2', c2: '#FFB1CE', r: 13 },
    { cx: 140, cy: 142, c1: '#B79AE0', c2: '#D7C6F2', r: 13 },
  ];

  return (
    <svg
      viewBox="0 0 220 320"
      className={`${className} ${spinning ? 'animate-float' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sombras suaves */}
      <ellipse cx="110" cy="306" rx="88" ry="10" fill="#1E4580" opacity="0.18" />

      {/* Globo de cristal */}
      <circle cx="110" cy="112" r="88" fill="#EAF6FF" stroke="#2B5FA8" strokeWidth="6" />
      <circle cx="110" cy="112" r="80" fill="#DFF1FF" />

      {/* Cápsulas */}
      <g className={spinning ? 'animate-pulse-glow' : ''}>
        {capsules.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.c1} stroke="#2B5FA8" strokeWidth="3" />
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
      <circle cx="110" cy="112" r="88" fill="none" stroke="#2B5FA8" strokeWidth="6" />

      {/* Cuerpo de la máquina */}
      <rect x="52" y="188" width="116" height="96" rx="18" fill="#FF87B2" stroke="#2B5FA8" strokeWidth="6" />
      <rect x="62" y="198" width="96" height="34" rx="10" fill="#FFB1CE" stroke="#2B5FA8" strokeWidth="4" />

      {/* Moneda / logo */}
      <circle cx="110" cy="215" r="11" fill="#FFE06B" stroke="#2B5FA8" strokeWidth="4" />
      <text x="110" y="220" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1E4580" fontFamily="Fredoka, sans-serif">
        G
      </text>

      {/* Ranura de salida */}
      <rect x="74" y="242" width="72" height="30" rx="10" fill="#1E4580" />
      <rect x="80" y="248" width="60" height="18" rx="8" fill="#2B5FA8" />

      {/* Palanca */}
      <rect x="160" y="212" width="30" height="12" rx="6" fill="#4AA0D0" stroke="#2B5FA8" strokeWidth="4" />
      <circle cx="196" cy="218" r="14" fill="#FFE06B" stroke="#2B5FA8" strokeWidth="5" />
      <circle cx="191" cy="213" r="4" fill="#fff" opacity="0.8" />

      {/* Patitas */}
      <rect x="62" y="282" width="26" height="16" rx="6" fill="#E56593" stroke="#2B5FA8" strokeWidth="4" />
      <rect x="132" y="282" width="26" height="16" rx="6" fill="#E56593" stroke="#2B5FA8" strokeWidth="4" />

      {/* Estrellitas decorativas */}
      <g fill="#FFE06B" stroke="#2B5FA8" strokeWidth="2">
        <path d="M 30 70 l 4 9 l 10 1 l -7 7 l 2 10 l -9 -5 l -9 5 l 2 -10 l -7 -7 l 10 -1 z" />
        <path d="M 186 84 l 3 7 l 8 1 l -6 5 l 2 8 l -7 -4 l -7 4 l 2 -8 l -6 -5 l 8 -1 z" />
      </g>
    </svg>
  );
};

export default GachaMachine;
