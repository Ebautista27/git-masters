// src/docs/spec.js
const deepmerge = require('deepmerge');

// Base del spec (¡components solo una vez!)
const base = {
  openapi: '3.0.0',
  info: { title: 'Git-Masters API', version: '1.0.0' },
  servers: [{ url: process.env.API_BASE_URL || 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {}, // ← aquí van tus esquemas compartidos
  },
  security: [{ bearerAuth: [] }],
  paths: {},
};

// Helper para requerir sin romper si falta el archivo
function safe(path) {
  try { return require(path); }
  catch (e) {
    console.warn(`[spec] módulo de docs no encontrado: ${path}`);
    return {};
  }
}

// Importar docs de los módulos (ajusta rutas si cambian)
const authDocs       = safe('../modules/auth/auth.docs');
const profileDocs    = safe('../modules/profile/profile.docs');
const eventsDocs     = safe('../modules/events/events.docs');
const insigniasDocs  = safe('../modules/insignias-rangos/insignias.docs');

// Merge final
const spec = deepmerge.all([
  base,
  authDocs,
  profileDocs,
  eventsDocs,
  insigniasDocs,
]);

module.exports = spec;
