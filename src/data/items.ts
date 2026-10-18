import { GachaItem, Rarity } from '../types';

export interface ItemOption {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  previewUrl?: string;
  iconName?: string;
}

export const HAIR_FRONT_OPTIONS: ItemOption[] = [
  { id: 'blunt', name: 'Flequillo Recto', rarity: 3, description: 'Corte recto kawaii tradicional' },
  { id: 'sideswept', name: 'Hacia un Lado', rarity: 3, description: 'Flequillo lateral elegante' },
  { id: 'curtain', name: 'Tipo Cortina', rarity: 3, description: 'Abierto al centro con ondas' },
  { id: 'spiky', name: 'Despeinado Rebelde', rarity: 4, description: 'Puntas anime con volumen' },
  { id: 'hime', name: 'Estilo Hime Princesa', rarity: 4, description: 'Cortes limpios laterales tradicionales' },
  { id: 'wavy', name: 'Ondas Suaves', rarity: 3, description: 'Mechas delicadas acariciando la cara' },
  { id: 'short', name: 'Corto Pixie', rarity: 3, description: 'Fresco, juvenil y dinámico' },
  { id: 'heart', name: 'Forma de Corazón', rarity: 5, description: 'Mechones centrales formando un corazón' },
  { id: 'micro', name: 'Micro Flequillo', rarity: 4, description: 'Moderno estilo harajuku alternativo' },
  { id: 'braided', name: 'Trenza Diadema', rarity: 5, description: 'Trenza tejida fina como corona' },
];

export const HAIR_REAR_OPTIONS: ItemOption[] = [
  { id: 'twintails', name: 'Coletas Bajas', rarity: 3, description: 'Doble coleta clásica tierna' },
  { id: 'hightwintails', name: 'Coletas Altas Anime', rarity: 4, description: 'Doble coleta alta con mucho rebote' },
  { id: 'longstraight', name: 'Largo Recto Sedoso', rarity: 3, description: 'Cabello largo hasta la cintura' },
  { id: 'longwavy', name: 'Ondas de Ensueño', rarity: 4, description: 'Melena de princesa con volumen' },
  { id: 'shortbob', name: 'Corte Bob Chibi', rarity: 3, description: 'Bob redondeado muy tierno' },
  { id: 'spikyshort', name: 'Corto Spiky Idol', rarity: 3, description: 'Estilo corto dinámico y alegre' },
  { id: 'ponytail', name: 'Coleta de Caballo', rarity: 4, description: 'Coleta alta con cinta elegante' },
  { id: 'sidebraid', name: 'Trenza Lateral', rarity: 4, description: 'Trenza caída sobre el hombro' },
  { id: 'spacebuns', name: 'Moños Dobles Odango', rarity: 4, description: 'Dos moñitos redondos adorables' },
  { id: 'drills', name: 'Espirales Ojou-sama', rarity: 5, description: 'Espirales doradas de nobleza' },
  { id: 'wolfcut', name: 'Wolf Cut Moderno', rarity: 4, description: 'Capas degradadas estilo shaggy' },
  { id: 'cloudhair', name: 'Melena Nube Flotante', rarity: 5, description: 'Volumen etéreo que parece flotar' },
];

export const HAIR_SIDE_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Extra', rarity: 3, description: 'Sin mechones adicionales' },
  { id: 'ahoge_single', name: 'Ahoge Antena', rarity: 3, description: 'Clásico mechón curioso anime' },
  { id: 'ahoge_heart', name: 'Ahoge Corazón', rarity: 4, description: 'Mechón superior en forma de corazón' },
  { id: 'side_locks', name: 'Mechones Largos', rarity: 3, description: 'Dos mechones largos cayendo al frente' },
  { id: 'twin_drills_small', name: 'Rizos Laterales', rarity: 4, description: 'Ricitos a los lados de la cabeza' },
  { id: 'feather_tufts', name: 'Mechones Alados', rarity: 5, description: 'Mechones con plumas decorativas' },
];

export const EYE_OPTIONS: ItemOption[] = [
  { id: 'sparkle', name: 'Brillo Anime Clásico', rarity: 3, description: 'Ojos grandes con triples reflejos de luz' },
  { id: 'cat', name: 'Ojos Felinos Picantes', rarity: 4, description: 'Mirada rasgada con pupila de gatito' },
  { id: 'round', name: 'Ojos Redondos Kawaii', rarity: 3, description: 'Mirada inocente de cervatillo' },
  { id: 'cool', name: 'Mirada Confiada Idol', rarity: 4, description: 'Párpado recto con mucha actitud' },
  { id: 'droopy', name: 'Tareme Suave / Tímido', rarity: 3, description: 'Ojos dulces caídos en las esquinas' },
  { id: 'star', name: 'Destello Estelar', rarity: 5, description: 'Ojos con estrellas brillantes doradas' },
  { id: 'heart', name: 'Amor Apasionado', rarity: 5, description: 'Ojos con pupilas en forma de corazón' },
  { id: 'gothic_cross', name: 'Cruces Místicas', rarity: 5, description: 'Pupilas con cruz celestial mística' },
];

export const MOUTH_OPTIONS: ItemOption[] = [
  { id: 'smile_cute', name: 'Sonrisa Tímida', rarity: 3, description: 'Dulce curva sutil' },
  { id: 'open_happy', name: 'Risa Radiante', rarity: 3, description: 'Boca abierta mostrando alegría' },
  { id: 'cat_mouth', name: 'Boca Gatuna :3', rarity: 4, description: 'La icónica forma w felina' },
  { id: 'fang', name: 'Colmillo Travieso', rarity: 4, description: 'Pequeño colmillo asomando' },
  { id: 'pout', name: 'Puchero Mohíno', rarity: 3, description: 'Boca inflada en protesta adorable' },
  { id: 'gasp', name: 'Sorpresa "O"', rarity: 3, description: 'Pequeño círculo de sorpresa' },
  { id: 'smug', name: 'Sonrisa Pícara', rarity: 4, description: 'Sonrisa de lado muy segura' },
  { id: 'dot', name: 'Silencio Minimalista', rarity: 3, description: 'Punto tímido silencioso' },
];

export const BLUSH_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Sonrojo', rarity: 3, description: 'Rostro natural' },
  { id: 'soft_pink', name: 'Sonrojo Rosado Suave', rarity: 3, description: 'Mejillas calentitas y dulces' },
  { id: 'anime_stripes', name: 'Rayitas Manga', rarity: 3, description: 'Clásicas tres líneas diagonales' },
  { id: 'full_flustered', name: 'Ultra Avergonzado', rarity: 4, description: 'Rojo total con chispitas' },
  { id: 'star_stickers', name: 'Stickers de Estrellas', rarity: 4, description: 'Estrellas pastel en ambas mejillas' },
  { id: 'heart_stamp', name: 'Sello de Corazón', rarity: 4, description: 'Corazoncito debajo del ojo' },
  { id: 'bandaid', name: 'Curita en la Nariz', rarity: 4, description: 'Curita infantil anime' },
  { id: 'tears', name: 'Lágrimas Brillantes', rarity: 5, description: 'Gotitas de emoción cristalinas' },
];

export const EYEBROW_OPTIONS: ItemOption[] = [
  { id: 'gentle', name: 'Arqueadas Suaves', rarity: 3, description: 'Expresión dulce y serena' },
  { id: 'confident', name: 'Decididas Inclinadas', rarity: 3, description: 'Expresión de determinación' },
  { id: 'worried', name: 'Preocupadas Tímidas', rarity: 3, description: 'Inclinadas hacia el centro' },
  { id: 'thick', name: 'Gruesas Chibi', rarity: 4, description: 'Cejitas redondas y expresivas' },
  { id: 'dots', name: 'Puntitos Kuge Nobles', rarity: 4, description: 'Dos óvalos tradicionales aristocráticos' },
];

export const TOP_OPTIONS: ItemOption[] = [
  { id: 'sailor_fuku', name: 'Uniforme Marinero', rarity: 3, description: 'Clásico uniforme escolar con lazo frontal' },
  { id: 'hoodie', name: 'Sudadera Oversize Gatuna', rarity: 4, description: 'Sudadera pastel con cordones y bolsillo' },
  { id: 'idol_blouse', name: 'Blusa Idol de Encaje', rarity: 4, description: 'Blusa con volantes y lazo en el pecho' },
  { id: 'sweater_vest', name: 'Chaleco de Punto & Corbata', rarity: 3, description: 'Estilo colegial elegante de academia' },
  { id: 'gothic_corset', name: 'Corsé Lolita Victoriano', rarity: 5, description: 'Encaje oscuro con mangas abullonadas' },
  { id: 'casual_tee', name: 'Camiseta Gráfica Oso', rarity: 3, description: 'Camiseta de algodón con carita tierna' },
  { id: 'magic_robe', name: 'Túnica Astral de Mago', rarity: 5, description: 'Bordes dorados con símbolos estelares' },
  { id: 'maid_top', name: 'Delantal de Maid Café', rarity: 4, description: 'Volantes blancos sobre blusa contrastada' },
  { id: 'cyber_jacket', name: 'Chaqueta Holográfica Cyber', rarity: 5, description: 'Líneas de neón y cierres metálicos' },
  { id: 'kimono_top', name: 'Haori Tradicional Yukata', rarity: 4, description: 'Mangas acampanadas y cuello cruzado' },
];

export const BOTTOM_OPTIONS: ItemOption[] = [
  { id: 'pleated_skirt', name: 'Falda Tablas Escolar', rarity: 3, description: 'Falda de pliegues clásica' },
  { id: 'frilly_skirt', name: 'Falda de Volantes Múltiples', rarity: 4, description: 'Petticoat con capas esponjosas' },
  { id: 'denim_shorts', name: 'Shorts de Mezclilla', rarity: 3, description: 'Pantalones cortos casuales' },
  { id: 'wide_pants', name: 'Pantalones Anchos Pastel', rarity: 3, description: 'Pantalones holgados cómodos' },
  { id: 'bloomers', name: 'Pantalones Bombachos Lazo', rarity: 4, description: 'Bombachos abullonados con lacitos' },
  { id: 'star_skirt', name: 'Falda Galaxia de Estrellas', rarity: 5, description: 'Falda con constelaciones bordadas' },
];

export const SHOES_OPTIONS: ItemOption[] = [
  { id: 'sneakers', name: 'Zapatillas Chunky Pastel', rarity: 3, description: 'Calzado deportivo moderno y cómodo' },
  { id: 'mary_janes', name: 'Zapatos Mary Jane con Tacón', rarity: 3, description: 'Zapatos brillantes con calcetines de encaje' },
  { id: 'knee_boots', name: 'Botas Altas de Combate/Idol', rarity: 4, description: 'Botas hasta la rodilla con cordones cruzados' },
  { id: 'ribbon_heels', name: 'Zapatillas con Lazo de Seda', rarity: 4, description: 'Calzado delicado atado al tobillo' },
  { id: 'loafers', name: 'Mocasines con Medias Altas', rarity: 3, description: 'Mocasines de academia' },
  { id: 'paw_slippers', name: 'Pantuflas de Patitas', rarity: 4, description: 'Garras suaves acolchadas' },
  { id: 'cyber_kicks', name: 'Botas Gravitatorias Neón', rarity: 5, description: 'Calzado flotante con propulsores luminosos' },
];

export const HAT_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Accesorio', rarity: 3, description: 'Cabeza despejada' },
  { id: 'beret', name: 'Boina Artística Pastel', rarity: 3, description: 'Boina francesa con broche estelar' },
  { id: 'cat_ears', name: 'Orejas de Gato con Cascabeleo', rarity: 4, description: 'Diadema con orejitas suaves y lazos' },
  { id: 'bunny_ears', name: 'Orejas de Conejo Largas', rarity: 4, description: 'Orejitas caídas con cintas de raso' },
  { id: 'witch_hat', name: 'Sombrero Mágico Puntiagudo', rarity: 5, description: 'Sombrero de brujita con hebilla de luna' },
  { id: 'gamer_headset', name: 'Audífonos Gamer Neko RGB', rarity: 5, description: 'Cascos de streaming con luces de neón' },
  { id: 'tiara_crown', name: 'Corona de Princesa Real', rarity: 5, description: 'Tiara de oro pulido con gema central' },
  { id: 'angel_halo', name: 'Aureola Celestial Dorada', rarity: 5, description: 'Aureola sagrada flotando con luz divina' },
  { id: 'demon_horns', name: 'Cuernos de Pequeño Demonio', rarity: 4, description: 'Cuernitos curvos de tono pastel' },
  { id: 'sakura_flower', name: 'Horquilla de Flor de Cerezo', rarity: 3, description: 'Delicada flor sakura en floración' },
  { id: 'maid_headdress', name: 'Tocado de Maid Rococó', rarity: 4, description: 'Cinta de encaje fruncido blanco' },
  { id: 'space_helmet', name: 'Casco Cyber Visor Flotante', rarity: 6, description: 'Visor holográfico de cristal estelar' },
];

export const GLASSES_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Gafas', rarity: 3, description: 'Sin accesorio visual' },
  { id: 'round_glasses', name: 'Gafas Redondas Doradas', rarity: 3, description: 'Montura delgada circular vintage' },
  { id: 'heart_glasses', name: 'Gafas de Corazón Retro', rarity: 4, description: 'Lentes tintados en forma de corazón' },
  { id: 'eyepatch', name: 'Parche Médico Chuunibyou', rarity: 4, description: 'Parche blanco con cruz rosada' },
  { id: 'face_mask', name: 'Mascarilla Kawaii con Carita', rarity: 3, description: 'Mascarilla de algodón suave' },
  { id: 'cyber_monocle', name: 'Monóculo Holográfico Escáner', rarity: 5, description: 'Lente futurista con interfaz táctica' },
];

export const NECK_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Cuello', rarity: 3, description: 'Cuello libre' },
  { id: 'bell_choker', name: 'Gargantilla con Cascabel', rarity: 4, description: 'Cinta aterciopelada con cascabel dorado' },
  { id: 'ribbon_bow', name: 'Gran Moño de Satén', rarity: 3, description: 'Lazo esponjoso decorativo' },
  { id: 'cozy_scarf', name: 'Bufanda Tejida Calentita', rarity: 3, description: 'Bufanda envolvente para el frío' },
  { id: 'star_pendant', name: 'Collar con Colgante Estelar', rarity: 4, description: 'Cadena fina con estrella fulgurante' },
  { id: 'heart_locket', name: 'Relicario de Corazón Dorado', rarity: 4, description: 'Medallón que guarda un recuerdo secreto' },
  { id: 'gothic_cross', name: 'Cruz Gótica Victoriana', rarity: 5, description: 'Cadena oscura con cruz ornamentada' },
];

export const WINGS_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Alas', rarity: 3, description: 'Espalda normal' },
  { id: 'angel_wings', name: 'Alas de Ángel Querubín', rarity: 5, description: 'Plumas níveas resplandecientes' },
  { id: 'devil_wings', name: 'Alas de Murciélago Travieso', rarity: 4, description: 'Alas membranosas con terminación en puntas' },
  { id: 'fairy_wings', name: 'Alas de Hada Mariposa', rarity: 5, description: 'Alas cristalinas translúcidas de polen' },
  { id: 'dragon_wings', name: 'Alas Dracónicas Legendarias', rarity: 5, description: 'Grandes alas escamadas de poder ancestral' },
  { id: 'cyber_wings', name: 'Propulsores Gravitatorios Neón', rarity: 6, description: 'Alas de energía cuántica luminiscente' },
];

export const TAIL_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Cola', rarity: 3, description: 'Sin cola' },
  { id: 'cat_tail', name: 'Cola de Gato con Moño', rarity: 4, description: 'Cola elegante y ágil con cinta' },
  { id: 'kitsune_tail', name: 'Cola de Zorro Mística Exuberante', rarity: 5, description: 'Pelaje suave y esponjoso con puntas de fuego' },
  { id: 'bunny_tail', name: 'Pom-pom de Conejito', rarity: 3, description: 'Pompón redondo super mullido' },
  { id: 'devil_tail', name: 'Cola Demoníaca con Flecha', rarity: 4, description: 'Cola flexible que termina en pica' },
  { id: 'dragon_tail', name: 'Cola Dracónica con Puntas', rarity: 5, description: 'Cola imponente con escamas brillantes' },
];

export const PROP_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Manos Libres', rarity: 3, description: 'Sin objeto en mano' },
  { id: 'magic_wand', name: 'Varita Mágica de Estrellas', rarity: 5, description: 'Canalizadora de hechizos cósmicos' },
  { id: 'boba_tea', name: 'Té Boba con Tapioca', rarity: 3, description: 'Bebida dulce helada con popote' },
  { id: 'teddy_bear', name: 'Osito de Peluche Cariñoso', rarity: 4, description: 'Compañero suave de felpa' },
  { id: 'gamepad', name: 'Mando Portátil Retro Gamer', rarity: 4, description: 'Consola compacta con botones luminosos' },
  { id: 'sword_light', name: 'Espada de Cristal Radiante', rarity: 5, description: 'Hoja mágica que corta la oscuridad' },
  { id: 'idol_mic', name: 'Micrófono de Concierto Idol', rarity: 4, description: 'Micrófono inalámbrico con lazo' },
  { id: 'artist_palette', name: 'Paleta y Pincel de Acuarela', rarity: 3, description: 'Para pintar mundos de fantasía' },
  { id: 'spellbook', name: 'Grimorio de Hechizos Antiguos', rarity: 5, description: 'Tomo forrado en cuero con páginas flotantes' },
  { id: 'celestial_staff', name: 'Báculo del Cosmos Infinito', rarity: 6, description: 'Reliquia sagrada que rige las constelaciones' },
];

export const AURA_OPTIONS: ItemOption[] = [
  { id: 'none', name: 'Sin Aura', rarity: 3, description: 'Sin efecto ambiental' },
  { id: 'sparkles', name: 'Destellos Mágicos', rarity: 4, description: 'Estrellitas flotantes doradas' },
  { id: 'cherry_petals', name: 'Pétalos de Sakura en Brisa', rarity: 4, description: 'Lluvia constante de flores rosadas' },
  { id: 'hearts_float', name: 'Corazones Enamorados Flotantes', rarity: 4, description: 'Ráfaga de corazones ascendentes' },
  { id: 'magic_circle', name: 'Círculo Rúnico Bajo los Pies', rarity: 5, description: 'Glifos arcanos giratorios en el suelo' },
  { id: 'dark_flames', name: 'Llamas Sombrías Ultravioleta', rarity: 5, description: 'Fuego espectral que envuelve la silueta' },
  { id: 'astral_nebula', name: 'Nebulosa Cósmica Radiante', rarity: 6, description: 'Polvo de estrellas y halos multicolores' },
];

export const POSE_OPTIONS: ItemOption[] = [
  { id: 'standing_cute', name: 'De Pie Natural', rarity: 3, description: 'Pose relajada con ligera inclinación' },
  { id: 'peace_sign', name: 'Señal de la Paz "V"', rarity: 3, description: 'Mano alzada haciendo el saludo de paz' },
  { id: 'cheerful_wave', name: 'Saludo Alegre', rarity: 3, description: 'Brazo levantado saludando con energía' },
  { id: 'hands_on_hips', name: 'Manos en la Cintura', rarity: 3, description: 'Pose segura, firme y decidida' },
  { id: 'shy_clasped', name: 'Tímida Manos Juntas', rarity: 3, description: 'Dedos entrelazados al frente con timidez' },
  { id: 'magic_cast', name: 'Lanzando Encantamiento', rarity: 4, description: 'Brazos abiertos canalizando magia' },
  { id: 'sitting_sideways', name: 'Sentada Kawaii', rarity: 4, description: 'Piernas dobladas a un lado en el suelo' },
  { id: 'jumping_action', name: 'Salto Dinámico en el Aire', rarity: 5, description: 'Flotando con dinamismo y alegría' },
  { id: 'idol_wink_pose', name: 'Paso de Baile Idol', rarity: 5, description: 'Pose de escenario con pierna flexionada' },
];

export const BACKGROUND_OPTIONS = [
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

export const COLOR_PALETTES = {
  skin: [
    { name: 'Porcelana', hex: '#FFF2EC' },
    { name: 'Cálido Suave', hex: '#FFE6D8' },
    { name: 'Beige Natural', hex: '#FAD5BC' },
    { name: 'Miel Dorado', hex: '#E2B18A' },
    { name: 'Bronce Caramelo', hex: '#BA805A' },
    { name: 'Café Profundo', hex: '#6B4028' },
    { name: 'Hada Lila', hex: '#EFE6FF' },
    { name: 'Nieve Menta', hex: '#E4F4F3' },
  ],
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

// All items catalog for Gacha summons & collection
export const ALL_GACHA_ITEMS: GachaItem[] = [
  // 6-Star Legendary
  { id: 'hat_space_helmet', name: 'Casco Cyber Visor Flotante', category: 'hat', rarity: 6, description: 'Visor holográfico de cristal estelar.', partKey: 'hat', partValue: 'space_helmet', previewColor: '#00F0FF', secondaryColor: '#7928CA' },
  { id: 'wings_cyber', name: 'Propulsores Gravitatorios Neón', category: 'wings', rarity: 6, description: 'Alas de energía cuántica luminiscente con propulsión gravitacional.', partKey: 'wings', partValue: 'cyber_wings', previewColor: '#00F0FF', secondaryColor: '#FF007F' },
  { id: 'prop_celestial_staff', name: 'Báculo del Cosmos Infinito', category: 'prop', rarity: 6, description: 'Reliquia sagrada que rige el paso de las constelaciones.', partKey: 'prop', partValue: 'celestial_staff', previewColor: '#FFD700', secondaryColor: '#9D4EDD' },
  { id: 'aura_astral', name: 'Nebulosa Cósmica Radiante', category: 'aura', rarity: 6, description: 'Polvo de estrellas y halos multicolores que gravitan alrededor.', partKey: 'aura', partValue: 'astral_nebula', previewColor: '#C77DFF', secondaryColor: '#48CAE4' },

  // 5-Star Super Rare
  { id: 'hair_front_heart', name: 'Flequillo Corazón Kawaii', category: 'hair', rarity: 5, description: 'Mechones centrales curvados en forma de corazón.', partKey: 'hairFront', partValue: 'heart', previewColor: '#FFAAA6' },
  { id: 'hair_front_braided', name: 'Trenza Diadema Real', category: 'hair', rarity: 5, description: 'Fina trenza tejida artesanal como corona imperial.', partKey: 'hairFront', partValue: 'braided', previewColor: '#FFEAA7' },
  { id: 'hair_rear_drills', name: 'Espirales Ojou-sama', category: 'hair', rarity: 5, description: 'Rizos gemelos en espiral dignos de la alta realeza.', partKey: 'hairRear', partValue: 'drills', previewColor: '#FFD166' },
  { id: 'hair_rear_cloud', name: 'Melena Nube Flotante', category: 'hair', rarity: 5, description: 'Cabello etéreo con volumen que desafía la gravedad.', partKey: 'hairRear', partValue: 'cloudhair', previewColor: '#C3B1E1' },
  { id: 'eyes_star', name: 'Ojos Estrella Cósmica', category: 'eyes', rarity: 5, description: 'Mirada fulgurante con estrellas brillantes.', partKey: 'eyes', partValue: 'star', previewColor: '#FFD700' },
  { id: 'eyes_heart', name: 'Ojos Amor Dulce', category: 'eyes', rarity: 5, description: 'Pupilas palpitantes de romance puro.', partKey: 'eyes', partValue: 'heart', previewColor: '#FF70A6' },
  { id: 'eyes_cross', name: 'Ojos Místicos Cruz', category: 'eyes', rarity: 5, description: 'Mirada enigmática con sellos sagrados en la pupila.', partKey: 'eyes', partValue: 'gothic_cross', previewColor: '#9D4EDD' },
  { id: 'top_gothic', name: 'Corsé Lolita Victoriano', category: 'clothes', rarity: 5, description: 'Elegancia gótica pura con lazos de terciopelo.', partKey: 'top', partValue: 'gothic_corset', previewColor: '#2B2D42', secondaryColor: '#9D4EDD' },
  { id: 'top_magic_robe', name: 'Túnica Astral de Mago', category: 'clothes', rarity: 5, description: 'Tejido encantado bordado con constelaciones.', partKey: 'top', partValue: 'magic_robe', previewColor: '#311B92', secondaryColor: '#FFD700' },
  { id: 'top_cyber', name: 'Chaqueta Holográfica Cyber', category: 'clothes', rarity: 5, description: 'Fibra luminosa con reguladores de temperatura térmica.', partKey: 'top', partValue: 'cyber_jacket', previewColor: '#1A1A24', secondaryColor: '#00F0FF' },
  { id: 'bottom_star', name: 'Falda Galaxia de Estrellas', category: 'clothes', rarity: 5, description: 'Falda con constelaciones bordadas con hilo de plata.', partKey: 'bottom', partValue: 'star_skirt', previewColor: '#1A102F', secondaryColor: '#FFD700' },
  { id: 'hat_witch', name: 'Sombrero de Brujita Astral', category: 'hat', rarity: 5, description: 'Confeccionado en tela nocturna con broche lunar.', partKey: 'hat', partValue: 'witch_hat', previewColor: '#4A148C', secondaryColor: '#FFD700' },
  { id: 'hat_tiara', name: 'Corona de Princesa Real', category: 'hat', rarity: 5, description: 'Oro blanco pulido engastado con rubíes rosados.', partKey: 'hat', partValue: 'tiara_crown', previewColor: '#FFD700', secondaryColor: '#FF6F91' },
  { id: 'hat_halo', name: 'Aureola Celestial Dorada', category: 'hat', rarity: 5, description: 'Luz bendita flotando sobre la cabeza del portador.', partKey: 'hat', partValue: 'angel_halo', previewColor: '#FFF3B0', secondaryColor: '#FFD700' },
  { id: 'hat_gamer', name: 'Audífonos Gamer Neko RGB', category: 'hat', rarity: 5, description: 'Orejitas con iluminación sincronizada al ritmo musical.', partKey: 'hat', partValue: 'gamer_headset', previewColor: '#FF9EAA', secondaryColor: '#00F0FF' },
  { id: 'wings_angel', name: 'Alas de Ángel Querubín', category: 'wings', rarity: 5, description: 'Plumas níveas purificadas que otorgan serenidad.', partKey: 'wings', partValue: 'angel_wings', previewColor: '#FFFFFF', secondaryColor: '#FFE6D8' },
  { id: 'wings_fairy', name: 'Alas de Hada Cristalina', category: 'wings', rarity: 5, description: 'Láminas translúcidas que reflejan arcoíris pastel.', partKey: 'wings', partValue: 'fairy_wings', previewColor: '#A8DADC', secondaryColor: '#FFD1DC' },
  { id: 'wings_dragon', name: 'Alas Dracónicas Legendarias', category: 'wings', rarity: 5, description: 'Envergadura imponente de un dragón guardián.', partKey: 'wings', partValue: 'dragon_wings', previewColor: '#C1121F', secondaryColor: '#780000' },
  { id: 'tail_kitsune', name: 'Cola de Zorro Mística Exuberante', category: 'tail', rarity: 5, description: 'Pelaje de nueve colas esponjoso con chispas de fuego fatuo.', partKey: 'tail', partValue: 'kitsune_tail', previewColor: '#FFBE76', secondaryColor: '#FFFFFF' },
  { id: 'tail_dragon', name: 'Cola Dracónica con Puntas', category: 'tail', rarity: 5, description: 'Cola poderosa con escamas iridiscentes.', partKey: 'tail', partValue: 'dragon_tail', previewColor: '#C1121F', secondaryColor: '#FFD700' },
  { id: 'prop_magic_wand', name: 'Varita Mágica de Estrellas', category: 'prop', rarity: 5, description: 'Varita en forma de corazón y estrella resplandeciente.', partKey: 'prop', partValue: 'magic_wand', previewColor: '#FF9EAA', secondaryColor: '#FFD700' },
  { id: 'prop_sword', name: 'Espada de Cristal Radiante', category: 'prop', rarity: 5, description: 'Forjada en cuarzo celestial puro.', partKey: 'prop', partValue: 'sword_light', previewColor: '#64DFDF', secondaryColor: '#FFFFFF' },
  { id: 'prop_spellbook', name: 'Grimorio de Hechizos Antiguos', category: 'prop', rarity: 5, description: 'Tomo encantado con glifos que flotan en el aire.', partKey: 'prop', partValue: 'spellbook', previewColor: '#7E57C2', secondaryColor: '#FFD700' },
  { id: 'aura_magic_circle', name: 'Círculo Rúnico Bajo los Pies', category: 'aura', rarity: 5, description: 'Sello mágico giratorio con runas antiguas.', partKey: 'aura', partValue: 'magic_circle', previewColor: '#FF9EAA', secondaryColor: '#7E57C2' },
  { id: 'aura_dark_flames', name: 'Llamas Sombrías Ultravioleta', category: 'aura', rarity: 5, description: 'Aura ardiente en tonos morados y magenta.', partKey: 'aura', partValue: 'dark_flames', previewColor: '#9D4EDD', secondaryColor: '#FF007F' },

  // 4-Star Rare
  { id: 'hair_front_spiky', name: 'Flequillo Rebelde Spiky', category: 'hair', rarity: 4, description: 'Corte moderno con mechones puntiagudos dinámicos.', partKey: 'hairFront', partValue: 'spiky', previewColor: '#A0C4FF' },
  { id: 'hair_front_hime', name: 'Flequillo Estilo Hime', category: 'hair', rarity: 4, description: 'Corte tradicional de nobleza japonesa con mechones simétricos.', partKey: 'hairFront', partValue: 'hime', previewColor: '#2B2D42' },
  { id: 'hair_rear_hightwintails', name: 'Coletas Altas Anime', category: 'hair', rarity: 4, description: 'Doble coleta alta con mucho movimiento y gracia.', partKey: 'hairRear', partValue: 'hightwintails', previewColor: '#FF9EAA' },
  { id: 'hair_rear_ponytail', name: 'Coleta Alta con Cinta', category: 'hair', rarity: 4, description: 'Elegante coleta recogida para deportes o aventura.', partKey: 'hairRear', partValue: 'ponytail', previewColor: '#795548' },
  { id: 'hair_rear_sidebraid', name: 'Trenza Lateral Bohemio', category: 'hair', rarity: 4, description: 'Trenza dulce reposando suavemente sobre el hombro.', partKey: 'hairRear', partValue: 'sidebraid', previewColor: '#FFBE76' },
  { id: 'hair_rear_spacebuns', name: 'Moños Dobles Odango', category: 'hair', rarity: 4, description: 'Dos moñitos redondos festivos y adorables.', partKey: 'hairRear', partValue: 'spacebuns', previewColor: '#FFAAA6' },
  { id: 'eyes_cat', name: 'Ojos Felinos Picantes', category: 'eyes', rarity: 4, description: 'Mirada seductora con toque felino y pestañas marcadas.', partKey: 'eyes', partValue: 'cat', previewColor: '#38B000' },
  { id: 'eyes_cool', name: 'Mirada Confiada Idol', category: 'eyes', rarity: 4, description: 'Expresión audaz y decidida lista para el escenario.', partKey: 'eyes', partValue: 'cool', previewColor: '#2A6F97' },
  { id: 'top_hoodie', name: 'Sudadera Oversize Neko', category: 'clothes', rarity: 4, description: 'Sudadera suave con capucha y orejitas decorativas.', partKey: 'top', partValue: 'hoodie', previewColor: '#FFD1DC', secondaryColor: '#FFFDF9' },
  { id: 'top_idol', name: 'Blusa Idol con Volantes', category: 'clothes', rarity: 4, description: 'Prenda para conciertos con lazos y encajes festivos.', partKey: 'top', partValue: 'idol_blouse', previewColor: '#FFFDF9', secondaryColor: '#FF9EAA' },
  { id: 'top_maid', name: 'Delantal de Maid Café', category: 'clothes', rarity: 4, description: 'Uniforme clásico de servicio con lazo en la espalda.', partKey: 'top', partValue: 'maid_top', previewColor: '#2B2D42', secondaryColor: '#FFFDF9' },
  { id: 'top_kimono', name: 'Haori Tradicional Yukata', category: 'clothes', rarity: 4, description: 'Bata cruzada con patrones florales de primavera.', partKey: 'top', partValue: 'kimono_top', previewColor: '#FFB5A7', secondaryColor: '#FFFDF9' },
  { id: 'bottom_frilly', name: 'Falda de Volantes Rococó', category: 'clothes', rarity: 4, description: 'Múltiples capas de gasa y encaje pastel.', partKey: 'bottom', partValue: 'frilly_skirt', previewColor: '#D8B4E2', secondaryColor: '#FFFDF9' },
  { id: 'bottom_bloomers', name: 'Bombachos Dulces con Lazos', category: 'clothes', rarity: 4, description: 'Shorts esponjosos con pequeños lacitos a los lados.', partKey: 'bottom', partValue: 'bloomers', previewColor: '#FFD1DC', secondaryColor: '#FF9EAA' },
  { id: 'hat_cat_ears', name: 'Diadema con Orejas de Gato', category: 'hat', rarity: 4, description: 'Orejas de felpa con cascabeles dorados tintineantes.', partKey: 'hat', partValue: 'cat_ears', previewColor: '#FF9EAA', secondaryColor: '#FFD700' },
  { id: 'hat_bunny_ears', name: 'Orejas de Conejito Caídas', category: 'hat', rarity: 4, description: 'Orejitas largas con lazos rosas en la base.', partKey: 'hat', partValue: 'bunny_ears', previewColor: '#FFFDF9', secondaryColor: '#FF9EAA' },
  { id: 'hat_demon_horns', name: 'Cuernos de Diablillo Travieso', category: 'hat', rarity: 4, description: 'Cuernos curvos pulidos de tonalidad pastel.', partKey: 'hat', partValue: 'demon_horns', previewColor: '#FF6F91', secondaryColor: '#4A148C' },
  { id: 'wings_devil', name: 'Alas de Murciélago Travieso', category: 'wings', rarity: 4, description: 'Alas oscuras con borde suave ideales para cosplay.', partKey: 'wings', partValue: 'devil_wings', previewColor: '#4A148C', secondaryColor: '#FF6F91' },
  { id: 'tail_cat', name: 'Cola de Gato con Moño', category: 'tail', rarity: 4, description: 'Cola flexible que se mueve al ritmo de tu ánimo.', partKey: 'tail', partValue: 'cat_tail', previewColor: '#2B2D42', secondaryColor: '#FF9EAA' },
  { id: 'tail_devil', name: 'Cola de Diablillo con Flecha', category: 'tail', rarity: 4, description: 'Cola fina terminada en punta de corazón invertido.', partKey: 'tail', partValue: 'devil_tail', previewColor: '#FF6F91', secondaryColor: '#2B2D42' },
  { id: 'prop_teddy', name: 'Osito de Peluche Cariñoso', category: 'prop', rarity: 4, description: 'Peluche pachoncito que da abrazos reconfortantes.', partKey: 'prop', partValue: 'teddy_bear', previewColor: '#FFBE76', secondaryColor: '#FF9EAA' },
  { id: 'prop_gamepad', name: 'Consola Portátil Gamer', category: 'prop', rarity: 4, description: 'Consola retro de 8 bits color pastel.', partKey: 'prop', partValue: 'gamepad', previewColor: '#D8B4E2', secondaryColor: '#64DFDF' },
  { id: 'prop_idol_mic', name: 'Micrófono Idol Escenario', category: 'prop', rarity: 4, description: 'Micrófono con joya y lazo en la base.', partKey: 'prop', partValue: 'idol_mic', previewColor: '#FF9EAA', secondaryColor: '#FFD700' },
  { id: 'aura_sparkles', name: 'Destellos Mágicos Flotantes', category: 'aura', rarity: 4, description: 'Polvo de hadas que brilla constantemente.', partKey: 'aura', partValue: 'sparkles', previewColor: '#FFD700', secondaryColor: '#FFF3B0' },
  { id: 'aura_sakura', name: 'Brisa de Pétalos Sakura', category: 'aura', rarity: 4, description: 'Pétalos cayendo suavemente como en primavera.', partKey: 'aura', partValue: 'cherry_petals', previewColor: '#FFB5A7', secondaryColor: '#FFD1DC' },
  { id: 'aura_hearts', name: 'Corazones Flotantes de Amor', category: 'aura', rarity: 4, description: 'Burbujas en forma de corazón que flotan alrededor.', partKey: 'aura', partValue: 'hearts_float', previewColor: '#FF6F91', secondaryColor: '#FFAAA6' },

  // 3-Star Common (Classic starter wardrobe items)
  { id: 'hair_front_blunt', name: 'Flequillo Recto Clásico', category: 'hair', rarity: 3, description: 'Sencillo, limpio y siempre a la moda.', partKey: 'hairFront', partValue: 'blunt', previewColor: '#795548' },
  { id: 'hair_front_sideswept', name: 'Flequillo de Lado', category: 'hair', rarity: 3, description: 'Caída natural hacia el costado.', partKey: 'hairFront', partValue: 'sideswept', previewColor: '#FFEAA7' },
  { id: 'hair_front_curtain', name: 'Flequillo Abierto Cortina', category: 'hair', rarity: 3, description: 'Apertura central con ondas juveniles.', partKey: 'hairFront', partValue: 'curtain', previewColor: '#FFAAA6' },
  { id: 'hair_rear_twintails', name: 'Coletas Bajas Dulces', category: 'hair', rarity: 3, description: 'Dos coletas reposadas con ligas elásticas.', partKey: 'hairRear', partValue: 'twintails', previewColor: '#FF9EAA' },
  { id: 'hair_rear_longstraight', name: 'Cabello Largo Sedoso', category: 'hair', rarity: 3, description: 'Liso hasta la cintura con puntas rectas.', partKey: 'hairRear', partValue: 'longstraight', previewColor: '#2B2D42' },
  { id: 'hair_rear_shortbob', name: 'Corte Bob Redondeado', category: 'hair', rarity: 3, description: 'Cabello corto y fácil de peinar.', partKey: 'hairRear', partValue: 'shortbob', previewColor: '#C3B1E1' },
  { id: 'eyes_sparkle', name: 'Ojos Anime Básicos', category: 'eyes', rarity: 3, description: 'Mirada clásica anime con brillo doble.', partKey: 'eyes', partValue: 'sparkle', previewColor: '#2A6F97' },
  { id: 'eyes_round', name: 'Ojos Redondos Kawaii', category: 'eyes', rarity: 3, description: 'Inocentes ojos circulares llenos de ternura.', partKey: 'eyes', partValue: 'round', previewColor: '#FF9E00' },
  { id: 'top_sailor', name: 'Uniforme Marinero Seifuku', category: 'clothes', rarity: 3, description: 'El clásico uniforme de estudiante anime.', partKey: 'top', partValue: 'sailor_fuku', previewColor: '#1D3557', secondaryColor: '#FFFDF9' },
  { id: 'top_sweater_vest', name: 'Chaleco de Academia', category: 'clothes', rarity: 3, description: 'Punto suave con camisa formal debajo.', partKey: 'top', partValue: 'sweater_vest', previewColor: '#FFEAA7', secondaryColor: '#1D3557' },
  { id: 'top_tee', name: 'Camiseta de Oso Kawaii', category: 'clothes', rarity: 3, description: 'Algodón fresco con estampado tierno.', partKey: 'top', partValue: 'casual_tee', previewColor: '#FFFDF9', secondaryColor: '#FF9EAA' },
  { id: 'bottom_pleated', name: 'Falda de Pliegues', category: 'clothes', rarity: 3, description: 'Falda escolar básica de tablas.', partKey: 'bottom', partValue: 'pleated_skirt', previewColor: '#1D3557', secondaryColor: '#FFFDF9' },
  { id: 'bottom_denim', name: 'Shorts de Denim', category: 'clothes', rarity: 3, description: 'Pantalones cortos de mezclilla con dobladillo.', partKey: 'bottom', partValue: 'denim_shorts', previewColor: '#A8DADC', secondaryColor: '#1D3557' },
  { id: 'hat_beret', name: 'Boina Artística Pastel', category: 'hat', rarity: 3, description: 'Boina elegante de lana suave.', partKey: 'hat', partValue: 'beret', previewColor: '#FF9EAA', secondaryColor: '#FFD700' },
  { id: 'hat_sakura', name: 'Horquilla Flor de Sakura', category: 'hat', rarity: 3, description: 'Detalle primaveral para el cabello.', partKey: 'hat', partValue: 'sakura_flower', previewColor: '#FFB5A7', secondaryColor: '#FFD1DC' },
  { id: 'tail_bunny', name: 'Pom-pom de Conejito', category: 'tail', rarity: 3, description: 'Suave bolita esponjosa.', partKey: 'tail', partValue: 'bunny_tail', previewColor: '#FFFDF9', secondaryColor: '#FFD1DC' },
  { id: 'prop_boba', name: 'Vaso de Té Boba', category: 'prop', rarity: 3, description: 'Té con perlas de tapioca y popote grueso.', partKey: 'prop', partValue: 'boba_tea', previewColor: '#FFE0B2', secondaryColor: '#795548' },
  { id: 'prop_palette', name: 'Paleta de Pintura & Pincel', category: 'prop', rarity: 3, description: 'Para artistas creativos.', partKey: 'prop', partValue: 'artist_palette', previewColor: '#FFBE76', secondaryColor: '#D8B4E2' },
];

export const GACHA_BANNERS = [
  {
    id: 'banner_astral',
    name: 'Pabellón Astral & Celestial',
    subtitle: 'Destellos de Luz & Sombras Eternas',
    tagline: '¡Mayor probabilidad de obtener Alas de Ángel, Báculo Cósmico y Corona Real!',
    coverGradient: 'from-[#4A148C] via-[#311B92] to-[#1A237E]',
    featuredItems: ['hat_space_helmet', 'wings_cyber', 'prop_celestial_staff', 'aura_astral', 'wings_angel', 'hat_halo'],
    rateUpMultiplier: 3.0,
  },
  {
    id: 'banner_idol',
    name: 'Idol Dream Festival',
    subtitle: 'El Concierto Más Brillante de Chibiverse',
    tagline: '¡Consigue atuendos exclusivos de escenario, audífonos gamer y varita mágica!',
    coverGradient: 'from-[#FF6F91] via-[#FF9EAA] to-[#FFAAA6]',
    featuredItems: ['hair_front_heart', 'hair_rear_drills', 'top_idol', 'hat_gamer', 'prop_idol_mic', 'prop_magic_wand'],
    rateUpMultiplier: 3.0,
  },
  {
    id: 'banner_fantasy',
    name: 'Cosplay Fantasía & Mística',
    subtitle: 'Brujitas, Kitsunes y Criaturas Sagradas',
    tagline: '¡Desbloquea colas de nueve colas, sombreros arcanos y corsés victorianos!',
    coverGradient: 'from-[#2E7D32] via-[#00897B] to-[#00ACC1]',
    featuredItems: ['hat_witch', 'tail_kitsune', 'top_gothic', 'eyes_star', 'aura_magic_circle', 'wings_fairy'],
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
