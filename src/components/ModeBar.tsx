import React from 'react';
import { ChevronLeft, Gem, Plus, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface ModeBarProps {
  title: string;
  onBack: () => void;
  gems: number;
  onOpenGemShop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

/**
 * Barra superior estilo Gacha Life para las pantallas de modo
 * (Estudio, Gacha, Colección, Misiones).
 * El menú principal (HomeScreen) no la usa: integra sus propios controles.
 */
export const ModeBar: React.FC<ModeBarProps> = ({
  title,
  onBack,
  gems,
  onOpenGemShop,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header
      className="shrink-0 flex items-center justify-between gap-2 px-2 sm:px-3 py-2 gl-strip"
      style={{ borderBottom: '4px solid #1E4580' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="gl-btn gl-btn-yellow px-3 py-1.5 text-xs sm:text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Menú
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-[#1E4580]"
            style={{ backgroundColor: '#FFE06B' }}
          >
            <Sparkles className="w-4 h-4 text-[#1E4580]" />
          </div>
          <h1 className="gl-title font-display font-bold text-base sm:text-xl truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onOpenGemShop} className="gl-pill hover:brightness-105 active:translate-y-[2px] transition-all">
          <Gem className="w-4 h-4" style={{ color: '#B79AE0' }} />
          <span className="text-xs sm:text-sm">{gems.toLocaleString()}</span>
          <span
            className="w-4 h-4 rounded-full text-white flex items-center justify-center"
            style={{ backgroundColor: '#FF87B2' }}
          >
            <Plus className="w-2.5 h-2.5" />
          </span>
        </button>
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          className="w-9 h-9 rounded-full border-[3px] border-[#2B5FA8] bg-white flex items-center justify-center shadow-[0_3px_0_#2B5FA8] active:translate-y-[3px] active:shadow-none transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#1E4580]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#1E4580]" />
          )}
        </button>
      </div>
    </header>
  );
};

export default ModeBar;
