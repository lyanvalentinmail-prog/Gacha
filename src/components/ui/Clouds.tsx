import React from 'react';

/**
 * Capa decorativa de nubes blancas a la deriva, estilo Gacha Life.
 * Se usa como fondo del menú principal, la pantalla Gacha y otras escenas.
 */
export const Clouds: React.FC<{ className?: string; dense?: boolean }> = ({ className = '', dense = false }) => {
  const clouds = [
    { top: '6%', w: 170, dur: 48, delay: 0, op: 0.95 },
    { top: '18%', w: 120, dur: 62, delay: -20, op: 0.85 },
    { top: '30%', w: 210, dur: 74, delay: -45, op: 0.9 },
    { top: '10%', w: 100, dur: 55, delay: -32, op: 0.8 },
    ...(dense
      ? [
          { top: '42%', w: 150, dur: 68, delay: -12, op: 0.7 },
          { top: '52%', w: 110, dur: 80, delay: -55, op: 0.6 },
        ]
      : []),
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="gl-cloud"
          style={{
            top: c.top,
            width: c.w,
            height: Math.round(c.w * 0.32),
            opacity: c.op,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            left: 0,
          }}
        />
      ))}
    </div>
  );
};

export default Clouds;
