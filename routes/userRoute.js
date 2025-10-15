const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authentication, requireAdmin} = require('../middleware');

router.post('/signup', userController.signup);

router.use(authentication);

router.get('/', requireAdmin, userController.getAllUsers);
router.get('/:id', requireAdmin, userController.getUserById);
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;