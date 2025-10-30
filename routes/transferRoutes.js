const express = require('express');
const router = express.Router();
const transfersController = require('../controllers/tranfersController');
const {authentication} = require('../middleware');

router.use(authentication);

router.post('/', transfersController.createTransfer);
router.get('/users/:id', transfersController.getAllTransfersfromUser);

module.exports = router;