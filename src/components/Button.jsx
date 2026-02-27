export function Button({ children, onClick, disabled, variant = "primary", className = "" }) {
  const baseStyles = "w-full py-4 rounded-2xl text-lg font-medium transition-all duration-300 active:scale-[0.98]";

  const variants = {
    primary: `
      bg-gradient-to-r from-[#C9A962] via-[#E8D5A3] to-[#C9A962]
      text-[#1A1412] font-semibold
      shadow-lg shadow-[#C9A962]/20
      hover:shadow-xl hover:shadow-[#C9A962]/30
      disabled:opacity-30 disabled:shadow-none
      disabled:from-[#555] disabled:via-[#666] disabled:to-[#555]
    `,
    secondary: `
      bg-transparent
      border border-[#C9A962]/40
      text-[#C9A962]
      hover:bg-[#C9A962]/10 hover:border-[#C9A962]/60
      disabled:opacity-30
    `,
    ghost: `
      bg-[#2D1F1A]/60
      border border-[#C9A962]/20
      text-[#E8D5A3]
      hover:bg-[#2D1F1A]/80 hover:border-[#C9A962]/30
      disabled:opacity-30
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Smaller action button
export function ActionButton({ children, onClick, disabled, active, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200
        ${active
          ? "bg-[#C9A962]/20 border-[#C9A962] text-[#E8D5A3] border"
          : "bg-[#2D1F1A]/40 border-[#C9A962]/20 text-[#C9A962]/70 border hover:border-[#C9A962]/40 hover:text-[#C9A962]"
        }
        disabled:opacity-30
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Icon button
export function IconButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        bg-[#2D1F1A]/60 border border-[#C9A962]/20
        text-[#C9A962] text-xl
        transition-all duration-200
        hover:bg-[#2D1F1A]/80 hover:border-[#C9A962]/40
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
}
