import React, { useState } from 'react';
import { Quest } from '../../types';
import { Gem, Check, X, Trophy } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface GemRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
  onClaimFreeBonus: () => void;
}

export const GemRewardModal: React.FC<GemRewardModalProps> = ({
  isOpen,
  onClose,
  quests,
  onClaimQuest,
  onClaimFreeBonus,
}) => {
  const [bonusClaimed, setBonusClaimed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#4A3B52]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="gl-card p-5 sm:p-7 max-w-lg w-full space-y-5 !shadow-lg" onClick={(e) => e.stopPropagation()}>
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-line-rose pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border-[1.5px] border-gold-mid/60" style={{ background: 'linear-gradient(180deg,#FFF4E0,#FFE9BD)' }}>
              <Gem className="w-5 h-5 text-gold-deep animate-bounce-subtle" />
            </div>
            <div>
              <h3 className="gl-title font-display text-lg">
                Gemas Estelares Gratuitas
              </h3>
              <p className="text-xs text-ink-soft">
                Recompensas 100% virtuales para disfrutar sin límites.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn w-8 h-8 !text-rosa-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bono rápido */}
        <div className="p-4 rounded-2xl border-[1.5px] border-gold-mid/60 flex items-center justify-between gap-3 shadow-xs" style={{ background: 'linear-gradient(180deg,#FFF8E8,#FFE9BD)' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h4 className="text-sm font-extrabold text-ink">
                Bono Rápido de Regalo
              </h4>
              <p className="text-xs text-gold-deep">
                ¡Obtén +1,000 Gemas Estelares al instante!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('coin');
              onClaimFreeBonus();
              setBonusClaimed(true);
              setTimeout(() => setBonusClaimed(false), 2000);
            }}
            className="gl-btn gl-btn-pink px-4 py-2 text-xs"
          >
            {bonusClaimed ? '¡Reclamado!' : '+1,000 💎'}
          </button>
        </div>

        {/* Misiones */}
        <div>
          <h4 className="text-xs font-black text-ink-soft uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-gold-deep" />
            <span>Misiones & Logros</span>
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {quests.map((q) => {
              const canClaim = !q.isCompleted && q.progress >= q.target;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border-[1.5px] flex items-center justify-between gap-3 transition-all ${
                    q.isCompleted
                      ? 'bg-panel-lav border-line-lav opacity-70'
                      : 'bg-white border-line-rose shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{q.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-ink truncate">
                        {q.title}
                      </p>
                      <p className="text-[11px] text-ink-soft">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {q.isCompleted ? (
                      <span className="text-xs font-bold text-mint-deep flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Reclamado
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          playSound('coin');
                          onClaimQuest(q.id);
                        }}
                        disabled={!canClaim}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold border-[1.5px] transition-all active:scale-95 ${
                          canClaim
                            ? 'gl-btn-yellow'
                            : 'bg-lav-50 text-ink-faint border-line-lav cursor-default'
                        }`}
                      >
                        <Gem className="w-3 h-3" />
                        <span>+{q.rewardGems}</span>
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

export default GemRewardModal;
