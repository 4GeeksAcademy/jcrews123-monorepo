import {
  calculateAverageTicket,
  calculateDailyRevenue,
  calculateLocationMargin,
  findTopSellingItems,
  rankLocationsByPerformance,
  sampleLocations,
  sampleMenuItems,
  sampleSales,
  sampleWasteRecords,
} from "@brasaland/operations";

const REPORT_DATE = new Date("2024-03-15T12:00:00Z");

export type OperationsDashboard = {
  reportDate: string;
  dailyRevenueUsd: number;
  averageTicketUsd: number;
  activeLocationCount: number;
  rankedLocations: Array<{
    id: string;
    name: string;
    city: string;
    country: string;
    score: number;
    marginUsd: number;
  }>;
  topSellers: Array<{
    name: string;
    totalSold: number;
  }>;
};

export function buildOperationsDashboard(): OperationsDashboard {
  const ranked = rankLocationsByPerformance(
    sampleLocations,
    sampleSales,
    sampleWasteRecords,
    sampleMenuItems,
  );

  return {
    reportDate: REPORT_DATE.toISOString().slice(0, 10),
    dailyRevenueUsd: calculateDailyRevenue(
      sampleSales,
      REPORT_DATE,
      "USD",
    ),
    averageTicketUsd: calculateAverageTicket(sampleSales, "USD"),
    activeLocationCount: sampleLocations.filter((l) => l.status === "Active")
      .length,
    rankedLocations: ranked.map(({ location, score }) => ({
      id: location.id,
      name: location.name,
      city: location.city,
      country: location.country,
      score,
      marginUsd: calculateLocationMargin(
        sampleSales,
        sampleMenuItems,
        location.id,
        "USD",
      ),
    })),
    topSellers: findTopSellingItems(sampleSales, sampleMenuItems, 3).map(
      ({ item, totalSold }) => ({
        name: item.name,
        totalSold,
      }),
    ),
  };
}
