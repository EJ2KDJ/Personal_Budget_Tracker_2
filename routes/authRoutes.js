const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/login', authController);
router.post('/signup', userController.createUser);

module.exports = router;