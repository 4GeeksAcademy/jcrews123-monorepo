from __future__ import annotations

from incident_analysis.loader import load_csv_rows_from_text
from incident_analysis.metrics import (
    compute_category_counts,
    compute_satisfaction_stats,
    compute_status_counts,
    filter_valid_rows,
)
from incident_analysis.models import AnalysisResult
from incident_analysis.validation import count_invalid_breakdown


def analyze_csv_rows(
    rows: list[dict[str, str]], source_file: str = ""
) -> AnalysisResult:
    total = len(rows)
    invalid_count, breakdown = count_invalid_breakdown(rows)
    valid_rows = filter_valid_rows(rows)
    valid_count = len(valid_rows)

    return AnalysisResult(
        source_file=source_file,
        total_records=total,
        valid_count=valid_count,
        invalid_count=invalid_count,
        invalid_breakdown=breakdown,
        category_counts=compute_category_counts(valid_rows),
        status_counts=compute_status_counts(valid_rows),
        satisfaction=compute_satisfaction_stats(valid_rows),
    )


def analyze_csv_text(text: str, source_file: str = "") -> AnalysisResult:
    rows = load_csv_rows_from_text(text)
    return analyze_csv_rows(rows, source_file=source_file)
