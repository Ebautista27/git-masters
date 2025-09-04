// src/modules/auth/controller/auth.controller.js
const passport = require("passport");
const { generateAuthToken } = require("../service/auth.service");
// Middleware para iniciar autenticación con GitHub
const loginWithGitHub = (req, res, next) => {
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
};
// Callback después de la autenticación de GitHub
const githubCallback = (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/failure");
  }

  // Llama a la función del servicio para generar el token
  const token = generateAuthToken(req.user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.redirect("/");
};

// Obtener perfil del usuario desde el token
const getProfile = (req, res) => {
  res.json(req.user);
};

// Función para cerrar sesión
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.redirect("/");
};

module.exports = {
  loginWithGitHub,
  githubCallback,
  getProfile,
  logout,
};