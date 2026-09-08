import { departments } from "@/data/company";

export function DepartmentTable() {
  return (
    <section
      id="departments"
      aria-labelledby="departments-heading"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h3
          id="departments-heading"
          className="font-display text-lg font-semibold text-slate-900"
        >
          Departments and priorities
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          What each Brasaland area needs from Brasaland Digital.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Department</th>
              <th className="px-6 py-3 font-semibold">Lead</th>
              <th className="px-6 py-3 font-semibold">Priority need</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {dept.name}
                </td>
                <td className="px-6 py-4 text-slate-700">{dept.lead}</td>
                <td className="px-6 py-4 text-slate-600">{dept.need}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
