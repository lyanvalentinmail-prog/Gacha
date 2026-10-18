import React from 'react';
import { ItemOption } from '../../data/items';
import { Rarity } from '../../types';
import { Sparkles, Lock } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';
import { AssetThumb } from '../AssetThumb';
import { gachaIdFor } from '../../data/assetCatalog';

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

  const isItemLocked = (opt: ItemOption): boolean => {
    if (!unlockedSet) return false;
    if (opt.rarity < 4) return false;
    if (opt.asset?.empty) return false;
    const gachaId = opt.asset?.partKey ? gachaIdFor(opt.asset.partKey, opt.id) : opt.id;
    return !unlockedSet.has(gachaId) && !unlockedSet.has(opt.id) && !unlockedSet.has(`item_${opt.id}`);
  };

  return (
    <div className="space-y-2">
      {categoryTitle && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#4A4D8E] uppercase tracking-wider">
            {categoryTitle}
          </span>
          <span className="text-[11px] font-semibold text-[#7D80D1]">
            {options.length} opciones
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[430px] overflow-y-auto pr-1">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isLocked = isItemLocked(opt);

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
              className={`relative flex flex-col items-center p-2 rounded-2xl text-left border-[3px] transition-all ${
                isSelected
                  ? 'bg-white border-[#FF6F91] shadow-[0_0_0_2px_rgba(255,111,145,0.35)] scale-[1.02]'
                  : isLocked
                  ? 'bg-[#E6E8FB]/60 border-[#B9BCE8] opacity-60'
                  : 'bg-white/90 hover:bg-[#F2F3FF] border-[#B9BCE8] hover:border-[#7D80D1]'
              }`}
            >
              {/* Header with rarity badge */}
              <div className="w-full flex items-center justify-between mb-1">
                {getRarityBadge(opt.rarity)}
                {isLocked && <Lock className="w-3.5 h-3.5 text-[#4A4D8E]" />}
              </div>

              {/* Miniatura real del asset */}
              <div
                className="w-14 h-14 rounded-xl border-2 border-[#B9BCE8] flex items-center justify-center my-0.5 overflow-hidden"
                style={{ backgroundColor: '#E6E8FB' }}
              >
                {renderThumbnail ? (
                  renderThumbnail(opt)
                ) : opt.asset ? (
                  <AssetThumb asset={opt.asset} />
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
                <p className="text-[11px] font-extrabold text-[#3D3B6E] truncate leading-tight">
                  {opt.name}
                </p>
                <p className="text-[9px] text-[#7D80D1] line-clamp-1 mt-0.5">
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
