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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

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

async function parseError(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    detail?: string | { msg?: string }[];
  } | null;
  if (!body?.detail) return fallback;
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail) && body.detail[0]?.msg) {
    return body.detail[0].msg;
  }
  return fallback;
}

export async function fetchSuppliers(filters?: {
  country?: string;
  category?: string;
}): Promise<Supplier[]> {
  const params = new URLSearchParams();
  if (filters?.country) params.set("country", filters.country);
  if (filters?.category) params.set("category", filters.category);

  const query = params.toString();
  const url = query ? `${API_BASE}/suppliers?${query}` : `${API_BASE}/suppliers`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load suppliers."));
  }
  return response.json() as Promise<Supplier[]>;
}

export async function createSupplier(
  input: SupplierCreateInput,
): Promise<Supplier> {
  const response = await fetch(`${API_BASE}/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to create supplier."));
  }
  return response.json() as Promise<Supplier>;
}

export async function updateSupplierRate(
  id: number,
  rate_per_unit: number,
): Promise<Supplier> {
  const response = await fetch(`${API_BASE}/suppliers/${id}/rate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rate_per_unit }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update rate."));
  }
  return response.json() as Promise<Supplier>;
}

export async function updateSupplierStatus(
  id: number,
  status: SupplierStatus,
): Promise<Supplier> {
  const response = await fetch(`${API_BASE}/suppliers/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update status."));
  }
  return response.json() as Promise<Supplier>;
}

export function formatCategory(label: string): string {
  return label.replace(/_/g, " ");
}

export function currencyForCountry(country: "Colombia" | "USA"): "COP" | "USD" {
  return country === "Colombia" ? "COP" : "USD";
}
