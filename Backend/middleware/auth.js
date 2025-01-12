const jwt = require('jsonwebtoken');
const Signup = require('../model/signup');

const router = require('../routes/routers')

const authenticate = async (req, res, next) => {
    try {
    
        const token = req.header('Authorization');
        console.log(token)
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        

        const user =  jwt.verify(token, process.env.secret_key); // Replace 'secret_key' with a secure environment variable
        console.log(user)
        console.log("USER ID:", user.userId);
    
    

    
        const result = await Signup.findByPk(user.userId);
        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }

       console.log(result)
        req.result = result;

    
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = {authenticate};
