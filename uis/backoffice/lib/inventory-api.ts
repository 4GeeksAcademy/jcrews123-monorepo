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
export type OrderType = "inbound" | "outbound";

export type Ingredient = {
  id: number;
  name: string;
  sku: string;
  unit: string;
  category: IngredientCategory;
  country: IngredientCountry;
  current_stock: number;
};

export type InboundOrderCreate = {
  ingredient_id: number;
  quantity: number;
  supplier_name: string;
  location_id: number;
};

export type OutboundOrderCreate = {
  ingredient_id: number;
  quantity: number;
  reason: ExitReason;
  location_id: number;
};

export type InventoryOrder = {
  id: number;
  order_type: OrderType;
  ingredient_id: number;
  product_name: string;
  quantity: number;
  user_uuid: string;
  created_at: string;
  location_id: number;
  supplier_name?: string | null;
  reason?: ExitReason | null;
};

// Low-stock thresholds documented for operations staff (see syllabus brief).
export const LOW_STOCK_THRESHOLD = 10;
export const CRITICAL_STOCK_THRESHOLD = 3;

export function stockStatus(stock: number): "healthy" | "low" | "critical" {
  if (stock <= CRITICAL_STOCK_THRESHOLD) return "critical";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
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

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  "meat",
  "produce",
  "sauce",
  "beverage",
  "packaging",
  "cleaning",
];

export const LOCATION_IDS = Array.from({ length: 14 }, (_, index) => index + 1);
