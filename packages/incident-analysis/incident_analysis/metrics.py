from __future__ import annotations

from incident_analysis.constants import CATEGORY_ORDER, STATUS_ORDER
from incident_analysis.models import SatisfactionStats
from incident_analysis.validation import _parse_satisfaction_score, is_valid_record


def compute_category_counts(valid_rows: list[dict[str, str]]) -> dict[str, int]:
    counts = {category: 0 for category in CATEGORY_ORDER}
    for row in valid_rows:
        category = row.get("category", "").strip()
        if category in counts:
            counts[category] += 1
    return counts


def compute_status_counts(valid_rows: list[dict[str, str]]) -> dict[str, int]:
    counts = {status: 0 for status in STATUS_ORDER}
    for row in valid_rows:
        status = row.get("status", "").strip()
        if status in counts:
            counts[status] += 1
    return counts


def compute_satisfaction_stats(valid_rows: list[dict[str, str]]) -> SatisfactionStats:
    closed_rows = [row for row in valid_rows if row.get("status", "").strip() == "CLOSED"]
    scores: list[int] = []

    for row in closed_rows:
        score = _parse_satisfaction_score(row.get("satisfaction_score"))
        if score is not None:
            scores.append(score)

    distribution = {i: 0 for i in range(1, 6)}
    for score in scores:
        distribution[score] += 1

    average = round(sum(scores) / len(scores), 2) if scores else 0.0

    return SatisfactionStats(
        scored_closed_count=len(scores),
        total_closed_with_score=len(closed_rows),
        average_score=average,
        score_distribution=distribution,
    )


def filter_valid_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    return [row for row in rows if is_valid_record(row)]
