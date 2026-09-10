"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  LOCATION_IDS,
  createOutboundOrder,
  fetchIngredient,
  fetchIngredients,
  type ExitReason,
  type Ingredient,
} from "@/lib/inventory-api";

export function OutboundOrderForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("ingredient");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientId, setIngredientId] = useState(preselected ?? "");
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState<ExitReason>("consumption");
  const [locationId, setLocationId] = useState("1");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    void (async () => {
      try {
        const data = await fetchIngredients();
        if (!ignore) {
          setIngredients(data);
          if (preselected) setIngredientId(preselected);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Could not load ingredients.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [preselected]);

  useEffect(() => {
    if (!ingredientId) return;

    let ignore = false;
    const selectedId = Number(ingredientId);

    void (async () => {
      try {
        const ingredient = await fetchIngredient(selectedId);
        if (ignore) return;
        setAvailableStock(ingredient.current_stock);
        setError(null);
      } catch (err) {
        if (ignore) return;
        setAvailableStock(null);
        setError(
          err instanceof Error ? err.message : "Could not load current stock.",
        );
      }
    })();

    return () => {
      ignore = true;
    };
  }, [ingredientId]);

  const clientWarning = useMemo(() => {
    const parsed = Number(quantity);
    if (
      availableStock !== null &&
      Number.isFinite(parsed) &&
      parsed > availableStock
    ) {
      return `Requested quantity (${parsed}) exceeds available stock (${availableStock}).`;
    }
    return null;
  }, [quantity, availableStock]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be greater than zero.");
      setSubmitting(false);
      return;
    }

    try {
      await createOutboundOrder({
        ingredient_id: Number(ingredientId),
        quantity: parsedQuantity,
        reason,
        location_id: Number(locationId),
      });
      setSuccess("Exit registered successfully.");
      setQuantity("");
      const refreshed = await fetchIngredient(Number(ingredientId));
      setAvailableStock(refreshed.current_stock);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register exit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-600">Loading form…</p>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="block text-sm text-slate-700">
        Ingredient
        <select
          required
          value={ingredientId}
          onChange={(event) => {
            const next = event.target.value;
            setIngredientId(next);
            if (!next) setAvailableStock(null);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Select ingredient</option>
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name} ({ingredient.sku})
            </option>
          ))}
        </select>
      </label>

      {availableStock !== null ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
          Available stock: <span className="font-semibold">{availableStock}</span>
        </p>
      ) : null}

      <label className="block text-sm text-slate-700">
        Quantity
        <input
          type="number"
          min="0.001"
          step="0.001"
          required
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      {clientWarning ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">
          {clientWarning}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <label className="block text-sm text-slate-700">
        Reason
        <select
          required
          value={reason}
          onChange={(event) => setReason(event.target.value as ExitReason)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="consumption">Consumption</option>
          <option value="waste">Waste</option>
        </select>
      </label>

      <label className="block text-sm text-slate-700">
        Location (1–14)
        <select
          required
          value={locationId}
          onChange={(event) => setLocationId(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          {LOCATION_IDS.map((id) => (
            <option key={id} value={id}>
              Location {id}
            </option>
          ))}
        </select>
      </label>

      {success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || ingredients.length === 0}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Register exit"}
      </button>
    </form>
  );
}
