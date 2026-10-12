from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from test_helpers import auth_headers


def event(event_type: str, properties: dict) -> dict:
    return {
        "eventId": str(uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sessionId": str(uuid4()),
        "userId": None,
        "event_type": event_type,
        "schemaVersion": "1.0.0",
        "requestId": str(uuid4()),
        "properties": properties,
    }


def test_telemetry_batch_is_stored(client):
    response = client.post(
        "/telemetry/events",
        json={
            "events": [
                event(
                    "page_viewed",
                    {"route": "/inventory/products", "section": "inventory"},
                ),
                event(
                    "api_latency_recorded",
                    {
                        "endpoint": "/inventory/products",
                        "method": "GET",
                        "duration_ms": 42.5,
                        "status": 200,
                    },
                ),
            ]
        },
    )

    assert response.status_code == 200
    assert response.json() == {"received": 2, "stored": 2, "rejected": 0}


def test_telemetry_mixed_batch_partially_accepts(client):
    invalid = event("page_viewed", {"route": "/", "section": "dashboard"})
    invalid["properties"]["email"] = "must-not-be-stored@example.com"

    response = client.post(
        "/telemetry/events",
        json={
            "events": [
                event("user_login_succeeded", {"auth_method": "password"}),
                invalid,
                {"not": "an event"},
            ]
        },
    )

    assert response.status_code == 200
    assert response.json() == {"received": 3, "stored": 1, "rejected": 2}


def test_telemetry_rejects_unknown_event_and_schema_version(client):
    unknown = event("made_up_event", {})
    old = event("page_viewed", {"route": "/", "section": "dashboard"})
    old["schemaVersion"] = "0.9.0"

    response = client.post("/telemetry/events", json={"events": [unknown, old]})

    assert response.status_code == 200
    assert response.json() == {"received": 2, "stored": 0, "rejected": 2}


def test_report_defaults_to_seven_days_and_uses_cache(
    client, auth_token, monkeypatch
):
    import routers.telemetry as telemetry_router

    calls = {"volume": 0}

    def volume(*_args):
        calls["volume"] += 1
        return [{"date": "2026-10-12", "event_type": "page_viewed", "count": 1}]

    telemetry_router._report_cache.clear()
    monkeypatch.setattr(telemetry_router, "events_per_day_by_type", volume)
    monkeypatch.setattr(telemetry_router, "error_rate_by_day", lambda *_: [])
    monkeypatch.setattr(telemetry_router, "api_latency_by_day", lambda *_: [])
    monkeypatch.setattr(telemetry_router, "auth_failure_rate_by_day", lambda *_: [])

    first = client.get("/telemetry/report", headers=auth_headers(auth_token))
    second = client.get("/telemetry/report", headers=auth_headers(auth_token))

    assert first.status_code == 200
    assert second.status_code == 200
    assert set(first.json()) == {"period", "metrics"}
    assert calls["volume"] == 1


def test_report_rejects_inverted_date_range(client, auth_token):
    response = client.get(
        "/telemetry/report",
        params={
            "start_date": "2026-10-12T00:00:00Z",
            "end_date": "2026-10-11T00:00:00Z",
        },
        headers=auth_headers(auth_token),
    )
    assert response.status_code == 422
