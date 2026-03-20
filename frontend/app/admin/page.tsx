"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/Card";
import Badge from "@/components/Badge";

interface Claim {
  claim_id: string;
  worker_id: string;
  claimed_at: string;
  lat: number;
  lon: number;
  trust_score: number;
  tier: string;
  device_fp?: string;
}

interface SyndicateInsights {
  total_claims: number;
  clusters: { size: number; window_seconds: number; workers: string[] }[];
  staggered_triggers?: { workers: string[]; spacing_minutes: number }[];
  behavioral_baseline_flags?: { worker_id: string; claim_count: number; pattern: string }[];
  suspicious_fingerprints: Record<string, number>;
  ssi_risk: number;
  device_fingerprints: Record<string, number>;
}

export default function AdminPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [insights, setInsights] = useState<SyndicateInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const consentAccepted =
          typeof window !== "undefined" &&
          localStorage.getItem("vigil_dpdp_consent") === "accepted";
        const headers = {
          ...(consentAccepted ? { "x-vigil-consent": "accepted" } : {}),
        };
        const [cRes, iRes] = await Promise.all([
          fetch("/api/claims/recent", { headers }),
          fetch("/api/syndicate/insights", { headers }),
        ]);
        const cData = await cRes.json();
        const iData = await iRes.json();
        setClaims(cData.claims || []);
        setInsights(iData);
      } catch {
        setClaims([]);
        setInsights(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Syndicate Detection
          </h1>
          <p className="mt-1 text-slate-500">
            Temporal clustering and device fingerprint analysis
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-vigil-accent/30 border-t-vigil-accent" />
              <p className="text-sm text-slate-500">Loading insights…</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {insights && (
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard
                  label="Total Claims (30m)"
                  value={insights.total_claims}
                />
                <MetricCard
                  label="Clusters Detected"
                  value={insights.clusters?.length ?? 0}
                  highlight={insights.clusters && insights.clusters.length > 0}
                />
                <MetricCard
                  label="Suspicious Fingerprints"
                  value={
                    Object.keys(insights.suspicious_fingerprints || {}).length
                  }
                  highlight={
                    Object.keys(insights.suspicious_fingerprints || {}).length >
                    0
                  }
                />
                <MetricCard
                  label="SSI Risk"
                  value={`${((insights.ssi_risk ?? 0) * 100).toFixed(0)}%`}
                  highlight={(insights.ssi_risk ?? 0) > 0.5}
                />
              </div>
            )}

            {insights?.clusters && insights.clusters.length > 0 && (
              <Card variant="default" className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-amber-400">
                    Temporal Clusters
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Claims within 90 seconds — potential syndicate coordination
                  </p>
                  <ul className="mt-4 space-y-2">
                    {insights.clusters.map((c, i) => (
                      <li
                        key={i}
                        className="rounded-lg bg-white/5 px-3 py-2 font-mono text-sm"
                      >
                        Cluster {i + 1}: {c.size} claims —{" "}
                        {c.workers.slice(0, 5).join(", ")}
                        {c.workers.length > 5 && " …"}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {insights?.staggered_triggers && insights.staggered_triggers.length > 0 && (
              <Card variant="default" className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-amber-400">
                    Staggered Triggers
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Claims ~30 min apart — syndicate evading burst detection
                  </p>
                  <ul className="mt-4 space-y-2">
                    {insights.staggered_triggers.map((s, i) => (
                      <li key={i} className="rounded-lg bg-white/5 px-3 py-2 font-mono text-sm">
                        {s.workers.join(", ")} — spacing {s.spacing_minutes} min
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {insights?.behavioral_baseline_flags && insights.behavioral_baseline_flags.length > 0 && (
              <Card variant="default" className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-red-400">
                    Behavioral Baseline Flags
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Repeated at-home claim patterns over time
                  </p>
                  <ul className="mt-4 space-y-2">
                    {insights.behavioral_baseline_flags.map((b, i) => (
                      <li key={i} className="rounded-lg bg-white/5 px-3 py-2 font-mono text-sm">
                        {b.worker_id}: {b.claim_count} claims — {b.pattern}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card variant="default">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-white">
                  Recent Claims
                </h3>
                {claims.length === 0 ? (
                  <p className="mt-6 text-sm text-slate-500">
                    No claims yet. File a claim from the worker dashboard.
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-white/5">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            Claim ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            Worker
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            Trust
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            Tier
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            Device FP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {claims.map((c) => (
                          <tr
                            key={c.claim_id}
                            className="transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-slate-400">
                              {c.claim_id}
                            </td>
                            <td className="px-4 py-3 text-slate-300">
                              {c.worker_id}
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {new Date(c.claimed_at).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  c.trust_score >= 70
                                    ? "text-emerald-400"
                                    : c.trust_score >= 40
                                    ? "text-amber-400"
                                    : "text-red-400"
                                }
                              >
                                {c.trust_score}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  c.tier === "instant"
                                    ? "success"
                                    : c.tier === "provisional"
                                    ? "warning"
                                    : "error"
                                }
                              >
                                {c.tier}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">
                              {c.device_fp || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <Card
      variant="default"
      className={`p-5 transition-colors ${
        highlight
          ? "border-amber-500/30 bg-amber-500/5"
          : "hover:border-white/10"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold tabular-nums ${
          highlight ? "text-amber-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}
