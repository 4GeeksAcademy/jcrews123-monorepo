export type Department = {
  id: string;
  name: string;
  lead: string;
  need: string;
};

export type LocationRow = {
  country: string;
  city: string;
  restaurants: string[];
};

export const companyKpis = [
  { label: "Locations", value: "14", detail: "Company-owned restaurants" },
  { label: "Employees", value: "115", detail: "Kitchen, floor, and corporate" },
  { label: "Annual revenue", value: "$6M", detail: "USD approximate" },
  { label: "Markets", value: "2", detail: "Colombia and United States" },
] as const;

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

export const locationRows: LocationRow[] = [
  {
    country: "Colombia",
    city: "Medellín",
    restaurants: [
      "Brasaland El Poblado",
      "Brasaland Laureles",
      "Brasaland Envigado",
      "Brasaland Sabaneta",
    ],
  },
  {
    country: "Colombia",
    city: "Bogotá",
    restaurants: [
      "Brasaland Usaquén",
      "Brasaland Chapinero",
      "Brasaland Zona Rosa",
    ],
  },
  {
    country: "Colombia",
    city: "Cali",
    restaurants: [
      "Brasaland Granada",
      "Brasaland Ciudad Jardín",
      "Brasaland Unicentro",
    ],
  },
  {
    country: "United States",
    city: "Miami",
    restaurants: ["Brasaland Brickell", "Brasaland Coral Gables"],
  },
  {
    country: "United States",
    city: "Orlando",
    restaurants: ["Brasaland Downtown", "Brasaland International Drive"],
  },
];

export const totalRestaurantCount = locationRows.reduce(
  (sum, row) => sum + row.restaurants.length,
  0,
);
