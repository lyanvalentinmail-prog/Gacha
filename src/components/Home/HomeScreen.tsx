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
  Plus,
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

// ---------------------------------------------------------------------------
// Tokens locales (espejo del design system de index.css)
// ---------------------------------------------------------------------------
const C = {
  ink: '#4A3B52',
  inkSoft: '#7D7189',
  lavText: '#7F6BB8',
  pink: '#F97FA5',
  pinkDeep: '#E75E8C',
  pinkGrad: 'linear-gradient(180deg, #FF9DB8 0%, #F97FA5 100%)',
  lavGrad: 'linear-gradient(180deg, #CFC4EE 0%, #B5A6E2 100%)',
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
}> = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={() => { playSound('click'); onClick(); }}
    className={`w-[58px] sm:w-[66px] rounded-2xl border-[1.5px] overflow-hidden backdrop-blur-md transition-all active:scale-95 ${
      active
        ? 'border-rosa-400 shadow-md'
        : 'border-white/70 bg-white/85 shadow-sm hover:shadow-md'
    }`}
    style={active ? { background: C.pinkGrad, borderColor: C.pink } : undefined}
  >
    <div
      className="w-full h-[38px] sm:h-[42px] flex items-center justify-center"
      style={{ color: active ? '#FFFFFF' : C.lavText }}
    >
      {icon}
    </div>
    <div
      className={`w-full py-[3px] text-[10px] sm:text-[11px] font-extrabold tracking-wide ${
        active ? 'text-white' : 'text-ink-soft bg-white/70'
      }`}
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
    className={`h-[62px] sm:h-[68px] rounded-2xl border-[1.5px] flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] ${
      active
        ? 'border-rosa-500 shadow-md'
        : 'border-line-lav bg-white hover:border-lav-300 hover:shadow-sm'
    }`}
    style={active ? { background: C.pinkGrad } : undefined}
  >
    <span style={{ color: active ? '#FFFFFF' : C.lavText }}>{icon}</span>
    <span
      className="text-[11px] sm:text-xs font-extrabold"
      style={{ color: active ? '#FFFFFF' : C.ink }}
    >
      {label}
    </span>
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
      {/* ============================ BARRA DE SLOTS (izquierda) ============================ */}
      <aside
        className={`${
          uiHidden ? 'hidden' : 'flex'
        } flex-row lg:flex-col items-stretch gap-2 p-2 lg:w-[178px] shrink-0 min-h-0 bg-white/85 lg:bg-white/70 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-line-rose overflow-hidden`}
      >
        {/* Slots (tira horizontal en móvil / 2 columnas en escritorio) */}
        <div className="flex lg:grid lg:grid-cols-2 gap-2 flex-1 min-h-0 overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto pb-1 lg:pr-1">
          {characters.map((char, i) => {
            const isActive = i === activeSlot;
            return (
              <div key={char.id} className="relative shrink-0">
                <button
                  onClick={() => handleSlotClick(i)}
                  className={`relative w-[82px] h-[100px] lg:w-full lg:h-[108px] rounded-2xl border-[1.5px] overflow-hidden transition-all ${
                    isActive
                      ? 'border-rosa-400 ring-2 ring-rosa-200 bg-rosa-50 shadow-md'
                      : 'border-line-rose bg-panel-rose hover:border-lav-300 hover:shadow-sm'
                  }`}
                >
                  <ChibiRenderer character={char} animate={false} className="w-full h-full scale-[0.92]" />
                  {/* Nombre del personaje */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 px-1 py-[2px] text-[9px] font-extrabold truncate border-t ${
                      isActive ? 'bg-rosa-100/95 text-rosa-700 border-rosa-200' : 'bg-white/85 text-ink-soft border-line-rose'
                    }`}
                  >
                    {char.name}
                  </span>
                </button>
                {isActive && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white shadow-sm"
                    style={{ background: C.pinkGrad }}
                  >
                    ★
                  </span>
                )}
                {/* Menú de gestión del slot */}
                {slotMenuFor === i && (
                  <div className="absolute z-40 left-1/2 -translate-x-1/2 lg:left-full lg:translate-x-0 top-full lg:top-0 mt-1 lg:mt-0 lg:ml-2 w-[172px] gl-card p-2 space-y-1 !shadow-lg pop-in">
                    <button onClick={() => { const n = prompt('Nuevo nombre:', char.name); if (n) { onRenameSlot(i, n); } setSlotMenuFor(null); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-ink hover:bg-rosa-50">
                      <Pencil className="w-3.5 h-3.5 text-lav-500" /> Renombrar
                    </button>
                    <button onClick={() => { onDuplicateSlot(i); setSlotMenuFor(null); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-ink hover:bg-rosa-50">
                      <Copy className="w-3.5 h-3.5 text-lav-500" /> Duplicar
                    </button>
                    <button onClick={() => { exportCharacterJSON(char); setSlotMenuFor(null); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-ink hover:bg-rosa-50">
                      <Download className="w-3.5 h-3.5 text-lav-500" /> Exportar
                    </button>
                    <button
                      onClick={() => {
                        if (characters.length <= 1) { alert('Debe quedar al menos un personaje.'); return; }
                        if (confirm(`¿Eliminar a "${char.name}"?`)) onDeleteSlot(i);
                        setSlotMenuFor(null);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-bold text-[#E86A7E] hover:bg-[#FFEEF1]"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                    <button onClick={() => setSlotMenuFor(null)} className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-ink-faint hover:bg-panel-lav">
                      <X className="w-3 h-3" /> Cerrar
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Botón añadir slot */}
          <button
            onClick={() => { playSound('pop'); onCreateSlot(); }}
            className="shrink-0 lg:shrink w-[82px] h-[100px] lg:w-full lg:h-[108px] rounded-2xl border-[1.5px] border-dashed border-rosa-300 bg-rosa-50/60 hover:bg-rosa-50 flex flex-col items-center justify-center gap-1.5 text-rosa-500 transition-all active:scale-95"
            title="Crear un personaje nuevo"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: C.pinkGrad }}>
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-extrabold">Añadir</span>
            <span className="text-[9px] font-bold text-ink-faint">{characters.length} slots</span>
          </button>
        </div>
      </aside>

      {/* ============================ ESCENA CENTRAL ============================ */}
      <main className="flex-1 relative min-w-0 min-h-[300px] sm:min-h-[340px] p-2 sm:p-3">
        <div
          ref={previewRef}
          className="gl-sky relative w-full h-full rounded-[22px] border-[1.5px] border-line-rose overflow-hidden shadow-cute"
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
              {/* Franja de césped suave */}
              <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-gradient-to-b from-[#C4ECBB] to-[#9BDD92] border-t-[3px] border-[#8BD283]" />
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

          {/* === Botones flotantes === */}
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

              {/* Logo flotante */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 sm:top-3 z-20 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 bg-white/90 backdrop-blur-md border-[1.5px] border-white shadow-md">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: C.pinkGrad }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="gl-title font-display text-base sm:text-xl tracking-wide">Chibiverse</span>
              </div>

              {/* Barra de acciones inferior */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-20 flex items-center gap-0.5 rounded-full px-2 py-1 bg-white/90 backdrop-blur-md border-[1.5px] border-white shadow-md">
                {[
                  { icon: <Undo2 className="w-4 h-4" />, title: 'Deshacer', fn: handleUndo, disabled: historyIndex <= 0 },
                  { icon: <Redo2 className="w-4 h-4" />, title: 'Rehacer', fn: handleRedo, disabled: historyIndex >= history.length - 1 },
                  { icon: <Dices className="w-4 h-4" />, title: 'Aleatorio', fn: handleRandomize, disabled: false },
                  { icon: <Save className="w-4 h-4" />, title: 'Guardar', fn: handleManualSave, disabled: false },
                  { icon: <Camera className="w-4 h-4" />, title: 'Exportar PNG', fn: handleExportPng, disabled: false },
                ].map((b, i) => (
                  <button
                    key={i}
                    title={b.title}
                    disabled={b.disabled}
                    onClick={() => { if (!b.disabled) { playSound('click'); b.fn(); } }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-lav-600 ${
                      b.disabled ? 'opacity-30' : 'hover:bg-rosa-50 hover:text-rosa-500'
                    }`}
                  >
                    {b.icon}
                  </button>
                ))}
              </div>

              {/* Feedback de guardado */}
              {isSavedFeedback && (
                <div className="toast-in absolute right-3 bottom-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-extrabold shadow-md" style={{ background: 'linear-gradient(180deg,#8ACD9C,#6FBF85)' }}>
                  <Check className="w-4 h-4" /> ¡Guardado!
                </div>
              )}

              {/* Selector de fondo */}
              {showBgPicker && (
                <div className="absolute left-2 sm:left-3 z-30 w-[200px] gl-card p-2 pop-in" style={{ top: '168px' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold text-ink">Fondos</span>
                    <button onClick={() => setShowBgPicker(false)} className="icon-btn w-5 h-5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
                    {getBackgrounds().map((b) => (
                      <button
                        key={b.id}
                        onClick={() => { playSound('equip'); setBgId(b.id); setShowBgPicker(false); }}
                        className={`w-full flex items-center gap-2 p-1 rounded-xl border-[1.5px] transition-all ${
                          bgId === b.id ? 'border-rosa-400 bg-rosa-50' : 'border-transparent hover:bg-panel-lav'
                        }`}
                      >
                        <div className="w-14 h-10 rounded-lg overflow-hidden border-[1.5px] border-line-rose shrink-0">
                          <AssetThumb asset={b} className="w-full h-full" />
                        </div>
                        <span className="text-[10px] font-bold text-left text-ink">{b.name}</span>
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
              className="absolute right-3 top-3 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white active:scale-90 transition-transform"
              style={{ background: C.pinkGrad }}
              title="Mostrar interfaz"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>

      {/* ============================ PANEL DERECHO: VESTIR ============================ */}
      <aside
        className={`${
          uiHidden ? 'hidden' : 'flex'
        } flex-col gap-2 p-2.5 lg:w-[262px] shrink-0 flex-1 lg:flex-none min-h-0 bg-white/85 lg:bg-white/70 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-line-rose overflow-hidden`}
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
            <div className="flex items-center gap-2 px-1">
              <span className="w-1.5 h-5 rounded-full" style={{ background: C.pinkGrad }} />
              <h2 className="gl-title font-display text-xl tracking-wide">Vestir</h2>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            {/* Gemas */}
            <button onClick={onOpenGemShop} className="gl-pill hover:brightness-105 active:scale-95 transition-all">
              <Gem className="w-3.5 h-3.5 text-lav-500" />
              <span className="text-xs">{gems.toLocaleString()}</span>
            </button>
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              className="icon-btn w-7 h-7"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Contenido: rejilla de categorías o drawer */}
        {panel === null ? (
          <div className="grid grid-cols-2 gap-2 overflow-y-auto min-h-0 flex-1 content-start panel-in">
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

        {/* Botones grandes de navegación */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={() => { playSound('pop'); onNavigate('studio'); }}
            className="gl-btn gl-btn-blue py-3 text-base font-display"
          >
            <Camera className="w-5 h-5" /> Estudio
          </button>
          <button
            onClick={() => { playSound('pop'); onNavigate('gacha'); }}
            className="gl-btn gl-btn-pink py-3 text-base font-display"
          >
            <Gem className="w-5 h-5" /> Gacha
          </button>
          <button
            onClick={() => { playSound('pop'); onNavigate('quests'); }}
            className="gl-btn gl-btn-yellow py-2 text-xs"
          >
            <Gamepad2 className="w-4 h-4" /> Juegos
          </button>
          <button
            onClick={() => { playSound('click'); setShowOptions(true); }}
            className="gl-btn gl-btn-white py-2 text-xs"
          >
            <Settings className="w-4 h-4" /> Opciones
          </button>
        </div>
      </aside>

      {/* ============================ MODAL DE OPCIONES ============================ */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3B52]/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setShowOptions(false)}>
          <div
            className="w-full max-w-sm gl-card p-5 space-y-3 !shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="gl-title font-display text-xl">Opciones</h3>
              <button onClick={() => setShowOptions(false)} className="icon-btn w-8 h-8 !text-rosa-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { playSound('click'); onToggleMute(); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                {isMuted ? <VolumeX className="w-6 h-6 text-lav-500" /> : <Volume2 className="w-6 h-6 text-lav-500" />}
                {isMuted ? 'Activar Sonido' : 'Silenciar'}
              </button>
              <button onClick={() => { playSound('pop'); handleExportPng(); setShowOptions(false); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <Download className="w-6 h-6 text-lav-500" /> Exportar PNG
              </button>
              <button onClick={() => { playSound('pop'); handleShareCode(); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <Share2 className="w-6 h-6 text-lav-500" /> Copiar Código
              </button>
              <button onClick={() => { playSound('pop'); handleImportCode(); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <UserPlus className="w-6 h-6 text-lav-500" /> Importar Código
              </button>
              <button onClick={() => { playSound('pop'); onNavigate('collection'); setShowOptions(false); }} className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs">
                <BookOpen className="w-6 h-6 text-lav-500" /> Colección
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Restablecer la apariencia de este personaje? Puedes deshacerlo con Deshacer.')) {
                    playSound('pop');
                    handleReset();
                    setShowOptions(false);
                  }
                }}
                className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs !text-[#E86A7E]"
              >
                <RotateCcw className="w-6 h-6" /> Restablecer
              </button>
            </div>
            <p className="text-[10px] text-center font-semibold text-ink-faint">
              Chibiverse Gacha Studio · Los assets se cargan desde assets/items/
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
