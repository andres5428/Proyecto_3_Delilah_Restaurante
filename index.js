/**
 * Init dependencies
 */
require('dotenv').config();

/**
 * Server configuration
 */

const express = require('express');
const server = express();
const port = process.env.PORT;

// Server init
server.listen(port, () => {
  console.log(`El servidor está funcionando a través del puerto ${port}`);

  sequelize.sync({ force:false }).then(() => { // force: false = no drop table
    console.log("Conexión establecida con la base de datos")
  }).catch((error) => {
    console.log("Se ha producido un error", error);
  })
});

/**
 * Relations
 */
require('./database/associations');

/**
 * Helmet init - Security
 */
const helmet = require("helmet");


/**
 * ErrorHandler
 */
const { errorHandler } = require('./middleswares/errorhandler');

/**
 * Routing
 */
const routes = require('./routes/routes');

/**
 * Global middlewares
 */

server.use(express.json());
server.use(routes);
server.use(helmet());
server.use(errorHandler);

// Sequelize Init
const sequelize = require('./database/db');