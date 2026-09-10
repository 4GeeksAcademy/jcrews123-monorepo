import { apiFetch } from "@/lib/api-client";

export type SupplierStatus = "active" | "suspended";

export type Supplier = {
  id: number;
  name: string;
  country: "Colombia" | "USA";
  categories: string[];
  rate_per_unit: number;
  currency: "COP" | "USD";
  updated_at: string;
  status: SupplierStatus;
  contact_email?: string | null;
  notes?: string | null;
};

export type SupplierCreateInput = {
  name: string;
  country: "Colombia" | "USA";
  categories: string[];
  rate_per_unit: number;
  currency: "COP" | "USD";
  status: SupplierStatus;
  contact_email?: string;
  notes?: string;
};

export const SUPPLIER_CATEGORIES = [
  "carne",
  "verduras_y_hortalizas",
  "salsas_y_condimentos",
  "bebidas",
  "packaging",
  "productos_limpieza",
  "lacteos",
  "carbon_y_combustible",
] as const;

export const SUPPLIER_COUNTRIES = ["Colombia", "USA"] as const;

export async function fetchSuppliers(filters?: {
  country?: string;
  category?: string;
}): Promise<Supplier[]> {
  const params = new URLSearchParams();
  if (filters?.country) params.set("country", filters.country);
  if (filters?.category) params.set("category", filters.category);

  const query = params.toString();
  const path = query ? `/suppliers?${query}` : "/suppliers";
  return apiFetch<Supplier[]>(path);
}

export async function createSupplier(
  input: SupplierCreateInput,
): Promise<Supplier> {
  return apiFetch<Supplier>("/suppliers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateSupplierRate(
  id: number,
  rate_per_unit: number,
): Promise<Supplier> {
  return apiFetch<Supplier>(`/suppliers/${id}/rate`, {
    method: "PATCH",
    body: JSON.stringify({ rate_per_unit }),
  });
}

export async function updateSupplierStatus(
  id: number,
  status: SupplierStatus,
): Promise<Supplier> {
  return apiFetch<Supplier>(`/suppliers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function formatCategory(label: string): string {
  return label.replace(/_/g, " ");
}

export function currencyForCountry(country: "Colombia" | "USA"): "COP" | "USD" {
  return country === "Colombia" ? "COP" : "USD";
}
