const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authentication, requireAdmin} = require('../middleware');

router.use(authentication);

router.get('/', requireAdmin, userController.getAllUsers); // admin only stays
router.get('/:id', userController.getUserById);             // any logged-in user
router.put('/:id', userController.updateUser);              // new route added
router.delete('/:id', userController.deleteUser);           // any logged-in user

module.exports = router;