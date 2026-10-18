import { Character, StudioScene, PullHistoryItem, Quest } from '../types';
import { STARTER_CHARACTERS } from '../data/starterCharacters';
import { ALL_GACHA_ITEMS, STARTER_QUESTS } from '../data/items';

const STORAGE_KEYS = {
  CHARACTERS: 'chibiverse_characters_v2',
  ACTIVE_SLOT: 'chibiverse_active_slot_v2',
  GEMS: 'chibiverse_gems_v2',
  UNLOCKED_ITEMS: 'chibiverse_unlocked_v2',
  PULL_HISTORY: 'chibiverse_history_v2',
  SCENES: 'chibiverse_scenes_v2',
  QUESTS: 'chibiverse_quests_v2',
};

// Initial unlocked items: all 3-star items are unlocked by default
function getInitialUnlocked(): string[] {
  return ALL_GACHA_ITEMS.filter((i) => i.rarity === 3).map((i) => i.id);
}

export function loadCharacters(): Character[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load characters:', e);
  }
  return STARTER_CHARACTERS;
}

export function saveCharacters(characters: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  } catch (e) {
    console.error('Failed to save characters:', e);
  }
}

export function loadActiveSlot(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SLOT);
    if (data !== null) return parseInt(data, 10) || 0;
  } catch {}
  return 0;
}

export function saveActiveSlot(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SLOT, index.toString());
  } catch {}
}

export function loadGems(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GEMS);
    if (data !== null) return parseInt(data, 10);
  } catch {}
  return 3000; // Generous starting balance (enough for 3 multi-pulls!)
}

export function saveGems(gems: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMS, gems.toString());
  } catch {}
}

export function loadUnlockedItems(): Set<string> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_ITEMS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return new Set([...getInitialUnlocked(), ...parsed]);
    }
  } catch {}
  return new Set(getInitialUnlocked());
}

export function saveUnlockedItems(items: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_ITEMS, JSON.stringify(Array.from(items)));
  } catch {}
}

export function loadPullHistory(): PullHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PULL_HISTORY);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}

export function savePullHistory(history: PullHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PULL_HISTORY, JSON.stringify(history.slice(0, 100)));
  } catch {}
}

export function loadScenes(): StudioScene[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCENES);
    if (data) return JSON.parse(data);
  } catch {}

  // Default starter scenes
  const chars = loadCharacters();
  const c1 = chars[0] || STARTER_CHARACTERS[0];
  const c2 = chars[1] || STARTER_CHARACTERS[1];

  return [
    {
      id: 'scene_default_1',
      name: 'Encuentro en el Parque Sakura',
      backgroundId: 'bg_sakura',
      characters: [
        {
          instanceId: 'inst_1',
          character: c1,
          x: 35,
          y: 48,
          scale: 1,
          rotation: 0,
          flip: false,
          zIndex: 1,
          bubble: {
            text: '¡Hola! ¿Vamos a cantar juntas hoy? ✨',
            style: 'speech',
            tailSide: 'left',
          },
        },
        {
          instanceId: 'inst_2',
          character: c2,
          x: 65,
          y: 50,
          scale: 1.05,
          rotation: 0,
          flip: true,
          zIndex: 2,
          bubble: {
            text: '¡Claro! Ya tengo el remix listo 🎧',
            style: 'speech',
            tailSide: 'right',
          },
        },
      ],
      stickers: [
        { instanceId: 'stk_1', stickerId: 'stk_cherry', x: 20, y: 25, scale: 1.2, rotation: 15, zIndex: 0 },
        { instanceId: 'stk_2', stickerId: 'stk_sparkles', x: 50, y: 20, scale: 1.1, rotation: 0, zIndex: 3 },
      ],
    },
  ];
}

export function saveScenes(scenes: StudioScene[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(scenes));
  } catch {}
}

export function loadQuests(): Quest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (data) return JSON.parse(data);
  } catch {}
  return STARTER_QUESTS;
}

export function saveQuests(quests: Quest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch {}
}
