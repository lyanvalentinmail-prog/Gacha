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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="gl-card p-5 sm:p-7 max-w-lg w-full space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-[3px] border-[#A8DEF8] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm border-2 border-[#2B5FA8]" style={{ background: 'linear-gradient(180deg,#FFF3B8,#FFE06B)' }}>
              <Gem className="w-5 h-5 text-[#1E4580] animate-bounce" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1E4580]">
                Gemas Estelares Gratuitas
              </h3>
              <p className="text-xs text-[#4AA0D0]">
                Recompensas 100% virtuales para disfrutar sin límites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#2B5FA8] bg-[#FF87B2] transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Instant Free Bonus Box */}
        <div className="p-4 rounded-2xl border-[3px] border-[#2B5FA8] flex items-center justify-between gap-3 shadow-[0_3px_0_#2B5FA8]" style={{ background: 'linear-gradient(180deg,#FFF3B8,#FFE06B)' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h4 className="text-sm font-extrabold text-[#1E4580]">
                Bono Rápido de Regalo
              </h4>
              <p className="text-xs text-[#8A6414]">
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

        {/* Quests List */}
        <div>
          <h4 className="text-xs font-black text-[#4AA0D0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#E5B84B]" />
            <span>Misiones & Logros</span>
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {quests.map((q) => {
              const canClaim = !q.isCompleted && q.progress >= q.target;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border-[3px] flex items-center justify-between gap-3 transition-all ${
                    q.isCompleted
                      ? 'bg-[#EAF6FF] border-[#74C9F0] opacity-60'
                      : 'bg-white border-[#2B5FA8] shadow-[0_2px_0_#2B5FA8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <p className="text-xs font-extrabold text-[#1E4580]">
                        {q.title}
                      </p>
                      <p className="text-[11px] text-[#4AA0D0]">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {q.isCompleted ? (
                      <span className="text-xs font-bold text-[#63B34C] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Reclamado
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          playSound('coin');
                          onClaimQuest(q.id);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#2B5FA8] shadow-[0_2px_0_#2B5FA8] active:translate-y-[2px] active:shadow-none ${
                          canClaim
                            ? 'gl-btn-yellow text-[#1E4580]'
                            : 'bg-[#DFF1FF] text-[#4AA0D0]'
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
