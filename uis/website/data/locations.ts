export type Country = "Colombia" | "United States";

export type LocationHierarchy = {
  cities: string[];
  locations: Record<string, string[]>;
  phonePrefix: string;
};

export const BRASALAND_LOCATIONS: Record<Country, LocationHierarchy> = {
  Colombia: {
    cities: ["Medellín", "Bogotá", "Cali"],
    locations: {
      Medellín: [
        "Brasaland El Poblado",
        "Brasaland Laureles",
        "Brasaland Envigado",
        "Brasaland Sabaneta",
      ],
      Bogotá: [
        "Brasaland Usaquén",
        "Brasaland Chapinero",
        "Brasaland Zona Rosa",
      ],
      Cali: [
        "Brasaland Granada",
        "Brasaland Ciudad Jardín",
        "Brasaland Unicentro",
      ],
    },
    phonePrefix: "+57",
  },
  "United States": {
    cities: ["Miami", "Orlando"],
    locations: {
      Miami: ["Brasaland Brickell", "Brasaland Coral Gables"],
      Orlando: ["Brasaland Downtown", "Brasaland International Drive"],
    },
    phonePrefix: "+1",
  },
};

export const HOW_DID_YOU_FIND_US = [
  "Social media",
  "Recommendation",
  "Walked by",
  "Internet search",
  "Other",
] as const;
