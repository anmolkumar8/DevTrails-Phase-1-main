"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
        <section className="max-w-2xl">
          <p className="text-sm font-medium text-vigil-accent">
            Parametric Micro-Insurance for the Gig Economy
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Verified Intelligence for{" "}
            <span className="text-vigil-accent">Gig Insurance</span> Legitimacy
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Instant, trigger-based payouts for delivery partners, ride-hail
            drivers, and couriers when adverse weather strikes. No lengthy claims
            process — the Behavioral Trust Engine validates authenticity in
            real-time.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/claim"
              className="inline-flex items-center justify-center rounded-lg bg-vigil-accent px-6 py-3 text-base font-medium text-slate-950 shadow-lg shadow-vigil-accent/20 transition-all hover:bg-vigil-accent/90 focus:outline-none focus:ring-2 focus:ring-vigil-accent focus:ring-offset-2 focus:ring-offset-[#0a0e17]"
            >
              File a Claim
            </Link>
          </div>
        </section>

        <section className="mt-20 md:mt-32">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Core Capabilities
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="9-Signal Fusion"
              description="IMU, cell tower, Wi-Fi probe, battery drain — GPS alone is never trusted. The BTE fuses passive device signals for trust scoring."
              icon="⊕"
            />
            <FeatureCard
              title="Syndicate Breaker"
              description="Temporal clustering and device fingerprint graphs detect coordinated fraud. 500-person syndicates become trivially detectable."
              icon="◉"
            />
            <FeatureCard
              title="Asymmetric Leniency"
              description="Honest workers get benefit of doubt. Three-tier payout: instant, 50% provisional, or escrow — never penalize for single flags."
              icon="◇"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Card
      variant="default"
      className="group p-6 transition-all duration-200 hover:border-white/10 hover:bg-slate-900/70"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vigil-accent/10 text-lg text-vigil-accent">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </Card>
  );
}
