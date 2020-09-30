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
// const product_car_schema = require('../schemas/product_car_schema');

/**
 * Models
 */
const user = require('../database/models/user');
const order = require('../database/models/order');
const admin = require('../database/models/admin');
const product = require('../database/models/product');
const { model } = require('../database/db');
const order_schema_register = require('../schemas/order_schema_register');

/**
 * Bcrypt init
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * User login - POST
 */
router.post('/delilah/user/post/login', validate({ body: user_schema_login }), check_User, autenticate_User, construct_JWT_User, (req, res) => {
  res.status(200).json({
    status: 200,
    token: req.token
  });
});

/**
 * Admin login - POST
 */
router.post('/delilah/admin/post/login', validate({ body: user_schema_login }), check_Admin, autenticate_Admin, construct_JWT_Admin, (req, res) => {
  res.status(200).json({
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
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Datos Erróneos',
        detail: 'No se encuentran usuarios registrados en la base de datos'
      });
    }
    else {
      res.status(200).json({
        status: 200,
        ok: true,
        data: users
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false

    })
  })
})

/**
 * Get user by ID - Admin
 */
router.get('/delilah/admin/get/:userId', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  user.findByPk(req.params.userId).then((user) => {
    if (user === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Datos Erróneos',
        detail: `No se encuentra el usuario con id ${req.params.userId} registrados en la base de datos`
      });
    }
    else {
      res.status(200).json({
        status: 200,
        ok: true,
        data: user
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Get product by ID - User
 */
router.get('/delilah/user/get/product/:productId', extract_JWT_User, jsonVerify_User, (req, res) => {
  product.findByPk(req.params.productId).then((product) => {
    if (product === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Datos Erróneos',
        detail: `No se encuentra el product con id ${req.params.productId} en la base de datos`
      });
    }
    else {
      res.status(200).json({
        status: 200,
        ok: true,
        data: product
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Get products - GET - User
 */

router.get('/delilah/user/get/products', extract_JWT_User, jsonVerify_User, (req, res) => {
  product.findAll({}).then((products) => {
    if (products === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Datos Erróneos',
        detail: 'No se encuentra ningún producto registrado en la base de datos.'
      });
    }
    else {
      res.status(200).json({
        status: 200,
        ok: true,
        data: products
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Get your user info - GET - User
 */

router.get('/delilah/user/get/info', extract_JWT_User, jsonVerify_User, (req, res) => {
  user.findOne({
    where: { username: `${req.user.username}` },
    attributes: ['id', 'username', 'name', 'lastname',
      'number', 'address']
  }).then((user) => {
    res.json({
      status: 200,
      ok: true,
      data: user
    })
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Get products - GET - Admin
 */

router.get('/delilah/admin/get/products', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  product.findAll({}).then((products) => {
    if (products === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Datos Erróneos',
        detail: 'No se encuentran productos registrados en la base de datos'
      });
    }
    else {
      res.send(products);
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Create a user - POST
 */
router.post('/delilah/user/post/register', validate({ body: user_schema_register }), validate_Email_User, (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, saltRounds)
  user.create({
    username: req.body.username,
    password: hash,
    name: req.body.name,
    lastname: req.body.lastname,
    number: req.body.number,
    address: req.body.address,

  }).then((user) => {
    res.status(200).json({
      status: 200,
      ok: true,
      result: `El usuario ${req.body.username} ha sido creado`
    })
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
});

/**
 * Create admin - POST
 */
router.post('/delilah/admin/post/register', validate({ body: admin_schema_register }), validate_Email_Admin, (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, saltRounds)
  admin.create({
    username: req.body.username,
    password: hash
  }).then(() => {
    res.send({
      status: 200,
      ok: true,
      result: `El administrador ${req.body.username} ha sido creado`
    })
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
});

/**
 * Create product - Only Admin
 */
router.post('/delilah/admin/post/product', validate({ body: product_schema_register }), extract_JWT_Admin, jsonVerify_Admin, validate_Product, (req, res) => {
  product.create({
    product: req.body.product,
    price: req.body.price,
    url: req.body.url
  }).then(() => {
    res.send({
      status: 200,
      ok: true,
      result: `El producto ${req.body.product} ha sido creado`
    })
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
* Modify product - Only Admin
*/
router.put('/delilah/admin/put/product/:productId', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  product.findByPk(req.params.productId).then(productFound => {
    if (productFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El producto con id ${req.params.productId} no existe en la base de datos`
      })
    }
    else {
      productFound.product = req.body.product;
      productFound.price = req.body.price;
      productFound.save().then((productSaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: productSaved
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Delete product - Only Admin
 */

router.delete('/delilah/admin/delete/:productId', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  product.findByPk(req.params.productId).then(productFound => {
    if (productFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El producto con id ${req.params.productId} no existe en la base de datos`
      })
    }
    else {
      productFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          ok: true,
          result: `El producto ${req.body.product} ha sido eliminado de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
      error: error,
      ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    })
  })
})

/**
 * Get users with orders - Admin
 */

router.get('/delilah/admin/get/user-orders', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  user.findAll({
    include: {
      model: order,
      as: "orders",
      attributes: ['state', 'payment', 'userId']
    },
    attributes: ['id', 'username', 'name', 'lastname', 'number', 'address']
  }).then(users => {
    if (users === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `No hay registrado ningún usuario en la base de datos`
      })
    }
    else {
      res.status(200).json({
        status: 200,
        ok: true,
        data: users
      })
    }
  })
})

/**
 * Get orders - Admin
 */

router.get('/delilah/admin/get/orders', extract_JWT_Admin, jsonVerify_Admin, (req, res) => {
  order.findAll({
    include: {
      model: user,
      as: "user",
      attributes: ['username', 'name', 'lastname', 'number', 'address']
    }
  }).then(users => {
    if (users === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `No hay registrado ningún pedido en la base de datos`
      })
    }
    else {
      res.status(200).json({
        status: 200,
        ok: true,
        data: users
      })
    }
  })
})

/**
 * Modify order
 */

router.put('/delilah/admin/put/order/:orderId',/* extract_JWT_Admin, jsonVerify_Admin,*/(req, res) => {
  order.findByPk(req.params.orderId).then((order) => {
    if (order === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'No encontrado',
        detail: `La orden con id ${req.params.orderId} no existe en la base de datos`
      })
    }
    else {
      order.state = req.body.state;
      order.payment = req.body.payment;
      order.save().then((orderSaved) => {
        res.status(200).json({
          details: `Pedido con id ${req.params.orderId} modificado`,
          status: 200,
          ok: true,
          data: orderSaved
        })
      })
    }
  })
})

/**
 * Create order - User
 */

router.post('/delilah/user/post/order', validate({ body: order_schema_register }),
  extract_JWT_User, jsonVerify_User, async (req, res) => {

    try {
      const productsPromises = req.body.product.map((item) => {
        return product.findOne({ where: { product: item } })
      })

      const products = await Promise.all(productsPromises);

      const check = products.filter(element => element === null);
      if (check.length === 0) {
        const newOrder = await order.create({
          state: req.body.state,
          payment: req.body.payment,
          userId: req.body.userId
        })
        newOrder.setProducts(products)
        await newOrder.save().then((order) => {
          res.status(200).json({
            status: 200,
            ok: true,
            details: `La orden ha sido creada`
          })
        })

      }
      else {
        res.status(400).json({
          status: 400,
          ok: false,
          title: 'Datos Erróneos',
          detail: 'Uno o todos los productos que ingresaste no existen en la base de datos'
        })
      }
    } catch (error) {
      res.status(500).json({
        error: `Error de petición`,
        details: `No se ingresaron los productos de una forma válida. Recuerde ingresarlos en un arreglo`
      })
    }
  })

/**
 * Get user order - Only User
 */

router.get('/delilah/user/get/order', extract_JWT_User, jsonVerify_User, (req, res) => {
  user.findOne(
    {
      include: {
        model: order,
        as: 'orders',
        attributes: ['id', 'state', 'payment', 'userId']
      },
      where: { username: `${req.user.username}` },
      attributes: ['id', 'username']
    }).then((user) => {
      res.status(200).json({
        status: 200,
        ok: true,
        data: user
      })
    })
})

module.exports = router;