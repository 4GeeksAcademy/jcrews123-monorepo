from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from test_helpers import auth_headers, login_user, register_user

REPO_ROOT = Path(__file__).resolve().parents[3]
TEST_CSV = REPO_ROOT / "scripts" / "incidents-brasaland.csv"


@pytest.fixture()
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> TestClient:
    suppliers_db = tmp_path / "suppliers-test.json"
    users_db = tmp_path / "users-test.json"
    monkeypatch.setenv("SUPPLIERS_DB_PATH", str(suppliers_db))
    monkeypatch.setenv("USERS_DB_PATH", str(users_db))
    monkeypatch.setenv("SECRET_KEY", "test-secret-key-for-pytest")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

    from main import app

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def auth_token(client: TestClient) -> str:
    register_user(client)
    return login_user(client)


@pytest.fixture()
def csv_bytes() -> bytes:
    if not TEST_CSV.is_file():
        pytest.skip(f"Test CSV missing: {TEST_CSV}")
    return TEST_CSV.read_bytes()


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_incidents(
    client: TestClient, auth_token: str, csv_bytes: bytes
) -> None:
    response = client.post(
        "/api/incidents/analyze",
        headers=auth_headers(auth_token),
        files={"file": ("incidents-brasaland.csv", csv_bytes, "text/csv")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] == 100
    assert data["valid_count"] == 96
    assert data["invalid_count"] == 4
    assert data["satisfaction"]["average_score"] == 3.46


def test_export_after_analyze(
    client: TestClient, auth_token: str, csv_bytes: bytes
) -> None:
    headers = auth_headers(auth_token)
    analyze = client.post(
        "/api/incidents/analyze",
        headers=headers,
        files={"file": ("incidents-brasaland.csv", csv_bytes, "text/csv")},
    )
    assert analyze.status_code == 200

    export = client.get("/api/incidents/results/export", headers=headers)
    assert export.status_code == 200
    assert export.headers["content-type"].startswith("text/csv")
    assert "metric" in export.text


def test_export_without_prior_analysis(client: TestClient, auth_token: str) -> None:
    from state import set_last_result

    set_last_result(None)
    response = client.get(
        "/api/incidents/results/export",
        headers=auth_headers(auth_token),
    )
    assert response.status_code == 404


def test_incidents_require_auth(client: TestClient, csv_bytes: bytes) -> None:
    response = client.post(
        "/api/incidents/analyze",
        files={"file": ("incidents-brasaland.csv", csv_bytes, "text/csv")},
    )
    assert response.status_code == 401
