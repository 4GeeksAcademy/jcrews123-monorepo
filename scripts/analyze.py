#!/usr/bin/env python3
"""Brasaland incident CSV analyzer — Phase 1 CLI."""

from __future__ import annotations

import sys
from pathlib import Path

# Allow running before editable install by adding packages to path
_REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(_REPO_ROOT / "packages" / "incident-analysis"))

from incident_analysis.analyze import analyze_csv_rows  # noqa: E402
from incident_analysis.export import export_to_csv_file  # noqa: E402
from incident_analysis.loader import load_csv_rows_from_path  # noqa: E402
from incident_analysis.report import format_console_report  # noqa: E402


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    if len(sys.argv) != 2:
        print("Usage: python scripts/analyze.py <path-to-csv>")
        return 1

    csv_path = sys.argv[1]
    path = Path(csv_path)
    if not path.is_file():
        print(f"Error: file not found: {csv_path}")
        return 1

    rows = load_csv_rows_from_path(str(path))
    result = analyze_csv_rows(rows, source_file=path.name)
    print(format_console_report(result))

    answer = input("Export results to CSV? [y / n]: ").strip().lower()
    if answer == "y":
        export_to_csv_file(result, "results.csv")
        print("Results exported to results.csv")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
