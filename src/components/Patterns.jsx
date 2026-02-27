// Geometric pattern for scenario cards
export function GeometricPattern({ pattern, color, size = 100, opacity = 0.08 }) {
  const patterns = {
    circles: (
      <>
        {[0, 1, 2].map((i) =>
          [0, 1, 2].map((j) => (
            <circle
              key={`${i}${j}`}
              cx={20 + i * 40}
              cy={20 + j * 40}
              r={12 - i * 2}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
            />
          ))
        )}
      </>
    ),
    grid: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1="0" y1={i * 30 + 15} x2="120" y2={i * 30 + 15} stroke={color} strokeWidth="1" />
            <line x1={i * 30 + 15} y1="0" x2={i * 30 + 15} y2="120" stroke={color} strokeWidth="1" />
          </g>
        ))}
      </>
    ),
    triangles: (
      <>
        {[
          [30, 10, 10, 50, 50, 50],
          [70, 10, 50, 50, 90, 50],
          [50, 60, 30, 100, 70, 100],
        ].map((points, i) => (
          <polygon key={i} points={points.join(",")} fill="none" stroke={color} strokeWidth="1.5" />
        ))}
      </>
    ),
    diamonds: (
      <>
        {[
          [40, 10, 70, 40, 40, 70, 10, 40],
          [80, 30, 110, 60, 80, 90, 50, 60],
        ].map((points, i) => (
          <polygon key={i} points={points.join(",")} fill="none" stroke={color} strokeWidth="1.5" />
        ))}
      </>
    ),
    waves: (
      <>
        {[20, 50, 80].map((y) => (
          <path
            key={y}
            d={`M0,${y} Q30,${y - 15} 60,${y} T120,${y}`}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
      </>
    ),
    lotus: (
      <>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="60"
            cy="60"
            rx="20"
            ry="40"
            fill="none"
            stroke={color}
            strokeWidth="1"
            transform={`rotate(${angle},60,60)`}
          />
        ))}
      </>
    ),
    hex: (
      <>
        {[
          [40, 15],
          [80, 15],
          [40, 65],
        ].map(([x, y], i) => (
          <polygon
            key={i}
            points={`${x},${y} ${x + 20},${y - 12} ${x + 40},${y} ${x + 40},${y + 24} ${x + 20},${y + 36} ${x},${y + 24}`}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
      </>
    ),
    hearts: (
      <path
        d="M60,90 C60,90 20,60 20,35 C20,15 40,10 60,30 C80,10 100,15 100,35 C100,60 60,90 60,90Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    ),
    stars: (
      <>
        {[
          [35, 30, 12],
          [85, 70, 10],
          [55, 100, 8],
        ].map(([cx, cy, r], i) => {
          const points = Array.from({ length: 10 }, (_, k) => {
            const angle = Math.PI / 2 + k * Math.PI / 5;
            const radius = k % 2 ? r * 0.4 : r;
            return `${cx + radius * Math.cos(angle)},${cy - radius * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={i} points={points} fill="none" stroke={color} strokeWidth="1.2" />;
        })}
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ opacity, position: "absolute", right: 8, top: 8 }}
    >
      {patterns[pattern] || patterns.circles}
    </svg>
  );
}

// Wisdom pattern (lotus) for wisdom cards
export function WisdomPattern({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={{ opacity: 0.12, position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
    >
      {[0, 45, 90, 135].map((angle) => (
        <ellipse
          key={angle}
          cx="30"
          cy="30"
          rx="10"
          ry="25"
          fill="none"
          stroke="#B8860B"
          strokeWidth="1"
          transform={`rotate(${angle},30,30)`}
        />
      ))}
      <circle cx="30" cy="30" r="6" fill="none" stroke="#B8860B" strokeWidth="1.5" />
    </svg>
  );
}

// Mandala for home screen
export function Mandala({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="mx-auto mb-4">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <ellipse
          key={angle}
          cx="40"
          cy="40"
          rx="8"
          ry="30"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1"
          opacity=".6"
          transform={`rotate(${angle},40,40)`}
        />
      ))}
      <circle cx="40" cy="40" r="12" fill="none" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="40" cy="40" r="4" fill="#F59E0B" />
    </svg>
  );
}
