import type {
  Location,
  MenuItem,
  SaleTransaction,
  ValidationResult,
} from "../types/models";

export function validateMenuItem(item: MenuItem): ValidationResult {
  const errors: string[] = [];

  if (item.basePrice.USD <= 0) {
    errors.push("USD price must be greater than 0");
  }
  if (item.basePrice.COP <= 0) {
    errors.push("COP price must be greater than 0");
  }
  if (item.prepTimeMinutes <= 0 || item.prepTimeMinutes > 60) {
    errors.push("Prep time must be between 1 and 60 minutes");
  }
  if (item.name.trim().length === 0) {
    errors.push("Name must not be empty");
  }
  if (!item.isAvailableInColombia && !item.isAvailableInUSA) {
    errors.push("Item must be available in at least one country");
  }

  return { valid: errors.length === 0, errors };
}

export function validateSaleTransaction(sale: SaleTransaction): ValidationResult {
  const errors: string[] = [];

  if (sale.quantity <= 0) {
    errors.push("Quantity must be greater than 0");
  }
  if (sale.totalPrice.USD <= 0) {
    errors.push("USD price must be greater than 0");
  }
  if (sale.totalPrice.COP <= 0) {
    errors.push("COP price must be greater than 0");
  }
  if (sale.waiterName.trim().length === 0) {
    errors.push("Waiter name must not be empty");
  }

  return { valid: errors.length === 0, errors };
}

export function validateLocation(location: Location): ValidationResult {
  const errors: string[] = [];
  const currentYear = new Date().getFullYear();

  if (location.openingYear < 2008 || location.openingYear > currentYear) {
    errors.push("Opening year must be between 2008 and the current year");
  }
  if (location.seatingCapacity <= 0) {
    errors.push("Seating capacity must be greater than 0");
  }
  if (location.staffCount <= 0) {
    errors.push("Staff count must be greater than 0");
  }
  if (location.monthlyRentCost.USD <= 0 || location.monthlyRentCost.COP <= 0) {
    errors.push("Monthly rent cost must be greater than 0 in both currencies");
  }
  if (
    location.averageMonthlyUtilities.USD <= 0 ||
    location.averageMonthlyUtilities.COP <= 0
  ) {
    errors.push(
      "Monthly utilities cost must be greater than 0 in both currencies",
    );
  }

  return { valid: errors.length === 0, errors };
}
