import React, { useState } from 'react';
import { Character, GachaItem, Rarity } from '../../types';
import { ALL_GACHA_ITEMS } from '../../data/items';
import { Sparkles, Lock, Check, Shirt, Filter, ArrowRight } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

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
    <div className="flex-1 flex flex-col p-3 sm:p-6 max-w-6xl mx-auto w-full overflow-y-auto space-y-5">
      {/* Header & Progress Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-pink-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#3D344B] flex items-center gap-2">
            <Shirt className="w-6 h-6 text-[#FF6F91]" />
            <span>Galería de Colección & Armario</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6E85] mt-1">
            Revisa todos los accesorios, prendas y auras desbloqueados en tus tiradas gacha.
          </p>
        </div>

        {/* Progress Bar Pill */}
        <div className="bg-pink-50 border border-pink-200 p-3 rounded-2xl min-w-[200px]">
          <div className="flex justify-between items-center text-xs font-extrabold mb-1.5">
            <span className="text-[#7E57C2]">Completitud</span>
            <span className="text-[#FF6F91]">{totalUnlocked} / {ALL_GACHA_ITEMS.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white border border-pink-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-pink-100">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playSound('click');
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#FF6F91] text-white shadow-xs'
                  : 'bg-pink-50 hover:bg-pink-100 text-[#7A6E85]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-gray-400 mr-1">Rareza:</span>
          {(['all', 3, 4, 5, 6] as const).map((r) => (
            <button
              key={String(r)}
              onClick={() => {
                playSound('click');
                setSelectedRarity(r);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                selectedRarity === r
                  ? 'bg-[#9B72CF] text-white border-transparent'
                  : 'bg-white hover:bg-pink-50 border-pink-200 text-[#7A6E85]'
              }`}
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
              className={`relative rounded-3xl p-3.5 flex flex-col justify-between border transition-all ${
                isUnlocked
                  ? 'bg-white hover:bg-pink-50/40 border-pink-200 shadow-sm hover:shadow-cute hover:-translate-y-1'
                  : 'bg-gray-100/70 border-gray-200 opacity-60'
              }`}
            >
              <div>
                {/* Header: Rarity & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.rarity === 6
                        ? 'bg-purple-100 text-purple-700'
                        : item.rarity === 5
                        ? 'bg-amber-100 text-amber-700'
                        : item.rarity === 4
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {'★'.repeat(item.rarity)}
                  </span>
                  {!isUnlocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  {isEquipped && (
                    <span className="text-[9px] font-extrabold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      Puesto
                    </span>
                  )}
                </div>

                {/* Color preview box */}
                <div
                  className="w-full h-24 rounded-2xl flex items-center justify-center border border-pink-100 shadow-inner my-2 relative"
                  style={{ backgroundColor: item.previewColor || '#FFB5A7' }}
                >
                  <Sparkles className="w-8 h-8 text-white drop-shadow" />
                </div>

                {/* Title & Description */}
                <h4 className="text-xs font-black text-[#3D344B] truncate">
                  {item.name}
                </h4>
                <p className="text-[10px] text-[#7A6E85] line-clamp-2 mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Equip Action Button */}
              <div className="mt-3 pt-2 border-t border-pink-100">
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      playSound('equip');
                      onEquipItem(item);
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
                      isEquipped
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] hover:scale-102 text-white shadow-xs'
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
                  <div className="text-center text-[10px] font-bold text-gray-400 py-1">
                    Bloqueado (Gacha)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
