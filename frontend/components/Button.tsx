import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0e17] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-vigil-accent text-slate-950 hover:bg-vigil-accent/90 focus:ring-vigil-accent shadow-lg shadow-vigil-accent/20",
    secondary:
      "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-white/20 focus:ring-white/20",
    ghost:
      "text-slate-400 hover:bg-white/5 hover:text-white focus:ring-white/10",
    danger:
      "bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 focus:ring-red-500/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Processing…
        </>
      ) : (
        children
      )}
    </button>
  );
}
