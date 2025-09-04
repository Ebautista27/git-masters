const passport = require("passport");
const jwt = require("jsonwebtoken");

const loginWithGitHub = passport.authenticate("github", { scope: ["user:email"] });

const githubCallback = (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err || !user) return res.redirect("/login-failed");

    // Generar JWT
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Enviar cookie segura
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    return res.redirect("/"); // 🔁 Aquí puedes redirigir a tu frontend cuando exista
  })(req, res, next);
};

const getProfile = (req, res) => {
  res.json(req.user); // Ya viene del middleware que verifica el token
};

module.exports = {
  loginWithGitHub,
  githubCallback,
  getProfile,
};
