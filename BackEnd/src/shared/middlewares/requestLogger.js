function requestLogger(req, res, next) {
  const start = Date.now();
  const delivery = req.headers['x-github-delivery'];
  const event = req.headers['x-github-event'];
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms` +
      (delivery ? ` delivery=${delivery}` : '') +
      (event ? ` event=${event}` : '')
    );
  });
  next();
}

module.exports = requestLogger;
