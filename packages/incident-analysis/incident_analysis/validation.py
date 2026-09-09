from __future__ import annotations

from incident_analysis.constants import (
    MAX_SATISFACTION_SCORE,
    MIN_DESCRIPTION_LENGTH,
    MIN_SATISFACTION_SCORE,
    VALID_CATEGORIES,
    VALID_LOCATIONS,
    VALID_STATUSES,
)
from incident_analysis.models import InvalidBreakdown


def _is_blank(value: str | None) -> bool:
    return value is None or str(value).strip() == ""


def _parse_satisfaction_score(raw: str | None) -> int | None:
    if _is_blank(raw):
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None


def check_invalid_rules(row: dict[str, str]) -> list[str]:
    """Return rule keys triggered for this row (may be multiple)."""
    triggered: list[str] = []

    location_id = row.get("location_id", "")
    if _is_blank(location_id) or location_id.strip() not in VALID_LOCATIONS:
        triggered.append("missing_location_id")

    category = row.get("category", "")
    if _is_blank(category) or category.strip() not in VALID_CATEGORIES:
        triggered.append("invalid_or_missing_category")

    description = row.get("description", "")
    if _is_blank(description) or len(description.strip()) < MIN_DESCRIPTION_LENGTH:
        triggered.append("empty_description")

    reporter_id = row.get("reporter_id", "")
    if _is_blank(reporter_id):
        triggered.append("missing_reporter_id")

    status = row.get("status", "").strip()
    score = _parse_satisfaction_score(row.get("satisfaction_score"))

    if score is not None and (
        score < MIN_SATISFACTION_SCORE or score > MAX_SATISFACTION_SCORE
    ):
        triggered.append("score_out_of_range")

    if status == "CLOSED" and score is None:
        triggered.append("closed_without_score")

    return triggered


def is_valid_record(row: dict[str, str]) -> bool:
    return len(check_invalid_rules(row)) == 0


def count_invalid_breakdown(rows: list[dict[str, str]]) -> tuple[int, InvalidBreakdown]:
    breakdown = InvalidBreakdown()
    invalid_count = 0

    for row in rows:
        rules = check_invalid_rules(row)
        if not rules:
            continue
        invalid_count += 1
        for rule in rules:
            if rule == "missing_location_id":
                breakdown.missing_location_id += 1
            elif rule == "invalid_or_missing_category":
                breakdown.invalid_or_missing_category += 1
            elif rule == "empty_description":
                breakdown.empty_description += 1
            elif rule == "missing_reporter_id":
                breakdown.missing_reporter_id += 1
            elif rule == "closed_without_score":
                breakdown.closed_without_score += 1
            elif rule == "score_out_of_range":
                breakdown.score_out_of_range += 1

    return invalid_count, breakdown
