from __future__ import annotations

import csv
import io

from incident_analysis.constants import CATEGORY_ORDER, STATUS_ORDER
from incident_analysis.models import AnalysisResult


def _pct_value(count: int, total: int) -> str:
    if total == 0:
        return "0.0"
    return f"{(count / total) * 100:.1f}"


def build_export_rows(result: AnalysisResult) -> list[dict[str, str]]:
    valid = result.valid_count
    rows: list[dict[str, str]] = [
        {"metric": "total_records", "value": str(result.total_records), "percentage": ""},
        {"metric": "valid_records", "value": str(result.valid_count), "percentage": ""},
        {
            "metric": "invalid_records",
            "value": str(result.invalid_count),
            "percentage": "",
        },
        {
            "metric": "invalid_missing_location_id",
            "value": str(result.invalid_breakdown.missing_location_id),
            "percentage": "",
        },
        {
            "metric": "invalid_invalid_or_missing_category",
            "value": str(result.invalid_breakdown.invalid_or_missing_category),
            "percentage": "",
        },
        {
            "metric": "invalid_empty_description",
            "value": str(result.invalid_breakdown.empty_description),
            "percentage": "",
        },
        {
            "metric": "invalid_closed_without_score",
            "value": str(result.invalid_breakdown.closed_without_score),
            "percentage": "",
        },
    ]

    for category in CATEGORY_ORDER:
        count = result.category_counts.get(category, 0)
        rows.append(
            {
                "metric": f"category_{category.lower()}",
                "value": str(count),
                "percentage": _pct_value(count, valid),
            }
        )

    for status in STATUS_ORDER:
        count = result.status_counts.get(status, 0)
        rows.append(
            {
                "metric": f"status_{status.lower()}",
                "value": str(count),
                "percentage": _pct_value(count, valid),
            }
        )

    rows.append(
        {
            "metric": "satisfaction_average",
            "value": f"{result.satisfaction.average_score:.2f}",
            "percentage": "",
        }
    )
    for score in range(1, 6):
        rows.append(
            {
                "metric": f"satisfaction_score_{score}",
                "value": str(result.satisfaction.score_distribution.get(score, 0)),
                "percentage": "",
            }
        )

    return rows


def export_to_csv_text(result: AnalysisResult) -> str:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=["metric", "value", "percentage"])
    writer.writeheader()
    writer.writerows(build_export_rows(result))
    return buffer.getvalue()


def export_to_csv_file(result: AnalysisResult, path: str) -> None:
    with open(path, "w", encoding="utf-8", newline="") as handle:
        handle.write(export_to_csv_text(result))
