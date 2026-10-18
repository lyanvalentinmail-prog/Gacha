import React from 'react';
import { ItemOption } from '../../data/items';
import { Rarity } from '../../types';
import { Lock, Check } from 'lucide-react';
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

/** Color de rareza ( Tokens compartidos con el Gacha y la Colección ) */
export const rarityColor = (r: Rarity): { text: string; chipBg: string; chipBorder: string } => {
  switch (r) {
    case 6:
      return { text: '#C94773', chipBg: '#FFECF2', chipBorder: '#FFB9CD' };
    case 5:
      return { text: '#A97B2A', chipBg: '#FFF4E0', chipBorder: '#F5B95A' };
    case 4:
      return { text: '#7F6BB8', chipBg: '#EFEBFA', chipBorder: '#CFC4EE' };
    default:
      return { text: '#7D7189', chipBg: '#F7F5FD', chipBorder: '#E4DDF4' };
  }
};

const RarityBadge: React.FC<{ rarity: Rarity }> = ({ rarity }) => {
  const c = rarityColor(rarity);
  return (
    <span
      className="text-[9px] font-black px-1.5 py-[1px] rounded-full border leading-none"
      style={{ color: c.text, backgroundColor: c.chipBg, borderColor: c.chipBorder }}
    >
      {rarity}★
    </span>
  );
};

export const ItemSelectorGrid: React.FC<ItemSelectorGridProps> = ({
  options,
  selectedId,
  onSelect,
  unlockedSet,
  categoryTitle,
  renderThumbnail,
}) => {
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
          <span className="text-[10px] font-extrabold text-ink-soft uppercase tracking-wider">
            {categoryTitle}
          </span>
          <span className="text-[11px] font-semibold text-ink-faint">
            {options.length} opciones
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[430px] overflow-y-auto pr-1">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isLocked = isItemLocked(opt);
          const rc = rarityColor(opt.rarity);

          return (
            <button
              key={opt.id}
              title={`${opt.name} — ${opt.description}`}
              onClick={() => {
                if (isLocked) {
                  playSound('pop');
                  alert(`¡"${opt.name}" es de rareza ${opt.rarity}★ y se consigue en las tiradas Gacha!`);
                  return;
                }
                playSound('equip');
                onSelect(opt.id);
              }}
              className={`relative flex flex-col items-center p-1.5 pb-2 rounded-2xl text-left border-[1.5px] transition-all active:scale-[0.97] ${
                isSelected
                  ? 'bg-rosa-50 border-rosa-400 ring-2 ring-rosa-200'
                  : isLocked
                  ? 'bg-panel-lav border-line-lav opacity-75'
                  : 'bg-white border-line-rose hover:border-lav-300 hover:shadow-sm'
              }`}
            >
              {/* Miniatura uniforme */}
              <div
                className="relative w-full aspect-square rounded-xl border border-line-rose flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#FFF6F9' }}
              >
                {renderThumbnail ? (
                  <span className={`w-full h-full flex items-center justify-center ${isLocked ? 'grayscale-[0.5] opacity-70' : ''}`}>
                    {renderThumbnail(opt)}
                  </span>
                ) : opt.asset ? (
                  <AssetThumb asset={opt.asset} className={`w-full h-full ${isLocked ? 'grayscale-[0.5] opacity-70' : ''}`} />
                ) : null}

                {/* Estado: seleccionado / bloqueado */}
                {isSelected && (
                  <span className="absolute top-1 right-1 w-5 h-5 p-0.5 rounded-full text-white flex items-center justify-center shadow-sm pop-in" style={{ background: 'linear-gradient(180deg,#FF9DB8,#F97FA5)' }}>
                    <Check className="w-3 h-3" strokeWidth={3.5} />
                  </span>
                )}
                {isLocked && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 border border-line-lav flex items-center justify-center">
                    <Lock className="w-3 h-3 text-ink-faint" />
                  </span>
                )}
              </div>

              {/* Nombre + rareza */}
              <div className="w-full text-center mt-1 px-0.5">
                <p className={`text-[10px] font-extrabold truncate leading-tight ${isSelected ? 'text-rosa-600' : 'text-ink'}`}>
                  {opt.name}
                </p>
                <span className="text-[9px] font-black leading-none" style={{ color: rc.text }}>
                  {'★'.repeat(opt.rarity)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
