const { info, error } = require('../utils/logger');

const reqLogger = (req, _res, next) => {
  info('---');
  info('Time:   ', (new Date()).toLocaleTimeString());
  info('Method: ', req.method);
  info('Path:   ', req.path);
  info('Body:   ', req.body);
  next();
};

const tokenExtractor = (req, _res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    // auth string looks like 'bearer <token>'
    req.token = auth.substring(7); // return just the token
  }
  next();
};

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, _req, res, next) => {

  error(err);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID.' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token.' });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired.' });
  }

  next(err); // to default express error handler
};

module.exports = {
  reqLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
};
