import React, { useState, useRef, useEffect } from 'react';
import { Character, CharacterParts, CharacterColors, StudioScene, PullHistoryItem, Quest, GachaItem } from '../../types';
import { ChibiRenderer } from '../../renderer/ChibiRenderer';
import { AssetThumb } from '../AssetThumb';
import { Clouds } from '../ui/Clouds';
import { DressUpDrawer, DressPanel } from './DressUpDrawer';
import {
  TOP_OPTIONS,
  BOTTOM_OPTIONS,
  SHOES_OPTIONS,
  SOCKS_OPTIONS,
  HAIR_FRONT_OPTIONS,
  HAIR_REAR_OPTIONS,
  HAIR_SIDE_OPTIONS,
  EYE_OPTIONS,
  EYEBROW_OPTIONS,
  MOUTH_OPTIONS,
  BLUSH_OPTIONS,
  EXPRESSION_OPTIONS,
  HAT_OPTIONS,
  GLASSES_OPTIONS,
  NECK_OPTIONS,
  WINGS_OPTIONS,
  TAIL_OPTIONS,
  AURA_OPTIONS,
  PROP_OPTIONS,
  POSE_OPTIONS,
  COLOR_PALETTES,
  BACKGROUND_OPTIONS,
} from '../../data/items';
import { getBackgrounds } from '../../data/assetCatalog';
import { exportCharacterJSON, exportSvgToPng } from '../../utils/exportUtils';
import {
  Image as ImageIcon,
  Clapperboard,
  Gem,
  ZoomIn,
  EyeOff,
  Gift,
  Gamepad2,
  Users,
  Camera,
  Settings,
  User,
  Shirt,
  Smile,
  Scissors,
  Crown,
  Sparkles,
  Hand,
  HeartHandshake,
  Volume2,
  VolumeX,
  Undo2,
  Redo2,
  Dices,
  Save,
  Check,
  ChevronLeft,
  Pencil,
  Copy,
  Trash2,
  X,
  Download,
  Share2,
  UserPlus,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

// ---------------------------------------------------------------------------
// Estilo visual Gacha Life: cielo azul, paneles celestes, botones 3D chunky
// ---------------------------------------------------------------------------
const C = {
  panel: '#C3E7FB',
  panelDark: '#A5D8F4',
  dark: '#2B5FA8',
  deep: '#1E4580',
  face: '#EAF6FF',
  faceHover: '#FFFFFF',
  label: '#4AA0D0',
  selected: '#FF87B2',
  pink: '#FF87B2',
  yellow: '#FFE06B',
  white: '#FFFFFF',
};

interface HomeScreenProps {
  characters: Character[];
  activeSlot: number;
  onSelectSlot: (index: number) => void;
  onUpdateCharacter: (updated: Character) => void;
  onCreateSlot: () => void;
  onDuplicateSlot: (index: number) => void;
  onDeleteSlot: (index: number) => void;
  onRenameSlot: (index: number, newName: string) => void;
  unlockedSet: Set<string>;
  gems: number;
  onOpenGemShop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onNavigate: (screen: 'studio' | 'gacha' | 'collection' | 'quests') => void;
  onRewardQuest: (questId: string) => void;
}

// ---------------------------------------------------------------------------
// Botón flotante de la escena (BG, Skits, Gacha, Zoom…)
// ---------------------------------------------------------------------------
const MenuButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  wide?: boolean;
}> = ({ icon, label, onClick, active = false, wide = false }) => (
  <button
    onClick={() => { playSound('click'); onClick(); }}
    className={`${wide ? 'w-full' : 'w-[62px] sm:w-[70px]'} gl-btn overflow-hidden !p-0 !rounded-2xl`}
    style={{ background: 'none', boxShadow: '0 3px 0 #2B5FA8' }}
  >
    <div
      className="w-full h-[42px] sm:h-[46px] flex items-center justify-center"
      style={{
        background: active
          ? 'linear-gradient(180deg, #FFB1CE 0%, #FF87B2 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #EAF6FF 100%)',
      }}
    >
      <div style={{ color: active ? '#FFFFFF' : C.deep }}>{icon}</div>
    </div>
    <div
      className="w-full py-[3px] text-white text-[10px] sm:text-[11px] font-extrabold tracking-wide"
      style={{ background: 'linear-gradient(180deg, #74C9F0 0%, #4AA0D0 100%)' }}
    >
      {label}
    </div>
  </button>
);

// ---------------------------------------------------------------------------
// Botón de categoría del panel "Vestir"
// ---------------------------------------------------------------------------
const DressButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}> = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={() => { playSound('pop'); onClick(); }}
    className="gl-btn gl-btn-blue !rounded-2xl h-[62px] sm:h-[70px] flex-col gap-0.5 px-1"
    style={active ? { background: 'linear-gradient(180deg, #FFB1CE 0%, #FF87B2 100%)', color: '#fff', textShadow: '0 2px 0 rgba(160,40,90,0.45)' } : undefined}
  >
    {icon}
    <span className="text-[11px] sm:text-xs font-extrabold">{label}</span>
  </button>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  characters,
  activeSlot,
  onSelectSlot,
  onUpdateCharacter,
  onCreateSlot,
  onDuplicateSlot,
  onDeleteSlot,
  onRenameSlot,
  unlockedSet,
  gems,
  onOpenGemShop,
  isMuted,
  onToggleMute,
  onNavigate,
  onRewardQuest,
}) => {
  const currentCharacter = characters[activeSlot] || characters[0];

  // Panel derecho activo (null = rejilla de categorías)
  const [panel, setPanel] = useState<DressPanel | null>(null);

  // Escena
  const [bgId, setBgId] = useState<string>('parque');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [uiHidden, setUiHidden] = useState<boolean>(false);
  const [showBgPicker, setShowBgPicker] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [slotMenuFor, setSlotMenuFor] = useState<number | null>(null);
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Historial undo/redo
  const [history, setHistory] = useState<Character[]>([currentCharacter]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const previewRef = useRef<HTMLDivElement>(null);

  // Reiniciar historial al cambiar de personaje
  useEffect(() => {
    const current = characters[activeSlot] || characters[0];
    setHistory([current]);
    setHistoryIndex(0);
    setSlotMenuFor(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlot]);

  const bgAsset = getBackgrounds().find((b) => b.id === bgId) || getBackgrounds()[0];
  const bgOption = BACKGROUND_OPTIONS.find((b) => b.id === bgId);

  // ---------------------------------------------------------------- helpers
  const pushChange = (newChar: Character) => {
    const updated = { ...newChar, updatedAt: Date.now() };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onUpdateCharacter(updated);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onUpdateCharacter(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onUpdateCharacter(history[historyIndex + 1]);
    }
  };

  const updatePart = <K extends keyof CharacterParts>(key: K, value: CharacterParts[K]) => {
    pushChange({
      ...currentCharacter,
      parts: { ...currentCharacter.parts, [key]: value },
    });
  };

  const updateColor = <K extends keyof CharacterColors>(key: K, value: CharacterColors[K]) => {
    pushChange({
      ...currentCharacter,
      colors: { ...currentCharacter.colors, [key]: value },
    });
  };

  const handleRandomize = () => {
    const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const baseHair = getRandom(COLOR_PALETTES.hair).hex;
    const subHair = getRandom(COLOR_PALETTES.hair).hex;
    const eyeCol = getRandom(COLOR_PALETTES.eyes).hex;
    const topPrimary = getRandom(COLOR_PALETTES.clothes).hex;
    const topSecondary = getRandom(COLOR_PALETTES.clothes).hex;
    pushChange({
      ...currentCharacter,
      parts: {
        ...currentCharacter.parts,
        hairFront: getRandom(HAIR_FRONT_OPTIONS).id,
        hairRear: getRandom(HAIR_REAR_OPTIONS).id,
        hairSide: getRandom(HAIR_SIDE_OPTIONS).id,
        eyes: getRandom(EYE_OPTIONS).id,
        mouth: getRandom(MOUTH_OPTIONS).id,
        blush: getRandom(BLUSH_OPTIONS).id,
        expression: 'normal',
        top: getRandom(TOP_OPTIONS).id,
        bottom: getRandom(BOTTOM_OPTIONS).id,
        shoes: getRandom(SHOES_OPTIONS).id,
        socks: Math.random() > 0.5 ? getRandom(SOCKS_OPTIONS).id : 'none',
        hat: Math.random() > 0.3 ? getRandom(HAT_OPTIONS).id : 'none',
        glasses: Math.random() > 0.6 ? getRandom(GLASSES_OPTIONS).id : 'none',
        neck: Math.random() > 0.5 ? getRandom(NECK_OPTIONS).id : 'none',
        wings: Math.random() > 0.6 ? getRandom(WINGS_OPTIONS).id : 'none',
        tail: Math.random() > 0.6 ? getRandom(TAIL_OPTIONS).id : 'none',
        prop: Math.random() > 0.4 ? getRandom(PROP_OPTIONS).id : 'none',
        aura: Math.random() > 0.5 ? getRandom(AURA_OPTIONS).id : 'none',
        pose: getRandom(POSE_OPTIONS).id,
      },
      colors: {
        ...currentCharacter.colors,
        hairBase: baseHair,
        hairSub: subHair,
        eyePrimary: eyeCol,
        topPrimary,
        topSecondary,
        bottomPrimary: topSecondary,
        bottomSecondary: topPrimary,
        shoesPrimary: topPrimary,
        hatPrimary: topSecondary,
      },
      updatedAt: Date.now(),
    });
  };

  const handleReset = () => {
    pushChange({
      ...currentCharacter,
      parts: {
        ...currentCharacter.parts,
        hairFront: 'curtain',
        hairRear: 'twintails',
        hairSide: 'ahoge_heart',
        hairAhoge: 'ahoge_heart',
        eyes: 'sparkle',
        pupils: 'standard_chibi',
        eyebrows: 'gentle',
        mouth: 'smile_cute',
        nose: 'default',
        blush: 'soft_pink',
        expression: 'normal',
        skinTone: '#FFE6D8',
        bodyType: 'chibi-standard',
        top: 'sailor_fuku',
        bottom: 'pleated_skirt',
        outfit: 'none',
        shoes: 'mary_janes',
        socks: 'frilly',
        hat: 'cat_ears',
        glasses: 'none',
        neck: 'ribbon_bow',
        faceSticker: 'none',
        wings: 'none',
        tail: 'none',
        fantasyEars: 'none',
        prop: 'none',
        aura: 'none',
        pose: 'standing_cute',
      },
      colors: {
        skin: '#FFE6D8',
        hairBase: '#FFAAA6',
        hairSub: '#FFD1DC',
        hairOutline: '#4A3B52',
        eyePrimary: '#FF70A6',
        eyeSecondary: '#FFD166',
        eyebrows: '#4A3B52',
        mouth: '#E06B78',
        blush: '#FF9EAA',
        topPrimary: '#FFFDF9',
        topSecondary: '#FF9EAA',
        bottomPrimary: '#1D3557',
        bottomSecondary: '#FFFDF9',
        shoesPrimary: '#FF9EAA',
        shoesSecondary: '#FFFDF9',
        hatPrimary: '#FF9EAA',
        hatSecondary: '#FFD700',
        glasses: '#FFD700',
        neck: '#FF6F91',
        wings: '#FFFFFF',
        tail: '#FFAAA6',
        prop: '#FFD700',
        aura: '#FFD700',
      },
    });
  };

  const handleManualSave = () => {
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
    onRewardQuest('quest_first_character');
  };

  const handleExportPng = async () => {
    if (!previewRef.current) return;
    const svg = previewRef.current.querySelector('svg');
    if (!svg) return;
    try {
      await exportSvgToPng(svg, currentCharacter.name);
      onRewardQuest('quest_export_png');
    } catch (e) {
      console.error('Export failed:', e);
      alert('Error al exportar la imagen.');
    }
  };

  const handleShareCode = () => {
    const code = JSON.stringify(currentCharacter);
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert(`¡Código de "${currentCharacter.name}" copiado al portapapeles!`);
      })
      .catch(() => exportCharacterJSON(currentCharacter));
  };

  const handleImportCode = () => {
    const code = prompt('Pega el código JSON del personaje aquí:');
    if (!code) return;
    try {
      const parsed = JSON.parse(code);
      if (parsed && parsed.parts && parsed.colors) {
        parsed.id = 'char_' + Date.now();
        onUpdateCharacter(parsed);
        playSound('reveal');
        alert(`¡Personaje "${parsed.name}" importado con éxito!`);
      } else {
        alert('Formato de personaje no válido.');
      }
    } catch {
      alert('Error al leer el código JSON.');
    }
  };

  const handleSlotClick = (index: number) => {
    playSound('pop');
    if (index === activeSlot && slotMenuFor !== index) {
      setSlotMenuFor(index);
    } else {
      setSlotMenuFor(null);
      onSelectSlot(index);
    }
  };

  // ---------------------------------------------------------------- render
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
      {/* ============================ PANEL IZQUIERDO: SLOTS ============================ */}
      <aside
        className={`${
          uiHidden ? 'hidden' : 'flex'
        } flex-row lg:flex-col gap-2 p-2.5 lg:w-[184px] shrink-0 overflow-hidden gl-panel !rounded-none !border-t-0 !border-b-0 !border-l-0`}
        style={{ borderRight: '4px solid #1E4580' }}
      >
        {/* Slots (2 columnas) */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-y-auto overflow-x-auto">
          <div className="grid grid-flow-col lg:grid-flow-row auto-rows-max grid-rows-2 lg:grid-rows-none grid-cols-none lg:grid-cols-2 gap-2">
            {characters.map((char, i) => {
              const isActive = i === activeSlot;
              return (
                <div key={char.id} className="relative">
                  <button
                    onClick={() => handleSlotClick(i)}
                    className="w-[86px] h-[104px] lg:w-full lg:h-[112px] rounded-2xl border-[3px] overflow-hidden transition-all"
                    style={{
                      borderColor: C.deep,
                      backgroundColor: isActive ? '#FFFFFF' : '#DFF1FF',
                      boxShadow: isActive
                        ? `0 0 0 3px ${C.yellow}, 0 4px 0 ${C.deep}`
                        : `0 3px 0 ${C.deep}`,
                    }}
                  >
                    <ChibiRenderer character={char} animate={false} className="w-full h-full scale-[0.92]" />
                  </button>
                  {isActive && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center border-2"
                      style={{ backgroundColor: C.yellow, borderColor: C.deep, color: C.deep }}
                    >
                      ★
                    </span>
                  )}
                  {/* Menú de gestión del slot */}
                  {slotMenuFor === i && (
                    <div className="absolute z-40 left-1/2 -translate-x-1/2 lg:left-full lg:translate-x-0 top-full lg:top-0 mt-1 lg:mt-0 lg:ml-2 w-[170px] gl-card p-2 space-y-1 shadow-xl">
                      <button onClick={() => { const n = prompt('Nuevo nombre:', char.name); if (n) { onRenameSlot(i, n); } setSlotMenuFor(null); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-[#1E4580] hover:bg-[#EAF6FF]">
                        <Pencil className="w-3.5 h-3.5" /> Renombrar
                      </button>
                      <button onClick={() => { onDuplicateSlot(i); setSlotMenuFor(null); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-[#1E4580] hover:bg-[#EAF6FF]">
                        <Copy className="w-3.5 h-3.5" /> Duplicar
                      </button>
                      <button onClick={() => { exportCharacterJSON(char); setSlotMenuFor(null); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-[#1E4580] hover:bg-[#EAF6FF]">
                        <Download className="w-3.5 h-3.5" /> Exportar
                      </button>
                      <button
                        onClick={() => {
                          if (characters.length <= 1) { alert('Debe quedar al menos un personaje.'); return; }
                          if (confirm(`¿Eliminar a "${char.name}"?`)) onDeleteSlot(i);
                          setSlotMenuFor(null);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                      <button onClick={() => setSlotMenuFor(null)} className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-[#4AA0D0] hover:bg-[#EAF6FF]">
                        <X className="w-3 h-3" /> Cerrar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón Slots */}
        <button
          onClick={() => { playSound('pop'); onCreateSlot(); }}
          className="gl-btn gl-btn-yellow shrink-0 px-3 py-2.5 text-sm"
        >
          <Users className="w-5 h-5" />
          Slots
          <span className="w-5 h-5 rounded-full text-white text-xs font-black flex items-center justify-center" style={{ backgroundColor: C.pink }}>+</span>
        </button>
      </aside>

      {/* ============================ ESCENA CENTRAL ============================ */}
      <main className="flex-1 relative min-w-0 min-h-[320px] p-2 sm:p-3">
        <div
          ref={previewRef}
          className="gl-sky relative w-full h-full rounded-[20px] border-[4px] overflow-hidden shadow-inner"
          style={{ borderColor: C.deep }}
        >
          {/* Fondo de escena */}
          {bgAsset ? (
            <svg
              viewBox={bgAsset.viewBox}
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g dangerouslySetInnerHTML={{ __html: bgAsset.inner }} />
            </svg>
          ) : (
            <>
              <Clouds dense />
              {/* Franja de césped estilo Gacha Life */}
              <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-gradient-to-b from-[#8FD96B] to-[#5FB847] border-t-4 border-[#3E8B2E]" />
            </>
          )}

          {/* Personaje */}
          <div className="absolute inset-0 flex items-end justify-center pb-[6%]">
            <div className="h-[76%] sm:h-[82%] flex items-end">
              <ChibiRenderer
                character={currentCharacter}
                animate
                scale={zoomLevel}
                className="h-full"
              />
            </div>
          </div>

          {/* === Botones flotantes superiores === */}
          {!uiHidden && (
            <>
              {/* Columna izquierda */}
              <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex flex-col gap-2 z-20">
                <MenuButton icon={<ImageIcon className="w-5 h-5" />} label="Fondo" onClick={() => setShowBgPicker((v) => !v)} active={showBgPicker} />
                <MenuButton icon={<Clapperboard className="w-5 h-5" />} label="Skits" onClick={() => onNavigate('studio')} />
                <MenuButton icon={<Gem className="w-5 h-5" />} label="Gacha" onClick={() => onNavigate('gacha')} />
              </div>

              {/* Columna derecha */}
              <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex flex-col gap-2 z-20">
                <MenuButton
                  icon={<ZoomIn className="w-5 h-5" />}
                  label="Zoom"
                  onClick={() => setZoomLevel((z) => (z >= 1.45 ? 0.85 : z + 0.2))}
                  active={zoomLevel !== 1}
                />
                <MenuButton icon={<EyeOff className="w-5 h-5" />} label="Ocultar" onClick={() => setUiHidden(true)} />
                <MenuButton icon={<Gift className="w-5 h-5" />} label="Regalos" onClick={onOpenGemShop} />
                <MenuButton icon={<Gamepad2 className="w-5 h-5" />} label="Juegos" onClick={() => onNavigate('quests')} />
              </div>

              {/* Logo flotante estilo Gacha Life */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 sm:top-3 z-20 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 border-[3px] shadow-lg" style={{ borderColor: C.deep, background: 'linear-gradient(180deg, #FFB1CE 0%, #FF87B2 100%)' }}>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border-2" style={{ borderColor: C.deep }}>
                  <Sparkles className="w-4 h-4" style={{ color: C.pink }} />
                </div>
                <span className="gl-title font-display font-bold text-base sm:text-xl tracking-wide">Chibiverse</span>
              </div>

              {/* Barra de acciones inferior */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-2 z-20 flex items-center gap-1 rounded-full px-2 py-1.5 shadow-lg border-[3px]"
                style={{ borderColor: C.deep, backgroundColor: 'rgba(255,255,255,0.95)' }}
              >
                {[
                  { icon: <Undo2 className="w-4 h-4" />, title: 'Deshacer', fn: handleUndo, disabled: historyIndex <= 0 },
                  { icon: <Redo2 className="w-4 h-4" />, title: 'Rehacer', fn: handleRedo, disabled: historyIndex >= history.length - 1 },
                  { icon: <Dices className="w-4 h-4" />, title: 'Aleatorio', fn: handleRandomize },
                  { icon: <Save className="w-4 h-4" />, title: 'Guardar', fn: handleManualSave },
                  { icon: <Camera className="w-4 h-4" />, title: 'Exportar PNG', fn: handleExportPng },
                ].map((b, i) => (
                  <button
                    key={i}
                    title={b.title}
                    disabled={b.disabled}
                    onClick={() => { if (!b.disabled) { playSound('click'); b.fn(); } }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      b.disabled ? 'opacity-35' : 'hover:bg-[#EAF6FF]'
                    }`}
                    style={{ color: C.deep }}
                  >
                    {b.icon}
                  </button>
                ))}
              </div>

              {/* Feedback de guardado */}
              {isSavedFeedback && (
                <div className="absolute right-3 bottom-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-extrabold shadow-lg border-2" style={{ backgroundColor: '#5FB847', borderColor: C.deep }}>
                  <Check className="w-4 h-4" /> ¡Guardado!
                </div>
              )}

              {/* Selector de fondo */}
              {showBgPicker && (
                <div className="absolute left-2 top-[170px] sm:left-3 z-30 w-[190px] gl-card p-2 shadow-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold text-[#1E4580]">Fondos</span>
                    <button onClick={() => setShowBgPicker(false)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: C.deep }}>
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
                    {getBackgrounds().map((b) => (
                      <button
                        key={b.id}
                        onClick={() => { playSound('equip'); setBgId(b.id); setShowBgPicker(false); }}
                        className={`w-full flex items-center gap-2 p-1 rounded-xl border-2 transition-all ${
                          bgId === b.id ? 'border-[#FF87B2] bg-[#EAF6FF]' : 'border-transparent hover:bg-[#EAF6FF]/70'
                        }`}
                      >
                        <div className="w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0" style={{ borderColor: C.deep }}>
                          <AssetThumb asset={b} className="w-full h-full" />
                        </div>
                        <span className="text-[10px] font-bold text-left text-[#1E4580]">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Botón para volver a mostrar la interfaz */}
          {uiHidden && (
            <button
              onClick={() => setUiHidden(false)}
              className="absolute right-3 top-3 z-30 w-10 h-10 rounded-full border-[3px] flex items-center justify-center shadow-lg"
              style={{ borderColor: C.deep, backgroundColor: C.yellow }}
            >
              <Sparkles className="w-5 h-5 text-[#1E4580]" />
            </button>
          )}
        </div>
      </main>

      {/* ============================ PANEL DERECHO: VESTIR ============================ */}
      <aside
        className={`${
          uiHidden ? 'hidden' : 'flex'
        } flex-col gap-2 p-2.5 lg:w-[256px] shrink-0 overflow-hidden gl-panel !rounded-none !border-t-0 !border-b-0 !border-r-0`}
        style={{ borderLeft: '4px solid #1E4580' }}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between gap-2">
          {panel ? (
            <button
              onClick={() => { playSound('click'); setPanel(null); }}
              className="gl-chip flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Volver
            </button>
          ) : (
            <h2 className="gl-title font-display font-bold text-xl tracking-wide px-2 py-0.5 rounded-xl" style={{ background: 'linear-gradient(180deg, #74C9F0 0%, #4AA0D0 100%)' }}>
              Vestir
            </h2>
          )}
          <div className="flex items-center gap-1.5">
            {/* Gemas */}
            <button onClick={onOpenGemShop} className="gl-pill hover:brightness-105 active:translate-y-[2px] transition-all">
              <Gem className="w-3.5 h-3.5" style={{ color: '#B79AE0' }} />
              <span className="text-xs">{gems.toLocaleString()}</span>
            </button>
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              className="w-7 h-7 rounded-full border-2 border-[#2B5FA8] bg-white flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#1E4580]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#1E4580]" />
              )}
            </button>
          </div>
        </div>

        {/* Contenido: rejilla de categorías o drawer */}
        {panel === null ? (
          <div className="grid grid-cols-2 gap-2 overflow-y-auto min-h-0 flex-1 content-start">
            <DressButton icon={<User className="w-6 h-6" />} label="Preajustes" onClick={() => setPanel('presets')} />
            <DressButton icon={<Users className="w-6 h-6" />} label="Cuerpo" onClick={() => setPanel('body')} />
            <DressButton icon={<Scissors className="w-6 h-6" />} label="Cabello" onClick={() => setPanel('hair')} />
            <DressButton icon={<Smile className="w-6 h-6" />} label="Rostro" onClick={() => setPanel('face')} />
            <DressButton icon={<Shirt className="w-6 h-6" />} label="Ropa" onClick={() => setPanel('clothes')} />
            <DressButton icon={<Crown className="w-6 h-6" />} label="Otros" onClick={() => setPanel('other')} />
            <DressButton icon={<Hand className="w-6 h-6" />} label="Objetos" onClick={() => setPanel('props')} />
            <DressButton icon={<HeartHandshake className="w-6 h-6" />} label="Perfil" onClick={() => setPanel('profile')} />
          </div>
        ) : (
          <DressUpDrawer
            panel={panel}
            character={currentCharacter}
            updatePart={updatePart}
            updateColor={updateColor}
            pushChange={pushChange}
            unlockedSet={unlockedSet}
            onRandomize={handleRandomize}
            onReset={handleReset}
            onOpenCollection={() => onNavigate('collection')}
            onExportPng={handleExportPng}
            onShareCode={handleShareCode}
            onImportCode={handleImportCode}
          />
        )}

        {/* Botones grandes estilo Gacha Life */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={() => { playSound('pop'); onNavigate('studio'); }}
            className="gl-btn gl-btn-pink py-3 text-lg font-display"
          >
            <Camera className="w-6 h-6" /> Estudio
          </button>
          <button
            onClick={() => { playSound('pop'); onNavigate('gacha'); }}
            className="gl-btn gl-btn-pink py-3 text-lg font-display"
          >
            <Gem className="w-6 h-6" /> Gacha
          </button>
          <button
            onClick={() => { playSound('pop'); onNavigate('quests'); }}
            className="gl-btn gl-btn-yellow py-2 text-sm"
          >
            <Gamepad2 className="w-5 h-5" /> Juegos
          </button>
          <button
            onClick={() => { playSound('click'); setShowOptions(true); }}
            className="gl-btn gl-btn-blue py-2 text-sm"
          >
            <Settings className="w-5 h-5" /> Opciones
          </button>
        </div>
      </aside>

      {/* ============================ MODAL DE OPCIONES ============================ */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowOptions(false)}>
          <div
            className="w-full max-w-sm gl-card p-5 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-[#1E4580]">Opciones</h3>
              <button onClick={() => setShowOptions(false)} className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#2B5FA8] bg-[#FF87B2]">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { playSound('click'); onToggleMute(); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                {isMuted ? 'Activar Sonido' : 'Silenciar'}
              </button>
              <button onClick={() => { playSound('pop'); handleExportPng(); setShowOptions(false); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <Download className="w-6 h-6" /> Exportar PNG
              </button>
              <button onClick={() => { playSound('pop'); handleShareCode(); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <Share2 className="w-6 h-6" /> Copiar Código
              </button>
              <button onClick={() => { playSound('pop'); handleImportCode(); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <UserPlus className="w-6 h-6" /> Importar Código
              </button>
              <button onClick={() => { playSound('pop'); onNavigate('collection'); setShowOptions(false); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <BookOpen className="w-6 h-6" /> Colección
              </button>
              <button onClick={() => { playSound('pop'); handleReset(); setShowOptions(false); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <RotateCcw className="w-6 h-6" /> Restablecer
              </button>
            </div>
            <p className="text-[10px] text-center font-semibold text-[#4AA0D0]">
              Chibiverse Gacha Studio · Los assets se cargan desde assets/items/
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
