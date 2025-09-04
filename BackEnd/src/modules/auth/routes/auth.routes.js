const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  githubCallback,
  getProfile,
  logout, 
} = require("../controller/auth.controller");
const requireAuth = require("../../../shared/middlewares/auth.middleware");

// Ruta para iniciar la autenticación con GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Callback de GitHub después de autenticarse
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/auth/failure" }),
  githubCallback
);

// Ruta para ver el perfil del usuario autenticado
router.get("/me", requireAuth, getProfile);

// Ruta para cerrar sesión
router.get("/logout", logout); // <-- El endpoint que agregué

// Ruta si falló el login
router.get("/failure", (req, res) => {
  res.send("Fallo la autenticación");
});

module.exports = router;