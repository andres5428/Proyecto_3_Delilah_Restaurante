const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class order extends Model { }

order.init({
    state: DataTypes.STRING,
    payment: DataTypes.STRING

}, {
    sequelize,
    modelName: "order"
})

module.exports = order;