from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from test_helpers import login_user, register_user


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
