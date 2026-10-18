import React, { useState } from 'react';
import { Quest } from '../types';
import { Trophy, Gem, Check, Gift } from 'lucide-react';
import { playSound } from '../audio/soundEffects';
import { Clouds } from './ui/Clouds';

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
    <div className="flex-1 relative overflow-y-auto">
      <div className="gl-sky min-h-full">
        <Clouds />

        <div className="relative z-10 flex flex-col p-3 sm:p-6 max-w-4xl mx-auto w-full space-y-5">
          {/* Header Banner estilo Gacha Life */}
          <div
            className="rounded-3xl border-[4px] p-6 sm:p-8 text-white shadow-cute flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ borderColor: '#1E4580', background: 'linear-gradient(135deg,#FFB1CE 0%,#FF87B2 45%,#74C9F0 100%)' }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-xs font-black uppercase tracking-wider mb-2 text-[#1E4580] border-2 border-white">
                <Trophy className="w-4 h-4 text-[#E5B84B]" />
                <span>Misiones & Recompensas Diarias</span>
              </div>
              <h2 className="gl-title text-2xl sm:text-3xl font-display font-bold">
                ¡Consigue Gemas Estelares Gratis!
              </h2>
              <p className="text-xs sm:text-sm font-medium mt-1 text-white drop-shadow">
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
              className="gl-btn gl-btn-yellow px-6 py-3 text-sm whitespace-nowrap"
            >
              <Gift className="w-5 h-5" />
              <span>{bonusClaimed ? '¡+1,000 Reclamado!' : 'Reclamar Bono Diario (+1,000 💎)'}</span>
            </button>
          </div>

          {/* Progress Card */}
          <div className="gl-card p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-[#1E4580]">
                Progreso de Misiones
              </h3>
              <p className="text-xs text-[#4AA0D0]">
                {completedCount} de {quests.length} misiones completadas
              </p>
            </div>
            <div className="gl-bar h-3 w-44">
              <div className="gl-bar-fill" style={{ width: `${progressPercent}%` }} />
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
                  className={`p-4 rounded-2xl border-[3px] flex items-center justify-between gap-4 transition-all ${
                    isDone
                      ? 'bg-[#EAF6FF] border-[#74C9F0] opacity-60'
                      : 'bg-white border-[#2B5FA8] shadow-[0_4px_0_#2B5FA8]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#DFF1FF] border-2 border-[#2B5FA8] flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {q.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#1E4580]">
                        {q.title}
                      </h4>
                      <p className="text-xs text-[#4AA0D0] mt-0.5">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C8EFB8] text-[#3E7A2E] font-extrabold text-xs border-2 border-[#63B34C]">
                        <Check className="w-4 h-4" />
                        <span>Completada</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          playSound('coin');
                          onClaimQuest(q.id);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-extrabold text-xs border-2 border-[#2B5FA8] shadow-[0_3px_0_#2B5FA8] active:translate-y-[3px] active:shadow-none transition-all ${
                          canClaim
                            ? 'gl-btn-yellow text-[#1E4580]'
                            : 'bg-[#DFF1FF] text-[#4AA0D0]'
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
      </div>
    </div>
  );
};

export default QuestsMode;
