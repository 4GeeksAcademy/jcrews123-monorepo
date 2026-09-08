import { locationRows, totalRestaurantCount } from "@/data/company";

export function LocationTable() {
  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h3
          id="locations-heading"
          className="font-display text-lg font-semibold text-slate-900"
        >
          Location network
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {totalRestaurantCount} restaurants across Colombia and the United
          States.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Country</th>
              <th className="px-6 py-3 font-semibold">City</th>
              <th className="px-6 py-3 font-semibold">Restaurants</th>
              <th className="px-6 py-3 font-semibold">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locationRows.map((row) => (
              <tr key={`${row.country}-${row.city}`} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {row.country}
                </td>
                <td className="px-6 py-4 text-slate-700">{row.city}</td>
                <td className="px-6 py-4 text-slate-600">
                  {row.restaurants.join(", ")}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  {row.restaurants.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
