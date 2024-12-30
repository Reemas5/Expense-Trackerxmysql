const {DataTypes,Model} = require('sequelize')
const sequelize =require('../config/db')

class Signup extends Model {}
Signup.init({
    name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
  
}, {
  sequelize,
  modelName:'Signup',
  timestamps: true, 
})
module.exports = Signup;