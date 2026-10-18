import React, { useState, useRef } from 'react';
import { Character, StudioScene, StudioCharacterInstance, StudioStickerInstance } from '../../types';
import { ChibiRenderer } from '../../renderer/ChibiRenderer';
import { BACKGROUND_OPTIONS, STICKER_OPTIONS, POSE_OPTIONS } from '../../data/items';
import { exportStudioScene } from '../../utils/exportUtils';
import {
  Camera,
  Plus,
  Trash2,
  RotateCw,
  FlipHorizontal,
  Layers,
  MessageSquare,
  Image as ImageIcon,
  Smile,
  Save,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  X,
  Check,
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface StudioModeProps {
  characters: Character[];
  savedScenes: StudioScene[];
  onSaveScenes: (scenes: StudioScene[]) => void;
  onRewardQuest?: (questId: string) => void;
}

export const StudioMode: React.FC<StudioModeProps> = ({
  characters,
  savedScenes,
  onSaveScenes,
  onRewardQuest,
}) => {
  const [scenes, setScenes] = useState<StudioScene[]>(savedScenes);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Active scene
  const activeScene = scenes[currentSceneIndex] || scenes[0];

  // Selected element in scene (character instanceId or sticker instanceId)
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    activeScene.characters[0]?.instanceId || null
  );

  // Modal states
  const [showAddCharModal, setShowAddCharModal] = useState<boolean>(false);
  const [showBgModal, setShowBgModal] = useState<boolean>(false);
  const [showStickerModal, setShowStickerModal] = useState<boolean>(false);
  const [showBubbleEditor, setShowBubbleEditor] = useState<boolean>(false);
  const [bubbleText, setBubbleText] = useState<string>('');
  const [bubbleStyle, setBubbleStyle] = useState<'speech' | 'thought' | 'shout' | 'whisper' | 'heart'>('speech');
  const [bubbleTail, setBubbleTail] = useState<'left' | 'right'>('left');

  // Dragging state
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update active scene helper
  const updateActiveScene = (updater: (prev: StudioScene) => StudioScene) => {
    const updatedScenes = [...scenes];
    const newScene = updater(activeScene);
    updatedScenes[currentSceneIndex] = newScene;
    setScenes(updatedScenes);
    onSaveScenes(updatedScenes);
  };

  // Get selected character instance
  const selectedChar = activeScene.characters.find((c) => c.instanceId === selectedInstanceId);
  const selectedSticker = activeScene.stickers.find((s) => s.instanceId === selectedInstanceId);

  // Add character to scene
  const handleAddCharacter = (char: Character) => {
    playSound('pop');
    const newInstance: StudioCharacterInstance = {
      instanceId: `char_inst_${Date.now()}`,
      character: { ...char },
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      flip: false,
      zIndex: activeScene.characters.length + 1,
    };
    updateActiveScene((s) => ({
      ...s,
      characters: [...s.characters, newInstance],
    }));
    setSelectedInstanceId(newInstance.instanceId);
    setShowAddCharModal(false);
  };

  // Add sticker to scene
  const handleAddSticker = (stickerId: string) => {
    playSound('pop');
    const newStk: StudioStickerInstance = {
      instanceId: `stk_inst_${Date.now()}`,
      stickerId,
      x: 50,
      y: 30,
      scale: 1,
      rotation: 0,
      zIndex: 10,
    };
    updateActiveScene((s) => ({
      ...s,
      stickers: [...s.stickers, newStk],
    }));
    setSelectedInstanceId(newStk.instanceId);
    setShowStickerModal(false);
  };

  // Remove selected element
  const handleRemoveSelected = () => {
    if (!selectedInstanceId) return;
    playSound('delete');
    updateActiveScene((s) => ({
      ...s,
      characters: s.characters.filter((c) => c.instanceId !== selectedInstanceId),
      stickers: s.stickers.filter((st) => st.instanceId !== selectedInstanceId),
    }));
    setSelectedInstanceId(null);
  };

  // Flip horizontal
  const handleFlipSelected = () => {
    if (!selectedChar) return;
    playSound('click');
    updateActiveScene((s) => ({
      ...s,
      characters: s.characters.map((c) =>
        c.instanceId === selectedChar.instanceId ? { ...c, flip: !c.flip } : c
      ),
    }));
  };

  // Rotate
  const handleRotateSelected = (delta: number) => {
    if (selectedChar) {
      updateActiveScene((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.instanceId === selectedChar.instanceId
            ? { ...c, rotation: (c.rotation + delta) % 360 }
            : c
        ),
      }));
    } else if (selectedSticker) {
      updateActiveScene((s) => ({
        ...s,
        stickers: s.stickers.map((st) =>
          st.instanceId === selectedSticker.instanceId
            ? { ...st, rotation: (st.rotation + delta) % 360 }
            : st
        ),
      }));
    }
  };

  // Scale
  const handleScaleSelected = (newScale: number) => {
    if (selectedChar) {
      updateActiveScene((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.instanceId === selectedChar.instanceId ? { ...c, scale: newScale } : c
        ),
      }));
    } else if (selectedSticker) {
      updateActiveScene((s) => ({
        ...s,
        stickers: s.stickers.map((st) =>
          st.instanceId === selectedSticker.instanceId ? { ...st, scale: newScale } : st
        ),
      }));
    }
  };

  // Layer ordering
  const handleBringForward = () => {
    if (selectedChar) {
      updateActiveScene((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.instanceId === selectedChar.instanceId ? { ...c, zIndex: c.zIndex + 1 } : c
        ),
      }));
    }
  };

  const handleSendBackward = () => {
    if (selectedChar && selectedChar.zIndex > 0) {
      updateActiveScene((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.instanceId === selectedChar.instanceId ? { ...c, zIndex: c.zIndex - 1 } : c
        ),
      }));
    }
  };

  // Change character pose inside scene
  const handleChangePose = (poseId: string) => {
    if (!selectedChar) return;
    playSound('equip');
    updateActiveScene((s) => ({
      ...s,
      characters: s.characters.map((c) =>
        c.instanceId === selectedChar.instanceId
          ? {
              ...c,
              character: {
                ...c.character,
                parts: { ...c.character.parts, pose: poseId },
              },
            }
          : c
      ),
    }));
  };

  // Change speech bubble
  const handleSaveBubble = () => {
    if (!selectedChar) return;
    playSound('pop');
    updateActiveScene((s) => ({
      ...s,
      characters: s.characters.map((c) =>
        c.instanceId === selectedChar.instanceId
          ? {
              ...c,
              bubble: bubbleText.trim()
                ? { text: bubbleText.trim(), style: bubbleStyle, tailSide: bubbleTail }
                : undefined,
            }
          : c
      ),
    }));
    setShowBubbleEditor(false);
  };

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedInstanceId(id);
    setIsDragging(true);
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sceneRef.current || !selectedInstanceId) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const relX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const relY = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));

    if (selectedChar) {
      updateActiveScene((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.instanceId === selectedInstanceId ? { ...c, x: relX, y: relY } : c
        ),
      }));
    } else if (selectedSticker) {
      updateActiveScene((s) => ({
        ...s,
        stickers: s.stickers.map((st) =>
          st.instanceId === selectedInstanceId ? { ...st, x: relX, y: relY } : st
        ),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export scene to PNG
  const handleExportScenePng = async () => {
    if (!sceneRef.current) return;
    playSound('camera');
    try {
      await exportStudioScene(sceneRef.current, activeScene.name);
      if (onRewardQuest) onRewardQuest('quest_export_png');
    } catch (e) {
      console.error(e);
      alert('Error al exportar la escena.');
    }
  };

  // Find current background
  const bgObj = BACKGROUND_OPTIONS.find((b) => b.id === activeScene.backgroundId) || BACKGROUND_OPTIONS[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#B3E5FB]">
      {/* Top Studio Control Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#74C9F0] p-2.5 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto z-30">
        <div className="flex items-center gap-2">
          {/* Scene selector & name */}
          <div className="flex items-center gap-1.5 bg-[#EAF6FF] px-3 py-1.5 rounded-2xl border border-[#74C9F0]">
            <FolderOpen className="w-4 h-4 text-[#1E4580]" />
            <input
              type="text"
              value={activeScene.name}
              onChange={(e) => updateActiveScene((s) => ({ ...s, name: e.target.value }))}
              className="text-xs sm:text-sm font-extrabold text-[#1E4580] bg-transparent focus:outline-none w-36 sm:w-56"
            />
          </div>

          {/* New Scene Slot */}
          <button
            onClick={() => {
              playSound('pop');
              const newScene: StudioScene = {
                id: `scene_${Date.now()}`,
                name: `Nueva Escena #${scenes.length + 1}`,
                backgroundId: 'bg_classroom',
                characters: [
                  {
                    instanceId: `inst_${Date.now()}`,
                    character: characters[0],
                    x: 50,
                    y: 50,
                    scale: 1,
                    rotation: 0,
                    flip: false,
                    zIndex: 1,
                  },
                ],
                stickers: [],
              };
              const updated = [...scenes, newScene];
              setScenes(updated);
              setCurrentSceneIndex(updated.length - 1);
              onSaveScenes(updated);
            }}
            title="Crear Nueva Escena"
            className="p-2 rounded-xl bg-[#FFB1CE] hover:bg-[#FF87B2] text-[#1E4580] transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Add Char, Change BG, Add Sticker, Export PNG */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              playSound('click');
              setShowAddCharModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFB1CE] hover:bg-[#FF87B2] text-[#E56593] font-bold text-xs transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Personaje</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowBgModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#A8DEF8] hover:bg-[#74C9F0] text-[#1E4580] font-bold text-xs transition-all whitespace-nowrap"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Fondo</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowStickerModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFE06B] hover:bg-[#FFEC9E] text-[#8A6414] font-bold text-xs transition-all whitespace-nowrap"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Stickers</span>
          </button>

          <button
            onClick={handleExportScenePng}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#74C9F0] to-[#4AA0D0] text-white font-extrabold text-xs shadow-cute hover:scale-105 transition-all whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>Exportar PNG</span>
          </button>
        </div>
      </div>

      {/* Main Staging Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Canvas Screen Viewport (16:9 aspect or responsive) */}
        <div
          ref={sceneRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden shadow-cute-lg border-4 border-white select-none bg-gradient-to-br ${bgObj.gradient}`}
        >
          {/* Fondo SVG (assets/items/fondos/) */}
          {bgObj.svg && (
            <svg
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g dangerouslySetInnerHTML={{ __html: bgObj.svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') }} />
            </svg>
          )}
          {/* Background illustration details */}
          {bgObj.id === 'bg_classroom' && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute left-8 top-12 w-64 h-40 border-4 border-amber-800 rounded-lg bg-green-900/40" />
              <div className="absolute right-12 top-10 w-80 h-60 border-2 border-white/60 bg-blue-100/40 rounded-xl" />
            </div>
          )}
          {bgObj.id === 'bg_sakura' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl" />
              <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-pink-200/50 to-transparent" />
            </div>
          )}
          {bgObj.id === 'bg_starlit' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 right-16 w-20 h-20 rounded-full bg-[#FFE06B] shadow-[0_0_50px_#FFF]" />
            </div>
          )}

          {/* Render Characters in Scene */}
          {activeScene.characters.map((inst) => {
            const isSelected = selectedInstanceId === inst.instanceId;
            return (
              <div
                key={inst.instanceId}
                onMouseDown={(e) => handleMouseDown(e, inst.instanceId)}
                style={{
                  left: `${inst.x}%`,
                  top: `${inst.y}%`,
                  transform: `translate(-50%, -50%) scale(${inst.scale}) rotate(${inst.rotation}deg) ${
                    inst.flip ? 'scaleX(-1)' : ''
                  }`,
                  zIndex: inst.zIndex,
                }}
                className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${
                  isSelected ? 'ring-2 ring-[#FF87B2] ring-offset-2 rounded-2xl' : ''
                }`}
              >
                {/* Speech Bubble */}
                {inst.bubble && (
                  <div
                    style={{
                      transform: inst.flip ? 'scaleX(-1)' : 'none',
                    }}
                    className={`studio-bubble absolute -top-16 ${
                      inst.bubble.tailSide === 'left' ? '-left-6' : '-right-6'
                    } min-w-[140px] max-w-[240px] bg-white text-[#1E4580] border-2 border-[#4A3B52] font-bold text-xs px-3 py-2 rounded-2xl shadow-md text-center pointer-events-none z-30`}
                  >
                    {inst.bubble.text}
                    {/* Bubble tail pointer */}
                    <div
                      className={`absolute -bottom-2 ${
                        inst.bubble.tailSide === 'left' ? 'left-6' : 'right-6'
                      } w-3 h-3 bg-white border-r-2 border-b-2 border-[#4A3B52] transform rotate-45`}
                    />
                  </div>
                )}

                {/* Chibi Character */}
                <div className="w-[180px] h-[240px] sm:w-[240px] sm:h-[300px] pointer-events-none">
                  <ChibiRenderer character={inst.character} animate={false} />
                </div>
              </div>
            );
          })}

          {/* Render Stickers */}
          {activeScene.stickers.map((stk) => {
            const isSelected = selectedInstanceId === stk.instanceId;
            const stkData = STICKER_OPTIONS.find((s) => s.id === stk.stickerId);
            return (
              <div
                key={stk.instanceId}
                onMouseDown={(e) => handleMouseDown(e, stk.instanceId)}
                style={{
                  left: `${stk.x}%`,
                  top: `${stk.y}%`,
                  transform: `translate(-50%, -50%) scale(${stk.scale}) rotate(${stk.rotation}deg)`,
                  zIndex: stk.zIndex,
                }}
                className={`absolute cursor-grab active:cursor-grabbing text-4xl sm:text-5xl ${
                  isSelected ? 'ring-2 ring-[#FFD700] rounded-xl' : ''
                }`}
              >
                {stkData?.icon || '✨'}
              </div>
            );
          })}
        </div>

        {/* Selected Element Floating Transform Toolbar */}
        {selectedChar && (
          <div className="absolute bottom-6 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-[#74C9F0] shadow-cute flex items-center gap-2 z-40 max-w-[95vw] overflow-x-auto">
            <span className="text-xs font-black text-[#E56593] px-2 truncate max-w-[120px]">
              {selectedChar.character.name}
            </span>

            {/* Flip */}
            <button
              onClick={handleFlipSelected}
              title="Voltear horizontalmente"
              className="p-1.5 rounded-xl hover:bg-[#FFB1CE] text-[#4AA0D0] hover:text-[#E56593] transition-all"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>

            {/* Rotate */}
            <button
              onClick={() => handleRotateSelected(15)}
              title="Girar +15°"
              className="p-1.5 rounded-xl hover:bg-[#FFB1CE] text-[#4AA0D0] hover:text-[#E56593] transition-all"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Scale Slider */}
            <div className="flex items-center gap-1.5 px-2 border-l border-[#A8DEF8]">
              <span className="text-[10px] font-bold text-[#4AA0D0]">Tamaño</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={selectedChar.scale}
                onChange={(e) => handleScaleSelected(parseFloat(e.target.value))}
                className="w-20 accent-[#FF87B2]"
              />
            </div>

            {/* Change Pose dropdown */}
            <select
              value={selectedChar.character.parts.pose}
              onChange={(e) => handleChangePose(e.target.value)}
              className="text-xs font-bold bg-[#EAF6FF] border border-[#74C9F0] rounded-xl px-2 py-1 text-[#1E4580] focus:outline-none"
            >
              {POSE_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Speech Bubble Button */}
            <button
              onClick={() => {
                setBubbleText(selectedChar.bubble?.text || '');
                setBubbleStyle(selectedChar.bubble?.style || 'speech');
                setBubbleTail(selectedChar.bubble?.tailSide || 'left');
                setShowBubbleEditor(true);
              }}
              title="Editar Diálogo"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EAF6FF] hover:bg-[#C5E8FB] text-[#1E4580] font-bold text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Diálogo</span>
            </button>

            {/* Layers up/down */}
            <div className="flex items-center gap-1 border-l border-[#A8DEF8] pl-1">
              <button
                onClick={handleBringForward}
                title="Traer al frente"
                className="p-1.5 rounded-xl hover:bg-[#FFB1CE] text-[#4AA0D0]"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSendBackward}
                title="Enviar atrás"
                className="p-1.5 rounded-xl hover:bg-[#FFB1CE] text-[#4AA0D0]"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Delete button */}
            <button
              onClick={handleRemoveSelected}
              title="Eliminar de la escena"
              className="p-1.5 rounded-xl hover:bg-red-100 text-red-500 transition-all ml-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal: Add Character to Scene */}
      {showAddCharModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full border border-[#74C9F0] shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#A8DEF8] pb-2">
              <h3 className="font-extrabold text-base text-[#1E4580]">
                Añadir Personaje a la Escena
              </h3>
              <button
                onClick={() => setShowAddCharModal(false)}
                className="p-1 rounded-full hover:bg-[#FFB1CE] text-[#4AA0D0] hover:text-[#2B5FA8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleAddCharacter(char)}
                  className="p-3 rounded-2xl border border-[#A8DEF8] hover:border-[#FF87B2] hover:bg-[#EAF6FF]/50 transition-all flex flex-col items-center text-center shadow-xs group"
                >
                  <div className="w-16 h-20 overflow-hidden relative">
                    <ChibiRenderer character={char} animate={false} scale={0.6} className="w-32 h-32 absolute -top-4 -left-6" />
                  </div>
                  <span className="text-xs font-extrabold text-[#1E4580] group-hover:text-[#E56593] truncate w-full mt-1">
                    {char.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Change Background */}
      {showBgModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xl w-full border border-[#74C9F0] shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#A8DEF8] pb-2">
              <h3 className="font-extrabold text-base text-[#1E4580]">
                Seleccionar Fondo del Estudio
              </h3>
              <button
                onClick={() => setShowBgModal(false)}
                className="p-1 rounded-full hover:bg-[#FFB1CE] text-[#4AA0D0] hover:text-[#2B5FA8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {BACKGROUND_OPTIONS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    playSound('pop');
                    updateActiveScene((s) => ({ ...s, backgroundId: bg.id }));
                    setShowBgModal(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeScene.backgroundId === bg.id
                      ? 'border-[#FF87B2] ring-2 ring-[#FF87B2]/50 shadow-cute scale-105'
                      : 'border-[#A8DEF8] hover:border-[#74C9F0]'
                  }`}
                >
                  <div className={`w-full h-16 rounded-xl mb-2 flex items-center justify-center text-3xl shadow-inner bg-gradient-to-tr ${bg.gradient} overflow-hidden relative`}>
                    {bg.svg ? (
                      <svg
                        viewBox="0 0 800 600"
                        preserveAspectRatio="xMidYMid slice"
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g dangerouslySetInnerHTML={{ __html: bg.svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') }} />
                      </svg>
                    ) : (
                      <span>{bg.icon}</span>
                    )}
                  </div>
                  <p className="text-xs font-extrabold text-[#1E4580] truncate leading-tight">
                    {bg.name}
                  </p>
                  <span className="text-[10px] text-[#8F6DC4] font-semibold">
                    {bg.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Sticker */}
      {showStickerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full border border-[#74C9F0] shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#A8DEF8] pb-2">
              <h3 className="font-extrabold text-base text-[#1E4580]">
                Añadir Sticker Decorativo
              </h3>
              <button
                onClick={() => setShowStickerModal(false)}
                className="p-1 rounded-full hover:bg-[#FFB1CE] text-[#4AA0D0] hover:text-[#2B5FA8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {STICKER_OPTIONS.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => handleAddSticker(stk.id)}
                  className="p-3 rounded-2xl border border-[#A8DEF8] hover:border-[#FFD700] hover:bg-[#FFF3B8]/50 flex flex-col items-center gap-1 transition-all group"
                >
                  <span className="text-4xl group-hover:scale-125 transition-transform">{stk.icon}</span>
                  <span className="text-[10px] font-bold text-[#4AA0D0]">{stk.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Speech Bubble */}
      {showBubbleEditor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full border border-[#74C9F0] shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#A8DEF8] pb-2">
              <h3 className="font-extrabold text-base text-[#1E4580]">
                Bocadillo de Diálogo
              </h3>
              <button
                onClick={() => setShowBubbleEditor(false)}
                className="p-1 rounded-full hover:bg-[#FFB1CE] text-[#4AA0D0] hover:text-[#2B5FA8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4AA0D0] uppercase mb-1">
                Texto del diálogo
              </label>
              <textarea
                value={bubbleText}
                onChange={(e) => setBubbleText(e.target.value)}
                placeholder="Escribe lo que dice el personaje..."
                rows={3}
                className="w-full text-sm font-bold p-3 border border-[#74C9F0] rounded-2xl focus:outline-none focus:border-[#FF87B2] resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-[#4AA0D0] uppercase mb-1">
                  Orientación
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBubbleTail('left')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      bubbleTail === 'left' ? 'bg-[#FF87B2] text-white' : 'bg-[#EAF6FF] text-[#4AA0D0]'
                    }`}
                  >
                    Izquierda
                  </button>
                  <button
                    onClick={() => setBubbleTail('right')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      bubbleTail === 'right' ? 'bg-[#FF87B2] text-white' : 'bg-[#EAF6FF] text-[#4AA0D0]'
                    }`}
                  >
                    Derecha
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setBubbleText('');
                    handleSaveBubble();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#EAF6FF] text-[#2B5FA8] text-xs font-bold"
                >
                  Quitar Bocadillo
                </button>
                <button
                  onClick={handleSaveBubble}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF87B2] to-[#74C9F0] text-white text-xs font-extrabold shadow-cute"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
