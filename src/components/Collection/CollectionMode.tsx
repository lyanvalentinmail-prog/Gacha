import React, { useState } from 'react';
import { Character, GachaItem, Rarity } from '../../types';
import { ALL_GACHA_ITEMS } from '../../data/items';
import { Sparkles, Lock, Check, Shirt } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';
import { Clouds } from '../ui/Clouds';

interface CollectionModeProps {
  unlockedSet: Set<string>;
  currentCharacter: Character;
  onEquipItem: (item: GachaItem) => void;
  onGoToEditor: () => void;
}

export const CollectionMode: React.FC<CollectionModeProps> = ({
  unlockedSet,
  currentCharacter,
  onEquipItem,
  onGoToEditor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<number | 'all'>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'hair', label: 'Cabello' },
    { id: 'eyes', label: 'Ojos' },
    { id: 'clothes', label: 'Prendas' },
    { id: 'hat', label: 'Sombreros' },
    { id: 'wings', label: 'Alas' },
    { id: 'tail', label: 'Colas' },
    { id: 'prop', label: 'Objetos en Mano' },
    { id: 'aura', label: 'Auras' },
  ];

  const filteredItems = ALL_GACHA_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && item.rarity !== selectedRarity) return false;
    return true;
  });

  const totalUnlocked = ALL_GACHA_ITEMS.filter((i) => unlockedSet.has(i.id)).length;
  const progressPercent = Math.round((totalUnlocked / ALL_GACHA_ITEMS.length) * 100);

  return (
    <div className="flex-1 relative overflow-y-auto">
      <div className="gl-sky min-h-full">
        <Clouds />

        <div className="relative z-10 flex flex-col p-3 sm:p-6 max-w-6xl mx-auto w-full space-y-5">
          {/* Header & Progress Card */}
          <div className="gl-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="gl-title inline-flex items-center gap-2 text-xl sm:text-2xl font-display font-bold px-3 py-1.5 rounded-2xl" style={{ background: 'linear-gradient(180deg,#FFB1CE,#FF87B2)' }}>
                <Shirt className="w-6 h-6" />
                <span>Galería de Colección & Armario</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4AA0D0] mt-2">
                Revisa todos los accesorios, prendas y auras desbloqueados en tus tiradas gacha.
              </p>
            </div>

            {/* Progress Bar Pill */}
            <div className="bg-[#EAF6FF] border-[3px] border-[#2B5FA8] p-3 rounded-2xl min-w-[200px]">
              <div className="flex justify-between items-center text-xs font-extrabold mb-1.5">
                <span className="text-[#1E4580]">Completitud</span>
                <span className="text-[#E56593]">{totalUnlocked} / {ALL_GACHA_ITEMS.length} ({progressPercent}%)</span>
              </div>
              <div className="gl-bar h-3">
                <div className="gl-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="gl-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedCategory(cat.id);
                  }}
                  className={`gl-chip ${selectedCategory === cat.id ? 'gl-chip-active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Rarity Filter */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#4AA0D0] mr-1">Rareza:</span>
              {(['all', 3, 4, 5, 6] as const).map((r) => (
                <button
                  key={String(r)}
                  onClick={() => {
                    playSound('click');
                    setSelectedRarity(r);
                  }}
                  className={`gl-chip ${selectedRarity === r ? 'gl-chip-active' : ''}`}
                >
                  {r === 'all' ? 'Todas' : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Items Showcase Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedSet.has(item.id);
              const isEquipped = currentCharacter.parts[item.partKey] === item.partValue;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl p-3.5 flex flex-col justify-between border-[3px] transition-all ${
                    isUnlocked
                      ? 'bg-white hover:-translate-y-1 border-[#2B5FA8] shadow-[0_4px_0_#2B5FA8]'
                      : 'bg-[#EAF6FF] border-[#74C9F0] opacity-60'
                  }`}
                >
                  <div>
                    {/* Header: Rarity & Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-[#2B5FA8] ${
                          item.rarity === 6
                            ? 'bg-[#FFB1CE] text-[#C2406F]'
                            : item.rarity === 5
                            ? 'bg-[#FFE06B] text-[#8A6414]'
                            : item.rarity === 4
                            ? 'bg-[#C9B5EC] text-[#6B44A8]'
                            : 'bg-[#A8DEF8] text-[#1E4580]'
                        }`}
                      >
                        {'★'.repeat(item.rarity)}
                      </span>
                      {!isUnlocked && <Lock className="w-3.5 h-3.5 text-[#4AA0D0]" />}
                      {isEquipped && (
                        <span className="text-[9px] font-extrabold bg-[#C8EFB8] text-[#3E7A2E] px-1.5 py-0.5 rounded-full border border-[#63B34C]">
                          Puesto
                        </span>
                      )}
                    </div>

                    {/* Color preview box */}
                    <div
                      className="w-full h-24 rounded-2xl flex items-center justify-center border-2 border-[#74C9F0] shadow-inner my-2 relative"
                      style={{ backgroundColor: item.previewColor || '#FFB1CE' }}
                    >
                      <Sparkles className="w-8 h-8 text-white drop-shadow" />
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-xs font-black text-[#1E4580] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#4AA0D0] line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {/* Equip Action Button */}
                  <div className="mt-3 pt-2 border-t-2 border-[#A8DEF8]">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          playSound('equip');
                          onEquipItem(item);
                        }}
                        className={`w-full py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 border-2 border-[#2B5FA8] shadow-[0_2px_0_#2B5FA8] active:translate-y-[2px] active:shadow-none ${
                          isEquipped
                            ? 'bg-[#C8EFB8] text-[#3E7A2E]'
                            : 'bg-[#FF87B2] text-white hover:brightness-105'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Equipado</span>
                          </>
                        ) : (
                          <span>Equipar en {currentCharacter.name.split(' ')[0]}</span>
                        )}
                      </button>
                    ) : (
                      <div className="text-center text-[10px] font-bold text-[#4AA0D0] py-1">
                        Bloqueado (Gacha)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionMode;
