"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import {
  INGREDIENT_CATEGORIES,
  LOCATION_IDS,
  createInboundOrder,
  fetchIngredients,
  marketForLocation,
  type Ingredient,
  type IngredientCountry,
} from "@/lib/inventory-api";
import { track } from "@/lib/telemetry";

export function InboundOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("ingredient");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientId, setIngredientId] = useState(preselected ?? "");
  const [quantity, setQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [locationId, setLocationId] = useState("1");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dirtyRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(
    () => () => {
      if (dirtyRef.current && !completedRef.current) {
        track("inventory_flow_abandoned", {
          form: "inbound_order",
          stage: "details_entered",
        });
      }
    },
    [],
  );

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      track("inventory_validation_failed", {
        form: "inbound_order",
        field: "quantity",
        error_code: "not_positive",
      });
      setError("Quantity must be greater than zero.");
      setSubmitting(false);
      return;
    }
    const parsedUnitCost = Number(unitCost);
    if (!Number.isFinite(parsedUnitCost) || parsedUnitCost <= 0) {
      track("inventory_validation_failed", {
        form: "inbound_order",
        field: "unit_cost",
        error_code: "not_positive",
      });
      setError("Unit cost must be greater than zero.");
      setSubmitting(false);
      return;
    }

    const selected = ingredients.find(
      (ingredient) => ingredient.id === Number(ingredientId),
    );
    const market = marketForLocation(Number(locationId));
    if (!selected || selected.country !== market.country) {
      track("inventory_validation_failed", {
        form: "inbound_order",
        field: "location_id",
        error_code: "country_mismatch",
      });
      setError("Selected ingredient and location must be in the same country.");
      setSubmitting(false);
      return;
    }

    try {
      const order = await createInboundOrder({
        ingredient_id: Number(ingredientId),
        quantity: parsedQuantity,
        supplier_name: supplierName.trim(),
        unit_cost: parsedUnitCost,
        currency: market.currency,
        location_id: Number(locationId),
      });
      const common = {
        location_id: order.location_id,
        country: order.country,
        product_id: order.ingredient_id,
        product_category: order.product_category,
        quantity: order.quantity,
        unit: order.unit,
        currency: order.currency,
      };
      track("inbound_order_created", {
        ...common,
        supplier_id: order.supplier_name ?? supplierName.trim(),
        unit_cost: order.unit_cost ?? parsedUnitCost,
      });
      if (
        order.price_variance_detected &&
        order.previous_unit_cost != null &&
        order.variance_percent != null
      ) {
        track("ingredient_price_variance_detected", {
          ...common,
          supplier_id: order.supplier_name ?? supplierName.trim(),
          unit_cost: order.unit_cost ?? parsedUnitCost,
          previous_unit_cost: order.previous_unit_cost,
          variance_percent: order.variance_percent,
        });
      }
      completedRef.current = true;
      setSuccess("Delivery registered successfully.");
      setQuantity("");
      setSupplierName("");
      setUnitCost("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register delivery.");
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
          onChange={(event) => setIngredientId(event.target.value)}
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

      <label className="block text-sm text-slate-700">
        Quantity
        <input
          type="number"
          min="0.001"
          step="0.001"
          required
          value={quantity}
          onChange={(event) => {
            dirtyRef.current = true;
            completedRef.current = false;
            setQuantity(event.target.value);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm text-slate-700">
        Supplier name
        <input
          type="text"
          required
          value={supplierName}
          onChange={(event) => {
            dirtyRef.current = true;
            completedRef.current = false;
            setSupplierName(event.target.value);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm text-slate-700">
        Unit cost
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={unitCost}
          onChange={(event) => {
            dirtyRef.current = true;
            completedRef.current = false;
            setUnitCost(event.target.value);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
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

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
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
        {submitting ? "Saving…" : "Register delivery"}
      </button>

      <p className="text-xs text-slate-500">
        Categories in inventory: {INGREDIENT_CATEGORIES.join(", ")}. Country codes use{" "}
        {( ["CO", "US"] as IngredientCountry[]).join(" / ")}.
      </p>
    </form>
  );
}
