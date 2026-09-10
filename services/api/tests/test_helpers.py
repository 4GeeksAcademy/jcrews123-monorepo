from __future__ import annotations

from fastapi.testclient import TestClient


def register_user(
    client: TestClient,
    email: str = "ops@brasaland.com",
    password: str = "secret123",
    name: str = "Ops User",
) -> dict:
    response = client.post(
        "/users",
        json={
            "email": email,
            "password": password,
            "name": name,
            "phone": "+57 300 000 0000",
            "address": "Medellín HQ",
        },
    )
    assert response.status_code == 201
    return response.json()


def login_user(
    client: TestClient,
    email: str = "ops@brasaland.com",
    password: str = "secret123",
) -> str:
    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}
