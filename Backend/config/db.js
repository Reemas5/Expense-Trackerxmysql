const {Sequelize}= require('sequelize')
const dotenv = require("dotenv")
dotenv.config()

const sequelize = new Sequelize (process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
host:process.env.DB_HOST,
dialect:process.env.DB_DIALECT
})

sequelize.authenticate()
.then(()=>{
    console.log('database is connected')
})
.catch((error)=>{
    console.log("error connecting to database")
})

module.exports = sequelize;