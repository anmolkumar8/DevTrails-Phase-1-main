"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "vigil_dpdp_consent";

export default function DPDPBanner() {
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    setDismissed(localStorage.getItem(CONSENT_KEY) === "accepted");
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-900/95 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          VIGIL collects device signals (IMU, network, battery) for fraud
          detection. By continuing, you agree to our data practices under{" "}
          <strong className="text-white">DPDP Act 2023</strong>. We minimize
          data collection.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={accept}
            className="rounded-lg bg-vigil-accent px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-vigil-accent/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
