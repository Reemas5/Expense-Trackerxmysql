const express = require('express')
const router = express.Router();
const sequelize = require('../config/db')
const Signup = require('../model/signup')
const Razorpay=require('razorpay')
const {Order} = require('../model/orders')
const axios = require('axios')
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const {Forgotpassword} = require('../model/forgotpassword')
const Sib = require('sib-api-v3-sdk');
const {DownloadList}= require('../model/filedownload')
//const {getExpenses}  = require('../controllers/expensecontroller')
 
const jwt = require('jsonwebtoken')
const {authenticate} = require('../middleware/auth')


const bcrypt = require('bcrypt'); 
const Expenses = require('../model/expense');
const AWS = require('aws-sdk');
const bucket_name = process.env.BUCKET_NAME;
const aws_access_key = process.env.AWS_ACCESS_KEY;
const aws_access_key_secret = process.env.AWS_ACCESS_KEY_SECRET;


// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         const saltRounds = 10;

    
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

      
//         await Signup.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         res.status(201).json({ message: "User created successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.post('/login', async (req, res) => { 
//     const { email, password } = req.body;

//     try {
       
//         const user = await Signup.findOne({ where: { email } });
//         const premium_user = user.Ispremium
     
        
//         if (!user) {
           
//             return res.status(404).json({ message: "User not found" });
//         }

   
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
          
//             return res.status(400).json({ message: "Either of the fields is incorrect" });
//         }
//         const token = jwt.sign({userId:user.id,Email:user.email},process.env.secret_key);
        
       
//         res.status(201).json({ message: "User logged in successfully" ,token,premium_user});
//     } catch (error) {
      
//         res.status(500).json({ message: error.message });
//     }
// });

// router.post('/expense', authenticate, async (req, res) => {
//     const { expenseAmount, description, category } = req.body;
//     const unique_id = req.result.id;

//     const transaction = await sequelize.transaction(); // Start a transaction

//     try {
//         const totalExpense = Number(req.result.totalExpense) + Number(expenseAmount);
//         console.log(totalExpense);

      
//         const result = await Expenses.create(
//             {
//                 expenseAmount,
//                 description,
//                 category,
//                 SignupId: unique_id,
//             },
//             { transaction }
//         );

//         await Signup.update(
//             { totalExpense },
//             { where: { id: unique_id }},{transaction} 
//         );

//         await transaction.commit(); 
//         res.status(201).json(result);
//     } catch (error) {
//         await transaction.rollback(); 
//         res.status(500).json(error.message);
//     }
// });
// router.get('/expense',authenticate,  async (req, res) => {
//     try {
        
//         const result = await Expenses.findAll( { where: { SignupId: req.result.id } });
//         const user = await Signup.findOne({ where: {id:req.result.id} });
//         console.log("thisssssss",user)
//         const premium_user = user.Ispremium
//         console.log("kkjkijinjnj",premium_user)
//         if (!result || result.length === 0) {
//             return res.status(404).json({ message: "No expenses found for this user." });
//         }

       
//         res.status(200).json({ expenses: result, isPremium: premium_user });
//     } catch (error) {
//         console.error("Error fetching expenses:", error.message);
//         res.status(500).json({ message: "Server error. Please try again later." });
//     }
// });

// router.delete('/expense/:id', authenticate, async (req, res) => {
//     const { id } = req.params;
//     const unique_id = req.result.id;

//     const transaction = await sequelize.transaction(); // Start a transaction

//     try {
//         // Fetch the expense to get its amount before deletion
//         const expense = await Expenses.findOne({ where: { id, SignupId: unique_id } });

//         if (!expense) {
//             await transaction.rollback(); // Rollback the transaction if expense is not found
//             return res.status(404).json({ message: "Expense not found" });
//         }

//         // Delete the expense
//         const deletedRows = await Expenses.destroy({
//             where: { id, SignupId: unique_id },
//             transaction, // Pass the transaction
//         });

//         if (!deletedRows) {
//             await transaction.rollback(); // Rollback the transaction if deletion fails
//             return res.status(404).json({ message: "Expense not found" });
//         }

//         // Update the totalExpense in Signup table
//         const updatedTotalExpense = Number(req.result.totalExpense) - Number(expense.expenseAmount);
//         await Signup.update(
//             { totalExpense: updatedTotalExpense },
//             { where: { id: unique_id }, transaction } // Pass the transaction
//         );

//         await transaction.commit(); // Commit the transaction if everything succeeds
//         res.status(200).json({ message: "Expense deleted successfully" });
//     } catch (error) {
//         await transaction.rollback(); // Rollback the transaction on any error
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get('/premium', authenticate, async (req, res) => {
//     const unique_id = req.result.id
//     try {
  
//         const rzp = new Razorpay({
//             key_id: process.env.KEY_ID, 
//             key_secret: process.env.KEY_SECRET,
//         });

//         const amount = 100; 

       
//         const order = await rzp.orders.create({ amount, currency: 'INR' });

       
//         await Order.create({
//             orderid: order.id,
//             status: 'PENDING',

//             SignupId:unique_id
//         });

//         // Respond with the order and key_id
        
//         return res.status(201).json({
//             order,
//             key_id:rzp.key_id
//     });
//     } catch (error) {
//         console.error('Error creating order:', error.message);
//         return res.status(403).json({
//             message: 'Something went wrong',
//             error: error.message,
//         });
//     }
// });


// router.post('/updatetransactionstatus',authenticate, async (req, res) => {
//     const { order_id, paymentId } = req.body;
//     console.log(paymentId)

//     try {
//         // Find the order by order ID
//         const order = await Order.findOne({ where: { orderid: order_id } });
    
//         if (!order) {
//             return res.status(404).json({ error: 'Order not found' });
//         }
    
//         // Check the payment status from Razorpay
//         const paymentDetails = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
//             auth: {
//                 username: process.env.key_id,
//                 password: process.env.key_secret,
//             },
//         });
    
//         if (paymentDetails.data.status === 'captured') {
//             // Payment was successful
//             await Promise.all([
//                 order.update({
//                     paymentId: paymentId,
//                     status: 'completed', 
//                 }),
//                 req.result.update({ Ispremium: true }) 
//             ]);
    
//             res.status(200).json({ message: 'Transaction status updated successfully' });
//         } else {
           
//             await order.update({
//                 paymentId: paymentId,
//                 status: 'failed', 
//             });
    
//             res.status(400).json({
//                 error: 'Payment failed. Please try again.',
//                 reason: paymentDetails.data.error_description || 'Unknown error',
//             });
//         }
//     } catch (error) {
//         console.error('Error updating transaction status:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// })    

// router.get('/premium_content',authenticate,async(req,res)=>{
   
//     try {
//         const results = await Signup.findAll({
//           order:[['totalExpense','DESC']]
    
//         });
    
//         res.status(200).json(results);
    
//     } catch (error) {
//         res.status(404).json({ message: 'Something went wrong', error });
//     }
    
// })
// router.post('/forgot_password', async (req, res) => {
//     try {
//         const { email } = req.body;
//         console.log(email);

//         const user = await Signup.findOne({ where: { email } });
//         if (user) {
//             const id = uuid.v4();
//             await user.createForgotpassword({ id, active: true })
//                 .catch(err => {
//                     throw new Error(err);
//                 });

           
//             const client = Sib.ApiClient.instance;
//             const apiKey = client.authentications['api-key'];
//             apiKey.apiKey = process.env.Api_key; 

//             const transactionalEmailsApi = new Sib.TransactionalEmailsApi();

//             const sender = {
//                 email: 'sameerkhan570786@gmail.com', 
                 
//             };

//             const receivers = [
//                 {
//                     email: email, 
//                 },
//             ];

//             const response = await transactionalEmailsApi.sendTransacEmail({
//                 sender,
//                 to: receivers,
//                 subject: 'Reset Your Password',
//                 htmlContent: `<a href="http://localhost:3500/resetpassword/${id}">Reset Password</a>`,
//             });

//             console.log('Email sent successfully:', response);
//             return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
//         } else {
//             throw new Error('User does not exist');
//         }
//     } catch (err) {
//         console.error(err);
//         return res.json({ message: err.message, success: false });
//     }
// });
// router.get('/resetpassword/:id',async(req,res)=>{
//     const id = req.params.id;

// try {
//     const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });

//     if (forgotpasswordrequest) {
//         await forgotpasswordrequest.update({ active: false });

//         res.status(200).send(`
//             <html>
//                 <script>
//                     function formsubmitted(e){
//                         e.preventDefault();
//                         console.log('called');
//                     }
//                 </script>
//                 <form action='http://localhost:3500/updatepassword/${id}' method="post">
//                     <label for="newpassword">Enter New password</label>
//                     <input name="newpassword" type="password" required></input>
//                     <button>reset password</button>
//                 </form>
//             </html>
//         `);
//     } else {
//         res.status(404).send({ message: 'Request not found' });
//     }
// } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Something went wrong' });
// }

// })
// router.get('/download',authenticate, async (req, res) => {
//     try {
//       const expenses = await req.result.getExpenses();
      
      
//       const stringifiedExpense = JSON.stringify(expenses);
//       const userId = req.result.id;
//       const fileName = `Expense${userId}/${new Date().toISOString()}.txt`;
  
//       const uploadToS3 = (data, filename) => {
//         const s3bucket = new AWS.S3({
//           accessKeyId: aws_access_key,
//           secretAccessKey: aws_access_key_secret,
         
//         });
  
//         const params = {
//           Bucket: bucket_name,
//           Key: filename,
//           Body: data,
//           ACL: 'public-read',
//         };
  
//         return new Promise((resolve, reject) => {
//           s3bucket.upload(params, (err, res) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(res.Location);
//             }
//           });
//         });
//       };
  
//       const fileURL = await uploadToS3(stringifiedExpense, fileName);
  
//       // Function to create a record in the DownloadList table
//       const createDownloadRecord = async (fileName, fileURL, userId) => {
//         return await DownloadList.create({ fileName, fileURL, SignupId:userId });
//       };
  
//       // Create a record in the DownloadList table
//       await createDownloadRecord(fileName, fileURL,userId);
  
//       res.status(200).json({ fileURL, success: true });
//     } catch (err) {
//       console.error('Error in /expense/download:', err);
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing the request.',
//       });
//     }
//   });
// router.get('/downloads',authenticate,async(req,res)=>{
//     try{
//         const result = await DownloadList.findAll({where:{SignupId:req.result.id}})
//         res.status(201).json(result)
//         console.log(result)
//     } 
//     catch(error){
//         res.status(500).json({message:error.message})
//     }
//   })

// module.exports = router