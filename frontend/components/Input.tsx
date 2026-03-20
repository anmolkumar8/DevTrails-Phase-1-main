import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors
            focus:border-vigil-accent/50 focus:outline-none focus:ring-1 focus:ring-vigil-accent/30
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-red-500/50" : "border-white/10"}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
