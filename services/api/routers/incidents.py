from __future__ import annotations

import sys
from pathlib import Path

from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import Response

from core.deps import get_current_user

_REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(_REPO_ROOT / "packages" / "incident-analysis"))

from incident_analysis.analyze import analyze_csv_text  # noqa: E402
from incident_analysis.export import export_to_csv_text  # noqa: E402

from schemas.incidents import AnalysisResponse, ErrorResponse  # noqa: E402
from serializers import result_to_dict  # noqa: E402
from state import get_last_result, set_last_result  # noqa: E402

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


def _to_response(result) -> AnalysisResponse:
    data = result_to_dict(result)
    return AnalysisResponse(**data)


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={400: {"model": ErrorResponse}},
)
async def analyze_incidents(
    current_user: Annotated[dict, Depends(get_current_user)],
    file: UploadFile = File(...),
) -> AnalysisResponse:
    _ = current_user
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=400, detail="File must be UTF-8 encoded text."
        ) from exc

    if not text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        result = analyze_csv_text(text, source_file=file.filename)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not parse CSV file: {exc}",
        ) from exc

    if result.total_records == 0:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no data rows. Check header and format.",
        )

    set_last_result(result)
    return _to_response(result)


@router.get("/results/export")
async def export_results(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> Response:
    _ = current_user
    result = get_last_result()
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="No analysis available. Upload a CSV first.",
        )

    csv_text = export_to_csv_text(result)
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="incident-analysis-results.csv"'
        },
    )
