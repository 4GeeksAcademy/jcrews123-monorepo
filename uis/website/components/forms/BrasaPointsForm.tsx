"use client";

import { useMemo, useState } from "react";
import {
  BRASALAND_LOCATIONS,
  type Country,
} from "@/data/locations";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import {
  maxDateOfBirth,
  REQUIRED_FIELDS,
  validateField,
  type FormField,
} from "@/lib/validation/brasaPointsForm";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  favoriteLocation: string;
  dietaryPreferences: string[];
  howDidYouFindUs: string;
  dateOfBirth: string;
  acceptTerms: boolean;
  receiveOffers: boolean;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  favoriteLocation: "",
  dietaryPreferences: [],
  howDidYouFindUs: "",
  dateOfBirth: "",
  acceptTerms: false,
  receiveOffers: false,
};

export function BrasaPointsForm() {
  const { translate: tr } = useI18n();
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [success, setSuccess] = useState(false);

  const cities = useMemo(() => {
    if (values.country === "Colombia" || values.country === "United States") {
      return BRASALAND_LOCATIONS[values.country as Country].cities;
    }
    return [];
  }, [values.country]);

  const locations = useMemo(() => {
    if (values.country === "Colombia" || values.country === "United States") {
      const country = values.country as Country;
      return values.city
        ? BRASALAND_LOCATIONS[country].locations[values.city] ?? []
        : [];
    }
    return [];
  }, [values.country, values.city]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function runValidation(field: FormField) {
    const valid = validateField(field, values);
    setErrors((prev) => ({
      ...prev,
      [field]: valid ? undefined : tr(`form.errors.${field}`),
    }));
    return valid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let ok = true;
    const nextErrors: Partial<Record<FormField, string>> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!validateField(field, values)) {
        ok = false;
        nextErrors[field] = tr(`form.errors.${field}`);
      }
    }
    setErrors(nextErrors);
    setShowSummary(!ok);
    if (ok) setSuccess(true);
  }

  function handleClear() {
    setValues(initialState);
    setErrors({});
    setShowSummary(false);
    setSuccess(false);
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-8" role="status">
        <h2 className="text-2xl font-bold text-green-900">{tr("form.success.title")}</h2>
        <p className="mt-4 text-green-800">{tr("form.success.body")}</p>
        <p className="mt-4 font-medium text-green-800">{tr("form.success.footer")}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
        {tr("form.pageTitle")}
      </h1>
      <p className="mt-4 text-lg text-stone-600">{tr("form.intro")}</p>
      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
        {tr("form.disclaimer")}
      </div>
      {showSummary && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          {tr("form.errorSummary")}
        </div>
      )}
      <form className="mt-8 space-y-8" onSubmit={handleSubmit} noValidate>
        <p className="text-sm text-stone-500">{tr("form.requiredNote")}</p>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">{tr("form.personalInfo")}</legend>
          {(["fullName", "email", "phone"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium">
                {tr(`form.${field}`)} *
              </label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                value={values[field]}
                onChange={(e) => setField(field, e.target.value)}
                onBlur={() => runValidation(field)}
                aria-invalid={!!errors[field]}
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
              />
              {errors[field] && (
                <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
              )}
            </div>
          ))}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">{tr("form.locationInfo")}</legend>
          <div>
            <label htmlFor="country" className="block text-sm font-medium">
              {tr("form.country")} *
            </label>
            <select
              id="country"
              value={values.country}
              onChange={(e) => {
                setField("country", e.target.value);
                setField("city", "");
                setField("favoriteLocation", "");
              }}
              onBlur={() => runValidation("country")}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            >
              <option value="">{tr("form.selectCountry")}</option>
              <option value="Colombia">{tr("form.options.colombia")}</option>
              <option value="United States">{tr("form.options.unitedStates")}</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium">
              {tr("form.city")} *
            </label>
            <select
              id="city"
              value={values.city}
              onChange={(e) => {
                setField("city", e.target.value);
                setField("favoriteLocation", "");
              }}
              onBlur={() => runValidation("city")}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            >
              <option value="">{tr("form.selectCity")}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          <div>
            <label htmlFor="favoriteLocation" className="block text-sm font-medium">
              {tr("form.favoriteLocation")}
            </label>
            <select
              id="favoriteLocation"
              value={values.favoriteLocation}
              onChange={(e) => setField("favoriteLocation", e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            >
              <option value="">{tr("form.selectLocation")}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">{tr("form.preferences")}</legend>
          <div>
            <label htmlFor="howDidYouFindUs" className="block text-sm font-medium">
              {tr("form.howDidYouFindUs")} *
            </label>
            <select
              id="howDidYouFindUs"
              value={values.howDidYouFindUs}
              onChange={(e) => setField("howDidYouFindUs", e.target.value)}
              onBlur={() => runValidation("howDidYouFindUs")}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            >
              <option value="">{tr("form.selectSource")}</option>
              <option value="Social media">{tr("form.options.socialMedia")}</option>
              <option value="Recommendation">{tr("form.options.recommendation")}</option>
              <option value="Walked by">{tr("form.options.walkedBy")}</option>
              <option value="Internet search">{tr("form.options.internetSearch")}</option>
              <option value="Other">{tr("form.options.otherSource")}</option>
            </select>
            {errors.howDidYouFindUs && (
              <p className="mt-1 text-sm text-red-600">{errors.howDidYouFindUs}</p>
            )}
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium">
              {tr("form.dateOfBirth")} *
            </label>
            <input
              id="dateOfBirth"
              type="date"
              max={maxDateOfBirth()}
              value={values.dateOfBirth}
              onChange={(e) => setField("dateOfBirth", e.target.value)}
              onBlur={() => runValidation("dateOfBirth")}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold">{tr("form.consent")}</legend>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={values.acceptTerms}
              onChange={(e) => setField("acceptTerms", e.target.checked)}
              onBlur={() => runValidation("acceptTerms")}
            />
            <span>{tr("form.acceptTerms")} *</span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms}</p>
          )}
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={values.receiveOffers}
              onChange={(e) => setField("receiveOffers", e.target.checked)}
            />
            <span>{tr("form.receiveOffers")}</span>
          </label>
        </fieldset>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            className="rounded-lg bg-amber-700 px-8 py-3 font-semibold text-white hover:bg-amber-600"
          >
            {tr("form.submit")}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-stone-300 px-8 py-3 font-semibold text-stone-700 hover:bg-stone-100"
          >
            {tr("form.clear")}
          </button>
        </div>
      </form>
    </>
  );
}
