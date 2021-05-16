const jwt = require('jsonwebtoken');
const config = require('./config');
const userBAL = require('./bal/user');
const util = require('./util/index');

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

  const logObject = {err: err.message, stack:err.stack, requestBody: req.body, requestHeaders: req.headers, status: res.statusCode}
  console.log(JSON.stringify(logObject, null, 2))

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

function validateRequest(req, res, next) {
  if (!config.validation.endpointsToValidate.includes(req.originalUrl)) {
    return next();
  }

  const schemaPath = `./validations${req.originalUrl.substring(req.originalUrl.indexOf('/', 5), req.originalUrl.length)}`;
  const schema = require(schemaPath);

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    res.status(422);
    next(new Error(`Validation error: ${error.details.map((x) => x.message.replace(/"/g, "'")).join(', ')}`));
  } else {
    req.body = value;
    next();
  }
}

function isProductManager(req, res, next) {
  if (req.userRole === "productManager" || !config.auth.productManagerEndpoints.includes(req.originalUrl)) {
    return next();
  }

  return res.status(401).send({ error: 'Unauthorized!' });
}


function verifyToken(req, res, next) {
  if (config.auth.noAuthEndpoints.includes(req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(403).send({ error: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded.id || !decoded.hash || !decoded.role) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }

    const user = await userBAL.getUserDetailsById(decoded.id, true);

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }

    let lastTime = user.lastLogoutOn;

    if (!user.lastLogoutOn) {
      lastTime = user.createdOn;
    }

    if (decoded.hash !== util.authHashString(lastTime, user.password)) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }

    if (user.role && user.role !== decoded.role) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }

    req.user = user;
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  });
}

module.exports = {
  notFound,
  errorHandler,
  validateRequest,
  verifyToken,
  isProductManager
};
