import React from 'react';
import { AssetItem } from '../data/assetCatalog';

interface AssetThumbProps {
  asset?: AssetItem;
  /** Zoom: recorte del lienzo (viewBox) */
  className?: string;
  /** Mostrar marco de fondo */
  frameless?: boolean;
}

/**
 * Miniatura real de un asset (renderiza el SVG con el recorte de su categoría).
 */
export const AssetThumb: React.FC<AssetThumbProps> = ({ asset, className = 'w-full h-full', frameless = false }) => {
  if (!asset) return null;

  if (asset.empty) {
    return (
      <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="12" fill="none" stroke="#9B9BD4" strokeWidth="3" strokeDasharray="4 3" />
        <line x1="12" y1="12" x2="28" y2="28" stroke="#9B9BD4" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Fondos: viewBox propio (800x600)
  if (asset.layer === 'background') {
    return (
      <svg viewBox={asset.viewBox} className={className} xmlns="http://www.w3.org/2000/svg">
        <g dangerouslySetInnerHTML={{ __html: asset.inner }} />
      </svg>
    );
  }

  // Swatches de color (piel): pinta el color directamente
  if (asset.layer === 'color' && asset.color) {
    return (
      <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="10" fill={asset.color} stroke="#4A3B52" strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox={asset.focus.join(' ')}
      className={frameless ? className : `${className} overflow-hidden`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g dangerouslySetInnerHTML={{ __html: asset.inner }} />
    </svg>
  );
};

export default AssetThumb;
