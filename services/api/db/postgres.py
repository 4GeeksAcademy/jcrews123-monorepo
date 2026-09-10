from __future__ import annotations

from sqlmodel import Session, SQLModel, create_engine

from core.config import get_database_url

_engine = None


def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(get_database_url(), echo=False)
    return _engine


def reset_engine() -> None:
    """Clear cached engine (used in tests when DATABASE_URL changes)."""
    global _engine
    _engine = None


def create_inventory_tables() -> None:
    from models.inventory import Ingredient, IngredientEntry, IngredientExit  # noqa: F401

    SQLModel.metadata.create_all(get_engine())


def get_session() -> Session:
    return Session(get_engine())
