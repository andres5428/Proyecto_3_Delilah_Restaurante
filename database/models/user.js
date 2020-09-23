const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class user extends Model { }

user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    number: DataTypes.STRING,
    address: DataTypes.STRING
}, {
    sequelize,
    modelName: "user"
})

module.exports = user;