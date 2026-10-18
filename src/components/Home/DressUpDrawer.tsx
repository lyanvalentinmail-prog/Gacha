import React, { useState, useEffect } from 'react';
import { Character, CharacterParts, CharacterColors } from '../../types';
import { ItemSelectorGrid } from '../Editor/ItemSelectorGrid';
import { ColorPickerPanel } from '../Editor/ColorPickerPanel';
import { AssetThumb } from '../AssetThumb';
import {
  HAIR_FRONT_OPTIONS,
  HAIR_REAR_OPTIONS,
  HAIR_SIDE_OPTIONS,
  EYE_OPTIONS,
  EYEBROW_OPTIONS,
  MOUTH_OPTIONS,
  BLUSH_OPTIONS,
  EXPRESSION_OPTIONS,
  TOP_OPTIONS,
  BOTTOM_OPTIONS,
  SHOES_OPTIONS,
  SOCKS_OPTIONS,
  HAT_OPTIONS,
  GLASSES_OPTIONS,
  NECK_OPTIONS,
  WINGS_OPTIONS,
  TAIL_OPTIONS,
  PROP_OPTIONS,
  AURA_OPTIONS,
  POSE_OPTIONS,
} from '../../data/items';
import { getSkinTones } from '../../data/assetCatalog';
import { Dices, RotateCcw, Download, Share2, BookOpen, UserPlus, Check } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

export type DressPanel = 'presets' | 'body' | 'hair' | 'face' | 'clothes' | 'other' | 'props' | 'profile';

interface DressUpDrawerProps {
  panel: DressPanel;
  character: Character;
  updatePart: <K extends keyof CharacterParts>(key: K, value: CharacterParts[K]) => void;
  updateColor: <K extends keyof CharacterColors>(key: K, value: CharacterColors[K]) => void;
  pushChange: (c: Character) => void;
  unlockedSet: Set<string>;
  onRandomize: () => void;
  onReset: () => void;
  onOpenCollection: () => void;
  onExportPng: () => void;
  onShareCode: () => void;
  onImportCode: () => void;
}

const SUBTABS: Record<DressPanel, { id: string; label: string }[]> = {
  presets: [],
  body: [
    { id: 'pose', label: 'Poses' },
    { id: 'skin', label: 'Piel' },
  ],
  hair: [
    { id: 'front', label: 'Flequillo' },
    { id: 'rear', label: 'Trasero' },
    { id: 'side', label: 'Lados' },
    { id: 'color', label: 'Color' },
  ],
  face: [
    { id: 'eyes', label: 'Ojos' },
    { id: 'eyebrows', label: 'Cejas' },
    { id: 'mouth', label: 'Bocas' },
    { id: 'blush', label: 'Sonrojo' },
    { id: 'expression', label: 'Expresión' },
    { id: 'color', label: 'Color' },
  ],
  clothes: [
    { id: 'top', label: 'Tops' },
    { id: 'bottom', label: 'Faldas' },
    { id: 'shoes', label: 'Zapatos' },
    { id: 'socks', label: 'Calcetines' },
    { id: 'color', label: 'Color' },
  ],
  other: [
    { id: 'hat', label: 'Sombreros' },
    { id: 'glasses', label: 'Gafas' },
    { id: 'neck', label: 'Cuello' },
    { id: 'wings', label: 'Alas' },
    { id: 'tail', label: 'Colas' },
    { id: 'aura', label: 'Auras' },
    { id: 'color', label: 'Color' },
  ],
  props: [],
  profile: [],
};

const thumb = (opt: { asset?: Parameters<typeof AssetThumb>[0]['asset'] }) =>
  opt.asset ? <AssetThumb asset={opt.asset} /> : null;

export const DressUpDrawer: React.FC<DressUpDrawerProps> = ({
  panel,
  character,
  updatePart,
  updateColor,
  pushChange,
  unlockedSet,
  onRandomize,
  onReset,
  onOpenCollection,
  onExportPng,
  onShareCode,
  onImportCode,
}) => {
  const subs = SUBTABS[panel];
  const [sub, setSub] = useState<string>(subs[0]?.id ?? '');

  useEffect(() => {
    setSub(SUBTABS[panel][0]?.id ?? '');
  }, [panel]);

  const currentCharacter = character;

  const grid = (
    options: Parameters<typeof ItemSelectorGrid>[0]['options'],
    selectedId: string,
    partKey: keyof CharacterParts,
    title: string
  ) => (
    <ItemSelectorGrid
      options={options}
      selectedId={selectedId}
      onSelect={(id) => {
        playSound('equip');
        updatePart(partKey, id as never);
      }}
      unlockedSet={unlockedSet}
      categoryTitle={title}
      renderThumbnail={thumb}
    />
  );

  const renderContent = () => {
    // -------------------------------------------------------------- PRESETS
    if (panel === 'presets') {
      return (
        <div className="space-y-3">
          <p className="text-[10px] font-extrabold text-ink-soft uppercase tracking-wider px-1">Preajustes & Acciones Rápidas</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { playSound('pop'); onRandomize(); }}
              className="gl-btn gl-btn-yellow flex-col gap-1.5 p-3 text-xs"
            >
              <Dices className="w-6 h-6" />
              ¡Aleatorio!
            </button>
            <button
              onClick={() => {
                if (confirm('¿Restablecer la apariencia? Puedes deshacerlo después.')) {
                  playSound('click');
                  onReset();
                }
              }}
              className="gl-btn gl-btn-white flex-col gap-1.5 p-3 text-xs"
            >
              <RotateCcw className="w-6 h-6 text-lav-500" />
              Restablecer
            </button>
            <button
              onClick={() => { playSound('pop'); onExportPng(); }}
              className="gl-btn gl-btn-blue flex-col gap-1.5 p-3 text-xs"
            >
              <Download className="w-6 h-6" />
              Exportar PNG
            </button>
            <button
              onClick={() => { playSound('pop'); onOpenCollection(); }}
              className="gl-btn gl-btn-pink flex-col gap-1.5 p-3 text-xs"
            >
              <BookOpen className="w-6 h-6" />
              Colección
            </button>
          </div>
          <div className="p-3 rounded-2xl bg-lav-50 border-[1.5px] border-line-lav text-[11px] text-ink-soft leading-relaxed font-semibold">
            <b className="text-ink">Tip:</b> la ropa, accesorios y partes del cuerpo se cargan desde la carpeta
            <code className="mx-1 px-1 rounded bg-white font-bold text-rosa-600 border border-line-rose">assets/items/</code>.
            ¡Agregar cosas nuevas es tan fácil como soltar un archivo SVG con su nombre!
          </div>
        </div>
      );
    }

    // ---------------------------------------------------------------- BODY
    if (panel === 'body') {
      if (sub === 'pose') {
        return grid(POSE_OPTIONS, currentCharacter.parts.pose, 'pose', 'Poses y Posturas');
      }
      const skins = getSkinTones();
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold text-ink-soft uppercase tracking-wider">Tonos de Piel</span>
              <span className="text-[11px] font-semibold text-ink-faint">{skins.length} opciones</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {skins.map((s) => {
                const isSelected = currentCharacter.colors.skin === s.color;
                return (
                  <button
                    key={s.id}
                    title={s.name}
                    onClick={() => { playSound('equip'); updateColor('skin', s.color || '#FFE6D8'); }}
                    className={`aspect-square rounded-2xl border-[1.5px] transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-rosa-400 ring-2 ring-rosa-200 scale-105'
                        : 'border-line-rose hover:scale-105'
                    }`}
                    style={{ backgroundColor: s.color }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-rosa-600 drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>
          <ColorPickerPanel
            label="Tono de Piel Personalizado"
            currentColor={currentCharacter.colors.skin}
            paletteType="skin"
            onChangeColor={(hex) => updateColor('skin', hex)}
          />
        </div>
      );
    }

    // ---------------------------------------------------------------- HAIR
    if (panel === 'hair') {
      if (sub === 'front') return grid(HAIR_FRONT_OPTIONS, currentCharacter.parts.hairFront, 'hairFront', 'Flequillo');
      if (sub === 'rear') return grid(HAIR_REAR_OPTIONS, currentCharacter.parts.hairRear, 'hairRear', 'Cabello Trasero');
      if (sub === 'side') return grid(HAIR_SIDE_OPTIONS, currentCharacter.parts.hairSide, 'hairSide', 'Mechones Laterales');
      return (
        <div className="space-y-4">
          <ColorPickerPanel label="Color Principal del Cabello" currentColor={currentCharacter.colors.hairBase} paletteType="hair" onChangeColor={(hex) => updateColor('hairBase', hex)} />
          <ColorPickerPanel label="Color Secundario / Brillo" currentColor={currentCharacter.colors.hairSub} paletteType="hair" onChangeColor={(hex) => updateColor('hairSub', hex)} />
          <ColorPickerPanel label="Color del Contorno" currentColor={currentCharacter.colors.hairOutline} paletteType="clothes" onChangeColor={(hex) => updateColor('hairOutline', hex)} />
        </div>
      );
    }

    // ---------------------------------------------------------------- FACE
    if (panel === 'face') {
      if (sub === 'eyes') return grid(EYE_OPTIONS, currentCharacter.parts.eyes, 'eyes', 'Ojos');
      if (sub === 'eyebrows') return grid(EYEBROW_OPTIONS, currentCharacter.parts.eyebrows, 'eyebrows', 'Cejas');
      if (sub === 'mouth') return grid(MOUTH_OPTIONS, currentCharacter.parts.mouth, 'mouth', 'Bocas');
      if (sub === 'blush') return grid(BLUSH_OPTIONS, currentCharacter.parts.blush, 'blush', 'Sonrojo & Marcas');
      if (sub === 'expression') return grid(EXPRESSION_OPTIONS, currentCharacter.parts.expression, 'expression', 'Expresión Facial');
      return (
        <div className="space-y-4">
          <ColorPickerPanel label="Color Principal de Ojos" currentColor={currentCharacter.colors.eyePrimary} paletteType="eyes" onChangeColor={(hex) => updateColor('eyePrimary', hex)} />
          <ColorPickerPanel label="Reflejo Secundario" currentColor={currentCharacter.colors.eyeSecondary} paletteType="eyes" onChangeColor={(hex) => updateColor('eyeSecondary', hex)} />
          <ColorPickerPanel label="Color de Cejas" currentColor={currentCharacter.colors.eyebrows} paletteType="hair" onChangeColor={(hex) => updateColor('eyebrows', hex)} />
        </div>
      );
    }

    // -------------------------------------------------------------- CLOTHES
    if (panel === 'clothes') {
      if (sub === 'top') return grid(TOP_OPTIONS, currentCharacter.parts.top, 'top', 'Tops, Sudaderas & Camisas');
      if (sub === 'bottom') return grid(BOTTOM_OPTIONS, currentCharacter.parts.bottom, 'bottom', 'Faldas, Shorts & Pantalones');
      if (sub === 'shoes') return grid(SHOES_OPTIONS, currentCharacter.parts.shoes, 'shoes', 'Calzado & Zapatillas');
      if (sub === 'socks') return grid(SOCKS_OPTIONS, currentCharacter.parts.socks, 'socks', 'Calcetines & Medias');
      return (
        <div className="space-y-4">
          <ColorPickerPanel label="Color Principal del Top" currentColor={currentCharacter.colors.topPrimary} paletteType="clothes" onChangeColor={(hex) => updateColor('topPrimary', hex)} />
          <ColorPickerPanel label="Color Secundario / Lazos" currentColor={currentCharacter.colors.topSecondary} paletteType="clothes" onChangeColor={(hex) => updateColor('topSecondary', hex)} />
          <ColorPickerPanel label="Color Falda / Pantalón" currentColor={currentCharacter.colors.bottomPrimary} paletteType="clothes" onChangeColor={(hex) => updateColor('bottomPrimary', hex)} />
          <ColorPickerPanel label="Color del Calzado" currentColor={currentCharacter.colors.shoesPrimary} paletteType="clothes" onChangeColor={(hex) => updateColor('shoesPrimary', hex)} />
        </div>
      );
    }

    // ---------------------------------------------------------------- OTHER
    if (panel === 'other') {
      if (sub === 'hat') return grid(HAT_OPTIONS, currentCharacter.parts.hat, 'hat', 'Sombreros, Diademas & Orejitas');
      if (sub === 'glasses') return grid(GLASSES_OPTIONS, currentCharacter.parts.glasses, 'glasses', 'Gafas, Parches & Mascarillas');
      if (sub === 'neck') return grid(NECK_OPTIONS, currentCharacter.parts.neck, 'neck', 'Collares, Lazos & Gargantillas');
      if (sub === 'wings') return grid(WINGS_OPTIONS, currentCharacter.parts.wings, 'wings', 'Alas Místicas & Mecánicas');
      if (sub === 'tail') return grid(TAIL_OPTIONS, currentCharacter.parts.tail, 'tail', 'Colas de Criatura');
      if (sub === 'aura') return grid(AURA_OPTIONS, currentCharacter.parts.aura, 'aura', 'Auras & Efectos');
      return (
        <div className="space-y-4">
          <ColorPickerPanel label="Color Sombrero / Diadema" currentColor={currentCharacter.colors.hatPrimary} paletteType="clothes" onChangeColor={(hex) => updateColor('hatPrimary', hex)} />
          <ColorPickerPanel label="Color de Gafas" currentColor={currentCharacter.colors.glasses} paletteType="clothes" onChangeColor={(hex) => updateColor('glasses', hex)} />
          <ColorPickerPanel label="Color de Cuello / Moño" currentColor={currentCharacter.colors.neck} paletteType="clothes" onChangeColor={(hex) => updateColor('neck', hex)} />
          <ColorPickerPanel label="Color de Alas" currentColor={currentCharacter.colors.wings} paletteType="clothes" onChangeColor={(hex) => updateColor('wings', hex)} />
          <ColorPickerPanel label="Color de Cola" currentColor={currentCharacter.colors.tail} paletteType="hair" onChangeColor={(hex) => updateColor('tail', hex)} />
          <ColorPickerPanel label="Color de Aura" currentColor={currentCharacter.colors.aura} paletteType="clothes" onChangeColor={(hex) => updateColor('aura', hex)} />
        </div>
      );
    }

    // ---------------------------------------------------------------- PROPS
    if (panel === 'props') {
      return grid(PROP_OPTIONS, currentCharacter.parts.prop, 'prop', 'Objetos & Armas en Mano');
    }

    // -------------------------------------------------------------- PROFILE
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">Nombre</label>
          <input
            type="text"
            value={currentCharacter.name}
            onChange={(e) => pushChange({ ...currentCharacter, name: e.target.value })}
            className="soft-input"
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">Título / Ocupación</label>
          <input
            type="text"
            value={currentCharacter.title}
            onChange={(e) => pushChange({ ...currentCharacter, title: e.target.value })}
            className="soft-input"
            placeholder="ej. Idol Estelar, Brujita Traviesa..."
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">Elemento</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Luz', 'Sombra', 'Fuego', 'Agua', 'Viento', 'Astral'] as const).map((elem) => (
              <button
                key={elem}
                onClick={() => { playSound('click'); pushChange({ ...currentCharacter, element: elem }); }}
                className={`py-1.5 rounded-full text-[11px] font-bold border-[1.5px] transition-all ${
                  currentCharacter.element === elem
                    ? 'bg-gradient-to-b from-rosa-400 to-rosa-500 text-white border-rosa-500 shadow-sm'
                    : 'bg-white border-line-lav text-ink-soft hover:border-lav-300 hover:text-ink'
                }`}
              >
                {elem}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">Comida Favorita</label>
          <input
            type="text"
            value={currentCharacter.favorite}
            onChange={(e) => pushChange({ ...currentCharacter, favorite: e.target.value })}
            className="soft-input"
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-1 px-1">Biografía / Historia</label>
          <textarea
            value={currentCharacter.bio}
            onChange={(e) => pushChange({ ...currentCharacter, bio: e.target.value })}
            rows={3}
            className="soft-input !text-xs font-medium resize-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => { playSound('pop'); onShareCode(); }}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border-[1.5px] border-line-lav text-ink-soft font-bold text-[10px] hover:border-rosa-300 hover:text-rosa-500 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" /> Código
          </button>
          <button
            onClick={() => { playSound('pop'); onImportCode(); }}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border-[1.5px] border-line-lav text-ink-soft font-bold text-[10px] hover:border-rosa-300 hover:text-rosa-500 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Importar
          </button>
          <button
            onClick={() => { playSound('pop'); onOpenCollection(); }}
            className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white border-[1.5px] border-line-lav text-ink-soft font-bold text-[10px] hover:border-rosa-300 hover:text-rosa-500 transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4" /> Colección
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 min-h-0 flex-1">
      {/* Subcategorías */}
      {subs.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {subs.map((st) => (
            <button
              key={st.id}
              onClick={() => { playSound('pop'); setSub(st.id); }}
              className={`gl-chip ${sub === st.id ? 'gl-chip-active' : ''}`}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}

      {/* Contenido */}
      <div key={`${panel}-${sub}`} className="flex-1 overflow-y-auto pr-1 min-h-0 panel-in">{renderContent()}</div>
    </div>
  );
};

export default DressUpDrawer;
