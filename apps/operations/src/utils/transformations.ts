import type {
  CountryComparison,
  Currency,
  Location,
  LocationPerformanceRank,
  MenuItem,
  PaymentMethod,
  SaleTransaction,
  TopSellingItem,
  WasteReason,
  WasteRecord,
} from "../types/models";
import { filterSalesByLocation } from "./collections";

const EXCHANGE_RATE = 4000;

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Credit card",
  "Debit card",
  "Digital wallet",
];

const WASTE_REASONS: WasteReason[] = [
  "Expired",
  "Cooking error",
  "Customer return",
  "Damage",
  "Other",
];

export function calculateDailyRevenue(
  sales: SaleTransaction[],
  date: Date,
  currency: Currency,
): number {
  const total = sales
    .filter((sale) => isSameUtcCalendarDay(sale.timestamp, date))
    .reduce((sum, sale) => sum + sale.totalPrice[currency], 0);

  return round2(total);
}

export function calculateLocationMargin(
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  locationId: string,
  currency: Currency,
): number {
  const locationSales = filterSalesByLocation(sales, locationId);
  const menuById = new Map(menuItems.map((item) => [item.id, item]));

  let revenue = 0;
  let ingredientCost = 0;

  for (const sale of locationSales) {
    const menuItem = menuById.get(sale.itemId);
    if (!menuItem) {
      continue;
    }

    revenue += sale.totalPrice[currency];
    ingredientCost += menuItem.ingredientCost[currency] * sale.quantity;
  }

  if (revenue === 0) {
    return 0;
  }

  return round2(((revenue - ingredientCost) / revenue) * 100);
}

export function calculateWasteCost(
  wasteRecords: WasteRecord[],
  locationId: string,
  currency: Currency,
): number {
  const total = wasteRecords
    .filter((record) => record.locationId === locationId)
    .reduce((sum, record) => sum + record.cost[currency], 0);

  return round2(total);
}

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === "USD" && toCurrency === "COP") {
    return round2(amount * EXCHANGE_RATE);
  }

  return round2(amount / EXCHANGE_RATE);
}

export function scoreLocationPerformance(
  location: Location,
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[],
): number {
  const locationSales = filterSalesByLocation(sales, location.id);
  const totalRevenueUsd = locationSales.reduce(
    (sum, sale) => sum + sale.totalPrice.USD,
    0,
  );

  const operatingDays = getOperatingDays(location.openingYear);
  const avgDailyRevenueUsd = totalRevenueUsd / operatingDays;
  const revenueScore = Math.min(40, (avgDailyRevenueUsd / 1000) * 40);

  const salesCount = locationSales.length;
  const efficiencyScore = Math.min(
    30,
    (salesCount / location.seatingCapacity) * 30,
  );

  const wasteCostUsd = calculateWasteCost(wasteRecords, location.id, "USD");
  let wasteScore: number;
  if (totalRevenueUsd === 0) {
    wasteScore = 20;
  } else {
    const wastePercentage = (wasteCostUsd / totalRevenueUsd) * 100;
    wasteScore = Math.max(0, 20 - wastePercentage * 2);
  }

  const margin = calculateLocationMargin(
    sales,
    menuItems,
    location.id,
    "USD",
  );
  const marginScore = Math.min(10, margin / 10);

  return round2(revenueScore + efficiencyScore + wasteScore + marginScore);
}

export function rankLocationsByPerformance(
  locations: Location[],
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[],
): LocationPerformanceRank[] {
  return locations
    .map((location) => ({
      location,
      score: scoreLocationPerformance(
        location,
        sales,
        wasteRecords,
        menuItems,
      ),
    }))
    .sort((a, b) => b.score - a.score);
}

export function countSalesByPaymentMethod(
  sales: SaleTransaction[],
): Record<PaymentMethod, number> {
  const counts = Object.fromEntries(
    PAYMENT_METHODS.map((method) => [method, 0]),
  ) as Record<PaymentMethod, number>;

  for (const sale of sales) {
    counts[sale.paymentMethod] += 1;
  }

  return counts;
}

export function calculateAverageTicket(
  sales: SaleTransaction[],
  currency: Currency,
): number {
  if (sales.length === 0) {
    return 0;
  }

  const total = sales.reduce((sum, sale) => sum + sale.totalPrice[currency], 0);
  return round2(total / sales.length);
}

export function findTopSellingItems(
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  topN: number,
): TopSellingItem[] {
  const menuById = new Map(menuItems.map((item) => [item.id, item]));
  const quantities = new Map<string, number>();

  for (const sale of sales) {
    if (!menuById.has(sale.itemId)) {
      continue;
    }
    quantities.set(
      sale.itemId,
      (quantities.get(sale.itemId) ?? 0) + sale.quantity,
    );
  }

  const ranked: TopSellingItem[] = [];

  for (const [itemId, totalSold] of quantities.entries()) {
    const item = menuById.get(itemId);
    if (item) {
      ranked.push({ item, totalSold });
    }
  }

  return ranked
    .sort((a, b) => {
      if (b.totalSold !== a.totalSold) {
        return b.totalSold - a.totalSold;
      }
      return a.item.name.localeCompare(b.item.name);
    })
    .slice(0, topN);
}

export function groupWasteByReason(
  wasteRecords: WasteRecord[],
): Record<WasteReason, WasteRecord[]> {
  const grouped = Object.fromEntries(
    WASTE_REASONS.map((reason) => [reason, [] as WasteRecord[]]),
  ) as Record<WasteReason, WasteRecord[]>;

  for (const record of wasteRecords) {
    grouped[record.reason].push(record);
  }

  return grouped;
}

export function calculateCountryComparison(
  sales: SaleTransaction[],
  locations: Location[],
  menuItems: MenuItem[],
): CountryComparison {
  void menuItems;

  const locationById = new Map(locations.map((location) => [location.id, location]));

  const emptyMetrics = (): CountryComparison["Colombia"] => ({
    totalLocations: 0,
    totalRevenue: { USD: 0, COP: 0 },
    averageRevenuePerLocation: { USD: 0, COP: 0 },
    totalSales: 0,
  });

  const colombia = emptyMetrics();
  const usa = emptyMetrics();

  for (const location of locations) {
    const metrics = location.country === "Colombia" ? colombia : usa;
    metrics.totalLocations += 1;
  }

  for (const sale of sales) {
    const location = locationById.get(sale.locationId);
    if (!location) {
      continue;
    }

    const metrics = location.country === "Colombia" ? colombia : usa;
    metrics.totalSales += 1;
    metrics.totalRevenue.USD += sale.totalPrice.USD;
    metrics.totalRevenue.COP += sale.totalPrice.COP;
  }

  for (const metrics of [colombia, usa]) {
    metrics.totalRevenue.USD = round2(metrics.totalRevenue.USD);
    metrics.totalRevenue.COP = round2(metrics.totalRevenue.COP);

    if (metrics.totalLocations === 0) {
      metrics.averageRevenuePerLocation = { USD: 0, COP: 0 };
      continue;
    }

    metrics.averageRevenuePerLocation = {
      USD: round2(metrics.totalRevenue.USD / metrics.totalLocations),
      COP: round2(metrics.totalRevenue.COP / metrics.totalLocations),
    };
  }

  return { Colombia: colombia, USA: usa };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isSameUtcCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function getOperatingDays(openingYear: number): number {
  const now = Date.now();
  const opening = new Date(openingYear, 0, 1).getTime();
  const days = Math.floor((now - opening) / 86_400_000);
  return Math.max(1, days);
}
