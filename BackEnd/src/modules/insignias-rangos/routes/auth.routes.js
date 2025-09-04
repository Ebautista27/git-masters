const express = require("express");
const router = express.Router();
const { loginWithGitHub, githubCallback, getProfile } = require("../controller/auth.controller");
const requireAuth = require("../../../shared/middlewares/auth.middleware");

router.get("/auth/github", loginWithGitHub);

router.get("/auth/github/callback", githubCallback);

router.get("/me", requireAuth, getProfile);

module.exports = router;
