const sequelize = require('../config/db');
const Expenses = require('../model/expense');
const Signup = require('../model/signup'); 
const {Order} = require('../model/orders')
const Razorpay=require('razorpay')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const {authenticate} = require('../middleware/auth')

exports.buying_premium =async(req,res)=>{
    const unique_id = req.result.id
    try {
  
        const rzp = new Razorpay({
            key_id: process.env.KEY_ID, 
            key_secret: process.env.KEY_SECRET,
        });

        const amount = 1000; 

       
        const order = await rzp.orders.create({ amount, currency: 'INR' });

       
        await Order.create({
            orderid: order.id,
            status: 'PENDING',

            SignupId:unique_id
        });

        
        return res.status(201).json({
            order,
            key_id:rzp.key_id
    });
    } catch (error) {
        //console.error('Error creating order:', error.message);
        return res.status(403).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
}

exports.updatedtransactionstatus = async(req,res)=>{
    const { order_id, paymentId } = req.body;
    //console.log(paymentId)

    try {
        
        const order = await Order.findOne({ where: { orderid: order_id } });
    
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
    
        
        // const paymentDetails = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        //     auth: {
        //         username: process.env.KEY_ID,
        //         password: process.env.KEY_SECRET,
        //     },
        // });
        // if (paymentDetails.data.status === 'captured') 
        if (order){
           
            await Promise.all([
                order.update({
                    paymentId: paymentId,
                    status: 'completed', 
                }),
                req.result.update({ Ispremium: true }) 
            ]);
    
            res.status(200).json({ message: 'Transaction status updated successfully' });
        } else {
           
            await order.update({
                paymentId: paymentId,
                status: 'failed', 
            });
    
            res.status(400).json({
                error: 'Payment failed. Please try again.',
                reason: paymentDetails.data.error_description || 'Unknown error',
            });
        }
    } catch (error) {
      //  console.error('Error updating transaction status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.providing_premium_content = async(req,res)=>{
    try {
        const results = await Signup.findAll({
          order:[['totalExpense','DESC']]
    
        })

        res.status(200).json(results);
    
    } catch (error) {
        res.status(404).json({ message: 'Something went wrong', error });
    }
}