const user = require('./models/user');
const product = require('./models/product');
const order = require('./models/order');


user.hasMany(order, { as: "orders", foreignKey: "userId" });
order.belongsTo(user, { as: "user" });
order.belongsToMany(product, { through: "product_ordered" })
product.belongsToMany(order, { through: 'product_ordered' })
