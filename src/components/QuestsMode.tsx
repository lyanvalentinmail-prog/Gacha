import React, { useState } from 'react';
import { Quest } from '../types';
import { Trophy, Gem, Check, Gift, Sparkles, Award } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

interface QuestsModeProps {
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
  onClaimFreeBonus: () => void;
}

export const QuestsMode: React.FC<QuestsModeProps> = ({
  quests,
  onClaimQuest,
  onClaimFreeBonus,
}) => {
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const completedCount = quests.filter((q) => q.isCompleted).length;
  const progressPercent = Math.round((completedCount / quests.length) * 100);

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 max-w-4xl mx-auto w-full overflow-y-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FF6F91] via-[#FF9EAA] to-[#9B72CF] rounded-3xl p-6 sm:p-8 text-white shadow-cute flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Misiones & Recompensas Diarias</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            ¡Consigue Gemas Estelares Gratis!
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 font-medium mt-1">
            Cumple objetivos creando personajes, diseñando escenas o invocando en el Gacha.
          </p>
        </div>

        {/* Free bonus instant claim */}
        <button
          onClick={() => {
            playSound('coin');
            onClaimFreeBonus();
            setBonusClaimed(true);
            setTimeout(() => setBonusClaimed(false), 2000);
          }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-400 text-purple-950 font-black text-sm shadow-cute hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex items-center justify-center gap-2"
        >
          <Gift className="w-5 h-5 text-purple-900" />
          <span>{bonusClaimed ? '¡+1,000 Reclamado!' : 'Reclamar Bono Diario (+1,000 💎)'}</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-pink-200/80 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-[#3D344B]">
            Progreso de Misiones
          </h3>
          <p className="text-xs text-[#7A6E85]">
            {completedCount} de {quests.length} misiones completadas
          </p>
        </div>
        <div className="w-44 h-3 rounded-full bg-pink-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {quests.map((q) => {
          const isDone = q.isCompleted;
          const canClaim = !isDone && q.progress >= q.target;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-3xl border flex items-center justify-between gap-4 transition-all ${
                isDone
                  ? 'bg-gray-50/70 border-gray-200 opacity-60'
                  : 'bg-white hover:bg-pink-50/40 border-pink-200 shadow-sm hover:shadow-cute'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-pink-100/70 border border-pink-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {q.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#3D344B]">
                    {q.title}
                  </h4>
                  <p className="text-xs text-[#7A6E85] mt-0.5">
                    {q.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {isDone ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 font-extrabold text-xs">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Completada</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      playSound('coin');
                      onClaimQuest(q.id);
                    }}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all ${
                      canClaim
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 shadow-cute hover:scale-105 active:scale-95'
                        : 'bg-pink-100 hover:bg-pink-200 text-[#FF6F91]'
                    }`}
                  >
                    <Gem className="w-3.5 h-3.5" />
                    <span>Reclamar +{q.rewardGems} 💎</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
