import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variants = {
    default:
      "bg-slate-900/50 border border-white/5 rounded-xl",
    elevated:
      "bg-slate-900/80 border border-white/5 rounded-xl shadow-xl shadow-black/20",
    bordered:
      "bg-transparent border border-white/10 rounded-xl",
  };

  return (
    <div
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 ${className}`} {...props} />;
}
