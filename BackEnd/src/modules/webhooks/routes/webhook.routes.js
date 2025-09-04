const express = require('express');
const router = express.Router();
const webhookController = require('../controller/webhook.controller');
const verifyGitHubSignature = require('../../../shared/middlewares/githubWebhookVerifier'); // Middleware de seguridad

/**
 * @route POST /webhooks/github
 * @description Endpoint para recibir eventos de GitHub.
 * Este endpoint es llamado por GitHub cuando ocurren eventos en los repositorios configurados.
 * Requiere verificación de la firma para asegurar que la petición viene de GitHub.
 * @access Public (pero protegido por firma)
 */
router.post('/github', verifyGitHubSignature, webhookController.handleGitHubWebhook);

module.exports = router;
