const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const db = require('./models/index');
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

db.mongoose
  .connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    /* eslint-disable no-console */
    console.log('Successfully connect to MongoDB.');
    /* eslint-disable no-console */
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.error('Connection error', err);
    /* eslint-disable no-console */
    process.exit();
  });

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use(middlewares.validateRequest);
app.use(middlewares.verifyToken);

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
