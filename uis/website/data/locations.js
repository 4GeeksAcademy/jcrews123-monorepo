/**
 * Brasaland location hierarchy — single source for dropdowns and validation.
 */
const BRASALAND_LOCATIONS = {
  Colombia: {
    cities: ['Medellín', 'Bogotá', 'Cali'],
    locations: {
      Medellín: [
        'Brasaland El Poblado',
        'Brasaland Laureles',
        'Brasaland Envigado',
        'Brasaland Sabaneta',
      ],
      Bogotá: [
        'Brasaland Usaquén',
        'Brasaland Chapinero',
        'Brasaland Zona Rosa',
      ],
      Cali: [
        'Brasaland Granada',
        'Brasaland Ciudad Jardín',
        'Brasaland Unicentro',
      ],
    },
    phonePrefix: '+57',
  },
  'United States': {
    cities: ['Miami', 'Orlando'],
    locations: {
      Miami: ['Brasaland Brickell', 'Brasaland Coral Gables'],
      Orlando: ['Brasaland Downtown', 'Brasaland International Drive'],
    },
    phonePrefix: '+1',
  },
};

if (typeof window !== 'undefined') {
  window.BRASALAND_LOCATIONS = BRASALAND_LOCATIONS;
}
