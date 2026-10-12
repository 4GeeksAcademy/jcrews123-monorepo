from __future__ import annotations

from collections.abc import Mapping
from typing import Any

SCHEMA_VERSION = "1.0.0"

INVENTORY_REQUIRED = {
    "location_id",
    "country",
    "product_id",
    "product_category",
    "quantity",
    "unit",
    "currency",
}

EVENT_REQUIRED: dict[str, set[str]] = {
    "inbound_order_created": INVENTORY_REQUIRED | {"supplier_id", "unit_cost"},
    "outbound_order_created": INVENTORY_REQUIRED | {"reason"},
    "stock_waste_registered": INVENTORY_REQUIRED | {"reason"},
    "stock_threshold_triggered": INVENTORY_REQUIRED | {"min_stock", "stock_after"},
    "direct_stock_edit_rejected": INVENTORY_REQUIRED | {"rejection_reason"},
    "ingredient_price_variance_detected": INVENTORY_REQUIRED
    | {"supplier_id", "unit_cost", "previous_unit_cost", "variance_percent"},
    "user_login_succeeded": {"auth_method"},
    "user_login_failed": {"failure_reason"},
    "session_expired": {"route"},
    "page_viewed": {"route", "section"},
    "frontend_error": {"error_kind", "route", "message_code"},
    "api_request_failed": {"endpoint", "method", "status"},
    "api_latency_recorded": {"endpoint", "method", "duration_ms", "status"},
    "web_vital_recorded": {"metric", "value", "rating", "route"},
    "inventory_validation_failed": {"form", "field", "error_code"},
    "inventory_flow_abandoned": {"form", "stage"},
}

ENUMS: dict[tuple[str, str], set[Any]] = {
    ("*", "country"): {"CO", "US"},
    ("*", "currency"): {"COP", "USD"},
    (
        "*",
        "product_category",
    ): {"meat", "produce", "sauce", "beverage", "packaging", "cleaning"},
    ("outbound_order_created", "reason"): {"consumption"},
    (
        "stock_waste_registered",
        "reason",
    ): {"expired", "kitchen_error", "theft_suspected"},
    ("direct_stock_edit_rejected", "rejection_reason"): {"order_required"},
    ("user_login_succeeded", "auth_method"): {"password"},
    (
        "user_login_failed",
        "failure_reason",
    ): {"invalid_credentials", "session_expired", "network_error"},
    ("frontend_error", "error_kind"): {"error", "unhandled_rejection"},
    ("*", "method"): {"GET", "POST", "PUT", "PATCH", "DELETE"},
    ("web_vital_recorded", "metric"): {"CLS", "FCP", "FID", "INP", "LCP", "TTFB"},
    (
        "web_vital_recorded",
        "rating",
    ): {"good", "needs-improvement", "poor"},
    (
        "inventory_validation_failed",
        "form",
    ): {"inbound_order", "outbound_order", "stock_adjustment"},
    (
        "inventory_flow_abandoned",
        "form",
    ): {"inbound_order", "outbound_order", "stock_adjustment"},
    (
        "inventory_flow_abandoned",
        "stage",
    ): {"started", "details_entered", "submit_failed"},
}

INTEGER_KEYS = {"location_id", "product_id", "status"}
NUMBER_KEYS = {
    "quantity",
    "unit_cost",
    "previous_unit_cost",
    "variance_percent",
    "min_stock",
    "stock_after",
    "duration_ms",
    "value",
}

LEVEL_BY_EVENT = {
    "frontend_error": "error",
    "api_request_failed": "warn",
    "user_login_failed": "warn",
    "session_expired": "warn",
    "inventory_validation_failed": "warn",
    "direct_stock_edit_rejected": "warn",
    "stock_threshold_triggered": "warn",
    "ingredient_price_variance_detected": "warn",
}


def validate_properties(event_type: str, properties: Mapping[str, Any]) -> None:
    required = EVENT_REQUIRED.get(event_type)
    if required is None:
        raise ValueError(f"Unknown event_type: {event_type}")

    actual = set(properties)
    if actual != required:
        missing = sorted(required - actual)
        extra = sorted(actual - required)
        raise ValueError(f"Invalid properties; missing={missing}, extra={extra}")

    for key, value in properties.items():
        if key in INTEGER_KEYS and (
            isinstance(value, bool) or not isinstance(value, int)
        ):
            raise ValueError(f"{key} must be an integer")
        if key in NUMBER_KEYS and (
            isinstance(value, bool) or not isinstance(value, (int, float))
        ):
            raise ValueError(f"{key} must be numeric")
        if key not in INTEGER_KEYS | NUMBER_KEYS and not isinstance(value, str):
            raise ValueError(f"{key} must be a string")

        allowed = ENUMS.get((event_type, key), ENUMS.get(("*", key)))
        if allowed is not None and value not in allowed:
            raise ValueError(f"{key} has an unsupported value")

    location_id = properties.get("location_id")
    if location_id is not None and not 1 <= location_id <= 14:
        raise ValueError("location_id must be between 1 and 14")
    status = properties.get("status")
    if status is not None and not 0 <= status <= 599:
        raise ValueError("status must be between 0 and 599")
    for key in ("quantity", "unit_cost", "previous_unit_cost"):
        if key in properties and properties[key] <= 0:
            raise ValueError(f"{key} must be greater than zero")
    for key in ("min_stock", "stock_after", "duration_ms"):
        if key in properties and properties[key] < 0:
            raise ValueError(f"{key} cannot be negative")


def event_level(event_type: str) -> str:
    return LEVEL_BY_EVENT.get(event_type, "info")


def event_value(event_type: str, properties: Mapping[str, Any]) -> float | None:
    key = {
        "api_latency_recorded": "duration_ms",
        "web_vital_recorded": "value",
        "ingredient_price_variance_detected": "variance_percent",
    }.get(event_type)
    return float(properties[key]) if key else None
