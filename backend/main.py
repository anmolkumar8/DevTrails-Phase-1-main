"""
VIGIL — FastAPI Backend
Behavioral Trust Engine, Weather Oracle, Claim Validator
"""

from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import claims, weather, signals, syndicate
from services.persistence import load_persisted_claims

# In-memory stores for prototype (replace with DB/graph store in production)
claim_store: list[dict] = load_persisted_claims(limit=500)
signal_packet_store: list[dict] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.claim_store = claim_store
    app.state.signal_packet_store = signal_packet_store
    yield


app = FastAPI(
    title="VIGIL API",
    description="Verified Intelligence for Gig Insurance Legitimacy",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(claims.router, prefix="/api/claims", tags=["Claims"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(signals.router, prefix="/api/signals", tags=["Signals"])
app.include_router(syndicate.router, prefix="/api/syndicate", tags=["Syndicate"])


@app.get("/")
def root():
    return {
        "name": "VIGIL API",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/health")
def health():
    return {"status": "ok"}
