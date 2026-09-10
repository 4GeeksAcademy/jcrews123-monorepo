from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from jose import jwt

from test_helpers import auth_headers, login_user, register_user


def test_register_login_and_me(client: TestClient) -> None:
    register_user(client, email="me@brasaland.com")
    token = login_user(client, email="me@brasaland.com")

    me = client.get("/auth/me", headers=auth_headers(token))
    assert me.status_code == 200
    data = me.json()
    assert data["email"] == "me@brasaland.com"
    assert data["role"] == "user"
    assert data["profile"]["name"] == "Ops User"


def test_duplicate_registration_rejected(client: TestClient) -> None:
    register_user(client, email="dup@brasaland.com")
    response = client.post(
        "/users",
        json={"email": "dup@brasaland.com", "password": "secret123"},
    )
    assert response.status_code == 400


def test_login_invalid_password(client: TestClient) -> None:
    register_user(client, email="bad@brasaland.com")
    response = client.post(
        "/auth/login",
        json={"email": "bad@brasaland.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_protected_route_without_token(client: TestClient) -> None:
    response = client.get("/suppliers")
    assert response.status_code == 401


def test_protected_route_with_invalid_token(client: TestClient) -> None:
    response = client.get("/suppliers", headers=auth_headers("not-a-valid-token"))
    assert response.status_code == 401


def test_protected_route_with_expired_token(client: TestClient) -> None:
    register_user(client, email="expired@brasaland.com")
    expired_token = jwt.encode(
        {"sub": "1", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        "test-secret-key-for-pytest",
        algorithm="HS256",
    )
    response = client.get("/suppliers", headers=auth_headers(expired_token))
    assert response.status_code == 401


def test_cross_user_update_forbidden(client: TestClient) -> None:
    first = register_user(client, email="owner@brasaland.com")
    token = login_user(client, email="owner@brasaland.com")
    register_user(client, email="other@brasaland.com", name="Other User")

    response = client.put(
        f"/users/{first['id'] + 1}",
        json={"email": "hacked@brasaland.com"},
        headers=auth_headers(token),
    )
    assert response.status_code == 403


def test_profile_update_for_owner(client: TestClient) -> None:
    register_user(client, email="profile@brasaland.com")
    token = login_user(client, email="profile@brasaland.com")

    response = client.put(
        "/profiles/me",
        json={"name": "Updated Name", "phone": "555-0100"},
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"


def test_password_is_hashed_in_database(client: TestClient) -> None:
    register_user(client, email="hash@brasaland.com", password="secret123")

    from auth_database import get_auth_db, get_user_by_email

    user = get_user_by_email(get_auth_db(), "hash@brasaland.com")
    assert user is not None
    assert user["hashed_password"] != "secret123"


def test_malformed_jwt_rejected(client: TestClient) -> None:
    payload = {"sub": "1", "exp": datetime.now(timezone.utc) + timedelta(minutes=5)}
    bad_token = jwt.encode(payload, "wrong-secret", algorithm="HS256")
    response = client.get("/auth/me", headers=auth_headers(bad_token))
    assert response.status_code == 401
