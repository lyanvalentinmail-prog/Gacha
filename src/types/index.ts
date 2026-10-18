export type Rarity = 3 | 4 | 5 | 6;

export interface CharacterColors {
  skin: string;
  hairBase: string;
  hairSub: string;
  hairOutline: string;
  eyePrimary: string;
  eyeSecondary: string;
  eyebrows: string;
  mouth: string;
  blush: string;
  topPrimary: string;
  topSecondary: string;
  bottomPrimary: string;
  bottomSecondary: string;
  shoesPrimary: string;
  shoesSecondary: string;
  hatPrimary: string;
  hatSecondary: string;
  glasses: string;
  neck: string;
  wings: string;
  tail: string;
  prop: string;
  aura: string;
}

export interface CharacterParts {
  // Hair
  hairFront: string;
  hairRear: string;
  hairSide: string;
  hairAhoge: string;

  // Face
  eyes: string;
  pupils: string;
  eyebrows: string;
  mouth: string;
  nose: string;
  blush: string;
  expression: string; // normal, happy, wink, angry, crying, shy, smug, shocked, sleepy

  // Body & Skin
  skinTone: string;
  bodyType: 'chibi-standard' | 'chibi-petite';

  // Clothes
  top: string;
  bottom: string;
  outfit: string; // full dress/uniform or 'none'
  shoes: string;
  socks: string;

  // Accessories
  hat: string;
  glasses: string;
  neck: string;
  faceSticker: string;
  wings: string;
  tail: string;
  fantasyEars: string;
  prop: string;
  aura: string;

  // Pose
  pose: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  bio: string;
  element: 'Luz' | 'Sombra' | 'Fuego' | 'Agua' | 'Viento' | 'Astral';
  favorite: string;
  parts: CharacterParts;
  colors: CharacterColors;
  createdAt: number;
  updatedAt: number;
}

export interface StudioCharacterInstance {
  instanceId: string;
  character: Character;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale: number; // 0.4 to 2.5
  rotation: number; // degrees -180 to 180
  flip: boolean;
  zIndex: number;
  bubble?: {
    text: string;
    style: 'speech' | 'thought' | 'shout' | 'whisper' | 'heart';
    tailSide: 'left' | 'right';
  };
}

export interface StudioStickerInstance {
  instanceId: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface StudioScene {
  id: string;
  name: string;
  backgroundId: string;
  characters: StudioCharacterInstance[];
  stickers: StudioStickerInstance[];
  filterEffect?: 'none' | 'sunset' | 'dreamy' | 'cyber' | 'noir';
  showGrid?: boolean;
}

export interface GachaItem {
  id: string;
  name: string;
  category: 'hair' | 'eyes' | 'clothes' | 'hat' | 'wings' | 'tail' | 'prop' | 'aura' | 'preset';
  rarity: Rarity;
  description: string;
  partKey: keyof CharacterParts;
  partValue: string;
  previewColor?: string;
  secondaryColor?: string;
}

export interface GachaBanner {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  coverGradient: string;
  featuredItems: string[]; // item IDs
  rateUpMultiplier: number;
}

export interface PullHistoryItem {
  id: string;
  timestamp: number;
  itemId: string;
  itemName: string;
  rarity: Rarity;
  category: string;
  bannerName: string;
  isNew: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardGems: number;
  icon: string;
  isCompleted: boolean;
  progress: number;
  target: number;
}
