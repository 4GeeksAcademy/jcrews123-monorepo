from __future__ import annotations

from pydantic import BaseModel, Field


class InvalidBreakdownResponse(BaseModel):
    missing_location_id: int = 0
    invalid_or_missing_category: int = 0
    empty_description: int = 0
    missing_reporter_id: int = 0
    closed_without_score: int = 0
    score_out_of_range: int = 0


class SatisfactionResponse(BaseModel):
    scored_closed_count: int
    total_closed_with_score: int
    average_score: float
    score_distribution: dict[int, int] = Field(default_factory=dict)


class AnalysisResponse(BaseModel):
    source_file: str
    total_records: int
    valid_count: int
    invalid_count: int
    invalid_breakdown: InvalidBreakdownResponse
    category_counts: dict[str, int]
    status_counts: dict[str, int]
    satisfaction: SatisfactionResponse


class ErrorResponse(BaseModel):
    detail: str
