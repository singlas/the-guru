/**
 * GameScreen - Consistent layout structure for all game screens
 *
 * Structure:
 * - Top bar: Round counter left, scores/info right (fixed, compact)
 * - Screen title: Phase name with decorative divider
 * - Instruction: Helper text explaining what to do
 * - Content: Main content area (scrollable, centered when short)
 * - Actions: Primary button + optional secondary actions (fixed bottom)
 */

import { Button } from "./Button";

export function GameScreen({
  // Top bar
  roundInfo, // e.g., "Round 1 of 3" or null to hide
  topRightContent, // React node for right side of top bar

  // Title section
  title, // Main heading like "The Seeker Speaks"
  instruction, // Helper text like "Read the dilemma aloud"

  // Content
  children, // Main content
  contentCentered = false, // Center content vertically when short

  // Actions
  primaryAction, // { label: "Continue", onClick: fn, disabled: false }
  secondaryAction, // { label: "Skip", onClick: fn } - optional
}) {
  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "linear-gradient(180deg, #1A1412 0%, #2D1F1A 50%, #1A1412 100%)",
      }}
    >
      {/* Top bar - fixed, compact */}
      {(roundInfo || topRightContent) && (
        <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[#F5EFE0]/60 text-xs">
            {roundInfo || ""}
          </span>
          <div className="text-[#F5EFE0]/60 text-xs">
            {topRightContent}
          </div>
        </div>
      )}

      {/* Title section - sticky top */}
      <div className="shrink-0 px-5 pt-2">
        {/* Screen title */}
        <h2 className="font-display text-2xl text-[#C9A962] text-center">
          {title}
        </h2>

        {/* Decorative divider */}
        <div className="flex justify-center mt-2">
          <div className="w-10 h-px bg-[#C9A962]/40" />
        </div>

        {/* Instruction line */}
        {instruction && (
          <p className="text-[#F5EFE0]/70 text-sm italic text-center mt-2">
            {instruction}
          </p>
        )}
      </div>

      {/* Main content area - scrollable, flex-1 */}
      <div
        className={`flex-1 overflow-y-auto px-5 pt-6 pb-6 ${
          contentCentered ? "flex flex-col items-center justify-center" : ""
        }`}
      >
        <div className={contentCentered ? "w-full flex flex-col items-center" : ""}>
          {children}
        </div>
      </div>

      {/* Action area - fixed bottom */}
      {primaryAction && (
        <div className="shrink-0 px-6 pb-6 pt-4 bg-gradient-to-t from-[#1A1412] via-[#1A1412]/95 to-transparent">
          <Button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
          >
            {primaryAction.label}
          </Button>

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full mt-3 py-3 text-[#C9A962]/70 text-sm hover:text-[#C9A962] transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ScoreChips - Display player scores in top bar or inline
 */
export function ScoreChips({ players, currentPlayerIndex = -1, compact = true }) {
  if (compact) {
    // Just show count for top bar
    return <span>{players.length} players</span>;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {players.map((p, i) => (
        <div
          key={i}
          className={`px-3 py-1.5 rounded-full text-xs ${
            i === currentPlayerIndex
              ? "bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/40"
              : "bg-[#2D1F1A]/60 text-[#F5EFE0]/50"
          }`}
        >
          {p.name}: {p.score}
        </div>
      ))}
    </div>
  );
}

/**
 * PlayerAvatar - Circular avatar with initial
 */
export function PlayerAvatar({ name, size = "md", highlight = false }) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-display ${
        highlight
          ? "bg-[#C9A962]/20 text-[#C9A962] border-2 border-[#C9A962]"
          : "bg-[#6B2D3C]/40 text-[#C9A962] border border-[#C9A962]/30"
      }`}
    >
      {name[0]}
    </div>
  );
}

/**
 * CenteredMessage - For passing screens, loading states, etc.
 */
export function CenteredMessage({ icon, title, subtitle }) {
  return (
    <div className="text-center">
      {icon && <div className="mb-4">{icon}</div>}
      {title && (
        <p className="font-display text-3xl text-[#C9A962] mb-2">{title}</p>
      )}
      {subtitle && (
        <p className="text-[#F5EFE0]/50 text-sm">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * TimerBar - Visual countdown timer for Speed Wisdom mode
 */
import { useEffect, useRef } from "react";

export function TimerBar({ seconds, maxSeconds = 60, onTick, onComplete }) {
  const intervalRef = useRef(null);
  const percentage = (seconds / maxSeconds) * 100;

  // Determine color based on time remaining
  const getColor = () => {
    if (seconds > 30) return "#C9A962"; // Gold - plenty of time
    if (seconds > 10) return "#D97706"; // Orange - getting low
    return "#DC2626"; // Red - urgent
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (seconds > 0) {
        onTick(seconds - 1);
      } else {
        clearInterval(intervalRef.current);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [seconds, onTick, onComplete]);

  return (
    <div className="mb-4">
      {/* Timer bar container */}
      <div className="relative h-1.5 bg-[#2D1F1A] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
            boxShadow: `0 0 8px ${getColor()}60`,
          }}
        />
      </div>
      {/* Time remaining text */}
      <div className="flex justify-between items-center mt-1">
        <span className="text-[10px] text-[#F5EFE0]/40">Speed Wisdom</span>
        <span
          className="text-xs font-medium transition-colors"
          style={{ color: getColor() }}
        >
          {seconds}s
        </span>
      </div>
    </div>
  );
}
