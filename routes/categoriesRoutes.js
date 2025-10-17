const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const {authentication} = require('../middleware');

router.use(authentication);

router.post('/', categoriesController.createCategory);
router.get('/users/:id', categoriesController.getCategoriesByUserId);
router.delete('/:id', categoriesController.deleteCategory)

module.exports = router;