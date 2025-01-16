const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expensecontroller');
const { authenticate } = require('../middleware/auth');
//router.get('/expense_auth',authenticate,expenseController.checking_auth)
router.post('/postexpense', authenticate, expenseController.addExpense);
router.get('/getexpense', authenticate, expenseController.getExpenses);
router.delete('/delexpense/:id', authenticate, expenseController.deleteExpense);

module.exports = router;
