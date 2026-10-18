import React, { useState, useEffect } from 'react';
import { Character, StudioScene, PullHistoryItem, Quest, GachaItem } from './types';
import {
  loadCharacters,
  saveCharacters,
  loadActiveSlot,
  saveActiveSlot,
  loadGems,
  saveGems,
  loadUnlockedItems,
  saveUnlockedItems,
  loadPullHistory,
  savePullHistory,
  loadScenes,
  saveScenes,
  loadQuests,
  saveQuests,
} from './utils/storage';
import { toggleSound, getSoundMuted } from './audio/soundEffects';
import { ModeBar } from './components/ModeBar';
import { HomeScreen } from './components/Home/HomeScreen';
import { StudioMode } from './components/Studio/StudioMode';
import { GachaMode } from './components/Gacha/GachaMode';
import { CollectionMode } from './components/Collection/CollectionMode';
import { QuestsMode } from './components/QuestsMode';
import { GemRewardModal } from './components/Gacha/GemRewardModal';

type Screen = 'home' | 'studio' | 'gacha' | 'collection' | 'quests';

const SCREEN_TITLES: Record<Exclude<Screen, 'home'>, string> = {
  studio: 'Estudio de Escenas',
  gacha: 'Gacha Estelar',
  collection: 'Colección',
  quests: 'Misiones & Juegos',
};

export const App: React.FC = () => {
  // Navigation State
  const [screen, setScreen] = useState<Screen>('home');

  // Persistence States
  const [characters, setCharacters] = useState<Character[]>(() => loadCharacters());
  const [activeSlot, setActiveSlot] = useState<number>(() => loadActiveSlot());
  const [gems, setGems] = useState<number>(() => loadGems());
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(() => loadUnlockedItems());
  const [pullHistory, setPullHistory] = useState<PullHistoryItem[]>(() => loadPullHistory());
  const [savedScenes, setSavedScenes] = useState<StudioScene[]>(() => loadScenes());
  const [quests, setQuests] = useState<Quest[]>(() => loadQuests());
  const [isMuted, setIsMuted] = useState<boolean>(() => getSoundMuted());

  // Modal State
  const [showGemModal, setShowGemModal] = useState<boolean>(false);

  // Sync state to storage
  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  useEffect(() => {
    saveActiveSlot(activeSlot);
  }, [activeSlot]);

  useEffect(() => {
    saveGems(gems);
  }, [gems]);

  useEffect(() => {
    saveUnlockedItems(unlockedSet);
  }, [unlockedSet]);

  useEffect(() => {
    savePullHistory(pullHistory);
  }, [pullHistory]);

  useEffect(() => {
    saveScenes(savedScenes);
  }, [savedScenes]);

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  // Sound toggle
  const handleToggleMute = () => {
    const muted = toggleSound();
    setIsMuted(muted);
  };

  // Character updates
  const handleUpdateCurrentCharacter = (updated: Character) => {
    setCharacters((prev) => {
      const next = [...prev];
      next[activeSlot] = updated;
      return next;
    });
  };

  // Slots management
  const handleCreateSlot = () => {
    const newChar: Character = {
      ...characters[0],
      id: `char_${Date.now()}`,
      name: `Personaje #${characters.length + 1}`,
      title: 'Nuevo Creador',
      bio: '¡Personaliza mi atuendo y dale vida a mi historia!',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const nextList = [...characters, newChar];
    setCharacters(nextList);
    setActiveSlot(nextList.length - 1);
  };

  const handleDuplicateSlot = (index: number) => {
    const target = characters[index];
    if (!target) return;
    const duplicated: Character = {
      ...target,
      id: `char_${Date.now()}`,
      name: `${target.name} (Copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const nextList = [...characters, duplicated];
    setCharacters(nextList);
    setActiveSlot(nextList.length - 1);
  };

  const handleDeleteSlot = (index: number) => {
    if (characters.length <= 1) return;
    const nextList = characters.filter((_, i) => i !== index);
    setCharacters(nextList);
    setActiveSlot(Math.max(0, index - 1));
  };

  const handleRenameSlot = (index: number, newName: string) => {
    setCharacters((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], name: newName, updatedAt: Date.now() };
      }
      return next;
    });
  };

  // Gacha item unlocks
  const handleUnlockItems = (itemIds: string[]) => {
    setUnlockedSet((prev) => {
      const next = new Set(prev);
      itemIds.forEach((id) => next.add(id));
      return next;
    });
  };

  // Equip item from collection
  const handleEquipFromCollection = (item: GachaItem) => {
    const currentChar = characters[activeSlot];
    if (!currentChar) return;

    const updatedChar: Character = {
      ...currentChar,
      parts: {
        ...currentChar.parts,
        [item.partKey]: item.partValue,
      },
      updatedAt: Date.now(),
    };
    handleUpdateCurrentCharacter(updatedChar);
  };

  // Claim Quest Rewards
  const handleClaimQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.isCompleted) {
          setGems((g) => g + q.rewardGems);
          return { ...q, isCompleted: true, progress: q.target };
        }
        return q;
      })
    );
  };

  // Quest automatic progress triggers
  const handleRewardQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.isCompleted) {
          return { ...q, progress: q.target };
        }
        return q;
      })
    );
  };

  // Free bonus gems
  const handleClaimFreeBonus = () => {
    setGems((g) => g + 1000);
  };

  const currentCharacter = characters[activeSlot] || characters[0];

  return (
    <div className="app-shell flex flex-col overflow-hidden bg-[#C9CBF2]">
      {/* Barra superior solo fuera del menú principal */}
      {screen !== 'home' && (
        <ModeBar
          title={SCREEN_TITLES[screen as Exclude<Screen, 'home'>]}
          onBack={() => setScreen('home')}
          gems={gems}
          onOpenGemShop={() => setShowGemModal(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Vistas principales */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {screen === 'home' && (
          <HomeScreen
            characters={characters}
            activeSlot={activeSlot}
            onSelectSlot={setActiveSlot}
            onUpdateCharacter={handleUpdateCurrentCharacter}
            onCreateSlot={handleCreateSlot}
            onDuplicateSlot={handleDuplicateSlot}
            onDeleteSlot={handleDeleteSlot}
            onRenameSlot={handleRenameSlot}
            unlockedSet={unlockedSet}
            gems={gems}
            onOpenGemShop={() => setShowGemModal(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onNavigate={(s) => setScreen(s)}
            onRewardQuest={handleRewardQuest}
          />
        )}

        {screen === 'studio' && (
          <StudioMode
            characters={characters}
            savedScenes={savedScenes}
            onSaveScenes={setSavedScenes}
            onRewardQuest={handleRewardQuest}
          />
        )}

        {screen === 'gacha' && (
          <GachaMode
            gems={gems}
            onUpdateGems={setGems}
            unlockedSet={unlockedSet}
            onUnlockItems={handleUnlockItems}
            pullHistory={pullHistory}
            onAddHistory={(recs) => setPullHistory((h) => [...recs, ...h])}
            onRewardQuest={handleRewardQuest}
            onOpenCollection={() => setScreen('collection')}
          />
        )}

        {screen === 'collection' && (
          <CollectionMode
            unlockedSet={unlockedSet}
            currentCharacter={currentCharacter}
            onEquipItem={handleEquipFromCollection}
            onGoToEditor={() => setScreen('home')}
          />
        )}

        {screen === 'quests' && (
          <QuestsMode
            quests={quests}
            onClaimQuest={handleClaimQuest}
            onClaimFreeBonus={handleClaimFreeBonus}
          />
        )}
      </div>

      {/* Modal de gemas / recompensas */}
      <GemRewardModal
        isOpen={showGemModal}
        onClose={() => setShowGemModal(false)}
        quests={quests}
        onClaimQuest={handleClaimQuest}
        onClaimFreeBonus={handleClaimFreeBonus}
      />
    </div>
  );
};

export default App;
