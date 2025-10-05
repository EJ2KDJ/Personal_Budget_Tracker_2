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

        return res.status(200).json({ categories: await Categories.findAll({ where: { user_id: userId } }) });
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