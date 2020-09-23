const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class admin extends Model { }

admin.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
}, {
    sequelize,
    modelName: "admin"
})

module.exports = admin;