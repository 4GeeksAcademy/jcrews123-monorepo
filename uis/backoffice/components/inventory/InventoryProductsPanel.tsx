"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  fetchIngredients,
  stockStatus,
  type Ingredient,
} from "@/lib/inventory-api";

function stockBadge(stock: number) {
  const status = stockStatus(stock);
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
              <td className="px-4 py-3">{stockBadge(ingredient.current_stock)}</td>
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
