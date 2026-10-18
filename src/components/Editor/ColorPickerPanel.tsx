import React, { useState } from 'react';
import { COLOR_PALETTES } from '../../data/items';
import { Pipette, Check } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface ColorPickerPanelProps {
  label: string;
  currentColor: string;
  paletteType?: 'skin' | 'hair' | 'eyes' | 'clothes';
  onChangeColor: (hex: string) => void;
}

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  label,
  currentColor,
  paletteType = 'clothes',
  onChangeColor,
}) => {
  const [customHex, setCustomHex] = useState(currentColor);
  const swatches = COLOR_PALETTES[paletteType] || COLOR_PALETTES.clothes;

  const handleHexInput = (val: string) => {
    setCustomHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChangeColor(val);
    }
  };

  return (
    <div className="bg-white/80 p-3 rounded-2xl border-2 border-[#74C9F0] shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-[#1E4580] flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={currentColor.startsWith('#') ? currentColor : '#FF9EAA'}
            onChange={(e) => {
              onChangeColor(e.target.value);
              setCustomHex(e.target.value);
            }}
            className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent p-0"
            title="Selector de color del sistema"
          />
          <input
            type="text"
            value={customHex}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            className="w-20 text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border-2 border-[#74C9F0] text-center focus:outline-none focus:border-[#FF87B2]"
          />
        </div>
      </div>

      {/* Preset Swatches Grid */}
      <div className="grid grid-cols-8 gap-1.5 pt-1">
        {swatches.map((swatch) => {
          const isSelected = currentColor.toLowerCase() === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.hex}
              onClick={() => {
                playSound('click');
                onChangeColor(swatch.hex);
                setCustomHex(swatch.hex);
              }}
              title={swatch.name}
              className={`w-7 h-7 rounded-xl transition-all relative flex items-center justify-center border shadow-xs ${
                isSelected
                  ? 'ring-2 ring-[#FF87B2] ring-offset-1 scale-110 z-10 border-white'
                  : 'hover:scale-105 border-black/10'
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 ${
                    swatch.hex === '#FFFFFF' || swatch.hex === '#FFF2EC' || swatch.hex === '#FFEAA7'
                      ? 'text-black'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
