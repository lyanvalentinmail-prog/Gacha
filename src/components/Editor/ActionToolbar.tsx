import React from 'react';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Dices,
  Save,
  Camera,
  Share2,
  Sparkles,
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface ActionToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRandomize: () => void;
  onSave: () => void;
  onReset: () => void;
  onExportPng: () => void;
  onShareCode: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRandomize,
  onSave,
  onReset,
  onExportPng,
  onShareCode,
}) => {
  return (
    <div className="flex items-center justify-between gap-1.5 p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-pink-200/60 shadow-sm overflow-x-auto">
      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            if (canUndo) {
              playSound('click');
              onUndo();
            }
          }}
          disabled={!canUndo}
          title="Deshacer (Ctrl+Z)"
          className={`p-2 rounded-xl border transition-all ${
            canUndo
              ? 'bg-white hover:bg-pink-50 border-pink-200 text-[#7A6E85] hover:text-[#FF6F91] shadow-xs active:scale-95'
              : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (canRedo) {
              playSound('click');
              onRedo();
            }
          }}
          disabled={!canRedo}
          title="Rehacer (Ctrl+Y)"
          className={`p-2 rounded-xl border transition-all ${
            canRedo
              ? 'bg-white hover:bg-pink-50 border-pink-200 text-[#7A6E85] hover:text-[#FF6F91] shadow-xs active:scale-95'
              : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Randomize button */}
      <button
        onClick={() => {
          playSound('whoosh');
          onRandomize();
        }}
        title="Generar atuendo aleatorio armonioso"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-sm hover:shadow-cute hover:scale-105 transition-all whitespace-nowrap active:scale-95"
      >
        <Dices className="w-4 h-4" />
        <span>Aleatorizar</span>
      </button>

      {/* Reset button */}
      <button
        onClick={() => {
          if (confirm('¿Restablecer este personaje al diseño predeterminado?')) {
            playSound('pop');
            onReset();
          }
        }}
        title="Restablecer diseño"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#9B72CF] font-bold text-xs border border-pink-200 transition-all hover:scale-105 whitespace-nowrap"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Restablecer</span>
      </button>

      {/* Export PNG */}
      <button
        onClick={() => {
          playSound('camera');
          onExportPng();
        }}
        title="Exportar imagen PNG transparente"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#48CAE4] to-[#0096C7] text-white font-bold text-xs shadow-sm hover:shadow-cute hover:scale-105 transition-all whitespace-nowrap active:scale-95"
      >
        <Camera className="w-4 h-4" />
        <span className="hidden sm:inline">Foto PNG</span>
      </button>

      {/* Share / Copy JSON */}
      <button
        onClick={() => {
          playSound('click');
          onShareCode();
        }}
        title="Copiar código del personaje para compartir"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-[#7A6E85] hover:text-[#9B72CF] font-bold text-xs border border-pink-200 shadow-xs transition-all hover:scale-105 whitespace-nowrap"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Código</span>
      </button>

      {/* Save button */}
      <button
        onClick={() => {
          playSound('equip');
          onSave();
        }}
        title="Guardar personaje en el slot"
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6F91] via-[#FF9EAA] to-[#9B72CF] text-white font-extrabold text-xs shadow-cute hover:scale-105 transition-all whitespace-nowrap active:scale-95"
      >
        <Save className="w-4 h-4" />
        <span>Guardar</span>
      </button>
    </div>
  );
};
