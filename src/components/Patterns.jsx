// Sacred Lotus - main decorative element
export function SacredLotus({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`animate-breathe ${className}`}
    >
      <defs>
        <linearGradient id="lotusGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8D5A3" />
          <stop offset="50%" stopColor="#C9A962" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>
        <linearGradient id="lotusInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A962" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6B2D3C" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="60" cy="60" r="55" fill="none" stroke="url(#lotusGold)" strokeWidth="0.5" opacity="0.3" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lotusGold)" strokeWidth="0.3" opacity="0.2" />

      {/* Lotus petals - outer layer */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={`outer-${angle}`}
          cx="60"
          cy="60"
          rx="8"
          ry="35"
          fill="none"
          stroke="url(#lotusGold)"
          strokeWidth="1"
          opacity="0.6"
          transform={`rotate(${angle},60,60)`}
        />
      ))}

      {/* Lotus petals - inner layer */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
        <ellipse
          key={`inner-${angle}`}
          cx="60"
          cy="60"
          rx="6"
          ry="25"
          fill="none"
          stroke="url(#lotusGold)"
          strokeWidth="0.8"
          opacity="0.4"
          transform={`rotate(${angle},60,60)`}
        />
      ))}

      {/* Center circles */}
      <circle cx="60" cy="60" r="15" fill="none" stroke="url(#lotusGold)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="60" cy="60" r="10" fill="none" stroke="url(#lotusInner)" strokeWidth="1" />
      <circle cx="60" cy="60" r="5" fill="url(#lotusGold)" opacity="0.9" />

      {/* Sacred dots */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 42 * Math.cos(rad);
        const y = 60 + 42 * Math.sin(rad);
        return <circle key={`dot-${angle}`} cx={x} cy={y} r="2" fill="#C9A962" opacity="0.6" />;
      })}
    </svg>
  );
}

// Geometric pattern for scenario cards - sacred geometry inspired
export function GeometricPattern({ pattern, color, size = 100, opacity = 0.12 }) {
  const patterns = {
    circles: (
      <>
        {/* Seed of life pattern */}
        <circle cx="60" cy="60" r="25" fill="none" stroke={color} strokeWidth="0.8" />
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + 25 * Math.cos(rad);
          const y = 60 + 25 * Math.sin(rad);
          return <circle key={angle} cx={x} cy={y} r="25" fill="none" stroke={color} strokeWidth="0.8" />;
        })}
      </>
    ),
    grid: (
      <>
        {/* Sri Yantra inspired */}
        <polygon points="60,20 95,80 25,80" fill="none" stroke={color} strokeWidth="0.8" />
        <polygon points="60,90 30,40 90,40" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="60" cy="55" r="20" fill="none" stroke={color} strokeWidth="0.6" />
        <circle cx="60" cy="55" r="12" fill="none" stroke={color} strokeWidth="0.6" />
      </>
    ),
    triangles: (
      <>
        {/* Upward and downward triangles */}
        <polygon points="60,15 100,85 20,85" fill="none" stroke={color} strokeWidth="1" />
        <polygon points="60,95 20,30 100,30" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="60" cy="55" r="8" fill={color} opacity="0.3" />
      </>
    ),
    diamonds: (
      <>
        {/* Vesica Piscis */}
        <ellipse cx="45" cy="60" rx="30" ry="40" fill="none" stroke={color} strokeWidth="0.8" />
        <ellipse cx="75" cy="60" rx="30" ry="40" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="60" cy="60" r="5" fill={color} opacity="0.4" />
      </>
    ),
    waves: (
      <>
        {/* Om-inspired waves */}
        {[25, 45, 65, 85].map((y) => (
          <path
            key={y}
            d={`M10,${y} Q35,${y - 12} 60,${y} T110,${y}`}
            fill="none"
            stroke={color}
            strokeWidth="0.8"
          />
        ))}
      </>
    ),
    lotus: (
      <>
        {/* Lotus flower */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="60"
            cy="60"
            rx="10"
            ry="30"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            transform={`rotate(${angle},60,60)`}
          />
        ))}
        <circle cx="60" cy="60" r="10" fill={color} opacity="0.2" />
      </>
    ),
    hex: (
      <>
        {/* Metatron's cube simplified */}
        <circle cx="60" cy="60" r="35" fill="none" stroke={color} strokeWidth="0.6" />
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + 35 * Math.cos(rad);
          const y = 60 + 35 * Math.sin(rad);
          return <circle key={angle} cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="0.6" />;
        })}
        <circle cx="60" cy="60" r="8" fill="none" stroke={color} strokeWidth="0.8" />
      </>
    ),
    hearts: (
      <>
        {/* Heart chakra pattern */}
        <path
          d="M60,85 C60,85 25,60 25,40 C25,25 40,20 60,38 C80,20 95,25 95,40 C95,60 60,85 60,85Z"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
        <circle cx="60" cy="50" r="12" fill="none" stroke={color} strokeWidth="0.8" />
        {[0, 90, 180, 270].map((angle) => (
          <ellipse
            key={angle}
            cx="60"
            cy="50"
            rx="4"
            ry="12"
            fill="none"
            stroke={color}
            strokeWidth="0.6"
            transform={`rotate(${angle},60,50)`}
          />
        ))}
      </>
    ),
    stars: (
      <>
        {/* Star of David */}
        <polygon points="60,20 85,70 35,70" fill="none" stroke={color} strokeWidth="1" />
        <polygon points="60,80 35,35 85,35" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="60" cy="50" r="15" fill="none" stroke={color} strokeWidth="0.6" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ opacity, position: "absolute", right: 12, top: 12 }}
    >
      {patterns[pattern] || patterns.circles}
    </svg>
  );
}

// Wisdom pattern for wisdom cards - more elaborate
export function WisdomPattern({ size = 60 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={{ opacity: 0.15, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
    >
      {/* Lotus with glow */}
      {[0, 45, 90, 135].map((angle) => (
        <ellipse
          key={angle}
          cx="30"
          cy="30"
          rx="8"
          ry="22"
          fill="none"
          stroke="#C9A962"
          strokeWidth="0.8"
          transform={`rotate(${angle},30,30)`}
        />
      ))}
      <circle cx="30" cy="30" r="8" fill="none" stroke="#C9A962" strokeWidth="1" />
      <circle cx="30" cy="30" r="3" fill="#C9A962" opacity="0.6" />
    </svg>
  );
}

// Decorative divider
export function SacredDivider({ width = 200, className = "" }) {
  return (
    <svg width={width} height="20" viewBox="0 0 200 20" className={className}>
      <defs>
        <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A962" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9A962" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="10" x2="85" y2="10" stroke="url(#dividerGrad)" strokeWidth="1" />
      <circle cx="100" cy="10" r="4" fill="none" stroke="#C9A962" strokeWidth="1" opacity="0.6" />
      <circle cx="100" cy="10" r="2" fill="#C9A962" opacity="0.4" />
      <line x1="115" y1="10" x2="200" y2="10" stroke="url(#dividerGrad)" strokeWidth="1" />
    </svg>
  );
}

// Small decorative element
export function SacredDot({ size = 8, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" className={className}>
      <circle cx="4" cy="4" r="3" fill="none" stroke="#C9A962" strokeWidth="0.5" opacity="0.6" />
      <circle cx="4" cy="4" r="1.5" fill="#C9A962" opacity="0.4" />
    </svg>
  );
}
