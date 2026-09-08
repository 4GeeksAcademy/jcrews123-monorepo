import {
  BRASALAND_LOCATIONS,
  HOW_DID_YOU_FIND_US,
  type Country,
} from "@/data/locations";

export type FormField =
  | "fullName"
  | "email"
  | "phone"
  | "country"
  | "city"
  | "howDidYouFindUs"
  | "dateOfBirth"
  | "acceptTerms";

export const REQUIRED_FIELDS: FormField[] = [
  "fullName",
  "email",
  "phone",
  "country",
  "city",
  "howDidYouFindUs",
  "dateOfBirth",
  "acceptTerms",
];

export function validateFullName(value: string): boolean {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length >= 2;
}

export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validatePhone(value: string, country: string): boolean {
  const trimmed = value.trim();
  if (!/^\+\d[\d\s-]{7,}$/.test(trimmed)) return false;
  if (country === "Colombia") return trimmed.startsWith("+57");
  if (country === "United States") return trimmed.startsWith("+1");
  return trimmed.startsWith("+");
}

export function validateCountry(value: string): value is Country {
  return value === "Colombia" || value === "United States";
}

export function validateCity(value: string, country: string): boolean {
  if (!validateCountry(country)) return false;
  return BRASALAND_LOCATIONS[country].cities.includes(value);
}

export function validateHowDidYouFindUs(value: string): boolean {
  return (HOW_DID_YOU_FIND_US as readonly string[]).includes(value);
}

export function validateDateOfBirth(value: string): boolean {
  if (!value) return false;
  const dob = new Date(`${value}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

export function validateField(
  field: FormField,
  values: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    howDidYouFindUs: string;
    dateOfBirth: string;
    acceptTerms: boolean;
  },
): boolean {
  switch (field) {
    case "fullName":
      return validateFullName(String(values.fullName ?? ""));
    case "email":
      return validateEmail(String(values.email ?? ""));
    case "phone":
      return validatePhone(String(values.phone ?? ""), String(values.country ?? ""));
    case "country":
      return validateCountry(String(values.country ?? ""));
    case "city":
      return validateCity(String(values.city ?? ""), String(values.country ?? ""));
    case "howDidYouFindUs":
      return validateHowDidYouFindUs(String(values.howDidYouFindUs ?? ""));
    case "dateOfBirth":
      return validateDateOfBirth(String(values.dateOfBirth ?? ""));
    case "acceptTerms":
      return values.acceptTerms === true;
    default:
      return true;
  }
}

export function maxDateOfBirth(): string {
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  const yyyy = maxDate.getFullYear();
  const mm = String(maxDate.getMonth() + 1).padStart(2, "0");
  const dd = String(maxDate.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
