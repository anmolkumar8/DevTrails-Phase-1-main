"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Card, CardHeader, CardContent } from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Badge from "@/components/Badge";

type Tier = "instant" | "provisional" | "escrow";

interface ClaimResult {
  claim_id: string;
  trust_score: number;
  tier: Tier;
  payout_amount: number;
  payout_status: string;
  payout_ref: string;
  remaining_amount: number;
  payout_eta_seconds: number;
  payout_message: string;
  weather_verified: boolean;
  weather_condition: string;
  breakdown: Record<string, number>;
  syndicate_suspicion_index: number;
}

const PRESETS = {
  genuine: {
    label: "Genuine Worker",
    desc: "In storm, active delivery",
    signals: {
      lat: 12.97,
      lon: 77.59,
      accelerometer_variance: 0.15,
      gyroscope_rotation_events: 12,
      step_count_delta: 45,
      cell_tower_handoff_count: 3,
      wifi_home_ssid_detected: false,
      signal_strength_variance: 0.12,
      app_foreground: true,
      battery_drain_rate: 0.08,
      screen_interaction_count: 15,
      has_active_order: true,
      last_order_minutes_ago: 8,
    },
  },
  spoofer: {
    label: "Home Spoofer",
    desc: "At home with spoof app",
    signals: {
      lat: 12.97,
      lon: 77.59,
      accelerometer_variance: 0.002,
      gyroscope_rotation_events: 0,
      step_count_delta: 0,
      cell_tower_handoff_count: 0,
      wifi_home_ssid_detected: true,
      signal_strength_variance: 0.02,
      app_foreground: false,
      battery_drain_rate: 0.01,
      screen_interaction_count: 2,
      has_active_order: false,
      last_order_minutes_ago: 180,
    },
  },
  syndicate: {
    label: "Syndicate Actor",
    desc: "Coordinated mass trigger",
    signals: {
      lat: 12.97,
      lon: 77.59,
      accelerometer_variance: 0.003,
      gyroscope_rotation_events: 0,
      step_count_delta: 0,
      cell_tower_handoff_count: 0,
      wifi_home_ssid_detected: true,
      signal_strength_variance: 0.01,
      app_foreground: false,
      battery_drain_rate: 0.005,
      screen_interaction_count: 0,
      has_active_order: false,
      last_order_minutes_ago: 240,
    },
  },
};

export default function ClaimPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preset, setPreset] = useState<keyof typeof PRESETS>("genuine");
  const [signals, setSignals] = useState(PRESETS.genuine.signals);
  const [upiHandle, setUpiHandle] = useState<string>("");

  const applyPreset = (p: keyof typeof PRESETS) => {
    setPreset(p);
    setSignals(PRESETS[p].signals);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const consentAccepted =
        typeof window !== "undefined" &&
        localStorage.getItem("vigil_dpdp_consent") === "accepted";
      // 1) Ingest device signals (real mobile SDK would do this)
      const ingestRes = await fetch("/api/signals/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(consentAccepted ? { "x-vigil-consent": "accepted" } : {}),
        },
        body: JSON.stringify({
          worker_id: "worker_demo",
          upi_handle: upiHandle || null,
          signals: signals,
        }),
      });
      const ingestData = await ingestRes.json().catch(() => ({}));
      if (!ingestRes.ok) {
        if (ingestRes.status === 403)
          throw new Error(ingestData.detail || "DPDP consent required");
        throw new Error(ingestData.detail || "Signal ingest failed");
      }
      const packetId = ingestData.packet_id;
      if (!packetId) throw new Error("Signal ingest failed (missing packet id)");

      // 2) Submit claim referencing the ingested packet
      const res = await fetch("/api/claims/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(consentAccepted ? { "x-vigil-consent": "accepted" } : {}),
        },
        body: JSON.stringify({
          worker_id: "worker_demo",
          signal_packet_id: packetId,
          lat: signals.lat,
          lon: signals.lon,
          upi_handle: upiHandle || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 403) throw new Error(data.detail || "DPDP consent required");
        if (res.status === 502 || res.status === 503)
          throw new Error("Backend unavailable");
        throw new Error(data.detail || "Request failed");
      }

      setResult(data as ClaimResult);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      const isBackendDown =
        msg === "Failed to fetch" ||
        msg.includes("NetworkError") ||
        msg === "Backend unavailable";
      setError(
        isBackendDown
          ? "Backend unavailable. Run: npm run dev (from project root)."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  // Poll claim status for provisional / escrow while it completes (demo lifecycle).
  useEffect(() => {
    if (!result) return;
    if (result.tier === "instant") return;

    let interval: any = null;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const consentAccepted =
          typeof window !== "undefined" &&
          localStorage.getItem("vigil_dpdp_consent") === "accepted";
        const res = await fetch(`/api/claims/${result.claim_id}`, {
          headers: {
            ...(consentAccepted ? { "x-vigil-consent": "accepted" } : {}),
          },
        });
        if (!res.ok) return;
        const status = await res.json();
        setResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            payout_status: status.payout_status ?? prev.payout_status,
            remaining_amount:
              typeof status.remaining_amount === "number"
                ? status.remaining_amount
                : prev.remaining_amount,
            payout_eta_seconds:
              typeof status.payout_eta_seconds === "number"
                ? status.payout_eta_seconds
                : prev.payout_eta_seconds,
            payout_amount:
              typeof status.payout_amount_now_sent === "number"
                ? status.payout_amount_now_sent
                : prev.payout_amount,
          };
        });
      } catch {
        // Ignore polling failures; user can refresh
      }
    };

    interval = setInterval(poll, 2000);
    // Poll for a limited time to avoid endless intervals.
    const stop = setTimeout(() => {
      if (interval) clearInterval(interval);
    }, 45000);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      clearTimeout(stop);
    };
  }, [result?.claim_id, result?.tier]);

  return (
    <div className="min-h-screen gradient-mesh">
      <Header variant="minimal" />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            File Weather Claim
          </h1>
          <p className="mt-1 text-slate-500">
            The BTE evaluates 9 passive signals. Select a preset to simulate
            different claim scenarios.
          </p>
        </div>

        <Card variant="default" className="mb-6">
          <CardHeader
            title="Claim scenario"
            subtitle="Choose a behavioral archetype"
          />
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    preset === p
                      ? "border-vigil-accent/50 bg-vigil-accent/10 text-vigil-accent"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {PRESETS[p].label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="mb-6">
          <CardHeader title="Location" subtitle="Coordinates at claim time" />
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.01"
                value={signals.lat}
                onChange={(e) =>
                  setSignals({ ...signals, lat: parseFloat(e.target.value) })
                }
              />
              <Input
                label="Longitude"
                type="number"
                step="0.01"
                value={signals.lon}
                onChange={(e) =>
                  setSignals({ ...signals, lon: parseFloat(e.target.value) })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="default" className="mb-6">
          <CardHeader
            title="UPI Handle (optional)"
            subtitle="Used only if you configure real Razorpay payouts"
          />
          <CardContent>
            <Input
              label="Your UPI ID"
              placeholder="e.g. name@bank"
              value={upiHandle}
              onChange={(e) => setUpiHandle(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={submit}
            isLoading={loading}
            disabled={loading}
            size="lg"
          >
            Submit Claim
          </Button>
        </div>

        {error && (
          <Card
            variant="bordered"
            className="mt-6 animate-fade-in border-red-500/20 bg-red-500/5"
          >
            <CardContent>
              <p className="text-sm text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && <ClaimResultCard result={result} />}
      </main>
    </div>
  );
}

function ClaimResultCard({ result }: { result: ClaimResult }) {
  const tierConfig = {
    instant: { label: "Instant Approval", variant: "success" as const },
    provisional: {
      label: "Provisional Payout",
      variant: "warning" as const,
    },
    escrow: { label: "Escrow Hold", variant: "error" as const },
  };
  const config = tierConfig[result.tier];

  return (
    <Card variant="elevated" className="mt-10 animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-slate-500">{result.claim_id}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Claim Result
            </h2>
            <Badge variant={config.variant} className="mt-2">
              {config.label}
            </Badge>
            <p className="mt-4 max-w-md text-sm text-slate-500">
              {result.payout_message}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const status = result.payout_status;
                  const variant =
                    status === "approved_instant" || status === "completed" || status === "released_after_review"
                      ? "success"
                      : status === "provisional_sent" || status === "escrow_held"
                      ? "warning"
                      : status === "rejected_after_review" || status === "rejected_no_adverse_weather"
                      ? "error"
                      : "neutral";

                  const label =
                    status === "approved_instant"
                      ? "Payout Sent"
                      : status === "provisional_sent"
                      ? "Provisional Sent"
                      : status === "completed"
                      ? "Payout Completed"
                      : status === "escrow_held"
                      ? "Escrow Review"
                      : status === "released_after_review"
                      ? "Escrow Released"
                      : status === "rejected_after_review"
                      ? "Review Rejected"
                      : status === "rejected_no_adverse_weather"
                      ? "No Adverse Weather"
                      : "Processing";

                  return (
                    <Badge variant={variant as any}>
                      {label}
                    </Badge>
                  );
                })()}

                {result.payout_eta_seconds > 0 &&
                  (result.payout_status === "provisional_sent" || result.payout_status === "escrow_held") && (
                    <span className="text-xs text-slate-500">
                      ETA: ~{result.payout_eta_seconds}s
                    </span>
                  )}
              </div>

              {result.remaining_amount > 0 &&
                (result.payout_status === "provisional_sent" || result.payout_status === "escrow_held") && (
                  <p className="text-sm text-slate-500">
                    Remaining: ₹{result.remaining_amount}
                  </p>
                )}

              {result.payout_ref && (
                <p className="text-xs font-mono text-slate-500">
                  Ref: {result.payout_ref}
                </p>
              )}
            </div>
            {result.weather_verified ? (
              <p className="mt-2 text-sm text-emerald-400">
                Weather verified: {result.weather_condition}
              </p>
            ) : (
              <p className="mt-2 text-sm text-amber-400">
                No adverse weather at location
              </p>
            )}
          </div>
          <TrustScoreCircle score={result.trust_score} />
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Signal Breakdown
          </h4>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Object.entries(result.breakdown).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-vigil-accent/80 transition-all duration-500"
                    style={{ width: `${v * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-500">{k}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs text-slate-500">
            Syndicate Suspicion Index:{" "}
            {result.syndicate_suspicion_index.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TrustScoreCircle({ score }: { score: number }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative flex-shrink-0">
      <svg
        className="h-28 w-28 -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}
