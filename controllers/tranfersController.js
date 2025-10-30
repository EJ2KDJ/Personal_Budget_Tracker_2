const { where } = require('sequelize');
const {Transfer, User, Envelope} = require('../sequelize/models');

const createTransfer = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { from_envelope, to_envelope, amount, date } = req.body;
        if (!from_envelope || !to_envelope || amount === undefined || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'from_envelope, to_envelope and numeric amount are required' });
        }

        const fromEnv = await Envelope.findOne({ where: { id: from_envelope, user_id: userId } });
        const toEnv = await Envelope.findOne({ where: { id: to_envelope, user_id: userId } });

        if (!fromEnv || !toEnv) {
            return res.status(404).json({ message: 'One or both envelopes not found' });
        }

        const amt = Number(amount);
        if (fromEnv.budget < amt) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        fromEnv.budget -= amt;
        toEnv.budget += amt;
        await fromEnv.save();
        await toEnv.save();

        const newTransfer = await Transfer.create({
            user_id: userId,
            from_envelope,
            to_envelope,
            amount: amt,
            date: date || new Date()
        });

        return res.status(201).json({ message: 'Budget transfer successful', transfer: newTransfer });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

const getAllTransfersfromUser = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const transfers = await Transfer.findAll({ where: { user_id: userId } });
        return res.status(200).json({ transfers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createTransfer,
    getAllTransfersfromUser
};