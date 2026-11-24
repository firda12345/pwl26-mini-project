const logger = (req, res, next) => {
  console.log(`[LOGGER] ${req.method} ${req.url} - Status: ${res.statusCode}`);
  next();
};

module.exports = logger;