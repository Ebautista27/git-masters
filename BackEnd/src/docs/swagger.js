// src/docs/swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const deepmerge = require('deepmerge');
const path = require('path');

// 1) Base OpenAPI (común para toda la API)
const baseDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Git-Masters API',
    version: '1.0.0',
    description: 'Documentación de la API',
  },
  servers: [
    { url: process.env.API_BASE_URL || 'http://localhost:3000' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
};

// 2) Especificación agregada por módulos (sin comentarios JSDoc)
//    -> defined in src/docs/spec.js e importa cada *.docs.js por módulo
let moduleSpec = {};
try {
  moduleSpec = require('./spec'); // { openapi?, info?, components?, paths? ... }
} catch (e) {
  console.warn('[swagger] No se encontró spec por módulos (src/docs/spec.js). Continuando solo con JSDoc…');
}

// 3) Especificación generada desde comentarios JSDoc (si decides usarlos)
const jsdocOptions = {
  definition: baseDefinition,
  apis: [
    path.join(__dirname, '../modules/**/*.routes.js'),
    path.join(__dirname, '../modules/**/*.controller.js'),
  ],
};
const jsdocSpec = swaggerJsdoc(jsdocOptions);

// 4) Unimos: base + módulos + jsdoc (el orden importa: lo de la derecha sobrescribe)
const swaggerSpec = deepmerge.all([
  baseDefinition,
  moduleSpec || {},
  jsdocSpec || {},
]);

// 5) Helper para montar en el server
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
}

module.exports = { setupSwagger, swaggerSpec };
