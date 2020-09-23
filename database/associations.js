const user = require('./models/user');
const product = require('./models/product');
const order = require('./models/order');

// user.hasOne(productCar);
// productCar.belongsTo(user);
// request.hasOne(user);
// order.belongsTo(user);
user.hasMany(order, { as: "pedidos", foreignKey: "userId" });
order.belongsTo(user, { as: "user" });
// request.belongsTo(product);
// user.belongsTo(request);
order.belongsToMany(product, { through: "product_ordered" })
product.belongsToMany(order, { through: 'product_ordered' })
// request.hasMany(product);
// añade foreign key a productCarId a la tabla product
// productCar.hasMany(product);