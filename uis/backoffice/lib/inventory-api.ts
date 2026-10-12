import { apiFetch } from "@/lib/api-client";

export type IngredientCategory =
  | "meat"
  | "produce"
  | "sauce"
  | "beverage"
  | "packaging"
  | "cleaning";

export type IngredientCountry = "CO" | "US";
export type ExitReason = "consumption" | "waste";
export type WasteReason = "expired" | "kitchen_error" | "theft_suspected";
export type OrderType = "inbound" | "outbound";

export type Ingredient = {
  id: number;
  name: string;
  sku: string;
  unit: string;
  category: IngredientCategory;
  country: IngredientCountry;
  current_stock: number;
  min_stock: number;
};

export type InboundOrderCreate = {
  ingredient_id: number;
  quantity: number;
  supplier_name: string;
  unit_cost: number;
  currency: "COP" | "USD";
  location_id: number;
};

export type OutboundOrderCreate = {
  ingredient_id: number;
  quantity: number;
  reason: ExitReason;
  waste_reason?: WasteReason;
  location_id: number;
};

export type InventoryOrder = {
  id: number;
  order_type: OrderType;
  ingredient_id: number;
  product_name: string;
  product_category: IngredientCategory;
  unit: string;
  country: IngredientCountry;
  currency: "COP" | "USD";
  quantity: number;
  user_uuid: string;
  created_at: string;
  location_id: number;
  supplier_name?: string | null;
  reason?: ExitReason | null;
  waste_reason?: WasteReason | null;
  unit_cost?: number | null;
  previous_unit_cost?: number | null;
  variance_percent?: number | null;
  price_variance_detected: boolean;
  min_stock: number;
  stock_after: number;
  threshold_triggered: boolean;
};

export function stockStatus(
  stock: number,
  minStock: number,
): "healthy" | "low" | "critical" {
  if (stock <= minStock / 2) return "critical";
  if (stock < minStock) return "low";
  return "healthy";
}

export async function fetchIngredients(): Promise<Ingredient[]> {
  return apiFetch<Ingredient[]>("/inventory/products");
}

export async function fetchIngredient(id: number): Promise<Ingredient> {
  return apiFetch<Ingredient>(`/inventory/products/${id}`);
}

export async function createInboundOrder(
  input: InboundOrderCreate,
): Promise<InventoryOrder> {
  return apiFetch<InventoryOrder>("/inventory/orders/inbound", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createOutboundOrder(
  input: OutboundOrderCreate,
): Promise<InventoryOrder> {
  return apiFetch<InventoryOrder>("/inventory/orders/outbound", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchOrders(): Promise<InventoryOrder[]> {
  return apiFetch<InventoryOrder[]>("/inventory/orders");
}

export async function attemptDirectStockEdit(
  ingredientId: number,
  quantity: number,
  locationId: number,
): Promise<never> {
  return apiFetch<never>(`/inventory/products/${ingredientId}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ quantity, location_id: locationId }),
  });
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  "meat",
  "produce",
  "sauce",
  "beverage",
  "packaging",
  "cleaning",
];

export const LOCATION_IDS = Array.from({ length: 14 }, (_, index) => index + 1);

export function marketForLocation(locationId: number): {
  country: IngredientCountry;
  currency: "COP" | "USD";
} {
  return locationId <= 10
    ? { country: "CO", currency: "COP" }
    : { country: "US", currency: "USD" };
}
