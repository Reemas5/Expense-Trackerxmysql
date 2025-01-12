const express = require('express');
const router = express.Router();
const premiumcontentcontroller = require('../controllers/premiumcontentcontroller');
const { authenticate } = require('../middleware/auth');

router.get('/premium', authenticate, premiumcontentcontroller.buying_premium);
router.post('/updatetransactionstatus', authenticate, premiumcontentcontroller.updatedtransactionstatus);
router.get('/premium_content', authenticate, premiumcontentcontroller.providing_premium_content);

module.exports = router;