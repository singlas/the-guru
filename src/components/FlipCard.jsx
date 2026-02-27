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
// SCENARIO CARD - Dark elegant theme with center-only flip
// ============================================================
export function ScenarioCard({
  scenario,
  category,
  mode = "simple",
  size = "full", // "full" | "hand" | "review"
  // Synchronized flip props
  syncFlipped = null, // null = uncontrolled, true/false = controlled
  onFlipChange = null, // callback when flip state changes (for sync mode)
  showFlipHint = false, // Show "Tap to show Hindi" hint in footer
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);

  // Use controlled or uncontrolled flip state
  const showHindi = syncFlipped !== null ? syncFlipped : internalFlipped;
  const toggleFlip = () => {
    const newVal = !showHindi;
    if (syncFlipped !== null && onFlipChange) {
      onFlipChange(newVal);
    } else {
      setInternalFlipped(newVal);
    }
  };

  const IconComponent = CategoryIcons[scenario.cat] || CategoryIcons["Personal Dilemmas"];
  const sizeConfig = CARD_SIZES[size];
  const catColor = category.c || "#C9A962";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden max-w-sm mx-auto w-full flex flex-col cursor-pointer select-none ${sizeConfig.minHeight}`}
      style={{
        background: `linear-gradient(145deg, #2D1F1A 0%, #1A1412 50%, #251815 100%)`,
        border: `3px solid ${catColor}50`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 30px ${catColor}15`,
      }}
      onClick={toggleFlip}
    >
      {/* Top strip: category (static) + flip icon */}
      <div
        className={`shrink-0 flex items-center justify-between ${sizeConfig.headerPadding}`}
        style={{
          background: `linear-gradient(90deg, ${catColor}25, ${catColor}15, ${catColor}25)`,
          borderBottom: `1px solid ${catColor}30`
        }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: catColor }}
        >
          {scenario.cat}
        </span>
        <div className="flex items-center gap-2">
          {mode === "advanced" && <PointsBadge points={scenario.score} />}
          <button
            className="p-1 rounded hover:bg-white/5 transition-colors"
            onClick={(e) => { e.stopPropagation(); toggleFlip(); }}
          >
            <FlipIcon />
          </button>
        </div>
      </div>

      {/* Body: flipping text area (fills remaining space) */}
      <div className={`relative flex-1 flex items-center justify-center ${sizeConfig.padding} pb-10`}>
        {/* Category icon watermark - centered in body */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06]"
          style={{ color: catColor }}
        >
          <div className="w-32 h-32">
            <IconComponent />
          </div>
        </div>

        {/* Flipping text content - 3D flip for center only */}
        <div className="relative w-full" style={{ perspective: "800px" }}>
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: showHindi ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* English text */}
            <div style={{ backfaceVisibility: "hidden" }}>
              <p
                className={`text-center leading-relaxed text-[#E8D5A3] ${sizeConfig.textSize}`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {scenario.text}
              </p>
            </div>
            {/* Hindi text */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <p
                className={`text-center leading-relaxed text-[#E8D5A3] ${sizeConfig.textSize}`}
              >
                {scenario.hi || scenario.text}
              </p>
            </div>
          </div>
        </div>

        {/* Corner flourishes - positioned within body area */}
        <div className="absolute top-2 left-2 text-xs" style={{ color: `${catColor}60` }}>✦</div>
        <div className="absolute top-2 right-2 text-xs" style={{ color: `${catColor}60` }}>✦</div>
        <div className="absolute bottom-10 left-2 text-xs" style={{ color: `${catColor}60` }}>✦</div>
        <div className="absolute bottom-10 right-2 text-xs" style={{ color: `${catColor}60` }}>✦</div>
      </div>

      {/* Bottom strip: Hindi category label (static) + optional flip hint */}
      <div
        className="shrink-0 flex flex-col items-center justify-center px-4 py-2"
        style={{
          background: `linear-gradient(90deg, ${catColor}15, ${catColor}10, ${catColor}15)`,
          borderTop: `1px solid ${catColor}25`
        }}
      >
        <span
          className="text-[10px] tracking-widest uppercase"
          style={{ color: `${catColor}80` }}
        >
          {category.hi || scenario.cat}
        </span>
        {showFlipHint && (
          <span className="text-[9px] text-[#F5EFE0]/40 mt-0.5">
            {showHindi ? "Tap to show English" : "Tap to show Hindi"}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// WISDOM CARD - Center-only flip
// ============================================================
export function WisdomCard({
  wisdom,
  onClick,
  isSelectable = false,
  isSelected = false,
  size = "full", // "full" | "hand" | "review"
  guruName = null, // For review mode, show guru name badge
  // Synchronized flip props
  syncFlipped = null, // null = uncontrolled, true/false = controlled
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const sizeConfig = CARD_SIZES[size];

  // Use controlled or uncontrolled flip state
  const showHindi = syncFlipped !== null ? syncFlipped : internalFlipped;
  const showFlipControl = syncFlipped === null; // Hide flip button when externally controlled

  const handleClick = (e) => {
    if (onClick && isSelectable) {
      onClick(e);
    }
  };

  const handleFlip = (e) => {
    e.stopPropagation();
    if (syncFlipped === null) {
      setInternalFlipped(!internalFlipped);
    }
  };

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden max-w-sm mx-auto w-full flex flex-col
        ${sizeConfig.minHeight}
        ${isSelectable && !isSelected ? 'animate-subtle-pulse' : ''}
        ${isSelected ? 'scale-[1.02]' : ''}
        ${isSelectable ? 'cursor-pointer active:scale-[0.98]' : ''}
        transition-all duration-200
      `}
      style={{
        background: `linear-gradient(145deg, #2D1F1A 0%, #1A1412 50%, #251815 100%)`,
        border: isSelected ? `3px solid #C9A962` : `3px solid #C9A96230`,
        boxShadow: isSelected
          ? '0 8px 24px rgba(201, 169, 98, 0.4), 0 0 20px rgba(201, 169, 98, 0.2)'
          : '0 4px 16px rgba(0,0,0,0.3)',
      }}
      onClick={handleClick}
    >
      {/* Guru name badge (review mode) - positioned top right */}
      {guruName && (
        <div className="absolute -top-0.5 right-3 px-3 py-1 rounded-b-lg bg-[#6B2D3C] border border-[#C9A962]/30 border-t-0 z-10">
          <span className="text-[#E8D5A3] text-xs font-medium">{guruName}</span>
        </div>
      )}

      {/* Top strip: verse reference (static) + flip icon / checkmark */}
      <div
        className={`shrink-0 flex items-center justify-between ${sizeConfig.headerPadding} border-b border-[#C9A962]/15`}
        style={{ background: 'linear-gradient(90deg, transparent, #C9A96210, transparent)' }}
      >
        <span className="text-[#C9A962] text-xs font-semibold tracking-wider">
          Bhagavad Gita {wisdom.verse}
        </span>
        <div className="flex items-center gap-2">
          {showFlipControl && (
            <button
              className="p-1 rounded hover:bg-white/5 transition-colors"
              onClick={handleFlip}
            >
              <FlipIcon />
            </button>
          )}
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-[#C9A962] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#1A1412]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Body: flipping text area (fills remaining space) */}
      <div className={`relative flex-1 flex items-center justify-center ${sizeConfig.padding} pb-8`}>
        {/* Om watermark */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl text-[#C9A962]/[0.06] pointer-events-none select-none">
          ॐ
        </div>

        {/* Flipping text content - 3D flip for center only */}
        <div className="relative w-full" style={{ perspective: "800px" }}>
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: showHindi ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* English text */}
            <div style={{ backfaceVisibility: "hidden" }}>
              <p className={`text-[#E8D5A3] text-center leading-relaxed italic ${sizeConfig.textSize}`}>
                "{wisdom.text}"
              </p>
            </div>
            {/* Hindi text */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <p className={`text-[#E8D5A3] text-center leading-relaxed ${sizeConfig.textSize}`}>
                "{wisdom.hi || wisdom.text}"
              </p>
            </div>
          </div>
        </div>

        {/* Corner flourishes */}
        <div className="absolute top-2 left-2 text-[#C9A962]/30 text-xs">✦</div>
        <div className="absolute top-2 right-2 text-[#C9A962]/30 text-xs">✦</div>
        <div className="absolute bottom-8 left-2 text-[#C9A962]/30 text-xs">✦</div>
        <div className="absolute bottom-8 right-2 text-[#C9A962]/30 text-xs">✦</div>
      </div>

      {/* Bottom strip: chapter info (static) */}
      <div
        className="shrink-0 flex items-center justify-center px-4 py-2 border-t border-[#C9A962]/10"
        style={{ background: '#C9A96208' }}
      >
        <span className="text-[#C9A962]/60 text-[10px] tracking-widest uppercase">
          Chapter {wisdom.verse.split('.')[0]} • Verse {wisdom.verse.split('.')[1]}
        </span>
      </div>
    </div>
  );
}
