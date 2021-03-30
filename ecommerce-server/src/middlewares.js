const jwt = require("jsonwebtoken");
const config = require('./config');

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
  if (!config.validation.endpointsToValidate.includes(req.originalUrl)) {
    return next();
  }

  const schemaPath = './validations' + req.originalUrl.substring(req.originalUrl.indexOf('/', 5), req.originalUrl.length);
  const schema = require(schemaPath)

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    res.status(422)
    next(new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`));
  } else {
    req.body = value;
    next();
  }
}

verifyToken = (req, res, next) => {
  if (config.auth.noAuthEndpoints.includes(req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  let token = authHeader ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  notFound,
  errorHandler,
  validateRequest,
  verifyToken
};
