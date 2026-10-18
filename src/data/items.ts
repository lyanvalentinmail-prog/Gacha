/**
 * Datos del juego — TODO lo que son prendas / accesorios / partes de cuerpo
 * se genera automáticamente desde assets/items/ (ver src/data/assetCatalog.ts).
 *
 * Para agregar ropa nueva: crea <id>.svg + <id>.txt (+ <id>.json opcional)
 * en la carpeta correspondiente de assets/items/ y aparecerá aquí solo.
 */
import { GachaItem, Rarity } from '../types';
import {
  buildGachaItems,
  getAssetsByPart,
  getBackgrounds,
  getSkinTones,
  AssetItem,
} from './assetCatalog';

export interface ItemOption {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  previewUrl?: string;
  iconName?: string;
  /** Asset completo (para renderizar miniaturas reales) */
  asset?: AssetItem;
}

const toOptions = (partKey: string): ItemOption[] =>
  getAssetsByPart(partKey).map((a) => ({
    id: a.id,
    name: a.name,
    rarity: a.rarity,
    description: a.description,
    asset: a,
  }));

// ---------------------------------------------------------------------------
// Opciones de cada parte (generadas desde assets/items/)
// ---------------------------------------------------------------------------
export const HAIR_FRONT_OPTIONS: ItemOption[] = toOptions('hairFront');
export const HAIR_REAR_OPTIONS: ItemOption[] = toOptions('hairRear');
export const HAIR_SIDE_OPTIONS: ItemOption[] = toOptions('hairSide');
export const EYE_OPTIONS: ItemOption[] = toOptions('eyes');
export const EYEBROW_OPTIONS: ItemOption[] = toOptions('eyebrows');
export const MOUTH_OPTIONS: ItemOption[] = toOptions('mouth');
export const BLUSH_OPTIONS: ItemOption[] = toOptions('blush');
export const EXPRESSION_OPTIONS: ItemOption[] = toOptions('expression');
export const TOP_OPTIONS: ItemOption[] = toOptions('top');
export const BOTTOM_OPTIONS: ItemOption[] = toOptions('bottom');
export const SHOES_OPTIONS: ItemOption[] = toOptions('shoes');
export const SOCKS_OPTIONS: ItemOption[] = toOptions('socks');
export const HAT_OPTIONS: ItemOption[] = toOptions('hat');
export const GLASSES_OPTIONS: ItemOption[] = toOptions('glasses');
export const NECK_OPTIONS: ItemOption[] = toOptions('neck');
export const WINGS_OPTIONS: ItemOption[] = toOptions('wings');
export const TAIL_OPTIONS: ItemOption[] = toOptions('tail');
export const PROP_OPTIONS: ItemOption[] = toOptions('prop');
export const AURA_OPTIONS: ItemOption[] = toOptions('aura');
export const POSE_OPTIONS: ItemOption[] = toOptions('pose');

// ---------------------------------------------------------------------------
// Paletas de color del editor
// ---------------------------------------------------------------------------
export const COLOR_PALETTES = {
  skin: getSkinTones().map((a) => ({ name: a.name, hex: a.color || '#FFE6D8' })),
  hair: [
    { name: 'Rosa Pastel', hex: '#FFAAA6' },
    { name: 'Fucsia Neón', hex: '#FF5376' },
    { name: 'Lavanda Dulce', hex: '#C3B1E1' },
    { name: 'Violeta Astral', hex: '#7E57C2' },
    { name: 'Azul Celeste', hex: '#A0C4FF' },
    { name: 'Azul Marino', hex: '#273469' },
    { name: 'Verde Menta', hex: '#B9FBC0' },
    { name: 'Esmeralda', hex: '#2D6A4F' },
    { name: 'Rubio Dorado', hex: '#FFEAA7' },
    { name: 'Naranja Melocotón', hex: '#FFBE76' },
    { name: 'Castaño Chocolate', hex: '#795548' },
    { name: 'Plata Puro', hex: '#E0E1DD' },
    { name: 'Negro Azabache', hex: '#2B2D42' },
    { name: 'Blanco Nieve', hex: '#FFFFFF' },
    { name: 'Carmesí Fuego', hex: '#E63946' },
    { name: 'Turquesa Mágico', hex: '#48CAE4' },
  ],
  eyes: [
    { name: 'Zafiro Profundo', hex: '#2A6F97' },
    { name: 'Aguamarina', hex: '#64DFDF' },
    { name: 'Rubí Brillante', hex: '#D90429' },
    { name: 'Rosa Flor', hex: '#FF70A6' },
    { name: 'Amatista', hex: '#9D4EDD' },
    { name: 'Esmeralda Mística', hex: '#38B000' },
    { name: 'Ámbar Cálido', hex: '#FF9E00' },
    { name: 'Obsidiana', hex: '#212529' },
    { name: 'Miel Avellana', hex: '#B08968' },
    { name: 'Violeta Neón', hex: '#C77DFF' },
    { name: 'Gris Perla', hex: '#ADB5BD' },
    { name: 'Dorado Solar', hex: '#FFD166' },
  ],
  clothes: [
    { name: 'Rosa Chicle', hex: '#FF9EAA' },
    { name: 'Rosa Pastel', hex: '#FFD1DC' },
    { name: 'Lavanda Seda', hex: '#D8B4E2' },
    { name: 'Lila Oscuro', hex: '#6B4C9A' },
    { name: 'Blanco Crema', hex: '#FFFDF9' },
    { name: 'Gris Carbón', hex: '#343A40' },
    { name: 'Azul Marino Escolar', hex: '#1D3557' },
    { name: 'Celeste Cielo', hex: '#A8DADC' },
    { name: 'Menta Fresca', hex: '#B7E4C7' },
    { name: 'Verde Bosque', hex: '#1B4332' },
    { name: 'Amarillo Vainilla', hex: '#FDFFB6' },
    { name: 'Coral Suave', hex: '#FFB5A7' },
    { name: 'Rojo Carmesí', hex: '#C1121F' },
    { name: 'Dorado Brillante', hex: '#FFD700' },
    { name: 'Púrpura Brujita', hex: '#4A148C' },
    { name: 'Negro Gótico', hex: '#1A1A24' },
  ],
};

// ---------------------------------------------------------------------------
// Fondos de escena: incluye los assets de assets/items/fondos/
// ---------------------------------------------------------------------------
export interface BackgroundOption {
  id: string;
  name: string;
  category: string;
  gradient: string;
  icon: string;
  /** SVG completo del fondo (si proviene de assets/items/fondos/) */
  svg?: string;
}

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  ...getBackgrounds().map((b) => ({
    id: b.id,
    name: b.name,
    category: 'Fondos',
    gradient: 'from-[#FFE8EC] via-[#FFF0F5] to-[#E6F0FA]',
    icon: '🖼️',
    svg: b.fullSvg,
  })),
  { id: 'bg_sakura', name: 'Parque de Sakura', category: 'Naturaleza', gradient: 'from-[#FFE8EC] via-[#FFF0F5] to-[#E6F0FA]', icon: '🌸' },
  { id: 'bg_classroom', name: 'Salón Escolar Soleado', category: 'Escuela', gradient: 'from-[#FFF8E7] via-[#FFF3DB] to-[#F0E6D2]', icon: '🏫' },
  { id: 'bg_bedroom', name: 'Habitación Pastel & Peluches', category: 'Interiores', gradient: 'from-[#FCE4EC] via-[#F3E5F5] to-[#EDE7F6]', icon: '🧸' },
  { id: 'bg_cafe', name: 'Café & Pastelería Dulce', category: 'Lugares', gradient: 'from-[#FFF3E0] via-[#FFE0B2] to-[#FFCCBC]', icon: '☕' },
  { id: 'bg_starlit', name: 'Cielo Nocturno Astral', category: 'Fantasía', gradient: 'from-[#1A102F] via-[#311B92] to-[#512DA8]', icon: '✨' },
  { id: 'bg_cyber', name: 'Ciudad Cyberpunk Neón', category: 'Sci-Fi', gradient: 'from-[#0D0221] via-[#1F0836] to-[#0F4C75]', icon: '🌆' },
  { id: 'bg_beach', name: 'Atardecer en la Playa', category: 'Naturaleza', gradient: 'from-[#FF7043] via-[#FFA726] to-[#FFE082]', icon: '🏖️' },
  { id: 'bg_fantasy_shrine', name: 'Santuario en las Nubes', category: 'Fantasía', gradient: 'from-[#E1BEE7] via-[#D1C4E9] to-[#C5CAE9]', icon: '⛩️' },
  { id: 'bg_grid_pastel', name: 'Estudio Fotográfico Cuadriculado', category: 'Estudio', gradient: 'from-[#F8BBD0] via-[#E1BEE7] to-[#D1C4E9]', icon: '📐' },
  { id: 'bg_chroma', name: 'Croma Verde de Edición', category: 'Especial', gradient: 'from-[#00FF66] to-[#00CC44]', icon: '🟩' },
];

export const STICKER_OPTIONS = [
  { id: 'stk_heart', name: 'Corazón Dulce', icon: '💖', label: 'Corazón' },
  { id: 'stk_sparkles', name: 'Destellos Estelares', icon: '✨', label: 'Destellos' },
  { id: 'stk_star', name: 'Estrella Dorada', icon: '⭐', label: 'Estrella' },
  { id: 'stk_sweat', name: 'Gota de Sudor Anime', icon: '💧', label: 'Sudor' },
  { id: 'stk_anger', name: 'Vena de Enfadado', icon: '💢', label: 'Enfado' },
  { id: 'stk_note', name: 'Notas Musicales', icon: '🎵', label: 'Música' },
  { id: 'stk_cat', name: 'Gatito Mascota', icon: '🐱', label: 'Gatito' },
  { id: 'stk_bunny', name: 'Conejito Mascota', icon: '🐰', label: 'Conejito' },
  { id: 'stk_cherry', name: 'Flor Sakura', icon: '🌸', label: 'Sakura' },
  { id: 'stk_magic', name: 'Círculo Rúnico', icon: '🔮', label: 'Magia' },
  { id: 'stk_fire', name: 'Llamita Cósmica', icon: '🔥', label: 'Fuego' },
  { id: 'stk_cloud', name: 'Nubecita Suave', icon: '☁️', label: 'Nube' },
  { id: 'stk_bubble_pow', name: '¡POW! Cómic', icon: '💥', label: 'Pow' },
  { id: 'stk_zzz', name: 'Zzz Dormilón', icon: '💤', label: 'Zzz' },
];

// ---------------------------------------------------------------------------
// Catálogo Gacha — generado desde los assets
// ---------------------------------------------------------------------------
export const ALL_GACHA_ITEMS: GachaItem[] = buildGachaItems();

export const GACHA_BANNERS = [
  {
    id: 'banner_astral',
    name: 'Pabellón Astral & Celestial',
    subtitle: 'Destellos de Luz & Sombras Eternas',
    tagline: '¡Mayor probabilidad de obtener Alas de Ángel, Báculo Cósmico y Corona Real!',
    coverGradient: 'from-[#4A148C] via-[#311B92] to-[#1A237E]',
    featuredItems: ['hat_space_helmet', 'wings_cyber_wings', 'prop_celestial_staff', 'aura_astral_nebula', 'wings_angel_wings', 'hat_angel_halo'],
    rateUpMultiplier: 3.0,
  },
  {
    id: 'banner_idol',
    name: 'Idol Dream Festival',
    subtitle: 'El Concierto Más Brillante de Chibiverse',
    tagline: '¡Consigue atuendos exclusivos de escenario, audífonos gamer y varita mágica!',
    coverGradient: 'from-[#FF6F91] via-[#FF9EAA] to-[#FFAAA6]',
    featuredItems: ['hair_heart', 'hair_drills', 'clothes_idol_blouse', 'hat_gamer_headset', 'prop_idol_mic', 'prop_magic_wand'],
    rateUpMultiplier: 3.0,
  },
  {
    id: 'banner_fantasy',
    name: 'Cosplay Fantasía & Mística',
    subtitle: 'Brujitas, Kitsunes y Criaturas Sagradas',
    tagline: '¡Desbloquea colas de nueve colas, sombreros arcanos y corsés victorianos!',
    coverGradient: 'from-[#2E7D32] via-[#00897B] to-[#00ACC1]',
    featuredItems: ['hat_witch_hat', 'tail_kitsune_tail', 'clothes_gothic_corset', 'eyes_star', 'aura_magic_circle', 'wings_fairy_wings'],
    rateUpMultiplier: 3.0,
  },
];

export const STARTER_QUESTS = [
  {
    id: 'quest_first_character',
    title: 'Creador Novato',
    description: 'Personaliza y guarda tu primer personaje en un slot.',
    rewardGems: 300,
    icon: '✨',
    isCompleted: false,
    progress: 1,
    target: 1,
  },
  {
    id: 'quest_first_gacha',
    title: 'Deseo a las Estrellas',
    description: 'Realiza tu primera invocación en el sistema Gacha.',
    rewardGems: 500,
    icon: '🌟',
    isCompleted: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'quest_studio_scene',
    title: 'Director de Cine',
    description: 'Crea una escena en el Modo Estudio y añade personajes.',
    rewardGems: 400,
    icon: '🎬',
    isCompleted: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'quest_multi_pull',
    title: 'Invocador Maestro',
    description: 'Haz una tirada múltiple x10 en cualquier banner.',
    rewardGems: 800,
    icon: '💎',
    isCompleted: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'quest_export_png',
    title: 'Fotógrafo Estelar',
    description: 'Exporta una imagen PNG de tu personaje o escena.',
    rewardGems: 400,
    icon: '📸',
    isCompleted: false,
    progress: 0,
    target: 1,
  },
];
