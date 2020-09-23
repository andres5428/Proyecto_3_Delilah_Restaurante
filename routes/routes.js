/**
 * Init router
 */
const { Router } = require('express');
const router = Router();


/**
 * Init the validator middleware
 */
const { Validator } = require('express-json-validator-middleware');
const validator = new Validator({ allErrors: true });
const validate = validator.validate

/**
 * Import middlewares
 */
const { check_User, check_Admin, autenticate_User, construct_JWT_User,
  extract_JWT_User, jsonVerify_User, construct_JWT_Admin, extract_JWT_Admin,
  jsonVerify_Admin, validate_Email_User, validate_Email_Admin, autenticate_Admin,
  validate_Product } = require('../middleswares/index')

/**
 * Schemas
 */
const user_schema_login = require('../schemas/user_schema_login');
const user_schema_register = require('../schemas/user_schema_register');
const product_schema_register = require('../schemas/product_schema_register');
const admin_schema_register = require('../schemas/admin_schema_register');
const product_car_schema = require('../schemas/product_car_schema');

/**
 * Models
 */
const user = require('../database/models/user');
const order = require('../database/models/order');
const admin = require('../database/models/admin');
const product = require('../database/models/product');
const { model } = require('../database/db');


/**
 * User login - GET
 */
router.get('/delilah/user/get/login', validate({ body: user_schema_login }), check_User, autenticate_User, construct_JWT_User, (req, res) => {
  res.json({
    status: 200,
    token: req.token
  });
});

/**
 * Admin login - GET
 */
router.get('/delilah/admin/get/login', validate({ body: user_schema_login }), check_Admin, autenticate_Admin, construct_JWT_Admin, (req, res) => {
  res.json({
    status: 200,
    token: req.token
  });
});

/**
 * Get users - GET - Only admin
 */

router.get('/delilah/admin/get/users', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  user.findAll({}).then((users) => {
    if (users === null) {
      res.send('No se ha registrado ningun usuario.');
    }
    else {
      res.send(users);
    }
  }).catch((error) => {
    res.send({
      error: error
    })
  })
})

/**
 * Get products - GET - User
 */

router.get('/delilah/user/get/products', extract_JWT_User, jsonVerify_User, (req, res) => {
  product.findAll({}).then((products) => {
    if (products === null) {
      res.send('No se ha registrado ningun usuario.');
    }
    else {
      res.send(products);
    }
  }).catch((error) => {
    res.send({
      error: error
    })
  })
})

/**
 * Get your user info - GET - User
 */

router.get('/delilah/user/get/info', extract_JWT_User, jsonVerify_User, (req, res) => {
  user.findOne({ where: { username: `${req.body.username}` } }).then((user) => {
    if (user === null) {
      res.send('No se ha registrado ningun usuario.');
    }
    else {
      if (user.dataValues.password === req.body.password) {
        res.send(user);
      }
      else {
        res.status(402).end('No tienes acceso a esta información. Revisa el usuario o la contraseña ingresada')
      }

    }
  }).catch((error) => {
    res.send({
      error: error
    })
  })
})

/**
 * Get products - GET - Admin
 */

router.get('/delilah/admin/get/products', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  product.findAll({}).then((products) => {
    if (products === null) {
      res.send('No se ha registrado ningun usuario.');
    }
    else {
      res.send(products);
    }
  }).catch((error) => {
    res.send({
      error: error
    })
  })
})

/**
 * Create a user - POST
 */
router.post('/delilah/user/post/register', validate({ body: user_schema_register }), validate_Email_User, (req, res) => {
  user.create({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    lastname: req.body.lastname,
    number: req.body.number,
    address: req.body.address,

  }).then((user) => {
    // user.dataValue.productCarId = user.id;
    console.log(user)
    res.send({
      result: `El usuario ${req.body.username} ha sido creado`
    })
  }).catch((error) => {
    res.send({
      error: error
    })
  })
});

/**
 * Create admin - POST
 */
router.post('/delilah/admin/post/register', validate({ body: admin_schema_register }), validate_Email_Admin, (req, res) => {
  admin.create({
    username: req.body.username,
    password: req.body.password
  }).then(() => {
    res.send({
      result: `El administrador ${req.body.username} ha sido creado`
    })
  }).catch((error) => {
    res.send({
      error: error
    })
  })
});

/**
 * Create product - Only Admin
 */
router.post('/delilah/admin/post/product', validate({ body: product_schema_register }), extract_JWT_Admin, jsonVerify_Admin, validate_Product, (req, res) => {
  product.create({
    product: req.body.product,
    price: req.body.price
  }).then(() => {
    res.send({
      result: `El producto ${req.body.product} ha sido creado`
    })
  }).catch((error) => {
    res.send({
      error: error
    })
  })
})

/**
* Modify product - Only Admin
*/
router.put('/delilah/admin/put/product', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  product.findOne({ where: { product: `${req.body.product}` } }).then(productFound => {
    if (productFound === null) {
      res.status(401).send(`El producto ${req.body.product} no existe en la base de datos`)
    }
    else {
      productFound.product = req.body.product;
      productFound.price = req.body.price;
      productFound.save().then((productSaved) => {
        res.send(productSaved)
      }).catch((error) => {
        res.send({
          error: error
        })
      })
    }
  }).catch((error) => {
    res.send({ error: error })
  })
})

/**
 * Delete product - Only Admin
 */

router.delete('/delilah/admin/delete/product', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  product.findOne({ where: { product: `${req.body.product}` } }).then(productFound => {
    if (productFound === null) {
      res.send({
        result: `El producto ${req.body.product} no existe en la base de datos`
      })
    }
    else {
      productFound.destroy().then(() => {
        res.send({
          result: `El producto ${req.body.product} ha sido eliminado de la base de datos`
        })
      }).catch((error) => {
        res.send({
          error: error
        })
      })
    }
  }).catch((error) => {
    res.send({ error: error })
  })
})

// /**
//  * Get products in shoppingcar - GET - Only admin
//  */

// router.get('/delilah/admin/get/order', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
//   order.findAll({ where: {} }).then((products) => {
//     if (products === null) {
//       res.send({
//         result: 'No se ha añadido ningún producto al carro de compra.'
//       });
//     }
//     else {
//       res.send(products);
//     }
//   })
// })

// /**
//  * Get products in shoppingcar - GET - only user info
//  */

// router.get('/delilah/user/get/car-product', extract_JWT_User, jsonVerify_User, (req, res) => {
//   order.findAll({ where: { userId: `${req.body.userId}` } }).then((products) => {
//     if (products === null) {
//       res.send({
//         result: 'No se ha añadido ningún producto al carro de compra.'
//       });
//     }
//     else {
//       res.send(products);
//     }
//   })
// })

/**
 * Save product in shoppingcar - POST
 */
router.post('/delilah/user/post/product/order', validate({ body: product_schema_register }),
  extract_JWT_User, jsonVerify_User, (req, res) => {
    order.create({
      product: req.body.product,
      price: req.body.price,
      userId: req.body.userId
    }).then((user) => {
      res.send({
        result: `El producto ${req.body.product} ha sido guardado en el carrito`
      })
    }).catch((error) => {
      res.send({
        error: `Error: ${error}`
      });
    })
  });

/**
 * Delete product in shoppingcar - DELETE
 */

router.delete('/delilah/user/delete/product/order', (req, res) => {
  order.findOne({ where: { product: `${req.body.product}` } }).then(product => {
    if (product === null) {
      res.send({
        result: `El producto ${req.body.product} no está en el carrito`
      })
    }
    else {
      product.destroy().then(() => {
        res.send({
          result: `El producto ${req.body.product} ha sido eliminado del carrito`
        })
      }).catch((error) => {
        res.send({
          error: error
        })
      })
    }
  }).catch((error) => {
    res.send({ error: error })
  })
})

/**
 * Get users with orders - Admin
 */

router.get('/delilah/admin/get/user-orders', (req, res) => {
  user.findAll({
    include: {
      model: order,
      as: "pedidos",
      attributes: ['product', 'price', 'userId']
    },
    attributes: ['id', 'username', 'name', 'lastname', 'number', 'address']
  }).then(users => res.send(users))
})

/**
 * Get orders - Admin
 */

router.get('/delilah/admin/get/orders', (req, res) => {
  order.findAll({
    include: {
      model: user,
      as: "user",
      attributes: ['username']
    }
  }).then(users => res.send(users))
})

/**
 * Create order - User
 */

router.post('/delilah/user/post/order',  /*async*/(req, res) => {

  const productsIdPromises = req.body.product.map((item) => {
    product.findOne({ where: { product: item } })
      .then((foundItem) => {
        if (!foundItem) {
          res.send(`El producto ${item} no existe en la base de datos`)
          return
        }
        console.log(foundItem.id)
        return foundItem.id
      })
  })

  // productsIdPromises.then((values) => {
  //   console.log(values)
  // })
})
// /*await*/ Promise.all(productsIdPromises).then((values)=>{
//   console.log(values)


// cumple todas las promesas
// res.send(productsId)
// const order1 = order.create({
//   userId: req.body.userId
// }).then((order) => {
//   order.addProducts([product_Find])
// })

// async function hola() {
//   let order1 = await order.create({
//     userId: req.body.userId
//   })

//   order1.addProduct([product_Find]);
// }
// hola()


module.exports = router;