/**
 * Catálogo de assets — carga automática desde assets/items/
 *
 * Cada item es un trío de archivos:
 *   <id>.svg   → el arte (viewBox 0 0 400 480, colores con CSS vars)
 *   <id>.txt   → el nombre que se muestra en el juego
 *   <id>.json  → metadatos opcionales (rareza, descripción, etc.)
 *
 * Para AGREGAR ropa/cosas nuevas sólo hay que soltar los archivos en la
 * carpeta correcta — este catálogo los detecta solo (import.meta.glob).
 */
import { CharacterColors, CharacterParts, GachaItem, Rarity } from '../types';

// ---------------------------------------------------------------------------
// Carga en bruto de todos los archivos de assets/items/
// ---------------------------------------------------------------------------
const svgModules = import.meta.glob('../../assets/items/**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const txtModules = import.meta.glob('../../assets/items/**/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const jsonModules = import.meta.glob('../../assets/items/**/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// ---------------------------------------------------------------------------
// Configuración de carpetas: carpeta → parte del personaje / capa de dibujo
// ---------------------------------------------------------------------------
export interface FolderConfig {
  partKey: string | null;
  layer: string;
  gachaCategory: GachaItem['category'] | null;
  focus: [number, number, number, number]; // recorte para miniaturas (viewBox)
  label: string;
}

export const FOLDER_MAP: Record<string, FolderConfig> = {
  'ropa/tops': { partKey: 'top', layer: 'top', gachaCategory: 'clothes', focus: [130, 215, 145, 130], label: 'Tops' },
  'ropa/faldas': { partKey: 'bottom', layer: 'bottom', gachaCategory: 'clothes', focus: [125, 285, 150, 125], label: 'Faldas' },
  'ropa/zapatos': { partKey: 'shoes', layer: 'shoes', gachaCategory: 'clothes', focus: [140, 385, 130, 75], label: 'Zapatos' },
  'ropa/calcetines': { partKey: 'socks', layer: 'socks', gachaCategory: 'clothes', focus: [145, 335, 115, 115], label: 'Calcetines' },
  'cabello/frente': { partKey: 'hairFront', layer: 'hairFront', gachaCategory: 'hair', focus: [100, 55, 200, 180], label: 'Flequillo' },
  'cabello/atras': { partKey: 'hairRear', layer: 'hairRear', gachaCategory: 'hair', focus: [55, 55, 290, 350], label: 'Cabello Atrás' },
  'cabello/lados': { partKey: 'hairSide', layer: 'hairSide', gachaCategory: 'hair', focus: [95, 45, 210, 235], label: 'Mechones' },
  'rostro/ojos': { partKey: 'eyes', layer: 'eyes', gachaCategory: 'eyes', focus: [118, 128, 164, 85], label: 'Ojos' },
  'rostro/cejas': { partKey: 'eyebrows', layer: 'eyebrows', gachaCategory: 'eyes', focus: [120, 118, 160, 45], label: 'Cejas' },
  'rostro/bocas': { partKey: 'mouth', layer: 'mouth', gachaCategory: 'eyes', focus: [168, 178, 64, 50], label: 'Bocas' },
  'rostro/sonrojo': { partKey: 'blush', layer: 'blush', gachaCategory: 'eyes', focus: [115, 158, 170, 62], label: 'Sonrojo' },
  'accesorios/cabeza': { partKey: 'hat', layer: 'hat', gachaCategory: 'hat', focus: [95, 28, 210, 170], label: 'Sombreros' },
  'accesorios/gafas': { partKey: 'glasses', layer: 'glasses', gachaCategory: 'hat', focus: [115, 128, 170, 82], label: 'Gafas' },
  'accesorios/cuello': { partKey: 'neck', layer: 'neck', gachaCategory: 'hat', focus: [155, 210, 90, 75], label: 'Cuello' },
  'extras/alas': { partKey: 'wings', layer: 'wings', gachaCategory: 'wings', focus: [30, 50, 340, 260], label: 'Alas' },
  'extras/colas': { partKey: 'tail', layer: 'tail', gachaCategory: 'tail', focus: [215, 225, 165, 165], label: 'Colas' },
  'extras/auras': { partKey: 'aura', layer: 'aura', gachaCategory: 'aura', focus: [60, 60, 280, 380], label: 'Auras' },
  props: { partKey: 'prop', layer: 'prop', gachaCategory: 'prop', focus: [230, 135, 150, 240], label: 'Objetos' },
  'cuerpo/poses': { partKey: 'pose', layer: 'pose', gachaCategory: null, focus: [75, 35, 250, 420], label: 'Poses' },
  'cuerpo/expresiones': { partKey: 'expression', layer: 'expression', gachaCategory: null, focus: [115, 125, 170, 100], label: 'Expresiones' },
  'cuerpo/piel': { partKey: 'skin', layer: 'color', gachaCategory: null, focus: [70, 60, 260, 360], label: 'Piel' },
  fondos: { partKey: null, layer: 'background', gachaCategory: null, focus: [0, 0, 800, 600], label: 'Fondos' },
};

// ---------------------------------------------------------------------------
// Modelo de asset
// ---------------------------------------------------------------------------
export interface AssetItem {
  id: string;
  folder: string;
  partKey: string | null;
  layer: string;
  name: string;
  description: string;
  rarity: Rarity;
  /** Contenido interno del SVG (para insertar dentro del personaje) */
  inner: string;
  /** SVG completo (para miniaturas) */
  fullSvg: string;
  viewBox: string;
  focus: [number, number, number, number];
  /** Opción vacía ("Sin Accesorio"): se muestra en selectores pero no dibuja */
  empty: boolean;
  /** false = no se dibuja sobre el personaje (ej. swatches de piel) */
  draw: boolean;
  color?: string;
  hideShoes?: boolean;
  hideDefaultLegs?: boolean;
  /** Capas que reemplaza al equipar (ej. expresión que sustituye los ojos) */
  replaces: string[];
}

interface AssetJson {
  rarity?: Rarity;
  description?: string;
  empty?: boolean;
  draw?: boolean;
  color?: string;
  hideShoes?: boolean;
  hideDefaultLegs?: boolean;
  replaces?: string[];
  focus?: [number, number, number, number];
}

function normalizeKey(key: string): string {
  // '../../assets/items/ropa/tops/hoodie.svg' → 'ropa/tops/hoodie'
  const marker = 'assets/items/';
  const i = key.indexOf(marker);
  return i >= 0 ? key.slice(i + marker.length).replace(/\.(svg|txt|json)$/, '') : key;
}

function folderOf(rel: string): string {
  const i = rel.lastIndexOf('/');
  return i >= 0 ? rel.slice(0, i) : '';
}

function idOf(rel: string): string {
  const i = rel.lastIndexOf('/');
  return i >= 0 ? rel.slice(i + 1) : rel;
}

function parseJsonSafe(raw: string | undefined): AssetJson {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as AssetJson;
  } catch {
    return {};
  }
}

function extractInner(svg: string): string {
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
}

function extractViewBox(svg: string): string {
  const m = svg.match(/viewBox="([^"]+)"/);
  return m ? m[1] : '0 0 400 480';
}

// ---------------------------------------------------------------------------
// Construcción del catálogo
// ---------------------------------------------------------------------------
function buildCatalog(): AssetItem[] {
  const items: AssetItem[] = [];
  const seen = new Set<string>();

  for (const [key, svg] of Object.entries(svgModules)) {
    const rel = normalizeKey(key);
    const folder = folderOf(rel);
    const id = idOf(rel);
    const cfg = FOLDER_MAP[folder];
    if (!cfg) {
      console.warn(`[assets] Carpeta sin configurar: ${folder} (${id})`);
      continue;
    }
    const json = parseJsonSafe(jsonModules[key.replace(/\.svg$/, '.json')]);
    const name = (txtModules[key.replace(/\.svg$/, '.txt')] || id).trim();
    seen.add(rel);

    items.push({
      id,
      folder,
      partKey: cfg.partKey,
      layer: cfg.layer,
      name,
      description: json.description ?? '',
      rarity: json.rarity ?? 3,
      inner: extractInner(svg),
      fullSvg: svg,
      viewBox: extractViewBox(svg),
      focus: json.focus ?? cfg.focus,
      empty: json.empty ?? false,
      draw: json.draw ?? true,
      color: json.color,
      hideShoes: json.hideShoes ?? false,
      hideDefaultLegs: json.hideDefaultLegs ?? false,
      replaces: json.replaces ?? [],
    });
  }

  // Items sin arte (opciones "none" u otras) que sólo tienen .txt + .json
  for (const [key, raw] of Object.entries(jsonModules)) {
    const rel = normalizeKey(key);
    if (seen.has(rel)) continue;
    const folder = folderOf(rel);
    const id = idOf(rel);
    const cfg = FOLDER_MAP[folder];
    if (!cfg) continue;
    const json = parseJsonSafe(raw);
    const name = (txtModules[key.replace(/\.json$/, '.txt')] || id).trim();

    items.push({
      id,
      folder,
      partKey: cfg.partKey,
      layer: cfg.layer,
      name,
      description: json.description ?? '',
      rarity: json.rarity ?? 3,
      inner: '',
      fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480"></svg>`,
      viewBox: '0 0 400 480',
      focus: json.focus ?? cfg.focus,
      empty: json.empty ?? true,
      draw: false,
      color: json.color,
      hideShoes: json.hideShoes ?? false,
      hideDefaultLegs: json.hideDefaultLegs ?? false,
      replaces: json.replaces ?? [],
    });
  }

  return items;
}

export const ALL_ASSETS: AssetItem[] = buildCatalog();

// ---------------------------------------------------------------------------
// API del catálogo
// ---------------------------------------------------------------------------
export function getAllAssets(): AssetItem[] {
  return ALL_ASSETS;
}

export function getAssetsByPart(partKey: string): AssetItem[] {
  return ALL_ASSETS.filter((a) => a.partKey === partKey).sort((a, b) => {
    if (a.empty !== b.empty) return a.empty ? -1 : 1;
    return a.name.localeCompare(b.name, 'es');
  });
}

export function getAssetsByFolder(folder: string): AssetItem[] {
  return ALL_ASSETS.filter((a) => a.folder === folder).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export function getAsset(partKey: string, id: string): AssetItem | undefined {
  return ALL_ASSETS.find((a) => a.partKey === partKey && a.id === id);
}

export function getBackgrounds(): AssetItem[] {
  return ALL_ASSETS.filter((a) => a.layer === 'background');
}

export function getSkinTones(): AssetItem[] {
  return ALL_ASSETS.filter((a) => a.folder === 'cuerpo/piel');
}

/** IDs de capas que el asset actual reemplaza al equiparse */
export function getReplacedLayers(partKey: string, id: string): string[] {
  return getAsset(partKey, id)?.replaces ?? [];
}

/** ID con el que el item aparece en el Gacha / colección */
export function gachaIdFor(partKey: string, id: string): string {
  const asset = getAsset(partKey, id);
  const cat = asset ? FOLDER_MAP[asset.folder]?.gachaCategory : null;
  return cat ? `${cat}_${id}` : `${partKey}_${id}`;
}

/** Genera el catálogo Gacha desde los assets (los items con categoría gacha) */
export function buildGachaItems(): GachaItem[] {
  const out: GachaItem[] = [];
  for (const asset of ALL_ASSETS) {
    const cfg = FOLDER_MAP[asset.folder];
    if (!cfg?.gachaCategory || !asset.partKey || asset.empty) continue;
    out.push({
      id: `${cfg.gachaCategory}_${asset.id}`,
      name: asset.name,
      category: cfg.gachaCategory,
      rarity: asset.rarity,
      description: asset.description || asset.name,
      partKey: asset.partKey as keyof CharacterParts,
      partValue: asset.id,
      previewColor: asset.color || undefined,
    });
  }
  return out;
}

/** Variables CSS de color a partir de los colores del personaje */
export function colorVars(colors: CharacterColors): Record<string, string> {
  return {
    '--skin': colors.skin,
    '--hair-base': colors.hairBase,
    '--hair-sub': colors.hairSub,
    '--hair-outline': colors.hairOutline,
    '--eye-primary': colors.eyePrimary,
    '--eye-secondary': colors.eyeSecondary,
    '--eyebrows': colors.eyebrows,
    '--blush': colors.blush,
    '--top-primary': colors.topPrimary,
    '--top-secondary': colors.topSecondary,
    '--bottom-primary': colors.bottomPrimary,
    '--bottom-secondary': colors.bottomSecondary,
    '--shoes-primary': colors.shoesPrimary,
    '--shoes-secondary': colors.shoesSecondary,
    '--hat-primary': colors.hatPrimary,
    '--hat-secondary': colors.hatSecondary,
    '--glasses': colors.glasses,
    '--neck': colors.neck,
    '--wings': colors.wings,
    '--tail': colors.tail,
    '--prop': colors.prop,
    '--aura': colors.aura,
  };
}
