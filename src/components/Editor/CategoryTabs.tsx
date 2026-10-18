import React from 'react';
import {
  Sparkles,
  Smile,
  Scissors,
  Shirt,
  Crown,
  Flame,
  UserCheck,
  Palette,
  HeartHandshake
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

export type MainCategory = 'hair' | 'face' | 'clothes' | 'accessories' | 'fantasy' | 'body_pose' | 'profile';

interface CategoryTabsProps {
  activeCategory: MainCategory;
  onSelectCategory: (category: MainCategory) => void;
}

const CATEGORIES: { id: MainCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'hair', label: 'Cabello', icon: <Scissors className="w-4 h-4" />, color: 'from-[#FF9EAA] to-[#FF6F91]' },
  { id: 'face', label: 'Rostro & Ojos', icon: <Smile className="w-4 h-4" />, color: 'from-[#FFAAA6] to-[#FF85A2]' },
  { id: 'clothes', label: 'Prendas', icon: <Shirt className="w-4 h-4" />, color: 'from-[#9B72CF] to-[#7E57C2]' },
  { id: 'accessories', label: 'Accesorios', icon: <Crown className="w-4 h-4" />, color: 'from-[#FFD166] to-[#FF9E00]' },
  { id: 'fantasy', label: 'Fantasía & Alas', icon: <Sparkles className="w-4 h-4" />, color: 'from-[#48CAE4] to-[#0096C7]' },
  { id: 'body_pose', label: 'Pose & Piel', icon: <UserCheck className="w-4 h-4" />, color: 'from-[#52B788] to-[#2D6A4F]' },
  { id: 'profile', label: 'Perfil & Datos', icon: <HeartHandshake className="w-4 h-4" />, color: 'from-[#F48FB1] to-[#AD1457]' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-pink-100/50 rounded-2xl border border-pink-200/50 overflow-x-auto">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              playSound('click');
              onSelectCategory(cat.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              isActive
                ? `bg-gradient-to-r ${cat.color} text-white shadow-cute scale-[1.02]`
                : 'text-[#7A6E85] hover:text-[#3D344B] hover:bg-white/60'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
