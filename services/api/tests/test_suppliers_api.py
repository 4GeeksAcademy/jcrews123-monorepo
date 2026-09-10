from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from test_helpers import auth_headers


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
    from test_helpers import login_user, register_user

    register_user(client)
    return login_user(client)


def test_create_supplier(client: TestClient, auth_token: str) -> None:
    response = client.post(
        "/suppliers",
        headers=auth_headers(auth_token),
        json={
            "name": "Test Supplier",
            "country": "Colombia",
            "categories": ["carne"],
            "rate_per_unit": 1000.0,
            "currency": "COP",
            "status": "active",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Test Supplier"
    assert "updated_at" in data


def test_list_suppliers_empty(client: TestClient, auth_token: str) -> None:
    response = client.get("/suppliers", headers=auth_headers(auth_token))
    assert response.status_code == 200
    assert response.json() == []


def test_get_supplier_not_found(client: TestClient, auth_token: str) -> None:
    response = client.get("/suppliers/999", headers=auth_headers(auth_token))
    assert response.status_code == 404


def test_filter_suppliers_by_country(client: TestClient, auth_token: str) -> None:
    headers = auth_headers(auth_token)
    client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Colombia Meat",
            "country": "Colombia",
            "categories": ["carne"],
            "rate_per_unit": 1000.0,
            "currency": "COP",
            "status": "active",
        },
    )
    client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Florida Produce",
            "country": "USA",
            "categories": ["vegetales"],
            "rate_per_unit": 5.0,
            "currency": "USD",
            "status": "active",
        },
    )

    response = client.get("/suppliers?country=Colombia", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["country"] == "Colombia"


def test_filter_suppliers_by_category(client: TestClient, auth_token: str) -> None:
    headers = auth_headers(auth_token)
    client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Pack Co",
            "country": "Colombia",
            "categories": ["packaging"],
            "rate_per_unit": 500.0,
            "currency": "COP",
            "status": "active",
        },
    )
    client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Meat Co",
            "country": "Colombia",
            "categories": ["carne"],
            "rate_per_unit": 2000.0,
            "currency": "COP",
            "status": "active",
        },
    )

    response = client.get("/suppliers?category=packaging", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert "packaging" in data[0]["categories"]


def test_update_supplier_rate(client: TestClient, auth_token: str) -> None:
    headers = auth_headers(auth_token)
    created = client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Rate Test",
            "country": "USA",
            "categories": ["carne"],
            "rate_per_unit": 10.0,
            "currency": "USD",
            "status": "active",
        },
    ).json()

    response = client.patch(
        f"/suppliers/{created['id']}/rate",
        headers=headers,
        json={"rate_per_unit": 12.5},
    )
    assert response.status_code == 200
    assert response.json()["rate_per_unit"] == 12.5
    assert response.json()["updated_at"] != created["updated_at"]


def test_update_supplier_status(client: TestClient, auth_token: str) -> None:
    headers = auth_headers(auth_token)
    created = client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Status Test",
            "country": "Colombia",
            "categories": ["carne"],
            "rate_per_unit": 1000.0,
            "currency": "COP",
            "status": "active",
        },
    ).json()

    response = client.patch(
        f"/suppliers/{created['id']}/status",
        headers=headers,
        json={"status": "suspended"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "suspended"


def test_delete_supplier(client: TestClient, auth_token: str) -> None:
    headers = auth_headers(auth_token)
    created = client.post(
        "/suppliers",
        headers=headers,
        json={
            "name": "Delete Me",
            "country": "Colombia",
            "categories": ["carne"],
            "rate_per_unit": 1000.0,
            "currency": "COP",
            "status": "active",
        },
    ).json()

    response = client.delete(f"/suppliers/{created['id']}", headers=headers)
    assert response.status_code == 200

    missing = client.get(f"/suppliers/{created['id']}", headers=headers)
    assert missing.status_code == 404


def test_suppliers_require_auth(client: TestClient) -> None:
    response = client.get("/suppliers")
    assert response.status_code == 401
