import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-mesh">
      <Header variant="minimal" />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
        <p className="text-sm font-medium text-vigil-accent">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-center text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-vigil-accent px-5 py-2.5 text-sm font-medium text-slate-950 transition-all hover:bg-vigil-accent/90"
          >
            Home
          </Link>
          <Link
            href="/claim"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/10"
          >
            File Claim
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/10"
          >
            Admin
          </Link>
        </nav>
      </main>
    </div>
  );
}
