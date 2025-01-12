const {DataTypes,Model} = require('sequelize')
const sequelize =require('../config/db')

class Expenses extends Model {}
Expenses.init({
   expenseAmount : {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('fuel','food','shopping','gym'),
    allowNull: false,
  }
  
}, {
  sequelize,
  modelName:'Expenses',
  timestamps: true, 
})
module.exports = Expenses;