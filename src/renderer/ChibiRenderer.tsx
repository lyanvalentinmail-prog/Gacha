import React, { useId } from 'react';
import { Character } from '../types';

interface ChibiRendererProps {
  character: Character;
  className?: string;
  animate?: boolean;
  scale?: number;
  highlightCategory?: string;
  viewOnly?: boolean;
}

export const ChibiRenderer: React.FC<ChibiRendererProps> = ({
  character,
  className = '',
  animate = true,
  scale = 1,
  highlightCategory,
}) => {
  const uid = useId().replace(/:/g, '_');
  const { parts, colors } = character;

  // Helper gradients and filters IDs
  const hairGradId = `hair_grad_${uid}`;
  const eyeGradId = `eye_grad_${uid}`;
  const clothesGradId = `clothes_grad_${uid}`;
  const auraGlowId = `aura_glow_${uid}`;
  const skinShadowId = `skin_shadow_${uid}`;

  // Breathing animation CSS style
  const animClass = animate ? 'animate-bounce-subtle origin-bottom' : '';

  // Render Background Aura
  const renderAura = () => {
    switch (parts.aura) {
      case 'sparkles':
        return (
          <g opacity="0.85">
            <circle cx="120" cy="180" r="4" fill="#FFD700" className="animate-ping" />
            <polygon points="100,140 103,148 111,151 103,154 100,162 97,154 89,151 97,148" fill="#FFF3B0" />
            <polygon points="300,130 304,139 313,142 304,145 300,154 296,145 287,142 296,139" fill="#FFF3B0" />
            <polygon points="280,240 283,246 289,248 283,250 280,256 277,250 271,248 277,246" fill="#FFD700" />
            <polygon points="130,290 133,296 139,298 133,300 130,306 127,300 121,298 127,296" fill="#FFF3B0" />
          </g>
        );
      case 'cherry_petals':
        return (
          <g opacity="0.8">
            <ellipse cx="110" cy="160" rx="9" ry="5" transform="rotate(-30 110 160)" fill="#FFB5A7" />
            <ellipse cx="290" cy="180" rx="10" ry="6" transform="rotate(40 290 180)" fill="#FFD1DC" />
            <ellipse cx="140" cy="300" rx="8" ry="5" transform="rotate(20 140 300)" fill="#FF9EAA" />
            <ellipse cx="270" cy="320" rx="9" ry="5" transform="rotate(-45 270 320)" fill="#FFD1DC" />
          </g>
        );
      case 'hearts_float':
        return (
          <g opacity="0.85">
            <path d="M 120 170 C 110 160 95 170 120 190 C 145 170 130 160 120 170 Z" fill="#FF6F91" transform="scale(0.7) translate(50, 40)" />
            <path d="M 280 150 C 270 140 255 150 280 170 C 305 150 290 140 280 150 Z" fill="#FF9EAA" transform="scale(0.8) translate(70, 20)" />
            <path d="M 110 270 C 100 260 85 270 110 290 C 135 270 120 260 110 270 Z" fill="#FF6F91" transform="scale(0.6) translate(60, 150)" />
          </g>
        );
      case 'magic_circle':
        return (
          <g opacity="0.75" className="animate-spin origin-[200px_420px]" style={{ animationDuration: '20s' }}>
            <ellipse cx="200" cy="420" rx="130" ry="32" fill="none" stroke={colors.aura || '#C77DFF'} strokeWidth="3" strokeDasharray="6 4" />
            <ellipse cx="200" cy="420" rx="95" ry="24" fill="none" stroke={colors.aura || '#FF9EAA'} strokeWidth="2" />
            <polygon points="120,420 280,420 200,405" fill="none" stroke={colors.aura || '#C77DFF'} strokeWidth="1.5" />
            <polygon points="120,420 280,420 200,435" fill="none" stroke={colors.aura || '#C77DFF'} strokeWidth="1.5" />
          </g>
        );
      case 'dark_flames':
        return (
          <g opacity="0.6">
            <path d="M 100 380 Q 90 280 130 200 Q 140 280 120 380 Z" fill="#9D4EDD" />
            <path d="M 300 380 Q 310 280 270 200 Q 260 280 280 380 Z" fill="#9D4EDD" />
            <path d="M 80 400 Q 70 320 110 250 Q 115 320 100 400 Z" fill="#C77DFF" />
            <path d="M 320 400 Q 330 320 290 250 Q 285 320 300 400 Z" fill="#C77DFF" />
          </g>
        );
      case 'astral_nebula':
        return (
          <g opacity="0.7">
            <ellipse cx="200" cy="240" rx="170" ry="170" fill={`url(#${auraGlowId})`} />
            <circle cx="90" cy="140" r="3" fill="#FFFFFF" />
            <circle cx="310" cy="130" r="4" fill="#FFFFFF" />
            <circle cx="80" cy="280" r="3.5" fill="#FFFFFF" />
            <circle cx="320" cy="290" r="3" fill="#FFFFFF" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Back Wings
  const renderWings = () => {
    if (parts.wings === 'none') return null;
    const wingColor = colors.wings || '#FFFFFF';

    switch (parts.wings) {
      case 'angel_wings':
        return (
          <g id="wings_angel" stroke="#4A3B52" strokeWidth="2.5">
            {/* Left Wing */}
            <path
              d="M 150 230 C 90 190, 40 120, 45 60 C 70 90, 85 130, 95 170 C 85 140, 105 130, 120 180 C 120 160, 135 160, 145 210 Z"
              fill={wingColor}
            />
            {/* Feathers inner layer */}
            <path d="M 85 110 C 100 135, 115 160, 125 195" fill="none" stroke="#E2E8F0" strokeWidth="2" />
            {/* Right Wing */}
            <path
              d="M 250 230 C 310 190, 360 120, 355 60 C 330 90, 315 130, 305 170 C 315 140, 295 130, 280 180 C 280 160, 265 160, 255 210 Z"
              fill={wingColor}
            />
            <path d="M 315 110 C 300 135, 285 160, 275 195" fill="none" stroke="#E2E8F0" strokeWidth="2" />
          </g>
        );
      case 'devil_wings':
        return (
          <g id="wings_devil" stroke="#2B1B32" strokeWidth="2.5" fill={wingColor}>
            {/* Left */}
            <path d="M 150 230 L 70 120 L 95 160 L 50 170 L 85 205 L 60 225 L 140 250 Z" />
            {/* Right */}
            <path d="M 250 230 L 330 120 L 305 160 L 350 170 L 315 205 L 340 225 L 260 250 Z" />
          </g>
        );
      case 'fairy_wings':
        return (
          <g id="wings_fairy" stroke="#5C3D8D" strokeWidth="2" fill={wingColor} fillOpacity="0.82">
            <ellipse cx="100" cy="170" rx="60" ry="35" transform="rotate(-35 100 170)" />
            <ellipse cx="110" cy="225" rx="42" ry="24" transform="rotate(20 110 225)" />
            <ellipse cx="300" cy="170" rx="60" ry="35" transform="rotate(35 300 170)" />
            <ellipse cx="290" cy="225" rx="42" ry="24" transform="rotate(-20 290 225)" />
          </g>
        );
      case 'dragon_wings':
        return (
          <g id="wings_dragon" stroke="#3D1D1D" strokeWidth="2.5" fill={wingColor}>
            <path d="M 150 230 Q 80 140 50 80 Q 90 120 110 160 Q 80 190 70 230 Z" />
            <path d="M 250 230 Q 320 140 350 80 Q 310 120 290 160 Q 320 190 330 230 Z" />
          </g>
        );
      case 'cyber_wings':
        return (
          <g id="wings_cyber" stroke="#00F0FF" strokeWidth="2.5" fill={wingColor} fillOpacity="0.85">
            <polygon points="140,240 60,160 85,150 40,110 90,120 135,190" />
            <polygon points="260,240 340,160 315,150 360,110 310,120 265,190" />
            <line x1="60" y1="160" x2="135" y2="190" stroke="#FF007F" strokeWidth="2" />
            <line x1="340" y1="160" x2="265" y2="190" stroke="#FF007F" strokeWidth="2" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Back Tail
  const renderTail = () => {
    if (parts.tail === 'none') return null;
    const tailColor = colors.tail || '#FFAAA6';

    switch (parts.tail) {
      case 'cat_tail':
        return (
          <g id="tail_cat" stroke="#4A3B52" strokeWidth="2.5">
            <path
              d="M 230 340 Q 290 360 300 300 Q 310 250 280 240 Q 270 245 285 260 Q 290 290 245 330 Z"
              fill={tailColor}
            />
            {/* Cute ribbon on tail */}
            <rect x="280" y="270" width="12" height="8" rx="3" fill={colors.topSecondary || '#FF6F91'} />
          </g>
        );
      case 'kitsune_tail':
        return (
          <g id="tail_kitsune" stroke="#4A3B52" strokeWidth="2.5">
            <path
              d="M 230 350 C 310 370 370 310 350 220 C 330 180 290 220 280 260 C 260 290 245 320 225 345 Z"
              fill={tailColor}
            />
            {/* White tip */}
            <path
              d="M 350 220 C 340 195 315 200 305 220 C 320 230 335 240 350 220 Z"
              fill="#FFFFFF"
              stroke="#4A3B52"
              strokeWidth="2"
            />
          </g>
        );
      case 'bunny_tail':
        return (
          <ellipse
            cx="235"
            cy="335"
            rx="18"
            ry="18"
            fill={tailColor}
            stroke="#4A3B52"
            strokeWidth="2.5"
          />
        );
      case 'devil_tail':
        return (
          <g id="tail_devil" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 230 340 Q 290 360 300 310 Q 310 270 290 260" fill="none" strokeWidth="4" stroke={tailColor} />
            <polygon points="290,260 305,245 275,250" fill={tailColor} />
          </g>
        );
      case 'dragon_tail':
        return (
          <g id="tail_dragon" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 225 345 Q 310 380 330 300 Q 340 250 325 240 Q 315 260 295 320 Z" fill={tailColor} />
            <polygon points="325,240 340,245 320,260" fill={colors.topSecondary || '#FFD700'} />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Rear Hair (Behind head)
  const renderHairRear = () => {
    const baseCol = colors.hairBase || '#FFAAA6';
    const subCol = colors.hairSub || '#FFD1DC';
    const outlineCol = colors.hairOutline || '#4A3B52';

    switch (parts.hairRear) {
      case 'twintails':
        return (
          <g id="hair_rear_twintails" stroke={outlineCol} strokeWidth="3">
            {/* Left pigtail */}
            <path
              d="M 120 150 C 70 170, 45 230, 60 320 C 75 340, 95 310, 90 270 C 85 230, 100 190, 120 180 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Right pigtail */}
            <path
              d="M 280 150 C 330 170, 355 230, 340 320 C 325 340, 305 310, 310 270 C 315 230, 300 190, 280 180 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      case 'hightwintails':
        return (
          <g id="hair_rear_hightwintails" stroke={outlineCol} strokeWidth="3">
            {/* Left High Twin */}
            <path
              d="M 110 130 C 50 110, 20 170, 35 290 C 50 330, 75 310, 70 260 C 65 210, 85 160, 115 150 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Left Hair Tie */}
            <ellipse cx="110" cy="135" rx="8" ry="12" fill={colors.topSecondary || '#FF6F91'} />
            {/* Right High Twin */}
            <path
              d="M 290 130 C 350 110, 380 170, 365 290 C 350 330, 325 310, 330 260 C 335 210, 315 160, 285 150 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Right Hair Tie */}
            <ellipse cx="290" cy="135" rx="8" ry="12" fill={colors.topSecondary || '#FF6F91'} />
          </g>
        );
      case 'longstraight':
        return (
          <g id="hair_rear_longstraight" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 110 150 C 80 190, 75 280, 85 370 C 130 385, 270 385, 315 370 C 325 280, 320 190, 290 150 Z"
              fill={`url(#${hairGradId})`}
            />
            <path d="M 130 250 L 130 365" stroke={subCol} strokeWidth="2" opacity="0.6" />
            <path d="M 270 250 L 270 365" stroke={subCol} strokeWidth="2" opacity="0.6" />
          </g>
        );
      case 'longwavy':
        return (
          <g id="hair_rear_longwavy" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 110 150 C 70 200, 60 270, 80 320 C 65 350, 85 390, 120 380 C 160 395, 240 395, 280 380 C 315 390, 335 350, 320 320 C 340 270, 330 200, 290 150 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      case 'shortbob':
        return (
          <g id="hair_rear_shortbob" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 110 140 C 90 180, 95 240, 130 250 C 160 255, 240 255, 270 250 C 305 240, 310 180, 290 140 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      case 'spikyshort':
        return (
          <g id="hair_rear_spikyshort" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 110 140 L 80 180 L 105 190 L 75 230 L 115 235 L 90 270 L 150 255 L 200 260 L 250 255 L 310 270 L 285 235 L 325 230 L 295 190 L 320 180 L 290 140 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      case 'ponytail':
        return (
          <g id="hair_rear_ponytail" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 270 120 C 350 110, 370 180, 345 280 C 330 310, 310 290, 315 250 C 325 200, 305 160, 260 145 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Scrunchie */}
            <ellipse cx="265" cy="130" rx="10" ry="12" fill={colors.topSecondary || '#FF6F91'} />
          </g>
        );
      case 'sidebraid':
        return (
          <g id="hair_rear_sidebraid" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 120 160 C 90 190, 85 240, 95 290 C 105 330, 90 350, 80 370 C 100 375, 115 360, 120 330 C 125 290, 120 240, 130 190 Z"
              fill={`url(#${hairGradId})`}
            />
            <circle cx="85" cy="360" r="6" fill={colors.topSecondary || '#FF6F91'} />
          </g>
        );
      case 'spacebuns':
        return (
          <g id="hair_rear_spacebuns" stroke={outlineCol} strokeWidth="3">
            {/* Left Bun */}
            <circle cx="95" cy="100" r="32" fill={`url(#${hairGradId})`} />
            <circle cx="95" cy="100" r="30" fill="none" stroke={subCol} strokeWidth="2" strokeDasharray="6 4" />
            {/* Right Bun */}
            <circle cx="305" cy="100" r="32" fill={`url(#${hairGradId})`} />
            <circle cx="305" cy="100" r="30" fill="none" stroke={subCol} strokeWidth="2" strokeDasharray="6 4" />
          </g>
        );
      case 'drills':
        return (
          <g id="hair_rear_drills" stroke={outlineCol} strokeWidth="3">
            {/* Left Spiral Drill */}
            <path
              d="M 115 140 C 60 160, 50 200, 75 220 C 50 240, 55 280, 85 290 C 65 310, 70 340, 95 345 C 80 355, 90 370, 105 365 C 115 340, 110 260, 125 170 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Right Spiral Drill */}
            <path
              d="M 285 140 C 340 160, 350 200, 325 220 C 350 240, 345 280, 315 290 C 335 310, 330 340, 305 345 C 320 355, 310 370, 295 365 C 285 340, 290 260, 275 170 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      case 'wolfcut':
        return (
          <g id="hair_rear_wolfcut" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 110 140 L 80 200 L 105 210 L 70 260 L 100 270 L 80 320 L 130 330 L 170 340 L 230 340 L 270 330 L 320 320 L 300 270 L 330 260 L 295 210 L 320 200 L 290 140 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      case 'cloudhair':
        return (
          <g id="hair_rear_cloudhair" stroke={outlineCol} strokeWidth="3">
            <path
              d="M 100 130 C 50 140, 40 200, 60 250 C 40 280, 50 330, 80 360 C 120 390, 160 380, 200 385 C 240 380, 280 390, 320 360 C 350 330, 360 280, 340 250 C 360 200, 350 140, 300 130 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Body, Legs and Feet
  const renderBodyAndLegs = () => {
    const skin = colors.skin || '#FFE6D8';
    const shoes1 = colors.shoesPrimary || '#FF9EAA';
    const shoes2 = colors.shoesSecondary || '#FFFDF9';

    // Seated pose or standing
    const isSitting = parts.pose === 'sitting_sideways';
    const isJumping = parts.pose === 'jumping_action';

    if (isSitting) {
      return (
        <g id="legs_sitting" stroke="#4A3B52" strokeWidth="2.5">
          {/* Seated folded legs */}
          <path d="M 160 340 Q 150 390 180 405 Q 240 415 270 390 Q 285 370 240 360 Z" fill={skin} />
          {/* Shoes */}
          <ellipse cx="255" cy="385" rx="16" ry="10" fill={shoes1} />
          <ellipse cx="255" cy="385" rx="12" ry="7" fill={shoes2} />
        </g>
      );
    }

    const legYOffset = isJumping ? -20 : 0;

    return (
      <g id="legs_standing" stroke="#4A3B52" strokeWidth="2.5">
        {/* Left Leg */}
        <path
          d={`M 170 320 L 165 ${415 + legYOffset} Q 165 ${425 + legYOffset} 175 ${425 + legYOffset} L 185 ${415 + legYOffset} L 190 320 Z`}
          fill={skin}
        />
        {/* Right Leg */}
        <path
          d={`M 210 320 L 215 ${415 + legYOffset} Q 225 ${425 + legYOffset} 235 ${425 + legYOffset} L 235 ${415 + legYOffset} L 230 320 Z`}
          fill={skin}
        />

        {/* Socks rendering based on parts.socks */}
        {parts.socks === 'frilly' && (
          <g fill="#FFFDF9">
            <rect x="162" y={380 + legYOffset} width="25" height="35" rx="4" />
            <rect x="213" y={380 + legYOffset} width="25" height="35" rx="4" />
            <circle cx="165" cy={380 + legYOffset} r="4" />
            <circle cx="175" cy={380 + legYOffset} r="4" />
            <circle cx="185" cy={380 + legYOffset} r="4" />
            <circle cx="215" cy={380 + legYOffset} r="4" />
            <circle cx="225" cy={380 + legYOffset} r="4" />
            <circle cx="235" cy={380 + legYOffset} r="4" />
          </g>
        )}
        {parts.socks === 'black' && (
          <g fill="#2B2D42">
            <rect x="163" y={350 + legYOffset} width="24" height="65" rx="3" />
            <rect x="213" y={350 + legYOffset} width="24" height="65" rx="3" />
          </g>
        )}

        {/* Shoes */}
        {/* Left Shoe */}
        <path
          d={`M 158 ${410 + legYOffset} Q 155 ${432 + legYOffset} 185 ${432 + legYOffset} Q 192 ${432 + legYOffset} 190 ${410 + legYOffset} Z`}
          fill={shoes1}
        />
        <path
          d={`M 163 ${415 + legYOffset} Q 160 ${428 + legYOffset} 180 ${428 + legYOffset} Q 185 ${428 + legYOffset} 185 ${415 + legYOffset} Z`}
          fill={shoes2}
        />
        {/* Right Shoe */}
        <path
          d={`M 210 ${410 + legYOffset} Q 208 ${432 + legYOffset} 242 ${432 + legYOffset} Q 245 ${432 + legYOffset} 238 ${410 + legYOffset} Z`}
          fill={shoes1}
        />
        <path
          d={`M 215 ${415 + legYOffset} Q 215 ${428 + legYOffset} 238 ${428 + legYOffset} Q 240 ${428 + legYOffset} 235 ${415 + legYOffset} Z`}
          fill={shoes2}
        />
      </g>
    );
  };

  // Render Bottoms (Skirts, Pants, Shorts)
  const renderBottom = () => {
    const col1 = colors.bottomPrimary || '#1D3557';
    const col2 = colors.bottomSecondary || '#FFFDF9';

    switch (parts.bottom) {
      case 'pleated_skirt':
        return (
          <g id="bottom_pleated" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 305 L 140 345 Q 200 355 260 345 L 235 305 Z" fill={col1} />
            {/* Pleat lines */}
            <line x1="160" y1="315" x2="160" y2="348" stroke={col2} strokeWidth="1.5" />
            <line x1="180" y1="315" x2="180" y2="352" stroke={col2} strokeWidth="1.5" />
            <line x1="200" y1="315" x2="200" y2="353" stroke={col2} strokeWidth="1.5" />
            <line x1="220" y1="315" x2="220" y2="352" stroke={col2} strokeWidth="1.5" />
            <line x1="240" y1="315" x2="240" y2="348" stroke={col2} strokeWidth="1.5" />
          </g>
        );
      case 'frilly_skirt':
        return (
          <g id="bottom_frilly" stroke="#4A3B52" strokeWidth="2.5">
            {/* Tier 1 */}
            <path d="M 165 305 L 145 330 Q 200 338 255 330 L 235 305 Z" fill={col1} />
            {/* Tier 2 ruffle */}
            <path d="M 145 328 L 135 355 Q 200 365 265 355 L 255 328 Z" fill={col2} />
            {/* Ruffle scallop border */}
            <path d="M 135 355 Q 150 362 165 358 Q 180 362 200 359 Q 220 362 235 358 Q 250 362 265 355" fill="none" stroke="#FF6F91" strokeWidth="2" />
          </g>
        );
      case 'denim_shorts':
        return (
          <g id="bottom_denim" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 305 L 155 340 L 195 340 L 200 325 L 205 340 L 245 340 L 235 305 Z" fill={col1} />
            {/* Rolled hem */}
            <rect x="153" y="335" width="44" height="6" rx="2" fill={col2} stroke="#4A3B52" strokeWidth="1.5" />
            <rect x="203" y="335" width="44" height="6" rx="2" fill={col2} stroke="#4A3B52" strokeWidth="1.5" />
          </g>
        );
      case 'wide_pants':
        return (
          <g id="bottom_wide" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 305 L 150 395 L 195 395 L 200 335 L 205 395 L 250 395 L 235 305 Z" fill={col1} />
          </g>
        );
      case 'bloomers':
        return (
          <g id="bottom_bloomers" stroke="#4A3B52" strokeWidth="2.5">
            <ellipse cx="175" cy="330" rx="28" ry="20" fill={col1} />
            <ellipse cx="225" cy="330" rx="28" ry="20" fill={col1} />
            {/* Little ribbon */}
            <circle cx="152" cy="335" r="4" fill={col2} />
            <circle cx="248" cy="335" r="4" fill={col2} />
          </g>
        );
      case 'star_skirt':
        return (
          <g id="bottom_star" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 305 L 135 355 Q 200 368 265 355 L 235 305 Z" fill={col1} />
            {/* Constellation stars */}
            <polygon points="170,335 172,339 176,340 173,343 174,347 170,344 166,347 167,343 164,340 168,339" fill="#FFD700" />
            <polygon points="230,335 232,339 236,340 233,343 234,347 230,344 226,347 227,343 224,340 228,339" fill="#FFD700" />
            <polygon points="200,345 202,349 206,350 203,353 204,357 200,354 196,357 197,353 194,350 198,349" fill="#FFF3B0" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Tops (Shirts, Hoodies, Blouses, Jackets)
  const renderTop = () => {
    const col1 = colors.topPrimary || '#FFFDF9';
    const col2 = colors.topSecondary || '#FF9EAA';

    switch (parts.top) {
      case 'sailor_fuku':
        return (
          <g id="top_sailor" stroke="#4A3B52" strokeWidth="2.5">
            {/* Main torso */}
            <path d="M 165 240 L 160 310 L 240 310 L 235 240 Z" fill={col1} />
            {/* Sailor collar */}
            <path d="M 165 240 L 140 280 L 175 280 L 200 295 L 225 280 L 260 280 L 235 240 Z" fill={col2} />
            {/* Tie / Bow */}
            <polygon points="200,285 190,305 200,300 210,305" fill="#FF5376" />
            <circle cx="200" cy="285" r="5" fill="#FFD700" />
          </g>
        );
      case 'hoodie':
        return (
          <g id="top_hoodie" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 155 240 L 150 315 L 250 315 L 245 240 Z" fill={col1} />
            {/* Front pocket */}
            <path d="M 170 285 L 165 310 L 235 310 L 230 285 Z" fill={col2} />
            {/* Hoodie strings */}
            <line x1="185" y1="245" x2="185" y2="275" stroke="#4A3B52" strokeWidth="2" />
            <circle cx="185" cy="275" r="3" fill="#FF5376" />
            <line x1="215" y1="245" x2="215" y2="275" stroke="#4A3B52" strokeWidth="2" />
            <circle cx="215" cy="275" r="3" fill="#FF5376" />
          </g>
        );
      case 'idol_blouse':
        return (
          <g id="top_idol" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 240 L 160 310 L 240 310 L 235 240 Z" fill={col1} />
            {/* Frill center placket */}
            <rect x="190" y="245" width="20" height="65" fill={col2} />
            {/* Chest Ribbon Bow */}
            <path d="M 200 255 C 180 245 180 270 200 260 C 220 270 220 245 200 255 Z" fill="#FF5376" />
            <circle cx="200" cy="256" r="4" fill="#FFD700" />
          </g>
        );
      case 'sweater_vest':
        return (
          <g id="top_sweater" stroke="#4A3B52" strokeWidth="2.5">
            {/* White shirt base */}
            <path d="M 165 240 L 160 310 L 240 310 L 235 240 Z" fill="#FFFDF9" />
            {/* V-neck sweater vest */}
            <path d="M 165 240 L 160 308 L 240 308 L 235 240 L 215 240 L 200 275 L 185 240 Z" fill={col1} />
            {/* Tie inside V */}
            <polygon points="200,250 195,275 200,285 205,275" fill={col2} />
          </g>
        );
      case 'gothic_corset':
        return (
          <g id="top_gothic" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 240 L 160 310 L 240 310 L 235 240 Z" fill={col1} />
            {/* Corset laces */}
            <line x1="185" y1="260" x2="215" y2="270" stroke={col2} strokeWidth="2" />
            <line x1="215" y1="260" x2="185" y2="270" stroke={col2} strokeWidth="2" />
            <line x1="185" y1="275" x2="215" y2="285" stroke={col2} strokeWidth="2" />
            <line x1="215" y1="275" x2="185" y2="285" stroke={col2} strokeWidth="2" />
            <line x1="185" y1="290" x2="215" y2="300" stroke={col2} strokeWidth="2" />
            <line x1="215" y1="290" x2="185" y2="300" stroke={col2} strokeWidth="2" />
          </g>
        );
      case 'casual_tee':
        return (
          <g id="top_tee" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 240 L 160 310 L 240 310 L 235 240 Z" fill={col1} />
            {/* Cute bear face decal */}
            <circle cx="200" cy="275" r="14" fill={col2} stroke="#4A3B52" strokeWidth="1.5" />
            <circle cx="191" cy="265" r="5" fill={col2} stroke="#4A3B52" strokeWidth="1.5" />
            <circle cx="209" cy="265" r="5" fill={col2} stroke="#4A3B52" strokeWidth="1.5" />
            <circle cx="196" cy="274" r="1.5" fill="#4A3B52" />
            <circle cx="204" cy="274" r="1.5" fill="#4A3B52" />
            <ellipse cx="200" cy="278" rx="4" ry="3" fill="#FFFDF9" />
          </g>
        );
      case 'magic_robe':
        return (
          <g id="top_magic" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 160 240 L 150 315 L 250 315 L 240 240 Z" fill={col1} />
            <path d="M 195 240 L 195 315" stroke={col2} strokeWidth="4" />
            <polygon points="200,265 204,272 211,273 206,278 207,285 200,281 193,285 194,278 189,273 196,272" fill="#FFD700" />
          </g>
        );
      case 'cyber_jacket':
        return (
          <g id="top_cyber" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 160 240 L 150 310 L 250 310 L 240 240 Z" fill={col1} />
            {/* Neon collar trim */}
            <polygon points="160,240 185,270 200,260 215,270 240,240" fill={col2} />
            {/* Neon stripe accents */}
            <line x1="165" y1="285" x2="190" y2="285" stroke="#00F0FF" strokeWidth="3" />
            <line x1="210" y1="285" x2="235" y2="285" stroke="#00F0FF" strokeWidth="3" />
          </g>
        );
      case 'kimono_top':
        return (
          <g id="top_kimono" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 240 L 155 310 L 245 310 L 235 240 Z" fill={col1} />
            {/* Cross collar */}
            <line x1="170" y1="240" x2="225" y2="290" stroke={col2} strokeWidth="5" />
            <line x1="230" y1="240" x2="175" y2="290" stroke="#FFFDF9" strokeWidth="4" />
            {/* Obi belt */}
            <rect x="160" y="290" width="80" height="20" fill="#C1121F" stroke="#4A3B52" strokeWidth="2" />
            <rect x="190" y="293" width="20" height="14" fill="#FFD700" />
          </g>
        );
      default:
        return (
          <g id="top_default" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 165 240 L 160 310 L 240 310 L 235 240 Z" fill={col1} />
          </g>
        );
    }
  };

  // Render Neck Accessories
  const renderNeck = () => {
    if (parts.neck === 'none') return null;
    const neckCol = colors.neck || '#FF6F91';

    switch (parts.neck) {
      case 'bell_choker':
        return (
          <g id="neck_bell" stroke="#4A3B52" strokeWidth="2">
            <rect x="180" y="235" width="40" height="7" rx="3" fill="#2B2D42" />
            <circle cx="200" cy="246" r="6" fill="#FFD700" />
            <circle cx="200" cy="247" r="1.5" fill="#4A3B52" />
          </g>
        );
      case 'ribbon_bow':
        return (
          <g id="neck_ribbon" stroke="#4A3B52" strokeWidth="2">
            <path d="M 200 242 C 180 230 180 255 200 246 C 220 255 220 230 200 242 Z" fill={neckCol} />
            <circle cx="200" cy="242" r="4" fill="#FFD700" />
          </g>
        );
      case 'cozy_scarf':
        return (
          <g id="neck_scarf" stroke="#4A3B52" strokeWidth="2.5">
            <ellipse cx="200" cy="240" rx="32" ry="14" fill={neckCol} />
            <path d="M 215 245 L 225 295 L 205 295 L 205 245 Z" fill={neckCol} />
          </g>
        );
      case 'star_pendant':
        return (
          <g id="neck_star" stroke="#FFD700" strokeWidth="1.5">
            <path d="M 185 235 Q 200 255 215 235" fill="none" />
            <polygon points="200,250 203,256 209,257 204,261 206,267 200,264 194,267 196,261 191,257 197,256" fill="#FFD700" stroke="#4A3B52" strokeWidth="1.5" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Head & Ears
  const renderHead = () => {
    const skin = colors.skin || '#FFE6D8';
    return (
      <g id="head_base" stroke="#4A3B52" strokeWidth="3">
        {/* Soft neck */}
        <rect x="185" y="220" width="30" height="25" fill={skin} stroke="#4A3B52" strokeWidth="2.5" />
        {/* Neck shadow */}
        <ellipse cx="200" cy="235" rx="14" ry="4" fill="#E2B18A" opacity="0.4" stroke="none" />
        {/* Left Ear */}
        <ellipse cx="112" cy="155" rx="12" ry="16" fill={skin} />
        <ellipse cx="112" cy="155" rx="6" ry="8" fill="#FFB5A7" opacity="0.5" stroke="none" />
        {/* Right Ear */}
        <ellipse cx="288" cy="155" rx="12" ry="16" fill={skin} />
        <ellipse cx="288" cy="155" rx="6" ry="8" fill="#FFB5A7" opacity="0.5" stroke="none" />
        {/* Cute Chibi Head Shape (Chubby cheeks & soft anime chin) */}
        <path
          d="M 115 145 C 115 85, 285 85, 285 145 C 285 180, 292 205, 260 225 C 235 240, 215 242, 200 242 C 185 242, 165 240, 140 225 C 108 205, 115 180, 115 145 Z"
          fill={skin}
        />
      </g>
    );
  };

  // Render Face: Blush, Eyes, Eyebrows, Mouth, Expression
  const renderFace = () => {
    const eye1 = colors.eyePrimary || '#FF70A6';
    const eye2 = colors.eyeSecondary || '#FFD166';
    const browCol = colors.eyebrows || colors.hairOutline || '#4A3B52';
    const blushCol = colors.blush || '#FF9EAA';

    // Expression overrides
    const isWink = parts.expression === 'wink';
    const isHappyClosed = parts.expression === 'happy' && parts.eyes === 'round';
    const isSleepy = parts.expression === 'sleepy';

    return (
      <g id="face_features">
        {/* BLUSH */}
        {parts.blush === 'soft_pink' && (
          <g opacity="0.55">
            <ellipse cx="145" cy="185" rx="16" ry="9" fill={blushCol} />
            <ellipse cx="255" cy="185" rx="16" ry="9" fill={blushCol} />
          </g>
        )}
        {parts.blush === 'anime_stripes' && (
          <g stroke={blushCol} strokeWidth="2" strokeLinecap="round" opacity="0.75">
            <line x1="135" y1="182" x2="145" y2="187" />
            <line x1="143" y1="182" x2="153" y2="187" />
            <line x1="151" y1="182" x2="161" y2="187" />
            <line x1="245" y1="182" x2="255" y2="187" />
            <line x1="253" y1="182" x2="263" y2="187" />
            <line x1="261" y1="182" x2="271" y2="187" />
          </g>
        )}
        {parts.blush === 'full_flustered' && (
          <g opacity="0.7">
            <ellipse cx="145" cy="185" rx="20" ry="12" fill="#FF5376" />
            <ellipse cx="255" cy="185" rx="20" ry="12" fill="#FF5376" />
          </g>
        )}
        {parts.blush === 'star_stickers' && (
          <g fill="#FFD700" stroke="#4A3B52" strokeWidth="1">
            <polygon points="145,180 147,185 152,186 148,189 149,194 145,191 141,194 142,189 138,186 143,185" />
            <polygon points="255,180 257,185 262,186 258,189 259,194 255,191 251,194 252,189 248,186 253,185" />
          </g>
        )}

        {/* EYE BROWS */}
        {parts.eyebrows === 'gentle' && (
          <g stroke={browCol} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 135 138 Q 155 132 170 140" />
            <path d="M 230 140 Q 245 132 265 138" />
          </g>
        )}
        {parts.eyebrows === 'confident' && (
          <g stroke={browCol} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 135 142 L 170 134" />
            <path d="M 230 134 L 265 142" />
          </g>
        )}
        {parts.eyebrows === 'worried' && (
          <g stroke={browCol} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 135 134 Q 155 142 170 140" />
            <path d="M 230 140 Q 245 142 265 134" />
          </g>
        )}
        {parts.eyebrows === 'thick' && (
          <g fill={browCol}>
            <ellipse cx="152" cy="136" rx="14" ry="4" transform="rotate(-5 152 136)" />
            <ellipse cx="248" cy="136" rx="14" ry="4" transform="rotate(5 248 136)" />
          </g>
        )}
        {parts.eyebrows === 'dots' && (
          <g fill={browCol}>
            <ellipse cx="155" cy="133" rx="6" ry="8" />
            <ellipse cx="245" cy="133" rx="6" ry="8" />
          </g>
        )}

        {/* EYES */}
        {/* Left Eye */}
        {isSleepy ? (
          <path d="M 135 165 Q 155 178 175 165" fill="none" stroke="#4A3B52" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <g id="eye_left">
            {/* Sclera */}
            <ellipse cx="155" cy="165" rx="20" ry="24" fill="#FFFFFF" stroke="#4A3B52" strokeWidth="2.5" />
            {/* Iris */}
            <ellipse cx="155" cy="167" rx="17" ry="21" fill={`url(#${eyeGradId})`} />
            {/* Pupil */}
            {parts.pupils === 'cat_slit' ? (
              <ellipse cx="155" cy="167" rx="4" ry="16" fill="#1A1A24" />
            ) : parts.pupils === 'star_pupil' ? (
              <polygon points="155,160 157,165 162,167 157,169 155,174 153,169 148,167 153,165" fill="#FFFDF9" />
            ) : (
              <ellipse cx="155" cy="169" rx="10" ry="12" fill="#1A1A24" />
            )}
            {/* Highlights */}
            <ellipse cx="149" cy="158" rx="6" ry="8" fill="#FFFFFF" opacity="0.9" />
            <circle cx="163" cy="175" r="3.5" fill="#FFFFFF" opacity="0.85" />
            {/* Top Eyelash */}
            <path d="M 133 155 Q 155 142 177 155" fill="none" stroke="#2B2D42" strokeWidth="4" strokeLinecap="round" />
            <line x1="175" y1="154" x2="181" y2="149" stroke="#2B2D42" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Right Eye */}
        {isWink ? (
          <g id="eye_right_wink">
            <path d="M 225 168 Q 245 152 265 168" fill="none" stroke="#2B2D42" strokeWidth="4" strokeLinecap="round" />
            <line x1="264" y1="167" x2="270" y2="162" stroke="#2B2D42" strokeWidth="3" strokeLinecap="round" />
            <circle cx="245" cy="176" r="3" fill="#FF6F91" />
          </g>
        ) : isSleepy ? (
          <path d="M 225 165 Q 245 178 265 165" fill="none" stroke="#4A3B52" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <g id="eye_right">
            {/* Sclera */}
            <ellipse cx="245" cy="165" rx="20" ry="24" fill="#FFFFFF" stroke="#4A3B52" strokeWidth="2.5" />
            {/* Iris */}
            <ellipse cx="245" cy="167" rx="17" ry="21" fill={`url(#${eyeGradId})`} />
            {/* Pupil */}
            {parts.pupils === 'cat_slit' ? (
              <ellipse cx="245" cy="167" rx="4" ry="16" fill="#1A1A24" />
            ) : parts.pupils === 'star_pupil' ? (
              <polygon points="245,160 247,165 252,167 247,169 245,174 243,169 238,167 243,165" fill="#FFFDF9" />
            ) : (
              <ellipse cx="245" cy="169" rx="10" ry="12" fill="#1A1A24" />
            )}
            {/* Highlights */}
            <ellipse cx="239" cy="158" rx="6" ry="8" fill="#FFFFFF" opacity="0.9" />
            <circle cx="253" cy="175" r="3.5" fill="#FFFFFF" opacity="0.85" />
            {/* Top Eyelash */}
            <path d="M 223 155 Q 245 142 267 155" fill="none" stroke="#2B2D42" strokeWidth="4" strokeLinecap="round" />
            <line x1="265" y1="154" x2="271" y2="149" stroke="#2B2D42" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* NOSE */}
        <ellipse cx="200" cy="184" rx="2" ry="2.5" fill="#E2B18A" />

        {/* MOUTH */}
        {parts.mouth === 'smile_cute' && (
          <path d="M 192 198 Q 200 205 208 198" fill="none" stroke="#E06B78" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {parts.mouth === 'open_happy' && (
          <g stroke="#4A3B52" strokeWidth="2">
            <path d="M 190 196 Q 200 194 210 196 Q 200 215 190 196 Z" fill="#E06B78" />
            <ellipse cx="200" cy="204" rx="6" ry="4" fill="#FFAAA6" />
          </g>
        )}
        {parts.mouth === 'cat_mouth' && (
          <path d="M 191 198 Q 196 204 200 199 Q 204 204 209 198" fill="none" stroke="#E06B78" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {parts.mouth === 'fang' && (
          <g>
            <path d="M 192 198 Q 200 207 208 198" fill="none" stroke="#E06B78" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="195,199 197,205 199,200" fill="#FFFFFF" stroke="#4A3B52" strokeWidth="1" />
          </g>
        )}
        {parts.mouth === 'pout' && (
          <path d="M 192 203 Q 200 197 208 203" fill="none" stroke="#E06B78" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {parts.mouth === 'gasp' && (
          <ellipse cx="200" cy="200" rx="5" ry="7" fill="#E06B78" stroke="#4A3B52" strokeWidth="2" />
        )}
        {parts.mouth === 'smug' && (
          <path d="M 193 203 Q 203 204 212 196" fill="none" stroke="#E06B78" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {parts.mouth === 'dot' && (
          <ellipse cx="200" cy="200" rx="2" ry="2" fill="#E06B78" />
        )}
      </g>
    );
  };

  // Render Front Hair (Bangs & Front locks)
  const renderHairFront = () => {
    const baseCol = colors.hairBase || '#FFAAA6';
    const subCol = colors.hairSub || '#FFD1DC';
    const outlineCol = colors.hairOutline || '#4A3B52';

    return (
      <g id="hair_front" stroke={outlineCol} strokeWidth="3">
        {/* Hair Cap Base */}
        <path
          d="M 115 145 C 115 75, 285 75, 285 145 C 285 145, 275 125, 260 120 C 230 115, 170 115, 140 120 C 125 125, 115 145, 115 145 Z"
          fill={`url(#${hairGradId})`}
        />

        {/* Bangs Variations */}
        {parts.hairFront === 'blunt' && (
          <g>
            <path
              d="M 115 135 L 125 155 L 140 150 L 155 155 L 175 150 L 195 155 L 210 150 L 230 155 L 245 150 L 260 155 L 275 150 L 285 135 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        )}
        {parts.hairFront === 'sideswept' && (
          <g>
            <path
              d="M 115 135 C 130 165, 180 170, 220 155 C 240 150, 270 145, 285 135 L 285 120 C 240 115, 160 115, 115 135 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        )}
        {parts.hairFront === 'curtain' && (
          <g>
            {/* Left curtain */}
            <path
              d="M 115 135 C 130 150, 160 165, 190 145 C 160 135, 130 125, 115 135 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Right curtain */}
            <path
              d="M 285 135 C 270 150, 240 165, 210 145 C 240 135, 270 125, 285 135 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        )}
        {parts.hairFront === 'spiky' && (
          <g>
            <path
              d="M 115 135 L 130 160 L 145 145 L 165 165 L 180 140 L 205 165 L 220 140 L 245 165 L 260 145 L 285 135 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        )}
        {parts.hairFront === 'hime' && (
          <g>
            {/* Straight blunt center bangs */}
            <path
              d="M 140 125 L 145 150 L 175 150 L 200 152 L 225 150 L 255 150 L 260 125 Z"
              fill={`url(#${hairGradId})`}
            />
            {/* Long clean side hime locks */}
            <path d="M 115 130 L 125 210 L 140 210 L 135 140 Z" fill={`url(#${hairGradId})`} />
            <path d="M 285 130 L 275 210 L 260 210 L 265 140 Z" fill={`url(#${hairGradId})`} />
          </g>
        )}
        {parts.hairFront === 'heart' && (
          <g>
            <path
              d="M 115 135 C 135 155, 160 165, 185 150 C 195 160, 205 160, 215 150 C 240 165, 265 155, 285 135 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        )}
        {parts.hairFront === 'braided' && (
          <g>
            {/* Braided crown headband across forehead */}
            <path d="M 115 125 Q 200 115 285 125" stroke={subCol} strokeWidth="8" strokeDasharray="6 3" fill="none" />
            <path
              d="M 125 135 L 140 150 L 160 145 L 180 152 L 200 148 L 220 152 L 240 145 L 260 150 L 275 135 Z"
              fill={`url(#${hairGradId})`}
            />
          </g>
        )}

        {/* Anime Hair Gloss Ring / Highlights */}
        <path
          d="M 130 118 Q 200 108 270 118"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="14 8 20 6"
          opacity="0.65"
          fill="none"
        />
      </g>
    );
  };

  // Render Side Hair & Ahoge
  const renderHairSide = () => {
    const baseCol = colors.hairBase || '#FFAAA6';
    const outlineCol = colors.hairOutline || '#4A3B52';

    return (
      <g id="hair_side_ahoge" stroke={outlineCol} strokeWidth="3">
        {parts.hairSide === 'ahoge_single' && (
          <path
            d="M 200 85 Q 200 50 220 40 Q 235 55 210 75"
            fill="none"
            stroke={outlineCol}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
        {parts.hairSide === 'ahoge_heart' && (
          <path
            d="M 200 85 C 190 50, 175 40, 195 30 C 205 35, 205 45, 200 55 C 205 45, 215 35, 225 30 C 245 40, 230 50, 205 85"
            fill={baseCol}
            strokeWidth="2.5"
          />
        )}
        {parts.hairSide === 'side_locks' && (
          <g>
            <path d="M 120 140 C 105 180, 110 230, 125 250 C 130 240, 125 180, 130 150 Z" fill={baseCol} />
            <path d="M 280 140 C 295 180, 290 230, 275 250 C 270 240, 275 180, 270 150 Z" fill={baseCol} />
          </g>
        )}
      </g>
    );
  };

  // Render Face Accessories (Glasses, Bandaid)
  const renderFaceAccessories = () => {
    const glassCol = colors.glasses || '#FFD700';

    switch (parts.glasses) {
      case 'round_glasses':
        return (
          <g id="acc_round_glasses" stroke={glassCol} strokeWidth="2.5" fill="none">
            <circle cx="155" cy="165" r="18" fill="rgba(255,255,255,0.2)" />
            <circle cx="245" cy="165" r="18" fill="rgba(255,255,255,0.2)" />
            <line x1="173" y1="165" x2="227" y2="165" strokeWidth="2" />
          </g>
        );
      case 'heart_glasses':
        return (
          <g id="acc_heart_glasses" stroke={glassCol} strokeWidth="2.5" fill="rgba(255, 111, 145, 0.25)">
            <path d="M 155 160 C 145 145 125 155 155 180 C 185 155 165 145 155 160 Z" />
            <path d="M 245 160 C 235 145 215 155 245 180 C 275 155 255 145 245 160 Z" />
            <line x1="175" y1="165" x2="225" y2="165" strokeWidth="2" />
          </g>
        );
      case 'eyepatch':
        return (
          <g id="acc_eyepatch" stroke="#4A3B52" strokeWidth="2">
            <line x1="115" y1="145" x2="195" y2="185" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="142" y="152" width="26" height="26" rx="4" fill="#FFFDF9" />
            <polygon points="155,158 155,172 153,172 153,158" fill="#FF5376" />
            <polygon points="148,165 162,165 162,163 148,163" fill="#FF5376" />
          </g>
        );
      case 'face_mask':
        return (
          <g id="acc_face_mask" stroke="#4A3B52" strokeWidth="2">
            <rect x="170" y="185" width="60" height="35" rx="10" fill="#FFFDF9" />
            <line x1="170" y1="190" x2="125" y2="160" stroke="#FFFDF9" strokeWidth="2" />
            <line x1="230" y1="190" x2="275" y2="160" stroke="#FFFDF9" strokeWidth="2" />
            {/* Cute smile on mask */}
            <path d="M 195 202 Q 200 207 205 202" fill="none" stroke="#FF9EAA" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Hats & Head Accessories
  const renderHat = () => {
    if (parts.hat === 'none') return null;
    const hatCol1 = colors.hatPrimary || '#FF9EAA';
    const hatCol2 = colors.hatSecondary || '#FFD700';

    switch (parts.hat) {
      case 'beret':
        return (
          <g id="hat_beret" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 120 100 C 130 50, 270 50, 280 100 C 270 120, 130 120, 120 100 Z" fill={hatCol1} />
            <ellipse cx="200" cy="95" rx="80" ry="20" fill={hatCol1} />
            {/* Little stem */}
            <line x1="200" y1="65" x2="200" y2="55" stroke="#4A3B52" strokeWidth="3" />
            <circle cx="160" cy="95" r="5" fill={hatCol2} />
          </g>
        );
      case 'cat_ears':
        return (
          <g id="hat_cat_ears" stroke="#4A3B52" strokeWidth="2.5">
            {/* Headband */}
            <path d="M 125 110 Q 200 95 275 110" fill="none" stroke="#2B2D42" strokeWidth="3" />
            {/* Left Cat Ear */}
            <polygon points="120,110 105,50 160,85" fill={hatCol1} />
            <polygon points="123,100 115,62 148,84" fill="#FFD1DC" />
            {/* Left bell */}
            <circle cx="120" cy="110" r="5" fill="#FFD700" />
            {/* Right Cat Ear */}
            <polygon points="280,110 295,50 240,85" fill={hatCol1} />
            <polygon points="277,100 285,62 252,84" fill="#FFD1DC" />
            {/* Right bell */}
            <circle cx="280" cy="110" r="5" fill="#FFD700" />
          </g>
        );
      case 'bunny_ears':
        return (
          <g id="hat_bunny_ears" stroke="#4A3B52" strokeWidth="2.5">
            {/* Left Ear */}
            <ellipse cx="150" cy="40" rx="14" ry="42" transform="rotate(-15 150 40)" fill={hatCol1} />
            <ellipse cx="150" cy="40" rx="8" ry="30" transform="rotate(-15 150 40)" fill="#FFD1DC" />
            {/* Right Ear */}
            <ellipse cx="250" cy="40" rx="14" ry="42" transform="rotate(15 250 40)" fill={hatCol1} />
            <ellipse cx="250" cy="40" rx="8" ry="30" transform="rotate(15 250 40)" fill="#FFD1DC" />
          </g>
        );
      case 'witch_hat':
        return (
          <g id="hat_witch" stroke="#4A3B52" strokeWidth="2.5">
            {/* Wide Brim */}
            <ellipse cx="200" cy="100" rx="95" ry="24" fill={hatCol1} />
            {/* Cone */}
            <path d="M 140 95 Q 180 30 250 10 Q 230 50 260 95 Z" fill={hatCol1} />
            {/* Gold Ribbon band */}
            <path d="M 155 93 Q 200 85 245 93" stroke={hatCol2} strokeWidth="6" fill="none" />
            {/* Star buckle */}
            <polygon points="200,85 202,90 207,91 203,94 204,99 200,96 196,99 197,94 193,91 198,90" fill="#FFD700" />
          </g>
        );
      case 'gamer_headset':
        return (
          <g id="hat_gamer" stroke="#4A3B52" strokeWidth="2.5">
            {/* Headband */}
            <path d="M 110 150 C 105 70, 295 70, 290 150" fill="none" stroke="#2B2D42" strokeWidth="6" />
            {/* Left Earcup */}
            <rect x="100" y="130" width="16" height="35" rx="8" fill={hatCol1} />
            <circle cx="108" cy="147" r="5" fill="#00F0FF" />
            {/* Left Neko ear on headset */}
            <polygon points="130,85 115,55 145,70" fill={hatCol1} />
            {/* Right Earcup */}
            <rect x="284" y="130" width="16" height="35" rx="8" fill={hatCol1} />
            <circle cx="292" cy="147" r="5" fill="#00F0FF" />
            {/* Right Neko ear on headset */}
            <polygon points="270,85 285,55 255,70" fill={hatCol1} />
          </g>
        );
      case 'tiara_crown':
        return (
          <g id="hat_tiara" stroke="#4A3B52" strokeWidth="2">
            <polygon points="160,105 170,80 185,95 200,70 215,95 230,80 240,105" fill={hatCol2} />
            <circle cx="200" cy="85" r="4" fill="#FF5376" />
            <circle cx="170" cy="92" r="3" fill="#64DFDF" />
            <circle cx="230" cy="92" r="3" fill="#64DFDF" />
          </g>
        );
      case 'angel_halo':
        return (
          <g id="hat_halo" className="animate-float">
            <ellipse cx="200" cy="50" rx="55" ry="14" fill="none" stroke="#FFD700" strokeWidth="6" opacity="0.9" />
            <ellipse cx="200" cy="50" rx="55" ry="14" fill="none" stroke="#FFF3B0" strokeWidth="3" />
          </g>
        );
      case 'demon_horns':
        return (
          <g id="hat_horns" stroke="#4A3B52" strokeWidth="2.5">
            <path d="M 140 100 Q 120 70 110 50 Q 135 60 155 90 Z" fill={hatCol1} />
            <path d="M 260 100 Q 280 70 290 50 Q 265 60 245 90 Z" fill={hatCol1} />
          </g>
        );
      case 'sakura_flower':
        return (
          <g id="hat_sakura" stroke="#4A3B52" strokeWidth="1.5">
            <circle cx="130" cy="115" r="7" fill="#FFB5A7" />
            <circle cx="140" cy="110" r="7" fill="#FFB5A7" />
            <circle cx="145" cy="120" r="7" fill="#FFB5A7" />
            <circle cx="138" cy="130" r="7" fill="#FFB5A7" />
            <circle cx="127" cy="125" r="7" fill="#FFB5A7" />
            <circle cx="136" cy="120" r="4" fill="#FFD700" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render Arms and Pose
  const renderArmsAndPose = () => {
    const skin = colors.skin || '#FFE6D8';
    const sleeveCol = colors.topPrimary || '#FFFDF9';

    switch (parts.pose) {
      case 'peace_sign':
        return (
          <g id="arms_peace" stroke="#4A3B52" strokeWidth="2.5">
            {/* Left Arm relaxed */}
            <path d="M 160 245 Q 140 280 145 315" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="145" cy="320" r="7" fill={skin} />
            {/* Right Arm making peace sign near head */}
            <path d="M 240 245 Q 265 240 265 200" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            {/* Peace hand */}
            <circle cx="265" cy="195" r="8" fill={skin} />
            <line x1="262" y1="190" x2="258" y2="175" stroke={skin} strokeWidth="4" strokeLinecap="round" />
            <line x1="268" y1="190" x2="272" y2="175" stroke={skin} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'cheerful_wave':
        return (
          <g id="arms_wave" stroke="#4A3B52" strokeWidth="2.5">
            {/* Left Arm relaxed */}
            <path d="M 160 245 Q 140 280 145 315" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="145" cy="320" r="7" fill={skin} />
            {/* Right Arm raised waving */}
            <path d="M 240 245 Q 275 220 280 170" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            {/* Waving hand */}
            <circle cx="282" cy="165" r="9" fill={skin} />
            <line x1="282" y1="160" x2="280" y2="150" stroke={skin} strokeWidth="3" strokeLinecap="round" />
            <line x1="287" y1="162" x2="289" y2="152" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'hands_on_hips':
        return (
          <g id="arms_hips" stroke="#4A3B52" strokeWidth="2.5">
            {/* Left arm bent to hip */}
            <path d="M 160 245 L 135 280 L 160 295" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="160" cy="295" r="7" fill={skin} />
            {/* Right arm bent to hip */}
            <path d="M 240 245 L 265 280 L 240 295" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="240" cy="295" r="7" fill={skin} />
          </g>
        );
      case 'shy_clasped':
        return (
          <g id="arms_shy" stroke="#4A3B52" strokeWidth="2.5">
            {/* Both hands clasped in front of tummy */}
            <path d="M 160 245 Q 170 280 195 290" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <path d="M 240 245 Q 230 280 205 290" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <ellipse cx="200" cy="290" rx="10" ry="7" fill={skin} />
          </g>
        );
      case 'magic_cast':
        return (
          <g id="arms_magic" stroke="#4A3B52" strokeWidth="2.5">
            {/* Arms spread out summoning */}
            <path d="M 160 245 Q 125 240 105 250" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="100" cy="250" r="8" fill={skin} />
            <path d="M 240 245 Q 275 240 295 250" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="300" cy="250" r="8" fill={skin} />
          </g>
        );
      default:
        // Standing cute default
        return (
          <g id="arms_default" stroke="#4A3B52" strokeWidth="2.5">
            {/* Left arm */}
            <path d="M 160 245 Q 140 280 148 315" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="148" cy="318" r="7" fill={skin} />
            {/* Right arm */}
            <path d="M 240 245 Q 260 280 252 315" fill="none" strokeWidth="14" stroke={sleeveCol} strokeLinecap="round" />
            <circle cx="252" cy="318" r="7" fill={skin} />
          </g>
        );
    }
  };

  // Render Hand Props (Held objects)
  const renderProp = () => {
    if (parts.prop === 'none') return null;
    const propCol = colors.prop || '#FFD700';

    switch (parts.prop) {
      case 'magic_wand':
        return (
          <g id="prop_wand" stroke="#4A3B52" strokeWidth="2">
            <line x1="255" y1="315" x2="285" y2="235" stroke="#FFEAA7" strokeWidth="5" strokeLinecap="round" />
            {/* Star topper */}
            <polygon
              points="285,230 289,240 299,242 291,249 293,259 285,254 277,259 279,249 271,242 281,240"
              fill={propCol}
            />
            <circle cx="285" cy="245" r="4" fill="#FF5376" />
          </g>
        );
      case 'boba_tea':
        return (
          <g id="prop_boba" stroke="#4A3B52" strokeWidth="2">
            <path d="M 250 295 L 255 330 Q 270 335 285 330 L 290 295 Z" fill="#FFE0B2" />
            {/* Boba pearls */}
            <circle cx="262" cy="324" r="3" fill="#3D2817" />
            <circle cx="270" cy="326" r="3" fill="#3D2817" />
            <circle cx="278" cy="324" r="3" fill="#3D2817" />
            {/* Lid & straw */}
            <line x1="270" y1="300" x2="275" y2="275" stroke="#FF6F91" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="270" cy="295" rx="20" ry="5" fill="#FFFDF9" />
          </g>
        );
      case 'teddy_bear':
        return (
          <g id="prop_teddy" stroke="#4A3B52" strokeWidth="2">
            <circle cx="200" cy="300" r="16" fill="#D7CCC8" />
            <circle cx="190" cy="288" r="5" fill="#D7CCC8" />
            <circle cx="210" cy="288" r="5" fill="#D7CCC8" />
            <circle cx="196" cy="298" r="1.5" fill="#3D2817" />
            <circle cx="204" cy="298" r="1.5" fill="#3D2817" />
            <ellipse cx="200" cy="303" rx="4" ry="3" fill="#FFFDF9" />
            <path d="M 200 306 L 200 322" stroke="#3D2817" strokeWidth="1" />
          </g>
        );
      case 'gamepad':
        return (
          <g id="prop_gamepad" stroke="#4A3B52" strokeWidth="2">
            <rect x="245" y="295" width="45" height="26" rx="8" fill="#D8B4E2" />
            {/* D-Pad */}
            <polygon points="255,302 259,302 259,306 263,306 263,310 259,310 259,314 255,314 255,310 251,310 251,306 255,306" fill="#2B2D42" />
            {/* Buttons */}
            <circle cx="275" cy="305" r="2.5" fill="#FF5376" />
            <circle cx="282" cy="311" r="2.5" fill="#64DFDF" />
          </g>
        );
      case 'sword_light':
        return (
          <g id="prop_sword" stroke="#4A3B52" strokeWidth="2">
            <line x1="255" y1="320" x2="280" y2="350" stroke="#795548" strokeWidth="5" />
            {/* Guard */}
            <line x1="245" y1="315" x2="270" y2="310" stroke="#FFD700" strokeWidth="4" />
            {/* Crystal Blade */}
            <polygon points="258,310 315,190 325,195 268,315" fill="#64DFDF" stroke="#00F0FF" strokeWidth="2" />
          </g>
        );
      case 'idol_mic':
        return (
          <g id="prop_mic" stroke="#4A3B52" strokeWidth="2">
            <line x1="255" y1="320" x2="265" y2="285" stroke="#FF9EAA" strokeWidth="4" />
            <ellipse cx="266" cy="282" rx="7" ry="9" fill="#E2E8F0" />
            <circle cx="260" cy="315" r="4" fill="#FFD700" />
          </g>
        );
      case 'spellbook':
        return (
          <g id="prop_book" stroke="#4A3B52" strokeWidth="2">
            <rect x="250" y="280" width="36" height="46" rx="4" transform="rotate(15 250 280)" fill="#7E57C2" />
            <polygon points="275,295 277,300 282,301 278,305 279,310 275,307 271,310 272,305 268,301 273,300" fill="#FFD700" />
          </g>
        );
      case 'celestial_staff':
        return (
          <g id="prop_staff" stroke="#4A3B52" strokeWidth="2">
            <line x1="250" y1="360" x2="295" y2="160" stroke="#FFD700" strokeWidth="5" />
            <circle cx="295" cy="155" r="16" fill="none" stroke="#FFD700" strokeWidth="4" />
            <polygon points="295,145 298,152 305,155 298,158 295,165 292,158 285,155 292,152" fill="#FFF3B0" />
          </g>
        );
      default:
        return null;
    }
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
      >
        <defs>
          {/* Hair Gradient */}
          <linearGradient id={hairGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.hairBase || '#FFAAA6'} />
            <stop offset="70%" stopColor={colors.hairBase || '#FFAAA6'} />
            <stop offset="100%" stopColor={colors.hairSub || '#FFD1DC'} />
          </linearGradient>

          {/* Eye Gradient */}
          <linearGradient id={eyeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.eyePrimary || '#FF70A6'} />
            <stop offset="75%" stopColor={colors.eyePrimary || '#FF70A6'} />
            <stop offset="100%" stopColor={colors.eyeSecondary || '#FFD166'} />
          </linearGradient>

          {/* Clothes Gradient */}
          <linearGradient id={clothesGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.topPrimary || '#FFFDF9'} />
            <stop offset="100%" stopColor={colors.topSecondary || '#FF9EAA'} />
          </linearGradient>

          {/* Aura Radial Glow */}
          <radialGradient id={auraGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.aura || '#C77DFF'} stopOpacity="0.6" />
            <stop offset="70%" stopColor={colors.aura || '#48CAE4'} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Soft Shadow Filter */}
          <filter id={skinShadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. Background Aura */}
        {renderAura()}

        {/* 2. Wings (Behind character) */}
        {renderWings()}

        {/* 3. Tail */}
        {renderTail()}

        {/* 4. Rear Hair */}
        {renderHairRear()}

        {/* 5. Legs & Feet / Shoes */}
        {renderBodyAndLegs()}

        {/* 6. Bottoms (Skirts, Pants) */}
        {renderBottom()}

        {/* 7. Torso & Tops */}
        {renderTop()}

        {/* 8. Neck Accessories */}
        {renderNeck()}

        {/* 9. Head & Ears Base */}
        {renderHead()}

        {/* 10. Face Features (Eyes, Eyebrows, Mouth, Blush) */}
        {renderFace()}

        {/* 11. Front Hair (Bangs) */}
        {renderHairFront()}

        {/* 12. Side Hair & Ahoge */}
        {renderHairSide()}

        {/* 13. Face Accessories (Glasses, Eyepatch) */}
        {renderFaceAccessories()}

        {/* 14. Hats & Head Accessories */}
        {renderHat()}

        {/* 15. Arms and Pose */}
        {renderArmsAndPose()}

        {/* 16. Hand Prop */}
        {renderProp()}
      </svg>
    </div>
  );
};
