export {
  sampleLocations,
  sampleMenuItems,
  sampleSales,
  sampleWasteRecords,
} from "./data/samples";

export {
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
} from "./utils/transformations";

export {
  filterActiveLocations,
  filterSalesByLocation,
} from "./utils/collections";

export type {
  Currency,
  Location,
  MenuItem,
  SaleTransaction,
  WasteRecord,
} from "./types/models";
