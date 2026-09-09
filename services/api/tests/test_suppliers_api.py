from __future__ import annotations

import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("SUPPLIERS_DB_PATH", "")


@pytest.fixture()
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> TestClient:
    db_path = tmp_path / "suppliers-test.json"
    monkeypatch.setenv("SUPPLIERS_DB_PATH", str(db_path))

    from main import app

    with TestClient(app) as test_client:
        yield test_client


def test_create_supplier(client: TestClient) -> None:
    response = client.post(
        "/suppliers",
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


def test_reject_invalid_currency(client: TestClient) -> None:
    response = client.post(
        "/suppliers",
        json={
            "name": "Bad Currency",
            "country": "Colombia",
            "categories": ["carne"],
            "rate_per_unit": 1000.0,
            "currency": "USD",
            "status": "active",
        },
    )
    assert response.status_code == 422


def test_reject_non_positive_rate(client: TestClient) -> None:
    response = client.post(
        "/suppliers",
        json={
            "name": "Bad Rate",
            "country": "USA",
            "categories": ["carne"],
            "rate_per_unit": 0,
            "currency": "USD",
            "status": "active",
        },
    )
    assert response.status_code == 422


def test_list_and_filter(client: TestClient) -> None:
    client.post(
        "/suppliers",
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
        json={
            "name": "USA Meat",
            "country": "USA",
            "categories": ["carne"],
            "rate_per_unit": 5.0,
            "currency": "USD",
            "status": "active",
        },
    )

    all_response = client.get("/suppliers")
    assert all_response.status_code == 200
    assert len(all_response.json()) == 2

    country_response = client.get("/suppliers", params={"country": "Colombia"})
    assert country_response.status_code == 200
    assert len(country_response.json()) == 1
    assert country_response.json()[0]["country"] == "Colombia"

    category_response = client.get("/suppliers", params={"category": "carne"})
    assert category_response.status_code == 200
    assert len(category_response.json()) == 2


def test_get_update_delete_not_found(client: TestClient) -> None:
    assert client.get("/suppliers/999").status_code == 404
    assert client.patch("/suppliers/999/rate", json={"rate_per_unit": 10}).status_code == 404
    assert client.patch("/suppliers/999/status", json={"status": "suspended"}).status_code == 404
    assert client.delete("/suppliers/999").status_code == 404


def test_rate_patch_updates_timestamp(client: TestClient) -> None:
    create = client.post(
        "/suppliers",
        json={
            "name": "Rate Supplier",
            "country": "USA",
            "categories": ["packaging"],
            "rate_per_unit": 1.0,
            "currency": "USD",
            "status": "active",
        },
    )
    supplier_id = create.json()["id"]
    original_updated_at = create.json()["updated_at"]

    patch = client.patch(
        f"/suppliers/{supplier_id}/rate",
        json={"rate_per_unit": 2.5},
    )
    assert patch.status_code == 200
    assert patch.json()["rate_per_unit"] == 2.5
    assert patch.json()["updated_at"] != original_updated_at


def test_status_patch(client: TestClient) -> None:
    create = client.post(
        "/suppliers",
        json={
            "name": "Status Supplier",
            "country": "Colombia",
            "categories": ["bebidas"],
            "rate_per_unit": 100.0,
            "currency": "COP",
            "status": "active",
        },
    )
    supplier_id = create.json()["id"]

    patch = client.patch(
        f"/suppliers/{supplier_id}/status",
        json={"status": "suspended"},
    )
    assert patch.status_code == 200
    assert patch.json()["status"] == "suspended"


def test_delete_supplier(client: TestClient) -> None:
    create = client.post(
        "/suppliers",
        json={
            "name": "Delete Me",
            "country": "Colombia",
            "categories": ["lacteos"],
            "rate_per_unit": 50.0,
            "currency": "COP",
            "status": "active",
        },
    )
    supplier_id = create.json()["id"]
    assert client.delete(f"/suppliers/{supplier_id}").status_code == 200
    assert client.get(f"/suppliers/{supplier_id}").status_code == 404


def test_seed_idempotent(client: TestClient, tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    db_path = tmp_path / "seed-test.json"
    monkeypatch.setenv("SUPPLIERS_DB_PATH", str(db_path))

    from seed import run_seed

    first = run_seed()
    second = run_seed()
    assert first == 15
    assert second == 0

    list_response = client.get("/suppliers")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 15
