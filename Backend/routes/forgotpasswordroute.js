const express = require('express');
const router = express.Router();
const forgotpasswordcontroller = require('../controllers/forgotpasswordcontroller');
const { authenticate } = require('../middleware/auth');

router.post('/forgot_password',  forgotpasswordcontroller.forgotpassword);
router.get('/resetpassword/:id',  forgotpasswordcontroller.forgotpassword_ID);
//router.get('/premium_content', authenticate, premiumcontentcontroller.providing_premium_content);
router.post('/updatepassword/:id',forgotpasswordcontroller.updatepassword)
module.exports = router;