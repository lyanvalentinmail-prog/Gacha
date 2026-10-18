#!/usr/bin/env node
/**
 * Genera los assets que no existían como arte procedural (ojos, zapatos,
 * expresiones, poses faltantes, pieles, fondos) y las opciones "none".
 * Cada item se escribe como <id>.svg + <id>.txt + <id>.json.
 *
 * Uso: node scripts/generate-extra-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/items');

function write(folder, id, { name, svg = null, json = {} }) {
  const dir = path.join(OUT, folder);
  fs.mkdirSync(dir, { recursive: true });
  if (svg !== null) {
    const full = svg.startsWith('<svg')
      ? svg
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">\n${svg}\n</svg>\n`;
    fs.writeFileSync(path.join(dir, `${id}.svg`), full);
  }
  fs.writeFileSync(path.join(dir, `${id}.txt`), name + '\n');
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify({ rarity: 3, description: '', ...json }, null, 2) + '\n');
  console.log(`✓ ${folder}/${id}${svg !== null ? '.svg' : ' (sin arte)'}  — ${name}`);
}

const wrap = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">\n${inner}\n</svg>\n`;

// Par de ojos simétrico: el ojo izquierdo se espeja sobre x=200
const pair = (inner) => `  <g id="eyes">\n${inner}\n  </g>\n  <g transform="translate(400,0) scale(-1,1)">\n${inner}\n  </g>`;

// ---------------------------------------------------------------------------
// OJOS (8 estilos) — ojo base: esclerótica, iris de 2 tonos, pupila, brillos, pestaña
// ---------------------------------------------------------------------------
const iris = (cx, rx = 17, ry = 21) => `
    <ellipse cx="${cx}" cy="167" rx="${rx}" ry="${ry}" fill="var(--eye-primary, #FF70A6)" />
    <ellipse cx="${cx}" cy="176" rx="${rx * 0.8}" ry="${ry * 0.55}" fill="var(--eye-secondary, #FFD166)" opacity="0.85" />`;

const lash = (d, w = 4) =>
  `    <path d="${d}" fill="none" stroke="#2B2D42" stroke-width="${w}" stroke-linecap="round" />`;

const eyes = {
  sparkle: pair(`
    <ellipse cx="155" cy="165" rx="20" ry="24" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />${iris(155)}
    <ellipse cx="155" cy="169" rx="10" ry="12" fill="#2B2D42" />
    <ellipse cx="149" cy="158" rx="6" ry="8" fill="#FFFFFF" opacity="0.95" />
    <circle cx="163" cy="176" r="3.5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="150" cy="176" r="2" fill="#FFFFFF" opacity="0.8" />
${lash('M 133 155 Q 155 142 177 155')}
    <line x1="175" y1="154" x2="181" y2="148" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
  cat: pair(`
    <path d="M 135 168 Q 140 143 158 145 Q 174 147 176 166 Q 176 186 158 189 Q 140 188 135 168 Z" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 139 168 Q 143 150 158 151 Q 171 153 172 167 Q 172 182 158 184 Q 144 183 139 168 Z" fill="var(--eye-primary, #FF70A6)" />
    <ellipse cx="156" cy="168" rx="4.5" ry="15" fill="#2B2D42" />
    <ellipse cx="151" cy="158" rx="5" ry="7" fill="#FFFFFF" opacity="0.95" />
    <circle cx="162" cy="177" r="2.5" fill="#FFFFFF" opacity="0.85" />
${lash('M 133 158 Q 150 146 174 152', 3.5)}
    <line x1="173" y1="152" x2="182" y2="145" stroke="#2B2D42" stroke-width="3.5" stroke-linecap="round" />
    <line x1="132" y1="160" x2="124" y2="154" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
  round: pair(`
    <circle cx="155" cy="165" r="25" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />${iris(155, 19, 22)}
    <ellipse cx="155" cy="169" rx="12" ry="14" fill="#2B2D42" />
    <ellipse cx="147" cy="155" rx="8" ry="10" fill="#FFFFFF" opacity="0.95" />
    <circle cx="165" cy="178" r="4" fill="#FFFFFF" opacity="0.9" />
    <circle cx="147" cy="178" r="2.2" fill="#FFFFFF" opacity="0.8" />
${lash('M 130 152 Q 155 138 180 152', 4)}    <line x1="178" y1="151" x2="185" y2="145" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
  cool: pair(`
    <path d="M 134 150 L 176 154 Q 178 180 156 188 Q 136 184 134 150 Z" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 138 155 L 172 158 Q 173 178 156 183 Q 141 179 138 155 Z" fill="var(--eye-primary, #FF70A6)" />
    <path d="M 142 158 L 168 161 Q 168 176 156 179 Q 145 175 142 158 Z" fill="#2B2D42" />
    <ellipse cx="148" cy="162" rx="5" ry="6" fill="#FFFFFF" opacity="0.9" />
    <line x1="134" y1="150" x2="178" y2="155" stroke="#2B2D42" stroke-width="5" stroke-linecap="round" />
    <line x1="136" y1="152" x2="128" y2="147" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
  droopy: pair(`
    <ellipse cx="155" cy="168" rx="20" ry="23" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" transform="rotate(-8 155 168)" />${iris(155)}
    <ellipse cx="155" cy="171" rx="9" ry="11" fill="#2B2D42" />
    <ellipse cx="150" cy="161" rx="5" ry="7" fill="#FFFFFF" opacity="0.95" />
    <circle cx="162" cy="178" r="3" fill="#FFFFFF" opacity="0.85" />
${lash('M 133 158 Q 155 146 177 160', 3.5)}
    <path d="M 172 182 Q 178 188 182 186" fill="none" stroke="#2B2D42" stroke-width="2.5" stroke-linecap="round" />`),
  star: pair(`
    <ellipse cx="155" cy="165" rx="20" ry="24" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />${iris(155)}
    <polygon points="155,155 159,165 170,167 159,171 155,181 151,171 140,167 151,165" fill="#FFF3B0" stroke="#2B2D42" stroke-width="1.2" />
    <ellipse cx="148" cy="157" rx="5" ry="7" fill="#FFFFFF" opacity="0.95" />
    <circle cx="165" cy="178" r="3" fill="#FFFFFF" opacity="0.85" />
${lash('M 133 155 Q 155 142 177 155')}
    <line x1="175" y1="154" x2="181" y2="148" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
  heart: pair(`
    <ellipse cx="155" cy="165" rx="20" ry="24" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />${iris(155)}
    <path d="M 155 180 C 143 171 143 160 150 158 C 153 157 155 160 155 162 C 155 160 157 157 160 158 C 167 160 167 171 155 180 Z" fill="#FF5376" stroke="#2B2D42" stroke-width="1" />
    <ellipse cx="148" cy="157" rx="5" ry="7" fill="#FFFFFF" opacity="0.95" />
    <circle cx="165" cy="178" r="3" fill="#FFFFFF" opacity="0.85" />
${lash('M 133 155 Q 155 142 177 155')}
    <line x1="175" y1="154" x2="181" y2="148" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
  gothic_cross: pair(`
    <ellipse cx="155" cy="165" rx="20" ry="24" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />${iris(155)}
    <rect x="152" y="156" width="6" height="26" rx="1.5" fill="#FFFDF9" />
    <rect x="145" y="164" width="20" height="6" rx="1.5" fill="#FFFDF9" />
    <circle cx="155" cy="167" r="3.2" fill="#FFD700" />
    <ellipse cx="148" cy="157" rx="4.5" ry="6" fill="#FFFFFF" opacity="0.9" />
    <path d="M 164 178 A 4 4 0 1 1 163.9 178" fill="none" stroke="#FFFFFF" stroke-width="2" />
${lash('M 133 155 Q 155 142 177 155')}
    <line x1="175" y1="154" x2="181" y2="148" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" />`),
};

const EYE_META = {
  sparkle: ['Brillo Anime Clásico', 'Ojos grandes con triples reflejos de luz', 3],
  cat: ['Ojos Felinos Picantes', 'Mirada rasgada con pupila de gatito', 4],
  round: ['Ojos Redondos Kawaii', 'Mirada inocente de cervatillo', 3],
  cool: ['Mirada Confiada Idol', 'Párpado recto con mucha actitud', 4],
  droopy: ['Tareme Suave / Tímido', 'Ojos dulces caídos en las esquinas', 3],
  star: ['Destello Estelar', 'Ojos con estrellas brillantes doradas', 5],
  heart: ['Amor Apasionado', 'Ojos con pupilas en forma de corazón', 5],
  gothic_cross: ['Cruces Místicas', 'Pupilas con cruz celestial mística', 5],
};

for (const [id, svg] of Object.entries(eyes)) {
  const [name, description, rarity] = EYE_META[id];
  write('rostro/ojos', id, { name, svg: wrap(svg), json: { rarity, description } });
}

// ---------------------------------------------------------------------------
// ZAPATOS (7 estilos) — pies anclados en x≈158-190 / 210-242, y≈410-432
// ---------------------------------------------------------------------------
const shoePair = (left) =>
  `  <g id="shoes">\n${left}\n  </g>\n  <g transform="translate(400,0) scale(-1,1)">\n${left}\n  </g>`;

const shoes = {
  sneakers: shoePair(`
    <path d="M 158 408 Q 152 432 186 433 Q 194 433 191 408 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 163 414 Q 159 428 181 429 Q 187 429 186 414 Z" fill="var(--shoes-secondary, #FFFDF9)" stroke="none" />
    <path d="M 156 424 L 192 424" stroke="#4A3B52" stroke-width="1.5" />
    <path d="M 166 410 L 182 416 M 168 416 L 184 421" stroke="#4A3B52" stroke-width="1.2" />`),
  mary_janes: shoePair(`
    <path d="M 158 412 Q 154 433 186 433 Q 193 433 191 412 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 157 417 Q 174 411 192 417" fill="none" stroke="var(--shoes-secondary, #FFFDF9)" stroke-width="4" />
    <rect x="168" y="412" width="9" height="7" rx="2" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1.2" />
    <circle cx="172" cy="430" r="2" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1" />`),
  knee_boots: `
    <g id="shoes">
      <path d="M 158 330 L 155 432 L 190 433 L 189 330 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
      <path d="M 158 342 L 189 342" stroke="var(--shoes-secondary, #FFFDF9)" stroke-width="3" />
      <path d="M 157 360 L 189 366 M 157 380 L 189 386 M 157 400 L 189 406" stroke="#4A3B52" stroke-width="1.2" />
      <path d="M 153 428 Q 150 440 188 440 Q 196 440 192 428 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    </g>
    <g transform="translate(400,0) scale(-1,1)">
      <path d="M 158 330 L 155 432 L 190 433 L 189 330 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
      <path d="M 158 342 L 189 342" stroke="var(--shoes-secondary, #FFFDF9)" stroke-width="3" />
      <path d="M 157 360 L 189 366 M 157 380 L 189 386 M 157 400 L 189 406" stroke="#4A3B52" stroke-width="1.2" />
      <path d="M 153 428 Q 150 440 188 440 Q 196 440 192 428 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    </g>`,
  ribbon_heels: shoePair(`
    <path d="M 160 415 Q 156 433 186 433 Q 192 433 190 415 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 172 428 L 172 436 M 178 428 L 178 436" stroke="#4A3B52" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 158 412 Q 174 405 191 412" fill="none" stroke="var(--shoes-secondary, #FFFDF9)" stroke-width="3.5" />
    <path d="M 168 408 C 163 402 158 404 162 409 C 158 412 163 415 168 410 C 173 415 178 412 174 409 C 178 404 173 402 168 408 Z" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1.2" />`),
  loafers: shoePair(`
    <path d="M 157 412 Q 152 433 187 433 Q 194 433 191 412 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 157 417 Q 174 423 191 417" fill="none" stroke="var(--shoes-secondary, #FFFDF9)" stroke-width="4" />
    <rect x="169" y="414" width="8" height="4" rx="1" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1" />
    <path d="M 160 428 L 188 428" stroke="#4A3B52" stroke-width="1.2" />`),
  paw_slippers: shoePair(`
    <path d="M 155 410 Q 148 434 186 435 Q 197 435 193 410 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    <ellipse cx="174" cy="424" rx="9" ry="7" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1.2" />
    <circle cx="164" cy="414" r="3" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1" />
    <circle cx="172" cy="411" r="3" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1" />
    <circle cx="180" cy="413" r="3" fill="var(--shoes-secondary, #FFFDF9)" stroke="#4A3B52" stroke-width="1" />`),
  cyber_kicks: shoePair(`
    <path d="M 156 405 L 152 424 L 160 432 L 190 432 L 193 412 L 184 405 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 152 424 L 192 424" stroke="#00F0FF" stroke-width="3" />
    <polygon points="168,410 172,417 179,418 173,422 175,429 168,425 161,429 163,422 157,418 164,417" fill="#FFF3B0" opacity="0.9" />
    <rect x="158" y="430" width="32" height="5" rx="2" fill="#00F0FF" stroke="#4A3B52" stroke-width="1.2" />`),
};

const SHOE_META = {
  sneakers: ['Zapatillas Chunky Pastel', 'Calzado deportivo moderno y cómodo', 3],
  mary_janes: ['Zapatos Mary Jane con Tacón', 'Zapatos brillantes con calcetines de encaje', 3],
  knee_boots: ['Botas Altas de Combate/Idol', 'Botas hasta la rodilla con cordones cruzados', 4],
  ribbon_heels: ['Zapatillas con Lazo de Seda', 'Calzado delicado atado al tobillo', 4],
  loafers: ['Mocasines con Medias Altas', 'Mocasines de academia', 3],
  paw_slippers: ['Pantuflas de Patitas', 'Garras suaves acolchadas', 4],
  cyber_kicks: ['Botas Gravitatorias Neón', 'Calzado flotante con propulsores luminosos', 5],
};

for (const [id, svg] of Object.entries(shoes)) {
  const [name, description, rarity] = SHOE_META[id];
  write('ropa/zapatos', id, { name, svg: wrap(svg), json: { rarity, description } });
}

// ---------------------------------------------------------------------------
// SONROJO faltantes
// ---------------------------------------------------------------------------
write('rostro/sonrojo', 'heart_stamp', {
  name: 'Sello de Corazón',
  svg: wrap(`  <g opacity="0.75">
    <path d="M 145 188 C 137 181 137 173 142 172 C 144 171.5 145 173 145 174.5 C 145 173 146 171.5 148 172 C 153 173 153 181 145 188 Z" fill="var(--blush, #FF9EAA)" />
    <path d="M 255 188 C 247 181 247 173 252 172 C 254 171.5 255 173 255 174.5 C 255 173 256 171.5 258 172 C 263 173 263 181 255 188 Z" fill="var(--blush, #FF9EAA)" />
  </g>`),
  json: { rarity: 4, description: 'Corazoncito debajo del ojo' },
});

write('rostro/sonrojo', 'bandaid', {
  name: 'Curita en la Nariz',
  svg: wrap(`  <g>
    <rect x="182" y="176" width="36" height="12" rx="4" transform="rotate(-8 200 182)" fill="#FFE0B2" stroke="#4A3B52" stroke-width="1.5" />
    <rect x="195" y="177" width="10" height="10" rx="2" transform="rotate(-8 200 182)" fill="#FFFDF9" />
  </g>`),
  json: { rarity: 4, description: 'Curita infantil anime' },
});

write('rostro/sonrojo', 'tears', {
  name: 'Lágrimas Brillantes',
  svg: wrap(`  <g opacity="0.85">
    <path d="M 138 186 Q 134 196 138 200 Q 143 198 142 188 Z" fill="#64DFDF" stroke="#4A3B52" stroke-width="1" />
    <circle cx="137" cy="203" r="2.5" fill="#64DFDF" />
    <path d="M 262 186 Q 266 196 262 200 Q 257 198 258 188 Z" fill="#64DFDF" stroke="#4A3B52" stroke-width="1" />
    <circle cx="263" cy="203" r="2.5" fill="#64DFDF" />
    <ellipse cx="145" cy="185" rx="12" ry="7" fill="var(--blush, #FF9EAA)" opacity="0.5" />
    <ellipse cx="255" cy="185" rx="12" ry="7" fill="var(--blush, #FF9EAA)" opacity="0.5" />
  </g>`),
  json: { rarity: 5, description: 'Gotitas de emoción cristalinas' },
});

// ---------------------------------------------------------------------------
// FLEQUILLOS faltantes
// ---------------------------------------------------------------------------
const hairCap = `<path d="M 115 145 C 115 75, 285 75, 285 145 C 285 145, 275 125, 260 120 C 230 115, 170 115, 140 120 C 125 125, 115 145, 115 145 Z" fill="var(--hair-base, #FFAAA6)" />`;
const hairGloss = `<path d="M 130 118 Q 200 108 270 118" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 8 20 6" opacity="0.65" fill="none" />`;

const bangs = {
  wavy: `<path d="M 115 135 C 125 160, 150 168, 170 152 C 185 165, 200 165, 215 152 C 235 168, 260 160, 285 135 L 285 118 C 240 112, 160 112, 115 135 Z" fill="var(--hair-base, #FFAAA6)" />
    <path d="M 140 140 Q 155 152 168 142" fill="none" stroke="var(--hair-sub, #FFD1DC)" stroke-width="2" />
    <path d="M 232 142 Q 245 152 260 140" fill="none" stroke="var(--hair-sub, #FFD1DC)" stroke-width="2" />`,
  short: `<path d="M 115 138 L 122 158 L 138 148 L 155 160 L 172 146 L 190 158 L 210 146 L 228 158 L 245 148 L 262 158 L 278 146 L 285 132 Z" fill="var(--hair-base, #FFAAA6)" />
    <path d="M 115 128 C 150 112, 250 112, 285 128 L 285 118 C 240 112, 160 112, 115 135 Z" fill="var(--hair-base, #FFAAA6)" />`,
  micro: `<path d="M 115 128 C 150 112, 250 112, 285 128 L 285 118 C 240 110, 160 110, 115 128 Z" fill="var(--hair-base, #FFAAA6)" />
    <path d="M 118 122 L 130 142 L 142 128 L 156 144 L 170 128 L 186 142 L 200 126 L 214 142 L 230 128 L 244 144 L 258 128 L 272 142 L 282 122 Z" fill="var(--hair-base, #FFAAA6)" />`,
};

const BANG_META = {
  wavy: ['Ondas Suaves', 'Mechas delicadas acariciando la cara', 3],
  short: ['Corto Pixie', 'Fresco, juvenil y dinámico', 3],
  micro: ['Micro Flequillo', 'Moderno estilo harajuku alternativo', 4],
};

for (const [id, inner] of Object.entries(bangs)) {
  const [name, description, rarity] = BANG_META[id];
  write('cabello/frente', id, {
    name,
    svg: wrap(`  <g stroke="var(--hair-outline, #4A3B52)" stroke-width="3">\n    ${hairCap}\n    ${inner}\n    ${hairGloss}\n  </g>`),
    json: { rarity, description },
  });
}

// ---------------------------------------------------------------------------
// MECHONES LATERALES faltantes
// ---------------------------------------------------------------------------
write('cabello/lados', 'twin_drills_small', {
  name: 'Rizos Laterales',
  svg: wrap(`  <g stroke="var(--hair-outline, #4A3B52)" stroke-width="3">
    <path d="M 118 145 C 95 165, 92 195, 108 210 C 90 218, 92 240, 110 248 C 100 258, 112 272, 122 262 C 118 235, 112 175, 126 150 Z" fill="var(--hair-base, #FFAAA6)" />
    <path d="M 282 145 C 305 165, 308 195, 292 210 C 310 218, 308 240, 290 248 C 300 258, 288 272, 278 262 C 282 235, 288 175, 274 150 Z" fill="var(--hair-base, #FFAAA6)" />
  </g>`),
  json: { rarity: 4, description: 'Ricitos a los lados de la cabeza' },
});

write('cabello/lados', 'feather_tufts', {
  name: 'Mechones Alados',
  svg: wrap(`  <g stroke="var(--hair-outline, #4A3B52)" stroke-width="2.5">
    <path d="M 118 150 C 95 165, 88 195, 100 215 C 112 205, 118 180, 124 158 Z" fill="var(--hair-base, #FFAAA6)" />
    <path d="M 100 168 C 80 180, 72 195, 76 210 C 88 206, 96 190, 102 175 Z" fill="var(--hair-sub, #FFD1DC)" />
    <path d="M 282 150 C 305 165, 312 195, 300 215 C 288 205, 282 180, 276 158 Z" fill="var(--hair-base, #FFAAA6)" />
    <path d="M 300 168 C 320 180, 328 195, 324 210 C 312 206, 304 190, 298 175 Z" fill="var(--hair-sub, #FFD1DC)" />
  </g>`),
  json: { rarity: 5, description: 'Mechones con plumas decorativas' },
});

// ---------------------------------------------------------------------------
// CUELLO faltantes
// ---------------------------------------------------------------------------
write('accesorios/cuello', 'heart_locket', {
  name: 'Relicario de Corazón Dorado',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="2">
    <path d="M 180 232 Q 200 252 220 232" fill="none" stroke="#FFD700" stroke-width="2.5" />
    <path d="M 200 258 C 191 250 191 241 196 240 C 198.5 239.5 200 241.5 200 243 C 200 241.5 201.5 239.5 204 240 C 209 241 209 250 200 258 Z" fill="#FFD700" />
    <circle cx="200" cy="248" r="2.2" fill="#FF5376" />
  </g>`),
  json: { rarity: 4, description: 'Medallón que guarda un recuerdo secreto' },
});

write('accesorios/cuello', 'gothic_cross', {
  name: 'Cruz Gótica Victoriana',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="2">
    <path d="M 180 232 Q 200 250 220 232" fill="none" stroke="#2B2D42" stroke-width="2.5" />
    <rect x="197" y="242" width="6" height="24" rx="1.5" fill="#2B2D42" />
    <rect x="189" y="248" width="22" height="6" rx="1.5" fill="#2B2D42" />
    <circle cx="200" cy="250" r="3" fill="#9D4EDD" />
    <circle cx="200" cy="266" r="2" fill="#9D4EDD" />
  </g>`),
  json: { rarity: 5, description: 'Cadena oscura con cruz ornamentada' },
});

// ---------------------------------------------------------------------------
// GAFAS faltante
// ---------------------------------------------------------------------------
write('accesorios/gafas', 'cyber_monocle', {
  name: 'Monóculo Holográfico Escáner',
  svg: wrap(`  <g>
    <circle cx="245" cy="165" r="20" fill="rgba(0,240,255,0.18)" stroke="#00F0FF" stroke-width="3" />
    <circle cx="245" cy="165" r="12" fill="none" stroke="#00F0FF" stroke-width="1.2" stroke-dasharray="4 3" />
    <line x1="245" y1="153" x2="245" y2="177" stroke="#00F0FF" stroke-width="1.2" />
    <line x1="233" y1="165" x2="257" y2="165" stroke="#00F0FF" stroke-width="1.2" />
    <line x1="265" y1="165" x2="292" y2="152" stroke="#00F0FF" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="225" cy="145" r="2.5" fill="#FF007F" />
  </g>`),
  json: { rarity: 5, description: 'Lente futurista con interfaz táctica' },
});

// ---------------------------------------------------------------------------
// SOMBREROS faltantes
// ---------------------------------------------------------------------------
write('accesorios/cabeza', 'maid_headdress', {
  name: 'Tocado de Maid Rococó',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="2.5">
    <path d="M 118 118 C 130 88, 160 78, 200 78 C 240 78, 270 88, 282 118" fill="none" stroke="#FFFDF9" stroke-width="10" />
    <circle cx="130" cy="104" r="11" fill="#FFFDF9" />
    <circle cx="152" cy="92" r="11" fill="#FFFDF9" />
    <circle cx="178" cy="86" r="11" fill="#FFFDF9" />
    <circle cx="222" cy="86" r="11" fill="#FFFDF9" />
    <circle cx="248" cy="92" r="11" fill="#FFFDF9" />
    <circle cx="270" cy="104" r="11" fill="#FFFDF9" />
    <path d="M 112 116 C 105 110 105 124 112 122 Z" fill="#FFFDF9" />
    <path d="M 288 116 C 295 110 295 124 288 122 Z" fill="#FFFDF9" />
    <path d="M 118 118 C 130 88, 160 78, 200 78 C 240 78, 270 88, 282 118" fill="none" stroke="#FFFDF9" stroke-width="4" stroke-dasharray="6 4" />
  </g>`),
  json: { rarity: 4, description: 'Cinta de encaje fruncido blanco' },
});

write('accesorios/cabeza', 'space_helmet', {
  name: 'Casco Cyber Visor Flotante',
  svg: wrap(`  <g>
    <path d="M 118 155 C 112 75, 288 75, 282 155" fill="none" stroke="#7928CA" stroke-width="7" stroke-linecap="round" />
    <path d="M 118 155 C 112 75, 288 75, 282 155" fill="none" stroke="#00F0FF" stroke-width="2.5" stroke-linecap="round" opacity="0.9" />
    <path d="M 125 120 C 135 85, 265 85, 275 120 L 268 150 C 240 132, 160 132, 132 150 Z" fill="rgba(0,240,255,0.16)" stroke="#00F0FF" stroke-width="2" />
    <circle cx="140" cy="148" r="4" fill="#00F0FF" />
    <circle cx="260" cy="148" r="4" fill="#FF007F" />
    <ellipse cx="200" cy="52" rx="46" ry="10" fill="none" stroke="#FFD700" stroke-width="3" opacity="0.85" />
  </g>`),
  json: { rarity: 6, description: 'Visor holográfico de cristal estelar' },
});

// ---------------------------------------------------------------------------
// POSES faltantes (con capas de piernas y brazos)
// ---------------------------------------------------------------------------
const DEFAULT_ARMS = `
    <path d="M 160 245 Q 140 280 148 315" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="148" cy="318" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 240 245 Q 260 280 252 315" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="252" cy="318" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />`;

write('cuerpo/poses', 'sitting_sideways', {
  name: 'Sentada Kawaii',
  svg: wrap(`  <g data-layer="legs" stroke="#4A3B52" stroke-width="2.5">
    <path d="M 160 340 Q 150 390 180 405 Q 240 415 270 390 Q 285 370 240 360 Z" fill="var(--skin, #FFE6D8)" />
    <ellipse cx="255" cy="385" rx="16" ry="10" fill="var(--shoes-primary, #FF9EAA)" />
    <ellipse cx="255" cy="385" rx="12" ry="7" fill="var(--shoes-secondary, #FFFDF9)" />
  </g>
  <g data-layer="arms" stroke="#4A3B52" stroke-width="2.5">
    <path d="M 160 245 Q 150 290 185 330" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="188" cy="332" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 240 245 Q 250 295 215 335" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="212" cy="337" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
  </g>`),
  json: { rarity: 4, description: 'Piernas dobladas a un lado en el suelo', hideShoes: true, hideDefaultLegs: true },
});

write('cuerpo/poses', 'jumping_action', {
  name: 'Salto Dinámico en el Aire',
  svg: wrap(`  <g data-layer="legs" stroke="#4A3B52" stroke-width="2.5">
    <path d="M 170 320 L 165 395 Q 165 405 175 405 L 185 395 L 190 320 Z" fill="var(--skin, #FFE6D8)" />
    <path d="M 210 320 L 215 395 Q 225 405 235 405 L 235 395 L 230 320 Z" fill="var(--skin, #FFE6D8)" />
    <path d="M 158 390 Q 152 414 186 415 Q 194 415 191 390 Z" fill="var(--shoes-primary, #FF9EAA)" />
    <path d="M 163 396 Q 159 410 181 411 Q 187 411 186 396 Z" fill="var(--shoes-secondary, #FFFDF9)" />
    <path d="M 210 390 Q 204 414 238 415 Q 246 415 243 390 Z" fill="var(--shoes-primary, #FF9EAA)" />
    <path d="M 215 396 Q 211 410 233 411 Q 239 411 238 396 Z" fill="var(--shoes-secondary, #FFFDF9)" />
  </g>
  <g data-layer="arms" stroke="#4A3B52" stroke-width="2.5">
    <path d="M 160 245 Q 130 210 122 175" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="120" cy="170" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 240 245 Q 270 210 278 175" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="280" cy="170" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
  </g>`),
  json: { rarity: 5, description: 'Flotando con dinamismo y alegría', hideDefaultLegs: true },
});

write('cuerpo/poses', 'idol_wink_pose', {
  name: 'Paso de Baile Idol',
  svg: wrap(`  <g data-layer="legs" stroke="#4A3B52" stroke-width="2.5">
    <path d="M 170 320 L 165 415 Q 165 425 175 425 L 185 415 L 190 320 Z" fill="var(--skin, #FFE6D8)" />
    <path d="M 210 320 L 222 370 Q 240 385 252 372 L 232 340 L 230 320 Z" fill="var(--skin, #FFE6D8)" />
    <path d="M 158 410 Q 152 434 186 435 Q 194 435 191 410 Z" fill="var(--shoes-primary, #FF9EAA)" />
    <path d="M 163 416 Q 159 430 181 431 Q 187 431 186 416 Z" fill="var(--shoes-secondary, #FFFDF9)" />
    <path d="M 244 352 Q 260 348 264 362 Q 252 372 242 364 Z" fill="var(--shoes-primary, #FF9EAA)" stroke="#4A3B52" stroke-width="2.5" />
  </g>
  <g data-layer="arms" stroke="#4A3B52" stroke-width="2.5">
    <path d="M 160 245 L 135 280 L 160 295" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="160" cy="295" r="7" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 240 245 Q 262 230 258 195" fill="none" stroke-width="14" stroke="var(--top-primary, #FFFDF9)" stroke-linecap="round" />
    <circle cx="257" cy="190" r="8" fill="var(--skin, #FFE6D8)" stroke="#4A3B52" stroke-width="2.5" />
    <line x1="254" y1="185" x2="250" y2="172" stroke="var(--skin, #FFE6D8)" stroke-width="4" stroke-linecap="round" />
    <line x1="260" y1="185" x2="264" y2="172" stroke="var(--skin, #FFE6D8)" stroke-width="4" stroke-linecap="round" />
  </g>`),
  json: { rarity: 5, description: 'Pose de escenario con pierna flexionada', hideDefaultLegs: true },
});

// ---------------------------------------------------------------------------
// EXPRESIONES (capas faciales que pueden reemplazar los ojos)
// ---------------------------------------------------------------------------
const simpleEyeOpen = (cx) => `
    <ellipse cx="${cx}" cy="165" rx="18" ry="21" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <ellipse cx="${cx}" cy="167" rx="14" ry="17" fill="var(--eye-primary, #FF70A6)" />
    <ellipse cx="${cx}" cy="170" rx="8" ry="10" fill="#2B2D42" />
    <ellipse cx="${cx - 5}" cy="158" rx="5" ry="6" fill="#FFFFFF" opacity="0.95" />`;

write('cuerpo/expresiones', 'normal', {
  name: 'Normal',
  svg: null,
  json: { rarity: 3, description: 'Expresión neutra sin cambios', empty: true },
});

write('cuerpo/expresiones', 'happy', {
  name: 'Feliz / Radiante',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M 137 172 Q 155 152 173 172" />
    <path d="M 227 172 Q 245 152 263 172" />
    <path d="M 137 168 Q 155 150 173 168" stroke-width="2" opacity="0.4" />
    <path d="M 227 168 Q 245 150 263 168" stroke-width="2" opacity="0.4" />
  </g>
  <ellipse cx="145" cy="188" rx="13" ry="8" fill="var(--blush, #FF9EAA)" opacity="0.55" />
  <ellipse cx="255" cy="188" rx="13" ry="8" fill="var(--blush, #FF9EAA)" opacity="0.55" />`),
  json: { rarity: 3, description: 'Ojos cerrados radiantes de felicidad', replaces: ['eyes'] },
});

write('cuerpo/expresiones', 'wink', {
  name: 'Guiño Pícaro',
  svg: wrap(`  ${simpleEyeOpen(155)}
  <g stroke="#2B2D42" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M 225 168 Q 245 150 265 168" />
    <line x1="264" y1="167" x2="271" y2="161" stroke-width="3" />
  </g>
  <circle cx="245" cy="180" r="3.5" fill="#FF6F91" opacity="0.8" />`),
  json: { rarity: 3, description: 'Un ojo abierto y otro guiñando', replaces: ['eyes'] },
});

write('cuerpo/expresiones', 'smug', {
  name: 'Seguro / Smug',
  svg: wrap(`  <g>
    <path d="M 136 152 L 176 158 Q 174 182 155 187 Q 138 180 136 152 Z" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 140 158 L 172 163 Q 170 180 155 183 Q 142 177 140 158 Z" fill="var(--eye-primary, #FF70A6)" />
    <path d="M 143 161 L 168 166 Q 166 178 155 180 Q 146 175 143 161 Z" fill="#2B2D42" />
    <path d="M 264 152 L 224 158 Q 226 182 245 187 Q 262 180 264 152 Z" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 260 158 L 228 163 Q 230 180 245 183 Q 258 177 260 158 Z" fill="var(--eye-primary, #FF70A6)" />
    <path d="M 257 161 L 232 166 Q 234 178 245 180 Q 254 175 257 161 Z" fill="#2B2D42" />
    <ellipse cx="150" cy="163" rx="4" ry="5" fill="#FFFFFF" opacity="0.9" />
    <ellipse cx="250" cy="163" rx="4" ry="5" fill="#FFFFFF" opacity="0.9" />
  </g>`),
  json: { rarity: 3, description: 'Mirada de superioridad adorable', replaces: ['eyes'] },
});

write('cuerpo/expresiones', 'sleepy', {
  name: 'Somnoliento',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M 137 165 Q 155 180 173 165" />
    <path d="M 227 165 Q 245 180 263 165" />
  </g>
  <g stroke="#4A3B52" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7">
    <path d="M 132 158 L 124 152" />
    <path d="M 168 158 L 176 152" />
  </g>
  <ellipse cx="145" cy="186" rx="11" ry="7" fill="var(--blush, #FF9EAA)" opacity="0.5" />
  <ellipse cx="255" cy="186" rx="11" ry="7" fill="var(--blush, #FF9EAA)" opacity="0.5" />`),
  json: { rarity: 3, description: 'Ojos cerrados con sueño', replaces: ['eyes'] },
});

write('cuerpo/expresiones', 'shy', {
  name: 'Tímido / Sonrojado',
  svg: wrap(`  <ellipse cx="155" cy="167" rx="18" ry="21" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
  <ellipse cx="155" cy="169" rx="14" ry="17" fill="var(--eye-primary, #FF70A6)" />
  <ellipse cx="155" cy="172" rx="8" ry="10" fill="#2B2D42" />
  <ellipse cx="150" cy="160" rx="5" ry="6" fill="#FFFFFF" opacity="0.95" />
  <circle cx="162" cy="180" r="3" fill="#64DFDF" opacity="0.9" />
  <ellipse cx="245" cy="167" rx="18" ry="21" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
  <ellipse cx="245" cy="169" rx="14" ry="17" fill="var(--eye-primary, #FF70A6)" />
  <ellipse cx="245" cy="172" rx="8" ry="10" fill="#2B2D42" />
  <ellipse cx="240" cy="160" rx="5" ry="6" fill="#FFFFFF" opacity="0.95" />
  <circle cx="252" cy="180" r="3" fill="#64DFDF" opacity="0.9" />
  <g stroke="#4A3B52" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M 137 150 Q 155 144 172 150" />
    <path d="M 228 150 Q 245 144 263 150" />
  </g>
  <ellipse cx="140" cy="192" rx="18" ry="11" fill="var(--blush, #FF9EAA)" opacity="0.7" />
  <ellipse cx="260" cy="192" rx="18" ry="11" fill="var(--blush, #FF9EAA)" opacity="0.7" />
  <path d="M 278 138 Q 274 148 278 152 Q 283 150 282 140 Z" fill="#64DFDF" stroke="#4A3B52" stroke-width="1.5" />`),
  json: { rarity: 3, description: 'Ojos llorosos y mejillas encendidas', replaces: ['eyes'] },
});

write('cuerpo/expresiones', 'angry', {
  name: 'Enojado / Fuerte',
  svg: wrap(`  <g>
    <path d="M 134 152 L 176 162 Q 172 184 154 188 Q 136 182 134 152 Z" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 139 158 L 170 166 Q 167 182 154 184 Q 141 178 139 158 Z" fill="var(--eye-primary, #FF70A6)" />
    <ellipse cx="154" cy="172" rx="7" ry="9" fill="#2B2D42" />
    <path d="M 266 152 L 224 162 Q 228 184 246 188 Q 264 182 266 152 Z" fill="#FFFFFF" stroke="#4A3B52" stroke-width="2.5" />
    <path d="M 261 158 L 230 166 Q 233 182 246 184 Q 259 178 261 158 Z" fill="var(--eye-primary, #FF70A6)" />
    <ellipse cx="246" cy="172" rx="7" ry="9" fill="#2B2D42" />
  </g>
  <g stroke="#2B2D42" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M 134 148 L 172 158" />
    <path d="M 266 148 L 228 158" />
  </g>
  <g stroke="#FF5376" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M 305 108 L 318 108 M 311 102 L 311 114" />
    <path d="M 300 118 Q 311 112 322 118" stroke-width="2" />
  </g>`),
  json: { rarity: 3, description: 'Mirada furiosa con vena de enfado', replaces: ['eyes'] },
});

// ---------------------------------------------------------------------------
// PIELES (swatches de color)
// ---------------------------------------------------------------------------
const SKINS = [
  ['porcelana', 'Porcelana', '#FFF2EC'],
  ['calido_suave', 'Cálido Suave', '#FFE6D8'],
  ['beige_natural', 'Beige Natural', '#FAD5BC'],
  ['miel_dorado', 'Miel Dorado', '#E2B18A'],
  ['bronce_caramelo', 'Bronce Caramelo', '#BA805A'],
  ['cafe_profundo', 'Café Profundo', '#6B4028'],
  ['hada_lila', 'Hada Lila', '#EFE6FF'],
  ['nieve_menta', 'Nieve Menta', '#E4F4F3'],
];

for (const [id, name, hex] of SKINS) {
  write('cuerpo/piel', id, {
    name,
    svg: wrap(`  <rect x="70" y="60" width="260" height="360" rx="60" fill="${hex}" stroke="#4A3B52" stroke-width="6" />`),
    json: { rarity: 3, description: `Tono de piel ${name.toLowerCase()}`, color: hex, draw: false },
  });
}

// ---------------------------------------------------------------------------
// Opciones "none" (vacías) para que los selectores sean completos
// ---------------------------------------------------------------------------
const NONES = [
  ['cabello/lados', 'none', 'Sin Extra', 'hairSide'],
  ['rostro/sonrojo', 'none', 'Sin Sonrojo', 'blush'],
  ['accesorios/cabeza', 'none', 'Sin Accesorio', 'hat'],
  ['accesorios/gafas', 'none', 'Sin Gafas', 'glasses'],
  ['accesorios/cuello', 'none', 'Sin Cuello', 'neck'],
  ['extras/alas', 'none', 'Sin Alas', 'wings'],
  ['extras/colas', 'none', 'Sin Cola', 'tail'],
  ['extras/auras', 'none', 'Sin Aura', 'aura'],
  ['props', 'none', 'Manos Libres', 'prop'],
  ['ropa/calcetines', 'none', 'Sin Calcetines', 'socks'],
];

for (const [folder, id, name] of NONES) {
  write(folder, id, {
    name,
    svg: null,
    json: { rarity: 3, description: 'Sin elemento equipado', empty: true },
  });
}

// Nombres legibles para calcetines extraídos
write('ropa/calcetines', 'frilly', {
  name: 'Calcetines de Encaje',
  svg: null, // ya existe (extraído); solo actualiza nombre
  json: { rarity: 3, description: 'Vuelos blancos delicados' },
});
write('ropa/calcetines', 'black', {
  name: 'Calcetines Altos Negros',
  svg: null,
  json: { rarity: 3, description: 'Clásicos hasta la rodilla' },
});

// ---------------------------------------------------------------------------
// ITEMS DE EJEMPLO (demuestran lo fácil que es agregar ropa nueva)
// ---------------------------------------------------------------------------
write('ropa/tops', 'sudadera_conejo', {
  name: 'Sudadera Conejo Dulce',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="2.5">
    <path d="M 155 240 L 150 315 L 250 315 L 245 240 Z" fill="var(--top-primary, #FFFDF9)" />
    <path d="M 168 242 C 160 225, 168 210, 178 214 C 184 216, 186 228, 182 240 Z" fill="var(--top-primary, #FFFDF9)" />
    <path d="M 232 242 C 240 225, 232 210, 222 214 C 216 216, 214 228, 218 240 Z" fill="var(--top-primary, #FFFDF9)" />
    <path d="M 172 232 C 168 222, 172 216, 177 218" fill="none" stroke="#FFB5C8" stroke-width="2.5" />
    <path d="M 228 232 C 232 222, 228 216, 223 218" fill="none" stroke="#FFB5C8" stroke-width="2.5" />
    <ellipse cx="200" cy="278" rx="16" ry="12" fill="var(--top-secondary, #FF9EAA)" />
    <circle cx="193" cy="276" r="2" fill="#4A3B52" stroke="none" />
    <circle cx="207" cy="276" r="2" fill="#4A3B52" stroke="none" />
    <path d="M 196 282 Q 200 286 204 282" fill="none" stroke="#4A3B52" stroke-width="1.8" />
    <line x1="185" y1="245" x2="185" y2="268" stroke="#4A3B52" stroke-width="2" />
    <circle cx="185" cy="270" r="3" fill="#FF5376" />
    <line x1="215" y1="245" x2="215" y2="268" stroke="#4A3B52" stroke-width="2" />
    <circle cx="215" cy="270" r="3" fill="#FF5376" />
  </g>`),
  json: { rarity: 4, description: 'Sudadera con orejitas de conejo y carita bordada' },
});

write('accesorios/cabeza', 'gorro_fresa', {
  name: 'Gorro de Fresa',
  svg: wrap(`  <g stroke="#4A3B52" stroke-width="2.5">
    <path d="M 130 105 C 135 62, 265 62, 270 105 C 240 118, 160 118, 130 105 Z" fill="var(--hat-primary, #FF6F91)" />
    <ellipse cx="200" cy="108" rx="72" ry="14" fill="var(--hat-secondary, #7CB342)" />
    <circle cx="165" cy="88" r="3" fill="#FFFDF9" stroke="none" />
    <circle cx="185" cy="78" r="3" fill="#FFFDF9" stroke="none" />
    <circle cx="215" cy="82" r="3" fill="#FFFDF9" stroke="none" />
    <circle cx="238" cy="92" r="3" fill="#FFFDF9" stroke="none" />
    <circle cx="200" cy="95" r="3" fill="#FFFDF9" stroke="none" />
    <path d="M 200 62 C 192 50, 200 42, 210 44 C 214 50, 210 58, 200 62 Z" fill="var(--hat-secondary, #7CB342)" />
  </g>`),
  json: { rarity: 3, description: 'Gorro dulce con semillas y hojita verde' },
});

console.log('\nAssets adicionales generados.');
