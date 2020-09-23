const { ValidationError } = require('express-json-validator-middleware');

/**
 * @method errorHandler
 * @description Middleware that manages the errors
 */

const errorHandler = ((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).send('No has ingresado los datos solicitados');
    next();
  } else {
    res.status(`${err.status}`).send(`Error: ${err.message}`);
    next();
  }
});

module.exports = { errorHandler: errorHandler };