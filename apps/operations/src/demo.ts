import {
  sampleLocations,
  sampleMenuItems,
  sampleSales,
  sampleWasteRecords,
} from "./data/samples.js";
import {
  filterActiveLocations,
  filterMenuItemsByCategory,
  filterSalesByDateRange,
  filterSalesByLocation,
  sortLocationsByCapacity,
  sortMenuItemsByPrice,
} from "./utils/collections.js";
import {
  binarySearchLocationByCapacity,
  findLocationById,
  findMenuItemByName,
} from "./utils/search.js";
import {
  calculateAverageTicket,
  calculateCountryComparison,
  calculateDailyRevenue,
  calculateLocationMargin,
  calculateWasteCost,
  convertCurrency,
  countSalesByPaymentMethod,
  findTopSellingItems,
  groupWasteByReason,
  rankLocationsByPerformance,
  scoreLocationPerformance,
} from "./utils/transformations.js";
import {
  validateLocation,
  validateMenuItem,
  validateSaleTransaction,
} from "./utils/validations.js";
import type { MenuItem } from "./types/models.js";

function section(title: string): void {
  console.log(`\n=== ${title} ===`);
}

function log(label: string, value: unknown): void {
  console.log(`${label}:`, value);
}

section("Collections");
log(
  "filterSalesByLocation (Medellín)",
  filterSalesByLocation(sampleSales, "LOC-MEDELLIN-01").length,
);
log(
  "filterSalesByDateRange (2024-03-15)",
  filterSalesByDateRange(
    sampleSales,
    new Date("2024-03-15"),
    new Date("2024-03-15"),
  ).length,
);
log(
  "filterSalesByDateRange (excluded range)",
  filterSalesByDateRange(
    sampleSales,
    new Date("2024-03-16"),
    new Date("2024-03-20"),
  ).length,
);
log(
  "filterMenuItemsByCategory (Meat)",
  filterMenuItemsByCategory(sampleMenuItems, "Meat").map((item) => item.name),
);
log(
  "filterActiveLocations",
  filterActiveLocations(sampleLocations).map((location) => location.id),
);

const orderBefore = sampleLocations.map((location) => location.id);
const sortedByCapacityDesc = sortLocationsByCapacity(sampleLocations, "desc");
log(
  "sortLocationsByCapacity desc",
  sortedByCapacityDesc.map((location) => location.seatingCapacity),
);
log(
  "original locations unchanged",
  sampleLocations.map((location) => location.id).join() === orderBefore.join(),
);

log(
  "sortMenuItemsByPrice USD asc",
  sortMenuItemsByPrice(sampleMenuItems, "USD", "asc").map(
    (item) => item.basePrice.USD,
  ),
);

section("Search");
log("findLocationById hit", findLocationById(sampleLocations, "LOC-MIAMI-01")?.name);
log("findLocationById miss", findLocationById(sampleLocations, "LOC-UNKNOWN"));
log(
  "findMenuItemByName case-insensitive",
  findMenuItemByName(sampleMenuItems, "picanha 250g")?.name,
);

const sortedAsc = sortLocationsByCapacity(sampleLocations, "asc");
log(
  "binarySearchLocationByCapacity (80)",
  binarySearchLocationByCapacity(sortedAsc, 80),
);
log(
  "binarySearchLocationByCapacity miss (50)",
  binarySearchLocationByCapacity(sortedAsc, 50),
);

section("Transformations — Financial");
log(
  "calculateDailyRevenue 2024-03-15 USD",
  calculateDailyRevenue(sampleSales, new Date("2024-03-15"), "USD"),
);
log(
  "calculateLocationMargin Medellín USD",
  calculateLocationMargin(
    sampleSales,
    sampleMenuItems,
    "LOC-MEDELLIN-01",
    "USD",
  ),
);
log(
  "calculateWasteCost Medellín USD",
  calculateWasteCost(sampleWasteRecords, "LOC-MEDELLIN-01", "USD"),
);
log("convertCurrency 4000 COP→USD", convertCurrency(4000, "COP", "USD"));
log("convertCurrency USD→USD", convertCurrency(10, "USD", "USD"));

section("Transformations — Scoring");
log(
  "scoreLocationPerformance Medellín",
  scoreLocationPerformance(
    sampleLocations[0],
    sampleSales,
    sampleWasteRecords,
    sampleMenuItems,
  ),
);
log(
  "rankLocationsByPerformance",
  rankLocationsByPerformance(
    sampleLocations,
    sampleSales,
    sampleWasteRecords,
    sampleMenuItems,
  ).map((entry) => ({ id: entry.location.id, score: entry.score })),
);

section("Transformations — Aggregations");
log("countSalesByPaymentMethod", countSalesByPaymentMethod(sampleSales));
log("calculateAverageTicket USD", calculateAverageTicket(sampleSales, "USD"));
log(
  "findTopSellingItems top 2",
  findTopSellingItems(sampleSales, sampleMenuItems, 2).map((entry) => ({
    name: entry.item.name,
    totalSold: entry.totalSold,
  })),
);
log(
  "groupWasteByReason keys",
  Object.fromEntries(
    Object.entries(groupWasteByReason(sampleWasteRecords)).map(
      ([reason, records]) => [reason, records.length],
    ),
  ),
);
log(
  "calculateCountryComparison",
  calculateCountryComparison(sampleSales, sampleLocations, sampleMenuItems),
);

section("Validations");
log("validateMenuItem valid", validateMenuItem(sampleMenuItems[0]));
log(
  "validateMenuItem invalid prep time",
  validateMenuItem({ ...sampleMenuItems[0], prepTimeMinutes: 0 }),
);

const invalidMenuItem: MenuItem = {
  ...sampleMenuItems[0],
  isAvailableInColombia: false,
  isAvailableInUSA: false,
};
log("validateMenuItem unavailable both countries", validateMenuItem(invalidMenuItem));
log("validateSaleTransaction valid", validateSaleTransaction(sampleSales[0]));
log(
  "validateLocation invalid year",
  validateLocation({ ...sampleLocations[0], openingYear: 2007 }),
);

section("Edge cases");
log("empty sales filter", filterSalesByLocation([], "LOC-MEDELLIN-01"));
log("calculateAverageTicket empty", calculateAverageTicket([], "USD"));
log(
  "calculateLocationMargin zero revenue",
  calculateLocationMargin([], sampleMenuItems, "LOC-MEDELLIN-01", "USD"),
);
log(
  "groupWasteByReason empty",
  Object.keys(groupWasteByReason([])).length,
);

console.log("\nDemo complete.");
