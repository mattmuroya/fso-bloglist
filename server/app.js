const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URL} = require('./utils/config');
const { info } = require('./utils/logger');
const middleware = require('./middleware/middleware');
const blogRouter = require('./controllers/blogRouter');

info('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URL)
  .then(() => {
    info('MongoDB connected.');
  }).catch(err => {
    info('MongoDB connection error: ', err.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(middleware.reqLogger);

app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
