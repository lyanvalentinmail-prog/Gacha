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
          {/* Encabezado */}
          <div
            className="rounded-[26px] border-[1.5px] border-white p-6 sm:p-8 text-white shadow-cute flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg,#FFD9E5 0%,#FF9DB8 55%,#CFC4EE 100%)' }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-xs font-black uppercase tracking-wider mb-2 text-ink border border-white">
                <Trophy className="w-4 h-4 text-gold-deep" />
                <span>Misiones & Recompensas Diarias</span>
              </div>
              <h2 className="gl-title-light text-2xl sm:text-3xl font-display font-bold">
                ¡Consigue Gemas Estelares Gratis!
              </h2>
              <p className="text-xs sm:text-sm font-medium mt-1 text-white drop-shadow-sm">
                Cumple objetivos creando personajes, diseñando escenas o invocando en el Gacha.
              </p>
            </div>

            {/* Bono diario */}
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
              <span>{bonusClaimed ? '¡+1,000 Reclamado!' : 'Bono Diario (+1,000 💎)'}</span>
            </button>
          </div>

          {/* Progreso */}
          <div className="gl-card p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-ink">
                Progreso de Misiones
              </h3>
              <p className="text-xs text-ink-soft">
                {completedCount} de {quests.length} misiones completadas
              </p>
            </div>
            <div className="gl-bar h-3 w-44">
              <div className="gl-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Lista de misiones */}
          <div className="space-y-3">
            {quests.map((q) => {
              const isDone = q.isCompleted;
              const canClaim = !isDone && q.progress >= q.target;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border-[1.5px] flex items-center justify-between gap-4 transition-all ${
                    isDone
                      ? 'bg-panel-lav border-line-lav opacity-70'
                      : 'bg-white border-line-rose shadow-xs card-hover'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-rosa-50 border-[1.5px] border-line-rose flex items-center justify-center text-2xl shrink-0">
                      {q.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-ink">
                        {q.title}
                      </h4>
                      <p className="text-xs text-ink-soft mt-0.5">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-mint-soft text-mint-deep font-extrabold text-xs border-[1.5px] border-mint-mid/50">
                        <Check className="w-4 h-4" />
                        <span>Completada</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          playSound('coin');
                          onClaimQuest(q.id);
                        }}
                        disabled={!canClaim}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs border-[1.5px] transition-all active:scale-95 ${
                          canClaim
                            ? 'gl-btn-yellow'
                            : 'bg-lav-50 text-ink-faint border-line-lav cursor-default'
                        }`}
                      >
                        <Gem className="w-3.5 h-3.5" />
                        <span>+{q.rewardGems} 💎</span>
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
