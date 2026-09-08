from __future__ import annotations

from incident_analysis.models import AnalysisResult

_last_result: AnalysisResult | None = None


def set_last_result(result: AnalysisResult) -> None:
    global _last_result
    _last_result = result


def get_last_result() -> AnalysisResult | None:
    return _last_result
