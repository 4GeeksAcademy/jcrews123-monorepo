from __future__ import annotations

import logging
import sys
from pathlib import Path

from dotenv import load_dotenv

_API_DIR = Path(__file__).resolve().parent
load_dotenv(_API_DIR / ".env", override=True)

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

_REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(_REPO_ROOT / "packages" / "incident-analysis"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from routers.auth import router as auth_router  # noqa: E402
from routers.incidents import router as incidents_router  # noqa: E402
from routers.inventory import router as inventory_router  # noqa: E402
from routers.profiles import router as profiles_router  # noqa: E402
from routers.suppliers import router as suppliers_router  # noqa: E402
from routers.users import router as users_router  # noqa: E402

app = FastAPI(
    title="Brasaland Digital API",
    description="Backend services for Brasaland Digital monorepo",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(profiles_router)
app.include_router(incidents_router)
app.include_router(suppliers_router)
app.include_router(inventory_router)


@app.on_event("startup")
def log_startup_config() -> None:
    from core.email_config import get_resend_api_key, get_resend_from_email
    from db.postgres import create_inventory_tables

    create_inventory_tables()
    startup_logger = logging.getLogger("brasaland.api")
    startup_logger.info(
        "Resend email configured: %s (from=%s)",
        bool(get_resend_api_key()),
        get_resend_from_email(),
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
