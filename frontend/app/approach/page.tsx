"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Card } from "@/components/Card";

export default function ApproachPage() {
  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <div className="mb-16">
          <p className="text-sm font-medium text-vigil-accent">
            Our Anti-Fraud Strategy
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            How VIGIL Protects the Honest & Catches the Bad Actor
          </h1>
          <p className="mt-4 text-slate-500">
            Three pillars that make GPS spoofing economically and technically
            infeasible while never unfairly penalizing genuine workers.
          </p>
        </div>

        {/* 1. The Differentiation */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vigil-accent/15 text-sm font-bold text-vigil-accent">
              1
            </span>
            <h2 className="text-xl font-semibold text-white">
              The Differentiation
            </h2>
          </div>
          <p className="mb-4 text-base leading-relaxed text-slate-400">
            <strong className="text-white">The core insight:</strong> A GPS
            spoofing application can forge coordinates. It{" "}
            <strong className="text-white">cannot simultaneously forge</strong>{" "}
            the physical, contextual, and network-level reality of a person
            actually riding a vehicle through a storm. VIGIL does not trust any
            single signal — it trusts the <em>convergence</em> of all of them.
          </p>
          <Card variant="default" className="mb-6 p-6">
            <h3 className="text-sm font-semibold text-white">
              Behavioral Trust Engine (BTE)
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              A Multi-Modal Fusion Classifier that produces a Trust Score (0–100)
              for every claim. Trained on three archetypes:
            </p>
            <div className="mt-6 space-y-4">
              <ArchetypeRow
                type="genuine"
                title="Genuine Worker"
                desc="Riding in storm, intermittent connectivity"
                signals="Motion detected, cell tower churn, GPS drift consistent with movement, app heartbeat irregular"
              />
              <ArchetypeRow
                type="spoofer"
                title="Home Spoofer"
                desc="Sitting at home, running spoof app"
                signals="Sedentary IMU, stable home Wi‑Fi, cell tower locked, battery normal, app heartbeat perfect"
              />
              <ArchetypeRow
                type="syndicate"
                title="Syndicate Actor"
                desc="Coordinated mass trigger"
                signals="Temporal clustering of claims, identical device fingerprints, unnatural claim synchronization"
              />
            </div>
          </Card>
          <Card variant="bordered" className="border-amber-500/20 bg-amber-500/5 p-6">
            <h4 className="text-sm font-semibold text-amber-400">
              The &quot;Impossible Combination&quot; Rule
            </h4>
            <p className="mt-2 text-sm text-slate-400">
              Any claim where two or more of these are simultaneously true is
              escalated to Tier-2 review, regardless of Trust Score:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>
                • Spoofed GPS in red-alert zone{" "}
                <span className="text-slate-400">AND</span> device on known
                residential Wi‑Fi
              </li>
              <li>
                • Spoofed movement{" "}
                <span className="text-slate-400">AND</span> accelerometer reads
                near-zero variance (stationary)
              </li>
              <li>
                • Claim triggered{" "}
                <span className="text-slate-400">AND</span> cell tower
                triangulation places device &gt;2 km from claimed GPS
              </li>
            </ul>
          </Card>
        </section>

        {/* 2. The Data */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vigil-accent/15 text-sm font-bold text-vigil-accent">
              2
            </span>
            <h2 className="text-xl font-semibold text-white">The Data</h2>
          </div>
          <p className="mb-6 text-base leading-relaxed text-slate-400">
            Beyond basic GPS, VIGIL passively collects nine signal layers at
            claim time. All collection is disclosed in onboarding and operates
            within DPDP Act 2023 compliance.
          </p>
          <div className="space-y-4">
            <DataLayer
              layer="Layer 1: IMU Signals"
              items={[
                "Accelerometer variance (5 min before claim) — riders show vibration from road, wind, braking; at-rest shows flat variance",
                "Gyroscope rotation events — vehicle turns; absent when stationary",
                "Step counter delta — zero steps in 30 min ≠ walking through flooded street",
              ]}
            />
            <DataLayer
              layer="Layer 2: Network & Cell"
              items={[
                "Cell tower ID sequence — movement = handoffs; at home = locked to one tower",
                "Wi‑Fi SSID probe list — home SSID in probe list = strong at-home indicator",
                "Signal strength variance — movement = fluctuating RSSI; static = stable",
              ]}
            />
            <DataLayer
              layer="Layer 3: Device Context"
              items={[
                "App foreground/background — genuine worker has order app active; fraud actor has spoof app",
                "Battery drain rate (15 min) — active delivery drains battery; plugged-in spoof device = low drain",
                "Screen interaction pattern — delivery workers tap constantly; fraud actors show zero or inconsistent interaction",
              ]}
            />
            <DataLayer
              layer="Layer 4: Order Platform Cross-Validation"
              items={[
                "Last order completion — actively fulfilling in last 20 min vs idle 3 hours?",
                "Active order at claim time — genuine stranded worker has live order; fraud actor does not",
              ]}
            />
            <DataLayer
              layer="Layer 5: Syndicate Graph Detection (The Ring-Breaker)"
              items={[
                "Temporal Claim Clustering — N ≥ 10 claims within 90 seconds in same city = Syndicate Suspicion Index spike",
                "Device Fingerprint Graph — OS, screen, battery, sensor signatures; same toolkit = clustering",
                "Behavioral Correlation Matrix — 50 workers with identical Trust components = astronomically unlikely naturally",
                "Historical Network Analysis — device ever linked to flagged account (Wi‑Fi, Bluetooth, referral) = elevated suspicion",
              ]}
            />
          </div>
        </section>

        {/* 3. The UX Balance */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vigil-accent/15 text-sm font-bold text-vigil-accent">
              3
            </span>
            <h2 className="text-xl font-semibold text-white">
              The UX Balance
            </h2>
          </div>
          <p className="mb-6 text-base leading-relaxed text-slate-400">
            <strong className="text-white">The cardinal rule:</strong> The system
            must never punish an honest worker. A genuine partner in a storm
            with poor connectivity will naturally produce some anomalous
            signals — GPS drift, irregular app heartbeat, missing cell data. The
            system is asymmetrically lenient toward false positives.
          </p>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <TierCard
              tier="Instant"
              score="70–100"
              icon="✓"
              color="emerald"
              title="Full payout immediately"
              desc="No friction. Standard receipt. Covers the vast majority of genuine claims."
            />
            <TierCard
              tier="Provisional"
              score="40–69"
              icon="~"
              color="amber"
              title="50% now, 50% in 4 hours"
              desc="Worker gets half immediately. Transparent message. No action needed. Remaining released after automated review — or with benefit of doubt if inconclusive."
            />
            <TierCard
              tier="Escrow"
              score="0–39"
              icon="!"
              color="red"
              title="Hold for review"
              desc="Triggered only by multiple Impossible Combinations or high SSI. Optional photo/video to speed up. If no fraud evidence, full payout."
            />
          </div>

          <div className="space-y-6">
            <Card variant="default" className="p-6">
              <h4 className="text-sm font-semibold text-white">
                Workers are never penalized for a single flag
              </h4>
              <p className="mt-2 text-sm text-slate-500">
                Permanent trust reduction requires three confirmed fraud flags,
                each independently verified.
              </p>
            </Card>

            <Card variant="default" className="border-vigil-accent/20 bg-vigil-accent/5 p-6">
              <h4 className="text-sm font-semibold text-vigil-accent">
                Network Drop Accommodation
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                Bad weather degrades the signals we rely on. The BTE is trained
                specifically on{" "}
                <strong className="text-white">
                  storm-condition device behavior
                </strong>
                — GPS drift, intermittent cell loss, and irregular app heartbeat
                are <em>expected</em> in genuine claims and are weighted
                accordingly. We do not penalize signal degradation consistent
                with the claimed weather.
              </p>
            </Card>

            <Card variant="default" className="border-emerald-500/20 bg-emerald-500/5 p-6">
              <h4 className="text-sm font-semibold text-emerald-400">
                Reputation Shield (Veteran Workers)
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                6+ months of clean history earns: Trust Score floor of 50 (never
                auto-rejected); Tier-3 escalations reviewed by human within 30
                minutes; one-time &quot;benefit of the doubt&quot; override per
                quarter via in-app appeal.
              </p>
            </Card>
          </div>
        </section>

        {/* 4. Why This Works Against the 500-Person Syndicate */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vigil-accent/15 text-sm font-bold text-vigil-accent">
              4
            </span>
            <h2 className="text-xl font-semibold text-white">
              Why This Works Against the 500-Person Syndicate
            </h2>
          </div>
          <p className="mb-6 text-base leading-relaxed text-slate-400">
            Organized fraud coordinated via Telegram. Here is exactly where each
            layer of VIGIL breaks them:
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-4 py-3 text-left font-medium text-slate-400">
                    Syndicate Tactic
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-vigil-accent">
                    VIGIL Counter
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <SyndicateRow
                  tactic="GPS spoofing app running on phone"
                  counter="IMU shows no motion; cell tower doesn't match; Wi‑Fi probe shows home network"
                />
                <SyndicateRow
                  tactic="All trigger claims simultaneously"
                  counter="SSI spike detected; temporal clustering flags entire batch"
                />
                <SyndicateRow
                  tactic="Using the same spoofing toolkit"
                  counter="Device fingerprint graph clusters them together"
                />
                <SyndicateRow
                  tactic="Individual scores might pass"
                  counter="Ring-level detection catches what individual scoring misses"
                />
                <SyndicateRow
                  tactic="Recruited new accounts to avoid history flags"
                  counter="New account + no active orders + sedentary + home Wi‑Fi = instant Tier 3"
                />
                <SyndicateRow
                  tactic="Waiting 30 mins between triggers to stagger"
                  counter="Behavioral baseline analysis catches repeated at-home claim patterns over time"
                />
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/claim"
            className="inline-flex items-center justify-center rounded-lg bg-vigil-accent px-6 py-3 text-sm font-medium text-slate-950 transition-all hover:bg-vigil-accent/90"
          >
            File a Claim
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition-all hover:bg-white/10"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

function SyndicateRow({
  tactic,
  counter,
}: {
  tactic: string;
  counter: string;
}) {
  return (
    <tr className="transition-colors hover:bg-white/[0.02]">
      <td className="px-4 py-3 text-slate-300">{tactic}</td>
      <td className="px-4 py-3 text-slate-500">{counter}</td>
    </tr>
  );
}

function ArchetypeRow({
  type,
  title,
  desc,
  signals,
}: {
  type: "genuine" | "spoofer" | "syndicate";
  title: string;
  desc: string;
  signals: string;
}) {
  const config = {
    genuine: { icon: "✓", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    spoofer: { icon: "✗", color: "text-red-400", bg: "bg-red-500/10" },
    syndicate: { icon: "!", color: "text-amber-400", bg: "bg-amber-500/10" },
  }[type];

  return (
    <div className="rounded-lg border border-white/5 bg-white/5 p-4">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded ${config.bg} text-xs font-bold ${config.color}`}
        >
          {config.icon}
        </span>
        <span className="font-medium text-white">{title}</span>
        <span className="text-slate-500">— {desc}</span>
      </div>
      <p className="mt-2 pl-8 text-xs text-slate-500">{signals}</p>
    </div>
  );
}

function DataLayer({
  layer,
  items,
}: {
  layer: string;
  items: string[];
}) {
  return (
    <Card variant="default" className="p-6">
      <h4 className="text-sm font-semibold text-vigil-accent">{layer}</h4>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-500">
            • {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function TierCard({
  tier,
  score,
  icon,
  color,
  title,
  desc,
}: {
  tier: string;
  score: string;
  icon: string;
  color: "emerald" | "amber" | "red";
  title: string;
  desc: string;
}) {
  const colors = {
    emerald:
      "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    red: "border-red-500/20 bg-red-500/5 text-red-400",
  }[color];

  return (
    <Card
      variant="bordered"
      className={`p-5 ${colors}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{icon}</span>
        <span className="font-semibold">{tier}</span>
        <span className="text-xs opacity-80">({score})</span>
      </div>
      <h5 className="mt-3 text-sm font-medium text-white">{title}</h5>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </Card>
  );
}
