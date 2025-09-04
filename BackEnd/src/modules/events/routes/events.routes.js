const express = require('express');
const router = express.Router();

const requireAuth = require('../../../shared/middlewares/auth.middleware');
const { listEvents, getEventById } = require('../controller/events.controller');

// Bypass temporal para Postman
function testBypassAuth(req, res, next) {
  const key = req.header('X-API-Key');
  if (process.env.TEST_API_KEY && key === process.env.TEST_API_KEY) {
    return next();
  }
  return requireAuth(req, res, next);
}

router.get('/',  testBypassAuth, listEvents);
router.get('/:id', testBypassAuth, getEventById);

module.exports = router;

