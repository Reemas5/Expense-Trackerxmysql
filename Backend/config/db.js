const {Sequelize}= require('sequelize')


const sequelize = new Sequelize (process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
host:process.env.DB_HOST,
dialect:'mysql',
})

sequelize.authenticate()
.then(()=>{
    console.log('database is connected')
})
.catch((error)=>{
    console.log("error connecting to database")
})

module.exports = sequelize;