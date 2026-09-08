export type Department = {
  id: string;
  name: string;
  lead: string;
  need: string;
};

/** Department priorities from CONTEXT.md — not M2 operations logic. */
export const departments: Department[] = [
  {
    id: "operations",
    name: "Restaurant Operations",
    lead: "Felipe Guerrero",
    need: "Real-time sales dashboard per location and smart ingredient ordering",
  },
  {
    id: "procurement",
    name: "Procurement and Suppliers",
    lead: "Lucía Fernández",
    need: "Supplier platform with price history and consolidated purchasing",
  },
  {
    id: "marketing",
    name: "Marketing and Digital Experience",
    lead: "Camila Ospina",
    need: "Digital loyalty, CRM, and personalisation engine",
  },
  {
    id: "people",
    name: "People and Culture",
    lead: "Ashley Turner",
    need: "HR portal, automated onboarding, turnover KPIs by country",
  },
  {
    id: "training",
    name: "Training and Quality Standards",
    lead: "Jake Morrison",
    need: "Searchable recipe catalogue with push updates to all locations",
  },
  {
    id: "technology",
    name: "Technology",
    lead: "Nicolás Park",
    need: "Central API, telemetry, and data pipeline for dashboards",
  },
  {
    id: "executive",
    name: "Executive Direction",
    lead: "Mariana Restrepo",
    need: "Unified executive dashboard and automated weekly reports",
  },
];
