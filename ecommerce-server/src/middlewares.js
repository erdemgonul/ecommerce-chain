function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

function validateRequest(req, res, next) {
  const schemaPath = './validations' + req.originalUrl.substring(req.originalUrl.indexOf('/', 5), req.originalUrl.length);
  const schema = require(schemaPath)

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`));
  } else {
    req.body = value;
    next();
  }
}

module.exports = {
  notFound,
  errorHandler,
  validateRequest
};
