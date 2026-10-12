from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy import insert


def test_analysis_metrics_group_in_utc(client):
    from analysis import (
        api_latency_by_day,
        auth_failure_rate_by_day,
        error_rate_by_day,
        events_per_day_by_type,
    )
    from db.postgres import get_engine
    from telemetry.store import telemetry_events

    engine = get_engine()
    now = datetime.now(timezone.utc)
    rows = [
        {
            "id": uuid4(),
            "timestamp": now - timedelta(hours=2),
            "service": "backoffice",
            "event_type": "api_latency_recorded",
            "level": "info",
            "value": 120,
            "message": None,
            "tags": {"endpoint": "/inventory/products"},
        },
        {
            "id": uuid4(),
            "timestamp": now - timedelta(hours=1),
            "service": "backoffice",
            "event_type": "frontend_error",
            "level": "error",
            "value": None,
            "message": None,
            "tags": {"route": "/inventory/products"},
        },
        {
            "id": uuid4(),
            "timestamp": now - timedelta(minutes=45),
            "service": "backoffice",
            "event_type": "user_login_succeeded",
            "level": "info",
            "value": None,
            "message": None,
            "tags": {"auth_method": "password"},
        },
        {
            "id": uuid4(),
            "timestamp": now - timedelta(minutes=30),
            "service": "backoffice",
            "event_type": "user_login_failed",
            "level": "warn",
            "value": None,
            "message": None,
            "tags": {"failure_reason": "invalid_credentials"},
        },
    ]
    with engine.begin() as connection:
        connection.execute(insert(telemetry_events), rows)

    start = now - timedelta(days=1)
    end = now + timedelta(minutes=1)
    volume = events_per_day_by_type(start, end, engine)
    errors = error_rate_by_day(start, end, engine)
    latency = api_latency_by_day(start, end, engine)
    auth = auth_failure_rate_by_day(start, end, engine)

    assert sum(row["count"] for row in volume) == 4
    assert errors[0]["error_events"] == 1
    assert errors[0]["total_events"] == 4
    assert latency[0]["average_ms"] == 120
    assert auth[0]["attempts"] == 2
    assert auth[0]["failure_rate"] == 0.5
