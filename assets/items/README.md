# 🎒 Assets del juego — ropa, accesorios, partes de cuerpo y más

Aquí vive **todo** el arte del juego: ropa, cabello, rostros, accesorios,
extras, objetos, poses y fondos. El juego carga esta carpeta **solo**
(`src/data/assetCatalog.ts`), así que…

> **✨ Para agregar ropa o cosas nuevas sólo tienes que soltar archivos aquí.
> No hay que tocar el código.**

## 📁 Estructura de carpetas

| Carpeta | Qué va ahí | Se equipa en |
|---|---|---|
| `ropa/tops/` | Camisetas, sudaderas, blusas, uniformes | `top` |
| `ropa/faldas/` | Faldas, shorts, pantalones | `bottom` |
| `ropa/zapatos/` | Zapatillas, botas, zapatos | `shoes` |
| `ropa/calcetines/` | Calcetines y medias | `socks` |
| `cabello/frente/` | Flequillos | `hairFront` |
| `cabello/atras/` | Cabello trasero (coletas, melena…) | `hairRear` |
| `cabello/lados/` | Mechones laterales, ahoges | `hairSide` |
| `rostro/ojos/` | Estilos de ojos | `eyes` |
| `rostro/cejas/` | Cejas | `eyebrows` |
| `rostro/bocas/` | Bocas | `mouth` |
| `rostro/sonrojo/` | Sonrojos y marcas faciales | `blush` |
| `accesorios/cabeza/` | Sombreros, diademas, orejas | `hat` |
| `accesorios/gafas/` | Gafas, parches, mascarillas | `glasses` |
| `accesorios/cuello/` | Collares, moños, gargantillas | `neck` |
| `extras/alas/` | Alas | `wings` |
| `extras/colas/` | Colas | `tail` |
| `extras/auras/` | Auras y efectos | `aura` |
| `props/` | Objetos en la mano | `prop` |
| `cuerpo/poses/` | Poses (piernas y brazos) | `pose` |
| `cuerpo/expresiones/` | Expresiones faciales | `expression` |
| `cuerpo/piel/` | Tonos de piel (swatches) | `skin` |
| `fondos/` | Fondos de escena | — |

## 🧩 Cómo se compone un item

Cada item son **2 o 3 archivos** con el **mismo nombre**:

```
ropa/tops/
  mi-sudadera.svg    ← el dibujo (obligatorio)
  mi-sudadera.txt    ← el nombre que se ve en el juego (obligatorio)
  mi-sudadera.json   ← rareza, descripción, etc. (opcional)
```

### 1. `<nombre>.svg` — el arte
- Lienzo estándar del personaje: `viewBox="0 0 400 480"`
  (los fondos usan `viewBox="0 0 800 600"`).
- Dibuja **sólo tu prenda** en su posición sobre el cuerpo
  (cabeza ≈ centro x 200, cuello ≈ y 230, torso ≈ y 240-315,
  piernas ≈ y 320-430). Mira cualquier SVG existente como plantilla.
- Para que el **selector de colores** funcione, usa variables CSS con color
  de respaldo en vez de colores fijos:

  ```xml
  fill="var(--top-primary, #FFFDF9)"
  stroke="var(--hair-outline, #4A3B52)"
  ```

  Variables disponibles: `--skin`, `--hair-base`, `--hair-sub`, `--hair-outline`,
  `--eye-primary`, `--eye-secondary`, `--eyebrows`, `--blush`, `--top-primary`,
  `--top-secondary`, `--bottom-primary`, `--bottom-secondary`, `--shoes-primary`,
  `--shoes-secondary`, `--hat-primary`, `--hat-secondary`, `--glasses`, `--neck`,
  `--wings`, `--tail`, `--prop`, `--aura`.

### 2. `<nombre>.txt` — el nombre
Un renglón con el nombre visible. Ejemplo:

```
Sudadera Conejo Dulce
```

### 3. `<nombre>.json` — metadatos (opcional)

```json
{
  "rarity": 4,
  "description": "Sudadera con orejitas de conejo",
  "color": "#FFE6D8",
  "empty": false,
  "draw": true,
  "hideShoes": false,
  "hideDefaultLegs": false,
  "replaces": [],
  "focus": [130, 215, 145, 130]
}
```

| Campo | Para qué sirve |
|---|---|
| `rarity` | Rareza 3-6 (3★ libre, 4-6★ se desbloquean en el Gacha) |
| `description` | Texto pequeño en la tarjeta |
| `color` | Color del swatch (piel) o de miniatura del Gacha |
| `empty: true` | Opción "Sin nada" — aparece en el selector pero no dibuja |
| `draw: false` | No se dibuja sobre el personaje (ej. tonos de piel) |
| `hideShoes: true` | La pose trae sus propios pies (ej. pose sentada) |
| `hideDefaultLegs: true` | La pose reemplaza las piernas base |
| `replaces: ["eyes"]` | La expresión sustituye la capa de ojos |
| `focus: [x,y,w,h]` | Recorte de la miniatura (viewBox del recorte) |

## 🚀 Ejemplo: agregar una camiseta nueva

1. Dibuja tu camiseta en un editor de SVG (o copia `ropa/tops/basic.svg`
   como plantilla y modifícala).
2. Guárdala en `ropa/tops/camiseta-estrella.svg`.
3. Crea `ropa/tops/camiseta-estrella.txt` con el texto `Camiseta Estrella`.
4. (Opcional) Crea `ropa/tops/camiseta-estrella.json` con `{"rarity": 4, "description": "..."}`.
5. ¡Listo! Aparece sola en **Vestir → Ropa → Tops**, en el Gacha y en la
   colección. Al hacer build se empaqueta incluso en el APK de Android.

## 🎨 Poses

Una pose puede traer dos capas dentro del mismo SVG:

```xml
<g data-layer="legs"> ... </g>
<g data-layer="arms"> ... </g>
```

- `legs` reemplaza las piernas base (usa `hideDefaultLegs: true`).
- `arms` reemplaza los brazos (siempre al final, sobre la ropa).

## 🖼️ Fondos

Cada fondo de `fondos/` es una escena completa (800×600). El menú principal
los muestra en el botón **Fondo** y el Estudio los ofrece al crear escenas.

## 🛠️ Scripts de migración

`scripts/extract-assets.mjs` y `scripts/generate-extra-assets.mjs` fueron las
herramientas usadas para generar esta carpeta desde el arte original del juego.
No hacen falta para agregar cosas nuevas — puedes ignorarlos.
