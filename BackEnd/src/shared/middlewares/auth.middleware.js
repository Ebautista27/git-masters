// src/shared/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    let token = null;

    // 1) Header Authorization: Bearer <token>
    const auth = req.headers["authorization"];
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      token = auth.slice(7).trim();
    }

    // 2) Cookie "token"
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3) Query param (solo para pruebas)
    if (!token && req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No autorizado. Token faltante." });
    }

    // Verifica y asigna el payload decodificado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
}

module.exports = requireAuth;
