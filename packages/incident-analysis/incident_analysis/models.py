from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class InvalidBreakdown:
    missing_location_id: int = 0
    invalid_or_missing_category: int = 0
    empty_description: int = 0
    missing_reporter_id: int = 0
    closed_without_score: int = 0
    score_out_of_range: int = 0


@dataclass
class SatisfactionStats:
    scored_closed_count: int = 0
    total_closed_with_score: int = 0
    average_score: float = 0.0
    score_distribution: dict[int, int] = field(default_factory=dict)


@dataclass
class AnalysisResult:
    source_file: str = ""
    total_records: int = 0
    valid_count: int = 0
    invalid_count: int = 0
    invalid_breakdown: InvalidBreakdown = field(default_factory=InvalidBreakdown)
    category_counts: dict[str, int] = field(default_factory=dict)
    status_counts: dict[str, int] = field(default_factory=dict)
    satisfaction: SatisfactionStats = field(default_factory=SatisfactionStats)
