import Link from "next/link";

interface HeaderProps {
  variant?: "default" | "minimal";
}

export default function Header({ variant = "default" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-vigil-accent/15 ring-1 ring-vigil-accent/20">
            <span className="text-sm font-bold text-vigil-accent">V</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            VIGIL
          </span>
        </Link>
        {variant === "default" && (
          <nav className="flex items-center gap-1">
            <Link
              href="/claim"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              File Claim
            </Link>
            <Link
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Admin
            </Link>
          </nav>
        )}
        {variant === "minimal" && (
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            ← Back to Home
          </Link>
        )}
      </div>
    </header>
  );
}
