const sequelize = require('../database/db');
const admin = require('../database/models/admin');
const order = require('../database/models/order');
const product = require('../database/models/product');
const user = require('../database/models/user');
require('../database/associations');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Products
const products = [
    { product: "Bagel de salmón", price: 425, url: 'resources/product_images/bagel_salmon' },
    { product: "Hamburguesa clásica", price: 350, url: 'resources/product_images/hamburguesa_clasica' },
    { product: "Sandwich veggie", price: 310, url: 'resources/product_images/sandwich_veggie' },
    { product: "Ensalada veggie", price: 340, url: 'resources/product_images/ensalada_veggie' },
    { product: "Focaccia", price: 300, url: 'resources/product_images/foccacia' },
    { product: "Sandwich Focaccia", price: 350, url: 'resources/product_images/sandwich_foccacia' }
]
const hash_Admin_Test = bcrypt.hashSync('admin123', saltRounds)

const admins = [
    { username: "admin@acamica.com", password: hash_Admin_Test }
]

const hash_User_Test = bcrypt.hashSync('user123', saltRounds)
const users = [
    { username: "user@acamica.com", password: hash_User_Test, name: "userName", lastname: "userLastname", number: "321321321", address: "Street 20" }
]

sequelize.sync({ force: false}).then(() => {
    console.log("Conexión establecida con la base de datos")
}).then(() => {
    products.forEach(prod => product.create(prod))
}).then(() => {
    admins.forEach(admins => admin.create(admins))
}).then(() => {
    users.forEach(users => user.create(users))
})