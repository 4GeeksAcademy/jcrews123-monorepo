from __future__ import annotations

from incident_analysis.models import AnalysisResult, InvalidBreakdown, SatisfactionStats


def result_to_dict(result: AnalysisResult) -> dict:
    return {
        "source_file": result.source_file,
        "total_records": result.total_records,
        "valid_count": result.valid_count,
        "invalid_count": result.invalid_count,
        "invalid_breakdown": {
            "missing_location_id": result.invalid_breakdown.missing_location_id,
            "invalid_or_missing_category": result.invalid_breakdown.invalid_or_missing_category,
            "empty_description": result.invalid_breakdown.empty_description,
            "missing_reporter_id": result.invalid_breakdown.missing_reporter_id,
            "closed_without_score": result.invalid_breakdown.closed_without_score,
            "score_out_of_range": result.invalid_breakdown.score_out_of_range,
        },
        "category_counts": result.category_counts,
        "status_counts": result.status_counts,
        "satisfaction": {
            "scored_closed_count": result.satisfaction.scored_closed_count,
            "total_closed_with_score": result.satisfaction.total_closed_with_score,
            "average_score": result.satisfaction.average_score,
            "score_distribution": result.satisfaction.score_distribution,
        },
    }


def dict_to_result(data: dict) -> AnalysisResult:
    breakdown = data.get("invalid_breakdown", {})
    satisfaction = data.get("satisfaction", {})
    return AnalysisResult(
        source_file=data.get("source_file", ""),
        total_records=data.get("total_records", 0),
        valid_count=data.get("valid_count", 0),
        invalid_count=data.get("invalid_count", 0),
        invalid_breakdown=InvalidBreakdown(
            missing_location_id=breakdown.get("missing_location_id", 0),
            invalid_or_missing_category=breakdown.get("invalid_or_missing_category", 0),
            empty_description=breakdown.get("empty_description", 0),
            missing_reporter_id=breakdown.get("missing_reporter_id", 0),
            closed_without_score=breakdown.get("closed_without_score", 0),
            score_out_of_range=breakdown.get("score_out_of_range", 0),
        ),
        category_counts=data.get("category_counts", {}),
        status_counts=data.get("status_counts", {}),
        satisfaction=SatisfactionStats(
            scored_closed_count=satisfaction.get("scored_closed_count", 0),
            total_closed_with_score=satisfaction.get("total_closed_with_score", 0),
            average_score=satisfaction.get("average_score", 0.0),
            score_distribution={
                int(k): v for k, v in satisfaction.get("score_distribution", {}).items()
            },
        ),
    )
