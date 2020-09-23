const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class order extends Model { }

order.init({
    product: DataTypes.STRING,
    price: DataTypes.STRING
}, {
    sequelize,
    modelName: "order"
})

module.exports = order;