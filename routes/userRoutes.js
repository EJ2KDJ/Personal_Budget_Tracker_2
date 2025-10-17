const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authentication, requireAdmin} = require('../middleware');

router.use(authentication);

router.post('/signup', userController.createUser);

router.get('/', requireAdmin, userController.getAllUsers);
router.get('/:id', requireAdmin, userController.getUserById);
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;