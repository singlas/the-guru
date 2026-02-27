import { useState } from "react";

// Category icons as simple SVG components
const CategoryIcons = {
  "Personal Dilemmas": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="32" cy="24" r="12" fill="currentColor" opacity="0.3"/>
      <circle cx="32" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 44c0-8 5-12 12-12s12 4 12 12" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M28 20 Q32 28 36 20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="32" y="58" textAnchor="middle" fill="currentColor" fontSize="8">?</text>
    </svg>
  ),
  "Professional Challenges": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="20" x2="52" y2="20" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 20 L12 32 L22 32 L22 20" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1"/>
      <path d="M42 20 L42 28 L52 28 L52 20" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1"/>
      <polyline points="16,28 20,24 24,30 28,22" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="47" cy="24" r="3" fill="currentColor" opacity="0.5"/>
      <path d="M44 26 L50 26 L47 30 Z" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  "Moral/Ethical Decisions": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M32 12 L32 32 L46 42" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="32" cy="32" r="3" fill="currentColor"/>
      <path d="M22 22 L26 26 M42 22 L38 26" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 38 Q32 48 44 38" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  "Relationship Situations": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <path d="M32 52 L16 32 Q16 16 32 20 Q48 16 48 32 L32 52" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="24" cy="28" r="4" fill="currentColor" opacity="0.5"/>
      <circle cx="40" cy="28" r="4" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  "Mind & Emotions": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <ellipse cx="32" cy="28" rx="16" ry="14" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 24 Q28 20 32 24 Q36 28 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M24 32 Q28 28 32 32 Q36 36 40 32" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="38" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="44" cy="38" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M28 44 Q32 48 36 44" fill="none" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  "Spiritual Growth": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.3"/>
      <path d="M32 8 L32 16 M32 48 L32 56 M8 32 L16 32 M48 32 L56 32" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M18 18 L24 24 M40 40 L46 46 M18 46 L24 40 M40 24 L46 18" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  "Wealth & Simplicity": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="32" cy="32" r="16" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <text x="32" y="38" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="bold">₹</text>
      <path d="M20 20 L18 18 M44 20 L46 18 M20 44 L18 46 M44 44 L46 46" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  "Family & Parenting": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="22" cy="20" r="6" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="42" cy="20" r="6" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="32" cy="38" r="5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M22 28 L22 32 L32 42 L42 32 L42 28" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 50 Q22 44 28 50 M36 50 Q42 44 48 50" fill="none" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  "Social Responsibility": () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="26" cy="28" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="38" cy="28" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="32" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <line x1="26" y1="32" x2="32" y2="36" stroke="currentColor" strokeWidth="1"/>
      <line x1="38" y1="32" x2="32" y2="36" stroke="currentColor" strokeWidth="1"/>
      <line x1="26" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
};

// Flip icon component
function FlipIcon({ light = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${light ? 'text-[#2D1F1A]/50' : 'text-[#C9A962]/60'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

// Points Badge Component for advanced mode
function PointsBadge({ points }) {
  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded-full"
      style={{
        background: `linear-gradient(145deg, #D4AF37 0%, #B8962E 50%, #8B7225 100%)`,
        boxShadow: `0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)`,
        border: '2px solid #8B7225'
      }}
    >
      <div className="text-center">
        <span className="text-white font-bold text-xs leading-none">{points}</span>
        <span className="text-white/80 text-[7px] block -mt-0.5">pts</span>
      </div>
    </div>
  );
}

// Card size configurations
const CARD_SIZES = {
  full: {
    minHeight: "min-h-[280px]",
    textSize: "text-base",
    iconSize: "w-14 h-14",
    padding: "px-6 py-5",
    headerPadding: "px-5 py-3",
  },
  hand: {
    minHeight: "min-h-[180px]",
    textSize: "text-sm",
    iconSize: "w-10 h-10",
    padding: "px-4 py-4",
    headerPadding: "px-4 py-2",
  },
  review: {
    minHeight: "min-h-[200px]",
    textSize: "text-sm",
    iconSize: "w-10 h-10",
    padding: "px-5 py-4",
    headerPadding: "px-4 py-2.5",
  },
};

// ============================================================
// SCENARIO CARD
// ============================================================
export function ScenarioCard({
  scenario,
  category,
  mode = "simple",
  size = "full" // "full" | "hand" | "review"
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const IconComponent = CategoryIcons[scenario.cat] || CategoryIcons["Personal Dilemmas"];
  const sizeConfig = CARD_SIZES[size];
  const borderColor = category.c || "#C9A962";

  const cardBase = `
    relative rounded-2xl overflow-hidden max-w-sm mx-auto w-full
    ${sizeConfig.minHeight}
  `;

  // Card front (English)
  const frontContent = (
    <div
      className={cardBase}
      style={{
        background: `linear-gradient(180deg, #FDFBF7 0%, #F5EFE0 100%)`,
        border: `3px solid ${borderColor}20`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.1)`,
      }}
    >
      {/* Top strip: category + score */}
      <div
        className={`flex items-center justify-between ${sizeConfig.headerPadding} border-b`}
        style={{ borderColor: `${borderColor}20`, background: `${borderColor}08` }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: borderColor }}
        >
          {scenario.cat}
        </span>
        {mode === "advanced" && <PointsBadge points={scenario.score} />}
      </div>

      {/* Body: icon + text */}
      <div className={`flex flex-col items-center justify-center ${sizeConfig.padding}`}>
        <div className={sizeConfig.iconSize} style={{ color: borderColor }}>
          <IconComponent />
        </div>
        <p
          className={`text-center leading-relaxed text-[#2D1F1A] mt-4 ${sizeConfig.textSize}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {scenario.text}
        </p>
      </div>

      {/* Bottom strip: metadata + flip icon */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 border-t"
        style={{ borderColor: `${borderColor}15`, background: `${borderColor}05` }}
      >
        <span
          className="text-[10px] font-medium"
          style={{ color: `${borderColor}90` }}
        >
          {category.hi || scenario.cat}
        </span>
        <button
          className="p-1 rounded hover:bg-black/5 transition-colors"
          onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
        >
          <FlipIcon light />
        </button>
      </div>
    </div>
  );

  // Card back (Hindi)
  const backContent = (
    <div
      className={cardBase}
      style={{
        background: `linear-gradient(180deg, ${borderColor}10 0%, #F5EFE0 100%)`,
        border: `3px solid ${borderColor}30`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.12)`,
      }}
    >
      {/* Top strip: Hindi category + score */}
      <div
        className={`flex items-center justify-between ${sizeConfig.headerPadding} border-b`}
        style={{ borderColor: `${borderColor}25`, background: `${borderColor}12` }}
      >
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: borderColor }}
        >
          {category.hi || scenario.cat}
        </span>
        {mode === "advanced" && <PointsBadge points={scenario.score} />}
      </div>

      {/* Body: icon + Hindi text */}
      <div className={`flex flex-col items-center justify-center ${sizeConfig.padding}`}>
        <div className={sizeConfig.iconSize} style={{ color: borderColor }}>
          <IconComponent />
        </div>
        <p
          className={`text-center leading-relaxed text-[#2D1F1A] mt-4 ${sizeConfig.textSize}`}
        >
          {scenario.hi || scenario.text}
        </p>
      </div>

      {/* Bottom strip: English label + flip icon */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 border-t"
        style={{ borderColor: `${borderColor}20`, background: `${borderColor}08` }}
      >
        <span
          className="text-[10px] font-medium"
          style={{ color: `${borderColor}90` }}
        >
          {scenario.cat}
        </span>
        <button
          className="p-1 rounded hover:bg-black/5 transition-colors"
          onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
        >
          <FlipIcon light />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="cursor-pointer select-none"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>
          {frontContent}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WISDOM CARD
// ============================================================
export function WisdomCard({
  wisdom,
  onClick,
  isSelectable = false,
  isSelected = false,
  size = "full", // "full" | "hand" | "review"
  guruName = null // For review mode, show guru name badge
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const sizeConfig = CARD_SIZES[size];

  const handleClick = (e) => {
    if (onClick && isSelectable) {
      onClick(e);
    }
  };

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const cardBase = `
    relative rounded-2xl overflow-hidden max-w-sm mx-auto w-full
    ${sizeConfig.minHeight}
    ${isSelectable && !isSelected ? 'animate-subtle-pulse' : ''}
    ${isSelected ? 'ring-2 ring-[#C9A962] scale-[1.02]' : ''}
    ${isSelectable ? 'cursor-pointer active:scale-[0.98]' : ''}
    transition-all duration-200
  `;

  // Card front (English)
  const frontContent = (
    <div
      className={cardBase}
      style={{
        background: `linear-gradient(145deg, #2D1F1A 0%, #1A1412 50%, #251815 100%)`,
        border: `3px solid #C9A96230`,
        boxShadow: isSelected
          ? '0 8px 24px rgba(201, 169, 98, 0.3)'
          : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Guru name badge (review mode) */}
      {guruName && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-lg bg-[#6B2D3C] border border-[#C9A962]/30 border-t-0">
          <span className="text-[#E8D5A3] text-xs font-medium">{guruName}</span>
        </div>
      )}

      {/* Top strip: verse reference + flip icon */}
      <div
        className={`flex items-center justify-between ${sizeConfig.headerPadding} border-b border-[#C9A962]/15`}
        style={{ background: 'linear-gradient(90deg, transparent, #C9A96210, transparent)' }}
      >
        <span className="text-[#C9A962] text-xs font-semibold tracking-wider">
          भगवद्गीता {wisdom.verse}
        </span>
        <button
          className="p-1 rounded hover:bg-white/5 transition-colors"
          onClick={handleFlip}
        >
          <FlipIcon />
        </button>
      </div>

      {/* Om watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-[#C9A962]/[0.06] pointer-events-none select-none">
        ॐ
      </div>

      {/* Body: verse text */}
      <div className={`flex items-center justify-center ${sizeConfig.padding}`}>
        <p className={`text-[#E8D5A3] text-center leading-relaxed italic ${sizeConfig.textSize}`}>
          "{wisdom.text}"
        </p>
      </div>

      {/* Bottom strip: chapter info */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-4 py-2 border-t border-[#C9A962]/10"
        style={{ background: '#C9A96208' }}
      >
        <span className="text-[#C9A962]/60 text-[10px] tracking-widest uppercase">
          Chapter {wisdom.verse.split('.')[0]} • Verse {wisdom.verse.split('.')[1]}
        </span>
      </div>

      {/* Corner flourishes */}
      <div className="absolute top-10 left-2 text-[#C9A962]/30 text-xs">✦</div>
      <div className="absolute top-10 right-2 text-[#C9A962]/30 text-xs">✦</div>
      <div className="absolute bottom-8 left-2 text-[#C9A962]/30 text-xs">✦</div>
      <div className="absolute bottom-8 right-2 text-[#C9A962]/30 text-xs">✦</div>
    </div>
  );

  // Card back (Sanskrit/Hindi)
  const backContent = (
    <div
      className={cardBase}
      style={{
        background: `linear-gradient(145deg, #3D2A20 0%, #2A1F1A 50%, #352518 100%)`,
        border: `3px solid #D4B87235`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* Guru name badge (review mode) */}
      {guruName && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-lg bg-[#6B2D3C] border border-[#D4B872]/30 border-t-0">
          <span className="text-[#E8D5A3] text-xs font-medium">{guruName}</span>
        </div>
      )}

      {/* Top strip: verse reference + flip icon */}
      <div
        className={`flex items-center justify-between ${sizeConfig.headerPadding} border-b border-[#D4B872]/20`}
        style={{ background: 'linear-gradient(90deg, transparent, #D4B87215, transparent)' }}
      >
        <span className="text-[#D4B872] text-xs font-semibold tracking-wider">
          श्लोक {wisdom.verse}
        </span>
        <button
          className="p-1 rounded hover:bg-white/5 transition-colors"
          onClick={handleFlip}
        >
          <FlipIcon />
        </button>
      </div>

      {/* Om watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-[#D4B872]/10 pointer-events-none select-none">
        ॐ
      </div>

      {/* Body: Hindi/Sanskrit text */}
      <div className={`flex items-center justify-center ${sizeConfig.padding}`}>
        <p className={`text-[#E8D5A3] text-center leading-relaxed ${sizeConfig.textSize}`}>
          "{wisdom.hi || wisdom.text}"
        </p>
      </div>

      {/* Bottom strip */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-4 py-2 border-t border-[#D4B872]/15"
        style={{ background: '#D4B87208' }}
      >
        <span className="text-[#D4B872]/60 text-[10px] tracking-widest uppercase">
          अध्याय {wisdom.verse.split('.')[0]} • श्लोक {wisdom.verse.split('.')[1]}
        </span>
      </div>

      {/* Corner flourishes */}
      <div className="absolute top-10 left-2 text-[#D4B872]/30 text-xs">✦</div>
      <div className="absolute top-10 right-2 text-[#D4B872]/30 text-xs">✦</div>
      <div className="absolute bottom-8 left-2 text-[#D4B872]/30 text-xs">✦</div>
      <div className="absolute bottom-8 right-2 text-[#D4B872]/30 text-xs">✦</div>
    </div>
  );

  return (
    <div
      className={isSelectable ? "cursor-pointer" : ""}
      onClick={handleClick}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>
          {frontContent}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}
