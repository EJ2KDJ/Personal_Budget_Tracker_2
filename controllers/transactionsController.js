const {Users, Transaction} = require('../sequelize/models');

const getTransactionByUserId = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        const transactionId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transaction = await Transaction.findOne({ where: { id: transactionId, user_id: userId } });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json({ transaction });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const getAllTransactionsByUserId = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userResults = await Transaction.findAll({where: {user_id: userId} })

        if (!userResults) {
            return res.status(404).json({ error: 'No Transactions for this user'});
        }
        return res.status(200).json({userResults})
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const createTransaction = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { envelope_id, amount, type, date, description } = req.body;
        if (!envelope_id || !amount || !type || !date) {
            return res.status(400).json({ error: 'envelope_id, amount, type, and date are required' });
        }

        const newTransaction = await Transaction.create({
            user_id: userId,
            envelope_id,
            amount,
            type,
            date,
            description
        });
        return res.status(201).json({ transaction: newTransaction });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const user = Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const transaction_id = req.params.id;

        const transaction = await Transaction.findOne({ where: { id: transaction_id, user_id: userId } });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await transaction.destroy();
        return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

module.exports = {
    getTransactionByUserId,
    getAllTransactionsByUserId,
    createTransaction,
    deleteTransaction
};