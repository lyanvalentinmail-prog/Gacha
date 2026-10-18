import React, { useState } from 'react';
import { Character, GachaItem, Rarity } from '../../types';
import { ALL_GACHA_ITEMS } from '../../data/items';
import { getAsset } from '../../data/assetCatalog';
import { Sparkles, Lock, Check, Shirt, Search, X } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';
import { Clouds } from '../ui/Clouds';
import { AssetThumb } from '../AssetThumb';
import { rarityColor } from '../Editor/ItemSelectorGrid';

interface CollectionModeProps {
  unlockedSet: Set<string>;
  currentCharacter: Character;
  onEquipItem: (item: GachaItem) => void;
  onGoToEditor: () => void;
}

type SortMode = 'rarity_desc' | 'rarity_asc' | 'name_asc';

const CATEGORY_LABELS: Record<GachaItem['category'], string> = {
  hair: 'Cabello',
  eyes: 'Ojos',
  clothes: 'Prendas',
  hat: 'Sombreros',
  wings: 'Alas',
  tail: 'Colas',
  prop: 'Objetos en Mano',
  aura: 'Auras',
  preset: 'Preajustes',
};

/** Miniatura real del objeto (SVG del asset) con fallback al color de preview */
const ItemThumb: React.FC<{ item: GachaItem; className?: string }> = ({ item, className = '' }) => {
  const asset = getAsset(item.partKey as string, item.partValue);
  if (asset && !asset.empty) {
    return <AssetThumb asset={asset} className={`w-full h-full ${className}`} />;
  }
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`} style={{ backgroundColor: item.previewColor || '#FFD9E5' }}>
      <Sparkles className="w-8 h-8 text-white drop-shadow" />
    </div>
  );
};

export const CollectionMode: React.FC<CollectionModeProps> = ({
  unlockedSet,
  currentCharacter,
  onEquipItem,
  onGoToEditor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<SortMode>('rarity_desc');
  const [detailItem, setDetailItem] = useState<GachaItem | null>(null);

  const categories = [
    { id: 'all', label: 'Todos' },
    ...(Array.from(new Set(ALL_GACHA_ITEMS.map((i) => i.category))) as GachaItem['category'][]).map((cat) => ({
      id: cat as string,
      label: CATEGORY_LABELS[cat],
    })),
  ];

  const filteredItems = ALL_GACHA_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && item.rarity !== selectedRarity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const haystack = `${item.name} ${item.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortMode) {
      case 'rarity_asc':
        return a.rarity - b.rarity || a.name.localeCompare(b.name, 'es');
      case 'name_asc':
        return a.name.localeCompare(b.name, 'es');
      default:
        return b.rarity - a.rarity || a.name.localeCompare(b.name, 'es');
    }
  });

  const totalUnlocked = ALL_GACHA_ITEMS.filter((i) => unlockedSet.has(i.id)).length;
  const progressPercent = Math.round((totalUnlocked / ALL_GACHA_ITEMS.length) * 100);

  return (
    <div className="flex-1 relative overflow-y-auto">
      <div className="gl-sky min-h-full">
        <Clouds />

        <div className="relative z-10 flex flex-col p-3 sm:p-6 max-w-6xl mx-auto w-full space-y-5">
          {/* Encabezado & progreso */}
          <div className="gl-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="gl-title inline-flex items-center gap-2 text-xl sm:text-2xl font-display px-3 py-1.5 rounded-2xl" style={{ background: 'linear-gradient(180deg,#FFD9E5,#FFB9CD)' }}>
                <Shirt className="w-6 h-6 text-rosa-600" />
                <span>Galería de Colección & Armario</span>
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-2 font-semibold">
                Revisa todos los accesorios, prendas y auras desbloqueados en tus tiradas gacha.
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="bg-lav-50 border-[1.5px] border-line-lav p-3 rounded-2xl min-w-[200px]">
              <div className="flex justify-between items-center text-xs font-extrabold mb-1.5">
                <span className="text-ink-soft">Completitud</span>
                <span className="text-rosa-600">{totalUnlocked} / {ALL_GACHA_ITEMS.length} ({progressPercent}%)</span>
              </div>
              <div className="gl-bar h-3">
                <div className="gl-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="gl-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3">
            {/* Categorías */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
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

            <div className="flex flex-wrap items-center gap-2">
              {/* Rareza */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-ink-faint mr-0.5">Rareza:</span>
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

              {/* Orden */}
              <select
                value={sortMode}
                onChange={(e) => {
                  playSound('click');
                  setSortMode(e.target.value as SortMode);
                }}
                className="text-[11px] font-bold bg-white border-[1.5px] border-line-lav rounded-full px-2.5 py-1.5 text-ink-soft focus:outline-none focus:border-rosa-400 cursor-pointer"
                title="Ordenar"
              >
                <option value="rarity_desc">Mayor rareza</option>
                <option value="rarity_asc">Menor rareza</option>
                <option value="name_asc">Nombre A–Z</option>
              </select>

              {/* Búsqueda */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-ink-faint absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar objeto..."
                  className="!w-[150px] soft-input !rounded-full !py-1.5 !pl-8 !text-[11px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-faint hover:text-rosa-500"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Resultado vacío */}
          {sortedItems.length === 0 && (
            <div className="gl-card p-10 text-center">
              <Sparkles className="w-8 h-8 text-rosa-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-ink-soft">
                No hay objetos que coincidan con los filtros.
              </p>
            </div>
          )}

          {/* Cuadrícula de objetos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {sortedItems.map((item) => {
              const isUnlocked = unlockedSet.has(item.id);
              const isEquipped = currentCharacter.parts[item.partKey] === item.partValue;
              const rc = rarityColor(item.rarity);

              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl p-3 flex flex-col justify-between border-[1.5px] transition-all ${
                    isUnlocked
                      ? 'bg-white border-line-rose shadow-xs card-hover cursor-pointer'
                      : 'bg-panel-lav border-line-lav'
                  }`}
                  onClick={() => { playSound('click'); setDetailItem(item); }}
                >
                  <div>
                    {/* Rareza & estado */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full border leading-none"
                        style={{ color: rc.text, backgroundColor: rc.chipBg, borderColor: rc.chipBorder }}
                      >
                        {'★'.repeat(item.rarity)}
                      </span>
                      {!isUnlocked && <Lock className="w-3.5 h-3.5 text-ink-faint" />}
                      {isEquipped && (
                        <span className="text-[9px] font-extrabold bg-mint-soft text-mint-deep px-1.5 py-0.5 rounded-full border border-mint-mid/50">
                          Puesto
                        </span>
                      )}
                    </div>

                    {/* Miniatura real */}
                    <div className="w-full aspect-square rounded-2xl border-[1.5px] border-line-rose shadow-inner my-2 relative overflow-hidden bg-rosa-50">
                      <span className={isUnlocked ? '' : 'grayscale-[0.6] opacity-60'}>
                        <ItemThumb item={item} />
                      </span>
                    </div>

                    {/* Nombre & descripción */}
                    <h4 className="text-xs font-black text-ink truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-ink-soft line-clamp-2 mt-0.5 min-h-[2em]">
                      {item.description}
                    </p>
                  </div>

                  {/* Acción */}
                  <div className="mt-3 pt-2 border-t border-line-lav">
                    {isUnlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('equip');
                          onEquipItem(item);
                        }}
                        className={`w-full py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1 border-[1.5px] active:scale-[0.97] ${
                          isEquipped
                            ? 'bg-mint-soft text-mint-deep border-mint-mid/50'
                            : 'text-white border-rosa-500 shadow-sm hover:brightness-105'
                        }`}
                        style={isEquipped ? undefined : { background: 'linear-gradient(180deg,#FF9DB8,#F97FA5)' }}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Equipado</span>
                          </>
                        ) : (
                          <span>Equipar</span>
                        )}
                      </button>
                    ) : (
                      <div className="text-center text-[10px] font-bold text-ink-faint py-1.5">
                        Bloqueado (Gacha)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ PANEL DE DETALLES DEL OBJETO ============ */}
        {detailItem && (
          <div className="fixed inset-0 z-50 bg-[#4A3B52]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setDetailItem(null)}>
            <div className="gl-card p-5 max-w-xs w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-line-rose pb-2">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full border"
                  style={{
                    color: rarityColor(detailItem.rarity).text,
                    backgroundColor: rarityColor(detailItem.rarity).chipBg,
                    borderColor: rarityColor(detailItem.rarity).chipBorder,
                  }}
                >
                  {'★'.repeat(detailItem.rarity)}
                </span>
                <button onClick={() => setDetailItem(null)} className="icon-btn w-8 h-8 !text-rosa-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full aspect-square rounded-2xl border-[1.5px] border-line-rose overflow-hidden bg-rosa-50">
                <ItemThumb item={detailItem} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="gl-title font-display text-lg">{detailItem.name}</h3>
                <p className="text-[11px] text-ink-faint font-bold uppercase tracking-wider">
                  {CATEGORY_LABELS[detailItem.category]}
                </p>
                <p className="text-xs text-ink-soft font-semibold leading-relaxed">
                  {detailItem.description}
                </p>
              </div>

              {unlockedSet.has(detailItem.id) ? (
                <button
                  onClick={() => {
                    playSound('equip');
                    onEquipItem(detailItem);
                    setDetailItem(null);
                  }}
                  disabled={currentCharacter.parts[detailItem.partKey] === detailItem.partValue}
                  className="gl-btn gl-btn-pink w-full py-2.5 text-xs"
                >
                  {currentCharacter.parts[detailItem.partKey] === detailItem.partValue ? (
                    <>
                      <Check className="w-4 h-4" /> Equipado en {currentCharacter.name.split(' ')[0]}
                    </>
                  ) : (
                    <>Equipar en {currentCharacter.name.split(' ')[0]}</>
                  )}
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-panel-lav border-[1.5px] border-line-lav text-center text-[11px] font-bold text-ink-faint">
                  <Lock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  Consíguelo en las tiradas del Gacha
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionMode;
