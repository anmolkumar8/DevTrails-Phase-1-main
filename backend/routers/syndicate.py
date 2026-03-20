"""
Syndicate detection API — temporal clustering, device fingerprint graph,
staggered trigger detection, behavioral baseline
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Request
from routers.deps import require_dpdp_consent

router = APIRouter()


def _parse_claimed_at(c: dict) -> datetime:
    return datetime.fromisoformat(c.get("claimed_at", "")) if c.get("claimed_at") else datetime.min


@router.get("/insights")
def syndicate_insights(request: Request, window_minutes: int = 30):
    """Detect claim clustering, staggered triggers, behavioral baseline."""
    require_dpdp_consent(request)
    store = getattr(request.app.state, "claim_store", [])
    if not store:
        return {
            "total_claims": 0,
            "clusters": [],
            "staggered_triggers": [],
            "behavioral_baseline_flags": [],
            "ssi_risk": 0,
            "device_fingerprints": {},
        }

    cutoff = datetime.utcnow() - timedelta(minutes=window_minutes)
    recent = sorted(
        [c for c in store if _parse_claimed_at(c) > cutoff],
        key=_parse_claimed_at,
    )

    # 1. Temporal clustering: claims within 90 seconds
    clusters = []
    used = set()
    for i, c in enumerate(recent):
        if i in used:
            continue
        t = _parse_claimed_at(c)
        cluster = [c]
        used.add(i)
        for j, d in enumerate(recent):
            if j in used:
                continue
            td = _parse_claimed_at(d)
            if abs((t - td).total_seconds()) <= 90:
                cluster.append(d)
                used.add(j)
        if len(cluster) >= 3:
            clusters.append({
                "size": len(cluster),
                "window_seconds": 90,
                "workers": list({x.get("worker_id", "") for x in cluster}),
                "device_fingerprints": list({x.get("device_fp", "unknown") for x in cluster}),
            })

    # 2. Staggered trigger detection: claims ~30 mins apart (syndicate evading burst detection)
    staggered = []
    for i in range(len(recent) - 2):
        t0 = _parse_claimed_at(recent[i])
        t1 = _parse_claimed_at(recent[i + 1])
        t2 = _parse_claimed_at(recent[i + 2])
        d1 = abs((t1 - t0).total_seconds() - 30 * 60)  # ~30 min
        d2 = abs((t2 - t1).total_seconds() - 30 * 60)
        if d1 < 5 * 60 and d2 < 5 * 60:  # within 5 min of 30-min spacing
            low_trust = [
                recent[i].get("trust_score", 100) < 50,
                recent[i + 1].get("trust_score", 100) < 50,
                recent[i + 2].get("trust_score", 100) < 50,
            ]
            if all(low_trust):
                staggered.append({
                    "workers": [recent[i].get("worker_id"), recent[i + 1].get("worker_id"), recent[i + 2].get("worker_id")],
                    "spacing_minutes": 30,
                })

    # 3. Behavioral baseline: workers with repeated at-home-like claims over time
    worker_claims = {}
    for c in store:
        wid = c.get("worker_id", "")
        if wid not in worker_claims:
            worker_claims[wid] = []
        worker_claims[wid].append(c)
    baseline_flags = []
    for wid, claims in worker_claims.items():
        if len(claims) < 2:
            continue
        at_home_like = sum(
            1 for c in claims
            if c.get("trust_score", 100) < 50  # low trust = likely sedentary
        )
        if at_home_like >= 2 and at_home_like == len(claims):
            baseline_flags.append({
                "worker_id": wid,
                "claim_count": len(claims),
                "pattern": "repeated_at_home_claim_pattern",
            })

    # Device fingerprint frequency
    fps = {}
    for c in recent:
        fp = c.get("device_fp", "unknown")
        fps[fp] = fps.get(fp, 0) + 1
    suspicious_fps = {k: v for k, v in fps.items() if v >= 3}

    # Graph: co-occurrence edges between device_fingerprint nodes
    edge_weights: dict[tuple[str, str], int] = {}
    for cl in clusters:
        fps_in_cluster = cl.get("device_fingerprints", [])
        uniq = sorted(set(fps_in_cluster))
        for i in range(len(uniq)):
            for j in range(i + 1, len(uniq)):
                a = uniq[i]
                b = uniq[j]
                edge_weights[(a, b)] = edge_weights.get((a, b), 0) + 1

    edges = [
        {"from": a, "to": b, "weight": w}
        for (a, b), w in sorted(edge_weights.items(), key=lambda kv: kv[1], reverse=True)[:20]
    ]
    nodes = sorted(set(fps.keys()))

    ssi_risk = min(
        1.0,
        len(clusters) * 0.3
        + len(suspicious_fps) * 0.2
        + len(staggered) * 0.2
        + len(baseline_flags) * 0.15,
    )

    return {
        "total_claims": len(recent),
        "clusters": clusters,
        "staggered_triggers": staggered,
        "behavioral_baseline_flags": baseline_flags,
        "suspicious_fingerprints": suspicious_fps,
        "ssi_risk": round(ssi_risk, 2),
        "device_fingerprints": dict(list(fps.items())[:20]),
        "graph": {"nodes": nodes, "edges": edges},
    }
