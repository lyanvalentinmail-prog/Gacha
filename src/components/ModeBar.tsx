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
 * Barra superior para las pantallas de modo (Estudio, Gacha, Colección, Misiones).
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
      className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 border-b-4 shadow-sm"
      style={{ backgroundColor: '#C9CBF2', borderColor: '#3D3B6E' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-full border-[3px] px-3 py-1.5 font-extrabold text-sm shadow-[0_3px_0_rgba(61,59,110,0.85)] active:translate-y-[3px] active:shadow-none transition-all"
          style={{ borderColor: '#3D3B6E', backgroundColor: '#E6E8FB', color: '#3D3B6E' }}
        >
          <ChevronLeft className="w-4 h-4" /> Menú
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#3D3B6E' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-black text-base sm:text-lg truncate" style={{ color: '#3D3B6E' }}>
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenGemShop}
          className="flex items-center gap-1.5 rounded-full border-[3px] px-3 py-1.5 hover:bg-white/50 transition-all"
          style={{ borderColor: '#3D3B6E' }}
        >
          <Gem className="w-4 h-4" style={{ color: '#7E57C2' }} />
          <span className="font-extrabold text-sm" style={{ color: '#3D3B6E' }}>
            {gems.toLocaleString()}
          </span>
          <span
            className="w-4 h-4 rounded-full text-white flex items-center justify-center"
            style={{ backgroundColor: '#4A4D8E' }}
          >
            <Plus className="w-2.5 h-2.5" />
          </span>
        </button>
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          className="w-9 h-9 rounded-full border-[3px] flex items-center justify-center hover:bg-white/50"
          style={{ borderColor: '#3D3B6E' }}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" style={{ color: '#3D3B6E' }} />
          ) : (
            <Volume2 className="w-4 h-4" style={{ color: '#3D3B6E' }} />
          )}
        </button>
      </div>
    </header>
  );
};

export default ModeBar;
