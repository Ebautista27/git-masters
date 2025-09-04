const crypto = require('crypto'); // Módulo nativo de Node.js para criptografía

/**
 * @function verifyGitHubSignature
 * @description Middleware para verificar la firma de seguridad de los webhooks de GitHub.
 * Asegura que la petición proviene de GitHub y no ha sido alterada.
 * @param {object} req - Objeto de la petición de Express.
 * @param {object} res - Objeto de la respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
const verifyGitHubSignature = (req, res, next) => {
    // Asegúrate de que la clave secreta esté en tus variables de entorno
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    // Si no hay secreto configurado, lanza un error (solo en desarrollo, en prod debería existir)
    if (!secret) {
        console.error('GITHUB_WEBHOOK_SECRET no está configurado en las variables de entorno.');
        return res.status(500).send('Error de configuración del servidor.');
    }

    // GitHub envía la firma en la cabecera 'x-hub-signature-256'
    const signature = req.headers['x-hub-signature-256'];

    // Si no hay firma, la petición no es válida
    if (!signature) {
        console.warn('Petición de webhook sin firma X-Hub-Signature-256.');
        return res.status(401).send('Firma de webhook faltante.');
    }

    // El cuerpo de la petición debe ser RAW para la verificación de la firma.
    // Express.json() ya lo parseó, pero para la verificación necesitamos el buffer original.
    // Una forma de obtener el raw body es configurar Express para que lo guarde:
    // En server.js, antes de app.use(express.json()), necesitas:
    // app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
    const payload = req.rawBody; // Esto asume que req.rawBody está disponible

    // Si req.rawBody no está disponible, significa que express.json() no se configuró para guardarlo.
    if (!payload) {
        console.error('Cuerpo de la petición RAW no disponible para verificación de firma. Asegúrate de configurar express.json({ verify: ... }).');
        return res.status(500).send('Error interno del servidor: Cuerpo RAW no disponible.');
    }

    // Calcula el hash esperado usando el secreto y el payload
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    // Compara la firma calculada con la firma recibida de GitHub
    if (digest !== signature) {
        console.warn('Firma de webhook no válida. Petición rechazada.');
        return res.status(403).send('Firma de webhook no válida.');
    }

    // Si la firma es válida, pasa al siguiente middleware (el controlador del webhook)
    next();
};

module.exports = verifyGitHubSignature;



