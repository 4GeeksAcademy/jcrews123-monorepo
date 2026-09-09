from __future__ import annotations

from incident_analysis.constants import CATEGORY_ORDER, STATUS_ORDER
from incident_analysis.models import AnalysisResult


def _pct(count: int, total: int) -> str:
    if total == 0:
        return "0.0%"
    return f"{(count / total) * 100:.1f}%"


def format_console_report(result: AnalysisResult) -> str:
    source = result.source_file or "incidents.csv"
    valid = result.valid_count
    lines = [
        "=" * 60,
        "  BRASALAND — INCIDENT REPORT ANALYSIS",
        f"  Source file: {source}",
        "=" * 60,
        "",
        f"TOTAL RECORDS IN FILE .......... {result.total_records}",
        f"  ├─ Valid records ................ {result.valid_count}",
        f"  └─ Invalid / incomplete .......... {result.invalid_count}",
        "",
        "INVALID RECORDS BREAKDOWN",
        f"  ├─ Missing location_id ........... {result.invalid_breakdown.missing_location_id}",
        f"  ├─ Invalid or missing category ... {result.invalid_breakdown.invalid_or_missing_category}",
        f"  ├─ Empty description ............. {result.invalid_breakdown.empty_description}",
        f"  └─ Closed case, no score ......... {result.invalid_breakdown.closed_without_score}",
        "",
        "BREAKDOWN BY CATEGORY (valid records)",
    ]

    for category in CATEGORY_ORDER:
        count = result.category_counts.get(category, 0)
        label = category.ljust(28)
        lines.append(f"  ├─ {label} {count:>3}  ({_pct(count, valid)})")

    lines.extend(["", "BREAKDOWN BY STATUS (valid records)"])
    for status in STATUS_ORDER:
        count = result.status_counts.get(status, 0)
        label = status.ljust(28)
        lines.append(f"  ├─ {label} {count:>3}  ({_pct(count, valid)})")

    sat = result.satisfaction
    lines.extend(
        [
            "",
            "SATISFACTION INDEX (closed cases)",
            f"  Scored cases: {sat.scored_closed_count} of {sat.total_closed_with_score}",
            f"  Average score: {sat.average_score:.2f} / 5.00",
            f"  ├─ Score 1 (Very dissatisfied) ... {sat.score_distribution.get(1, 0)}",
            f"  ├─ Score 2 (Dissatisfied) ........ {sat.score_distribution.get(2, 0)}",
            f"  ├─ Score 3 (Neutral) ............ {sat.score_distribution.get(3, 0)}",
            f"  ├─ Score 4 (Satisfied) .......... {sat.score_distribution.get(4, 0)}",
            f"  └─ Score 5 (Very satisfied) ...... {sat.score_distribution.get(5, 0)}",
            "",
            "=" * 60,
        ]
    )
    return "\n".join(lines)
