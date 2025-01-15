const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expensecontroller');
const { authenticate } = require('../middleware/auth');
router.get('/expense_auth',authenticate,expenseController.checking_auth)
router.post('/expense', authenticate, expenseController.addExpense);
router.get('/expense', authenticate, expenseController.getExpenses);
router.delete('/expense/:id', authenticate, expenseController.deleteExpense);

module.exports = router;
