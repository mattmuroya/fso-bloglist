const { info, error } = require('./logger');

const reqLogger = (req, res, next) => {
  info('---');
  info('Time:   ', (new Date()).toLocaleTimeString());
  info('Method: ', req.method);
  info('Path:   ', req.path);
  info('Body:   ', req.body);
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

module.exports = {
  reqLogger,
  unknownEndpoint,
  errorHandler
};
