const express = require('express');
const router = express.Router();
const downloadcontroller = require('../controllers/downloadcontroller');
const { authenticate } = require('../middleware/auth');

router.get('/download', authenticate, downloadcontroller.download);
router.get('/downloads', authenticate, downloadcontroller.downloads);


module.exports = router;