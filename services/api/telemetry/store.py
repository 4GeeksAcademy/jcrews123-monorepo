from __future__ import annotations

from typing import Any
from uuid import uuid4

from sqlalchemy import JSON, Column, DateTime, MetaData, Numeric, String, Table, Text
from sqlalchemy import Uuid, insert
from sqlmodel import Session

from schemas.telemetry import TelemetryEvent
from telemetry.contracts import event_level, event_value

telemetry_metadata = MetaData()

telemetry_events = Table(
    "telemetry_events",
    telemetry_metadata,
    Column("id", Uuid, primary_key=True, default=uuid4),
    Column("timestamp", DateTime(timezone=True), nullable=False, index=True),
    Column("service", String, nullable=False),
    Column("event_type", String, nullable=False, index=True),
    Column("level", String, nullable=False, default="info"),
    Column("value", Numeric, nullable=True),
    Column("message", Text, nullable=True),
    Column("tags", JSON, nullable=False, default=dict),
)


def event_to_row(event: TelemetryEvent) -> dict[str, Any]:
    return {
        "timestamp": event.timestamp,
        "service": "backoffice",
        "event_type": event.event_type,
        "level": event_level(event.event_type),
        "value": event_value(event.event_type, event.properties),
        "message": None,
        "tags": {
            **event.properties,
            "_meta": {
                "eventId": str(event.eventId),
                "sessionId": str(event.sessionId),
                "userId": event.userId,
                "requestId": str(event.requestId),
                "schemaVersion": event.schemaVersion,
            },
        },
    }


def store_events(session: Session, events: list[TelemetryEvent]) -> int:
    if not events:
        return 0
    rows = [event_to_row(event) for event in events]
    session.execute(insert(telemetry_events), rows)
    session.commit()
    return len(rows)
