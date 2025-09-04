const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./config/passport"); // Carga la estrategia de GitHub

const app = express();

// 🛡️ CORS configurado para permitir cookies del frontend 
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// 📦 Rutas de módulos
const authRoutes = require("./modules/auth/routes/auth.routes");
app.use(authRoutes); // puedes usar un prefix como '/api' si quieres

module.exports = app;
