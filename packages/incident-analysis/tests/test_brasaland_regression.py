from __future__ import annotations

from pathlib import Path

import pytest

from incident_analysis.analyze import analyze_csv_text
from incident_analysis.loader import load_csv_rows_from_path

REPO_ROOT = Path(__file__).resolve().parents[3]
TEST_CSV = REPO_ROOT / "scripts" / "incidents-brasaland.csv"


@pytest.fixture(scope="module")
def brasaland_result():
    if not TEST_CSV.is_file():
        pytest.skip(f"Test CSV missing: {TEST_CSV}")
    text = TEST_CSV.read_text(encoding="utf-8")
    return analyze_csv_text(text, source_file=TEST_CSV.name)


def test_brasaland_totals(brasaland_result) -> None:
    assert brasaland_result.total_records == 100
    assert brasaland_result.valid_count == 96
    assert brasaland_result.invalid_count == 4


def test_brasaland_invalid_breakdown(brasaland_result) -> None:
    breakdown = brasaland_result.invalid_breakdown
    assert breakdown.missing_location_id == 1
    assert breakdown.invalid_or_missing_category == 1
    assert breakdown.empty_description == 1
    assert breakdown.missing_reporter_id == 0
    assert breakdown.closed_without_score == 1
    assert breakdown.score_out_of_range == 0


def test_brasaland_category_counts(brasaland_result) -> None:
    counts = brasaland_result.category_counts
    assert counts["CUSTOMER_COMPLAINT"] == 29
    assert counts["EQUIPMENT"] == 17
    assert counts["SUPPLY"] == 22
    assert counts["FOOD_QUALITY"] == 19
    assert counts["STAFF"] == 9


def test_brasaland_status_counts(brasaland_result) -> None:
    counts = brasaland_result.status_counts
    assert counts["OPEN"] == 32
    assert counts["CLOSED"] == 50
    assert counts["DISCARDED"] == 14


def test_brasaland_satisfaction(brasaland_result) -> None:
    sat = brasaland_result.satisfaction
    assert sat.scored_closed_count == 50
    assert sat.total_closed_with_score == 50
    assert sat.average_score == 3.46
    assert sat.score_distribution == {1: 4, 2: 6, 3: 12, 4: 19, 5: 9}


def test_loader_matches_analyze_text(brasaland_result) -> None:
    rows = load_csv_rows_from_path(str(TEST_CSV))
    text = TEST_CSV.read_text(encoding="utf-8")
    from incident_analysis.analyze import analyze_csv_rows

    from_rows = analyze_csv_rows(rows, source_file=TEST_CSV.name)
    assert from_rows.valid_count == brasaland_result.valid_count
    assert from_rows.category_counts == brasaland_result.category_counts
