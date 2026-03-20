interface BadgeProps {
  variant?: "success" | "warning" | "error" | "neutral";
  className?: string;
  children: React.ReactNode;
}

export default function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  const variants = {
    success:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error:
      "bg-red-500/10 text-red-400 border-red-500/20",
    neutral:
      "bg-white/5 text-slate-400 border-white/10",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
