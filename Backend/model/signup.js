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
  },
  Ispremium:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  },
  totalExpense:{
    type:DataTypes.INTEGER,
    defaultValue:0,
  }
  
}, {
  sequelize,
  modelName:'Signup',
  timestamps: true, 
})

sequelize.sync()  
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });
module.exports = Signup;