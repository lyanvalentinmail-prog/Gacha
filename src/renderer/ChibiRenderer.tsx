import React, { useId } from 'react';
import { Character, CharacterParts } from '../types';
import { colorVars, getAsset, AssetItem } from '../data/assetCatalog';

interface ChibiRendererProps {
  character: Character;
  className?: string;
  animate?: boolean;
  scale?: number;
  highlightCategory?: string;
  viewOnly?: boolean;
}

/**
 * Extrae el contenido de un <g data-layer="X"> dentro de un asset.
 * Los assets de pose pueden traer varias capas (legs / arms / shoes).
 */
function layerContent(asset: AssetItem | undefined, layer: string): string | null {
  if (!asset || asset.empty || !asset.inner) return null;
  const re = new RegExp(`<g[^>]*data-layer="${layer}"[^>]*>([\\s\\S]*?)</g>`, 'g');
  let out = '';
  let m: RegExpExecArray | null;
  let found = false;
  while ((m = re.exec(asset.inner))) {
    out += m[1] + '\n';
    found = true;
  }
  return found ? out : null;
}

/** Contenido plano de un asset para insertar como capa */
function assetLayer(
  partKey: keyof CharacterParts | string,
  value: string | undefined
): React.ReactElement | null {
  if (!value || value === 'none') return null;
  const asset = getAsset(partKey, value);
  if (!asset || asset.empty || !asset.draw || !asset.inner) return null;
  return <g dangerouslySetInnerHTML={{ __html: asset.inner }} />;
}

/**
 * Renderizador Chibi — dibuja el personaje componiendo los SVG de
 * assets/items/ sobre un cuerpo base. Los colores se aplican con
 * variables CSS (--hair-base, --top-primary, ...) para que los
 * archivos de assets puedan recolorearse sin tocar el código.
 */
export const ChibiRenderer: React.FC<ChibiRendererProps> = ({
  character,
  className = '',
  animate = true,
  scale = 1,
}) => {
  const uid = useId().replace(/:/g, '_');
  const { parts, colors } = character;

  const animClass = animate ? 'animate-bounce-subtle origin-bottom' : '';

  // Poses con piernas propias (sentada, salto, baile…)
  const poseAsset = getAsset('pose', parts.pose);
  const poseLegs = layerContent(poseAsset, 'legs');
  const poseArms = layerContent(poseAsset, 'arms') ?? (poseAsset && !poseAsset.empty && poseAsset.inner && !poseAsset.inner.includes('data-layer') ? poseAsset.inner : null);
  const hideDefaultLegs = !!poseAsset?.hideDefaultLegs || !!poseLegs;
  const hideShoes = !!poseAsset?.hideShoes;

  // Expresión que reemplaza los ojos (guiño, sueño, feliz…)
  const exprAsset = parts.expression && parts.expression !== 'normal' ? getAsset('expression', parts.expression) : undefined;
  const exprReplacesEyes = !!exprAsset && exprAsset.replaces.includes('eyes');

  const skin = colors.skin || '#FFE6D8';

  // Piernas base del cuerpo (si la pose no las reemplaza)
  const renderDefaultLegs = () => (
    <g id="legs_standing" stroke="#4A3B52" strokeWidth="2.5">
      <path
        d="M 170 320 L 165 415 Q 165 425 175 425 L 185 415 L 190 320 Z"
        fill={skin}
      />
      <path
        d="M 210 320 L 215 415 Q 225 425 235 425 L 235 415 L 230 320 Z"
        fill={skin}
      />
    </g>
  );

  // Cabeza base (siempre visible)
  const renderHead = () => (
    <g id="head_base" stroke="#4A3B52" strokeWidth="3">
      <rect x="185" y="220" width="30" height="25" fill={skin} stroke="#4A3B52" strokeWidth="2.5" />
      <ellipse cx="200" cy="235" rx="14" ry="4" fill="#E2B18A" opacity="0.4" stroke="none" />
      <ellipse cx="112" cy="155" rx="12" ry="16" fill={skin} />
      <ellipse cx="112" cy="155" rx="6" ry="8" fill="#FFB5A7" opacity="0.5" stroke="none" />
      <ellipse cx="288" cy="155" rx="12" ry="16" fill={skin} />
      <ellipse cx="288" cy="155" rx="6" ry="8" fill="#FFB5A7" opacity="0.5" stroke="none" />
      <path
        d="M 115 145 C 115 85, 285 85, 285 145 C 285 180, 292 205, 260 225 C 235 240, 215 242, 200 242 C 185 242, 165 240, 140 225 C 108 205, 115 180, 115 145 Z"
        fill={skin}
      />
    </g>
  );

  const renderNose = () => (
    <ellipse cx="200" cy="184" rx="2" ry="2.5" fill="#E2B18A" />
  );

  // Top con fallback: sin top no hay torso
  const renderTopLayer = () => {
    const value = parts.top && parts.top !== 'none' ? parts.top : 'basic';
    return assetLayer('top', value) ?? assetLayer('top', 'basic');
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <svg
        viewBox="0 0 400 480"
        className={`w-full h-full max-h-[85vh] drop-shadow-md ${animClass}`}
        xmlns="http://www.w3.org/2000/svg"
        style={colorVars(colors) as React.CSSProperties}
      >
        {/* 1. Aura de fondo */}
        {assetLayer('aura', parts.aura)}

        {/* 2. Alas (detrás) */}
        {assetLayer('wings', parts.wings)}

        {/* 3. Cola */}
        {assetLayer('tail', parts.tail)}

        {/* 4. Cabello trasero */}
        {assetLayer('hairRear', parts.hairRear)}

        {/* 5. Piernas (base o de la pose) */}
        {hideDefaultLegs ? (poseLegs ? <g dangerouslySetInnerHTML={{ __html: poseLegs }} /> : null) : renderDefaultLegs()}

        {/* 6. Calcetines */}
        {assetLayer('socks', parts.socks)}

        {/* 7. Zapatos */}
        {!hideShoes && assetLayer('shoes', parts.shoes)}

        {/* 8. Parte inferior (faldas, pantalones) */}
        {assetLayer('bottom', parts.bottom)}

        {/* 9. Parte superior (torso) */}
        {renderTopLayer()}

        {/* 10. Accesorios de cuello */}
        {assetLayer('neck', parts.neck)}

        {/* 11. Cabeza & orejas */}
        {renderHead()}

        {/* 12. Rostro: sonrojo, cejas, ojos, nariz, boca */}
        {assetLayer('blush', parts.blush)}
        {assetLayer('eyebrows', parts.eyebrows)}
        {exprReplacesEyes
          ? assetLayer('expression', parts.expression)
          : assetLayer('eyes', parts.eyes)}
        {renderNose()}
        {assetLayer('mouth', parts.mouth)}
        {!exprReplacesEyes && assetLayer('expression', parts.expression)}

        {/* 13. Flequillo & mechones */}
        {assetLayer('hairFront', parts.hairFront)}
        {assetLayer('hairSide', parts.hairSide)}

        {/* 14. Gafas & sombreros */}
        {assetLayer('glasses', parts.glasses)}
        {assetLayer('hat', parts.hat)}

        {/* 15. Brazos / pose */}
        {poseArms ? (
          <g id="arms" dangerouslySetInnerHTML={{ __html: poseArms }} />
        ) : (
          <g id="arms_default" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 160 245 Q 140 280 148 315" fill="none" strokeWidth="14" stroke={colors.topPrimary || '#FFFDF9'} strokeLinecap="round" />
            <circle cx="148" cy="318" r="7" fill={skin} />
            <path d="M 240 245 Q 260 280 252 315" fill="none" strokeWidth="14" stroke={colors.topPrimary || '#FFFDF9'} strokeLinecap="round" />
            <circle cx="252" cy="318" r="7" fill={skin} />
          </g>
        )}

        {/* 16. Objeto en mano */}
        {assetLayer('prop', parts.prop)}
      </svg>
    </div>
  );
};

export default ChibiRenderer;
