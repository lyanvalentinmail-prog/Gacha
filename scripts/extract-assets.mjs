#!/usr/bin/env node
/**
 * Extrae el arte procedural de src/renderer/ChibiRenderer.tsx a archivos
 * SVG individuales dentro de assets/items/<categoria>/<subcarpeta>/.
 *
 * También genera los archivos <id>.txt (nombre) y <id>.json (metadatos)
 * usando la información de src/data/items.ts.
 *
 * Uso: node scripts/extract-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RENDERER = fs.readFileSync(path.join(ROOT, 'src/renderer/ChibiRenderer.tsx'), 'utf8');
const ITEMS_TS = fs.readFileSync(path.join(ROOT, 'src/data/items.ts'), 'utf8');
const OUT = path.join(ROOT, 'assets/items');

// ---------------------------------------------------------------------------
// 1. Parsear nombres / rarezas / descripciones desde items.ts
// ---------------------------------------------------------------------------
function parseOptions(constName) {
  const start = ITEMS_TS.indexOf(`export const ${constName}`);
  if (start < 0) throw new Error(`No se encontró ${constName} en items.ts`);
  const end = ITEMS_TS.indexOf('];', start);
  const block = ITEMS_TS.slice(start, end);
  const out = {};
  const re = /\{\s*id:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'\s*,\s*rarity:\s*(\d+)\s*,\s*description:\s*'([^']*)'\s*,?\s*\}/g;
  let m;
  while ((m = re.exec(block))) {
    out[m[1]] = { name: m[2], rarity: parseInt(m[3], 10), description: m[4].replace(/\\"/g, '"') };
  }
  return out;
}

const META = {
  hairFront: parseOptions('HAIR_FRONT_OPTIONS'),
  hairRear: parseOptions('HAIR_REAR_OPTIONS'),
  hairSide: parseOptions('HAIR_SIDE_OPTIONS'),
  eyes: parseOptions('EYE_OPTIONS'),
  mouth: parseOptions('MOUTH_OPTIONS'),
  blush: parseOptions('BLUSH_OPTIONS'),
  eyebrows: parseOptions('EYEBROW_OPTIONS'),
  top: parseOptions('TOP_OPTIONS'),
  bottom: parseOptions('BOTTOM_OPTIONS'),
  shoes: parseOptions('SHOES_OPTIONS'),
  hat: parseOptions('HAT_OPTIONS'),
  glasses: parseOptions('GLASSES_OPTIONS'),
  neck: parseOptions('NECK_OPTIONS'),
  wings: parseOptions('WINGS_OPTIONS'),
  tail: parseOptions('TAIL_OPTIONS'),
  prop: parseOptions('PROP_OPTIONS'),
  aura: parseOptions('AURA_OPTIONS'),
  pose: parseOptions('POSE_OPTIONS'),
};

// ---------------------------------------------------------------------------
// 2. Mapa de variables locales de cada sección del renderizador
// ---------------------------------------------------------------------------
const COLOR_VAR_RE = /\{colors\.(\w+)\s*\|\|\s*'(#[0-9A-Fa-f]{3,8})'\}/g;

const SECTIONS = {
  renderAura: {
    folder: 'extras/auras', partKey: 'aura', type: 'switch',
    vars: { auraGlowId: 'var(--aura, #C77DFF)' },
  },
  renderWings: {
    folder: 'extras/alas', partKey: 'wings', type: 'switch',
    vars: { wingColor: 'var(--wings, #FFFFFF)' },
  },
  renderTail: {
    folder: 'extras/colas', partKey: 'tail', type: 'switch',
    vars: { tailColor: 'var(--tail, #FFAAA6)' },
  },
  renderHairRear: {
    folder: 'cabello/atras', partKey: 'hairRear', type: 'switch',
    vars: {
      hairGradId: 'var(--hair-base, #FFAAA6)',
      baseCol: 'var(--hair-base, #FFAAA6)',
      subCol: 'var(--hair-sub, #FFD1DC)',
      outlineCol: 'var(--hair-outline, #4A3B52)',
    },
  },
  renderBottom: {
    folder: 'ropa/faldas', partKey: 'bottom', type: 'switch',
    vars: { col1: 'var(--bottom-primary, #1D3557)', col2: 'var(--bottom-secondary, #FFFDF9)' },
  },
  renderTop: {
    folder: 'ropa/tops', partKey: 'top', type: 'switch',
    vars: {
      col1: 'var(--top-primary, #FFFDF9)',
      col2: 'var(--top-secondary, #FF9EAA)',
      clothesGradId: 'var(--top-primary, #FFFDF9)',
    },
    defaultId: 'basic',
  },
  renderNeck: {
    folder: 'accesorios/cuello', partKey: 'neck', type: 'switch',
    vars: { neckCol: 'var(--neck, #FF6F91)' },
  },
  renderFaceAccessories: {
    folder: 'accesorios/gafas', partKey: 'glasses', type: 'switch',
    vars: { glassCol: 'var(--glasses, #FFD700)' },
  },
  renderHat: {
    folder: 'accesorios/cabeza', partKey: 'hat', type: 'switch',
    vars: { hatCol1: 'var(--hat-primary, #FF9EAA)', hatCol2: 'var(--hat-secondary, #FFD700)' },
  },
  renderArmsAndPose: {
    folder: 'cuerpo/poses', partKey: 'pose', type: 'switch',
    vars: { skin: 'var(--skin, #FFE6D8)', sleeveCol: 'var(--top-primary, #FFFDF9)' },
    defaultId: 'standing_cute',
  },
  renderProp: {
    folder: 'props', partKey: 'prop', type: 'switch',
    vars: { propCol: 'var(--prop, #FFD700)' },
  },
};

// Bloques condicionales {parts.X === 'id' && (...)} dentro de funciones
const COND_SECTIONS = [
  {
    fn: 'renderFace', part: 'blush', folder: 'rostro/sonrojo', partKey: 'blush',
    vars: { blushCol: 'var(--blush, #FF9EAA)', browCol: 'var(--eyebrows, #4A3B52)' },
  },
  {
    fn: 'renderFace', part: 'eyebrows', folder: 'rostro/cejas', partKey: 'eyebrows',
    vars: { blushCol: 'var(--blush, #FF9EAA)', browCol: 'var(--eyebrows, #4A3B52)' },
  },
  {
    fn: 'renderFace', part: 'mouth', folder: 'rostro/bocas', partKey: 'mouth',
    vars: { blushCol: 'var(--blush, #FF9EAA)' },
  },
  {
    fn: 'renderHairFront', part: 'hairFront', folder: 'cabello/frente', partKey: 'hairFront',
    vars: {
      hairGradId: 'var(--hair-base, #FFAAA6)',
      baseCol: 'var(--hair-base, #FFAAA6)',
      subCol: 'var(--hair-sub, #FFD1DC)',
      outlineCol: 'var(--hair-outline, #4A3B52)',
    },
  },
  {
    fn: 'renderHairSide', part: 'hairSide', folder: 'cabello/lados', partKey: 'hairSide',
    vars: {
      baseCol: 'var(--hair-base, #FFAAA6)',
      outlineCol: 'var(--hair-outline, #4A3B52)',
    },
  },
  {
    fn: 'renderBodyAndLegs', part: 'socks', folder: 'ropa/calcetines', partKey: 'socks',
    vars: {},
  },
];

// ---------------------------------------------------------------------------
// 3. Utilidades de extracción
// ---------------------------------------------------------------------------
function extractFunctionBody(src, fnName) {
  const start = src.indexOf(`const ${fnName} = () => {`);
  if (start < 0) throw new Error(`Función ${fnName} no encontrada`);
  // encontrar el cierre "  };" al nivel de la función
  let i = src.indexOf('{', start);
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const ch = src[j];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(i + 1, j);
    }
  }
  throw new Error(`No se pudo delimitar ${fnName}`);
}

/** Escanea paréntesis balanceados saltando strings, template literals y comentarios JSX */
function matchParens(src, openIdx) {
  let depth = 0;
  for (let j = openIdx; j < src.length; j++) {
    const ch = src[j];
    if (ch === '/' && src[j + 1] === '*') {
      j = src.indexOf('*/', j) + 1;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      j++;
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === quote) break;
        j++;
      }
      continue;
    }
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return j;
    }
  }
  throw new Error('Paréntesis sin balancear');
}

function extractReturnExpr(body) {
  const rIdx = body.indexOf('return (');
  if (rIdx < 0) return null;
  const open = body.indexOf('(', rIdx);
  const close = matchParens(body, open);
  return body.slice(open + 1, close).trim();
}

function switchCases(body) {
  const cases = [];
  const re = /case\s+'([^']+)':/g;
  let m;
  const spots = [];
  while ((m = re.exec(body))) spots.push({ id: m[1], start: m.index, after: re.lastIndex });
  const defIdx = body.indexOf('default:');
  for (let i = 0; i < spots.length; i++) {
    const end = i + 1 < spots.length ? spots[i + 1].start : (defIdx > spots[i].start ? defIdx : body.length);
    const chunk = body.slice(spots[i].after, end);
    const expr = extractReturnExpr(chunk);
    if (expr && expr !== 'null') cases.push({ id: spots[i].id, expr });
  }
  if (defIdx > 0 && body.slice(defIdx).indexOf('return (') >= 0) {
    const expr = extractReturnExpr(body.slice(defIdx));
    if (expr && expr !== 'null') cases.push({ id: '__default__', expr });
  }
  return cases;
}

function condBlocks(body, partName) {
  const blocks = [];
  const re = new RegExp(`\\{parts\\.${partName} === '([^']+)' && \\(`, 'g');
  let m;
  while ((m = re.exec(body))) {
    const open = re.lastIndex - 1;
    const close = matchParens(body, open);
    blocks.push({ id: m[1], expr: body.slice(open + 1, close).trim() });
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// 4. Transformación JSX → SVG plano
// ---------------------------------------------------------------------------
function toSvgMarkup(expr, vars) {
  let s = expr;

  // Gradientes por plantilla: `url(#${hairGradId})` → variable (con comillas)
  s = s.replace(/\{`url\(#\$\{(\w+)\}\)`\}/g, (_, id) => {
    const v = vars[id] || 'var(--aura, #C77DFF)';
    return `"${v}"`;
  });

  // style={{ animationDuration: '20s' }}
  s = s.replace(/style=\{\{\s*(\w+):\s*'([^']+)'\s*\}\}/g, (_, k, v) => {
    const cssKey = k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    return `style="${cssKey}: ${v}"`;
  });

  // {colors.x || '#hex'} → "var(--x, #hex)"
  s = s.replace(COLOR_VAR_RE, (_, key, hex) => {
    const kebab = key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    return `"var(--${kebab}, ${hex})"`;
  });

  // Variables locales simples {outlineCol} → "var(...)"
  for (const [name, replacement] of Object.entries(vars)) {
    if (name.endsWith('Id')) continue;
    s = s.replace(new RegExp(`\\{${name}\\}`, 'g'), `"${replacement}"`);
  }

  // Comentarios JSX {/* ... */} → <!-- ... -->
  s = s.replace(/\{\/\*([\s\S]*?)\*\/\}/g, '<!--$1-->');

  // Expresiones numéricas simples: y={380 + legYOffset} → y="380"
  s = s.replace(/(\w+)=\{(\d+)\s*\+\s*\w+\}/g, '$1="$2"');

  // Atributos JSX → SVG
  const attrMap = [
    ['strokeWidth', 'stroke-width'],
    ['strokeLinecap', 'stroke-linecap'],
    ['strokeLinejoin', 'stroke-linejoin'],
    ['strokeDasharray', 'stroke-dasharray'],
    ['fillRule', 'fill-rule'],
    ['clipRule', 'clip-rule'],
    ['clipPath', 'clip-path'],
    ['stopColor', 'stop-color'],
    ['stopOpacity', 'stop-opacity'],
    ['className', 'class'],
  ];
  for (const [from, to] of attrMap) {
    s = s.replace(new RegExp(`\\b${from}=`, 'g'), `${to}=`);
  }

  // id="..." → data-id="..." (evita colisiones al insertar varios SVG)
  s = s.replace(/\bid="/g, 'data-id="');

  // Normalizar comillas simples en atributos → dobles (si quedaron)
  return s.trim();
}

function writeAsset(folder, partKey, id, expr, extraJson = {}) {
  const dir = path.join(OUT, folder);
  fs.mkdirSync(dir, { recursive: true });
  const vars = {};
  const section = Object.values(SECTIONS).find((s) => s.partKey === partKey);
  if (section) Object.assign(vars, section.vars);
  for (const c of COND_SECTIONS) if (c.partKey === partKey) Object.assign(vars, c.vars);

  const inner = toSvgMarkup(expr, vars);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">\n` +
    inner.split('\n').map((l) => '  ' + l).join('\n') +
    `\n</svg>\n`;
  fs.writeFileSync(path.join(dir, `${id}.svg`), svg);

  const meta = META[partKey]?.[id] || extraJson.meta || {};
  const name = meta.name || extraJson.name || id;
  fs.writeFileSync(path.join(dir, `${id}.txt`), name + '\n');

  const json = {
    rarity: meta.rarity ?? extraJson.rarity ?? 3,
    description: meta.description ?? extraJson.description ?? '',
    ...extraJson.json,
  };
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(json, null, 2) + '\n');
  console.log(`✓ ${folder}/${id}.svg  (${name})`);
}

// ---------------------------------------------------------------------------
// 5. Extraer secciones switch
// ---------------------------------------------------------------------------
const EXTRA_DEFAULTS = {
  top: { name: 'Camiseta Básica', description: 'Top simple y cómodo para cualquier ocasión' },
  pose: { name: 'De Pie Natural', description: 'Pose relajada con ligera inclinación' },
};

for (const [fnName, cfg] of Object.entries(SECTIONS)) {
  const body = extractFunctionBody(RENDERER, fnName);
  const cases = switchCases(body);
  for (const c of cases) {
    const id = c.id === '__default__' ? cfg.defaultId || 'basic' : c.id;
    writeAsset(cfg.folder, cfg.partKey, id, c.expr, { meta: EXTRA_DEFAULTS[cfg.partKey] });
  }
}

// ---------------------------------------------------------------------------
// 6. Extraer bloques condicionales
// ---------------------------------------------------------------------------
const fnBodies = {};
for (const cfg of COND_SECTIONS) {
  if (!fnBodies[cfg.fn]) fnBodies[cfg.fn] = extractFunctionBody(RENDERER, cfg.fn);
  const blocks = condBlocks(fnBodies[cfg.fn], cfg.part);
  for (const b of blocks) {
    writeAsset(cfg.folder, cfg.partKey, b.id, b.expr);
  }
}

// ---------------------------------------------------------------------------
// 7. Hair front: añadir el "cap" compartido + brillo a cada flequillo
// ---------------------------------------------------------------------------
{
  const body = fnBodies.renderHairFront;
  // Hair Cap Base
  const capMatch = body.match(/\{\/\* Hair Cap Base \*\/\}([\s\S]*?)\{\/\* Bangs Variations \*\/\}/);
  const glossMatch = body.match(/\{\/\* Anime Hair Gloss Ring \/ Highlights \*\/\}([\s\S]*)$/);
  const capExpr = capMatch ? capMatch[1].trim() : '';
  const glossExpr = glossMatch
    ? glossMatch[1].replace(/<\/g>[\s\S]*$/, '').replace(/\)\s*;?\s*$/, '').trim()
    : '';
  const dir = path.join(OUT, 'cabello/frente');
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.svg')) continue;
    const p = path.join(dir, f);
    let svg = fs.readFileSync(p, 'utf8');
    const inner = toSvgMarkup(capExpr, SECTIONS.renderHairRear.vars) + '\n' +
      svg.replace(/^<svg[^>]*>\n?/, '').replace(/\n?<\/svg>\n?$/, '') + '\n' +
      toSvgMarkup(glossExpr, SECTIONS.renderHairRear.vars);
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">\n` +
      inner.split('\n').map((l) => '  ' + l.trimEnd()).filter((l) => l.trim()).join('\n') +
      `\n</svg>\n`;
    fs.writeFileSync(p, svg);
    console.log(`↻ cap+gloss aplicado a cabello/frente/${f}`);
  }
}

console.log('\nExtracción completada → assets/items/');
