from __future__ import annotations

from datetime import datetime
import json
from typing import Any

import pandas as pd
from sqlalchemy import Engine, text


def _tag_value(tags: Any, key: str) -> Any:
    parsed = json.loads(tags) if isinstance(tags, str) else tags
    return parsed.get(key) if isinstance(parsed, dict) else None


def _read(
    engine: Engine,
    statement: str,
    start_date: datetime,
    end_date: datetime,
    params: dict[str, Any] | None = None,
) -> pd.DataFrame:
    query_params = {"start_date": start_date, "end_date": end_date, **(params or {})}
    with engine.connect() as connection:
        return pd.read_sql(text(statement), connection, params=query_params)


def events_per_day_by_type(
    start_date: datetime, end_date: datetime, engine: Engine
) -> list[dict[str, Any]]:
    frame = _read(
        engine,
        """
        select timestamp, event_type
        from telemetry_events
        where timestamp >= :start_date and timestamp < :end_date
        """,
        start_date,
        end_date,
    )
    if frame.empty:
        return []
    frame["timestamp"] = pd.to_datetime(frame["timestamp"], utc=True)
    frame["date"] = frame["timestamp"].dt.date
    result = (
        frame.groupby(["date", "event_type"])
        .size()
        .rename("count")
        .reset_index()
    )
    result["date"] = result["date"].astype(str)
    return result.to_dict(orient="records")


def error_rate_by_day(
    start_date: datetime, end_date: datetime, engine: Engine
) -> list[dict[str, Any]]:
    frame = _read(
        engine,
        """
        select timestamp, level
        from telemetry_events
        where timestamp >= :start_date and timestamp < :end_date
        """,
        start_date,
        end_date,
    )
    if frame.empty:
        return []
    frame["timestamp"] = pd.to_datetime(frame["timestamp"], utc=True)
    frame["date"] = frame["timestamp"].dt.date
    frame["is_error"] = frame["level"].eq("error").astype(int)
    result = (
        frame.groupby("date")
        .agg(total_events=("level", "count"), error_events=("is_error", "sum"))
        .reset_index()
    )
    result["error_rate"] = result["error_events"] / result["total_events"]
    result["date"] = result["date"].astype(str)
    return result.to_dict(orient="records")


def api_latency_by_day(
    start_date: datetime, end_date: datetime, engine: Engine
) -> list[dict[str, Any]]:
    frame = _read(
        engine,
        """
        select timestamp, value, tags
        from telemetry_events
        where timestamp >= :start_date and timestamp < :end_date
          and event_type = 'api_latency_recorded'
        """,
        start_date,
        end_date,
    )
    if frame.empty:
        return []
    frame["timestamp"] = pd.to_datetime(frame["timestamp"], utc=True)
    frame["date"] = frame["timestamp"].dt.date
    frame["endpoint"] = frame["tags"].map(
        lambda tags: _tag_value(tags, "endpoint")
    )
    frame = frame.dropna(subset=["endpoint", "value"])
    result = (
        frame.groupby(["date", "endpoint"])
        .agg(average_ms=("value", "mean"), samples=("value", "count"))
        .reset_index()
    )
    result["average_ms"] = result["average_ms"].astype(float)
    result["date"] = result["date"].astype(str)
    return result.to_dict(orient="records")


def auth_failure_rate_by_day(
    start_date: datetime, end_date: datetime, engine: Engine
) -> list[dict[str, Any]]:
    frame = _read(
        engine,
        """
        select timestamp, event_type
        from telemetry_events
        where timestamp >= :start_date and timestamp < :end_date
          and event_type in ('user_login_succeeded', 'user_login_failed')
        """,
        start_date,
        end_date,
    )
    if frame.empty:
        return []
    frame["timestamp"] = pd.to_datetime(frame["timestamp"], utc=True)
    frame["date"] = frame["timestamp"].dt.date
    frame["is_failure"] = frame["event_type"].eq("user_login_failed").astype(int)
    result = (
        frame.groupby("date")
        .agg(attempts=("event_type", "count"), failures=("is_failure", "sum"))
        .reset_index()
    )
    result["failure_rate"] = result["failures"] / result["attempts"]
    result["date"] = result["date"].astype(str)
    return result.to_dict(orient="records")
