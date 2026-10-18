import React, { useState } from 'react';
import { Quest } from '../../types';
import { Gem, Gift, Check, Sparkles, X, Trophy } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full border border-pink-200 shadow-cute-lg space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-sm">
              <Gem className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#3D344B]">
                Gemas Estelares Gratuitas
              </h3>
              <p className="text-xs text-[#7A6E85]">
                Recompensas 100% virtuales para disfrutar sin límites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-pink-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant Free Bonus Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border border-pink-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h4 className="text-sm font-extrabold text-[#3D344B]">
                Bono Rápido de Regalo
              </h4>
              <p className="text-xs text-[#7A6E85]">
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-105 active:scale-95 text-purple-950 font-black text-xs shadow-cute transition-all"
          >
            {bonusClaimed ? '¡Reclamado!' : '+1,000 💎'}
          </button>
        </div>

        {/* Quests List */}
        <div>
          <h4 className="text-xs font-black text-[#7A6E85] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#9B72CF]" />
            <span>Misiones & Logros</span>
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {quests.map((q) => {
              const canClaim = !q.isCompleted && q.progress >= q.target;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    q.isCompleted
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white hover:bg-pink-50/50 border-pink-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <p className="text-xs font-extrabold text-[#3D344B]">
                        {q.title}
                      </p>
                      <p className="text-[11px] text-[#7A6E85]">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {q.isCompleted ? (
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Reclamado
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          playSound('coin');
                          onClaimQuest(q.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                          canClaim
                            ? 'bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] text-white shadow-cute hover:scale-105'
                            : 'bg-pink-100 text-[#FF6F91] hover:bg-pink-200'
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
