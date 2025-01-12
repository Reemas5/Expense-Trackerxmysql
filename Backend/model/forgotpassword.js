const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');


const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: DataTypes.BOOLEAN,
    expiresby: DataTypes.DATE
})

module.exports = {Forgotpassword};