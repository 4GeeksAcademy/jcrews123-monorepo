VALID_LOCATIONS = frozenset(
    [f"COL-{i:02d}" for i in range(1, 11)] + [f"FLA-{i:02d}" for i in range(1, 5)]
)

VALID_CATEGORIES = frozenset(
    {
        "CUSTOMER_COMPLAINT",
        "EQUIPMENT",
        "SUPPLY",
        "FOOD_QUALITY",
        "STAFF",
    }
)

VALID_STATUSES = frozenset({"OPEN", "CLOSED", "DISCARDED"})

CATEGORY_ORDER = [
    "CUSTOMER_COMPLAINT",
    "EQUIPMENT",
    "SUPPLY",
    "FOOD_QUALITY",
    "STAFF",
]

STATUS_ORDER = ["OPEN", "CLOSED", "DISCARDED"]

MIN_DESCRIPTION_LENGTH = 5
MIN_SATISFACTION_SCORE = 1
MAX_SATISFACTION_SCORE = 5

REQUIRED_FIELDS = (
    "incident_id",
    "date",
    "location_id",
    "category",
    "description",
    "status",
    "reporter_id",
)
