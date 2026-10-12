from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from time import monotonic
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import ValidationError
from sqlmodel import Session

from analysis import (
    api_latency_by_day,
    auth_failure_rate_by_day,
    error_rate_by_day,
    events_per_day_by_type,
)
from core.deps import get_current_user, get_db
from db.postgres import get_engine
from schemas.telemetry import TelemetryBatch, TelemetryEvent
from telemetry.contracts import SCHEMA_VERSION, validate_properties
from telemetry.store import store_events

router = APIRouter(prefix="/telemetry", tags=["telemetry"])
logger = logging.getLogger("brasaland.telemetry")
CACHE_TTL_SECONDS = 60
_report_cache: dict[tuple[str, str], tuple[float, dict]] = {}


@router.post("/events")
def receive_events(
    batch: TelemetryBatch,
    session: Annotated[Session, Depends(get_db)],
) -> dict[str, int]:
    valid: list[TelemetryEvent] = []
    rejected = 0

    for raw_event in batch.events:
        try:
            event = TelemetryEvent.model_validate(raw_event)
            if event.schemaVersion != SCHEMA_VERSION:
                raise ValueError("Unsupported schemaVersion")
            validate_properties(event.event_type, event.properties)
            valid.append(event)
        except (ValidationError, ValueError, TypeError):
            rejected += 1

    logger.info(
        "Telemetry batch received=%d valid=%d rejected=%d event_types=%s",
        len(batch.events),
        len(valid),
        rejected,
        [event.event_type for event in valid],
    )
    stored = store_events(session, valid)
    return {"received": len(batch.events), "stored": stored, "rejected": rejected}


def _utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


@router.get("/report")
def telemetry_report(
    current_user: Annotated[dict, Depends(get_current_user)],
    start_date: Annotated[datetime | None, Query()] = None,
    end_date: Annotated[datetime | None, Query()] = None,
) -> dict:
    _ = current_user
    resolved_end = _utc(end_date) if end_date else datetime.now(timezone.utc)
    resolved_start = (
        _utc(start_date) if start_date else resolved_end - timedelta(days=7)
    )
    if resolved_start >= resolved_end:
        raise HTTPException(
            status_code=422, detail="start_date must be earlier than end_date."
        )

    period = (resolved_start.isoformat(), resolved_end.isoformat())
    key = (
        ("__default_7_days__", "__default_7_days__")
        if start_date is None and end_date is None
        else period
    )
    now = monotonic()
    cached = _report_cache.get(key)
    if cached and now - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    expired = [
        cache_key
        for cache_key, (created_at, _) in _report_cache.items()
        if now - created_at >= CACHE_TTL_SECONDS
    ]
    for cache_key in expired:
        _report_cache.pop(cache_key, None)

    engine = get_engine()
    report = {
        "period": {"from": period[0], "to": period[1]},
        "metrics": {
            "events_per_day": events_per_day_by_type(
                resolved_start, resolved_end, engine
            ),
            "error_rate_by_day": error_rate_by_day(
                resolved_start, resolved_end, engine
            ),
            "api_latency_by_day": api_latency_by_day(
                resolved_start, resolved_end, engine
            ),
            "auth_failure_rate": auth_failure_rate_by_day(
                resolved_start, resolved_end, engine
            ),
        },
    }
    if len(_report_cache) >= 128:
        _report_cache.pop(next(iter(_report_cache)))
    _report_cache[key] = (now, report)
    return report
