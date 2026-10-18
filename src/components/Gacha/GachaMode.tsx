import React, { useState } from 'react';
import { GachaBanner, GachaItem, PullHistoryItem, Rarity } from '../../types';
import { GACHA_BANNERS, ALL_GACHA_ITEMS } from '../../data/items';
import { Sparkles, Gem, History, Check, ArrowRight, ShieldCheck, Flame, Star } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';
import { Clouds } from '../ui/Clouds';
import { GachaMachine } from '../ui/GachaMachine';

interface GachaModeProps {
  gems: number;
  onUpdateGems: (newGems: number) => void;
  unlockedSet: Set<string>;
  onUnlockItems: (itemIds: string[]) => void;
  pullHistory: PullHistoryItem[];
  onAddHistory: (records: PullHistoryItem[]) => void;
  onRewardQuest?: (questId: string) => void;
  onOpenCollection: () => void;
}

export const GachaMode: React.FC<GachaModeProps> = ({
  gems,
  onUpdateGems,
  unlockedSet,
  onUnlockItems,
  pullHistory,
  onAddHistory,
  onRewardQuest,
  onOpenCollection,
}) => {
  const [selectedBannerIndex, setSelectedBannerIndex] = useState<number>(0);
  const activeBanner = GACHA_BANNERS[selectedBannerIndex];

  // Animation & reveal states
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullResults, setPullResults] = useState<{ item: GachaItem; isNew: boolean }[] | null>(null);
  const [revealedIndex, setRevealedIndex] = useState<number>(0);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showProbModal, setShowProbModal] = useState<boolean>(false);

  // Perform Pulls (1x or 10x)
  const handlePull = (count: 1 | 10) => {
    const cost = count === 1 ? 100 : 900;
    if (gems < cost) {
      playSound('delete');
      alert(`¡No tienes suficientes Gemas Estelares! Necesitas ${cost} gemas. ¡Puedes conseguir más gratis pulsando el botón '+' de la cabecera!`);
      return;
    }

    // Deduct gems
    onUpdateGems(gems - cost);
    playSound('gachaStart');
    setIsPulling(true);

    // Roll items
    const results: { item: GachaItem; isNew: boolean }[] = [];
    const newUnlockedIds: string[] = [];
    const historyRecords: PullHistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      // Rates: 6★ (1%), 5★ (4%), 4★ (20%), 3★ (75%)
      // If 10x pull, the 10th item is guaranteed 4★ or higher!
      const rand = Math.random() * 100;
      let targetRarity: Rarity = 3;

      if (count === 10 && i === 9) {
        // Guaranteed 4★+
        if (rand < 2) targetRarity = 6;
        else if (rand < 15) targetRarity = 5;
        else targetRarity = 4;
      } else {
        if (rand < 1.0) targetRarity = 6;
        else if (rand < 5.0) targetRarity = 5;
        else if (rand < 25.0) targetRarity = 4;
        else targetRarity = 3;
      }

      // Filter pool by rarity
      let pool = ALL_GACHA_ITEMS.filter((item) => item.rarity === targetRarity);
      if (pool.length === 0) pool = ALL_GACHA_ITEMS;

      // Rate-up check
      const featuredPool = pool.filter((it) => activeBanner.featuredItems.includes(it.id));
      const chosenItem =
        featuredPool.length > 0 && Math.random() < 0.5
          ? featuredPool[Math.floor(Math.random() * featuredPool.length)]
          : pool[Math.floor(Math.random() * pool.length)];

      const isNew = !unlockedSet.has(chosenItem.id);
      results.push({ item: chosenItem, isNew });

      if (isNew) {
        newUnlockedIds.push(chosenItem.id);
      }

      historyRecords.push({
        id: `pull_${Date.now()}_${i}`,
        timestamp: Date.now(),
        itemId: chosenItem.id,
        itemName: chosenItem.name,
        rarity: chosenItem.rarity,
        category: chosenItem.category,
        bannerName: activeBanner.name,
        isNew,
      });
    }

    // Save history & unlocked
    if (newUnlockedIds.length > 0) {
      onUnlockItems(newUnlockedIds);
    }
    onAddHistory(historyRecords);

    // Quests trigger
    if (onRewardQuest) {
      onRewardQuest('quest_first_gacha');
      if (count === 10) onRewardQuest('quest_multi_pull');
    }

    // Animation timeout to reveal
    setTimeout(() => {
      setIsPulling(false);
      setPullResults(results);
      setRevealedIndex(0);

      const hasLegendary = results.some((r) => r.item.rarity >= 5);
      if (hasLegendary) playSound('fanfare');
      else playSound('reveal');
    }, 1800);
  };

  const getRarityStar = (r: Rarity) => {
    return '★'.repeat(r);
  };

  const rarityFrame = (r: Rarity) => {
    switch (r) {
      case 6:
        return { border: '#FF87B2', bg: 'linear-gradient(180deg,#FFD9E7,#FFB1CE)', star: '#E56593' };
      case 5:
        return { border: '#E5B84B', bg: 'linear-gradient(180deg,#FFF3B8,#FFE06B)', star: '#C98F1F' };
      case 4:
        return { border: '#8F6DC4', bg: 'linear-gradient(180deg,#E4D9F7,#C9B5EC)', star: '#7A52B8' };
      default:
        return { border: '#4AA0D0', bg: 'linear-gradient(180deg,#DFF1FF,#A8DEF8)', star: '#2B5FA8' };
    }
  };

  return (
    <div className="flex-1 relative overflow-y-auto">
      {/* Cielo con nubes de fondo */}
      <div className="gl-sky min-h-full">
        <Clouds dense />

        <div className="relative z-10 flex flex-col p-3 sm:p-6 max-w-6xl mx-auto w-full space-y-5">
          {/* Banner Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {GACHA_BANNERS.map((banner, index) => {
              const isActive = selectedBannerIndex === index;
              return (
                <button
                  key={banner.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedBannerIndex(index);
                  }}
                  className={`gl-btn px-4 py-2 text-xs sm:text-sm whitespace-nowrap ${isActive ? 'gl-btn-pink' : 'gl-btn-white'}`}
                >
                  {banner.name}
                </button>
              );
            })}
          </div>

          {/* ============ ZONA PRINCIPAL: MÁQUINA + BANNER ============ */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* Máquina de gacha estilo Gacha Life */}
            <div className="gl-card relative flex flex-col items-center justify-center gap-2 p-4 sm:p-6 lg:w-[300px] shrink-0">
              <div className="absolute inset-3 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(180deg,#EAF6FF 0%,#DFF1FF 100%)' }} />
              <GachaMachine className="relative w-40 sm:w-48 h-auto drop-shadow-lg" spinning={isPulling} />
              <div className="relative flex items-center gap-2 mt-1">
                <span className="gl-pill-pink gl-pill text-sm font-display">
                  <Gem className="w-4 h-4 text-white" /> {gems.toLocaleString()}
                </span>
              </div>
              <div className="relative flex items-center gap-3 w-full">
                {/* Spawn 1 */}
                <button
                  onClick={() => handlePull(1)}
                  disabled={isPulling}
                  className="gl-btn gl-btn-pink flex-1 flex-col gap-0.5 py-2.5"
                >
                  <span className="font-display text-lg leading-none">Spawn 1</span>
                  <span className="flex items-center gap-1 text-xs opacity-95">
                    <Gem className="w-3.5 h-3.5" /> 100
                  </span>
                </button>
                {/* Spawn 10 */}
                <button
                  onClick={() => handlePull(10)}
                  disabled={isPulling}
                  className="gl-btn gl-btn-yellow flex-1 flex-col gap-0.5 py-2.5"
                >
                  <span className="font-display text-lg leading-none">Spawn 10</span>
                  <span className="flex items-center gap-1 text-xs opacity-95">
                    <Gem className="w-3.5 h-3.5" /> 900
                  </span>
                </button>
              </div>
              <div className="relative flex items-center gap-3 pt-1">
                <button onClick={() => setShowProbModal(true)} className="text-xs font-bold text-[#2B5FA8] underline hover:text-[#FF87B2]">
                  Probabilidades
                </button>
                <span className="text-[#4AA0D0]">•</span>
                <button onClick={() => setShowHistoryModal(true)} className="text-xs font-bold text-[#2B5FA8] underline hover:text-[#FF87B2] flex items-center gap-1">
                  <History className="w-3.5 h-3.5" />
                  <span>Historial ({pullHistory.length})</span>
                </button>
              </div>
            </div>

            {/* Banner Showcase */}
            <div
              className={`relative rounded-3xl border-[4px] p-5 sm:p-7 overflow-hidden shadow-cute-lg bg-gradient-to-br ${activeBanner.coverGradient} text-white flex-1 flex flex-col justify-between min-h-[320px]`}
              style={{ borderColor: '#1E4580' }}
            >
              {/* Decoraciones */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[11px] font-extrabold uppercase tracking-wider text-[#1E4580] border-2 border-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B84B]" />
                  <span>Banner Especial de Deseos</span>
                </div>
                <h2 className="gl-title text-2xl sm:text-4xl font-display font-bold tracking-tight">
                  {activeBanner.name}
                </h2>
                <p className="text-sm sm:text-base font-bold text-white drop-shadow">
                  {activeBanner.subtitle}
                </p>
                <p className="text-xs sm:text-sm font-medium text-white/90 drop-shadow">
                  {activeBanner.tagline}
                </p>
              </div>

              {/* Destacados */}
              <div className="relative z-10 my-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-white flex items-center gap-1 drop-shadow">
                  <Flame className="w-3.5 h-3.5" /> Destacados 5★/6★:
                </span>
                {activeBanner.featuredItems.map((itemId) => {
                  const it = ALL_GACHA_ITEMS.find((i) => i.id === itemId);
                  if (!it) return null;
                  return (
                    <span
                      key={itemId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 text-[11px] font-extrabold border-2 border-white text-[#1E4580]"
                    >
                      <span className="text-[#E5B84B]">★{it.rarity}</span>
                      <span>{it.name}</span>
                    </span>
                  );
                })}
              </div>

              {/* Info de garantía */}
              <div className="relative z-10 flex items-center gap-2 pt-3 border-t-2 border-white/40">
                <Star className="w-4 h-4 text-[#FFE06B]" />
                <p className="text-xs font-bold text-white drop-shadow">
                  En la tirada de 10 hay al menos un objeto 4★+ garantizado.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Collection Teaser */}
          <div className="gl-card flex items-center justify-between p-4">
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-[#1E4580]">
                Colección Desbloqueada: {unlockedSet.size} / {ALL_GACHA_ITEMS.length} artículos
              </p>
              <p className="text-[11px] text-[#4AA0D0]">
                Todos los artículos que obtengas pueden ser equipados inmediatamente en el Editor de Personajes.
              </p>
            </div>
            <button onClick={onOpenCollection} className="gl-btn gl-btn-blue px-4 py-2 text-xs">
              <span>Ver Armario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ============ PULL ANIMATION OVERLAY ============ */}
        {isPulling && (
          <div className="fixed inset-0 z-50 gl-sky backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-6 animate-fadeIn">
            <Clouds dense />
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/90 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-4 rounded-full border-2 border-[#FFE06B] animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
              <GachaMachine className="relative w-40 h-auto drop-shadow-2xl" spinning />
            </div>
            <h3 className="gl-title text-xl sm:text-3xl font-display font-bold text-center">
              ¡Invocando deseos a las constelaciones...!
            </h3>
          </div>
        )}

        {/* ============ PULL RESULTS MODAL ============ */}
        {pullResults && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="gl-card p-5 sm:p-6 max-w-3xl w-full space-y-4">
              <div className="flex items-center justify-between border-b-[3px] border-[#A8DEF8] pb-3">
                <div>
                  <h3 className="gl-title inline-block text-xl font-display font-bold px-3 py-1 rounded-xl" style={{ background: 'linear-gradient(180deg,#FFB1CE,#FF87B2)' }}>
                    ¡Resultados de la Invocación!
                  </h3>
                  <p className="text-xs text-[#4AA0D0] mt-1">
                    {pullResults.length} objetos obtenidos
                  </p>
                </div>
                <button onClick={() => setPullResults(null)} className="gl-btn gl-btn-pink px-4 py-1.5 text-xs">
                  Cerrar
                </button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[55vh] overflow-y-auto p-1">
                {pullResults.map((res, idx) => {
                  const item = res.item;
                  const frame = rarityFrame(item.rarity);

                  return (
                    <div
                      key={idx}
                      className="relative p-3 rounded-2xl flex flex-col items-center text-center border-[3px] transition-all"
                      style={{ borderColor: frame.border, background: frame.bg }}
                    >
                      {/* New Badge */}
                      {res.isNew && (
                        <span className="absolute -top-2 -right-2 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: '#E56593' }}>
                          ¡NUEVO!
                        </span>
                      )}

                      {/* Star Rarity */}
                      <span className="text-xs font-black mb-1" style={{ color: frame.star }}>
                        {getRarityStar(item.rarity)}
                      </span>

                      {/* Visual Preview Box */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center my-1 border-2 border-white shadow-inner"
                        style={{ backgroundColor: item.previewColor || '#FF87B2' }}
                      >
                        <Sparkles className="w-6 h-6 text-white drop-shadow" />
                      </div>

                      <p className="text-xs font-extrabold text-[#1E4580] truncate w-full mt-1">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-[#4AA0D0] uppercase">
                        {item.category}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-[3px] border-[#A8DEF8]">
                <button
                  onClick={() => {
                    setPullResults(null);
                    onOpenCollection();
                  }}
                  className="gl-btn gl-btn-white px-4 py-2 text-xs"
                >
                  Ir a Colección
                </button>
                <button
                  onClick={() => {
                    setPullResults(null);
                    handlePull(pullResults.length === 10 ? 10 : 1);
                  }}
                  className="gl-btn gl-btn-yellow px-5 py-2 text-xs"
                >
                  Tirar Otra Vez
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ HISTORY MODAL ============ */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="gl-card p-5 max-w-lg w-full space-y-4">
              <div className="flex items-center justify-between border-b-[3px] border-[#A8DEF8] pb-2">
                <h3 className="font-display font-bold text-base text-[#1E4580] flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#8F6DC4]" />
                  <span>Historial de Invocaciones</span>
                </h3>
                <button onClick={() => setShowHistoryModal(false)} className="gl-btn gl-btn-white px-3 py-1 text-xs">
                  Cerrar
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {pullHistory.length === 0 ? (
                  <p className="text-xs text-center text-[#4AA0D0] py-8">
                    Aún no has realizado ninguna tirada. ¡Prueba tu suerte!
                  </p>
                ) : (
                  pullHistory.map((item) => {
                    const frame = rarityFrame(item.rarity);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border-2 text-xs"
                        style={{ borderColor: frame.border, background: frame.bg }}
                      >
                        <div>
                          <p className="font-bold text-[#1E4580]">
                            {item.itemName}
                          </p>
                          <span className="text-[10px] text-[#4AA0D0]">
                            {item.bannerName} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-xs" style={{ color: frame.star }}>
                            {'★'.repeat(item.rarity)}
                          </span>
                          {item.isNew && (
                            <p className="text-[9px] text-[#E56593] font-extrabold">¡NUEVO!</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ PROBABILITIES MODAL ============ */}
        {showProbModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="gl-card p-5 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b-[3px] border-[#A8DEF8] pb-2">
                <h3 className="font-display font-bold text-base text-[#1E4580] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#63B34C]" />
                  <span>Probabilidades de Invocación</span>
                </h3>
                <button onClick={() => setShowProbModal(false)} className="gl-btn gl-btn-white px-3 py-1 text-xs">
                  Cerrar
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl border-2 border-[#FF87B2]" style={{ background: 'linear-gradient(180deg,#FFD9E7,#FFB1CE)' }}>
                  <span className="font-black text-[#C2406F]">6★ Ultra Legendario</span>
                  <span className="font-extrabold text-[#C2406F]">1.0%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl border-2 border-[#E5B84B]" style={{ background: 'linear-gradient(180deg,#FFF3B8,#FFE06B)' }}>
                  <span className="font-black text-[#8A6414]">5★ Super Raro</span>
                  <span className="font-extrabold text-[#8A6414]">4.0%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl border-2 border-[#8F6DC4]" style={{ background: 'linear-gradient(180deg,#E4D9F7,#C9B5EC)' }}>
                  <span className="font-black text-[#6B44A8]">4★ Raro</span>
                  <span className="font-extrabold text-[#6B44A8]">20.0%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl border-2 border-[#4AA0D0]" style={{ background: 'linear-gradient(180deg,#DFF1FF,#A8DEF8)' }}>
                  <span className="font-black text-[#1E4580]">3★ Común</span>
                  <span className="font-extrabold text-[#1E4580]">75.0%</span>
                </div>
                <p className="text-[11px] text-[#4AA0D0] pt-2 border-t-2 border-[#A8DEF8]">
                  ✨ <strong>Garantía de Spawn 10:</strong> Al realizar una tirada de 10 invocaciones, al menos 1 objeto está 100% garantizado de ser 4★ o superior.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GachaMode;
