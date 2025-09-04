// Carga las variables de entorno desde el archivo .env
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// --- CONFIGURACIÓN DE PASSPORT ---
require('./src/config/passport');

// --- IMPORTACIÓN DE RUTAS ---
const authRoutes    = require('./src/modules/auth/routes/auth.routes');
const webhookRoutes = require('./src/modules/webhooks/routes/webhook.routes');
const eventsRoutes  = require('./src/modules/events/routes/events.routes');
const profileRoutes = require('./src/modules/profile/routes/profile.routes.js'); 

// --- MIDDLEWARES COMPARTIDOS ---
const requestLogger = require('./src/shared/middlewares/requestLogger');

// --- SWAGGER DOCS ---
const { setupSwagger } = require('./src/docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES GLOBALES ---
// ¡IMPORTANTE PARA WEBHOOKS!
// Debe ir ANTES de cualquier otro body parser para poder verificar la firma de GitHub.
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger simple (req/res/duración)
app.use(requestLogger);

// Sesión (si usas passport con sesiones)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretofuerte_por_defecto',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// --- RUTAS DE LA APLICACIÓN ---
app.get('/', (req, res) => {
  res.send('Servidor funcionando con Passport y GitHub Auth! 🚀');
});

app.use('/auth', authRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/events', eventsRoutes);
console.log('/events routes mounted');
app.use('/profile', profileRoutes);
console.log('/profile routes mounted');

// --- SWAGGER DOCS ---
// Monta Swagger UI en /api-docs y el JSON en /api-docs.json
setupSwagger(app);

// --- INICIAR SERVIDOR ---
console.log('¡Nuevo server.js cargado!');
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs 🚀`);
});
