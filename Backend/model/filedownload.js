const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DownloadList = sequelize.define('filedownload', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
});

sequelize.sync()  
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });

module.exports = {DownloadList};