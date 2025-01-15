const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const {authenticate} = require('./middleware/auth')
const sequelize = require('./config/db')
const Signup = require('./model/signup')
const Expense =require('./model/expense')
const {Order} = require('./model/orders')
const {Forgotpassword} = require('./model/forgotpassword')
const userroutes = require('./routes/userroute')
const expenseroute = require('./routes/expenseroute')
const {DownloadList} = require('./model/filedownload')
const premiumroutes = require('./routes/premiumcontentroute')
const forgotpassword = require('./routes/forgotpasswordroute')
const helmet = require('helmet')
const bcrypt = require('bcrypt'); 
const Expenses = require("./model/expense");
const { signup } = require("./controllers/usercontroller");

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 


app.use(cors())


app.use(helmet({ntSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://checkout.razorpay.com',
        'https://cdn.jsdelivr.net',
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      formAction: ["'self'", 'http://13.203.1.119:3000'],
      connectSrc: [
        "'self'",
        'https://api.razorpay.com',
        'https://lumberjack.razorpay.com',
        'https://lumberjack-cx.razorpay.com',
      ],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", 'https://api.razorpay.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: false, // Disable HSTS here
  contentSecurityPolicy: false, // if you want to disable CSP entirely
}))



app.use('/',userroutes)
app.use('/',expenseroute)
app.use('/',premiumroutes)
app.use('/',forgotpassword)



app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})




Signup.hasMany(Expense);
Expense.belongsTo(Signup);

Signup.hasMany(Order);
Order.belongsTo(Signup)

Signup.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Signup);

Signup.hasMany(DownloadList);
DownloadList.belongsTo(Signup)


// app.get('/',async(req,res)=>{
//     console.log("server is running");
    
// })


const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const Expenses = require("./model/expense");
const { signup } = require("./controllers/usercontroller");

    
sequelize.sync()
.then(()=>{
    console.log("database synced successfully")
})
.catch((error)=>{

 console.log(error.message);
})



app.listen(process.env.PORT,()=>{
    console.log('server is running')
})