"use client";

import { useEffect, useState } from "react";

import { fetchOrders, type InventoryOrder } from "@/lib/inventory-api";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function OrdersHistoryPanel() {
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    void (async () => {
      try {
        const data = await fetchOrders();
        if (!ignore) {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load orders.");
          setOrders([]);
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
    return <p className="text-sm text-slate-600">Loading order history…</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600">
        No orders recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Ingredient</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">User UUID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={`${order.order_type}-${order.id}`}>
              <td className="px-4 py-3">
                {order.order_type === "inbound" ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                    Inbound
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                    Outbound ({order.reason ?? "exit"})
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">
                {order.product_name}
              </td>
              <td className="px-4 py-3 text-slate-700">{order.quantity}</td>
              <td className="px-4 py-3 text-slate-700">{order.location_id}</td>
              <td className="px-4 py-3 text-slate-700">{formatDate(order.created_at)}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-600">
                {order.user_uuid}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
