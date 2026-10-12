from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TelemetryEvent(BaseModel):
    """Stable project #46 event envelope; storage reuses this model unchanged."""

    model_config = ConfigDict(extra="forbid")

    eventId: UUID
    timestamp: datetime
    sessionId: UUID
    userId: str | None
    event_type: str = Field(pattern=r"^[a-z][a-z0-9]*(_[a-z0-9]+)+$")
    schemaVersion: str = Field(pattern=r"^\d+\.\d+\.\d+$")
    requestId: UUID
    properties: dict[str, Any]

    @field_validator("timestamp")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("timestamp must include a timezone")
        return value


class TelemetryBatch(BaseModel):
    model_config = ConfigDict(extra="forbid")

    events: list[Any]
