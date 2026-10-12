"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  attemptDirectStockEdit,
  fetchIngredients,
  marketForLocation,
  stockStatus,
  type Ingredient,
} from "@/lib/inventory-api";
import { track } from "@/lib/telemetry";

function stockBadge(stock: number, minStock: number) {
  const status = stockStatus(stock, minStock);
  if (status === "critical") {
    return (
      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
        Critical
      </span>
    );
  }
  if (status === "low") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        Low
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
      Healthy
    </span>
  );
}

export function InventoryProductsPanel() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const attemptStockAdjustment = async (ingredient: Ingredient) => {
    const quantity = Number(window.prompt("Requested stock level"));
    const defaultLocation = ingredient.country === "CO" ? 1 : 11;
    const locationId = Number(
      window.prompt("Location ID (1–14)", String(defaultLocation)),
    );
    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isInteger(locationId) ||
      locationId < 1 ||
      locationId > 14
    ) {
      track("inventory_validation_failed", {
        form: "stock_adjustment",
        field: "quantity",
        error_code: "invalid_adjustment",
      });
      return;
    }
    const market = marketForLocation(locationId);
    try {
      await attemptDirectStockEdit(ingredient.id, quantity, locationId);
    } catch {
      track("direct_stock_edit_rejected", {
        location_id: locationId,
        country: market.country,
        product_id: ingredient.id,
        product_category: ingredient.category,
        quantity,
        unit: ingredient.unit,
        currency: market.currency,
        rejection_reason: "order_required",
      });
      setNotice(
        "Direct edits are blocked. Register an inbound or outbound order instead.",
      );
    }
  };

  useEffect(() => {
    let ignore = false;

    void (async () => {
      try {
        const data = await fetchIngredients();
        if (!ignore) {
          setIngredients(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to load ingredients.",
          );
          setIngredients([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-600">Loading ingredients…</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (ingredients.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600">
        No ingredients registered yet. Run the API seed or create products via the API.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {notice ? (
        <p className="border-b border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {notice}
        </p>
      ) : null}
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Ingredient</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="px-4 py-3 font-medium text-slate-900">
                {ingredient.name}
              </td>
              <td className="px-4 py-3 font-mono text-slate-600">{ingredient.sku}</td>
              <td className="px-4 py-3 capitalize text-slate-600">
                {ingredient.category}
              </td>
              <td className="px-4 py-3 text-slate-600">{ingredient.country}</td>
              <td className="px-4 py-3 text-slate-900">
                {ingredient.current_stock} {ingredient.unit}
              </td>
              <td className="px-4 py-3">
                {stockBadge(ingredient.current_stock, ingredient.min_stock)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/inventory/orders/inbound?ingredient=${ingredient.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Inbound
                  </Link>
                  <Link
                    href={`/inventory/orders/outbound?ingredient=${ingredient.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Outbound
                  </Link>
                  <button
                    type="button"
                    onClick={() => void attemptStockAdjustment(ingredient)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Adjust stock
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
