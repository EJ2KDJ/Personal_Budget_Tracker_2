const {User, Categories} = require('../sequelize/models');

const getCategoriesByUserId = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const categories = await Categories.findAll({ where: { user_id: userId } });
        return res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const createCategory = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'name and type are required' });
        }

        const newCategory = await Categories.create({
            user_id: userId,
            name,
            type
        });

        return res.status(201).json({ category: newCategory });
    } catch (err) {
        res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const category_id = req.params.id;
        const category = await Categories.findOne({ where: { id: category_id, user_id: userId } });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.destroy();
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message});
        console.error(err);
    }
};

module.exports = {
    getCategoriesByUserId,
    createCategory,
    deleteCategory
};