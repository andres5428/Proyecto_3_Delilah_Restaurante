const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class product extends Model { }

product.init({
    product: DataTypes.STRING,
    price: DataTypes.STRING,
    url: DataTypes.STRING
}, {
    sequelize,
    modelName: "product"
})

module.exports = product;