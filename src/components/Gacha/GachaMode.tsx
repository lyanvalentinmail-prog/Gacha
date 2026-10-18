import React, { useState } from 'react';
import { GachaBanner, GachaItem, PullHistoryItem, Rarity } from '../../types';
import { GACHA_BANNERS, ALL_GACHA_ITEMS } from '../../data/items';
import { Sparkles, Gem, History, Gift, Check, ArrowRight, Star, ShieldCheck, Flame } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

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

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 max-w-6xl mx-auto w-full overflow-y-auto space-y-5">
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
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] text-white shadow-cute border-transparent scale-102'
                  : 'bg-white/80 hover:bg-pink-50 text-[#7A6E85] border-pink-100'
              }`}
            >
              {banner.name}
            </button>
          );
        })}
      </div>

      {/* Main Banner Showcase Card */}
      <div
        className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-cute-lg bg-gradient-to-br ${activeBanner.coverGradient} text-white min-h-[300px] sm:min-h-[360px] flex flex-col justify-between`}
      >
        {/* Decorative celestial background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Banner Top Header Info */}
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-pink-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Banner Especial de Deseos</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
            {activeBanner.name}
          </h2>
          <p className="text-sm sm:text-base font-bold text-white/90">
            {activeBanner.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-pink-100/80 font-medium">
            {activeBanner.tagline}
          </p>
        </div>

        {/* Featured Items Preview Badges */}
        <div className="relative z-10 my-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-yellow-200 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-yellow-300" /> Destacados 5★/6★:
          </span>
          {activeBanner.featuredItems.map((itemId) => {
            const it = ALL_GACHA_ITEMS.find((i) => i.id === itemId);
            if (!it) return null;
            return (
              <span
                key={itemId}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/25 backdrop-blur-md text-[11px] font-extrabold border border-white/30 text-white"
              >
                <span className="text-yellow-300">★{it.rarity}</span>
                <span>{it.name}</span>
              </span>
            );
          })}
        </div>

        {/* Pull Buttons & Action Footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProbModal(true)}
              className="text-xs font-bold text-pink-200 hover:text-white underline"
            >
              Probabilidades (Rates)
            </button>
            <span className="text-white/40">•</span>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="text-xs font-bold text-pink-200 hover:text-white flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              <span>Historial ({pullHistory.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* 1x Pull Button */}
            <button
              onClick={() => handlePull(1)}
              disabled={isPulling}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-md border border-white/40 font-extrabold text-sm transition-all shadow-sm hover:scale-105"
            >
              <span>1x Tirada</span>
              <span className="flex items-center gap-1 text-yellow-300 font-black">
                <Gem className="w-3.5 h-3.5" /> 100
              </span>
            </button>

            {/* 10x Pull Button */}
            <button
              onClick={() => handlePull(10)}
              disabled={isPulling}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-purple-950 font-black text-sm shadow-cute hover:scale-105 transition-all"
            >
              <span>10x Invocación</span>
              <span className="flex items-center gap-1 text-purple-900 bg-white/40 px-2 py-0.5 rounded-lg text-xs font-black">
                <Gem className="w-3.5 h-3.5" /> 900
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Collection Teaser */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-pink-100 shadow-sm">
        <div>
          <p className="text-xs font-extrabold text-[#3D344B]">
            Colección Desbloqueada: {unlockedSet.size} / {ALL_GACHA_ITEMS.length} artículos
          </p>
          <p className="text-[11px] text-[#7A6E85]">
            Todos los artículos que obtengas pueden ser equipados inmediatamente en el Editor de Personajes.
          </p>
        </div>
        <button
          onClick={onOpenCollection}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-[#FF6F91] font-extrabold text-xs transition-all"
        >
          <span>Ver Armario</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pull Animation Overlay */}
      {isPulling && (
        <div className="fixed inset-0 z-50 bg-[#1A102F]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white space-y-6 animate-fadeIn">
          {/* Summoning Rune Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-pink-400/60 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-4 rounded-full border-2 border-purple-400/80 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 animate-pulse-glow flex items-center justify-center shadow-[0_0_60px_#FF6F91]">
              <Sparkles className="w-16 h-16 text-white animate-spin origin-center" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-cyan-200">
            ¡Invocando deseos a las constelaciones...!
          </h3>
        </div>
      )}

      {/* Pull Results Modal */}
      {pullResults && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#2B1B32] to-[#1A102F] text-white rounded-3xl p-6 max-w-3xl w-full border border-pink-500/40 shadow-cute-lg space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-300">
                  ¡Resultados de la Invocación!
                </h3>
                <p className="text-xs text-white/60">
                  {pullResults.length} objetos obtenidos
                </p>
              </div>
              <button
                onClick={() => setPullResults(null)}
                className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {pullResults.map((res, idx) => {
                const item = res.item;
                const is6Star = item.rarity === 6;
                const is5Star = item.rarity === 5;
                const is4Star = item.rarity === 4;

                return (
                  <div
                    key={idx}
                    className={`relative p-3 rounded-2xl flex flex-col items-center text-center border transition-all ${
                      is6Star
                        ? 'bg-gradient-to-b from-purple-900/80 to-pink-900/80 border-cyan-400 ring-2 ring-cyan-400/80 shadow-[0_0_15px_#00F0FF]'
                        : is5Star
                        ? 'bg-gradient-to-b from-amber-950/80 to-purple-950/80 border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_15px_#FFD700]'
                        : is4Star
                        ? 'bg-purple-950/60 border-purple-400'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    {/* New Badge */}
                    {res.isNew && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                        ¡NUEVO!
                      </span>
                    )}

                    {/* Star Rarity */}
                    <span
                      className={`text-xs font-black mb-1 ${
                        is6Star
                          ? 'text-cyan-300'
                          : is5Star
                          ? 'text-amber-300'
                          : is4Star
                          ? 'text-purple-300'
                          : 'text-blue-300'
                      }`}
                    >
                      {getRarityStar(item.rarity)}
                    </span>

                    {/* Visual Preview Box */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center my-1 border border-white/20 shadow-inner"
                      style={{ backgroundColor: item.previewColor || '#9B72CF' }}
                    >
                      <Sparkles className="w-6 h-6 text-white drop-shadow" />
                    </div>

                    <p className="text-xs font-extrabold text-white truncate w-full mt-1">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-white/50 uppercase">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setPullResults(null);
                  onOpenCollection();
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Ir a Colección
              </button>
              <button
                onClick={() => {
                  setPullResults(null);
                  handlePull(pullResults.length === 10 ? 10 : 1);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-black text-xs shadow-cute"
              >
                Tirar Otra Vez
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full border border-pink-200 shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2">
              <h3 className="font-extrabold text-base text-[#3D344B] flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#7E57C2]" />
                <span>Historial de Invocaciones</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {pullHistory.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-8">
                  Aún no has realizado ninguna tirada. ¡Prueba tu suerte!
                </p>
              ) : (
                pullHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-pink-100 bg-pink-50/40 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#3D344B]">
                        {item.itemName}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {item.bannerName} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-black text-xs ${
                          item.rarity >= 5 ? 'text-amber-600' : item.rarity === 4 ? 'text-purple-600' : 'text-blue-500'
                        }`}
                      >
                        {'★'.repeat(item.rarity)}
                      </span>
                      {item.isNew && (
                        <p className="text-[9px] text-pink-500 font-extrabold">¡NUEVO!</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Probabilities Modal */}
      {showProbModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full border border-pink-200 shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2">
              <h3 className="font-extrabold text-base text-[#3D344B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Probabilidades de Invocación</span>
              </h3>
              <button
                onClick={() => setShowProbModal(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-purple-50">
                <span className="font-black text-purple-700">6★ Ultra Legendario</span>
                <span className="font-extrabold text-purple-900">1.0%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50">
                <span className="font-black text-amber-700">5★ Super Raro</span>
                <span className="font-extrabold text-amber-900">4.0%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-indigo-50">
                <span className="font-black text-indigo-700">4★ Raro</span>
                <span className="font-extrabold text-indigo-900">20.0%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50">
                <span className="font-black text-blue-700">3★ Común</span>
                <span className="font-extrabold text-blue-900">75.0%</span>
              </div>
              <p className="text-[11px] text-gray-500 pt-2 border-t border-pink-100">
                ✨ <strong>Garantía de Tirada Múltiple (10x):</strong> Al realizar una tirada de 10 invocaciones, al menos 1 objeto está 100% garantizado de ser 4★ o superior.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
