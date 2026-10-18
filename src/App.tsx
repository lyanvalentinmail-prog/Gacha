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
import { toggleSound, getSoundMuted, playSound } from './audio/soundEffects';
import { Header } from './components/Header';
import { CharacterEditor } from './components/Editor/CharacterEditor';
import { StudioMode } from './components/Studio/StudioMode';
import { GachaMode } from './components/Gacha/GachaMode';
import { CollectionMode } from './components/Collection/CollectionMode';
import { QuestsMode } from './components/QuestsMode';
import { GemRewardModal } from './components/Gacha/GemRewardModal';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'editor' | 'studio' | 'gacha' | 'collection' | 'quests'>('editor');

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#FFF0F5] via-[#F5F0FF] to-[#FFF5FA]">
      {/* 1. Header with navigation tabs, gem counter, sound toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gems={gems}
        onOpenGemShop={() => setShowGemModal(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Main Game Viewport */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {activeTab === 'editor' && (
          <CharacterEditor
            characters={characters}
            activeSlot={activeSlot}
            onSelectSlot={(idx) => setActiveSlot(idx)}
            onUpdateCharacter={handleUpdateCurrentCharacter}
            onCreateSlot={handleCreateSlot}
            onDuplicateSlot={handleDuplicateSlot}
            onDeleteSlot={handleDeleteSlot}
            onRenameSlot={handleRenameSlot}
            unlockedSet={unlockedSet}
            onTriggerSaveNotification={() => handleRewardQuest('quest_first_character')}
          />
        )}

        {activeTab === 'studio' && (
          <StudioMode
            characters={characters}
            savedScenes={savedScenes}
            onSaveScenes={setSavedScenes}
            onRewardQuest={handleRewardQuest}
          />
        )}

        {activeTab === 'gacha' && (
          <GachaMode
            gems={gems}
            onUpdateGems={setGems}
            unlockedSet={unlockedSet}
            onUnlockItems={handleUnlockItems}
            pullHistory={pullHistory}
            onAddHistory={(recs) => setPullHistory((h) => [...recs, ...h])}
            onRewardQuest={handleRewardQuest}
            onOpenCollection={() => setActiveTab('collection')}
          />
        )}

        {activeTab === 'collection' && (
          <CollectionMode
            unlockedSet={unlockedSet}
            currentCharacter={currentCharacter}
            onEquipItem={handleEquipFromCollection}
            onGoToEditor={() => setActiveTab('editor')}
          />
        )}

        {activeTab === 'quests' && (
          <QuestsMode
            quests={quests}
            onClaimQuest={handleClaimQuest}
            onClaimFreeBonus={handleClaimFreeBonus}
          />
        )}
      </div>

      {/* 3. Free Gems & Daily Bonus Modal */}
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
