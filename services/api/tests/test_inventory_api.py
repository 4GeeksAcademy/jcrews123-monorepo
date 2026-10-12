from __future__ import annotations

from decimal import Decimal

from test_helpers import auth_headers, login_user, register_user


def test_inventory_requires_auth(client):
    response = client.get("/inventory/products")
    assert response.status_code == 401


def test_create_ingredient_and_zero_stock(client, auth_token):
    response = client.post(
        "/inventory/products",
        headers=auth_headers(auth_token),
        json={
            "name": "Test spice",
            "sku": "BRS-TEST-001",
            "unit": "kg",
            "category": "sauce",
            "country": "CO",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert Decimal(str(body["current_stock"])) == Decimal("0")


def test_inbound_increases_stock(client, auth_token):
    create = client.post(
        "/inventory/products",
        headers=auth_headers(auth_token),
        json={
            "name": "Rice",
            "sku": "BRS-RICE-001",
            "unit": "kg",
            "category": "produce",
            "country": "CO",
        },
    )
    ingredient_id = create.json()["id"]

    inbound = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers(auth_token),
        json={
            "ingredient_id": ingredient_id,
            "quantity": 12.5,
            "supplier_name": "Grains Co.",
            "unit_cost": 4500,
            "currency": "COP",
            "location_id": 3,
        },
    )
    assert inbound.status_code == 201

    listed = client.get("/inventory/products", headers=auth_headers(auth_token))
    row = next(item for item in listed.json() if item["id"] == ingredient_id)
    assert Decimal(str(row["current_stock"])) == Decimal("12.5")


def test_outbound_rejects_insufficient_stock(client, auth_token):
    create = client.post(
        "/inventory/products",
        headers=auth_headers(auth_token),
        json={
            "name": "Lettuce",
            "sku": "BRS-LETT-001",
            "unit": "kg",
            "category": "produce",
            "country": "US",
        },
    )
    ingredient_id = create.json()["id"]

    response = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers(auth_token),
        json={
            "ingredient_id": ingredient_id,
            "quantity": 1,
            "reason": "consumption",
            "location_id": 11,
        },
    )
    assert response.status_code == 400
    assert "Insufficient stock for ingredient 'Lettuce'" in response.json()["detail"]


def test_outbound_stores_user_uuid(client, auth_token):
    register_user(client, email="ops@brasaland.dev")
    token = login_user(client, email="ops@brasaland.dev")

    create = client.post(
        "/inventory/products",
        headers=auth_headers(token),
        json={
            "name": "Oil",
            "sku": "BRS-OIL-001",
            "unit": "litre",
            "category": "sauce",
            "country": "CO",
        },
    )
    ingredient_id = create.json()["id"]
    client.post(
        "/inventory/orders/inbound",
        headers=auth_headers(token),
        json={
            "ingredient_id": ingredient_id,
            "quantity": 5,
            "supplier_name": "Oil Supplier",
            "unit_cost": 12000,
            "currency": "COP",
            "location_id": 1,
        },
    )
    outbound = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers(token),
        json={
            "ingredient_id": ingredient_id,
            "quantity": 2,
            "reason": "waste",
            "waste_reason": "kitchen_error",
            "location_id": 1,
        },
    )
    assert outbound.status_code == 201
    assert outbound.json()["user_uuid"]
    assert outbound.json()["reason"] == "waste"


def test_duplicate_sku_conflict(client, auth_token):
    payload = {
        "name": "Duplicate A",
        "sku": "BRS-DUP-001",
        "unit": "kg",
        "category": "meat",
        "country": "CO",
    }
    first = client.post(
        "/inventory/products", headers=auth_headers(auth_token), json=payload
    )
    assert first.status_code == 201
    second = client.post(
        "/inventory/products", headers=auth_headers(auth_token), json=payload
    )
    assert second.status_code == 409


def test_list_orders_includes_product_name(client, auth_token):
    create = client.post(
        "/inventory/products",
        headers=auth_headers(auth_token),
        json={
            "name": "Tomato",
            "sku": "BRS-TOM-001",
            "unit": "kg",
            "category": "produce",
            "country": "CO",
        },
    )
    ingredient_id = create.json()["id"]
    client.post(
        "/inventory/orders/inbound",
        headers=auth_headers(auth_token),
        json={
            "ingredient_id": ingredient_id,
            "quantity": 3,
            "supplier_name": "Farm Fresh",
            "unit_cost": 5000,
            "currency": "COP",
            "location_id": 2,
        },
    )

    orders = client.get("/inventory/orders", headers=auth_headers(auth_token))
    assert orders.status_code == 200
    assert any(row["product_name"] == "Tomato" for row in orders.json())


def test_seed_net_stock(client, auth_token):
    from inventory_seed import seed_inventory

    seed_inventory()
    products = client.get("/inventory/products", headers=auth_headers(auth_token))
    beef = next(row for row in products.json() if row["sku"] == "BRS-BEEF-001")
    assert Decimal(str(beef["current_stock"])) == Decimal("40")


def test_price_variance_and_threshold_flags(client, auth_token):
    created = client.post(
        "/inventory/products",
        headers=auth_headers(auth_token),
        json={
            "name": "Telemetry beef",
            "sku": "BRS-TEL-001",
            "unit": "kg",
            "category": "meat",
            "country": "CO",
            "min_stock": 5,
        },
    )
    ingredient_id = created.json()["id"]
    base = {
        "ingredient_id": ingredient_id,
        "quantity": 10,
        "supplier_name": "Telemetry Supplier",
        "currency": "COP",
        "location_id": 1,
    }
    first = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers(auth_token),
        json={**base, "unit_cost": 100},
    )
    second = client.post(
        "/inventory/orders/inbound",
        headers=auth_headers(auth_token),
        json={**base, "unit_cost": 120},
    )
    assert first.json()["price_variance_detected"] is False
    assert second.json()["price_variance_detected"] is True
    assert Decimal(str(second.json()["variance_percent"])) == Decimal("20")

    outbound = client.post(
        "/inventory/orders/outbound",
        headers=auth_headers(auth_token),
        json={
            "ingredient_id": ingredient_id,
            "quantity": 16,
            "reason": "consumption",
            "location_id": 1,
        },
    )
    assert outbound.status_code == 201
    assert outbound.json()["threshold_triggered"] is True
    assert Decimal(str(outbound.json()["stock_after"])) == Decimal("4")


def test_direct_stock_edit_is_always_rejected(client, auth_token):
    created = client.post(
        "/inventory/products",
        headers=auth_headers(auth_token),
        json={
            "name": "Protected stock",
            "sku": "BRS-TEL-002",
            "unit": "unit",
            "category": "packaging",
            "country": "CO",
        },
    )
    response = client.patch(
        f"/inventory/products/{created.json()['id']}/stock",
        headers=auth_headers(auth_token),
        json={"quantity": 99, "location_id": 1},
    )
    assert response.status_code == 403
    assert "cannot be edited directly" in response.json()["detail"]
