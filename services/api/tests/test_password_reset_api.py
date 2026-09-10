from __future__ import annotations

from fastapi.testclient import TestClient

from test_helpers import auth_headers, login_user, register_user


def test_forgot_password_unknown_email_returns_200(client: TestClient) -> None:
    response = client.post(
        "/auth/forgot-password",
        json={"email": "missing@brasaland.com"},
    )
    assert response.status_code == 200
    assert "If that address is registered" in response.json()["detail"]


def test_forgot_password_known_email_returns_same_message(
    client: TestClient, monkeypatch
) -> None:
    sent: list[tuple[str, str]] = []

    def fake_send(to_email: str, reset_url: str) -> None:
        sent.append((to_email, reset_url))

    monkeypatch.setattr("routers.auth.send_reset_email", fake_send)
    register_user(client, email="reset@brasaland.com")

    response = client.post(
        "/auth/forgot-password",
        json={"email": "reset@brasaland.com"},
    )
    assert response.status_code == 200
    assert len(sent) == 1
    assert sent[0][0] == "reset@brasaland.com"
    assert "token=" in sent[0][1]


def test_reset_password_updates_and_invalidates_token(client: TestClient) -> None:
    register_user(client, email="token@brasaland.com", password="secret123")

    from services.password_reset import create_reset_token

    from auth_database import get_auth_db

    result = create_reset_token(get_auth_db(), "token@brasaland.com")
    assert result is not None
    raw_token, _ = result

    reset = client.post(
        "/auth/reset-password",
        json={"token": raw_token, "new_password": "newsecret99"},
    )
    assert reset.status_code == 200

    old_login = client.post(
        "/auth/login",
        json={"email": "token@brasaland.com", "password": "secret123"},
    )
    assert old_login.status_code == 401

    new_login = client.post(
        "/auth/login",
        json={"email": "token@brasaland.com", "password": "newsecret99"},
    )
    assert new_login.status_code == 200

    reused = client.post(
        "/auth/reset-password",
        json={"token": raw_token, "new_password": "anothersecret99"},
    )
    assert reused.status_code == 400


def test_change_password_wrong_current_password(client: TestClient) -> None:
    register_user(client, email="change@brasaland.com", password="secret123")
    token = login_user(client, email="change@brasaland.com")

    response = client.post(
        "/auth/change-password",
        headers=auth_headers(token),
        json={"current_password": "wrong", "new_password": "newsecret99"},
    )
    assert response.status_code == 400


def test_change_password_success(client: TestClient) -> None:
    register_user(client, email="changed@brasaland.com", password="secret123")
    token = login_user(client, email="changed@brasaland.com")

    response = client.post(
        "/auth/change-password",
        headers=auth_headers(token),
        json={"current_password": "secret123", "new_password": "newsecret99"},
    )
    assert response.status_code == 200

    login = client.post(
        "/auth/login",
        json={"email": "changed@brasaland.com", "password": "newsecret99"},
    )
    assert login.status_code == 200
