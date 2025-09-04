// src/modules/profile/routes/profile.routes.js

const express = require('express');
const { getMyProfile } = require('../controller/profile.controller.js');
const requireAuth = require('../../../shared/middlewares/auth.middleware.js');

const router = express.Router();

router.get('/my', requireAuth, getMyProfile);

module.exports = router;