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

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 


app.use(cors())


app.use(helmet())



app.use('/',userroutes)
app.use('/',expenseroute)
app.use('/',premiumroutes)
app.use('/',forgotpassword)

app.use(express.static(path.join(__dirname, 'Backend', 'public')));


app.get('/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'Backend', 'public', `${filename}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});


Signup.hasMany(Expense);
Expense.belongsTo(Signup);

Signup.hasMany(Order);
Order.belongsTo(Signup)

Signup.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Signup);

Signup.hasMany(DownloadList);
DownloadList.belongsTo(Signup)


app.get('/',async(req,res)=>{
    console.log("server is running");
    
})


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