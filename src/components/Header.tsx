import React from 'react';
import { Sparkles, Palette, Clapperboard, Gem, Shirt, Trophy, Volume2, VolumeX, Plus, RefreshCw } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

interface HeaderProps {
  activeTab: 'editor' | 'studio' | 'gacha' | 'collection' | 'quests';
  setActiveTab: (tab: 'editor' | 'studio' | 'gacha' | 'collection' | 'quests') => void;
  gems: number;
  onOpenGemShop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gems,
  onOpenGemShop,
  isMuted,
  onToggleMute,
}) => {
  const handleNav = (tab: typeof activeTab) => {
    playSound('pop');
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200/60 shadow-sm px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('editor')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6F91] via-[#FF9EAA] to-[#C3B1E1] flex items-center justify-center shadow-cute text-white">
            <Sparkles className="w-5 h-5 animate-spin origin-center" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl leading-none bg-gradient-to-r from-[#FF6F91] to-[#7E57C2] bg-clip-text text-transparent tracking-wide">
              CHIBIVERSE
            </h1>
            <span className="text-[10px] sm:text-xs font-semibold text-[#9B72CF] tracking-wider uppercase">
              Gacha Studio 2D
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-pink-100/50 p-1 rounded-2xl border border-pink-200/50 overflow-x-auto max-w-[55vw] sm:max-w-none">
          <button
            onClick={() => handleNav('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-white text-[#FF6F91] shadow-cute scale-[1.02]'
                : 'text-[#7A6E85] hover:text-[#FF6F91] hover:bg-white/50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => handleNav('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-white text-[#7E57C2] shadow-cute scale-[1.02]'
                : 'text-[#7A6E85] hover:text-[#7E57C2] hover:bg-white/50'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Estudio</span>
          </button>

          <button
            onClick={() => handleNav('gacha')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap relative ${
              activeTab === 'gacha'
                ? 'bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] text-white shadow-cute scale-[1.02]'
                : 'text-[#7A6E85] hover:text-[#FF6F91] hover:bg-white/50'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span>Gacha</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          </button>

          <button
            onClick={() => handleNav('collection')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'collection'
                ? 'bg-white text-[#2A6F97] shadow-cute scale-[1.02]'
                : 'text-[#7A6E85] hover:text-[#2A6F97] hover:bg-white/50'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Colección</span>
          </button>

          <button
            onClick={() => handleNav('quests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'quests'
                ? 'bg-white text-[#FF9E00] shadow-cute scale-[1.02]'
                : 'text-[#7A6E85] hover:text-[#FF9E00] hover:bg-white/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Misiones</span>
          </button>
        </nav>

        {/* Right Actions: Gems & Audio */}
        <div className="flex items-center gap-2">
          {/* Gem counter pill */}
          <button
            onClick={onOpenGemShop}
            title="Conseguir más Gemas Estelares"
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-300/80 px-2.5 sm:px-3 py-1 rounded-full shadow-sm hover:shadow-cute hover:scale-105 transition-all group"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9B72CF] to-[#FF6F91] flex items-center justify-center text-white text-xs">
              <Gem className="w-3 h-3 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-[#5C3D8D]">
              {gems.toLocaleString()}
            </span>
            <div className="w-4 h-4 rounded-full bg-[#FF6F91] text-white flex items-center justify-center ml-0.5">
              <Plus className="w-3 h-3" />
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            className="w-8 h-8 rounded-full bg-pink-100/70 border border-pink-200 text-[#7A6E85] hover:text-[#FF6F91] hover:bg-white flex items-center justify-center transition-all shadow-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
