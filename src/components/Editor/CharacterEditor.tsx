import React, { useState, useRef } from 'react';
import { Character, CharacterParts, CharacterColors } from '../../types';
import { ChibiRenderer } from '../../renderer/ChibiRenderer';
import { SlotsBar } from './SlotsBar';
import { CategoryTabs, MainCategory } from './CategoryTabs';
import { ItemSelectorGrid } from './ItemSelectorGrid';
import { ColorPickerPanel } from './ColorPickerPanel';
import { ActionToolbar } from './ActionToolbar';
import { exportCharacterJSON, exportSvgToPng } from '../../utils/exportUtils';
import {
  HAIR_FRONT_OPTIONS,
  HAIR_REAR_OPTIONS,
  HAIR_SIDE_OPTIONS,
  EYE_OPTIONS,
  EYEBROW_OPTIONS,
  MOUTH_OPTIONS,
  BLUSH_OPTIONS,
  TOP_OPTIONS,
  BOTTOM_OPTIONS,
  SHOES_OPTIONS,
  HAT_OPTIONS,
  GLASSES_OPTIONS,
  NECK_OPTIONS,
  WINGS_OPTIONS,
  TAIL_OPTIONS,
  PROP_OPTIONS,
  AURA_OPTIONS,
  POSE_OPTIONS,
  COLOR_PALETTES,
} from '../../data/items';
import {
  ZoomIn,
  ZoomOut,
  Sparkles,
  Smile,
  RefreshCw,
  Heart,
  Palette,
  Check,
  Share2,
} from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface CharacterEditorProps {
  characters: Character[];
  activeSlot: number;
  onSelectSlot: (index: number) => void;
  onUpdateCharacter: (updated: Character) => void;
  onCreateSlot: () => void;
  onDuplicateSlot: (index: number) => void;
  onDeleteSlot: (index: number) => void;
  onRenameSlot: (index: number, newName: string) => void;
  unlockedSet: Set<string>;
  onTriggerSaveNotification?: () => void;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({
  characters,
  activeSlot,
  onSelectSlot,
  onUpdateCharacter,
  onCreateSlot,
  onDuplicateSlot,
  onDeleteSlot,
  onRenameSlot,
  unlockedSet,
  onTriggerSaveNotification,
}) => {
  const currentCharacter = characters[activeSlot] || characters[0];

  // Active Category & Subcategory
  const [activeCategory, setActiveCategory] = useState<MainCategory>('hair');
  const [activeSubTab, setActiveSubTab] = useState<string>('front');

  // Preview zoom & animation state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Undo / Redo history
  const [history, setHistory] = useState<Character[]>([currentCharacter]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Character preview container ref for PNG export
  const previewRef = useRef<HTMLDivElement>(null);

  // Update helper with history tracking
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
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateCharacter(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateCharacter(next);
    }
  };

  const updatePart = <K extends keyof CharacterParts>(key: K, value: CharacterParts[K]) => {
    pushChange({
      ...currentCharacter,
      parts: {
        ...currentCharacter.parts,
        [key]: value,
      },
    });
  };

  const updateColor = <K extends keyof CharacterColors>(key: K, value: CharacterColors[K]) => {
    pushChange({
      ...currentCharacter,
      colors: {
        ...currentCharacter.colors,
        [key]: value,
      },
    });
  };

  // Harmonious Randomizer
  const handleRandomize = () => {
    const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const hairPalettes = COLOR_PALETTES.hair;
    const eyePalettes = COLOR_PALETTES.eyes;
    const clothesPalettes = COLOR_PALETTES.clothes;

    const baseHair = getRandom(hairPalettes).hex;
    const subHair = getRandom(hairPalettes).hex;
    const eyeCol = getRandom(eyePalettes).hex;
    const topPrimary = getRandom(clothesPalettes).hex;
    const topSecondary = getRandom(clothesPalettes).hex;

    const randomized: Character = {
      ...currentCharacter,
      name: currentCharacter.name,
      parts: {
        ...currentCharacter.parts,
        hairFront: getRandom(HAIR_FRONT_OPTIONS).id,
        hairRear: getRandom(HAIR_REAR_OPTIONS).id,
        hairSide: getRandom(HAIR_SIDE_OPTIONS).id,
        eyes: getRandom(EYE_OPTIONS).id,
        mouth: getRandom(MOUTH_OPTIONS).id,
        blush: getRandom(BLUSH_OPTIONS).id,
        top: getRandom(TOP_OPTIONS).id,
        bottom: getRandom(BOTTOM_OPTIONS).id,
        shoes: getRandom(SHOES_OPTIONS).id,
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
    };

    pushChange(randomized);
  };

  // Reset to default
  const handleReset = () => {
    const resetChar: Character = {
      ...currentCharacter,
      parts: {
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
        expression: 'happy',
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
    };
    pushChange(resetChar);
  };

  // Save feedback
  const handleManualSave = () => {
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
    if (onTriggerSaveNotification) onTriggerSaveNotification();
  };

  // Export PNG of character
  const handleExportPng = async () => {
    if (!previewRef.current) return;
    const svg = previewRef.current.querySelector('svg');
    if (!svg) return;
    try {
      await exportSvgToPng(svg, currentCharacter.name);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Error al exportar la imagen.');
    }
  };

  // Share / Copy JSON code
  const handleShareCode = () => {
    const code = JSON.stringify(currentCharacter);
    navigator.clipboard.writeText(code).then(() => {
      alert(`¡Código de "${currentCharacter.name}" copiado al portapapeles! Puedes compartirlo o importarlo en otro slot.`);
    }).catch(() => {
      exportCharacterJSON(currentCharacter);
    });
  };

  // Render Subcategory Tabs inside Right Panel
  const renderSubTabs = () => {
    switch (activeCategory) {
      case 'hair':
        return [
          { id: 'front', label: 'Flequillo' },
          { id: 'rear', label: 'Trasero' },
          { id: 'side', label: 'Lateral / Ahoge' },
          { id: 'color', label: 'Color & Tintes' },
        ];
      case 'face':
        return [
          { id: 'eyes', label: 'Ojos' },
          { id: 'eyebrows', label: 'Cejas' },
          { id: 'mouth', label: 'Boca' },
          { id: 'blush', label: 'Sonrojo & Marcas' },
          { id: 'expression', label: 'Expresiones' },
          { id: 'color', label: 'Color de Ojos' },
        ];
      case 'clothes':
        return [
          { id: 'top', label: 'Tops & Blusas' },
          { id: 'bottom', label: 'Faldas & Pantalones' },
          { id: 'shoes', label: 'Zapatos' },
          { id: 'color', label: 'Colores Ropa' },
        ];
      case 'accessories':
        return [
          { id: 'hat', label: 'Sombreros & Orejas' },
          { id: 'glasses', label: 'Gafas & Parches' },
          { id: 'neck', label: 'Cuello & Lazos' },
          { id: 'color', label: 'Colores Accesorios' },
        ];
      case 'fantasy':
        return [
          { id: 'wings', label: 'Alas' },
          { id: 'tail', label: 'Colas' },
          { id: 'prop', label: 'Objeto en Mano' },
          { id: 'aura', label: 'Aura & Efectos' },
          { id: 'color', label: 'Colores Fantasía' },
        ];
      case 'body_pose':
        return [
          { id: 'pose', label: 'Poses' },
          { id: 'skin', label: 'Tono de Piel' },
        ];
      case 'profile':
        return [
          { id: 'info', label: 'Datos Básicos' },
          { id: 'element', label: 'Elemento Astral' },
        ];
      default:
        return [];
    }
  };

  // Render Category Specific Options
  const renderCategoryContent = () => {
    // 1. HAIR
    if (activeCategory === 'hair') {
      if (activeSubTab === 'front') {
        return (
          <ItemSelectorGrid
            options={HAIR_FRONT_OPTIONS}
            selectedId={currentCharacter.parts.hairFront}
            onSelect={(id) => updatePart('hairFront', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Peinados Delanteros (Flequillos)"
          />
        );
      }
      if (activeSubTab === 'rear') {
        return (
          <ItemSelectorGrid
            options={HAIR_REAR_OPTIONS}
            selectedId={currentCharacter.parts.hairRear}
            onSelect={(id) => updatePart('hairRear', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Peinados Traseros"
          />
        );
      }
      if (activeSubTab === 'side') {
        return (
          <ItemSelectorGrid
            options={HAIR_SIDE_OPTIONS}
            selectedId={currentCharacter.parts.hairSide}
            onSelect={(id) => updatePart('hairSide', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Mechones Laterales & Ahoge"
          />
        );
      }
      if (activeSubTab === 'color') {
        return (
          <div className="space-y-4">
            <ColorPickerPanel
              label="Color Base del Cabello"
              currentColor={currentCharacter.colors.hairBase}
              paletteType="hair"
              onChangeColor={(hex) => updateColor('hairBase', hex)}
            />
            <ColorPickerPanel
              label="Tinte de Puntas / Degradado"
              currentColor={currentCharacter.colors.hairSub}
              paletteType="hair"
              onChangeColor={(hex) => updateColor('hairSub', hex)}
            />
            <ColorPickerPanel
              label="Color de Contorno / Sombra"
              currentColor={currentCharacter.colors.hairOutline}
              paletteType="hair"
              onChangeColor={(hex) => updateColor('hairOutline', hex)}
            />
          </div>
        );
      }
    }

    // 2. FACE
    if (activeCategory === 'face') {
      if (activeSubTab === 'eyes') {
        return (
          <ItemSelectorGrid
            options={EYE_OPTIONS}
            selectedId={currentCharacter.parts.eyes}
            onSelect={(id) => updatePart('eyes', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Forma de los Ojos"
          />
        );
      }
      if (activeSubTab === 'eyebrows') {
        return (
          <ItemSelectorGrid
            options={EYEBROW_OPTIONS}
            selectedId={currentCharacter.parts.eyebrows}
            onSelect={(id) => updatePart('eyebrows', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Cejas"
          />
        );
      }
      if (activeSubTab === 'mouth') {
        return (
          <ItemSelectorGrid
            options={MOUTH_OPTIONS}
            selectedId={currentCharacter.parts.mouth}
            onSelect={(id) => updatePart('mouth', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Boca & Sonrisa"
          />
        );
      }
      if (activeSubTab === 'blush') {
        return (
          <ItemSelectorGrid
            options={BLUSH_OPTIONS}
            selectedId={currentCharacter.parts.blush}
            onSelect={(id) => updatePart('blush', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Sonrojo & Detalles Faciales"
          />
        );
      }
      if (activeSubTab === 'expression') {
        const expressions = [
          { id: 'happy', label: 'Feliz / Radiante', icon: '😄' },
          { id: 'wink', label: 'Guiño Pícaro', icon: '😉' },
          { id: 'smug', label: 'Seguro / Smug', icon: '😏' },
          { id: 'sleepy', label: 'Somnoliento', icon: '😴' },
          { id: 'shy', label: 'Tímido / Sonrojado', icon: '🥺' },
          { id: 'angry', label: 'Enojado / Fuerte', icon: '😠' },
        ];
        return (
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#7A6E85] uppercase">
              Expresión Facial Instantánea
            </p>
            <div className="grid grid-cols-2 gap-2">
              {expressions.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => {
                    playSound('pop');
                    updatePart('expression', exp.id);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                    currentCharacter.parts.expression === exp.id
                      ? 'bg-pink-50 border-[#FF6F91] ring-2 ring-[#FF6F91]/50 shadow-cute font-extrabold text-[#FF6F91]'
                      : 'bg-white hover:bg-pink-50/50 border-pink-100 text-[#3D344B]'
                  }`}
                >
                  <span className="text-2xl">{exp.icon}</span>
                  <span className="text-xs font-bold">{exp.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }
      if (activeSubTab === 'color') {
        return (
          <div className="space-y-4">
            <ColorPickerPanel
              label="Color Principal de Ojos"
              currentColor={currentCharacter.colors.eyePrimary}
              paletteType="eyes"
              onChangeColor={(hex) => updateColor('eyePrimary', hex)}
            />
            <ColorPickerPanel
              label="Color de Reflejo Secundario"
              currentColor={currentCharacter.colors.eyeSecondary}
              paletteType="eyes"
              onChangeColor={(hex) => updateColor('eyeSecondary', hex)}
            />
            <ColorPickerPanel
              label="Color de Cejas"
              currentColor={currentCharacter.colors.eyebrows}
              paletteType="hair"
              onChangeColor={(hex) => updateColor('eyebrows', hex)}
            />
          </div>
        );
      }
    }

    // 3. CLOTHES
    if (activeCategory === 'clothes') {
      if (activeSubTab === 'top') {
        return (
          <ItemSelectorGrid
            options={TOP_OPTIONS}
            selectedId={currentCharacter.parts.top}
            onSelect={(id) => updatePart('top', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Tops, Sudaderas & Camisas"
          />
        );
      }
      if (activeSubTab === 'bottom') {
        return (
          <ItemSelectorGrid
            options={BOTTOM_OPTIONS}
            selectedId={currentCharacter.parts.bottom}
            onSelect={(id) => updatePart('bottom', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Faldas, Shorts & Pantalones"
          />
        );
      }
      if (activeSubTab === 'shoes') {
        return (
          <ItemSelectorGrid
            options={SHOES_OPTIONS}
            selectedId={currentCharacter.parts.shoes}
            onSelect={(id) => updatePart('shoes', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Calzado & Zapatillas"
          />
        );
      }
      if (activeSubTab === 'color') {
        return (
          <div className="space-y-4">
            <ColorPickerPanel
              label="Color Principal del Top"
              currentColor={currentCharacter.colors.topPrimary}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('topPrimary', hex)}
            />
            <ColorPickerPanel
              label="Color Secundario del Top / Lazos"
              currentColor={currentCharacter.colors.topSecondary}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('topSecondary', hex)}
            />
            <ColorPickerPanel
              label="Color Principal de la Falda/Pantalón"
              currentColor={currentCharacter.colors.bottomPrimary}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('bottomPrimary', hex)}
            />
            <ColorPickerPanel
              label="Color del Calzado"
              currentColor={currentCharacter.colors.shoesPrimary}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('shoesPrimary', hex)}
            />
          </div>
        );
      }
    }

    // 4. ACCESSORIES
    if (activeCategory === 'accessories') {
      if (activeSubTab === 'hat') {
        return (
          <ItemSelectorGrid
            options={HAT_OPTIONS}
            selectedId={currentCharacter.parts.hat}
            onSelect={(id) => updatePart('hat', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Sombreros, Diademas & Orejitas"
          />
        );
      }
      if (activeSubTab === 'glasses') {
        return (
          <ItemSelectorGrid
            options={GLASSES_OPTIONS}
            selectedId={currentCharacter.parts.glasses}
            onSelect={(id) => updatePart('glasses', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Gafas, Parches & Mascarillas"
          />
        );
      }
      if (activeSubTab === 'neck') {
        return (
          <ItemSelectorGrid
            options={NECK_OPTIONS}
            selectedId={currentCharacter.parts.neck}
            onSelect={(id) => updatePart('neck', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Collares, Lazos & Gargantillas"
          />
        );
      }
      if (activeSubTab === 'color') {
        return (
          <div className="space-y-4">
            <ColorPickerPanel
              label="Color de Sombrero / Diadema"
              currentColor={currentCharacter.colors.hatPrimary}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('hatPrimary', hex)}
            />
            <ColorPickerPanel
              label="Color de Montura de Gafas"
              currentColor={currentCharacter.colors.glasses}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('glasses', hex)}
            />
            <ColorPickerPanel
              label="Color de Cuello / Moño"
              currentColor={currentCharacter.colors.neck}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('neck', hex)}
            />
          </div>
        );
      }
    }

    // 5. FANTASY
    if (activeCategory === 'fantasy') {
      if (activeSubTab === 'wings') {
        return (
          <ItemSelectorGrid
            options={WINGS_OPTIONS}
            selectedId={currentCharacter.parts.wings}
            onSelect={(id) => updatePart('wings', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Alas Místicas & Mecánicas"
          />
        );
      }
      if (activeSubTab === 'tail') {
        return (
          <ItemSelectorGrid
            options={TAIL_OPTIONS}
            selectedId={currentCharacter.parts.tail}
            onSelect={(id) => updatePart('tail', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Colas de Criatura"
          />
        );
      }
      if (activeSubTab === 'prop') {
        return (
          <ItemSelectorGrid
            options={PROP_OPTIONS}
            selectedId={currentCharacter.parts.prop}
            onSelect={(id) => updatePart('prop', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Objetos & Armas en Mano"
          />
        );
      }
      if (activeSubTab === 'aura') {
        return (
          <ItemSelectorGrid
            options={AURA_OPTIONS}
            selectedId={currentCharacter.parts.aura}
            onSelect={(id) => updatePart('aura', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Auras & Efectos de Ambiente"
          />
        );
      }
      if (activeSubTab === 'color') {
        return (
          <div className="space-y-4">
            <ColorPickerPanel
              label="Color de Alas"
              currentColor={currentCharacter.colors.wings}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('wings', hex)}
            />
            <ColorPickerPanel
              label="Color de Cola"
              currentColor={currentCharacter.colors.tail}
              paletteType="hair"
              onChangeColor={(hex) => updateColor('tail', hex)}
            />
            <ColorPickerPanel
              label="Color de Aura Mágica"
              currentColor={currentCharacter.colors.aura}
              paletteType="clothes"
              onChangeColor={(hex) => updateColor('aura', hex)}
            />
          </div>
        );
      }
    }

    // 6. BODY & POSE
    if (activeCategory === 'body_pose') {
      if (activeSubTab === 'pose') {
        return (
          <ItemSelectorGrid
            options={POSE_OPTIONS}
            selectedId={currentCharacter.parts.pose}
            onSelect={(id) => updatePart('pose', id)}
            unlockedSet={unlockedSet}
            categoryTitle="Poses y Posturas"
          />
        );
      }
      if (activeSubTab === 'skin') {
        return (
          <div className="space-y-4">
            <ColorPickerPanel
              label="Tono de Piel Chibi"
              currentColor={currentCharacter.colors.skin}
              paletteType="skin"
              onChangeColor={(hex) => updateColor('skin', hex)}
            />
          </div>
        );
      }
    }

    // 7. PROFILE & INFO
    if (activeCategory === 'profile') {
      return (
        <div className="space-y-4 bg-white/80 p-4 rounded-2xl border border-pink-100 shadow-sm">
          <div>
            <label className="block text-xs font-extrabold text-[#3D344B] uppercase tracking-wider mb-1">
              Nombre del Personaje
            </label>
            <input
              type="text"
              value={currentCharacter.name}
              onChange={(e) => pushChange({ ...currentCharacter, name: e.target.value })}
              className="w-full text-sm font-bold px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:border-[#FF6F91] bg-white shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#3D344B] uppercase tracking-wider mb-1">
              Título / Ocupación
            </label>
            <input
              type="text"
              value={currentCharacter.title}
              onChange={(e) => pushChange({ ...currentCharacter, title: e.target.value })}
              className="w-full text-sm font-bold px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:border-[#FF6F91] bg-white shadow-xs"
              placeholder="ej. Idol Estelar, Brujita Traviesa..."
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#3D344B] uppercase tracking-wider mb-1">
              Elemento
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Luz', 'Sombra', 'Fuego', 'Agua', 'Viento', 'Astral'] as const).map((elem) => (
                <button
                  key={elem}
                  onClick={() => {
                    playSound('click');
                    pushChange({ ...currentCharacter, element: elem });
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    currentCharacter.element === elem
                      ? 'bg-gradient-to-r from-[#FF6F91] to-[#9B72CF] text-white border-transparent shadow-xs'
                      : 'bg-white hover:bg-pink-50 border-pink-200 text-[#7A6E85]'
                  }`}
                >
                  {elem}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#3D344B] uppercase tracking-wider mb-1">
              Comida Favorita
            </label>
            <input
              type="text"
              value={currentCharacter.favorite}
              onChange={(e) => pushChange({ ...currentCharacter, favorite: e.target.value })}
              className="w-full text-sm font-bold px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:border-[#FF6F91] bg-white shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#3D344B] uppercase tracking-wider mb-1">
              Biografía / Historia
            </label>
            <textarea
              value={currentCharacter.bio}
              onChange={(e) => pushChange({ ...currentCharacter, bio: e.target.value })}
              rows={3}
              className="w-full text-xs font-medium px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:border-[#FF6F91] bg-white shadow-xs resize-none"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const subTabs = renderSubTabs();

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-transparent overflow-hidden">
      {/* 1. Character Slots Bar (Left dock on desktop, horizontal on mobile) */}
      <SlotsBar
        characters={characters}
        activeSlot={activeSlot}
        onSelectSlot={onSelectSlot}
        onCreateSlot={onCreateSlot}
        onDuplicateSlot={onDuplicateSlot}
        onDeleteSlot={onDeleteSlot}
        onRenameSlot={onRenameSlot}
        onExportSlot={exportCharacterJSON}
        onImportSlot={() => {
          const code = prompt('Pega el código JSON del personaje aquí:');
          if (code) {
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
            } catch (e) {
              alert('Error al leer el código JSON.');
            }
          }
        }}
      />

      {/* 2. Central Stage & Preview */}
      <main className="flex-1 flex flex-col items-center justify-between p-3 sm:p-5 relative min-w-0 overflow-hidden">
        {/* Top Actions Bar */}
        <div className="w-full max-w-xl mb-3">
          <ActionToolbar
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onRandomize={handleRandomize}
            onSave={handleManualSave}
            onReset={handleReset}
            onExportPng={handleExportPng}
            onShareCode={handleShareCode}
          />
        </div>

        {/* Character Stage Container */}
        <div className="relative flex-1 w-full max-w-xl flex items-center justify-center min-h-[360px] sm:min-h-[460px]">
          {/* Subtle Stage Pedestal / Glow */}
          <div className="absolute w-72 h-16 sm:w-96 sm:h-20 bg-gradient-to-t from-pink-200/50 via-purple-100/30 to-transparent rounded-[100%] bottom-6 blur-md pointer-events-none" />
          <div className="absolute w-60 h-8 sm:w-80 sm:h-10 bg-white/70 border border-pink-200/80 rounded-[100%] bottom-8 shadow-inner pointer-events-none" />

          {/* Character SVG Component */}
          <div ref={previewRef} className="relative z-10 transition-transform duration-200">
            <ChibiRenderer
              character={currentCharacter}
              animate={isAnimating}
              scale={zoomLevel}
              className="w-[280px] h-[340px] sm:w-[360px] sm:h-[440px]"
            />
          </div>

          {/* Floating Stage Controls (Zoom, Animation toggle) */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-pink-200 shadow-sm z-20">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
              title="Acercar zoom"
              className="p-1.5 rounded-xl hover:bg-pink-100 text-[#7A6E85] hover:text-[#FF6F91] transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
              title="Alejar zoom"
              className="p-1.5 rounded-xl hover:bg-pink-100 text-[#7A6E85] hover:text-[#FF6F91] transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playSound('click');
                setIsAnimating(!isAnimating);
              }}
              title={isAnimating ? 'Pausar respiración' : 'Activar respiración'}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                isAnimating ? 'text-[#FF6F91] bg-pink-50' : 'text-[#7A6E85] hover:bg-pink-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Name Badge */}
          <div className="absolute top-2 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-2xl border border-pink-200/80 shadow-xs z-20 flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#3D344B]">
              {currentCharacter.name}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-[#9B72CF]">
              {currentCharacter.element}
            </span>
          </div>

          {/* Save Toast Notification */}
          {isSavedFeedback && (
            <div className="absolute top-2 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-2xl shadow-cute flex items-center gap-1.5 animate-bounce z-30">
              <Check className="w-4 h-4" />
              <span>¡Guardado correctamente!</span>
            </div>
          )}
        </div>
      </main>

      {/* 3. Right Editor Panel (Categories, Subcategories, Grid & Color Pickers) */}
      <section className="w-full lg:w-[420px] flex flex-col bg-white/85 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-pink-200/70 p-3 sm:p-4 gap-3 overflow-hidden shrink-0 z-20">
        {/* Main Categories Navigation */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            // reset subtab
            if (cat === 'hair') setActiveSubTab('front');
            else if (cat === 'face') setActiveSubTab('eyes');
            else if (cat === 'clothes') setActiveSubTab('top');
            else if (cat === 'accessories') setActiveSubTab('hat');
            else if (cat === 'fantasy') setActiveSubTab('wings');
            else if (cat === 'body_pose') setActiveSubTab('pose');
            else if (cat === 'profile') setActiveSubTab('info');
          }}
        />

        {/* Subcategories pill tabs */}
        {subTabs.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-pink-100">
            {subTabs.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  playSound('pop');
                  setActiveSubTab(st.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeSubTab === st.id
                    ? 'bg-[#FF6F91] text-white shadow-xs scale-105'
                    : 'bg-pink-50 hover:bg-pink-100 text-[#7A6E85]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Category Content Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {renderCategoryContent()}
        </div>
      </section>
    </div>
  );
};
