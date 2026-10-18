import React from 'react';
import { ItemOption } from '../../data/items';
import { Rarity } from '../../types';
import { Sparkles, Lock } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface ItemSelectorGridProps {
  options: ItemOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  unlockedSet?: Set<string>;
  categoryTitle?: string;
  renderThumbnail?: (option: ItemOption) => React.ReactNode;
}

export const ItemSelectorGrid: React.FC<ItemSelectorGridProps> = ({
  options,
  selectedId,
  onSelect,
  unlockedSet,
  categoryTitle,
  renderThumbnail,
}) => {
  const getRarityBadge = (rarity: Rarity) => {
    switch (rarity) {
      case 6:
        return (
          <span className="bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
            6★ ULTRA
          </span>
        );
      case 5:
        return (
          <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
            5★ LEGEND
          </span>
        );
      case 4:
        return (
          <span className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
            4★ RARO
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
            3★
          </span>
        );
    }
  };

  return (
    <div className="space-y-2">
      {categoryTitle && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#7A6E85] uppercase tracking-wider">
            {categoryTitle}
          </span>
          <span className="text-[11px] font-semibold text-[#9B72CF]">
            {options.length} opciones
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isLocked = unlockedSet && opt.rarity >= 4 && !unlockedSet.has(opt.id) && !unlockedSet.has(`item_${opt.id}`);

          return (
            <button
              key={opt.id}
              onClick={() => {
                if (isLocked) {
                  playSound('pop');
                  alert(`¡Este artículo "${opt.name}" es de rareza ${opt.rarity}★ y se puede conseguir en las tiradas Gacha!`);
                  return;
                }
                playSound('equip');
                onSelect(opt.id);
              }}
              className={`relative flex flex-col items-center p-2.5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-pink-50 to-purple-50 border-[#FF6F91] ring-2 ring-[#FF6F91]/50 shadow-cute scale-[1.02]'
                  : isLocked
                  ? 'bg-gray-50/80 border-gray-200 opacity-60'
                  : 'bg-white/90 hover:bg-pink-50/40 border-pink-100 hover:border-pink-300 shadow-xs'
              }`}
            >
              {/* Header with rarity badge */}
              <div className="w-full flex items-center justify-between mb-1.5">
                {getRarityBadge(opt.rarity)}
                {isLocked && <Lock className="w-3.5 h-3.5 text-gray-500" />}
              </div>

              {/* Visual Thumbnail or Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-pink-50/80 to-purple-50/80 border border-pink-200/50 flex items-center justify-center my-1 shadow-inner relative">
                {renderThumbnail ? (
                  renderThumbnail(opt)
                ) : (
                  <Sparkles
                    className={`w-6 h-6 ${
                      opt.rarity >= 5
                        ? 'text-yellow-500'
                        : opt.rarity === 4
                        ? 'text-purple-500'
                        : 'text-pink-400'
                    }`}
                  />
                )}
              </div>

              {/* Title & Description */}
              <div className="w-full text-center mt-1">
                <p className="text-xs font-extrabold text-[#3D344B] truncate leading-tight">
                  {opt.name}
                </p>
                <p className="text-[10px] text-[#7A6E85] line-clamp-1 mt-0.5">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
