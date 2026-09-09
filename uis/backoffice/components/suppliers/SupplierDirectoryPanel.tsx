"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SUPPLIER_CATEGORIES,
  SUPPLIER_COUNTRIES,
  createSupplier,
  currencyForCountry,
  fetchSuppliers,
  formatCategory,
  updateSupplierRate,
  updateSupplierStatus,
  type Supplier,
  type SupplierCreateInput,
  type SupplierStatus,
} from "@/lib/suppliers-api";

const emptyForm: SupplierCreateInput = {
  name: "",
  country: "Colombia",
  categories: ["carne"],
  rate_per_unit: 1,
  currency: "COP",
  status: "active",
  contact_email: "",
  notes: "",
};

function rateDraftsFromSuppliers(suppliers: Supplier[]): Record<number, string> {
  return Object.fromEntries(
    suppliers.map((supplier) => [supplier.id, String(supplier.rate_per_unit)]),
  );
}

export function SupplierDirectoryPanel() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierCreateInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [rateDrafts, setRateDrafts] = useState<Record<number, string>>({});
  const [reloadToken, setReloadToken] = useState(0);

  const refreshSuppliers = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    void (async () => {
      try {
        const data = await fetchSuppliers({
          country: countryFilter || undefined,
          category: categoryFilter || undefined,
        });
        if (ignore) return;
        setSuppliers(data);
        setRateDrafts(rateDraftsFromSuppliers(data));
        setError(null);
      } catch (err) {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Failed to load suppliers.");
        setSuppliers([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [countryFilter, categoryFilter, reloadToken]);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setFormError(null);
    try {
      const payload: SupplierCreateInput = {
        ...form,
        currency: currencyForCountry(form.country),
        contact_email: form.contact_email?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
      };
      await createSupplier(payload);
      setForm({ ...emptyForm, country: form.country, currency: currencyForCountry(form.country) });
      setLoading(true);
      refreshSuppliers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create supplier.");
    } finally {
      setCreating(false);
    }
  };

  const onRateSave = async (supplier: Supplier) => {
    const draft = rateDrafts[supplier.id];
    const nextRate = Number(draft);
    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      setError("Rate must be a positive number.");
      return;
    }
    setError(null);
    try {
      const updated = await updateSupplierRate(supplier.id, nextRate);
      setSuppliers((current) =>
        current.map((row) => (row.id === updated.id ? updated : row)),
      );
      setRateDrafts((current) => ({
        ...current,
        [updated.id]: String(updated.rate_per_unit),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update rate.");
    }
  };

  const onToggleStatus = async (supplier: Supplier) => {
    const nextStatus: SupplierStatus =
      supplier.status === "active" ? "suspended" : "active";
    setError(null);
    try {
      const updated = await updateSupplierStatus(supplier.id, nextStatus);
      setSuppliers((current) =>
        current.map((row) => (row.id === updated.id ? updated : row)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Filters
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Country</span>
            <select
              value={countryFilter}
              onChange={(event) => setCountryFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">All countries</option>
              {SUPPLIER_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Category</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">All categories</option>
              {SUPPLIER_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Register supplier
        </h3>
        <form onSubmit={(event) => void onCreate(event)} className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Country</span>
            <select
              value={form.country}
              onChange={(event) => {
                const country = event.target.value as SupplierCreateInput["country"];
                setForm((current) => ({
                  ...current,
                  country,
                  currency: currencyForCountry(country),
                }));
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {SUPPLIER_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-slate-700">Categories</span>
            <select
              multiple
              required
              value={form.categories}
              onChange={(event) => {
                const selected = Array.from(
                  event.target.selectedOptions,
                  (option) => option.value,
                );
                setForm((current) => ({ ...current, categories: selected }));
              }}
              className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {SUPPLIER_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Rate per unit</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.rate_per_unit}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  rate_per_unit: Number(event.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Currency</span>
            <input
              readOnly
              value={form.currency}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Contact email</span>
            <input
              type="email"
              value={form.contact_email ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact_email: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-slate-700">Notes</span>
            <textarea
              value={form.notes ?? ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={2}
            />
          </label>
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {creating ? "Saving…" : "Add supplier"}
            </button>
            {formError && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {formError}
              </p>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-slate-900">
            Supplier directory
          </h3>
          <p className="text-sm text-slate-600">
            {loading ? "Loading…" : `${suppliers.length} suppliers shown`}
          </p>
        </div>
        {error && (
          <p className="px-5 py-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Categories</th>
                <th className="px-5 py-3">Rate</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className={
                    supplier.status === "suspended" ? "bg-slate-50/80" : ""
                  }
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {supplier.name}
                  </td>
                  <td className="px-5 py-3 text-slate-700">{supplier.country}</td>
                  <td className="px-5 py-3 text-slate-700">
                    {supplier.categories.map(formatCategory).join(", ")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={rateDrafts[supplier.id] ?? supplier.rate_per_unit}
                        onChange={(event) =>
                          setRateDrafts((current) => ({
                            ...current,
                            [supplier.id]: event.target.value,
                          }))
                        }
                        className="w-28 rounded border border-slate-300 px-2 py-1"
                      />
                      <span className="text-slate-500">{supplier.currency}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        supplier.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void onRateSave(supplier)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                      >
                        Save rate
                      </button>
                      <button
                        type="button"
                        onClick={() => void onToggleStatus(supplier)}
                        className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50"
                      >
                        {supplier.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
