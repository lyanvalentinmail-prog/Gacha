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
 * Barra superior compartida por las pantallas de modo
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
    <header className="shrink-0 flex items-center justify-between gap-2 px-2 sm:px-3 py-2 gl-strip">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="gl-btn gl-btn-white !rounded-full px-3.5 py-1.5 text-xs sm:text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Menú
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-[1.5px] border-line-rose"
            style={{ background: 'linear-gradient(180deg,#FFD9E5,#FFB9CD)' }}
          >
            <Sparkles className="w-4 h-4 text-rosa-600" />
          </div>
          <h1 className="gl-title font-display text-base sm:text-xl truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenGemShop}
          className="gl-pill hover:brightness-105 active:scale-95 transition-all"
        >
          <Gem className="w-4 h-4 text-lav-500" />
          <span className="text-xs sm:text-sm">{gems.toLocaleString()}</span>
          <span className="w-4 h-4 rounded-full text-white flex items-center justify-center bg-rosa-500">
            <Plus className="w-2.5 h-2.5" />
          </span>
        </button>
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          className="icon-btn w-9 h-9"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};

export default ModeBar;
