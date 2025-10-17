const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionsController');
const {authentication} = require('../middleware');

router.use(authentication);

router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getAllTransactionsByUserId);
router.get('/:id', transactionController.getTransactionByUserId);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;