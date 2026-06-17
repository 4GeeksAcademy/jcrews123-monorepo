import type {
  Location,
  MenuCategory,
  MenuItem,
  SaleTransaction,
} from "../types/models.js";

export function filterSalesByLocation(
  sales: SaleTransaction[],
  locationId: string,
): SaleTransaction[] {
  return sales.filter((sale) => sale.locationId === locationId);
}

export function filterSalesByDateRange(
  sales: SaleTransaction[],
  startDate: Date,
  endDate: Date,
): SaleTransaction[] {
  const startKey = utcDateKey(startDate);
  const endKey = utcDateKey(endDate);

  return sales.filter((sale) => {
    const key = utcDateKey(sale.timestamp);
    return key >= startKey && key <= endKey;
  });
}

export function filterMenuItemsByCategory(
  items: MenuItem[],
  category: MenuCategory,
): MenuItem[] {
  return items.filter((item) => item.category === category);
}

export function filterActiveLocations(locations: Location[]): Location[] {
  return locations.filter((location) => location.status === "Active");
}

export function sortLocationsByCapacity(
  locations: Location[],
  order: "asc" | "desc",
): Location[] {
  const sorted = [...locations].sort(
    (a, b) => a.seatingCapacity - b.seatingCapacity,
  );
  return order === "desc" ? sorted.reverse() : sorted;
}

export function sortMenuItemsByPrice(
  items: MenuItem[],
  currency: "USD" | "COP",
  order: "asc" | "desc",
): MenuItem[] {
  const sorted = [...items].sort(
    (a, b) => a.basePrice[currency] - b.basePrice[currency],
  );
  return order === "desc" ? sorted.reverse() : sorted;
}

function utcDateKey(date: Date): number {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
}
