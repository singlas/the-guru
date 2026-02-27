const BTN_GRADIENT = "linear-gradient(135deg,#F59E0B,#D97706)";

export function Button({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-xl text-lg font-semibold text-slate-900 disabled:opacity-30 active:scale-[0.98] transition-transform ${className}`}
      style={{ background: disabled ? "#555" : BTN_GRADIENT }}
    >
      {children}
    </button>
  );
}
