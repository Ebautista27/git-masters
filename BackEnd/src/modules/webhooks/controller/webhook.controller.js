const eventStore = require('../../../shared/persistence/eventStore');

/**
 * Procesa eventos de GitHub y los guarda en almacenamiento provisional (archivo JSON).
 * La firma ya fue verificada por el middleware verifyGitHubSignature en la ruta.
 */
const handleGitHubWebhook = async (req, res) => {
  try {
    const githubEvent = req.headers['x-github-event'];     // push, pull_request, ping...
    const deliveryId  = req.headers['x-github-delivery'];  // GUID único de GitHub
    const payload = req.body;

    if (!githubEvent || !deliveryId) {
      console.warn('Webhook inválido: faltan headers requeridos.');
      return res.status(400).json({ error: 'Missing required headers' });
    }

    // Campos útiles denormalizados para filtros en /events
    const repoFullName =
      payload?.repository?.full_name ||
      payload?.pull_request?.base?.repo?.full_name ||
      null;

    const senderLogin =
      payload?.sender?.login ||
      payload?.pusher?.name ||
      null;

    const action = payload?.action || null;

    let commitsCount = null;
    if (githubEvent === 'push') {
      commitsCount = Array.isArray(payload?.commits) ? payload.commits.length : 0;
    }

    const githubCreatedAt =
      payload?.head_commit?.timestamp ||
      payload?.pull_request?.created_at ||
      payload?.issue?.created_at ||
      null;

    const record = {
      delivery_id: String(deliveryId),
      event_type: String(githubEvent),
      action,
      repo_full_name: repoFullName,
      sender_login: senderLogin,
      commits_count: commitsCount,
      github_created_at: githubCreatedAt,
      received_at: new Date().toISOString(),
      signature_valid: true, // ya pasó por verifyGitHubSignature
      processed_status: 'stored',
      payload
    };

    // Idempotencia: si el delivery ya existe, save() devuelve el existente
    const saved = await eventStore.save(record);

    if (saved?.id && saved?.delivery_id === deliveryId) {
      console.info(`Webhook almacenado: type=${githubEvent} repo=${repoFullName || '-'} delivery=${deliveryId} id=${saved.id}`);
    } else {
      console.info(`Webhook duplicado: delivery=${deliveryId}`);
    }

    // Responder rápido para que GitHub esté feliz
    return res.status(200).send('Webhook recibido y almacenado.');
  } catch (err) {
    console.error('Error al manejar webhook:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};

module.exports = { handleGitHubWebhook };
