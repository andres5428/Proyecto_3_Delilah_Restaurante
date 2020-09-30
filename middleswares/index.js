
/**
 * @method validate_Email_User
 * @description checks if the e-mail that want to register is already in the database
 */

const validate_Email_User = ((req, res, next) => {
  const email_Search = user.findOne({ where: { username: `${req.body.username}` } }).then((user) => {
    return user
  });

  email_Search.then((user) => {
    console.log(user)
    if (!user) {
      next();
    }
    else {
      const error = new Error('El usuario ingresado ya está registrado en la base de datos. Por favor intente con uno diferente');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }

  })
});

/**
 * @method validate_Email_Admin
 * @description checks if the e-mail that want to register is already in the database
 */

const validate_Email_Admin = ((req, res, next) => {
  const email_Search = admin.findOne({ where: { username: `${req.body.username}` } }).then((admin) => {
    return admin
  });

  email_Search.then((admin) => {
    console.log(admin)
    if (!admin) {
      next();
    }
    else {
      const error = new Error('El administrador ya está registrado en la base de datos. Por favor intente con uno diferente');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }

  })
});

/**
 * @method check_Admin
 * @description
 */
const check_Admin = ((req, res, next) => {
  const admin_Search = admin.findOne({ where: { username: `${req.body.username}` } }).then((admin) => {
    return admin
  });

  admin_Search.then((admin) => {
    if (!admin) {
      const error = new Error('El usuario no esta registrado en la base de datos. Por favor realice el proceso de registro');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }
    next();
  })

});


/**
 * @method check_User
 * @description Autenticate the username sended from the client
 */
const check_User = ((req, res, next) => {
  const email_Search = user.findOne({ where: { username: `${req.body.username}` } }).then((user) => {
    return user

  })

  email_Search.then((user) => {
    if (!user) {
      const error = new Error('El usuario no esta registrado en la base de datos. Por favor realice el proceso de registro');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }
    next();
  })
});


/**
 * @method autenticate_User
 * @description Autenticate the credentials sended from the client
 */
const autenticate_User = ((req, res, next) => {
  const user_Index = user.findOne({ where: { username: `${req.body.username}` } }).then((user) => {
    return user
  })

  user_Index.then((user) => {
    if (user.dataValues.password !== req.body.password) {
      const error = new Error('La contraseña ingresada no es correcta. Por favor intente de nuevo');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    next();
  })
});

/**
 * Json Web Token Init 
 */
const jwt = require('jsonwebtoken');

/**
 * Import models
 */
const user = require('../database/models/user');
const admin = require('../database/models/admin');
const product = require('../database/models/product');

/**
 * @method construct_JWT_User
 * @description Generate a Jason Web Token from the body request information - User
 */

const construct_JWT_User = ((req, res, next) => {
  const token = jwt.sign(req.body, `${process.env.SECRET_KEY_USER}`, { expiresIn: '60m' });
  req.token = token
  next();
})

/**
 * @method extract_JWT_User
 * @description Take the token that the user bring and separate it from the bearer method - User
 */

const extract_JWT_User = ((req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" "); // divides the strings into a ordered list of substrings and returns them into an array
    const bearerToken = bearer[1]; // Take the second position of the array (Token)
    req.token = bearerToken;
    console.log(bearerToken)
    next();
  }
  else {
    const error = new Error('No has ingresado un Token válido. Recuerda utilizar bearer');
    error.status = 401;
    error.title = `Error en validación`
    next(error);
  }
});

/**
 * @method jsonVerify_User
 * @description Verify the token sended from user
 */

const jsonVerify_User = ((req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY_USER, ((err, data) => {
    if (err) {
      const error = new Error('El token enviado no es válido');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    else {
      delete data.password
      req.user = data // .user atributo nuevo
      next();
    }
  }))
})

/**
 * @method construct_JWT_Admin
 * @description Generate a Jason Web Token from the body request information - User
 */

const construct_JWT_Admin = ((req, res, next) => {
  const token = jwt.sign(req.body, `${process.env.SECRET_KEY_ADMIN}`, { expiresIn: '60m' });
  req.token = token
  next();
})

/**
 * @method extract_JWT_Admin
 * @description Take the token that the user bring and separate it from the bearer method - User
 */

const extract_JWT_Admin = ((req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" "); // divides the strings into a ordered list of substrings and returns them into an array
    const bearerToken = bearer[1]; // Take the second position of the array (Token)
    req.token = bearerToken;
    console.log(bearerToken)
    next();
  }
  else {
    const error = new Error('No has ingresado un Token válido. Recuerda utilizar bearer');
    error.status = 401;
    error.title = `Error en validación`
    next(error);
  }
});

/**
 * @method jsonVerify_Admin
 * @description Verify the token sended from admin
 */

const jsonVerify_Admin = ((req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY_ADMIN, ((err, data) => {
    if (err) {
      const error = new Error('El token enviado no es válido');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    else {
      delete data.password
      next();
    }
  }))
})

/**
 * @method autenticate_Admin
 * @description Autenticate the credentials sended from the client
 */
const autenticate_Admin = ((req, res, next) => {
  const admin_Index = admin.findOne({ where: { username: `${req.body.username}` } }).then((admin) => {
    return admin
  })

  admin_Index.then((admin) => {
    if (admin.dataValues.password !== req.body.password) {
      const error = new Error('La contraseña ingresada no es correcta. Por favor intente de nuevo');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    next();
  })
});

/**
 * @method validate_Product
 * @description Checks the database if the product entered already exists
 */

const validate_Product = ((req, res, next) => {
  const product_Search = product.findOne({ where: { product: `${req.body.product}` } }).then((product) => {
    return product
  });

  product_Search.then((product) => {
    if (!product) {
      next();
    }
    else {
      const error = new Error(`El producto "${req.body.product}" ya estaba registrado en la base de datos. Por favor ingrese uno diferente`);
      error.status = 403
      error.title = `Error en validación`
      next(error);
    }
  })

})

module.exports = {
  validate_Email_User: validate_Email_User, validate_Email_Admin: validate_Email_Admin,
  check_User: check_User, check_Admin: check_Admin, autenticate_User: autenticate_User,
  construct_JWT_User: construct_JWT_User, extract_JWT_User: extract_JWT_User,
  construct_JWT_Admin: construct_JWT_Admin, extract_JWT_Admin: extract_JWT_Admin,
  autenticate_Admin: autenticate_Admin, jsonVerify_User: jsonVerify_User,
  jsonVerify_Admin: jsonVerify_Admin, validate_Product: validate_Product
};

