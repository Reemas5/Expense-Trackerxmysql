const { DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    orderid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true, 
        defaultValue:0,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
module.exports = {Order};