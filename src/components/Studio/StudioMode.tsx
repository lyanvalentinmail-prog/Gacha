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
  FolderOpen,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

type BubbleStyle = NonNullable<StudioCharacterInstance['bubble']>['style'];

interface StudioModeProps {
  characters: Character[];
  savedScenes: StudioScene[];
  onSaveScenes: (scenes: StudioScene[]) => void;
  onRewardQuest?: (questId: string) => void;
}

const BUBBLE_STYLES: { id: BubbleStyle; label: string; icon: string }[] = [
  { id: 'speech', label: 'Hablar', icon: '💬' },
  { id: 'thought', label: 'Pensar', icon: '💭' },
  { id: 'shout', label: 'Gritar', icon: '💥' },
  { id: 'whisper', label: 'Susurrar', icon: '🤫' },
  { id: 'heart', label: 'Corazón', icon: '💖' },
];

/** Bocadillo de diálogo con estilos reales (habla, pensamiento, grito, susurro, corazón). */
const DialogueBubble: React.FC<{ bubble: NonNullable<StudioCharacterInstance['bubble']> }> = ({ bubble }) => {
  const base = 'absolute -top-14 sm:-top-16 min-w-[130px] max-w-[230px] px-3 py-2 text-xs font-bold text-center pointer-events-none z-30';
  const tailPos = bubble.tailSide === 'left' ? 'left-5' : 'right-5';
  const tailSide = bubble.tailSide === 'left' ? '-left-5' : '-right-5';

  switch (bubble.style) {
    case 'thought':
      return (
        <div className={`${base} bg-white/95 border-[1.5px] border-line-lav rounded-[26px] shadow-md text-ink-soft italic`}>
          {bubble.text}
          <span className={`absolute -bottom-4 ${tailPos} w-3 h-3 rounded-full bg-white/95 border-[1.5px] border-line-lav`} />
          <span className={`absolute -bottom-7 ${bubble.tailSide === 'left' ? 'left-4' : 'right-4'} w-2 h-2 rounded-full bg-white/90 border-[1.5px] border-line-lav`} />
        </div>
      );
    case 'shout':
      return (
        <div className={`${base} bg-gold-soft border-[2.5px] border-[#E8A13C] rounded-xl shadow-md text-[#8A5A14] font-black italic uppercase`}>
          {bubble.text}
          <span
            className={`absolute -bottom-[7px] ${tailPos} w-3.5 h-3.5 bg-gold-soft border-b-[2.5px] border-r-[2.5px] border-[#E8A13C] rotate-45`}
          />
        </div>
      );
    case 'whisper':
      return (
        <div className={`${base} bg-white/85 border-[1.5px] border-dashed border-lav-300 rounded-2xl text-ink-faint italic`}>
          {bubble.text}
          <span className={`absolute -bottom-[6px] ${tailPos} w-2.5 h-2.5 bg-white/85 border-b-[1.5px] border-r-[1.5px] border-lav-300 rotate-45`} />
        </div>
      );
    case 'heart':
      return (
        <div className={`${base} text-white rounded-2xl shadow-md border border-rosa-400`} style={{ background: 'linear-gradient(180deg,#FF9DB8,#F97FA5)' }}>
          <span className="mr-1">💖</span>
          {bubble.text}
          <span
            className={`absolute -bottom-[6px] ${tailPos} w-3 h-3 rotate-45 border-b border-r border-rosa-400`}
            style={{ background: '#F97FA5' }}
          />
        </div>
      );
    default:
      return (
        <div className={`${base} bg-white text-ink border-[1.5px] border-line-lav rounded-2xl shadow-md`}>
          {bubble.text}
          <span className={`absolute -bottom-[7px] ${tailPos} w-3 h-3 bg-white border-b-[1.5px] border-r-[1.5px] border-line-lav rotate-45`} />
        </div>
      );
  }
};

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
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>('speech');
  const [bubbleTail, setBubbleTail] = useState<'left' | 'right'>('left');

  // Dragging state (Pointer Events: ratón + táctil)
  const sceneRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: string; pointerId: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  // ------------------------------------------------------------------
  // Gestión de escenas (crear, cambiar, eliminar, renombrar)
  // ------------------------------------------------------------------
  const handleNewScene = () => {
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
    setSelectedInstanceId(newScene.characters[0]?.instanceId || null);
  };

  const handleDeleteScene = (index: number) => {
    if (scenes.length <= 1) {
      alert('Debe quedar al menos una escena.');
      return;
    }
    if (!confirm(`¿Eliminar la escena "${scenes[index].name}"? Esta acción no se puede deshacer.`)) return;
    playSound('delete');
    const updated = scenes.filter((_, i) => i !== index);
    setScenes(updated);
    onSaveScenes(updated);
    setCurrentSceneIndex(Math.max(0, Math.min(index - 1, updated.length - 1)));
    setSelectedInstanceId(null);
  };

  // ------------------------------------------------------------------
  // Añadir elementos
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Transformaciones del elemento seleccionado
  // ------------------------------------------------------------------
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

  // Capas (personajes y stickers tienen zIndex)
  const handleLayer = (delta: number) => {
    if (!selectedInstanceId) return;
    playSound('click');
    updateActiveScene((s) => ({
      ...s,
      characters: s.characters.map((c) =>
        c.instanceId === selectedInstanceId ? { ...c, zIndex: Math.max(0, c.zIndex + delta) } : c
      ),
      stickers: s.stickers.map((st) =>
        st.instanceId === selectedInstanceId ? { ...st, zIndex: Math.max(0, st.zIndex + delta) } : st
      ),
    }));
  };

  // Cambiar pose del personaje seleccionado
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

  // Guardar bocadillo de diálogo
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

  // ------------------------------------------------------------------
  // Arrastre con Pointer Events (ratón + táctil)
  // ------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedInstanceId(id);
    dragState.current = { id, pointerId: e.pointerId };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* algunos navegadores antiguos no lo soportan */
    }
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !sceneRef.current) return;
    if (e.pointerId !== dragState.current.pointerId) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const relX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const relY = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    const id = dragState.current.id;

    updateActiveScene((s) => ({
      ...s,
      characters: s.characters.map((c) => (c.instanceId === id ? { ...c, x: relX, y: relY } : c)),
      stickers: s.stickers.map((st) => (st.instanceId === id ? { ...st, x: relX, y: relY } : st)),
    }));
  };

  const endDrag = () => {
    dragState.current = null;
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#F3EFFB] to-[#E9F3FB]">
      {/* ============ Barra de control superior ============ */}
      <div className="bg-white/85 backdrop-blur-md border-b border-line-rose p-2 sm:px-4 flex items-center justify-between gap-2 overflow-x-auto z-30">
        <div className="flex items-center gap-2">
          {/* Nombre de la escena activa */}
          <div className="flex items-center gap-1.5 bg-lav-50 px-3 py-1.5 rounded-full border-[1.5px] border-line-lav">
            <FolderOpen className="w-4 h-4 text-lav-500 shrink-0" />
            <input
              type="text"
              value={activeScene.name}
              onChange={(e) => updateActiveScene((s) => ({ ...s, name: e.target.value }))}
              className="text-xs sm:text-sm font-extrabold text-ink bg-transparent focus:outline-none w-32 sm:w-48"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              playSound('click');
              setShowAddCharModal(true);
            }}
            className="gl-btn gl-btn-pink !rounded-full px-3 py-1.5 text-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Personaje</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowBgModal(true);
            }}
            className="gl-btn gl-btn-white !rounded-full px-3 py-1.5 text-xs whitespace-nowrap"
          >
            <ImageIcon className="w-3.5 h-3.5 text-lav-500" />
            <span>Fondo</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowStickerModal(true);
            }}
            className="gl-btn gl-btn-white !rounded-full px-3 py-1.5 text-xs whitespace-nowrap"
          >
            <Smile className="w-3.5 h-3.5 text-lav-500" />
            <span>Stickers</span>
          </button>

          <button
            onClick={handleExportScenePng}
            className="gl-btn gl-btn-blue !rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>Exportar PNG</span>
          </button>
        </div>
      </div>

      {/* ============ Pestañas de escenas ============ */}
      <div className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 bg-white/60 border-b border-line-rose overflow-x-auto z-20">
        <Layers className="w-3.5 h-3.5 text-ink-faint shrink-0" />
        {scenes.map((s, i) => {
          const isActive = i === currentSceneIndex;
          return (
            <div key={s.id} className="relative shrink-0">
              <button
                onClick={() => {
                  playSound('click');
                  setCurrentSceneIndex(i);
                  setSelectedInstanceId(s.characters[0]?.instanceId || null);
                }}
                className={`pl-2 pr-6 py-1 rounded-full text-[11px] font-extrabold max-w-[150px] border-[1.5px] transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-b from-rosa-400 to-rosa-500 text-white border-rosa-500 shadow-sm'
                    : 'bg-white text-ink-soft border-line-lav hover:border-lav-300 hover:text-ink'
                }`}
              >
                <span className="opacity-60 mr-1">{i + 1}.</span>
                {s.name}
              </button>
              {scenes.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteScene(i); }}
                  title="Eliminar escena"
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center border transition-all ${
                    isActive
                      ? 'bg-white/90 text-rosa-600 border-white'
                      : 'bg-white text-ink-faint border-line-lav hover:text-[#E86A7E]'
                  }`}
                >
                  <X className="w-2.5 h-2.5" strokeWidth={3} />
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={handleNewScene}
          title="Crear nueva escena"
          className="shrink-0 w-6 h-6 rounded-full border-[1.5px] border-dashed border-rosa-300 text-rosa-500 flex items-center justify-center hover:bg-rosa-50 transition-all active:scale-90"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* ============ Lienzo de la escena ============ */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        <div
          ref={sceneRef}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`relative w-full max-w-5xl aspect-[16/9] rounded-[26px] overflow-hidden shadow-cute-lg border-[6px] border-white select-none bg-gradient-to-br ${bgObj.gradient} ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
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
          {/* Detalles decorativos para fondos sin SVG */}
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

          {/* Personajes en escena */}
          {activeScene.characters.map((inst) => {
            const isSelected = selectedInstanceId === inst.instanceId;
            return (
              <div
                key={inst.instanceId}
                onPointerDown={(e) => handlePointerDown(e, inst.instanceId)}
                style={{
                  left: `${inst.x}%`,
                  top: `${inst.y}%`,
                  transform: `translate(-50%, -50%) scale(${inst.scale}) rotate(${inst.rotation}deg) ${
                    inst.flip ? 'scaleX(-1)' : ''
                  }`,
                  zIndex: inst.zIndex,
                }}
                className={`absolute cursor-grab active:cursor-grabbing touch-none ${
                  isSelected ? 'ring-2 ring-rosa-400 ring-offset-2 ring-offset-white/60 rounded-2xl' : ''
                }`}
              >
                {/* Bocadillo de diálogo */}
                {inst.bubble && (
                  <div style={{ transform: inst.flip ? 'scaleX(-1)' : 'none' }}>
                    <DialogueBubble bubble={inst.bubble} />
                  </div>
                )}

                {/* Personaje */}
                <div className="w-[180px] h-[240px] sm:w-[240px] sm:h-[300px] pointer-events-none">
                  <ChibiRenderer character={inst.character} animate={false} />
                </div>
              </div>
            );
          })}

          {/* Stickers en escena */}
          {activeScene.stickers.map((stk) => {
            const isSelected = selectedInstanceId === stk.instanceId;
            const stkData = STICKER_OPTIONS.find((s) => s.id === stk.stickerId);
            return (
              <div
                key={stk.instanceId}
                onPointerDown={(e) => handlePointerDown(e, stk.instanceId)}
                style={{
                  left: `${stk.x}%`,
                  top: `${stk.y}%`,
                  transform: `translate(-50%, -50%) scale(${stk.scale}) rotate(${stk.rotation}deg)`,
                  zIndex: stk.zIndex,
                }}
                className={`absolute cursor-grab active:cursor-grabbing touch-none text-4xl sm:text-5xl rounded-xl ${
                  isSelected ? 'ring-2 ring-lav-400 ring-offset-2 ring-offset-white/60' : ''
                }`}
              >
                {stkData?.icon || '✨'}
              </div>
            );
          })}
        </div>

        {/* ============ Barra flotante del elemento seleccionado ============ */}
        {(selectedChar || selectedSticker) && (
          <div className="absolute bottom-4 bg-white/95 backdrop-blur-md p-2 rounded-2xl border-[1.5px] border-line-rose shadow-cute flex items-center gap-2 z-40 max-w-[95vw] overflow-x-auto pop-in">
            <span className="text-xs font-black text-rosa-600 px-2 truncate max-w-[110px] shrink-0">
              {selectedChar ? selectedChar.character.name : STICKER_OPTIONS.find((s) => s.id === selectedSticker?.stickerId)?.label || 'Sticker'}
            </span>

            {/* Voltear (solo personajes) */}
            {selectedChar && (
              <button
                onClick={handleFlipSelected}
                title="Voltear horizontalmente"
                className="icon-btn w-8 h-8 shrink-0"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Rotar */}
            <button
              onClick={() => handleRotateSelected(15)}
              title="Girar +15°"
              className="icon-btn w-8 h-8 shrink-0"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Tamaño */}
            <div className="flex items-center gap-1.5 px-2 border-l border-line-lav shrink-0">
              <span className="text-[10px] font-bold text-ink-faint">Tamaño</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={selectedChar ? selectedChar.scale : selectedSticker!.scale}
                onChange={(e) => handleScaleSelected(parseFloat(e.target.value))}
                className="w-20 accent-rosa-500"
              />
            </div>

            {/* Pose (solo personajes) */}
            {selectedChar && (
              <select
                value={selectedChar.character.parts.pose}
                onChange={(e) => handleChangePose(e.target.value)}
                className="text-xs font-bold bg-lav-50 border-[1.5px] border-line-lav rounded-xl px-2 py-1 text-ink focus:outline-none focus:border-rosa-400 shrink-0"
              >
                {POSE_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            {/* Diálogo (solo personajes) */}
            {selectedChar && (
              <button
                onClick={() => {
                  setBubbleText(selectedChar.bubble?.text || '');
                  setBubbleStyle(selectedChar.bubble?.style || 'speech');
                  setBubbleTail(selectedChar.bubble?.tailSide || 'left');
                  setShowBubbleEditor(true);
                }}
                title="Editar Diálogo"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-lav-50 border-[1.5px] border-line-lav text-ink font-bold text-xs hover:border-lav-300 transition-all shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5 text-lav-500" />
                <span>Diálogo</span>
              </button>
            )}

            {/* Capas */}
            <div className="flex items-center gap-1 border-l border-line-lav pl-1 shrink-0">
              <button onClick={() => handleLayer(1)} title="Traer al frente" className="icon-btn w-7 h-7">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleLayer(-1)} title="Enviar atrás" className="icon-btn w-7 h-7">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Eliminar */}
            <button
              onClick={handleRemoveSelected}
              title="Eliminar de la escena"
              className="icon-btn w-8 h-8 hover:!bg-[#FFEEF1] hover:!text-[#E86A7E] ml-1 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ============ Modal: Añadir personaje ============ */}
      {showAddCharModal && (
        <div className="fixed inset-0 z-50 bg-[#4A3B52]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowAddCharModal(false)}>
          <div className="gl-card p-5 max-w-lg w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line-rose pb-2">
              <h3 className="gl-title text-base font-display">Añadir Personaje a la Escena</h3>
              <button onClick={() => setShowAddCharModal(false)} className="icon-btn w-8 h-8 !text-rosa-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleAddCharacter(char)}
                  className="p-3 rounded-2xl border-[1.5px] border-line-lav hover:border-rosa-400 hover:bg-rosa-50/60 transition-all flex flex-col items-center text-center card-hover group"
                >
                  <div className="w-16 h-20 overflow-hidden relative">
                    <ChibiRenderer character={char} animate={false} scale={0.6} className="w-32 h-32 absolute -top-4 -left-6" />
                  </div>
                  <span className="text-xs font-extrabold text-ink group-hover:text-rosa-600 truncate w-full mt-1">
                    {char.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ Modal: Cambiar fondo ============ */}
      {showBgModal && (
        <div className="fixed inset-0 z-50 bg-[#4A3B52]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowBgModal(false)}>
          <div className="gl-card p-5 max-w-xl w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line-rose pb-2">
              <h3 className="gl-title text-base font-display">Seleccionar Fondo del Estudio</h3>
              <button onClick={() => setShowBgModal(false)} className="icon-btn w-8 h-8 !text-rosa-500">
                <X className="w-4 h-4" />
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
                  className={`p-3 rounded-2xl border-[1.5px] text-left transition-all card-hover ${
                    activeScene.backgroundId === bg.id
                      ? 'border-rosa-400 ring-2 ring-rosa-200 bg-rosa-50/60'
                      : 'border-line-lav hover:border-lav-300 bg-white'
                  }`}
                >
                  <div className={`w-full h-16 rounded-xl mb-2 flex items-center justify-center text-3xl shadow-inner bg-gradient-to-tr ${bg.gradient} overflow-hidden relative border border-line-rose`}>
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
                  <p className="text-xs font-extrabold text-ink truncate leading-tight">{bg.name}</p>
                  <span className="text-[10px] text-lav-500 font-semibold">{bg.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ Modal: Añadir sticker ============ */}
      {showStickerModal && (
        <div className="fixed inset-0 z-50 bg-[#4A3B52]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowStickerModal(false)}>
          <div className="gl-card p-5 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line-rose pb-2">
              <h3 className="gl-title text-base font-display">Añadir Sticker Decorativo</h3>
              <button onClick={() => setShowStickerModal(false)} className="icon-btn w-8 h-8 !text-rosa-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {STICKER_OPTIONS.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => handleAddSticker(stk.id)}
                  className="p-3 rounded-2xl border-[1.5px] border-line-lav hover:border-rosa-300 hover:bg-rosa-50/60 flex flex-col items-center gap-1 transition-all card-hover group"
                >
                  <span className="text-4xl group-hover:scale-125 transition-transform">{stk.icon}</span>
                  <span className="text-[10px] font-bold text-ink-soft">{stk.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ Modal: Editor de bocadillo ============ */}
      {showBubbleEditor && (
        <div className="fixed inset-0 z-50 bg-[#4A3B52]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowBubbleEditor(false)}>
          <div className="gl-card p-5 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line-rose pb-2">
              <h3 className="gl-title text-base font-display">Bocadillo de Diálogo</h3>
              <button onClick={() => setShowBubbleEditor(false)} className="icon-btn w-8 h-8 !text-rosa-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">
                Texto del diálogo
              </label>
              <textarea
                value={bubbleText}
                onChange={(e) => setBubbleText(e.target.value)}
                placeholder="Escribe lo que dice el personaje..."
                rows={3}
                className="soft-input resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1.5 px-1">
                Estilo del bocadillo
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {BUBBLE_STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => { playSound('click'); setBubbleStyle(st.id); }}
                    className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold border-[1.5px] transition-all ${
                      bubbleStyle === st.id
                        ? 'bg-rosa-50 border-rosa-400 text-rosa-600 ring-2 ring-rosa-200'
                        : 'bg-white border-line-lav text-ink-soft hover:border-lav-300'
                    }`}
                  >
                    <span className="text-lg leading-none">{st.icon}</span>
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">
                  Orientación
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBubbleTail('left')}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-[1.5px] transition-all ${
                      bubbleTail === 'left'
                        ? 'bg-gradient-to-b from-rosa-400 to-rosa-500 text-white border-rosa-500'
                        : 'bg-white text-ink-soft border-line-lav hover:border-lav-300'
                    }`}
                  >
                    Izquierda
                  </button>
                  <button
                    onClick={() => setBubbleTail('right')}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-[1.5px] transition-all ${
                      bubbleTail === 'right'
                        ? 'bg-gradient-to-b from-rosa-400 to-rosa-500 text-white border-rosa-500'
                        : 'bg-white text-ink-soft border-line-lav hover:border-lav-300'
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
                  className="gl-btn gl-btn-white px-3 py-2 text-xs"
                >
                  Quitar Bocadillo
                </button>
                <button onClick={handleSaveBubble} className="gl-btn gl-btn-pink px-4 py-2 text-xs">
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
